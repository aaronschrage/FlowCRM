"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Zap, Mail, ArrowRight, CheckCircle } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  verlopen: "Je link is verlopen. Vraag hieronder een nieuwe link aan.",
  ongeldig: "Deze link is ongeldig of al gebruikt. Vraag hieronder een nieuwe link aan.",
  geen_toegang: "Je hebt geen toegang tot het portaal. Neem contact op met je opdrachtnemer.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const tokenError = errorParam ? (ERROR_MESSAGES[errorParam] ?? "Er is iets misgegaan. Probeer opnieuw.") : null;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/portal/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setFormError(data.error ?? "Te veel pogingen. Wacht een minuut.");
        return;
      }

      if (!res.ok) {
        setFormError(data.error ?? "Er is een fout opgetreden. Probeer opnieuw.");
        return;
      }

      setSubmitted(true);
    } catch {
      setFormError("Kan de server niet bereiken. Controleer je verbinding.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-base)",
      padding: "24px",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Zap size={18} color="white" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
          Klantportaal
        </span>
      </div>

      {/* Card */}
      <div className="card" style={{ width: "100%", maxWidth: 420 }}>
        {submitted ? (
          // ── Success state ──────────────────────────────────────────
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <CheckCircle size={24} strokeWidth={1.5} style={{ color: "var(--success)" }} />
            </div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}>
              Controleer je inbox
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 0 }}>
              Als dit e-mailadres bekend is, ontvang je een link om in te loggen.
              De link is <strong style={{ color: "var(--text-primary)" }}>15 minuten</strong> geldig en kan slechts één keer gebruikt worden.
            </p>
            <button
              style={{
                marginTop: 24, fontSize: "0.8rem", color: "var(--text-muted)",
                background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
              }}
              onClick={() => { setSubmitted(false); setEmail(""); }}
            >
              Ander e-mailadres gebruiken
            </button>
          </div>
        ) : (
          // ── Form state ─────────────────────────────────────────────
          <>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              Inloggen
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
              Voer je e-mailadres in. Je ontvangt een éénmalige link waarmee je direct kunt inloggen — geen wachtwoord nodig.
            </p>

            {/* Error banner (from token validation or API) */}
            {(tokenError ?? formError) && (
              <div style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 20,
              }}>
                <p style={{ fontSize: "0.82rem", color: "var(--danger)", margin: 0, lineHeight: 1.5 }}>
                  {tokenError ?? formError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7,
                }}>
                  <Mail size={13} style={{ opacity: 0.6 }} />
                  E-mailadres
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  required
                  autoComplete="email"
                  className="form-input"
                  style={{ width: "100%" }}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", gap: 8 }}
                disabled={loading || !email.trim()}
              >
                {loading ? (
                  "Bezig met versturen..."
                ) : (
                  <>
                    Stuur toegangslink
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>

      <p style={{ marginTop: 28, fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
        Geen account? Neem contact op met je opdrachtnemer.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
