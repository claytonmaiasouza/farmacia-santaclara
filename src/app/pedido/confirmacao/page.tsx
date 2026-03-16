import Link from "next/link";
import { CheckCircle, XCircle, Clock, ShoppingBag } from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string; order?: string }>;
}

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle,
    color: "text-[#6DC040]",
    bg: "bg-green-50",
    border: "border-green-100",
    title: "Pedido confirmado!",
    message: "Seu pagamento foi aprovado. Você receberá um e-mail com os detalhes do pedido.",
  },
  pending: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Pagamento em análise",
    message: "Seu pedido foi recebido e o pagamento está sendo processado. Avisaremos quando for confirmado.",
  },
  failure: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
    title: "Pagamento não aprovado",
    message: "Não foi possível processar seu pagamento. Por favor, tente novamente.",
  },
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { status = "pending", order } = await searchParams;
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <div className="pt-16 flex flex-col items-center gap-6 text-center max-w-lg mx-auto">
      <div className={`w-24 h-24 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center`}>
        <Icon size={48} className={config.color} />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">{config.title}</h1>
        <p className="text-[#718096] mt-2 leading-relaxed">{config.message}</p>
        {order && (
          <p className="text-xs text-[#718096] mt-3 font-mono bg-[#f4f6f8] rounded-lg px-3 py-1.5 inline-block">
            Pedido: #{order.slice(0, 8).toUpperCase()}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {status === "failure" ? (
          <Link
            href="/checkout"
            className="flex-1 flex items-center justify-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Tentar novamente
          </Link>
        ) : (
          <Link
            href="/conta/pedidos"
            className="flex-1 flex items-center justify-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <ShoppingBag size={18} />
            Meus pedidos
          </Link>
        )}
        <Link
          href="/"
          className="flex-1 flex items-center justify-center border border-[#e2e8f0] hover:border-[#2B7DD4] text-[#1a202c] font-semibold py-3 rounded-xl transition-colors"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
