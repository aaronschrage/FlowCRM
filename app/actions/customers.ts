"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCustomer(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();

  if (!name || !email) return;

  await prisma.customer.create({
    data: { name, email },
  });

  revalidatePath("/");
}

export async function deleteCustomer(id: number) {
  await prisma.customer.delete({
    where: { id: Number(id) },
  });

  revalidatePath("/");
}