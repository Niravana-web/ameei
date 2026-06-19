"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Clears the cart once, on mount, after a successful checkout. */
export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
