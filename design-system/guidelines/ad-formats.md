# Ad formats and layouts

## Sizes

| Placement | Size (px) | Ratio | Safe zone |
|---|---|---|---|
| Meta / IG feed (square) | 1080×1080 | 1:1 | 60px all sides |
| Meta / IG feed (portrait) | 1080×1350 | 4:5 | 60px all sides |
| Stories / Reels / TikTok | 1080×1920 | 9:16 | Top 250px and bottom 340px clear of text (UI overlays) |
| Pinterest | 1000×1500 | 2:3 | 60px |
| Google Display (landscape) | 1200×628 | 1.91:1 | 40px |
| Google Display (square) | 1200×1200 | 1:1 | 40px |

Keep text to roughly 20% or less of the frame. Logo or icon on every ad, at least 6% of frame width.

## Layering (build order)

AI models are good at food photos and bad at text and logos. Always build ads in three layers:

1. **Photo layer:** AI-generated or library food shot ([`../prompts/image-prompts.md`](../prompts/image-prompts.md)), with no text and no packaging labels.
2. **Brand layer:** background color or gradient, film grain, real logo file, and badge sticker, composited from `../brand/logos/`.
3. **Copy layer:** headline, eyebrow, support line and CTA in the real fonts and token colors.

## Layout templates

**A. Hero split (feed 1:1 / 4:5).** Copy on the left 55% (eyebrow pill, then headline, support line, CTA pill). Photo on the right, in a rounded 1.25rem frame offset slightly up and right, with the badge floating at its lower-left corner and rotated 12°. Chalk background with a blush gradient wash in the top-right corner.

**B. Full-bleed food (stories 9:16).** Edge-to-edge bowl shot, with a darkened ember gradient from the bottom 40%. Headline sits over the gradient in chalk with an amber-glow italic payoff. CTA pill is placed above the bottom safe zone. Icon sits top-left.

**C. Heat ladder (carousel or 1:1).** Three or four cards, one per heat level (Featherweight / Straight Shooter, then Everyday Medium, then Extra Hot Trail / Ember & Cashew), with a chili-count indicator. Background shifts from chalk to ember as heat rises.

**D. Studio / Build your own.** Top-down flat-lay of separate ingredient piles (nuts, cereals, chilies) in small ceramic bowls. Headline: "Your mix, *your rules.*" CTA: Build Your Mix.

**E. Ember Night (heat products).** Ember background with a crimson radial glow behind a dark-slate bowl shot. Headline: "Handle *with respect.*"
