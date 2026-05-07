import { SignJWT, jwtVerify } from "jose";

export const TOKEN_EXPIRY_MINUTES = 15;
export const SESSION_EXPIRY_DAYS = 7;

function jwtSecret(): Uint8Array {
  const secret = process.env.PORTAL_JWT_SECRET;
  if (!secret) throw new Error("PORTAL_JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function signSessionJWT(customerId: number, sessionId: string): Promise<string> {
  return new SignJWT({ customerId, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_DAYS}d`)
    .sign(jwtSecret());
}

export async function verifySessionJWT(
  token: string,
): Promise<{ customerId: number; sessionId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    if (typeof payload.customerId !== "number" || typeof payload.sessionId !== "string") {
      return null;
    }
    return { customerId: payload.customerId, sessionId: payload.sessionId };
  } catch {
    return null;
  }
}

export function validateMagicToken(session: {
  usedAt: Date | null;
  expiresAt: Date;
  klant: { portalAccessEnabled: boolean };
}): { valid: true } | { valid: false; reason: "gebruikt" | "verlopen" | "geen_toegang" } {
  if (session.usedAt) return { valid: false, reason: "gebruikt" };
  if (session.expiresAt < new Date()) return { valid: false, reason: "verlopen" };
  if (!session.klant.portalAccessEnabled) return { valid: false, reason: "geen_toegang" };
  return { valid: true };
}
