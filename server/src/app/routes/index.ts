import { Router } from "express";
import authRoutes from "../../modules/auth/routes";
import membershipRoutes from "../../modules/membership/routes";
import projectsRoutes from "../../modules/projects/routes";
import offersRoutes from "../../modules/offers/routes";
import investorRoutes from "../../modules/investor/routes";
import ownerRoutes from "../../modules/owner/routes";
import chatRoutes from "../../modules/chat/routes";
import usersRoutes from "../../modules/users/routes";
import notificationsRoutes from "../../modules/notifications/routes";
import kycRoutes from "../../modules/kyc/routes";
import adminRoutes from "../../modules/admin/routes";
import milestonesRoutes from "../../modules/milestones/routes";
import uploadsRoutes from "../../modules/uploads/routes";
import contactRoutes from "../../modules/contact/routes";

export function createApiRouter(): Router {
  const api = Router();

  api.use("/auth", authRoutes);
  api.use("/membership", membershipRoutes);
  api.use("/projects", projectsRoutes);
  api.use("/offers", offersRoutes);
  api.use("/investor", investorRoutes);
  api.use("/owner", ownerRoutes);
  api.use("/conversations", chatRoutes);
  api.use("/users", usersRoutes);
  api.use("/notifications", notificationsRoutes);
  api.use("/kyc", kycRoutes);
  api.use("/admin", adminRoutes);
  api.use("/milestones", milestonesRoutes);
  api.use("/uploads", uploadsRoutes);
  api.use("/contact", contactRoutes);

  api.use((_req, res) => {
    res.status(404).json({ success: false, message: "Endpoint not found" });
  });

  return api;
}
