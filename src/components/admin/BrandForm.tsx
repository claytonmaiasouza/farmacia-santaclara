"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { Brand } from "@/types/database";

interface Props {
  brand?: Brand;
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function BrandForm({ brand }: Props) {
  const router = useRouter();
  const isEdit = !!brand;

  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [logoUrl, setLogoUrl] = useState(brand?.logo_url ?? "");
  const [active, setActive] = useState(brand?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(val: string) {
    setName(val);
    if (!isEdit) setSlug(toSlug(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { name, slug, logo_url: logoUrl || null, active };
    const url = isEdit ? `/api/admin/marcas/${brand.id}` : "/api/admin/marcas";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar marca");
      setLoading(false);
      return;
    }

    router.push("/admin/marcas");
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/marcas/${brand!.id}`, { method: "DELETE" });
    router.push("/admin/marcas");
    router.refresh();
  }

  const input = "w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]";
  const lbl = "text-xs font-medium text-[#718096] mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 flex flex-col gap-4">
        <div>
          <label className={lbl}>Nome *</label>
          <input required value={name} onChange={(e) => handleNameChange(e.target.value)} className={input} />
        </div>
        <div>
          <label className={lbl}>Slug (URL)</label>
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} className={input} />
        </div>
        <div>
          <label className={lbl}>URL do logo</label>
          <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className={input} placeholder="https://..." />
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo preview" className="mt-2 h-14 object-contain rounded-lg border border-[#e2e8f0] p-1" />
          )}
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 accent-[#2B7DD4]"
          />
          <span className="text-sm text-[#1a202c]">Marca ativa</span>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar marca"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-[#e2e8f0] rounded-xl text-sm text-[#718096] hover:border-[#2B7DD4] transition-colors">
          Cancelar
        </button>
        {isEdit && (
          confirmDelete ? (
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm"
              >
                {deleting ? <Loader2 size={15} className="animate-spin" /> : "Confirmar exclusão"}
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="text-sm text-[#718096] px-3 py-3">Cancelar</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 ml-auto border border-red-200 text-red-500 hover:bg-red-50 font-semibold px-4 py-3 rounded-xl transition-colors text-sm"
            >
              <Trash2 size={15} /> Excluir marca
            </button>
          )
        )}
      </div>
    </form>
  );
}
