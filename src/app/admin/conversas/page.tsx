"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Mensagem {
  role: string;
  content: string;
}

interface Conversa {
  id: string;
  phone: string;
  updated_at: string;
  total_messages: number;
  last_message: { role: string; content: string } | null;
  bot_pausado: boolean;
}

interface ConversaDetalhe {
  phone: string;
  messages: Mensagem[];
  updated_at: string;
  bot_pausado: boolean;
}

export default function ConversasPage() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [filtro, setFiltro] = useState<"ativas" | "encerradas">("ativas");
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<ConversaDetalhe | null>(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const mensagensRef = useRef<HTMLDivElement>(null);

  const carregarConversas = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/conversas");
      if (!res.ok) return;
      const data = await res.json();
      setConversas(Array.isArray(data) ? data : []);
    } catch {
      // silently ignore fetch errors
    }
  }, []);

  useEffect(() => {
    carregarConversas();
    const interval = setInterval(carregarConversas, 10000);
    return () => clearInterval(interval);
  }, [carregarConversas]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [detalhe]);

  async function abrirConversa(id: string) {
    setSelecionada(id);
    try {
      const res = await fetch(`/api/admin/conversas/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setDetalhe(data);
    } catch {
      // silently ignore
    }
  }

  async function togglePausar() {
    if (!selecionada) return;
    try {
      const res = await fetch(`/api/admin/conversas/${selecionada}/pausar`, {
        method: "PATCH",
      });
      if (!res.ok) return;
      const data = await res.json();
      setDetalhe((prev) => (prev ? { ...prev, bot_pausado: data.bot_pausado } : prev));
      setConversas((prev) =>
        prev.map((c) => (c.id === selecionada ? { ...c, bot_pausado: data.bot_pausado } : c))
      );
    } catch {
      // silently ignore
    }
  }

  async function encerrarConversa() {
    if (!selecionada) return;
    if (!confirm("Encerrar esta conversa? Os dados serão removidos.")) return;
    try {
      const res = await fetch(`/api/admin/conversas/${selecionada}`, { method: "DELETE" });
      if (!res.ok) return;
      setConversas((prev) => prev.filter((c) => c.id !== selecionada));
      setSelecionada(null);
      setDetalhe(null);
    } catch {
      // silently ignore
    }
  }

  async function enviarMensagem() {
    if (!selecionada || !texto.trim() || enviando) return;
    setEnviando(true);
    try {
      const res = await fetch(`/api/admin/conversas/${selecionada}/mensagem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      if (res.ok) {
        setTexto("");
        const d = await fetch(`/api/admin/conversas/${selecionada}`);
        if (d.ok) setDetalhe(await d.json());
      }
    } catch {
      // silently ignore
    }
    setEnviando(false);
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Conversas WhatsApp</h1>

      <div className="flex gap-4" style={{ height: "calc(100vh - 160px)" }}>
        {/* Lista de conversas */}
        <div className="w-72 shrink-0 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-gray-700">Conversas</span>
              <button
                onClick={carregarConversas}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ↺
              </button>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setFiltro("ativas")}
                className={`flex-1 text-xs py-1 rounded-lg transition font-medium ${
                  filtro === "ativas"
                    ? "bg-[#2B7DD4] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Ativas
              </button>
              <button
                onClick={() => setFiltro("encerradas")}
                className={`flex-1 text-xs py-1 rounded-lg transition font-medium ${
                  filtro === "encerradas"
                    ? "bg-[#2B7DD4] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Encerradas
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtro === "encerradas" ? (
              <p className="text-xs text-gray-400 text-center p-4">
                Conversas encerradas são removidas do sistema
              </p>
            ) : conversas.length === 0 ? (
              <p className="text-xs text-gray-400 text-center p-4">Nenhuma conversa ativa</p>
            ) : (
              conversas.map((c) => (
                <div
                  key={c.id}
                  onClick={() => abrirConversa(c.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 transition ${
                    selecionada === c.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-medium text-sm text-gray-800 truncate">{c.phone}</span>
                    {c.bot_pausado && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full shrink-0">
                        Pausado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {c.last_message?.content?.replace("[admin] ", "").slice(0, 50) || "..."}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área de chat */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {!selecionada ? (
            <div className="flex-1 flex items-center justify-center text-gray-300">
              <p className="text-sm">Selecione uma conversa</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {detalhe?.phone ?? selecionada}
                    </p>
                    <p className="text-xs text-gray-400">{selecionada}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={togglePausar}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                        detalhe?.bot_pausado
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-100 hover:bg-red-200 text-red-700"
                      }`}
                    >
                      {detalhe?.bot_pausado ? "▶ Retomar bot" : "⏸ Pausar bot"}
                    </button>
                    <button
                      onClick={encerrarConversa}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg transition bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      🔴 Encerrar
                    </button>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <div
                ref={mensagensRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
              >
                {detalhe?.messages.map((m, i) => {
                  const isAdmin = m.content?.startsWith("[admin]");
                  const isBot = m.role === "assistant" && !isAdmin;
                  return (
                    <div
                      key={i}
                      className={`flex ${isBot || isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[75%]">
                        <p
                          className={`text-xs text-gray-400 mb-0.5 ${
                            isBot || isAdmin ? "text-right" : ""
                          }`}
                        >
                          {isAdmin ? "👤 Admin" : isBot ? "🤖 Clarita" : "💬 Cliente"}
                        </p>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                            isAdmin
                              ? "bg-blue-500 text-white"
                              : isBot
                              ? "bg-[#e8f4fd] text-gray-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {(m.content ?? "").replace("[admin] ", "")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                  placeholder="Digite uma mensagem como admin..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7DD4]"
                />
                <button
                  onClick={enviarMensagem}
                  disabled={enviando}
                  className="bg-[#2B7DD4] hover:bg-[#2266b8] text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
