"use client";

import { useState } from "react";
import { Building, FileText } from "lucide-react";
import { toast } from "sonner";

export default function InstellingenClient({ huidig }: { huidig: Record<string, string> }) {
  const [form, setForm] = useState({
    bedrijfsnaam: huidig.bedrijfsnaam || "",
    email: huidig.email || "",
    telefoon: huidig.telefoon || "",
    adres: huidig.adres || "",
    website: huidig.website || "",
    kvk: huidig.kvk || "",
    btwnummer: huidig.btwnummer || "",
    iban: huidig.iban || "",
    betalingstermijn: huidig.betalingstermijn || "30",
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function handleOpslaan() {
    setLoading(true);
    const res = await fetch("/api/instellingen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Instellingen opgeslagen");
    } else {
      toast.error("Opslaan mislukt — probeer opnieuw");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Bedrijfsgegevens */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building size={16} style={{ color: "var(--accent-hover)" }} />
          </div>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Bedrijfsgegevens</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Bedrijfsnaam</label>
            <input value={form.bedrijfsnaam} onChange={(e) => update("bedrijfsnaam", e.target.value)} className="form-input" placeholder="Mijn Bedrijf BV" />
          </div>
          <div className="form-group">
            <label className="form-label">E-mailadres</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="form-input" placeholder="info@mijnbedrijf.nl" />
          </div>
          <div className="form-group">
            <label className="form-label">Telefoonnummer</label>
            <input value={form.telefoon} onChange={(e) => update("telefoon", e.target.value)} className="form-input" placeholder="+31 6 12345678" />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Adres</label>
            <input value={form.adres} onChange={(e) => update("adres", e.target.value)} className="form-input" placeholder="Straat 1, 1234 AB Amsterdam" />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Website</label>
            <input value={form.website} onChange={(e) => update("website", e.target.value)} className="form-input" placeholder="www.mijnbedrijf.nl" />
          </div>
        </div>
      </div>

      {/* Financieel */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={16} style={{ color: "var(--success)" }} />
          </div>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Financiële gegevens</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">KvK-nummer</label>
            <input value={form.kvk} onChange={(e) => update("kvk", e.target.value)} className="form-input" placeholder="12345678" />
          </div>
          <div className="form-group">
            <label className="form-label">BTW-nummer</label>
            <input value={form.btwnummer} onChange={(e) => update("btwnummer", e.target.value)} className="form-input" placeholder="NL123456789B01" />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">IBAN</label>
            <input value={form.iban} onChange={(e) => update("iban", e.target.value)} className="form-input" placeholder="NL00 BANK 0000 0000 00" />
          </div>
          <div className="form-group">
            <label className="form-label">Standaard betalingstermijn (dagen)</label>
            <input type="number" value={form.betalingstermijn} onChange={(e) => update("betalingstermijn", e.target.value)} className="form-input" placeholder="30" />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary" onClick={handleOpslaan} disabled={loading} style={{ minWidth: 140 }}>
          {loading ? "Opslaan..." : "Instellingen opslaan"}
        </button>
      </div>
    </div>
  );
}