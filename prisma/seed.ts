import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// Relative, not "@/" — seed.ts runs under bare tsx and has never relied on the
// tsconfig path alias. studio.ts is dependency-free, so it imports cleanly.
import {
  STUDIO_DEFAULT_SIZE,
  STUDIO_PRODUCT_SLUG,
  STUDIO_SIZES,
  priceMix,
  spiceLevelOf,
  type MixSelection,
} from "../src/lib/studio";

process.loadEnvFile(".env"); // tsx doesn't auto-load .env
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

const SHIPPING_DEFAULT =
  "Ships within 24 hours. Due to the perishable nature of our products, we do not accept returns. If there is an issue with your order, please contact our spice masters.";

/**
 * Every product in the range is an American Healthy Mix — a named recipe drawn
 * from the same ingredient set the Studio offers. `recipe` is that recipe, and
 * per-size prices are derived from it with the SAME priceMix() the Studio uses,
 * so a preset always costs exactly what building it by hand would cost.
 */
type Seed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Selection minus the pack size; prices are computed at each STUDIO_SIZES entry. */
  recipe: Omit<MixSelection, "weight">;
  category: string;
  badge?: string;
  image: { src: string; alt: string };
  gallery: { src: string; alt: string }[];
  ingredients: string;
  nutrition: string;
  featured?: boolean;
};

// ponytail: photography for the new range doesn't exist yet. These point at
// existing files in public/images/products so nothing 404s on the shop grid, the
// PDP, or the Stripe checkout page. Replace via /admin when real shots land.
const SEED: Seed[] = [
  {
    slug: STUDIO_PRODUCT_SLUG,
    name: "Build Your Own Mix",
    tagline: "Your mix, your rules.",
    description:
      "What is Build Your Own Mix? It's the whole American Healthy Mix range handed over to you. Start with peanuts, cashews, or almonds — take one, take all three. Add the cereals that carry the crunch: cornflakes, wheat checks, rice checks. Then decide how far you want to go with raisins, coconut flakes, rice flakes, pita chips, press, and pumpkin chips. Set your heat anywhere from no spice to extra hot, and your salt from none at all to just enough. Nothing is fried, everything is roasted, and the bag is blended the day it ships. Most people build one mix for the desk drawer and a second, hotter one for the weekend. Open the Studio, move a few switches, and watch the price update as you go — no guessing, no surprises at checkout.",
    recipe: { nuts: [], cereals: [], extras: [], spice: "medium-spice", salt: "less-salt" },
    category: "savory-mixes",
    badge: "NEW",
    featured: true,
    image: {
      src: "/images/products/hero-chivda-bowl.jpg",
      alt: "An overflowing bowl of golden snack mix surrounded by loose nuts and cereal pieces on a warm linen surface",
    },
    gallery: [
      {
        src: "/images/products/hero-chivda-bowl.jpg",
        alt: "An overflowing bowl of golden snack mix surrounded by loose nuts and cereal pieces on a warm linen surface",
      },
      {
        src: "/images/products/spicy-crunch-detail-1.jpg",
        alt: "Close-up of whole spices and chili flakes scattered across a dark textured surface",
      },
      {
        src: "/images/products/spicy-crunch-main.jpg",
        alt: "Snack mix in an elegant glass bowl catching warm afternoon light",
      },
    ],
    ingredients:
      "Whatever you choose: Peanuts, Cashews, Almonds, Cornflakes, Wheat Checks, Rice Checks, Raisins, Coconut Flakes, Rice Flakes, Pita Chips, Press, Pumpkin Chips, plus your chosen spice and salt levels. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Allergens depend on your selection. Nut and cereal options are packed in a facility that handles peanuts, tree nuts, wheat, and coconut.",
  },
  {
    slug: "straight-shooter",
    name: "The Straight Shooter",
    tagline: "No heat, no fuss, all crunch.",
    description:
      "What is The Straight Shooter? It's the mix for people who came here for the crunch, not the burn. Roasted peanuts and almonds do the heavy lifting, cornflakes and rice checks keep every handful light, and a scatter of raisins gives it just enough sweetness to keep going. There's no chili in it at all, and the salt is dialled well back — enough to taste the roast, never enough to make you reach for a glass of water. It's the bag that survives a road trip with kids in the car, the one you can leave on a shared desk without a warning label. Everything is roasted rather than fried, so the texture holds up for weeks after the pouch is opened. Start here if you're new to the range, then work your way up the heat ladder at your own pace.",
    recipe: {
      nuts: ["peanuts", "almonds"],
      cereals: ["cornflakes", "rice-checks"],
      extras: ["raisins"],
      spice: "no-spice",
      salt: "less-salt",
    },
    category: "savory-mixes",
    image: {
      src: "/images/products/cornflakes-mix.jpg",
      alt: "Golden roasted cornflakes and whole almonds tumbling from a rustic ceramic bowl",
    },
    gallery: [
      {
        src: "/images/products/cornflakes-mix.jpg",
        alt: "Golden roasted cornflakes and whole almonds tumbling from a rustic ceramic bowl",
      },
      {
        src: "/images/products/upma-mix-home.jpg",
        alt: "A pale snack mix served in a shallow bowl on a bright kitchen counter",
      },
    ],
    ingredients:
      "Roasted Peanuts, Roasted Almonds, Cornflakes, Rice Checks, Raisins, Sea Salt, Cold-Pressed Sunflower Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Peanuts and Tree Nuts (Almonds). Manufactured in a facility that also processes wheat and coconut.",
  },
  {
    slug: "everyday-medium",
    name: "Everyday Medium",
    tagline: "The one you'll finish first.",
    description:
      "What is Everyday Medium? It's the middle of the range and, predictably, the one that empties fastest. Peanuts and cashews are roasted slow until the sugars turn, then folded through cornflakes and wheat checks with raisins and pita chips for a bit of structure. The spice sits right where most people actually want it — warm across the tongue, gone by the time you reach for the next handful. Salt is deliberately restrained; the point is to taste the cashew, not the seasoning. This is the mix that goes in the pantry and gets refilled without anyone discussing it, the one that turns up in a bowl when people come over and disappears before the second round of drinks. If you only ever order one bag from us, the odds are good it ends up being this one.",
    recipe: {
      nuts: ["peanuts", "cashews"],
      cereals: ["cornflakes", "wheat-checks"],
      extras: ["raisins", "pita-chips"],
      spice: "medium-spice",
      salt: "less-salt",
    },
    category: "savory-mixes",
    badge: "BESTSELLER",
    featured: true,
    image: {
      src: "/images/products/spicy-crunch-mix.jpg",
      alt: "Snack mix of golden cornflakes and spice-dusted peanuts spilling from a rustic ceramic bowl",
    },
    gallery: [
      {
        src: "/images/products/spicy-crunch-mix.jpg",
        alt: "Snack mix of golden cornflakes and spice-dusted peanuts spilling from a rustic ceramic bowl",
      },
      {
        src: "/images/products/spicy-crunch-main.jpg",
        alt: "Premium snack mix in an elegant glass bowl with warm crimson and amber tones",
      },
      {
        src: "/images/products/spicy-crunch-detail-2.jpg",
        alt: "Close-up of a sleek minimalist bowl highlighting the crunch and texture of the mix",
      },
      {
        src: "/images/products/spicy-crunch-mix-home.jpg",
        alt: "A bowl of snack mix on a kitchen table beside a cup of coffee in morning light",
      },
    ],
    ingredients:
      "Roasted Peanuts, Roasted Cashews, Cornflakes, Wheat Checks, Raisins, Pita Chips, Red Chili, Black Pepper, Cumin, Sea Salt, Cold-Pressed Sunflower Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Peanuts, Tree Nuts (Cashews), and Wheat. Manufactured in a facility that also processes coconut.",
  },
  {
    slug: "extra-hot-trail",
    name: "Extra Hot Trail",
    tagline: "Handle with respect.",
    description:
      "What is Extra Hot Trail? It's the top of our heat ladder, built for people who treat spice as an ingredient rather than a dare. Peanuts and almonds are roasted dark, then tossed with wheat checks and rice checks and finished with pumpkin chips and pita chips for weight. The chili comes on slowly, sits at the back of the throat, and stays there — this is a long burn, not a flash. Salt is pushed up a notch to hold the heat in balance, so it eats best alongside something cold. Pack it for a hike and it'll do more work than an energy bar; leave it out at a party and you'll find out quickly who's serious. Roasted, never fried, so the crunch survives the spice. Keep a glass of something within reach on the first handful.",
    recipe: {
      nuts: ["peanuts", "almonds"],
      cereals: ["wheat-checks", "rice-checks"],
      extras: ["pita-chips", "pumpkin-chips"],
      spice: "extra-hot",
      salt: "some-salt",
    },
    category: "savory-mixes",
    badge: "NEW",
    featured: true,
    image: {
      src: "/images/products/ghost-pepper.jpg",
      alt: "A deep red, chili-dusted snack mix photographed against dramatic dark smoke",
    },
    gallery: [
      {
        src: "/images/products/ghost-pepper.jpg",
        alt: "A deep red, chili-dusted snack mix photographed against dramatic dark smoke",
      },
      {
        src: "/images/products/spicy-crunch-detail-1.jpg",
        alt: "Close-up of red chili flakes and whole spices on a dark textured surface",
      },
      {
        src: "/images/products/spicy-crunch-detail-3.jpg",
        alt: "Fiery snack mix served alongside a cold drink in warm crimson light",
      },
    ],
    ingredients:
      "Roasted Peanuts, Roasted Almonds, Wheat Checks, Rice Checks, Pita Chips, Pumpkin Chips, Red Chili, Cayenne, Black Pepper, Cumin, Sea Salt, Cold-Pressed Sunflower Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Very hot. Contains Peanuts, Tree Nuts (Almonds), and Wheat. Manufactured in a facility that also processes coconut.",
  },
  {
    slug: "the-nut-case",
    name: "The Nut Case",
    tagline: "All three nuts. No apologies.",
    description:
      "What is The Nut Case? It's what happens when you stop compromising and take every nut on the list. Peanuts, cashews, and almonds are roasted separately — they don't cook at the same rate — then brought together with just enough cornflakes to keep the bag from being relentless, and coconut flakes for a sweet, toasted edge. The spice is medium and the salt is light, because a mix this nut-heavy doesn't need much help. It's the most protein-dense thing we make and, per handful, the most expensive to produce; there's no filler hiding in the bottom of the pouch. Good at four in the afternoon when lunch has worn off, good on a plane, good crushed over a bowl of yoghurt if you're feeling inventive. Order it when you want the nuts to be the point rather than the garnish.",
    recipe: {
      nuts: ["peanuts", "cashews", "almonds"],
      cereals: ["cornflakes"],
      extras: ["coconut-flakes"],
      spice: "medium-spice",
      salt: "less-salt",
    },
    category: "roasted-nuts",
    badge: "BESTSELLER",
    image: {
      src: "/images/products/saffron-cashews.jpg",
      alt: "Golden roasted cashews and almonds piled in a small ceramic dish under warm light",
    },
    gallery: [
      {
        src: "/images/products/saffron-cashews.jpg",
        alt: "Golden roasted cashews and almonds piled in a small ceramic dish under warm light",
      },
      {
        src: "/images/products/masala-peanuts.jpg",
        alt: "Spice-coated roasted peanuts scattered across a dark stone surface",
      },
    ],
    ingredients:
      "Roasted Peanuts, Roasted Cashews, Roasted Almonds, Cornflakes, Coconut Flakes, Red Chili, Black Pepper, Cumin, Sea Salt, Cold-Pressed Sunflower Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "High in protein. Contains Peanuts, Tree Nuts (Cashews, Almonds), and Coconut. Manufactured in a facility that also processes wheat.",
  },
  {
    slug: "featherweight",
    name: "Featherweight",
    tagline: "Cereal-forward and easy.",
    description:
      "What is Featherweight? It's the nut-free corner of the range, and the lightest thing we make. All three cereals go in — cornflakes, wheat checks, rice checks — along with rice flakes, raisins, and coconut flakes, and that's the whole story. No chili, no added salt, nothing to get in the way. What you're left with is a mix that's genuinely airy: sweet in places from the raisins, toasty from the coconut, and crisp everywhere else. It's the bag we send to households with a nut allergy in the mix, and the one people reach for late at night when they want something to eat rather than something to survive. Roasted in small batches and packed the same week. Because there's no oil-heavy nut in it, it's also the mix that stays crisp longest once the pouch is open.",
    recipe: {
      nuts: [],
      cereals: ["cornflakes", "wheat-checks", "rice-checks"],
      extras: ["rice-flakes", "raisins", "coconut-flakes"],
      spice: "no-spice",
      salt: "no-salt",
    },
    category: "savory-mixes",
    image: {
      src: "/images/products/poha-chivda.jpg",
      alt: "A pale, airy cereal-based snack mix with raisins and coconut flakes in a wide shallow bowl",
    },
    gallery: [
      {
        src: "/images/products/poha-chivda.jpg",
        alt: "A pale, airy cereal-based snack mix with raisins and coconut flakes in a wide shallow bowl",
      },
      {
        src: "/images/products/poha-chivda-home.jpg",
        alt: "Light snack mix poured into a bowl on a bright kitchen worktop",
      },
      {
        src: "/images/products/sev-mamra.jpg",
        alt: "Crisp puffed cereal mix photographed close up to show its texture",
      },
    ],
    ingredients:
      "Cornflakes, Wheat Checks, Rice Checks, Rice Flakes, Raisins, Coconut Flakes, Cold-Pressed Sunflower Oil. No added salt. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "No added salt. Nut-free recipe, but manufactured in a facility that also processes peanuts and tree nuts. Contains Wheat and Coconut.",
  },
  {
    slug: "ember-and-cashew",
    name: "Ember & Cashew",
    tagline: "Sweet cashew, slow burn.",
    description:
      "What is Ember & Cashew? It's the smallest ingredient list we sell and the one that took longest to get right. Cashews and peanuts are roasted until they're properly golden, tossed with cornflakes for lift, and finished with pumpkin chips and a serious amount of chili. The cashew is what makes it work — it's sweet enough and fatty enough to carry heat that would be punishing on its own, so the burn arrives late and fades slow instead of hitting all at once. Salt stays light so nothing competes. There's no filler and nowhere for a bad nut to hide, which is why we only run it in small batches. Eat it slowly, ideally with something cold nearby, and pay attention to the second half of each handful — that's where it happens.",
    recipe: {
      nuts: ["peanuts", "cashews"],
      cereals: ["cornflakes"],
      extras: ["pumpkin-chips"],
      spice: "extra-hot",
      salt: "less-salt",
    },
    category: "roasted-nuts",
    image: {
      src: "/images/products/masala-peanuts.jpg",
      alt: "Crimson-coated roasted cashews and peanuts glowing against a dark backdrop",
    },
    gallery: [
      {
        src: "/images/products/masala-peanuts.jpg",
        alt: "Crimson-coated roasted cashews and peanuts glowing against a dark backdrop",
      },
      {
        src: "/images/products/spicy-crunch-detail-3.jpg",
        alt: "Spiced nut mix served alongside a styled beverage in warm crimson light",
      },
    ],
    ingredients:
      "Roasted Cashews, Roasted Peanuts, Cornflakes, Pumpkin Chips, Red Chili, Cayenne, Black Pepper, Sea Salt, Cold-Pressed Sunflower Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Very hot. Contains Peanuts and Tree Nuts (Cashews). Manufactured in a facility that also processes wheat and coconut.",
  },
];

/**
 * Per-size prices for a recipe, using the Studio's own price table, so a preset's
 * shop price can never drift from what building the same thing costs.
 *
 * Since pricing is now flat per pack size, every product in the range shares one
 * price ladder — a preset is the same bag as a custom build, just pre-decided, so
 * charging differently for it would be incoherent. Give a preset its own numbers
 * here only if the business genuinely wants recipe-based pricing back.
 */
function pricesForRecipe(recipe: Omit<MixSelection, "weight">) {
  return STUDIO_SIZES.map((size) => ({
    label: size.label,
    price: priceMix({ ...recipe, weight: size.label }) / 100, // cents → USD
  }));
}

/** STUDIO_SIZES is ordered smallest-first, so index order is size order. */
function assertMonotonicPricing(weights: { label: string; price: number }[]) {
  for (let i = 1; i < weights.length; i++) {
    if (weights[i].price <= weights[i - 1].price) {
      throw new Error(
        `Weight pricing bug: ${weights[i].label} ($${weights[i].price}) is not more than ${weights[i - 1].label} ($${weights[i - 1].price})`,
      );
    }
  }
}

// Destructive, so it's opt-in: `npm run db:reseed`. An ungated prune would mean a
// stray `npm run db:seed` wipes a catalog someone hand-curated in /admin.
const PRUNE = process.argv.includes("--prune") || process.env.SEED_PRUNE === "1";

async function main() {
  for (let i = 0; i < SEED.length; i++) {
    const s = SEED[i];
    const weights = pricesForRecipe(s.recipe);
    assertMonotonicPricing(weights);
    const data = {
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      category: s.category,
      spiceLevel: spiceLevelOf(s.recipe.spice),
      badge: s.badge ?? null,
      image: JSON.stringify(s.image),
      gallery: JSON.stringify(s.gallery),
      weights: JSON.stringify(weights),
      defaultWeight: STUDIO_DEFAULT_SIZE,
      ingredients: s.ingredients,
      nutrition: s.nutrition,
      shipping: SHIPPING_DEFAULT,
      featured: s.featured ?? false,
      published: true,
      sortOrder: i,
    };
    await prisma.product.upsert({
      where: { slug: s.slug },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${SEED.length} products.`);

  if (PRUNE) {
    // Safe at the DB layer: Order has no FK to Product, and Order.items is a
    // self-contained JSON snapshot, so historical orders still render.
    const keep = SEED.map((s) => s.slug);
    const { count } = await prisma.product.deleteMany({ where: { slug: { notIn: keep } } });
    console.log(`Pruned ${count} products not in the seed set.`);
  } else {
    console.log("Skipped pruning old products. Run `npm run db:reseed` to remove them.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
