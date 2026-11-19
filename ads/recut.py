"""Re-cut approved finals for hold rate (v3 openers).

Why: the v2 cuts open on a slow establishing shot under a 96 px title card and
put the spoken line at ~11 s. Average watch time on the first three published
reels was 2-4 s of 17 s. This pass is edit-only (CPU ffmpeg): it reorders the
approved clips so the reel opens on motion or a face, puts the voice line
second, replaces the title card with a small caption that is visible at frame
zero, trims the slow shots, and lands at ~9-10 s.

Usage (wan2gp python has PIL + imageio_ffmpeg):
  python recut.py carry_on            # -> out/v3/ameei_r06_carry_on.mp4 + _frames.jpg
  python recut.py carry_on --dry      # print the plan only
"""
import json
import os
import subprocess
import sys

import pipeline as P
from PIL import Image, ImageDraw

V3 = os.path.join(P.OUT, "v3")
XFADE = 0.2
HOLD = 0.8          # end card hold (was 1.3)
MUSIC_VOL = 0.28

# Per-concept plan: shot order (1-based) and (start, end) seconds kept from each clip.
# Rule of thumb: open on the shot with hands/motion or a face; voice line second,
# kept whole; slow establishing shot last and short.
PLANS = {
    # carry_on: open on the pocket tap + look to camera (pouch still sealed), then pull + open, then the line.
    "carry_on": {
        "order": [1, 2, 3],
        "keep": {1: (2.7, 5.3), 2: (0.0, 2.6), 3: (0.0, 5.3)},
        "hook": "TSA-proof. Gate-ready.|8 ounces.",
    },
    # commute_train: lift + shake + smile (sealed), pour into palm, then the line on the platform.
    "commute_train": {"order": [1, 2, 3], "keep": {1: (1.5, 4.0), 2: (0.0, 2.6), 3: (0.0, 5.3)},
                      "hook": "Commute snack.|Doesn't crumble."},
    # host_gift: door opens + jar held up, pour into the bowl, then "you're invited back".
    "host_gift": {"order": [1, 2, 3], "keep": {1: (2.0, 4.5), 2: (0.0, 2.5), 3: (0.0, 5.3)},
                  "hook": "Stop bringing wine.|Bring this."},
    # airplane (no voice): decline the pretzels, hand into the tin, crunch at the window.
    "airplane": {"order": [1, 2, 3], "keep": {1: (1.0, 4.0), 2: (3.0, 5.3), 3: (0.0, 2.5)},
                 "hook": "Skip the pretzels.|Bring real nuts."},
    # scrubs_pocket: voice is shot 1 (pull from pocket -> line), kept whole; pinch; walk away.
    "scrubs_pocket": {"order": [1, 2, 3], "keep": {1: (0.0, 5.3), 2: (0.0, 2.5), 3: (0.0, 2.5)},
                      "hook": "12-hour shift.|Pocket-sized backup."},
    # coffee_shop (no voice): tin out of the pocket + lid pop, pick from the tin, crunch + type.
    "coffee_shop": {"order": [1, 2, 3], "keep": {1: (0.5, 3.5), 2: (0.0, 2.5), 3: (0.0, 2.5)},
                    "hook": "Pocket snack|for the laptop life."},
    # glovebox: voice is shot 1 (glovebox pop -> line), kept whole; pinch; pat the shirt pocket.
    "glovebox": {"order": [1, 2, 3], "keep": {1: (0.0, 5.3), 2: (0.0, 2.5), 3: (3.0, 5.3)},
                 "hook": "Glovebox snack|that survives July.", "hook_end": 3.3},   # he turns to camera at ~3.5 s
    # trail (no voice): pouch out of the pack, gloved palm, wince + grin.
    "trail": {"order": [1, 2, 3], "keep": {1: (1.5, 4.0), 2: (0.0, 2.5), 3: (0.0, 3.0)},
              "hook": "Trail mix|with an actual kick."},
    # stroller: voice is shot 1 (pouch out of the stroller pocket -> line), kept whole; one-handed pinch; reseal.
    "stroller": {"order": [1, 2, 3], "keep": {1: (0.0, 5.3), 2: (0.0, 2.5), 3: (0.0, 2.5)},
                 "hook": "Stroller-pocket snack.|For the grown-up.", "hook_end": 2.6},   # pouch lifted into the box at ~2.7 s
    # study_night: blind reach lands a cashew (face in frame), cashew to camera, then "I'm awake now".
    "study_night": {"order": [1, 2, 3], "keep": {1: (2.5, 5.0), 2: (0.0, 2.2), 3: (0.0, 5.3)},
                    "hook": "1am study snack.|Slow burn."},
    # tailgate: pour from the pouch, hands + laugh, then "extra hot".
    "tailgate": {"order": [1, 2, 3], "keep": {1: (0.0, 2.6), 2: (0.0, 2.5), 3: (0.0, 5.3)},
                 "hook": "Tailgate snack.|Roasted, not fried."},
    # build_your_own: hands lift the cashew + chili bowls, pour into the mix, then "mine's medium".
    "build_your_own": {"order": [1, 2, 3], "keep": {1: (2.0, 4.5), 2: (0.0, 2.4), 3: (0.0, 5.3)},
                       "hook": "Build your own mix.|Set your own heat."},
    # movie_night: hands bump in the bowl, scoop, then "where have these been".
    "movie_night": {"order": [1, 2, 3], "keep": {1: (0.0, 2.6), 2: (0.5, 3.0), 3: (0.0, 5.3)},
                    "hook": "Movie night snack.|Roasted, not fried."},
    # lunchbox (no voice): spoon in + lid click, short close-up, she picks a flake and crunches.
    "lunchbox": {"order": [1, 2, 3], "keep": {1: (1.5, 4.5), 2: (0.0, 1.8), 3: (1.5, 5.3)},
                 "hook": "Nut-free recipe.|Lunchbox approved."},
}


def _find_meta(cid):
    for d in (os.path.join(P.OUT, "v2"), P.OUT):
        for n in os.listdir(d):
            if n.endswith(f"_{cid}.json"):
                return os.path.join(d, n)
    raise SystemExit(f"no meta json for {cid}")


def overlays(c, hook, out_dir):
    """Small, instant hook + caption bars + badge + end card. No eyebrow pill, no title card."""
    os.makedirs(out_dir, exist_ok=True)
    paths = {}
    W, H = P.W, P.H

    def canvas():
        return Image.new("RGBA", (W, H), (0, 0, 0, 0))

    # hook: two lines max, 72 px Fraunces, upper third, light gradient only behind the text block
    img = canvas()
    d = ImageDraw.Draw(img)
    f = P._font(P.FONT_DISPLAY, 72, 800)
    lines = [l for part in hook.split("|") for l in P._wrap(d, part, f, W - 200)]
    y0 = 640
    bh = len(lines) * 84 + 40
    P._rounded(d, (70, y0 - 20, W - 70, y0 - 20 + bh), 26, (25, 9, 11, 150))
    y = y0
    for l in lines:
        d.text((100, y), l, font=f, fill=P.COL["chalk"])
        y += 84
    paths["hook"] = os.path.join(out_dir, "hook.png")
    img.save(paths["hook"])

    cap_f = P._font(P.FONT_BODY, 54, 600)
    for i, shot in enumerate(c["shots"]):
        img = canvas()
        d = ImageDraw.Draw(img)
        ls = P._wrap(d, shot["caption"], cap_f, W - 240)
        lh, by = 68, 1420
        bh = len(ls) * lh + 44
        bw = max(d.textlength(l, font=cap_f) for l in ls) + 80
        bx = (W - bw) / 2
        P._rounded(d, (bx, by, bx + bw, by + bh), 28, (25, 9, 11, 200))
        yy = by + 22
        for l in ls:
            d.text(((W - d.textlength(l, font=cap_f)) / 2, yy), l, font=cap_f, fill=P.COL["chalk"])
            yy += lh
        paths[f"cap{i + 1}"] = os.path.join(out_dir, f"cap{i + 1}.png")
        img.save(paths[f"cap{i + 1}"])

    img = canvas()
    icon = Image.open(P.ICON).convert("RGBA").resize((110, 110), Image.LANCZOS)
    img.alpha_composite(icon, (70, 140))
    paths["badge"] = os.path.join(out_dir, "badge.png")
    img.save(paths["badge"])

    # end card: reuse the v2 design (brand + CTA)
    full = P.make_overlays(c, os.path.join(out_dir, "_v2"))
    paths["end"] = full["end"]
    return paths


def assemble(c, plan, clips, music, out_path, work_dir):
    ff = P.ffmpeg()
    W, H, FPS = P.W, P.H, P.FPS
    ov = overlays(c, plan["hook"], os.path.join(work_dir, "overlays"))
    order = plan["order"]
    segs = []
    for s in order:
        a, b = plan["keep"][s]
        src = clips[s - 1]
        b = min(b, P.probe_duration(ff, src))
        segs.append((s, src, a, b))
    n = len(segs)
    durs = [b - a for _, _, a, b in segs]
    inputs, parts = [], []
    for i, (s, src, a, b) in enumerate(segs):
        inputs += ["-i", src]
        pad = f",tpad=stop_mode=clone:stop_duration={HOLD}" if i == n - 1 else ""
        parts.append(f"[{i}:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS,fps={FPS},"
                     f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},setsar=1,format=yuv420p{pad}[v{i}]")
        parts.append(f"[{i}:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo[a{i}]")
    durs[-1] += HOLD
    prev_v, prev_a, offset, starts = "v0", "a0", 0.0, [0.0]
    for i in range(1, n):
        offset += durs[i - 1] - XFADE
        starts.append(offset)
        parts.append(f"[{prev_v}][v{i}]xfade=transition=fade:duration={XFADE}:offset={offset:.3f}[x{i}]")
        parts.append(f"[{prev_a}][a{i}]acrossfade=d={XFADE}:c1=tri:c2=tri[ax{i}]")
        prev_v, prev_a = f"x{i}", f"ax{i}"
    total = offset + durs[-1]
    end_start = total - HOLD - 0.25

    idx = n
    # hook visible from frame 0 through the first shot; captions follow their own shot
    # hook_end (optional, per plan): fade the hook early when a face or the pouch moves into its box
    hook_end = plan.get("hook_end") or ((starts[1] + 0.15) if n > 1 else total)
    ov_order = [("badge", 0, end_start), ("hook", 0.0, hook_end)]
    for i, (s, _, _, _) in enumerate(segs):
        st = starts[i] + (0.0 if i == 0 else 0.15)
        if i == 0:
            st = min(starts[1] - 0.1, 1.6) if n > 1 else 1.0   # first caption comes in after the hook has registered
        en = (starts[i + 1] + 0.15) if i + 1 < n else end_start
        ov_order.append((f"cap{s}", st, en))
    ov_order.append(("end", end_start, total + 1))
    cur = prev_v
    for name, s, e in ov_order:
        inputs += ["-loop", "1", "-framerate", str(FPS), "-i", ov[name]]
        if name == "end":
            fade = f",fade=t=in:st={s:.3f}:d=0.3:alpha=1"
        elif name == "hook":
            fade = f",fade=t=out:st={e - 0.2:.3f}:d=0.2:alpha=1"
        else:
            fade = f",fade=t=in:st={s:.3f}:d=0.15:alpha=1,fade=t=out:st={e - 0.15:.3f}:d=0.15:alpha=1"
        parts.append(f"[{idx}:v]format=rgba,setpts=PTS-STARTPTS{fade}[o{idx}]")
        parts.append(f"[{cur}][o{idx}]overlay=0:0:enable='between(t,{s:.3f},{e:.3f})':format=auto[c{idx}]")
        cur = f"c{idx}"
        idx += 1
    parts.append(f"[{cur}]fade=t=out:st={total - 0.3:.3f}:d=0.3,format=yuv420p[vout]")

    if music:
        inputs += ["-i", music]
        parts.append(f"[{idx}:a]atrim=0:{total:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
                     f"volume={MUSIC_VOL},afade=t=in:st=0:d=0.1,afade=t=out:st={total - 1.2:.3f}:d=1.2[mus]")
        parts.append(f"[{prev_a}]apad=pad_dur={HOLD + 0.5},volume=1.0[sfx]")
        parts.append("[sfx][mus]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]")
    else:
        parts.append(f"[{prev_a}]apad=pad_dur={HOLD + 0.5},loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]")

    cmd = [ff, "-y", "-v", "error", *inputs, "-filter_complex", ";".join(parts),
           "-map", "[vout]", "-map", "[aout]", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-profile:v", "high",
           "-pix_fmt", "yuv420p", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
           "-t", f"{total:.3f}", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    if r.returncode != 0:
        raise RuntimeError("ffmpeg failed:\n" + r.stderr[-3000:])
    sheet = os.path.splitext(out_path)[0] + "_frames.jpg"
    subprocess.run([ff, "-y", "-v", "error", "-i", out_path, "-vf", "fps=2,scale=270:-1,tile=10x2", "-frames:v", "1", sheet],
                   capture_output=True)
    return total, starts


def main():
    cid = sys.argv[1]
    dry = "--dry" in sys.argv
    plan = PLANS[cid]
    meta = json.load(open(_find_meta(cid), encoding="utf-8"))
    c, clips, music = meta["concept"], meta["clips"], meta.get("music")
    os.makedirs(V3, exist_ok=True)
    name = f"ameei_r{meta['round']:02d}_{cid}.mp4"
    out_path = os.path.join(V3, name)
    print("plan:", json.dumps(plan))
    if dry:
        return
    total, starts = assemble(c, plan, clips, music, out_path, os.path.join(V3, "work", cid))
    meta_out = dict(meta, plan=plan, duration_s=round(total, 2), shot_starts=[round(s, 2) for s in starts],
                    label="v3 re-cut: motion-first opener, voice line second, small hook at t=0, ~9 s")
    with open(os.path.splitext(out_path)[0] + ".json", "w", encoding="utf-8") as f:
        json.dump(meta_out, f, indent=2, ensure_ascii=False)
    print(f"wrote {out_path} ({total:.1f}s), shot starts {starts}")


if __name__ == "__main__":
    main()
