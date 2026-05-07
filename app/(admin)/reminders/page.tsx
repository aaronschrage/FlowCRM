import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Bell, CheckCircle, ArrowRight } from "lucide-react";
import StuurReminderButton from "./StuurReminderButton";

export default async function RemindersPage() {
  const facturen = await prisma.factuur.findMany({
    where: { status: { in: ["openstaand", "te_laat"] } },
    include: { klant: true },
    orderBy: { vervaldatum: "asc" },
  });

  const nu = new Date();

  const teLaat = facturen.filter((f) => new Date(f.vervaldatum) < nu);
  const binaVervallen = facturen.filter((f) => {
    const dagen = Math.ceil((new Date(f.vervaldatum).getTime() - nu.getTime()) / (1000 * 60 * 60 * 24));
    return dagen >= 0 && dagen <= 7;
  });
  const openstaand = facturen.filter((f) => {
    const dagen = Math.ceil((new Date(f.vervaldatum).getTime() - nu.getTime()) / (1000 * 60 * 60 * 24));
    return dagen > 7;
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  const DagenLabel = ({ vervaldatum }: { vervaldatum: Date }) => {
    const dagen = Math.ceil((new Date(vervaldatum).getTime() - nu.getTime()) / (1000 * 60 * 60 * 24));
    if (dagen < 0) return <span style={{ color: "var(--danger)", fontSize: "0.75rem", fontWeight: 600 }}>{Math.abs(dagen)} dagen te laat</span>;
    if (dagen === 0) return <span style={{ color: "var(--danger)", fontSize: "0.75rem", fontWeight: 600 }}>Vervalt vandaag!</span>;
    return <span style={{ color: dagen <= 7 ? "var(--warning)" : "var(--text-muted)", fontSize: "0.75rem" }}>Vervalt over {dagen} dagen</span>;
  };

  const FactuurRij = ({ f }: { f: typeof facturen[0] }) => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px", borderRadius: 10,
      background: "var(--bg-elevated)",
      border: `1px solid ${new Date(f.vervaldatum) < nu ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{f.nummer}</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{f.klant.name}</p>
        </div>
        <DagenLabel vervaldatum={f.vervaldatum} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", fontWeight: 700, color: new Date(f.vervaldatum) < nu ? "var(--danger)" : "var(--warning)" }}>
          {fmt(f.totaal)}
        </span>
        <StuurReminderButton factuurId={f.id} klantNaam={f.klant.name} factuurNummer={f.nummer} />
        <Link href={`/klanten/${f.klantId}/factuur/${f.id}`} className="btn btn-ghost btn-sm">
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reminders</h1>
          <p className="page-subtitle">Openstaande facturen die aandacht nodig hebben</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <p className="stat-label">Vervallen</p>
          <p className="stat-value" style={{ color: teLaat.length > 0 ? "var(--danger)" : "var(--text-primary)" }}>{teLaat.length}</p>
          <p className="stat-sub">{fmt(teLaat.reduce((s, f) => s + f.totaal, 0))}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Bijna vervallen</p>
          <p className="stat-value" style={{ color: binaVervallen.length > 0 ? "var(--warning)" : "var(--text-primary)" }}>{binaVervallen.length}</p>
          <p className="stat-sub">Binnen 7 dagen</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Openstaand</p>
          <p className="stat-value">{openstaand.length}</p>
          <p className="stat-sub">{fmt(openstaand.reduce((s, f) => s + f.totaal, 0))}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Totaal open</p>
          <p className="stat-value" style={{ color: "var(--warning)", fontFamily: "var(--font-mono)", fontSize: "1.2rem" }}>
            {fmt(facturen.reduce((s, f) => s + f.totaal, 0))}
          </p>
          <p className="stat-sub">Te ontvangen</p>
        </div>
      </div>

      {facturen.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: "48px 0" }}>
            <CheckCircle size={40} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
            <p style={{ marginTop: 12, fontSize: "1rem" }}>Alles betaald! 🎉</p>
            <p style={{ fontSize: "0.85rem", marginTop: 4 }}>Geen openstaande facturen.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {teLaat.length > 0 && (
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={16} style={{ color: "var(--danger)" }} />
                </div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--danger)" }}>Vervallen ({teLaat.length})</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {teLaat.map((f) => <FactuurRij key={f.id} f={f} />)}
              </div>
            </div>
          )}

          {binaVervallen.length > 0 && (
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(251,191,36,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={16} style={{ color: "var(--warning)" }} />
                </div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--warning)" }}>Bijna vervallen ({binaVervallen.length})</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {binaVervallen.map((f) => <FactuurRij key={f.id} f={f} />)}
              </div>
            </div>
          )}

          {openstaand.length > 0 && (
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={16} style={{ color: "var(--accent-hover)" }} />
                </div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Openstaand ({openstaand.length})</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {openstaand.map((f) => <FactuurRij key={f.id} f={f} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}