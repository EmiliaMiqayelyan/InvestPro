import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/server/jwt";
import { findRouteRule, getRoleHome, GUEST_ONLY_ROUTES } from "@/lib/rbac";
import { ROUTES } from "@/constants";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function hostnameOf(host: string): string {
  return host.replace(/^\[|\]$/g, "").split(":")[0];
}

/** Browser-facing origin. Never the bind address behind nginx (localhost:3926). */
function requestOrigin(request: NextRequest): string {
  const headerHost = (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""
  )
    .split(",")[0]
    .trim();
  const hostname = hostnameOf(headerHost);
  if (headerHost && !LOOPBACK_HOSTS.has(hostname)) {
    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || "https";
    return `${proto}://${headerHost}`;
  }
  const configured = process.env.NEXT_PUBLIC_PUBLIC_HOST?.trim().replace(/\/$/, "");
  if (configured) {
    return configured.startsWith("http") ? configured : `https://${configured}`;
  }
  if (process.env.NODE_ENV === "production") return "https://xsinvest.org";
  return request.nextUrl.origin;
}

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const response = NextResponse.redirect(new URL(pathname, requestOrigin(request)));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rawToken = request.cookies.get("access_token")?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;
  const payload = token ? await verifyAccessToken(token) : null;

  if (GUEST_ONLY_ROUTES.includes(pathname)) {
    if (payload) {
      return redirectTo(request, getRoleHome(payload.role));
    }
    return NextResponse.next();
  }

  const rule = findRouteRule(pathname);
  if (!rule) return NextResponse.next();

  if (!payload) {
    const loginUrl = new URL(ROUTES.LOGIN, requestOrigin(request));
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (rule.roles && !rule.roles.includes(payload.role)) {
    return redirectTo(request, getRoleHome(payload.role));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
