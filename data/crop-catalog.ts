export type CropCategory = "Cereals" | "Vegetables" | "Cash Crops" | "Fruits" | "Pulses" | "Oilseeds";

export interface CatalogCrop {
  slug: string;
  name: string;
  emoji: string;
  category: CropCategory;
  gradient: string;
}

export const cropCatalog: CatalogCrop[] = [
  { slug: "paddy", name: "Paddy", emoji: "🌾", category: "Cereals", gradient: "from-amber-100 to-yellow-50" },
  { slug: "wheat", name: "Wheat", emoji: "🌾", category: "Cereals", gradient: "from-amber-50 to-orange-50" },
  { slug: "maize", name: "Maize", emoji: "🌽", category: "Cereals", gradient: "from-yellow-100 to-amber-50" },
  { slug: "bajra", name: "Bajra", emoji: "🌿", category: "Cereals", gradient: "from-lime-100 to-green-50" },
  { slug: "potato", name: "Potato", emoji: "🥔", category: "Vegetables", gradient: "from-orange-100 to-amber-50" },
  { slug: "tomato", name: "Tomato", emoji: "🍅", category: "Vegetables", gradient: "from-red-100 to-rose-50" },
  { slug: "onion", name: "Onion", emoji: "🧅", category: "Vegetables", gradient: "from-purple-100 to-violet-50" },
  { slug: "chilli", name: "Chilli", emoji: "🌶️", category: "Vegetables", gradient: "from-red-100 to-orange-50" },
  { slug: "cauliflower", name: "Cauliflower", emoji: "🥦", category: "Vegetables", gradient: "from-green-100 to-emerald-50" },
  { slug: "cucumber", name: "Cucumber", emoji: "🥒", category: "Vegetables", gradient: "from-lime-100 to-green-50" },
  { slug: "brinjal", name: "Brinjal", emoji: "🍆", category: "Vegetables", gradient: "from-purple-100 to-violet-50" },
  { slug: "bhindi", name: "Bhindi", emoji: "🫛", category: "Vegetables", gradient: "from-green-100 to-lime-50" },
  { slug: "cotton", name: "Cotton", emoji: "🌸", category: "Cash Crops", gradient: "from-pink-100 to-rose-50" },
  { slug: "sugarcane", name: "Sugarcane", emoji: "🎋", category: "Cash Crops", gradient: "from-green-100 to-emerald-50" },
  { slug: "soybean", name: "Soybean", emoji: "🫘", category: "Oilseeds", gradient: "from-lime-100 to-yellow-50" },
  { slug: "moongfali", name: "Moongfali", emoji: "🥜", category: "Oilseeds", gradient: "from-amber-100 to-yellow-50" },
  { slug: "mustard", name: "Mustard", emoji: "🌼", category: "Oilseeds", gradient: "from-yellow-100 to-amber-50" },
  { slug: "pulses", name: "Pulses", emoji: "🫛", category: "Pulses", gradient: "from-green-100 to-teal-50" },
  { slug: "moong", name: "Moong", emoji: "🫘", category: "Pulses", gradient: "from-lime-100 to-green-50" },
  { slug: "mango", name: "Mango", emoji: "🥭", category: "Fruits", gradient: "from-orange-100 to-yellow-50" },
  { slug: "banana", name: "Banana", emoji: "🍌", category: "Fruits", gradient: "from-yellow-100 to-lime-50" },
  { slug: "grapes", name: "Grapes", emoji: "🍇", category: "Fruits", gradient: "from-purple-100 to-indigo-50" },
];

export const categoryOrder: CropCategory[] = [
  "Cereals",
  "Vegetables",
  "Cash Crops",
  "Fruits",
  "Pulses",
  "Oilseeds",
];

export function getCropsByCategory(): Record<CropCategory, CatalogCrop[]> {
  const grouped = {} as Record<CropCategory, CatalogCrop[]>;
  for (const cat of categoryOrder) {
    grouped[cat] = cropCatalog.filter((c) => c.category === cat);
  }
  return grouped;
}

export interface MyCropItem {
  slug: string;
  name: string;
  emoji: string;
}

export const defaultMyCrops: MyCropItem[] = [
  { slug: "potato", name: "Potato", emoji: "🥔" },
  { slug: "tomato", name: "Tomato", emoji: "🍅" },
  { slug: "paddy", name: "Paddy", emoji: "🌾" },
];
