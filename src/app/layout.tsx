import type { Metadata } from "next";
import { Public_Sans, Fraunces } from "next/font/google";
import { CarrinhoProvider } from "@/contexts/CarrinhoContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Royal Brazilian Extensions",
  description: "Loja online — Royal Brazilian Extensions",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${publicSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CarrinhoProvider>
            <Cabecalho />
            {children}
            <Rodape />
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
