"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageSquare, Trash2, Send, RefreshCw, Phone } from "lucide-react";

interface Conversa {
  id: string;
  phone: string;
  updated_at: string;
  total_messages: number;
  last_message: { role: string; content: string } | null;
}

interface Mensagem {
  role: "user" | "assistant";
  content: string;
}

function formatPhone(phone: string) {
  return `+${phone}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function ConversasPage() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversas = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/conversas");
      if (res.ok) setConversas(await res.json());
    } catch {
      // silently ignore network errors
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMensagens = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/conversas/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMensagens(data.messages ?? []);
      }
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    loadConversas();
    const interval = setInterval(loadConversas, 5000);
    return () => clearInterval(interval);
  }, [loadConversas]);

  useEffect(() => {
    if (!selected) return;
    loadMensagens(selected);
    const interval = setInterval(() => loadMensagens(selected), 3000);
    return () => clearInterval(interval);
  }, [selected, loadMensagens]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviar() {
    if (!texto.trim() || !selected || sending) return;
    setSending(true);
    try {
      await fetch(`/api/admin/conversas/${selected}/mensagem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      setTexto("");
      await loadMensagens(selected);
    } finally {
      setSending(false);
    }
  }

  async function encerrar(id: string) {
    if (!window.confirm("Encerrar e apagar esta conversa?")) return;
    await fetch(`/api/admin/conversas/${id}`, { method: "DELETE" });
    if (selected === id) { setSelected(null); setMensagens([]); }
    await loadConversas();
  }

  const selectedConversa = conversas.find((c) => c.id === selected);

  return (
    <div className="h-[calc(100vh-3rem)] flex gap-4">
      {/* Lista */}
      <div className="w-72 shrink-0 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-green-600" />
            <span className="font-semibold text-sm text-gray-700">Conversas WhatsApp</span>
          </div>
          <button onClick={loadConversas} className="text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-center text-xs text-gray-400 py-8">Carregando...</p>}
          {!loading && conversas.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-8">Nenhuma conversa ainda</p>
          )}
          {conversas.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                selected === c.id ? "bg-green-50 border-l-2 border-l-green-500" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-medium text-gray-800">{formatPhone(c.phone)}</span>
                <span className="text-[10px] text-gray-400">{timeAgo(c.updated_at)}</span>
              </div>
              {c.last_message && (
                <p className="text-xs text-gray-500 truncate">
                  {c.last_message.role === "assistant" ? "🤖 " : "👤 "}
                  {c.last_message.content.replace("[admin] ", "✏️ ")}
                </p>
              )}
              <span className="text-[10px] text-gray-300">{c.total_messages} mensagens</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-2">
            <MessageSquare size={40} className="text-gray-200" />
            <p className="text-sm">Selecione uma conversa</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{formatPhone(selectedConversa?.phone ?? "")}</p>
                  <p className="text-xs text-gray-400">{selectedConversa?.total_messages} mensagens</p>
                </div>
              </div>
              <button
                onClick={() => encerrar(selected)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={13} /> Encerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2" style={{ background: "#f0f2f5" }}>
              {mensagens.map((m, i) => {
                const isBot = m.role === "assistant";
                const isAdmin = m.content?.startsWith("[admin]");
                const content = m.content?.replace("[admin] ", "") ?? "";
                return (
                  <div key={i} className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                        isBot
                          ? isAdmin
                            ? "bg-blue-500 text-white rounded-tl-sm"
                            : "bg-white text-gray-800 rounded-tl-sm"
                          : "bg-[#dcf8c6] text-gray-800 rounded-tr-sm"
                      }`}
                    >
                      {isAdmin && <p className="text-[10px] text-blue-100 mb-0.5">✏️ Admin</p>}
                      <p className="whitespace-pre-wrap break-words">{content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviar()}
                placeholder="Digite uma mensagem como admin..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                onClick={enviar}
                disabled={sending || !texto.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl transition-colors flex items-center gap-1.5 text-sm"
              >
                <Send size={14} /> Enviar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
