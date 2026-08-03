/**
 * Farmer-facing display helpers — stage/risk/ownership labels in Hindi.
 * Scientific names stay English; Devanagari input passes through unchanged.
 */

const DEVANAGARI = /[\u0900-\u097F]/;

function hasDevanagari(text: string): boolean {
  return DEVANAGARI.test(text);
}

/** Exact and partial stage phrase → Hindi */
const STAGE_MAP: Record<string, string> = {
  germination: "अंकुरण",
  establishment: "स्थापना",
  "germination / establishment": "अंकुरण / स्थापना",
  vegetative: "वनस्पति वृद्धि",
  "vegetative growth": "वनस्पति वृद्धि",
  "vegetative growth / branching": "वनस्पति वृद्धि / शाखाएँ",
  branching: "शाखाएँ",
  tillering: "कल्ले (Tillering)",
  flowering: "फूल",
  "early flowering": "शुरुआती फूल",
  "flower initiation": "फूल की शुरुआत",
  "flower initiation / early flowering": "फूल की शुरुआत / शुरुआती फूल",
  reproductive: "प्रजनन अवस्था",
  "grain filling": "दाना भरना",
  "pod filling": "फली भरना",
  maturity: "पकाव",
  harvest: "कटाई",
  harvesting: "कटाई",
  sowing: "बुवाई",
  buwai: "बुवाई",
  transplant: "रोपाई",
  transplanting: "रोपाई",
  "pre-sowing": "बुवाई से पहले",
  presowing: "बुवाई से पहले",
  seedling: "पौध",
  "panicle initiation": "बाली निर्माण",
  panicle: "बाली",
  "boot stage": "बूट अवस्था",
  heading: "बाली निकलना",
  "milking stage": "दूध अवस्था",
  dough: "आटा अवस्था",
  ripening: "पकना",
  senescence: "पत्ती पीली होना",
  dormancy: "निष्क्रिय अवस्था",
  pegging: "मूंगफली गाँठ",
  fruiting: "फल लगना",
  "fruit set": "फल लगना",
  "fruit development": "फल विकास",
  bolting: "डंठल निकलना",
  rosette: "पत्ती गुच्छ",
  tuber: "कंद विकास",
  "tuber initiation": "कंद शुरुआत",
  "bulb formation": "कंद बनना",
  "root development": "जड़ विकास",
  "leaf development": "पत्ती विकास",
  "stem elongation": "तने की लंबाई",
  "critical stage": "महत्वपूर्ण अवस्था",
  kharif: "खरीफ",
  rabi: "रबी",
  zaid: "जायद",
  das: "DAS (बुवाई के बाद दिन)",
  dat: "DAT (रोपाई के बाद दिन)",
  dekhbhal: "देखभाल",
  badhaw: "बढ़ाव",
  "phool/dana": "फूल/दाना",
  kataai: "कटाई",
};

/** Word-level replacements applied after exact lookup fails */
const STAGE_WORDS: [RegExp, string][] = [
  [/\bgermination\b/i, "अंकुरण"],
  [/\bestablishment\b/i, "स्थापना"],
  [/\bvegetative\b/i, "वनस्पति"],
  [/\bbranching\b/i, "शाखाएँ"],
  [/\btillering\b/i, "कल्ले"],
  [/\bflowering\b/i, "फूल"],
  [/\bfruit(?:ing| set)?\b/i, "फल"],
  [/\bgrain filling\b/i, "दाना भरना"],
  [/\bpod filling\b/i, "फली भरना"],
  [/\bmaturity\b/i, "पकाव"],
  [/\bharvest(?:ing)?\b/i, "कटाई"],
  [/\bsowing\b/i, "बुवाई"],
  [/\btransplant(?:ing)?\b/i, "रोपाई"],
  [/\breproductive\b/i, "प्रजनन"],
  [/\bseedling\b/i, "पौध"],
  [/\bpanicle\b/i, "बाली"],
  [/\bripening\b/i, "पकना"],
  [/\bkharif\b/i, "खरीफ"],
  [/\brabi\b/i, "रबी"],
  [/\bzaid\b/i, "जायद"],
];

function normalizeStageKey(stage: string): string {
  return stage.trim().toLowerCase().replace(/\s+/g, " ");
}

export function stageLabelHi(stage: string): string {
  if (!stage?.trim()) return stage;
  if (hasDevanagari(stage)) return stage;

  const key = normalizeStageKey(stage);
  const exact = STAGE_MAP[key];
  if (exact) return exact;

  const head = key.split(/[—(]/)[0]?.trim() ?? key;
  if (STAGE_MAP[head]) return STAGE_MAP[head];

  let out = stage;
  for (const [re, hi] of STAGE_WORDS) {
    out = out.replace(re, hi);
  }
  if (out !== stage || hasDevanagari(out)) return out;
  return stage;
}

const RISK_MAP: Record<string, string> = {
  critical: "गंभीर",
  high: "अधिक",
  medium: "मध्यम",
  low: "कम",
  priority: "प्राथमिकता",
  monitor: "निगरानी",
};

export function riskLabelHi(level: string): string {
  if (!level?.trim()) return level;
  if (hasDevanagari(level)) return level;
  const key = level.trim().toLowerCase();
  return RISK_MAP[key] ?? level;
}

const OWNERSHIP_MAP: Record<string, string> = {
  owned: "अपना",
  leased: "पट्टे पर",
  active: "सक्रिय",
};

export function ownershipLabelHi(v: string): string {
  if (!v?.trim()) return v;
  if (hasDevanagari(v)) return v;
  const key = v.trim().toLowerCase();
  return OWNERSHIP_MAP[key] ?? v;
}

/** Common variety trait English → Hindi (best-effort). */
const TRAIT_PHRASES: [RegExp, string][] = [
  [/widely adapted,?\s*good oil%/i, "व्यापक अनुकूलन, अच्छा तेल%"],
  [/widely adapted\b/i, "व्यापक अनुकूलन"],
  [/early maturity/i, "जल्दी पकने वाली"],
  [/high yield under irrigation/i, "सिंचाई में ऊँची उपज"],
  [/high yield/i, "ऊँची उपज"],
  [/drought tolerant/i, "सूखा सहनशील"],
  [/disease resistant/i, "रोग प्रतिरोधी"],
  [/good oil%/i, "अच्छा तेल%"],
  [/pigeonpea/i, "अरहर"],
];

export function varietyTraitHi(trait: string): string {
  if (!trait?.trim()) return trait;
  if (hasDevanagari(trait)) return trait;
  let out = trait;
  for (const [re, hi] of TRAIT_PHRASES) {
    out = out.replace(re, hi);
  }
  return out;
}
