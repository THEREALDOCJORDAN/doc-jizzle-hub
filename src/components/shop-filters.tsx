"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const categories = ["All", "Books", "Music", "Clothing"];
const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to high", value: "price-asc" },
  { label: "Price: High to low", value: "price-desc" },
  { label: "Highest vibration", value: "rating" },
  { label: "Newest arrivals", value: "newest" },
];

export function ShopFilters({ collections }: { collections: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "All") params.delete(key);
    else params.set(key, value);
    startTransition(() => router.push(`/shop?${params.toString()}`));
  }

  return (
    <div className="rounded-[2rem] border border-[#eadfca] bg-white/85 p-4 shadow-xl shadow-[#0f2f78]/5 backdrop-blur md:p-5">
      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr]">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b33]">Search</span>
          <input
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(event) => updateParam("q", event.target.value)}
            placeholder="Hoodie, recovery, music..."
            className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-[#fffaf0] px-4 py-3 text-sm outline-none transition focus:border-[#d6b25e] focus:ring-4 focus:ring-[#d6b25e]/15"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b33]">Category</span>
          <select
            value={searchParams.get("category") ?? "All"}
            onChange={(event) => updateParam("category", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-[#fffaf0] px-4 py-3 text-sm outline-none transition focus:border-[#d6b25e] focus:ring-4 focus:ring-[#d6b25e]/15"
          >
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b33]">Collection</span>
          <select
            value={searchParams.get("collection") ?? "All"}
            onChange={(event) => updateParam("collection", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-[#fffaf0] px-4 py-3 text-sm outline-none transition focus:border-[#d6b25e] focus:ring-4 focus:ring-[#d6b25e]/15"
          >
            {["All", ...collections].map((collection) => <option key={collection}>{collection}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b33]">Sort</span>
          <select
            value={searchParams.get("sort") ?? "featured"}
            onChange={(event) => updateParam("sort", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-[#fffaf0] px-4 py-3 text-sm outline-none transition focus:border-[#d6b25e] focus:ring-4 focus:ring-[#d6b25e]/15"
          >
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#6b7280]">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d6b25e]" /> Live catalog filters</span>
        <span className={`transition ${isPending ? "opacity-100" : "opacity-0"}`}>Aligning the grid...</span>
      </div>
    </div>
  );
}
