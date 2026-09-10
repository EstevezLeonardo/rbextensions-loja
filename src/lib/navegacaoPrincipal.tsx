/**
 * Categorias de navegação principal da loja (sidebar off-canvas + grade
 * "O que você procura?" da home) — um só lugar pra adicionar opções novas
 * no futuro sem duplicar ícone/rótulo/rota em dois componentes.
 */

export function IconeCabelos({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3c2 3-1.5 4.5.5 7.5S4 15.5 6 19M12 3c2 3-1.5 4.5.5 7.5S10 15.5 12 19M18 3c2 3-1.5 4.5.5 7.5S16 15.5 18 19" />
    </svg>
  );
}

export function IconeProdutos({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5h18M3.75 7.5v11.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V7.5M3 7.5l1.664-4.163A1.5 1.5 0 0 1 6.055 2.4h11.89a1.5 1.5 0 0 1 1.391.937L21 7.5M12 7.5V21M8.5 2.4 6.75 7.5M15.5 2.4l1.75 5.1"
      />
    </svg>
  );
}

export function IconeSobre({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8.25h.01M11.25 11.25h1v5.25h1" />
    </svg>
  );
}

export function IconeConsultoria({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h8M8 13.5h5M21 12c0 4.556-4.03 8.25-9 8.25-1.09 0-2.135-.178-3.105-.503L3 21l1.395-3.72C3.51 15.988 3 14.06 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </svg>
  );
}

export interface ItemNavegacao {
  rotulo: string;
  href: string;
  Icone: (props: { className?: string }) => React.ReactElement;
}

export const ITENS_NAVEGACAO: ItemNavegacao[] = [
  { rotulo: "Cabelos", href: "/", Icone: IconeCabelos },
  { rotulo: "Produtos e Acessórios", href: "/produtos", Icone: IconeProdutos },
  { rotulo: "Sobre Nós", href: "/sobre", Icone: IconeSobre },
  { rotulo: "Consultoria", href: "/consultoria", Icone: IconeConsultoria },
];
