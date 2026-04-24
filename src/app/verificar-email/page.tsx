import Link from "next/link";

export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; already?: string }>;
}) {
  const params = await searchParams;

  if (params.ok) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="text-center max-w-sm px-4">
          <div className="text-6xl mb-5">✅</div>
          <h1 className="text-2xl font-bold text-[#1a202c] mb-2">
            {params.already ? "E-mail já confirmado!" : "E-mail confirmado!"}
          </h1>
          <p className="text-[#718096] text-sm mb-6">
            {params.already
              ? "Sua conta já estava ativa. Faça login para continuar."
              : "Sua conta está ativa. Agora você pode fazer login e aproveitar a Farmácia Santa Clara."}
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = params.error === "expired";

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="text-center max-w-sm px-4">
        <div className="text-6xl mb-5">{isExpired ? "⏰" : "❌"}</div>
        <h1 className="text-2xl font-bold text-[#1a202c] mb-2">
          {isExpired ? "Link expirado" : "Link inválido"}
        </h1>
        <p className="text-[#718096] text-sm mb-6">
          {isExpired
            ? "Este link de confirmação expirou (válido por 24 horas). Crie uma nova conta para receber um novo link."
            : "Este link de confirmação é inválido ou já foi utilizado."}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/cadastro"
            className="inline-block bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Criar nova conta
          </Link>
          <Link href="/" className="text-sm text-[#718096] hover:text-[#2B7DD4] transition-colors">
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
