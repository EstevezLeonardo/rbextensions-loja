import Link from "next/link";
import { buscarProdutos, type Produto } from "@/lib/api";
import { ITENS_NAVEGACAO } from "@/lib/navegacaoPrincipal";
import { CartaoProduto } from "@/components/CartaoProduto";
import { FaixaDeConfianca } from "@/components/FaixaDeConfianca";

/**
 * Home: hero + navegação por categoria + uma prévia do catálogo. O
 * catálogo completo (filtros, busca, paginação) vive em /cabelos.
 */
export default async function Home() {
  const { produtos } = await buscarProdutos({ tipo: "cabelo", pagina: 1 });
  const produtoDestaque = produtos[0];
  const produtosDestaque = produtos.slice(0, 4);

  return (
    <main className="flex flex-1 flex-col">
      <SecaoHero produtoDestaque={produtoDestaque} />
      <FaixaDeConfianca />
      <SecaoCategorias />

      {produtosDestaque.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 py-14">
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-dourado">Catálogo</p>
              <h2 className="mt-1 font-serif text-2xl font-medium text-preto">Cabelos em destaque</h2>
            </div>
            <Link href="/cabelos" className="text-sm font-semibold text-marrom hover:text-dourado">
              Ver todos os cabelos →
            </Link>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {produtosDestaque.map((produto) => (
              <li key={produto.id}>
                <CartaoProduto produto={produto} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <SecaoCtaContato />
    </main>
  );
}

/** Banner escuro no topo — headline + CTA + o produto mais recente em destaque. */
function SecaoHero({ produtoDestaque }: { produtoDestaque?: Produto }) {
  return (
    <section className="fundo-luxo">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 md:grid-cols-[1fr_0.78fr] md:items-center md:py-24">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-px w-6 bg-dourado-claro" />
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-dourado-claro">
              100% cabelo humano
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-[1.15] font-medium text-white sm:text-[42px]">
            Extensões que valorizam <em className="text-dourado-claro italic">a sua beleza natural</em>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-400">
            Cabelos selecionados, fitas e acessórios de confecção — com o acabamento que a Royal Brazilian
            Extensions é conhecida por entregar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/cabelos"
              className="rounded-[3px] bg-dourado px-7 py-3.5 text-sm font-bold text-white hover:bg-dourado-claro"
            >
              Ver cabelos disponíveis
            </Link>
            <a
              href="https://wa.me/5521972701658"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-white/35 pb-0.5 text-sm font-semibold text-white hover:border-dourado-claro hover:text-dourado-claro"
            >
              Falar no WhatsApp →
            </a>
          </div>
        </div>

        {produtoDestaque && (
          <div>
            <div className="overflow-hidden rounded-[3px] border border-white/15">
              {produtoDestaque.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={produtoDestaque.foto}
                  alt={produtoDestaque.nome}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-white/5 text-xs text-white/40">
                  Sem foto
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-dourado-claro">
                  {[produtoDestaque.categoria, produtoDestaque.tom, produtoDestaque.comprimento ? `${produtoDestaque.comprimento}cm` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="mt-1 font-serif text-xl text-white">
                  {produtoDestaque.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {produtoDestaque.disponivel ? "Disponível" : "Esgotado"}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Grade "O que você procura?" — mesma lista de categorias da sidebar off-canvas. */
function SecaoCategorias() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-widest text-dourado">Navegue pela loja</p>
      <h2 className="mt-1 font-serif text-2xl font-medium text-preto">O que você procura?</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {ITENS_NAVEGACAO.map(({ rotulo, href, Icone }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-6 text-center transition hover:-translate-y-0.5 hover:border-dourado-claro hover:shadow-md"
          >
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-dourado">
              <Icone className="h-5 w-5" />
            </span>
            <span className="mt-3 block text-sm font-semibold text-marrom">{rotulo}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Banda de contato antes do rodapé — WhatsApp real + consultoria. */
function SecaoCtaContato() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16">
      <div className="fundo-luxo flex flex-col items-start justify-between gap-6 rounded-md px-8 py-10 text-white sm:flex-row sm:items-center sm:px-12">
        <div>
          <h3 className="font-serif text-xl font-medium sm:text-2xl">Não sabe qual extensão combina com você?</h3>
          <p className="mt-1.5 max-w-md text-sm text-zinc-400">
            Fale direto com a nossa equipe pelo WhatsApp ou agende uma consultoria personalizada.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="https://wa.me/5521972701658"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[3px] bg-dourado px-6 py-3 text-sm font-bold text-white hover:bg-dourado-claro"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.35 4.94L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Z" />
            </svg>
            Falar no WhatsApp
          </a>
          <Link
            href="/consultoria"
            className="border-b border-white/35 pb-0.5 text-sm font-semibold text-white hover:border-dourado-claro hover:text-dourado-claro"
          >
            Agendar consultoria →
          </Link>
        </div>
      </div>
    </section>
  );
}
