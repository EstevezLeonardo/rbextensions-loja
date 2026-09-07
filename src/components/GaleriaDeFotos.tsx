"use client";

import { useState } from "react";

interface GaleriaDeFotosProps {
  fotos: string[];
  nome: string;
}

/**
 * Galeria da página de produto: foto grande + miniaturas clicáveis
 * abaixo. Client Component só por causa do estado de "qual foto está
 * selecionada" — o resto da página continua Server Component.
 */
export function GaleriaDeFotos({ fotos, nome }: GaleriaDeFotosProps) {
  const [indiceSelecionado, setIndiceSelecionado] = useState(0);

  if (fotos.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white text-sm text-zinc-400">
        Sem foto ainda
      </div>
    );
  }

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element -- foto vem de outra origem (dashboard PHP), plain <img> em vez de next/image por enquanto */}
      <img
        src={fotos[indiceSelecionado]}
        alt={nome}
        className="aspect-square w-full rounded-lg border border-zinc-200 bg-white object-cover"
      />

      {fotos.length > 1 && (
        <div className="mt-3 flex gap-2">
          {fotos.map((foto, indice) => (
            <button
              key={foto}
              type="button"
              onClick={() => setIndiceSelecionado(indice)}
              className={
                indice === indiceSelecionado
                  ? "h-16 w-16 overflow-hidden rounded-md border-2 border-zinc-900"
                  : "h-16 w-16 overflow-hidden rounded-md border border-zinc-200"
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- idem acima */}
              <img src={foto} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
