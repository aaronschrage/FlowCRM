import { prisma } from "@/lib/prisma";
import InstellingenClient from "./InstellingenClient";
import { Settings } from "lucide-react";

export default async function InstellingenPage() {
  const instellingen = await prisma.instelling.findMany();
  const data: Record<string, string> = {};
  instellingen.forEach((i) => { data[i.sleutel] = i.waarde; });

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "var(--accent-subtle)",
            border: "1px solid rgba(79,124,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Settings size={20} style={{ color: "var(--accent-hover)" }} />
          </div>
          <div>
            <h1 className="page-title">Instellingen</h1>
            <p className="page-subtitle">Beheer je bedrijfsgegevens</p>
          </div>
        </div>
      </div>

      <InstellingenClient huidig={data} />
    </div>
  );
}