import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Hash, Receipt, Landmark, CheckCircle } from "lucide-react";
import { requirePortalSession } from "@/lib/portal-session";
import { prisma } from "@/lib/prisma";
import { FactuurActies } from "./FactuurActies";

const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

const fmtDatum = (d: Date | string) =>
  new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

const STATUS_LABEL: Record<string, string> = {
  openstaand: "Openstaand",
  betaald: "Betaald",
  te_laat: "Te laat",
};

const STATUS_BADGE: Record<string, string> = {
  openstaand: "badge-warning",
  betaald: "badge-success",
  te_laat: "badge-danger",
};

export default async function PortalFactuurDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { customerId } = await requirePortalSession();
  const { id } = await params;
  const factuurId = parseInt(id, 10);
  if (isNaN(factuurId)) notFound();

  const [factuur, instellingen] = await Promise.all([
    prisma.factuur.findUnique({
      where: { id: factuurId },
      include: { regels: { orderBy: { id: "asc" } } },
    }),
    prisma.instelling.findMany(),
  ]);

  if (!factuur || factuur.klantId !== customerId) notFound();

  const inst = Object.fromEntries(instellingen.map((i) => [i.sleutel, i.waarde]));

  const now = new Date();
  const isVervallen = new Date(factuur.vervaldatum) < now && factuur.status !== "betaald";
  const effectiefStatus =
    isVervallen && factuur.status === "openstaand" ? "te_laat" : factuur.status;
  const isBetaald = factuur.status === "betaald";
  const isOpenstaand = !isBetaald;

  // BTW per tarief
  const btwPerTarief = new Map<number, number>();
  for (const r of factuur.regels) {
    const btwBedrag = r.totaal * (r.btw / 100);
    btwPerTarief.set(r.btw, (btwPerTarief.get(r.btw) ?? 0) + btwBedrag);
  }
  const btwTarieven = Array.from(btwPerTarief.entries()).sort((a, b) => b[0] - a[0]);

  return (
    <div>
      {/* ── Terug knop ── */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/portal/facturen"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem",
          }}
        >
          <ArrowLeft size={15} />
          Terug naar facturen
        </Link>
      </div>

      {/* ── Page header ── */}
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title" style={{ fontFamily: "var(--font-mono)" }}>
            {factuur.nummer}
          </h1>
          <p className="page-subtitle">Factuur detail</p>
        </div>
        <span
          className={`badge ${STATUS_BADGE[effectiefStatus] ?? "badge-info"}`}
          style={{ fontSize: "0.82rem", padding: "5px 14px", marginTop: 4 }}
        >
          {STATUS_LABEL[effectiefStatus] ?? effectiefStatus}
        </span>
      </div>

      {/* ── Betaald success card ── */}
      {isBetaald && (
        <div className="card card-sm" style={{ marginBottom: 20, borderColor: "rgba(52,211,153,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: "rgba(52,211,153,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CheckCircle size={18} style={{ color: "var(--success)" }} />
          </div>
          <div>
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--success)" }}>Factuur betaald</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
              Bedankt voor je betaling.
            </p>
          </div>
        </div>
      )}

      {/* ── Meta + Afzender ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
        {/* Datums */}
        <div className="card card-sm">
          <p className="stat-label" style={{ marginBottom: 14 }}>Factuur details</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Factuurdatum</span>
              <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                {fmtDatum(factuur.datum)}
              </span>
            </div>
            <div style={{ height: 1, background: "var(--border-base)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Vervaldatum</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: "0.82rem", fontFamily: "var(--font-mono)", fontWeight: 600,
                  color: isVervallen ? "var(--danger)" : "var(--text-primary)",
                }}>
                  {fmtDatum(factuur.vervaldatum)}
                </span>
                {isVervallen && (
                  <span style={{ fontSize: "0.72rem", background: "rgba(248,113,113,0.1)", color: "var(--danger)", padding: "2px 7px", borderRadius: 99, whiteSpace: "nowrap" }}>
                    Te laat
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Afzender */}
        {(inst.bedrijfsnaam || inst.kvk || inst.btwnummer || inst.iban) && (
          <div className="card card-sm">
            <p className="stat-label" style={{ marginBottom: 14 }}>Afzender</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {inst.bedrijfsnaam && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {inst.bedrijfsnaam}
                  </span>
                </div>
              )}
              {inst.kvk && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Hash size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    KvK: <span style={{ fontFamily: "var(--font-mono)" }}>{inst.kvk}</span>
                  </span>
                </div>
              )}
              {inst.btwnummer && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Receipt size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    BTW: <span style={{ fontFamily: "var(--font-mono)" }}>{inst.btwnummer}</span>
                  </span>
                </div>
              )}
              {inst.iban && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Landmark size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    IBAN: <span style={{ fontFamily: "var(--font-mono)" }}>{inst.iban}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Regels tabel ── */}
      <div className="table-wrapper" style={{ marginBottom: 16 }}>
        <table className="crm-table">
          <thead>
            <tr>
              <th style={{ width: "45%" }}>Omschrijving</th>
              <th style={{ textAlign: "right" }}>Aantal</th>
              <th style={{ textAlign: "right" }}>Prijs</th>
              <th style={{ textAlign: "right" }}>BTW</th>
              <th style={{ textAlign: "right" }}>Bedrag (excl.)</th>
            </tr>
          </thead>
          <tbody>
            {factuur.regels.map((r) => (
              <tr key={r.id}>
                <td style={{ color: "var(--text-primary)" }}>{r.omschrijving}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                  {r.aantal % 1 === 0 ? r.aantal.toFixed(0) : r.aantal}
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                  {fmt(r.eenheidsprijs)}
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  {r.btw}%
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {fmt(r.totaal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totalen ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <div className="card card-sm" style={{ minWidth: 280, width: "100%", maxWidth: 380 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Subtotaal (excl. BTW)</span>
              <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                {fmt(factuur.subtotaal)}
              </span>
            </div>
            {btwTarieven.map(([tarief, bedrag]) => (
              <div key={tarief} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>BTW {tarief}%</span>
                <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                  {fmt(bedrag)}
                </span>
              </div>
            ))}
            <div style={{ height: 1, background: "var(--border-base)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>Totaal (incl. BTW)</span>
              <span style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: isBetaald ? "var(--success)" : "var(--accent-hover)" }}>
                {fmt(factuur.totaal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Betaalreferentie (alleen als niet betaald) ── */}
      {isOpenstaand && (
        <div className="card card-sm" style={{ marginBottom: 20, borderColor: "rgba(79,124,255,0.2)" }}>
          <p className="stat-label" style={{ marginBottom: 12 }}>Betaalinformatie</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Onder vermelding van</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                {factuur.nummer}
              </span>
            </div>
            {inst.iban && (
              <>
                <div style={{ height: 1, background: "var(--border-base)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>IBAN</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.06em" }}>
                    {inst.iban}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Notities ── */}
      {factuur.notities && (
        <div className="card card-sm" style={{ marginBottom: 20 }}>
          <p className="stat-label" style={{ marginBottom: 8 }}>Notities</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {factuur.notities}
          </p>
        </div>
      )}

      {/* ── Actie knoppen ── */}
      <div className="card card-sm" style={{ borderColor: isBetaald ? "rgba(52,211,153,0.2)" : "rgba(79,124,255,0.2)" }}>
        {isOpenstaand && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
            Betaal deze factuur vóór{" "}
            <span style={{ color: isVervallen ? "var(--danger)" : "var(--text-primary)", fontWeight: 600 }}>
              {fmtDatum(factuur.vervaldatum)}
            </span>{" "}
            onder vermelding van{" "}
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>
              {factuur.nummer}
            </span>.
          </p>
        )}
        <FactuurActies
          factuurId={factuur.id}
          factuurNummer={factuur.nummer}
          betaald={isBetaald}
        />
      </div>
    </div>
  );
}
