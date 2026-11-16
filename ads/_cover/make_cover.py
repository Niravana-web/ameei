"""Facebook Page cover for Ameei: 1640x624 (shown at 820x312 desktop; phones keep the middle ~1280px).
Ember Night mood: ember background, crimson glow behind the product, reversed logo, Fraunces headline."""
import os
import io
import math
import resvg_py
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))   # ameei/
DS = os.path.join(ROOT, "design-system")
FONTS = os.path.join(ROOT, "ads", "fonts")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ameei_fb_cover.png")

W, H = 1640, 624
EMBER = (0x19, 0x09, 0x0B)
CRIMSON = (0xC0, 0x16, 0x2C)
CRIMSON_DEEP = (0x8B, 0x0D, 0x1E)
SAFFRON = (0xF4, 0xA8, 0x28)
CHALK = (0xFF, 0xF8, 0xF0)
AMBER = (0xFF, 0xB9, 0x50)


def font(name, size, weight=None, italic=False):
    f = ImageFont.truetype(os.path.join(FONTS, name), size)
    try:
        axes = f.get_variation_axes()
        vals = []
        for a in axes:
            n = a.get("name", b"")
            n = n.decode() if isinstance(n, bytes) else str(n)
            n = n.lower()
            if n in ("weight", "wght"):
                vals.append(weight or 400)
            elif n in ("optical size", "opsz"):
                vals.append(min(max(a["minimum"], size), a["maximum"]))
            elif n in ("italic", "ital"):
                vals.append(1 if italic else 0)
            else:
                vals.append(a["default"])
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


# ── background: ember with a soft crimson glow behind the bowl ──
bg = Image.new("RGB", (W, H), EMBER)
glow = Image.new("RGB", (W, H), EMBER)
gd = ImageDraw.Draw(glow)
gd.ellipse((60, -80, 900, 720), fill=(0x6A, 0x0E, 0x1C))
glow = glow.filter(ImageFilter.GaussianBlur(140))
bg = Image.blend(bg, glow, 0.9)

# ── product photo (dark-background bowl) blended in on the left ──
photo = Image.open(os.path.join(DS, "photography", "products", "spicy-crunch-main.jpg")).convert("RGB")
ps = 700
photo = photo.resize((ps, ps), Image.LANCZOS)
# feather the photo edges into the background so its own dark backdrop disappears
mask = Image.new("L", (ps, ps), 0)
md = ImageDraw.Draw(mask)
md.ellipse((40, 40, ps - 40, ps - 40), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(70))
px, py = 170, H // 2 - ps // 2 + 30
bg.paste(photo, (px, py), mask)

# ── scattered saffron/crimson "flakes" are already in the photo; add a warm vignette ──
vig = Image.new("L", (W, H), 0)
vd = ImageDraw.Draw(vig)
vd.rectangle((0, 0, W, H), fill=0)
vig = Image.linear_gradient("L").rotate(90, expand=True).resize((W, H))  # left->right ramp
# darken the far right slightly so chalk text sits on deep ember
dark = Image.new("RGB", (W, H), (0x10, 0x05, 0x07))
bg = Image.composite(dark, bg, vig.point(lambda v: int(v * 0.35)))

d = ImageDraw.Draw(bg)

# ── logo (reversed, for dark backgrounds) ──
png = resvg_py.svg_to_bytes(svg_path=os.path.join(DS, "brand", "logos", "ameei_logo_reversed.svg"), width=200)
logo = Image.open(io.BytesIO(bytes(png))).convert("RGBA")
tx = 830                       # text column starts here (inside the 180..1460 phone-safe band)
bg.paste(logo, (tx - 16, 56), logo)

# ── eyebrow pill ──
eb = font("DMSans.ttf", 21, 700)
label = "HEALTHY SNACKS, SMALL BATCH"
# letter-spaced draw
def spaced(draw, xy, text, f, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f) + tracking
    return x
pill_x, pill_y = tx + 186, 112
end_x = spaced(ImageDraw.Draw(Image.new("RGB", (10, 10))), (0, 0), label, eb, CHALK, 3.0)
d.rounded_rectangle((pill_x, pill_y, pill_x + end_x + 44, pill_y + 42), radius=21, fill=CRIMSON_DEEP)
spaced(d, (pill_x + 22, pill_y + 10), label, eb, CHALK, 3.0)

# ── headline: heavy roman line + light italic payoff in amber ──
h1 = font("Fraunces.ttf", 84, 900)
h2 = font("Fraunces.ttf", 84, 300, italic=True)
d.text((tx, 250), "Crunch with", font=h1, fill=CHALK)
d.text((tx, 332), "a little bit", font=h1, fill=CHALK)
d.text((tx, 414), "of spice.", font=h2, fill=AMBER)

# ── saffron keyline under the headline, a brand pairing ──
d.rounded_rectangle((tx + 4, 546, tx + 84, 552), radius=3, fill=SAFFRON)
body = font("DMSans.ttf", 25, 500)
d.text((tx + 104, 532), "Roasted, never fried.  Nothing artificial.  8 oz pocket pouch.", font=body, fill=(0xE8, 0xC9, 0xB5))

# ── 5% film grain over everything ──
import random
random.seed(7)
grain = Image.effect_noise((W, H), 28).convert("L")
bg = Image.composite(Image.new("RGB", (W, H), (255, 255, 255)), bg, grain.point(lambda v: int(max(0, v - 128) * 0.10)))

bg.save(OUT, quality=95)
print("wrote", OUT, bg.size)

# preview with the phone-safe band marked, for review only
prev = bg.copy()
pd = ImageDraw.Draw(prev)
pd.rectangle((180, 0, 1460, H - 1), outline=(0, 255, 0), width=3)
prev.save(OUT.replace(".png", "_safe_preview.png"))
