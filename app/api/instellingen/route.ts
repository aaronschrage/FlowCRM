import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const instellingen = await prisma.instelling.findMany();
    const result: Record<string, string> = {};
    instellingen.forEach((i) => { result[i.sleutel] = i.waarde; });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    for (const [sleutel, waarde] of Object.entries(body)) {
      await prisma.instelling.upsert({
        where: { sleutel },
        update: { waarde: String(waarde) },
        create: { sleutel, waarde: String(waarde) },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}