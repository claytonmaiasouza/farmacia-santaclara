import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farmácia Santa Clara — Saúde e Bem-Estar",
  description:
    "Medicamentos, vitaminas, dermocosméticos e muito mais. Compre online com entrega rápida e segurança.",
  keywords: "farmácia, medicamentos, vitaminas, suplementos, saúde, bem-estar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#f4f6f8] min-h-screen`}>
        <CartProvider>
          <Header />
          <main className="max-w-7xl mx-auto px-4 pb-12">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
