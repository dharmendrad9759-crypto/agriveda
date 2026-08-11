import type { NutrientDeficiencyData } from "@/types/deficiency";
import type { FarmerNutrientView } from "@/lib/nutrients/farmerNutrientView";
import { simplifyFarmerHi, simplifySymptomLine } from "@/lib/nutrients/farmerNutrientView";

export const CROP_EMOJI: Record<string, string> = {
  Paddy: "🌾",
  Soybean: "🌱",
  Maize: "🌽",
  Chilli: "🌶️",
  Groundnut: "🥜",
  Capsicum: "🫑",
  Cauliflower: "🥦",
  Cabbage: "🥬",
  Cucumber: "🥒",
  Brinjal: "🍆",
  Okra: "🫛",
  Bajra: "🌾",
  Moong: "🫘",
  Arhar: "🫘",
  Sugarcane: "🎋",
  Wheat: "🌾",
  Tomato: "🍅",
  Potato: "🥔",
  Cotton: "☁️",
  Onion: "🧅",
  Mango: "🥭",
  Banana: "🍌",
  Grapes: "🍇",
  Mustard: "🌼",
  Ginger: "🫚",
  Garlic: "🧄",
  Chana: "🟡",
  Masoor: "🟠",
  Urad: "⚫",
};

export const CROP_LABEL_HI: Record<string, string> = {
  Paddy: "धान",
  Soybean: "सोयाबीन",
  Groundnut: "मूंगफली",
  Chilli: "मिर्च",
  Capsicum: "शिमला मिर्च",
  Cauliflower: "फूल गोभी",
  Cabbage: "पत्ता गोभी",
  Cucumber: "खीरा",
  Brinjal: "बैंगन",
  Okra: "भिंडी",
  Maize: "मक्का",
  Bajra: "बाजरा",
  Moong: "मूंग",
  Arhar: "अरहर",
  Sugarcane: "गन्ना",
  Wheat: "गेहूँ",
  Tomato: "टमाटर",
  Potato: "आलू",
  Cotton: "कपास",
  Onion: "प्याज",
  Mango: "आम",
  Banana: "केला",
  Grapes: "अंगूर",
  Mustard: "सरसों",
  Ginger: "अदरक",
  Garlic: "लहसुन",
  Chana: "चना",
  Masoor: "मसूर",
  Urad: "उड़द",
};

/** App crop slugs → nutrient batch cropName keys */
const SLUG_TO_CROP_KEY: Record<string, string> = {
  paddy: "Paddy",
  rice: "Paddy",
  wheat: "Wheat",
  maize: "Maize",
  bajra: "Bajra",
  soybean: "Soybean",
  moongfali: "Groundnut",
  groundnut: "Groundnut",
  chilli: "Chilli",
  chili: "Chilli",
  capsicum: "Capsicum",
  cauliflower: "Cauliflower",
  cabbage: "Cabbage",
  cucumber: "Cucumber",
  brinjal: "Brinjal",
  bhindi: "Okra",
  okra: "Okra",
  moong: "Moong",
  pulses: "Arhar",
  arhar: "Arhar",
  sugarcane: "Sugarcane",
  tomato: "Tomato",
  potato: "Potato",
  cotton: "Cotton",
  onion: "Onion",
  mango: "Mango",
  banana: "Banana",
  grapes: "Grapes",
  mustard: "Mustard",
  ginger: "Ginger",
  garlic: "Garlic",
  chana: "Chana",
  masoor: "Masoor",
  urad: "Urad",
};

/**
 * Resolve URL `?crop=` (app slug or batch cropName) to the nutrient crop strip key.
 */
export function resolveNutrientCropKey(cropParam?: string | null): string | undefined {
  if (!cropParam) return undefined;
  const raw = cropParam.trim();
  if (!raw) return undefined;
  const lower = raw.toLowerCase();
  if (SLUG_TO_CROP_KEY[lower]) return SLUG_TO_CROP_KEY[lower];
  // Already a batch key (e.g. "Paddy") or Title Case crop name
  if (CROP_LABEL_HI[raw] || CROP_EMOJI[raw]) return raw;
  const titled = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  if (CROP_LABEL_HI[titled] || CROP_EMOJI[titled]) return titled;
  return titled;
}

const PRIORITY_CROPS = [
  "Paddy",
  "Wheat",
  "Soybean",
  "Maize",
  "Chilli",
  "Tomato",
  "Potato",
  "Cotton",
  "Groundnut",
];

export interface CropOption {
  key: string;
  labelHi: string;
  emoji: string;
}

export interface SymptomCardData {
  id: string;
  title: string;
  description: string;
  part: string;
  severity: "high" | "medium" | "low";
}

export interface CauseCardData {
  id: string;
  title: string;
  farmerNote: string;
  technicalNote: string;
}

export interface CropNutrientScope {
  cropKey: string;
  labelHi: string;
  emoji: string;
  cropSymptom: string;
  cropFix: string;
  cropPrevention: string;
  cropCause: string;
  cropStage: string;
  symptoms: SymptomCardData[];
  causes: CauseCardData[];
  preventionDos: string[];
  preventionDonts: string[];
}

function shorten(text: string, max = 100): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > 30 ? cut.slice(0, sp) : cut).trim() + "…";
}

export function getCropOptions(
  nutrient: NutrientDeficiencyData,
  preferredCropParam?: string | null
): CropOption[] {
  const preferred = resolveNutrientCropKey(preferredCropParam);
  const fromData = nutrient.cropSpecificData.map((c) => c.cropName);
  const keys = [
    ...(preferred ? [preferred] : []),
    ...PRIORITY_CROPS,
    ...fromData.filter((k) => !PRIORITY_CROPS.includes(k)),
  ];
  // unique preserve order
  const seen = new Set<string>();
  const ordered = keys.filter((k) => {
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return ordered.map((key) => ({
    key,
    labelHi: CROP_LABEL_HI[key] ?? key,
    emoji: CROP_EMOJI[key] ?? "🌿",
  }));
}

function splitCause(line: string): { title: string; farmerNote: string; technicalNote: string } {
  const [title, ...rest] = line.split(":");
  const technical = rest.join(":").trim();
  return {
    title: simplifyFarmerHi(title, 40),
    farmerNote: simplifyFarmerHi(technical || title, 90),
    technicalNote: simplifyFarmerHi(technical || line, 100),
  };
}

export function buildCropScope(
  nutrient: NutrientDeficiencyData,
  farmer: FarmerNutrientView,
  cropKey: string
): CropNutrientScope {
  const crop = nutrient.cropSpecificData.find((c) => c.cropName === cropKey);
  const labelHi = CROP_LABEL_HI[cropKey] ?? cropKey;
  const emoji = CROP_EMOJI[cropKey] ?? "🌿";

  const cropSymptom = crop?.symptoms[0]
    ? simplifySymptomLine(crop.symptoms[0])
    : farmer.lakshan[0] ?? "";

  const mobilityPart =
    nutrient.mobility === "Mobile"
      ? "पुरानी (नीचे की) पत्ती"
      : nutrient.mobility === "Immobile"
        ? "नई (ऊपर की) पत्ती"
        : "पत्ती / तना";

  const symptoms: SymptomCardData[] = [
    {
      id: "crop-primary",
      title: cropSymptom ? shorten(cropSymptom, 42) : `${labelHi} में मुख्य लक्षण`,
      description: cropSymptom,
      part: mobilityPart,
      severity: "high",
    },
  ];

  for (let i = 0; i < farmer.lakshan.length; i++) {
    const s = farmer.lakshan[i];
    const sameAsPrimary =
      !cropSymptom ||
      s === cropSymptom ||
      cropSymptom.includes(s.slice(0, 18)) ||
      s.includes(cropSymptom.slice(0, 18));
    if (sameAsPrimary && i === 0) continue;
    symptoms.push({
      id: `general-${i}`,
      title: shorten(s, 42),
      description: s,
      part: mobilityPart,
      severity: (i === 0 ? "high" : "medium") as "high" | "medium",
    });
  }

  if (nutrient.symptomDetail?.early) {
    symptoms.push({
      id: "early",
      title: "शुरुआती अवस्था",
      description: simplifyFarmerHi(nutrient.symptomDetail.early, 90),
      part: mobilityPart,
      severity: "low",
    });
  }

  // Farmer detail: show top 3 so each can have a distinct matched photo
  const focusSymptoms = symptoms.slice(0, 3);

  const causes: CauseCardData[] = (nutrient.whyItHappens ?? [])
    .slice(0, 5)
    .map((line, i) => {
      const parsed = splitCause(line);
      return { id: `cause-${i}`, ...parsed };
    });

  if (crop?.cause) {
    causes.unshift({
      id: "crop-cause",
      title: `${labelHi} में खास वजह`,
      farmerNote: simplifyFarmerHi(crop.cause, 95),
      technicalNote: simplifyFarmerHi(crop.notes || crop.cause, 100),
    });
  }

  const cropFixRaw = crop?.correction
    ? simplifyFarmerHi(crop.correction, 95)
    : farmer.kyaKaren[0]?.detail ?? "";

  return {
    cropKey,
    labelHi,
    emoji,
    cropSymptom,
    cropFix: cropFixRaw,
    cropPrevention: crop?.prevention
      ? simplifyFarmerHi(crop.prevention, 85)
      : farmer.bachav[0] ?? "",
    cropCause: crop?.cause ? simplifyFarmerHi(crop.cause, 95) : "",
    cropStage: crop?.stage
      ? simplifyFarmerHi(crop.stage, 40)
      : "खेत में देखकर समझें",
    symptoms: focusSymptoms,
    causes: causes.slice(0, 5),
    preventionDos: farmer.bachav.map((b) => simplifyFarmerHi(b, 75)),
    preventionDonts: (nutrient.commonFarmerMistakes ?? [])
      .slice(0, 4)
      .map((m) => simplifyFarmerHi(m, 75)),
  };
}

export function categoryLabelHi(category?: string): string {
  if (!category) return "पोषक तत्व";
  const c = category.toLowerCase();
  if (
    c.includes("primary") ||
    c.includes("macronutrient") ||
    category.includes("प्राथमिक") ||
    category.includes("बड़ा")
  )
    return "मुख्य खाद";
  if (c.includes("secondary") || category.includes("द्वितीयक")) return "द्वितीयक खाद";
  if (c.includes("micronutrient") || category.includes("सूक्ष्म")) return "सूक्ष्म खाद";
  if (c.includes("beneficial") || category.includes("लाभकारी")) return "लाभकारी";
  return "पोषक तत्व";
}

export function healthFromSeverity(severity: string): {
  label: string;
  pct: number;
  tone: "emerald" | "amber" | "rose";
} {
  if (severity === "Critical" || severity === "High") {
    return { label: "उच्च जोखिम", pct: 78, tone: "amber" };
  }
  if (severity === "Moderate") {
    return { label: "मध्यम जोखिम", pct: 52, tone: "emerald" };
  }
  return { label: "कम जोखिम", pct: 28, tone: "emerald" };
}
