import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laces e Perucas — Royal Brazilian Extensions",
};

/** Placeholder — catálogo de laces e perucas ainda será construído. */
export default function LacesEPerucasPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-dourado">Em breve</span>
      <h1 className="mt-3 text-3xl font-semibold text-marrom">Laces e Perucas</h1>
      <p className="mt-4 text-zinc-600">
        Estamos preparando uma seção dedicada a laces e perucas. Volte em breve para conferir as novidades.
      </p>
    </main>
  );
}
