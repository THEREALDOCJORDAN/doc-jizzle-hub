"use client";

import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { formatMoney } from "@/components/product-card";
import type { StoreProduct } from "@/lib/types";

export function ProductGallery({ product }: { product: StoreProduct }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className="grid gap-4 lg:grid-cols-[96px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
        {product.images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`shrink-0 overflow-hidden rounded-2xl border-2 transition ${activeImage === image ? "border-[#d6b25e] shadow-lg" : "border-transparent opacity-70 hover:opacity-100"}`}
            aria-label={`View ${product.name} image ${index + 1}`}
          >
            <img src={image} alt="" className="h-20 w-20 object-cover lg:h-24 lg:w-24" />
          </button>
        ))}
      </div>
      <div className="order-1 overflow-hidden rounded-[2.5rem] border border-[#eadfca] bg-[#f7efd9] shadow-2xl shadow-[#0f2f78]/10 lg:order-2">
        <img src={activeImage} alt={product.name} className="aspect-[4/5] w-full object-cover" />
      </div>
    </div>
  );
}

export function ProductDetailActions({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-5 shadow-xl shadow-[#0f2f78]/5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a6b33]">Price</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#111827]">{formatMoney(product.priceCents)}</span>
            {product.compareAtCents ? <span className="text-sm text-[#8a6b33] line-through">{formatMoney(product.compareAtCents)}</span> : null}
          </div>
        </div>
        <span className="rounded-full bg-[#ecfdf5] px-4 py-2 text-sm font-bold text-[#047857]">{product.inventory > 20 ? "In stock" : `Only ${product.inventory} left`}</span>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a6b33]">Choose option</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setVariant(option)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                variant === option ? "border-[#111827] bg-[#111827] text-white" : "border-[#eadfca] bg-[#fffaf0] text-[#111827] hover:border-[#d6b25e]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="inline-flex w-full items-center justify-between rounded-full border border-[#eadfca] bg-[#fffaf0] p-1 sm:w-40">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white" aria-label="Decrease quantity">−</button>
          <span className="font-bold">{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white" aria-label="Increase quantity">+</button>
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
              variant,
              quantity,
            })
          }
          className="flex-1 rounded-full bg-[#111827] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-[#111827]/15 transition hover:-translate-y-0.5 hover:bg-[#0f2f78]"
        >
          Add to cart
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-[#6b7280]">Secure checkout · Ships in 2–4 business days · Instant delivery for digital music</p>
    </div>
  );
}
