import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/server/jwt";
import { findRouteRule, getRoleHome, GUEST_ONLY_ROUTES } from "@/lib/rbac";
import { ROUTES } from "@/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;
  const payload = token ? await verifyAccessToken(token) : null;

  // Authenticated users don't need the auth pages.
  if (GUEST_ONLY_ROUTES.includes(pathname)) {
    if (payload) {
      return NextResponse.redirect(new URL(getRoleHome(payload.role), request.url));
    }
    return NextResponse.next();
  }

  const rule = findRouteRule(pathname);
  if (!rule) return NextResponse.next();

  // Route requires authentication.
  if (!payload) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Route requires a specific role (e.g. /admin -> admin only).
  if (rule.roles && !rule.roles.includes(payload.role)) {
    return NextResponse.redirect(new URL(getRoleHome(payload.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/dashboard/:path*",
    "/dashboard",
    "/wallet/:path*",
    "/wallet",
    "/deposit/:path*",
    "/deposit",
    "/withdraw/:path*",
    "/withdraw",
    "/projects/:path*",
    "/projects",
    "/investments/:path*",
    "/investments",
    "/transactions/:path*",
    "/transactions",
    "/notifications/:path*",
    "/notifications",
    "/profile/:path*",
    "/profile",
    "/security/:path*",
    "/security",
    "/kyc/:path*",
    "/kyc",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
