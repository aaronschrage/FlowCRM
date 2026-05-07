import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, FileText, Receipt, Clock, MessageSquare } from "lucide-react";
import VerwijderKlantButton from "@/components/VerwijderKlantButton";
import BewerkKlantButton from "@/components/BewerkKlantButton";
import NotitiesClient from "@/components/NotitiesClient";

export default async function KlantDetailPage(props: any) {
  const { id } = await props.params;

  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
    include: {
      offertes: { include: { regels: true }, orderBy: { createdAt: "desc" } },
      facturen: { include: { regels: true }, orderBy: { createdAt: "desc" } },
      notities: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!customer) notFound();

  const initials = customer.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const lidSinds = new Date(customer.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  const offerteKleur: Record<string, string> = {
    concept: "badge-info", verstuurd: "badge-warning", geaccepteerd: "badge-success", afgewezen: "badge-danger",
  };
  const factuurKleur: Record<string, string> = {
    openstaand: "badge-warning", betaald: "badge-success", te_laat: "badge-danger",
  };

  const openstaand = customer.facturen
    .filter((f) => f.status === "openstaand" || f.status === "te_laat")
    .reduce((sum, f) => sum + f.totaal, 0);

  return (
    <div style={{ maxWidth: 1200 }}>
      <style>{`
        .offerte-kaart { transition: border-color 0.15s, background 0.15s; }
        .offerte-kaart:hover { border-color: var(--accent) !important; background: var(--bg-hover) !important; }
        .factuur-kaart { transition: border-color 0.15s, background 0.15s; }
        .factuur-kaart:hover { border-color: var(--success) !important; background: var(--bg-hover) !important; }
      `}</style>

      <Link href="/klanten" className="btn btn-ghost btn-sm" style={{ marginBottom: 28, display: "inline-flex" }}>
        <ArrowLeft size={15} />
        Terug naar klanten
      </Link>

      <div className="card" style={{ marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,124,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent) 0%, #7c5cfc 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, color: "white", flexShrink: 0, boxShadow: "0 0 32px rgba(79,124,255,0.25)" }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{customer.name}</h1>
            <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <Mail size={14} style={{ opacity: 0.5 }} />{customer.email}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <Clock size={14} style={{ opacity: 0.5 }} />Klant sinds {lidSinds}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <BewerkKlantButton klantId={customer.id} huidigNaam={customer.name} huidigEmail={customer.email} />
            <VerwijderKlantButton klantId={customer.id} klantNaam={customer.name} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <p className="stat-label">Offertes</p>
          <p className="stat-value" style={{ fontSize: "1.6rem" }}>{customer.offertes.length}</p>
          <p className="stat-sub">Totaal verstuurd</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Facturen</p>
          <p className="stat-value" style={{ fontSize: "1.6rem" }}>{customer.facturen.length}</p>
          <p className="stat-sub">Totaal gefactureerd</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Openstaand</p>
          <p className="stat-value" style={{ fontSize: "1.6rem", color: openstaand > 0 ? "var(--warning)" : "var(--success)" }}>{fmt(openstaand)}</p>
          <p className="stat-sub">Te ontvangen</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={16} style={{ color: "var(--accent-hover)" }} />
              </div>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Offertes</h2>
            </div>
            <Link href={`/klanten/${customer.id}/offerte/nieuw`} className="btn btn-primary btn-sm">+ Nieuwe offerte</Link>
          </div>
          {customer.offertes.length === 0 ? (
            <div className="empty-state" style={{ padding: "32px 20px" }}>
              <FileText size={28} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
              <p style={{ marginTop: 8 }}>Nog geen offertes</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {customer.offertes.map((o) => (
                <Link key={o.id} href={`/klanten/${customer.id}/offerte/${o.id}`} style={{ textDecoration: "none" }}>
                  <div className="offerte-kaart" style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{o.nummer}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString("nl-NL")}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--accent-hover)", fontWeight: 600 }}>{fmt(o.totaal)}</span>
                      <span className={`badge ${offerteKleur[o.status] || "badge-info"}`}>{o.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Receipt size={16} style={{ color: "var(--success)" }} />
              </div>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Facturen</h2>
            </div>
            <Link href={`/klanten/${customer.id}/factuur/nieuw`} className="btn btn-ghost btn-sm">+ Nieuwe factuur</Link>
          </div>
          {customer.facturen.length === 0 ? (
            <div className="empty-state" style={{ padding: "32px 20px" }}>
              <Receipt size={28} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
              <p style={{ marginTop: 8 }}>Nog geen facturen</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {customer.facturen.map((f) => (
                <Link key={f.id} href={`/klanten/${customer.id}/factuur/${f.id}`} style={{ textDecoration: "none" }}>
                  <div className="factuur-kaart" style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{f.nummer}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{new Date(f.createdAt).toLocaleDateString("nl-NL")}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--success)", fontWeight: 600 }}>{fmt(f.totaal)}</span>
                      <span className={`badge ${factuurKleur[f.status] || "badge-warning"}`}>{f.status.replace("_", " ")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notities */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(251,191,36,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MessageSquare size={15} style={{ color: "var(--warning)" }} />
          </div>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Notities {customer.notities.length > 0 && <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({customer.notities.length})</span>}
          </h2>
        </div>
        <NotitiesClient klantId={customer.id} bestaandeNotities={customer.notities} />
      </div>
    </div>
  );
}