"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "doc-jordan-store-cart-v1";

export type AddCartItemInput = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (productId: number, variant?: string) => void;
  updateQuantity: (productId: number, variant: string | undefined, quantity: number) => void;
  clearCart: () => void;
  subtotalCents: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function getLineKey(item: Pick<CartItem, "productId" | "variant">) {
  return `${item.productId}:${item.variant ?? "standard"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      setItems([]);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasLoaded, items]);

  const addItem = useCallback((item: AddCartItemInput) => {
    const quantityToAdd = Math.max(1, item.quantity ?? 1);
    setItems((current) => {
      const key = getLineKey(item);
      const existing = current.find((cartItem) => getLineKey(cartItem) === key);
      if (!existing) return [...current, { ...item, quantity: quantityToAdd }];
      return current.map((cartItem) =>
        getLineKey(cartItem) === key ? { ...cartItem, quantity: Math.min(20, cartItem.quantity + quantityToAdd) } : cartItem,
      );
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: number, variant?: string) => {
    setItems((current) => current.filter((item) => !(item.productId === productId && item.variant === variant)));
  }, []);

  const updateQuantity = useCallback((productId: number, variant: string | undefined, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((item) => !(item.productId === productId && item.variant === variant)));
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.productId === productId && item.variant === variant ? { ...item, quantity: Math.min(20, quantity) } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotalCents = useMemo(() => items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotalCents,
      itemCount,
    }),
    [items, isOpen, addItem, removeItem, updateQuantity, clearCart, subtotalCents, itemCount],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function CartButton({ className = "" }: { className?: string }) {
  const { itemCount, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className={`group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 ${className}`}
      aria-label={`Open cart with ${itemCount} items`}
    >
      <span>Cart</span>
      <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#d6b25e] px-1.5 text-xs text-[#111827]">
        {itemCount}
      </span>
    </button>
  );
}

function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotalCents, itemCount } = useCart();
  const shippingCents = subtotalCents > 12500 || subtotalCents === 0 ? 0 : 900;
  const estimatedTotal = Math.round(subtotalCents * 1.0825) + shippingCents;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label="Close cart overlay"
        onClick={closeCart}
        className={`absolute inset-0 bg-[#050816]/55 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fffaf0] shadow-[-30px_0_80px_rgba(5,8,22,0.35)] transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="border-b border-[#e7d8b4] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a27a29]">Your selection</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#111827]">Cart Aura</h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#111827] text-white transition hover:rotate-90 hover:bg-[#1e3a8a]"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#0f2f78] to-[#d6b25e] text-4xl shadow-xl">
              ✦
            </div>
            <h3 className="mt-8 text-2xl font-semibold text-[#111827]">Your cart is ready for elevation.</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#5b6272]">
              Add books, music, and ALKAMI apparel designed to support your next high-vibration chapter.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-8 rounded-full bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1e3a8a]"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <div key={getLineKey(item)} className="rounded-3xl border border-[#eadfca] bg-white p-4 shadow-sm">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/products/${item.slug}`} onClick={closeCart} className="font-semibold text-[#111827] hover:text-[#0f2f78]">
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#a27a29]">{item.category}</p>
                          {item.variant ? <p className="mt-1 text-xs text-[#5b6272]">{item.variant}</p> : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variant)}
                          className="text-lg leading-none text-[#8a6b33] transition hover:text-[#111827]"
                          aria-label={`Remove ${item.name}`}
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-[#e6d7b6] bg-[#fffaf0] p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                            className="grid h-8 w-8 place-items-center rounded-full text-[#111827] hover:bg-white"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                            className="grid h-8 w-8 place-items-center rounded-full text-[#111827] hover:bg-white"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-[#111827]">{formatMoney(item.priceCents * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e7d8b4] bg-white/70 p-6 backdrop-blur">
              <div className="space-y-3 text-sm text-[#4b5563]">
                <div className="flex justify-between"><span>Subtotal · {itemCount} items</span><strong>{formatMoney(subtotalCents)}</strong></div>
                <div className="flex justify-between"><span>Shipping</span><strong>{shippingCents === 0 ? "Free" : formatMoney(shippingCents)}</strong></div>
                <div className="flex justify-between"><span>Estimated tax</span><strong>{formatMoney(Math.round(subtotalCents * 0.0825))}</strong></div>
                <div className="flex justify-between border-t border-[#eadfca] pt-3 text-base text-[#111827]"><span>Total</span><strong>{formatMoney(estimatedTotal)}</strong></div>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-5 flex w-full items-center justify-center rounded-full bg-[#111827] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#0f2f78]"
              >
                Begin checkout
              </Link>
              <p className="mt-3 text-center text-xs text-[#6b7280]">Free shipping over $125 · Secure demo checkout</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
