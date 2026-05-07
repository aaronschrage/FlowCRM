import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { signSessionJWT, validateMagicToken, SESSION_EXPIRY_DAYS } from "@/lib/portal-auth";
import { hashToken } from "@/lib/portal-auth-server";

// POST { token: string } → { token: jwt, expiresAt, customerId }
// Also sets an HttpOnly session cookie so browser clients work without
// reading the response body.
export async function POST(request: NextRequest) {
  let rawToken: string;
  try {
    const body = await request.json();
    rawToken = typeof body.token === "string" ? body.token : "";
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  if (!rawToken) {
    return NextResponse.json({ error: "Token ontbreekt." }, { status: 400 });
  }

  const tokenHash = hashToken(rawToken);
  const session = await prisma.portalSession.findUnique({
    where: { tokenHash },
    include: { klant: { select: { id: true, portalAccessEnabled: true } } },
  });

  if (!session) {
    return NextResponse.json({ error: "Ongeldige of verlopen link." }, { status: 401 });
  }

  const check = validateMagicToken(session);
  if (!check.valid) {
    return NextResponse.json({ error: "Ongeldige of verlopen link." }, { status: 401 });
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

  const response = NextResponse.json({
    token: jwt,
    expiresAt: sessionExpiry.toISOString(),
    customerId: session.klantId,
  });

  response.cookies.set("portal-session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: sessionExpiry,
    path: "/",
  });

  return response;
}
