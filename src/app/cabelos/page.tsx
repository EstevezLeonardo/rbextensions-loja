import Link from "next/link";
import { buscarFiltros, buscarProdutos, type OpcaoDeFiltro } from "@/lib/api";
import { CartaoProduto } from "@/components/CartaoProduto";
import { FaixaDeConfianca } from "@/components/FaixaDeConfianca";

interface FiltrosAtuais {
  categoria?: string;
  tom?: string;
  comprimento?: string;
  busca?: string;
  pagina?: string;
}

interface CabelosPageProps {
  searchParams: Promise<FiltrosAtuais>;
}

/**
 * Catálogo completo de cabelos (api/produtos.php) com "Critérios de
 * Escolha" (api/filtros.php, com contagem por opção). Filtros e a busca do
 * header vivem na URL — sem JS de cliente, cada opção é só um link.
 */
export default async function CabelosPage({ searchParams }: CabelosPageProps) {
  const filtrosAtuais = await searchParams;
  const pagina = filtrosAtuais.pagina ? Number(filtrosAtuais.pagina) : 1;

  const [{ produtos, paginaAtual, totalPaginas }, filtros] = await Promise.all([
    buscarProdutos({
      busca: filtrosAtuais.busca,
      tipo: "cabelo",
      categoria: filtrosAtuais.categoria,
      tom: filtrosAtuais.tom,
      comprimento: filtrosAtuais.comprimento ? Number(filtrosAtuais.comprimento) : undefined,
      pagina,
    }),
    buscarFiltros(),
  ]);

  const algumFiltroAtivo = Boolean(
    filtrosAtuais.categoria || filtrosAtuais.tom || filtrosAtuais.comprimento || filtrosAtuais.busca
  );

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-dourado">Catálogo</p>
          <h1 className="mt-1 font-serif text-3xl font-medium text-preto">Cabelos</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            Cabelos 100% humanos, selecionados por tom, comprimento e perfil do fio.
          </p>
        </div>
      </section>

      <FaixaDeConfianca />

      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Critérios de Escolha</h2>
            {algumFiltroAtivo && (
              <Link href="/cabelos" className="text-sm font-semibold text-dourado hover:text-marrom">
                Limpar filtros
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <GrupoDeFiltro
              titulo="Tom"
              chave="tom"
              opcoes={filtros.tons}
              valorAtivo={filtrosAtuais.tom}
              filtrosAtuais={filtrosAtuais}
              sufixo=""
            />
            <GrupoDeFiltro
              titulo="Comprimento"
              chave="comprimento"
              opcoes={filtros.comprimentos}
              valorAtivo={filtrosAtuais.comprimento}
              filtrosAtuais={filtrosAtuais}
              sufixo="cm"
            />
            <GrupoDeFiltro
              titulo="Perfil do fio"
              chave="categoria"
              opcoes={filtros.categorias}
              valorAtivo={filtrosAtuais.categoria}
              filtrosAtuais={filtrosAtuais}
              sufixo=""
            />
          </div>
        </div>

        {produtos.length === 0 ? (
          <p className="py-12 text-center text-zinc-500">Nenhum produto encontrado com esses critérios.</p>
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
                    href={construirHref(filtrosAtuais, "pagina", String(numeroDaPagina))}
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

/** Uma coluna de "Critérios de Escolha" (ex: Tom) — cada opção já é o link que aplica aquele filtro. */
function GrupoDeFiltro({
  titulo,
  chave,
  opcoes,
  valorAtivo,
  filtrosAtuais,
  sufixo,
}: {
  titulo: string;
  chave: "categoria" | "tom" | "comprimento";
  opcoes: OpcaoDeFiltro[];
  valorAtivo: string | undefined;
  filtrosAtuais: FiltrosAtuais;
  sufixo: string;
}) {
  if (opcoes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-preto">{titulo}</h3>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const valor = String(opcao.valor);
          const ativo = valorAtivo === valor;
          return (
            <Link
              key={valor}
              href={construirHref(filtrosAtuais, chave, valor)}
              className={
                ativo
                  ? "inline-flex items-center gap-1.5 rounded-full bg-dourado px-3 py-1.5 text-xs font-semibold text-white"
                  : "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-dourado-claro hover:text-marrom"
              }
            >
              <span>
                {valor}
                {sufixo}
              </span>
              <span className={ativo ? "text-white/80" : "text-zinc-400"}>({opcao.total})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Monta a URL de "/cabelos" com os filtros atuais + a mudança pedida
 * (chave/valor). Clicar de novo na mesma opção já ativa remove o filtro
 * (alterna); trocar qualquer filtro (menos a própria página) volta pra
 * página 1.
 */
function construirHref(
  filtrosAtuais: FiltrosAtuais,
  chave: keyof FiltrosAtuais,
  valor: string
): string {
  const parametros = new URLSearchParams();
  const jaEstaAtivo = filtrosAtuais[chave] === valor;

  (Object.keys(filtrosAtuais) as (keyof FiltrosAtuais)[]).forEach((chaveAtual) => {
    const valorAtual = filtrosAtuais[chaveAtual];
    if (valorAtual) {
      parametros.set(chaveAtual, valorAtual);
    }
  });

  if (chave === "pagina") {
    parametros.set("pagina", valor);
  } else {
    parametros.delete("pagina");
    if (jaEstaAtivo) {
      parametros.delete(chave);
    } else {
      parametros.set(chave, valor);
    }
  }

  const query = parametros.toString();
  return query ? `/cabelos?${query}` : "/cabelos";
}
