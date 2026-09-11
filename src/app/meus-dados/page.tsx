"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { atualizarMeuPerfil, buscarMeuPerfil } from "@/lib/authApi";

const classeCampo = "mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm";
const classeLabel = "block text-xs font-medium text-zinc-600";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",
  "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

/** Gerenciar dados de perfil do cliente logado (nome/sobrenome/e-mail e, opcionalmente, senha) — redireciona para /entrar se não houver sessão. */
export default function MeusDadosPage() {
  const router = useRouter();
  const { token, carregado, atualizarCliente } = useAuth();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  useEffect(() => {
    if (!carregado) return;

    if (!token) {
      router.replace("/entrar");
      return;
    }

    buscarMeuPerfil(token)
      .then((perfil) => {
        setNome(perfil.nome);
        setSobrenome(perfil.sobrenome);
        setEmail(perfil.email);
        setCpf(perfil.cpf);
        setCep(perfil.endereco.cep);
        setRua(perfil.endereco.rua);
        setNumero(perfil.endereco.numero);
        setComplemento(perfil.endereco.complemento);
        setBairro(perfil.endereco.bairro);
        setCidade(perfil.endereco.cidade);
        setUf(perfil.endereco.uf);
      })
      .catch(() => setErro("Não foi possível carregar seus dados agora."))
      .finally(() => setCarregandoPerfil(false));
  }, [carregado, token, router]);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    if (!token) return;

    setErro(null);
    setSucesso(null);

    const trocandoSenha = senhaAtual !== "" || novaSenha !== "" || confirmarNovaSenha !== "";
    if (trocandoSenha && novaSenha !== confirmarNovaSenha) {
      setErro("A confirmação da nova senha não confere.");
      return;
    }

    setSalvando(true);
    try {
      const perfilAtualizado = await atualizarMeuPerfil(token, {
        nome,
        sobrenome,
        email,
        cpf,
        endereco: { cep, rua, numero, complemento, bairro, cidade, uf },
        senhaAtual: trocandoSenha ? senhaAtual : undefined,
        novaSenha: trocandoSenha ? novaSenha : undefined,
      });
      atualizarCliente({ nome: perfilAtualizado.nome, email: perfilAtualizado.email });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
      setSucesso("Dados atualizados com sucesso!");
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível salvar seus dados agora.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold text-zinc-900">Meus dados</h1>

          {carregandoPerfil ? (
            <p className="mt-4 text-zinc-500">Carregando...</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Dados pessoais</h2>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nome" className={classeLabel}>
                        Nome
                      </label>
                      <input
                        id="nome"
                        type="text"
                        required
                        value={nome}
                        onChange={(evento) => setNome(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                    <div>
                      <label htmlFor="sobrenome" className={classeLabel}>
                        Sobrenome
                      </label>
                      <input
                        id="sobrenome"
                        type="text"
                        required
                        value={sobrenome}
                        onChange={(evento) => setSobrenome(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className={classeLabel}>
                        E-mail
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(evento) => setEmail(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                    <div>
                      <label htmlFor="cpf" className={classeLabel}>
                        CPF
                      </label>
                      <input
                        id="cpf"
                        type="text"
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(evento) => setCpf(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Meu endereço</h2>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label htmlFor="cep" className={classeLabel}>
                        CEP
                      </label>
                      <input
                        id="cep"
                        type="text"
                        inputMode="numeric"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(evento) => setCep(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="rua" className={classeLabel}>
                        Rua
                      </label>
                      <input
                        id="rua"
                        type="text"
                        value={rua}
                        onChange={(evento) => setRua(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="numero" className={classeLabel}>
                        Número
                      </label>
                      <input
                        id="numero"
                        type="text"
                        value={numero}
                        onChange={(evento) => setNumero(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                    <div>
                      <label htmlFor="complemento" className={classeLabel}>
                        Complemento
                      </label>
                      <input
                        id="complemento"
                        type="text"
                        placeholder="Apto, bloco, ponto de referência..."
                        value={complemento}
                        onChange={(evento) => setComplemento(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="bairro" className={classeLabel}>
                        Bairro
                      </label>
                      <input
                        id="bairro"
                        type="text"
                        value={bairro}
                        onChange={(evento) => setBairro(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                    <div>
                      <label htmlFor="uf" className={classeLabel}>
                        Estado
                      </label>
                      <select id="uf" value={uf} onChange={(evento) => setUf(evento.target.value)} className={classeCampo}>
                        <option value="">—</option>
                        {UFS.map((sigla) => (
                          <option key={sigla} value={sigla}>
                            {sigla}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cidade" className={classeLabel}>
                      Cidade
                    </label>
                    <input
                      id="cidade"
                      type="text"
                      value={cidade}
                      onChange={(evento) => setCidade(evento.target.value)}
                      className={classeCampo}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Alterar senha</h2>
                <p className="mt-1 text-xs text-zinc-500">Deixe em branco se não quiser trocar a senha agora.</p>
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <label htmlFor="senha-atual" className={classeLabel}>
                      Senha atual
                    </label>
                    <input
                      id="senha-atual"
                      type="password"
                      value={senhaAtual}
                      onChange={(evento) => setSenhaAtual(evento.target.value)}
                      className={classeCampo}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nova-senha" className={classeLabel}>
                        Nova senha
                      </label>
                      <input
                        id="nova-senha"
                        type="password"
                        value={novaSenha}
                        onChange={(evento) => setNovaSenha(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmar-nova-senha" className={classeLabel}>
                        Confirmar nova senha
                      </label>
                      <input
                        id="confirmar-nova-senha"
                        type="password"
                        value={confirmarNovaSenha}
                        onChange={(evento) => setConfirmarNovaSenha(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {erro && <p className="text-sm text-red-600">{erro}</p>}
              {sucesso && <p className="text-sm text-emerald-700">{sucesso}</p>}

              <button
                type="submit"
                disabled={salvando}
                className="w-full rounded-lg bg-dourado px-6 py-3 text-sm font-semibold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
