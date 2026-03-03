import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, props: any) {
  try {
    const { id } = await props.params;
    const body = await req.json();

    await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        ...(body.naam && { name: body.naam }),
        ...(body.email && { email: body.email }),
        ...(body.notitie !== undefined && { notities: body.notitie }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: any) {
  try {
    const { id } = await props.params;

    await prisma.offerteRegel.deleteMany({ where: { offerte: { klantId: Number(id) } } });
    await prisma.offerte.deleteMany({ where: { klantId: Number(id) } });
    await prisma.factuurRegel.deleteMany({ where: { factuur: { klantId: Number(id) } } });
    await prisma.factuur.deleteMany({ where: { klantId: Number(id) } });
    await prisma.customer.delete({ where: { id: Number(id) } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}