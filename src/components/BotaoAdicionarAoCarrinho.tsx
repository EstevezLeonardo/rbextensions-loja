"use client";

import { useState } from "react";
import { useCarrinho } from "@/contexts/CarrinhoContext";

interface BotaoAdicionarAoCarrinhoProps {
  produto: {
    codigo: string;
    nome: string;
    preco: number;
    foto: string | null;
    disponivel: boolean;
  };
}

/** Botão "Adicionar ao carrinho" da página de produto — só ele precisa ser Client Component. */
export function BotaoAdicionarAoCarrinho({ produto }: BotaoAdicionarAoCarrinhoProps) {
  const { adicionarItem } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);

  if (!produto.disponivel) {
    return (
      <button
        type="button"
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-lg bg-zinc-300 px-6 py-3 text-sm font-semibold text-white"
      >
        Indisponível
      </button>
    );
  }

  function handleClick() {
    adicionarItem({
      codigo: produto.codigo,
      nome: produto.nome,
      preco: produto.preco,
      foto: produto.foto,
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-6 w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
    >
      {adicionado ? "Adicionado ✓" : "Adicionar ao carrinho"}
    </button>
  );
}
