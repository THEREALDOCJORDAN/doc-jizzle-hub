"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartButton, CartProvider } from "@/components/cart-provider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=Books", label: "Books" },
  { href: "/shop?category=Music", label: "Music" },
  { href: "https://curious-zabaione-3b2724.netlify.app/", label: "Clothing" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen overflow-x-hidden bg-[#fffaf0] text-[#111827]">
        <div className="bg-[#08111f] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#f6df9d]">
          Free shipping over $125 · New ALKAMI blue marble drop is live
        </div>
        <Header />
        {children}
        <BookDocSection />
        <Footer />
      </div>
    </CartProvider>
  );
}

function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08111f]/90 text-white shadow-2xl shadow-[#08111f]/20 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#f7dc8a] via-[#b78b32] to-[#0f2f78] text-lg font-black text-white shadow-lg shadow-[#d6b25e]/20 transition group-hover:scale-105">
            DJ
          </span>
          <span>
            <span className="block text-sm font-bold uppercase tracking-[0.28em] text-[#f7dc8a]">Doc Jordan&apos;s</span>
            <span className="block text-lg font-semibold leading-5">High Vibe Shop</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 lg:flex">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : item.href.startsWith("/shop") && pathname.startsWith("/shop");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-white text-[#08111f]" : "text-white/78 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="hidden rounded-full bg-[#d6b25e] px-4 py-2 text-sm font-bold text-[#08111f] shadow-lg shadow-[#d6b25e]/20 transition hover:-translate-y-0.5 hover:bg-[#f7dc8a] sm:inline-flex"
          >
            Shop now
          </Link>
          <CartButton />
        </div>
      </nav>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            conssName="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

function BookDocSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#08111f] via-[#0f2f78] to-[#08111f] px-4 py-20 text-white luxury-noise sm:px-6 lg:px-8">
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#d6b25e]/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#0f2f78]/50 blur-3xl" />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f7dc8a]">
          Speaking &amp; Guest Appearances
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Book DOC for your podcast or in person
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
          Bring high-vibration insights, recovery-informed wisdom, and transformative energy to your audience or live event.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="https://landingdocjordan.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#d6b25e] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#08111f] shadow-2xl shadow-[#d6b25e]/30 transition hover:-translate-y-1 hover:bg-[#f7dc8a]"
          >
            book DOC NOW
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#08111f] text-white">
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#0f2f78]/40 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#d6b25e]/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f7dc8a]">Doc Jordan&apos;s</p>
          <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight">Products for inner peace, creative power, and daily alignment.</h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/68">
            Explore books, music, and ALKAMI apparel for high vibrational minded people building a more intentional life.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-[#f7dc8a]">Collections</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link href="/shop?category=Books" className="hover:text-white">Inner Work Library</Link></li>
            <li><Link href="/shop?category=Music" className="hover:text-white">Sound Medicine</Link></li>
            <li><Link href="https://curious-zabaione-3b2724.netlify.app/" className="hover:text-white">ALKAMI Apparel</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-[#f7dc8a]">Store energy</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>Secure demo checkout</li>
            <li>Small batch apparel</li>
            <li>Instant music downloads</li>
            <li>Gift-ready books</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 px-4 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Doc Jordan&apos;s High Vibe Shop. Demo storefront, open for inspiration.
      </div>
    </footer>
  );
}
