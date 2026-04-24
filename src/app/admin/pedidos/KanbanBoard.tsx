"use client";

import { useState } from "react";
import { Loader2, MessageCircle, CreditCard, Store, MapPin, Monitor } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  total_price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  payment_method: string | null;
  shipping_address: { name?: string; street?: string; city?: string; state?: string } | null;
  notes: string | null;
  customer_name?: string;
  customer_phone?: string;
  created_at: string;
  order_items: OrderItem[];
}

const COLUMNS = [
  { value: "pending",    label: "Aguardando",  color: "border-t-amber-400",  bg: "bg-amber-50",  text: "text-amber-700" },
  { value: "paid",       label: "Pago",        color: "border-t-blue-400",   bg: "bg-blue-50",   text: "text-blue-700" },
  { value: "processing", label: "Em preparo",  color: "border-t-indigo-400", bg: "bg-indigo-50", text: "text-indigo-700" },
  { value: "shipped",    label: "Enviado",     color: "border-t-purple-400", bg: "bg-purple-50", text: "text-purple-700" },
  { value: "delivered",  label: "Entregue",    color: "border-t-green-400",  bg: "bg-green-50",  text: "text-green-700" },
  { value: "cancelled",  label: "Cancelado",   color: "border-t-red-400",    bg: "bg-red-50",    text: "text-red-700" },
  { value: "refunded",   label: "Reembolsado", color: "border-t-gray-400",   bg: "bg-gray-100",  text: "text-gray-600" },
];

const ALL_STATUSES = COLUMNS.map((c) => ({ value: c.value, label: c.label }));

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, status: string) => void }) {
  const [loading, setLoading] = useState(false);
  const isPickup = order.notes?.includes("Retirada") || (!order.shipping_address && order.payment_method === "whatsapp");
  const addr = order.shipping_address;

  async function handleMove(newStatus: string) {
    setLoading(true);
    await fetch(`/api/admin/pedidos/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    onStatusChange(order.id, newStatus);
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-3 flex flex-col gap-2 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[#1a202c]">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-[10px] text-[#718096]">
            {new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
          </p>
          {order.customer_name && <p className="text-xs font-medium text-[#1a202c] mt-0.5">{order.customer_name}</p>}
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {order.payment_method === "whatsapp" && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#25D366] bg-green-50 px-1.5 py-0.5 rounded font-medium">
              <MessageCircle size={9} /> WA
            </span>
          )}
          {order.payment_method === "mercadopago" && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#2B7DD4] bg-blue-50 px-1.5 py-0.5 rounded font-medium">
              <CreditCard size={9} /> MP
            </span>
          )}
          {order.payment_method === "site_chat" && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#718096] bg-gray-50 px-1.5 py-0.5 rounded font-medium">
              <Monitor size={9} /> Chat
            </span>
          )}
          {isPickup ? (
            <span className="flex items-center gap-0.5 text-[10px] text-[#1A5C2A] bg-green-50 px-1.5 py-0.5 rounded font-medium">
              <Store size={9} /> Retirada
            </span>
          ) : addr ? (
            <span className="flex items-center gap-0.5 text-[10px] text-[#718096] bg-gray-50 px-1.5 py-0.5 rounded font-medium">
              <MapPin size={9} /> Entrega
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {order.order_items.slice(0, 3).map((item) => (
          <p key={item.id} className="text-[11px] text-[#4a5568] truncate">
            {item.quantity}x {item.product_name}
          </p>
        ))}
        {order.order_items.length > 3 && (
          <p className="text-[11px] text-[#718096]">+{order.order_items.length - 3} item(s)</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#f4f6f8]">
        <p className="text-xs font-bold text-[#1A5C2A]">R$ {Number(order.total).toFixed(2).replace(".", ",")}</p>
        <div className="flex items-center gap-1">
          {loading && <Loader2 size={11} className="animate-spin text-[#718096]" />}
          <select
            value={order.status}
            onChange={(e) => handleMove(e.target.value)}
            disabled={loading}
            className="text-[10px] border border-[#e2e8f0] rounded-lg px-1.5 py-1 bg-white focus:outline-none focus:border-[#2B7DD4] cursor-pointer disabled:opacity-60 max-w-[110px]"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  function handleStatusChange(id: string, newStatus: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
  }

  const total = orders.length;

  return (
    <div>
      <p className="text-sm text-[#718096] mb-4">{total} pedido{total !== 1 ? "s" : ""} no total</p>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.value);
          return (
            <div key={col.value} className={`flex-shrink-0 w-64 rounded-2xl border-t-4 ${col.color} bg-[#f8fafc] border border-[#e2e8f0] flex flex-col`}>
              <div className="px-3 py-2.5 flex items-center justify-between border-b border-[#e2e8f0]">
                <span className={`text-xs font-bold ${col.text}`}>{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{colOrders.length}</span>
              </div>
              <div className="flex flex-col gap-2 p-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
                {colOrders.length === 0 ? (
                  <p className="text-center text-[#718096] text-xs py-6 italic">Nenhum pedido</p>
                ) : colOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
