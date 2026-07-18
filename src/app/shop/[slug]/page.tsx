import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getCategoryLabel, defaultPrice } from "@/lib/products";
import { siteConfig, formatPrice } from "@/lib/site";
import { Container, Badge } from "@/components/ui/primitives";
import { ChevronRightIcon, FlameIcon } from "@/components/ui/icons";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { Reveal } from "@/components/ui/Reveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ISR: pages regenerate at most every 5 min instead of SSR-ing on every request.
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  // The tagline alone ("Intense heat, deep flavor.") was too short to be a
  // useful SERP snippet — pad it with the buy-intent + price context search
  // listings need, without inventing facts not already on the page.
  const metaDescription = `Buy ${product.name} online — ${product.tagline} Small-batch, ships within 24 hours. From ${formatPrice(defaultPrice(product))}.`;

  return {
    title: product.name,
    description: metaDescription,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} | ameei`,
      description: metaDescription,
      url: `/shop/${product.slug}`,
      images: [{ url: product.gallery[0].src, alt: product.gallery[0].alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ameei`,
      description: metaDescription,
      images: [product.gallery[0].src],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug);

  // Rolling 1-year validity — re-generated on every ISR revalidation (see `revalidate` above),
  // so this never actually goes stale in practice.
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    image: product.gallery.map((g) => `${siteConfig.url}${g.src}`),
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/shop/${product.slug}`,
      priceCurrency: "USD",
      price: defaultPrice(product),
      priceValidUntil,
      availability: "https://schema.org/InStock",
      // "we do not accept returns" (perishable goods) — see product.shipping / SHIPPING_DEFAULT.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
      // shippingDetails intentionally omitted: Google expects a real shippingRate,
      // and there's no shipping-cost data in the product model to source it from —
      // add once a real rate/destination is available rather than inventing one.
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteConfig.url}/shop` },
      { "@type": "ListItem", position: 3, name: product.name },
    ],
  };

  return (
    <Container className="pb-16 pt-24 md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Gallery — ordered after details on mobile so price/CTA aren't buried below a full-screen gallery */}
        <div className="animate-fade-up order-2 lg:order-none lg:col-span-7">
          <ProductGallery images={product.gallery} />
        </div>

        {/* Details */}
        <div className="order-1 flex flex-col pt-6 lg:order-none lg:col-span-5 lg:pl-6 lg:pt-0">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="animate-fade-up mb-4 flex items-center gap-2 font-body text-label-caps uppercase text-ash"
          >
            <Link href="/shop" className="transition-colors hover:text-ink">
              Shop
            </Link>
            <ChevronRightIcon size={12} />
            <Link href="/shop" className="transition-colors hover:text-ink">
              {getCategoryLabel(product.category)}
            </Link>
            <ChevronRightIcon size={12} />
            <span aria-current="page" className="text-ink">
              {product.name}
            </span>
          </nav>

          <h1 className="animate-drop-in delay-1 mb-3 font-display text-headline-lg leading-tight text-crimson">
            {product.name}
          </h1>

          <div className="animate-fade-up delay-2 mb-3 flex items-center gap-3">
            <p className="font-display text-editorial italic text-ink">
              from {formatPrice(defaultPrice(product))}
            </p>
            <span
              className={`flex items-center gap-0.5 ${
                product.spiceLevel === 3
                  ? "text-crimson"
                  : product.spiceLevel === 2
                    ? "text-saffron"
                    : "text-ash/60"
              }`}
              aria-label={`Spice level ${product.spiceLevel} of 3`}
            >
              {Array.from({ length: product.spiceLevel }, (_, i) => (
                <FlameIcon key={i} size={15} />
              ))}
            </span>
            {product.badge && <Badge tone="saffron">{product.badge}</Badge>}
          </div>

          <p className="animate-fade-up delay-3 mb-6 font-body text-body-md leading-relaxed text-ink">
            {product.description}
          </p>

          <div className="animate-fade-up delay-4">
            <PurchasePanel product={product} />
            <ProductAccordion product={product} />
          </div>
        </div>
      </div>

      {/* Related products */}
      <section aria-labelledby="related-heading" className="mt-16 md:mt-20">
        <Reveal>
          <h2
            id="related-heading"
            className="mb-10 text-center font-display text-headline-lg text-crimson"
          >
            You might also desire
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {related.map((rel, i) => (
            <Reveal
              key={rel.slug}
              delay={i * 120}
              className={i === 1 ? "md:mt-8" : i === 2 ? "md:mt-16" : ""}
            >
              <Link
                href={`/shop/${rel.slug}`}
                className="hover-lift group relative block overflow-hidden rounded-xl border border-ink/10 bg-white p-4 shadow-sm"
              >
                {rel.badge && (
                  <Badge
                    tone={rel.badge === "NEW" ? "chalk" : "crimson"}
                    className="absolute left-4 top-4 z-10"
                  >
                    {rel.badge}
                  </Badge>
                )}
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-fog/40">
                  <Image
                    src={rel.image.src}
                    alt={rel.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="mb-1 font-display text-headline-md text-ink transition-colors group-hover:text-crimson">
                  {rel.name}
                </h3>
                <p className="font-display text-base italic text-ash">
                  from {formatPrice(defaultPrice(rel))}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </Container>
  );
}
