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
  trapType: "pheromone" | "sticky_yellow" | "sticky_blue" | "light" | "barrier" | "general";
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
  isBaitSpray?: boolean;
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
 * Splits a complex advice line into individual sentences or alternatives.
 * First splits on full stops (। or \n) when sentences are independent clauses,
 * and then splits on "या" / "अथवा" when alternatives are provided.
 * Note: Never splits on "/" which is part of unit measurements (e.g. ml/L, g/acre).
 */
export function splitMedicineLine(line: string): string[] {
  if (!line) return [];
  const trimmed = line.trim();
  if (!trimmed) return [];

  // Split on purna viram (।) or newline if followed by space/text and not inside parentheses
  const sentences = trimmed
    .split(/।(?:\s+|$|\n)(?![^(]*\))/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  const results: string[] = [];
  for (const sentence of sentences) {
    // If sentence mixes a physical trap / IPM barrier with a foliar spray via "+"
    // e.g. "नीम ऑयल 10,000 PPM (2 मिली/लीटर) + फेरोमोन ट्रैप (Helilure) 5-8 प्रति एकड़"
    // or "नीले चिपचिपे ट्रैप 25 प्रति एकड़ + नीम ऑयल 10,000 PPM @ 2 मिली/लीटर"
    if (
      sentence.includes("+") &&
      /(?:ट्रैप|trap|फेरोमोन|चिपचिपे|स्टीकी|अल्काथीन|ग्रीस|खूंटियां|bird perch)/i.test(sentence) &&
      /(?:नीम|ऑयल|तेल|@|\b(?:PPM|EC|SC|WP|WG|SP)\b|\/लीटर|प्रति\s*लीटर)/i.test(sentence)
    ) {
      const plusParts = sentence.split(/\s*\+\s*/);
      for (const p of plusParts) {
        const cleanP = p.replace(/^[•·\-\s]+/, "").trim();
        if (cleanP.length > 2) results.push(cleanP);
      }
      continue;
    }

    // Split on "या" / "अथवा" only (never split on "/" which breaks units like ml/L)
    const subParts = sentence.split(/\s+(?:या|अथवा)\s+(?![^(]*\))/i).map((p) => p.trim());
    if (subParts.length > 1) {
      // Check if last part has a shared trailing dose/action
      const lastPart = subParts[subParts.length - 1];
      const trailingDoseMatch = lastPart.match(
        /(\s*(?:@\s*|\bकी\s*दर\s*से\s*)?\d+(?:\.\d+)?\s*(?:ग्राम|मिली|किग्रा|kg|gm|g|ml|लीटर)\s*(?:(?:\/|प्रति)\s*(?:लीटर|एकड़|हेक्टेयर|किग्रा|पंप|टंकी|पौधा|पेड़|वृक्ष))?[^।\n]*)$/i
      );

      // Check if first part has a shared leading location/timing prefix before chemical names
      const firstPart = subParts[0];
      const leadingPrefixMatch = firstPart.match(
        /^((?:तने\s*(?:के\s*चारों\s*ओर|पर)[^कखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह]*घेरे\s*में|नवंबर-दिसंबर\s*में|रोपाई\s*के\s*\d+\s*दिन\s*बाद|बुवाई\s*के\s*समय)\s*)/i
      );

      const trailingDose = trailingDoseMatch ? trailingDoseMatch[1].trim() : "";
      const leadingPrefix = leadingPrefixMatch ? leadingPrefixMatch[1].trim() : "";

      for (let i = 0; i < subParts.length; i++) {
        let cleanP = subParts[i].replace(/^[•·\-\s]+/, "").trim();
        if (cleanP.length <= 2) continue;

        // Add shared leading prefix if later part doesn't have it
        if (i > 0 && leadingPrefix && !cleanP.startsWith(leadingPrefix)) {
          cleanP = `${leadingPrefix} ${cleanP}`;
        }

        // Add shared trailing dose if earlier part doesn't have its own dose
        if (
          i < subParts.length - 1 &&
          trailingDose &&
          !/@|प्रति\s*(?:लीटर|एकड़|पेड़|पौधा|पंप)|की\s*दर\s*से|\d+\s*(?:मिली|ग्राम)\s*\//i.test(cleanP)
        ) {
          cleanP = `${cleanP} ${trailingDose}`;
        }

        results.push(cleanP);
      }
    } else {
      const cleanP = sentence.replace(/^[•·\-\s]+/, "").trim();
      if (cleanP.length > 2) results.push(cleanP);
    }
  }

  return results.length > 0 ? results : [trimmed];
}

/**
 * Calculates farmer-friendly tank and per-acre dosing breakdown.
 */
export function calculateFarmerDose(doseStr: string, contextText?: string): FarmerDoseBreakdown {
  const cleaned = doseStr.replace(/\s+/g, " ").trim();
  const full = `${doseStr} ${contextText || ""}`.trim();

  // 1. Liquid root / collar drenching (ड्रेंचिंग)
  if (/ड्रेंचिंग|drench/i.test(full)) {
    const literDose = cleaned || "1-2 मिली प्रति लीटर";
    return {
      perLiter: literDose,
      perTank: "पौधे के तने/जड़ क्षेत्र में ड्रेंचिंग करें (प्रति पौधा 200–500 मिली घोल)",
      perAcre: "जड़ क्षेत्र (ड्रेंचिंग) में घोल डालें",
    };
  }

  // 2. Tree cut wound paste / painting (लेप / पेस्ट)
  if (/लेप|paste|पेस्ट|घाव|कटे हुए/i.test(full)) {
    const gramMatch = full.match(/(\d+(?:\.\d+)?)\s*(?:ग्राम|gm|g)/i);
    const amt = gramMatch ? `${gramMatch[1]} ग्राम/लीटर` : "50 ग्राम/लीटर";
    return {
      perLiter: `${amt} (कटे घावों पर गाढ़ा लेप)`,
      perTank: "लागू नहीं (स्प्रे पंप में न भरें, ब्रश से कटे घाव पर लेप लगाएँ)",
      perAcre: "कटे हुए सिरों/घावों पर ब्रश से लेप करें",
    };
  }

  // 3. Poison bait (विष-चारा / गोलियां)
  if (/गोलियां|चारा|विष-चारा|bait|गुड़|भूसी/i.test(full)) {
    return {
      perLiter: "लागू नहीं (विष-चारा / Poison Bait)",
      perTank: "लागू नहीं (स्प्रे पंप में न डालें, गुड़-भूसी की गोलियां खेत में रखें)",
      perAcre: "शाम को खेत में पौधों के पास छोटी-छोटी गोलियां रखें",
    };
  }

  // 4. Stem injection (तने में इंजेक्शन)
  if (/इंजेक्शन|injection/i.test(full)) {
    return {
      perLiter: "50 ग्राम/लीटर घोल (तने में 2-3 मिली इंजेक्शन)",
      perTank: "लागू नहीं (तने में सिरिंज से 2-3 मिली इंजेक्शन लगाएँ)",
      perAcre: "केवल रोगग्रस्त पौधे के तने में इंजेक्शन दें",
    };
  }

  // 5. Planting pit / furrow application (गड्ढे में / रोपण समय)
  if (/गड्ढे|गड्ढा|प्रति\s*गड्ढा|रोपण\s*के\s*समय/i.test(full)) {
    return {
      perLiter: "लागू नहीं (गड्ढे की मिट्टी में मिलाएँ)",
      perTank: "लागू नहीं (पानी में न घोलें, गड्ढे में 50 ग्राम दवा + नीम खली मिलाएँ)",
      perAcre: "रोपाई के समय प्रति गड्ढा 50 ग्राम मिट्टी में मिलाएँ",
    };
  }

  // 6. Nursery bed soil application (नर्सरी में / प्रति वर्गमीटर)
  if (/प्रति\s*वर्गमीटर|वर्ग\s*मीटर|नर्सरी\s*में/i.test(full)) {
    return {
      perLiter: "लागू नहीं (नर्सरी क्यारी में मिलाएँ)",
      perTank: "लागू नहीं (पानी में न घोलें, 50 ग्राम प्रति वर्गमीटर नर्सरी मिट्टी में मिलाएँ)",
      perAcre: "नर्सरी क्यारी में 50 ग्राम प्रति वर्गमीटर अच्छी तरह मिलाएँ",
    };
  }

  // 7. Tree trunk / orchard basin soil application (तने के चारों ओर, प्रति पेड़, प्रति पौधा, थांवले में)
  const isTreeBasin =
    /प्रति\s*(?:पेड़|वृक्ष)|तने\s*(?:के\s*चारों|पर|घेरे|थांवले)|पेड़\s*की\s*मिट्टी|थांवले|बेसिन|basin/i.test(
      full
    );
  if (isTreeBasin) {
    const gramMatch = full.match(
      /(\d+(?:\.\d+)?(?:\s*[-–से]\s*\d+(?:\.\d+)?)?)\s*(ग्राम|gm|g|किग्रा|किलो|kg)\s*(?:प्रति\s*(?:पेड़|वृक्ष|पौधा))?/i
    );
    const amount = gramMatch ? `${gramMatch[1]} ${gramMatch[2]}` : "200–250 ग्राम";
    const isDust = /डस्ट|dust|DP\b|डीपी|डी\.पी\./i.test(full);
    const methodNote = isDust
      ? "लागू नहीं (सूखा पाउडर / डस्ट, पानी में न घोलें)"
      : "तने के थांवले में सीधे डालें";
    return {
      perLiter: methodNote,
      perTank: "लागू नहीं (पानी में न घोलें, सीधे तने के घेरे की मिट्टी में मिलाएँ)",
      perAcre: `तने के चारों ओर 2 मीटर घेरे की मिट्टी में ${amount} प्रति पेड़ अच्छी तरह मिलाएँ`,
    };
  }

  // 8. Dusting Powder (DP / Dust) or Granules (GR / दानेदार) Soil Application
  const isDustOrGranule =
    /\b(?:DP|GR|CG|10G|4G|3G)\b|डस्ट|dust|दानेदार|granule|बुरकाव|बिखेर|बालू\s*में|रेत\s*में/i.test(full) &&
    !/स्प्रे|spray|घोल|छिड़काव/i.test(full);
  if (isDustOrGranule) {
    const acreMatch = full.match(
      /(\d+(?:\.\d+)?(?:\s*[-–से]\s*\d+(?:\.\d+)?)?)\s*(किग्रा|kg|किलो|ग्राम|gm|g)\s*(?:(?:\/|प्रति)\s*एकड़)?/i
    );
    const amt = acreMatch ? `${acreMatch[1]} ${acreMatch[2]}` : "4-5 किग्रा";
    return {
      perLiter: "लागू नहीं (सूखा पाउडर / दानेदार, पानी में न घोलें)",
      perTank: "लागू नहीं (पानी में न घोलें, सीधे खेत या रेत में मिलाकर डालें)",
      perAcre: `${amt} प्रति एकड़ (सीधे खेत की मिट्टी या 20-25 किलो रेत में मिलाकर बुरकें)`,
    };
  }

  if (!cleaned) {
    return {
      perLiter: "लेबल के अनुसार",
      perTank: "लेबल के अनुसार",
      perAcre: "150-200 लीटर पानी प्रति एकड़",
    };
  }

  // 3. Seed treatment
  if (/बीज|seed/i.test(cleaned)) {
    return {
      perLiter: cleaned,
      perTank: "बीज उपचार के लिए",
      perAcre: "बुवाई पूर्व बीज में अच्छी तरह मिलाएं",
    };
  }

  // 4. Soil drenching
  if (/ड्रेंचिंग|drench/i.test(cleaned)) {
    return {
      perLiter: cleaned,
      perTank: "पौधे की जड़ों में डालें (200-500 मिली प्रति पौधा)",
      perAcre: "जड़ क्षेत्र (ड्रेंचिंग) के लिए",
    };
  }

  // 5. Direct per acre
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

  // 6. Per liter dosage with decimal or range
  const literMatch = cleaned.match(
    /(\d+(?:\.\d+)?)(?:\s*से\s*(\d+(?:\.\d+)?))?\s*(ग्राम|मिली|ml|gm|g|लीटर|l)(?:\s*(?:\/|प्रति)?\s*(?:लीटर|l))?/i
  );
  if (literMatch) {
    const minVal = parseFloat(literMatch[1]);
    const maxVal = literMatch[2] ? parseFloat(literMatch[2]) : undefined;
    const rawUnit = literMatch[3].toLowerCase();
    const isMl = /मिली|ml|लीटर|l/.test(rawUnit) && !/ग्राम|gm|g/.test(rawUnit);
    const unitLabel = isMl ? "मिली" : "ग्राम";

    // Safety guard: foliar sprays are never >= 25 g/L unless explicitly specified as per liter
    const hasExplicitLiter = /(?:\/|प्रति)\s*(?:लीटर|l)/i.test(cleaned);
    if (!hasExplicitLiter && minVal >= 25) {
      return {
        perLiter: cleaned,
        perTank: "लेबल निर्देश अनुसार सही माप डालें",
        perAcre: `${minVal} ${unitLabel} प्रति एकड़ या पेड़`,
      };
    }

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

  // Physical barriers (tree trunk grease band, alkathene/polythene sheets) are 100% mechanical IPM barriers
  const isPhysicalBarrier =
    /(?:अल्काथीन|एल्काथीन|alkathene|पॉलीथीन\s*शीट|पॉलिथीन\s*शीट|ग्रीस\s*(?:बैंड|पट्टी|लगाना)|तने\s*(?:पर|के चारों ओर).*ग्रीस)/i.test(
      norm
    );
  if (isPhysicalBarrier) return true;

  const hasTrapWord =
    /(?:फेरोमोन\s*ट्रैप|चिपचिपे?\s*ट्रैप|स्टीकी\s*ट्रैप|लाइट\s*ट्रैप|ल्यूसिल्यूर|हेलिल्यूर|स्पोडोल्यूर|टूटा\s*ल्यूर|क्यू-ल्यूर|डीबीएम\s*ट्रैप|फनल\s*ट्रैप|मिथाइल\s*यूजेनॉल|scirpolure|सिरपोल्यूर|pectino-lure|पेक्टिनोल्यूर|tuta phero-lure|cuelure|helilure|spodolure|sticky trap|ट्रैप\s*(?:क्रॉप|\d+)|स्यूडोस्टेम\s*ट्रैप|pseudostem trap|'टी'\s*आकार\s*की\s*खूंटियां|bird perch)/i.test(
      norm
    );

  const hasHeavyChemical =
    /\b(?:WP|WDG|EC|SC|SE|SG|WG|SL|SP|FS|OD|DF|GR|ZC|CS|DC|WS)\b/i.test(text) ||
    /@\s*\d/.test(text) ||
    /\d+(?:\.\d+)?\s*(?:मिली|ग्राम)\s*(?:\/|प्रति)\s*लीटर/.test(text);

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

  if (/(?:अल्काथीन|एल्काथीन|alkathene|पॉलीथीन\s*शीट|पॉलिथीन\s*शीट|ग्रीस\s*(?:बैंड|पट्टी|लगाना)|तने.*ग्रीस)/i.test(text)) {
    trapType = "barrier";
    imageSrc = "/images/tools/tree-banding-grease.jpg";
    trapNameHi = "अल्काथीन शीट व ग्रीस बैंड (तने पर यांत्रिक अवरोध)";
    trapNameEn = "Tree Trunk Alkathene & Sticky Grease Banding";
    lureName = "400 गेज अल्काथीन + ग्रीस";
  } else if (/मिथाइल\s*यूजेनॉल|methyl eugenol/i.test(text)) {
    trapType = "pheromone";
    imageSrc = "/images/chem/traps/pheromone-funnel-trap.jpg";
    trapNameHi = "मिथाइल यूजेनॉल फल मक्खी ट्रैप";
    trapNameEn = "Methyl Eugenol Fruit Fly Trap";
    lureName = "Methyl Eugenol (मिथाइल यूजेनॉल)";
  } else if (/नीले|blue/i.test(text)) {
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
  } else if (/scirpolure|सिरपोल्यूर|पीला\s*तना\s*छेदक/i.test(text)) {
    trapType = "pheromone";
    trapNameHi = "पीला तना छेदक फेरोमोन ट्रैप";
    trapNameEn = "Yellow Stem Borer Scirpolure Trap";
    lureName = "Scirpolure (सिरपोल्यूर)";
  } else if (/pectino-lure|पेक्टिनोल्यूर|गुलाबी\s*सुंडी/i.test(text)) {
    trapType = "pheromone";
    trapNameHi = "गुलाबी सुंडी फेरोमोन ट्रैप";
    trapNameEn = "Pink Bollworm Pectino-lure Trap";
    lureName = "Pectino-lure (पेक्टिनोल्यूर)";
  } else if (/स्यूडोस्टेम|pseudostem/i.test(text)) {
    trapType = "general";
    imageSrc = "/images/tools/tree-banding-grease.jpg";
    trapNameHi = "केले का स्यूडोस्टेम तना ट्रैप";
    trapNameEn = "Banana Pseudostem Weevil Trap";
    lureName = "कटा हुआ स्यूडोस्टेम तना";
  }

  // Extract rate per acre
  let ratePerAcre = "10-15 ट्रैप प्रति एकड़";
  if (trapType === "barrier") {
    ratePerAcre = "1 बैंड प्रति पेड़ (जमीन से 30–45 सेमी ऊपर)";
  } else {
    const rateMatch = text.match(
      /(\d+(?:\s*-\s*\d+)?)\s*(?:प्रति\s*एकड़|ट्रैप\s*प्रति\s*एकड़|ट्रैप|\/एकड़)/i
    );
    if (rateMatch) {
      ratePerAcre = `${rateMatch[1]} ट्रैप प्रति एकड़`;
    }
  }

  // Extract timing
  let timing = "रोपाई / अंकुरण के 15-20 दिन बाद लगाएं";
  if (trapType === "barrier") {
    timing = "नवंबर-दिसंबर (अप्सराओं के जमीन से पेड़ पर चढ़ने से पहले)";
  } else {
    const timeMatch = text.match(
      /(रोपाई\s*के\s*\d+\s*दिन\s*बाद[^\s।]*|रोपाई\s*के\s*तुरंत\s*बाद|बुवाई\s*के\s*\d+\s*दिन\s*बाद|फल\s*पकने\s*से\s*\d+\s*दिन\s*पहले[^\s।]*|शुरुआती\s*चरण\s*में|नवंबर-दिसंबर[^\s।]*)/i
    );
    if (timeMatch) {
      timing = `${timeMatch[1].replace(/लगाएं|लगाना/g, "").trim()} लगाएं`;
    }
  }

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
    trapType === "barrier"
      ? "जमीन से रेंगकर पेड़ पर चढ़ने वाले मिलीबग कीटों (Nymphs) को चिकनी शीट से फिसलकर व ग्रीस में चिपकाकर पेड़ पर चढ़ने से रोकना।"
      : trapType === "pheromone"
      ? "नर पतंगों (Male Moths) को आकर्षित कर पकड़ना ताकि कीट की नई पीढ़ी (अंडे/सुंडी) रुक जाए।"
      : trapType === "sticky_yellow"
      ? "सफेद मक्खी, एफिड व जैसिड जैसे रसचूसक कीटों को प्राकृतिक रूप से चिपकाकर नष्ट करना।"
      : "काले व साधारण थ्रिप्स (Thrips) को चिपकाकर वायरस का फैलाव रोकना।";

  const maintenanceNote =
    trapType === "barrier"
      ? "तने पर 30 सेमी चौड़ी 400 गेज शीट कसकर बांधें, बीच में 5 सेमी चौड़ी ग्रीस लगाएं। धूल जमने पर ग्रीस दोबारा लगाएं।"
      : trapType === "pheromone"
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
    waterDose: "पानी की आवश्यकता नहीं (शून्य रसायन भौतिक अवरोध)",
    farmerDose: {
      perLiter: "लागू नहीं (शून्य रसायन)",
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
 * Detects if a text represents a pre-mixed combination chemical product
 * (e.g. "एसीफेट 50% + इमिडाक्लोप्रिड 1.8% SP @ 2 ग्राम/लीटर") rather than a farmer tank-mix.
 */
export function isPreMixFormulation(text: string): boolean {
  if (!text.includes("+")) return false;
  // If text mentions adjuvant / sticker / spreader, it is a tank-mix, not a single pre-mix
  if (/सिलिकॉन|स्प्रेडर|स्टीकर|चिपको|silicon|adjuvant/i.test(text)) return false;

  // Multiple parenthesized doses or multiple "@" indicate a multi-chemical tank-mix
  const multiDoseInParens = (text.match(/\([^)]*(?:मिली|ग्राम|ml|g|gm)[^)]*\)/gi) || []).length;
  const multiAtDose = (text.match(/@/g) || []).length;
  if (multiDoseInParens >= 2 || multiAtDose >= 2) return false;

  // Pattern: % + % followed by formulation code (SP, ZC, WG, WP, SC, EC, etc.)
  const hasPercentPlus = /%\s*\+\s*[^%]+%/i.test(text) || /\b(?:g\/l|g\/L)\s*\+\s*[^g]+(?:g\/l|g\/L)/i.test(text);
  const hasFormulation = /\b(?:WP|EC|SC|SG|WG|WDG|SL|SP|FS|OD|ZC|DF|GR|WS)\b/i.test(text);

  return hasPercentPlus && hasFormulation;
}

/**
 * Checks if a sentence/line mentions a real chemical medicine, bio-control agent, or spray formulation.
 */
export function isChemicalMention(text: string): boolean {
  if (!text) return false;
  if (isTrapText(text)) return false;

  // Never classify tree trunk banding or grease sheets as chemicals
  if (/(?:अल्काथीन|एल्काथीन|alkathene|पॉलीथीन\s*शीट|पॉलिथीन\s*शीट|ग्रीस\s*(?:बैंड|पट्टी|लगाना)|तने.*ग्रीस)/i.test(text)) {
    return false;
  }

  // Has agricultural formulation code (e.g. WP, SC, EC, etc.)
  if (/\b(?:WP|EC|SC|SG|WG|WDG|SL|SP|FS|OD|ZC|DF|GR|CG|DS|WS|DP|PPM)\b/i.test(text)) {
    return true;
  }

  // Lookup in catalog / Hindi chem map
  if (lookupChemBottle(text)) {
    return true;
  }

  // Common agrochemical keywords
  if (
    /(?:कार्बेन्डाजिम|मैनकोजेब|मैंकोजेब|कॉपर|स्ट्रेप्टोसाइक्लिन|स्ट्रेप्टोमाइसिन|मेटालैक्सिल|थायोफैनेट|कासुगामाइसिन|वैलिडामाइसिन|क्लोरोथैलोनिल|टेबुकोनाज़ोल|प्रोपिकोनाज़ोल|हेक्साकोनाज़ोल|एज़ोक्सीस्ट्रोबिन|डाइफेनोकोनाज़ोल|ट्राइकोडर्मा|स्यूडोमोनास|नीम\s*(?:तेल|ऑयल|खली)|एज़ाडिराक्टिन|अज़ाडिराक्टिन|फिप्रोनिल|क्लोरोपायरीफॉस|इमिडाक्लोप्रिड|थायमेथॉक्सम|एसिटामिप्रिड|स्पिनोसैड|स्पिनेटोरम|फ्लुबेंडियामाइड|कोराजन|उलाला|लार्विन|डायमेथोएट|मैलाथियान|क्विनालफॉस|सल्फर|गंधक|बोरॉन|कार्बोफ्यूरान|फ्यूराडान|पेगासस|डायफेंथियूरॉन|इंडोक्साकार्ब|अवांट|प्रोफेनोफॉस|क्यूराक्रॉन|अल्फा\s*नेफ्थाइल|जिबरेलिक|ह्यूमिक|ब्यूवेरिया|मेटाराइजियम|बैसिलस)/i.test(
      text
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Detects if the given text describes a tank-mix combination (2 chemicals + silicon spreader).
 */
export function isTankMixText(text: string): boolean {
  if (!text.includes("+")) return false;
  // Pre-mix formulations (e.g. Acephate 50% + Imidacloprid 1.8% SP) are single products, not tank mixes
  if (isPreMixFormulation(text)) return false;

  const hasSpreader = /सिलिकॉन|स्प्रेडर|स्टीकर|चिपको|silicon/i.test(text);
  const parenDoses = (text.match(/\([^)]*(?:मिली|ग्राम|ml|g|gm)[^)]*\)/gi) || []).length;
  const atDoses = (text.match(/@/g) || []).length;
  const APPLIED_DOSE =
    /\d+(?:\.\d+)?\s*(?:मिली|ग्राम|ml|gm|g)(?![A-Za-z])\s*(?:\/|प्रति)?\s*(?:लीटर|l|एकड़)?/i;
  const doseCount = text
    .split(/\s*\+\s*/)
    .filter((p) => APPLIED_DOSE.test(p) && !/सिलिकॉन|स्प्रेडर|स्टीकर|चिपको|silicon/i.test(p))
    .length;

  return hasSpreader || parenDoses >= 2 || atDoses >= 2 || doseCount >= 2;
}

/**
 * Parses tank mix components (Medicine 1 + Medicine 2 + Silicon Spreader).
 */
export function parseTankMix(
  text: string,
  defaultKind: "pest" | "disease" = "pest"
): ParsedMedicineItem {
  const rawParts = text.split(/\s*\+\s*/);
  const parts: string[] = [];
  for (let i = 0; i < rawParts.length; i++) {
    const p = rawParts[i].trim();
    if (i < rawParts.length - 1 && /%\s*$/.test(p)) {
      // e.g. "एसीफेट 50%" + "इमिडाक्लोप्रिड 1.8% SP (...)"
      parts.push(`${p} + ${rawParts[++i].trim()}`);
    } else {
      parts.push(p);
    }
  }
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
      const isPerLiter = !!doseMatch && /(?:\/|प्रति)\s*(?:लीटर|l)/i.test(doseMatch[0]);
      const doseNum = doseMatch ? parseFloat(doseMatch[1]) : 1;
      const perTank = isPerLiter
        ? `${Math.round(doseNum * 16)} मिली प्रति 16L पंप`
        : doseNum <= 1
        ? "8-10 मिली प्रति 16L पंप"
        : `${doseNum * 8} मिली प्रति 16L पंप`;
      spreaderInfo = {
        nameHi: "सिलिकॉन स्प्रेडर (चिपको / Silicon Sticker)",
        dosePerLiter: isPerLiter ? `${doseNum} मिली प्रति लीटर पानी` : `${doseNum} मिली प्रति 2 लीटर पानी`,
        dosePerTank: perTank,
        purpose:
          "दवा के घोल को पत्तियों व तने पर तुरंत फैलाकर कीट के छेद तक पहुंचाता है (बारिश से धुलने से बचाता है)।",
        bottleSlug: "silicon-spreader",
      };
      continue;
    }

    // Check if this part is Jaggery / Molasses bait attractant
    if (/गुड़|शीरा|molasses|jaggery/i.test(pTrim)) {
      const gramMatch = pTrim.match(/(\d+(?:\.\d+)?)\s*(?:ग्राम|gm|g)/i);
      const jaggeryGrams = gramMatch ? parseFloat(gramMatch[1]) : 100;
      const perLiterGrams = Math.round(jaggeryGrams / 10);
      components.push({
        id: `mix-comp-${Math.random().toString(36).slice(2, 7)}`,
        nameHi: "गुड़ / गन्ने का शीरा (आकर्षण चारा)",
        nameEn: "Jaggery & Molasses Bait Attractant",
        formulation: "आकर्षण चारा",
        dosePerLiter: `${perLiterGrams} ग्राम प्रति लीटर (${jaggeryGrams}g / 10L पानी)`,
        dosePerTank: `${perLiterGrams * 16} ग्राम प्रति 16L पंप`,
        dosePerAcre: "पेड़ के तने व निचली पत्तियों पर चारा छिड़कें",
        category: "insecticide",
        bottleSlug: "jaggery-molasses-bait",
        brand: "देसी गुड़ या गन्ने का शीरा (राब)",
      });
      continue;
    }

    // Parse chemical component
    // Check batch water dosing first (e.g. "20 मिली को 10 लीटर पानी में मिलाकर")
    let doseStr = "";
    const batchMatch = pTrim.match(
      /(\d+(?:\.\d+)?)\s*(मिली|ml|ग्राम|gm|g)\s*(?:को|में)?\s*(\d+(?:\.\d+)?)\s*(?:लीटर|l)\s*पानी/i
    );
    if (batchMatch) {
      const chemVal = parseFloat(batchMatch[1]);
      const unit = batchMatch[2];
      const waterVal = parseFloat(batchMatch[3]);
      const perLiter = Math.round((chemVal / waterVal) * 10) / 10;
      doseStr = `${perLiter} ${unit} प्रति लीटर (${chemVal} ${unit} / ${waterVal}L पानी)`;
    } else {
      // Dose inside parentheses e.g. (0.8 मिली/लीटर) or after @
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
    }

    // Clean name without dose or application clauses
    let cleanName = pTrim
      .replace(/\([^)]*(?:मिली|ग्राम|ml|g|gm|लीटर|l)[^)]*\)/gi, "")
      .replace(/@\s*[^।\n+]+/gi, "")
      .replace(/\d+(?:\.\d+)?\s*(?:मिली|ml|ग्राम|gm|g)\s*(?:को|में)?\s*\d+(?:\.\d+)?\s*(?:लीटर|l)\s*पानी[^।\n+]*/gi, "")
      .replace(/को\s*\d+\s*लीटर\s*पानी[^।\n+]*/gi, "")
      .replace(/पेड़\s*के\s*कुछ\s*हिस्सों\s*पर\s*छिड़कना/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const hit = lookupChemBottle(cleanName) || lookupChemBottle(pTrim);
    const fallbackCategory: ChemBottleCategory =
      defaultKind === "disease" ? "fungicide" : "insecticide";
    const category = hit?.category ?? bottleCategory(cleanName) ?? fallbackCategory;
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

  const isBaitSpray =
    /गुड़|शीरा|चारा|bait/i.test(text) ||
    components.some((c) => c.bottleSlug === "jaggery-molasses-bait");

  const mixTitle = components.map((c) => c.nameHi).join(" + ") +
    (spreaderInfo ? " + सिलिकॉन स्प्रेडर" : "");

  const tankMix: TankMixDetails = {
    titleHi: mixTitle,
    isBaitSpray,
    purposeHi: isBaitSpray
      ? "गुड़/शीरे की मीठी महक से नर व मादा फल मक्खियों को आकर्षित करके मैलाथियान के संपर्क से नष्ट करना (चारा छिड़काव)।"
      : "प्रतिरोधक क्षमता (Resistance) तोड़ने एवं तुरंत तेज़ असर (Knockdown) हेतु दोहरा वैज्ञानिक मिश्रण।",
    components,
    spreader: spreaderInfo,
    mixingAdvice: isBaitSpray
      ? "🪤 10 लीटर पानी में 100 ग्राम गुड़/शीरा घोलें, फिर उसमें 20 मिली मैलाथियान 50% EC मिलाएं। पूरे पेड़ को न नहलाएं; केवल तने, मुख्य शाखाओं और निचली पत्तियों पर मोटे बूंदों में छिड़कें ताकि मक्खियां चारा चाटकर नष्ट हो जाएं।"
      : "🧪 बाल्टी में 10 लीटर पानी लें। पहले पहली दवा घोलें, फिर दूसरी दवा डालें। अच्छी तरह घुलने के बाद अंत में सिलिकॉन स्प्रेडर मिलाएं और स्प्रे पंप में भरें।",
  };

  return {
    id: `mix-${Math.random().toString(36).slice(2, 7)}`,
    raw: text,
    kind: "mix",
    isChemical: true,
    technicalHi: mixTitle,
    technicalEn: components.map((c) => c.nameEn).join(" + "),
    formulation: isBaitSpray ? "चारा स्प्रे (Poison Bait Spray)" : "टैंक मिश्रण (Tank Mix)",
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
    category: components[0]?.category ?? (defaultKind === "disease" ? "fungicide" : "insecticide"),
    categoryLabelHi: isBaitSpray ? "फल मक्खी चारा स्प्रे (Poison Bait Spray)" : "संयुक्त टैंक मिश्रण (Tank Mix Combo)",
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
  // 3. Check if this is an agronomic sentence rather than a chemical spray
  if (!isChemicalMention(text)) {
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
    .replace(/^(?:तने\s*के\s*चारों\s*ओर[^में]*में|मिट्टी\s*में)\s*/i, "")
    .replace(/\s*(?:अच्छी\s*तरह\s*मिलाएं|मिलाएं|डालें|छिड़कें)[^$]*$/i, "")
    .replace(/\s+\d+(?:\.\d+)?\s*(?:ग्राम|मिली|ml|gm|g|kg|किग्रा|लीटर)\s*(?:प्रति\s*[^।\n]+)?$/i, "")
    .trim();

  // Lookup in catalog / bottle helper
  const hit = lookupChemBottle(techRaw) || lookupChemBottle(text);
  const category = hit?.category ?? bottleCategory(techRaw) ?? defaultCategory;
  const { name: parsedName, formulation } = bottleLabelParts(
    hit ? `${hit.name} ${hit.formulation}` : techRaw
  );

  const technicalEn = hit ? `${hit.name} ${hit.formulation}`.trim() : parsedName;
  const technicalHi = techRaw || (hit ? hit.name : text.slice(0, 30));
  const farmerDose = calculateFarmerDose(dose, text);

  return {
    id: `${hit?.slug || "chem"}-${Math.random().toString(36).slice(2, 7)}`,
    raw: text,
    kind: "chemical",
    isChemical: true,
    technicalHi,
    technicalEn: technicalEn || technicalHi,
    formulation: hit?.formulation || formulation || "",
    brands,
    dose:
      farmerDose.perLiter.startsWith("लागू नहीं")
        ? dose || farmerDose.perAcre
        : farmerDose.perLiter || dose || "पैकेट के अनुसार",
    waterDose: farmerDose.perAcre,
    farmerDose,
    category,
    categoryLabelHi: CATEGORY_NAMES_HI[category],
    bottleSlug: hit?.slug,
    fullNote: text,
  };
}
