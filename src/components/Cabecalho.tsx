import Image from "next/image";
import Link from "next/link";
import { IconeCarrinho } from "@/components/IconeCarrinho";
import { MenuConta } from "@/components/MenuConta";

/**
 * Header global (usado por layout.tsx em toda página) — logo + carrinho.
 * Logo é a mesma logo transparente usada no dashboard administrativo
 * (dashboard/public/assets/images/Royal_Brazilian_Extensions_logo_transparente.png),
 * copiada pra public/logo.png — loja e painel usando a mesma marca.
 */
export function Cabecalho() {
  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={863} height={779} className="h-14 w-auto" priority />
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
