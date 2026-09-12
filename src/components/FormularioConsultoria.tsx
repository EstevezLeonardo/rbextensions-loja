"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { buscarMeuPerfil } from "@/lib/authApi";
import { agendarConsultoria, type TipoServicoConsultoria } from "@/lib/consultoriaApi";

const SERVICOS: { valor: TipoServicoConsultoria; rotulo: string }[] = [
  { valor: "avaliacao", rotulo: "Avaliação de Perfil (cabelo e tom de pele)" },
  { valor: "mega_hair", rotulo: "Colocação de Mega Hair" },
  { valor: "colorimetria", rotulo: "Colorimetria Capilar" },
  { valor: "outro", rotulo: "Outro / Ainda não sei" },
];

const classeCampo = "mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm";
const classeLabel = "block text-xs font-medium text-zinc-600";

function hojeISO(): string {
  const agora = new Date();
  const offset = agora.getTimezoneOffset();
  return new Date(agora.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * Formulário de agendamento de consultoria — cria diretamente um
 * evento na Agenda do dashboard (api/consultoria-agendar.php). Exige
 * o cliente logado: sem sessão, mostra um convite pra entrar ou criar
 * conta em vez do formulário. Logado, nome/sobrenome/e-mail vêm
 * pré-preenchidos com os dados já cadastrados (api/cliente-perfil.php),
 * mas continuam editáveis.
 */
export function FormularioConsultoria() {
  const { token, carregado } = useAuth();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoServico, setTipoServico] = useState<TipoServicoConsultoria>("avaliacao");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmacao, setConfirmacao] = useState<{ inicio: string } | null>(null);

  useEffect(() => {
    if (!carregado) return;

    if (!token) {
      setCarregandoPerfil(false);
      return;
    }

    buscarMeuPerfil(token)
      .then((perfil) => {
        setNome(perfil.nome);
        setSobrenome(perfil.sobrenome);
        setEmail(perfil.email);
      })
      .catch(() => {
        // segue com o formulário em branco — não é motivo pra travar o agendamento
      })
      .finally(() => setCarregandoPerfil(false));
  }, [carregado, token]);

  if (!carregado || carregandoPerfil) {
    return <p className="text-center text-sm text-zinc-500">Carregando...</p>;
  }

  if (!token) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center">
        <p className="font-serif text-lg text-preto">Entre na sua conta pra agendar</p>
        <p className="mt-2 text-sm text-zinc-600">
          Pra confirmarmos seu agendamento com os dados certos, você precisa estar logado.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/entrar"
            className="w-full rounded-lg bg-dourado px-6 py-3 text-sm font-semibold text-white hover:bg-marrom sm:w-auto"
          >
            Entrar
          </Link>
          <Link
            href="/criar-conta"
            className="w-full rounded-lg border border-dourado/40 px-6 py-3 text-sm font-semibold text-marrom hover:bg-dourado/10 sm:w-auto"
          >
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resultado = await agendarConsultoria({
        nome,
        sobrenome,
        email,
        telefone,
        tipoServico,
        data,
        horario,
        mensagem: mensagem || undefined,
      });
      setConfirmacao(resultado);
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível agendar sua consultoria agora.");
    } finally {
      setEnviando(false);
    }
  }

  if (confirmacao) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Solicitação enviada</p>
        <h2 className="mt-2 font-serif text-xl text-preto">Recebemos seu pedido de consultoria!</h2>
        <p className="mt-2 text-sm text-zinc-700">
          Para{" "}
          <strong>
            {new Date(confirmacao.inicio.replace(" ", "T")).toLocaleString("pt-BR", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </strong>
          . Vamos confirmar com você por e-mail ou WhatsApp em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className={classeLabel}>
            Nome
          </label>
          <input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} className={classeCampo} />
        </div>
        <div>
          <label htmlFor="sobrenome" className={classeLabel}>
            Sobrenome
          </label>
          <input
            id="sobrenome"
            required
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            className={classeCampo}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={classeLabel}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classeCampo}
          />
        </div>
        <div>
          <label htmlFor="telefone" className={classeLabel}>
            WhatsApp / Telefone
          </label>
          <input
            id="telefone"
            type="tel"
            required
            placeholder="(21) 90000-0000"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className={classeCampo}
          />
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="tipo-servico" className={classeLabel}>
          O que você precisa?
        </label>
        <select
          id="tipo-servico"
          value={tipoServico}
          onChange={(e) => setTipoServico(e.target.value as TipoServicoConsultoria)}
          className={classeCampo}
        >
          {SERVICOS.map((servico) => (
            <option key={servico.valor} value={servico.valor}>
              {servico.rotulo}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="data" className={classeLabel}>
            Data
          </label>
          <input
            id="data"
            type="date"
            required
            min={hojeISO()}
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={classeCampo}
          />
        </div>
        <div>
          <label htmlFor="horario" className={classeLabel}>
            Horário
          </label>
          <input
            id="horario"
            type="time"
            required
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            className={classeCampo}
          />
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="mensagem" className={classeLabel}>
          Conte um pouco sobre você (opcional)
        </label>
        <textarea
          id="mensagem"
          rows={4}
          placeholder="Textura e comprimento do seu cabelo, tom de pele, cor desejada, ou qualquer detalhe que ajude na avaliação..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className={classeCampo}
        />
      </div>

      {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="mt-5 w-full rounded-lg bg-dourado px-6 py-3 text-sm font-semibold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {enviando ? "Enviando..." : "Solicitar agendamento"}
      </button>
    </form>
  );
}
