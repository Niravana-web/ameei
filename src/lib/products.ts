/**
 * Product catalog — the single data layer for the site.
 * Swap this file for a CMS/DB client later; page code won't change.
 */

export type SpiceLevel = 1 | 2 | 3;
export type Category = "savory-mixes" | "roasted-nuts" | "spice-blends";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // USD
  weights: string[];
  defaultWeight: string;
  category: Category;
  spiceLevel: SpiceLevel;
  badge?: "BESTSELLER" | "NEW";
  image: ProductImage; // primary card image
  gallery: ProductImage[]; // detail page gallery (first = main)
  ingredients: string;
  nutrition: string;
  shipping: string;
}

const SHIPPING_DEFAULT =
  "Ships within 24 hours. Due to the perishable nature of our products, we do not accept returns. If there is an issue with your order, please contact our spice masters.";

export const categories: { id: Category; label: string }[] = [
  { id: "savory-mixes", label: "Savory Mixes" },
  { id: "roasted-nuts", label: "Roasted Nuts" },
  { id: "spice-blends", label: "Spice Blends" },
];

export const products: Product[] = [
  {
    slug: "spicy-crunch-mix",
    name: "Spicy Crunch Mix",
    tagline: "Intense heat, deep flavor.",
    description:
      "A fierce blend of ancestral spices, roasted nuts, and crispy legumes. Crafted for those who believe heat is an art form. Every handful delivers a complex symphony of smoke, crunch, and a lingering crimson glow.",
    price: 12,
    weights: ["150g", "300g", "500g"],
    defaultWeight: "300g",
    category: "savory-mixes",
    spiceLevel: 3,
    badge: "BESTSELLER",
    image: {
      src: "/images/products/spicy-crunch-mix.jpg",
      alt: "Spicy crunch mix with golden cornflakes and crimson-dusted peanuts spilling from a rustic ceramic bowl",
    },
    gallery: [
      {
        src: "/images/products/spicy-crunch-main.jpg",
        alt: "Premium spicy snack mix in an elegant glass bowl with crimson and amber tones",
      },
      {
        src: "/images/products/spicy-crunch-detail-1.jpg",
        alt: "Close-up of red chili flakes and whole spices on a dark textured surface",
      },
      {
        src: "/images/products/spicy-crunch-detail-2.jpg",
        alt: "Spicy snack mix in a sleek minimalist bowl highlighting crunch and texture",
      },
      {
        src: "/images/products/spicy-crunch-detail-3.jpg",
        alt: "Spicy crunch mix served alongside a styled beverage in warm crimson light",
      },
    ],
    ingredients:
      "Roasted Peanuts, Gram Flour, Red Chili Powder (Guntur), Black Pepper, Cumin, Sea Salt, Cold-Pressed Mustard Oil, Amchur (Dry Mango Powder). 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Peanuts. Manufactured in a facility that also processes tree nuts. High in protein, bold in flavor.",
    shipping: SHIPPING_DEFAULT,
  },
  {
    slug: "nilon-poha-chivda",
    name: "Nilon Poha Chivda",
    tagline: "Light, airy, subtly sweet.",
    description:
      "Paper-thin flattened rice roasted until it whispers, tossed with golden fried dal, curry leaves, and a hint of turmeric. The gentlest member of the family — but never boring.",
    price: 10.5,
    weights: ["150g", "300g", "500g"],
    defaultWeight: "300g",
    category: "savory-mixes",
    spiceLevel: 1,
    image: {
      src: "/images/products/poha-chivda.jpg",
      alt: "Flattened rice poha chivda with curry leaves and cashews on a dark polished surface",
    },
    gallery: [
      {
        src: "/images/products/poha-chivda.jpg",
        alt: "Flattened rice poha chivda with curry leaves and cashews on a dark polished surface",
      },
      {
        src: "/images/products/poha-chivda-home.jpg",
        alt: "Poha chivda served in a minimalist matte black bowl with golden fried dal",
      },
    ],
    ingredients:
      "Flattened Rice (Poha), Chana Dal, Curry Leaves, Turmeric, Raisins, Cashews, Sea Salt, Cold-Pressed Groundnut Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Cashews. Manufactured in a facility that also processes peanuts and tree nuts. Light, airy, naturally gluten-free.",
    shipping: SHIPPING_DEFAULT,
  },
  {
    slug: "upma-mix",
    name: "Upma Mix",
    tagline: "Classic comfort, spiced right.",
    description:
      "Coarse roasted semolina with mustard seeds, urad dal, and dried red chilies — the breakfast of generations, ready in minutes. Comfort you can hear crackle in the pan.",
    price: 14,
    weights: ["300g", "500g"],
    defaultWeight: "300g",
    category: "savory-mixes",
    spiceLevel: 2,
    badge: "NEW",
    image: {
      src: "/images/products/upma-mix.jpg",
      alt: "Golden-brown semolina upma mix in a black stone bowl surrounded by dried red chilies and mustard seeds",
    },
    gallery: [
      {
        src: "/images/products/upma-mix.jpg",
        alt: "Golden-brown semolina upma mix in a black stone bowl surrounded by dried red chilies and mustard seeds",
      },
      {
        src: "/images/products/upma-mix-home.jpg",
        alt: "Upma mix ingredients arranged geometrically — semolina, mustard seeds, urad dal, and dried chilies",
      },
    ],
    ingredients:
      "Roasted Semolina (Rava), Mustard Seeds, Urad Dal, Chana Dal, Dried Red Chilies, Curry Leaves, Asafoetida, Sea Salt. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Wheat (Gluten). Manufactured in a facility that also processes peanuts and tree nuts.",
    shipping: SHIPPING_DEFAULT,
  },
  {
    slug: "masala-peanuts",
    name: "Masala Peanuts",
    tagline: "Crimson-coated and dangerously good.",
    description:
      "Plump peanuts wrapped in a fiery gram-flour crust, roasted — never fried — to a deep crimson crunch. Sea salt and dried herbs cling to every nut. You will not stop at one handful.",
    price: 9.5,
    weights: ["150g", "300g"],
    defaultWeight: "150g",
    category: "roasted-nuts",
    spiceLevel: 3,
    image: {
      src: "/images/products/masala-peanuts.jpg",
      alt: "Deep crimson spiced roasted peanuts piled on charred parchment with flakes of sea salt",
    },
    gallery: [
      {
        src: "/images/products/masala-peanuts.jpg",
        alt: "Deep crimson spiced roasted peanuts piled on charred parchment with flakes of sea salt",
      },
    ],
    ingredients:
      "Peanuts, Gram Flour, Red Chili Powder, Garlic, Black Salt, Cumin, Cold-Pressed Mustard Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Peanuts. Manufactured in a facility that also processes tree nuts. High in protein.",
    shipping: SHIPPING_DEFAULT,
  },
  {
    slug: "roasted-cornflakes-mix",
    name: "Roasted Cornflakes Mix",
    tagline: "Golden, geometric, gone too fast.",
    description:
      "Crisp golden cornflakes roasted with raisins, peanuts, and a saffron-warm spice dusting. Sharp edges, soft sweetness, and a crackle you can hear across the room.",
    price: 11,
    weights: ["150g", "300g", "500g"],
    defaultWeight: "300g",
    category: "savory-mixes",
    spiceLevel: 2,
    image: {
      src: "/images/products/cornflakes-mix.jpg",
      alt: "Golden roasted cornflake mix spilling from a glass jar onto a rough slate block",
    },
    gallery: [
      {
        src: "/images/products/cornflakes-mix.jpg",
        alt: "Golden roasted cornflake mix spilling from a glass jar onto a rough slate block",
      },
    ],
    ingredients:
      "Cornflakes, Peanuts, Raisins, Curry Leaves, Turmeric, Red Chili Powder, Sea Salt, Cold-Pressed Groundnut Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Peanuts. Manufactured in a facility that also processes tree nuts. Naturally gluten-free.",
    shipping: SHIPPING_DEFAULT,
  },
  {
    slug: "sev-mamra",
    name: "Sev Mamra",
    tagline: "Street-corner classic, done right.",
    description:
      "Featherlight puffed rice layered with thin golden chickpea sev and a dusting of red chili. The street-corner classic of every Indian childhood — roasted in small batches and sealed at peak crunch.",
    price: 8.5,
    weights: ["150g", "300g"],
    defaultWeight: "150g",
    category: "savory-mixes",
    spiceLevel: 1,
    image: {
      src: "/images/products/sev-mamra.jpg",
      alt: "Puffed rice and thin yellow chickpea sev dusted with red chili powder",
    },
    gallery: [
      {
        src: "/images/products/sev-mamra.jpg",
        alt: "Puffed rice and thin yellow chickpea sev dusted with red chili powder",
      },
    ],
    ingredients:
      "Puffed Rice (Mamra), Gram Flour Sev, Red Chili Powder, Turmeric, Sea Salt, Cold-Pressed Groundnut Oil. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "May contain traces of Peanuts. Manufactured in a facility that also processes peanuts and tree nuts.",
    shipping: SHIPPING_DEFAULT,
  },
  {
    slug: "smoked-ghost-pepper",
    name: "Smoked Ghost Pepper",
    tagline: "Handle with respect.",
    description:
      "Ghost peppers slow-smoked over wood and ground to a deep, vibrant red powder. A pinch transforms a dish; a spoonful transforms you. Our hottest blend — wear it proudly.",
    price: 13.5,
    weights: ["50g", "100g"],
    defaultWeight: "50g",
    category: "spice-blends",
    spiceLevel: 3,
    badge: "NEW",
    image: {
      src: "/images/products/ghost-pepper.jpg",
      alt: "Jar of deep red smoked ghost pepper powder with dramatic smoke effects",
    },
    gallery: [
      {
        src: "/images/products/ghost-pepper.jpg",
        alt: "Jar of deep red smoked ghost pepper powder with dramatic smoke effects",
      },
    ],
    ingredients:
      "Smoked Ghost Peppers (Bhut Jolokia). That's it. 100% natural, no anti-caking agents.",
    nutrition:
      "Extremely hot. Keep away from eyes and small children. Processed in a dedicated chili facility.",
    shipping: SHIPPING_DEFAULT,
  },
  {
    slug: "saffron-roasted-cashews",
    name: "Saffron Roasted Cashews",
    tagline: "Golden warmth in every bite.",
    description:
      "Whole cashews roasted in ghee with real saffron threads and a golden-red spice blend. Warm, buttery, and quietly luxurious — the snack you bring out when company deserves it.",
    price: 16,
    weights: ["150g", "300g"],
    defaultWeight: "150g",
    category: "roasted-nuts",
    spiceLevel: 1,
    image: {
      src: "/images/products/saffron-cashews.jpg",
      alt: "Whole cashews coated in a golden-red saffron spice blend on dark slate",
    },
    gallery: [
      {
        src: "/images/products/saffron-cashews.jpg",
        alt: "Whole cashews coated in a golden-red saffron spice blend on dark slate",
      },
    ],
    ingredients:
      "Cashews, Ghee, Saffron, White Pepper, Sea Salt, a whisper of Cardamom. 100% natural, no artificial colors or preservatives.",
    nutrition:
      "Contains Cashews (Tree Nuts) and Dairy (Ghee). Manufactured in a facility that also processes peanuts.",
    shipping: SHIPPING_DEFAULT,
  },
  {
    slug: "heritage-blend",
    name: "The Heritage Blend",
    tagline: "Five generations in one jar.",
    description:
      "Our founding family's masala — a complex, dark red blend of fourteen spices roasted and ground in sequence, exactly the way it has been for five generations. The backbone of every ameei recipe.",
    price: 12.5,
    weights: ["100g", "200g"],
    defaultWeight: "100g",
    category: "spice-blends",
    spiceLevel: 2,
    badge: "BESTSELLER",
    image: {
      src: "/images/products/heritage-blend.jpg",
      alt: "Macro shot of a complex dark red spice blend with visible seeds and textures",
    },
    gallery: [
      {
        src: "/images/products/heritage-blend.jpg",
        alt: "Macro shot of a complex dark red spice blend with visible seeds and textures",
      },
    ],
    ingredients:
      "Coriander, Cumin, Dried Red Chilies, Black Pepper, Fenugreek, Mustard Seeds, Turmeric, Cinnamon, Clove, Cardamom, Star Anise, Bay Leaf, Dry Ginger, Amchur. 100% natural.",
    nutrition: "No known allergens. Processed in a dedicated spice facility.",
    shipping: SHIPPING_DEFAULT,
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 3);
}

export function getRelatedProducts(slug: string, count = 3): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, count);
}

export function getCategoryLabel(id: Category): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}
