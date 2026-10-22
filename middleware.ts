import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/server/jwt";
import { findRouteRule, getRoleHome, GUEST_ONLY_ROUTES } from "@/lib/rbac";
import { ROUTES } from "@/constants";

function redirectOffLoopback(request: NextRequest): NextResponse | null {
  const publicHost = process.env.NEXT_PUBLIC_PUBLIC_HOST?.trim();
  if (!publicHost) return null;
  const headerHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const hostname = headerHost.split(":")[0];
  if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "::1") return null;
  const url = request.nextUrl.clone();
  url.hostname = publicHost;
  url.protocol = "http:";
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const loopbackRedirect = redirectOffLoopback(request);
  if (loopbackRedirect) return loopbackRedirect;

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
