"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";

/**
 * Fires the Meta Purchase event once per Stripe session. The session id is the
 * eventID, so a refresh of the confirmation page (or a later server-side event
 * with the same id) is deduplicated by Meta; sessionStorage stops the obvious
 * double fire in the same tab.
 */
export function PurchasePixel({
  sessionId,
  value,
  items,
}: {
  sessionId: string;
  value: number | null;
  items: number;
}) {
  useEffect(() => {
    if (!sessionId) return;
    const key = `ameei-purchase-${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: fire anyway, eventID still dedupes server-side */
    }
    track(
      "Purchase",
      {
        value: value ?? 0,
        num_items: items,
        content_type: "product",
        content_ids: ["build-your-own"],
        content_name: "ameei pouch",
      },
      sessionId,
    );
  }, [sessionId, value, items]);
  return null;
}
