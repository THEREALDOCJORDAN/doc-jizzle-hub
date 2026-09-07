import Link from "next/link";
import { getPrintifyProducts, normalizePrintifyProduct, getDefaultMockup } from "@/lib/printify";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // cache 1 hour

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function ClothingPage() {
  let products: ReturnType<typeof normalizePrintifyProduct>[] = [];
  let error = false;

  try {
    const raw = await getPrintifyProducts();
    products = raw.map(normalizePrintifyProduct);
  } catch (e) {
    console.error("Printify fetch error:", e);
    error = true;
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#08111f] px-4 py-20 text-white luxury-noise sm:px-6 lg:px-8">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#0f2f78]/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-[30rem] w-[30rem] rounded-full bg-[#d6b25e]/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#f7dc8a] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#d6b25e] shadow-[0_0_18px_#d6b25e]" />
            ALKAMI — Limited Capsule Collection
          </div>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            Wear the frequency. Live the shift.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Doc Jordan's ALKAMI apparel line — small-batch, print-on-demand pieces designed for movement,
            ritual, and elevated everyday living. Every item ships direct from production.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              🎨 Print-on-demand
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              📦 Ships in 3–7 days
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              ✨ Limited runs
            </span>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#a27a29]">ALKAMI Apparel</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              {error ? "Shop coming soon." : `${products.length} pieces available.`}
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-bold text-[#a27a29] underline-offset-4 hover:underline"
          >
            ← Back to full shop
          </Link>
        </div>

        {error && (
          <div className="mt-12 rounded-[2rem] border border-[#d6b25e]/30 bg-[#f3ead4] p-10 text-center">
            <p className="text-lg font-semibold">Unable to load products right now.</p>
            <p className="mt-2 text-sm text-[#5b6272]">Please check back shortly — our catalog is updating.</p>
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="mt-12 rounded-[2rem] border border-[#d6b25e]/30 bg-[#f3ead4] p-10 text-center">
            <p className="text-lg font-semibold">No products published yet.</p>
            <p className="mt-2 text-sm text-[#5b6272]">Check back soon — new drops coming.</p>
          </div>
        )}

        {!error && products.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const image = product.images[0] ?? "";
              return (
                <article
                  key={product.printifyId}
                  className="group overflow-hidden rounded-[2rem] border border-[#e8dfc8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#d6b25e]/10"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#f3ead4]">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl">👕</span>
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-[#08111f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f7dc8a]">
                      ALKAMI
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#5b6272]">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-lg font-black text-[#08111f]">
                        {product.priceCents ? `From ${formatPrice(product.priceCents)}` : "See options"}
                      </span>
                      <a
                        href={`https://docjordan.printify.me/product/${product.printifyId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#d6b25e] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#08111f] transition hover:bg-[#f7dc8a]"
                      >
                        Shop →
                      </a>
                    </div>
                    {product.variants.length > 0 && (
                      <p className="mt-2 text-xs text-[#8b95a8]">
                        {product.variants.length} option{product.variants.length !== 1 ? "s" : ""} available
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Fulfillment note */}
      <section className="bg-[#08111f] px-4 py-12 text-center text-white sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#f7dc8a]">Fulfillment</p>
        <p className="mt-3 text-sm leading-6 text-white/70">
          All ALKAMI apparel is produced on-demand and fulfilled by{" "}
          <a
            href="https://printify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d6b25e] hover:text-[#f7dc8a]"
          >
            Printify
          </a>{" "}
          — ensuring ethical, small-batch production with no excess inventory.
        </p>
      </section>
    </main>
  );
}
