import { prisma } from "@/lib/prisma";
import { Users, FileText, Receipt, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [klanten, offertes, facturen] = await Promise.all([
    prisma.customer.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.offerte.findMany({ include: { klant: true }, orderBy: { createdAt: "desc" } }),
    prisma.factuur.findMany({ include: { klant: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  const totaleOmzet = facturen
    .filter((f) => f.status === "betaald")
    .reduce((sum, f) => sum + f.totaal, 0);

  const openstaandBedrag = facturen
    .filter((f) => f.status === "openstaand" || f.status === "te_laat")
    .reduce((sum, f) => sum + f.totaal, 0);

  const openstaandeFacturen = facturen.filter(
    (f) => f.status === "openstaand" || f.status === "te_laat"
  );

  const teLaatFacturen = facturen.filter(
    (f) => f.status === "te_laat" || (f.status === "openstaand" && new Date(f.vervaldatum) < new Date())
  );

  const offertesInBehandeling = offertes.filter(
    (o) => o.status === "concept" || o.status === "verstuurd"
  );

  const now = new Date();
  const klantenDezeMailand = klanten.filter((k) => {
    const d = new Date(k.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const statusKleurOfferte: Record<string, string> = {
    concept: "badge-info",
    verstuurd: "badge-warning",
    geaccepteerd: "badge-success",
    afgewezen: "badge-danger",
  };

  const statusKleurFactuur: Record<string, string> = {
    openstaand: "badge-warning",
    betaald: "badge-success",
    te_laat: "badge-danger",
  };

  const recenteActiviteit = [
    ...offertes.slice(0, 5).map((o) => ({ type: "offerte", item: o, datum: o.createdAt })),
    ...facturen.slice(0, 5).map((f) => ({ type: "factuur", item: f, datum: f.createdAt })),
  ].sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()).slice(0, 8);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welkom terug — hier is je overzicht</p>
        </div>
      </div>

      {/* Hoofdstatistieken */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(79,124,255,0.06)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={16} style={{ color: "var(--accent-hover)" }} />
            </div>
            <p className="stat-label" style={{ marginBottom: 0 }}>Klanten</p>
          </div>
          <p className="stat-value">{klanten.length}</p>
          <p className="stat-sub">+{klantenDezeMailand.length} deze maand</p>
        </div>

        <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(52,211,153,0.06)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} style={{ color: "var(--success)" }} />
            </div>
            <p className="stat-label" style={{ marginBottom: 0 }}>Omzet</p>
          </div>
          <p className="stat-value" style={{ color: "var(--success)", fontFamily: "var(--font-mono)", fontSize: "1.4rem" }}>{fmt(totaleOmzet)}</p>
          <p className="stat-sub">Betaalde facturen</p>
        </div>

        <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(251,191,36,0.06)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(251,191,36,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={16} style={{ color: "var(--warning)" }} />
            </div>
            <p className="stat-label" style={{ marginBottom: 0 }}>Openstaand</p>
          </div>
          <p className="stat-value" style={{ color: openstaandBedrag > 0 ? "var(--warning)" : "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "1.4rem" }}>{fmt(openstaandBedrag)}</p>
          <p className="stat-sub">{openstaandeFacturen.length} facturen open</p>
        </div>

        <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(239,68,68,0.06)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={16} style={{ color: "var(--danger)" }} />
            </div>
            <p className="stat-label" style={{ marginBottom: 0 }}>Te laat</p>
          </div>
          <p className="stat-value" style={{ color: teLaatFacturen.length > 0 ? "var(--danger)" : "var(--text-primary)" }}>{teLaatFacturen.length}</p>
          <p className="stat-sub">Vervallen facturen</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Openstaande facturen */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Receipt size={16} style={{ color: "var(--success)" }} />
            </div>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Openstaande facturen</h2>
          </div>

          {openstaandeFacturen.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <CheckCircle size={28} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
              <p style={{ marginTop: 8 }}>Alles betaald! 🎉</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {openstaandeFacturen.slice(0, 5).map((f) => {
                const isTeXLaat = new Date(f.vervaldatum) < new Date();
                return (
                  <Link key={f.id} href={`/klanten/${f.klantId}/factuur/${f.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 12px", borderRadius: 8,
                      background: "var(--bg-elevated)",
                      border: `1px solid ${isTeXLaat ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                    }}>
                      <div>
                        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{f.nummer}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{f.klant.name}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: isTeXLaat ? "var(--danger)" : "var(--success)", fontFamily: "var(--font-mono)" }}>
                          {fmt(f.totaal)}
                        </p>
                        <p style={{ fontSize: "0.7rem", color: isTeXLaat ? "var(--danger)" : "var(--text-muted)", marginTop: 2 }}>
                          {isTeXLaat ? "⚠ Vervallen" : `Vervalt ${new Date(f.vervaldatum).toLocaleDateString("nl-NL")}`}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Offertes in behandeling */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={16} style={{ color: "var(--accent-hover)" }} />
            </div>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Offertes in behandeling</h2>
          </div>

          {offertesInBehandeling.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <FileText size={28} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
              <p style={{ marginTop: 8 }}>Geen openstaande offertes</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {offertesInBehandeling.slice(0, 5).map((o) => (
                <Link key={o.id} href={`/klanten/${o.klantId}/offerte/${o.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 8,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                  }}>
                    <div>
                      <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{o.nummer}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{o.klant.name}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-hover)", fontFamily: "var(--font-mono)" }}>
                        {fmt(o.totaal)}
                      </p>
                      <span className={`badge ${statusKleurOfferte[o.status]}`} style={{ marginTop: 4, display: "inline-block" }}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recente activiteit */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(251,191,36,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock size={16} style={{ color: "var(--warning)" }} />
          </div>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Recente activiteit</h2>
        </div>

        {recenteActiviteit.length === 0 ? (
          <div className="empty-state">
            <p>Nog geen activiteit</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ margin: 0 }}>
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Nummer</th>
                  <th>Klant</th>
                  <th>Bedrag</th>
                  <th>Status</th>
                  <th>Datum</th>
                </tr>
              </thead>
              <tbody>
                {recenteActiviteit.map((a, i) => (
                  <tr key={i}>
                    <td>
                      <span className={`badge ${a.type === "offerte" ? "badge-info" : "badge-success"}`}>
                        {a.type === "offerte" ? "Offerte" : "Factuur"}
                      </span>
                    </td>
                    <td className="name-cell">
                      <Link
                        href={`/klanten/${a.item.klantId}/${a.type}/${a.item.id}`}
                        style={{ color: "var(--accent-hover)", textDecoration: "none", fontWeight: 600 }}
                      >
                        {a.item.nummer}
                      </Link>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{a.item.klant.name}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 600 }}>
                      {fmt(a.item.totaal)}
                    </td>
                    <td>
                      <span className={`badge ${a.type === "offerte" ? statusKleurOfferte[a.item.status] : statusKleurFactuur[a.item.status]}`}>
                        {a.item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {new Date(a.datum).toLocaleDateString("nl-NL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}