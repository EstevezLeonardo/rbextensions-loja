/**
 * Cliente pros endpoints públicos do dashboard PHP (rbextensions/api/*.php)
 * — o mesmo backend que administra o estoque/vendas, só que sem exigir
 * login (ver api/produtos.php e api/filtros.php no projeto rbextensions).
 *
 * API_BASE_URL é lida só no servidor (sem prefixo NEXT_PUBLIC_), já
 * que as chamadas daqui rodam em Server Components — o navegador do
 * cliente nunca precisa saber esse endereço.
 */

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost/rbextensions/api";

export interface Produto {
  id: number;
  codigo: string;
  tipoProduto: "cabelo" | "acessorio";
  nome: string;
  descricao: string;
  categoria: string;
  tom: string | null;
  comprimento: number | null;
  preco: number;
  disponivel: boolean;
  /** URL da capa (primeira foto), ou null se o produto ainda não tem nenhuma. */
  foto: string | null;
}

/** Produto com a galeria completa (api/produto.php) — página de produto, diferente da capa única da listagem. */
export interface ProdutoDetalhado extends Omit<Produto, "foto"> {
  fotos: string[];
}

interface RespostaProdutos {
  produtos: Produto[];
  paginaAtual: number;
  totalPaginas: number;
}

/**
 * Busca uma página do catálogo (api/produtos.php). $opcoes espelha os
 * filtros que o endpoint aceita — busca (nome/código), tipo ('cabelo'
 * pra /cabelos ou 'acessorio' pra /produtos), categoria (perfil do
 * fio), tom (cor) e comprimento (cm) — esses três últimos só valem
 * pra tipo 'cabelo'.
 */
export async function buscarProdutos(opcoes?: {
  busca?: string;
  tipo?: "cabelo" | "acessorio";
  categoria?: string;
  tom?: string;
  comprimento?: number;
  pagina?: number;
}): Promise<RespostaProdutos> {
  const parametros = new URLSearchParams();
  if (opcoes?.busca) parametros.set("busca", opcoes.busca);
  if (opcoes?.tipo) parametros.set("tipo", opcoes.tipo);
  if (opcoes?.categoria) parametros.set("categoria", opcoes.categoria);
  if (opcoes?.tom) parametros.set("tom", opcoes.tom);
  if (opcoes?.comprimento) parametros.set("comprimento", String(opcoes.comprimento));
  if (opcoes?.pagina) parametros.set("pagina", String(opcoes.pagina));

  const resposta = await fetch(`${API_BASE_URL}/produtos.php?${parametros.toString()}`, {
    // catálogo muda pouco; revalida no máximo a cada minuto em vez de
    // buscar a cada requisição — ajustar/remover quando fizer sentido
    next: { revalidate: 60 },
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o catálogo agora.");
  }

  return resposta.json() as Promise<RespostaProdutos>;
}

/**
 * Busca um único produto pelo código (api/produto.php) — página de
 * produto da loja. Devolve null quando não existe/está inativo (404
 * do endpoint), pra quem chamar decidir o que fazer (ex: notFound()).
 */
export async function buscarProdutoPorCodigo(codigo: string): Promise<ProdutoDetalhado | null> {
  const resposta = await fetch(`${API_BASE_URL}/produto.php?codigo=${encodeURIComponent(codigo)}`, {
    next: { revalidate: 60 },
  });

  if (resposta.status === 404) {
    return null;
  }

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar esse produto agora.");
  }

  return resposta.json() as Promise<ProdutoDetalhado>;
}

export interface OpcaoDeFiltro {
  valor: string | number;
  total: number;
}

interface RespostaFiltros {
  categorias: OpcaoDeFiltro[];
  tons: OpcaoDeFiltro[];
  comprimentos: OpcaoDeFiltro[];
}

/**
 * Busca as opções de filtro do catálogo (api/filtros.php), cada uma
 * já com a contagem de produtos ativos — pra montar a seção de
 * critérios de escolha (Tom/Comprimento/Perfil do fio) da loja.
 */
export async function buscarFiltros(): Promise<RespostaFiltros> {
  const resposta = await fetch(`${API_BASE_URL}/filtros.php`, {
    next: { revalidate: 60 },
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os filtros agora.");
  }

  return resposta.json() as Promise<RespostaFiltros>;
}
