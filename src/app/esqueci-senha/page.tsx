"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao enviar e-mail.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/images/logo.png" alt="Farmácia Santa Clara" width={160} height={50} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-[#1a202c] mb-2">E-mail enviado!</h1>
              <p className="text-sm text-[#718096] mb-6">
                Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes. Verifique também a pasta de spam.
              </p>
              <Link
                href="/login"
                className="text-sm text-[#2B7DD4] hover:underline font-medium"
              >
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#1a202c] mb-1">Esqueci minha senha</h1>
              <p className="text-sm text-[#718096] mb-6">
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">E-mail</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-[#718096]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-[#e2e8f0] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-1"
                >
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : "Enviar link"}
                </button>

                <p className="text-center text-sm text-[#718096]">
                  Lembrou a senha?{" "}
                  <Link href="/login" className="text-[#2B7DD4] hover:underline font-medium">
                    Entrar
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
