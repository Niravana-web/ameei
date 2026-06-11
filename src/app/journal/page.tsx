import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Recipes, spice notes, and stories from the ameei kitchen. The journal is coming soon.",
  alternates: { canonical: "/journal" },
  robots: { index: false },
};

export default function JournalPage() {
  return (
    <ComingSoon
      title="Notes from a"
      italic="warm kitchen."
      blurb="Recipes, pairing ideas, and the occasional hot take on heat. First entries landing soon."
    />
  );
}
