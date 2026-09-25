import fs from "fs";
import path from "path";
import { env } from "../../app/config/env";

export type UploadResult = {
  url: string;
  name: string;
  size: number;
  storagePath?: string;
  mimeType?: string;
};

const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads");

function ensureUploadRoot() {
  if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  }
}

export function isObjectStorageConfigured(): boolean {
  return Boolean(env.S3_BUCKET && env.S3_ACCESS_KEY_ID);
}

function extensionFor(name: string, mimeType?: string): string {
  const fromName = path.extname(name);
  if (fromName) return fromName.toLowerCase();
  if (!mimeType) return "";
  const map: Record<string, string> = {
    "application/pdf": ".pdf",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  };
  return map[mimeType] || "";
}

function mimeFromName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const map: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
  return map[ext] || "application/octet-stream";
}

export async function storeUploadedFile(params: {
  id: string;
  name: string;
  size?: number;
  category?: string;
  userId: string;
  contentBase64?: string;
  mimeType?: string;
}): Promise<UploadResult> {
  const size = params.size ?? 0;
  const mimeType = params.mimeType || mimeFromName(params.name);

  if (!params.contentBase64) {
    throw new Error("File content is required");
  }

  if (isObjectStorageConfigured()) {
    // Local disk still used until real S3 put is wired; keep stable API URL shape.
  }

  ensureUploadRoot();
  const ext = extensionFor(params.name, mimeType);
  const filename = `${params.id}${ext}`;
  const storagePath = path.join(UPLOAD_ROOT, filename);
  const raw = params.contentBase64.includes(",")
    ? params.contentBase64.split(",")[1]
    : params.contentBase64;
  const buffer = Buffer.from(raw, "base64");
  fs.writeFileSync(storagePath, buffer);

  return {
    url: `/api/v1/uploads/${params.id}/file`,
    name: params.name,
    size: buffer.length || size,
    storagePath: filename,
    mimeType,
  };
}

export function resolveStoredFile(storageKey: string): {
  absolutePath: string;
  mimeType: string;
} | null {
  const safe = path.basename(storageKey);
  const absolutePath = path.join(UPLOAD_ROOT, safe);
  if (!absolutePath.startsWith(UPLOAD_ROOT) || !fs.existsSync(absolutePath)) {
    return null;
  }
  return {
    absolutePath,
    mimeType: mimeFromName(safe),
  };
}

export function storageKeyFromUrl(url: string, fileId: string): string | null {
  if (!url) return null;
  if (url.startsWith("#upload-")) return null;
  const match = url.match(/\/uploads\/([^/]+)\/file/);
  if (match?.[1]) return null; // resolved via DB id + listing dir
  if (!url.includes("/") && !url.startsWith("http")) return url;
  // Prefer scanning by id prefix in uploads dir
  ensureUploadRoot();
  const files = fs.readdirSync(UPLOAD_ROOT);
  const found = files.find((f) => f === fileId || f.startsWith(`${fileId}.`));
  return found || null;
}
