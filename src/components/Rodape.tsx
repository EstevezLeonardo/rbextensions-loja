/** Footer global (usado por layout.tsx em toda página) — contato e redes sociais. */
export function Rodape() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-base text-marrom">
            Royal Brazilian <span className="font-bold text-dourado">Extensions</span>
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            © {anoAtual} Royal Brazilian Extensions. Todos os direitos reservados.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-sm text-zinc-600 sm:items-end">
          <a href="https://wa.me/5521972701658" target="_blank" rel="noopener noreferrer" className="hover:text-dourado">
            WhatsApp: (21) 97270-1658
          </a>
          <a href="mailto:royalbext@gmail.com" className="hover:text-dourado">
            royalbext@gmail.com
          </a>
          <a
            href="https://www.instagram.com/royalbrazilianext/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-dourado"
          >
            @royalbrazilianext
          </a>
        </div>
      </div>
    </footer>
  );
}
