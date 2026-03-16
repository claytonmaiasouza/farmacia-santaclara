import { createClient } from "@/lib/supabase/server";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import type { Order } from "@/types/database";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: "Aguardando",  color: "text-amber-600 bg-amber-50" },
  paid:       { label: "Pago",        color: "text-blue-600 bg-blue-50" },
  processing: { label: "Em preparo",  color: "text-blue-600 bg-blue-50" },
  shipped:    { label: "Enviado",     color: "text-purple-600 bg-purple-50" },
  delivered:  { label: "Entregue",    color: "text-green-700 bg-green-50" },
  cancelled:  { label: "Cancelado",   color: "text-red-600 bg-red-50" },
  refunded:   { label: "Reembolsado", color: "text-gray-600 bg-gray-50" },
};

export default async function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = (await createClient()) as any;

  const [
    { count: totalProducts },
    { count: totalOrders },
    { data: revenueData },
    { data: recentOrders },
    { count: lowStock },
  ] = await Promise.all([
    db.from("products").select("*", { count: "exact", head: true }).eq("active", true),
    db.from("orders").select("*", { count: "exact", head: true }),
    db.from("orders").select("total").in("status", ["paid", "processing", "shipped", "delivered"]),
    db.from("orders").select("*").order("created_at", { ascending: false }).limit(8),
    db.from("products").select("*", { count: "exact", head: true }).lte("stock", 5).eq("active", true),
  ]);

  const revenue = (revenueData as { total: number }[] ?? []).reduce((s: number, o: { total: number }) => s + o.total, 0);
  const orders = (recentOrders as Order[]) ?? [];

  const stats = [
    { label: "Produtos ativos", value: totalProducts ?? 0, icon: Package, color: "bg-blue-50 text-[#2B7DD4]" },
    { label: "Pedidos totais", value: totalOrders ?? 0, icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
    { label: "Receita total", value: `R$ ${revenue.toFixed(2).replace(".", ",")}`, icon: DollarSign, color: "bg-green-50 text-[#1A5C2A]" },
    { label: "Estoque baixo", value: lowStock ?? 0, icon: TrendingUp, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Dashboard</h1>
        <p className="text-[#718096] text-sm mt-0.5">Visão geral da Farmácia Santa Clara</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a202c]">{value}</p>
              <p className="text-xs text-[#718096] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pedidos recentes */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
          <h2 className="font-bold text-[#1a202c]">Pedidos recentes</h2>
          <a href="/admin/pedidos" className="text-xs text-[#2B7DD4] hover:underline">Ver todos →</a>
        </div>
        {orders.length === 0 ? (
          <div className="px-5 py-10 text-center text-[#718096] text-sm">Nenhum pedido ainda.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {orders.map((order) => {
              const s = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
              const addr = order.shipping_address as { name?: string } | null;
              return (
                <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#f4f6f8] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#1a202c]">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-[#718096]">
                      {addr?.name ?? "—"} · {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${s.color}`}>{s.label}</span>
                    <span className="text-sm font-bold text-[#1A5C2A]">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
