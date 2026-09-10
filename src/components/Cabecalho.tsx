import Image from "next/image";
import Link from "next/link";
import { IconeCarrinho } from "@/components/IconeCarrinho";
import { MenuConta } from "@/components/MenuConta";
import { SidebarMenu } from "@/components/SidebarMenu";

/**
 * Header global (usado por layout.tsx em toda página) — menu + logo + busca
 * + WhatsApp/Instagram + carrinho. Fixo no topo (sticky) — continua visível
 * rolando a página. Logo é o símbolo da marca (public/RB_simbolo_transparente.png)
 * — os ícones sociais usam a mesma cor dourada do símbolo, já que o header é
 * branco. Em telas pequenas o nome por extenso, a busca e os ícones sociais
 * somem (ficam só no menu off-canvas), pra caber o botão de menu.
 *
 * Busca é um <form method="get"> puro (sem JS) que sempre volta pra
 * "/cabelos" — lá o catálogo lê ?busca= e filtra (ver src/app/cabelos/page.tsx).
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

        <form action="/cabelos" method="get" className="hidden max-w-md flex-1 items-center gap-2 rounded-full border border-dourado/25 bg-zinc-50 px-4 py-2 md:flex">
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

        <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-5">
          <div className="hidden items-center gap-3 sm:flex">
            <a
              href="https://wa.me/5521972701658"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-dourado hover:text-dourado-claro"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.35 4.94L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/royalbrazilianext/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-dourado hover:text-dourado-claro"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" />
              </svg>
            </a>
          </div>
          <MenuConta />
          <IconeCarrinho />
        </div>
      </div>
    </header>
  );
}
