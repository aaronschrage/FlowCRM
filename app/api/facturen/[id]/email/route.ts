import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { createFactuurPDFElement } from "@/components/FactuurPDF";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, props: any) {
  try {
    const { id } = await props.params;

    const factuur = await prisma.factuur.findUnique({
      where: { id: Number(id) },
      include: { regels: true, klant: true },
    });

    if (!factuur) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    const pdfBuffer = await renderToBuffer(
      createFactuurPDFElement({ factuur }),
    );

    const fmt = (n: number) =>
      new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "aaronschrage321@gmail.com",
      subject: `Factuur ${factuur.nummer}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #34d399; font-size: 24px; margin-bottom: 8px;">Factuur ${factuur.nummer}</h1>
          <p style="color: #6b7280; margin-bottom: 32px;">Beste ${factuur.klant.name},</p>
          
          <p style="color: #374151; line-height: 1.6;">
            Hierbij ontvangt u onze factuur. In de bijlage vindt u de volledige factuur als PDF.
          </p>

          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">FACTUURNUMMER</td>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">VERVALDATUM</td>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">TOTAAL</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #1a1a2e;">${factuur.nummer}</td>
                <td style="font-weight: 600; color: #1a1a2e;">${new Date(factuur.vervaldatum).toLocaleDateString("nl-NL")}</td>
                <td style="font-weight: 600; color: #34d399; font-size: 18px;">${fmt(factuur.totaal)}</td>
              </tr>
            </table>
          </div>

          <p style="color: #374151; line-height: 1.6;">
            Heeft u vragen over deze factuur? Neem dan gerust contact met ons op.
          </p>

          <p style="color: #6b7280; margin-top: 32px; font-size: 14px;">
            Met vriendelijke groet,<br/>
            <strong style="color: #1a1a2e;">Mijn Bedrijf</strong>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${factuur.nummer}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}