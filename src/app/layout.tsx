import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CarrinhoProvider } from "@/contexts/CarrinhoContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
