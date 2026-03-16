import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShoppingBag, ChevronRight, Package } from "lucide-react";
import type { Order } from "@/types/database";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: "Aguardando pagamento", color: "text-amber-600 bg-amber-50" },
  paid:       { label: "Pago",                 color: "text-blue-600 bg-blue-50" },
  processing: { label: "Em preparo",           color: "text-blue-600 bg-blue-50" },
  shipped:    { label: "Enviado",              color: "text-purple-600 bg-purple-50" },
  delivered:  { label: "Entregue",             color: "text-[#1A5C2A] bg-green-50" },
  cancelled:  { label: "Cancelado",            color: "text-red-600 bg-red-50" },
  refunded:   { label: "Reembolsado",          color: "text-gray-600 bg-gray-50" },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orders } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3) as { data: Order[] | null };

  const recentOrders = orders ?? [];

  return (
    <div className="flex flex-col gap-5">
      {/* Boas vindas */}
      <div className="bg-gradient-to-r from-[#2B7DD4] to-[#1a5fa8] rounded-2xl p-6 text-white">
        <h1 className="text-xl font-bold">Olá! 👋</h1>
        <p className="text-white/80 text-sm mt-1">Bem-vindo à sua conta na Farmácia Santa Clara.</p>
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/conta/pedidos"
          className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex items-center gap-3 hover:border-[#2B7DD4] transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <ShoppingBag size={20} className="text-[#2B7DD4]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a202c]">Meus pedidos</p>
            <p className="text-xs text-[#718096]">{recentOrders.length} recente{recentOrders.length !== 1 ? "s" : ""}</p>
          </div>
        </Link>

        <Link
          href="/conta/perfil"
          className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex items-center gap-3 hover:border-[#2B7DD4] transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Package size={20} className="text-[#1A5C2A]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a202c]">Meu perfil</p>
            <p className="text-xs text-[#718096]">Dados pessoais</p>
          </div>
        </Link>
      </div>

      {/* Últimos pedidos */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1a202c]">Últimos pedidos</h2>
          <Link href="/conta/pedidos" className="text-xs text-[#2B7DD4] hover:underline flex items-center gap-1">
            Ver todos <ChevronRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag size={40} className="text-[#e2e8f0] mx-auto mb-3" />
            <p className="text-[#718096] text-sm">Você ainda não fez nenhum pedido.</p>
            <Link href="/" className="text-[#2B7DD4] text-sm mt-2 inline-block hover:underline">
              Começar a comprar
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => {
              const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
              return (
                <Link
                  key={order.id}
                  href={`/conta/pedidos`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f4f6f8] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1a202c]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#718096]">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-sm font-bold text-[#1A5C2A]">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
