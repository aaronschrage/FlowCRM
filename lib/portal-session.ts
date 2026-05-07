import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionJWT } from "@/lib/portal-auth";

export async function requirePortalSession() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("portal-session")?.value;
  if (!jwt) redirect("/portal/login");
  const session = await verifySessionJWT(jwt);
  if (!session) redirect("/portal/login");
  return session; // { customerId, sessionId }
}
