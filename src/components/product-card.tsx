"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-provider";
import type { StoreProduct } from "@/lib/types";

type ProductCardProps = {
  product: StoreProduct;
  priority?: boolean;
};

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function StarRating({ rating, count, compact = false }: { rating: number; count?: number; compact?: boolean }) {
  const display = (rating / 10).toFixed(1);
  return (
    <div className="flex items-center gap-2 text-sm" aria-label={`${display} out of 5 stars`}>
      <div className="flex text-[#d6b25e]" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>{index < Math.round(rating / 10) ? "★" : "☆"}</span>
        ))}
      </div>
      {!compact ? <span className="font-medium text-[#5b6272]">{display}{count ? ` · ${count} reviews` : ""}</span> : null}
    </div>
  );
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const primaryVariant = product.variants[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0f2f78]/10">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-[#f7efd9]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08111f]/55 via-transparent to-transparent opacity-80" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.bestseller ? (
            <span className="rounded-full bg-[#d6b25e] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#08111f]">Bestseller</span>
          ) : null}
          {product.compareAtCents ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0f2f78]">Save {formatMoney(product.compareAtCents - product.priceCents)}</span>
          ) : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7dc8a]">{product.category}</p>
            <p className="mt-1 text-sm font-medium text-white/90">{product.collection}</p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{product.format}</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <StarRating rating={product.rating} count={product.reviewCount} compact />
          <Link href={`/products/${product.slug}`} className="mt-3 block text-xl font-semibold leading-tight text-[#111827] transition hover:text-[#0f2f78]">
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5b6272]">{product.subtitle}</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-black text-[#111827]">{formatMoney(product.priceCents)}</p>
            {product.compareAtCents ? <p className="text-xs text-[#8a6b33] line-through">{formatMoney(product.compareAtCents)}</p> : null}
          </div>
          <button
            type="button"
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                image: product.images[0],
                category: product.category,
                variant: primaryVariant,
                quantity: 1,
              })
            }
            className="rounded-full bg-[#111827] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#111827]/15 transition hover:-translate-y-0.5 hover:bg-[#0f2f78]"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
