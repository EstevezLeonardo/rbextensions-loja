/**
 * Chamadas de autenticação de cliente — rodam no navegador (Client
 * Components), por isso usam NEXT_PUBLIC_API_BASE_URL em vez de
 * API_BASE_URL (que só existe no servidor, ver lib/api.ts).
 */

const API_BASE_URL_PUBLICO = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/rbextensions/api";

export interface SessaoCliente {
  token: string;
  nome: string;
  email: string;
}

async function tratarResposta(resposta: Response): Promise<SessaoCliente> {
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro ?? "Não foi possível concluir a operação agora.");
  }
  return dados as SessaoCliente;
}

export async function cadastrarCliente(dados: {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
}): Promise<SessaoCliente> {
  const resposta = await fetch(`${API_BASE_URL_PUBLICO}/cliente-cadastrar.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return tratarResposta(resposta);
}

export async function loginCliente(dados: { email: string; senha: string }): Promise<SessaoCliente> {
  const resposta = await fetch(`${API_BASE_URL_PUBLICO}/cliente-login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return tratarResposta(resposta);
}

export interface ItemDePedido {
  produtoNome: string;
  produtoCodigo: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Pedido {
  id: number;
  data: string;
  valorTotal: number;
  formaPagamento: string;
  status: string;
  /** "em_preparacao" (Em curso) ou "concluido" (Finalizado) — controlado pelo dashboard em Vendas. */
  statusEntrega: "em_preparacao" | "concluido";
  itens: ItemDePedido[];
}

export async function buscarMeusPedidos(token: string): Promise<Pedido[]> {
  const resposta = await fetch(`${API_BASE_URL_PUBLICO}/cliente-pedidos.php`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar seus pedidos agora.");
  }

  const dados = await resposta.json();
  return dados.pedidos as Pedido[];
}

export interface EnderecoCliente {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface PerfilCliente {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  endereco: EnderecoCliente;
}

export async function buscarMeuPerfil(token: string): Promise<PerfilCliente> {
  const resposta = await fetch(`${API_BASE_URL_PUBLICO}/cliente-perfil.php`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar seus dados agora.");
  }

  return resposta.json() as Promise<PerfilCliente>;
}

/**
 * Atualiza nome/sobrenome/e-mail/cpf/endereço do cliente logado —
 * cpf e os campos de endereco são opcionais (string vazia limpa o
 * campo); senhaAtual/novaSenha são opcionais, só exigidos juntos
 * quando a pessoa quer trocar de senha (ver api/cliente-atualizar.php).
 */
export async function atualizarMeuPerfil(
  token: string,
  dados: {
    nome: string;
    sobrenome: string;
    email: string;
    cpf?: string;
    endereco?: EnderecoCliente;
    senhaAtual?: string;
    novaSenha?: string;
  }
): Promise<PerfilCliente> {
  const resposta = await fetch(`${API_BASE_URL_PUBLICO}/cliente-atualizar.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(dados),
  });

  const corpo = await resposta.json();
  if (!resposta.ok) {
    throw new Error(corpo.erro ?? "Não foi possível salvar seus dados agora.");
  }
  return corpo as PerfilCliente;
}
