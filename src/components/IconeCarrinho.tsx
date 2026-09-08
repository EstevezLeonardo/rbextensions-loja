"use client";

import Link from "next/link";
import { useCarrinho } from "@/contexts/CarrinhoContext";

/** Link para /carrinho com a contagem de itens — usado nos headers das páginas. */
export function IconeCarrinho() {
  const { totalItens } = useCarrinho();

  return (
    <Link
      href="/carrinho"
      className="relative inline-flex items-center gap-2 rounded-lg border border-dourado/40 px-3 py-1.5 text-sm font-medium text-marrom hover:bg-dourado/10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.602-7.152.075-.302-.174-.598-.485-.598H5.106M7.5 14.25 5.106 5.272M7.5 14.25 5.25 18M17.25 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM9 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
        />
      </svg>
      Carrinho
      {totalItens > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-dourado text-xs font-semibold text-white">
          {totalItens}
        </span>
      )}
    </Link>
  );
}
