import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailActions, ProductGallery } from "@/components/product-detail-actions";
import { ProductCard, StarRating } from "@/components/product-card";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/store-data";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found | Doc Jordan's High Vibe Shop" };
  return {
    title: `${product.name} | Doc Jordan's High Vibe Shop`,
    description: product.subtitle,
    openGraph: {
      title: product.name,
      description: product.subtitle,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [productReviews, relatedProducts] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product, 4),
  ]);

  return (
    <main>
      <section className="bg-[#08111f] px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-white/60">
          <Link href="/shop" className="hover:text-white">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-white">{product.category}</Link>
          <span>/</span>
          <span className="truncate text-[#f7dc8a]">{product.name}</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
        <ProductGallery product={product} />

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#111827] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f7dc8a]">{product.category}</span>
            {product.bestseller ? <span className="rounded-full bg-[#d6b25e] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#111827]">Bestseller</span> : null}
          </div>
          <h1 className="mt-5 text-5xl font-semibold leading-none tracking-tight md:text-7xl">{product.name}</h1>
          <p className="mt-5 text-xl leading-8 text-[#4b5563]">{product.subtitle}</p>
          <div className="mt-5"><StarRating rating={product.rating} count={product.reviewCount} /></div>
          <p className="mt-7 text-base leading-8 text-[#4b5563]">{product.description}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {product.highlights.map((highlight) => (
              <div key={highlight} className="rounded-2xl border border-[#eadfca] bg-white/70 p-4 text-sm font-medium text-[#111827] shadow-sm">
                <span className="mr-2 text-[#d6b25e]">✦</span>{highlight}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <ProductDetailActions product={product} />
          </div>
        </div>
      </section>

      <section className="bg-[#f3ead4] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Premium materials", "Every physical product is presented with gift-ready detail and high-touch visual merchandising."],
              ["Fast fulfillment", "Books and apparel ship in 2–4 business days, while digital music unlocks instantly."],
              ["Aligned support", "This demo checkout keeps the flow simple so the buying experience feels calm and intentional."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#111827] text-[#d6b25e]">✦</div>
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#5b6272]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#a27a29]">Customer reviews</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Real resonance.</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-[#5b6272]">Seeded reviews help this demo shop feel open, trusted, and ready for orders.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {productReviews.map((review) => (
            <article key={review.id} className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
              <StarRating rating={review.rating * 10} compact />
              <h3 className="mt-4 text-xl font-semibold">{review.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5b6272]">“{review.body}”</p>
              <p className="mt-5 text-sm font-bold text-[#111827]">{review.authorName}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#a27a29]">{review.location}</p>
            </article>
          ))}
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="bg-[#08111f] py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.26em] text-[#f7dc8a]">Keep exploring</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Same category, new layer.</h2>
              </div>
              <Link href={`/shop?category=${product.category}`} className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-[#08111f] transition hover:bg-[#d6b25e]">View {product.category}</Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} />)}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
