import { v4 as uuidv4 } from "uuid";
import { Transaction } from "sequelize";
import {
  OfferModel,
  ProjectModel,
  UserModel,
  InvestmentModel,
} from "../../shared/database/associations";
import { sequelize } from "../../shared/database/sequelize";
import { AppError } from "../../shared/errors/AppError";
import { toOffer, toProject } from "../../shared/utils/mappers";
import { paginate } from "../../shared/utils/paginate";
import { canSendOffers } from "../../shared/utils/rbac";
import { logActivity } from "../../shared/utils/activity";
import { dispatchNotificationEvent } from "../notifications/service";
import type { TokenPayload } from "../../shared/utils/jwt";
import type { InvestmentOffer } from "../../shared/types";

function authUserObj(auth: TokenPayload) {
  return {
    role: auth.role,
    membershipTier: auth.membershipTier,
    membershipExpiresAt: auth.membershipExpiresAt,
  };
}

export async function createOffer(
  auth: TokenPayload,
  body: {
    projectId: string;
    amount: number;
    conditions?: string;
    questions?: string;
    notes?: string;
  }
) {
  if (!canSendOffers(authUserObj(auth))) {
    throw AppError.forbidden("Platform service access required to send offers");
  }
  const projectRow = await ProjectModel.findByPk(body.projectId);
  if (!projectRow || projectRow.status !== "published") {
    throw AppError.notFound("Project not available");
  }
  if (body.amount < projectRow.minInvestment) {
    throw AppError.badRequest(`Minimum investment is ${projectRow.minInvestment}`);
  }
  const investor = await UserModel.findByPk(auth.sub);
  if (!investor) throw AppError.notFound("User not found");

  const offer = await OfferModel.create({
    id: uuidv4(),
    projectId: projectRow.id,
    projectTitle: projectRow.title,
    investorId: auth.sub,
    investorName: `${investor.firstName} ${investor.lastName}`,
    ownerId: projectRow.ownerId,
    amount: body.amount,
    conditions: body.conditions || "",
    questions: body.questions || "",
    notes: body.notes || "",
    status: "pending",
    ownerResponse: null,
  });

  const dto = toOffer(offer);
  await logActivity(auth.sub, "offer_created", "offer", offer.id);
  await dispatchNotificationEvent({ kind: "offer_created", offer: dto });
  return dto;
}

export async function listOffers(
  auth: TokenPayload,
  opts: { status?: string; page?: number; limit?: number }
) {
  const where: Record<string, unknown> = {};
  if (auth.role === "investor") where.investorId = auth.sub;
  else if (auth.role === "project_owner") where.ownerId = auth.sub;
  if (opts.status) where.status = opts.status;

  const rows = await OfferModel.findAll({ where, order: [["createdAt", "DESC"]] });
  return paginate(rows.map(toOffer), opts.page || 1, opts.limit || 20);
}

export async function patchOffer(
  auth: TokenPayload,
  offerId: string,
  body: { status: InvestmentOffer["status"]; ownerResponse?: string }
) {
  if (!["accepted", "rejected", "negotiating"].includes(body.status)) {
    throw AppError.badRequest("Invalid status");
  }

  let fundedProject: ReturnType<typeof toProject> | undefined;

  const dto = await sequelize.transaction(async (t: Transaction) => {
    const offer = await OfferModel.findByPk(offerId, { transaction: t });
    if (!offer) throw AppError.notFound("Offer not found");
    if (auth.role === "project_owner" && offer.ownerId !== auth.sub) {
      throw AppError.forbidden();
    }

    offer.status = body.status;
    if (body.ownerResponse !== undefined) offer.ownerResponse = body.ownerResponse;
    await offer.save({ transaction: t });

    if (body.status === "accepted") {
      await InvestmentModel.create(
        {
          id: uuidv4(),
          offerId: offer.id,
          projectId: offer.projectId,
          investorId: offer.investorId,
          amount: offer.amount,
          status: "payment_pending",
          expectedReturn: Math.round(offer.amount * 1.15 * 100) / 100,
          platformFee: 0,
          totalAmount: null,
          investmentTerm: null,
          agreementId: null,
          fundedAt: null,
          completedAt: null,
        },
        { transaction: t }
      );

      const project = await ProjectModel.findByPk(offer.projectId, { transaction: t });
      if (project) {
        project.currentFunding += offer.amount;
        project.investorCount += 1;
        if (
          project.currentFunding >= project.requiredInvestment &&
          project.status === "published"
        ) {
          project.status = "funded";
          fundedProject = toProject(project);
        }
        await project.save({ transaction: t });
      }
    }

    return toOffer(offer);
  });

  // Outside the transaction to avoid SQLITE_BUSY / nested connection locks
  await logActivity(auth.sub, `offer_${body.status}`, "offer", offerId);
  await dispatchNotificationEvent({ kind: "offer_updated", offer: dto });
  if (fundedProject) {
    await dispatchNotificationEvent({
      kind: "project_status_changed",
      project: fundedProject,
      status: "funded",
    });
  }
  return dto;
}
