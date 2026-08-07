import type { NutrientDeficiencyData } from "@/types/deficiency";
import type { FarmerNutrientView } from "@/lib/nutrients/farmerNutrientView";
import { simplifySymptomLine } from "@/lib/nutrients/farmerNutrientView";

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
};

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

export function getCropOptions(nutrient: NutrientDeficiencyData): CropOption[] {
  const fromData = nutrient.cropSpecificData.map((c) => c.cropName);
  const keys = [
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
    title: shorten(title, 40),
    farmerNote: shorten(technical || title, 85),
    technicalNote: shorten(technical || line, 120),
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
    ...farmer.lakshan.map((s, i) => ({
      id: `general-${i}`,
      title: shorten(s, 42),
      description: s,
      part: mobilityPart,
      severity: (i === 0 ? "high" : "medium") as "high" | "medium",
    })),
  ];

  if (nutrient.symptomDetail?.early) {
    symptoms.push({
      id: "early",
      title: "शुरुआती अवस्था",
      description: shorten(nutrient.symptomDetail.early, 90),
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
      title: `${labelHi} में विशेष कारण`,
      farmerNote: shorten(crop.cause, 90),
      technicalNote: shorten(crop.notes || crop.cause, 110),
    });
  }

  return {
    cropKey,
    labelHi,
    emoji,
    cropSymptom,
    cropFix: crop?.correction ? shorten(crop.correction, 90) : farmer.kyaKaren[0]?.detail ?? "",
    cropPrevention: crop?.prevention ? shorten(crop.prevention, 80) : farmer.bachav[0] ?? "",
    cropCause: crop?.cause ? shorten(crop.cause, 90) : "",
    cropStage: crop?.stage ?? "खेत में निरीक्षण",
    symptoms: focusSymptoms,
    causes: causes.slice(0, 5),
    preventionDos: farmer.bachav,
    preventionDonts: (nutrient.commonFarmerMistakes ?? []).slice(0, 4).map((m) => shorten(m, 75)),
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
