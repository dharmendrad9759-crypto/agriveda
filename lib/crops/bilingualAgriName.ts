/**
 * App-wide: Technical name + Hindi name together.
 * Format: "Thiamethoxam (थायामेथोक्साम)"
 */

/** Canonical technical → Hindi */
export const AGRI_TECH_HI: Record<string, string> = {
  Urea: "यूरिया",
  DAP: "डीएपी",
  MOP: "एमओपी",
  SSP: "एसएसपी",
  SOP: "एसओपी",
  MAP: "एमएपी",
  TSP: "टीएसपी",
  NPK: "एनपीके",
  Gypsum: "जिप्सम",
  Sulphur: "सल्फर",
  Sulfur: "सल्फर",
  Boron: "बोरॉन",
  Borax: "बोरेक्स",
  "Zinc Sulphate": "जिंक सल्फेट",
  "Zinc Sulfate": "जिंक सल्फेट",
  "Magnesium Sulphate": "मैग्नीशियम सल्फेट",
  "Calcium Nitrate": "कैल्शियम नाइट्रेट",
  "Ferrous Sulphate": "आयरन सल्फेट",
  "Ammonium Molybdate": "अमोनियम मॉलिब्डेट",
  "Potassium Nitrate": "पोटैशियम नाइट्रेट",
  "Potassium Sulphate": "पोटैशियम सल्फेट",
  "Chelated Micronutrients": "सूक्ष्म खाद (चेलेट)",
  "Chelated micronutrients": "सूक्ष्म खाद (चेलेट)",

  "Humic Acid": "ह्यूमिक एसिड",
  Humic: "ह्यूमिक",
  "Humic Granules": "ह्यूमिक दाने",
  Seaweed: "समुद्री शैवाल",
  "Trichoderma viride": "ट्राइकोडर्मा",
  Trichoderma: "ट्राइकोडर्मा",
  Mycorrhiza: "माइकोराइजा",
  VAM: "माइकोराइजा",
  Rhizobium: "राइजोबियम",
  PSB: "पीएसबी",
  "Neem Cake": "नीम खली",
  Neem: "नीम",
  FYM: "गोबर खाद",
  "Amino Acid": "अमीनो एसिड",
  Nitrobenzene: "नाइट्रोबेंजीन",

  Imidacloprid: "इमिडाक्लोप्रिड",
  Thiamethoxam: "थायामेथोक्साम",
  Fipronil: "फिप्रोनिल",
  "Cartap Hydrochloride": "कार्टैप",
  "Cartap hydrochloride": "कार्टैप",
  Cartap: "कार्टैप",
  Chlorantraniliprole: "क्लोरेंट्रानिलिप्रोल",
  "Emamectin Benzoate": "इमामेक्टिन",
  Emamectin: "इमामेक्टिन",
  Chlorpyrifos: "क्लोरपाइरीफॉस",
  Carbosulfan: "कार्बोसल्फान",
  "Alpha Naphthalene Acetic Acid (NAA)": "एनएए",
  "Alpha NAA": "एनएए",
  NAA: "एनएए",
  Planofix: "प्लानोफिक्स",

  Carbendazim: "कार्बेन्डाजिम",
  Mancozeb: "मैनकोज़ेब",
  "Carbendazim + Mancozeb": "कार्बेन्डाजिम + मैनकोज़ेब",
  Thiram: "थायरम",
  "Carboxin + Thiram": "कार्बोक्सिन + थायरम",
  Pencycuron: "पेनसाइक्यूरॉन",
  "Thiophanate Methyl": "थायोफेनेट मिथाइल",
  Metalaxyl: "मेटालेक्सिल",
  "Metalaxyl-M": "मेटालेक्सिल",
  "Copper Oxychloride": "कॉपर ऑक्सीक्लोराइड",
  Streptocycline: "स्ट्रेप्टोसाइक्लीन",

  "Mepiquat Chloride": "मेपिक्वेट",
  Mepiquat: "मेपिक्वेट",
  Ethephon: "इथेफॉन",
  Paclobutrazol: "पैक्लोब्यूट्राजोल",
  GA3: "जीए3",
  CPPU: "सीपीपीयू",
  "Hydrogen Cyanamide": "हाइड्रोजन साइनामाइड",

  Pendimethalin: "पेंडीमेथालिन",
  Metribuzin: "मेट्रीब्यूजिन",
  Atrazine: "एट्राजिन",
  Glyphosate: "ग्लाइफोसेट",
  "2,4-D": "2,4-डी",
  Quizalofop: "क्विजालोफॉप",
  Fenoxaprop: "फेनोक्साप्रॉप",
  Imazethapyr: "इमेजेथापायर",
  Pretilachlor: "प्रीटीलाक्लोर",
  Bispyribac: "बिस्पाईरिबैक",
  Pyrazosulfuron: "पायराजोसल्फ्यूरॉन",
  Oxyfluorfen: "ऑक्सीफ्लोरफेन",
  Paraquat: "पैराक्वाट",
};

const SORTED_KEYS = Object.keys(AGRI_TECH_HI).sort((a, b) => b.length - a.length);

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasDevanagariParen(s: string): boolean {
  return /\([\u0900-\u097F]/.test(s);
}

/** One product label → "Technical (हिंदी)" */
export function bilingualAgriName(technical: string): string {
  const raw = (technical || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";
  if (hasDevanagariParen(raw)) return raw;

  for (const key of SORTED_KEYS) {
    const hi = AGRI_TECH_HI[key]!;
    const re = new RegExp(`^(${escapeRe(key)})(\\b.*)?$`, "i");
    const m = raw.match(re);
    if (m) {
      const rest = (m[2] || "").trim();
      if (rest.startsWith(`(${hi})`)) return raw;
      return rest ? `${key} (${hi}) ${rest}` : `${key} (${hi})`;
    }
  }

  // Hindi-only input that matches a known value
  for (const [tech, hi] of Object.entries(AGRI_TECH_HI)) {
    if (raw === hi) return `${tech} (${hi})`;
  }

  return raw;
}

/**
 * Inside a sentence, wrap known technicals as Technical (हिंदी).
 * Also upgrades lone Hindi product words when unambiguous (length ≥ 5).
 */
export function applyBilingualAgriNames(text: string): string {
  if (!text?.trim()) return "";
  let t = text.replace(/\s+/g, " ").trim();

  for (const key of SORTED_KEYS) {
    const hi = AGRI_TECH_HI[key]!;
    // Already bilingual for this key?
    const already = new RegExp(`${escapeRe(key)}\\s*\\(${escapeRe(hi)}\\)`, "i");
    if (already.test(t) && key.length > 2) {
      // Normalize casing of existing bilingual pair
      t = t.replace(already, `${key} (${hi})`);
      continue;
    }
    const re = new RegExp(`\\b${escapeRe(key)}\\b(?!\\s*\\()`, "gi");
    t = t.replace(re, `${key} (${hi})`);
  }

  // Lone Hindi tokens → add technical (avoid short ones like नीम colliding often — still do नीम as it's common product)
  const hiToTech = new Map<string, string>();
  for (const [tech, hi] of Object.entries(AGRI_TECH_HI)) {
    if (!hiToTech.has(hi) || tech.length <= (hiToTech.get(hi)?.length ?? 99)) {
      hiToTech.set(hi, tech);
    }
  }
  const his = [...hiToTech.keys()].sort((a, b) => b.length - a.length);
  for (const hi of his) {
    if (hi.length < 3) continue;
    const tech = hiToTech.get(hi)!;
    // Skip if already "Tech (hi)"
    if (t.includes(`${tech} (${hi})`)) continue;
    const re = new RegExp(`(?<![\\u0900-\\u097F\\w])${escapeRe(hi)}(?![\\u0900-\\u097F\\w]|\\s*\\()`, "g");
    t = t.replace(re, `${tech} (${hi})`);
  }

  return t.replace(/\s{2,}/g, " ").trim();
}
