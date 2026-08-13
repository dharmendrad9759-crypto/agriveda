/** Crops available in AI Doctor crop picker (order shown in UI). */
export const AI_DOCTOR_CROPS = [
  { slug: "tomato", name: "Tomato", nameHi: "टमाटर", emoji: "🍅" },
  { slug: "paddy", name: "Paddy", nameHi: "धान", emoji: "🌾" },
  { slug: "soybean", name: "Soybean", nameHi: "सोयाबीन", emoji: "🫘" },
  { slug: "moongfali", name: "Moongfali", nameHi: "मूंगफली", emoji: "🥜" },
  { slug: "maize", name: "Maize", nameHi: "मक्का", emoji: "🌽" },
  { slug: "chilli", name: "Chilli", nameHi: "मिर्च", emoji: "🌶️" },
  { slug: "cauliflower", name: "Cauliflower", nameHi: "फूल गोभी", emoji: "🥦" },
  { slug: "cucumber", name: "Cucumber", nameHi: "खीरा", emoji: "🥒" },
  { slug: "brinjal", name: "Brinjal", nameHi: "बैंगन", emoji: "🍆" },
  { slug: "sugarcane", name: "Sugarcane", nameHi: "गन्ना", emoji: "🎋" },
  { slug: "potato", name: "Potato", nameHi: "आलू", emoji: "🥔" },
  { slug: "bajra", name: "Bajra", nameHi: "बाजरा", emoji: "🌿" },
  { slug: "wheat", name: "Wheat", nameHi: "गेहूँ", emoji: "🌾" },
  { slug: "bhindi", name: "Bhindi", nameHi: "भिंडी", emoji: "🫛" },
  { slug: "moong", name: "Moong", nameHi: "मूंग", emoji: "🫘" },
  { slug: "onion", name: "Onion", nameHi: "प्याज", emoji: "🧅" },
  { slug: "cotton", name: "Cotton", nameHi: "कपास", emoji: "🌸" },
  { slug: "mustard", name: "Mustard", nameHi: "सरसों", emoji: "🌼" },
] as const;

/** Special picker option — shown first; AI identifies crop from photo/symptoms. */
export const OTHER_CROP = {
  slug: "other",
  name: "Other Crops",
  nameHi: "अन्य फसल",
  emoji: "🌱",
} as const;

/** True when the farmer did not pick a specific listed crop. */
export function isOtherCrop(slug: string): boolean {
  return slug === OTHER_CROP.slug;
}

export function aiDoctorCropLabel(slug: string): string {
  if (slug === OTHER_CROP.slug) return OTHER_CROP.nameHi;
  const listed = AI_DOCTOR_CROPS.find((c) => c.slug === slug);
  return listed?.nameHi ?? slug;
}
