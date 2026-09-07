"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCarrinho } from "@/contexts/CarrinhoContext";

const API_BASE_URL_PUBLICO = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/rbextensions/api";

type FormaPagamento = "debito" | "pix" | "credito";

interface PedidoConcluido {
  id: number;
  valorTotal: number;
}

/**
 * Página de carrinho + checkout. Client Component inteira (quantidade,
 * formulário e o POST em api/pedido.php dependem de interatividade) —
 * chama a API pública diretamente do navegador via
 * NEXT_PUBLIC_API_BASE_URL, sem passar pelo servidor Next.js.
 */
export default function CarrinhoPage() {
  const { itens, atualizarQuantidade, removerItem, limparCarrinho, totalValor } = useCarrinho();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("pix");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pedidoConcluido, setPedidoConcluido] = useState<PedidoConcluido | null>(null);

  async function finalizarPedido(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch(`${API_BASE_URL_PUBLICO}/pedido.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: { nome, sobrenome, email },
          formaPagamento,
          itens: itens.map((item) => ({ codigo: item.codigo, quantidade: item.quantidade })),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Não foi possível concluir o pedido agora.");
        return;
      }

      setPedidoConcluido(dados);
      limparCarrinho();
    } catch {
      setErro("Não foi possível concluir o pedido agora. Verifique sua conexão e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (pedidoConcluido) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Pedido recebido!</h1>
        <p className="mt-2 text-zinc-600">
          Pedido #{pedidoConcluido.id} —{" "}
          {pedidoConcluido.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Em breve entraremos em contato para combinar o pagamento e a entrega.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800">
          ← Voltar ao catálogo
        </Link>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-semibold text-zinc-900">Seu carrinho</h1>

          {itens.length === 0 ? (
            <p className="mt-4 text-zinc-500">
              Seu carrinho está vazio.{" "}
              <Link href="/" className="font-medium text-zinc-800 underline">
                Ver catálogo
              </Link>
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
              <ul className="flex flex-col gap-4 md:col-span-2">
                {itens.map((item) => (
                  <li
                    key={item.codigo}
                    className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-100">
                      {item.foto ? (
                        // eslint-disable-next-line @next/next/no-img-element -- foto vem de outra origem (dashboard PHP)
                        <img src={item.foto} alt={item.nome} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-zinc-400">Sem foto</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-900">{item.nome}</p>
                      <p className="text-sm text-zinc-500">
                        {item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => atualizarQuantidade(item.codigo, item.quantidade - 1)}
                        className="h-7 w-7 rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-100"
                        aria-label="Diminuir quantidade"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantidade}</span>
                      <button
                        type="button"
                        onClick={() => atualizarQuantidade(item.codigo, item.quantidade + 1)}
                        className="h-7 w-7 rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-100"
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removerItem(item.codigo)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>

              <div className="h-fit rounded-lg border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between text-lg font-semibold text-zinc-900">
                  <span>Total</span>
                  <span>{totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>

                <form onSubmit={finalizarPedido} className="mt-4 flex flex-col gap-3">
                  <div>
                    <label htmlFor="nome" className="block text-xs font-medium text-zinc-600">
                      Nome
                    </label>
                    <input
                      id="nome"
                      required
                      value={nome}
                      onChange={(evento) => setNome(evento.target.value)}
                      className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="sobrenome" className="block text-xs font-medium text-zinc-600">
                      Sobrenome
                    </label>
                    <input
                      id="sobrenome"
                      required
                      value={sobrenome}
                      onChange={(evento) => setSobrenome(evento.target.value)}
                      className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-zinc-600">
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(evento) => setEmail(evento.target.value)}
                      className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="formaPagamento" className="block text-xs font-medium text-zinc-600">
                      Forma de pagamento
                    </label>
                    <select
                      id="formaPagamento"
                      value={formaPagamento}
                      onChange={(evento) => setFormaPagamento(evento.target.value as FormaPagamento)}
                      className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
                    >
                      <option value="pix">PIX</option>
                      <option value="debito">Débito</option>
                      <option value="credito">Crédito</option>
                    </select>
                  </div>

                  {erro && <p className="text-sm text-red-600">{erro}</p>}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="mt-2 w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                  >
                    {enviando ? "Enviando..." : "Fechar pedido"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
