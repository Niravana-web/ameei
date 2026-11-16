# ameei — commerce setup (read this when you wake up)

Everything is built and the build/tests pass. The code can't fabricate your
Clerk and Stripe accounts, so there are a few keys to paste. ~10 minutes.

## 1. Paste real keys into `.env.local`

`.env.local` currently has format-valid **placeholders** so the app builds. Replace:

| Var | Where to get it |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | dashboard.clerk.com → your app → API keys |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API keys (use **test** key first) |
| `STRIPE_WEBHOOK_SECRET` | from `stripe listen` (step 4) or a Dashboard webhook endpoint |

`DATABASE_URL` and `NEXT_PUBLIC_SITE_URL` are already fine for local dev.

## 2. Make yourself an admin

The admin panel checks `publicMetadata.role === "admin"` on your Clerk user.

1. Run the app, go to `/sign-up`, create your account.
2. Clerk Dashboard → Users → your user → **Edit public metadata** → save:
   ```json
   { "role": "admin" }
   ```
3. Visit `/admin`. Product CRUD + orders live there.

> Optional optimization: add a session-token claim `{"metadata":"{{user.public_metadata}}"}`
> in Clerk → Sessions, so the role can be checked in `proxy.ts` (middleware) without a
> per-request user fetch. Not required — the admin layout already enforces the role server-side.

## 3. Database (already seeded)

```bash
npm run db:push    # apply schema (already done)
npm run db:seed    # load the 9 products (already done)
npm run db:studio  # browse/edit data in a GUI
```

Local dev uses **SQLite** (`dev.db`). **For production (Vercel's filesystem is
ephemeral)** switch to Postgres: in `prisma/schema.prisma` set
`provider = "postgresql"`, set `DATABASE_URL` to your Postgres URL, swap the adapter
in `src/lib/prisma.ts` to `@prisma/adapter-pg`, then `npm run db:push && npm run db:seed`.

## 4. Test a real payment locally

```bash
# terminal 1
npm run dev
# terminal 2 — forwards Stripe events and prints the webhook signing secret
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Put that printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`, restart dev. Then add a
product to cart → Checkout → pay with card `4242 4242 4242 4242` (any future expiry/CVC).
You'll land on `/order/success`; the order shows as **paid** in `/admin/orders`.

## What was built

- **Catalog → DB.** Products now live in the database (`prisma/schema.prisma`); the
  static array became the seed. Pricing moved from one flat price to **per-weight prices**.
- **Admin CMS** at `/admin` — product list, create/edit/delete (server actions + Zod
  validation), read-only orders. Role-gated.
- **Auth** via Clerk — sign-in/up pages, header account button, `/admin` protected in
  `src/proxy.ts` (Next 16 renamed `middleware` → `proxy`).
- **Cart** — client context + `localStorage`, header badge, `/cart` page.
- **Stripe hosted Checkout** — `/api/checkout` (prices server-side from the DB, never
  trusts the client), `/order/success`, and a signature-verified webhook at
  `/api/webhooks/stripe` that records paid orders.

`npm test` runs the money-path check (server pricing ignores client-supplied prices).
