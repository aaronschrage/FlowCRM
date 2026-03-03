import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { klantId, geldigDagen, notities, regels } = body;

    let subtotaal = 0;
    let btwBedrag = 0;

    const regelData = regels.map((r: any) => {
      const regelTotaal = r.aantal * r.prijs;
      const regelBtw = regelTotaal * (r.btw / 100);
      subtotaal += regelTotaal;
      btwBedrag += regelBtw;
      return {
        omschrijving: r.omschrijving,
        aantal: r.aantal,
        eenheidsprijs: r.prijs,
        btw: r.btw,
        totaal: regelTotaal,
      };
    });

    const totaal = subtotaal + btwBedrag;

    const jaar = new Date().getFullYear();
    const count = await prisma.offerte.count();
    const nummer = `OFF-${jaar}-${String(count + 1).padStart(3, "0")}`;

    const geldigTot = new Date();
    geldigTot.setDate(geldigTot.getDate() + (geldigDagen || 30));

    await prisma.offerte.create({
      data: {
        nummer,
        klantId: Number(klantId),
        geldigTot,
        notities: notities || "",
        subtotaal,
        btwBedrag,
        totaal,
        regels: { create: regelData },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Offerte error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}