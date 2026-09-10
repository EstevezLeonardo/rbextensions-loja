import Link from "next/link";
import type { Metadata } from "next";
import { buscarProdutos } from "@/lib/api";
import { CartaoProduto } from "@/components/CartaoProduto";
import { FaixaDeConfianca } from "@/components/FaixaDeConfianca";

export const metadata: Metadata = {
  title: "Produtos e Acessórios — Royal Brazilian Extensions",
};

interface ProdutosPageProps {
  searchParams: Promise<{ pagina?: string }>;
}

/**
 * Catálogo de produtos/acessórios (fitas, colas etc. — TipoProduto
 * 'acessorio', api/produtos.php?tipo=acessorio). Sem "Critérios de
 * Escolha" (Tom/Comprimento/Perfil do fio são campos só de 'cabelo',
 * ver /cabelos) — só busca por página e a grade de produtos.
 */
export default async function ProdutosEAcessoriosPage({ searchParams }: ProdutosPageProps) {
  const { pagina: paginaParam } = await searchParams;
  const pagina = paginaParam ? Number(paginaParam) : 1;

  const { produtos, paginaAtual, totalPaginas } = await buscarProdutos({ tipo: "acessorio", pagina });

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-dourado">Catálogo</p>
          <h1 className="mt-1 font-serif text-3xl font-medium text-preto">Produtos e Acessórios</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            Fitas, colas e outros itens avulsos para manutenção da sua extensão.
          </p>
        </div>
      </section>

      <FaixaDeConfianca />

      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        {produtos.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">
            <p>Nenhum produto cadastrado por aqui ainda.</p>
            <Link href="/cabelos" className="mt-3 inline-block text-sm font-semibold text-dourado hover:text-marrom">
              Ver cabelos disponíveis →
            </Link>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {produtos.map((produto) => (
                <li key={produto.id}>
                  <CartaoProduto produto={produto} />
                </li>
              ))}
            </ul>

            {totalPaginas > 1 && (
              <nav aria-label="Paginação" className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numeroDaPagina) => (
                  <Link
                    key={numeroDaPagina}
                    href={numeroDaPagina === 1 ? "/produtos" : `/produtos?pagina=${numeroDaPagina}`}
                    className={
                      numeroDaPagina === paginaAtual
                        ? "rounded-full bg-dourado px-3.5 py-1.5 text-sm font-semibold text-white"
                        : "rounded-full border border-zinc-200 px-3.5 py-1.5 text-sm font-medium text-marrom hover:border-dourado-claro"
                    }
                  >
                    {numeroDaPagina}
                  </Link>
                ))}
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
