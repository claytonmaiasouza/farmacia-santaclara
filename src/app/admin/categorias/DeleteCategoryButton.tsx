"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : "Confirmar"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-[#718096] px-1 py-1">✕</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Excluir ${name}`}
      className="p-1.5 text-[#718096] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 size={14} />
    </button>
  );
}
