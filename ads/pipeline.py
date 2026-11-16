"""ameei Reels pipeline with review gates.

  script -> keyframes -> [GATE kf] -> clips -> [GATE clips] -> music -> edit -> [GATE final] -> out/

Every gate pauses the pipeline, writes  ads/gates/<name>.json  (with a review contact sheet) and waits for
ads/gates/<name>.decision.json.  Rejected items go back one stage (new seeds / prompt additions) and are
reviewed again; only videos approved at the final gate land in out/.  Nothing reviewed = nothing published:
if no decision arrives within GATE_TIMEOUT the stage continues with the heuristic pick and the result is
quarantined in out/unreviewed/.

Run with the wan2gp env python:
  python pipeline.py loop                         # rounds forever until ads/STOP exists
  python pipeline.py dry                          # --dry-run job files only
  python pipeline.py reedit <round> <concept>|all # re-assemble from the saved .json meta -> final gate
  python pipeline.py repair <round> <concept> <shots e.g. 2,3> [--kf "extra prompt"]
                                                  # re-roll keyframes (with --kf) and/or re-render clips for the
                                                  # given shots through the gates, then re-edit -> final gate
  python pipeline.py test-edit

Decision file formats (written by the reviewer):
  kf:    {"picks": {"<cid>:<shot>": "<abs path of chosen candidate>"},
          "reroll": {"<cid>:<shot>": {"reason": "...", "prompt_add": "optional extra prompt text"}}}
  clips: {"approve": ["<cid>:<shot>", ...],
          "rerender": {"<cid>:<shot>": {"reason": "...", "keyframe": "optional other kf abs path",
                                          "prompt_add": "optional"}}}
  final: {"approve": ["<file name>.mp4", ...], "reject": {"<file name>.mp4": "reason"}}
"""
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import time
import traceback
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from concepts import CONCEPTS  # noqa: E402

PY = r"C:\Users\SRI\miniconda3\envs\wan2gp\python.exe"
WAN = r"C:\Users\SRI\Documents\Wan2GP"
ADS = os.path.dirname(os.path.abspath(__file__))
DS = os.path.join(os.path.dirname(ADS), "design-system")
OUT = os.path.join(ADS, "out")
PENDING = os.path.join(OUT, "pending")
REJECTED = os.path.join(OUT, "rejected")
UNREVIEWED = os.path.join(OUT, "unreviewed")
GATES = os.path.join(ADS, "gates")
STOP = os.path.join(ADS, "STOP")
LOG = os.path.join(ADS, "pipeline.log")
STATE = os.path.join(ADS, "state.json")
WORK_REL = "outputs/ameei"
WORK = os.path.join(WAN, WORK_REL.replace("/", os.sep))
FONT_DISPLAY = os.path.join(ADS, "fonts", "Fraunces.ttf")
FONT_BODY = os.path.join(ADS, "fonts", "DMSans.ttf")
ICON = os.path.join(DS, "brand", "logos", "ameei_icon.png")

SEEDS_PER_SHOT = 2
MAX_ATTEMPTS = 3          # keyframe re-rolls / clip re-renders per shot before giving up on the concept
GATE_TIMEOUT = 30 * 60    # seconds to wait for a reviewer decision before continuing unreviewed
GATE_POLL = 15
CLIP_KEEP = 5.3   # keep the whole 124-frame clip (5.27 s); 4.7 cut the end of spoken lines
XFADE = 0.25  # shorter crossfade so the tail of a line is not faded under the next shot
HOLD = 1.3
W, H = 1080, 1920
FPS = 24

COL = {"crimson": "#C0162C", "crimson_deep": "#8B0D1E", "saffron": "#F4A828", "chalk": "#FFF8F0",
       "ink": "#1A0A0C", "ember": "#19090B", "amber": "#FFB950"}

NO_BRAND = (" Plain unbranded clothing and objects: no logos, no printed text, no labels, no team emblems, "
            "no brand marks anywhere in the frame.")


def log(msg):
    line = f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def stop_requested():
    return os.path.exists(STOP)


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def load_state():
    if os.path.exists(STATE):
        with open(STATE, encoding="utf-8") as f:
            return json.load(f)
    return {"round": 0, "next_concept": 0, "done": []}


def save_state(s):
    with open(STATE, "w", encoding="utf-8") as f:
        json.dump(s, f, indent=2)


def key(cid, si):
    return f"{cid}:{si + 1}"


def unkey(k):
    cid, s = k.rsplit(":", 1)
    return cid, int(s) - 1


def concept(cid):
    return next(c for c in CONCEPTS if c["id"] == cid)


# ───────────────────────── gates ─────────────────────────
def gate(name, payload):
    """Write the gate file, wait for a decision. Returns the decision dict or None on timeout/stop."""
    os.makedirs(GATES, exist_ok=True)
    gfile = os.path.join(GATES, f"{name}.json")
    dfile = os.path.join(GATES, f"{name}.decision.json")
    if os.path.exists(dfile):
        if os.environ.get("AMEEI_RESUME"):
            with open(dfile, encoding="utf-8") as f:
                d = json.load(f)
            log(f"GATE {name}: RESUME, reusing existing decision")
            return d
        os.remove(dfile)
    payload = dict(payload, gate=name, opened=datetime.now().isoformat(timespec="seconds"), decision_file=dfile)
    with open(gfile, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    log(f"GATE {name} waiting for review: {payload.get('sheet') or payload.get('sheets')}")
    t0 = time.time()
    while time.time() - t0 < GATE_TIMEOUT:
        if os.path.exists(dfile):
            time.sleep(1)
            try:
                with open(dfile, encoding="utf-8") as f:
                    d = json.load(f)
            except Exception as e:
                log(f"GATE {name}: decision unreadable ({e}), waiting")
                time.sleep(GATE_POLL)
                continue
            log(f"GATE {name}: decision received after {(time.time() - t0) / 60:.1f} min")
            return d
        if stop_requested():
            log(f"GATE {name}: STOP found while waiting; continuing unreviewed so the work is saved")
            return None
        time.sleep(GATE_POLL)
    log(f"GATE {name}: TIMEOUT after {GATE_TIMEOUT // 60} min, continuing unreviewed")
    return None


def _label_font(size=22):
    from PIL import ImageFont
    return ImageFont.truetype(FONT_BODY, size)


def kf_sheet(path, cands, title):
    """cands: {key: [abs image paths]} -> one grid, a row per shot, a column per candidate, labelled."""
    from PIL import Image, ImageDraw
    keys = sorted(cands)
    ncol = max(len(v) for v in cands.values())
    tw, th = 300, 534
    pad, lab = 10, 34
    img = Image.new("RGB", (pad + ncol * (tw + pad), 50 + len(keys) * (th + lab + pad)), (24, 24, 24))
    d = ImageDraw.Draw(img)
    d.text((pad, 12), title, font=_label_font(26), fill=(255, 248, 240))
    f = _label_font(20)
    for r, k in enumerate(keys):
        y = 50 + r * (th + lab + pad)
        for c, p in enumerate(cands[k]):
            x = pad + c * (tw + pad)
            try:
                im = Image.open(p).convert("RGB")
                im.thumbnail((tw, th))
                img.paste(im, (x, y + lab))
            except Exception:
                pass
            d.text((x, y + 6), f"{k}  [{c}]  seed{_seed_of(p)}", font=f, fill=(244, 168, 40))
    img.save(path, quality=88)
    return path


def _seed_of(p):
    m = re.search(r"_seed(\d+)_", os.path.basename(p))
    return m.group(1) if m else "?"


def clip_sheet(path, clips, title):
    """clips: {key: mp4 path} -> a strip of 8 frames per clip, one row per clip."""
    from PIL import Image, ImageDraw
    ff = ffmpeg()
    tmpdir = os.path.join(os.path.dirname(path), "_strips")
    os.makedirs(tmpdir, exist_ok=True)
    keys = sorted(clips)
    strips = []
    for k in keys:
        strip = os.path.join(tmpdir, k.replace(":", "_") + ".jpg")
        subprocess.run([ff, "-y", "-v", "error", "-i", clips[k], "-vf", "fps=1.55,scale=240:-1,tile=8x1",
                        "-frames:v", "1", strip], capture_output=True)
        strips.append((k, strip))
    lab = 34
    rows = []
    for k, s in strips:
        try:
            rows.append((k, Image.open(s).convert("RGB")))
        except Exception:
            rows.append((k, Image.new("RGB", (1920, 427), (60, 0, 0))))
    wmax = max(im.width for _, im in rows)
    img = Image.new("RGB", (wmax + 20, 50 + sum(im.height + lab + 10 for _, im in rows)), (24, 24, 24))
    d = ImageDraw.Draw(img)
    d.text((10, 12), title, font=_label_font(26), fill=(255, 248, 240))
    y = 50
    for k, im in rows:
        d.text((10, y + 6), f"{k}  seed{_seed_of(clips[k])}  (frames at 0.65 s steps, left->right)", font=_label_font(20), fill=(244, 168, 40))
        img.paste(im, (10, y + lab))
        y += im.height + lab + 10
    img.save(path, quality=88)
    return path


# ───────────────────────── WanGP job runner ─────────────────────────
def run_wgp(tasks, out_rel, label, dry=False):
    out_abs = os.path.join(WAN, out_rel.replace("/", os.sep))
    os.makedirs(out_abs, exist_ok=True)
    job = os.path.join(out_abs, f"{label}_job.json")
    with open(job, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2, ensure_ascii=False)
    cmd = [PY, "wgp.py", "--process", job, "--output-dir", out_rel, "--profile", "4", "--attention", "sage2"]
    if dry:
        cmd.append("--dry-run")
    done = {}
    for t in tasks:
        m = [p for p in glob.glob(os.path.join(out_abs, f"*_seed{t['seed']}_*")) if not p.endswith((".json", ".txt"))]
        if m:
            done[t["seed"]] = max(m, key=os.path.getmtime)
    if done:
        log(f"{label}: {len(done)} task(s) already rendered, skipping them")
        tasks = [t for t in tasks if t["seed"] not in done]
        if not tasks:
            return done
        with open(job, "w", encoding="utf-8") as f:
            json.dump(tasks, f, indent=2, ensure_ascii=False)
    before = set(glob.glob(os.path.join(out_abs, "*.*")))
    t0 = time.time()
    log(f"{label}: {len(tasks)} task(s){' (dry-run)' if dry else ''} -> {out_rel}")
    logfile = os.path.join(out_abs, f"{label}_log.txt")
    with open(logfile, "w", encoding="utf-8", errors="replace") as lf:
        r = subprocess.run(cmd, cwd=WAN, stdout=lf, stderr=subprocess.STDOUT)
    log(f"{label}: exit {r.returncode} after {(time.time() - t0) / 60:.1f} min")
    if dry:
        with open(logfile, encoding="utf-8", errors="replace") as lf:
            tail = lf.read()[-1500:]
        log(f"{label} dry-run tail:\n{tail}")
        return {}
    new = sorted(set(glob.glob(os.path.join(out_abs, "*.*"))) - before, key=os.path.getmtime)
    by_seed = {}
    for p in new:
        if p.endswith((".json", ".txt")):
            continue
        m = re.search(r"_seed(\d+)_", os.path.basename(p))
        if m:
            by_seed[int(m.group(1))] = p
    by_seed.update(done)
    log(f"{label}: {len(by_seed)} output file(s)")
    return by_seed


def kf_task(prompt, seed):
    return {"model_type": "minimax_h3_image", "prompt": prompt, "resolution": "2176x3872",
            "num_inference_steps": 8, "guidance_scale": 1.0, "sample_solver": "euler", "seed": seed, "batch_size": 1}


def vid_task(kf_rel, prompt, seed):
    return {"model_type": "minimax_h3_fl2va_pruned", "image_prompt_type": "S", "image_start": kf_rel,
            "prompt": prompt, "resolution": "720x1280", "video_length": 124, "num_inference_steps": 20,
            "guidance_scale": 1.0, "seed": seed}


def music_task(c, seed):
    return {"model_type": "stable_audio3_small",
            "prompt": c["music"] + ", instrumental, clean mix, suitable as background music for a short social video",
            "duration_seconds": 18, "num_inference_steps": 8, "guidance_scale": 1.0,
            "negative_prompt": "poor quality, distorted, noisy, vocals, speech, singing", "seed": seed}


def image_score(path):
    import cv2
    import numpy as np
    img = cv2.imread(path)
    if img is None:
        return -1
    small = cv2.resize(img, (544, 968))
    g = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    sharp = cv2.Laplacian(g, cv2.CV_64F).var()
    mean = g.mean()
    dark = (g < 10).mean()
    bright = (g > 245).mean()
    penalty = 1.0
    if mean < 40 or mean > 215:
        penalty *= 0.5
    penalty *= max(0.2, 1 - 2 * dark) * max(0.2, 1 - 4 * bright)
    return float(np.log1p(sharp) * penalty)


def rel(path_abs):
    return os.path.relpath(path_abs, WAN).replace("\\", "/")


# ───────────────────────── stage 1: keyframes + gate ─────────────────────────
def stage_keyframes(tag, rdir_rel, shots, base_seed, dry=False, prompt_add=None):
    """shots: {key: image prompt}. Returns ({key: abs picked path}, unreviewed: bool)."""
    rdir = os.path.join(WAN, rdir_rel.replace("/", os.sep))
    prompt_add = dict(prompt_add or {})
    pending = dict(shots)
    cands, picks, unreviewed = {}, {}, False
    for attempt in range(MAX_ATTEMPTS):
        if not pending:
            break
        tasks, idx = [], {}
        for n, (k, prompt) in enumerate(sorted(pending.items())):
            for s in range(SEEDS_PER_SHOT):
                seed = base_seed + attempt * 1000 + n * 10 + s
                tasks.append(kf_task(prompt + prompt_add.get(k, ""), seed))
                idx[seed] = k
        files = run_wgp(tasks, f"{rdir_rel}/kf", f"{tag}_keyframes_a{attempt}", dry)
        if dry:
            return {}, True
        for seed, p in files.items():
            cands.setdefault(idx[seed], []).append(p)
        missing = [k for k in pending if k not in cands]
        if missing:
            log(f"WARNING {tag}: no keyframe files for {missing}")
        sheet = kf_sheet(os.path.join(rdir, f"{tag}_kf_review_a{attempt}.jpg"),
                         {k: cands[k] for k in pending if k in cands}, f"{tag} keyframes attempt {attempt}")
        d = gate(f"{tag}_kf_a{attempt}", {
            "stage": "keyframes", "attempt": attempt, "sheet": sheet,
            "candidates": {k: cands[k] for k in pending if k in cands},
            "prompts": {k: pending[k] + prompt_add.get(k, "") for k in pending},
            "how": "Pick one path per key into picks, or put the key in reroll with a reason (and optional prompt_add). "
                   "Check: anatomy/hands, no text/logos/labels, right product look, same person as the other shots.",
        })
        if d is None:
            unreviewed = True
            for k in list(pending):
                if k in cands:
                    picks[k] = max(cands[k], key=image_score)
            pending = {}
            break
        for k, p in (d.get("picks") or {}).items():
            shown = [os.path.normcase(os.path.abspath(x)) for x in cands.get(k, [])]
            if os.path.exists(p) and os.path.normcase(os.path.abspath(p)) in shown:
                picks[k] = p
                pending.pop(k, None)
            else:
                # refuse anything that was not one of this gate's candidates (guards against stale files with the same seed)
                log(f"GATE {tag}: pick for {k} is not one of the shown candidates, ignoring: {p}")
        rer = d.get("reroll") or {}
        for k, info in rer.items():
            if k in shots:
                pending[k] = shots[k]
                if isinstance(info, dict) and info.get("prompt_add"):
                    prompt_add[k] = prompt_add.get(k, "") + " " + info["prompt_add"]
                log(f"REROLL kf {k}: {info.get('reason') if isinstance(info, dict) else info}")
        for k in list(pending):
            if k not in rer and k in picks:
                pending.pop(k)
        # anything neither picked nor rerolled: keep heuristic pick, flag it
        for k in list(pending):
            if k not in rer:
                if k in cands:
                    picks[k] = max(cands[k], key=image_score)
                    log(f"GATE {tag}: {k} not decided, heuristic pick")
                pending.pop(k)
    if pending:
        log(f"{tag}: giving up on {list(pending)} after {MAX_ATTEMPTS} attempts")
    # copy picks to stable names
    out = {}
    for k, p in picks.items():
        cid, si = unkey(k)
        dst = os.path.join(rdir, "kf", f"{cid}_shot{si + 1}.jpg")
        if os.path.abspath(p) != os.path.abspath(dst):
            shutil.copyfile(p, dst)
        out[k] = dst
        log(f"keyframe {k}: {os.path.basename(p)}")
    return out, unreviewed


# ───────────────────────── stage 2: clips + gate ─────────────────────────
def stage_clips(tag, rdir_rel, shots, keyframes, base_seed, dry=False, prompt_add=None):
    """shots: {key: video prompt}; keyframes: {key: abs path}. Returns ({key: mp4 abs}, unreviewed)."""
    rdir = os.path.join(WAN, rdir_rel.replace("/", os.sep))
    prompt_add = dict(prompt_add or {})
    kfs = dict(keyframes)
    pending = {k: v for k, v in shots.items() if k in kfs}
    clips, unreviewed = {}, False
    for attempt in range(MAX_ATTEMPTS):
        if not pending:
            break
        tasks, idx = [], {}
        for n, (k, prompt) in enumerate(sorted(pending.items())):
            seed = base_seed + 5000 + attempt * 1000 + n * 10
            tasks.append(vid_task(rel(kfs[k]), prompt + prompt_add.get(k, ""), seed))
            idx[seed] = k
        files = run_wgp(tasks, f"{rdir_rel}/clips", f"{tag}_clips_a{attempt}", dry)
        if dry:
            return {}, True
        got = {idx[seed]: p for seed, p in files.items()}
        missing = [k for k in pending if k not in got]
        if missing:
            log(f"WARNING {tag}: no clip for {missing}")
        clips.update(got)
        sheet = clip_sheet(os.path.join(rdir, f"{tag}_clip_review_a{attempt}.jpg"), got, f"{tag} clips attempt {attempt}")
        d = gate(f"{tag}_clips_a{attempt}", {
            "stage": "clips", "attempt": attempt, "sheet": sheet, "clips": got,
            "keyframes": {k: kfs[k] for k in got},
            "how": "approve keys that are clean; rerender keys with a reason (optional other keyframe path, prompt_add). "
                   "Check: melted hands/faces, drift at the end, text appearing, caricature expressions, wrong action.",
        })
        if d is None:
            # no reviewer: keep every rendered clip (quarantined later as unreviewed), re-render nothing
            unreviewed = True
            pending = {}
            break
        rer = d.get("rerender") or {}
        pending = {}
        for k, info in rer.items():
            if k in shots:
                pending[k] = shots[k]
                if isinstance(info, dict):
                    if info.get("keyframe") and os.path.exists(info["keyframe"]):
                        kfs[k] = info["keyframe"]
                    if info.get("prompt_add"):
                        prompt_add[k] = prompt_add.get(k, "") + " " + info["prompt_add"]
                log(f"RERENDER clip {k}: {info.get('reason') if isinstance(info, dict) else info}")
    if pending:
        log(f"{tag}: clips still rejected after {MAX_ATTEMPTS} attempts: {list(pending)}")
        for k in pending:
            clips.pop(k, None)
    return clips, unreviewed


# ───────────────────────── stage 3: music ─────────────────────────
def stage_music(tag, rdir_rel, concepts, base_seed, dry=False):
    tasks, idx = [], {}
    for n, c in enumerate(concepts):
        seed = base_seed + 9000 + n
        tasks.append(music_task(c, seed))
        idx[seed] = c["id"]
    files = run_wgp(tasks, f"{rdir_rel}/music", f"{tag}_music", dry)
    return {idx[s]: p for s, p in files.items()}


# ───────────────────────── overlays ─────────────────────────
def _font(path, size, weight):
    from PIL import ImageFont
    f = ImageFont.truetype(path, size)
    try:
        axes = f.get_variation_axes()
        vals = []
        for a in axes:
            name = a.get("name", b"")
            name = name.decode() if isinstance(name, bytes) else str(name)
            if name.lower() in ("weight", "wght"):
                vals.append(weight)
            elif name.lower() in ("optical size", "opsz"):
                vals.append(min(max(a["minimum"], size), a["maximum"]))
            else:
                vals.append(a["default"])
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


def _wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def _rounded(draw, box, r, fill):
    draw.rounded_rectangle(box, radius=r, fill=fill)


def _top_gradient(img, height=int(H * 0.46), peak=165):
    """Dark gradient under the hook so chalk text reads on bright skies/walls."""
    import numpy as np
    from PIL import Image
    y = np.arange(height, dtype=np.float32) / height
    a = (peak * (1 - y) ** 1.6).astype(np.uint8)
    alpha = np.repeat(a[:, None], W, axis=1)
    rgba = np.zeros((height, W, 4), dtype=np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = 16, 6, 8
    rgba[..., 3] = alpha
    img.alpha_composite(Image.fromarray(rgba), (0, 0))


def make_overlays(c, out_dir):
    from PIL import Image, ImageDraw, ImageFilter
    os.makedirs(out_dir, exist_ok=True)
    paths = {}

    def canvas():
        return Image.new("RGBA", (W, H), (0, 0, 0, 0))

    def shadowed(img):
        alpha = img.split()[3]
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        sh.putalpha(alpha.filter(ImageFilter.GaussianBlur(14)).point(lambda a: int(a * 0.55)))
        base = Image.new("RGBA", img.size, (0, 0, 0, 0))
        base.alpha_composite(sh, (0, 8))
        base.alpha_composite(img)
        return base

    # hook: gradient + saffron eyebrow pill + Fraunces headline
    img = canvas()
    d = ImageDraw.Draw(img)
    eyebrow_f = _font(FONT_BODY, 30, 700)
    head_f = _font(FONT_DISPLAY, 96, 800)
    eyebrow = "HEALTHY SNACKS · " + c["product"].upper()
    ew = d.textlength(eyebrow, font=eyebrow_f) + 56
    y = 300
    _rounded(d, (80, y, 80 + ew, y + 58), 29, COL["saffron"])
    d.text((108, y + 11), eyebrow, font=eyebrow_f, fill=COL["ink"])
    y += 90
    for line in _wrap(d, c["hook"], head_f, W - 160):
        d.text((80, y), line, font=head_f, fill=COL["chalk"])
        y += 104
    hook = canvas()
    _top_gradient(hook)
    hook.alpha_composite(shadowed(img))
    paths["hook"] = os.path.join(out_dir, "hook.png")
    hook.save(paths["hook"])

    cap_f = _font(FONT_BODY, 48, 600)
    for i, shot in enumerate(c["shots"]):
        img = canvas()
        d = ImageDraw.Draw(img)
        lines = _wrap(d, shot["caption"], cap_f, W - 260)
        lh = 62
        bh = len(lines) * lh + 44
        by = 1450
        bw = max(d.textlength(l, font=cap_f) for l in lines) + 80
        bx = (W - bw) / 2
        _rounded(d, (bx, by, bx + bw, by + bh), 28, (25, 9, 11, 190))
        yy = by + 22
        for l in lines:
            d.text(((W - d.textlength(l, font=cap_f)) / 2, yy), l, font=cap_f, fill=COL["chalk"])
            yy += lh
        paths[f"cap{i + 1}"] = os.path.join(out_dir, f"cap{i + 1}.png")
        img.save(paths[f"cap{i + 1}"])

    img = canvas()
    icon = Image.open(ICON).convert("RGBA").resize((120, 120), Image.LANCZOS)
    img.alpha_composite(icon, (70, 150))
    paths["badge"] = os.path.join(out_dir, "badge.png")
    shadowed(img).save(paths["badge"])

    img = Image.new("RGBA", (W, H), (192, 22, 44, 235))
    d = ImageDraw.Draw(img)
    icon = Image.open(ICON).convert("RGBA").resize((300, 300), Image.LANCZOS)
    img.alpha_composite(icon, ((W - 300) // 2, 560))
    wm_f = _font(FONT_DISPLAY, 150, 800)
    tw = d.textlength("ameei", font=wm_f)
    d.text(((W - tw) / 2, 880), "ameei", font=wm_f, fill=COL["chalk"])
    tag_f = _font(FONT_DISPLAY, 50, 400)
    tag = "Crunch with a little bit of spice."
    d.text(((W - d.textlength(tag, font=tag_f)) / 2, 1070), tag, font=tag_f, fill=COL["amber"])
    cta_f = _font(FONT_BODY, 34, 700)
    cta = c["cta"].upper()
    cw = d.textlength(cta, font=cta_f) + 90
    cy = 1190
    _rounded(d, ((W - cw) / 2, cy, (W + cw) / 2, cy + 84), 42, COL["chalk"])
    d.text(((W - cw) / 2 + 45, cy + 23), cta, font=cta_f, fill=COL["crimson_deep"])
    paths["end"] = os.path.join(out_dir, "end.png")
    img.save(paths["end"])
    return paths


# ───────────────────────── edit ─────────────────────────
def probe_duration(ff, path):
    out = subprocess.run([ff, "-i", path], capture_output=True, text=True, errors="replace").stderr
    h, m, s = out.split("Duration: ")[1].split(",")[0].split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)


def assemble(c, clips, music, out_path, work_dir):
    ff = ffmpeg()
    ov = make_overlays(c, os.path.join(work_dir, "overlays"))
    n = len(clips)
    durs = [min(CLIP_KEEP, probe_duration(ff, p)) for p in clips]
    inputs, parts = [], []
    for i, p in enumerate(clips):
        inputs += ["-i", p]
        pad = f",tpad=stop_mode=clone:stop_duration={HOLD}" if i == n - 1 else ""
        parts.append(f"[{i}:v]trim=0:{durs[i]:.3f},setpts=PTS-STARTPTS,fps={FPS},"
                     f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},setsar=1,format=yuv420p{pad}[v{i}]")
        parts.append(f"[{i}:a]atrim=0:{durs[i]:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo[a{i}]")
    durs[-1] += HOLD
    prev_v, prev_a, offset, starts = "v0", "a0", 0.0, [0.0]
    for i in range(1, n):
        offset += durs[i - 1] - XFADE
        starts.append(offset)
        parts.append(f"[{prev_v}][v{i}]xfade=transition=fade:duration={XFADE}:offset={offset:.3f}[x{i}]")
        parts.append(f"[{prev_a}][a{i}]acrossfade=d={XFADE}:c1=tri:c2=tri[ax{i}]")
        prev_v, prev_a = f"x{i}", f"ax{i}"
    total = offset + durs[-1]
    end_start = total - HOLD - 0.3

    idx = n
    ov_order = [("badge", 0, end_start), ("hook", 0.3, starts[1] + 0.2 if n > 1 else total)]
    for i in range(n):
        s = starts[i] + (1.2 if i == 0 else 0.3)
        e = (starts[i + 1] + 0.2) if i + 1 < n else end_start
        ov_order.append((f"cap{i + 1}", s, e))
    ov_order.append(("end", end_start, total + 1))
    cur = prev_v
    for name, s, e in ov_order:
        inputs += ["-loop", "1", "-framerate", str(FPS), "-i", ov[name]]
        if name == "end":
            fade = f",fade=t=in:st={s:.3f}:d=0.35:alpha=1"
        elif name == "hook":
            fade = f",fade=t=in:st={s:.3f}:d=0.25:alpha=1,fade=t=out:st={e - 0.25:.3f}:d=0.25:alpha=1"
        else:
            fade = f",fade=t=in:st={s:.3f}:d=0.2:alpha=1,fade=t=out:st={e - 0.2:.3f}:d=0.2:alpha=1"
        parts.append(f"[{idx}:v]format=rgba,setpts=PTS-STARTPTS{fade}[o{idx}]")
        parts.append(f"[{cur}][o{idx}]overlay=0:0:enable='between(t,{s:.3f},{e:.3f})':format=auto[c{idx}]")
        cur = f"c{idx}"
        idx += 1
    parts.append(f"[{cur}]fade=t=out:st={total - 0.4:.3f}:d=0.4,format=yuv420p[vout]")

    if music:
        inputs += ["-i", music]
        parts.append(f"[{idx}:a]atrim=0:{total:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
                     f"volume=0.32,afade=t=in:st=0:d=0.6,afade=t=out:st={total - 1.6:.3f}:d=1.6[mus]")
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
    subprocess.run([ff, "-y", "-v", "error", "-i", out_path, "-vf", "fps=1,scale=270:-1,tile=8x2", "-frames:v", "1", sheet],
                   capture_output=True)
    return total


def edit_concept(c, rnd, clips, music, keyframes, rdir, label=None):
    """Assemble into out/pending and write meta. Returns the file name."""
    os.makedirs(PENDING, exist_ok=True)
    name = f"ameei_r{rnd:02d}_{c['id']}.mp4"
    out_path = os.path.join(PENDING, name)
    total = assemble(c, clips, music, out_path, os.path.join(rdir, "edit", c["id"]))
    meta = {"round": rnd, "concept": c, "clips": clips, "music": music,
            "keyframes": {f"shot{i + 1}": keyframes.get(key(c["id"], i)) for i in range(len(c["shots"]))},
            "duration_s": round(total, 2), "made": datetime.now().isoformat(timespec="seconds"), "label": label}
    with open(os.path.splitext(out_path)[0] + ".json", "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)
    log(f"EDITED {name} ({total:.1f}s) -> pending")
    return name


def _move_video(name, dst_dir, reason=None):
    os.makedirs(dst_dir, exist_ok=True)
    base = os.path.splitext(name)[0]
    stamp = datetime.now().strftime("%m%d_%H%M")
    for ext in (".mp4", ".json", "_frames.jpg"):
        src = os.path.join(PENDING, base + ext)
        dst = os.path.join(dst_dir, base + ext)
        if os.path.exists(src):
            if os.path.exists(dst):  # keep the earlier version instead of overwriting it
                sup = os.path.join(OUT, "superseded")
                os.makedirs(sup, exist_ok=True)
                shutil.move(dst, os.path.join(sup, f"{base}_{stamp}{ext}"))
            shutil.move(src, dst)
    if reason:
        with open(os.path.join(dst_dir, base + ".reason.txt"), "w", encoding="utf-8") as f:
            f.write(reason + "\n")


def stage_final(tag, names, unreviewed_upstream=False):
    """Final gate on pending videos. Returns list of approved names (now in out/)."""
    if not names:
        return []
    d = gate(f"{tag}_final", {
        "stage": "final", "videos": {n: os.path.join(PENDING, n) for n in names},
        "sheets": {n: os.path.join(PENDING, os.path.splitext(n)[0] + "_frames.jpg") for n in names},
        "unreviewed_upstream": unreviewed_upstream,
        "how": "approve file names that are publishable; reject with a reason. Check: spelling of hook, eyebrow, captions "
               "and CTA; hook legibility; caption timing; end card; transitions; nothing with text/logos slipped through.",
    })
    approved = []
    if d is None:
        for n in names:
            _move_video(n, UNREVIEWED, "no reviewer decision at the final gate")
        log(f"{tag}: {len(names)} video(s) quarantined in out/unreviewed")
        return approved
    for n in d.get("approve") or []:
        if n in names:
            _move_video(n, OUT if not unreviewed_upstream else UNREVIEWED)
            approved.append(n)
    for n, reason in (d.get("reject") or {}).items():
        if n in names:
            _move_video(n, REJECTED, str(reason))
            log(f"REJECTED {n}: {reason}")
    for n in names:
        if n not in approved and n not in (d.get("reject") or {}):
            _move_video(n, UNREVIEWED, "not mentioned in final decision")
    log(f"{tag}: approved {approved}")
    return approved


# ───────────────────────── round ─────────────────────────
def do_round(state, batch_size, dry=False):
    rnd = state["round"] + 1
    start = state["next_concept"]
    batch = [CONCEPTS[(start + i) % len(CONCEPTS)] for i in range(batch_size)]
    base_seed = rnd * 10000
    tag = f"r{rnd:02d}"
    rdir_rel = f"{WORK_REL}/{tag}"
    rdir = os.path.join(WAN, rdir_rel.replace("/", os.sep))
    os.makedirs(rdir, exist_ok=True)
    log(f"=== ROUND {rnd}: {[c['id'] for c in batch]} ===")
    t_round = time.time()

    # 0. concept gate: script, hook, captions, CTA reviewed before any GPU time
    if not dry:
        d = gate(f"{tag}_concepts", {
            "stage": "concepts",
            "concepts": {c["id"]: {"product": c["product"], "hook": c["hook"], "cta": c["cta"], "genre": c["genre"],
                                   "captions": [s["caption"] for s in c["shots"]],
                                   "image_prompts": [s["image"] for s in c["shots"]],
                                   "video_prompts": [s["video"] for s in c["shots"]]} for c in batch},
            "how": "approve concept ids whose hook/captions/CTA are correct (spelling, claims per voice.md, US audience, "
                   "pocket-snack angle) and whose prompts are safe (no brands/logos/text). reject with a reason; "
                   "rejected concepts are skipped this round.",
        })
        if d is not None:
            rej = d.get("reject") or {}
            for cid, why in rej.items():
                log(f"CONCEPT REJECTED {cid}: {why}")
            batch = [c for c in batch if c["id"] not in rej and c["id"] in (d.get("approve") or [c["id"]])]
            if not batch:
                log(f"{tag}: no concepts approved, skipping round")
                state["round"] = rnd
                state["next_concept"] = (start + batch_size) % len(CONCEPTS)
                save_state(state)
                return []
    img_prompts = {key(c["id"], i): s["image"] + NO_BRAND for c in batch for i, s in enumerate(c["shots"])}
    vid_prompts = {key(c["id"], i): s["video"] for c in batch for i, s in enumerate(c["shots"])}

    kfs, unrev_kf = stage_keyframes(tag, rdir_rel, img_prompts, base_seed, dry)
    if dry:
        kfs = {k: os.path.join(WAN, "test", "h3", "images", "04_sparklers_h3.jpg") for k in img_prompts}
    clips, unrev_clips = stage_clips(tag, rdir_rel, vid_prompts, kfs, base_seed, dry)
    music = stage_music(tag, rdir_rel, batch, base_seed, dry)

    made = []
    if not dry:
        for c in batch:
            cl = [clips.get(key(c["id"], i)) for i in range(len(c["shots"]))]
            if any(x is None for x in cl):
                log(f"SKIP {c['id']}: clips missing {[i + 1 for i, x in enumerate(cl) if x is None]}")
                continue
            try:
                made.append(edit_concept(c, rnd, cl, music.get(c["id"]), kfs, rdir))
            except Exception as e:
                log(f"EDIT FAILED {c['id']}: {e}")
        approved = stage_final(tag, made, unrev_kf or unrev_clips)
    else:
        approved = []
    state["round"] = rnd
    state["next_concept"] = (start + batch_size) % len(CONCEPTS)
    state["done"] += approved
    save_state(state)
    log(f"=== ROUND {rnd} finished in {(time.time() - t_round) / 60:.1f} min, approved: {approved} (total {len(state['done'])}) ===")
    return approved


def loop():
    state = load_state()
    log("LOOP START (create ads/STOP to stop after the current stage)")
    while True:
        if stop_requested():
            log("STOP file found. Exiting loop.")
            return
        batch_size = 2 if state["round"] == 0 else 3
        try:
            do_round(state, batch_size)
        except Exception:
            log("ROUND CRASHED:\n" + traceback.format_exc())
            state = load_state()
            state["round"] += 1
            save_state(state)
            time.sleep(30)


# ───────────────────────── repair / re-edit of existing videos ─────────────────────────
def _find_meta(rnd, cid):
    base = f"ameei_r{rnd:02d}_{cid}.json"
    for d in (OUT, PENDING, REJECTED, UNREVIEWED):
        p = os.path.join(d, base)
        if os.path.exists(p):
            with open(p, encoding="utf-8") as f:
                return json.load(f), p
    raise FileNotFoundError(base)


def reedit(rnd, cids):
    names = []
    tag = f"r{rnd:02d}_reedit_{datetime.now():%H%M}"
    for cid in cids:
        meta, _ = _find_meta(rnd, cid)
        c = concept(cid)
        kfs = {key(cid, i): meta["keyframes"].get(f"shot{i + 1}") for i in range(len(c["shots"]))}
        kfs = {k: (os.path.join(WAN, v.replace("/", os.sep)) if v and not os.path.isabs(v) else v) for k, v in kfs.items()}
        rdir = os.path.join(WORK, f"r{rnd:02d}")
        names.append(edit_concept(c, rnd, meta["clips"], meta.get("music"), kfs, rdir, label="reedit"))
    return stage_final(tag, names)


def repair(rnd, cid, shots, kf_prompt_add=None):
    """shots: list of 1-based shot numbers. Re-roll keyframes if kf_prompt_add is not None, re-render clips, re-edit."""
    meta, _ = _find_meta(rnd, cid)
    c = concept(cid)
    tag = f"r{rnd:02d}_fix_{cid}_{datetime.now():%H%M}"
    rdir_rel = f"{WORK_REL}/r{rnd:02d}"
    rdir = os.path.join(WAN, rdir_rel.replace("/", os.sep))
    base_seed = rnd * 10000 + 3000 + (int(time.time()) % 7) * 10000  # avoid colliding with earlier seeds
    keys = [key(cid, s - 1) for s in shots]
    kfs = {}
    for i in range(len(c["shots"])):
        v = meta["keyframes"].get(f"shot{i + 1}")
        if v:
            kfs[key(cid, i)] = v if os.path.isabs(v) else os.path.join(WAN, v.replace("/", os.sep))
    unrev = False
    if kf_prompt_add is not None:
        img_prompts = {k: c["shots"][unkey(k)[1]]["image"] + NO_BRAND + " " + kf_prompt_add for k in keys}
        new_kfs, unrev = stage_keyframes(tag, rdir_rel, img_prompts, base_seed)
        kfs.update(new_kfs)
    vid_prompts = {k: c["shots"][unkey(k)[1]]["video"] for k in keys}
    new_clips, unrev2 = stage_clips(tag, rdir_rel, vid_prompts, kfs, base_seed)
    clips = list(meta["clips"])
    for k, p in new_clips.items():
        clips[unkey(k)[1]] = p
    missing = [k for k in keys if k not in new_clips]
    if missing:
        log(f"REPAIR {cid}: still no clean clip for {missing}; not re-editing")
        return []
    name = edit_concept(c, rnd, clips, meta.get("music"), kfs, rdir, label=f"repair shots {shots}")
    return stage_final(tag, [name], unrev or unrev2)


def repair_many(specs, tag=None, base_seed=None):
    """specs: [(rnd, cid, [shots], kf_prompt_add or None)]. One keyframe job + one clip job for all, then edit each.
    Pass the earlier tag + base_seed (and set AMEEI_RESUME=1) to resume a run that died: rendered files and
    gate decisions are reused."""
    stamp = datetime.now().strftime("%m%d_%H%M")
    tag = tag or f"fix_{stamp}"
    rdir_rel = f"{WORK_REL}/{tag}"
    rdir = os.path.join(WAN, rdir_rel.replace("/", os.sep))
    os.makedirs(rdir, exist_ok=True)
    base_seed = base_seed or 900000 + (int(time.time()) % 50) * 10000
    metas, kfs, img_prompts, vid_prompts = {}, {}, {}, {}
    specs = [tuple(s) + (None,) * (6 - len(s)) for s in specs]   # (rnd, cid, shots, kf_add, vid_add, kf_override)
    for rnd, cid, shots, kf_add, vid_add, kf_override in specs:
        meta, _ = _find_meta(rnd, cid)
        metas[cid] = (rnd, meta)
        c = concept(cid)
        for i in range(len(c["shots"])):
            v = meta["keyframes"].get(f"shot{i + 1}")
            if v:
                kfs[key(cid, i)] = v if os.path.isabs(v) else os.path.join(WAN, v.replace("/", os.sep))
        for s in shots:
            k = key(cid, s - 1)
            if kf_override and str(s) in kf_override:        # {"3": "<abs path of a reviewed keyframe>"}
                kfs[k] = kf_override[str(s)]
            elif kf_add is not None:
                img_prompts[k] = c["shots"][s - 1]["image"] + NO_BRAND + " " + kf_add
            vid_prompts[k] = c["shots"][s - 1]["video"] + ((" " + vid_add) if vid_add else "")
    unrev = False
    if img_prompts:
        new_kfs, unrev = stage_keyframes(tag, rdir_rel, img_prompts, base_seed)
        kfs.update(new_kfs)
    new_clips, unrev2 = stage_clips(tag, rdir_rel, vid_prompts, kfs, base_seed)
    names = []
    for rnd, cid, shots, _, _, _ in specs:
        c = concept(cid)
        meta = metas[cid][1]
        clips = list(meta["clips"])
        ok = True
        for s in shots:
            k = key(cid, s - 1)
            if k in new_clips:
                clips[s - 1] = new_clips[k]
            else:
                ok = False
        if not ok:
            log(f"REPAIR {cid}: no clean clip for all of shots {shots}; not re-editing")
            continue
        try:
            names.append(edit_concept(c, rnd, clips, meta.get("music"), kfs, rdir, label=f"repair shots {shots}"))
        except Exception as e:
            log(f"EDIT FAILED {cid}: {e}")
    return stage_final(tag, names, unrev or unrev2)


def test_edit():
    ff = ffmpeg()
    src = os.path.join(WAN, "test", "h3", "videos", "04_sparklers_h3.mp4")
    music = sorted(glob.glob(os.path.join(WAN, "test", "diwali", "music", "*.wav")))
    work = os.path.join(ADS, "_test")
    os.makedirs(work, exist_ok=True)
    out = os.path.join(work, "test_edit.mp4")
    total = assemble(CONCEPTS[0], [src, src, src], music[0] if music else None, out, work)
    print("wrote", out, f"{total:.1f}s")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "loop"
    if mode == "loop":
        loop()
    elif mode == "dry":
        do_round(load_state(), 2, dry=True)
    elif mode == "test-edit":
        test_edit()
    elif mode == "reedit":
        rnd = int(sys.argv[2])
        if sys.argv[3] == "all":
            cids = [c["id"] for c in CONCEPTS if any(os.path.exists(os.path.join(d, f"ameei_r{rnd:02d}_{c['id']}.json"))
                                                    for d in (OUT, PENDING, REJECTED, UNREVIEWED))]
        else:
            cids = sys.argv[3].split(",")
        print(reedit(rnd, cids))
    elif mode == "repair":
        rnd, cid, shots = int(sys.argv[2]), sys.argv[3], [int(x) for x in sys.argv[4].split(",")]
        kf_add = None
        if "--kf" in sys.argv:
            kf_add = sys.argv[sys.argv.index("--kf") + 1]
        print(repair(rnd, cid, shots, kf_add))
    elif mode == "repairs":
        # python pipeline.py repairs specs.json   with [[rnd, cid, [shots], kf_prompt_add|null], ...]
        with open(sys.argv[2], encoding="utf-8") as f:
            specs = [(int(s[0]), s[1], [int(x) for x in s[2]], *s[3:]) for s in json.load(f)]
        tag = sys.argv[3] if len(sys.argv) > 3 else None
        base_seed = int(sys.argv[4]) if len(sys.argv) > 4 else None
        print(repair_many(specs, tag, base_seed))
