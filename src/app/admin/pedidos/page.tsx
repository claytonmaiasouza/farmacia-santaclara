import sql from "@/lib/db";
import AdminOrderStatus from "./OrderStatusSelect";
import type { Order, OrderItem } from "@/types/database";
import { MessageCircle, CreditCard, Store, MapPin } from "lucide-react";

interface OrderRow extends Order {
  order_items: OrderItem[];
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
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
  const orders = await sql<OrderRow[]>`
    SELECT
      o.*,
      COALESCE(
        json_agg(oi.* ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) AS order_items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

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
          const isPickup = order.notes?.includes("Retirada") || (!addr && order.payment_method === "whatsapp");
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <p className="font-bold text-[#1a202c]">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-[#718096] mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                  {order.customer_name && (
                    <p className="text-xs text-[#1a202c] mt-0.5 font-medium">{order.customer_name}</p>
                  )}
                  {isPickup ? (
                    <p className="text-xs text-[#1A5C2A] mt-0.5">Retirada no balcão — Cidade del Este</p>
                  ) : addr ? (
                    <p className="text-xs text-[#718096] mt-0.5">
                      {addr.street}, {addr.city}/{addr.state}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {order.payment_method === "whatsapp" ? (
                    <span className="flex items-center gap-1 text-xs text-[#25D366] bg-green-50 px-2 py-1 rounded-lg font-medium">
                      <MessageCircle size={12} /> WhatsApp
                    </span>
                  ) : order.payment_method === "mercadopago" ? (
                    <span className="flex items-center gap-1 text-xs text-[#2B7DD4] bg-blue-50 px-2 py-1 rounded-lg font-medium">
                      <CreditCard size={12} /> MercadoPago
                    </span>
                  ) : null}
                  {isPickup ? (
                    <span className="flex items-center gap-1 text-xs text-[#1A5C2A] bg-green-50 px-2 py-1 rounded-lg font-medium">
                      <Store size={12} /> Retirada
                    </span>
                  ) : addr ? (
                    <span className="flex items-center gap-1 text-xs text-[#718096] bg-gray-50 px-2 py-1 rounded-lg font-medium">
                      <MapPin size={12} /> Entrega
                    </span>
                  ) : null}
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${STATUS_COLOR[order.status] ?? ""}`}>
                    {STATUS_OPTIONS.find(s => s.value === order.status)?.label}
                  </span>
                  <AdminOrderStatus orderId={order.id} currentStatus={order.status} options={STATUS_OPTIONS} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#1a202c]">
                      {item.product_name}
                      <span className="text-[#718096] ml-1">x{item.quantity}</span>
                    </span>
                    <span className="text-[#718096]">
                      R$ {Number(item.total_price).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#e2e8f0] text-sm">
                <span className="text-[#718096]">
                  Frete: {Number(order.shipping) === 0 ? "Grátis" : `R$ ${Number(order.shipping).toFixed(2).replace(".", ",")}`}
                </span>
                <span className="font-bold text-[#1A5C2A]">
                  Total: R$ {Number(order.total).toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
