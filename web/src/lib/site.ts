export const siteConfig = {
  name: "ameei",
  tagline: "One pouch. Your recipe.",
  description:
    "ameei makes one thing: an 8 oz pouch of roasted nuts, cereals and extras, blended to your order. Pick the ingredients, set the heat and the salt, and we roast, blend and ship it to your door. Roasted, never fried. Nothing artificial.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ameei.in",
  ogImage: "/images/pouch/pouch-hero.jpg",
  links: {
    instagram: "https://instagram.com/ameei_snacks",
    tiktok: "https://tiktok.com/@ameei.snacks",
  },
} as const;

export const navLinks = [
  { label: "Studio", href: "/studio" },
  { label: "How it works", href: "/#how" },
  { label: "Journal", href: "/journal" },
] as const;

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}
