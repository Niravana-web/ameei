import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/studio`, changeFrequency: "monthly", priority: 0.9 },
    // /studio/[code] intentionally excluded: per-customer share links, noindexed.
    // /journal intentionally excluded: noindexed until real posts replace the "Coming soon" placeholders.
  ];
}
