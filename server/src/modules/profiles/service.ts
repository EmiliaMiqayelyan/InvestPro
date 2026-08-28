import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  InvestorProfileModel,
  CompanyProfileModel,
  DocumentModel,
  UserModel,
} from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { writeAuditLog } from "../../shared/utils/audit";
import type { AuthedRequest } from "../../app/middleware";

export const investorProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  country: z.string().optional(),
  dateOfBirth: z.string().optional(),
  investmentExperience: z.enum(["none", "beginner", "intermediate", "advanced"]).optional(),
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
});

export const companyProfileSchema = z.object({
  companyName: z.string().min(1),
  registrationNumber: z.string().optional(),
  country: z.string().optional(),
  legalAddress: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

export const documentSchema = z.object({
  documentType: z.string().min(1),
  fileUrl: z.string().url(),
});

export async function getProfile(userId: string) {
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");

  const investorProfile = await InvestorProfileModel.findOne({ where: { userId } });
  const companyProfile = await CompanyProfileModel.findOne({ where: { userId } });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      kycStatus: user.kycStatus,
      isEmailVerified: user.isEmailVerified,
      companyName: user.companyName,
      bio: user.bio,
      phone: user.phone,
    },
    investorProfile: investorProfile
      ? {
          id: investorProfile.id,
          firstName: investorProfile.firstName,
          lastName: investorProfile.lastName,
          country: investorProfile.country,
          dateOfBirth: investorProfile.dateOfBirth,
          investmentExperience: investorProfile.investmentExperience,
          riskLevel: investorProfile.riskLevel,
          verificationStatus: investorProfile.verificationStatus,
        }
      : null,
    companyProfile: companyProfile
      ? {
          id: companyProfile.id,
          companyName: companyProfile.companyName,
          registrationNumber: companyProfile.registrationNumber,
          country: companyProfile.country,
          legalAddress: companyProfile.legalAddress,
          website: companyProfile.website,
          description: companyProfile.description,
          verificationStatus: companyProfile.verificationStatus,
        }
      : null,
  };
}

export async function updateProfile(
  userId: string,
  role: string,
  body: Record<string, unknown>,
  req?: AuthedRequest
) {
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");

  if (role === "investor") {
    const parsed = investorProfileSchema.parse(body);
    let profile = await InvestorProfileModel.findOne({ where: { userId } });
    if (!profile) {
      profile = await InvestorProfileModel.create({
        id: uuidv4(),
        userId,
        firstName: parsed.firstName ?? user.firstName,
        lastName: parsed.lastName ?? user.lastName,
        country: parsed.country ?? null,
        dateOfBirth: parsed.dateOfBirth ?? null,
        investmentExperience: parsed.investmentExperience ?? null,
        riskLevel: parsed.riskLevel ?? null,
        verificationStatus: "pending",
      });
    } else {
      Object.assign(profile, {
        firstName: parsed.firstName ?? profile.firstName,
        lastName: parsed.lastName ?? profile.lastName,
        country: parsed.country ?? profile.country,
        dateOfBirth: parsed.dateOfBirth ?? profile.dateOfBirth,
        investmentExperience: parsed.investmentExperience ?? profile.investmentExperience,
        riskLevel: parsed.riskLevel ?? profile.riskLevel,
      });
      await profile.save();
    }
  } else if (role === "project_owner") {
    const parsed = companyProfileSchema.parse(body);
    let profile = await CompanyProfileModel.findOne({ where: { userId } });
    if (!profile) {
      profile = await CompanyProfileModel.create({
        id: uuidv4(),
        userId,
        companyName: parsed.companyName,
        registrationNumber: parsed.registrationNumber ?? null,
        country: parsed.country ?? null,
        legalAddress: parsed.legalAddress ?? null,
        website: parsed.website || null,
        description: parsed.description ?? null,
        verificationStatus: "pending",
      });
    } else {
      Object.assign(profile, parsed);
      await profile.save();
    }
    if (parsed.companyName) {
      user.companyName = parsed.companyName;
      await user.save();
    }
  }

  if (user.status === "registered" || user.status === "email_verified") {
    user.status = "profile_created";
    await user.save();
  }

  await writeAuditLog({
    actorId: userId,
    action: "profile_updated",
    entityType: "profile",
    entityId: userId,
    req,
  });

  return getProfile(userId);
}

export async function uploadDocument(
  userId: string,
  body: z.infer<typeof documentSchema>,
  req?: AuthedRequest
) {
  const doc = await DocumentModel.create({
    id: uuidv4(),
    ownerType: "user",
    ownerId: userId,
    documentType: body.documentType,
    fileUrl: body.fileUrl,
    status: "pending",
    verifiedBy: null,
    verifiedAt: null,
  });

  await writeAuditLog({
    actorId: userId,
    action: "document_uploaded",
    entityType: "document",
    entityId: doc.id,
    req,
  });

  return {
    id: doc.id,
    documentType: doc.documentType,
    fileUrl: doc.fileUrl,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function listDocuments(userId: string) {
  const rows = await DocumentModel.findAll({
    where: { ownerType: "user", ownerId: userId },
    order: [["createdAt", "DESC"]],
  });
  return rows.map((d) => ({
    id: d.id,
    documentType: d.documentType,
    fileUrl: d.fileUrl,
    status: d.status,
    verifiedAt: d.verifiedAt?.toISOString(),
    createdAt: d.createdAt.toISOString(),
  }));
}
