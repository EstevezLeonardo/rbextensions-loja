"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { atualizarMeuPerfil, buscarMeuPerfil } from "@/lib/authApi";

const classeCampo = "mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm";
const classeLabel = "block text-xs font-medium text-zinc-600";

/** Gerenciar dados de perfil do cliente logado (nome/sobrenome/e-mail e, opcionalmente, senha) — redireciona para /entrar se não houver sessão. */
export default function MeusDadosPage() {
  const router = useRouter();
  const { token, carregado, atualizarCliente } = useAuth();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
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
