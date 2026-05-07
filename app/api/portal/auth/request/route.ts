import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TOKEN_EXPIRY_MINUTES } from "@/lib/portal-auth";
import { generateToken, hashToken } from "@/lib/portal-auth-server";
import { magicLinkEmail } from "@/lib/portal-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── In-memory sliding-window rate limiter ─────────────────────────
// Max 3 requests per IP per 60 seconds. Single-server (SQLite) setup,
// so in-memory is sufficient and avoids a Redis dependency.
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

// Prune expired entries every 5 minutes to prevent unbounded map growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimits) {
    if (now > entry.resetAt) rateLimits.delete(ip);
  }
}, 5 * 60_000);

// ── Always return this — never reveal whether an email exists ──────
const GENERIC_OK = NextResponse.json({
  message: "Als dit e-mailadres bekend is, ontvang je een link om in te loggen.",
});

// ── Handler ───────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Te veel pogingen. Wacht een minuut en probeer opnieuw." },
      { status: 429 },
    );
  }

  let email: string;
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Voer een geldig e-mailadres in." }, { status: 400 });
  }

  const klant = await prisma.customer.findFirst({
    where: { email, portalAccessEnabled: true },
  });

  if (!klant) return GENERIC_OK;

  // Invalidate any previous unused tokens for this customer
  await prisma.portalSession.deleteMany({
    where: { klantId: klant.id, usedAt: null },
  });

  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

  await prisma.portalSession.create({
    data: { klantId: klant.id, tokenHash, expiresAt },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const magicLinkUrl = `${appUrl}/portal/auth/${token}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const bedrijfInstelling = await prisma.instelling.findUnique({
    where: { sleutel: "bedrijfsnaam" },
  });
  const companyName = bedrijfInstelling?.waarde ?? "FlowCRM";

  await resend.emails.send({
    from: `${companyName} <${fromEmail}>`,
    to: klant.email,
    subject: "Je toegangslink voor het klantportaal",
    html: magicLinkEmail({ name: klant.name, magicLinkUrl, expiresMinutes: TOKEN_EXPIRY_MINUTES, companyName }),
  });

  return GENERIC_OK;
}
