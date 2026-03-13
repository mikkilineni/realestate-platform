import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN ?? "localhost";
const ADMIN_SUBDOMAIN = process.env.ADMIN_SUBDOMAIN ?? "admin";
const APP_SUBDOMAIN = process.env.APP_SUBDOMAIN ?? "app";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host") ?? "";
  const host = hostname.split(":")[0];

  // Admin subdomain: admin.yourdomain.com
  if (host === `${ADMIN_SUBDOMAIN}.${PLATFORM_DOMAIN}` || host === "admin.localhost") {
    if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
      return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // App subdomain: app.yourdomain.com
  if (host === `${APP_SUBDOMAIN}.${PLATFORM_DOMAIN}` || host === "app.localhost") {
    if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
      return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/dashboard${pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Platform subdomain: slug.yourdomain.com
  const platformSuffix = `.${PLATFORM_DOMAIN}`;
  if (host.endsWith(platformSuffix) && !host.startsWith(ADMIN_SUBDOMAIN) && !host.startsWith(APP_SUBDOMAIN)) {
    const slug = host.slice(0, -platformSuffix.length);
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/_sites/${slug}${pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Custom domain — not a known subdomain
  if (!host.endsWith(PLATFORM_DOMAIN) && host !== "localhost" && !host.includes(".localhost")) {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/_sites/__custom${pathname}`;
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-tenant-hostname", hostname);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
