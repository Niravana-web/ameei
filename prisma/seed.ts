import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

process.loadEnvFile(".env"); // tsx doesn't auto-load .env
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

const SHIPPING_DEFAULT =
  "Ships within 24 hours. Due to the perishable nature of our products, we do not accept returns. If there is an issue with your order, please contact our spice masters.";

// price = flat base applied to every weight (migration default — edit per-weight in the admin).
type Seed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  weights: string[];
  defaultWeight: string;
  category: string;
  spiceLevel: number;
  badge?: string;
  image: { src: string; alt: string };
  gallery: { src: string; alt: string }[];
  ingredients: string;
  nutrition: string;
  featured?: boolean;
};

const SEED: Seed[] = [
  {
    slug: "spicy-crunch-mix",
    name: "Spicy Crunch Mix",
    tagline: "Intense heat, deep flavor.",
    description:
      "What is Spicy Crunch Mix? It's ameei's fieriest snack — a bold blend of roasted peanuts, crisp gram-flour sev, and Guntur red chili, built for people who treat heat as an art form rather than an accident. We toast plump peanuts slow, then fold in cumin, black pepper, and a hit of tangy amchur (dried mango powder) that cuts through the burn just enough to pull you back for another handful. Everything is roasted in cold-pressed mustard oil, never fried, so the crunch stays honest while the spice stays loud. It's the mix that started the ameei name, the one people request by handful rather than by bag. Pour it into a bowl before guests arrive or eat it straight from the pouch at the counter. Either way, expect a complex symphony of smoke, crunch, and a lingering crimson glow that lasts well past the first bite.",
    price: 12,
    weights: ["150g", "300g", "500g"],
    defaultWeight: "300g",
    category: "savory-mixes",
    spiceLevel: 3,
    badge: "BESTSELLER",
    featured: true,
    image: {
      src: "/images/products/spicy-crunch-mix.jpg",
      alt: "Spicy crunch mix with golden cornflakes and crimson-dusted peanuts spilling from a rustic ceramic bowl",
    },
    gallery: [
      { src: "/images/products/spicy-crunch-main.jpg", alt: "Premium spicy snack mix in an elegant glass bowl with crimson and amber tones" },
      { src: "/images/products/spicy-crunch-detail-1.jpg", alt: "Close-up of red chili flakes and whole spices on a dark textured surface" },
      { src: "/images/products/spicy-crunch-detail-2.jpg", alt: "Spicy snack mix in a sleek minimalist bowl highlighting crunch and texture" },
      { src: "/images/products/spicy-crunch-detail-3.jpg", alt: "Spicy crunch mix served alongside a styled beverage in warm crimson light" },
    ],
    ingredients:
      "Roasted Peanuts, Gram Flour, Red Chili Powder (Guntur), Black Pepper, Cumin, Sea Salt, Cold-Pressed Mustard Oil, Amchur (Dry Mango Powder). 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Peanuts. Manufactured in a facility that also processes tree nuts. High in protein, bold in flavor.",
  },
  {
    slug: "nilon-poha-chivda",
    name: "Nilon Poha Chivda",
    tagline: "Light, airy, subtly sweet.",
    description:
      "What is Nilon Poha Chivda? It's a light, savory snack made from flattened rice (poha) roasted until paper-thin and whisper-crisp, then tossed with golden fried chana dal, fresh curry leaves, raisins, cashews, and a gentle dusting of turmeric. Unlike heavier fried mixtures, poha chivda is roasted rather than deep-fried, which keeps it naturally gluten-free and easy on the stomach without losing any of its signature crunch. The turmeric gives it a warm golden color, the curry leaves add a fragrant background note, and the raisins bring a small pocket of sweetness between bites of salt and spice. It's the mildest member of the ameei family — spice level one out of three — which makes it the mix people reach for when they want flavor without fire, whether that's an afternoon snack, a topping for yogurt, or the crunchy layer in a quick homemade chaat. Never boring, just gentler.",
    price: 10.5,
    weights: ["150g", "300g", "500g"],
    defaultWeight: "300g",
    category: "savory-mixes",
    spiceLevel: 1,
    featured: true,
    image: { src: "/images/products/poha-chivda.jpg", alt: "Flattened rice poha chivda with curry leaves and cashews on a dark polished surface" },
    gallery: [
      { src: "/images/products/poha-chivda.jpg", alt: "Flattened rice poha chivda with curry leaves and cashews on a dark polished surface" },
      { src: "/images/products/poha-chivda-home.jpg", alt: "Poha chivda served in a minimalist matte black bowl with golden fried dal" },
    ],
    ingredients:
      "Flattened Rice (Poha), Chana Dal, Curry Leaves, Turmeric, Raisins, Cashews, Sea Salt, Cold-Pressed Groundnut Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Cashews. Manufactured in a facility that also processes peanuts and tree nuts. Light, airy, naturally gluten-free.",
  },
  {
    slug: "upma-mix",
    name: "Upma Mix",
    tagline: "Classic comfort, spiced right.",
    description:
      "What is Upma Mix? It's a ready-in-minutes version of upma, the coarse roasted semolina (rava) breakfast dish eaten across South India for generations, pre-blended with mustard seeds, urad dal, dried red chilies, curry leaves, and asafoetida so all that's left to do is add hot water or milk and stir. The semolina is roasted until golden before packing, which is what gives upma its nutty base flavor and lets the mustard seeds crackle the moment they hit a hot pan. Medium on the ameei spice scale, it sits between comfort food and genuine heat: enough dried chili to wake you up, not so much that it overwhelms breakfast. Traditionally served with a squeeze of lemon, chopped vegetables, or a side of chutney, it's the dish generations of households have relied on when there's no time to cook from scratch but no interest in skipping a real breakfast either.",
    price: 14,
    weights: ["300g", "500g"],
    defaultWeight: "300g",
    category: "savory-mixes",
    spiceLevel: 2,
    badge: "NEW",
    featured: true,
    image: { src: "/images/products/upma-mix.jpg", alt: "Golden-brown semolina upma mix in a black stone bowl surrounded by dried red chilies and mustard seeds" },
    gallery: [
      { src: "/images/products/upma-mix.jpg", alt: "Golden-brown semolina upma mix in a black stone bowl surrounded by dried red chilies and mustard seeds" },
      { src: "/images/products/upma-mix-home.jpg", alt: "Upma mix ingredients arranged geometrically — semolina, mustard seeds, urad dal, and dried chilies" },
    ],
    ingredients:
      "Roasted Semolina (Rava), Mustard Seeds, Urad Dal, Chana Dal, Dried Red Chilies, Curry Leaves, Asafoetida, Sea Salt. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Wheat (Gluten). Manufactured in a facility that also processes peanuts and tree nuts.",
  },
  {
    slug: "masala-peanuts",
    name: "Masala Peanuts",
    tagline: "Crimson-coated and dangerously good.",
    description:
      "What is Masala Peanuts? It's ameei's take on the classic Indian bar snack: plump peanuts coated in a fiery gram-flour crust, roasted rather than fried, until they turn a deep crimson and shatter with a satisfying crunch. Garlic, black salt, and cumin sit inside that crust alongside red chili powder, all bound together with cold-pressed mustard oil instead of the deep-fried batter most masala peanuts rely on, so the flavor stays sharp without the greasy aftertaste. Spice level three out of three makes this one of the hotter mixes in the range, closer to a bar snack built for chili lovers than a mild afternoon nibble. It pairs naturally with a cold drink, works as a standalone bowl at a gathering, or gets crushed over a quick chaat for extra crunch and heat. Most people don't stop at one handful, and the crust is exactly why.",
    price: 9.5,
    weights: ["150g", "300g"],
    defaultWeight: "150g",
    category: "roasted-nuts",
    spiceLevel: 3,
    image: { src: "/images/products/masala-peanuts.jpg", alt: "Deep crimson spiced roasted peanuts piled on charred parchment with flakes of sea salt" },
    gallery: [
      { src: "/images/products/masala-peanuts.jpg", alt: "Deep crimson spiced roasted peanuts piled on charred parchment with flakes of sea salt" },
    ],
    ingredients:
      "Peanuts, Gram Flour, Red Chili Powder, Garlic, Black Salt, Cumin, Cold-Pressed Mustard Oil. 100% natural, no artificial colors or preservatives.",
    nutrition: "Contains Peanuts. Manufactured in a facility that also processes tree nuts. High in protein.",
  },
  {
    slug: "roasted-cornflakes-mix",
    name: "Roasted Cornflakes Mix",
    tagline: "Golden, geometric, gone too fast.",
    description:
      "What is Roasted Cornflakes Mix? It's a savory twist on an everyday breakfast staple: crisp golden cornflakes roasted alongside peanuts and raisins, then dusted with turmeric, curry leaves, and red chili powder for a saffron-warm, medium-heat finish. The cornflakes keep their sharp, geometric crunch through roasting, which is what separates this mix from softer namkeen blends, while the raisins add small bursts of sweetness that offset the chili. It sits at spice level two of three, so it has real warmth without tipping into fire-mix territory, making it an easy entry point for people who find the hotter ameei blends too much. Cornflakes mixtures like this one are a common tea-time snack across India, served in small bowls alongside chai, and this version keeps that tradition while roasting rather than frying for a lighter, naturally gluten-free result you can hear crackle from across the room.",
    price: 11,
    weights: ["150g", "300g", "500g"],
    defaultWeight: "300g",
    category: "savory-mixes",
    spiceLevel: 2,
    image: { src: "/images/products/cornflakes-mix.jpg", alt: "Golden roasted cornflake mix spilling from a glass jar onto a rough slate block" },
    gallery: [
      { src: "/images/products/cornflakes-mix.jpg", alt: "Golden roasted cornflake mix spilling from a glass jar onto a rough slate block" },
    ],
    ingredients:
      "Cornflakes, Peanuts, Raisins, Curry Leaves, Turmeric, Red Chili Powder, Sea Salt, Cold-Pressed Groundnut Oil. 100% natural, no artificial colors or preservatives.",
    nutrition: "Contains Peanuts. Manufactured in a facility that also processes tree nuts. Naturally gluten-free.",
  },
  {
    slug: "sev-mamra",
    name: "Sev Mamra",
    tagline: "Street-corner classic, done right.",
    description:
      "What is Sev Mamra? It's a street-corner classic built from two simple ingredients: featherlight puffed rice (mamra) layered with thin, golden chickpea-flour noodles (sev), finished with a dusting of red chili powder and turmeric. It's one of the mildest mixes in the ameei range at spice level one, prized less for heat and more for texture — the puffed rice practically dissolves on the tongue while the sev holds a persistent, delicate crunch. This combination is a fixture of roadside snack stalls across India, usually eaten straight from a paper cone, and its appeal has always been how little it weighs while still filling a bowl. Because it's roasted rather than fried and kept simple, sev mamra stays crisp for longer than most bhel-style mixes and works equally well eaten on its own, folded into a quick chaat with onions and chutney, or scattered over yogurt for crunch.",
    price: 8.5,
    weights: ["150g", "300g"],
    defaultWeight: "150g",
    category: "savory-mixes",
    spiceLevel: 1,
    image: { src: "/images/products/sev-mamra.jpg", alt: "Puffed rice and thin yellow chickpea sev dusted with red chili powder" },
    gallery: [
      { src: "/images/products/sev-mamra.jpg", alt: "Puffed rice and thin yellow chickpea sev dusted with red chili powder" },
    ],
    ingredients:
      "Puffed Rice (Mamra), Gram Flour Sev, Red Chili Powder, Turmeric, Sea Salt, Cold-Pressed Groundnut Oil. 100% natural, no artificial colors or preservatives.",
    nutrition: "May contain traces of Peanuts. Manufactured in a facility that also processes peanuts and tree nuts.",
  },
  {
    slug: "smoked-ghost-pepper",
    name: "Smoked Ghost Pepper",
    tagline: "Handle with respect.",
    description:
      "What is Smoked Ghost Pepper powder? It's a single-ingredient spice made from ghost peppers (bhut jolokia) — among the hottest chilies grown in India — slow-smoked over wood and ground into a deep, vibrant red powder. Unlike blended chili powders, this one contains nothing but smoked ghost pepper, so its heat and smoke character come through undiluted; a pinch changes the direction of an entire dish, and a spoonful is genuinely not meant for casual use. Ghost pepper has historically been used in small quantities in northeastern Indian cooking, prized as much for its smoky depth as for its Scoville rating. This is the hottest blend ameei makes, and it's built for people who already know they want that kind of heat: stirred into oil for a marinade, added a pinch at a time to curries, or used sparingly to finish a dish that needs one more layer of intensity. Handle it with respect.",
    price: 13.5,
    weights: ["50g", "100g"],
    defaultWeight: "50g",
    category: "spice-blends",
    spiceLevel: 3,
    badge: "NEW",
    image: { src: "/images/products/ghost-pepper.jpg", alt: "Jar of deep red smoked ghost pepper powder with dramatic smoke effects" },
    gallery: [
      { src: "/images/products/ghost-pepper.jpg", alt: "Jar of deep red smoked ghost pepper powder with dramatic smoke effects" },
    ],
    ingredients: "Smoked Ghost Peppers (Bhut Jolokia). That's it. 100% natural, no anti-caking agents.",
    nutrition: "Extremely hot. Keep away from eyes and small children. Processed in a dedicated chili facility.",
  },
  {
    slug: "saffron-roasted-cashews",
    name: "Saffron Roasted Cashews",
    tagline: "Golden warmth in every bite.",
    description:
      "What is Saffron Roasted Cashews? It's whole cashews roasted in ghee with real saffron threads, white pepper, sea salt, and a whisper of cardamom, finished in a golden-red spice coating that leans warm and buttery rather than fiery. Saffron and cashews together are a traditional pairing in Indian festive cooking, often reserved for celebrations because both ingredients are prized rather than everyday. Roasting the cashews in ghee instead of oil gives them a richer, rounder flavor, while the cardamom adds a fragrant top note that keeps the mix from tasting one-dimensionally sweet or salty. At spice level one, this is the most restrained mix ameei makes — built for moments that call for something a little luxurious rather than a fire-mix crunch. It's the snack meant for guests, for gifting, or for the evening you decide a plain bowl of cashews isn't quite enough.",
    price: 16,
    weights: ["150g", "300g"],
    defaultWeight: "150g",
    category: "roasted-nuts",
    spiceLevel: 1,
    image: { src: "/images/products/saffron-cashews.jpg", alt: "Whole cashews coated in a golden-red saffron spice blend on dark slate" },
    gallery: [
      { src: "/images/products/saffron-cashews.jpg", alt: "Whole cashews coated in a golden-red saffron spice blend on dark slate" },
    ],
    ingredients:
      "Cashews, Ghee, Saffron, White Pepper, Sea Salt, a whisper of Cardamom. 100% natural, no artificial colors or preservatives.",
    nutrition: "Contains Cashews (Tree Nuts) and Dairy (Ghee). Manufactured in a facility that also processes peanuts.",
  },
  {
    slug: "heritage-blend",
    name: "The Heritage Blend",
    tagline: "Five generations in one jar.",
    description:
      "What is The Heritage Blend? It's ameei's founding family masala — a complex, dark red mix of fourteen spices, including coriander, cumin, dried red chilies, fenugreek, mustard seeds, turmeric, cinnamon, clove, cardamom, star anise, bay leaf, dry ginger, and amchur, roasted and ground in a specific sequence that has stayed unchanged for five generations. Where most of ameei's other products are ready-to-eat snacks, the Heritage Blend is a cooking spice: the same masala used as the base for the family's original recipes, meant to be stirred into oil at the start of a dish rather than eaten from the bag. The order in which the spices are roasted matters as much as the list itself, since roasting sequence changes how the oils release and how the final blend tastes once it hits a hot pan. It's the one product in the range that isn't really a snack at all — it's the backbone every other ameei recipe is built on.",
    price: 12.5,
    weights: ["100g", "200g"],
    defaultWeight: "100g",
    category: "spice-blends",
    spiceLevel: 2,
    badge: "BESTSELLER",
    image: { src: "/images/products/heritage-blend.jpg", alt: "Macro shot of a complex dark red spice blend with visible seeds and textures" },
    gallery: [
      { src: "/images/products/heritage-blend.jpg", alt: "Macro shot of a complex dark red spice blend with visible seeds and textures" },
    ],
    ingredients:
      "Coriander, Cumin, Dried Red Chilies, Black Pepper, Fenugreek, Mustard Seeds, Turmeric, Cinnamon, Clove, Cardamom, Star Anise, Bay Leaf, Dry Ginger, Amchur. 100% natural.",
    nutrition: "No known allergens. Processed in a dedicated spice facility.",
  },
];

async function main() {
  for (let i = 0; i < SEED.length; i++) {
    const s = SEED[i];
    const weights = s.weights.map((label) => ({ label, price: s.price }));
    const data = {
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      category: s.category,
      spiceLevel: s.spiceLevel,
      badge: s.badge ?? null,
      image: JSON.stringify(s.image),
      gallery: JSON.stringify(s.gallery),
      weights: JSON.stringify(weights),
      defaultWeight: s.defaultWeight,
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
