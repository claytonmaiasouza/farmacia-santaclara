import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import { CartProvider } from "@/context/CartContext";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });
export const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} ${nunito.variable} bg-[#f4f6f8] min-h-screen`}>
        <SessionWrapper>
          <CartProvider>
            <Header />
            <main className="max-w-7xl mx-auto px-4 pb-12">{children}</main>
            <Footer />
            <ChatWidget />
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
