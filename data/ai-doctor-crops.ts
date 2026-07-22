/** Crops available in AI Doctor crop picker (order shown in UI). */
export const AI_DOCTOR_CROPS = [
  { slug: "tomato", name: "Tomato", emoji: "🍅" },
  { slug: "paddy", name: "Paddy", emoji: "🌾" },
  { slug: "soybean", name: "Soybean", emoji: "🫘" },
  { slug: "moongfali", name: "Moongfali", emoji: "🥜" },
  { slug: "maize", name: "Maize", emoji: "🌽" },
  { slug: "chilli", name: "Chilli", emoji: "🌶️" },
  { slug: "cauliflower", name: "Cauliflower", emoji: "🥦" },
  { slug: "cucumber", name: "Cucumber", emoji: "🥒" },
  { slug: "brinjal", name: "Brinjal", emoji: "🍆" },
  { slug: "sugarcane", name: "Sugarcane", emoji: "🎋" },
  { slug: "potato", name: "Potato", emoji: "🥔" },
  { slug: "bajra", name: "Bajra", emoji: "🌿" },
  { slug: "wheat", name: "Wheat", emoji: "🌾" },
  { slug: "bhindi", name: "Bhindi", emoji: "🫛" },
  { slug: "moong", name: "Moong", emoji: "🫘" },
] as const;

/** Special picker option — shown first; AI identifies crop from photo/symptoms. */
export const OTHER_CROP = { slug: "other", name: "Other Crops", emoji: "🌱" } as const;

/** True when the farmer did not pick a specific listed crop. */
export function isOtherCrop(slug: string): boolean {
  return slug === OTHER_CROP.slug;
}
