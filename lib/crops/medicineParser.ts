import {
  lookupChemBottle,
  bottleCategory,
  bottleLabelParts,
} from "@/lib/crops/chemBottle";
import type { ChemBottleCategory } from "@/data/chem-bottle-catalog";

export interface FarmerDoseBreakdown {
  perLiter: string;
  perTank: string;
  perAcre: string;
}

export interface ParsedMedicineItem {
  id: string;
  raw: string;
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
}

const CATEGORY_NAMES_HI: Record<ChemBottleCategory, string> = {
  insecticide: "कीटनाशक (Insecticide)",
  fungicide: "फफूंदनाशक (Fungicide)",
  herbicide: "खरपतवारनाशक (Herbicide)",
  pgr: "टॉनिक / पीजीआर (Plant Tonic)",
};

/**
 * Splits a complex advice line that contains "या" / "अथवा" into individual choices.
 */
export function splitMedicineLine(line: string): string[] {
  // Don't split inside parentheses
  const cleaned = line.replace(/।\s*$/, "").trim();
  if (!cleaned) return [];

  // Match ' या ' or ' अथवा ' outside parentheses
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
 * Parses an individual medicine string into structured components.
 */
export function parseMedicineItem(
  text: string,
  defaultKind: "pest" | "disease" = "pest"
): ParsedMedicineItem {
  const defaultCategory: ChemBottleCategory =
    defaultKind === "disease" ? "fungicide" : "insecticide";

  // Check if this is an agronomic sentence rather than a chemical spray
  const isAdviceOnly =
    /^(?:खेत|फसल|बुवाई|प्रमाणित|टीशू|रोगमुक्त|संक्रमित|क्षारीय|कोहरा|पौधे|ब्लीचिंग|सल्फर\s*90%|गोबर)/i.test(
      text.trim()
    ) && !/@|\b(?:WP|EC|SC|SG|WG|SL|SP|FS|OD|DF|GR)\b/i.test(text);

  if (isAdviceOnly) {
    return {
      id: Math.random().toString(36).slice(2, 9),
      raw: text,
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

  // 1. Extract brand names in parentheses e.g. (Indofil M-45 / Dithane M-45) or (Score) or (Ulala)
  const brandMatch = text.match(/\(([^)]+)\)/);
  const brandRaw = brandMatch ? brandMatch[1].trim() : "";
  const brands = brandRaw
    ? brandRaw
        .split(/[/,]/)
        .map((b) => b.trim())
        .filter(Boolean)
    : [];

  // 2. Extract dose info after '@' or 'की दर से'
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

  // 3. Extract technical part by removing dose and brands
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
