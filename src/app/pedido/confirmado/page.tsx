"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCarrinho } from "@/contexts/CarrinhoContext";

const API_BASE_URL_PUBLICO = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/rbextensions/api";

const TENTATIVAS_MAXIMAS = 10;
const INTERVALO_MS = 1500;

interface StatusPedido {
  status: "processando" | "concluida";
  id?: number;
  valorTotal?: number;
}

/**
 * Página de retorno do Stripe Checkout (success_url) depois que o
 * cliente paga. A venda em si só é criada pelo webhook
 * (api/webhook-stripe.php), que pode chegar um pouco antes ou depois
 * desse redirecionamento — por isso aqui a gente consulta
 * api/pedido-status.php de tempos em tempos até a venda aparecer, em
 * vez de assumir que ela já existe.
 */
export default function PedidoConfirmadoPage() {
  return (
    <Suspense>
      <PedidoConfirmadoConteudo />
    </Suspense>
  );
}

function PedidoConfirmadoConteudo() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { limparCarrinho } = useCarrinho();
  const carrinhoLimpo = useRef(false);

  const [pedido, setPedido] = useState<StatusPedido | null>(null);
  const [tentativasEsgotadas, setTentativasEsgotadas] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    let tentativas = 0;
    let cancelado = false;

    async function consultar() {
      tentativas += 1;

      try {
        const resposta = await fetch(
          `${API_BASE_URL_PUBLICO}/pedido-status.php?session_id=${encodeURIComponent(sessionId!)}`
        );
        const dados: StatusPedido = await resposta.json();

        if (cancelado) return;

        if (dados.status === "concluida") {
          setPedido(dados);
          return;
        }
      } catch {
        // tenta de novo no próximo intervalo
      }

      if (tentativas >= TENTATIVAS_MAXIMAS) {
        setTentativasEsgotadas(true);
        return;
      }

      setTimeout(consultar, INTERVALO_MS);
    }

    consultar();

    return () => {
      cancelado = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (pedido?.status === "concluida" && !carrinhoLimpo.current) {
      carrinhoLimpo.current = true;
      limparCarrinho();
    }
  }, [pedido, limparCarrinho]);

  if (!sessionId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Sessão de pagamento não encontrada</h1>
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
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 text-center">
      {pedido?.status === "concluida" ? (
        <>
          <h1 className="text-2xl font-semibold text-zinc-900">Pagamento confirmado!</h1>
          <p className="mt-2 text-zinc-600">
            Pedido #{pedido.id} —{" "}
            {pedido.valorTotal!.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Em breve entraremos em contato para combinar a entrega.</p>
        </>
      ) : tentativasEsgotadas ? (
        <>
          <h1 className="text-2xl font-semibold text-zinc-900">Pagamento recebido</h1>
          <p className="mt-2 text-zinc-600">
            Seu pagamento foi processado, mas a confirmação do pedido está demorando mais que o esperado.
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Não se preocupe: se o pagamento foi aprovado no Stripe, o pedido será registrado normalmente.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-zinc-900">Confirmando seu pagamento...</h1>
          <p className="mt-2 text-zinc-600">Isso leva só alguns segundos.</p>
        </>
      )}

      <Link
        href="/"
        className="mt-6 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
