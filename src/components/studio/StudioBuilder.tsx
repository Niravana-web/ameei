"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import {
  STUDIO_GROUPS,
  STUDIO_PRODUCT_NAME,
  STUDIO_PRODUCT_SLUG,
  STUDIO_SIZES,
  describeMix,
  emptySelection,
  findSize,
  priceMix,
  selectedIds,
  validateMix,
  type MixSelection,
  type StudioGroup,
} from "@/lib/studio";
import { FlameIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";

/** Flame count + colour ramp, matching the shop's spice filter. */
function SpiceFlames({ optionId }: { optionId: string }) {
  const level = optionId === "extra-hot" ? 3 : optionId === "medium-spice" ? 2 : 0;
  if (level === 0) return null;
  return (
    <span className={`flex ${level === 3 ? "text-crimson" : "text-saffron"}`}>
      {Array.from({ length: level }, (_, i) => (
        <FlameIcon key={i} size={13} />
      ))}
    </span>
  );
}

export function StudioBuilder({
  initialSelection,
  image,
}: {
  initialSelection?: MixSelection;
  image: string;
}) {
  const { add } = useCart();
  const [selection, setSelection] = useState<MixSelection>(
    initialSelection ?? emptySelection(),
  );
  const [qty, setQty] = useState(1);
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useMemo(() => validateMix(selection), [selection]);
  // Priced client-side for instant feedback only — /api/studio/mix returns the
  // authoritative figure, and checkout re-prices again from the DB.
  const unitPrice = useMemo(
    () => (findSize(selection.weight) ? priceMix(selection) / 100 : 0),
    [selection],
  );
  const summary = useMemo(() => describeMix(selection), [selection]);

  function toggleMulti(group: StudioGroup, optionId: string) {
    setAdded(false);
    setSelection((prev) => {
      const key = group.id as "nuts" | "cereals" | "extras";
      const next = new Set(prev[key]);
      if (next.has(optionId)) next.delete(optionId);
      else next.add(optionId);
      // Keep catalog order so the summary text stays stable as you toggle.
      return { ...prev, [key]: group.options.filter((o) => next.has(o.id)).map((o) => o.id) };
    });
  }

  function pickSingle(group: StudioGroup, optionId: string) {
    setAdded(false);
    setSelection((prev) => ({ ...prev, [group.id as "spice" | "salt"]: optionId }));
  }

  async function handleAdd() {
    if (!check.ok || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/mix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selection }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save your mix.");

      // Build the line from the SERVER's response, so even the displayed price
      // is server-derived rather than trusted from this component's state.
      add({
        slug: STUDIO_PRODUCT_SLUG,
        name: data.name ?? STUDIO_PRODUCT_NAME,
        weight: data.weight,
        qty,
        unitPrice: data.unitPriceCents / 100,
        image,
        mixCode: data.code,
        mixSummary: data.summary,
      });
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your mix.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Controls — first on mobile so the mix isn't buried under the summary. */}
      <div className="lg:col-span-7">
        {/* Pack size */}
        <fieldset className="mb-8">
          <legend className="mb-3 font-body text-label-caps uppercase text-ink">
            Pack Size
          </legend>
          <div className="flex flex-wrap gap-3">
            {STUDIO_SIZES.map((size) => {
              const active = selection.weight === size.label;
              return (
                <button
                  key={size.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setAdded(false);
                    setSelection((prev) => ({ ...prev, weight: size.label }));
                  }}
                  className={`btn-spice rounded-full border px-4 py-1.5 font-body text-body-md transition-all duration-200 ${
                    active
                      ? "border-ink bg-white text-ink shadow-sm"
                      : "border-ash/30 bg-white text-ash hover:border-ink/40 hover:bg-chalk"
                  }`}
                >
                  {size.label} · {formatPrice(size.priceCents / 100)}
                </button>
              );
            })}
          </div>
        </fieldset>

        {STUDIO_GROUPS.map((group, gi) => (
          <fieldset key={group.id} className="mb-8 animate-fade-up" style={{ animationDelay: `${gi * 60}ms` }}>
            <legend className="font-body text-label-caps uppercase text-ink">
              {group.label}
            </legend>
            <p className="mb-3 font-body text-body-md text-ash">{group.helper}</p>

            {group.mode === "multi" ? (
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {group.options.map((option) => {
                  const active = selectedIds(selection, group).includes(option.id);
                  return (
                    <li key={option.id}>
                      <label
                        className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                          active
                            ? "border-crimson/25 bg-white shadow-sm"
                            : "border-ink/5 bg-white/60 hover:border-ink/15 hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleMulti(group, option.id)}
                          className="h-4 w-4 rounded border-ash/40 text-crimson accent-crimson"
                        />
                        <span
                          className={`flex-1 font-body text-body-md transition-colors ${
                            active ? "font-medium text-ink" : "text-ink/80 group-hover:text-crimson"
                          }`}
                        >
                          {option.label}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-wrap gap-3">
                {group.options.map((option) => {
                  const active = selectedIds(selection, group).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => pickSingle(group, option.id)}
                      className={`btn-spice flex items-center gap-2 rounded-full border px-4 py-1.5 font-body text-body-md transition-all duration-200 ${
                        active
                          ? "border-ink bg-white text-ink shadow-sm"
                          : "border-ash/30 bg-white text-ash hover:border-ink/40 hover:bg-chalk"
                      }`}
                    >
                      {group.id === "spice" && <SpiceFlames optionId={option.id} />}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
        ))}
      </div>

      {/* Summary + CTA */}
      <aside className="lg:col-span-5">
        <div className="sticky top-28 overflow-hidden rounded-[1.5rem] border border-crimson/10 bg-white/70 p-6 shadow-spice backdrop-blur-xl">
          <h2 className="font-display text-headline-lg tracking-tight text-ink">
            Your mix
          </h2>

          <p className="mt-3 min-h-[3rem] font-body text-body-md leading-relaxed text-ash">
            {summary || "Nothing picked yet — start with a nut or a cereal."}
          </p>

          <div className="mt-5 flex items-baseline justify-between border-t border-ink/10 pt-5">
            <span className="font-body text-label-caps uppercase text-ash">
              {selection.weight || "—"}
            </span>
            <span className="font-display text-headline-lg text-crimson">
              {formatPrice(unitPrice)}
            </span>
          </div>

          {/* Quantity */}
          <div className="mt-5">
            <h3 className="mb-2 font-body text-label-caps uppercase text-ink">Quantity</h3>
            <div className="inline-flex items-center rounded-full border border-ash/30 bg-white p-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ash transition-all hover:bg-chalk hover:text-ink active:scale-90"
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
                className="flex h-10 w-10 items-center justify-center rounded-full text-ash transition-all hover:bg-chalk hover:text-ink active:scale-90"
              >
                <PlusIcon size={15} />
              </button>
            </div>
          </div>

          {!check.ok && (
            <p className="mt-5 rounded-lg border border-ash/25 bg-chalk px-3 py-2 font-body text-body-md text-ash">
              {check.errors[0]}
            </p>
          )}
          {error && (
            <p className="mt-5 rounded-lg border border-crimson/30 bg-crimson/5 px-3 py-2 font-body text-body-md text-crimson">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!check.ok || saving}
            className={`btn-spice group relative mt-5 w-full overflow-hidden rounded-full py-3.5 font-body text-label-caps uppercase tracking-widest text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              added ? "bg-success" : "bg-crimson hover:shadow-spice-lg"
            }`}
          >
            <span className="relative z-10">
              {saving
                ? "Saving your mix…"
                : added
                  ? "Added to your stash ✓"
                  : `Add to Cart — ${formatPrice(unitPrice * qty)}`}
            </span>
            <span className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
          </button>

          {added && (
            <Link
              href="/cart"
              className="mt-3 block text-center font-body text-body-md text-ash underline-offset-4 hover:text-crimson hover:underline"
            >
              Go to your bag
            </Link>
          )}

          <p className="mt-4 font-body text-body-md leading-relaxed text-ash/80">
            One price per pack size — every ingredient, spice level and salt level is
            included. Blended to order and shipped within 24 hours.
          </p>
        </div>
      </aside>
    </div>
  );
}
