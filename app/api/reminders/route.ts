import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getInstellingen } from "@/lib/instellingen";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { factuurId } = await req.json();

    const [factuur, instellingen] = await Promise.all([
      prisma.factuur.findUnique({
        where: { id: Number(factuurId) },
        include: { klant: true },
      }),
      getInstellingen(),
    ]);

    if (!factuur) {
      return NextResponse.json({ error: "Factuur niet gevonden" }, { status: 404 });
    }

    const bedrijfsnaam = instellingen.bedrijfsnaam || "Mijn Bedrijf";
    const iban = instellingen.iban || "";
    const isTeXLaat = new Date(factuur.vervaldatum) < new Date();

    const fmt = (n: number) =>
      new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "aaronschrage321@gmail.com",
      subject: `${isTeXLaat ? "⚠ Herinnering (vervallen)" : "Betalingsherinnering"}: ${factuur.nummer}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: ${isTeXLaat ? "#ef4444" : "#f59e0b"}; font-size: 22px; margin-bottom: 8px;">
            ${isTeXLaat ? "⚠ Betalingsherinnering (vervallen)" : "Betalingsherinnering"}
          </h1>
          <p style="color: #6b7280; margin-bottom: 32px;">Beste ${factuur.klant.name},</p>

          <p style="color: #374151; line-height: 1.6;">
            ${isTeXLaat
              ? `Wij willen u er vriendelijk op wijzen dat de betaaltermijn van onderstaande factuur reeds verlopen is. Wij verzoeken u het openstaande bedrag zo spoedig mogelijk te voldoen.`
              : `Wij willen u er vriendelijk aan herinneren dat onderstaande factuur nog openstaat. Wij verzoeken u het bedrag voor de vervaldatum te voldoen.`
            }
          </p>

          <div style="background: ${isTeXLaat ? "#fef2f2" : "#fffbeb"}; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid ${isTeXLaat ? "#ef4444" : "#f59e0b"};">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">FACTUURNUMMER</td>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">VERVALDATUM</td>
                <td style="color: #6b7280; font-size: 12px; padding-bottom: 4px;">OPENSTAAND BEDRAG</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #1a1a2e;">${factuur.nummer}</td>
                <td style="font-weight: 600; color: ${isTeXLaat ? "#ef4444" : "#1a1a2e"};">${new Date(factuur.vervaldatum).toLocaleDateString("nl-NL")}</td>
                <td style="font-weight: 700; color: ${isTeXLaat ? "#ef4444" : "#f59e0b"}; font-size: 18px;">${fmt(factuur.totaal)}</td>
              </tr>
            </table>
          </div>

          ${iban ? `
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">BETALEN OP</p>
            <p style="font-weight: 600; color: #1a1a2e; font-size: 16px; margin: 0;">${iban}</p>
            <p style="color: #6b7280; font-size: 12px; margin: 4px 0 0 0;">Onder vermelding van ${factuur.nummer}</p>
          </div>
          ` : ""}

          <p style="color: #374151; line-height: 1.6; margin-top: 24px;">
            Heeft u al betaald? Dan kunt u deze herinnering als niet verzonden beschouwen. 
            Heeft u vragen? Neem dan gerust contact met ons op.
          </p>

          <p style="color: #6b7280; margin-top: 32px; font-size: 14px;">
            Met vriendelijke groet,<br/>
            <strong style="color: #1a1a2e;">${bedrijfsnaam}</strong>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reminder error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}