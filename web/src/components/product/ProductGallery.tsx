"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/products";
import { NoiseOverlay } from "@/components/ui/primitives";

/** Bento gallery: large main image with selectable thumbnails. */
export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-ink/10 bg-fog/40 md:aspect-[4/3]">
        <Image
          key={main.src}
          src={main.src}
          alt={main.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="animate-fade-up object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <NoiseOverlay className="mix-blend-overlay" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-4">
          {images.slice(0, 3).map((img, i) => {
            // When the gallery has >3 images, the first row shows the alternates
            const index = images.length > 3 ? i + 1 : i;
            const image = images[index] ?? img;
            const isActive = active === index;
            return (
              <button
                key={image.src}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-pressed={isActive}
                onClick={() => setActive(index)}
                className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-ink/10 bg-fog/40 transition-all duration-300 ${
                  isActive
                    ? "ring-2 ring-ink ring-offset-2 ring-offset-white"
                    : "hover:-translate-y-1"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="20vw"
                  className={`object-cover transition-opacity duration-300 ${
                    isActive ? "" : "opacity-80 group-hover:opacity-100"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
