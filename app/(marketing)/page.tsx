import Link from "next/link";
import {
  Users,
  Receipt,
  Globe,
  CreditCard,
  Clock,
  Bell,
  BarChart2,
  Check,
  Shield,
} from "lucide-react";
import { FaqAccordion } from "./FaqAccordion";

// Shared layout constants
const MAX = 1120;
const PX = "24px";
const PY = "96px";

export default function LandingPage() {
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      <Nav />
      <Hero />
      <SocialProof />
      <ProbleemSectie />
      <FeaturesSectie />
      <PortaalHighlight />
      <PricingSectie />
      <FaqSectie />
      <CtaBanner />
      <Footer />
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(34,38,54,0.6)",
        background: "rgba(12,14,18,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          maxWidth: MAX,
          margin: "0 auto",
          padding: `0 ${PX}`,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Flow<span style={{ color: "var(--accent)" }}>CRM</span>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {[
            { label: "Features", href: "#features" },
            { label: "Prijzen", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map(({ label, href }) => (
            <a key={href} href={href} className="landing-nav-link">
              {label}
            </a>
          ))}
        </div>

        <Link href="/dashboard" className="landing-nav-btn">
          Inloggen
        </Link>
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: 64,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "-10rem",
          width: "36rem",
          height: "36rem",
          borderRadius: "50%",
          background: "var(--accent)",
          opacity: 0.055,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "-6rem",
          width: "28rem",
          height: "28rem",
          borderRadius: "50%",
          background: "#a78bfa",
          opacity: 0.04,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: MAX,
          margin: "0 auto",
          padding: `${PY} ${PX}`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 72,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 999,
              border: "1px solid var(--border-base)",
              background: "var(--bg-surface)",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--success)",
                boxShadow: "0 0 6px var(--success)",
              }}
            />
            Nu beschikbaar voor Nederlandse ZZP&apos;ers
          </div>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 4.5vw, 3.75rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            De CRM die je klanten ook willen{" "}
            <span style={{ color: "var(--accent)" }}>gebruiken</span>
          </h1>

          <p
            style={{
              marginTop: 24,
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              maxWidth: 480,
            }}
          >
            FlowCRM is een Nederlandse CRM voor ZZP&apos;ers en MKB&apos;ers.
            Stuur offertes en facturen waar je klanten blij van worden — met
            klantportaal, iDEAL en geen gedoe.
          </p>

          <div
            style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <a href="#pricing" className="landing-btn-primary">
              Probeer gratis 30 dagen
            </a>
            <a href="#features" className="landing-btn-ghost">
              Bekijk features →
            </a>
          </div>

          <p
            style={{ marginTop: 18, fontSize: "0.78rem", color: "var(--text-muted)" }}
          >
            Geen creditcard nodig · Setup in 5 minuten
          </p>
        </div>

        {/* Dashboard mockup */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(79,124,255,0.14) 0%, rgba(167,139,250,0.07) 100%)",
              borderRadius: 20,
              filter: "blur(40px)",
              transform: "scale(1.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              borderRadius: 16,
              border: "1px solid var(--border-base)",
              background: "var(--bg-surface)",
              overflow: "hidden",
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,124,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 16px",
                borderBottom: "1px solid var(--border-base)",
                background: "var(--bg-elevated)",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#f87171",
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#fbbf24",
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#34d399",
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  flex: 1,
                  margin: "0 12px",
                  height: 20,
                  borderRadius: 6,
                  background: "var(--bg-base)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  app.flowcrm.nl/dashboard
                </span>
              </div>
            </div>

            <div style={{ display: "flex", height: 380 }}>
              <div
                style={{
                  width: 52,
                  borderRight: "1px solid var(--border-base)",
                  padding: "10px 8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  background: "var(--bg-base)",
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 28,
                      borderRadius: 8,
                      background:
                        i === 0 ? "var(--accent-subtle)" : "var(--bg-elevated)",
                      border:
                        i === 0 ? "1px solid rgba(79,124,255,0.2)" : "none",
                    }}
                  />
                ))}
              </div>

              <div
                style={{ flex: 1, padding: "14px 16px", overflow: "hidden" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {[
                    { label: "Omzet", val: "€12.450", color: "var(--success)" },
                    {
                      label: "Openstaand",
                      val: "€3.200",
                      color: "var(--warning)",
                    },
                    {
                      label: "Klanten",
                      val: "24",
                      color: "var(--accent-hover)",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        borderRadius: 10,
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-base)",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: "var(--text-muted)",
                          marginBottom: 5,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: s.color,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 8,
                    paddingLeft: 4,
                  }}
                >
                  {["Nummer", "Klant", "Bedrag", "Status"].map((h) => (
                    <div
                      key={h}
                      style={{
                        flex: h === "Klant" ? 2 : 1,
                        fontSize: 8,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {[
                    { badge: "var(--warning)", w: 0.6 },
                    { badge: "var(--success)", w: 0.8 },
                    { badge: "var(--accent-hover)", w: 0.5 },
                    { badge: "var(--danger)", w: 0.7 },
                    { badge: "var(--success)", w: 0.65 },
                    { badge: "var(--warning)", w: 0.55 },
                  ].map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        borderRadius: 8,
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-base)",
                        padding: "7px 10px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 7,
                          borderRadius: 4,
                          background: "var(--border-light)",
                        }}
                      />
                      <div
                        style={{
                          flex: 2,
                          height: 6,
                          borderRadius: 4,
                          background: "var(--border-base)",
                          opacity: row.w,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          height: 7,
                          borderRadius: 4,
                          background: "var(--border-light)",
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          height: 16,
                          borderRadius: 5,
                          background: row.badge,
                          opacity: 0.25,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Social Proof ───────────────────────────────────────────────

function SocialProof() {
  const bedrijven = [
    "Bakkerij De Mol",
    "Studio Visser",
    "TechBouw BV",
    "Klink Advies",
    "Van der Berg IT",
  ];

  return (
    <div
      style={{
        borderTop: "1px solid var(--border-base)",
        borderBottom: "1px solid var(--border-base)",
        background: "var(--bg-surface)",
        padding: "28px 24px",
      }}
    >
      <div
        style={{
          maxWidth: MAX,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 500,
          }}
        >
          Vertrouwd door 50+ Nederlandse ZZP&apos;ers en MKB&apos;ers
        </p>
        <div
          style={{
            display: "flex",
            gap: 40,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {bedrijven.map((naam) => (
            <span
              key={naam}
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "-0.01em",
                opacity: 0.6,
              }}
            >
              {naam}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Probleem Sectie ────────────────────────────────────────────

function ProbleemSectie() {
  const pijnpunten = [
    {
      icon: Clock,
      titel: "Uren kwijt aan facturen maken",
      tekst:
        "Je kopieert telkens dezelfde gegevens, zoekt de juiste bedragen op, verstuurt PDF's per mail — en begint volgende maand weer opnieuw.",
    },
    {
      icon: Bell,
      titel: "Klanten betalen pas na drie herinneringen",
      tekst:
        "Je stuurt een factuur, wacht twee weken, stuurt een reminder, wacht nog langer, belt misschien. Gemiddeld duurt het 30 extra dagen.",
    },
    {
      icon: BarChart2,
      titel: "Geen overzicht over openstaande bedragen",
      tekst:
        "Welke facturen staan nog open? Hoeveel is er te laat? Je zoekt in e-mails, spreadsheets en je eigen hoofd.",
    },
  ];

  return (
    <section style={{ background: "var(--bg-base)", padding: `${PY} ${PX}` }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--danger)",
              marginBottom: 14,
            }}
          >
            Herken je dit?
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Administratie kost je te veel tijd
          </h2>
          <p
            style={{
              marginTop: 16,
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: 520,
              margin: "16px auto 0",
              lineHeight: 1.7,
            }}
          >
            Je bent ondernemer, geen boekhouder. Maar de administratie vreet uren
            die je liever aan je werk besteedt.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {pijnpunten.map(({ icon: Icon, titel, tekst }) => (
            <div
              key={titel}
              style={{
                borderRadius: 16,
                border: "1px solid var(--border-base)",
                background: "var(--bg-surface)",
                padding: "28px 24px",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <Icon size={18} style={{ color: "var(--danger)" }} />
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                {titel}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {tekst}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features Sectie ────────────────────────────────────────────

function FeaturesSectie() {
  const features = [
    {
      icon: Users,
      titel: "Klantbeheer met context",
      tekst:
        "Alle klantinformatie op één plek. Notities, contacthistorie, gekoppelde offertes en facturen — direct bij de hand.",
      color: "var(--accent)",
      bg: "var(--accent-subtle)",
      border: "rgba(79,124,255,0.2)",
    },
    {
      icon: Receipt,
      titel: "Offerte → Factuur in 30 seconden",
      tekst:
        "Maak een professionele offerte, stuur hem op en converteer hem met één klik naar een factuur. Jouw branding, jouw stijl.",
      color: "var(--success)",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
    },
    {
      icon: Globe,
      titel: "Klantportaal inbegrepen",
      tekst:
        "Jouw klanten krijgen een eigen omgeving. Offertes goedkeuren, facturen inzien en betalen — zonder account aanmaken.",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.2)",
    },
    {
      icon: CreditCard,
      titel: "iDEAL automatisch verwerkt",
      tekst:
        "Klanten betalen direct via iDEAL op de factuurpagina. Betaling binnenkomt → status automatisch op betaald. Geen handwerk.",
      color: "var(--warning)",
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.2)",
    },
  ];

  return (
    <section
      id="features"
      style={{
        background: "var(--bg-surface)",
        padding: `${PY} ${PX}`,
        borderTop: "1px solid var(--border-base)",
      }}
    >
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 14,
            }}
          >
            Features
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Alles wat je nodig hebt,{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              niets wat je niet gebruikt
            </span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {features.map(({ icon: Icon, titel, tekst, color, bg, border }) => (
            <div
              key={titel}
              style={{
                borderRadius: 16,
                border: "1px solid var(--border-base)",
                background: "var(--bg-elevated)",
                padding: "28px 28px",
                display: "flex",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: bg,
                  border: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {titel}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {tekst}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Portaal Highlight ──────────────────────────────────────────

function PortaalHighlight() {
  const bullets = [
    "Klanten keuren offertes goed met één klik",
    "iDEAL betaling direct op de factuurpagina",
    "Geen account nodig — magic link via e-mail",
    "Jouw logo en branding op het portaal",
  ];

  return (
    <section
      style={{
        background: "var(--bg-base)",
        padding: `${PY} ${PX}`,
        borderTop: "1px solid var(--border-base)",
      }}
    >
      <div
        style={{
          maxWidth: MAX,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        {/* Portal mockup */}
        <div style={{ position: "relative", order: 1 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(79,124,255,0.08) 100%)",
              borderRadius: 20,
              filter: "blur(40px)",
              transform: "scale(1.06)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              borderRadius: 16,
              border: "1px solid var(--border-base)",
              background: "var(--bg-surface)",
              overflow: "hidden",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.1)",
            }}
          >
            {/* Portal nav */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "1px solid var(--border-base)",
                background: "var(--bg-elevated)",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Flow<span style={{ color: "var(--accent)" }}>CRM</span>
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    fontWeight: 400,
                  }}
                >
                  Portaal
                </span>
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  padding: "3px 10px",
                  borderRadius: 999,
                  border: "1px solid var(--border-base)",
                }}
              >
                Studio Visser
              </span>
            </div>

            {/* Portal body */}
            <div style={{ padding: "20px 24px" }}>
              {/* Offerte header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 4,
                    }}
                  >
                    Offerte
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    #OFT-2024-042
                  </p>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    Webshop redesign project
                  </p>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(251,191,36,0.1)",
                    color: "var(--warning)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  Wacht op goedkeuring
                </span>
              </div>

              {/* Line items */}
              <div
                style={{
                  borderRadius: 10,
                  border: "1px solid var(--border-base)",
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                {[
                  { omschrijving: "Design & development", bedrag: "€1.800" },
                  { omschrijving: "Hosting setup (1 jaar)", bedrag: "€400" },
                  { omschrijving: "SEO optimalisatie", bedrag: "€200" },
                ].map((r, i) => (
                  <div
                    key={r.omschrijving}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderBottom:
                        i < 2 ? "1px solid var(--border-base)" : "none",
                      background: i % 2 === 1 ? "var(--bg-elevated)" : "transparent",
                    }}
                  >
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                    >
                      {r.omschrijving}
                    </span>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {r.bedrag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 4px",
                  marginBottom: 20,
                }}
              >
                <span
                  style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}
                >
                  Totaal incl. btw
                </span>
                <span
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "var(--success)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  €2.904,00
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div
                  style={{
                    padding: "11px",
                    borderRadius: 10,
                    background: "rgba(52,211,153,0.12)",
                    border: "1px solid rgba(52,211,153,0.3)",
                    textAlign: "center",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--success)",
                  }}
                >
                  ✓ Accepteren
                </div>
                <div
                  style={{
                    padding: "11px",
                    borderRadius: 10,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-base)",
                    textAlign: "center",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Afwijzen
                </div>
              </div>

              <p
                style={{
                  marginTop: 14,
                  textAlign: "center",
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                }}
              >
                Geldig tot 31 mei 2026 · Vragen? Stuur een bericht
              </p>
            </div>
          </div>
        </div>

        {/* Text */}
        <div style={{ order: 2 }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#a78bfa",
              marginBottom: 14,
            }}
          >
            Uniek klantportaal
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              margin: "0 0 20px",
            }}
          >
            Het verschil zit in het{" "}
            <span style={{ color: "#a78bfa" }}>klantportaal</span>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              marginBottom: 28,
            }}
          >
            Jouw klanten krijgen hun eigen omgeving waar ze offertes met één klik
            kunnen goedkeuren en facturen direct via iDEAL kunnen betalen. Geen
            PDF heen-en-weer gemail meer.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bullets.map((b) => (
              <div
                key={b}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: "rgba(167,139,250,0.1)",
                    border: "1px solid rgba(167,139,250,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={11} style={{ color: "#a78bfa" }} />
                </div>
                <span
                  style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>

          <p
            style={{
              marginTop: 32,
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            &ldquo;Klantvriendelijk en professioneel — ze komen soms zelfs vragen
            wanneer ze de volgende offerte kunnen verwachten.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Pricing Sectie ─────────────────────────────────────────────

function PricingSectie() {
  const plannen = [
    {
      naam: "Starter",
      prijs: "15",
      omschrijving: "Perfect om te beginnen",
      populairst: false,
      features: [
        "1 gebruiker",
        "25 facturen per maand",
        "50 klanten",
        "Klantportaal (alleen inzien)",
        "PDF exports",
        "E-mail support",
      ],
    },
    {
      naam: "Pro",
      prijs: "29",
      omschrijving: "Alles wat je als ZZP'er nodig hebt",
      populairst: true,
      features: [
        "Onbeperkte gebruikers",
        "Onbeperkte facturen & offertes",
        "Onbeperkte klanten",
        "Klantportaal met iDEAL",
        "Custom branding (logo & kleuren)",
        "Automatische betalingsverwerking",
        "Prioriteit e-mail support",
      ],
    },
    {
      naam: "Agency",
      prijs: "59",
      omschrijving: "Voor bureaus en groeiende teams",
      populairst: false,
      features: [
        "Alles uit Pro",
        "5 teamleden",
        "Custom domein",
        "API toegang",
        "Whitelabel klantportaal",
        "Dedicated support",
        "Onboarding sessie",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        background: "var(--bg-surface)",
        padding: `${PY} ${PX}`,
        borderTop: "1px solid var(--border-base)",
      }}
    >
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 14,
            }}
          >
            Prijzen
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            Eerlijk geprijsd, geen verrassingen
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            30 dagen gratis op alle plannen. Geen creditcard nodig om te starten.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          {plannen.map((plan) => (
            <div
              key={plan.naam}
              style={{
                borderRadius: 16,
                border: plan.populairst
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border-base)",
                background: plan.populairst
                  ? "var(--bg-elevated)"
                  : "var(--bg-base)",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: plan.populairst
                  ? "0 0 0 4px rgba(79,124,255,0.08)"
                  : "none",
              }}
            >
              {plan.populairst && (
                <div
                  style={{
                    position: "absolute",
                    top: -13,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "3px 14px",
                    borderRadius: 999,
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Populairst
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {plan.naam}
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    marginBottom: 16,
                  }}
                >
                  {plan.omschrijving}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span
                    style={{
                      fontSize: "2.4rem",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    €{plan.prijs}
                  </span>
                  <span
                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                  >
                    /mnd
                  </span>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {plan.features.map((f) => (
                  <div
                    key={f}
                    style={{ display: "flex", alignItems: "flex-start", gap: 9 }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        background: plan.populairst
                          ? "var(--accent-subtle)"
                          : "var(--bg-elevated)",
                        border: plan.populairst
                          ? "1px solid rgba(79,124,255,0.25)"
                          : "1px solid var(--border-base)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <Check
                        size={9}
                        style={{
                          color: plan.populairst
                            ? "var(--accent-hover)"
                            : "var(--text-muted)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.845rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className={
                  plan.populairst
                    ? "landing-pricing-btn landing-pricing-btn-primary"
                    : "landing-pricing-btn landing-pricing-btn-ghost"
                }
              >
                {plan.populairst ? "Start gratis 30 dagen" : "Probeer gratis"}
              </a>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: "0.82rem",
            color: "var(--text-muted)",
          }}
        >
          Alle plannen inclusief 30 dagen gratis proefperiode · Geen creditcard
          nodig · Op elk moment opzegbaar
        </p>
      </div>
    </section>
  );
}

// ── FAQ Sectie ─────────────────────────────────────────────────

function FaqSectie() {
  return (
    <section
      id="faq"
      style={{
        background: "var(--bg-base)",
        padding: `${PY} ${PX}`,
        borderTop: "1px solid var(--border-base)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 14,
            }}
          >
            FAQ
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Veelgestelde vragen
          </h2>
        </div>
        <FaqAccordion />
      </div>
    </section>
  );
}

// ── CTA Banner ─────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section
      style={{
        position: "relative",
        padding: `${PY} ${PX}`,
        overflow: "hidden",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-base)",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(79,124,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-4rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "40rem",
          height: "20rem",
          borderRadius: "50%",
          background: "var(--accent)",
          opacity: 0.06,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 680,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          Klaar om je administratie te versimpelen?
        </h2>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          Sluit je aan bij honderden Nederlandse ondernemers die hun
          facturatie hebben gestroomlijnd. Start vandaag gratis.
        </p>
        <a href="#pricing" className="landing-cta-btn">
          Start gratis 30 dagen
        </a>
        <p
          style={{
            marginTop: 18,
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          Geen creditcard · Geen verplichting · Direct actief
        </p>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────

function Footer() {
  const columns = [
    {
      titel: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Prijzen", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
        { label: "Demo aanvragen", href: "#" },
      ],
    },
    {
      titel: "Bedrijf",
      links: [
        { label: "Over ons", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      titel: "Juridisch",
      links: [
        { label: "Privacybeleid", href: "#" },
        { label: "Algemene voorwaarden", href: "#" },
        { label: "Cookiebeleid", href: "#" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border-base)",
        padding: `56px ${PX} 32px`,
      }}
    >
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                marginBottom: 12,
              }}
            >
              Flow<span style={{ color: "var(--accent)" }}>CRM</span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 240,
                marginBottom: 20,
              }}
            >
              Nederlandse CRM voor ZZP&apos;ers en MKB&apos;ers. Van offerte tot
              betaling — in één tool.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={13} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                GDPR-compliant · Europese servers
              </span>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.titel}>
              <h4
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                {col.titel}
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {col.links.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="landing-nav-link"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-base)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            &copy; 2026 FlowCRM. Made in Groningen 🇳🇱
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Gebouwd voor Nederlandse ondernemers
          </p>
        </div>
      </div>
    </footer>
  );
}
