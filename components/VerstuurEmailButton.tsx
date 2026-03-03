"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Check } from "lucide-react";

export default function VerstuurEmailButton({
  offerteId,
  klantEmail,
  type = "offerte",
}: {
  offerteId: number;
  klantEmail: string;
  type?: "offerte" | "factuur";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verstuurd, setVerstuurd] = useState(false);

  async function verstuurEmail() {
    if (!confirm(`${type === "factuur" ? "Factuur" : "Offerte"} versturen naar ${klantEmail}?`)) return;
    setLoading(true);

    const endpoint = type === "factuur"
      ? `/api/facturen/${offerteId}/email`
      : `/api/offertes/${offerteId}/email`;

    const res = await fetch(endpoint, { method: "POST" });

    if (res.ok) {
      setVerstuurd(true);
      router.refresh();
    } else {
      alert("Er ging iets mis bij het versturen.");
    }
    setLoading(false);
  }

  if (verstuurd) {
    return (
      <button className="btn btn-ghost" disabled style={{ color: "var(--success)" }}>
        <Check size={15} />
        Verstuurd!
      </button>
    );
  }

  return (
    <button onClick={verstuurEmail} disabled={loading} className="btn btn-ghost">
      <Mail size={15} />
      {loading ? "Versturen..." : "Stuur naar klant"}
    </button>
  );
}