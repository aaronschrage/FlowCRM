import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import FactuurPDF from "@/components/FactuurPDF";
import { getInstellingen } from "@/lib/instellingen";
import React from "react";

export async function GET(req: Request, props: any) {
  try {
    const { id } = await props.params;

    const [factuur, instellingen] = await Promise.all([
      prisma.factuur.findUnique({
        where: { id: Number(id) },
        include: { regels: true, klant: true },
      }),
      getInstellingen(),
    ]);

    if (!factuur) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    const buffer = await renderToBuffer(
      React.createElement(FactuurPDF, {
        factuur,
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
        "Content-Disposition": `attachment; filename="${factuur.nummer}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}