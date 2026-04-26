"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Store, MapPin, Mail, CheckCircle2, RefreshCw, FileText, X, Tag, Trash2 } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  total_price: number;
}

interface ProofData {
  email_from: string;
  email_subject: string;
  received_at: string;
  proof_file?: string | null;
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
  customer_email?: string;
  coupon_code?: string | null;
  created_at: string;
  order_items: OrderItem[];
  proof_data?: ProofData | null;
}

const COLUMNS = [
  { value: "pending",        label: "Aguardando",    color: "border-t-amber-400",  bg: "bg-amber-50",   text: "text-amber-700" },
  { value: "proof_received", label: "Comprovante",   color: "border-t-orange-400", bg: "bg-orange-50",  text: "text-orange-700" },
  { value: "paid",           label: "Pago",          color: "border-t-blue-400",   bg: "bg-blue-50",    text: "text-blue-700" },
  { value: "processing",     label: "Em preparo",    color: "border-t-indigo-400", bg: "bg-indigo-50",  text: "text-indigo-700" },
  { value: "shipped",        label: "Enviado",       color: "border-t-purple-400", bg: "bg-purple-50",  text: "text-purple-700" },
  { value: "delivered",      label: "Entregue",      color: "border-t-green-400",  bg: "bg-green-50",   text: "text-green-700" },
  { value: "cancelled",      label: "Cancelado",     color: "border-t-red-400",    bg: "bg-red-50",     text: "text-red-700" },
  { value: "refunded",       label: "Reembolsado",   color: "border-t-gray-400",   bg: "bg-gray-100",   text: "text-gray-600" },
];

const ALL_STATUSES = COLUMNS.map((c) => ({ value: c.value, label: c.label }));

function ProofModal({ url, onClose }: { url: string; onClose: () => void }) {
  const isPdf = url.toLowerCase().endsWith(".pdf");
  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-9 right-0 text-white hover:text-gray-300 transition"
        >
          <X size={26} />
        </button>
        {isPdf ? (
          <iframe
            src={url}
            className="rounded-xl shadow-2xl"
            style={{ width: "min(90vw, 800px)", height: "min(85vh, 900px)" }}
          />
        ) : (
          <img
            src={url}
            alt="Comprovante"
            className="rounded-xl shadow-2xl object-contain"
            style={{ maxWidth: "90vw", maxHeight: "85vh" }}
          />
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onStatusChange, onDelete, onViewProof }: { order: Order; onStatusChange: (id: string, status: string) => void; onDelete: (id: string) => void; onViewProof: (url: string) => void }) {
  const [loading, setLoading] = useState(false);
  const isPickup = order.notes?.includes("Retirada") || (!order.shipping_address && order.payment_method === "whatsapp");
  const addr = order.shipping_address;
  const isProof = order.status === "proof_received";
  const isCancelled = order.status === "cancelled";

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

  async function handleDelete() {
    if (!confirm("Apagar este pedido permanentemente?")) return;
    setLoading(true);
    await fetch(`/api/admin/pedidos/${order.id}`, { method: "DELETE" });
    onDelete(order.id);
  }

  return (
    <div className={`bg-white rounded-xl border p-3 flex flex-col gap-2 hover:shadow-sm transition-shadow ${isProof ? "border-orange-300 bg-orange-50/30" : "border-[#e2e8f0]"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[#1a202c]">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-[10px] text-[#718096]">
            {new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
          </p>
          {order.customer_name && <p className="text-xs font-medium text-[#1a202c] mt-0.5">{order.customer_name}</p>}
          {order.customer_email && <p className="text-[10px] text-[#718096] truncate">{order.customer_email}</p>}
          {order.customer_phone && <p className="text-[10px] text-[#718096]">{order.customer_phone}</p>}
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {order.payment_method === "whatsapp" && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#25D366] bg-green-50 px-1.5 py-0.5 rounded font-medium">
              <MessageCircle size={9} /> WA
            </span>
          )}
          {order.payment_method === "pix" && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#1A5C2A] bg-green-50 px-1.5 py-0.5 rounded font-medium">
              Pix
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

      {order.coupon_code && (
        <div className="flex items-center gap-1 text-[10px] text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-2 py-1 w-fit">
          <Tag size={9} /> <span className="font-bold font-mono">{order.coupon_code}</span>
        </div>
      )}

      {/* Comprovante recebido */}
      {isProof && order.proof_data && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex flex-col gap-1">
          <p className="text-[10px] font-bold text-orange-700 flex items-center gap-1">
            <Mail size={9} /> Comprovante recebido
          </p>
          <p className="text-[10px] text-orange-600 truncate">{order.proof_data.email_from}</p>
          <p className="text-[10px] text-orange-500 truncate italic">{order.proof_data.email_subject}</p>
          {order.proof_data.proof_file ? (
            <button
              onClick={() => onViewProof(order.proof_data!.proof_file!)}
              className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-white bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded-lg transition w-fit"
            >
              <FileText size={9} /> Ver Comprovante
            </button>
          ) : (
            <p className="text-[10px] text-orange-400 italic">Sem anexo no e-mail</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-[#f4f6f8] gap-1">
        <p className="text-xs font-bold text-[#1A5C2A]">R$ {Number(order.total).toFixed(2).replace(".", ",")}</p>
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {loading && <Loader2 size={11} className="animate-spin text-[#718096]" />}
          {isProof && (
            <button
              onClick={() => handleMove("paid")}
              disabled={loading}
              className="flex items-center gap-0.5 text-[10px] bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg font-semibold transition disabled:opacity-60"
            >
              <CheckCircle2 size={10} /> Confirmar Pag.
            </button>
          )}
          {isCancelled && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-0.5 text-[10px] bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg font-semibold transition disabled:opacity-60"
              title="Apagar pedido"
            >
              <Trash2 size={10} /> Apagar
            </button>
          )}
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
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [proofModal, setProofModal] = useState<string | null>(null);
  const router = useRouter();

  function handleStatusChange(id: string, newStatus: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
  }

  function handleDelete(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  async function handleCheckEmails() {
    setChecking(true);
    setCheckResult(null);
    try {
      const res = await fetch("/api/admin/check-emails", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setCheckResult(`Erro: ${data.error}`);
      } else {
        const count = data.found?.length ?? 0;
        setCheckResult(count > 0 ? `${count} comprovante(s) detectado(s)!` : "Nenhum comprovante novo.");
        if (count > 0) router.refresh();
      }
    } catch {
      setCheckResult("Erro ao verificar e-mails.");
    }
    setChecking(false);
  }

  const total = orders.length;

  return (
    <div>
      {proofModal && <ProofModal url={proofModal} onClose={() => setProofModal(null)} />}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#718096]">{total} pedido{total !== 1 ? "s" : ""} no total</p>
        <div className="flex items-center gap-3">
          {checkResult && (
            <span className="text-xs text-[#718096]">{checkResult}</span>
          )}
          <button
            onClick={handleCheckEmails}
            disabled={checking}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#e2e8f0] hover:border-[#2B7DD4] hover:text-[#2B7DD4] transition bg-white disabled:opacity-60"
          >
            {checking ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Verificar E-mails
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.value);
          return (
            <div key={col.value} className={`flex-shrink-0 w-64 rounded-2xl border-t-4 ${col.color} bg-[#f8fafc] border border-[#e2e8f0] flex flex-col`}>
              <div className="px-3 py-2.5 flex items-center justify-between border-b border-[#e2e8f0]">
                <span className={`text-xs font-bold ${col.text}`}>{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{colOrders.length}</span>
              </div>
              <div className="flex flex-col gap-2 p-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                {colOrders.length === 0 ? (
                  <p className="text-center text-[#718096] text-xs py-6 italic">Nenhum pedido</p>
                ) : colOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} onDelete={handleDelete} onViewProof={setProofModal} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
