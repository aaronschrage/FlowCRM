import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/portal/login", request.url));
  response.cookies.delete("portal-session");
  return response;
}
