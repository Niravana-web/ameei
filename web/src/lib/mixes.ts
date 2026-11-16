import "server-only";
import { createHash, randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { CustomMix as Row } from "@prisma/client";
import type { ResolvedMix } from "@/lib/checkout";
import {
  STUDIO_PRICING_VERSION,
  STUDIO_PRODUCT_SLUG,
  canonicalMixKey,
  describeMix,
  normalizeSelection,
  priceMix,
  validateMix,
  type MixSelection,
} from "@/lib/studio";

/** A stored build, with the JSON column parsed. Mirrors catalog.ts's rowToProduct. */
export interface StoredMix {
  id: string;
  code: string;
  productSlug: string;
  weight: string;
  selection: MixSelection;
  summary: string;
  /** Snapshot from build time — DISPLAY ONLY. Checkout re-prices. */
  priceCents: number;
  pricingVersion: number;
  createdAt: Date;
}

export function rowToMix(row: Row): StoredMix {
  return {
    id: row.id,
    code: row.code,
    productSlug: row.productSlug,
    weight: row.weight,
    selection: normalizeSelection(JSON.parse(row.selection)),
    summary: row.summary,
    priceCents: row.priceCents,
    pricingVersion: row.pricingVersion,
    createdAt: row.createdAt,
  };
}

/**
 * Re-validate and RE-PRICE a stored build against the currently-deployed price
 * table. Deliberately ignores row.priceCents: a mix built in March must not
 * charge March prices in September, and a stored price that checkout trusts is
 * one regression away from being a money exploit.
 *
 * Throws if the stored selection no longer validates (a retired ingredient),
 * which correctly surfaces as "rebuild your mix" instead of silently selling
 * something we no longer carry.
 */
export function toResolvedMix(row: Row): ResolvedMix {
  const selection = normalizeSelection(JSON.parse(row.selection));
  const check = validateMix(selection);
  if (!check.ok) {
    throw new Error(`Custom mix "${row.code}" is no longer valid: ${check.errors.join(" ")}`);
  }
  if (selection.weight !== row.weight) {
    throw new Error(`Custom mix "${row.code}" has an inconsistent pack size.`);
  }
  return {
    code: row.code,
    productSlug: row.productSlug,
    weight: row.weight,
    summary: row.summary,
    unitPrice: priceMix(selection),
  };
}

// Crockford base32 — no I/L/O/U, which kills O/0 and 1/I confusion when someone
// reads a share code aloud, and most accidental profanity.
const CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const CODE_LENGTH = 8;

/**
 * 32^8 ≈ 1.1e12 — unguessable at any realistic request rate. randomInt is
 * CSPRNG-backed and rejection-samples internally, so there's no modulo bias.
 * Never Math.random: share codes must not be enumerable, or the /studio/CODE
 * URL leaks other people's builds.
 */
export function generateShareCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) out += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  return out;
}

export function fingerprintOf(selection: MixSelection): string {
  return createHash("sha256").update(canonicalMixKey(selection)).digest("hex");
}

export async function getMixByCode(code: string): Promise<StoredMix | undefined> {
  const row = await prisma.customMix.findUnique({ where: { code: code.toUpperCase() } });
  return row ? rowToMix(row) : undefined;
}

export async function getMixRowsByCodes(codes: string[]): Promise<Row[]> {
  if (codes.length === 0) return [];
  return prisma.customMix.findMany({
    where: { code: { in: codes.map((c) => c.toUpperCase()) } },
  });
}

/**
 * Persist a build. Identical selections collapse onto one row (and one share
 * code) via the fingerprint, so the same mix always has the same URL and a bot
 * can't grow the table past the size of the option space.
 */
export async function createMix(input: {
  selection: unknown;
  userId?: string | null;
}): Promise<StoredMix> {
  const selection = normalizeSelection(input.selection);
  const check = validateMix(selection);
  if (!check.ok) throw new Error(check.errors.join(" "));

  const fingerprint = fingerprintOf(selection);
  const existing = await prisma.customMix.findUnique({ where: { fingerprint } });
  if (existing) return rowToMix(existing);

  const data = {
    productSlug: STUDIO_PRODUCT_SLUG,
    weight: selection.weight,
    selection: JSON.stringify(selection),
    summary: describeMix(selection),
    priceCents: priceMix(selection),
    pricingVersion: STUDIO_PRICING_VERSION,
    fingerprint,
    userId: input.userId ?? null,
  };

  // Retry only on a share-code collision; a fingerprint collision means another
  // request created the identical mix first, so return theirs.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return rowToMix(
        await prisma.customMix.create({ data: { ...data, code: generateShareCode() } }),
      );
    } catch (e) {
      const target = String((e as { meta?: { target?: unknown } })?.meta?.target ?? "");
      const isUnique = (e as { code?: string })?.code === "P2002";
      if (isUnique && target.includes("fingerprint")) {
        const raced = await prisma.customMix.findUnique({ where: { fingerprint } });
        if (raced) return rowToMix(raced);
      }
      if (!isUnique || attempt === 2) throw e;
    }
  }
  throw new Error("Could not save your mix. Please try again.");
}
