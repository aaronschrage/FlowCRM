import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Hash, Receipt } from "lucide-react";
import { requirePortalSession } from "@/lib/portal-session";
import { prisma } from "@/lib/prisma";
import { OfferteActies } from "./OfferteActies";

const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

const fmtDatum = (d: Date | string) =>
  new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

const STATUS_LABEL: Record<string, string> = {
  concept: "Concept",
  verstuurd: "Te accepteren",
  geaccepteerd: "Geaccepteerd",
  afgewezen: "Afgewezen",
};

const STATUS_BADGE: Record<string, string> = {
  concept: "badge-info",
  verstuurd: "badge-warning",
  geaccepteerd: "badge-success",
  afgewezen: "badge-danger",
};

export default async function PortalOfferteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { customerId } = await requirePortalSession();
  const { id } = await params;
  const offerteId = parseInt(id, 10);
  if (isNaN(offerteId)) notFound();

  const [offerte, instellingen] = await Promise.all([
    prisma.offerte.findUnique({
      where: { id: offerteId },
      include: { regels: { orderBy: { id: "asc" } } },
    }),
    prisma.instelling.findMany(),
  ]);

  if (!offerte || offerte.klantId !== customerId) notFound();

  const inst = Object.fromEntries(instellingen.map((i) => [i.sleutel, i.waarde]));

  const now = new Date();
  const isVerlopen = new Date(offerte.geldigTot) < now;
  const isVerstuurd = offerte.status === "verstuurd";

  // BTW per tarief
  const btwPerTarief = new Map<number, number>();
  for (const r of offerte.regels) {
    const btwBedrag = r.totaal * (r.btw / 100);
    btwPerTarief.set(r.btw, (btwPerTarief.get(r.btw) ?? 0) + btwBedrag);
  }
  const btwTarieven = Array.from(btwPerTarief.entries()).sort((a, b) => b[0] - a[0]);
  const meerdereBoS = btwTarieven.length > 1;

  return (
    <div>
      {/* ── Terug knop ── */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/portal/offertes"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "var(--text-secondary)", textDecoration: "none",
            fontSize: "0.85rem", transition: "color 0.15s",
          }}
          className="back-link"
        >
          <ArrowLeft size={15} />
          Terug naar offertes
        </Link>
      </div>

      {/* ── Page header ── */}
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title" style={{ fontFamily: "var(--font-mono)" }}>
            {offerte.nummer}
          </h1>
          <p className="page-subtitle">Offerte detail</p>
        </div>
        <span className={`badge ${STATUS_BADGE[offerte.status] ?? "badge-info"}`} style={{ fontSize: "0.82rem", padding: "5px 14px", marginTop: 4 }}>
          {STATUS_LABEL[offerte.status] ?? offerte.status}
        </span>
      </div>

      {/* ── Meta + Afzender ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
        {/* Datums */}
        <div className="card card-sm">
          <p className="stat-label" style={{ marginBottom: 14 }}>Offerte details</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Datum</span>
              <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                {fmtDatum(offerte.datum)}
              </span>
            </div>
            <div style={{ height: 1, background: "var(--border-base)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Geldig tot</span>
              <span style={{
                fontSize: "0.82rem", fontFamily: "var(--font-mono)",
                fontWeight: 600,
                color: isVerlopen && isVerstuurd ? "var(--danger)" : "var(--text-primary)",
              }}>
                {fmtDatum(offerte.geldigTot)}
                {isVerlopen && isVerstuurd && (
                  <span style={{ marginLeft: 6, fontSize: "0.72rem", background: "rgba(248,113,113,0.1)", color: "var(--danger)", padding: "2px 7px", borderRadius: 99 }}>
                    Verlopen
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Afzender */}
        {(inst.bedrijfsnaam || inst.kvk || inst.btwnummer) && (
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
            {offerte.regels.map((r) => (
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
                {fmt(offerte.subtotaal)}
              </span>
            </div>

            {btwTarieven.map(([tarief, bedrag]) => (
              <div key={tarief} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  BTW {tarief}%{meerdereBoS ? "" : ""}
                </span>
                <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                  {fmt(bedrag)}
                </span>
              </div>
            ))}

            <div style={{ height: 1, background: "var(--border-base)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>Totaal (incl. BTW)</span>
              <span style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent-hover)" }}>
                {fmt(offerte.totaal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interne notities ── */}
      {offerte.notities && (
        <div className="card card-sm" style={{ marginBottom: 24 }}>
          <p className="stat-label" style={{ marginBottom: 8 }}>Notities</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {offerte.notities}
          </p>
        </div>
      )}

      {/* ── Klant opmerking (na actie) ── */}
      {offerte.clientNotes && (
        <div className="card card-sm" style={{
          marginBottom: 24,
          borderColor: offerte.status === "geaccepteerd" ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)",
        }}>
          <p className="stat-label" style={{ marginBottom: 8 }}>
            {offerte.status === "geaccepteerd" ? "Opmerking bij acceptatie" : "Reden voor afwijzing"}
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {offerte.clientNotes}
          </p>
          {offerte.acceptedAt && (
            <p style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {fmtDatum(offerte.acceptedAt)}
            </p>
          )}
          {offerte.rejectedAt && (
            <p style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {fmtDatum(offerte.rejectedAt)}
            </p>
          )}
        </div>
      )}

      {/* ── Actie knoppen (alleen bij status verstuurd) ── */}
      {isVerstuurd && (
        <div className="card card-sm" style={{ borderColor: "rgba(79,124,255,0.2)" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
            Bekijk de offerte en laat ons weten of je akkoord gaat.
          </p>
          <OfferteActies offerteId={offerte.id} offerteNummer={offerte.nummer} />
        </div>
      )}
    </div>
  );
}
