# Image-generation prompts

These prompts are model-agnostic: they work with SDXL/Flux in ComfyUI or Automatic1111, or with similar tools. Combine a **style anchor**, a **scene**, and the **negative prompt**. Generate photos only. Add copy and logos later (see [`../guidelines/ad-formats.md`](../guidelines/ad-formats.md)).

For style transfer or IP-Adapter, use `../photography/products/hero-chivda-bowl.jpg` as the primary reference image.

## Style anchors

**Kitchen Daylight (light)**
```
professional food photography, warm natural window light from upper left, soft shadows,
shallow depth of field, light warm marble surface, warm golden and amber tones, chili red accents,
handmade speckled ceramic bowl, rustic artisanal, editorial magazine style, 50mm, f/2.8, high detail, appetizing
```

**Ember Night (dark)**
```
moody dark food photography, single warm key light, deep near-black background with subtle crimson glow,
dark slate surface, glistening roasted spices, rich reds and ambers, dramatic low-key lighting, high detail
```

## Negative prompt

```
text, words, letters, label, logo, watermark, packaging, brand name, plastic, fried, greasy, oily sheen,
cool tones, blue tint, green tint, harsh flash, cluttered, messy, cartoon, illustration, low quality, blurry,
deformed, extra bowls, hands, people
```

## Scenes by product

| Product | Scene |
|---|---|
| Everyday Medium | heaped bowl of roasted Indian snack mix with roasted peanuts, cashews, cornflakes, wheat checks, raisins and pita chips, light red chili dusting, a few dried red chilies beside the bowl |
| Extra Hot Trail | dark-roasted peanuts and almonds with rice checks, pumpkin chips and pita chips, heavy red chili and cayenne coating, scattered whole dried chilies, chili flakes on the surface (Ember Night) |
| Ember & Cashew | golden roasted cashews and peanuts with cornflakes and pumpkin chips, glossy deep-red chili coating, a wisp of smoke (Ember Night) |
| The Straight Shooter | plain roasted peanuts and almonds with cornflakes, rice checks and raisins, no chili, a bright clean look (Kitchen Daylight) |
| The Nut Case | generous bowl of roasted peanuts, cashews and almonds with toasted coconut flakes and a few cornflakes, overflowing |
| Featherweight | airy light mix of cornflakes, wheat checks, rice checks, flattened rice flakes, raisins and toasted coconut flakes, no nuts, no chili, pale golden |
| Build Your Own | top-down flat-lay of separate small ceramic bowls, each holding one ingredient (peanuts, cashews, almonds, cornflakes, rice checks, raisins, coconut flakes, dried red chilies), on warm marble |

## Lifestyle scenes

- A snack mix bowl on a wooden desk beside a laptop and a cup of chai, afternoon light
- A party snackboard with three bowls at different heat levels and cold drinks with condensation
- A hiking backpack top pocket with a handful of trail mix and mountain light (no packaging visible)
- Hands reaching into a shared bowl on a couch during movie night (remove `hands, people` from the negative prompt)

## Example (full prompt)

```
PROMPT: professional food photography, warm natural window light from upper left, soft shadows,
shallow depth of field, light warm marble surface, warm golden and amber tones, chili red accents,
handmade speckled blue-glazed ceramic bowl, heaped bowl of roasted Indian snack mix with roasted
peanuts, cashews, cornflakes, wheat checks, raisins and pita chips, light red chili dusting,
a few dried red chilies beside the bowl, editorial magazine style, 50mm, f/2.8, high detail

NEGATIVE: (as above)
SIZE: 1024×1024 (feed) · 832×1472 (stories, then upscale to 1080×1920)
```
