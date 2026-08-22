import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "@/components/shop-filters";
import { getProducts, type SortOption } from "@/lib/store-data";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toSort(value: string | undefined): SortOption {
  if (value === "price-asc" || value === "price-desc" || value === "rating" || value === "newest") return value;
  return "featured";
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = firstParam(params.category);
  const collection = firstParam(params.collection);
  const query = firstParam(params.q);
  const sort = toSort(firstParam(params.sort));

  const [products, allProducts] = await Promise.all([
    getProducts({ category, collection, query, sort }),
    getProducts({ sort: "featured" }),
  ]);

  const collections = [...new Set(allProducts.map((product) => product.collection))].sort();

  return (
    <main>
      <section className="relative overflow-hidden bg-[#08111f] px-4 py-16 text-white luxury-noise sm:px-6 lg:px-8">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#0f2f78]/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#d6b25e]/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#f7dc8a]">The full shop</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">Books, music, and apparel for your next elevation.</h1>
            <p className="mt-6 text-lg leading-8 text-white/70">
              Filter by category, explore Doc Jordan&apos;s collections, and sort the catalog by price, rating, or newest arrivals.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {["All", "Books", "Music", "Clothing"].map((item) => (
              <Link
                key={item}
                href={item === "All" ? "/shop" : `/shop?category=${item}`}
                className={`rounded-full border px-5 py-3 text-sm font-bold transition ${category === item || (!category && item === "All") ? "border-[#d6b25e] bg-[#d6b25e] text-[#08111f]" : "border-white/15 bg-white/10 text-white hover:bg-white/20"}`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ShopFilters collections={collections} />

        <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a27a29]">{products.length} products</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-5xl">{category ?? "All high-vibe goods"}</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#5b6272]">
            Every demo product includes live pricing, gallery images, variant options, and customer reviews.
          </p>
        </div>

        {products.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-semibold">No products matched that frequency.</h3>
            <p className="mt-3 text-[#5b6272]">Try clearing filters or searching for books, music, hoodie, ALKAMI, or recovery.</p>
            <Link href="/shop" className="mt-6 inline-flex rounded-full bg-[#111827] px-6 py-3 text-sm font-bold text-white">Reset filters</Link>
          </div>
        )}
      </section>
    </main>
  );
}
