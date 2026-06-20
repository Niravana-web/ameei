import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/catalog";
import { defaultPrice } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { Container, NoiseOverlay, Badge, SectionHeading } from "@/components/ui/primitives";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/** Dark "ember" section showing the three hero products. */
export async function FeaturedProducts() {
  const featured = await getFeaturedProducts();

  return (
    <section className="relative bg-ember py-14 text-chalk md:py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Our Crunchy Favourites"
              title="The Inner Circle"
              dark
            />
          </Reveal>
          <Reveal delay={150}>
            <Link
              href="/shop"
              className="group mt-6 hidden items-center gap-2 font-body text-label-caps uppercase text-blush transition-colors hover:text-amber-glow md:flex"
            >
              View All Snacks
              <ArrowRightIcon
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          </Reveal>
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal
              as="li"
              key={product.slug}
              delay={i * 120}
              className={i === 1 ? "md:translate-y-6" : ""}
            >
              <article className="group relative overflow-hidden rounded-card border border-chalk/15 bg-ember-soft/40 p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-chalk/30">
                <NoiseOverlay />
                <Link href={`/shop/${product.slug}`} className="block">
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-ember-mist/20">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.badge && (
                      <Badge tone="crimson" className="absolute left-4 top-4">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="mb-1 font-body text-body-lg font-bold">
                        {product.name}
                      </h3>
                      <p className="font-body text-body-md text-rosewood">
                        {product.tagline}
                      </p>
                    </div>
                    <span className="font-display text-lg text-amber-glow">
                      {formatPrice(defaultPrice(product))}
                    </span>
                  </div>
                </Link>
                <Link
                  href={`/shop/${product.slug}`}
                  className="btn-spice mt-4 block w-full rounded-full border border-crimson-deep py-2 text-center font-body text-label-caps uppercase text-blush transition-colors hover:bg-crimson-deep hover:text-white"
                >
                  View Product
                </Link>
              </article>
            </Reveal>
          ))}
        </ul>

        <Link
          href="/shop"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-chalk/20 py-3 font-body text-label-caps uppercase text-blush md:hidden"
        >
          View All Snacks
        </Link>
      </Container>
    </section>
  );
}
