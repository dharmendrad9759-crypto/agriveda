/**
 * AgriVeda Seasonal Crop Intelligence Engine
 * 
 * Dynamically orders, scores, and prioritizes agricultural crops based on
 * the current calendar month and Indian agronomic seasons (Rabi, Kharif, Zaid).
 * 
 * Agronomic Principles:
 * - Rabi (October to March): Wheat, Mustard, Potato, Gram (Chana), Peas, Garlic, Onion, Winter Veg.
 * - Kharif (June to October): Paddy, Soybean, Maize, Cotton, Bajra, Groundnut, Arhar, Monsoon Veg.
 * - Zaid (February to June): Moong, Urad, Cucumber, Watermelon, Muskmelon, Bhindi, Sugarcane.
 * 
 * Works quietly and intelligently without visual clutter or intrusive tags.
 */

export type AgriSeasonId = "rabi" | "kharif" | "zaid";

export interface SeasonInfo {
  seasonId: AgriSeasonId;
  nameHi: string;
  nameEn: string;
  monthsHi: string;
  monthsEn: string;
}

/**
 * Seasonal sowing & peak relevance definitions for all Indian crops
 */
interface CropSeasonProfile {
  primarySeason: AgriSeasonId;
  seasons: AgriSeasonId[];
  /** Sowing window months (1 = Jan, 12 = Dec). Can wrap across year-end (e.g. 10 to 12). */
  sowingMonths: number[];
  /** Growth / standing active months */
  activeMonths: number[];
  /** Base priority weight within the season (1-10, 10 being the most ubiquitous cash/staple crop) */
  priorityWeight: number;
}

const CROP_SEASON_PROFILES: Record<string, CropSeasonProfile> = {
  // --- Rabi Crops (Sown Oct–Dec, Harvested Mar–Apr) ---
  wheat: {
    primarySeason: "rabi",
    seasons: ["rabi"],
    sowingMonths: [10, 11, 12],
    activeMonths: [10, 11, 12, 1, 2, 3, 4],
    priorityWeight: 15, // Flagship North/Central India staple
  },
  mustard: {
    primarySeason: "rabi",
    seasons: ["rabi"],
    sowingMonths: [9, 10, 11],
    activeMonths: [9, 10, 11, 12, 1, 2, 3],
    priorityWeight: 14, // Major Rabi oilseed
  },
  potato: {
    primarySeason: "rabi",
    seasons: ["rabi", "zaid"],
    sowingMonths: [9, 10, 11, 1],
    activeMonths: [9, 10, 11, 12, 1, 2, 3],
    priorityWeight: 13, // High cash Rabi tuber
  },
  chana: {
    primarySeason: "rabi",
    seasons: ["rabi"],
    sowingMonths: [10, 11],
    activeMonths: [10, 11, 12, 1, 2, 3, 4],
    priorityWeight: 12, // King of Rabi pulses
  },
  masoor: {
    primarySeason: "rabi",
    seasons: ["rabi"],
    sowingMonths: [10, 11],
    activeMonths: [10, 11, 12, 1, 2, 3],
    priorityWeight: 10,
  },
  garlic: {
    primarySeason: "rabi",
    seasons: ["rabi"],
    sowingMonths: [9, 10, 11],
    activeMonths: [9, 10, 11, 12, 1, 2, 3, 4],
    priorityWeight: 9,
  },
  onion: {
    primarySeason: "rabi",
    seasons: ["rabi", "kharif"],
    sowingMonths: [10, 11, 12, 6, 7],
    activeMonths: [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8],
    priorityWeight: 10,
  },
  cauliflower: {
    primarySeason: "rabi",
    seasons: ["rabi", "kharif"],
    sowingMonths: [7, 8, 9, 10, 11],
    activeMonths: [8, 9, 10, 11, 12, 1, 2],
    priorityWeight: 8,
  },
  cabbage: {
    primarySeason: "rabi",
    seasons: ["rabi"],
    sowingMonths: [9, 10, 11],
    activeMonths: [9, 10, 11, 12, 1, 2],
    priorityWeight: 7,
  },
  capsicum: {
    primarySeason: "rabi",
    seasons: ["rabi", "zaid"],
    sowingMonths: [9, 10, 11, 2],
    activeMonths: [9, 10, 11, 12, 1, 2, 3, 4],
    priorityWeight: 7,
  },
  tomato: {
    primarySeason: "rabi",
    seasons: ["rabi", "kharif", "zaid"],
    sowingMonths: [8, 9, 10, 1, 2, 5, 6],
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 8,
  },

  // --- Kharif Crops (Sown Jun–Jul, Harvested Oct–Nov) ---
  paddy: {
    primarySeason: "kharif",
    seasons: ["kharif"],
    sowingMonths: [5, 6, 7],
    activeMonths: [5, 6, 7, 8, 9, 10, 11],
    priorityWeight: 15,
  },
  soybean: {
    primarySeason: "kharif",
    seasons: ["kharif"],
    sowingMonths: [6, 7],
    activeMonths: [6, 7, 8, 9, 10],
    priorityWeight: 14,
  },
  cotton: {
    primarySeason: "kharif",
    seasons: ["kharif"],
    sowingMonths: [4, 5, 6],
    activeMonths: [4, 5, 6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 13,
  },
  maize: {
    primarySeason: "kharif",
    seasons: ["kharif", "zaid", "rabi"],
    sowingMonths: [6, 7, 1, 2, 10],
    activeMonths: [6, 7, 8, 9, 10, 1, 2, 3, 4, 5],
    priorityWeight: 12,
  },
  bajra: {
    primarySeason: "kharif",
    seasons: ["kharif"],
    sowingMonths: [6, 7],
    activeMonths: [6, 7, 8, 9, 10],
    priorityWeight: 11,
  },
  moongfali: {
    primarySeason: "kharif",
    seasons: ["kharif", "zaid"],
    sowingMonths: [6, 7, 1, 2],
    activeMonths: [6, 7, 8, 9, 10, 2, 3, 4, 5],
    priorityWeight: 11,
  },
  groundnut: {
    primarySeason: "kharif",
    seasons: ["kharif", "zaid"],
    sowingMonths: [6, 7, 1, 2],
    activeMonths: [6, 7, 8, 9, 10, 2, 3, 4, 5],
    priorityWeight: 11,
  },
  pulses: {
    primarySeason: "kharif",
    seasons: ["kharif"],
    sowingMonths: [6, 7],
    activeMonths: [6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 10,
  },

  // --- Zaid / Summer Crops (Sown Feb–Apr, Harvested Apr–Jun) ---
  moong: {
    primarySeason: "zaid",
    seasons: ["zaid", "kharif"],
    sowingMonths: [2, 3, 4, 6, 7],
    activeMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    priorityWeight: 14,
  },
  urad: {
    primarySeason: "zaid",
    seasons: ["zaid", "kharif"],
    sowingMonths: [2, 3, 4, 6, 7],
    activeMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    priorityWeight: 12,
  },
  cucumber: {
    primarySeason: "zaid",
    seasons: ["zaid", "kharif"],
    sowingMonths: [2, 3, 4, 6, 7],
    activeMonths: [2, 3, 4, 5, 6, 7, 8],
    priorityWeight: 11,
  },
  bhindi: {
    primarySeason: "zaid",
    seasons: ["zaid", "kharif"],
    sowingMonths: [2, 3, 6, 7],
    activeMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    priorityWeight: 11,
  },
  sugarcane: {
    primarySeason: "zaid",
    seasons: ["zaid", "rabi"],
    sowingMonths: [2, 3, 9, 10],
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 13,
  },

  // --- Multi-Season & Perennial Crops ---
  brinjal: {
    primarySeason: "kharif",
    seasons: ["kharif", "rabi", "zaid"],
    sowingMonths: [5, 6, 7, 9, 10, 1, 2],
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 6,
  },
  chilli: {
    primarySeason: "rabi",
    seasons: ["rabi", "kharif", "zaid"],
    sowingMonths: [8, 9, 10, 5, 6, 1, 2],
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 7,
  },
  ginger: {
    primarySeason: "kharif",
    seasons: ["kharif"],
    sowingMonths: [4, 5],
    activeMonths: [4, 5, 6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 5,
  },
  mango: {
    primarySeason: "zaid",
    seasons: ["zaid", "kharif"],
    sowingMonths: [7, 8],
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 6,
  },
  banana: {
    primarySeason: "kharif",
    seasons: ["kharif"],
    sowingMonths: [6, 7, 9, 10],
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priorityWeight: 6,
  },
  grapes: {
    primarySeason: "rabi",
    seasons: ["rabi"],
    sowingMonths: [10, 11],
    activeMonths: [10, 11, 12, 1, 2, 3, 4],
    priorityWeight: 5,
  },
};

/**
 * Returns current agricultural season details based on current calendar date.
 * - Rabi: October to March (Months 10, 11, 12, 1, 2, 3)
 * - Zaid: April to May (Months 4, 5)
 * - Kharif: June to September (Months 6, 7, 8, 9)
 */
export function getCurrentAgriSeason(date = new Date()): SeasonInfo {
  const month = date.getMonth() + 1; // 1 to 12

  if (month >= 10 || month <= 3) {
    return {
      seasonId: "rabi",
      nameHi: "रबी",
      nameEn: "Rabi",
      monthsHi: "अक्टूबर–मार्च",
      monthsEn: "Oct–Mar",
    };
  }

  if (month >= 4 && month <= 5) {
    return {
      seasonId: "zaid",
      nameHi: "जायद",
      nameEn: "Zaid",
      monthsHi: "अप्रैल–मई",
      monthsEn: "Apr–May",
    };
  }

  return {
    seasonId: "kharif",
    nameHi: "खरीफ",
    nameEn: "Kharif",
    monthsHi: "जून–सितंबर",
    monthsEn: "Jun–Sep",
  };
}

/**
 * Calculates a 0-100 seasonal relevance score for a given crop right now.
 * Higher score = higher priority and placed towards the front.
 */
export function calculateCropSeasonalityScore(slug: string, date = new Date()): number {
  const cleanSlug = slug.trim().toLowerCase();
  const profile = CROP_SEASON_PROFILES[cleanSlug];
  const month = date.getMonth() + 1; // 1 to 12
  const currentSeason = getCurrentAgriSeason(date).seasonId;

  if (!profile) {
    return 40; // Neutral baseline for unlisted custom crop
  }

  let score = 0;

  // 1. SOWING WINDOW ACTIVE RIGHT NOW (Top priority! Sowing time = highest farmer intent)
  if (profile.sowingMonths.includes(month)) {
    score += 55;
  }
  // Sowing window approaching in next month
  else if (profile.sowingMonths.includes(((month % 12) + 1))) {
    score += 40;
  }

  // 2. PRIMARY SEASON MATCH
  if (profile.primarySeason === currentSeason) {
    score += 25;
  } else if (profile.seasons.includes(currentSeason)) {
    score += 15;
  }

  // 3. CROP ACTIVE IN FIELD (Crop is growing/harvesting in current month)
  if (profile.activeMonths.includes(month)) {
    score += 15;
  }

  // 4. INTRINSIC STAPLE / CASH WEIGHT (Tie-breaker for major regional field crops)
  score += profile.priorityWeight;

  return score;
}

/**
 * Sorts any crop array by current season relevance (highest score first).
 * Completely preserves original list items and adds zero unwanted UI tags.
 */
export function sortCropsByCurrentSeason<T extends { slug: string }>(
  cropList: readonly T[] | T[],
  date = new Date()
): T[] {
  const scored = cropList.map((item) => ({
    item,
    score: calculateCropSeasonalityScore(item.slug, date),
  }));

  // Sort descending by score. If score is equal, retain natural catalog order.
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}

/**
 * Returns the single top-priority crop slug for the current season.
 * E.g., "wheat" in October/November, "paddy" in June/July, "moong" in March/April.
 */
export function getTopCurrentSeasonCropSlug(date = new Date()): string {
  const month = date.getMonth() + 1;

  if (month === 10 || month === 11) {
    return "wheat"; // Peak Rabi sowing (Wheat, Mustard, Potato, Gram)
  }
  if (month >= 12 || month <= 2) {
    return "wheat";
  }
  if (month >= 3 && month <= 5) {
    return "moong"; // Peak Zaid / summer season
  }
  return "paddy"; // Peak Kharif season (Jun–Sep)
}
