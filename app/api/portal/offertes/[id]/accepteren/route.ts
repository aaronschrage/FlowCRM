import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { verifySessionJWT } from "@/lib/portal-auth";
import { offerteNotificationEmail } from "@/lib/portal-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("portal-session")?.value;
  if (!jwt) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const session = await verifySessionJWT(jwt);
  if (!session) return NextResponse.json({ error: "Sessie verlopen." }, { status: 401 });

  const { id } = await params;
  const offerteId = parseInt(id, 10);
  if (isNaN(offerteId)) return NextResponse.json({ error: "Ongeldig ID." }, { status: 400 });

  let clientNotes: string | undefined;
  try {
    const body = await request.json();
    if (typeof body.notes === "string" && body.notes.trim()) {
      clientNotes = body.notes.trim();
    }
  } catch {
    // body is optional for accepteren
  }

  const offerte = await prisma.offerte.findUnique({
    where: { id: offerteId },
    include: { klant: { select: { id: true, name: true, email: true } } },
  });

  if (!offerte || offerte.klantId !== session.customerId) {
    return NextResponse.json({ error: "Offerte niet gevonden." }, { status: 404 });
  }
  if (offerte.status !== "verstuurd") {
    return NextResponse.json(
      { error: "Deze offerte kan niet meer worden geaccepteerd." },
      { status: 409 },
    );
  }

  await prisma.$transaction([
    prisma.offerte.update({
      where: { id: offerteId },
      data: { status: "geaccepteerd", acceptedAt: new Date(), clientNotes: clientNotes ?? null },
    }),
    prisma.portalActivity.create({
      data: {
        klantId: session.customerId,
        type: "offerte_geaccepteerd",
        metadata: JSON.stringify({ offerteId, nummer: offerte.nummer }),
      },
    }),
  ]);

  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "";
  if (adminEmail) {
    const bedrijf = await prisma.instelling.findUnique({ where: { sleutel: "bedrijfsnaam" } });
    const companyName = bedrijf?.waarde ?? "FlowCRM";
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

    await resend.emails.send({
      from: `${companyName} <${fromEmail}>`,
      to: adminEmail,
      subject: `Offerte ${offerte.nummer} geaccepteerd door ${offerte.klant.name}`,
      html: offerteNotificationEmail({
        type: "geaccepteerd",
        offerteNummer: offerte.nummer,
        klantNaam: offerte.klant.name,
        klantEmail: offerte.klant.email,
        clientNotes,
        companyName,
      }),
    });
  }

  return NextResponse.json({ success: true, status: "geaccepteerd" });
}
