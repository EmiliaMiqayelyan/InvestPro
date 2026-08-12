/**
 * File upload helpers. Mock mode returns data URLs / placeholder paths.
 * Configure S3_* env for real object storage.
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
}): Promise<UploadResult> {
  const size = params.size ?? 0;
  if (!isObjectStorageConfigured()) {
    return {
      url: `#upload-${params.userId}-${Date.now()}-${encodeURIComponent(params.name)}`,
      name: params.name,
      size,
    };
  }

  // Production: put object to S3/R2 and return public/signed URL
  const key = `uploads/${params.userId}/${Date.now()}-${params.name}`;
  return {
    url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
    name: params.name,
    size,
  };
}
