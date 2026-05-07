import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Receipt, Calendar, User, Hash } from "lucide-react";
import FactuurStatusButton from "./FactuurStatusButton";
import VerstuurEmailButton from "@/components/VerstuurEmailButton";
import VerwijderButton from "@/components/VerwijderButton";

export default async function FactuurDetailPage(props: any) {
  const params = await props.params;
  const id = params.id;
  const factuurId = params.factuurid;

  const factuur = await prisma.factuur.findUnique({
    where: { id: Number(factuurId) },
    include: { regels: true, klant: true },
  });

  if (!factuur) notFound();

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  const statusKleur: Record<string, string> = {
    openstaand: "badge-warning",
    betaald: "badge-success",
    te_laat: "badge-danger",
  };

  const isTeXLaat = factuur.status === "openstaand" && new Date(factuur.vervaldatum) < new Date();

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href={`/klanten/${id}`} className="btn btn-ghost btn-sm">
          <ArrowLeft size={15} />
          Terug naar {factuur.klant.name}
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <Receipt size={22} style={{ color: "var(--success)" }} />
          </div>
          <div>
            <h1 className="page-title">{factuur.nummer}</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
              <span className={`badge ${statusKleur[factuur.status] || "badge-warning"}`}>
                {factuur.status.replace("_", " ")}
              </span>
              {isTeXLaat && <span className="badge badge-danger">⚠ Vervallen</span>}
            </div>
          </div>
        </div>

        {/* Twee rijen knoppen */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <VerstuurEmailButton offerteId={factuur.id} klantEmail={factuur.klant.email} type="factuur" />
            <a href={`/api/facturen/${factuur.id}/pdf`} className="btn btn-ghost" target="_blank">PDF downloaden</a>
            <FactuurStatusButton factuurId={factuur.id} huidigStatus={factuur.status} klantId={Number(id)} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <VerwijderButton id={factuur.id} type="factuur" klantId={Number(id)} nummer={factuur.nummer} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card card-sm">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <User size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Klant</span>
          </div>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{factuur.klant.name}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{factuur.klant.email}</p>
        </div>

        <div className="card card-sm">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Calendar size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Datum</span>
          </div>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {new Date(factuur.datum).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p style={{ fontSize: "0.78rem", color: isTeXLaat ? "var(--danger)" : "var(--text-muted)", marginTop: 2 }}>
            Vervalt op {new Date(factuur.vervaldatum).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
          </p>
        </div>

        <div className="card card-sm">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Hash size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Totaal</span>
          </div>
          <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--success)", fontFamily: "var(--font-mono)" }}>{fmt(factuur.totaal)}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>Incl. BTW</p>
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
            {factuur.regels.map((regel) => (
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
              <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{fmt(factuur.subtotaal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--text-muted)" }}>BTW</span>
              <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{fmt(factuur.btwBedrag)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>Totaal</span>
              <span style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--success)", fontFamily: "var(--font-mono)" }}>
                {fmt(factuur.totaal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {factuur.notities && (
        <div className="card" style={{ marginTop: 24 }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Notities</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{factuur.notities}</p>
        </div>
      )}
    </div>
  );
}