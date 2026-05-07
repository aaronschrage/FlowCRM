import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NieuweOfferteClient from "./NieuweOfferteClient";

export default async function NieuweOffertePage(props: any) {
  const { id } = await props.params;
  const klant = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!klant) notFound();

  return <NieuweOfferteClient klantId={klant.id} klantNaam={klant.name} />;
}