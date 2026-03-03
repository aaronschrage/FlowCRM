"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function VerwijderKlantButton({ klantId, klantNaam }: { klantId: number; klantNaam: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVerwijder() {
    setLoading(true);
    await fetch(`/api/klanten/${klantId}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <button className="btn btn-danger btn-sm" onClick={() => setOpen(true)}>
        <Trash2 size={14} />
        Verwijder
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ maxWidth: 400, width: "90%", padding: 32 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
              Klant verwijderen?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24, lineHeight: 1.6 }}>
              Weet je zeker dat je <strong style={{ color: "var(--text-primary)" }}>{klantNaam}</strong> wilt verwijderen? Dit verwijdert ook alle offertes en facturen van deze klant.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setOpen(false)} disabled={loading}>
                Annuleren
              </button>
              <button className="btn btn-danger" onClick={handleVerwijder} disabled={loading}>
                {loading ? "Verwijderen..." : "Ja, verwijder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}