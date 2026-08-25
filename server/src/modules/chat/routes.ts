import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import * as chat from "./service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, await chat.listConversations(auth));
  })
);

router.post(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor", "project_owner"]);
    const conversation = await chat.createConversation(auth, req.body);
    return ok(res, conversation, undefined, 201);
  })
);

router.get(
  "/:id/messages",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, await chat.listMessages(auth, param(req, "id")));
  })
);

router.post(
  "/:id/messages",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const result = await chat.sendMessage(auth, param(req, "id"), req.body);
    return ok(res, result.message, result.notice, 201);
  })
);

export default router;
