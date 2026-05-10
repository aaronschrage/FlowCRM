"use client";

import { toast } from "sonner";
import { CreditCard, Download } from "lucide-react";

interface Props {
  factuurId: number;
  factuurNummer: string;
  betaald: boolean;
}

export function FactuurActies({ factuurId, factuurNummer, betaald }: Props) {
  if (betaald) {
    return (
      <a
        href={`/api/portal/facturen/${factuurId}/pdf`}
        className="btn btn-ghost"
        download
      >
        <Download size={16} />
        PDF downloaden
      </a>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button
        className="btn btn-primary"
        onClick={() =>
          toast.info("iDEAL betalingen komen binnenkort beschikbaar.")
        }
      >
        <CreditCard size={16} />
        Betaal via iDEAL
      </button>
      <a
        href={`/api/portal/facturen/${factuurId}/pdf`}
        className="btn btn-ghost"
        download
      >
        <Download size={16} />
        PDF downloaden
      </a>
    </div>
  );
}
