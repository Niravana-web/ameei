"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Clears the cart once, on mount, after a successful checkout. */
export function ClearCart() {
  const { clear, hydrated } = useCart();
  // Wait for hydration: the provider's load effect runs AFTER child effects on
  // mount, so clearing before hydration gets overwritten by the persisted cart.
  useEffect(() => {
    if (hydrated) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  return null;
}
