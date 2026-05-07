"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
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

export default function StuurReminderButton({
  factuurId,
  klantNaam,
  factuurNummer,
}: {
  factuurId: number;
  klantNaam: string;
  factuurNummer: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verstuurd, setVerstuurd] = useState(false);

  async function handleStuur() {
    setOpen(false);
    setLoading(true);
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factuurId }),
    });

    if (res.ok) {
      setVerstuurd(true);
      toast.success(`Herinnering verstuurd aan ${klantNaam}`);
      setTimeout(() => setVerstuurd(false), 5000);
    } else {
      toast.error("Versturen mislukt — controleer je e-mailinstellingen");
    }
    setLoading(false);
  }

  if (verstuurd) {
    return (
      <button className="btn btn-ghost btn-sm" disabled style={{ color: "var(--success)" }}>
        <Check size={14} />
        Verstuurd!
      </button>
    );
  }

  return (
    <>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Bell size={14} />
        {loading ? "Versturen..." : "Stuur herinnering"}
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Herinnering versturen?</AlertDialogTitle>
            <AlertDialogDescription>
              Er wordt een betalingsherinnering gestuurd aan{" "}
              <strong className="text-foreground">{klantNaam}</strong> voor factuur{" "}
              <strong className="text-foreground">{factuurNummer}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleStuur}>
              <Bell size={14} />
              Ja, stuur herinnering
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
