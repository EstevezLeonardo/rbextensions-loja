"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

/** Link de "Entrar" (deslogado) ou "Olá, {nome}" + Meus Pedidos/Sair (logado) — usado no header. */
export function MenuConta() {
  const { cliente, carregado, sair } = useAuth();

  // evita "piscar" Entrar->Olá no primeiro render, antes do localStorage carregar
  if (!carregado) {
    return <span className="text-sm text-zinc-400">&nbsp;</span>;
  }

  if (!cliente) {
    return (
      <Link href="/entrar" className="text-sm font-medium text-marrom hover:text-dourado">
        Entrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-zinc-600 sm:inline">
        Olá, <span className="font-medium text-marrom">{cliente.nome}</span>
      </span>
      <Link href="/meus-pedidos" className="font-medium text-marrom hover:text-dourado">
        <span className="hidden sm:inline">Meus Pedidos</span>
        <span className="sm:hidden">Pedidos</span>
      </Link>
      <button type="button" onClick={sair} className="font-medium text-zinc-500 hover:text-dourado">
        Sair
      </button>
    </div>
  );
}
