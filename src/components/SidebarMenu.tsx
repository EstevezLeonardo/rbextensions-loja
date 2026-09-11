"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ITENS_NAVEGACAO } from "@/lib/navegacaoPrincipal";
import { useAuth } from "@/contexts/AuthContext";

function IconeHome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9v10.5a.75.75 0 0 0 .75.75h3.75v-6h4.5v6H18a.75.75 0 0 0 .75-.75V9" />
    </svg>
  );
}

function IconeMeusPedidos({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 8.25 12 3.75l8.25 4.5v7.5L12 20.25l-8.25-4.5v-7.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 8.25 12 12.75l8.25-4.5M12 12.75v7.5" />
    </svg>
  );
}

/**
 * Sidebar flutuante (off-canvas) — navegação principal da loja, aberta por um
 * botão hamburger no header. Lista em ITENS_MENU pra facilitar adicionar
 * opções novas no futuro sem mexer no resto do componente.
 */
export function SidebarMenu() {
  const [aberto, setAberto] = useState(false);
  const { cliente } = useAuth();

  useEffect(() => {
    if (!aberto) return;

    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const aoApertarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", aoApertarTecla);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", aoApertarTecla);
    };
  }, [aberto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
        aria-expanded={aberto}
        className="-ml-1.5 inline-flex h-10 w-10 items-center justify-center rounded-lg text-marrom hover:bg-dourado/10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      <div
        onClick={() => setAberto(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-marrom/40 transition-opacity duration-300 ${
          aberto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`fixed inset-y-0 left-0 z-[70] flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          aberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <span className="text-base tracking-wide text-marrom">
            Royal Brazilian <span className="font-bold text-dourado">Extensions</span>
          </span>
          <button
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-dourado/10 hover:text-marrom"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          <Link
            href="/"
            onClick={() => setAberto(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-marrom hover:bg-dourado/10 hover:text-dourado"
          >
            <IconeHome className="h-5 w-5 shrink-0" />
            Home
          </Link>

          {ITENS_NAVEGACAO.map(({ rotulo, href, Icone }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setAberto(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-marrom hover:bg-dourado/10 hover:text-dourado"
            >
              <Icone className="h-5 w-5 shrink-0" />
              {rotulo}
            </Link>
          ))}

          {cliente && (
            <>
              <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Sua conta</p>
              <Link
                href="/meus-pedidos"
                onClick={() => setAberto(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-marrom hover:bg-dourado/10 hover:text-dourado"
              >
                <IconeMeusPedidos className="h-5 w-5 shrink-0" />
                Meus Pedidos
              </Link>
            </>
          )}
        </nav>

        <div className="border-t border-zinc-200 px-5 py-4 text-xs text-zinc-500">
          <p>WhatsApp (21) 97270-1658</p>
          <a
            href="https://www.instagram.com/royalbrazilianext/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dourado hover:text-marrom"
          >
            @royalbrazilianext
          </a>
        </div>
      </aside>
    </>
  );
}
