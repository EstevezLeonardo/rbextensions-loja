import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultoria — Royal Brazilian Extensions",
};

/** Placeholder — agendamento de consultoria ainda será construído; por ora, direciona pro WhatsApp. */
export default function ConsultoriaPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-dourado">Em breve</span>
      <h1 className="mt-3 text-3xl font-semibold text-marrom">Consultoria</h1>
      <p className="mt-4 text-zinc-600">
        Estamos preparando um espaço para agendar sua consultoria personalizada. Enquanto isso, fale
        direto com a gente pelo WhatsApp.
      </p>
      <a
        href="https://wa.me/5521972701658"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center rounded-lg bg-dourado px-5 py-2.5 text-sm font-semibold text-white hover:bg-dourado-claro"
      >
        Falar no WhatsApp
      </a>
    </main>
  );
}
