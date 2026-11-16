"""Rebuild meta JSONs for rounds whose clips were rendered but never edited (gate timeouts).

  python salvage.py r07 r08 ...      -> writes out/unreviewed/ameei_r##_<cid>.json for every concept whose
                                        clips exist, so `pipeline.py reedit` / `repairs` can work on them.
                                        Prints the clip/music mapping it found.
"""
import glob
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pipeline as pl  # noqa: E402


def salvage(tag):
    rdir = os.path.join(pl.WORK, tag)
    rnd = int(tag[1:]) if tag.startswith("r") and tag[1:].isdigit() else 0
    clips = {}  # (cid, shot_idx) -> path (latest attempt wins)
    for job in sorted(glob.glob(os.path.join(rdir, "clips", "*_clips_a*_job.json"))):
        for t in json.load(open(job, encoding="utf-8")):
            base = os.path.basename(t["image_start"])            # <cid>_shot<k>.jpg
            cid, shot = base[:-4].rsplit("_shot", 1)
            m = glob.glob(os.path.join(rdir, "clips", f"*_seed{t['seed']}_*.mp4"))
            if m:
                clips[(cid, int(shot) - 1)] = m[0]
            print(f"{os.path.basename(job)[:-9]:28} seed {t['seed']}  {cid}:{shot}  {'OK' if m else 'MISSING'}")
    music = {}
    for job in glob.glob(os.path.join(rdir, "music", "*_music_job.json")):
        tasks = json.load(open(job, encoding="utf-8"))
        batch_ids = [c["id"] for c in pl.CONCEPTS if any(c["music"] in t["prompt"] for t in tasks)]
        for t in tasks:
            cid = next((c["id"] for c in pl.CONCEPTS if t["prompt"].startswith(c["music"])), None)
            m = glob.glob(os.path.join(rdir, "music", f"*_seed{t['seed']}_*"))
            if cid and m:
                music[cid] = m[0]
            print(f"music seed {t['seed']}  {cid}  {'OK' if m else 'MISSING'}")
    os.makedirs(pl.UNREVIEWED, exist_ok=True)
    written = []
    for cid in sorted({k[0] for k in clips}):
        c = pl.concept(cid)
        cl = [clips.get((cid, i)) for i in range(len(c["shots"]))]
        kfs = {f"shot{i + 1}": os.path.join(rdir, "kf", f"{cid}_shot{i + 1}.jpg") for i in range(len(c["shots"]))}
        meta = {"round": rnd, "concept": c, "clips": cl, "music": music.get(cid), "keyframes": kfs,
                "salvaged_from": tag, "note": "rebuilt by salvage.py; clips not yet reviewed"}
        p = os.path.join(pl.UNREVIEWED, f"ameei_r{rnd:02d}_{cid}.json")
        with open(p, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)
        written.append(os.path.basename(p))
        print(f"  -> {os.path.basename(p)}  clips {[bool(x) for x in cl]}  music {bool(music.get(cid))}")
    return written


if __name__ == "__main__":
    for tag in sys.argv[1:]:
        print(f"=== {tag}")
        salvage(tag)
