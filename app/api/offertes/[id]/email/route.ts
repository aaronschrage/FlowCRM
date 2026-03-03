import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import OffertePDF from "@/components/OffertePDF";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, props: any) {
  try {
    const { id } = await props.params;

    const offerte = await prisma.offerte.findUnique({
      where: { id: Number(id) },
      include: { regels: true, klant: true },
    });

    if (!offerte) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    // Genereer PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(OffertePDF, { offerte })
    );

    // Verstuur e-mail
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "aaronschrage321@gmail.com",  // jouw resend account email
      subject: `Offerte ${offerte.nummer}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #4f7cff; font-size: 24px; margin-bottom: 8px;">Offerte ${offerte.nummer}</h1>
          <p style="color: #6b7280; margin-bottom: 32px;">Beste ${offerte.klant.name},</p>
          
          <p style="color: #374151; line-height: 1.6;">
            Hierbij ontvangt u onze offerte. In de bijlage vindt u de volledige offerte als PDF.
          </p>

          <div style="background: #f8f9ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">OFFERTE NUMMER</td>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">GELDIG TOT</td>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">TOTAAL</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #1a1a2e;">${offerte.nummer}</td>
                <td style="font-weight: 600; color: #1a1a2e;">${new Date(offerte.geldigTot).toLocaleDateString("nl-NL")}</td>
                <td style="font-weight: 600; color: #4f7cff; font-size: 18px;">€${offerte.totaal.toFixed(2).replace(".", ",")}</td>
              </tr>
            </table>
          </div>

          <p style="color: #374151; line-height: 1.6;">
            Heeft u vragen over deze offerte? Neem dan gerust contact met ons op.
          </p>

          <p style="color: #6b7280; margin-top: 32px; font-size: 14px;">
            Met vriendelijke groet,<br/>
            <strong style="color: #1a1a2e;">Mijn Bedrijf</strong>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${offerte.nummer}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // Zet status op verstuurd
    await prisma.offerte.update({
      where: { id: offerte.id },
      data: { status: "verstuurd" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}