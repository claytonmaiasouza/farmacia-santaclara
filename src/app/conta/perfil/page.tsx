"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ProfileForm {
  full_name: string;
  phone: string;
  cpf: string;
  birth_date: string;
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({ full_name: "", phone: "", cpf: "", birth_date: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const p = data as ProfileForm & { birth_date: string | null };
        setForm({
          full_name: p.full_name ?? "",
          phone: p.phone ?? "",
          cpf: p.cpf ?? "",
          birth_date: p.birth_date ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function set(field: keyof ProfileForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        cpf: form.cpf,
        birth_date: form.birth_date || null,
      })
      .eq("id", user.id);

    if (error) {
      setError("Erro ao salvar. Tente novamente.");
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#2B7DD4]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#1a202c]">Meu perfil</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#718096] mb-1 block">Nome completo</label>
            <input value={form.full_name} onChange={(e) => set("full_name", e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
              placeholder="João da Silva" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#718096] mb-1 block">E-mail</label>
            <input value={email} disabled
              className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm bg-[#f4f6f8] text-[#718096] cursor-not-allowed" />
          </div>

          <div>
            <label className="text-xs font-medium text-[#718096] mb-1 block">Telefone</label>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
              placeholder="(11) 99999-9999" />
          </div>

          <div>
            <label className="text-xs font-medium text-[#718096] mb-1 block">CPF</label>
            <input value={form.cpf} onChange={(e) => set("cpf", e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
              placeholder="000.000.000-00" />
          </div>

          <div>
            <label className="text-xs font-medium text-[#718096] mb-1 block">Data de nascimento</label>
            <input type="date" value={form.birth_date} onChange={(e) => set("birth_date", e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]" />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-2.5">{error}</div>
        )}
        {success && (
          <div className="mt-4 bg-green-50 border border-green-100 text-[#1A5C2A] text-sm rounded-xl px-4 py-2.5">Perfil salvo com sucesso!</div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
