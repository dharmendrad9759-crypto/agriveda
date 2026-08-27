import type { Crop } from "@/types/crop";

/** How farmers talk about taking the crop — कटाई / तुड़ाई / खुदाई */
export type HarvestAction = "cut" | "pick" | "dig";

const PICK_SLUGS = new Set([
  "tomato",
  "chilli",
  "chili",
  "brinjal",
  "eggplant",
  "cucumber",
  "okra",
  "bhindi",
  "capsicum",
  "bell-pepper",
  "cotton",
  "grape",
  "grapes",
  "mango",
  "guava",
  "papaya",
  "banana",
  "strawberry",
  "beans",
  "french-bean",
  "cluster-bean",
  "cowpea",
]);

const DIG_SLUGS = new Set([
  "potato",
  "onion",
  "garlic",
  "ginger",
  "turmeric",
  "carrot",
  "radish",
  "beetroot",
  "sweet-potato",
  "moongfali",
  "groundnut",
  "peanut",
  "colocasia",
  "yam",
]);

const CUT_VEG_SLUGS = new Set([
  "cauliflower",
  "cabbage",
  "broccoli",
  "lettuce",
  "spinach",
  "palak",
  "methi",
  "fenugreek",
  "coriander",
  "dhania",
]);

export function harvestActionForCrop(
  crop: Pick<Crop, "slug" | "category"> | { slug: string; category?: Crop["category"] }
): HarvestAction {
  const slug = crop.slug.toLowerCase();
  if (PICK_SLUGS.has(slug)) return "pick";
  if (DIG_SLUGS.has(slug)) return "dig";
  if (CUT_VEG_SLUGS.has(slug)) return "cut";

  // Fruiting vegetables → picking; leafy/head crops already in CUT list
  if (crop.category === "Vegetables") return "pick";

  return "cut";
}

export function cropHarvestLabel(
  crop: Pick<Crop, "slug" | "category"> | { slug: string; category?: Crop["category"] },
  hi: boolean
): string {
  const action = harvestActionForCrop(crop);
  if (hi) {
    if (action === "pick") return "तुड़ाई";
    if (action === "dig") return "खुदाई";
    return "कटाई";
  }
  if (action === "pick") return "Picking";
  if (action === "dig") return "Digging";
  return "Harvest";
}

export function cropHarvestHint(
  crop: Pick<Crop, "slug" | "category"> | { slug: string; category?: Crop["category"] },
  hi: boolean
): string {
  const action = harvestActionForCrop(crop);
  if (hi) {
    if (action === "pick") return "कब तोड़ें · कैसे रखें";
    if (action === "dig") return "कब खोदें · कैसे रखें";
    return "कब काटें · कैसे रखें";
  }
  if (action === "pick") return "When to pick & store";
  if (action === "dig") return "When to dig & store";
  return "When to cut & store";
}
