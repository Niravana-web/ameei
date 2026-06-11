import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Spices",
  description:
    "Single-origin spices and ancestral blends from ameei — coming soon. In the meantime, the snack range is fully stocked.",
  alternates: { canonical: "/spices" },
  robots: { index: false },
};

export default function SpicesPage() {
  return (
    <ComingSoon
      title="The spice rack is"
      italic="being stocked."
      blurb="Single-origin chilies, hand-ground masalas, and blends with five generations behind them. Almost ready."
    />
  );
}
