"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function OmzettenNaarFactuurButton({
  offerteId,
  offerteStatus,
}: {
  offerteId: number;
  offerteStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Alleen tonen als offerte nog niet afgewezen of al omgezet
  if (offerteStatus === "afgewezen") return null;

  async function handleOmzetten() {
    setLoading(true);
    const res = await fetch(`/api/offertes/${offerteId}/naar-factuur`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();
      setOpen(false);
      router.push(`/klanten/${data.klantId}/factuur/${data.factuurId}`);
      router.refresh();
    } else {
      alert("Er ging iets mis.");
    }
    setLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        <ArrowRight size={15} />
        Omzetten naar factuur
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ maxWidth: 420, width: "90%", padding: 32 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
              Offerte omzetten naar factuur?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24, lineHeight: 1.6 }}>
              Alle regelitems worden gekopieerd naar een nieuwe factuur. De offerte wordt automatisch op <strong>geaccepteerd</strong> gezet.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setOpen(false)} disabled={loading}>
                Annuleren
              </button>
              <button className="btn btn-primary" onClick={handleOmzetten} disabled={loading}>
                <ArrowRight size={14} />
                {loading ? "Omzetten..." : "Ja, maak factuur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}