import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { ReviewModel, ProjectModel } from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";

export const createReviewSchema = z.object({
  projectId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function createReview(
  investorId: string,
  body: z.infer<typeof createReviewSchema>
) {
  const project = await ProjectModel.findByPk(body.projectId);
  if (!project) throw AppError.notFound("Project not found");

  const existing = await ReviewModel.findOne({
    where: { investorId, projectId: body.projectId },
  });
  if (existing) throw AppError.conflict("You have already reviewed this project");

  const review = await ReviewModel.create({
    id: uuidv4(),
    investorId,
    companyId: project.ownerId,
    projectId: body.projectId,
    rating: body.rating,
    comment: body.comment ?? null,
    status: "published",
  });

  return {
    id: review.id,
    investorId: review.investorId,
    companyId: review.companyId,
    projectId: review.projectId,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt.toISOString(),
  };
}

export async function listProjectReviews(projectId: string) {
  const rows = await ReviewModel.findAll({
    where: { projectId, status: "published" },
    order: [["createdAt", "DESC"]],
  });
  return rows.map((r) => ({
    id: r.id,
    investorId: r.investorId,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  }));
}
