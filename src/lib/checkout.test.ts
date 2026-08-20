import assert from "node:assert/strict";
import { resolveLine, resolveMixLine, priceCart, type ResolvedMix } from "./checkout";
import type { Product } from "./products";

const product: Product = {
  id: "1",
  slug: "masala-peanuts",
  name: "Masala Peanuts",
  tagline: "",
  description: "",
  weights: [
    { label: "150g", price: 9.5 },
    { label: "300g", price: 16 },
  ],
  defaultWeight: "150g",
  category: "roasted-nuts",
  spiceLevel: 3,
  image: { src: "/x.jpg", alt: "x" },
  gallery: [{ src: "/x.jpg", alt: "x" }],
  ingredients: "",
  nutrition: "",
  shipping: "",
};

// THE money path: a client-supplied price must be ignored; server price wins.
const malicious = { slug: "masala-peanuts", weight: "300g", qty: 2, unitPrice: 1 } as never;
const line = resolveLine(product, malicious);
assert.equal(line.unitPrice, 1600, "must use server price (16.00 → 1600c), not client's 1c");
assert.equal(line.qty, 2);

// qty is clamped to 1..99.
assert.equal(resolveLine(product, { slug: "x", weight: "150g", qty: 0 }).qty, 1);
assert.equal(resolveLine(product, { slug: "x", weight: "150g", qty: 9999 }).qty, 99);

// invalid weight is rejected.
assert.throws(() => resolveLine(product, { slug: "x", weight: "999g", qty: 1 }));

// unknown product in the cart is rejected.
assert.throws(() =>
  priceCart(new Map(), new Map(), [{ slug: "ghost", weight: "150g", qty: 1 }]),
);

// priceCart resolves against the catalog map.
const priced = priceCart(new Map([["masala-peanuts", product]]), new Map(), [
  { slug: "masala-peanuts", weight: "150g", qty: 3 },
]);
assert.equal(priced[0].unitPrice, 950);
assert.equal(priced[0].qty, 3);


// ── Studio custom-mix lines ──────────────────────────────────────────────────

const studioProduct: Product = { ...product, slug: "build-your-own", name: "Build Your Own Mix" };
const mix: ResolvedMix = {
  code: "AB12CD34",
  productSlug: "build-your-own",
  weight: "150g",
  summary: "Peanuts · Cornflakes · Medium Spice · Less Salt",
  unitPrice: 2550, // cents, freshly computed by the caller — not a stored snapshot
};
const mixes = new Map([[mix.code, mix]]);
const catalog = new Map([
  ["masala-peanuts", product],
  ["build-your-own", studioProduct],
]);

// THE money path, one level up: a client price is ignored for mix lines too, and
// the price comes from the resolved mix rather than the product's weights table.
const tampered = {
  slug: "build-your-own", weight: "150g", qty: 2, mixCode: "AB12CD34", unitPrice: 1,
} as never;
const mixLine = priceCart(catalog, mixes, [tampered])[0];
assert.equal(mixLine.unitPrice, 2550, "must use the server-computed mix price, not client's 1c");
assert.equal(mixLine.qty, 2);
assert.equal(mixLine.mixCode, "AB12CD34");
assert.equal(mixLine.mixSummary, mix.summary);

// Share codes are case-insensitive on the wire.
assert.equal(
  priceCart(catalog, mixes, [{ slug: "build-your-own", weight: "150g", qty: 1, mixCode: "ab12cd34" }])[0].unitPrice,
  2550,
);

// Pairing a mix code with a DIFFERENT product would let a cheap SKU carry an
// expensive build (or vice versa).
assert.throws(
  () => resolveMixLine(product, mix, { slug: "masala-peanuts", weight: "150g", qty: 1, mixCode: mix.code }),
  /does not belong/,
);

// Pairing a mix code with a DIFFERENT size would sell a 300g pack at the 150g price.
assert.throws(
  () => resolveMixLine(studioProduct, mix, { slug: "build-your-own", weight: "300g", qty: 1, mixCode: mix.code }),
  /was built for/,
);

// An unknown/retired mix code must fail closed, with a rebuild prompt.
assert.throws(
  () => priceCart(catalog, new Map(), [{ slug: "build-your-own", weight: "150g", qty: 1, mixCode: "ZZZZZZZZ" }]),
  /Rebuild it in the Studio/,
);

// A plain (non-mix) line still prices from the product's weights table.
const plain = priceCart(catalog, mixes, [{ slug: "masala-peanuts", weight: "300g", qty: 1 }])[0];
assert.equal(plain.unitPrice, 1600);
assert.equal(plain.mixCode, undefined);

console.log("✓ checkout pricing tests passed");
