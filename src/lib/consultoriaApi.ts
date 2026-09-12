/**
 * Agendamento de consultoria (api/consultoria-agendar.php) — roda no
 * navegador (Client Component), por isso usa NEXT_PUBLIC_API_BASE_URL
 * em vez de API_BASE_URL (só existe no servidor, ver lib/api.ts).
 * Endpoint público, sem exigir conta/login.
 */

const API_BASE_URL_PUBLICO = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/rbextensions/api";

export type TipoServicoConsultoria = "avaliacao" | "mega_hair" | "colorimetria" | "outro";

export interface DadosConsultoria {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  tipoServico: TipoServicoConsultoria;
  /** AAAA-MM-DD */
  data: string;
  /** HH:MM */
  horario: string;
  mensagem?: string;
}

export interface ConsultoriaAgendada {
  inicio: string;
  fim: string;
}

export async function agendarConsultoria(dados: DadosConsultoria): Promise<ConsultoriaAgendada> {
  const resposta = await fetch(`${API_BASE_URL_PUBLICO}/consultoria-agendar.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  const corpo = await resposta.json();
  if (!resposta.ok) {
    throw new Error(corpo.erro ?? "Não foi possível agendar sua consultoria agora.");
  }
  return corpo as ConsultoriaAgendada;
}
