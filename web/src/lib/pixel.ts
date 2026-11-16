/**
 * Meta pixel helper (dataset "ameei", loaded in app/layout.tsx). Safe to call
 * anywhere on the client: a blocked or not-yet-loaded pixel is a no-op.
 *
 * Standard events only, so Ads Manager can optimise on them:
 *   AddToCart       — Studio "Add to bag"
 *   InitiateCheckout — cart "Checkout" click, before the Stripe redirect
 *   Purchase        — order confirmation page, once per session id
 */
type Fbq = (
  cmd: "track" | "trackCustom",
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export interface PixelParams {
  value?: number;
  currency?: string;
  num_items?: number;
  content_type?: string;
  content_ids?: string[];
  content_name?: string;
}

export function track(event: string, params: PixelParams = {}, eventID?: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    window.fbq("track", event, { currency: "USD", ...params }, eventID ? { eventID } : undefined);
  } catch {
    /* analytics must never break the store */
  }
}
