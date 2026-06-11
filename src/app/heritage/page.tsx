import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Heritage",
  description:
    "The ameei story — five generations of family recipes, roasting techniques, and a little bit of mischief. Coming soon.",
  alternates: { canonical: "/heritage" },
  robots: { index: false },
};

export default function HeritagePage() {
  return (
    <ComingSoon
      title="Five generations,"
      italic="one story."
      blurb="We're writing down what was only ever passed hand to hand — the kitchens, the recipes, the people behind the crunch."
    />
  );
}
