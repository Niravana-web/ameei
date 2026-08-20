"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** A cart line. unitPrice is for display only — the server re-prices at checkout. */
export interface CartLine {
  slug: string;
  name: string;
  weight: string;
  qty: number;
  unitPrice: number;
  image: string;
  /** Studio builds only: the CustomMix share code. */
  mixCode?: string;
  /** Studio builds only: describeMix() output, shown under the cart row. */
  mixSummary?: string;
}

/** Everything needed to address a line. */
export type CartLineId = Pick<CartLine, "slug" | "weight" | "mixCode">;

// ponytail: bumped from "ameei-cart" when the catalog was replaced. Every cart
// saved before then points at deleted slugs, and checkout fails on the first
// unknown one with no way for the customer to recover — a key bump retires them
// all atomically instead.
const STORAGE_KEY = "ameei-cart-v2";

/**
 * Two builds of the same product at the same pack size are different lines, so
 * the mix code has to be part of the identity. Legacy lines have no mixCode and
 * key to `slug__weight__`, which is stable and can never collide with a mix.
 */
export function cartLineKey(line: CartLineId): string {
  return `${line.slug}__${line.weight}__${line.mixCode ?? ""}`;
}

/** localStorage is user-writable; never trust its shape. Drop anything malformed. */
function reviveLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry): CartLine[] => {
    if (!entry || typeof entry !== "object") return [];
    const l = entry as Record<string, unknown>;
    if (typeof l.slug !== "string" || typeof l.name !== "string") return [];
    if (typeof l.weight !== "string" || typeof l.image !== "string") return [];
    return [
      {
        slug: l.slug,
        name: l.name,
        weight: l.weight,
        image: l.image,
        qty: Math.max(1, Math.min(99, Math.floor(Number(l.qty)) || 1)),
        unitPrice: Number(l.unitPrice) || 0,
        mixCode: typeof l.mixCode === "string" ? l.mixCode : undefined,
        mixSummary: typeof l.mixSummary === "string" ? l.mixSummary : undefined,
      },
    ];
  });
}

interface CartCtx {
  items: CartLine[];
  add: (line: CartLine) => void;
  setQty: (id: CartLineId, qty: number) => void;
  remove: (id: CartLineId) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  hydrated: boolean;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(reviveLines(JSON.parse(raw)));
    } catch {
      // ponytail: corrupt/blocked storage → start empty, not crash.
    }
    setHydrated(true);
  }, []);

  // Persist on change (after initial load).
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    return {
      items,
      add: (line) =>
        setItems((prev) => {
          const k = cartLineKey(line);
          const existing = prev.find((p) => cartLineKey(p) === k);
          if (existing) {
            return prev.map((p) =>
              cartLineKey(p) === k ? { ...p, qty: Math.min(99, p.qty + line.qty) } : p,
            );
          }
          return [...prev, line];
        }),
      setQty: (id, qty) =>
        setItems((prev) =>
          prev.map((p) =>
            cartLineKey(p) === cartLineKey(id)
              ? { ...p, qty: Math.max(1, Math.min(99, qty)) }
              : p,
          ),
        ),
      remove: (id) =>
        setItems((prev) => prev.filter((p) => cartLineKey(p) !== cartLineKey(id))),
      clear: () => setItems([]),
      count: items.reduce((n, p) => n + p.qty, 0),
      subtotal: items.reduce((n, p) => n + p.qty * p.unitPrice, 0),
      hydrated,
    };
  }, [items, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
