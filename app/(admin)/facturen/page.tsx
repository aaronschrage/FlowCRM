import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Receipt, ArrowRight } from "lucide-react";

export default async function FacturenPage() {
  const facturen = await prisma.factuur.findMany({
    include: { klant: true },
    orderBy: { createdAt: "desc" },
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  const statusKleur: Record<string, string> = {
    openstaand: "badge-warning",
    betaald: "badge-success",
    te_laat: "badge-danger",
  };

  const totaleOmzet = facturen.filter((f) => f.status === "betaald").reduce((sum, f) => sum + f.totaal, 0);
  const openstaand = facturen.filter((f) => f.status === "openstaand" || f.status === "te_laat").reduce((sum, f) => sum + f.totaal, 0);
  const betaald = facturen.filter((f) => f.status === "betaald").length;
  const teLaat = facturen.filter((f) => f.status === "te_laat" || (f.status === "openstaand" && new Date(f.vervaldatum) < new Date())).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Facturen</h1>
          <p className="page-subtitle">{facturen.length} factuur{facturen.length !== 1 ? "en" : ""} in totaal</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <p className="stat-label">Totale omzet</p>
          <p className="stat-value" style={{ fontSize: "1.4rem", fontFamily: "var(--font-mono)", color: "var(--success)" }}>{fmt(totaleOmzet)}</p>
          <p className="stat-sub">Betaalde facturen</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Openstaand</p>
          <p className="stat-value" style={{ fontSize: "1.4rem", fontFamily: "var(--font-mono)", color: openstaand > 0 ? "var(--warning)" : "var(--text-primary)" }}>{fmt(openstaand)}</p>
          <p className="stat-sub">Te ontvangen</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Betaald</p>
          <p className="stat-value" style={{ color: "var(--success)" }}>{betaald}</p>
          <p className="stat-sub">Afgerond</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Te laat</p>
          <p className="stat-value" style={{ color: teLaat > 0 ? "var(--danger)" : "var(--text-primary)" }}>{teLaat}</p>
          <p className="stat-sub">Vervallen</p>
        </div>
      </div>

      {facturen.length === 0 ? (
        <div className="table-wrapper">
          <div className="empty-state">
            <Receipt size={32} strokeWidth={1.5} style={{ margin: "0 auto", opacity: 0.3 }} />
            <p>Nog geen facturen aangemaakt.</p>
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
                <th>Vervaldatum</th>
                <th style={{ textAlign: "right" }}>Bedrag</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {facturen.map((f) => {
                const isTeXLaat = f.status === "openstaand" && new Date(f.vervaldatum) < new Date();
                return (
                  <tr key={f.id}>
                    <td className="name-cell" style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 600 }}>
                      {f.nummer}
                    </td>
                    <td>
                      <Link href={`/klanten/${f.klantId}`} style={{ color: "var(--accent-hover)", textDecoration: "none" }}>
                        {f.klant.name}
                      </Link>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {new Date(f.datum).toLocaleDateString("nl-NL")}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: isTeXLaat ? "var(--danger)" : "var(--text-muted)" }}>
                      {new Date(f.vervaldatum).toLocaleDateString("nl-NL")}
                      {isTeXLaat && " ⚠"}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600, color: "var(--success)" }}>
                      {fmt(f.totaal)}
                    </td>
                    <td>
                      <span className={`badge ${statusKleur[f.status] || "badge-warning"}`}>
                        {f.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link href={`/klanten/${f.klantId}/factuur/${f.id}`} className="btn btn-ghost btn-sm">
                        Bekijk
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}