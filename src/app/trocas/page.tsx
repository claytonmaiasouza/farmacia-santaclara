import { RefreshCw, AlertTriangle, CheckCircle, Phone } from "lucide-react";

export default function TrocasPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a202c] mb-2">Trocas e Devoluções</h1>
      <div className="w-12 h-1 bg-[#1A5C2A] rounded mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: CheckCircle, color: "text-green-600 bg-green-50", title: "Produto com defeito", desc: "Substituição imediata" },
          { icon: RefreshCw, color: "text-blue-600 bg-blue-50", title: "Prazo para contato", desc: "Até 7 dias após o recebimento" },
          { icon: Phone, color: "text-[#25D366] bg-green-50", title: "Atendimento", desc: "Via WhatsApp" },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className={`rounded-2xl p-4 flex flex-col items-center text-center gap-2 ${color.split(" ")[1]}`}>
            <Icon size={24} className={color.split(" ")[0]} />
            <p className="font-semibold text-[#1a202c] text-sm">{title}</p>
            <p className="text-xs text-[#718096]">{desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8 text-[#4a5568] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">Quando posso solicitar troca ou devolução?</h2>
          <ul className="space-y-2">
            {[
              "Produto recebido com defeito ou avaria visível na embalagem",
              "Produto diferente do que foi pedido",
              "Produto com validade vencida no momento do recebimento",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Atenção</p>
              <p className="text-sm text-amber-700">Devido à natureza dos produtos farmacêuticos (termolábeis e controlados), não aceitamos trocas por arrependimento após a abertura da embalagem original.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">Como solicitar</h2>
          <ol className="space-y-3 list-none pl-0">
            {[
              "Entre em contato via WhatsApp em até 7 dias após o recebimento",
              "Envie fotos do produto e da embalagem evidenciando o problema",
              "Nossa equipe analisará e retornará em até 24h úteis",
              "Se aprovado, informaremos os próximos passos para troca ou reembolso",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1A5C2A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
