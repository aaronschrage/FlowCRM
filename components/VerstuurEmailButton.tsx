"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verstuurd, setVerstuurd] = useState(false);

  async function verstuurEmail() {
    setOpen(false);
    setLoading(true);
    const endpoint =
      type === "factuur"
        ? `/api/facturen/${offerteId}/email`
        : `/api/offertes/${offerteId}/email`;

    const res = await fetch(endpoint, { method: "POST" });
    if (res.ok) {
      setVerstuurd(true);
      toast.success(`${type === "factuur" ? "Factuur" : "Offerte"} verstuurd naar ${klantEmail}`);
      router.refresh();
    } else {
      toast.error("Versturen mislukt — controleer je e-mailinstellingen");
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
    <>
      <button className="btn btn-ghost" onClick={() => setOpen(true)} disabled={loading}>
        <Mail size={15} />
        {loading ? "Versturen..." : "Stuur naar klant"}
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {type === "factuur" ? "Factuur" : "Offerte"} versturen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              De {type === "factuur" ? "factuur" : "offerte"} wordt gemaild naar{" "}
              <strong className="text-foreground">{klantEmail}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={verstuurEmail}>
              Ja, verstuur
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
