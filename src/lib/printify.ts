import "server-only";

const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY!;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID!;
const BASE_URL = "https://api.printify.com/v1";

function headers() {
  return {
    Authorization: `Bearer ${PRINTIFY_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export interface PrintifyVariant {
  id: number;
  title: string;
  options: Record<string, string>;
  price: number;
  is_enabled: boolean;
  is_available: boolean;
  sku: string;
}

export interface PrintifyMockup {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  variants: PrintifyVariant[];
  images: PrintifyMockup[];
  visible: boolean;
  blueprint_id: number;
  print_provider_id: number;
  created_at: string;
  updated_at: string;
}

export interface PrintifyOrderLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
}

export interface PrintifyAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface PrintifyOrderPayload {
  external_id: string;
  label?: string;
  line_items: PrintifyOrderLineItem[];
  shipping_method: number;
  send_shipping_notification: boolean;
  address_to: PrintifyAddress;
}

async function printifyFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers(), ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Printify API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function getPrintifyProducts(): Promise<PrintifyProduct[]> {
  const allProducts: PrintifyProduct[] = [];
  let page = 1;
  while (true) {
    const data = await printifyFetch<{ data: PrintifyProduct[]; last_page: number }>(
      `/shops/${PRINTIFY_SHOP_ID}/products.json?limit=20&page=${page}`
    );
    allProducts.push(...data.data.filter((p) => p.visible));
    if (page >= data.last_page) break;
    page++;
  }
  return allProducts;
}

export async function getPrintifyProduct(productId: string): Promise<PrintifyProduct> {
  return printifyFetch<PrintifyProduct>(`/shops/${PRINTIFY_SHOP_ID}/products/${productId}.json`);
}

export async function submitPrintifyOrder(payload: PrintifyOrderPayload) {
  return printifyFetch(`/shops/${PRINTIFY_SHOP_ID}/orders.json`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getDefaultMockup(product: PrintifyProduct): string {
  const defaultImage = product.images.find((img) => img.is_default);
  return defaultImage?.src ?? product.images[0]?.src ?? "";
}

export function getMockupImages(product: PrintifyProduct): string[] {
  return product.images.map((img) => img.src).filter(Boolean);
}

export function getVariantLabel(variant: PrintifyVariant): string {
  return Object.values(variant.options).join(" / ");
}

export function getAvailableVariants(product: PrintifyProduct) {
  return product.variants.filter((v) => v.is_enabled && v.is_available);
}

export function getMinPrice(product: PrintifyProduct): number {
  const variants = getAvailableVariants(product);
  if (!variants.length) return 0;
  return Math.min(...variants.map((v) => v.price));
}

export function normalizePrintifyProduct(p: PrintifyProduct) {
  const variants = getAvailableVariants(p);
  const images = getMockupImages(p);
  const minPrice = getMinPrice(p);
  return {
    printifyId: p.id,
    name: p.title,
    description: p.description.replace(/<[^>]*>/g, ""),
    images,
    tags: p.tags,
    variants: variants.map((v) => ({
      id: v.id,
      label: getVariantLabel(v),
      price: v.price,
      sku: v.sku,
    })),
    priceCents: minPrice,
    slug: p.id,
  };
}
