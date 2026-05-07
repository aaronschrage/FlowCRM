"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function BewerkKlantButton({
  klantId,
  huidigNaam,
  huidigEmail,
}: {
  klantId: number;
  huidigNaam: string;
  huidigEmail: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [naam, setNaam] = useState(huidigNaam);
  const [email, setEmail] = useState(huidigEmail);
  const [loading, setLoading] = useState(false);

  async function handleOpslaan() {
    if (!naam.trim() || !email.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/klanten/${klantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ naam, email }),
    });

    if (res.ok) {
      setOpen(false);
      toast.success("Klantgegevens bijgewerkt");
      router.refresh();
    } else {
      toast.error("Opslaan mislukt — probeer opnieuw");
    }
    setLoading(false);
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
        <Edit size={14} />
        Bewerken
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Klant bewerken</DialogTitle>
          </DialogHeader>

          <div className="form-group" style={{ marginTop: 8 }}>
            <label className="form-label">Naam</label>
            <input
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              className="form-input"
              placeholder="Naam klant"
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="email@voorbeeld.nl"
            />
          </div>

          <DialogFooter>
            <button
              className="btn btn-ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuleren
            </button>
            <button
              className="btn btn-primary"
              onClick={handleOpslaan}
              disabled={loading || !naam.trim() || !email.trim()}
            >
              {loading ? "Opslaan..." : "Opslaan"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
