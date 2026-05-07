"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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

export default function OmzettenNaarFactuurButton({
  offerteId,
  offerteStatus,
}: {
  offerteId: number;
  offerteStatus: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (offerteStatus === "afgewezen") return null;

  async function handleOmzetten() {
    setOpen(false);
    setLoading(true);
    const res = await fetch(`/api/offertes/${offerteId}/naar-factuur`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();
      toast.success("Offerte omgezet naar factuur");
      router.push(`/klanten/${data.klantId}/factuur/${data.factuurId}`);
      router.refresh();
    } else {
      toast.error("Omzetten mislukt — probeer opnieuw");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <ArrowRight size={15} />
        {loading ? "Omzetten..." : "Omzetten naar factuur"}
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Offerte omzetten naar factuur?</AlertDialogTitle>
            <AlertDialogDescription>
              Alle regelitems worden gekopieerd naar een nieuwe factuur. De offerte wordt
              automatisch op <strong className="text-foreground">geaccepteerd</strong> gezet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleOmzetten}>
              <ArrowRight size={14} />
              Ja, maak factuur
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
