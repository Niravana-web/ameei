import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStory } from "@/components/home/BrandStory";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BrandStory />
    </>
  );
}
