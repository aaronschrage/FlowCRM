"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Notitie {
  id: number;
  tekst: string;
  createdAt: Date | string;
}

export default function NotitiesClient({
  klantId,
  bestaandeNotities,
}: {
  klantId: number;
  bestaandeNotities: Notitie[];
}) {
  const router = useRouter();
  const [tekst, setTekst] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleToevoegen() {
    if (!tekst.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/klanten/${klantId}/notities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tekst }),
    });

    if (res.ok) {
      setTekst("");
      toast.success("Notitie toegevoegd");
      router.refresh();
    } else {
      toast.error("Notitie toevoegen mislukt");
    }
    setLoading(false);
  }

  async function handleVerwijder(notitieId: number) {
    const res = await fetch(`/api/klanten/${klantId}/notities`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notitieId }),
    });
    if (res.ok) {
      toast.success("Notitie verwijderd");
      router.refresh();
    } else {
      toast.error("Verwijderen mislukt");
    }
  }

  return (
    <div>
      <textarea
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        placeholder="Schrijf een notitie..."
        className="form-input"
        style={{ minHeight: 90, resize: "vertical", fontFamily: "var(--font-sans)" }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) handleToevoegen();
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, marginBottom: 20 }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleToevoegen}
          disabled={loading || !tekst.trim()}
        >
          <Plus size={14} />
          {loading ? "Toevoegen..." : "Notitie toevoegen"}
        </button>
      </div>

      {bestaandeNotities.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>
          Nog geen notities — voeg er een toe!
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bestaandeNotities.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-base)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {n.tekst}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 6 }}>
                  {new Date(n.createdAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => handleVerwijder(n.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, flexShrink: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
