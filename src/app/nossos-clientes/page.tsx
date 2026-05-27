import SocialProof from "@/components/home/SocialProof";

export const metadata = {
  title: "Nossos Clientes — Farmácia Santa Clara",
  description: "Veja o que nossos clientes dizem sobre a Farmácia Santa Clara. Avaliações reais de quem já comprou.",
};

export default function NossosClientesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <SocialProof />
    </main>
  );
}
