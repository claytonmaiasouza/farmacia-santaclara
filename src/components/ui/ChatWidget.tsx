"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "595000000000";

export default function ChatWidget() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user?.id;
  const userName = session?.user?.name ?? null;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Greeting changes based on auth status once session resolves
  useEffect(() => {
    if (status === "loading") return;
    const greeting = isLoggedIn && userName
      ? `Olá, ${userName.split(" ")[0]}! 👋 Sou a Clarita, assistente da Farmácia Santa Clara. Como posso te ajudar hoje?`
      : "Olá! 👋 Sou a Clarita, assistente da Farmácia Santa Clara. Como posso te ajudar?";
    setMessages([{ role: "assistant", content: greeting }]);
  }, [status, isLoggedIn, userName]);

  const sessionId = useMemo(() => {
    if (isLoggedIn && session?.user?.id) return `user-${session.user.id}`;
    if (typeof window === "undefined") return "";
    const key = "sc_chat_session";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const newId = crypto.randomUUID();
    localStorage.setItem(key, newId);
    return newId;
  }, [isLoggedIn, session?.user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          sessionId,
          userId: session?.user?.id ?? null,
          userName: session?.user?.name ?? null,
          userEmail: session?.user?.email ?? null,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Erro ao responder. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Chat box */}
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] flex flex-col overflow-hidden" style={{ height: "480px" }}>
          {/* Header */}
          <div className="bg-[#1A5C2A] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Farmácia Santa Clara</p>
                <p className="text-white/70 text-xs">
                  {isLoggedIn && userName ? `Olá, ${userName.split(" ")[0]}` : "Assistente virtual"}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f4f6f8]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#1A5C2A] text-white rounded-br-sm"
                    : "bg-white text-[#1a202c] rounded-bl-sm shadow-sm border border-[#e2e8f0]"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-[#e2e8f0] flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-[#718096] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-[#718096] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-[#718096] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-[#e2e8f0] flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-[#f4f6f8] rounded-xl px-3 py-2 text-sm outline-none border border-[#e2e8f0] focus:border-[#2B7DD4]"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-[#1A5C2A] hover:bg-[#145023] disabled:opacity-50 text-white rounded-xl p-2.5 transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Botão Chat */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#1A5C2A] hover:bg-[#145023] shadow-lg flex items-center justify-center transition-all hover:scale-110"
        title="Chat com assistente"
      >
        {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>
    </div>
  );
}
