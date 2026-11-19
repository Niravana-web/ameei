# ameei Meta ads: first campaign (drafted 2026-11-16)

Ad account: **ameei** (ID 29800462462894336), Niravana portfolio, USD, Eastern Time. Payment method: to be added by Lokesh.

## Campaign 1: "ameei - Engagement - US profile - month 1" (DRAFT in Ads Manager, built 2026-11-16, not published)
IDs: campaign 120251608426960361 · ad set 120251608426970361 · ads 120251608426980361 (carry_on, existing IG post) and 120251608550430361 (host_gift, uploaded video). Settings as built: Engagement → conversion location Instagram or Facebook, performance goal Instagram profile visits, highest volume, lifetime $75, 1 Dec to 31 Dec 2026 (EST), Advantage+ audience with hard controls US + min age 22, suggestions age 22-45 + interests hiking trails / KIND Healthy Snacks / snack mix, placements Instagram Reels + Facebook Reels only, pixel ameei tracked, AI-media disclosure ticked on both ads, CTA Visit Instagram profile. Not set: ad scheduling (6 am to 11 pm) because the lifetime-budget dayparting toggle was left off; add before publishing if wanted.
- Objective: Engagement, conversion location Instagram profile / post engagement (grow @ameei_snacks).
- Buying type: Auction. Budget: **$75 lifetime** for the ad set, 30 days (about $2.50/day; Meta paces it and can spend more on strong days). Monthly cap = total spend, no surprise overspend. Review at day 10 and day 20.
- Special ad categories: none.

### Ad set: "US 22-45 healthy snackers"
- Location: United States (people living in).
- Age 22 to 45, all genders, English.
- Detailed targeting (Advantage detailed targeting on): healthy snacks, trail mix, snack foods, hiking, gym / fitness, road trips, Whole Foods Market.
- Placements: Advantage+ placements, but keep only Instagram Reels, Instagram Feed, Instagram Explore, Facebook Reels (9:16 creative).
- Optimisation: post engagement (ThruPlay not available for engagement to profile). Schedule: start on payment method approval.

### Ads: only 2, so the budget actually teaches something (use existing posts so likes accumulate on the organic reel)
1. carry_on (live reel) · hook "TSA-proof. Gate-ready. 8 ounces." · primary text = reel caption.
2. host_gift · "Stop bringing wine. Bring this." (holiday season fit for late Nov / Dec).
Swap the weaker one out at day 10 for airplane or commute_train.

### Spend-wisely rules at $75/month
- One campaign, one ad set, two ads. Do not split into more ad sets.
- Lifetime budget, not daily: $2.50/day is below Meta's comfortable daily minimum for action-optimised ad sets, lifetime pacing avoids the floor and the "learning limited" churn.
- Placements: Instagram Reels + Facebook Reels only (cheapest reach for 9:16 video), no Audience Network, no Messenger.
- Optimise for post engagement (cheapest result for a new account); switch to profile visits or traffic only after there is a pixel and a US store URL.
- Dayparting: run ad set schedule 6 am to 11 pm Eastern only (requires lifetime budget), no 1 to 5 am spend.
- Kill rule at day 10: pause any ad with cost per engagement over 2x the other.

Call to action: Follow (profile) / Learn more → https://ameei.in (placeholder until the US store URL is confirmed).

## Before launch checklist
- [x] Payment method added: Visa ····5142, USD, US billing. Monthly account spending limit $75 (resets on the 1st).
- [x] Ameei Page confirmed for ads, phone verified (Lokesh), Account overview shows setup complete.
- [x] Domain ameei.in VERIFIED in Meta (ID 1465907779006540) on 2026-11-16 after the web/ deploy (commit 38fd8c4, Vercel root ./web).
- [x] Pixel/dataset "ameei" (ID 2866828870386268) live on www.ameei.in. Events: PageView, AddToCart (Studio), InitiateCheckout (cart), Purchase (confirmation page, eventID = Stripe session id). Verified firing on the live site 2026-11-16. Advanced matching off.
- [ ] Review ad previews for cut-off hooks on 4:5 / 1:1 placements; keep 9:16 only if cropping hurts.
- [ ] Claims in primary text follow design-system/guidelines/voice.md (no "healthy" as a nutrient claim without a fact next to it).

## Also done 2026-11-16 (pre-launch)
- Instagram bio rewritten to the healthy-snack positioning (web edit; name and action buttons need the mobile app).
- Website Instagram link fixed in web/src/lib/site.ts (was ameei.snacks, handle is ameei_snacks).
- Newsletter form on the site was a dead form; now posts to /api/newsletter and stores to a new `Subscriber` table (needs `npm run db:push` on the production DB before deploy).
- Lead form "ameei heat ladder sample list" saved as a DRAFT in Business Suite → Lead ads forms → Draft forms (email, full name, ZIP, heat level, where you snack; privacy https://www.ameei.in/privacy; ending links to /shop). Not created/published.
- Keyword comment-to-DM automation and 5 saved replies live (see crm/outreach_playbook.md).

## Still open before spend
- [x] web/ deployed; Subscriber table pushed to the remote MySQL; /api/newsletter returns 400 on bad email and honeypot, 405 on GET.
- [x] First-pouch offer code FIRSTPOUCH (15% off, first order only) created in Stripe and `allow_promotion_codes` enabled in checkout (commit 6e76158). Coupon + code also created in LIVE mode on 2026-11-16. Vercel Production now runs the live key and the live webhook secret (endpoint we_1UcR4f…, verified with a signed probe on 2026-11-16; old endpoint we_1TlCPG disabled). TESTPOUCH (100%, single use, 24 h) was used once to exercise the flow; FIRSTPOUCH confirmed on the live Stripe page at $8.50.
- Reply to the July collaboration DMs (two US bloggers) with a sample offer.
- Test the HEAT comment automation from a second account.

## Published 2026-11-16 (user: "go start now")
- Campaign 120251608426960361 / ad set 120251608426970361 published from draft at ~22:20 IST.
- Schedule changed before publish: **17 Nov 2026 11:29 EST -> 17 Dec 2026 11:29 EST** (was 1-31 Dec). $75 lifetime, standard delivery.
- Ads 120251608426980361 (carry_on existing post, caption now has HEAT line) and 120251608550430361 (host_gift upload): both "Processing" (in review), $0.00 spent at publish.
- Meta warned the account spending limit is $75 (equals the lifetime budget). Left unchanged on purpose: it is the hard cap. Raise it only if the budget is raised.
- Declined the Meta AI "ad variations" prompt.
- Still open: add each new reel as an existing-post ad as it publishes (swap the weakest weekly); optional dayparting; Advertiser/Payer fields not required for US.

## Paused 2026-11-19 (user: "Yes, pause and re-cut")
- Published reels after 1-3 days: carry_on 355 IG / 310 FB views, commute 15 / 158, host_gift 28 / 104. Avg play 2-4 s of 17 s; ~1 in 10 passes 3 s; 0 follows. Instagram stops distribution after a 15-30 person test.
- Ads: $4.60 spent, 69 impressions (~$67 CPM), 0 profile visits. Ad set turned OFF 2026-11-19 (toggle in Ad sets view). Campaign and ads left in place for later reuse.
- All 22 scheduled rows moved to Drafts (captions kept). Scheduled tab shows "Failed to publish" ghosts; Drafts tab lists all 22.
- Diagnosis: v2 cuts open on a 5 s static establishing shot under a 96 px title card; voice line at ~11 s. Fix = edit pass (recut.py): open on motion/face, voice second, small hook at t=0, ~9 s, end card 0.8 s. No GPU.
- Public FB comment on carry_on from a viewer: "AI crap." (Meta applies the AI-content label automatically.)


## Relaunched 2026-11-19 (v3 re-cuts)
- Budgets: account spending limit $75 -> $150/month; ad set lifetime budget $75 -> $150, end date unchanged (17 Dec 2026 EST), about $5.40/day for the remaining 28 days.
- Creative: host_gift ad 120251608550430361 now runs the v3 cut; new ad 120251657401420361 "carry_on reel - v3 upload" runs the v3 carry_on cut (primary text mirrors host_gift's). Old carry_on existing-post ad 120251608426980361 turned OFF (keeps its likes but no spend). Advantage+ creative recommendation declined on duplicate. AI-media disclosure re-ticked on both edited ads (the media swap clears it).
- Ad set turned ON 2026-11-19 ~23:00 IST, status Preparing.
- Organic: 14 v3 reels scheduled as new posts (IG+FB), 20 Nov to 3 Dec 18:00 ET, one per day. See publish_plan.json v3_note.
- Review on day 5 (24 Nov): hold rate (views past 3 s) on carry_on v3 vs v2 (v2 was 24 of 310 past 3 s on FB). If still under 10%, next suspect is the AI label, not the opener.
