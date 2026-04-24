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

interface HistoricoItem {
  id: string;
  phone: string;
  started_at: string;
  closed_at: string;
  total_messages: number;
  last_message: { role: string; content: string } | null;
}

interface HistoricoDetalhe {
  phone: string;
  messages: Mensagem[];
  started_at: string;
  closed_at: string;
  total_messages: number;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ConversasPage() {
  const [conversas, setConversas]       = useState<Conversa[]>([]);
  const [historico, setHistorico]       = useState<HistoricoItem[]>([]);
  const [filtro, setFiltro]             = useState<"ativas" | "encerradas">("ativas");
  const [selecionada, setSelecionada]   = useState<string | null>(null);
  const [detalhe, setDetalhe]           = useState<ConversaDetalhe | null>(null);
  const [histDetalhe, setHistDetalhe]   = useState<HistoricoDetalhe | null>(null);
  const [texto, setTexto]               = useState("");
  const [enviando, setEnviando]         = useState(false);
  const mensagensRef = useRef<HTMLDivElement>(null);

  const carregarConversas = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/conversas");
      if (!res.ok) return;
      const data = await res.json();
      setConversas(Array.isArray(data) ? data : []);
    } catch { /* silently ignore */ }
  }, []);

  const carregarHistorico = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/conversas/historico");
      if (!res.ok) return;
      const data = await res.json();
      setHistorico(Array.isArray(data) ? data : []);
    } catch { /* silently ignore */ }
  }, []);

  useEffect(() => {
    carregarConversas();
    const interval = setInterval(carregarConversas, 10000);
    return () => clearInterval(interval);
  }, [carregarConversas]);

  useEffect(() => {
    if (filtro === "encerradas") {
      carregarHistorico();
      setSelecionada(null);
      setDetalhe(null);
      setHistDetalhe(null);
    } else {
      setSelecionada(null);
      setHistDetalhe(null);
    }
  }, [filtro, carregarHistorico]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [detalhe, histDetalhe]);

  async function abrirConversa(id: string) {
    setSelecionada(id);
    setHistDetalhe(null);
    try {
      const res = await fetch(`/api/admin/conversas/${id}`);
      if (!res.ok) return;
      setDetalhe(await res.json());
    } catch { /* silently ignore */ }
  }

  async function abrirHistorico(id: string) {
    setSelecionada(id);
    setDetalhe(null);
    try {
      const res = await fetch(`/api/admin/conversas/historico/${id}`);
      if (!res.ok) return;
      setHistDetalhe(await res.json());
    } catch { /* silently ignore */ }
  }

  async function togglePausar() {
    if (!selecionada) return;
    try {
      const res = await fetch(`/api/admin/conversas/${selecionada}/pausar`, { method: "PATCH" });
      if (!res.ok) return;
      const data = await res.json();
      setDetalhe((prev) => (prev ? { ...prev, bot_pausado: data.bot_pausado } : prev));
      setConversas((prev) =>
        prev.map((c) => (c.id === selecionada ? { ...c, bot_pausado: data.bot_pausado } : c))
      );
    } catch { /* silently ignore */ }
  }

  async function encerrarConversa() {
    if (!selecionada) return;
    if (!confirm("Encerrar esta conversa? Ela será arquivada no histórico permanente.")) return;
    try {
      const res = await fetch(`/api/admin/conversas/${selecionada}`, { method: "DELETE" });
      if (!res.ok) return;
      setConversas((prev) => prev.filter((c) => c.id !== selecionada));
      setSelecionada(null);
      setDetalhe(null);
    } catch { /* silently ignore */ }
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
    } catch { /* silently ignore */ }
    setEnviando(false);
  }

  function renderMensagens(messages: Mensagem[]) {
    return messages.map((m, i) => {
      const isAdmin = m.content?.startsWith("[admin]");
      const isBot   = m.role === "assistant" && !isAdmin;
      return (
        <div key={i} className={`flex ${isBot || isAdmin ? "justify-end" : "justify-start"}`}>
          <div className="max-w-[75%]">
            <p className={`text-xs text-gray-400 mb-0.5 ${isBot || isAdmin ? "text-right" : ""}`}>
              {isAdmin ? "👤 Admin" : isBot ? "🤖 Clarita" : "💬 Cliente"}
            </p>
            <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
              isAdmin ? "bg-blue-500 text-white" : isBot ? "bg-[#e8f4fd] text-gray-800" : "bg-gray-100 text-gray-800"
            }`}>
              {(m.content ?? "").replace("[admin] ", "")}
            </div>
          </div>
        </div>
      );
    });
  }

  const isHistoricoAberto = filtro === "encerradas" && histDetalhe !== null;
  const isAtivoAberto     = filtro === "ativas"     && detalhe !== null;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Conversas WhatsApp</h1>

      <div className="flex gap-4" style={{ height: "calc(100vh - 160px)" }}>
        {/* Lista */}
        <div className="w-72 shrink-0 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-gray-700">Conversas</span>
              <button
                onClick={filtro === "ativas" ? carregarConversas : carregarHistorico}
                className="text-xs text-gray-400 hover:text-gray-600"
              >↺</button>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setFiltro("ativas")}
                className={`flex-1 text-xs py-1 rounded-lg transition font-medium ${
                  filtro === "ativas" ? "bg-[#2B7DD4] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Ativas {conversas.length > 0 && <span className="ml-1">({conversas.length})</span>}
              </button>
              <button
                onClick={() => setFiltro("encerradas")}
                className={`flex-1 text-xs py-1 rounded-lg transition font-medium ${
                  filtro === "encerradas" ? "bg-[#2B7DD4] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Histórico {historico.length > 0 && <span className="ml-1">({historico.length})</span>}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtro === "ativas" ? (
              conversas.length === 0 ? (
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
              )
            ) : (
              historico.length === 0 ? (
                <p className="text-xs text-gray-400 text-center p-4">Nenhuma conversa encerrada ainda</p>
              ) : (
                historico.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => abrirHistorico(h.id)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 transition ${
                      selecionada === h.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-medium text-sm text-gray-800 truncate">{h.phone}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">{h.total_messages} msgs</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {h.last_message?.content?.replace("[admin] ", "").slice(0, 50) || "..."}
                    </p>
                    <p className="text-[10px] text-gray-300 mt-0.5">{fmtDate(h.closed_at)}</p>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Área de chat */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {!selecionada || (!isAtivoAberto && !isHistoricoAberto) ? (
            <div className="flex-1 flex items-center justify-center text-gray-300">
              <p className="text-sm">Selecione uma conversa</p>
            </div>
          ) : isHistoricoAberto ? (
            /* Histórico — somente leitura */
            <>
              <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{histDetalhe!.phone}</p>
                    <p className="text-xs text-gray-400">
                      Encerrada em {fmtDate(histDetalhe!.closed_at)} · {histDetalhe!.total_messages} mensagens
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg font-medium">
                    Histórico arquivado
                  </span>
                </div>
              </div>
              <div ref={mensagensRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {renderMensagens(histDetalhe!.messages)}
              </div>
            </>
          ) : (
            /* Conversa ativa */
            <>
              <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{detalhe?.phone ?? selecionada}</p>
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

              <div ref={mensagensRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {renderMensagens(detalhe?.messages ?? [])}
              </div>

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
