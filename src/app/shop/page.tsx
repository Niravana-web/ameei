import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { siteConfig, formatPrice } from "@/lib/site";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { Container, NoiseOverlay } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Shop All Snacks",
  description:
    "Browse the full range of ameei small-batch Indian snack mixes, roasted nuts, and spice blends. Bold flavour, honest ingredients, a little bit of spice.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop All Snacks | ameei",
    description:
      "Browse the full range of ameei small-batch Indian snack mixes, roasted nuts, and spice blends.",
    url: "/shop",
  },
};

export default function ShopPage() {
  const products = getAllProducts();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ameei — All Snacks",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/shop/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div className="relative">
      {/* Ambient warm glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] h-[60%] w-[60%] rounded-full bg-crimson-bright opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-amber-glow opacity-10 blur-[100px]" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Container className="relative z-10 pb-16 pt-24 md:pt-28">
        {/* Page header panel */}
        <div className="animate-fade-up relative mb-8 flex min-h-[120px] flex-col justify-center overflow-hidden rounded-[1.5rem] border border-crimson/10 bg-white/70 p-6 shadow-spice backdrop-blur-xl md:p-8">
          <NoiseOverlay />
          <div className="relative z-10 max-w-2xl">
            <h1 className="animate-drop-in mb-2 font-display text-headline-lg leading-tight text-crimson">
              Shop Our Snacks
            </h1>
            <p className="animate-fade-up delay-2 font-display text-editorial italic text-ink/80">
              Ancestral crunches with uncompromising spice blends. From{" "}
              {formatPrice(8.5)}.
            </p>
          </div>
        </div>

        <ShopBrowser products={products} />
      </Container>
    </div>
  );
}
