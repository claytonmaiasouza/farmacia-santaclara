import { createClient } from "@/lib/supabase/server";
import AdminOrderStatus from "./OrderStatusSelect";
import type { Order, OrderItem } from "@/types/database";

interface OrderRow extends Order {
  order_items: OrderItem[];
}

const STATUS_OPTIONS = [
  { value: "pending",    label: "Aguardando pagamento" },
  { value: "paid",       label: "Pago" },
  { value: "processing", label: "Em preparo" },
  { value: "shipped",    label: "Enviado" },
  { value: "delivered",  label: "Entregue" },
  { value: "cancelled",  label: "Cancelado" },
  { value: "refunded",   label: "Reembolsado" },
];

const STATUS_COLOR: Record<string, string> = {
  pending:    "text-amber-600 bg-amber-50",
  paid:       "text-blue-600 bg-blue-50",
  processing: "text-blue-600 bg-blue-50",
  shipped:    "text-purple-600 bg-purple-50",
  delivered:  "text-green-700 bg-green-50",
  cancelled:  "text-red-600 bg-red-50",
  refunded:   "text-gray-600 bg-gray-50",
};

export default async function AdminOrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = (await createClient()) as any;

  const { data } = await db
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false }) as { data: OrderRow[] | null };

  const orders = data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Pedidos</h1>
        <p className="text-sm text-[#718096]">{orders.length} pedido{orders.length !== 1 ? "s" : ""} no total</p>
      </div>

      <div className="flex flex-col gap-3">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-16 text-center text-[#718096]">
            Nenhum pedido encontrado.
          </div>
        ) : orders.map((order) => {
          const addr = order.shipping_address as { name?: string; street?: string; city?: string; state?: string } | null;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              {/* Header do pedido */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <p className="font-bold text-[#1a202c]">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-[#718096] mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                  {addr && (
                    <p className="text-xs text-[#718096] mt-0.5">
                      {addr.name} · {addr.street}, {addr.city}/{addr.state}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${STATUS_COLOR[order.status] ?? ""}`}>
                    {STATUS_OPTIONS.find(s => s.value === order.status)?.label}
                  </span>
                  <AdminOrderStatus orderId={order.id} currentStatus={order.status} options={STATUS_OPTIONS} />
                </div>
              </div>

              {/* Itens */}
              <div className="flex flex-col gap-1.5 mb-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#1a202c]">
                      {item.product_name}
                      <span className="text-[#718096] ml-1">x{item.quantity}</span>
                    </span>
                    <span className="text-[#718096]">
                      R$ {item.total_price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="flex justify-between items-center pt-3 border-t border-[#e2e8f0] text-sm">
                <span className="text-[#718096]">
                  Frete: {order.shipping === 0 ? "Grátis" : `R$ ${order.shipping.toFixed(2).replace(".", ",")}`}
                </span>
                <span className="font-bold text-[#1A5C2A]">
                  Total: R$ {order.total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
