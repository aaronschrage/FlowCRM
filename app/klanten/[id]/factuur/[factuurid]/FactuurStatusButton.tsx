"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const statussen = ["openstaand", "betaald", "te_laat"];

const statusKleur: Record<string, string> = {
  openstaand: "badge-warning",
  betaald: "badge-success",
  te_laat: "badge-danger",
};

const statusLabels: Record<string, string> = {
  openstaand: "Openstaand",
  betaald: "Betaald",
  te_laat: "Te laat",
};

export default function FactuurStatusButton({
  factuurId,
  huidigStatus,
  klantId,
}: {
  factuurId: number;
  huidigStatus: string;
  klantId: number;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(huidigStatus);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function wijzigStatus(nieuwStatus: string) {
    if (nieuwStatus === status) { setOpen(false); return; }
    setLoading(true);
    setOpen(false);

    const res = await fetch(`/api/facturen/${factuurId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nieuwStatus }),
    });

    if (res.ok) {
      setStatus(nieuwStatus);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="btn btn-ghost"
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <span className={`badge ${statusKleur[status]}`}>{statusLabels[status]}</span>
        <ChevronDown size={14} style={{ opacity: 0.5, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        {loading ? " Bezig..." : " Wijzig status"}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-md)",
          padding: 6, zIndex: 50, minWidth: 160,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
        }}>
          {statussen.map((s) => (
            <button
              key={s}
              onClick={() => wijzigStatus(s)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 10, padding: "8px 12px",
                background: s === status ? "var(--bg-hover)" : "none",
                border: "none", borderRadius: 6, cursor: "pointer", transition: "background 0.1s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = s === status ? "var(--bg-hover)" : "none")}
            >
              <span className={`badge ${statusKleur[s]}`}>{statusLabels[s]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}