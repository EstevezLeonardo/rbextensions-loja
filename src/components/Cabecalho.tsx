import Image from "next/image";
import Link from "next/link";
import { IconeCarrinho } from "@/components/IconeCarrinho";
import { MenuConta } from "@/components/MenuConta";
import { SidebarMenu } from "@/components/SidebarMenu";

/**
 * Header global (usado por layout.tsx em toda página) — menu + logo + busca
 * + carrinho. Fixo no topo (sticky) — continua visível rolando a página.
 * Logo é o símbolo da marca (public/RB_simbolo_transparente.png). Em telas
 * pequenas o nome por extenso e a busca somem, pra caber o botão de menu.
 *
 * Busca é um <form method="get"> puro (sem JS) que sempre volta pra "/" —
 * a home lê ?busca= e filtra o catálogo (ver src/app/page.tsx).
 */
export function Cabecalho() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-5">
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SidebarMenu />
          <Link href="/" className="flex items-center gap-3">
            <Image src="/RB_simbolo_transparente.png" alt="" width={303} height={440} className="h-11 w-auto sm:h-14" priority />
            <span className="hidden text-lg tracking-wide text-marrom sm:inline">
              Royal Brazilian <span className="font-bold text-dourado">Extensions</span>
            </span>
          </Link>
        </div>

        <form action="/" method="get" className="hidden max-w-md flex-1 items-center gap-2 rounded-full border border-dourado/25 bg-zinc-50 px-4 py-2 md:flex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            name="busca"
            placeholder="Buscar cabelos, produtos e acessórios..."
            className="w-full border-none bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
          <MenuConta />
          <IconeCarrinho />
        </div>
      </div>
    </header>
  );
}
