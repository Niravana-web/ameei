"use client";

import { useMemo, useState } from "react";
import type { Product, Category, SpiceLevel } from "@/lib/products";
import { categories } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { NoiseOverlay } from "@/components/ui/primitives";
import { FlameIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

const spiceLevels: { level: SpiceLevel; label: string }[] = [
  { level: 1, label: "Mild" },
  { level: 2, label: "Medium" },
  { level: 3, label: "Hot" },
];

/** Sidebar filters + product grid with live client-side filtering. */
export function ShopBrowser({ products }: { products: Product[] }) {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set());
  const [activeSpice, setActiveSpice] = useState<SpiceLevel | null>(null);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (activeCategories.size > 0 && !activeCategories.has(p.category)) return false;
        if (activeSpice !== null && p.spiceLevel !== activeSpice) return false;
        return true;
      }),
    [products, activeCategories, activeSpice],
  );

  function toggleCategory(id: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allActive = activeCategories.size === 0;

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* Sidebar */}
      <aside className="w-full shrink-0 md:w-56">
        <div className="relative overflow-hidden rounded-xl border border-ink/5 bg-white/70 p-5 shadow-sm backdrop-blur-xl md:sticky md:top-20">
          <NoiseOverlay />
          <div className="relative z-10">
            <h2 className="mb-4 border-b border-ink/10 pb-3 font-display text-headline-md text-crimson">
              Filters
            </h2>

            {/* Category */}
            <fieldset className="mb-6">
              <legend className="mb-3 font-body text-label-caps uppercase text-ink/70">
                Category
              </legend>
              <ul className="flex flex-col gap-2.5 font-body text-body-md">
                <li>
                  <label className="group flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={allActive}
                      onChange={() => setActiveCategories(new Set())}
                      className="h-4 w-4 rounded border-ash/40 text-crimson accent-crimson"
                    />
                    <span
                      className={`transition-colors group-hover:text-crimson ${allActive ? "font-medium text-ink" : "text-ink/80"}`}
                    >
                      All Snacks
                    </span>
                  </label>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <label className="group flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={activeCategories.has(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="h-4 w-4 rounded border-ash/40 text-crimson accent-crimson"
                      />
                      <span
                        className={`transition-colors group-hover:text-crimson ${activeCategories.has(cat.id) ? "font-medium text-ink" : "text-ink/80"}`}
                      >
                        {cat.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>

            {/* Spice level */}
            <fieldset>
              <legend className="mb-3 font-body text-label-caps uppercase text-ink/70">
                Spice Level
              </legend>
              <div className="flex flex-col gap-3">
                {spiceLevels.map(({ level, label }) => {
                  const active = activeSpice === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveSpice(active ? null : level)}
                      className={`flex items-center gap-3 rounded-lg border p-2 text-left transition-all duration-200 ${
                        active
                          ? "border-crimson/25 bg-chalk shadow-sm"
                          : "border-transparent hover:border-ink/5 hover:bg-chalk"
                      }`}
                    >
                      <span
                        className={`flex ${
                          level === 3
                            ? "text-crimson"
                            : level === 2
                              ? "text-saffron"
                              : "text-ash/60"
                        }`}
                      >
                        {Array.from({ length: level }, (_, i) => (
                          <FlameIcon key={i} size={15} />
                        ))}
                      </span>
                      <span
                        className={`font-body text-body-md ${active ? "font-bold text-ink" : "text-ink/80"}`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>
      </aside>

      {/* Grid */}
      <section aria-label="Products" className="flex-1">
        {filtered.length === 0 ? (
          <div className="animate-fade-up flex flex-col items-center gap-3 rounded-2xl border border-ink/5 bg-white/70 py-24 text-center">
            <FlameIcon size={32} className="text-crimson/40" />
            <p className="font-display text-headline-md text-ink/70">
              Nothing that spicy… yet.
            </p>
            <p className="font-body text-body-md text-ash">
              Try loosening a filter or two.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, i) => (
              <Reveal as="li" key={product.slug} delay={(i % 3) * 90}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
