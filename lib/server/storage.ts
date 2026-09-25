/**
 * File upload helpers for the Next in-memory API fallback.
 * Prefer Express storage in server/ when the backend is running.
 */
export type UploadResult = {
  url: string;
  name: string;
  size: number;
};

export function isObjectStorageConfigured(): boolean {
  return Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID);
}

export async function storeUploadedFile(params: {
  name: string;
  size?: number;
  category?: string;
  userId: string;
  contentBase64?: string;
  mimeType?: string;
  id?: string;
}): Promise<UploadResult> {
  const size = params.size ?? 0;
  if (!params.contentBase64) {
    throw new Error("File content is required");
  }
  // Keep a data URL so open/download still works without S3 / Express disk storage.
  const mime = params.mimeType || "application/octet-stream";
  const raw = params.contentBase64.includes(",")
    ? params.contentBase64.split(",")[1]
    : params.contentBase64;
  return {
    url: `data:${mime};base64,${raw}`,
    name: params.name,
    size,
  };
}
