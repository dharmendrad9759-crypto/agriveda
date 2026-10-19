import {
  lookupChemBottle,
  bottleCategory,
  bottleLabelParts,
} from "@/lib/crops/chemBottle";
import type { ChemBottleCategory } from "@/data/chem-bottle-catalog";

export type MedicineKind = "chemical" | "trap" | "mix" | "advice";

export interface FarmerDoseBreakdown {
  perLiter: string;
  perTank: string;
  perAcre: string;
}

export interface TrapDetails {
  trapNameHi: string;
  trapNameEn: string;
  trapType: "pheromone" | "sticky_yellow" | "sticky_blue" | "light" | "general";
  lureName?: string;
  ratePerAcre: string;
  timing: string;
  culturalAction?: string;
  purpose: string;
  maintenanceNote: string;
  imageSrc: string;
}

export interface TankMixComponent {
  id: string;
  nameHi: string;
  nameEn: string;
  formulation: string;
  brand?: string;
  dosePerLiter: string;
  dosePerTank: string;
  dosePerAcre: string;
  category: ChemBottleCategory;
  bottleSlug?: string;
}

export interface TankMixDetails {
  titleHi: string;
  purposeHi: string;
  components: TankMixComponent[];
  spreader?: {
    nameHi: string;
    dosePerTank: string;
    dosePerLiter: string;
    purpose: string;
    bottleSlug?: string;
  };
  mixingAdvice: string;
}

export interface ParsedMedicineItem {
  id: string;
  raw: string;
  kind: MedicineKind;
  isChemical: boolean;
  technicalHi: string;
  technicalEn: string;
  formulation: string;
  brands: string[];
  dose: string;
  waterDose: string;
  farmerDose: FarmerDoseBreakdown;
  category: ChemBottleCategory;
  categoryLabelHi: string;
  bottleSlug?: string;
  fullNote?: string;
  trap?: TrapDetails;
  tankMix?: TankMixDetails;
}

const CATEGORY_NAMES_HI: Record<ChemBottleCategory, string> = {
  insecticide: "कीटनाशक (Insecticide)",
  fungicide: "फफूंदनाशक (Fungicide)",
  herbicide: "खरपतवारनाशक (Herbicide)",
  pgr: "टॉनिक / पीजीआर (Plant Tonic)",
};

/** Checks if a parenthesized token is a dosage/measurement rather than a commercial brand name */
export function isDoseOrMeasurement(s: string): boolean {
  const t = s.trim();
  return (
    /(?:\d+(?:\.\d+)?\s*(?:मिली|ग्राम|ml|g|gm|लीटर|l|पंप|टंकी|एकड़|हेक्टेयर|प्रति|\/|PPM|प्रतिशत|%))/i.test(
      t
    ) ||
    /^(?:दवा|स्प्रे|घोल|पानी|प्रति|दर|मात्र|खुराक|दिन)/i.test(t)
  );
}

/**
 * Splits a complex advice line that contains "या" / "अथवा" into individual choices.
 */
export function splitMedicineLine(line: string): string[] {
  const cleaned = line.replace(/।\s*$/, "").trim();
  if (!cleaned) return [];

  // Don't split inside parentheses
  const parts = cleaned.split(/\s+(?:या|अथवा|\/)\s+(?![^(]*\))/i);
  return parts.map((p) => p.trim()).filter((p) => p.length > 3);
}

/**
 * Calculates farmer-friendly tank and per-acre dosing breakdown.
 */
export function calculateFarmerDose(doseStr: string): FarmerDoseBreakdown {
  const cleaned = doseStr.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return {
      perLiter: "लेबल के अनुसार",
      perTank: "लेबल के अनुसार",
      perAcre: "150-200 लीटर पानी प्रति एकड़",
    };
  }

  // Seed treatment
  if (/बीज|seed/i.test(cleaned)) {
    return {
      perLiter: cleaned,
      perTank: "बीज उपचार के लिए",
      perAcre: "बुवाई पूर्व बीज में अच्छी तरह मिलाएं",
    };
  }

  // Soil drenching
  if (/ड्रेंचिंग|drench/i.test(cleaned)) {
    return {
      perLiter: cleaned,
      perTank: "पौधे की जड़ों में डालें",
      perAcre: "जड़ क्षेत्र (ड्रेंचिंग) के लिए",
    };
  }

  // Direct per acre
  const acreMatch = cleaned.match(
    /(\d+(?:\.\d+)?(?:\s*से\s*\d+(?:\.\d+)?)?)\s*(किग्रा|kg|ग्राम|gm|g|मिली|ml|लीटर|l)\s*(?:\/|प्रति)\s*(?:एकड़|acre)/i
  );
  if (acreMatch) {
    const num = acreMatch[1];
    const unit = acreMatch[2];
    return {
      perLiter: `${num} ${unit} / एकड़`,
      perTank: "10 टंकी (पंप) में बराबर बांटें",
      perAcre: `${num} ${unit} प्रति एकड़ (200 लीटर पानी)`,
    };
  }

  // Per liter dosage with decimal or range
  const literMatch = cleaned.match(
    /(\d+(?:\.\d+)?)(?:\s*से\s*(\d+(?:\.\d+)?))?\s*(ग्राम|मिली|ml|gm|g|लीटर|l)(?:\s*(?:\/|प्रति)?\s*(?:लीटर|l))?/i
  );
  if (literMatch) {
    const minVal = parseFloat(literMatch[1]);
    const maxVal = literMatch[2] ? parseFloat(literMatch[2]) : undefined;
    const rawUnit = literMatch[3].toLowerCase();
    const isMl = /मिली|ml|लीटर|l/.test(rawUnit) && !/ग्राम|gm|g/.test(rawUnit);
    const unitLabel = isMl ? "मिली" : "ग्राम";

    if (maxVal !== undefined) {
      const tankMin = Math.round(minVal * 16 * 10) / 10;
      const tankMax = Math.round(maxVal * 16 * 10) / 10;
      const acreMin = Math.round(minVal * 200);
      const acreMax = Math.round(maxVal * 200);
      return {
        perLiter: `${minVal} से ${maxVal} ${unitLabel} प्रति लीटर`,
        perTank: `${tankMin}-${tankMax} ${unitLabel} प्रति 16L पंप`,
        perAcre: `${acreMin}-${acreMax} ${unitLabel} प्रति एकड़`,
      };
    } else {
      const tankVal = minVal * 16;
      const tankStr = tankVal % 1 === 0 ? tankVal.toString() : tankVal.toFixed(1);
      const acreVal = Math.round(minVal * 200);
      const acreStr =
        acreVal >= 1000 && !isMl
          ? `${(acreVal / 1000).toFixed(1)} किग्रा`
          : `${acreVal} ${unitLabel}`;
      return {
        perLiter: `${minVal} ${unitLabel} प्रति लीटर पानी`,
        perTank: `${tankStr} ${unitLabel} प्रति 16L पंप (टंकी)`,
        perAcre: `${acreStr} प्रति एकड़ (200L पानी)`,
      };
    }
  }

  return {
    perLiter: cleaned,
    perTank: "15-16 लीटर टंकी में सही माप डालें",
    perAcre: "150-200 लीटर पानी प्रति एकड़",
  };
}

/**
 * Detects if the given text describes a Pheromone / Sticky Trap IPM practice.
 */
export function isTrapText(text: string): boolean {
  const norm = text.toLowerCase();
  const hasTrapWord =
    /(?:फेरोमोन\s*ट्रैप|चिपचिपे?\s*ट्रैप|स्टीकी\s*ट्रैप|लाइट\s*ट्रैप|ल्यूसिल्यूर|हेलिल्यूर|स्पोडोल्यूर|टूटा\s*ल्यूर|क्यू-ल्यूर|डीबीएम\s*ट्रैप|फनल\s*ट्रैप|tuta phero-lure|pectino-lure|cuelure|helilure|spodolure|sticky trap|ट्रैप\s*(?:क्रॉप|\d+))/i.test(
      norm
    );

  const hasHeavyChemical =
    /@\s*\d/i.test(text) &&
    /\b(?:WP|EC|SC|SG|WG|SL|SP|FS|OD|DF|GR)\b/i.test(text);

  return hasTrapWord && !hasHeavyChemical;
}

/**
 * Parses trap specifications (traps/acre, timing, cultural clipping, image).
 */
export function parseTrapItem(text: string): ParsedMedicineItem {
  let trapType: TrapDetails["trapType"] = "pheromone";
  let imageSrc = "/images/chem/traps/pheromone-funnel-trap.jpg";
  let trapNameHi = "फेरोमोन ट्रैप (Pheromone Trap)";
  let trapNameEn = "Pheromone Trap";
  let lureName = "";

  if (/नीले|blue/i.test(text)) {
    trapType = "sticky_blue";
    imageSrc = "/images/chem/traps/sticky-trap-blue.svg";
    trapNameHi = "नीले चिपचिपे ट्रैप (Blue Sticky Traps)";
    trapNameEn = "Blue Sticky Traps (for Thrips)";
  } else if (/पीले|yellow/i.test(text)) {
    trapType = "sticky_yellow";
    imageSrc = "/images/chem/traps/sticky-trap-yellow.svg";
    trapNameHi = "पीले चिपचिपे ट्रैप (Yellow Sticky Traps)";
    trapNameEn = "Yellow Sticky Traps (for Whitefly / Aphid)";
  } else if (/ल्यूसिल्यूर|lucilure/i.test(text)) {
    trapType = "pheromone";
    trapNameHi = "ल्यूसिल्यूर फेरोमोन ट्रैप";
    trapNameEn = "Lucilure Pheromone Funnel Trap";
    lureName = "Lucilure (ल्यूसिल्यूर)";
  } else if (/हेलिल्यूर|helilure/i.test(text)) {
    trapType = "pheromone";
    trapNameHi = "हेलिल्यूर फेरोमोन ट्रैप";
    trapNameEn = "Helilure Pheromone Trap";
    lureName = "Helilure (हेलिल्यूर)";
  } else if (/स्पोडोल्यूर|spodolure/i.test(text)) {
    trapType = "pheromone";
    trapNameHi = "स्पोडोल्यूर फेरोमोन ट्रैप";
    trapNameEn = "Spodolure Pheromone Trap";
    lureName = "Spodolure (स्पोडोल्यूर)";
  } else if (/टूटा|tuta/i.test(text)) {
    trapType = "pheromone";
    trapNameHi = "टूटा ल्यूर फेरोमोन ट्रैप";
    trapNameEn = "Tuta Phero-lure Trap";
    lureName = "Tuta Phero-lure";
  } else if (/क्यू-ल्यूर|cuelure/i.test(text)) {
    trapType = "pheromone";
    trapNameHi = "क्यू-ल्यूर फल मक्खी ट्रैप";
    trapNameEn = "Cuelure Fruit Fly Trap";
    lureName = "Cuelure (क्यू-ल्यूर)";
  } else if (/डीबीएम|dbm/i.test(text)) {
    trapType = "pheromone";
    trapNameHi = "डीबीएम फेरोमोन ट्रैप";
    trapNameEn = "DBM Pheromone Trap";
    lureName = "DBM Lure";
  }

  // Extract rate per acre
  const rateMatch = text.match(
    /(\d+(?:\s*-\s*\d+)?)\s*(?:प्रति\s*एकड़|ट्रैप\s*प्रति\s*एकड़|ट्रैप|\/एकड़)/i
  );
  const ratePerAcre = rateMatch
    ? `${rateMatch[1]} ट्रैप प्रति एकड़`
    : "10-15 ट्रैप प्रति एकड़";

  // Extract timing
  const timeMatch = text.match(
    /(रोपाई\s*के\s*\d+\s*दिन\s*बाद[^\s।]*|रोपाई\s*के\s*तुरंत\s*बाद|बुवाई\s*के\s*\d+\s*दिन\s*बाद|शुरुआती\s*चरण\s*में)/i
  );
  const timing = timeMatch
    ? `${timeMatch[1].replace(/लगाएं|लगाना/g, "").trim()} लगाएं`
    : "रोपाई / अंकुरण के 15-20 दिन बाद लगाएं";

  // Extract cultural action (clipping wilting branches, hand collection)
  let culturalAction: string | undefined;
  const cultMatch = text.match(
    /(मुरझाई\s*हुई\s*शाखाओं[^।\n]+|मुरझाए\s*हुए[^।\n]+|अंडों\s*के\s*रोएंदार[^।\n]+|खूंटियां[^।\n]+|पुराने\s*तने[^।\n]+)/i
  );
  if (cultMatch) {
    culturalAction = cultMatch[1].trim();
    if (!culturalAction.endsWith("।")) culturalAction += "।";
  }

  const purpose =
    trapType === "pheromone"
      ? "नर पतंगों (Male Moths) को आकर्षित कर पकड़ना ताकि कीट की नई पीढ़ी (अंडे/सुंडी) रुक जाए।"
      : trapType === "sticky_yellow"
      ? "सफेद मक्खी, एफिड व जैसिड जैसे रसचूसक कीटों को प्राकृतिक रूप से चिपकाकर नष्ट करना।"
      : "काले व साधारण थ्रिप्स (Thrips) को चिपकाकर वायरस का फैलाव रोकना।";

  const maintenanceNote =
    trapType === "pheromone"
      ? "फसल की ऊंचाई से 1 फीट ऊपर ट्रैप लगाएं। ल्यूर को 30-40 दिन बाद बदलें।"
      : "पौधे के ऊपरी स्तर से 6 इंच ऊपर लगाएं। धूल या कीट भर जाने पर बदलें।";

  const trapDetails: TrapDetails = {
    trapNameHi,
    trapNameEn,
    trapType,
    lureName,
    ratePerAcre,
    timing,
    culturalAction,
    purpose,
    maintenanceNote,
    imageSrc,
  };

  return {
    id: `trap-${Math.random().toString(36).slice(2, 7)}`,
    raw: text,
    kind: "trap",
    isChemical: false,
    technicalHi: trapNameHi,
    technicalEn: trapNameEn,
    formulation: "IPM यांत्रिक/जैविक",
    brands: lureName ? [lureName] : [],
    dose: ratePerAcre,
    waterDose: "पानी की आवश्यकता नहीं (शून्य रसायन)",
    farmerDose: {
      perLiter: "लागू नहीं",
      perTank: "लागू नहीं",
      perAcre: ratePerAcre,
    },
    category: "insecticide",
    categoryLabelHi: "जैविक / IPM ट्रैप (Trap)",
    fullNote: text,
    trap: trapDetails,
  };
}

/**
 * Detects if the given text describes a tank-mix combination (2 chemicals + silicon spreader).
 */
export function isTankMixText(text: string): boolean {
  if (!text.includes("+")) return false;
  const hasSpreader = /सिलिकॉन|स्प्रेडर|स्टीकर|चिपको|silicon/i.test(text);
  const doseMatches =
    text.match(
      /\d+(?:\.\d+)?\s*(?:%|g\/l|g\/L|ग्राम|मिली|ml|gm|g|EC|SC|SG|WP|WG|SL|OD|ZC|DF|SP|FS)/gi
    ) || [];
  return doseMatches.length >= 2 || hasSpreader;
}

/**
 * Parses tank mix components (Medicine 1 + Medicine 2 + Silicon Spreader).
 */
export function parseTankMix(
  text: string,
  defaultKind: "pest" | "disease" = "pest"
): ParsedMedicineItem {
  const parts = text.split(/\s*\+\s*/);
  const components: TankMixComponent[] = [];
  let spreaderInfo: TankMixDetails["spreader"] = undefined;

  for (const part of parts) {
    const pTrim = part.replace(/[।.\s]+$/, "").trim();
    if (!pTrim) continue;

    // Check if this part is silicon spreader / sticker adjuvant
    if (/सिलिकॉन|चिपको|स्प्रेडर|स्टीकर|silicon/i.test(pTrim)) {
      const doseMatch = pTrim.match(
        /(\d+(?:\.\d+)?)\s*(?:मिली|ml|ग्राम|gm)(?:\s*(?:\/|प्रति)?\s*(?:लीटर|l))?/i
      );
      const doseNum = doseMatch ? parseFloat(doseMatch[1]) : 1;
      const perTank =
        doseNum <= 1 ? "8-10 मिली प्रति 16L पंप" : `${doseNum * 8} मिली प्रति 16L पंप`;
      spreaderInfo = {
        nameHi: "सिलिकॉन स्प्रेडर (चिपको / Silicon Sticker)",
        dosePerLiter: `${doseNum} मिली प्रति 2 लीटर पानी`,
        dosePerTank: perTank,
        purpose:
          "दवा के घोल को पत्तियों व तने पर तुरंत फैलाकर कीट के छेद तक पहुंचाता है (बारिश से धुलने से बचाता है)।",
        bottleSlug: "silicon-spreader",
      };
      continue;
    }

    // Parse chemical component
    // Dose inside parentheses e.g. (0.8 मिली/लीटर) or after @
    let doseStr = "";
    const doseMatch = pTrim.match(
      /\(([^)]*(?:मिली|ग्राम|ml|g|gm|लीटर|l)[^)]*)\)/i
    ) || pTrim.match(/@\s*([^।\n+]+)/i);

    if (doseMatch) {
      doseStr = doseMatch[1].trim();
    } else {
      const inlineDose = pTrim.match(
        /(\d+(?:\.\d+)?\s*(?:ग्राम|मिली|ml|gm|g|लीटर|l)(?:\s*(?:\/|प्रति)?\s*(?:लीटर|l))?)/i
      );
      if (inlineDose) doseStr = inlineDose[0].trim();
    }

    // Clean name without dose
    let cleanName = pTrim
      .replace(/\([^)]*(?:मिली|ग्राम|ml|g|gm|लीटर|l)[^)]*\)/gi, "")
      .replace(/@\s*[^।\n+]+/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const hit = lookupChemBottle(cleanName) || lookupChemBottle(pTrim);
    const category = hit?.category ?? bottleCategory(cleanName) ?? "insecticide";
    const farmerDose = calculateFarmerDose(doseStr);

    // Extract genuine brand if present (e.g. (Delegate) or (Curacron))
    let brand: string | undefined = undefined;
    const allParens = Array.from(pTrim.matchAll(/\(([^)]+)\)/g));
    for (const match of allParens) {
      const content = match[1].trim();
      if (!isDoseOrMeasurement(content)) {
        brand = content;
        break;
      }
    }

    // If no brand found in text, check well-known catalog aliases
    if (!brand && hit?.aliases?.length) {
      const knownBrands: Record<string, string> = {
        "spinetoram-11-7-sc": "Delegate (डेलीगेट)",
        "profenofos-50-ec": "Curacron / Prahar",
        "indoxacarb-14-5-sc": "Avaunt (अवांट)",
        "chlorantraniliprole-18-5-sc": "Coragen (कोराजन)",
        "emamectin-benzoate-5-sg": "Proclaim (प्रोक्लेम)",
        "thiodicarb-75-wp": "Larvin (लार्विन)",
        "flonicamid-50-wg": "Ulala (उलाला)",
        "pyriproxyfen-10-ec": "Lano (लैनो)",
      };
      if (hit.slug && knownBrands[hit.slug]) {
        brand = knownBrands[hit.slug];
      }
    }

    const { formulation } = bottleLabelParts(
      hit ? `${hit.name} ${hit.formulation}` : cleanName
    );

    components.push({
      id: `mix-comp-${Math.random().toString(36).slice(2, 7)}`,
      nameHi: cleanName,
      nameEn: hit ? `${hit.name} ${hit.formulation}`.trim() : cleanName,
      formulation: hit?.formulation || formulation || "",
      brand,
      dosePerLiter: farmerDose.perLiter,
      dosePerTank: farmerDose.perTank,
      dosePerAcre: farmerDose.perAcre,
      category,
      bottleSlug: hit?.slug,
    });
  }

  const mixTitle = components.map((c) => c.nameHi).join(" + ") +
    (spreaderInfo ? " + सिलिकॉन स्प्रेडर" : "");

  const tankMix: TankMixDetails = {
    titleHi: mixTitle,
    purposeHi:
      "प्रतिरोधक क्षमता (Resistance) तोड़ने एवं तुरंत तेज़ असर (Knockdown) हेतु दोहरा वैज्ञानिक मिश्रण।",
    components,
    spreader: spreaderInfo,
    mixingAdvice:
      "🧪 बाल्टी में 10 लीटर पानी लें। पहले पहली दवा घोलें, फिर दूसरी दवा डालें। अच्छी तरह घुलने के बाद अंत में सिलिकॉन स्प्रेडर मिलाएं और स्प्रे पंप में भरें।",
  };

  return {
    id: `mix-${Math.random().toString(36).slice(2, 7)}`,
    raw: text,
    kind: "mix",
    isChemical: true,
    technicalHi: mixTitle,
    technicalEn: components.map((c) => c.nameEn).join(" + "),
    formulation: "टैंक मिश्रण (Tank Mix)",
    brands: components
      .map((c) => c.brand)
      .filter((b): b is string => Boolean(b)),
    dose: components.map((c) => `${c.nameHi}: ${c.dosePerLiter}`).join(" | "),
    waterDose: components.map((c) => `${c.nameHi}: ${c.dosePerAcre}`).join(" | "),
    farmerDose: {
      perLiter: components.map((c) => `${c.nameHi}: ${c.dosePerLiter}`).join(" | "),
      perTank: components.map((c) => `${c.nameHi}: ${c.dosePerTank}`).join(" | "),
      perAcre: components.map((c) => `${c.nameHi}: ${c.dosePerAcre}`).join(" | "),
    },
    category: "insecticide",
    categoryLabelHi: "संयुक्त टैंक मिश्रण (Tank Mix Combo)",
    fullNote: text,
    tankMix,
  };
}

/**
 * Parses an individual medicine string into structured components.
 */
export function parseMedicineItem(
  text: string,
  defaultKind: "pest" | "disease" = "pest"
): ParsedMedicineItem {
  const defaultCategory: ChemBottleCategory =
    defaultKind === "disease" ? "fungicide" : "insecticide";

  // 1. Check if this is a Pheromone / Sticky Trap
  if (isTrapText(text)) {
    return parseTrapItem(text);
  }

  // 2. Check if this is a Tank Mix Combination
  if (isTankMixText(text)) {
    return parseTankMix(text, defaultKind);
  }

  // 3. Check if this is an agronomic sentence rather than a chemical spray
  const isAdviceOnly =
    /^(?:खेत|फसल|बुवाई|प्रमाणित|टीशू|रोगमुक्त|संक्रमित|क्षारीय|कोहरा|पौधे|ब्लीचिंग|सल्फर\s*90%|गोबर)/i.test(
      text.trim()
    ) && !/@|\b(?:WP|EC|SC|SG|WG|SL|SP|FS|OD|DF|GR)\b/i.test(text);

  if (isAdviceOnly) {
    return {
      id: Math.random().toString(36).slice(2, 9),
      raw: text,
      kind: "advice",
      isChemical: false,
      technicalHi: "",
      technicalEn: "",
      formulation: "",
      brands: [],
      dose: "",
      waterDose: "",
      farmerDose: {
        perLiter: "",
        perTank: "",
        perAcre: "",
      },
      category: defaultCategory,
      categoryLabelHi: "खेत की सलाह",
      fullNote: text,
    };
  }

  // 4. Extract genuine commercial brand names in parentheses, filtering out any dosage tokens
  const brands: string[] = [];
  const parenMatches = Array.from(text.matchAll(/\(([^)]+)\)/g));
  for (const pMatch of parenMatches) {
    const rawVal = pMatch[1].trim();
    if (!isDoseOrMeasurement(rawVal)) {
      const splitBrands = rawVal
        .split(/[/,]/)
        .map((b) => b.trim())
        .filter((b) => b && !isDoseOrMeasurement(b));
      brands.push(...splitBrands);
    }
  }

  // 5. Extract dose info after '@' or 'की दर से'
  let dose = "";
  const atMatch = text.match(/@\s*([^।\n+]+)/i);
  if (atMatch) {
    dose = atMatch[1].replace(/[।.\s]+$/, "").trim();
  } else {
    const doseMatch = text.match(
      /(\d+(?:\.\d+)?(?:\s*से\s*\d+(?:\.\d+)?)?\s*(?:ग्राम|मिली|ml|gm|g|kg|किग्रा|लीटर)\s*(?:(?:\/|प्रति)\s*(?:लीटर|एकड़|हेक्टेयर|किग्रा|पंप|टंकी|पौधा))?)/i
    );
    if (doseMatch) {
      dose = doseMatch[0].trim();
    }
  }

  // 6. Extract technical part by removing dose and brands
  let techRaw = text
    .split(/[@•·]| की दर से/i)[0]
    .replace(/\([^)]*\)/g, "")
    .replace(/^(?:अथवा|या)\s+/i, "")
    .trim();

  // Lookup in catalog / bottle helper
  const hit = lookupChemBottle(techRaw) || lookupChemBottle(text);
  const category = hit?.category ?? bottleCategory(techRaw) ?? defaultCategory;
  const { name: parsedName, formulation } = bottleLabelParts(
    hit ? `${hit.name} ${hit.formulation}` : techRaw
  );

  const technicalEn = hit ? `${hit.name} ${hit.formulation}`.trim() : parsedName;
  const technicalHi = techRaw || (hit ? hit.name : text.slice(0, 30));
  const farmerDose = calculateFarmerDose(dose);

  return {
    id: `${hit?.slug || "chem"}-${Math.random().toString(36).slice(2, 7)}`,
    raw: text,
    kind: "chemical",
    isChemical: true,
    technicalHi,
    technicalEn: technicalEn || technicalHi,
    formulation: hit?.formulation || formulation || "",
    brands,
    dose: farmerDose.perLiter || dose || "पैकेट के अनुसार",
    waterDose: farmerDose.perAcre,
    farmerDose,
    category,
    categoryLabelHi: CATEGORY_NAMES_HI[category],
    bottleSlug: hit?.slug,
    fullNote: text,
  };
}
