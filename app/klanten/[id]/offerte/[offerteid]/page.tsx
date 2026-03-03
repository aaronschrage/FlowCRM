import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, User, Hash } from "lucide-react";
import OfferteStatusButton from "./OfferteStatusButton";
import VerstuurEmailButton from "@/components/VerstuurEmailButton";
import VerwijderButton from "@/components/VerwijderButton";
import OmzettenNaarFactuurButton from "@/components/OmzettenNaarFactuurButton";

export default async function OfferteDetailPage(props: any) {
  const params = await props.params;
  const id = params.id;
  const offerteId = params.offerteid;

  const offerte = await prisma.offerte.findUnique({
    where: { id: Number(offerteId) },
    include: { regels: true, klant: true },
  });

  if (!offerte) notFound();

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  const statusKleur: Record<string, string> = {
    concept: "badge-info",
    verstuurd: "badge-warning",
    geaccepteerd: "badge-success",
    afgewezen: "badge-danger",
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href={`/klanten/${id}`} className="btn btn-ghost btn-sm">
          <ArrowLeft size={15} />
          Terug naar {offerte.klant.name}
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "var(--accent-subtle)",
            border: "1px solid rgba(79,124,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <FileText size={22} style={{ color: "var(--accent-hover)" }} />
          </div>
          <div>
            <h1 className="page-title">{offerte.nummer}</h1>
            <span className={`badge ${statusKleur[offerte.status] || "badge-info"}`} style={{ marginTop: 6, display: "inline-block" }}>
              {offerte.status}
            </span>
          </div>
        </div>

        {/* Twee rijen knoppen */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <VerstuurEmailButton offerteId={offerte.id} klantEmail={offerte.klant.email} />
            <a href={`/api/offertes/${offerte.id}/pdf`} className="btn btn-ghost" target="_blank">PDF downloaden</a>
            <OfferteStatusButton offerteId={offerte.id} huidigStatus={offerte.status} klantId={Number(id)} />
            <OmzettenNaarFactuurButton offerteId={offerte.id} offerteStatus={offerte.status} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <VerwijderButton id={offerte.id} type="offerte" klantId={Number(id)} nummer={offerte.nummer} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card card-sm">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <User size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Klant</span>
          </div>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{offerte.klant.name}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{offerte.klant.email}</p>
        </div>

        <div className="card card-sm">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Calendar size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Datum</span>
          </div>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {new Date(offerte.datum).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
            Geldig tot {new Date(offerte.geldigTot).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
          </p>
        </div>

        <div className="card card-sm">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Hash size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Regels</span>
          </div>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{offerte.regels.length} regel{offerte.regels.length !== 1 ? "s" : ""}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>In deze offerte</p>
        </div>
      </div>

      <div className="table-wrapper" style={{ marginBottom: 24 }}>
        <table className="crm-table">
          <thead>
            <tr>
              <th>Omschrijving</th>
              <th style={{ textAlign: "right" }}>Aantal</th>
              <th style={{ textAlign: "right" }}>Prijs</th>
              <th style={{ textAlign: "right" }}>BTW</th>
              <th style={{ textAlign: "right" }}>Totaal</th>
            </tr>
          </thead>
          <tbody>
            {offerte.regels.map((regel) => (
              <tr key={regel.id}>
                <td className="name-cell">{regel.omschrijving}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>{regel.aantal}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>{fmt(regel.eenheidsprijs)}</td>
                <td style={{ textAlign: "right" }}><span className="badge badge-info">{regel.btw}%</span></td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {fmt(regel.totaal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div className="card" style={{ minWidth: 300 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotaal</span>
              <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{fmt(offerte.subtotaal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--text-muted)" }}>BTW</span>
              <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{fmt(offerte.btwBedrag)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>Totaal</span>
              <span style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--accent-hover)", fontFamily: "var(--font-mono)" }}>
                {fmt(offerte.totaal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {offerte.notities && (
        <div className="card" style={{ marginTop: 24 }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Notities</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{offerte.notities}</p>
        </div>
      )}
    </div>
  );
}