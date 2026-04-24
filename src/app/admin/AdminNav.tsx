"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Tag, MessageSquare, Layers } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/categorias", label: "Categorias", icon: Tag },
  { href: "/admin/carrosseis", label: "Carrosseis", icon: Layers },
  { href: "/admin/conversas", label: "Conversas", icon: MessageSquare },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? "bg-[#2B7DD4] text-white font-medium"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
