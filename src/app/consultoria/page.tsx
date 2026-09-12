import type { Metadata } from "next";
import { FormularioConsultoria } from "@/components/FormularioConsultoria";
import { IconeMedalhao3D } from "@/components/IconeMedalhao3D";

export const metadata: Metadata = {
  title: "Consultoria — Royal Brazilian Extensions",
};

const DESTAQUES = [
  "Avaliação de perfil (cabelo e tom de pele) para indicar os produtos ideais",
  "Marcação e orçamento de colocação de Mega Hair",
  "Colorimetria capilar",
];

/** Agendamento de consultoria — hero com o ícone 3D da marca + formulário que cria o compromisso direto na Agenda do dashboard. */
export default function ConsultoriaPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="fundo-luxo">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 md:grid-cols-[0.85fr_1fr] md:items-center md:py-24">
          <div className="mx-auto w-full max-w-xs md:max-w-sm">
            <IconeMedalhao3D />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-dourado-claro" />
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-dourado-claro">Consultoria</span>
            </div>
            <h1 className="mt-5 font-serif text-4xl leading-[1.15] font-medium text-white sm:text-[42px]">
              Uma avaliação <em className="text-dourado-claro italic">feita pra você</em>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-400">
              Agende uma consultoria personalizada e descubra os produtos, cores e serviços mais indicados pro seu
              cabelo e tom de pele.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {DESTAQUES.map((destaque) => (
                <li key={destaque} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dourado-claro" />
                  {destaque}
                </li>
              ))}
            </ul>
            <a
              href="#agendar"
              className="mt-8 inline-flex rounded-[3px] bg-dourado px-7 py-3.5 text-sm font-bold text-white hover:bg-dourado-claro"
            >
              Agendar agora
            </a>
          </div>
        </div>
      </section>

      <section id="agendar" className="mx-auto w-full max-w-2xl px-6 py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-dourado">Agendamento</p>
          <h2 className="mt-1 font-serif text-2xl font-medium text-preto">Escolha o melhor dia e horário</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Enviaremos a confirmação por e-mail ou WhatsApp assim que recebermos sua solicitação.
          </p>
        </div>
        <FormularioConsultoria />
      </section>
    </main>
  );
}
