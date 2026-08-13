/**
 * Exclusive pest/disease guilds so a hopper molecule cannot attach to stem borer
 * just because a symptom blob or a generic word ("hopper"/"borer"/"भूरा") overlapped.
 */

export type ChemGuild =
  | "stem-borer"
  | "shoot-borer"
  | "fruit-borer"
  | "pod-borer"
  | "top-borer"
  | "leaf-folder"
  | "planthopper"
  | "leafhopper"
  | "gall-midge"
  | "hispa"
  | "gundhi"
  | "thrips"
  | "whitefly"
  | "aphid"
  | "jassid"
  | "mite"
  | "mealybug"
  | "armyworm"
  | "dbm"
  | "bollworm"
  | "nematode"
  | "beetle"
  | "blast"
  | "sheath-blight"
  | "bacterial-blight"
  | "rust"
  | "powdery"
  | "downy"
  | "late-blight"
  | "early-blight"
  | "wilt"
  | "smut"
  | "tikka"
  | "anthracnose"
  | "leaf-spot"
  | "false-smut"
  | "root-rot";

type GuildRule = { guild: ChemGuild; patterns: string[] };

/** Longer / more specific phrases first. Never use bare hopper, borer, blight, इल्ली, भूरा. */
const GUILD_RULES: GuildRule[] = [
  { guild: "planthopper", patterns: ["brown plant hopper", "brown planthopper", "whitebacked", "white backed", "white-backed", "भूरा फुदका", "सफेद पीठ फुदका", "hopperburn", "हॉपरबर्न", "hopper burn", "nilaparvata", "sogatella", "wbph", "hopper", "फुदका"] },
  { guild: "leafhopper", patterns: ["green leafhopper", "green leaf hopper", "हरा पत्ती फुदका", "हरा फुदका", "हरा लाही", "nephotettix", "टंग्रो", "tungro", "hopper", "फुदका"] },
  { guild: "stem-borer", patterns: ["yellow stem borer", "pink stem borer", "yellow stem", "pink stem", "तना छेदक", "stem borer", "scirpophaga", "sesamia inferens", "chilo partellus", "coniesta", "dead heart", "डेडहार्ट", "white ear", "व्हाइट ईयर"] },
  { guild: "shoot-borer", patterns: ["early shoot borer", "shoot borer", "चोटी छेदक", "early shoot"] },
  { guild: "top-borer", patterns: ["top borer", "चोटी छेदक"] },
  { guild: "fruit-borer", patterns: ["fruit borer", "fruit and shoot", "shoot and fruit", "फल छेदक", "helicoverpa", "हेलिको", "earlas"] },
  { guild: "pod-borer", patterns: ["pod borer", "फली छेदक", "maruca"] },
  { guild: "leaf-folder", patterns: ["leaf folder", "पत्ती मोड़क", "cnaphalocrocis"] },
  { guild: "gall-midge", patterns: ["gall midge", "गॉल मिज", "oroseolia", "orseolia"] },
  { guild: "hispa", patterns: ["rice hispa", "hispa", "हिस्पा"] },
  { guild: "gundhi", patterns: ["gundhi", "गंधी", "leptocorisa", "rice bug"] },
  { guild: "thrips", patterns: ["thrips", "थ्रिप्स"] },
  { guild: "whitefly", patterns: ["whitefly", "white fly", "सफेद मक्खी", "bemisia"] },
  { guild: "aphid", patterns: ["aphid", "माहू", "माहो", "चेपा", "sitobion", "myzus"] },
  { guild: "jassid", patterns: ["jassid", "leaf hopper", "हरा तेला", "तेला", "amrasca"] },
  { guild: "mite", patterns: ["spider mite", "red mite", "लाल मकड़ी", "पीली मकड़ी", "मकड़", "मकोड़", "मकोड़ा", "tetranychus", "mite"] },
  { guild: "mealybug", patterns: ["mealybug", "mealy bug", "मिलीबग", "मेलीबग"] },
  { guild: "armyworm", patterns: ["fall army", "fall armyworm", "फॉल आर्मी", "आर्मीवर्म", "armyworm", "spodoptera", "स्पोडो"] },
  { guild: "dbm", patterns: ["diamondback", "diamond back", "डायमंड", "plutella"] },
  { guild: "bollworm", patterns: ["pink bollworm", "american bollworm", "spotted bollworm", "गुलाबी सुंडी", "अमेरिकी सुंडी", "bollworm"] },
  { guild: "nematode", patterns: ["nematode", "नेमाटोड", "सूत्रकृमि", "root-knot", "रूट-नॉट", "meloidogyne"] },
  { guild: "beetle", patterns: ["beetle", "भृंग", "hispa"] },
  { guild: "false-smut", patterns: ["false smut", "फॉल्स स्मट", "ustilaginoidea"] },
  { guild: "blast", patterns: ["blast", "ब्लास्ट", "magnaporthe", "pyricularia"] },
  { guild: "sheath-blight", patterns: ["sheath blight", "शीथ ब्लाइट", "sheath blight", "rhizoctonia solani"] },
  { guild: "bacterial-blight", patterns: ["bacterial leaf blight", "bacterial blight", "बैक्टीरियल ब्लाइट", "xanthomonas", "blb"] },
  { guild: "late-blight", patterns: ["late blight", "लेट ब्लाइट", "पिछेती झुलसा", "phytophthora infestans"] },
  { guild: "early-blight", patterns: ["early blight", "अगेती झुलसा", "अगेती"] },
  { guild: "downy", patterns: ["downy mildew", "डाउनी", "downy"] },
  { guild: "powdery", patterns: ["powdery mildew", "पाउडरी", "powdery"] },
  { guild: "rust", patterns: ["yellow rust", "leaf rust", "stem rust", "रतुआ", "puccinia", "phakopsora", "rust"] },
  { guild: "wilt", patterns: ["fusarium wilt", "उकठा", "wilt", "fusarium", "ralstonia"] },
  { guild: "smut", patterns: ["loose smut", "kernel smut", "स्मट", "ustilago"] },
  { guild: "tikka", patterns: ["tikka", "टिक्का", "cercospora", "passalora"] },
  { guild: "anthracnose", patterns: ["anthracnose", "एंथ्रेक्नोज"] },
  { guild: "leaf-spot", patterns: ["leaf spot", "पत्ती धब्बा", "लीफ स्पॉट"] },
  { guild: "root-rot", patterns: ["root rot", "जड़ सड़न", "damping off", "डैम्पिंग"] },
];

/** Codes too short for generic includes(), but unique enough as whole tokens. */
const SHORT_CODE_GUILD: Record<string, ChemGuild> = {
  bph: "planthopper",
  wbph: "planthopper",
  glh: "leafhopper",
  faw: "armyworm",
  dbm: "dbm",
  blb: "bacterial-blight",
};

const GENERIC_KEYS = new Set([
  "hopper",
  "borer",
  "blight",
  "rot",
  "rust",
  "mite",
  "grass",
  "nymph",
  "इल्ली",
  "छेदक",
  "भूरा",
  "चूसक",
  "झुलसा",
  "सड़ांध",
  "मकड़",
  "फुदका",
  "शीथ",
  "broadleaf",
]);

export function normalizeHay(s: string): string {
  return s.toLowerCase().replace(/[\u2013\u2014]/g, "-");
}

function patternHits(hay: string, pattern: string): boolean {
  const p = pattern.toLowerCase();
  if (p.length <= 3) {
    if (!SHORT_CODE_GUILD[p] && p.length < 3) return false;
    return new RegExp(`(?:^|[^a-z0-9\\u0900-\\u097f])${p}(?:[^a-z0-9\\u0900-\\u097f]|$)`, "i").test(hay);
  }
  // Bare English tokens must not match inside another word (hopper ≠ planthopper).
  if (/^[a-z]+$/.test(p)) {
    return new RegExp(`(?:^|[^a-z0-9])${p}(?:[^a-z0-9]|$)`, "i").test(hay);
  }
  return hay.includes(p);
}

export function classifyChemText(text: string): Set<ChemGuild> {
  const hay = normalizeHay(text);
  const found = new Set<ChemGuild>();
  if (!hay.trim()) return found;

  for (const { guild, patterns } of GUILD_RULES) {
    if (patterns.some((p) => patternHits(hay, p))) found.add(guild);
  }

  for (const [code, guild] of Object.entries(SHORT_CODE_GUILD)) {
    if (patternHits(hay, code)) found.add(guild);
  }

  return found;
}

/** Keys that are too generic to attach a molecule by substring. */
export function isGenericChemKey(key: string): boolean {
  return GENERIC_KEYS.has(key.toLowerCase().trim());
}

export function specificKeyHits(haystack: string, key: string): boolean {
  const k = key.toLowerCase().trim();
  if (!k || isGenericChemKey(k)) return false;
  const hay = normalizeHay(haystack);
  if (k.length <= 3) return patternHits(hay, k);
  return hay.includes(k);
}

const WEAK_NAME_TOKENS = new Set([
  "yellow",
  "pink",
  "brown",
  "green",
  "white",
  "rice",
  "plant",
  "leaf",
  "early",
  "shoot",
  "paddy",
  "major",
  "common",
  "false",
  "true",
  "stem",
  "pest",
  "bug",
  "fly",
  "crop",
  "field",
  "rice",
]);

export function scientificNamesMatch(a?: string, b?: string): boolean {
  if (!a?.trim() || !b?.trim()) return false;
  const pa = a
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const pb = b
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const ga = pa[0];
  const gb = pb[0];
  if (!ga || !gb || ga.length < 5 || ga !== gb) return false;
  if (pa[1] && pb[1]) return pa[1].slice(0, 5) === pb[1].slice(0, 5);
  return true;
}

export function distinctiveNameOverlap(a: string, b: string): boolean {
  const na = a.toLowerCase().trim();
  const nb = b.toLowerCase().trim();
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.length >= 10 && nb.length >= 10 && (na.includes(nb) || nb.includes(na))) return true;

  const tokens = na
    .split(/[^a-z0-9\u0900-\u097f]+/)
    .filter((t) => t.length >= 4 && !WEAK_NAME_TOKENS.has(t));
  const strong = tokens.filter((t) => t.length >= 5 || /[\u0900-\u097f]/.test(t));
  return strong.some((t) => nb.includes(t));
}
