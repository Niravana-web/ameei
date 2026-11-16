# ameei ad loop

Unattended pipeline that keeps producing ~15 s Instagram Reels (9:16, 1080×1920) for ameei from the local Wan2GP setup.

| | |
|---|---|
| **Finished videos** | `out/ameei_r##_<concept>.mp4` plus `_frames.jpg` (contact sheet) and `.json` (prompts, clips, keyframes used) |
| **Stop** | create an empty file named `STOP` in this folder. The loop exits after the current stage (a running H3 batch is not interrupted). |
| **Log** | `pipeline.log` (one line per stage with timings), `loop_stdout.txt` |
| **Working files** | `C:\Users\SRI\Documents\Wan2GP\outputs\ameei\r##\` → `kf\` keyframes (both seeds + picked `<concept>_shot#.jpg`), `clips\`, `music\`, `edit\` overlays, job JSONs and WanGP logs |
| **Concepts** | `concepts.py` — hook, 3 shots (image prompt, video prompt, caption), music style, CTA. Add more; the loop cycles through them with new seeds. |
| **State** | `state.json` — round counter and next concept. Delete to start again from concept 1. |

## Pipeline per round (2 concepts first round, then 3)

1. **Keyframes** — P-H3-Image (`minimax_h3_image`), 2176×3872, 8 steps, 2 seeds per shot (~65 s each). Best seed picked by a sharpness/exposure heuristic.
2. **Clips** — MiniMax H3 FL2VA Pruned (`minimax_h3_fl2va_pruned`), start image, 720×1280, 124 frames, 20 steps, generated sound (~14 min each; model load ~13 min once per batch).
3. **Music** — Stable Audio 3 Small, 18 s instrumental per concept.
4. **Edit** — ffmpeg: 3 clips × 4.7 s, 0.4 s dissolves, 1.3 s end-card hold; overlays (icon badge, product eyebrow + Fraunces hook, DM Sans captions, crimson end card with CTA); H3 sound over the music bed at −10 dB, loudnorm −14 LUFS.

Expect roughly **1 video per hour** at these settings.

## Commands (run with the wan2gp python)

```
C:\Users\SRI\miniconda3\envs\wan2gp\python.exe pipeline.py loop        # start the loop
C:\Users\SRI\miniconda3\envs\wan2gp\python.exe pipeline.py dry         # validate job files only
C:\Users\SRI\miniconda3\envs\wan2gp\python.exe pipeline.py test-edit   # check overlays with old test clips
```
