import { CHEM_BOTTLE_CATALOG, type ChemBottleCategory, type ChemBottleEntry } from "@/data/chem-bottle-catalog";

const FORM_RE =
  /(\d+(?:\.\d+)?\s*(?:%|g\/L|g\/l)\s*[A-Za-z]{1,4}(?:\s*\+\s*\d+(?:\.\d+)?\s*(?:%|g\/L|g\/l)\s*[A-Za-z]{1,4})*)/i;

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const byAlias = new Map<string, ChemBottleEntry>();
for (const entry of CHEM_BOTTLE_CATALOG) {
  const keys = [
    entry.slug.replace(/-/g, " "),
    `${entry.name} ${entry.formulation}`,
    entry.name,
    ...(entry.aliases ?? []),
  ];
  for (const key of keys) {
    const n = normalizeKey(key);
    if (n && !byAlias.has(n)) byAlias.set(n, entry);
  }
}

const HINDI_AGRI_CHEM_MAP: Record<string, string> = {
  // Insecticides
  "इमामेक्टिन": "emamectin-benzoate-5-sg",
  "एमामेक्टिन": "emamectin-benzoate-5-sg",
  "क्लोरांट्रानिलीप्रोल": "chlorantraniliprole-18-5-sc",
  "कोराजन": "chlorantraniliprole-18-5-sc",
  "इमिडाक्लोप्रिड": "imidacloprid-17-8-sl",
  "कान्फिडोर": "imidacloprid-17-8-sl",
  "कन्फिडोर": "imidacloprid-17-8-sl",
  "थायमेथॉक्सम": "thiamethoxam-25-wg",
  "थियामेथोक्सम": "thiamethoxam-25-wg",
  "एकतारा": "thiamethoxam-25-wg",
  "फिप्रोनिल": "fipronil-0-3-gr",
  "फ़िप्रोनिल": "fipronil-0-3-gr",
  "रीजेंट": "fipronil-0-3-gr",
  "फ्लोनिकामिड": "flonicamid-50-wg",
  "उलाला": "flonicamid-50-wg",
  "एफिडोपायरोपैन": "afidopyropen-50-dc",
  "सेफिना": "afidopyropen-50-dc",
  "डिनोटेफ्यूरॉन": "dinotefuran-20-sg",
  "डिनोटेफ्यूरन": "dinotefuran-20-sg",
  "टोकन": "dinotefuran-20-sg",
  "स्पायरोटेट्रामैट": "spirotetramat-15-od",
  "मोवेंटो": "spirotetramat-15-od",
  "कार्टाप": "cartap-4-gr",
  "कार्टप": "cartap-4-gr",
  "लैम्ब्डा": "lambda-cyhalothrin-5-ec",
  "कराटे": "lambda-cyhalothrin-5-ec",
  "स्पिनोसैड": "spinosad-45-sc",
  "स्पिनेटोरम": "spinetoram-11-7-sc",
  "डेलीगेट": "spinetoram-11-7-sc",
  "फ्लुबेंडियामाइड": "flubendiamide-39-sc",
  "फेम": "flubendiamide-39-sc",
  "डेल्टामेथ्रिन": "deltamethrin-2-8-ec",
  "ब्यूप्रोफेज़िन": "buprofezin-25-sc",
  "अप्पलाउड": "buprofezin-25-sc",
  "डायफेंथियूरॉन": "diafenthiuron-50-wp",
  "पेगासस": "diafenthiuron-50-wp",
  "स्पाइरोमेसिफेन": "spiromesifen-22-9-sc",
  "ओबेरॉन": "spiromesifen-22-9-sc",
  "साइपरमेथ्रिन": "cypermethrin-10-ec",
  "एसीफेट": "acephate-75-sp",
  "पाइमेट्रोज़िन": "pymetrozine-50-wg",
  "चेस": "pymetrozine-50-wg",
  "क्लोरफेनापायर": "chlorfenapyr-10-sc",
  "ब्रोफ्लानिलाइड": "broflanilide-20-sc",
  "क्लोरोपायरीफॉस": "chlorpyrifos-50-cypermethrin-5-ec",
  "हमला": "chlorpyrifos-50-cypermethrin-5-ec",
  "प्रोफेनोफॉस": "profenofos-cypermethrin-ec",
  "प्रोफेक्स": "profenofos-cypermethrin-ec",
  "एसिटामिप्रिड": "acetamiprid-20-sp",
  "प्राइड": "acetamiprid-20-sp",
  "मानिक": "acetamiprid-20-sp",
  "इंडोक्साकार्ब": "indoxacarb-14-5-sc",
  "अवांट": "indoxacarb-14-5-sc",

  // Fungicides
  "मैंकोजेब": "mancozeb-75-wp",
  "मैनकोजेब": "mancozeb-75-wp",
  "मैनकोज़ेब": "mancozeb-75-wp",
  "डाइथेन": "mancozeb-75-wp",
  "इंडोफिल": "mancozeb-75-wp",
  "कार्बेन्डाजिम": "carbendazim-50-wp",
  "कार्बेंडाजिम": "carbendazim-50-wp",
  "बाविस्टिन": "carbendazim-50-wp",
  "रिडोमिल": "metalaxyl-m-mancozeb-wp",
  "मेटालेक्सिल": "metalaxyl-m-mancozeb-wp",
  "मेटालैक्सिल": "metalaxyl-m-mancozeb-wp",
  "साफ": "carbendazim-mancozeb-wp",
  "नेटिवो": "tebuconazole-trifloxystrobin-wg",
  "एमिस्टार टॉप": "azoxystrobin-difenoconazole-sc",
  "स्ट्रेप्टोसाइक्लिन": "streptocycline-sp",
  "स्ट्रेप्टोमाइसिन": "streptocycline-sp",
  "वैलिडामाइसिन": "validamycin-3-l",
  "शीथमार": "validamycin-3-l",
  "प्रोपिनेब": "propineb-70-wp",
  "एंट्राकोल": "propineb-70-wp",
  "डिफेनोकोनाज़ोल": "difenoconazole-25-ec",
  "डिफेनोकोनाजोल": "difenoconazole-25-ec",
  "स्कोर": "difenoconazole-25-ec",
  "टेबुकोनाज़ोल": "tebuconazole-25-9-ec",
  "टेबुकोनाजोल": "tebuconazole-25-9-ec",
  "फॉलिकुर": "tebuconazole-25-9-ec",
  "एज़ोक्सीस्ट्रोबिन": "azoxystrobin-250-sc",
  "एजोक्सीस्ट्रोबिन": "azoxystrobin-250-sc",
  "एमिस्टार": "azoxystrobin-250-sc",
  "क्लोरोथैलोनिल": "chlorothalonil-75-wp",
  "कवच": "chlorothalonil-75-wp",
  "कॉपर ऑक्सीक्लोराइड": "copper-oxychloride-50-wp",
  "कॉपर हाइड्रोक्साइड": "copper-hydroxide-53-8-df",
  "कोसाइड": "copper-hydroxide-53-8-df",
  "डाइमेथोमॉर्फ": "dimethomorph-50-wp",
  "डाईमेथोमॉर्फ": "dimethomorph-50-wp",
  "एक्रोबैट": "dimethomorph-50-wp",
  "मैंडीप्रोपामिड": "mandipropamid-23-sc",
  "रेवुस": "mandipropamid-23-sc",
  "थायोफैनेट": "thiophanate-methyl-70-wp",
  "रोको": "thiophanate-methyl-70-wp",
  "कासुगामाइसिन": "kasugamycin-3-sl",
  "कासु-बी": "kasugamycin-3-sl",
  "थाइफ्लूज़ामाइड": "thifluzamide-24-sc",
  "पल्सर": "thifluzamide-24-sc",
  "हेक्साकोनाज़ोल": "hexaconazole-5-ec",
  "कॉन्टैफ़": "hexaconazole-5-ec",
  "ट्राइसाइकलाज़ोल": "tricyclazole-75-wp",
  "बान": "tricyclazole-75-wp",
  "फ्लुक्सापायरोक्साड": "fluxapyroxad-250-sc",
  "मेरीवोन": "fluxapyroxad-250-sc",
  "प्रोपिकोनाज़ोल": "propiconazole-25-ec",
  "टिल्ट": "propiconazole-25-ec",
  "साइमोक्सानिल": "cymoxanil-mancozeb-wp",
  "कर्जेट": "cymoxanil-mancozeb-wp",
  "आइसोप्रोथिओलेन": "isoprothiolane-40-ec",
  "फुजिओन": "isoprothiolane-40-ec",
  "हिनोसन": "edifenphos-50-ec",

  // Herbicides
  "एट्राजिन": "atrazine-50-wp",
  "एट्राज़ीन": "atrazine-50-wp",
  "पेंडिमेथालिन": "pendimethalin-30-ec",
  "पेंडीमेथलीन": "pendimethalin-30-ec",
  "स्टॉम्प": "pendimethalin-30-ec",
  "ग्लाइफोसेट": "glyphosate-41-sl",
  "राउंडअप": "glyphosate-41-sl",
  "पैराक्वाट": "paraquat-24-sl",
  "प्रेटिलाक्लोर": "pretilachlor-50-ec",
  "बिसपायरीबैक": "bispyribac-sodium-10-sc",
  "नोमिनी गोल्ड": "bispyribac-sodium-10-sc",
  "क्लोडिनाफॉप": "clodinafop-15-wp",
  "टोपिक": "clodinafop-15-wp",
  "सल्फोसल्फ्यूरॉन": "sulfosulfuron-75-wg",
  "लीडर": "sulfosulfuron-75-wg",
  "मेट्रिब्यूजिन": "metribuzin-70-wp",
  "सेनकोर": "metribuzin-70-wp",
  "पायरोक्सासल्फॉन": "pyroxasulfone-85-wg",
  "टेम्बोट्रिओन": "tembotrione-34-sc",
  "लॉडिस": "tembotrione-34-sc",
  "टोप्रेमेज़ोन": "topramezone-33-sc",
  "टेंडो": "topramezone-33-sc",
  "हैलॉक्सीफॉप": "haloxyfop-r-methyl-10-ec",
  "पिनोक्साडेन": "pinoxaden-5-ec",
  "साथी": "pyrazosulfuron-10-wp",
  "पायराजोसल्फ्यूरॉन": "pyrazosulfuron-10-wp",
  "परस्यूट": "imazethapyr-10-sl",
  "इमाजेथापायर": "imazethapyr-10-sl",
  "टरगा": "quizalofop-5-ec",
  "क्विजालोफॉप": "quizalofop-5-ec",
  "सेम्प्रा": "halosulfuron-75-wg",
  "हैलोसल्फ्यूरॉन": "halosulfuron-75-wg",
  "२,४-डी": "2-4-d-amine-58-sl",
  "2,4-डी": "2-4-d-amine-58-sl",

  // PGR / Biostimulant
  "पैक्लोब्यूट्राजोल": "paclobutrazol-23-sc",
  "कल्टर": "paclobutrazol-23-sc",
  "क्लोर्मेक्वाट": "chlormequat-chloride-50-sl",
  "लिहोसिन": "chlormequat-chloride-50-sl",
  "होमोब्रासिनोलाइड": "homobrassinolide-004",
  "सीवीड": "seaweed-amino",
};

/** Prefer the longest alias match so "chlorantraniliprole 18.5 sc" beats generic name. */
export function lookupChemBottle(raw: string): ChemBottleEntry | undefined {
  if (!raw) return undefined;

  // 1. Check Hindi mapping first
  for (const [hiWord, targetSlug] of Object.entries(HINDI_AGRI_CHEM_MAP)) {
    if (raw.includes(hiWord)) {
      const match = CHEM_BOTTLE_CATALOG.find((e) => e.slug === targetSlug);
      if (match) return match;
    }
  }

  // 2. English / normalized search
  const n = normalizeKey(raw);
  if (!n) return undefined;
  if (byAlias.has(n)) return byAlias.get(n);

  let best: ChemBottleEntry | undefined;
  let bestLen = 0;
  for (const [key, entry] of byAlias) {
    if (key.length < 4) continue;
    if (n.includes(key) && key.length > bestLen) {
      best = entry;
      bestLen = key.length;
    }
  }
  return best;
}

function hyphenSplit(word: string, max: number): string[] {
  if (word.length <= max) return [word];
  const lines: string[] = [];
  let rest = word;
  while (rest.length > max) {
    lines.push(`${rest.slice(0, max - 1)}-`);
    rest = rest.slice(max - 1);
  }
  if (rest) lines.push(rest);
  return lines;
}

export function wrapBottleWords(text: string, maxChars = 13, maxLines = 3): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let cur = "";

  const push = (line: string) => {
    if (line && lines.length < maxLines) lines.push(line);
  };

  for (const word of words) {
    if (lines.length >= maxLines) break;
    const pieces = hyphenSplit(word, maxChars);
    for (const piece of pieces) {
      if (lines.length >= maxLines) break;
      const next = cur ? `${cur} ${piece}` : piece;
      if (next.length <= maxChars) {
        cur = next;
      } else {
        push(cur);
        cur = piece;
      }
    }
  }
  push(cur);
  return lines.filter(Boolean);
}

function cleanTechnical(technical: string): string {
  return technical
    .replace(/\([^)]*(?:IRAC|FRAC|HRAC|Group)[^)]*\)/gi, " ")
    .replace(/\b(?:IRAC|FRAC|HRAC)\s*\S*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function wrapNameForBottle(name: string): string[] {
  const raw = name.replace(/\s+/g, " ").trim();
  if (!raw) return [];
  if (raw.includes("+")) {
    return raw
      .split("+")
      .map((part, i) => {
        const t = part.trim().toUpperCase();
        return i === 0 ? t : `+ ${t}`;
      })
      .slice(0, 3);
  }
  const words = raw.split(" ").filter(Boolean);
  if (words.length >= 2) {
    return wrapBottleWords(raw.toUpperCase(), 10, 3);
  }
  const u = raw.toUpperCase();
  if (u.length <= 12) return [u];
  if (u.length <= 20) {
    const mid = Math.ceil(u.length / 2);
    return [u.slice(0, mid), u.slice(mid)];
  }
  const a = Math.ceil(u.length / 3);
  return [u.slice(0, a), u.slice(a, a * 2), u.slice(a * 2)];
}

export function toEnglishTechnical(raw: string): string {
  if (!raw) return "";
  const hit = lookupChemBottle(raw);
  if (hit) return hit.name.toUpperCase();

  let s = raw;
  const map: Array<[RegExp, string]> = [
    [/इमामेक्टिन\s*(?:बेन्जोएट|बेंजोएट)?/gi, "EMAMECTIN BENZOATE"],
    [/एमामेक्टिन\s*(?:बेन्जोएट|बेंजोएट)?/gi, "EMAMECTIN BENZOATE"],
    [/क्लोरांट्रानिलीप्रोल/gi, "CHLORANTRANILIPROLE"],
    [/कोराजन/gi, "CHLORANTRANILIPROLE"],
    [/इमिडाक्लोप्रिड/gi, "IMIDACLOPRID"],
    [/कान्फिडोर|कन्फिडोर/gi, "IMIDACLOPRID"],
    [/थायमेथॉक्सम|थियामेथोक्सम/gi, "THIAMETHOXAM"],
    [/फिप्रोनिल|फ़िप्रोनिल/gi, "FIPRONIL"],
    [/फ्लोनिकामिड/gi, "FLONICAMID"],
    [/उलाला/gi, "FLONICAMID"],
    [/एफिडोपायरोपैन/gi, "AFIDOPYROPEN"],
    [/सेफिना/gi, "AFIDOPYROPEN"],
    [/डिनोटेफ्यूरॉन|डिनोटेफ्यूरन/gi, "DINOTEFURAN"],
    [/स्पायरोटेट्रामैट/gi, "SPIROTETRAMAT"],
    [/मोवेंटो/gi, "SPIROTETRAMAT"],
    [/कार्टाप|कार्टप/gi, "CARTAP HYDROCHLORIDE"],
    [/लैम्ब्डा(?:\s*साइहलोथ्रिन)?/gi, "LAMBDA-CYHALOTHRIN"],
    [/कराटे/gi, "LAMBDA-CYHALOTHRIN"],
    [/स्पिनोसैड/gi, "SPINOSAD"],
    [/स्पिनेटोरम/gi, "SPINETORAM"],
    [/डेलीगेट/gi, "SPINETORAM"],
    [/फ्लुबेंडियामाइड/gi, "FLUBENDIAMIDE"],
    [/फेम/gi, "FLUBENDIAMIDE"],
    [/डेल्टामेथ्रिन/gi, "DELTAMETHRIN"],
    [/ब्यूप्रोफेज़िन/gi, "BUPROFEZIN"],
    [/डायफेंथियूरॉन/gi, "DIAFENTHIURON"],
    [/स्पाइरोमेसिफेन/gi, "SPIROMESIFEN"],
    [/साइपरमेथ्रिन/gi, "CYPERMETHRIN"],
    [/एसीफेट/gi, "ACEPHATE"],
    [/पाइमेट्रोज़िन/gi, "PYMETROZINE"],
    [/क्लोरफेनापायर/gi, "CHLORFENAPYR"],
    [/मैंकोजेब|मैनकोजेब|मैनकोज़ेब/gi, "MANCOZEB"],
    [/डाइथेन|इंडोफिल/gi, "MANCOZEB"],
    [/कार्बेन्डाजिम|कार्बेंडाजिम/gi, "CARBENDAZIM"],
    [/बाविस्टिन/gi, "CARBENDAZIM"],
    [/रिडोमिल(?:\s*गोल्ड)?|मेटालेक्सिल|मेटालैक्सिल/gi, "METALAXYL-M + MANCOZEB"],
    [/साफ\s*(?:फंगीसाइड)?/gi, "CARBENDAZIM + MANCOZEB"],
    [/नेटिवो/gi, "TEBUCONAZOLE + TRIFLOXYSTROBIN"],
    [/एमिस्टार\s*टॉप/gi, "AZOXYSTROBIN + DIFENOCONAZOLE"],
    [/स्ट्रेप्टोसाइक्लिन|स्ट्रेप्टोमाइसिन/gi, "STREPTOCYCLINE"],
    [/वैलिडामाइसिन|शीथमार/gi, "VALIDAMYCIN"],
    [/क्लोरोपायरीफॉस|हमला/gi, "CHLORPYRIFOS + CYPERMETHRIN"],
    [/प्रोफेनोफॉस|प्रोफेक्स/gi, "PROFENOFOS + CYPERMETHRIN"],
    [/एसिटामिप्रिड|प्राइड|मानिक/gi, "ACETAMIPRID"],
    [/इंडोक्साकार्ब|अवांट/gi, "INDOXACARB"],
    [/प्रोपिनेब/gi, "PROPINEB"],
    [/एंट्राकोल/gi, "PROPINEB"],
    [/डिफेनोकोनाज़ोल|डिफेनोकोनाजोल/gi, "DIFENOCONAZOLE"],
    [/स्कोर/gi, "DIFENOCONAZOLE"],
    [/टेबुकोनाज़ोल|टेबुकोनाजोल/gi, "TEBUCONAZOLE"],
    [/फॉलिकुर/gi, "TEBUCONAZOLE"],
    [/एज़ोक्सीस्ट्रोबिन|एजोक्सीस्ट्रोबिन/gi, "AZOXYSTROBIN"],
    [/एमिस्टार/gi, "AZOXYSTROBIN"],
    [/क्लोरोथैलोनिल/gi, "CHLOROTHALONIL"],
    [/कवच/gi, "CHLOROTHALONIL"],
    [/कॉपर\s*ऑक्सीक्लोराइड/gi, "COPPER OXYCHLORIDE"],
    [/कॉपर\s*हाइड्रोक्साइड/gi, "COPPER HYDROXIDE"],
    [/डाइमेथोमॉर्फ|डाईमेथोमॉर्फ/gi, "DIMETHOMORPH"],
    [/मैंडीप्रोपामिड/gi, "MANDIPROPAMID"],
    [/थायोफैनेट(?:\s*मिथाइल)?/gi, "THIOPHANATE METHYL"],
    [/कासुगामाइसिन/gi, "KASUGAMYCIN"],
    [/थाइफ्लूज़ामाइड/gi, "THIFLUZAMIDE"],
    [/हेक्साकोनाज़ोल/gi, "HEXACONAZOLE"],
    [/ट्राइसाइकलाज़ोल/gi, "TRICYCLAZOLE"],
    [/फ्लुक्सापायरोक्साड/gi, "FLUXAPYROXAD"],
    [/प्रोपिकोनाज़ोल/gi, "PROPICONAZOLE"],
    [/साइमोक्सानिल|कर्जेट/gi, "CYMOXANIL + MANCOZEB"],
    [/आइसोप्रोथिओलेन/gi, "ISOPROTHIOLANE"],
    [/हिनोसन/gi, "EDIFENPHOS"],
    [/एट्राजिन|एट्राज़ीन/gi, "ATRAZINE"],
    [/पेंडिमेथालिन|पेंडीमेथलीन/gi, "PENDIMETHALIN"],
    [/ग्लाइफोसेट/gi, "GLYPHOSATE"],
    [/पैराक्वाट/gi, "PARAQUAT"],
    [/प्रेटिलाक्लोर/gi, "PRETILACHLOR"],
    [/बिसपायरीबैक(?:\s*सोडियम)?/gi, "BISPYRIBAC SODIUM"],
    [/क्लोडिनाफॉप/gi, "CLODINAFOP"],
    [/सल्फोसल्फ्यूरॉन|लीडर/gi, "SULFOSULFURON"],
    [/मेट्रिब्यूजिन/gi, "METRIBUZIN"],
    [/पायरोक्सासल्फॉन/gi, "PYROXASULFONE"],
    [/टेम्बोट्रिओन/gi, "TEMBOTRIONE"],
    [/पायराजोसल्फ्यूरॉन|साथी/gi, "PYRAZOSULFURON-ETHYL"],
    [/इमाजेथापायर|परस्यूट/gi, "IMAZETHAPYR"],
    [/क्विजालोफॉप|टरगा/gi, "QUIZALOFOP-ETHYL"],
    [/हैलोसल्फ्यूरॉन|सेम्प्रा/gi, "HALOSULFURON-METHYL"],
    [/२,४-डी|2,4-डी/gi, "2,4-D AMINE SALT"],
    [/पैक्लोब्यूट्राजोल|कल्टर/gi, "PACLOBUTRAZOL"],
    [/क्लोर्मेक्वाट|लिहोसिन/gi, "CHLORMEQUAT CHLORIDE"],
  ];

  for (const [re, repl] of map) {
    if (re.test(s)) {
      s = s.replace(re, repl);
    }
  }

  return s.toUpperCase().trim();
}

export function bottleLabelParts(technical: string): {
  name: string;
  formulation: string;
  nameLines: string[];
} {
  const cleaned = cleanTechnical(technical);
  const hit = lookupChemBottle(cleaned);
  if (hit) {
    return {
      name: hit.name.toUpperCase(),
      formulation: hit.formulation.trim().toUpperCase(),
      nameLines: wrapNameForBottle(hit.name.toUpperCase()),
    };
  }

  const formMatch = cleaned.match(FORM_RE);
  const formulation = (formMatch?.[1]?.trim() ?? "").toUpperCase();
  const rawName = (formMatch ? cleaned.replace(formMatch[0], " ") : cleaned)
    .replace(/\s*[+]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const englishName = toEnglishTechnical(rawName) || rawName.toUpperCase();

  return {
    name: englishName,
    formulation,
    nameLines: wrapNameForBottle(englishName),
  };
}

export function bottleLabelLines(technical: string): string[] {
  const { nameLines, formulation } = bottleLabelParts(technical);
  if (formulation && !nameLines.some((l) => l.toLowerCase().includes(formulation.toLowerCase()))) {
    return [...nameLines, formulation].slice(0, 3);
  }
  return nameLines.slice(0, 3);
}

export function bottleCategory(technical: string): ChemBottleCategory {
  return lookupChemBottle(technical)?.category ?? "insecticide";
}

/** Pull a printable technical from a farmer dose line. */
export function technicalFromSprayLine(line: string): string {
  return line
    .split(/[·•@→]|\/लीटर|\/L\s*water/i)[0]
    ?.replace(/^Chemical:\s*/i, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim() || line.slice(0, 48);
}

export type ChemPackageType = "bottle" | "pouch";

export function getChemPackageType(technical: string, formulation?: string): ChemPackageType {
  const t = `${technical} ${formulation || ""}`.toUpperCase();
  if (
    /\b(?:WP|WG|WDG|SG|SP|GR|DF|WS)\b/.test(t) ||
    /पाउच|पैकेट|चूर्ण|घुलनशील\s*पाउडर|POUCH|PACKET|SACHET|DUST/i.test(technical)
  ) {
    return "pouch";
  }
  return "bottle";
}

