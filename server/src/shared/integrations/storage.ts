import { env } from "../../app/config/env";

export type UploadResult = {
  url: string;
  name: string;
  size: number;
};

export function isObjectStorageConfigured(): boolean {
  return Boolean(env.S3_BUCKET && env.S3_ACCESS_KEY_ID);
}

export async function storeUploadedFile(params: {
  name: string;
  size?: number;
  category?: string;
  userId: string;
}): Promise<UploadResult> {
  const size = params.size ?? 0;
  if (!isObjectStorageConfigured()) {
    return {
      url: `#upload-${params.userId}-${Date.now()}-${encodeURIComponent(params.name)}`,
      name: params.name,
      size,
    };
  }

  const key = `uploads/${params.userId}/${Date.now()}-${params.name}`;
  return {
    url: `https://${env.S3_BUCKET}.s3.amazonaws.com/${key}`,
    name: params.name,
    size,
  };
}
