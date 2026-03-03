import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: any) {
  try {
    const { id } = await props.params;

    const offerte = await prisma.offerte.findUnique({
      where: { id: Number(id) },
      include: { regels: true },
    });

    if (!offerte) {
      return NextResponse.json({ error: "Offerte niet gevonden" }, { status: 404 });
    }

    // Genereer factuurnummer
    const jaar = new Date().getFullYear();
    const count = await prisma.factuur.count({
      where: { nummer: { startsWith: `FACT-${jaar}` } },
    });
    const nummer = `FACT-${jaar}-${String(count + 1).padStart(3, "0")}`;

    // Haal betalingstermijn op uit instellingen
    const termijnInstelling = await prisma.instelling.findUnique({
      where: { sleutel: "betalingstermijn" },
    });
    const termijn = Number(termijnInstelling?.waarde || 30);

    const vervaldatum = new Date();
    vervaldatum.setDate(vervaldatum.getDate() + termijn);

    // Maak factuur aan met dezelfde regels
    const factuur = await prisma.factuur.create({
      data: {
        nummer,
        klantId: offerte.klantId,
        vervaldatum,
        status: "openstaand",
        notities: offerte.notities,
        subtotaal: offerte.subtotaal,
        btwBedrag: offerte.btwBedrag,
        totaal: offerte.totaal,
        regels: {
          create: offerte.regels.map((r) => ({
            omschrijving: r.omschrijving,
            aantal: r.aantal,
            eenheidsprijs: r.eenheidsprijs,
            btw: r.btw,
            totaal: r.totaal,
          })),
        },
      },
    });

    // Zet offerte op geaccepteerd
    await prisma.offerte.update({
      where: { id: Number(id) },
      data: { status: "geaccepteerd" },
    });

    return NextResponse.json({ ok: true, factuurId: factuur.id, klantId: factuur.klantId });
  } catch (err) {
    console.error("Omzetten error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}