"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  currentStatus: string;
  options: { value: string; label: string }[];
}

export default function AdminOrderStatus({ orderId, currentStatus, options }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: string) {
    setLoading(true);
    await fetch(`/api/admin/pedidos/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setStatus(newStatus);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 size={14} className="animate-spin text-[#718096]" />}
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="text-xs border border-[#e2e8f0] rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-[#2B7DD4] cursor-pointer disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
