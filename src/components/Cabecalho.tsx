import Image from "next/image";
import Link from "next/link";
import { IconeCarrinho } from "@/components/IconeCarrinho";
import { MenuConta } from "@/components/MenuConta";

/**
 * Header global (usado por layout.tsx em toda página) — logo + carrinho.
 * Fixo no topo (sticky) — continua visível rolando a página. Logo é o
 * símbolo da marca (public/RB_simbolo_transparente.png).
 */
export function Cabecalho() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/RB_simbolo_transparente.png" alt="" width={303} height={440} className="h-14 w-auto" priority />
          <span className="text-lg tracking-wide text-marrom">
            Royal Brazilian <span className="font-bold text-dourado">Extensions</span>
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <MenuConta />
          <IconeCarrinho />
        </div>
      </div>
    </header>
  );
}
