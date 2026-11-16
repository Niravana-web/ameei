# ameei design system

This folder holds the brand source of truth for **ameei** (healthy snacks: small-batch roasted mixes and nuts, roasted never fried) and is the input kit for producing AI ads on our local setup. The web app lives separately in [`../web`](../web).

## Contents

| Path | What's in it |
|---|---|
| [`tokens/tokens.json`](tokens/tokens.json) | Colors, type scale, radii, shadows and motion as machine-readable JSON with usage notes |
| [`tokens/tokens.css`](tokens/tokens.css) | The same tokens as CSS variables, plus the film-grain overlay, for HTML ad templates |
| [`brand/logos/`](brand/logos/) | Primary, reversed and mono logos, the "æ" icon, and the shield badge |
| [`photography/products/`](photography/products/) | Product hero and detail shots (style references for AI generation) |
| [`photography/lifestyle/`](photography/lifestyle/) | Editorial kitchen, pairing and flat-lay shots |
| [`products/products.json`](products/products.json) | The range: names, taglines, heat, ingredients, hooks and matching photos |
| [`guidelines/visual.md`](guidelines/visual.md) | Color usage, the two moods (Kitchen Daylight / Ember Night), typography, logo rules and photo style |
| [`guidelines/voice.md`](guidelines/voice.md) | Tone, allowed claims, headline bank and CTAs |
| [`guidelines/ad-formats.md`](guidelines/ad-formats.md) | Ad sizes, safe zones, the 3-layer build, and layout templates A–E |
| [`prompts/image-prompts.md`](prompts/image-prompts.md) | Style anchors, negative prompt, and per-product scene prompts |

## AI ad workflow

1. Pick a product from `products.json` and a layout from `ad-formats.md`.
2. Generate the **photo only** using `image-prompts.md`, with `hero-chivda-bowl.jpg` as the style reference.
3. Composite the background, the real logo and badge, then copy from `voice.md` in the real fonts and token colors.
4. Check against the do/don't lists in `visual.md` and the claims list in `voice.md`.

## Keeping in sync

The tokens are mirrored from `web/src/app/globals.css` (`@theme`), and the assets are copies of `web/public/brand` and `web/public/images`. If the web app's brand changes, update this folder too.
