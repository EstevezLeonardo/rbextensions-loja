"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface ItemDoCarrinho {
  codigo: string;
  nome: string;
  preco: number;
  foto: string | null;
  quantidade: number;
}

interface CarrinhoContextValor {
  itens: ItemDoCarrinho[];
  adicionarItem: (item: Omit<ItemDoCarrinho, "quantidade">, quantidade?: number) => void;
  removerItem: (codigo: string) => void;
  atualizarQuantidade: (codigo: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  totalValor: number;
}

const CarrinhoContext = createContext<CarrinhoContextValor | null>(null);

const CHAVE_LOCAL_STORAGE = "rbextensions-loja:carrinho";

/**
 * Estado do carrinho, persistido em localStorage (por navegador, não por
 * conta — a loja ainda não tem login de cliente). Envolve toda a árvore
 * em layout.tsx para o ícone do carrinho no header e a página de
 * produto/carrinho compartilharem o mesmo estado.
 */
export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemDoCarrinho[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_LOCAL_STORAGE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- carregando o estado inicial de um sistema externo (localStorage), não derivando de props/state — só pode rodar depois de montar, já que localStorage não existe no SSR
      if (salvo) setItens(JSON.parse(salvo));
    } catch {
      // localStorage indisponível (ex: navegação privada) — carrinho começa vazio
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(itens));
    } catch {
      // idem acima
    }
  }, [itens, carregado]);

  function adicionarItem(item: Omit<ItemDoCarrinho, "quantidade">, quantidade = 1) {
    setItens((atual) => {
      const existente = atual.find((i) => i.codigo === item.codigo);
      if (existente) {
        return atual.map((i) =>
          i.codigo === item.codigo ? { ...i, quantidade: i.quantidade + quantidade } : i
        );
      }
      return [...atual, { ...item, quantidade }];
    });
  }

  function removerItem(codigo: string) {
    setItens((atual) => atual.filter((i) => i.codigo !== codigo));
  }

  function atualizarQuantidade(codigo: string, quantidade: number) {
    if (quantidade <= 0) {
      removerItem(codigo);
      return;
    }
    setItens((atual) => atual.map((i) => (i.codigo === codigo ? { ...i, quantidade } : i)));
  }

  function limparCarrinho() {
    setItens([]);
  }

  const totalItens = itens.reduce((soma, i) => soma + i.quantidade, 0);
  const totalValor = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{ itens, adicionarItem, removerItem, atualizarQuantidade, limparCarrinho, totalItens, totalValor }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) {
    throw new Error("useCarrinho precisa ser usado dentro de um CarrinhoProvider");
  }
  return contexto;
}
