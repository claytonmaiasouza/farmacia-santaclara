export default function SobrePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a202c] mb-2">Sobre Nós</h1>
      <div className="w-12 h-1 bg-[#1A5C2A] rounded mb-8" />

      <div className="prose prose-gray max-w-none space-y-6 text-[#4a5568] leading-relaxed">
        <p>
          A <strong className="text-[#1a202c]">Farmácia Santa Clara</strong> nasceu com uma missão clara: oferecer produtos farmacêuticos de alta qualidade com atendimento humano, ágil e especializado. Estamos localizados em <strong className="text-[#1a202c]">Cidade del Este, Paraguay</strong>, uma das principais cidades para aquisição de medicamentos e insumos de saúde da América do Sul.
        </p>

        <p>
          Nossa equipe é formada por farmacêuticos e profissionais de saúde comprometidos com o bem-estar dos nossos clientes. Trabalhamos apenas com produtos originais, de procedência verificada, e mantemos rígidos controles de qualidade em todo o processo — desde o recebimento até a entrega.
        </p>

        <h2 className="text-xl font-bold text-[#1a202c] mt-8 mb-3">Nossa missão</h2>
        <p>
          Democratizar o acesso a produtos de saúde de qualidade, com preços justos e atendimento que respeita cada cliente como único.
        </p>

        <h2 className="text-xl font-bold text-[#1a202c] mt-8 mb-3">Nossos valores</h2>
        <ul className="space-y-2 list-none pl-0">
          {[
            ["Confiança", "Transparência em cada etapa da compra."],
            ["Qualidade", "Somente produtos originais e com procedência."],
            ["Agilidade", "Atendimento rápido via WhatsApp e entrega eficiente."],
            ["Cuidado", "Sua saúde é nossa prioridade."],
          ].map(([title, desc]) => (
            <li key={title} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1A5C2A] mt-2 flex-shrink-0" />
              <span><strong className="text-[#1a202c]">{title}:</strong> {desc}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-bold text-[#1a202c] mt-8 mb-3">Por que comprar conosco?</h2>
        <p>
          Atendemos clientes de todo o Brasil com discrição, segurança e pontualidade. Nossos preços já incluem o frete, sem surpresas no final. Cada pedido é embalado com cuidado para chegar em perfeitas condições.
        </p>
      </div>
    </main>
  );
}
