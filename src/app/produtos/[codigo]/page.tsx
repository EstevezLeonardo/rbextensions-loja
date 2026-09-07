import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarProdutoPorCodigo } from "@/lib/api";
import { GaleriaDeFotos } from "@/components/GaleriaDeFotos";

interface ProdutoPageProps {
  params: Promise<{ codigo: string }>;
}

/**
 * Página de produto individual — api/produto.php busca pelo Código
 * (não pelo id numérico interno), então a URL fica /produtos/ext-001.
 * Galeria de fotos em GaleriaDeFotos (Client Component, só ela — o
 * resto da página continua Server Component). "Adicionar ao carrinho"
 * é só visual por enquanto (sem carrinho/checkout ainda).
 */
export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const { codigo } = await params;
  const produto = await buscarProdutoPorCodigo(codigo);

  if (!produto) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800">
          ← Voltar ao catálogo
        </Link>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <GaleriaDeFotos fotos={produto.fotos} nome={produto.nome} />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {[produto.categoria, produto.tom, produto.comprimento ? `${produto.comprimento}cm` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-900">{produto.nome}</h1>
            <p className="mt-1 text-sm text-zinc-500">Código: {produto.codigo}</p>

            {produto.descricao && <p className="mt-4 text-zinc-700">{produto.descricao}</p>}

            <p className="mt-6 text-3xl font-semibold text-zinc-900">
              {produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>

            <p
              className={
                produto.disponivel
                  ? "mt-1 text-sm font-medium text-emerald-700"
                  : "mt-1 text-sm font-medium text-red-700"
              }
            >
              {produto.disponivel ? "Disponível em estoque" : "Esgotado"}
            </p>

            <button
              type="button"
              disabled={!produto.disponivel}
              className="mt-6 w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {produto.disponivel ? "Adicionar ao carrinho" : "Indisponível"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: ProdutoPageProps) {
  const { codigo } = await params;
  const produto = await buscarProdutoPorCodigo(codigo);

  return {
    title: produto ? `${produto.nome} — Royal Brazilian Extensions` : "Produto não encontrado",
  };
}
