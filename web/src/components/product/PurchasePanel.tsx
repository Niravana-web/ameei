"use client";

import { useState } from "react";
import { type Product, priceFor } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { PlusIcon, MinusIcon } from "@/components/ui/icons";

/** Weight selector, quantity stepper, and add-to-cart CTA. */
export function PurchasePanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [weight, setWeight] = useState(product.defaultWeight);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = priceFor(product, weight);

  function handleAdd() {
    add({
      slug: product.slug,
      name: product.name,
      weight,
      qty,
      unitPrice,
      image: product.image.src,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <div className="mb-6 space-y-5">
        {/* Weight */}
        <div>
          <h2 className="mb-3 font-body text-label-caps uppercase text-ink">
            Select Weight
          </h2>
          <div className="flex flex-wrap gap-4">
            {product.weights.map((w) => (
              <button
                key={w.label}
                type="button"
                aria-pressed={weight === w.label}
                onClick={() => setWeight(w.label)}
                className={`btn-spice rounded-full border px-4 py-1.5 font-body text-body-md transition-all duration-200 ${
                  weight === w.label
                    ? "border-ink bg-white text-ink shadow-sm"
                    : "border-ash/30 bg-white text-ash hover:border-ink/40 hover:bg-chalk"
                }`}
              >
                {w.label} · {formatPrice(w.price)}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h2 className="mb-3 font-body text-label-caps uppercase text-ink">
            Quantity
          </h2>
          <div className="inline-flex items-center rounded-full border border-ash/30 bg-white p-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-full text-ash transition-all hover:bg-chalk hover:text-ink active:scale-90"
            >
              <MinusIcon size={15} />
            </button>
            <span
              key={qty}
              className="animate-fade-up w-10 text-center font-body text-body-md text-ink"
              style={{ animationDuration: "0.25s" }}
            >
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-full text-ash transition-all hover:bg-chalk hover:text-ink active:scale-90"
            >
              <PlusIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleAdd}
        className={`btn-spice group relative w-full overflow-hidden rounded-full py-3.5 font-body text-label-caps uppercase tracking-widest text-white shadow-lg transition-all duration-300 ${
          added ? "bg-success" : "bg-crimson hover:shadow-spice-lg"
        }`}
      >
        <span className="relative z-10">
          {added
            ? "Added to your stash ✓"
            : `Add to Cart — ${formatPrice(unitPrice * qty)}`}
        </span>
        <span className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      </button>
    </div>
  );
}
