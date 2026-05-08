"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { createPortal } from "react-dom";

interface Props {
  offerteId: number;
  offerteNummer: string;
}

// ── Eenvoudige portal-modal zonder externe UI-bibliotheek ──────────
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sluit bij Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Blokkeer body-scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: 16,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          width: "100%",
          maxWidth: 440,
          padding: 24,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

// ── Hoofd component ────────────────────────────────────────────────
export function OfferteActies({ offerteId, offerteNummer }: Props) {
  const router = useRouter();

  const [acceptOpen, setAcceptOpen] = useState(false);
  const [afwijzenOpen, setAfwijzenOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  function openAccept() {
    setNotes("");
    setAcceptOpen(true);
  }
  function openAfwijzen() {
    setNotes("");
    setAfwijzenOpen(true);
  }
  function closeAccept() {
    if (!loading) { setAcceptOpen(false); setNotes(""); }
  }
  function closeAfwijzen() {
    if (!loading) { setAfwijzenOpen(false); setNotes(""); }
  }

  async function handleAccepteren() {
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/offertes/${offerteId}/accepteren`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Onbekende fout");
      toast.success(`Offerte ${offerteNummer} geaccepteerd`);
      setAcceptOpen(false);
      setNotes("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Actie mislukt");
    } finally {
      setLoading(false);
    }
  }

  async function handleAfwijzen() {
    if (!notes.trim()) {
      toast.error("Vul een reden in voor het afwijzen.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/offertes/${offerteId}/afwijzen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Onbekende fout");
      toast.success(`Offerte ${offerteNummer} afgewezen`);
      setAfwijzenOpen(false);
      setNotes("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Actie mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Actie knoppen ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={openAccept}>
          <CheckCircle size={16} />
          Accepteren
        </button>
        <button className="btn btn-danger" onClick={openAfwijzen}>
          <XCircle size={16} />
          Afwijzen
        </button>
      </div>

      {/* ── Accepteren modal ── */}
      <Modal open={acceptOpen} onClose={closeAccept}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "rgba(52,211,153,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <CheckCircle size={15} style={{ color: "var(--success)" }} />
              </div>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Offerte accepteren
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Je staat op het punt offerte{" "}
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>
                {offerteNummer}
              </span>{" "}
              te accepteren.
            </p>
          </div>
          <button
            onClick={closeAccept}
            disabled={loading}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: 4, borderRadius: 6, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tekstveld */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Opmerkingen (optioneel)</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Eventuele opmerkingen..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", gap: 10, justifyContent: "flex-end",
          paddingTop: 16, borderTop: "1px solid var(--border-base)",
        }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={closeAccept}
            disabled={loading}
            type="button"
          >
            Annuleren
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAccepteren}
            disabled={loading}
            type="button"
          >
            {loading
              ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              : <CheckCircle size={14} />}
            Bevestigen
          </button>
        </div>
      </Modal>

      {/* ── Afwijzen modal ── */}
      <Modal open={afwijzenOpen} onClose={closeAfwijzen}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "rgba(248,113,113,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <XCircle size={15} style={{ color: "var(--danger)" }} />
              </div>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Offerte afwijzen
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Je staat op het punt offerte{" "}
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>
                {offerteNummer}
              </span>{" "}
              af te wijzen.
            </p>
          </div>
          <button
            onClick={closeAfwijzen}
            disabled={loading}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: 4, borderRadius: 6, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tekstveld */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">
            Reden voor afwijzing{" "}
            <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Beschrijf waarom je deze offerte afwijst..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", gap: 10, justifyContent: "flex-end",
          paddingTop: 16, borderTop: "1px solid var(--border-base)",
        }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={closeAfwijzen}
            disabled={loading}
            type="button"
          >
            Annuleren
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleAfwijzen}
            disabled={loading || !notes.trim()}
            type="button"
          >
            {loading
              ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              : <XCircle size={14} />}
            Afwijzen bevestigen
          </button>
        </div>
      </Modal>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
