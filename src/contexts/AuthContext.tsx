"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const API_BASE_URL_PUBLICO = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/rbextensions/api";
const CHAVE_LOCAL_STORAGE = "rbextensions-loja:auth";

export interface Cliente {
  nome: string;
  email: string;
}

interface SessaoSalva extends Cliente {
  token: string;
}

interface AuthContextValor {
  cliente: Cliente | null;
  token: string | null;
  carregado: boolean;
  entrar: (sessao: SessaoSalva) => void;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValor | null>(null);

/**
 * Estado de login do CLIENTE da loja, persistido em localStorage.
 * Separado da sessão PHP do dashboard (App\Session\Login) — a loja
 * roda numa origem diferente (porta 3000 vs Apache), então usa um
 * token opaco (ver api/cliente-login.php) guardado aqui em vez de
 * cookie de sessão. Mesmo padrão de CarrinhoContext.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<SessaoSalva | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_LOCAL_STORAGE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- carregando o estado inicial de um sistema externo (localStorage), só pode rodar depois de montar
      if (salvo) setSessao(JSON.parse(salvo));
    } catch {
      // localStorage indisponível — segue deslogado
    }
    setCarregado(true);
  }, []);

  function entrar(novaSessao: SessaoSalva) {
    setSessao(novaSessao);
    try {
      localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(novaSessao));
    } catch {
      // idem acima
    }
  }

  function sair() {
    const tokenAtual = sessao?.token;
    setSessao(null);
    try {
      localStorage.removeItem(CHAVE_LOCAL_STORAGE);
    } catch {
      // idem acima
    }
    if (tokenAtual) {
      fetch(`${API_BASE_URL_PUBLICO}/cliente-logout.php`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenAtual}` },
      }).catch(() => {
        // best-effort — o cliente já está deslogado localmente de qualquer forma
      });
    }
  }

  const cliente = sessao ? { nome: sessao.nome, email: sessao.email } : null;

  return (
    <AuthContext.Provider value={{ cliente, token: sessao?.token ?? null, carregado, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return contexto;
}
