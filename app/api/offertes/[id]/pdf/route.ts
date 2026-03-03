import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import OffertePDF from "@/components/OffertePDF";
import { getInstellingen } from "@/lib/instellingen";
import React from "react";

export async function GET(req: Request, props: any) {
  try {
    const { id } = await props.params;

    const [offerte, instellingen] = await Promise.all([
      prisma.offerte.findUnique({
        where: { id: Number(id) },
        include: { regels: true, klant: true },
      }),
      getInstellingen(),
    ]);

    if (!offerte) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    const buffer = await renderToBuffer(
      React.createElement(OffertePDF, {
        offerte,
        bedrijfsnaam: instellingen.bedrijfsnaam || "Mijn Bedrijf",
        bedrijfEmail: instellingen.email || "",
        bedrijfTelefoon: instellingen.telefoon || "",
        bedrijfAdres: instellingen.adres || "",
        bedrijfWebsite: instellingen.website || "",
        kvk: instellingen.kvk || "",
        btwnummer: instellingen.btwnummer || "",
        iban: instellingen.iban || "",
      })
    );

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${offerte.nummer}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}