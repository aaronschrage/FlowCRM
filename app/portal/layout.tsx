import { cookies } from "next/headers";
import { verifySessionJWT } from "@/lib/portal-auth";
import { prisma } from "@/lib/prisma";
import { PortalNav } from "./PortalNav";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("portal-session")?.value;

  let customerName: string | null = null;

  if (jwt) {
    const session = await verifySessionJWT(jwt);
    if (session) {
      const klant = await prisma.customer.findUnique({
        where: { id: session.customerId },
        select: { name: true },
      });
      customerName = klant?.name ?? null;
    }
  }

  if (!customerName) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <PortalNav customerName={customerName} />
      <main className="main-content">{children}</main>
    </div>
  );
}
