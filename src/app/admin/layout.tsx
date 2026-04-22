import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut, Store, MessageSquare } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/categorias", label: "Categorias", icon: Tag },
  { href: "/admin/conversas", label: "Conversas", icon: MessageSquare },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!(session.user as { isAdmin?: boolean }).isAdmin) redirect("/");

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex">
      <aside className="w-60 bg-[#1a202c] flex flex-col fixed top-0 left-0 h-full z-40">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B7DD4] flex items-center justify-center">
              <Store size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">Santa Clara</p>
              <p className="text-white/50 text-xs">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-2">Menu</p>
          <ul className="flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon size={17} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white transition-colors">
            ← Ver loja
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-red-400 transition-colors rounded-xl hover:bg-white/5">
              <LogOut size={15} /> Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 ml-60 min-h-screen">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
