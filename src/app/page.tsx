import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts, getProducts } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, allProducts] = await Promise.all([
    getFeaturedProducts(6),
    getProducts({ sort: "rating" }),
  ]);
  const productCount = allProducts.length;
  const reviewCount = allProducts.reduce((sum, product) => sum + product.reviewCount, 0);

  const collections = [
    {
      title: "Inner Work Library",
      href: "/shop?category=Books",
      description: "Books and workbooks for recovery, mindfulness, and emotional mastery.",
      image: "/images/products/doc-jordan-books.png",
      accent: "from-[#08111f]/80 to-[#0f2f78]/55",
    },
    {
      title: "Sound Medicine",
      href: "/shop?category=Music",
      description: "Meditative albums and audio courses for breathwork, journaling, and deep reset.",
      image: "/images/products/frequency-reset-album.png",
      accent: "from-[#1a1433]/80 to-[#0f2f78]/45",
    },
    {
      title: "ALKAMI Apparel",
      href: "https://curious-zabaione-3b2724.netlify.app/",
      description: "Blue marble statement pieces made for movement, ritual, and everyday elevation.",
      image: "/images/products/alkami-hoodie.png",
      accent: "from-[#061123]/80 to-[#d6b25e]/30",
    },
  ];

  return (
    <main>
      <section className="relative overflow-hidden bg-[#08111f] text-white luxury-noise">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#0f2f78]/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-[36rem] w-[36rem] rounded-full bg-[#d6b25e]/20 blur-3xl" />
        <div className="relative mx-auto grid min-h-[calc(100vh-132px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="reveal-up">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#f7dc8a] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#d6b25e] shadow-[0_0_22px_#d6b25e]" />
              Now open for elevated living
            </div>
            <h1 className="mt-7 max-w-4xl text-[clamp(3.2rem,8vw,7.8rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
              Raise your vibe. Wear the shift. Read the reset.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
              Doc Jordan&apos;s high-vibration storefront brings together transformational books, cinematic sound medicine, and ALKAMI apparel designed for seekers, creators, healers, and people choosing a cleaner frequency.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="rounded-full bg-[#d6b25e] px-7 py-4 text-center text-sm font-bock uppercase tracking-[0.18em] text-[#08111f] shadow-2xl shadow-[#d6b25e]/25 transition hover:-translate-y-1 hover:bg-[#f7dc8a]">
                Shop all products
              </Link>
              <Link href="https://curious-zabaione-3b2724.netlify.app/" className="rounded-full border border-white/20 bg-white/10 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                Explore ALKAMI
              </Link>
            </div>
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">
              {[
                [productCount, "Curated products"],
                [reviewCount, "Happy reviews"],
                ["4.9★", "Average rating"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <p className="text-2xl font-black text-[#f7dc8a]">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/55">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative reveal-up lg:justify-self-end" style={{ animationDelay: "120ms" }}>
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#d6b25e]/30 via-[#0f2f78]/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[3rem] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur">
              <img src="/images/hero-doc-jordan-store.png" alt="Doc Jordan high-vibe shop display" className="aspect-[4/5] w-full rounded-[2.4rem] object-cover" />
              <div className="absolute bottom-7 left-7 right-7 rounded-[2rem] border border-white/20 bg-[#08111f]/70 p-5 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#f7dc8a]">Featured drop</p>
                <h2 className="mt-2 text-2xl font-semibold">ALKAMI Blue Marble Capsule</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">Royal blue, ivory, and gold pieces created for aligned movement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#a27a29]">Featured collections</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Shop by energy.</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-[#5b6272]">
            Each collection is built around a different way to integrate higher consciousness into everyday life: learn it, hear it, wear it.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.title} href={collection.href} className="group relative min-h-[430px] overflow-hidden rounded-[2.5rem] bg-[#08111f] shadow-xl shadow-[#0f2f78]/10">
              <img src={collection.image} alt={collection.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-t ${collection.accent}`} />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f7dc8a]">Collection</p>
                <h3 className="mt-3 text-3xl font-semibold">{collection.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">{collection.description}</p>
                <span className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-[#08111f] transition group-hover:bg-[#d6b25e]">Enter collection</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f3ead4] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bock uppercase tracking-[0.26em] text-[#a27a29]">Open for business</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Bestsellers with a glow.</h2>
            </div>
            <Link href="/shop" className="rounded-full bg-[#111827] px-6 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0f2f78]">View the full shop</Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="marble-panel luxury-noise overflow-hidden rounded-[3rem] p-8 text-white shadow-2xl shadow-[#0f2f78]/20 md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#f7dc8a]">Doc Jordan note</p>
          <blockquote className="mt-6 text-3xl font-semibold leading-tight md:text-5xl">
            “A high vibration is not an aesthetic. It is a daily decision to choose clarity, compassion, and creative power.”
          </blockquote>
          <p className="mt-6 text-white/70">Books for the mind. Music for the nervous system. Apparel for the walk.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["Small batch apparel", "ALKAMI clothing is presented as limited-run capsule pieces with premium details and energetic design language."],
            ["Recovery-informed wisdom", "Books and tools speak to change without shame, offering practical prompts for real life."],
            ["Sound-supported rituals", "Audio products are ideal for meditation, journaling, breathwork, and creative focus."],
            ["Persistent cart", "Add products, explore more, and return later—your cart state stays with you."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[2rem] border border-[eadfca] bg-white p-6 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#111827] text-[#d6b25e]">✨</div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5b6272]">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
