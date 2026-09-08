"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { loginCliente } from "@/lib/authApi";

/** Login do cliente da loja — separado do login do dashboard (equipe), que fica em outro sistema. */
export default function EntrarPage() {
  const router = useRouter();
  const { entrar } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const sessao = await loginCliente({ email, senha });
      entrar(sessao);
      router.push("/meus-pedidos");
    } catch (erro) {
      setErro(erro instanceof Error ? erro.message : "Não foi possível entrar agora.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-zinc-900">Entrar</h1>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
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
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 w-full rounded-lg bg-dourado px-6 py-3 text-sm font-semibold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Ainda não tem conta?{" "}
            <Link href="/criar-conta" className="font-medium text-dourado underline">
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
