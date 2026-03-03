import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, props: any) {
  try {
    const { id } = await props.params;

    await prisma.factuurRegel.deleteMany({
      where: { factuurId: Number(id) },
    });

    await prisma.factuur.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete factuur error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request, props: any) {
  try {
    const { id } = await props.params;
    const { status } = await req.json();

    await prisma.factuur.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}