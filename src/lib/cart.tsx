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
}

const STORAGE_KEY = "ameei-cart";
const lineKey = (slug: string, weight: string) => `${slug}__${weight}`;

interface CartCtx {
  items: CartLine[];
  add: (line: CartLine) => void;
  setQty: (slug: string, weight: string, qty: number) => void;
  remove: (slug: string, weight: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
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
          const k = lineKey(line.slug, line.weight);
          const existing = prev.find((p) => lineKey(p.slug, p.weight) === k);
          if (existing) {
            return prev.map((p) =>
              lineKey(p.slug, p.weight) === k
                ? { ...p, qty: Math.min(99, p.qty + line.qty) }
                : p,
            );
          }
          return [...prev, line];
        }),
      setQty: (slug, weight, qty) =>
        setItems((prev) =>
          prev.map((p) =>
            lineKey(p.slug, p.weight) === lineKey(slug, weight)
              ? { ...p, qty: Math.max(1, Math.min(99, qty)) }
              : p,
          ),
        ),
      remove: (slug, weight) =>
        setItems((prev) =>
          prev.filter((p) => lineKey(p.slug, p.weight) !== lineKey(slug, weight)),
        ),
      clear: () => setItems([]),
      count: items.reduce((n, p) => n + p.qty, 0),
      subtotal: items.reduce((n, p) => n + p.qty * p.unitPrice, 0),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
