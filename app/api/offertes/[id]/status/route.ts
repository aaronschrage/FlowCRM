import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, props: any) {
  try {
    const { id } = await props.params;
    const { status } = await req.json();

    await prisma.offerte.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}