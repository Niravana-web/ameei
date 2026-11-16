/**
 * Studio (build-your-own mix) option catalog, price table, and pure helpers.
 *
 * NO database access and NO node:crypto here — this module is imported by the
 * client builder UI, by the server checkout path, and by prisma/seed.ts. DB reads
 * live in `lib/mixes.ts` (server-only), mirroring the products.ts / catalog.ts split.
 *
 * All money in this file is INTEGER CENTS. Product.weights[].price is dollars, so
 * the seed divides by 100 at the boundary — see prisma/seed.ts.
 */

/** The Product row a custom build attaches to. Must exist and be published. */
export const STUDIO_PRODUCT_SLUG = "build-your-own";
export const STUDIO_PRODUCT_NAME = "Build Your Own Mix";

/**
 * Bump whenever STUDIO_SIZES changes. Stored on each CustomMix so a shared build
 * can warn that prices moved since it was created.
 *
 * v2: dropped per-ingredient add-on pricing — a mix is now one price per pack
 * size, whatever you put in it.
 */
export const STUDIO_PRICING_VERSION = 2;

export type StudioGroupId = "nuts" | "cereals" | "extras" | "spice" | "salt";

export interface StudioOption {
  /** Stable id — this is what lands in the DB. Never rename; retire instead. */
  id: string;
  /** Display only. Safe to change without touching stored data. */
  label: string;
}

export interface StudioGroup {
  id: StudioGroupId;
  label: string;
  helper: string;
  mode: "multi" | "single";
  /**
   * True for nuts/cereals/extras. At least one option across these groups is
   * required — spice and salt alone are seasonings, not a mix.
   */
  countsTowardMix: boolean;
  options: readonly StudioOption[];
}

export interface StudioSize {
  /** Must match a Product.weights[].label exactly. */
  label: string;
  /** The whole price of a mix at this size. Ingredients don't change it. */
  priceCents: number;
}

/** Exactly what CustomMix.selection parses to, plus the pack size. */
export interface MixSelection {
  weight: string;
  nuts: string[];
  cereals: string[];
  extras: string[];
  spice: string;
  salt: string;
}

export interface MixValidation {
  ok: boolean;
  errors: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Tables
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pack size is the ONLY thing that sets the price. Every ingredient, spice level
 * and salt level is included — a fully loaded 16oz bag and a plain one both cost
 * the same. Keep this list ordered smallest-first; the seed's monotonic-pricing
 * check relies on it.
 */
export const STUDIO_SIZES: readonly StudioSize[] = [
  { label: "8oz", priceCents: 1000 },
  { label: "16oz", priceCents: 1800 },
  { label: "32oz", priceCents: 3200 },
];

export const STUDIO_DEFAULT_SIZE = "16oz";

export const STUDIO_GROUPS: readonly StudioGroup[] = [
  {
    id: "nuts",
    label: "Nuts",
    helper: "Pick as many as you like.",
    mode: "multi",
    countsTowardMix: true,
    options: [
      { id: "peanuts", label: "Peanuts" },
      { id: "cashews", label: "Cashews" },
      { id: "almonds", label: "Almonds" },
    ],
  },
  {
    id: "cereals",
    label: "Cereals",
    helper: "The crunch underneath it all.",
    mode: "multi",
    countsTowardMix: true,
    options: [
      { id: "cornflakes", label: "Cornflakes" },
      { id: "wheat-checks", label: "Wheat Checks" },
      { id: "rice-checks", label: "Rice Checks" },
    ],
  },
  {
    id: "extras",
    label: "Extras",
    helper: "Where it gets interesting.",
    mode: "multi",
    countsTowardMix: true,
    options: [
      { id: "raisins", label: "Raisins" },
      { id: "coconut-flakes", label: "Coconut Flakes" },
      { id: "rice-flakes", label: "Rice Flakes" },
      { id: "pita-chips", label: "Pita Chips" },
      // ponytail: "press" came through verbatim from the meeting notes and is
      // almost certainly a transcript artifact (pretzels?). Shipping as-is until
      // someone confirms the real ingredient — the id is what's stored, so a
      // relabel later is free, but an id change would orphan existing mixes.
      { id: "press", label: "Press" },
      { id: "pumpkin-chips", label: "Pumpkin Chips" },
    ],
  },
  {
    id: "spice",
    label: "Spice Level",
    helper: "Seasoning is included — pick one.",
    mode: "single",
    countsTowardMix: false,
    options: [
      { id: "no-spice", label: "No Spice" },
      { id: "medium-spice", label: "Medium Spice" },
      { id: "extra-hot", label: "Extra Hot" },
    ],
  },
  {
    id: "salt",
    label: "Salt",
    helper: "Most people stop at less salt.",
    mode: "single",
    countsTowardMix: false,
    options: [
      { id: "no-salt", label: "No Salt" },
      { id: "less-salt", label: "Less Salt" },
      { id: "some-salt", label: "Some Salt" },
    ],
  },
];

/** Groups whose selections constitute "the mix" for the not-empty rule. */
export const MIX_GROUP_IDS: readonly StudioGroupId[] = ["nuts", "cereals", "extras"];

// ─────────────────────────────────────────────────────────────────────────────
// Lookups
// ─────────────────────────────────────────────────────────────────────────────

export function findGroup(id: StudioGroupId): StudioGroup {
  const g = STUDIO_GROUPS.find((x) => x.id === id);
  if (!g) throw new Error(`Unknown studio group "${id}".`);
  return g;
}

export function findOption(
  groupId: StudioGroupId,
  optionId: string,
): StudioOption | undefined {
  return findGroup(groupId).options.find((o) => o.id === optionId);
}

export function findSize(label: string): StudioSize | undefined {
  return STUDIO_SIZES.find((s) => s.label === label);
}

export function optionLabel(groupId: StudioGroupId, optionId: string): string {
  return findOption(groupId, optionId)?.label ?? optionId;
}

/** The ids selected in one group, as an array (single-select yields 0 or 1). */
export function selectedIds(selection: MixSelection, group: StudioGroup): string[] {
  if (group.mode === "single") {
    const v = selection[group.id as "spice" | "salt"];
    return v ? [v] : [];
  }
  return selection[group.id as "nuts" | "cereals" | "extras"] ?? [];
}

/** A blank build: no components, first spice/salt option, default size. */
export function emptySelection(weight: string = STUDIO_DEFAULT_SIZE): MixSelection {
  return {
    weight,
    nuts: [],
    cereals: [],
    extras: [],
    spice: findGroup("spice").options[0].id,
    salt: findGroup("salt").options[0].id,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalize / validate
// ─────────────────────────────────────────────────────────────────────────────

/** Drop unknown ids, dedupe, and sort into catalog order. */
function cleanMulti(raw: unknown, group: StudioGroup): string[] {
  if (!Array.isArray(raw)) return [];
  const known = new Set(group.options.map((o) => o.id));
  const picked = new Set<string>();
  for (const v of raw) if (typeof v === "string" && known.has(v)) picked.add(v);
  // Catalog order, not alphabetical — canonicalMixKey depends on this being stable.
  return group.options.filter((o) => picked.has(o.id)).map((o) => o.id);
}

function cleanSingle(raw: unknown, group: StudioGroup): string {
  if (typeof raw !== "string") return "";
  return group.options.some((o) => o.id === raw) ? raw : "";
}

/**
 * Coerce arbitrary (client) input into a canonical MixSelection. Never throws —
 * `validateMix` is what reports problems. Note this DROPS unknown option ids
 * rather than rejecting, so a request naming an ingredient we don't carry simply
 * doesn't get it; `validateMix` independently re-checks ids so a caller that
 * skips normalization can't sneak one through.
 */
export function normalizeSelection(input: unknown): MixSelection {
  const raw = (input ?? {}) as Record<string, unknown>;
  const obj = typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  return {
    // Kept verbatim (not defaulted) so an unknown size surfaces as a validation
    // error instead of silently re-pricing at the default pack size.
    weight: typeof obj.weight === "string" ? obj.weight.trim() : "",
    nuts: cleanMulti(obj.nuts, findGroup("nuts")),
    cereals: cleanMulti(obj.cereals, findGroup("cereals")),
    extras: cleanMulti(obj.extras, findGroup("extras")),
    spice: cleanSingle(obj.spice, findGroup("spice")),
    salt: cleanSingle(obj.salt, findGroup("salt")),
  };
}

export function validateMix(selection: MixSelection): MixValidation {
  const errors: string[] = [];

  if (!findSize(selection.weight)) {
    errors.push(`Pick a pack size (${STUDIO_SIZES.map((s) => s.label).join(", ")}).`);
  }

  let components = 0;
  for (const group of STUDIO_GROUPS) {
    const ids = selectedIds(selection, group);

    if (group.mode === "single") {
      if (ids.length !== 1) errors.push(`Choose a ${group.label.toLowerCase()}.`);
    } else if (new Set(ids).size !== ids.length) {
      errors.push(`Duplicate ${group.label.toLowerCase()} selected.`);
    }

    for (const id of ids) {
      if (!findOption(group.id, id)) {
        errors.push(`We don't carry "${id}" in ${group.label}.`);
      }
    }
    if (group.countsTowardMix) components += ids.length;
  }

  if (components === 0) {
    errors.push("Add at least one nut, cereal, or extra to your mix.");
  }

  return { ok: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing / description
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Price a build in INTEGER CENTS. Pack size is the whole story — what you put in
 * the bag doesn't move the number. Throws on an unknown size; call validateMix
 * first.
 *
 * Kept as a function of the whole selection rather than just the size label so
 * callers (and the seed) don't have to change if pricing ever gets more nuanced
 * again, and so there stays exactly one place that decides what a mix costs.
 */
export function priceMix(selection: MixSelection): number {
  const size = findSize(selection.weight);
  if (!size) throw new Error(`Unknown pack size "${selection.weight}".`);
  return size.priceCents;
}

/** Cents → dollars, ready for formatPrice() from lib/site.ts. */
export function mixPriceUsd(selection: MixSelection): number {
  return priceMix(selection) / 100;
}

/**
 * Human summary, e.g.
 * "Peanuts, Cashews · Cornflakes · Raisins, Pita Chips · Medium Spice · Less Salt"
 * Empty groups are omitted so there are no dangling separators.
 */
export function describeMix(selection: MixSelection): string {
  return STUDIO_GROUPS.map((group) =>
    selectedIds(selection, group)
      .map((id) => optionLabel(group.id, id))
      .join(", "),
  )
    .filter(Boolean)
    .join(" · ");
}

/**
 * Canonical, stable string for a NORMALIZED selection. The server sha256s this
 * into CustomMix.fingerprint so identical builds collapse to one row and one
 * share code. Kept as a string (not a hash) to keep this module client-safe.
 */
export function canonicalMixKey(selection: MixSelection): string {
  const s = normalizeSelection(selection);
  return [
    STUDIO_PRODUCT_SLUG,
    s.weight,
    `nuts:${s.nuts.join(",")}`,
    `cereals:${s.cereals.join(",")}`,
    `extras:${s.extras.join(",")}`,
    `spice:${s.spice}`,
    `salt:${s.salt}`,
  ].join("|");
}

/** Spice option id → the Product.spiceLevel (1|2|3) the shop filter uses. */
export function spiceLevelOf(spiceId: string): 1 | 2 | 3 {
  if (spiceId === "extra-hot") return 3;
  if (spiceId === "medium-spice") return 2;
  return 1;
}
