"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { buscarMeusPedidos, type Pedido } from "@/lib/authApi";

const STATUS_LABEL: Record<string, string> = {
  concluida: "Concluído",
  extornada: "Extornado",
};

/** Histórico de pedidos do cliente logado — redireciona para /entrar se não houver sessão. */
export default function MeusPedidosPage() {
  const router = useRouter();
  const { token, carregado } = useAuth();

  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!carregado) return;

    if (!token) {
      router.replace("/entrar");
      return;
    }

    buscarMeusPedidos(token)
      .then(setPedidos)
      .catch(() => setErro("Não foi possível carregar seus pedidos agora."));
  }, [carregado, token, router]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-semibold text-zinc-900">Meus pedidos</h1>

          {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

          {!erro && pedidos === null && <p className="mt-4 text-zinc-500">Carregando...</p>}

          {pedidos !== null && pedidos.length === 0 && (
            <p className="mt-4 text-zinc-500">
              Você ainda não tem pedidos.{" "}
              <Link href="/" className="font-medium text-dourado underline">
                Ver catálogo
              </Link>
            </p>
          )}

          {pedidos !== null && pedidos.length > 0 && (
            <ul className="mt-6 flex flex-col gap-4">
              {pedidos.map((pedido) => (
                <li key={pedido.id} className="rounded-lg border border-zinc-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Pedido #{pedido.id}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(pedido.data.replace(" ", "T")).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-marrom">
                        {pedido.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {STATUS_LABEL[pedido.status] ?? pedido.status}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-3 flex flex-col gap-1 border-t border-zinc-100 pt-3">
                    {pedido.itens.map((item, indice) => (
                      <li key={indice} className="flex justify-between text-sm text-zinc-600">
                        <span>
                          {item.quantidade}x {item.produtoNome}
                        </span>
                        <span>
                          {(item.valorUnitario * item.quantidade).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
