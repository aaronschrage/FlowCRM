import { NextRequest, NextResponse } from "next/server";
import { verifySessionJWT } from "@/lib/portal-auth";

export const config = {
  matcher: ["/portal/:path*"],
};

const PUBLIC_PATHS = ["/portal/login", "/portal/auth/"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login and magic-link callback are always public
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("portal-session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  const payload = await verifySessionJWT(sessionCookie);
  if (!payload) {
    // Cookie present but JWT invalid/expired — clear it and send to login
    const response = NextResponse.redirect(new URL("/portal/login", request.url));
    response.cookies.delete("portal-session");
    return response;
  }

  return NextResponse.next();
}
