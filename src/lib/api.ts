/**
 * Cliente pros endpoints públicos do dashboard PHP (rbextensions/api/*.php)
 * — o mesmo backend que administra o estoque/vendas, só que sem exigir
 * login (ver api/produtos.php no projeto rbextensions).
 *
 * API_BASE_URL é lida só no servidor (sem prefixo NEXT_PUBLIC_), já
 * que as chamadas daqui rodam em Server Components — o navegador do
 * cliente nunca precisa saber esse endereço.
 */

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost/rbextensions/api";

export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  disponivel: boolean;
}

interface RespostaProdutos {
  produtos: Produto[];
  paginaAtual: number;
  totalPaginas: number;
}

/**
 * Busca uma página do catálogo (api/produtos.php). $opcoes espelha os
 * filtros que o endpoint aceita — busca (nome/código) e categoria.
 */
export async function buscarProdutos(opcoes?: {
  busca?: string;
  categoria?: string;
  pagina?: number;
}): Promise<RespostaProdutos> {
  const parametros = new URLSearchParams();
  if (opcoes?.busca) parametros.set("busca", opcoes.busca);
  if (opcoes?.categoria) parametros.set("categoria", opcoes.categoria);
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
