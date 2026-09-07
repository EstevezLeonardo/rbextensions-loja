import Link from "next/link";
import { buscarFiltros, buscarProdutos, type OpcaoDeFiltro } from "@/lib/api";

interface FiltrosAtuais {
  categoria?: string;
  tom?: string;
  comprimento?: string;
  pagina?: string;
}

interface HomeProps {
  searchParams: Promise<FiltrosAtuais>;
}

/**
 * Home provisória: catálogo real (api/produtos.php) + seção "Critérios
 * de Escolha" (api/filtros.php, com contagem por opção) inspirada no
 * site de referência do ramo. Filtros vivem na URL (?categoria=&tom=&
 * comprimento=), sem JS de cliente — cada opção é só um link. Estilo
 * neutro de propósito, ainda a trocar pelo layout de referência.
 */
export default async function Home({ searchParams }: HomeProps) {
  const filtrosAtuais = await searchParams;
  const pagina = filtrosAtuais.pagina ? Number(filtrosAtuais.pagina) : 1;

  const [{ produtos, paginaAtual, totalPaginas }, filtros] = await Promise.all([
    buscarProdutos({
      categoria: filtrosAtuais.categoria,
      tom: filtrosAtuais.tom,
      comprimento: filtrosAtuais.comprimento ? Number(filtrosAtuais.comprimento) : undefined,
      pagina,
    }),
    buscarFiltros(),
  ]);

  const algumFiltroAtivo = Boolean(
    filtrosAtuais.categoria || filtrosAtuais.tom || filtrosAtuais.comprimento
  );

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-900">Royal Brazilian Extensions</h1>
      </header>

      <main className="flex-1 px-6 py-8">
        <section aria-labelledby="criterios-titulo" className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="criterios-titulo" className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Critérios de Escolha
            </h2>
            {algumFiltroAtivo && (
              <Link href="/" className="text-sm font-medium text-zinc-500 underline hover:text-zinc-800">
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
        </section>

        {produtos.length === 0 ? (
          <p className="text-zinc-500">Nenhum produto encontrado com esses critérios.</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {produtos.map((produto) => (
                <li key={produto.id}>
                  <Link
                    href={`/produtos/${produto.codigo}`}
                    className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-md bg-zinc-100">
                      {produto.foto ? (
                        // eslint-disable-next-line @next/next/no-img-element -- foto vem de outra origem (dashboard PHP), plain <img> em vez de next/image por enquanto
                        <img
                          src={produto.foto}
                          alt={produto.nome}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-zinc-400">Sem foto</span>
                      )}
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {[produto.categoria, produto.tom, produto.comprimento ? `${produto.comprimento}cm` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-zinc-900">{produto.nome}</h2>
                    {produto.descricao && (
                      <p className="mt-1 text-sm text-zinc-600">{produto.descricao}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-zinc-900">
                        {produto.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span
                        className={
                          produto.disponivel
                            ? "text-xs font-medium text-emerald-700"
                            : "text-xs font-medium text-red-700"
                        }
                      >
                        {produto.disponivel ? "Disponível" : "Esgotado"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {totalPaginas > 1 && (
              <nav aria-label="Paginação" className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numeroDaPagina) => (
                  <Link
                    key={numeroDaPagina}
                    href={construirHref(filtrosAtuais, "pagina", String(numeroDaPagina))}
                    className={
                      numeroDaPagina === paginaAtual
                        ? "rounded bg-zinc-900 px-3 py-1 text-sm font-medium text-white"
                        : "rounded border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                    }
                  >
                    {numeroDaPagina}
                  </Link>
                ))}
              </nav>
            )}
          </>
        )}
      </main>
    </div>
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
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="mb-2 text-sm font-semibold text-zinc-900">{titulo}</h3>
      <ul className="flex flex-col gap-1">
        {opcoes.map((opcao) => {
          const valor = String(opcao.valor);
          const ativo = valorAtivo === valor;
          return (
            <li key={valor}>
              <Link
                href={construirHref(filtrosAtuais, chave, valor)}
                className={
                  ativo
                    ? "flex items-center justify-between rounded bg-zinc-900 px-2 py-1 text-sm font-medium text-white"
                    : "flex items-center justify-between rounded px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
                }
              >
                <span>
                  {valor}
                  {sufixo}
                </span>
                <span className={ativo ? "text-zinc-300" : "text-zinc-400"}>{opcao.total}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Monta a URL de "/" com os filtros atuais + a mudança pedida (chave/valor).
 * Clicar de novo na mesma opção já ativa remove o filtro (alterna); trocar
 * qualquer filtro (menos a própria página) volta pra página 1.
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
  return query ? `/?${query}` : "/";
}
