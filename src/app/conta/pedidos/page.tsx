import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Order, OrderItem } from "@/types/database";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: "Aguardando pagamento", color: "text-amber-600 bg-amber-50 border-amber-100" },
  paid:       { label: "Pago",                 color: "text-blue-600 bg-blue-50 border-blue-100" },
  processing: { label: "Em preparo",           color: "text-blue-600 bg-blue-50 border-blue-100" },
  shipped:    { label: "Enviado",              color: "text-purple-600 bg-purple-50 border-purple-100" },
  delivered:  { label: "Entregue",             color: "text-[#1A5C2A] bg-green-50 border-green-100" },
  cancelled:  { label: "Cancelado",            color: "text-red-600 bg-red-50 border-red-100" },
  refunded:   { label: "Reembolsado",          color: "text-gray-600 bg-gray-50 border-gray-100" },
};

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }) as { data: OrderWithItems[] | null };

  const orders = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#1a202c]">Meus pedidos</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-16 text-center">
          <ShoppingBag size={48} className="text-[#e2e8f0] mx-auto mb-4" />
          <p className="text-[#718096]">Você ainda não fez nenhum pedido.</p>
          <Link href="/" className="text-[#2B7DD4] text-sm mt-3 inline-block hover:underline">
            Começar a comprar
          </Link>
        </div>
      ) : (
        orders.map((order) => {
          const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              {/* Cabeçalho do pedido */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <p className="text-sm font-bold text-[#1a202c]">
                    Pedido #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-[#718096] mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Itens */}
              <div className="flex flex-col gap-2 mb-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#1a202c]">
                      {item.product_name}
                      <span className="text-[#718096] ml-1">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-[#1a202c]">
                      R$ {item.total_price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-3 border-t border-[#e2e8f0]">
                <div className="text-xs text-[#718096]">
                  Frete:{" "}
                  <span className={order.shipping === 0 ? "text-[#6DC040] font-medium" : ""}>
                    {order.shipping === 0 ? "Grátis" : `R$ ${order.shipping.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>
                <div className="text-base font-bold text-[#1A5C2A]">
                  Total: R$ {order.total.toFixed(2).replace(".", ",")}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
