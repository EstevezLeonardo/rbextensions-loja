function IconeQualidade({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.5 2.5 2.5 5-5" />
    </svg>
  );
}

function IconeWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.35 4.94L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Z" />
    </svg>
  );
}

function IconeSeguranca({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6v5.5c0 4.5 3.2 7.9 7.5 9.5 4.3-1.6 7.5-5 7.5-9.5V6L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconeEntrega({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h10.5v7.5H3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H17l3 3v1.5h-6.5z" />
      <circle cx="7" cy="17.25" r="1.4" />
      <circle cx="16.5" cy="17.25" r="1.4" />
    </svg>
  );
}

const SELOS = [
  { Icone: IconeQualidade, titulo: "100% Cabelo Humano", descricao: "Selecionado e verificado" },
  { Icone: IconeWhatsApp, titulo: "Atendimento no WhatsApp", descricao: "Resposta rápida e direta" },
  { Icone: IconeSeguranca, titulo: "Compra Segura", descricao: "Pagamento processado via Stripe" },
  { Icone: IconeEntrega, titulo: "Envio para todo o Brasil", descricao: "Acompanhe seu pedido" },
];

/** Faixa de selos de confiança — usada na home e em /cabelos, logo abaixo do topo de cada página. */
export function FaixaDeConfianca() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-6 px-6 py-8 sm:grid-cols-4">
        {SELOS.map(({ Icone, titulo, descricao }) => (
          <div key={titulo} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-dourado ring-1 ring-zinc-200">
              <Icone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-marrom">{titulo}</p>
              <p className="text-xs text-zinc-500">{descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
