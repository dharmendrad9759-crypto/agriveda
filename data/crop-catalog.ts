export type CropCategory = "Cereals" | "Vegetables" | "Cash Crops" | "Fruits" | "Pulses" | "Oilseeds" | "Spices";

export interface CatalogCrop {
  slug: string;
  name: string;
  /** Hindi display name for chips / cards */
  nameHi?: string;
  emoji: string;
  category: CropCategory;
  gradient: string;
}

export const cropCatalog: CatalogCrop[] = [
  { slug: "paddy", name: "Paddy", nameHi: "धान", emoji: "🌾", category: "Cereals", gradient: "from-amber-100 to-yellow-50" },
  { slug: "wheat", name: "Wheat", nameHi: "गेहूँ", emoji: "🌾", category: "Cereals", gradient: "from-amber-50 to-orange-50" },
  { slug: "maize", name: "Maize", nameHi: "मक्का", emoji: "🌽", category: "Cereals", gradient: "from-yellow-100 to-amber-50" },
  { slug: "bajra", name: "Bajra", nameHi: "बाजरा", emoji: "🌿", category: "Cereals", gradient: "from-lime-100 to-green-50" },
  { slug: "potato", name: "Potato", nameHi: "आलू", emoji: "🥔", category: "Vegetables", gradient: "from-orange-100 to-amber-50" },
  { slug: "tomato", name: "Tomato", nameHi: "टमाटर", emoji: "🍅", category: "Vegetables", gradient: "from-red-100 to-rose-50" },
  { slug: "onion", name: "Onion", nameHi: "प्याज", emoji: "🧅", category: "Vegetables", gradient: "from-purple-100 to-violet-50" },
  { slug: "chilli", name: "Chilli", nameHi: "मिर्च", emoji: "🌶️", category: "Vegetables", gradient: "from-red-100 to-orange-50" },
  { slug: "cauliflower", name: "Cauliflower", nameHi: "फूलगोभी", emoji: "🥦", category: "Vegetables", gradient: "from-green-100 to-emerald-50" },
  { slug: "cucumber", name: "Cucumber", nameHi: "खीरा", emoji: "🥒", category: "Vegetables", gradient: "from-lime-100 to-green-50" },
  { slug: "brinjal", name: "Brinjal", nameHi: "बैंगन", emoji: "🍆", category: "Vegetables", gradient: "from-purple-100 to-violet-50" },
  { slug: "bhindi", name: "Bhindi", nameHi: "भिंडी", emoji: "🫛", category: "Vegetables", gradient: "from-green-100 to-lime-50" },
  { slug: "cotton", name: "Cotton", nameHi: "कपास", emoji: "🌸", category: "Cash Crops", gradient: "from-pink-100 to-rose-50" },
  { slug: "sugarcane", name: "Sugarcane", nameHi: "गन्ना", emoji: "🎋", category: "Cash Crops", gradient: "from-green-100 to-emerald-50" },
  { slug: "soybean", name: "Soybean", nameHi: "सोयाबीन", emoji: "🫘", category: "Oilseeds", gradient: "from-lime-100 to-yellow-50" },
  { slug: "moongfali", name: "Moongfali", nameHi: "मूंगफली", emoji: "🥜", category: "Oilseeds", gradient: "from-amber-100 to-yellow-50" },
  { slug: "mustard", name: "Mustard", nameHi: "सरसों", emoji: "🌼", category: "Oilseeds", gradient: "from-yellow-100 to-amber-50" },
  { slug: "pulses", name: "Pulses", nameHi: "अरहर", emoji: "🫛", category: "Pulses", gradient: "from-green-100 to-teal-50" },
  { slug: "moong", name: "Moong", nameHi: "मूंग", emoji: "🫘", category: "Pulses", gradient: "from-lime-100 to-green-50" },
  { slug: "chana", name: "Chana", nameHi: "चना", emoji: "🟡", category: "Pulses", gradient: "from-amber-100 to-yellow-50" },
  { slug: "masoor", name: "Masoor", nameHi: "मसूर", emoji: "🟠", category: "Pulses", gradient: "from-orange-100 to-amber-50" },
  { slug: "urad", name: "Urad", nameHi: "उड़द", emoji: "⚫", category: "Pulses", gradient: "from-slate-100 to-zinc-50" },
  { slug: "ginger", name: "Ginger", nameHi: "अदरक", emoji: "🫚", category: "Spices", gradient: "from-amber-100 to-orange-50" },
  { slug: "garlic", name: "Garlic", nameHi: "लहसुन", emoji: "🧄", category: "Spices", gradient: "from-stone-100 to-amber-50" },
  { slug: "mango", name: "Mango", nameHi: "आम", emoji: "🥭", category: "Fruits", gradient: "from-orange-100 to-yellow-50" },
  { slug: "banana", name: "Banana", nameHi: "केला", emoji: "🍌", category: "Fruits", gradient: "from-yellow-100 to-lime-50" },
  { slug: "grapes", name: "Grapes", nameHi: "अंगूर", emoji: "🍇", category: "Fruits", gradient: "from-purple-100 to-indigo-50" },
];

export const categoryOrder: CropCategory[] = [
  "Cereals",
  "Vegetables",
  "Cash Crops",
  "Fruits",
  "Pulses",
  "Oilseeds",
  "Spices",
];

export function getCropsByCategory(): Record<CropCategory, CatalogCrop[]> {
  const grouped = {} as Record<CropCategory, CatalogCrop[]>;
  for (const cat of categoryOrder) {
    grouped[cat] = cropCatalog.filter((c) => c.category === cat);
  }
  return grouped;
}

export function getCatalogCrop(slug: string): CatalogCrop | undefined {
  const key = slug.trim().toLowerCase();
  return cropCatalog.find((c) => c.slug === key);
}

export interface MyCropItem {
  slug: string;
  name: string;
  emoji: string;
  /** Farmer-added crop that may not exist in catalog / crop detail pages */
  custom?: boolean;
}

export const defaultMyCrops: MyCropItem[] = [
  { slug: "potato", name: "Potato", emoji: "🥔" },
  { slug: "tomato", name: "Tomato", emoji: "🍅" },
  { slug: "paddy", name: "Paddy", emoji: "🌾" },
];
