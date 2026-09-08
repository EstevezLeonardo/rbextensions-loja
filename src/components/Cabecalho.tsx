import Link from "next/link";
import { IconeCarrinho } from "@/components/IconeCarrinho";

/**
 * Header global (usado por layout.tsx em toda página) — logo + carrinho.
 * Cores da marca (dourado/marrom) espelham o redesign do dashboard
 * administrativo (dashboard/public/assets/css/style.css), pra loja e
 * painel parecerem do mesmo negócio.
 */
export function Cabecalho() {
  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg tracking-wide text-marrom">
          Royal Brazilian <span className="font-bold text-dourado">Extensions</span>
        </Link>
        <IconeCarrinho />
      </div>
    </header>
  );
}
