import Link from "next/link";
import Image from "next/image";
import { type Product, defaultPrice } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { Badge, NoiseOverlay } from "@/components/ui/primitives";
import { PlusIcon } from "@/components/ui/icons";

/** Light glassmorphic product card used on the shop grid. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="hover-lift group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-ink/5 bg-white/70 p-3 shadow-sm backdrop-blur-xl">
      <NoiseOverlay />
      <Link
        href={`/shop/${product.slug}`}
        className="relative z-10 block aspect-square w-full overflow-hidden rounded-xl bg-chalk"
      >
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <Badge
            tone={product.badge === "NEW" ? "chalk" : "saffron"}
            className="absolute left-3 top-3"
          >
            {product.badge}
          </Badge>
        )}
      </Link>
      <div className="relative z-10 flex flex-col gap-1 px-2 pb-2">
        <h3 className="font-display text-headline-md leading-snug text-ink">
          <Link
            href={`/shop/${product.slug}`}
            className="transition-colors hover:text-crimson"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-body text-body-lg font-bold text-crimson">
            {formatPrice(defaultPrice(product))}
          </span>
          <Link
            href={`/shop/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="btn-spice flex h-8 w-8 items-center justify-center rounded-full border border-crimson bg-white text-crimson shadow-sm transition-colors hover:bg-crimson hover:text-white"
          >
            <PlusIcon size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
