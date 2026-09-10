import Link from "next/link";
import { buscarFiltros, buscarProdutos, type OpcaoDeFiltro, type Produto } from "@/lib/api";
import { ITENS_NAVEGACAO } from "@/lib/navegacaoPrincipal";

interface FiltrosAtuais {
  categoria?: string;
  tom?: string;
  comprimento?: string;
  busca?: string;
  pagina?: string;
}

interface HomeProps {
  searchParams: Promise<FiltrosAtuais>;
}

/**
 * Home: hero + navegação por categoria + catálogo real (api/produtos.php)
 * com "Critérios de Escolha" (api/filtros.php, com contagem por opção).
 * Filtros (e a busca do header) vivem na URL — sem JS de cliente, cada
 * opção/form é só um link/GET.
 */
export default async function Home({ searchParams }: HomeProps) {
  const filtrosAtuais = await searchParams;
  const pagina = filtrosAtuais.pagina ? Number(filtrosAtuais.pagina) : 1;

  const [{ produtos, paginaAtual, totalPaginas }, filtros, { produtos: destaques }] = await Promise.all([
    buscarProdutos({
      busca: filtrosAtuais.busca,
      categoria: filtrosAtuais.categoria,
      tom: filtrosAtuais.tom,
      comprimento: filtrosAtuais.comprimento ? Number(filtrosAtuais.comprimento) : undefined,
      pagina,
    }),
    buscarFiltros(),
    // independente dos filtros ativos — o hero mostra sempre o mesmo destaque
    buscarProdutos({ pagina: 1 }),
  ]);

  const produtoDestaque = destaques[0];

  const algumFiltroAtivo = Boolean(
    filtrosAtuais.categoria || filtrosAtuais.tom || filtrosAtuais.comprimento || filtrosAtuais.busca
  );

  return (
    <main className="flex flex-1 flex-col">
      <SecaoHero produtoDestaque={produtoDestaque} />
      <SecaoCategorias />

      <section id="catalogo" className="mx-auto w-full max-w-6xl px-6 py-14">
        <div aria-labelledby="criterios-titulo" className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="criterios-titulo" className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Critérios de Escolha
            </h2>
            {algumFiltroAtivo && (
              <Link href="/" className="text-sm font-semibold text-dourado hover:text-marrom">
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
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-dourado">Catálogo</p>
              <h2 className="mt-1 font-serif text-2xl font-medium text-preto">Cabelos em destaque</h2>
            </div>

            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {produtos.map((produto) => (
                <li key={produto.id}>
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
                      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                        {[produto.categoria, produto.tom, produto.comprimento ? `${produto.comprimento}cm` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <h3 className="mt-1 text-[15px] font-semibold text-preto">{produto.nome}</h3>
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

      <SecaoCtaContato />
    </main>
  );
}

/** Banner preto no topo — headline + CTA + o produto mais recente em destaque (não muda com os filtros abaixo). */
function SecaoHero({ produtoDestaque }: { produtoDestaque?: Produto }) {
  return (
    <section className="bg-preto">
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
            <a
              href="#catalogo"
              className="rounded-[3px] bg-dourado px-7 py-3.5 text-sm font-bold text-white hover:bg-dourado-claro"
            >
              Ver cabelos disponíveis
            </a>
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
      <div className="flex flex-col items-start justify-between gap-6 rounded-md bg-preto px-8 py-10 text-white sm:flex-row sm:items-center sm:px-12">
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
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
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
                  : "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-dourado-claro hover:text-marrom"
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
