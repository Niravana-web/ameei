import type { Product } from "@/lib/products";
import { ChevronDownIcon } from "@/components/ui/icons";

/** Native <details> accordion — accessible, zero-JS, SEO-visible content. */
export function ProductAccordion({ product }: { product: Product }) {
  const sections = [
    { title: "The Ingredients", body: product.ingredients, open: true },
    { title: "Nutrition & Allergens", body: product.nutrition },
    { title: "Shipping & Returns", body: product.shipping },
  ];

  return (
    <div className="mt-8 divide-y divide-ash/20 border-t border-ash/20">
      {sections.map((section) => (
        <details key={section.title} className="group py-4" open={section.open}>
          <summary className="flex cursor-pointer list-none items-center justify-between font-body text-body-md font-medium text-ink [&::-webkit-details-marker]:hidden">
            <span>{section.title}</span>
            <ChevronDownIcon
              size={18}
              className="transition-transform duration-300 group-open:rotate-180"
            />
          </summary>
          <div className="animate-fade-up mt-3 font-body text-body-md leading-relaxed text-ink/80">
            {section.body}
          </div>
        </details>
      ))}
    </div>
  );
}
