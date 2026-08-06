/**
 * Foliar / soluble fertilizer molecules for tank-mix checks.
 * (Not in pesticide Excel — general India field practice rules.)
 */
export type NpkMolecule = {
  id: string;
  label: string;
  labelHi: string;
  kind: "n" | "p" | "k" | "npk" | "micro" | "ca" | "organic";
};

export const npkMolecules: NpkMolecule[] = [
  { id: "urea", label: "Urea (46% N)", labelHi: "यूरिया", kind: "n" },
  { id: "dap", label: "DAP", labelHi: "डीएपी", kind: "p" },
  { id: "map", label: "MAP / 12-61-0", labelHi: "एमएपी", kind: "p" },
  { id: "mop", label: "MOP (KCl)", labelHi: "एमओपी", kind: "k" },
  { id: "sop", label: "SOP (K2SO4)", labelHi: "एसओपी", kind: "k" },
  { id: "ssp", label: "SSP", labelHi: "एसएसपी", kind: "p" },
  { id: "can", label: "Calcium nitrate", labelHi: "कैल्शियम नाइट्रेट", kind: "ca" },
  { id: "wnp", label: "19-19-19 NPK", labelHi: "19-19-19", kind: "npk" },
  { id: "w13", label: "13-40-13 NPK", labelHi: "13-40-13", kind: "npk" },
  { id: "w00", label: "0-52-34 NPK", labelHi: "0-52-34", kind: "npk" },
  { id: "znso4", label: "Zinc sulphate", labelHi: "जिंक सल्फेट", kind: "micro" },
  { id: "feso4", label: "Ferrous sulphate", labelHi: "फेरस सल्फेट", kind: "micro" },
  { id: "boron", label: "Boron (solubor)", labelHi: "बोरॉन", kind: "micro" },
  { id: "humic", label: "Humic / fulvic", labelHi: "ह्यूमिक/फुल्विक", kind: "organic" },
];

const EXTRA_FERT_IDS = new Set([
  "mkp",
  "kn03",
  "mgso4",
  "zn edta",
  "fe edta",
  "fulvic",
  "amino acids",
  "seaweed",
  "ga3",
  "brassinolide",
]);

const FERT_IDS = new Set([
  ...npkMolecules.map((m) => m.id.toLowerCase()),
  ...EXTRA_FERT_IDS,
]);

export function isFertilizerMolecule(id: string): boolean {
  return FERT_IDS.has(String(id || "").toLowerCase().trim());
}

export type NpkPairResult = {
  status: "safe" | "caution" | "incompatible";
  title: string;
  message: string;
};

/**
 * Returns null when either id is not a fertilizer/micro/biostimulant —
 * so pesticide pairs are never judged by this helper.
 */
export function checkNpkCompatibility(idA: string, idB: string): NpkPairResult | null {
  const a = String(idA || "").toLowerCase().trim();
  const b = String(idB || "").toLowerCase().trim();
  if (!a || !b) return null;
  if (!isFertilizerMolecule(a) || !isFertilizerMolecule(b)) return null;

  if (a === b) {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message: "दो अलग खाद/माइक्रो चुनें।",
    };
  }

  const set = new Set([a, b]);
  const has = (...ids: string[]) => ids.every((x) => set.has(x));
  const hasAny = (...ids: string[]) => ids.some((x) => set.has(x));

  if (
    (hasAny("can") && hasAny("dap", "map", "ssp", "w00", "w13", "mkp")) ||
    (hasAny("can") && hasAny("wnp"))
  ) {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message:
        "न मिलाएँ — कैल्शियम नाइट्रेट + फॉस्फेट/हाई-P NPK से अवक्षेप बनता है। अलग स्प्रे करें।",
    };
  }

  if (hasAny("can") && hasAny("sop", "mgso4", "znso4", "feso4")) {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message: "न मिलाएँ — कैल्शियम + सल्फेट से जिप्सम अवक्षेप बनता है।",
    };
  }

  if (has("urea", "can")) {
    return {
      status: "caution",
      title: "मिला सकते हो — शर्त के साथ",
      message:
        "मिला सकते हो — शर्त: कम फोलियार डोज़, नरम पानी, गर्मी में न छिड़कें। लेबल दर मानें।",
    };
  }

  if (has("znso4", "feso4")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message: "मिला सकते हो — जिंक और फेरस सल्फेट आमतौर पर संगत। घोल साफ़ रखें। लेबल अंतिम।",
    };
  }

  if (hasAny("humic", "fulvic") && hasAny("znso4", "feso4", "boron", "wnp", "w13", "zn edta", "fe edta")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message: "मिला सकते हो — ह्यूमिक/फुल्विक अक्सर माइक्रो या घुलनशील NPK के साथ संगत। लेबल डोज़।",
    };
  }

  if (hasAny("wnp", "w13", "w00", "mkp") && hasAny("wnp", "w13", "w00", "mkp") && a !== b) {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message: "न मिलाएँ — दो NPK ग्रेड एक साथ मिलाने का पुष्ट स्रोत सामान्यतः नहीं। एक ग्रेड रखें।",
    };
  }

  if (hasAny("urea") && hasAny("mop", "sop", "kn03")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message: "मिला सकते हो — यूरिया + पोटाश आमतौर पर संगत। पूरी तरह घोलें। लेबल अंतिम।",
    };
  }

  return {
    status: "incompatible",
    title: "न मिलाएँ",
    message:
      "न मिलाएँ — इस खाद/माइक्रो जोड़ी का पुष्ट टैंक-मिक्स स्रोत नहीं। लेबल अनुमति के बिना न मिलाएँ।",
  };
}
