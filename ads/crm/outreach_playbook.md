# ameei manual outreach playbook (US, from 2026-11-16)

CRM file: `ameei_crm.csv` (open in Excel or Google Sheets; one row per person). Stages: `engaged` → `dm_sent` → `email_captured` → `sampled` → `bought` → `repeat`. Mark `lost` instead of deleting.

Always: reply in the first person as ameei, lowercase brand name, one short joke max, US spelling, never "healthy" without a fact next to it (voice.md). Never text (SMS) anyone who has not opted in. Emails carry an unsubscribe line and the postal address.

## Sources and what to log
| Where they came from | Log as `how_found` | What you can capture |
|---|---|---|
| Comment on a reel | `commented <keyword or text>` | handle, the reel, their words |
| Reply to the keyword DM | `dm_keyword` | handle, email (if they answer), heat preference |
| Shared or saved the reel (visible in insights, not by name) | n/a | count only |
| Link-in-bio email box | `bio_email` | email, first name |
| Giveaway form | `giveaway_<month>` | name, email, ZIP, heat level |
| Packaging QR form | `qr_pouch` | name, email, product bought, rating |
| Wholesale / office form | `b2b_form` | company, role, headcount |

## DM cadence (manual, copy and personalise the first line every time)

**Day 0, reply to the comment publicly (within an hour)**
> ha, {something about their comment}. check your DMs 👀

**Day 0, first DM (within the hour)**
> hey {first name or handle}! thanks for stopping on the {reel topic} reel. quick one: what's your heat, zero, medium, or "handle with respect"? I'll send you the right mix.

**Day 0, if they answer the heat question**
> {heat} it is. we're a small-batch roaster, nothing fried, nothing artificial, 8 oz pouch that fits in a pocket. want 15% off your first pouch? use FIRSTPOUCH at checkout on ameei.in (first order only). drop your email and I'll send the heat ladder too.

**Day 2, if no reply**
> no pressure, just leaving the heat ladder here: Straight Shooter (no chili) → Everyday Medium → Extra Hot Trail. roasted, never fried. ameei.in if you get curious.

**Day 7, after a purchase ships**
> your pouch should have landed. honest question: did you finish it in one sitting? (most people do.) anything we should fix?

**Day 30, reorder nudge**
> it's been a month since the {product}. same again, or ready to climb a rung on the heat ladder? reply "same" or "hotter" and I'll send a code.

**Wholesale / office lead, same day**
> thanks for asking about ameei for {company}. we do 8 oz pouches in cases of 12, roasted to order. how many people are you snacking for, and which city? I'll send a sample box.

## Weekly 30-minute routine
1. Open Instagram insights for each paid reel: note comments, shares, saves in `reel_log` below.
2. Reply to every new comment; DM every new commenter and every new follower who engaged.
3. Move rows along stages; set `next_action_date`.
4. Count per `source_reel`: engaged → email_captured → bought. The reel with the best email rate gets next month's budget.

## reel_log (fill weekly)
| week | reel | spend | reach | comments | shares | saves | DMs opened | emails captured | orders |
|---|---|---|---|---|---|---|---|---|---|
| 2026-11-16 | carry_on | 0 | | | | | | | |
| 2026-11-16 | host_gift | 0 | | | | | | | |

## Lead form draft (Meta instant form, build when budget allows)
- Form name: ameei heat ladder sample list
- Intro: "Tell us your heat level and we'll send the right mix first. Roasted, never fried."
- Questions: Full name, Email, ZIP code (prefilled); custom: "Which heat level are you?" (No chili / Medium / Extra hot), "Where do you snack most?" (Desk / Car / Gym / Trail / Couch).
- Privacy policy URL: https://ameei.in/privacy (confirm the page exists before launching).
- Thank-you: "You're on the list. Use FIRSTPOUCH at ameei.in for 15% off your first pouch."

## Set up in Business Suite on 2026-11-16
- Automation "Heat ladder keyword DM" (Comment to message, Instagram + Messenger, ON). Keywords: heat, spicy, ladder, link, where to buy, price, order, sample, recipe. Public reply: "check your DMs, sent you the heat ladder". DM asks for their heat level and points to ameei.in.
- Saved replies (type the shortcut in the inbox reply box): `heat`, `buy`, `ship`, `thanks`, `wholesale`. `buy` names the FIRSTPOUCH code.
- Offer code: **FIRSTPOUCH**, 15% off, first order only, no minimum, no expiry (Stripe coupon `firstpouch15`, created 2026-11-16 in both TEST and LIVE mode via web/scripts/make_firstpouch_code.py). Checkout shows an "Add promotion code" box.
- Automation list: Business Suite → Inbox → Automations. Saved replies: inbox reply box → speech-bubble icon → Manage.
