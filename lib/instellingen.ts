import { prisma } from "@/lib/prisma";

export async function getInstellingen(): Promise<Record<string, string>> {
  const instellingen = await prisma.instelling.findMany();
  const result: Record<string, string> = {};
  instellingen.forEach((i) => { result[i.sleutel] = i.waarde; });
  return result;
}