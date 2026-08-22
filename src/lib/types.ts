export type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  collection: string;
  format: string;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  inventory: number;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  highlights: string[];
  variants: string[];
  featured: boolean;
  bestseller: boolean;
  createdAt: Date | string;
};

export type StoreReview = {
  id: number;
  productId: number;
  authorName: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date | string;
};

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  category: string;
  variant?: string;
  quantity: number;
};

export type CheckoutOrderItem = {
  productId: number;
  quantity: number;
  variant?: string;
};
