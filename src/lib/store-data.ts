import "server-only";

import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { orders, products, reviews } from "@/db/schema";

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const clothingImages = [
  "/images/products/alkami-hoodie.png",
  "/images/products/alkami-tracksuit.png",
  "/images/products/alkami-backpack.png",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
];

const bookImages = [
  "/images/products/doc-jordan-books.png",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=85",
];

const musicImages = [
  "/images/products/frequency-reset-album.png",
  "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1461784121038-f088ca1e7714?auto=format&fit=crop&w=1200&q=85",
];

const seedProducts = [
  {
    slug: "alkami-blue-marble-hoodie",
    name: "ALKAMI Blue Marble Frequency Hoodie",
    subtitle: "A plush statement hoodie with royal-blue, ivory, and gold energetic marbling.",
    category: "Clothing",
    collection: "ALKAMI Apparel",
    format: "Unisex fleece hoodie",
    description:
      "Designed for meditation mornings, studio sessions, and elevated everyday movement, this premium hoodie wraps the body in a soft heavyweight fleece while the blue marble pattern nods to flow, clarity, and high vibrational intention.",
    priceCents: 8800,
    compareAtCents: 11800,
    inventory: 34,
    rating: 49,
    reviewCount: 38,
    images: [
      "/images/products/alkami-hoodie.png",
      "/images/products/alkami-tracksuit.png",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85",
      ...clothingImages.slice(2, 4),
    ],
    tags: ["hoodie", "alkami", "limited", "apparel"],
    highlights: ["Heavyweight brushed fleece", "Gold-tone ALKAMI chest mark", "Kangaroo pocket and lined hood", "Ethically produced in small batches"],
    variants: ["XS", "S", "M", "L", "XL", "2XL"],
    featured: true,
    bestseller: true,
  },
  {
    slug: "alkami-marble-tracksuit",
    name: "ALKAMI Royal Marble Tracksuit",
    subtitle: "A coordinated zip jacket and jogger set made for movement, manifestation, and travel.",
    category: "Clothing",
    collection: "ALKAMI Apparel",
    format: "Jacket + jogger set",
    description:
      "A head-to-toe set that carries the energetic signature of Doc Jordan's ALKAMI lifestyle line. Smooth performance knit, precision trim, and a luminous marble print make this a premium uniform for creators, healers, and seekers.",
    priceCents: 16400,
    compareAtCents: 19800,
    inventory: 18,
    rating: 50,
    reviewCount: 26,
    images: [
      "/images/products/alkami-tracksuit.png",
      "/images/products/alkami-hoodie.png",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85",
      ...clothingImages.slice(2, 4),
    ],
    tags: ["tracksuit", "travel", "alkami", "set"],
    highlights: ["Two-piece coordinated set", "Soft stretch performance knit", "Gold zipper details", "Deep pockets for daily essentials"],
    variants: ["S", "M", "L", "XL", "2XL"],
    featured: true,
    bestseller: false,
  },
  {
    slug: "change-your-vibe-change-your-life",
    name: "Change Your Vibe, Change Your Life",
    subtitle: "Doc Jordan's signature guide to emotional reset, recovery, and energetic leadership.",
    category: "Books",
    collection: "Inner Work Library",
    format: "Hardcover + digital companion",
    description:
      "Part memoir, part field guide, this book offers practical rituals, reflection prompts, and recovery-informed insight for shifting the inner climate that shapes decisions, relationships, and purpose.",
    priceCents: 2800,
    compareAtCents: 3400,
    inventory: 96,
    rating: 49,
    reviewCount: 112,
    images: [
      "/images/products/doc-jordan-books.png",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85",
      ...bookImages.slice(1, 4),
    ],
    tags: ["mindfulness", "recovery", "bestseller", "book"],
    highlights: ["34 reflection practices", "Recovery-informed language", "Includes downloadable journal pages", "Beautiful gift-ready hardcover"],
    variants: ["Hardcover", "Paperback", "Signed Hardcover"],
    featured: true,
    bestseller: true,
  },
  {
    slug: "energy-of-addiction",
    name: "The Energy of Addiction",
    subtitle: "Understanding addiction beyond shame, labels, and outdated recovery models.",
    category: "Books",
    collection: "Recovery & Renewal",
    format: "Paperback",
    description:
      "A compassionate and thought-provoking look at addiction through body, belief, energy, and environment. Doc Jordan reframes recovery as a return to wholeness while honoring clinical wisdom and lived experience.",
    priceCents: 2400,
    compareAtCents: null,
    inventory: 71,
    rating: 48,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
      ...bookImages.slice(0, 2),
    ],
    tags: ["addiction", "recovery", "healing", "book"],
    highlights: ["Accessible recovery framework", "Great for groups and facilitators", "Chapter-end integration prompts", "Trauma-aware and shame-free"],
    variants: ["Paperback", "Digital", "Facilitator Bundle"],
    featured: false,
    bestseller: true,
  },
  {
    slug: "holistic-life-activity-book",
    name: "The Holistic Life Activity Book",
    subtitle: "Creative exercises for clarity, nervous-system care, and spiritual accountability.",
    category: "Books",
    collection: "Inner Work Library",
    format: "Workbook",
    description:
      "A hands-on workbook filled with art prompts, journaling maps, breathwork check-ins, and energy audits to help readers build a grounded high-vibration practice one page at a time.",
    priceCents: 2200,
    compareAtCents: 2800,
    inventory: 120,
    rating: 47,
    reviewCount: 64,
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
      ...bookImages.slice(1, 3),
    ],
    tags: ["workbook", "journaling", "mindfulness", "book"],
    highlights: ["90+ guided activities", "Works beautifully with therapy or coaching", "Premium lay-flat pages", "Includes weekly reset templates"],
    variants: ["Workbook", "Digital Workbook", "3-Pack Circle Bundle"],
    featured: true,
    bestseller: false,
  },
  {
    slug: "frequency-reset-vol-1",
    name: "Frequency Reset Vol. 1",
    subtitle: "Meditative music, spoken affirmations, and cinematic sound beds by Doc Jordan.",
    category: "Music",
    collection: "Sound Medicine",
    format: "Digital album + lossless download",
    description:
      "A 12-track sound journey for breathwork, journaling, study, and quiet evening integration. Warm analog textures meet grounding affirmations and spacious melodic loops.",
    priceCents: 1800,
    compareAtCents: null,
    inventory: 999,
    rating: 49,
    reviewCount: 57,
    images: [
      "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
      ...musicImages.slice(1, 3),
    ],
    tags: ["music", "meditation", "affirmations", "digital"],
    highlights: ["12 high-resolution tracks", "Includes instrumental versions", "Perfect for meditation and journaling", "Instant digital delivery"],
    variants: ["Digital Album", "Digital + Instrumentals", "Gift Download"],
    featured: true,
    bestseller: true,
  },
  {
    slug: "innerpeace-challenge-audio-course",
    name: "The Innerpeace Challenge Audio Course",
    subtitle: "Seven days of guided teachings, reflective prompts, and sound-supported practice.",
    category: "Music",
    collection: "Sound Medicine",
    format: "Audio course",
    description:
      "A focused reset for busy minds. Each day includes a concise teaching, a guided innerpeace practice, and an integration cue designed to be repeated whenever life gets loud.",
    priceCents: 4400,
    compareAtCents: 5900,
    inventory: 999,
    rating: 50,
    reviewCount: 43,
    images: [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=1200&q=85",
      ...musicImages.slice(0, 2),
    ],
    tags: ["audio course", "innerpeace", "practice", "digital"],
    highlights: ["Seven guided sessions", "Daily reflection sheets", "Mobile-friendly streaming", "Designed for repeat resets"],
    variants: ["Personal Access", "Gift Access", "Group License"],
    featured: false,
    bestseller: true,
  },
  {
    slug: "alkami-marble-backpack",
    name: "ALKAMI Marble Daypack",
    subtitle: "A high-capacity backpack with gold hardware for ritual tools, laptops, and travel.",
    category: "Clothing",
    collection: "ALKAMI Accessories",
    format: "Weather-resistant daypack",
    description:
      "A functional luxury carry piece with protective laptop storage, generous pockets, and a blue-gold marble finish that brings energetic style to your commute, retreat, or weekend flight.",
    priceCents: 9600,
    compareAtCents: 12400,
    inventory: 22,
    rating: 48,
    reviewCount: 31,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["backpack", "accessory", "travel", "alkami"],
    highlights: ["Padded 16-inch laptop sleeve", "Water-resistant finish", "Gold-tone zipper pulls", "Breathable back panel"],
    variants: ["Royal Marble", "Onyx Marble"],
    featured: true,
    bestseller: false,
  },
  {
    slug: "alkami-beanie",
    name: "ALKAMI Blue Marble Beanie",
    subtitle: "A soft, artful cuff beanie for cold morning walks and late-night studio work.",
    category: "Clothing",
    collection: "ALKAMI Accessories",
    format: "Knit cuff beanie",
    description:
      "A cozy accessory designed to complete the ALKAMI look. The dimensional marble palette adds a little ceremony to everyday warmth.",
    priceCents: 3200,
    compareAtCents: null,
    inventory: 58,
    rating: 47,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=1200&q=85",
      ...clothingImages.slice(0, 1),
    ],
    tags: ["beanie", "accessory", "alkami", "gift"],
    highlights: ["Soft ribbed knit", "Fold-over cuff", "One size fits most", "Great add-on gift"],
    variants: ["Royal Marble", "Cream Marble"],
    featured: false,
    bestseller: false,
  },
  {
    slug: "how-to-start-and-operate-a-sober-living-home",
    name: "How to Start and Operate a Sober Living or Transitional Home",
    subtitle: "A practical guide to compliant recovery housing, property setup, resident operations, and sustainable growth.",
    category: "Books",
    collection: "Recovery & Renewal",
    format: "Paperback + digital companion",
    description:
      "Doc Jordan draws on firsthand recovery-housing experience and operator wisdom to walk you through every stage of launching an ethical, well-managed sober living or transitional home. Updated for 2026 — including HUD CoC funding shifts and national compliance frameworks — this is the playbook for small operators, nonprofit founders, faith-based groups, and mission-driven entrepreneurs who want to do this right. From finding the right property and navigating zoning, to building house culture, managing residents, and scaling responsibly, this book covers it all.",
    priceCents: 3200,
    compareAtCents: 3800,
    inventory: 150,
    rating: 50,
    reviewCount: 0,
    images: [
      "/images/products/doc-jordan-books.png",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85",
      ...bookImages.slice(2, 4),
    ],
    tags: ["sober living", "recovery housing", "transitional housing", "operations", "book"],
    highlights: [
      "Updated for 2026 HUD CoC policy and funding landscape",
      "14-chapter compliance-first operations framework",
      "Property strategy, lease negotiation, and due diligence checklists",
      "Resident agreements, house rules, incident forms & KPI dashboard",
      "Ethics chapter: no exploitation, no hidden fees, resident dignity first",
      "Scaling and funding pathways for growth-ready operators",
    ],
    variants: ["Paperback", "Signed Copy", "Digital", "Facilitator Bundle"],
    featured: true,
    bestseller: true,
  },
];

const reviewTemplates = [
  {
    authorName: "Maya R.",
    location: "Atlanta, GA",
    rating: 5,
    title: "Beautifully made and deeply intentional",
    body: "Everything about this purchase felt premium, from the packaging to the way the message landed. It has become part of my morning ritual.",
  },
  {
    authorName: "Julian K.",
    location: "Brooklyn, NY",
    rating: 5,
    title: "The frequency is real",
    body: "Doc Jordan's work has a grounded energy that makes personal growth feel practical. I came back for gifts after my first order.",
  },
  {
    authorName: "Tasha L.",
    location: "Oakland, CA",
    rating: 4,
    title: "Premium feel with a purpose",
    body: "The quality is excellent and the aesthetic gets compliments. I appreciate that the brand feels spiritual without being performative.",
  },
];

let hasInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function initializeStorefront() {
  if (hasInitialized) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = initializeStorefrontInternal().catch((error) => {
    initializationPromise = null;
    throw error;
  });
  await initializationPromise;
}

async function initializeStorefrontInternal() {
  await db.execute(sql`
    create table if not exists products (
      id serial primary key,
      slug varchar(160) not null unique,
      name varchar(220) not null,
      subtitle varchar(260) not null,
      category varchar(60) not null,
      collection varchar(120) not null,
      format varchar(120) not null,
      description text not null,
      price_cents integer not null,
      compare_at_cents integer,
      inventory integer not null default 25,
      rating integer not null default 50,
      review_count integer not null default 0,
      images jsonb not null,
      tags jsonb not null,
      highlights jsonb not null,
      variants jsonb not null,
      featured boolean not null default false,
      bestseller boolean not null default false,
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists reviews (
      id serial primary key,
      product_id integer not null references products(id) on delete cascade,
      author_name varchar(140) not null,
      location varchar(140) not null,
      rating integer not null,
      title varchar(180) not null,
      body text not null,
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists orders (
      id serial primary key,
      customer_name varchar(180) not null,
      email varchar(220) not null,
      address text not null,
      city varchar(140) not null,
      state varchar(80) not null,
      postal_code varchar(40) not null,
      total_cents integer not null,
      items jsonb not null,
      status varchar(60) not null default 'received',
      created_at timestamptz not null default now()
    )
  `);

  const countResult = await db.execute(sql<{ count: string }>`select count(*)::text as count from products`);
  const existingCount = Number(countResult.rows[0]?.count ?? 0);

  if (existingCount === 0) {
    const inserted = await db.insert(products).values(seedProducts).returning({ id: products.id, slug: products.slug });
    const allReviews = inserted.flatMap((product, productIndex) =>
      reviewTemplates.map((review, reviewIndex) => ({
        ...review,
        productId: product.id,
        createdAt: new Date(Date.now() - (productIndex * 5 + reviewIndex + 1) * 86_400_000),
      })),
    );
    await db.insert(reviews).values(allReviews);
  }

  hasInitialized = true;
}

export async function getProducts(options?: {
  category?: string;
  collection?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}) {
  await initializeStorefront();

  const filters = [];
  if (options?.category && options.category !== "All") filters.push(eq(products.category, options.category));
  if (options?.collection && options.collection !== "All") filters.push(eq(products.collection, options.collection));
  if (options?.minPrice) filters.push(gte(products.priceCents, options.minPrice * 100));
  if (options?.maxPrice) filters.push(lte(products.priceCents, options.maxPrice * 100));
  if (options?.query) {
    const query = `%${options.query}%`;
    filters.push(or(ilike(products.name, query), ilike(products.subtitle, query), ilike(products.description, query)));
  }

  const sort = options?.sort ?? "featured";
  const orderBy =
    sort === "price-asc"
      ? [asc(products.priceCents)]
      : sort === "price-desc"
        ? [desc(products.priceCents)]
        : sort === "rating"
          ? [desc(products.rating), desc(products.reviewCount)]
          : sort === "newest"
            ? [desc(products.createdAt)]
            : [desc(products.featured), desc(products.bestseller), desc(products.rating)];

  return db
    .select()
    .from(products)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(...orderBy);
}

export async function getFeaturedProducts(limit = 6) {
  await initializeStorefront();
  return db.select().from(products).where(eq(products.featured, true)).orderBy(desc(products.bestseller), desc(products.rating)).limit(limit);
}

export async function getProductBySlug(slug: string) {
  await initializeStorefront();
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return product ?? null;
}

export async function getProductReviews(productId: number) {
  await initializeStorefront();
  return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
}

export async function getRelatedProducts(product: Product, limit = 4) {
  await initializeStorefront();
  return db
    .select()
    .from(products)
    .where(and(eq(products.category, product.category), sql`${products.id} <> ${product.id}`))
    .orderBy(desc(products.featured), desc(products.rating))
    .limit(limit);
}

export async function getProductsByIds(ids: number[]) {
  await initializeStorefront();
  if (!ids.length) return [];
  return db.select().from(products).where(inArray(products.id, ids));
}

export async function createOrder(input: {
  customerName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  items: Array<{ productId: number; quantity: number; variant?: string }>;
}) {
  await initializeStorefront();

  const uniqueIds = [...new Set(input.items.map((item) => item.productId))];
  const foundProducts = await getProductsByIds(uniqueIds);
  const productMap = new Map(foundProducts.map((product) => [product.id, product]));

  const orderItems = input.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error("A product in your cart is no longer available.");
    const quantity = Math.max(1, Math.min(20, item.quantity));
    return {
      productId: product.id,
      name: product.name,
      quantity,
      priceCents: product.priceCents,
      variant: item.variant,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const shipping = subtotal > 12500 ? 0 : 900;
  const totalCents = Math.round(subtotal * 1.0825) + shipping;

  const [order] = await db
    .insert(orders)
    .values({
      customerName: input.customerName,
      email: input.email,
      address: input.address,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      totalCents,
      items: orderItems,
    })
    .returning();

  return order;
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export const categories = ["All", "Books", "Music", "Clothing"];
export const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to high", value: "price-asc" },
  { label: "Price: High to low", value: "price-desc" },
  { label: "Highest vibration", value: "rating" },
  { label: "Newest arrivals", value: "newest" },
];


