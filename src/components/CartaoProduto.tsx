import Link from "next/link";
import type { Produto } from "@/lib/api";

/** Card de produto do catálogo — usado na home, em /cabelos e em /produtos. */
export function CartaoProduto({ produto }: { produto: Produto }) {
  const meta = [produto.categoria, produto.tom, produto.comprimento ? `${produto.comprimento}cm` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/produtos/${produto.codigo}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square bg-zinc-50">
        <span
          className={
            produto.disponivel
              ? "absolute left-3 top-3 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"
              : "absolute left-3 top-3 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700"
          }
        >
          {produto.disponivel ? "Disponível" : "Esgotado"}
        </span>
        {produto.foto ? (
          // eslint-disable-next-line @next/next/no-img-element -- foto vem de outra origem (dashboard PHP), plain <img> em vez de next/image por enquanto
          <img src={produto.foto} alt={produto.nome} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">Sem foto</div>
        )}
      </div>
      <div className="p-4">
        {meta && <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">{meta}</p>}
        <h3 className={meta ? "mt-1 text-[15px] font-semibold text-preto" : "text-[15px] font-semibold text-preto"}>
          {produto.nome}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-serif text-lg text-marrom">
            {produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
          <span className="text-xs font-semibold text-dourado opacity-0 transition group-hover:opacity-100">
            Ver opções →
          </span>
        </div>
      </div>
    </Link>
  );
}
