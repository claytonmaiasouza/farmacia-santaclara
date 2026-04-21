"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/conta";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
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
          <h1 className="text-2xl font-bold text-[#1a202c] mb-1">Entrar</h1>
          <p className="text-sm text-[#718096] mb-6">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-[#2B7DD4] hover:underline font-medium">
              Cadastre-se
            </Link>
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

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-[#718096]">Senha</label>
                <Link href="/esqueci-senha" className="text-xs text-[#2B7DD4] hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-[#718096]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
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
              {loading ? <><Loader2 size={18} className="animate-spin" /> Entrando...</> : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#718096] mt-6">
          Ao continuar, você concorda com os{" "}
          <Link href="/termos" className="hover:underline">Termos de Uso</Link> e a{" "}
          <Link href="/privacidade" className="hover:underline">Política de Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
