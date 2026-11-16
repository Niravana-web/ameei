/**
 * Product types, constants, and pure helpers. NO database access here — this module is
 * safe to import from client components. DB reads live in `lib/catalog.ts` (server-only).
 */

export type SpiceLevel = 1 | 2 | 3;
export type Category = "savory-mixes" | "roasted-nuts" | "spice-blends";
export type Badge = "BESTSELLER" | "NEW";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Weight {
  label: string; // "300g"
  price: number; // USD for this weight
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  weights: Weight[];
  defaultWeight: string; // must match a weights[].label
  category: Category;
  spiceLevel: SpiceLevel;
  badge?: Badge;
  image: ProductImage; // primary card image
  gallery: ProductImage[]; // detail gallery (first = main)
  ingredients: string;
  nutrition: string;
  shipping: string;
}

export const categories: { id: Category; label: string }[] = [
  { id: "savory-mixes", label: "Savory Mixes" },
  { id: "roasted-nuts", label: "Roasted Nuts" },
  { id: "spice-blends", label: "Spice Blends" },
];

export function getCategoryLabel(id: Category | string): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

/** Price for a specific weight label, falling back to the default/first weight. */
export function priceFor(product: Product, weightLabel?: string): number {
  const w =
    product.weights.find((x) => x.label === weightLabel) ??
    product.weights.find((x) => x.label === product.defaultWeight) ??
    product.weights[0];
  return w?.price ?? 0;
}

/** Headline price shown on cards/listings (the default weight). */
export function defaultPrice(product: Product): number {
  return priceFor(product, product.defaultWeight);
}
