"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const VRAGEN = [
  {
    vraag: "Hoe verschilt FlowCRM van Moneybird?",
    antwoord:
      "Moneybird is primair een boekhoudpakket. FlowCRM is gebouwd rondom de klantrelatie: contactbeheer, offertes, facturen én een eigen klantportaal. Minder boekhoudcomplexiteit, meer focus op de klantreis van offerte tot betaling.",
  },
  {
    vraag: "Kan ik mijn data altijd exporteren?",
    antwoord:
      "Ja, altijd. Je exporteert klanten, offertes en facturen als CSV of PDF. Je data is van jou — geen lock-in, geen verborgen voorwaarden.",
  },
  {
    vraag: "Werkt FlowCRM ook op mijn telefoon?",
    antwoord:
      "FlowCRM is volledig responsive en werkt goed op desktop, tablet en mobiel. Een native app staat op de roadmap voor later dit jaar.",
  },
  {
    vraag: "Wat als ik na 30 dagen wil stoppen?",
    antwoord:
      "Geen probleem. Je stopt wanneer je wilt, zonder opzegtermijn of verborgen kosten. Je abonnement loopt af aan het einde van de betaalde periode.",
  },
  {
    vraag: "Is mijn data veilig?",
    antwoord:
      "Ja. Data wordt opgeslagen op Europese servers (GDPR-compliant), is versleuteld en dagelijks gebackupt. We delen nooit data met derden.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {VRAGEN.map((item, i) => (
        <div
          key={i}
          style={{
            borderRadius: 12,
            border: `1px solid ${open === i ? "rgba(79,124,255,0.4)" : "var(--border-base)"}`,
            background: open === i ? "var(--bg-elevated)" : "transparent",
            overflow: "hidden",
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 22px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              gap: 16,
              fontFamily: "var(--font-sans)",
            }}
          >
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {item.vraag}
            </span>
            <span
              style={{
                flexShrink: 0,
                color: open === i ? "var(--accent)" : "var(--text-muted)",
                transition: "color 0.2s",
                display: "flex",
              }}
            >
              {open === i ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          {open === i && (
            <div
              style={{
                padding: "0 22px 20px",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
              }}
            >
              {item.antwoord}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
