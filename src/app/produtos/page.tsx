import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos e Acessórios — Royal Brazilian Extensions",
};

/** Placeholder — catálogo de produtos/acessórios (fitas, colas etc.) ainda será construído. */
export default function ProdutosEAcessoriosPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-dourado">Em breve</span>
      <h1 className="mt-3 text-3xl font-semibold text-marrom">Produtos e Acessórios</h1>
      <p className="mt-4 text-zinc-600">
        Estamos preparando uma seção dedicada a fitas, colas e outros itens avulsos para manutenção
        da sua extensão. Enquanto isso, confira os cabelos disponíveis.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-dourado px-5 py-2.5 text-sm font-semibold text-white hover:bg-dourado-claro"
      >
        Ver cabelos disponíveis
      </Link>
    </main>
  );
}
