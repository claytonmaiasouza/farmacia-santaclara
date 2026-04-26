"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, Lock } from "lucide-react";

function RedefinirForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao redefinir senha.");
      return;
    }

    setDone(true);
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-600 mb-4">Link inválido ou expirado.</p>
        <Link href="/esqueci-senha" className="text-[#2B7DD4] hover:underline text-sm font-medium">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <>
      {done ? (
        <div className="text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-[#1a202c] mb-2">Senha redefinida!</h1>
          <p className="text-sm text-[#718096] mb-6">
            Sua senha foi atualizada com sucesso. Faça login com a nova senha.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
          >
            Ir para o login
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-[#1a202c] mb-1">Nova senha</h1>
          <p className="text-sm text-[#718096] mb-6">Escolha uma senha com pelo menos 6 caracteres.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-[#718096] mb-1 block">Nova senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-[#718096]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-3 text-[#718096] hover:text-[#1a202c]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#718096] mb-1 block">Confirmar senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-[#718096]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                  placeholder="••••••••"
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
              {loading ? <><Loader2 size={18} className="animate-spin" /> Salvando...</> : "Salvar nova senha"}
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/images/logo.png" alt="Farmácia Santa Clara" width={160} height={50} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
          <Suspense>
            <RedefinirForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
