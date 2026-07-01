export const siteConfig = {
  name: "ameei",
  tagline: "Crunch with a little bit of spice",
  description:
    "Small-batch Indian snack mixes — roasted, spiced, and packed the way they're meant to be. Bold flavour, ancestral recipes, a little bit of mischief.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ameei.in",
  ogImage: "/images/products/hero-chivda-bowl.jpg",
  links: {
    instagram: "https://instagram.com/ameei.snacks",
    tiktok: "https://tiktok.com/@ameei.snacks",
  },
} as const;

export const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Spices", href: "/spices" },
  { label: "Heritage", href: "/heritage" },
  { label: "Journal", href: "/journal" },
] as const;

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}
