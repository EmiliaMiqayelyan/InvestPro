import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler, ok, requireAuth, type AuthedRequest } from "../../app/middleware";
import { storeUploadedFile } from "../../shared/integrations/storage";
import { UploadedFileModel } from "../../shared/database/associations";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const body = req.body || {};
    const name = body.name || `upload-${Date.now()}.bin`;
    const size = typeof body.size === "number" ? body.size : 0;
    const stored = await storeUploadedFile({
      name,
      size,
      category: body.category,
      userId: auth.sub,
    });
    await UploadedFileModel.create({
      id: uuidv4(),
      userId: auth.sub,
      name: stored.name,
      url: stored.url,
      size: stored.size,
      category: body.category ?? null,
    });
    return ok(res, stored, "Upload accepted", 201);
  })
);

export default router;
