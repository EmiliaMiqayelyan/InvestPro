/**
 * Client helpers for document open/download.
 * Real uploads use `/api/v1/uploads/:id/file`; legacy mock URLs start with `#upload-`.
 */

export function isUsableDocumentUrl(url?: string | null): boolean {
  if (!url) return false;
  if (url.startsWith("#")) return false;
  return (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  );
}

export function documentOpenHref(url?: string | null): string | null {
  return isUsableDocumentUrl(url) ? url! : null;
}

export function documentDownloadHref(url?: string | null): string | null {
  if (!isUsableDocumentUrl(url)) return null;
  if (url!.includes("/uploads/") && url!.includes("/file")) {
    const join = url!.includes("?") ? "&" : "?";
    return `${url}${join}download=1`;
  }
  return url!;
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
