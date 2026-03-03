import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default async function OffertesPage() {
  const offertes = await prisma.offerte.findMany({
    include: { klant: true },
    orderBy: { createdAt: "desc" },
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  const statusKleur: Record<string, string> = {
    concept: "badge-info",
    verstuurd: "badge-warning",
    geaccepteerd: "badge-success",
    afgewezen: "badge-danger",
  };

  const totaal = offertes.reduce((sum, o) => sum + o.totaal, 0);
  const geaccepteerd = offertes.filter((o) => o.status === "geaccepteerd").length;
  const verstuurd = offertes.filter((o) => o.status === "verstuurd").length;
  const concept = offertes.filter((o) => o.status === "concept").length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Offertes</h1>
          <p className="page-subtitle">{offertes.length} offerte{offertes.length !== 1 ? "s" : ""} in totaal</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <p className="stat-label">Totaal waarde</p>
          <p className="stat-value" style={{ fontSize: "1.4rem", fontFamily: "var(--font-mono)", color: "var(--accent-hover)" }}>{fmt(totaal)}</p>
          <p className="stat-sub">Alle offertes</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Geaccepteerd</p>
          <p className="stat-value" style={{ color: "var(--success)" }}>{geaccepteerd}</p>
          <p className="stat-sub">Goedgekeurd</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Verstuurd</p>
          <p className="stat-value" style={{ color: "var(--warning)" }}>{verstuurd}</p>
          <p className="stat-sub">Wacht op reactie</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Concept</p>
          <p className="stat-value">{concept}</p>
          <p className="stat-sub">Nog niet verstuurd</p>
        </div>
      </div>

      {offertes.length === 0 ? (
        <div className="table-wrapper">
          <div className="empty-state">
            <FileText size={32} strokeWidth={1.5} style={{ margin: "0 auto", opacity: 0.3 }} />
            <p>Nog geen offertes aangemaakt.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Nummer</th>
                <th>Klant</th>
                <th>Datum</th>
                <th>Geldig tot</th>
                <th style={{ textAlign: "right" }}>Bedrag</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offertes.map((o) => (
                <tr key={o.id}>
                  <td className="name-cell" style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 600 }}>
                    {o.nummer}
                  </td>
                  <td>
                    <Link href={`/klanten/${o.klantId}`} style={{ color: "var(--accent-hover)", textDecoration: "none" }}>
                      {o.klant.name}
                    </Link>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {new Date(o.datum).toLocaleDateString("nl-NL")}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {new Date(o.geldigTot).toLocaleDateString("nl-NL")}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-hover)" }}>
                    {fmt(o.totaal)}
                  </td>
                  <td>
                    <span className={`badge ${statusKleur[o.status] || "badge-info"}`}>{o.status}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link href={`/klanten/${o.klantId}/offerte/${o.id}`} className="btn btn-ghost btn-sm">
                      Bekijk
                      <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}