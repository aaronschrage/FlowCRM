import Link from "next/link";
import { requirePortalSession } from "@/lib/portal-session";
import { prisma } from "@/lib/prisma";
import { Receipt } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

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

export default async function PortalFacturenPage() {
  const { customerId } = await requirePortalSession();

  const facturen = await prisma.factuur.findMany({
    where: { klantId: customerId },
    orderBy: { datum: "desc" },
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Facturen</h1>
        <p className="page-subtitle">Overzicht van al jouw facturen</p>
      </div>

      {facturen.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Receipt size={32} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
            <p style={{ marginTop: 8 }}>Nog geen facturen</p>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Nummer</th>
                <th>Datum</th>
                <th>Vervaldatum</th>
                <th>Bedrag</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {facturen.map((f) => {
                const isTeXLaat = f.status === "te_laat" || (f.status === "openstaand" && new Date(f.vervaldatum) < new Date());
                const effectiefStatus = isTeXLaat && f.status !== "betaald" ? "te_laat" : f.status;
                return (
                  <tr key={f.id}>
                    <td className="name-cell">
                      <Link
                        href={`/portal/facturen/${f.id}`}
                        style={{ color: "var(--accent-hover)", textDecoration: "none", fontWeight: 600 }}
                      >
                        {f.nummer}
                      </Link>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      {new Date(f.datum).toLocaleDateString("nl-NL")}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: isTeXLaat && f.status !== "betaald" ? "var(--danger)" : "var(--text-muted)" }}>
                      {new Date(f.vervaldatum).toLocaleDateString("nl-NL")}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {fmt(f.totaal)}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[effectiefStatus] ?? "badge-info"}`}>
                        {STATUS_LABEL[effectiefStatus] ?? effectiefStatus}
                      </span>
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
