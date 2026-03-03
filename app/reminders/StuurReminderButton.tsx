"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

export default function StuurReminderButton({
  factuurId,
  klantNaam,
  factuurNummer,
}: {
  factuurId: number;
  klantNaam: string;
  factuurNummer: string;
}) {
  const [loading, setLoading] = useState(false);
  const [verstuurd, setVerstuurd] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleStuur() {
    setLoading(true);
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factuurId }),
    });

    if (res.ok) {
      setVerstuurd(true);
      setOpen(false);
      setTimeout(() => setVerstuurd(false), 3000);
    } else {
      alert("Er ging iets mis bij het versturen.");
    }
    setLoading(false);
  }

  if (verstuurd) {
    return (
      <button className="btn btn-ghost btn-sm" disabled style={{ color: "var(--success)" }}>
        <Check size={14} />
        Verstuurd!
      </button>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-ghost btn-sm">
        <Bell size={14} />
        Stuur herinnering
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ maxWidth: 420, width: "90%", padding: 32 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
              Herinnering versturen?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24, lineHeight: 1.6 }}>
              Weet je zeker dat je een betalingsherinnering wilt sturen aan <strong style={{ color: "var(--text-primary)" }}>{klantNaam}</strong> voor factuur <strong style={{ color: "var(--text-primary)" }}>{factuurNummer}</strong>?
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setOpen(false)} disabled={loading}>
                Annuleren
              </button>
              <button className="btn btn-primary" onClick={handleStuur} disabled={loading}>
                <Bell size={14} />
                {loading ? "Versturen..." : "Ja, stuur herinnering"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}