import { Router } from "express";
import { asyncHandler, ok, requireAuth, type AuthedRequest } from "../../app/middleware";
import { UserModel } from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toUser } from "../../shared/utils/mappers";

const router = Router();

router.get(
  "/profile",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const user = await UserModel.findByPk(auth.sub);
    if (!user) throw AppError.notFound("User not found");
    return ok(res, toUser(user));
  })
);

router.patch(
  "/profile",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const user = await UserModel.findByPk(auth.sub);
    if (!user) throw AppError.notFound("User not found");
    const body = req.body || {};
    if (body.firstName !== undefined) user.firstName = body.firstName;
    if (body.lastName !== undefined) user.lastName = body.lastName;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.bio !== undefined) user.bio = body.bio;
    if (body.companyName !== undefined) user.companyName = body.companyName;
    await user.save();
    return ok(res, toUser(user));
  })
);

router.post("/avatar", (_req, res) =>
  ok(res, { avatar: "#avatar-stub" }, "Avatar upload not fully implemented yet")
);

router.patch("/security-settings", (_req, res) =>
  ok(res, null, "Security settings updated (stub)")
);

export default router;
