import type { Product } from "@/lib/products";

/** What the client sends. Any price field here is IGNORED — the server prices it. */
export interface CheckoutItem {
  slug: string;
  weight: string;
  qty: number;
}

/** A server-priced line. unitPrice is in cents. */
export interface PricedLine {
  slug: string;
  name: string;
  weight: string;
  qty: number;
  unitPrice: number; // cents
  image: string;
}

/**
 * Price one line from the catalog product, NOT from client input.
 * Pure + DB-free so it can be unit-tested (see checkout.test.ts).
 */
export function resolveLine(product: Product, item: CheckoutItem): PricedLine {
  const w = product.weights.find((x) => x.label === item.weight);
  if (!w) {
    throw new Error(`Invalid weight "${item.weight}" for product "${product.slug}".`);
  }
  const qty = Math.max(1, Math.min(99, Math.floor(item.qty)));
  return {
    slug: product.slug,
    name: product.name,
    weight: w.label,
    qty,
    unitPrice: Math.round(w.price * 100), // server price → cents
    image: product.image.src,
  };
}

/** Resolve the whole cart against the catalog. DB lookup lives in the route handler. */
export function priceCart(
  products: Map<string, Product>,
  items: CheckoutItem[],
): PricedLine[] {
  return items.map((item) => {
    const product = products.get(item.slug);
    if (!product) throw new Error(`Unknown or unavailable product "${item.slug}".`);
    return resolveLine(product, item);
  });
}
