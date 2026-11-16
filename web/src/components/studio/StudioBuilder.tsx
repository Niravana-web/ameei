"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/pixel";
import { formatPrice } from "@/lib/site";
import {
  STUDIO_DEFAULT_SIZE,
  STUDIO_GROUPS,
  STUDIO_PRESETS,
  STUDIO_PRODUCT_NAME,
  STUDIO_PRODUCT_SLUG,
  STUDIO_POUCH,
  emptySelection,
  findSize,
  optionLabel,
  presetSelection,
  priceMix,
  selectedIds,
  validateMix,
  type MixSelection,
  type StudioGroup,
} from "@/lib/studio";
import { FlameIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";

const HEAT_NOTES: Record<string, string> = {
  "no-spice": "Zero chili. All crunch, no burn.",
  "medium-spice": "Warm across the tongue, gone by the next handful.",
  "extra-hot": "Handle with respect. A long burn, not a flash.",
};

function SpiceFlames({ optionId }: { optionId: string }) {
  const level = optionId === "extra-hot" ? 3 : optionId === "medium-spice" ? 2 : 0;
  if (level === 0) return null;
  return (
    <span className="flex text-crimson" aria-hidden>
      {Array.from({ length: level }, (_, i) => (
        <FlameIcon key={i} size={12} />
      ))}
    </span>
  );
}

function CheckMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

/**
 * The builder. One pouch size, so there is no size picker: a stored mix at a
 * retired size (an old share link) is coerced to the current pouch and the
 * customer sees the re-priced total.
 */
export function StudioBuilder({
  initialSelection,
  image,
}: {
  initialSelection?: MixSelection;
  image: string;
}) {
  const { add } = useCart();
  const [selection, setSelection] = useState<MixSelection>(() => {
    const base = initialSelection ?? emptySelection();
    return findSize(base.weight) ? base : { ...base, weight: STUDIO_DEFAULT_SIZE };
  });
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
  const insideLabels = useMemo(
    () =>
      STUDIO_GROUPS.filter((g) => g.countsTowardMix).flatMap((g) =>
        selectedIds(selection, g).map((id) => optionLabel(g.id, id)),
      ),
    [selection],
  );

  const pantry = STUDIO_GROUPS.filter((g) => g.mode === "multi");
  const spiceGroup = STUDIO_GROUPS.find((g) => g.id === "spice")!;
  const saltGroup = STUDIO_GROUPS.find((g) => g.id === "salt")!;

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

  function loadPreset(id: string) {
    const preset = STUDIO_PRESETS.find((p) => p.id === id);
    setAdded(false);
    setSelection(preset ? presetSelection(preset) : emptySelection());
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
      if (!res.ok) throw new Error(data.error ?? "Could not save your pouch.");

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
      track("AddToCart", {
        value: (data.unitPriceCents / 100) * qty,
        num_items: qty,
        content_type: "product",
        content_ids: [STUDIO_PRODUCT_SLUG],
        content_name: data.summary,
      });
      setAdded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your pouch.");
    } finally {
      setSaving(false);
    }
  }

  const optionButton = (active: boolean) =>
    `btn-spice flex min-h-14 w-full items-center gap-3 rounded-xl border bg-white px-4 text-left font-body text-body-md transition-colors ${
      active
        ? "border-crimson bg-[#fff1ec] font-medium text-ink shadow-[0_0_0_3px_rgba(192,22,44,0.08)]"
        : "border-ink/10 text-ink hover:border-crimson/50"
    }`;

  const segButton = (active: boolean) =>
    `btn-spice inline-flex min-h-11 items-center gap-2 rounded-full border px-4.5 font-body text-body-md transition-colors ${
      active
        ? "border-ink bg-ink text-chalk"
        : "border-ink/15 bg-white text-ink hover:border-crimson/50"
    }`;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="flex flex-col gap-10 lg:col-span-7">
        {pantry.map((group) => (
          <fieldset key={group.id}>
            <legend className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-headline-md text-ink">{group.label}</span>
              <span className="font-body text-body-md text-ash">{group.helper}</span>
            </legend>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {group.options.map((option) => {
                const active = selectedIds(selection, group).includes(option.id);
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleMulti(group, option.id)}
                      className={optionButton(active)}
                    >
                      <span
                        aria-hidden
                        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] border ${
                          active ? "border-crimson bg-crimson text-chalk" : "border-ink/25 bg-white"
                        }`}
                      >
                        {active && <CheckMark />}
                      </span>
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}

        <fieldset>
          <legend className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-headline-md text-ink">Heat</span>
            <span className="font-body text-body-md text-ash">
              Seasoning is included. Pick one rung of the ladder.
            </span>
          </legend>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {spiceGroup.options.map((option) => {
              const active = selection.spice === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pickSingle(spiceGroup, option.id)}
                  className={segButton(active)}
                >
                  <SpiceFlames optionId={option.id} />
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 font-accent text-xl text-crimson-deep">
            {HEAT_NOTES[selection.spice] ?? ""}
          </p>
        </fieldset>

        <fieldset>
          <legend className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-headline-md text-ink">Salt</span>
            <span className="font-body text-body-md text-ash">{saltGroup.helper}</span>
          </legend>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {saltGroup.options.map((option) => {
              const active = selection.salt === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pickSingle(saltGroup, option.id)}
                  className={segButton(active)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="rounded-card border border-dashed border-crimson/35 bg-white p-6">
          <p className="mb-1 font-body text-label-caps uppercase text-crimson">Shortcut</p>
          <p className="mb-4 font-body text-body-md text-ash">
            Not sure yet? Load a house recipe and change what you like.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {STUDIO_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => loadPreset(p.id)}
                className={segButton(false)}
              >
                {p.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => loadPreset("")}
              className={`${segButton(false)} border-dashed`}
            >
              Start empty
            </button>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5" aria-label="Your pouch">
        <div className="sticky top-28 flex flex-col gap-5 rounded-card border border-crimson/10 bg-white p-6 shadow-spice">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#f7e4cf]">
            <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            <span className="absolute right-3 top-3 rounded-full bg-saffron px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
              {STUDIO_POUCH.label.replace("oz", " oz")}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-headline-lg tracking-tight text-ink">Your pouch</h2>
            <span className="font-display text-headline-lg tracking-tight text-crimson">
              {formatPrice(unitPrice * qty)}
            </span>
          </div>

          <dl className="flex flex-col gap-2 font-body text-body-md text-ink/85">
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 pt-0.5 font-body text-label-caps uppercase text-ash">Inside</dt>
              <dd className="min-w-0">
                {insideLabels.length ? insideLabels.join(", ") : "Nothing yet. Pick from the pantry."}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 pt-0.5 font-body text-label-caps uppercase text-ash">Heat</dt>
              <dd>{optionLabel("spice", selection.spice)}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 pt-0.5 font-body text-label-caps uppercase text-ash">Salt</dt>
              <dd>{optionLabel("salt", selection.salt)}</dd>
            </div>
          </dl>

          <div className="h-px bg-ink/10" />

          <div className="flex items-center justify-between gap-3">
            <span className="font-body text-label-caps uppercase text-ash">Pouches</span>
            <div className="inline-flex items-center gap-3">
              <button
                type="button"
                aria-label="One fewer pouch"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-white text-ink transition-colors hover:bg-chalk active:scale-95"
              >
                <MinusIcon size={15} />
              </button>
              <span className="min-w-5 text-center font-body text-body-lg font-bold text-ink">{qty}</span>
              <button
                type="button"
                aria-label="One more pouch"
                onClick={() => setQty((q) => Math.min(12, q + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-white text-ink transition-colors hover:bg-chalk active:scale-95"
              >
                <PlusIcon size={15} />
              </button>
            </div>
          </div>

          <p className="font-body text-body-md text-ash">
            First pouch? Code <strong className="tracking-wider text-ink">FIRSTPOUCH</strong> takes 15%
            off at checkout.
          </p>

          {!check.ok && (
            <p className="rounded-lg border border-ash/25 bg-chalk px-3 py-2 font-body text-body-md text-ash">
              {check.errors[0]}
            </p>
          )}
          {error && (
            <p className="rounded-lg border border-crimson/30 bg-crimson/5 px-3 py-2 font-body text-body-md text-crimson">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!check.ok || saving}
            className={`btn-spice w-full rounded-full py-3.5 font-body text-label-caps uppercase tracking-widest text-chalk shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              added ? "bg-success" : "bg-crimson-deep hover:bg-crimson"
            }`}
          >
            {saving
              ? "Saving your pouch…"
              : added
                ? "Added to your bag ✓"
                : check.ok
                  ? `Add to bag · ${formatPrice(unitPrice * qty)}`
                  : "Pick at least one ingredient"}
          </button>

          {added && (
            <Link
              href="/cart"
              className="block text-center font-body text-body-md text-crimson-deep underline-offset-4 hover:underline"
            >
              Go to your bag →
            </Link>
          )}

          <p className="font-body text-body-md leading-relaxed text-ash/80">
            Roasted and sealed within 24 hours, shipped across the US. Your recipe is saved to your
            account for reorders. Made in a kitchen that handles peanuts and tree nuts.
          </p>
        </div>
      </aside>
    </div>
  );
}
