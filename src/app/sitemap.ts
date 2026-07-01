import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/heritage`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/spices`, changeFrequency: "monthly", priority: 0.5 },
    // /journal intentionally excluded: noindexed until real posts replace the "Coming soon" placeholders.
  ];

  const productPages: MetadataRoute.Sitemap = (await getAllProducts()).map((p) => ({
    url: `${base}/shop/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
