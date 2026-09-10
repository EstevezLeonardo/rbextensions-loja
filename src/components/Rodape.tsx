import Link from "next/link";
import { ITENS_NAVEGACAO } from "@/lib/navegacaoPrincipal";

/** Footer global (usado por layout.tsx em toda página) — marca, navegação e contato real. */
export function Rodape() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="fundo-luxo mt-auto text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-lg text-white">
            Royal Brazilian <span className="font-medium text-dourado-claro italic">Extensions</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
            Cabelos 100% humanos e acessórios de confecção selecionados a dedo, para transformações que
            respeitam a sua identidade.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href="https://www.instagram.com/royalbrazilianext/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" />
              </svg>
            </a>
            <a
              href="https://wa.me/5521972701658"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.35 4.94L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-dourado-claro">Loja</h4>
          <ul className="mt-4 flex flex-col gap-3">
            {ITENS_NAVEGACAO.map(({ rotulo, href }) => (
              <li key={href}>
                <Link href={href} className="text-sm hover:text-white">
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-dourado-claro">Atendimento</h4>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a href="https://wa.me/5521972701658" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white">
                (21) 97270-1658
              </a>
            </li>
            <li>
              <a href="mailto:royalbext@gmail.com" className="text-sm hover:text-white">
                royalbext@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/royalbrazilianext/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white"
              >
                @royalbrazilianext
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-zinc-600">
        © {anoAtual} Royal Brazilian Extensions. Todos os direitos reservados.
      </div>
    </footer>
  );
}
