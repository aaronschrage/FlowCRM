import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { verifySessionJWT } from "@/lib/portal-auth";
import { createFactuurPDFElement } from "@/components/FactuurPDF";
import { getInstellingen } from "@/lib/instellingen";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("portal-session")?.value;
  if (!jwt) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const session = await verifySessionJWT(jwt);
  if (!session) return NextResponse.json({ error: "Sessie verlopen." }, { status: 401 });

  const { id } = await params;
  const factuurId = parseInt(id, 10);
  if (isNaN(factuurId)) return NextResponse.json({ error: "Ongeldig ID." }, { status: 400 });

  const [factuur, instellingen] = await Promise.all([
    prisma.factuur.findUnique({
      where: { id: factuurId },
      include: { regels: true, klant: true },
    }),
    getInstellingen(),
  ]);

  if (!factuur || factuur.klantId !== session.customerId) {
    return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    createFactuurPDFElement({
      factuur,
      bedrijfsnaam: instellingen.bedrijfsnaam || "Mijn Bedrijf",
      bedrijfEmail: instellingen.email || "",
      bedrijfTelefoon: instellingen.telefoon || "",
      bedrijfAdres: instellingen.adres || "",
      bedrijfWebsite: instellingen.website || "",
      kvk: instellingen.kvk || "",
      btwnummer: instellingen.btwnummer || "",
      iban: instellingen.iban || "",
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${factuur.nummer}.pdf"`,
    },
  });
}
