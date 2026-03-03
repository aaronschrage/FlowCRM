"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Receipt } from "lucide-react";
import Link from "next/link";

interface Regel {
  id: number;
  omschrijving: string;
  aantal: string;
  prijs: string;
  btw: number;
}

export default function NieuweFactuurClient({
  klantId,
  klantNaam,
}: {
  klantId: number;
  klantNaam: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vervaldagen, setVervaldagen] = useState(30);
  const [notities, setNotities] = useState("");
  const [regels, setRegels] = useState<Regel[]>([
    { id: 1, omschrijving: "", aantal: "1", prijs: "0", btw: 21 },
  ]);

  const voegRegelToe = () => {
    setRegels([...regels, { id: Date.now(), omschrijving: "", aantal: "1", prijs: "0", btw: 21 }]);
  };

  const verwijderRegel = (id: number) => {
    if (regels.length === 1) return;
    setRegels(regels.filter((r) => r.id !== id));
  };

  const updateRegel = (id: number, field: keyof Regel, value: string | number) => {
    setRegels(regels.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const toNum = (val: string) => parseFloat(val.replace(",", ".")) || 0;

  const subtotaal = regels.reduce((sum, r) => sum + toNum(r.aantal) * toNum(r.prijs), 0);
  const btwBedrag = regels.reduce((sum, r) => sum + toNum(r.aantal) * toNum(r.prijs) * (r.btw / 100), 0);
  const totaal = subtotaal + btwBedrag;

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/facturen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          klantId,
          vervaldagen,
          notities,
          regels: regels.map((r) => ({
            omschrijving: r.omschrijving,
            aantal: toNum(r.aantal),
            prijs: toNum(r.prijs),
            btw: r.btw,
          })),
        }),
      });

      if (res.ok) {
        router.push(`/klanten/${klantId}`);
        router.refresh();
      } else {
        const err = await res.json();
        alert("Fout: " + err.error);
        setLoading(false);
      }
    } catch (err) {
      alert("Er ging iets mis");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <Link
        href={`/klanten/${klantId}`}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 28, display: "inline-flex" }}
      >
        <ArrowLeft size={15} />
        Terug naar {klantNaam}
      </Link>

      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Receipt size={20} style={{ color: "var(--success)" }} />
          </div>
          <div>
            <h1 className="page-title">Nieuwe factuur</h1>
            <p className="page-subtitle">Voor {klantNaam}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>
            Factuur instellingen
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Betaaltermijn (dagen)</label>
              <input
                type="number"
                value={vervaldagen}
                onChange={(e) => setVervaldagen(Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notities (optioneel)</label>
              <input
                value={notities}
                onChange={(e) => setNotities(e.target.value)}
                placeholder="Bijv. onder voorbehoud"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>Regels</h2>
            <button type="button" onClick={voegRegelToe} className="btn btn-ghost btn-sm">
              <Plus size={14} />
              Regel toevoegen
            </button>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "3fr 80px 120px 80px 40px",
            gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)", marginBottom: 10
          }}>
            {["Omschrijving", "Aantal", "Prijs", "BTW", ""].map((h) => (
              <span key={h} style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {h}
              </span>
            ))}
          </div>

          {regels.map((regel) => (
            <div key={regel.id} style={{
              display: "grid", gridTemplateColumns: "3fr 80px 120px 80px 40px",
              gap: 10, marginBottom: 10, alignItems: "center"
            }}>
              <input
                value={regel.omschrijving}
                onChange={(e) => updateRegel(regel.id, "omschrijving", e.target.value)}
                placeholder="Beschrijving van dienst of product"
                className="form-input"
                required
              />
              <input
                type="text"
                value={regel.aantal}
                onChange={(e) => updateRegel(regel.id, "aantal", e.target.value)}
                placeholder="1"
                className="form-input"
              />
              <input
                type="text"
                value={regel.prijs}
                onChange={(e) => updateRegel(regel.id, "prijs", e.target.value)}
                placeholder="0,00"
                className="form-input"
              />
              <select
                value={regel.btw}
                onChange={(e) => updateRegel(regel.id, "btw", parseInt(e.target.value))}
                className="form-input"
                style={{ padding: "10px 10px" }}
              >
                <option value={21}>21%</option>
                <option value={9}>9%</option>
                <option value={0}>0%</option>
              </select>
              <button
                type="button"
                onClick={() => verwijderRegel(regel.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", display: "flex", alignItems: "center",
                  justifyContent: "center", padding: 6, borderRadius: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <div className="card" style={{ minWidth: 280 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Subtotaal</span>
                <span style={{ color: "var(--text-secondary)" }}>{fmt(subtotaal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>BTW</span>
                <span style={{ color: "var(--text-secondary)" }}>{fmt(btwBedrag)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Totaal</span>
                <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--success)", fontFamily: "var(--font-mono)" }}>
                  {fmt(totaal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href={`/klanten/${klantId}`} className="btn btn-ghost">Annuleren</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Opslaan..." : "Factuur opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
}