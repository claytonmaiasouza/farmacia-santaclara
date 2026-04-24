import { MessageCircle, ShoppingCart, CreditCard, Package } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "1. Escolha seus produtos",
    desc: "Navegue pelo nosso catálogo, use a busca ou peça ajuda ao nosso assistente. Adicione os itens desejados ao carrinho.",
  },
  {
    icon: MessageCircle,
    title: "2. Finalize pelo WhatsApp ou site",
    desc: "Você pode concluir a compra diretamente pelo site ou chamar nossa equipe no WhatsApp para atendimento personalizado.",
  },
  {
    icon: CreditCard,
    title: "3. Realize o pagamento",
    desc: "Aceitamos Pix, transferência bancária e outros meios combinados no atendimento. Todos os preços já incluem o frete.",
  },
  {
    icon: Package,
    title: "4. Receba em casa",
    desc: "Seu pedido é embalado com cuidado e enviado de forma discreta. Acompanhe o prazo de entrega pelo nosso WhatsApp.",
  },
];

export default function ComoComprarPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a202c] mb-2">Como Comprar</h1>
      <div className="w-12 h-1 bg-[#1A5C2A] rounded mb-8" />

      <p className="text-[#4a5568] mb-10 leading-relaxed">
        Comprar na Farmácia Santa Clara é simples, seguro e rápido. Veja o passo a passo:
      </p>

      <div className="flex flex-col gap-6 mb-12">
        {steps.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-5 bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <div className="w-12 h-12 rounded-xl bg-[#f0f9f4] flex items-center justify-center flex-shrink-0">
              <Icon size={22} className="text-[#1A5C2A]" />
            </div>
            <div>
              <p className="font-bold text-[#1a202c] mb-1">{title}</p>
              <p className="text-sm text-[#4a5568] leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1A5C2A] rounded-2xl p-6 text-white text-center">
        <p className="font-bold text-lg mb-1">Tem dúvidas?</p>
        <p className="text-white/80 text-sm mb-4">Nossa equipe está pronta para ajudar você a escolher o produto certo.</p>
        <a
          href="https://wa.me/595994000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-[#1A5C2A] font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <MessageCircle size={18} />
          Falar no WhatsApp
        </a>
      </div>
    </main>
  );
}
