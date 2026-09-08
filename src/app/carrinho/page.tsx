"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useCarrinho } from "@/contexts/CarrinhoContext";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL_PUBLICO = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/rbextensions/api";

/**
 * Página de carrinho + checkout. Client Component inteira (quantidade
 * e o formulário dependem de interatividade) — ao fechar o pedido,
 * chama api/checkout-stripe-criar.php (que só valida o carrinho e abre
 * uma sessão do Stripe Checkout, sem gravar nada ainda) e redireciona
 * o navegador pra página de pagamento do próprio Stripe. O carrinho só
 * é limpo depois, na página de confirmação (/pedido/confirmado), pra
 * não sumir com os itens se o cliente cancelar o pagamento e voltar.
 */
export default function CarrinhoPage() {
  return (
    <Suspense>
      <CarrinhoConteudo />
    </Suspense>
  );
}

function CarrinhoConteudo() {
  const { itens, atualizarQuantidade, removerItem, totalValor } = useCarrinho();
  const { cliente } = useAuth();
  const searchParams = useSearchParams();
  const pagamentoCancelado = searchParams.get("pagamento") === "cancelado";

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // pré-preenche com os dados do cliente logado (ele ainda pode editar,
  // caso essa compra seja pra outra pessoa ou queira usar outro e-mail)
  useEffect(() => {
    if (cliente) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cliente vem de um sistema externo assíncrono (AuthContext carregando o localStorage), não de um prop derivado — só preenche campos ainda vazios, uma vez
      setNome((atual) => atual || cliente.nome);
      setEmail((atual) => atual || cliente.email);
    }
  }, [cliente]);

  async function finalizarPedido(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch(`${API_BASE_URL_PUBLICO}/checkout-stripe-criar.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: { nome, sobrenome, email },
          itens: itens.map((item) => ({ codigo: item.codigo, quantidade: item.quantidade })),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Não foi possível iniciar o pagamento agora.");
        setEnviando(false);
        return;
      }

      window.location.href = dados.url;
    } catch {
      setErro("Não foi possível iniciar o pagamento agora. Verifique sua conexão e tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-marrom">
            ← Voltar ao catálogo
          </Link>

          <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Seu carrinho</h1>

          {pagamentoCancelado && (
            <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Pagamento cancelado. Seus itens continuam no carrinho — pode tentar novamente quando quiser.
            </p>
          )}

          {itens.length === 0 ? (
            <p className="mt-4 text-zinc-500">
              Seu carrinho está vazio.{" "}
              <Link href="/" className="font-medium text-dourado underline">
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
                <div className="flex items-center justify-between text-lg font-semibold text-marrom">
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

                  {erro && <p className="text-sm text-red-600">{erro}</p>}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="mt-2 w-full rounded-lg bg-dourado px-6 py-3 text-sm font-semibold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-zinc-300"
                  >
                    {enviando ? "Redirecionando para o pagamento..." : "Pagar com cartão"}
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
