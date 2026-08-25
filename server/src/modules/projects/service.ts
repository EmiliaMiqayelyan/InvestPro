import { Op } from "sequelize";
import {
  ProjectModel,
  SavedProjectModel,
} from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toProject, publicProjectCard } from "../../shared/utils/mappers";
import { paginate } from "../../shared/utils/paginate";
import { analyzeProjectRisk } from "../../shared/utils/risk-analysis";
import { canAccessFullProject, hasActiveServiceAccess } from "../../shared/utils/rbac";
import type { Project } from "./types";
import type { TokenPayload } from "../../shared/utils/jwt";

export type ListProjectsQuery = {
  search?: string;
  category?: string;
  industry?: string;
  location?: string;
  stage?: string;
  minInvestment?: number;
  fundingStatus?: string;
  riskLevel?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

function authUserObj(auth: TokenPayload | null) {
  if (!auth) return null;
  return {
    role: auth.role,
    membershipTier: auth.membershipTier,
    membershipExpiresAt: auth.membershipExpiresAt,
  };
}

export function gatedProject(project: Project, auth: TokenPayload | null) {
  const userObj = authUserObj(auth);
  if (canAccessFullProject(userObj)) return project;
  if (auth?.role === "project_owner" && auth.sub === project.ownerId) return project;

  const teaserPhases = (project.phases || []).map((ph) => ({
    id: ph.id,
    title: ph.title,
    titleHy: ph.titleHy,
    description: "",
    descriptionHy: undefined,
    budgetAsk: 0,
    durationWeeks: undefined,
    deliverables: [] as string[],
    sortOrder: ph.sortOrder,
    status: ph.status,
  }));

  return {
    ...project,
    limited: true as const,
    documents: [],
    team: [],
    teamCount: project.team?.length ?? 0,
    financialProjections: project.financialProjections
      ? `${project.financialProjections.slice(0, 80)}…`
      : "",
    financialProjectionsHy: project.financialProjectionsHy
      ? `${project.financialProjectionsHy.slice(0, 80)}…`
      : undefined,
    investmentPlan: project.investmentPlan
      ? `${project.investmentPlan.slice(0, 80)}…`
      : "",
    investmentPlanHy: project.investmentPlanHy
      ? `${project.investmentPlanHy.slice(0, 80)}…`
      : undefined,
    fullDescription:
      project.fullDescription.slice(0, 200) +
      (project.fullDescription.length > 200 ? "…" : ""),
    fullDescriptionHy: project.fullDescriptionHy
      ? project.fullDescriptionHy.slice(0, 200) +
        (project.fullDescriptionHy.length > 200 ? "…" : "")
      : undefined,
    budgetBreakdown: undefined,
    phases: teaserPhases,
    updates: [],
  };
}

export async function listPublicProjects(query: ListProjectsQuery) {
  let projects = (
    await ProjectModel.findAll({
      where: { status: { [Op.in]: ["published", "funded"] } },
    })
  ).map(toProject);

  const search = query.search?.toLowerCase();
  if (search) {
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }
  if (query.category) projects = projects.filter((p) => p.category === query.category);
  if (query.industry) projects = projects.filter((p) => p.industry === query.industry);
  if (query.stage) projects = projects.filter((p) => p.stage === query.stage);
  if (query.location) {
    const loc = query.location.toLowerCase();
    projects = projects.filter((p) => p.location.toLowerCase().includes(loc));
  }
  if (typeof query.minInvestment === "number" && !Number.isNaN(query.minInvestment)) {
    projects = projects.filter((p) => p.minInvestment <= query.minInvestment!);
  }
  if (query.riskLevel) projects = projects.filter((p) => p.riskLevel === query.riskLevel);
  if (query.fundingStatus === "open") {
    projects = projects.filter((p) => p.status === "published");
  }
  if (query.fundingStatus === "funded") {
    projects = projects.filter((p) => p.status === "funded");
  }

  const sortBy = query.sortBy || "newest";
  const sortOrder = query.sortOrder || "desc";
  projects = projects.sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "most_viewed") return dir * ((b.views || 0) - (a.views || 0));
    if (sortBy === "funding_progress") {
      const ap = a.currentFunding / Math.max(a.requiredInvestment, 1);
      const bp = b.currentFunding / Math.max(b.requiredInvestment, 1);
      return dir * (bp - ap);
    }
    const recency = (p: Project) =>
      new Date(p.approvedAt || p.updatedAt || p.submittedAt || p.createdAt).getTime();
    return dir * (recency(b) - recency(a));
  });

  return paginate(
    projects.map(publicProjectCard),
    query.page || 1,
    query.limit || 12
  );
}

export async function getProject(id: string, auth: TokenPayload | null) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  const project = toProject(row);
  if (
    project.status !== "published" &&
    project.status !== "funded" &&
    auth?.sub !== project.ownerId &&
    auth?.role !== "admin"
  ) {
    throw AppError.notFound("Project not available");
  }
  return gatedProject(project, auth);
}

export async function getRiskAnalysis(id: string, auth: TokenPayload) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  const project = toProject(row);
  const analysis = analyzeProjectRisk(project);
  if (auth.role !== "admin" && !hasActiveServiceAccess(authUserObj(auth))) {
    return {
      projectId: analysis.projectId,
      score: analysis.score,
      level: analysis.level,
      completeness: 0,
      positiveIndicators: [],
      warningIndicators: [],
      missingDocuments: [],
      questionsToAsk: [],
      summary: "Subscribe to the platform service to unlock the full risk report.",
      summaryHy: "Բաժանորդագրվեք հարթակի ծառայությանը՝ լրիվ ռիսկի զեկույցը բացելու համար։",
      generatedAt: analysis.generatedAt,
      limited: true,
    };
  }
  return analysis;
}

export async function saveProject(userId: string, projectId: string) {
  const project = await ProjectModel.findByPk(projectId);
  if (!project) throw AppError.notFound("Project not found");
  const existing = await SavedProjectModel.findOne({ where: { userId, projectId } });
  if (!existing) {
    await SavedProjectModel.create({
      userId,
      projectId,
      savedAt: new Date(),
    });
  }
  return { saved: true };
}

export async function unsaveProject(userId: string, projectId: string) {
  await SavedProjectModel.destroy({ where: { userId, projectId } });
  return { saved: false };
}
