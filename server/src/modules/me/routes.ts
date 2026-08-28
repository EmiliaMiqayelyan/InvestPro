import { Router } from "express";
import { z } from "zod";
import {
  asyncHandler,
  ok,
  requireAuth,
  validateBody,
  type AuthedRequest,
} from "../../app/middleware";
import { UserModel } from "../../shared/database/associations";
import { toUser } from "../../shared/utils/mappers";
import { payloadToUser } from "../../shared/utils/jwt";
import * as profileService from "../profiles/service";
import { investorProfileSchema, companyProfileSchema, documentSchema } from "../profiles/service";
import { listOffers } from "../offers/service";
import * as investmentService from "../investments/service";
import * as returnsService from "../returns/service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const stored = await UserModel.findByPk(auth.sub);
    if (stored) return ok(res, toUser(stored));
    return ok(res, payloadToUser(auth));
  })
);

router.patch(
  "/",
  validateBody(
    z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      bio: z.string().optional(),
      companyName: z.string().optional(),
    })
  ),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const user = await UserModel.findByPk(auth.sub);
    if (!user) throw new Error("User not found");
    Object.assign(user, req.body);
    await user.save();
    return ok(res, toUser(user));
  })
);

router.get(
  "/profile",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const profile = await profileService.getProfile(auth.sub);
    return ok(res, profile);
  })
);

router.patch(
  "/profile",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const profile = await profileService.updateProfile(auth.sub, auth.role, req.body, req);
    return ok(res, profile);
  })
);

router.post(
  "/documents",
  validateBody(documentSchema),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const doc = await profileService.uploadDocument(auth.sub, req.body, req);
    return ok(res, doc, "Document uploaded", 201);
  })
);

router.get(
  "/offers",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const offers = await listOffers(auth, { status, page, limit });
    return ok(res, offers);
  })
);

router.get(
  "/investments",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const investments = await investmentService.listMyInvestments(auth.sub);
    return ok(res, investments);
  })
);

router.get(
  "/returns",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const returns = await returnsService.listMyReturns(auth.sub);
    return ok(res, returns);
  })
);

router.get(
  "/portfolio",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const portfolio = await returnsService.getPortfolio(auth.sub);
    return ok(res, portfolio);
  })
);

export default router;
