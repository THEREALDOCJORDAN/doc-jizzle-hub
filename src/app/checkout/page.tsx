"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { formatMoney } from "@/components/product-card";

type CheckoutStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; orderId: number; totalCents: number }
  | { state: "error"; message: string };

export default function CheckoutPage() {
  const { items, subtotalCents, clearCart, updateQuantity, removeItem } = useCart();
  const [status, setStatus] = useState<CheckoutStatus>({ state: "idle" });

  const shippingCents = subtotalCents > 12500 || subtotalCents === 0 ? 0 : 900;
  const taxCents = Math.round(subtotalCents * 0.0825);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const checkoutItems = useMemo(
    () => items.map((item) => ({ productId: item.productId, quantity: item.quantity, variant: item.variant })),
    [items],
  );

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    setStatus({ state: "submitting" });

    const formData = new FormData(event.currentTarget);
    const payload = {
      customerName: String(formData.get("customerName") ?? ""),
      email: String(formData.get("email") ?? ""),
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
      items: checkoutItems,
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { orderId?: number; totalCents?: number; error?: string };
    if (!response.ok || !result.orderId || typeof result.totalCents !== "number") {
      setStatus({ state: "error", message: result.error ?? "Checkout could not be completed." });
      return;
    }

    clearCart();
    setStatus({ state: "success", orderId: result.orderId, totalCents: result.totalCents });
  }

  if (status.state === "success") {
    return (
      <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <section className="rounded-[3rem] border border-[#eadfca] bg-white p-8 shadow-2xl shadow-[#0f2f78]/10 md:p-12">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#0f2f78] to-[#d6b25e] text-4xl text-white shadow-xl">✓</div>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.26em] text-[#a27a29]">Order received</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight">Your frequency is on the way.</h1>
          <p className="mt-5 text-[#5b6272]">
            Demo order #{status.orderId} was created successfully for {formatMoney(status.totalCents)}. A confirmation would be emailed in a live shop.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="rounded-full bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0f2f78]">Continue shopping</Link>
            <Link href="/" className="rounded-full border border-[#eadfca] px-6 py-3 text-sm font-bold text-[#111827] transition hover:border-[#d6b25e]">Back home</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-[#08111f] px-4 py-14 text-white luxury-noise sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#f7dc8a]">Checkout</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">A calm, focused path to purchase.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Review your high-vibe selections, enter shipping details, and place a secure demo order.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <form onSubmit={submitOrder} className="rounded-[2.5rem] border border-[#eadfca] bg-white p-6 shadow-xl shadow-[#0f2f78]/5 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#a27a29]">Step 1</p>
              <h2 className="mt-2 text-3xl font-semibold">Shipping details</h2>
            </div>
            <span className="rounded-full bg-[#ecfdf5] px-4 py-2 text-xs font-bold text-[#047857]">Secure demo</span>
          </div>

          {items.length === 0 ? (
            <div className="mt-8 rounded-[2rem] bg-[#fffaf0] p-8 text-center">
              <h3 className="text-2xl font-semibold">Your cart is empty.</h3>
              <p className="mt-3 text-[#5b6272]">Add a book, music experience, or ALKAMI piece before checking out.</p>
              <Link href="/shop" className="mt-6 inline-flex rounded-full bg-[#111827] px-6 py-3 text-sm font-bold text-white">Shop now</Link>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Field name="customerName" label="Full name" placeholder="Jordan Waters" autoComplete="name" />
                <Field name="email" label="Email" placeholder="you@example.com" autoComplete="email" type="email" />
                <label className="block md:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6b33]">Address</span>
                  <input name="address" required autoComplete="street-address" placeholder="123 Alignment Ave" className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-[#fffaf0] px-4 py-3 outline-none transition focus:border-[#d6b25e] focus:ring-4 focus:ring-[#d6b25e]/15" />
                </label>
                <Field name="city" label="City" placeholder="Atlanta" autoComplete="address-level2" />
                <Field name="state" label="State" placeholder="GA" autoComplete="address-level1" />
                <Field name="postalCode" label="Postal code" placeholder="30303" autoComplete="postal-code" />
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6b33]">Payment</span>
                  <input value="Demo payment — no card required" readOnly className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-[#f3ead4] px-4 py-3 text-[#6b7280] outline-none" />
                </label>
              </div>

              {status.state === "error" ? <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{status.message}</p> : null}

              <button
                type="submit"
                disabled={status.state === "submitting"}
                className="mt-8 w-full rounded-full bg-[#111827] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-xl shadow-[#111827]/15 transition hover:-translate-y-0.5 hover:bg-[#0f2f78] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status.state === "submitting" ? "Placing order..." : `Place order · ${formatMoney(totalCents)}`}
              </button>
            </>
          )}
        </form>

        <aside className="h-fit rounded-[2.5rem] border border-[#eadfca] bg-white p-6 shadow-xl shadow-[#0f2f78]/5 lg:sticky lg:top-32">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#a27a29]">Order summary</p>
          <h2 className="mt-2 text-3xl font-semibold">Your cart</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}:${item.variant ?? "standard"}`} className="flex gap-4 rounded-3xl bg-[#fffaf0] p-3">
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold leading-tight">{item.name}</p>
                      <p className="mt-1 text-xs text-[#8a6b33]">{item.variant}</p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.productId, item.variant)} className="text-[#8a6b33] hover:text-[#111827]" aria-label={`Remove ${item.name}`}>×</button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full bg-white p-1">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full">−</button>
                      <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full">+</button>
                    </div>
                    <p className="font-bold">{formatMoney(item.priceCents * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-[#eadfca] pt-5 text-sm text-[#4b5563]">
            <div className="flex justify-between"><span>Subtotal</span><strong>{formatMoney(subtotalCents)}</strong></div>
            <div className="flex justify-between"><span>Shipping</span><strong>{shippingCents === 0 ? "Free" : formatMoney(shippingCents)}</strong></div>
            <div className="flex justify-between"><span>Estimated tax</span><strong>{formatMoney(taxCents)}</strong></div>
            <div className="flex justify-between border-t border-[#eadfca] pt-3 text-lg text-[#111827]"><span>Total</span><strong>{formatMoney(totalCents)}</strong></div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Field({ name, label, placeholder, type = "text", autoComplete }: { name: string; label: string; placeholder: string; type?: string; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6b33]">{label}</span>
      <input name={name} required type={type} autoComplete={autoComplete} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-[#fffaf0] px-4 py-3 outline-none transition focus:border-[#d6b25e] focus:ring-4 focus:ring-[#d6b25e]/15" />
    </label>
  );
}
