import assert from "node:assert/strict";
import {
  STUDIO_SIZES,
  canonicalMixKey,
  describeMix,
  emptySelection,
  normalizeSelection,
  priceMix,
  spiceLevelOf,
  validateMix,
  type MixSelection,
} from "./studio";

/** A full, valid build used as the baseline for the pricing assertions. */
function build(over: Partial<MixSelection> = {}): MixSelection {
  return { ...emptySelection(), ...over };
}

// ── Pricing ──────────────────────────────────────────────────────────────────

// Pack size sets the price outright.
assert.equal(priceMix(build({ weight: "8oz" })), 1000);
assert.equal(priceMix(build({ weight: "16oz" })), 1800);
assert.equal(priceMix(build({ weight: "32oz" })), 3200);

// THE rule: what goes in the bag does not move the number. An empty 16oz mix and
// a maximally loaded one both cost $18.
const loaded = build({
  weight: "16oz",
  nuts: ["peanuts", "cashews", "almonds"],
  cereals: ["cornflakes", "wheat-checks", "rice-checks"],
  extras: ["raisins", "coconut-flakes", "rice-flakes", "pita-chips", "press", "pumpkin-chips"],
  spice: "extra-hot",
  salt: "some-salt",
});
assert.equal(priceMix(loaded), 1800, "a fully loaded 16oz mix is still the 16oz price");
assert.equal(
  priceMix(loaded),
  priceMix(build({ weight: "16oz", cereals: ["cornflakes"] })),
  "ingredient count must not affect price",
);

// Spice and salt are included too.
const mild = build({ weight: "16oz", nuts: ["peanuts"], spice: "no-spice", salt: "no-salt" });
const fiery = build({ weight: "16oz", nuts: ["peanuts"], spice: "extra-hot", salt: "some-salt" });
assert.equal(priceMix(mild), priceMix(fiery), "spice/salt must not affect price");

// Only the size changes it.
assert.notEqual(priceMix(build({ ...loaded, weight: "32oz" })), priceMix(loaded));

// Bigger pack is always dearer (the seed asserts this too).
const prices = STUDIO_SIZES.map((s) => priceMix(build({ weight: s.label })));
for (let i = 1; i < prices.length; i++) {
  assert.ok(prices[i] > prices[i - 1], "prices must rise with pack size");
}

// Unknown size throws — callers must validate first.
assert.throws(() => priceMix(build({ weight: "999oz" })));

// ── Validation ───────────────────────────────────────────────────────────────

// Walnuts were explicitly ruled out in the meeting. Regression guard.
assert.equal(validateMix(build({ nuts: ["walnuts"] })).ok, false, "walnuts are not offered");

// Spice/salt alone is seasoning, not a mix.
assert.equal(validateMix(build({ weight: "16oz" })).ok, false, "empty mix rejected");

// 0+ per group means a lone cereal with no nuts is perfectly legal.
assert.equal(validateMix(build({ cereals: ["cornflakes"] })).ok, true);

// Single-select groups are required.
assert.equal(validateMix(build({ nuts: ["peanuts"], spice: "" })).ok, false);
assert.equal(validateMix(build({ nuts: ["peanuts"], salt: "" })).ok, false);

// Unknown pack size is reported rather than silently re-priced at the default.
assert.equal(validateMix(build({ nuts: ["peanuts"], weight: "500g" })).ok, false);

assert.equal(validateMix(build({ nuts: ["peanuts", "cashews"] })).ok, true);

// ── Normalization ────────────────────────────────────────────────────────────

// Junk input must never throw — validateMix is what reports problems.
for (const junk of [null, undefined, 42, "peanuts", [], { nuts: "peanuts" }]) {
  assert.doesNotThrow(() => normalizeSelection(junk));
}
assert.deepEqual(normalizeSelection({ nuts: "peanuts" }).nuts, []);
assert.equal(normalizeSelection(null).weight, "");

// Unknown ids are dropped; duplicates collapse.
assert.deepEqual(
  normalizeSelection({ nuts: ["walnuts", "peanuts", "peanuts"] }).nuts,
  ["peanuts"],
);

// Order-independent and idempotent — the fingerprint depends on both.
const a = normalizeSelection({ weight: "16oz", nuts: ["cashews", "peanuts"], spice: "no-spice", salt: "no-salt" });
const b = normalizeSelection({ weight: "16oz", nuts: ["peanuts", "cashews"], spice: "no-spice", salt: "no-salt" });
assert.equal(canonicalMixKey(a), canonicalMixKey(b), "selection order must not change the key");
assert.deepEqual(normalizeSelection(a), a, "normalizeSelection must be idempotent");

// Different builds must not collide.
assert.notEqual(
  canonicalMixKey(build({ weight: "16oz", nuts: ["peanuts"] })),
  canonicalMixKey(build({ weight: "32oz", nuts: ["peanuts"] })),
);

// ── Description ──────────────────────────────────────────────────────────────

assert.equal(
  describeMix(
    build({
      nuts: ["peanuts", "cashews"],
      cereals: ["cornflakes"],
      extras: ["raisins", "pita-chips"],
      spice: "medium-spice",
      salt: "less-salt",
    }),
  ),
  "Peanuts, Cashews · Cornflakes · Raisins, Pita Chips · Medium Spice · Less Salt",
);

// Empty groups are omitted — no dangling separators.
assert.equal(
  describeMix(build({ cereals: ["cornflakes"], spice: "no-spice", salt: "no-salt" })),
  "Cornflakes · No Spice · No Salt",
);

// ── Spice level mapping (drives the shop's flame filter) ─────────────────────

assert.equal(spiceLevelOf("no-spice"), 1);
assert.equal(spiceLevelOf("medium-spice"), 2);
assert.equal(spiceLevelOf("extra-hot"), 3);

console.log("✓ studio pricing, validation, and normalization tests passed");
