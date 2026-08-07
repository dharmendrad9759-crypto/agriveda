export type CropFamilyId =
  | "cereals"
  | "millets"
  | "pulses"
  | "oilseeds"
  | "solanaceous"
  | "cucurbits"
  | "cole"
  | "bulbs_roots"
  | "fibre_sugar"
  | "spices"
  | "fruits"
  | "leafy_okra";

export interface CropFamily {
  id: CropFamilyId;
  nameHi: string;
  nameEn: string;
  shortHi: string;
  cropSlugs: string[];
}

/** Farm families — each catalog crop appears in exactly one family. */
export const cropFamilies: CropFamily[] = [
  {
    id: "cereals",
    nameHi: "अनाज",
    nameEn: "Cereals",
    shortHi: "धान · गेहूँ · मक्का",
    cropSlugs: ["paddy", "wheat", "maize"],
  },
  {
    id: "millets",
    nameHi: "मिलेट / बाजरा",
    nameEn: "Millets",
    shortHi: "सूखा सहनशील अन्न",
    cropSlugs: ["bajra"],
  },
  {
    id: "pulses",
    nameHi: "दलहन",
    nameEn: "Pulses",
    shortHi: "चना · मसूर · उड़द · मूंग",
    cropSlugs: ["pulses", "moong", "chana", "masoor", "urad"],
  },
  {
    id: "oilseeds",
    nameHi: "तिलहन",
    nameEn: "Oilseeds",
    shortHi: "सोया · सरसों · मूंगफली",
    cropSlugs: ["soybean", "moongfali", "mustard"],
  },
  {
    id: "solanaceous",
    nameHi: "सोलानेसियस",
    nameEn: "Solanaceous",
    shortHi: "टमाटर · आलू · बैंगन",
    cropSlugs: ["tomato", "potato", "brinjal"],
  },
  {
    id: "cucurbits",
    nameHi: "कुकुरबिट",
    nameEn: "Cucurbits",
    shortHi: "खीरा व लताएँ",
    cropSlugs: ["cucumber"],
  },
  {
    id: "cole",
    nameHi: "कोल फसल",
    nameEn: "Cole crops",
    shortHi: "फूलगोभी",
    cropSlugs: ["cauliflower"],
  },
  {
    id: "bulbs_roots",
    nameHi: "कंद / बल्ब",
    nameEn: "Bulbs & roots",
    shortHi: "प्याज",
    cropSlugs: ["onion"],
  },
  {
    id: "fibre_sugar",
    nameHi: "रेशा व गन्ना",
    nameEn: "Fibre & sugar",
    shortHi: "कपास · गन्ना",
    cropSlugs: ["cotton", "sugarcane"],
  },
  {
    id: "spices",
    nameHi: "मसाले",
    nameEn: "Spices",
    shortHi: "मिर्च · अदरक · लहसुन",
    cropSlugs: ["chilli", "ginger", "garlic"],
  },
  {
    id: "fruits",
    nameHi: "फल",
    nameEn: "Fruits",
    shortHi: "आम · केला · अंगूर",
    cropSlugs: ["mango", "banana", "grapes"],
  },
  {
    id: "leafy_okra",
    nameHi: "भिंडी",
    nameEn: "Okra / leafy veg",
    shortHi: "भिंडी (lady finger)",
    cropSlugs: ["bhindi"],
  },
];

const familyBySlug = new Map<string, CropFamily>();
for (const family of cropFamilies) {
  for (const slug of family.cropSlugs) {
    familyBySlug.set(slug, family);
  }
}

export function getCropFamilies(): CropFamily[] {
  return cropFamilies;
}

export function getFamilyForSlug(slug: string): CropFamily | undefined {
  return familyBySlug.get(slug.trim().toLowerCase());
}

export function listFamilyCrops(familyId: CropFamilyId): string[] {
  return cropFamilies.find((f) => f.id === familyId)?.cropSlugs ?? [];
}
