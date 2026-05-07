import Link from "next/link";
import { requirePortalSession } from "@/lib/portal-session";
import { prisma } from "@/lib/prisma";
import { FileText } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

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

export default async function PortalOffertesPage() {
  const { customerId } = await requirePortalSession();

  const offertes = await prisma.offerte.findMany({
    where: { klantId: customerId },
    orderBy: { datum: "desc" },
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Offertes</h1>
        <p className="page-subtitle">Overzicht van al jouw offertes</p>
      </div>

      {offertes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText size={32} strokeWidth={1.2} style={{ margin: "0 auto", opacity: 0.2 }} />
            <p style={{ marginTop: 8 }}>Nog geen offertes</p>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Nummer</th>
                <th>Datum</th>
                <th>Geldig tot</th>
                <th>Bedrag</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {offertes.map((o) => (
                <tr key={o.id}>
                  <td className="name-cell">
                    <Link
                      href={`/portal/offertes/${o.id}`}
                      style={{ color: "var(--accent-hover)", textDecoration: "none", fontWeight: 600 }}
                    >
                      {o.nummer}
                    </Link>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {new Date(o.datum).toLocaleDateString("nl-NL")}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {new Date(o.geldigTot).toLocaleDateString("nl-NL")}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {fmt(o.totaal)}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[o.status] ?? "badge-info"}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
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
