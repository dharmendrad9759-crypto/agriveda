/**
 * Curated mix plans for Mix Advisor (दवा मिलाएँ).
 * Farmer reality: often pest + fungus together + silicone sticker in one tank.
 * Doses are hints — product label is final.
 */

import type { CropProblemItem } from "@/data/crop-curative-problems";

export type GrowthStageId = "vegetative" | "flowering" | "fruiting";

export type MixMedicine = {
  /** Canonical id for tank-mix engine (sticker skipped in chem check) */
  activeId: string;
  nameHi: string;
  formHi: string;
  kindHi: string;
  doseHi: string;
  /** Adjuvant / sticker — not a pesticide active */
  isAdjuvant?: boolean;
};

export type MixPlan = {
  cropSlug: string;
  problemIds: string[];
  /** Usually: फफूंद दवा + कीट दवा (+ sticker separate) */
  medicines: MixMedicine[];
  alternatives: MixMedicine[];
  safeFallback?: MixMedicine[];
  sticker: MixMedicine;
  includeSticker: boolean;
  waterHi: string;
  nozzleHi: string;
  phiDays: number;
  mixStepsHi: string[];
};

export const GROWTH_STAGES: {
  id: GrowthStageId;
  labelHi: string;
  hintHi: string;
}[] = [
  { id: "vegetative", labelHi: "वनस्पति", hintHi: "पत्ती–तना बढ़ रहा हो" },
  { id: "flowering", labelHi: "फूल", hintHi: "फूल आने का समय" },
  { id: "fruiting", labelHi: "फल", hintHi: "फल लग चुके हों" },
];

export const SILICONE_STICKER: MixMedicine = {
  activeId: "silicone-sticker",
  nameHi: "सिलिकॉन स्टिकर",
  formHi: "स्प्रेडर / स्टिकर",
  kindHi: "स्टिकर",
  doseHi: "5–10 मिली/टैंकी (लेबल देखें)",
  isAdjuvant: true,
};

export const PROPICONAZOLE: MixMedicine = {
  activeId: "propiconazole",
  nameHi: "प्रोपिकोनाज़ोल",
  formHi: "25% EC",
  kindHi: "फफूंद दवा",
  doseHi: "150 मिली/एकड़",
};

export const DELTAMETHRIN: MixMedicine = {
  activeId: "deltamethrin",
  nameHi: "डेल्टामेथ्रिन",
  formHi: "2.8% EC",
  kindHi: "कीट दवा",
  doseHi: "200 मिली/एकड़",
};

export const MANCOZEB: MixMedicine = {
  activeId: "mancozeb",
  nameHi: "मैंकोज़ेब",
  formHi: "75% WP",
  kindHi: "फफूंद दवा",
  doseHi: "600 ग्राम/एकड़",
};

export const CARBENDAZIM: MixMedicine = {
  activeId: "carbendazim",
  nameHi: "कार्बेन्डाजिम",
  formHi: "50% WP",
  kindHi: "फफूंद दवा",
  doseHi: "200 ग्राम/एकड़",
};

export const AZOXYSTROBIN: MixMedicine = {
  activeId: "azoxystrobin",
  nameHi: "एज़ोक्सीस्ट्रोबिन",
  formHi: "23% SC",
  kindHi: "फफूंद दवा",
  doseHi: "200 मिली/एकड़",
};

export const CHLOROTHALONIL: MixMedicine = {
  activeId: "chlorothalonil",
  nameHi: "क्लोरोथैलोनिल",
  formHi: "75% WP",
  kindHi: "फफूंद दवा",
  doseHi: "400 ग्राम/एकड़",
};

export const EMAMECTIN: MixMedicine = {
  activeId: "emamectin benzoate",
  nameHi: "इमामेक्टिन",
  formHi: "5% SG",
  kindHi: "कीट दवा",
  doseHi: "80–100 ग्राम/एकड़",
};

export const IMIDACLOPRID: MixMedicine = {
  activeId: "imidacloprid",
  nameHi: "इमिडाक्लोप्रिड",
  formHi: "17.8% SL",
  kindHi: "कीट दवा",
  doseHi: "100 मिली/एकड़",
};

export const METALAXYL_MZ: MixMedicine = {
  activeId: "metalaxyl",
  nameHi: "मेटालैक्सिल + मैंकोज़ेब",
  formHi: "8% + 64% WP",
  kindHi: "फफूंद दवा",
  doseHi: "500 ग्राम/एकड़",
};

const DEFAULT_STEPS_WITH_STICKER = [
  "टैंक आधा साफ पानी से भरें",
  "पहले पाउडर (WP) दवा घोलें — अच्छी तरह मिलाएँ",
  "फिर तरल (EC/SC) दवा डालें",
  "अंत में सिलिकॉन स्टिकर डालें — फिर बाकी पानी भरें",
  "तुरंत छिड़काव करें — टैंकी में घोल न छोड़ें",
];

const DEFAULT_STEPS_NO_STICKER = [
  "टैंक आधा साफ पानी से भरें",
  "पहले पाउडर (WP) दवा घोलें — अच्छी तरह मिलाएँ",
  "फिर तरल (EC/SC) दवा डालें",
  "बाकी पानी भरकर मिलाएँ — तुरंत छिड़काव करें",
];

/** Per-problem preferred medicine (when that problem alone or in a combo). */
const PROBLEM_MED: Record<string, MixMedicine> = {
  "early-blight": PROPICONAZOLE,
  "late-blight": METALAXYL_MZ,
  anthracnose: MANCOZEB,
  "fusarium-wilt": CARBENDAZIM,
  "fruit-borer": EMAMECTIN,
  whitefly: IMIDACLOPRID,
  "leaf-curl": IMIDACLOPRID,
  "leaf-miner": {
    activeId: "abamectin",
    nameHi: "एबामेक्टिन",
    formHi: "1.9% EC",
    kindHi: "कीट दवा",
    doseHi: "200 मिली/एकड़",
  },
  aphid: IMIDACLOPRID,
  cutworm: EMAMECTIN,
};

function isPestTag(tagHi: string): boolean {
  return tagHi.includes("कीट");
}

function isFungusTag(tagHi: string): boolean {
  return tagHi.includes("फफूंद");
}

function isVectorTag(tagHi: string): boolean {
  return tagHi.includes("वायरस");
}

function baseShell(
  cropSlug: string,
  problemIds: string[],
  medicines: MixMedicine[],
  extras?: Partial<MixPlan>
): MixPlan {
  return {
    cropSlug,
    problemIds,
    medicines,
    alternatives: [MANCOZEB, CARBENDAZIM, AZOXYSTROBIN, DELTAMETHRIN, EMAMECTIN],
    safeFallback: [MANCOZEB, DELTAMETHRIN],
    sticker: SILICONE_STICKER,
    includeSticker: true,
    waterHi: "150–200 लीटर/एकड़",
    nozzleHi: "फ्लैट फैन नोजल",
    phiDays: 7,
    mixStepsHi: DEFAULT_STEPS_WITH_STICKER,
    ...extras,
  };
}

/**
 * Build tank plan from one or more selected field problems.
 * Pest + fungus → both medicines in one tank + silicone sticker.
 */
export function buildMixPlanFromProblems(
  cropSlug: string,
  selected: CropProblemItem[]
): MixPlan | null {
  if (!selected.length) return null;

  const fungusProblems = selected.filter((p) => isFungusTag(p.tagHi));
  const pestProblems = selected.filter(
    (p) => isPestTag(p.tagHi) || isVectorTag(p.tagHi)
  );

  let fungicide: MixMedicine | null = null;
  let insecticide: MixMedicine | null = null;

  for (const p of fungusProblems) {
    fungicide = PROBLEM_MED[p.id] ?? MANCOZEB;
    break;
  }
  for (const p of pestProblems) {
    insecticide = PROBLEM_MED[p.id] ?? DELTAMETHRIN;
    break;
  }

  // Single problem fallbacks
  if (!fungicide && !insecticide) {
    const only = selected[0];
    const med = PROBLEM_MED[only.id];
    if (med) {
      if (med.kindHi.includes("कीट")) insecticide = med;
      else fungicide = med;
    } else {
      fungicide = MANCOZEB;
      insecticide = DELTAMETHRIN;
    }
  }

  // Farmer often sprays both together — if only fungus picked, still offer a light pest option? No: only what they selected.
  // But if only pest — just insecticide (+ sticker). If only fungus — just fungicide (+ sticker).
  // If both types — both medicines.

  if (!fungicide && fungusProblems.length === 0 && selected.some((p) => !isPestTag(p.tagHi) && !isVectorTag(p.tagHi))) {
    fungicide = MANCOZEB;
  }

  const medicines: MixMedicine[] = [];
  if (fungicide) medicines.push(fungicide);
  if (insecticide) medicines.push(insecticide);

  // Need at least one chem
  if (!medicines.length) {
    medicines.push(MANCOZEB, DELTAMETHRIN);
  }

  // If farmer selected both pest + fungus but we only got one med somehow
  if (fungusProblems.length && pestProblems.length && medicines.length < 2) {
    if (!fungicide) medicines.unshift(PROPICONAZOLE);
    if (!insecticide) medicines.push(DELTAMETHRIN);
  }

  // Classic tomato: अगेती झुलसा + फल छेदक (design-like)
  const ids = selected.map((p) => p.id).sort();
  const isTomatoBlightBorer =
    cropSlug === "tomato" &&
    ids.includes("early-blight") &&
    (ids.includes("fruit-borer") || ids.includes("whitefly"));

  if (isTomatoBlightBorer) {
    return baseShell(
      cropSlug,
      selected.map((p) => p.id),
      [
        PROPICONAZOLE,
        ids.includes("fruit-borer") ? EMAMECTIN : DELTAMETHRIN,
      ],
      {
        alternatives: [MANCOZEB, CARBENDAZIM, AZOXYSTROBIN, DELTAMETHRIN],
        safeFallback: [PROPICONAZOLE, MANCOZEB],
        phiDays: 7,
      }
    );
  }

  return baseShell(
    cropSlug,
    selected.map((p) => p.id),
    medicines.slice(0, 2),
    {
      phiDays: selected.some((p) => p.id === "late-blight") ? 14 : 7,
    }
  );
}

export function planWithStickerToggle(plan: MixPlan, include: boolean): MixPlan {
  return {
    ...plan,
    includeSticker: include,
    mixStepsHi: include ? DEFAULT_STEPS_WITH_STICKER : DEFAULT_STEPS_NO_STICKER,
  };
}

/** Chem pair for tank-mix engine (skip sticker). */
export function chemPairForCheck(plan: MixPlan, meds?: MixMedicine[]): {
  a: MixMedicine;
  b: MixMedicine | null;
} | null {
  const list = (meds ?? plan.medicines).filter((m) => !m.isAdjuvant);
  if (!list.length) return null;
  return { a: list[0], b: list[1] ?? null };
}

export function tankItems(plan: MixPlan, meds: MixMedicine[]): MixMedicine[] {
  const items = [...meds.filter((m) => !m.isAdjuvant)];
  if (plan.includeSticker) items.push(plan.sticker);
  return items;
}
