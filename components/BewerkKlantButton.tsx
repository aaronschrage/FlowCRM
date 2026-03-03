"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, X, Check } from "lucide-react";

export default function BewerkKlantButton({
  klantId,
  huidigNaam,
  huidigEmail,
}: {
  klantId: number;
  huidigNaam: string;
  huidigEmail: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [naam, setNaam] = useState(huidigNaam);
  const [email, setEmail] = useState(huidigEmail);
  const [loading, setLoading] = useState(false);

  async function handleOpslaan() {
    if (!naam.trim() || !email.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/klanten/${klantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ naam, email }),
    });

    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      alert("Er ging iets mis.");
    }
    setLoading(false);
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
        <Edit size={14} />
        Bewerken
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ maxWidth: 440, width: "90%", padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Klant bewerken
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Naam</label>
              <input
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                className="form-input"
                placeholder="Naam klant"
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="email@voorbeeld.nl"
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setOpen(false)} disabled={loading}>
                Annuleren
              </button>
              <button className="btn btn-primary" onClick={handleOpslaan} disabled={loading}>
                <Check size={14} />
                {loading ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}