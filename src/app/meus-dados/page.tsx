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

/**
 * Gerenciar dados de perfil do cliente logado — redireciona para /entrar
 * se não houver sessão. Dois formulários independentes: "Dados pessoais"
 * + "Meu endereço" salvam juntos num botão só; "Alterar senha" tem o seu
 * próprio botão, dentro do próprio card, e não mexe nos outros campos.
 */
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

  const [salvandoDados, setSalvandoDados] = useState(false);
  const [erroDados, setErroDados] = useState<string | null>(null);
  const [sucessoDados, setSucessoDados] = useState<string | null>(null);

  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState<string | null>(null);
  const [sucessoSenha, setSucessoSenha] = useState<string | null>(null);

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
      .catch(() => setErroDados("Não foi possível carregar seus dados agora."))
      .finally(() => setCarregandoPerfil(false));
  }, [carregado, token, router]);

  /** Salva Dados Pessoais + Meu Endereço — não mexe em senha. */
  async function handleSalvarDados(evento: FormEvent) {
    evento.preventDefault();
    if (!token) return;

    setErroDados(null);
    setSucessoDados(null);
    setSalvandoDados(true);
    try {
      const perfilAtualizado = await atualizarMeuPerfil(token, {
        nome,
        sobrenome,
        email,
        cpf,
        endereco: { cep, rua, numero, complemento, bairro, cidade, uf },
      });
      atualizarCliente({ nome: perfilAtualizado.nome, email: perfilAtualizado.email });
      setSucessoDados("Dados atualizados com sucesso!");
    } catch (erroCapturado) {
      setErroDados(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível salvar seus dados agora.");
    } finally {
      setSalvandoDados(false);
    }
  }

  /** Só troca a senha — reenvia nome/sobrenome/email/cpf/endereço atuais (o endpoint salva o perfil inteiro), sem alterá-los. */
  async function handleAlterarSenha(evento: FormEvent) {
    evento.preventDefault();
    if (!token) return;

    setErroSenha(null);
    setSucessoSenha(null);

    if (senhaAtual === "" || novaSenha === "") {
      setErroSenha("Preencha a senha atual e a nova senha.");
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErroSenha("A confirmação da nova senha não confere.");
      return;
    }

    setSalvandoSenha(true);
    try {
      await atualizarMeuPerfil(token, {
        nome,
        sobrenome,
        email,
        cpf,
        endereco: { cep, rua, numero, complemento, bairro, cidade, uf },
        senhaAtual,
        novaSenha,
      });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
      setSucessoSenha("Senha alterada com sucesso!");
    } catch (erroCapturado) {
      setErroSenha(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível alterar sua senha agora.");
    } finally {
      setSalvandoSenha(false);
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
            <div className="mt-6 flex flex-col gap-6">
              <form onSubmit={handleSalvarDados} className="flex flex-col gap-6">
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

                {erroDados && <p className="text-sm text-red-600">{erroDados}</p>}
                {sucessoDados && <p className="text-sm text-emerald-700">{sucessoDados}</p>}

                <button
                  type="submit"
                  disabled={salvandoDados}
                  className="w-full rounded-lg bg-dourado px-6 py-3 text-sm font-semibold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
                >
                  {salvandoDados ? "Salvando..." : "Salvar alterações"}
                </button>
              </form>

              <form onSubmit={handleAlterarSenha} className="rounded-lg border border-zinc-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Alterar senha</h2>
                <p className="mt-1 text-xs text-zinc-500">Confirme sua senha atual pra definir uma nova.</p>
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <label htmlFor="senha-atual" className={classeLabel}>
                      Senha atual
                    </label>
                    <input
                      id="senha-atual"
                      type="password"
                      required
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
                        required
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
                        required
                        value={confirmarNovaSenha}
                        onChange={(evento) => setConfirmarNovaSenha(evento.target.value)}
                        className={classeCampo}
                      />
                    </div>
                  </div>
                </div>

                {erroSenha && <p className="mt-3 text-sm text-red-600">{erroSenha}</p>}
                {sucessoSenha && <p className="mt-3 text-sm text-emerald-700">{sucessoSenha}</p>}

                <button
                  type="submit"
                  disabled={salvandoSenha}
                  className="mt-4 w-full rounded-lg bg-dourado px-6 py-3 text-sm font-semibold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
                >
                  {salvandoSenha ? "Alterando..." : "Alterar senha"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
