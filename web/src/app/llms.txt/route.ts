import { siteConfig } from "@/lib/site";
import { STUDIO_GROUPS, STUDIO_PRESETS, STUDIO_POUCH } from "@/lib/studio";

export async function GET() {
  const pantry = STUDIO_GROUPS.filter((g) => g.countsTowardMix)
    .map((g) => `- ${g.label}: ${g.options.map((o) => o.label).join(", ")}`)
    .join("\n");
  const presets = STUDIO_PRESETS.map(
    (p) => `- [${p.name}](${siteConfig.url}/studio?preset=${p.id}): ${p.tagline}`,
  ).join("\n");

  const body = `# ${siteConfig.name}
> ${siteConfig.description}

## The one product
- [Studio](${siteConfig.url}/studio): build an ${STUDIO_POUCH.label} pouch for $${(STUDIO_POUCH.priceCents / 100).toFixed(0)}. Pick any of the ingredients below, set the heat (no spice, medium, extra hot) and the salt (none, less, some). One price whatever you choose.

## Pantry
${pantry}

## House recipes (presets that open the Studio pre-filled)
${presets}

## Key facts
- Every pouch is roasted and blended to order, then shipped across the US.
- Roasted, never fried. No artificial colors or preservatives.
- Made in a kitchen that handles peanuts and tree nuts.
- First order: code FIRSTPOUCH takes 15% off at checkout.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
