export default function TermosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a202c] mb-2">Termos de Uso</h1>
      <div className="w-12 h-1 bg-[#1A5C2A] rounded mb-2" />
      <p className="text-sm text-[#718096] mb-8">Última atualização: janeiro de 2026</p>

      <div className="space-y-8 text-[#4a5568] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">1. Aceitação dos termos</h2>
          <p>Ao acessar e utilizar o site da Farmácia Santa Clara, você concorda com os presentes Termos de Uso. Caso não concorde, recomendamos que não utilize nossos serviços.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">2. Produtos e disponibilidade</h2>
          <p>As informações sobre produtos, preços e disponibilidade estão sujeitas a alterações sem aviso prévio. Nos reservamos o direito de recusar ou cancelar pedidos caso haja indisponibilidade de estoque ou inconsistência no pagamento.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">3. Responsabilidade do usuário</h2>
          <p>O cliente é responsável pelas informações fornecidas no momento da compra. Dados incorretos de endereço, nome ou contato podem atrasar ou inviabilizar a entrega, sendo de responsabilidade exclusiva do comprador.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">4. Uso adequado</h2>
          <p>É proibido utilizar este site para fins ilegais, fraudulentos ou que violem direitos de terceiros. A Farmácia Santa Clara se reserva o direito de bloquear acessos suspeitos.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">5. Propriedade intelectual</h2>
          <p>Todo o conteúdo deste site — textos, imagens, logotipos e layout — é de propriedade da Farmácia Santa Clara e não pode ser reproduzido sem autorização expressa.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">6. Alterações</h2>
          <p>Estes termos podem ser atualizados periodicamente. Recomendamos consulta regular a esta página.</p>
        </section>
      </div>
    </main>
  );
}
