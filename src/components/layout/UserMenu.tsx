"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, ShoppingBag, Settings, LogOut, ChevronDown, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function UserMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex flex-col items-center gap-0.5 text-[#718096] hover:text-[#2B7DD4] transition-colors"
      >
        <LogIn size={22} />
        <span className="text-xs hidden lg:block">Entrar</span>
      </Link>
    );
  }

  const initial = (user.user_metadata?.full_name ?? user.email ?? "U").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[#718096] hover:text-[#2B7DD4] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#2B7DD4] text-white flex items-center justify-center text-sm font-bold">
          {initial}
        </div>
        <ChevronDown size={14} className={`transition-transform hidden lg:block ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl border border-[#e2e8f0] shadow-lg w-52 py-2 z-50">
          <div className="px-4 py-2 border-b border-[#e2e8f0] mb-1">
            <p className="text-xs font-semibold text-[#1a202c] truncate">
              {user.user_metadata?.full_name ?? "Minha conta"}
            </p>
            <p className="text-xs text-[#718096] truncate">{user.email}</p>
          </div>

          {[
            { href: "/conta", label: "Visão geral", icon: User },
            { href: "/conta/pedidos", label: "Meus pedidos", icon: ShoppingBag },
            { href: "/conta/perfil", label: "Meu perfil", icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1a202c] hover:bg-[#f4f6f8] hover:text-[#2B7DD4] transition-colors"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}

          <div className="border-t border-[#e2e8f0] mt-1 pt-1">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#718096] hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <LogOut size={15} />
                Sair
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
