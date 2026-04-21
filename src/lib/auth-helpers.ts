import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdmin(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("UNAUTHORIZED");
  if (!session.user.isAdmin) throw new Error("FORBIDDEN");
  return session.user.id;
}
