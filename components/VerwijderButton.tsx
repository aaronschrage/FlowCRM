"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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

export default function VerwijderButton({
  id,
  type,
  klantId,
  nummer,
}: {
  id: number;
  type: "offerte" | "factuur";
  klantId: number;
  nummer: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVerwijder() {
    setOpen(false);
    setLoading(true);
    const res = await fetch(
      `/api/${type === "offerte" ? "offertes" : "facturen"}/${id}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      toast.success(`${type === "offerte" ? "Offerte" : "Factuur"} ${nummer} verwijderd`);
      router.push(`/klanten/${klantId}`);
      router.refresh();
    } else {
      toast.error("Verwijderen mislukt — probeer opnieuw");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Trash2 size={14} />
        {loading ? "Verwijderen..." : "Verwijder"}
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {type === "offerte" ? "Offerte" : "Factuur"} verwijderen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je <strong className="text-foreground">{nummer}</strong> wilt
              verwijderen? Dit kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVerwijder}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Ja, verwijder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
