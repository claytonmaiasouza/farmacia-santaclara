"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Mail, Search, Users, CheckSquare, Square, Send, X, Loader2 } from "lucide-react";

interface Cliente {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  cpf: string | null;
  birth_date: string | null;
  created_at: string;
  total_orders: number;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface EmailModalProps {
  recipients: Cliente[];
  onClose: () => void;
  onSent: () => void;
}

function EmailModal({ recipients, onClose, onSent }: EmailModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; errors: string[] } | null>(null);

  async function handleSend() {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    const res = await fetch("/api/admin/clientes/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipients: recipients.map((r) => r.email),
        subject,
        message,
      }),
    });
    const data = await res.json();
    setResult(data);
    setSending(false);
    if (data.sent > 0) onSent();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
          <div>
            <h2 className="font-bold text-[#1a202c]">Enviar E-mail</h2>
            <p className="text-xs text-[#718096] mt-0.5">{recipients.length} destinatário{recipients.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="text-[#718096] hover:text-[#1a202c]"><X size={20} /></button>
        </div>

        {result ? (
          <div className="p-6 text-center flex flex-col items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${result.errors.length === 0 ? "bg-green-100" : "bg-amber-100"}`}>
              <Send size={24} className={result.errors.length === 0 ? "text-green-600" : "text-amber-600"} />
            </div>
            <p className="font-semibold text-[#1a202c]">{result.sent} e-mail{result.sent !== 1 ? "s" : ""} enviado{result.sent !== 1 ? "s" : ""}!</p>
            {result.errors.length > 0 && (
              <p className="text-xs text-red-500">Falha em: {result.errors.join(", ")}</p>
            )}
            <button onClick={onClose} className="bg-[#2B7DD4] text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#2266b8] transition">
              Fechar
            </button>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-4 overflow-y-auto">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 max-h-24 overflow-y-auto">
              <div className="flex flex-wrap gap-1.5">
                {recipients.map((r) => (
                  <span key={r.id} className="text-[11px] bg-white border border-[#e2e8f0] px-2 py-0.5 rounded-full text-[#4a5568]">
                    {r.full_name ? `${r.full_name} <${r.email}>` : r.email}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#718096] mb-1 block">Assunto *</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                placeholder="Ex: Novidades da Farmácia Santa Clara"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#718096] mb-1 block">Mensagem *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={7}
                className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4] resize-none"
                placeholder="Digite sua mensagem aqui..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={onClose} className="text-sm px-4 py-2 rounded-xl border border-[#e2e8f0] text-[#718096] hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !subject.trim() || !message.trim()}
                className="flex items-center gap-2 text-sm px-5 py-2 rounded-xl bg-[#2B7DD4] hover:bg-[#2266b8] text-white font-medium transition disabled:opacity-60"
              >
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {sending ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/clientes");
    if (res.ok) setClientes(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtrados = clientes.filter((c) => {
    const q = busca.toLowerCase();
    return (
      c.email.toLowerCase().includes(q) ||
      (c.full_name ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q)
    );
  });

  function toggleSelect(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selecionados.size === filtrados.length) {
      setSelecionados(new Set());
    } else {
      setSelecionados(new Set(filtrados.map((c) => c.id)));
    }
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Remover o cadastro de ${email}?`)) return;
    await fetch(`/api/admin/clientes/${id}`, { method: "DELETE" });
    setClientes((prev) => prev.filter((c) => c.id !== id));
    setSelecionados((prev) => { const next = new Set(prev); next.delete(id); return next; });
  }

  const recipientsSelecionados = filtrados.filter((c) => selecionados.has(c.id));
  const todosSelec = filtrados.length > 0 && selecionados.size === filtrados.length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-[#2B7DD4]" /> Clientes Cadastrados
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">{clientes.length} cadastro{clientes.length !== 1 ? "s" : ""} no total</p>
        </div>
        <div className="flex gap-2">
          {selecionados.size > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#2266b8] text-white text-sm font-medium px-4 py-2 rounded-xl transition"
            >
              <Mail size={15} /> Enviar e-mail ({selecionados.size})
            </button>
          )}
          <button
            onClick={() => { setSelecionados(new Set(clientes.map((c) => c.id))); setShowModal(true); }}
            className="flex items-center gap-2 border border-[#e2e8f0] hover:border-[#2B7DD4] hover:text-[#2B7DD4] text-[#718096] text-sm font-medium px-4 py-2 rounded-xl transition bg-white"
          >
            <Mail size={15} /> E-mail para todos
          </button>
        </div>
      </div>

      {/* Busca e seleção */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="w-full pl-9 pr-3 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#2B7DD4]"
          />
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#2B7DD4] transition"
        >
          {todosSelec ? <CheckSquare size={15} className="text-[#2B7DD4]" /> : <Square size={15} />}
          {todosSelec ? "Desmarcar todos" : "Selecionar todos"}
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[#718096]" />
          </div>
        ) : filtrados.length === 0 ? (
          <p className="text-center text-[#718096] text-sm py-16">Nenhum cliente encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <th className="w-10 px-4 py-3"></th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#718096] uppercase tracking-wide">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#718096] uppercase tracking-wide">E-mail</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#718096] uppercase tracking-wide">Telefone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#718096] uppercase tracking-wide">Cadastro</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[#718096] uppercase tracking-wide">Pedidos</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr
                    key={c.id}
                    className={`border-b border-[#f4f6f8] hover:bg-[#f8fafc] transition-colors ${selecionados.has(c.id) ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(c.id)} className="text-[#718096] hover:text-[#2B7DD4]">
                        {selecionados.has(c.id)
                          ? <CheckSquare size={16} className="text-[#2B7DD4]" />
                          : <Square size={16} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#1a202c]">{c.full_name || "—"}</p>
                      {c.cpf && <p className="text-[11px] text-[#718096]">CPF: {c.cpf}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4a5568]">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-[#4a5568]">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-sm text-[#718096]">{fmtDate(c.created_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.total_orders > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.total_orders}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => { setSelecionados(new Set([c.id])); setShowModal(true); }}
                          className="p-1.5 text-[#718096] hover:text-[#2B7DD4] rounded-lg hover:bg-blue-50 transition"
                          title="Enviar e-mail"
                        >
                          <Mail size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.email)}
                          className="p-1.5 text-[#718096] hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                          title="Remover cadastro"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <EmailModal
          recipients={recipientsSelecionados.length > 0 ? recipientsSelecionados : clientes}
          onClose={() => { setShowModal(false); setSelecionados(new Set()); }}
          onSent={() => {}}
        />
      )}
    </div>
  );
}
