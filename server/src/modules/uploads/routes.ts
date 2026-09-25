import fs from "fs";
import path from "path";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  asyncHandler,
  ok,
  param,
  requireAuth,
  type AuthedRequest,
} from "../../app/middleware";
import { AppError } from "../../shared/errors/AppError";
import {
  resolveStoredFile,
  storeUploadedFile,
} from "../../shared/integrations/storage";
import { UploadedFileModel } from "../../shared/database/associations";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const body = req.body || {};
    const name = String(body.name || `upload-${Date.now()}.bin`);
    const size = typeof body.size === "number" ? body.size : 0;
    const contentBase64 = typeof body.contentBase64 === "string" ? body.contentBase64 : undefined;
    const mimeType = typeof body.mimeType === "string" ? body.mimeType : undefined;

    if (!contentBase64) {
      throw AppError.badRequest("File content is required");
    }
    // ~15MB decoded
    if (contentBase64.length > 20_000_000) {
      throw AppError.badRequest("File is too large (max ~15MB)");
    }

    const id = uuidv4();
    const stored = await storeUploadedFile({
      id,
      name,
      size,
      category: body.category,
      userId: auth.sub,
      contentBase64,
      mimeType,
    });

    await UploadedFileModel.create({
      id,
      userId: auth.sub,
      name: stored.name,
      url: stored.url,
      size: stored.size,
      category: body.category ?? null,
    });

    return ok(res, stored, "Upload accepted", 201);
  })
);

router.get(
  "/:id/file",
  asyncHandler(async (req: AuthedRequest, res) => {
    // Cookie or bearer auth via middleware; allow same-origin opens/downloads
    if (!req.auth) throw AppError.unauthorized();

    const id = param(req, "id");
    const row = await UploadedFileModel.findByPk(id);
    if (!row) throw AppError.notFound("File not found");

    const uploadRoot = path.resolve(process.cwd(), "uploads");
    const files = fs.existsSync(uploadRoot) ? fs.readdirSync(uploadRoot) : [];
    const filename = files.find((f) => f === id || f.startsWith(`${id}.`));
    if (!filename) throw AppError.notFound("File content not found");

    const resolved = resolveStoredFile(filename);
    if (!resolved) throw AppError.notFound("File content not found");

    const download = String(req.query.download || "") === "1";
    res.setHeader("Content-Type", resolved.mimeType);
    res.setHeader(
      "Content-Disposition",
      `${download ? "attachment" : "inline"}; filename="${encodeURIComponent(row.name)}"`
    );
    fs.createReadStream(resolved.absolutePath).pipe(res);
  })
);

export default router;
