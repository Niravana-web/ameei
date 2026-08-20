import type { Product } from "@/lib/products";

/** What the client sends. Any price field here is IGNORED — the server prices it. */
export interface CheckoutItem {
  slug: string;
  weight: string;
  qty: number;
  /** Studio builds only. An opaque lookup key — never a price. */
  mixCode?: string;
}

/** A server-priced line. unitPrice is in cents. */
export interface PricedLine {
  slug: string;
  name: string;
  weight: string;
  qty: number;
  unitPrice: number; // cents
  image: string;
  mixCode?: string;
  mixSummary?: string;
}

/**
 * A Studio build already loaded from the DB, re-validated, and RE-PRICED by the
 * caller against the currently-deployed studio.ts table. Building one of these is
 * the route handler's job (see lib/mixes.ts) — this module stays DB-free.
 *
 * `unitPrice` here is freshly computed, NOT the CustomMix.priceCents snapshot.
 */
export interface ResolvedMix {
  code: string;
  productSlug: string;
  weight: string;
  summary: string;
  unitPrice: number; // cents
}

export function clampQty(qty: number): number {
  return Math.max(1, Math.min(99, Math.floor(qty) || 1));
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
  return {
    slug: product.slug,
    name: product.name,
    weight: w.label,
    qty: clampQty(item.qty),
    unitPrice: Math.round(w.price * 100), // server price → cents
    image: product.image.src,
  };
}

/**
 * Price a Studio line. unitPrice comes ONLY from `mix`; every field of `item`
 * except qty is checked against `mix`/`product` and otherwise ignored.
 *
 * The two throws below are the only ways client input could touch a mix line's
 * money, so both are hard failures rather than coercions.
 */
export function resolveMixLine(
  product: Product,
  mix: ResolvedMix,
  item: CheckoutItem,
): PricedLine {
  if (mix.productSlug !== product.slug) {
    // Blocks attaching an expensive build's code to a cheaper SKU.
    throw new Error(`Custom mix "${mix.code}" does not belong to "${product.slug}".`);
  }
  if (mix.weight !== item.weight) {
    // Blocks building an 8oz mix and checking out 32oz at the 8oz price.
    throw new Error(
      `Custom mix "${mix.code}" was built for ${mix.weight}, not ${item.weight}.`,
    );
  }
  return {
    slug: product.slug,
    name: product.name,
    weight: mix.weight,
    qty: clampQty(item.qty),
    unitPrice: mix.unitPrice,
    image: product.image.src,
    mixCode: mix.code,
    mixSummary: mix.summary,
  };
}

/** Resolve the whole cart against the catalog. DB lookups live in the route handler. */
export function priceCart(
  products: Map<string, Product>,
  mixes: Map<string, ResolvedMix>,
  items: CheckoutItem[],
): PricedLine[] {
  return items.map((item) => {
    const product = products.get(item.slug);
    if (!product) throw new Error(`Unknown or unavailable product "${item.slug}".`);
    if (!item.mixCode) return resolveLine(product, item);

    const mix = mixes.get(item.mixCode.toUpperCase());
    if (!mix) {
      throw new Error(
        `Custom mix "${item.mixCode}" is no longer available. Rebuild it in the Studio.`,
      );
    }
    return resolveMixLine(product, mix, item);
  });
}
