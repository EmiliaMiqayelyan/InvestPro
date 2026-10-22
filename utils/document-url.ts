import { getApiBaseUrl } from "@/constants";
import { getAccessToken } from "@/services/api/client";

/**
 * Client helpers for document open/download.
 * Real uploads use `/api/v1/uploads/:id/file`; legacy mock URLs start with `#upload-`.
 * Relative API paths are resolved against the API origin so the browser does not
 * go through the Next.js proxy.
 */

function resolveApiPath(url: string): string {
  const normalized = url.replace(
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?=\/)/i,
    ""
  );
  if (!normalized.startsWith("/api/v1")) return normalized;
  const origin = getApiBaseUrl().replace(/\/api\/v1\/?$/, "");
  const absolute = `${origin}${normalized}`;
  if (!absolute.startsWith("http")) return absolute;
  const token = getAccessToken();
  if (!token || absolute.includes("token=")) return absolute;
  const join = absolute.includes("?") ? "&" : "?";
  return `${absolute}${join}token=${encodeURIComponent(token)}`;
}

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
  return isUsableDocumentUrl(url) ? resolveApiPath(url!) : null;
}

export function documentDownloadHref(url?: string | null): string | null {
  if (!isUsableDocumentUrl(url)) return null;
  const resolved = resolveApiPath(url!);
  if (resolved.includes("/uploads/") && resolved.includes("/file")) {
    const join = resolved.includes("?") ? "&" : "?";
    return `${resolved}${join}download=1`;
  }
  return resolved;
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
