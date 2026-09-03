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
            {[
              { label: "All", href: "/shop" },
              { label: "Books", href: "/shop?category=Books" },
              { label: "Music", href: "/shop?category=Music" },
              { label: "Clothing", href: "https://curious-zabaione-3b2724.netlify.app/" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full border px-5 py-3 text-sm font-bold transition ${
                  category === item.label || (!category && item.label === "All")
                    ? "border-[#d6b25e] bg-[#d6b25e] text-[#08111f]"
                    : "border-white/15 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {item.label}
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
          <p className="max-w-md text-sm leading-6 textVÈÍXŒÌ—H‚ˆ]™\žH[[È›ÙXÝ[˜ÛY\È]™HšXÚ[™ËØ[\žH[XYÙ\Ë˜\šX[Ü[ÛœË[™Ý\ÝÛY\ˆ™]šY]ÜË‚ˆÜ‚ˆÙ]‚‚ˆÜ›ÙXÝË›[™ÝÈ
ˆ]ˆÛ\ÜÓ˜[YOH›]LLÜšYØ\MˆÛN™ÜšYXÛÛËLˆÎ™ÜšYXÛÛËLÈ™ÜšYXÛÛËM‚ˆÜ›ÙXÝË›X\

›ÙXÝ[™^
HOˆ›ÙXÝØ\™Ù^O^Ü›ÙXÝšYH›ÙXÝ^Ü›ÙXÝHš[Üš]O^Ú[™^HÏŠ_BˆÙ]‚ˆ
Hˆ
ˆ]ˆÛ\ÜÓ˜[YOH›]LL›Ý[™YVÌœ™[WH›Ü™\ˆ›Ü™\‹VÈÙXY˜ØWH™Ë]Ú]HLL^XÙ[\ˆÚYÝË\ÛH‚ˆÈÛ\ÜÓ˜[YOH^Lž›Û\Ù[ZX›Û“›È›ÙXÝÈX]ÚY]œ™\]Y[˜ÞKÚÏ‚ˆÛ\ÜÓ˜[YOH›]LÈ^VÈÍXŒÌ—H•žHÛX\š[™Èš[\œÈÜˆÙX\˜Ú[™È›Üˆ›ÛÚÜË]\ÚXËÛÙYKSÐSRKÜˆ™XÛÝ™\žKÜ‚ˆ[šÈ™YH‹ÜÚÜˆÛ\ÜÓ˜[YOH›]Mˆ[›[™KY›^›Ý[™YY[™ËVÈÌLLN×HMˆKLÈ^\ÛH›ÛX›Û^]Ú]H’eset filters</Link>
          </div>
        )}
      </section>
    </main>
  );
}
