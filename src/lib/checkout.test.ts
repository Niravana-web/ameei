import assert from "node:assert/strict";
import { resolveLine, priceCart } from "./checkout";
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
  priceCart(new Map(), [{ slug: "ghost", weight: "150g", qty: 1 }]),
);

// priceCart resolves against the catalog map.
const priced = priceCart(new Map([["masala-peanuts", product]]), [
  { slug: "masala-peanuts", weight: "150g", qty: 3 },
]);
assert.equal(priced[0].unitPrice, 950);
assert.equal(priced[0].qty, 3);

console.log("✓ checkout pricing tests passed");
