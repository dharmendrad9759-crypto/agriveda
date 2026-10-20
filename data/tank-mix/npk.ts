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
  { id: "map", label: "MAP / 12-61-0", labelHi: "एमएपी (12:61:00)", kind: "p" },
  { id: "mop", label: "MOP (KCl)", labelHi: "एमओपी (पोटाश)", kind: "k" },
  { id: "sop", label: "SOP (00:00:50)", labelHi: "एसओपी (00:00:50)", kind: "k" },
  { id: "ssp", label: "SSP", labelHi: "एसएसपी", kind: "p" },
  { id: "can", label: "Calcium nitrate", labelHi: "कैल्शियम नाइट्रेट", kind: "ca" },
  { id: "wnp", label: "19-19-19 NPK", labelHi: "NPK 19:19:19", kind: "npk" },
  { id: "w13", label: "13-40-13 NPK", labelHi: "NPK 13:40:13", kind: "npk" },
  { id: "w00", label: "0-52-34 NPK", labelHi: "NPK 00:52:34", kind: "npk" },
  { id: "znso4", label: "Zinc sulphate", labelHi: "जिंक सल्फेट", kind: "micro" },
  { id: "zn edta", label: "Chelated Zinc (EDTA 12%)", labelHi: "चिलेटेड जिंक (EDTA 12%)", kind: "micro" },
  { id: "feso4", label: "Ferrous sulphate", labelHi: "फेरस सल्फेट", kind: "micro" },
  { id: "boron", label: "Boron (20%)", labelHi: "बोरॉन (20%)", kind: "micro" },
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

  // Golden Rule 1: Phosphorus (DAP/SSP/MAP/00:52:34/19:19:19) + Normal Zinc Sulphate
  if (hasAny("znso4") && hasAny("dap", "ssp", "map", "w00", "w13", "wnp", "mkp")) {
    return {
      status: "incompatible",
      title: "न मिलाएँ (गोल्डन नियम 1)",
      message:
        "न मिलाएँ — फास्फोरस वाले खाद (DAP/SSP/NPK) के साथ सामान्य जिंक सल्फेट मिलाने से 'जिंक फास्फेट' (पत्थर) बन जाता है। यदि साथ देना ही है तो Chelated Zinc (EDTA 12%) का प्रयोग करें, या जिंक को पहली यूरिया के साथ दें।",
    };
  }

  // Chelated Zinc (EDTA 12%) + Phosphorus/NPK is safe!
  if (hasAny("zn edta") && hasAny("dap", "ssp", "map", "w00", "w13", "wnp", "mkp")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message:
        "मिला सकते हो — चिलेटेड जिंक (EDTA 12%) फास्फोरस व NPK (जैसे 19:19:19 या DAP) के साथ रिएक्शन नहीं करता और सुरक्षित है।",
    };
  }

  // Golden Rule 2: Calcium Nitrate + any Sulphate or Phosphate
  if (
    (hasAny("can") && hasAny("dap", "map", "ssp", "w00", "w13", "mkp")) ||
    (hasAny("can") && hasAny("wnp"))
  ) {
    return {
      status: "incompatible",
      title: "न मिलाएँ (गोल्डन नियम 2)",
      message:
        "न मिलाएँ — कैल्शियम नाइट्रेट को किसी भी फॉस्फेट वाले खाद (DAP, 19:19:19, 12:61:00, 00:52:34) के साथ मिलाकर ड्रेंचिंग या स्प्रे न करें, अवक्षेप बनता है। हमेशा अलग से चलाएं।",
    };
  }

  if (hasAny("can") && hasAny("sop", "mgso4", "znso4", "feso4")) {
    return {
      status: "incompatible",
      title: "न मिलाएँ (गोल्डन नियम 2)",
      message:
        "न मिलाएँ — कैल्शियम नाइट्रेट को किसी भी सल्फेट वाले खाद (मैग्नीशियम सल्फेट, जिंक सल्फेट, 00:00:50) के साथ न मिलाएँ, जिप्सम अवक्षेप बनता है। दोनों को अलग से चलाएं।",
    };
  }

  // Calcium Nitrate + Boron (without sulphate/phosphate)
  if (has("can", "boron")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message:
        "मिला सकते हो — कैल्शियम नाइट्रेट + बोरॉन संगत हैं, बशर्ते टैंक में कोई सल्फेट या फॉस्फेट खाद न मिलाई जाए।",
    };
  }

  // 00:52:34 / 12:61:00 / 19:19:19 / SOP + Boron
  if (hasAny("boron") && hasAny("w00", "map", "wnp", "w13", "mkp", "sop")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message:
        "मिला सकते हो — NPK 00:52:34 (या 12:61:00 / 00:00:50) + बोरॉन (20%) का स्प्रे फूल ठहराव, पोलिनेशन और दाना/फल भराव के लिए प्रैक्टिकल व सुरक्षित कॉम्बिनेशन है।",
    };
  }

  // Urea + Zinc Sulphate
  if (has("urea", "znso4")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message:
        "मिला सकते हो — पहली सिंचाई पर यूरिया के साथ जिंक सल्फेट (और सल्फर/ह्यूमिक) मिलाकर टॉप ड्रेसिंग करना कल्ले फूटने और पीलापन रोकने के लिए सर्वोत्तम है। मिलाने के बाद तुरंत खेत में डालें।",
    };
  }

  if (has("urea", "can")) {
    return {
      status: "caution",
      title: "मिला सकते हो — शर्त के साथ",
      message:
        "मिला सकते हो — जड़ों के पास साइड ड्रेसिंग में या कम फोलियर डोज़ में तुरंत प्रयोग करें; मिलाकर स्टोर न करें क्योंकि नमी पकड़ता है।",
    };
  }

  if (has("znso4", "feso4")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message: "मिला सकते हो — जिंक और फेरस सल्फेट आमतौर पर संगत। घोल साफ़ रखें। लेबल अंतिम।",
    };
  }

  if (hasAny("humic", "fulvic") && hasAny("urea", "dap", "znso4", "feso4", "boron", "wnp", "w13", "w00", "map", "zn edta", "fe edta")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message: "मिला सकते हो — ह्यूमिक/फुल्विक एसिड यूरिया कोटिंग, ड्रेंचिंग और माइक्रो/NPK के साथ संगत है।",
    };
  }

  if (hasAny("wnp", "w13", "w00", "mkp") && hasAny("wnp", "w13", "w00", "mkp") && a !== b) {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message: "न मिलाएँ — दो NPK ग्रेड एक साथ मिलाने का पुष्ट स्रोत सामान्यतः नहीं। एक समय में एक ग्रेड रखें।",
    };
  }

  if (hasAny("urea") && hasAny("mop", "sop", "kn03")) {
    return {
      status: "safe",
      title: "मिला सकते हो",
      message: "मिला सकते हो — यूरिया + पोटाश आमतौर पर संगत। मिलाकर तुरंत खेत में डालें।",
    };
  }

  return {
    status: "incompatible",
    title: "न मिलाएँ",
    message:
      "न मिलाएँ — इस खाद/माइक्रो जोड़ी का पुष्ट टैंक-मिक्स स्रोत नहीं। लेबल अनुमति के बिना न मिलाएँ।",
  };
}
