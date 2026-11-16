# Visual guidelines

ameei looks **warm, crunchy and a little mischievous**: a healthy snack brand that looks like food, not like a supplement. Real kitchen warmth meets modern editorial. Everything leans warm. Nothing is cool grey or pure white.

## Color

Values are in [`../tokens/tokens.json`](../tokens/tokens.json).

| Role | Token | Hex |
|---|---|---|
| Brand red | `crimson` | `#C0162C` |
| CTA / deep accent | `crimson-deep` | `#8B0D1E` |
| Highlight / keyline | `saffron` | `#F4A828` |
| Light background | `chalk` | `#FFF8F0` |
| Dark background | `ember` | `#19090B` |
| Text on light | `ink` | `#1A0A0C` |
| Accent text on dark | `amber-glow` | `#FFB950` |

**Ratio guide (60/30/10):** about 60% chalk or ember background, 30% food photography, and 10% crimson and saffron accents.

**Do**
- Use chalk (`#FFF8F0`) for light backgrounds, never `#FFFFFF`.
- Tint shadows crimson (`rgba(192,22,44,…)`), never grey.
- Use saffron as a glow or keyline next to crimson. That's the logo's own pairing.

**Don't**
- Put cool blues, greens or purples anywhere in the brand palette.
- Set saffron text on chalk (too little contrast). Saffron works as a fill, a line or text on dark.
- Use crimson-bright except for a single heat or sale callout.

## Two ad "moods"

| | Light: *Kitchen Daylight* | Dark: *Ember Night* |
|---|---|---|
| Background | chalk with a blush gradient wash in one corner | ember with a soft crimson glow behind the product |
| Headline | ember/ink Fraunces 900, last phrase in crimson-deep light italic | chalk Fraunces 900, italic accent in amber-glow |
| Best for | No-spice and medium mixes, Studio, gifting | Extra Hot Trail, Ember & Cashew, heat campaigns |

## Typography

- **Headline:** Fraunces, weight 900, tight tracking (-0.03em), line-height ~0.96. Signature move: a heavy roman line followed by a **light italic** payoff in crimson-deep, e.g. "Crunch with a little bit *of spice.*"
- **Eyebrow / labels:** DM Sans 700, uppercase, tracking 0.16em, small, often inside a pill.
- **Body:** DM Sans 400, ash on light, rosewood on dark.
- **Handwritten (Caveat):** at most one short note per ad ("our best-seller!").
- Headlines get at most about 7 words. Keep line breaks deliberate.

## Logo

Files are in [`../brand/logos/`](../brand/logos/).

| File | Use |
|---|---|
| `ameei_logo_primary.svg` | Default, on chalk or photography |
| `ameei_logo_reversed.svg` | On ember or crimson backgrounds |
| `ameei_logo_mono_crimson.svg` | Single-color, on light |
| `ameei_icon.svg` / `.png` | "æ" ligature in a crimson rounded tray with saffron keyline. Avatars, small sizes, end cards |
| `ameei_badge.png` | Round shield badge, used as a floating sticker over photos |

- Leave clear space of at least the height of the "æ" on all sides.
- Never recolor, stretch, rotate or add effects to the logo. Never let AI image models redraw it: composite the real file afterwards.
- The wordmark is always lowercase: **ameei**.

## Shapes and UI elements

- Rounded everything: photos 1.25rem, cards 1rem, panels 2rem, buttons pill-shaped.
- **CTA button:** crimson-deep pill, chalk uppercase DM Sans label, crimson-tinted shadow, optional → arrow.
- **Badge pill:** saffron fill + ink text, or crimson fill + chalk text, with tiny uppercase type.
- **Film grain:** 5% fractal noise over photo areas (see `.noise-overlay` in `tokens.css`).
- Use a floating, slightly rotated (about 12°) badge or sticker for energy.

## Photography

Reference library: [`../photography/`](../photography/). `products/` holds product hero and detail shots; `lifestyle/` holds editorial kitchen, pairing and flat-lay shots.

The house style, based on `hero-chivda-bowl.jpg`:
- **Subject:** golden, roasted snack mix heaped generously in a **handmade ceramic bowl** (speckled, glazed, rustic).
- **Props:** whole dried red chilies, a small bowl of nuts or spices in the background, a few stray flakes scattered on the surface.
- **Surface:** light warm stone or marble, or a dark slate for the Ember mood.
- **Light:** soft directional window light from the upper left with gentle shadows. Shallow depth of field.
- **Angle:** about 30–45° three-quarter view, or top-down for flat-lays.
- **Color:** warm golds, ambers and chili reds. Desaturated, warm background.

**Avoid**
- Packaging with made-up labels. `products/ghost-pepper.jpg` shows a generic non-ameei jar, so don't use it as an ad reference.
- Fried and greasy looks, plastic bowls, cool lighting, and cluttered sets.
- AI-generated text inside images. Add all copy in the layout layer.
