import { buscarProdutos } from "@/lib/api";

/**
 * Home provisória: só prova que a loja consegue puxar o catálogo de
 * verdade do dashboard PHP (api/produtos.php, mesmo banco/estoque que
 * a equipe administra). Estilo neutro de propósito — troca pelo
 * layout de referência quando ele for escolhido.
 */
export default async function Home() {
  const { produtos } = await buscarProdutos();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-900">Royal Brazilian Extensions</h1>
      </header>

      <main className="flex-1 px-6 py-8">
        {produtos.length === 0 ? (
          <p className="text-zinc-500">Nenhum produto disponível no momento.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <li
                key={produto.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {produto.categoria}
                </p>
                <h2 className="mt-1 text-base font-semibold text-zinc-900">{produto.nome}</h2>
                {produto.descricao && (
                  <p className="mt-1 text-sm text-zinc-600">{produto.descricao}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-semibold text-zinc-900">
                    {produto.preco.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <span
                    className={
                      produto.disponivel
                        ? "text-xs font-medium text-emerald-700"
                        : "text-xs font-medium text-red-700"
                    }
                  >
                    {produto.disponivel ? "Disponível" : "Esgotado"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
