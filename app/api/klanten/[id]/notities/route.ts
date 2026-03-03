import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: any) {
  try {
    const { id } = await props.params;
    const { tekst } = await req.json();

    if (!tekst?.trim()) {
      return NextResponse.json({ error: "Tekst is verplicht" }, { status: 400 });
    }

    const notitie = await prisma.notitie.create({
      data: { tekst, klantId: Number(id) },
    });

    return NextResponse.json({ ok: true, notitie });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: any) {
  try {
    const { id } = await props.params;
    const { notitieId } = await req.json();

    await prisma.notitie.delete({ where: { id: Number(notitieId) } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}