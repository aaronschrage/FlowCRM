import Link from "next/link";
import { requirePortalSession } from "@/lib/portal-session";
import { prisma } from "@/lib/prisma";
import { Receipt, FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

export default async function PortalDashboardPage() {
  const { customerId } = await requirePortalSession();

  const [klant, offertes, facturen] = await Promise.all([
    prisma.customer.findUniqueOrThrow({ where: { id: customerId } }),
    prisma.offerte.findMany({ where: { klantId: customerId }, orderBy: { datum: "desc" } }),
    prisma.factuur.findMany({ where: { klantId: customerId }, orderBy: { datum: "desc" } }),
  ]);

  const openstaandeFacturen = facturen.filter(
    (f) => f.status === "openstaand" || f.status === "te_laat",
  );
  const betaaldeFacturen = facturen.filter((f) => f.status === "betaald");
  const teAccepterenOffertes = offertes.filter((o) => o.status === "verstuurd");

  const openstaandTotaal = openstaandeFacturen.reduce((s, f) => s + f.totaal, 0);
  const betaaldTotaal = betaaldeFacturen.reduce((s, f) => s + f.totaal, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welkom, {klant.name}</h1>
        <p className="page-subtitle">Hier is een overzicht van jouw offertes en facturen</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(251,191,36,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={16} style={{ color: "var(--warning)" }} />
            </div>
            <p className="stat-label" style={{ marginBottom: 0 }}>Openstaand</p>
          </div>
          <p className="stat-value" style={{ color: openstaandTotaal > 0 ? "var(--warning)" : "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "1.4rem" }}>
            {fmt(openstaandTotaal)}
          </p>
          <p className="stat-sub">{openstaandeFacturen.length} {openstaandeFacturen.length === 1 ? "factuur" : "facturen"} open</p>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={16} style={{ color: "var(--accent-hover)" }} />
            </div>
            <p className="stat-label" style={{ marginBottom: 0 }}>Te accepteren</p>
          </div>
          <p className="stat-value" style={{ color: teAccepterenOffertes.length > 0 ? "var(--accent-hover)" : "var(--text-primary)" }}>
            {teAccepterenOffertes.length}
          </p>
          <p className="stat-sub">{teAccepterenOffertes.length === 1 ? "offerte wacht" : "offertes wachten"} op jou</p>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} style={{ color: "var(--success)" }} />
            </div>
            <p className="stat-label" style={{ marginBottom: 0 }}>Betaald</p>
          </div>
          <p className="stat-value" style={{ color: "var(--success)", fontFamily: "var(--font-mono)", fontSize: "1.4rem" }}>
            {fmt(betaaldTotaal)}
          </p>
          <p className="stat-sub">{betaaldeFacturen.length} {betaaldeFacturen.length === 1 ? "factuur" : "facturen"} betaald</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Te accepteren offertes */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={16} style={{ color: "var(--accent-hover)" }} />
              </div>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Te accepteren offertes
              </h2>
            </div>
            <Link href="/portal/offertes" style={{ fontSize: "0.78rem", color: "var(--accent-hover)", textDecoration: "none" }}>
              Alles bekijken →
            </Link>
          </div>

          {teAccepterenOffertes.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <CheckCircle size={28} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
              <p style={{ marginTop: 8 }}>Geen offertes te accepteren</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {teAccepterenOffertes.map((o) => (
                <Link key={o.id} href={`/portal/offertes/${o.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 8,
                    background: "var(--bg-elevated)",
                    border: "1px solid rgba(79,124,255,0.2)",
                  }}>
                    <div>
                      <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{o.nummer}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                        Geldig tot {new Date(o.geldigTot).toLocaleDateString("nl-NL")}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-hover)", fontFamily: "var(--font-mono)" }}>
                        {fmt(o.totaal)}
                      </p>
                      <span className="badge badge-info" style={{ marginTop: 4, display: "inline-block" }}>
                        Te accepteren
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Openstaande facturen */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(251,191,36,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Receipt size={16} style={{ color: "var(--warning)" }} />
              </div>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Openstaande facturen
              </h2>
            </div>
            <Link href="/portal/facturen" style={{ fontSize: "0.78rem", color: "var(--accent-hover)", textDecoration: "none" }}>
              Alles bekijken →
            </Link>
          </div>

          {openstaandeFacturen.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <CheckCircle size={28} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
              <p style={{ marginTop: 8 }}>Alles betaald!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {openstaandeFacturen.map((f) => {
                const isTeXLaat = f.status === "te_laat" || new Date(f.vervaldatum) < new Date();
                return (
                  <Link key={f.id} href={`/portal/facturen/${f.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 12px", borderRadius: 8,
                      background: "var(--bg-elevated)",
                      border: `1px solid ${isTeXLaat ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                    }}>
                      <div>
                        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{f.nummer}</p>
                        <p style={{ fontSize: "0.72rem", color: isTeXLaat ? "var(--danger)" : "var(--text-muted)", marginTop: 2 }}>
                          {isTeXLaat
                            ? "Vervallen"
                            : `Vervalt ${new Date(f.vervaldatum).toLocaleDateString("nl-NL")}`}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: isTeXLaat ? "var(--danger)" : "var(--warning)", fontFamily: "var(--font-mono)" }}>
                          {fmt(f.totaal)}
                        </p>
                        <span className={`badge ${isTeXLaat ? "badge-danger" : "badge-warning"}`} style={{ marginTop: 4, display: "inline-block" }}>
                          {isTeXLaat ? "Te laat" : "Openstaand"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
