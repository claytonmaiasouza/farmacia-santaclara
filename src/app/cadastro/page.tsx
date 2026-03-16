"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Este e-mail já está cadastrado."
          : "Erro ao criar conta. Tente novamente."
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/conta"), 2000);
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-[#1a202c]">Conta criada!</h2>
          <p className="text-[#718096] mt-1 text-sm">Redirecionando...</p>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-[#1a202c] mb-1">Criar conta</h1>
          <p className="text-sm text-[#718096] mb-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-[#2B7DD4] hover:underline font-medium">
              Entrar
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-[#718096] mb-1 block">Nome completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-[#718096]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                  placeholder="João da Silva"
                />
              </div>
            </div>

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

            <div>
              <label className="text-xs font-medium text-[#718096] mb-1 block">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-[#718096]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-3 text-[#718096]"
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
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none ${
                    confirm && confirm !== password
                      ? "border-red-300 focus:border-red-400"
                      : "border-[#e2e8f0] focus:border-[#2B7DD4]"
                  }`}
                  placeholder="Repita a senha"
                />
              </div>
              {confirm && confirm !== password && (
                <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
              )}
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
              {loading ? <><Loader2 size={18} className="animate-spin" /> Criando conta...</> : "Criar conta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
