import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";
import { User, ShoppingBag, Settings, LogOut } from "lucide-react";

const NAV = [
  { href: "/conta", label: "Visão geral", icon: User },
  { href: "/conta/pedidos", label: "Meus pedidos", icon: ShoppingBag },
  { href: "/conta/perfil", label: "Meu perfil", icon: Settings },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [user] = await sql`SELECT full_name, email FROM users WHERE id = ${session.user.id} LIMIT 1`;
  const name = user?.full_name ?? session.user.email ?? "Usuário";
  const email = user?.email ?? session.user.email ?? "";

  return (
    <div className="pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#e2e8f0]">
              <div className="w-12 h-12 rounded-full bg-[#2B7DD4] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#1a202c] truncate">{name}</p>
                <p className="text-xs text-[#718096] truncate">{email}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1a202c] hover:bg-[#f4f6f8] hover:text-[#2B7DD4] transition-colors"
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#718096] hover:bg-red-50 hover:text-red-500 transition-colors mt-2"
                >
                  <LogOut size={17} />
                  Sair
                </button>
              </form>
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
