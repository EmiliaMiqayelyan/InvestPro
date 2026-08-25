import { Router } from "express";
import { asyncHandler, ok, fail } from "../../app/middleware";
import { dispatchNotificationEvent } from "../notifications/service";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    if (!body.email || !body.message) {
      return fail(res, "Email and message required", 400);
    }
    await dispatchNotificationEvent({
      kind: "contact_form",
      name: body.name || "Visitor",
      email: body.email,
    });
    return ok(res, null, "Message received. Our team will respond shortly.");
  })
);

export default router;
