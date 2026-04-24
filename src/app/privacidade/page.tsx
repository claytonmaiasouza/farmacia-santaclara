export default function PrivacidadePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a202c] mb-2">Política de Privacidade</h1>
      <div className="w-12 h-1 bg-[#1A5C2A] rounded mb-2" />
      <p className="text-sm text-[#718096] mb-8">Última atualização: janeiro de 2026</p>

      <div className="space-y-8 text-[#4a5568] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">1. Informações que coletamos</h2>
          <p>Ao realizar uma compra ou entrar em contato conosco, podemos coletar: nome completo, número de telefone (WhatsApp), endereço de entrega e histórico de pedidos. Não coletamos dados de cartão de crédito — os pagamentos são processados por plataformas seguras externas.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">2. Como usamos suas informações</h2>
          <p>Utilizamos seus dados exclusivamente para processar e entregar seus pedidos, comunicar atualizações sobre o status da compra e melhorar nosso atendimento. Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">3. Segurança</h2>
          <p>Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado. Nosso site utiliza criptografia HTTPS em todas as comunicações.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">4. Cookies</h2>
          <p>Utilizamos cookies essenciais para o funcionamento do site (como o carrinho de compras e sessão de usuário). Não utilizamos cookies de rastreamento de terceiros.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">5. Seus direitos</h2>
          <p>Você pode solicitar a exclusão dos seus dados pessoais a qualquer momento entrando em contato conosco pelo WhatsApp ou pela página <a href="/contato" className="text-[#2B7DD4] hover:underline">Fale Conosco</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a202c] mb-3">6. Contato</h2>
          <p>Dúvidas sobre esta política? Entre em contato pelo nosso <a href="/contato" className="text-[#2B7DD4] hover:underline">canal de atendimento</a>.</p>
        </section>
      </div>
    </main>
  );
}
