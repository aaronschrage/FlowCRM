import { prisma } from "@/lib/prisma";
import { addCustomer } from "../actions/customers";
import { Users, Plus, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import VerwijderKlantButton from "@/components/VerwijderKlantButton";

export default async function KlantenPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">Klanten</h1>
          <p className="page-subtitle">{customers.length} klant{customers.length !== 1 ? "en" : ""} in totaal</p>
        </div>

        <form action={addCustomer} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input name="name" placeholder="Naam" required className="form-input" style={{ width: "180px" }} />
          <input name="email" type="email" placeholder="Email" required className="form-input" style={{ width: "200px" }} />
          <button type="submit" className="btn btn-primary">
            <Plus size={16} />
            Toevoegen
          </button>
        </form>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Totaal klanten</p>
          <p className="stat-value">{customers.length}</p>
          <p className="stat-sub">Alle klanten</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Deze maand</p>
          <p className="stat-value">
            {customers.filter(c => {
              const d = new Date(c.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <p className="stat-sub">Nieuw toegevoegd</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Offertes open</p>
          <p className="stat-value">—</p>
          <p className="stat-sub">Komt binnenkort</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Facturen open</p>
          <p className="stat-value">—</p>
          <p className="stat-sub">Komt binnenkort</p>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="table-wrapper">
          <div className="empty-state">
            <Users size={32} strokeWidth={1.5} style={{ margin: "0 auto", opacity: 0.3 }} />
            <p>Nog geen klanten toegevoegd.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Naam</th>
                <th>E-mail</th>
                <th>Toegevoegd</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="name-cell">
                    <Link href={`/klanten/${c.id}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-hover)",
                        flexShrink: 0
                      }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      {c.name}
                      <ArrowRight size={13} style={{ opacity: 0.3, marginLeft: 4 }} />
                    </Link>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Mail size={13} style={{ opacity: 0.4 }} />
                      {c.email}
                    </div>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                    {new Date(c.createdAt).toLocaleDateString("nl-NL", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}
                  </td>
                  <td><span className="badge badge-success">Actief</span></td>
                  <td style={{ textAlign: "right" }}>
                    <VerwijderKlantButton klantId={c.id} klantNaam={c.name} />
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