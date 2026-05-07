import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NieuweFactuurClient from "./NieuweFactuurClient";

export default async function NieuweFactuurPage(props: any) {
  const { id } = await props.params;
  const klant = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!klant) notFound();

  return <NieuweFactuurClient klantId={klant.id} klantNaam={klant.name} />;
}