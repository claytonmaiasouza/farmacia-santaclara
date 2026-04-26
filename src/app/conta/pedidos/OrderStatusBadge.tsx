"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:        { label: "Aguardando pagamento", color: "text-amber-600 bg-amber-50 border-amber-100" },
  proof_received: { label: "Comprovante recebido", color: "text-orange-600 bg-orange-50 border-orange-100" },
  paid:           { label: "Pago",                 color: "text-blue-600 bg-blue-50 border-blue-100" },
  processing:     { label: "Em preparo",           color: "text-blue-600 bg-blue-50 border-blue-100" },
  shipped:        { label: "Enviado",              color: "text-purple-600 bg-purple-50 border-purple-100" },
  delivered:      { label: "Entregue",             color: "text-[#1A5C2A] bg-green-50 border-green-100" },
  cancelled:      { label: "Cancelado",            color: "text-red-600 bg-red-50 border-red-100" },
  refunded:       { label: "Reembolsado",          color: "text-gray-600 bg-gray-50 border-gray-100" },
};

export default function OrderStatusBadge({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch(`/api/conta/pedidos/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
      }
    } finally {
      setLoading(false);
    }
  }

  const s = STATUS_LABEL[status] ?? STATUS_LABEL.pending;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${s.color}`}>
        {s.label}
      </span>
      <button
        onClick={refresh}
        disabled={loading}
        title="Atualizar status"
        className="p-1.5 rounded-lg text-[#718096] hover:text-[#2B7DD4] hover:bg-blue-50 transition-colors disabled:opacity-50"
      >
        <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
}
