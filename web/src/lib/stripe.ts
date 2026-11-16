import Stripe from "stripe";

// Server-only. Uses the SDK's pinned API version. ponytail: no apiVersion override
// until a feature needs one.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder");
