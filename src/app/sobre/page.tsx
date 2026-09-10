import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nós — Royal Brazilian Extensions",
};

/** Placeholder — página institucional ainda será construída. */
export default function SobreNosPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-dourado">Em breve</span>
      <h1 className="mt-3 text-3xl font-semibold text-marrom">Sobre Nós</h1>
      <p className="mt-4 text-zinc-600">
        Em breve você vai poder conhecer melhor a história da Royal Brazilian Extensions por aqui.
      </p>
    </main>
  );
}
