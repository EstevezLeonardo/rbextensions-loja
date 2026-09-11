"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { buscarMeusPedidos, type Pedido } from "@/lib/authApi";

/** Rótulo/cor do status de entrega mostrado em cada pedido — extornado tem prioridade sobre o status de entrega em si. */
function statusDoPedido(pedido: Pedido): { rotulo: string; classe: string } {
  if (pedido.status === "extornada") {
    return { rotulo: "Extornado", classe: "bg-red-50 text-red-700" };
  }
  if (pedido.statusEntrega === "concluido") {
    return { rotulo: "Concluído", classe: "bg-emerald-50 text-emerald-700" };
  }
  return { rotulo: "Em preparação", classe: "bg-amber-50 text-amber-700" };
}

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

  const emCurso = pedidos?.filter((p) => p.status !== "extornada" && p.statusEntrega !== "concluido") ?? [];
  const finalizados = pedidos?.filter((p) => p.status === "extornada" || p.statusEntrega === "concluido") ?? [];

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
              <Link href="/cabelos" className="font-medium text-dourado underline">
                Ver catálogo
              </Link>
            </p>
          )}

          {pedidos !== null && pedidos.length > 0 && (
            <div className="mt-6 flex flex-col gap-8">
              <SecaoDePedidos titulo="Em curso" pedidos={emCurso} vazio="Nenhum pedido em andamento no momento." />
              <SecaoDePedidos titulo="Finalizados" pedidos={finalizados} vazio="Nenhum pedido finalizado ainda." />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SecaoDePedidos({ titulo, pedidos, vazio }: { titulo: string; pedidos: Pedido[]; vazio: string }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{titulo}</h2>
      {pedidos.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">{vazio}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-4">
          {pedidos.map((pedido) => {
            const status = statusDoPedido(pedido);
            return (
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
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${status.classe}`}>
                      {status.rotulo}
                    </span>
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
            );
          })}
        </ul>
      )}
    </section>
  );
}
