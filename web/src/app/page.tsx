import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Pantry } from "@/components/home/Pantry";
import { HouseRecipes } from "@/components/home/HouseRecipes";
import { OfferBand } from "@/components/home/OfferBand";
import { JournalTeaser } from "@/components/home/JournalTeaser";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <HowItWorks />
      <Pantry />
      <HouseRecipes />
      <OfferBand />
      <JournalTeaser />
    </>
  );
}
