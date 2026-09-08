"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cadastrarCliente } from "@/lib/authApi";

/**
 * Cadastro do cliente da loja. Se o e-mail já tiver comprado como
 * convidado antes (sem conta), api/cliente-cadastrar.php reaproveita
 * esse cadastro e só define a senha nele — nesse caso o histórico de
 * pedidos já aparece em /meus-pedidos na hora.
 */
export default function CriarContaPage() {
  const router = useRouter();
  const { entrar } = useAuth();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const sessao = await cadastrarCliente({ nome, sobrenome, email, senha });
      entrar(sessao);
      router.push("/meus-pedidos");
    } catch (erro) {
      setErro(erro instanceof Error ? erro.message : "Não foi possível criar a conta agora.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-zinc-900">Criar conta</h1>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <div>
              <label htmlFor="nome" className="block text-xs font-medium text-zinc-600">
                Nome
              </label>
              <input
                id="nome"
                required
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="sobrenome" className="block text-xs font-medium text-zinc-600">
                Sobrenome
              </label>
              <input
                id="sobrenome"
                required
                value={sobrenome}
                onChange={(evento) => setSobrenome(evento.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-600">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-xs font-medium text-zinc-600">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-zinc-400">Pelo menos 6 caracteres.</p>
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 w-full rounded-lg bg-dourado px-6 py-3 text-sm font-semibold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {enviando ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Já tem conta?{" "}
            <Link href="/entrar" className="font-medium text-dourado underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
