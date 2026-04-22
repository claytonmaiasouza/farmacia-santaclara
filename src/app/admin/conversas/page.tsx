"use client";

import { useEffect, useState } from "react";

export default function ConversasPage() {
  const [conversas, setConversas] = useState<{ id: string; phone: string; updated_at: string; total_messages: number; last_message: { role: string; content: string } | null }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<{ role: string; content: string }[]>([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/conversas")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setConversas(data); setLoading(false); })
      .catch(() => setLoading(false));

    const t = setInterval(() => {
      fetch("/api/admin/conversas")
        .then((r) => r.ok ? r.json() : [])
        .then(setConversas)
        .catch(() => {});
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!selected) { setMensagens([]); return; }
    const load = () => fetch(`/api/admin/conversas/${selected}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setMensagens(d.messages ?? []))
      .catch(() => {});
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [selected]);

  async function enviar() {
    if (!texto.trim() || !selected) return;
    await fetch(`/api/admin/conversas/${selected}/mensagem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    }).catch(() => {});
    setTexto("");
  }

  async function encerrar(id: string) {
    if (!window.confirm("Encerrar esta conversa?")) return;
    await fetch(`/api/admin/conversas/${id}`, { method: "DELETE" }).catch(() => {});
    if (selected === id) setSelected(null);
    setConversas((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 96px)" }}>
      {/* Lista */}
      <div style={{ width: 280, background: "#fff", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", fontWeight: 600, fontSize: 14 }}>
          Conversas WhatsApp
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && <p style={{ textAlign: "center", color: "#aaa", fontSize: 13, padding: 24 }}>Carregando...</p>}
          {!loading && conversas.length === 0 && (
            <p style={{ textAlign: "center", color: "#aaa", fontSize: 13, padding: 24 }}>Nenhuma conversa</p>
          )}
          {conversas.map((c) => (
            <button key={c.id} onClick={() => setSelected(c.id)}
              style={{ width: "100%", textAlign: "left", padding: "12px 16px", borderBottom: "1px solid #f9f9f9", background: selected === c.id ? "#f0fdf4" : "#fff", cursor: "pointer", display: "block" }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>+{c.phone}</div>
              {c.last_message?.content && (
                <div style={{ fontSize: 12, color: "#888", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {c.last_message.content.replace("[admin] ", "")}
                </div>
              )}
              <div style={{ fontSize: 11, color: "#ccc" }}>{c.total_messages} msgs</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, background: "#fff", borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 14 }}>
            Selecione uma conversa
          </div>
        ) : (
          <>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>+{selected}</span>
              <button onClick={() => encerrar(selected)}
                style={{ fontSize: 12, color: "#ef4444", background: "#fef2f2", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
                Encerrar
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#f0f2f5", display: "flex", flexDirection: "column", gap: 8 }}>
              {mensagens.map((m, i) => {
                const isBot = m.role === "assistant";
                const isAdmin = m.content?.startsWith("[admin]");
                const text = m.content?.replace("[admin] ", "") ?? "";
                return (
                  <div key={i} style={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end" }}>
                    <div style={{
                      maxWidth: "75%", padding: "8px 12px", borderRadius: 16, fontSize: 13,
                      background: isBot ? (isAdmin ? "#3b82f6" : "#fff") : "#dcf8c6",
                      color: isAdmin ? "#fff" : "#222",
                    }}>
                      {isAdmin && <div style={{ fontSize: 10, color: "#bfdbfe", marginBottom: 2 }}>✏️ Admin</div>}
                      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: 12, borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
              <input value={texto} onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviar()}
                placeholder="Digite uma mensagem como admin..."
                style={{ flex: 1, padding: "8px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 10, outline: "none" }} />
              <button onClick={enviar} disabled={!texto.trim()}
                style={{ padding: "8px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13 }}>
                Enviar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
