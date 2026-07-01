import { getAllProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const products = await getAllProducts();

  const shopLines = products
    .map((p) => `- [${p.name}](${siteConfig.url}/shop/${p.slug}): ${p.tagline}`)
    .join("\n");

  const body = `# ${siteConfig.name}
> ${siteConfig.description}

## Shop
${shopLines}

## About
- [Heritage](${siteConfig.url}/heritage): The story of ${siteConfig.name}'s five-generation family recipes.

## Key facts
- Small-batch Indian snack mixes, family recipes carried across five generations.
- All products are 100% natural, with no artificial colors or preservatives.
- Ships within 24 hours.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
