# ameei Meta ads: first campaign (drafted 2026-11-16)

Ad account: **ameei** (ID 29800462462894336), Niravana portfolio, USD, Eastern Time. Payment method: to be added by Lokesh.

## Campaign 1: "ameei · Engagement · US · Nov 2026"
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
- [~] Domain ameei.in added (ID 1465907779006540); meta tag is in web/src/app/layout.tsx, NOT deployed yet. After deploy: Business settings → Domains → ameei.in → Verify domain.
- [~] Pixel/dataset "ameei" created (ID 2866828870386268); base code is in web/src/app/layout.tsx, NOT deployed yet. Advanced matching off.
- [ ] Review ad previews for cut-off hooks on 4:5 / 1:1 placements; keep 9:16 only if cropping hurts.
- [ ] Claims in primary text follow design-system/guidelines/voice.md (no "healthy" as a nutrient claim without a fact next to it).

## Also done 2026-11-16 (pre-launch)
- Instagram bio rewritten to the healthy-snack positioning (web edit; name and action buttons need the mobile app).
- Website Instagram link fixed in web/src/lib/site.ts (was ameei.snacks, handle is ameei_snacks).
- Newsletter form on the site was a dead form; now posts to /api/newsletter and stores to a new `Subscriber` table (needs `npm run db:push` on the production DB before deploy).
- Lead form "ameei heat ladder sample list" saved as a DRAFT in Business Suite → Lead ads forms → Draft forms (email, full name, ZIP, heat level, where you snack; privacy https://www.ameei.in/privacy; ending links to /shop). Not created/published.
- Keyword comment-to-DM automation and 5 saved replies live (see crm/outreach_playbook.md).

## Still open before spend
- Deploy web/ (pixel + domain tag + IG link + newsletter) and run the Subscriber migration, then click Verify domain.
- Decide the first-pouch offer code promised in the DM/lead-form copy (currently "first-pouch code": create a 15% code in the store or change the copy).
- Reply to the July collaboration DMs (two US bloggers) with a sample offer.
- Test the HEAT comment automation from a second account.
