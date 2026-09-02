import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/server/jwt";
import { findRouteRule, getRoleHome, GUEST_ONLY_ROUTES } from "@/lib/rbac";
import { ROUTES } from "@/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rawToken = request.cookies.get("access_token")?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;
  const payload = token ? await verifyAccessToken(token) : null;

  if (GUEST_ONLY_ROUTES.includes(pathname)) {
    if (payload) {
      return NextResponse.redirect(new URL(getRoleHome(payload.role), request.url));
    }
    return NextResponse.next();
  }

  const rule = findRouteRule(pathname);
  if (!rule) return NextResponse.next();

  if (!payload) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (rule.roles && !rule.roles.includes(payload.role)) {
    return NextResponse.redirect(new URL(getRoleHome(payload.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/owner/:path*",
    "/owner",
    "/investor/:path*",
    "/investor",
    "/messages/:path*",
    "/messages",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
