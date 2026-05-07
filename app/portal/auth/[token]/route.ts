import { type NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { signSessionJWT, validateMagicToken, SESSION_EXPIRY_DAYS } from "@/lib/portal-auth";
import { hashToken } from "@/lib/portal-auth-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const tokenHash = hashToken(token);
  const session = await prisma.portalSession.findUnique({
    where: { tokenHash },
    include: { klant: { select: { id: true, portalAccessEnabled: true } } },
  });

  if (!session) {
    return NextResponse.redirect(new URL("/portal/login?error=invalid", _request.url));
  }

  const check = validateMagicToken(session);
  if (!check.valid) {
    const error = check.reason === "verlopen" ? "expired" : "invalid";
    return NextResponse.redirect(new URL(`/portal/login?error=${error}`, _request.url));
  }

  const sessionId = randomUUID();
  const sessionExpiry = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const jwt = await signSessionJWT(session.klantId, sessionId);

  await prisma.$transaction([
    prisma.portalSession.update({
      where: { id: session.id },
      data: { usedAt: new Date(), sessionId },
    }),
    prisma.customer.update({
      where: { id: session.klantId },
      data: { portalLastLogin: new Date() },
    }),
    prisma.portalActivity.create({
      data: { klantId: session.klantId, type: "login" },
    }),
  ]);

  const response = NextResponse.redirect(new URL("/portal/dashboard", _request.url));
  response.cookies.set("portal-session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: sessionExpiry,
    path: "/",
  });

  return response;
}
