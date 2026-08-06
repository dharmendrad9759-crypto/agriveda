import lookup from "@/data/tank-mix/lookup.json";
import { getProductById } from "@/data/spray-products";
import { checkNpkCompatibility, npkMolecules } from "@/data/tank-mix/npk";
import { checkClassCompatibility } from "@/data/tank-mix/classRules";
import {
  getResearchPairMap,
  researchMolecules,
  researchPairKey,
} from "@/data/tank-mix/researchPairs";

export type TankMixStatus = "safe" | "caution" | "incompatible";

export interface TankMixCheckResult {
  status: TankMixStatus;
  title: string;
  message: string;
  mixOrder?: string;
  confidence?: string;
  category?: string;
}

export type TankMixCategory =
  | "insecticide+insecticide"
  | "fungicide+fungicide"
  | "herbicide+herbicide"
  | "insecticide+fungicide"
  | "chem+fertilizer"
  | "micro+pgr"
  | "biological"
  | "npk";

type LookupFile = {
  pairs: Record<
    string,
    {
      status: TankMixStatus;
      category: string;
      reason: string;
      notes: string;
      mixOrder: string;
      cropNotes: string;
      confidence: string;
      farmNote: string;
      aLabel: string;
      bLabel: string;
    }
  >;
  molecules: {
    id: string;
    label: string;
    forms: string[];
    categories: string[];
  }[];
  formulations: {
    a: string;
    b: string;
    status: TankMixStatus;
    reason: string;
    risk: string;
    mixOrder: string;
    jarAdvice: string;
  }[];
};

const data = lookup as LookupFile;
const researchMap = getResearchPairMap();

/** Aliases so Excel technical names match research ids */
const ALIASES: Record<string, string> = {
  "profenophos": "profenofos",
  "lambda cyhalothrin": "lambda-cyhalothrin",
  "lambda-cyhalothrin": "lambda-cyhalothrin",
  "bispyribac sodium": "bispyribac-sodium",
  "cartap hydrochloride": "cartap hydrochloride",
  "zinc sulphate": "znso4",
  "ferrous sulphate": "feso4",
  "calcium nitrate": "can",
  "magnesium sulphate": "mgso4",
  "19-19-19": "wnp",
  "npk 19-19-19": "wnp",
  "12-61-0": "map",
  "0-52-34": "mkp",
  "0-52-34 npk": "mkp",
  "13-0-45": "kn03",
  "0-0-50": "sop",
  "gibberellic acid": "ga3",
  ga3: "ga3",
  "humic acid": "humic",
  "fulvic acid": "fulvic",
  sulphur: "sulfur",
  "elemental sulphur": "sulfur",
  "elemental sulphur 80% wdg": "sulfur",
  "2,4-d": "24-d",
  "24-d": "24-d",
  urea: "urea",
  dap: "dap",
};

function norm(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9+\-.%() ]/g, "")
    .trim();
}

function canonical(s: string): string {
  const n = norm(s);
  return ALIASES[n] || n;
}

function pairKey(a: string, b: string): string {
  const x = canonical(a);
  const y = canonical(b);
  return x < y ? `${x}||${y}` : `${y}||${x}`;
}

const STATUS_HI: Record<TankMixStatus, { title: string; lead: string }> = {
  safe: { title: "मिला सकते हो", lead: "स्रोत के अनुसार संगत" },
  caution: { title: "न मिलाएँ", lead: "शर्त/संदेह = ऐप में न मिलाएँ" },
  incompatible: { title: "न मिलाएँ", lead: "असंगत / स्रोत नहीं" },
};

const LEGAL_NO_MIX: TankMixCheckResult = {
  status: "incompatible",
  title: "न मिलाएँ",
  message:
    "न मिलाएँ।\n\nबिना उत्पाद-लेबल की साफ़ अनुमति टैंक-मिक्स न करें। अलग स्प्रे करें।\n\nनोट: उत्पाद लेबल / CIBRC निर्देश अंतिम हैं।",
};

/** Farmer-facing: only YES (safe) or NO (everything else). No jar-test hedge. */
function toBinaryVerdict(result: TankMixCheckResult): TankMixCheckResult {
  if (result.status === "safe") {
    return {
      ...result,
      title: "मिला सकते हो",
      message: stripJarLanguage(result.message),
    };
  }
  const reason = stripJarLanguage(
    result.message
      .replace(/^मिला सकते हो[^\n]*/i, "")
      .replace(/^सावधानी[^\n]*/i, "")
      .trim()
  );
  return {
    ...result,
    status: "incompatible",
    title: "न मिलाएँ",
    message: [
      "न मिलाएँ।",
      reason && !reason.startsWith("न मिलाएँ") ? reason : "",
      "ऐप शर्त वाली / अधूरी जोड़ी पर मिक्स की सलाह नहीं देता। लेबल पर साफ़ अनुमति हो तभी।",
      "नोट: उत्पाद लेबल / CIBRC निर्देश अंतिम हैं।",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}

function stripJarLanguage(text: string): string {
  return text
    .replace(/\s*जार\s*टेस्ट[^.।\n]*/gi, "")
    .replace(/\s*jar\s*test[^.。\n]*/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function getTankMixCategories(): { id: TankMixCategory; hi: string; en: string }[] {
  return [
    { id: "insecticide+fungicide", hi: "कीट + फफूंद", en: "Insecticide + Fungicide" },
    { id: "insecticide+insecticide", hi: "कीट + कीट", en: "Insecticide + Insecticide" },
    { id: "fungicide+fungicide", hi: "फफूंद + फफूंद", en: "Fungicide + Fungicide" },
    { id: "herbicide+herbicide", hi: "खरपतवार + खरपतवार", en: "Herbicide + Herbicide" },
    { id: "chem+fertilizer", hi: "दवा + खाद", en: "Pesticide + Fertilizer" },
    { id: "micro+pgr", hi: "माइक्रो / PGR", en: "Micro + Biostimulant" },
    { id: "biological", hi: "जैव नियंत्रण", en: "Biologicals" },
    { id: "npk", hi: "खाद / NPK", en: "Fertilizer / NPK" },
  ];
}

type MoleculeOption = {
  id: string;
  label: string;
  forms: string[];
  categories: string[];
};

function excelMolecules(
  ...cats: string[]
): MoleculeOption[] {
  return data.molecules
    .filter((m) => m.categories.some((c) => cats.includes(c)))
    .map((m) => ({
      id: m.id,
      label: m.label,
      forms: m.forms,
      categories: m.categories,
    }));
}

function researchMoleculesFor(
  ...cats: Array<ResearchMoleculeCategory>
): MoleculeOption[] {
  return researchMolecules
    .filter((m) => m.categories.some((c) => cats.includes(c)))
    .map((m) => ({
      id: m.id,
      label: `${m.labelHi} (${m.label})`,
      forms: [],
      categories: m.categories,
    }));
}

type ResearchMoleculeCategory = (typeof researchMolecules)[number]["categories"][number];

function uniqById(list: MoleculeOption[]): MoleculeOption[] {
  const seen = new Set<string>();
  const out: MoleculeOption[] = [];
  for (const m of list) {
    const id = canonical(m.id);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ ...m, id });
  }
  return out.sort((a, b) => a.label.localeCompare(b.label, "en"));
}

export function getMoleculesForCategory(category: TankMixCategory): MoleculeOption[] {
  switch (category) {
    case "npk":
      return uniqById([
        ...npkMolecules.map((m) => ({
          id: m.id,
          label: `${m.labelHi} (${m.label})`,
          forms: [] as string[],
          categories: ["fertilizer"],
        })),
        ...researchMoleculesFor("fertilizer"),
      ]);
    case "chem+fertilizer":
      return uniqById([
        ...excelMolecules("insecticide", "fungicide", "herbicide"),
        ...researchMoleculesFor("insecticide", "fungicide", "herbicide", "fertilizer"),
        ...npkMolecules.map((m) => ({
          id: m.id,
          label: `${m.labelHi} (${m.label})`,
          forms: [] as string[],
          categories: ["fertilizer"],
        })),
      ]);
    case "micro+pgr":
      return uniqById([
        ...researchMoleculesFor("micronutrient", "biostimulant", "fertilizer"),
        ...npkMolecules
          .filter((m) => m.kind === "micro" || m.kind === "organic")
          .map((m) => ({
            id: m.id,
            label: `${m.labelHi} (${m.label})`,
            forms: [] as string[],
            categories: ["micronutrient"],
          })),
      ]);
    case "biological":
      return uniqById([
        ...researchMoleculesFor("biological", "fungicide", "insecticide"),
        ...excelMolecules("fungicide", "insecticide").filter((m) =>
          /copper|carbendazim|mancozeb|chlorpyrifos|emamectin/i.test(m.label)
        ),
      ]);
    case "insecticide+insecticide":
      return uniqById([
        ...excelMolecules("insecticide"),
        ...researchMoleculesFor("insecticide", "biological"),
      ]);
    case "fungicide+fungicide":
      return uniqById([
        ...excelMolecules("fungicide"),
        ...researchMoleculesFor("fungicide", "biological"),
      ]);
    case "herbicide+herbicide":
      return uniqById([
        ...excelMolecules("herbicide"),
        ...researchMoleculesFor("herbicide"),
      ]);
    case "insecticide+fungicide":
    default:
      return uniqById([
        ...excelMolecules("insecticide", "fungicide"),
        ...researchMoleculesFor("insecticide", "fungicide"),
      ]);
  }
}

function translateConfidence(c: string): string {
  const s = c.toLowerCase();
  if (s.includes("high")) return "स्रोत विश्वास: ऊँचा";
  if (s.includes("medium")) return "स्रोत विश्वास: मध्यम";
  if (s.includes("low") || s.includes("not verified")) return "स्रोत विश्वास: कम";
  return c ? `स्रोत: ${c}` : "";
}

function isLowConfidence(c?: string): boolean {
  if (!c) return false;
  const s = c.toLowerCase();
  return s.includes("low") || s.includes("not verified");
}

function shorten(en: string, max = 240): string {
  const t = en.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function extractFormCode(raw?: string): string | null {
  if (!raw) return null;
  const m = String(raw).match(/\b(SC|EC|WP|WG|SL|SP|SG|OD|EW|CS|SE|DF|GR|FS|WDG)\b/i);
  if (!m) return null;
  const code = m[1].toUpperCase();
  return code === "WDG" ? "WG" : code;
}

function findFormulation(formA?: string, formB?: string) {
  const fa = extractFormCode(formA);
  const fb = extractFormCode(formB);
  if (!fa || !fb) return null;
  if (fa === fb) {
    return {
      a: fa,
      b: fb,
      status: "safe" as TankMixStatus,
      reason: `एक ही फॉर्मूलेशन प्रकार (${fa}+${fa}) आमतौर पर भौतिक मिलावट सरल।`,
      risk: "",
      mixOrder: "WALES क्रम में डालें, बीच में हिलाएँ।",
      jarAdvice: "",
    };
  }
  return (
    data.formulations.find(
      (f) =>
        (f.a === fa && f.b === fb) || (f.b === fa && f.a === fb)
    ) || null
  );
}

function applyFormulation(
  base: TankMixCheckResult,
  formA?: string,
  formB?: string
): TankMixCheckResult {
  const fHit = findFormulation(formA, formB);
  if (!fHit) return base;

  const fa = extractFormCode(formA)!;
  const fb = extractFormCode(formB)!;
  const formLine = stripJarLanguage(`फॉर्मूलेशन (${fa} + ${fb}): ${shorten(fHit.reason, 160)}`);

  // Formulation not clearly safe → न मिलाएँ (legal binary)
  if (fHit.status !== "safe") {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message: [
        "न मिलाएँ — फॉर्मूलेशन प्रकार संगत नहीं / शर्त वाली है।",
        formLine,
        "नोट: उत्पाद लेबल अंतिम है।",
      ]
        .filter(Boolean)
        .join("\n\n"),
      mixOrder: fHit.mixOrder,
      category: base.category,
      confidence: base.confidence,
    };
  }

  if (base.status === "incompatible") {
    return {
      ...base,
      message: stripJarLanguage(`${base.message}\n\n${formLine}`),
    };
  }

  return {
    ...base,
    status: "safe",
    title: "मिला सकते हो",
    message: stripJarLanguage(
      [base.message, formLine, fHit.mixOrder ? `फॉर्म मिलाने का क्रम: ${shorten(fHit.mixOrder, 120)}` : ""]
        .filter(Boolean)
        .join("\n\n")
    ),
    mixOrder: base.mixOrder || fHit.mixOrder,
  };
}

function formatSourcedMessage(opts: {
  status: TankMixStatus;
  reason: string;
  mixOrder?: string;
  phytotoxicity?: string;
  confidence?: string;
  sourceTag: string;
}): TankMixCheckResult {
  // Caution / low confidence → farmer NO (no jar-test hedge)
  if (opts.status === "caution" || (isLowConfidence(opts.confidence) && opts.status !== "incompatible")) {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message: [
        "न मिलाएँ।",
        stripJarLanguage(shorten(opts.reason, 200)),
        "शर्त / अधूरा स्रोत होने पर ऐप मिक्स की सलाह नहीं देता।",
        "नोट: उत्पाद लेबल / CIBRC निर्देश अंतिम हैं।",
      ]
        .filter(Boolean)
        .join("\n\n"),
      category: opts.sourceTag,
      confidence: opts.confidence,
    };
  }

  if (opts.status === "incompatible") {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message: [
        "न मिलाएँ।",
        stripJarLanguage(shorten(opts.reason, 220)),
        "अलग स्प्रे / अलग दिन।",
        "नोट: उत्पाद लेबल / CIBRC निर्देश अंतिम हैं।",
      ]
        .filter(Boolean)
        .join("\n\n"),
      mixOrder: opts.mixOrder,
      confidence: opts.confidence,
      category: opts.sourceTag,
    };
  }

  // safe only
  return {
    status: "safe",
    title: "मिला सकते हो",
    message: [
      "मिला सकते हो।",
      stripJarLanguage(shorten(opts.reason, 220)),
      opts.mixOrder ? `मिलाने का क्रम: ${stripJarLanguage(shorten(opts.mixOrder, 140))}` : "",
      "नोट: उत्पाद लेबल / CIBRC निर्देश अंतिम हैं।",
    ]
      .filter(Boolean)
      .join("\n\n"),
    mixOrder: opts.mixOrder,
    confidence: opts.confidence,
    category: opts.sourceTag,
  };
}

function fromResearch(activeA: string, activeB: string): TankMixCheckResult | null {
  const hit =
    researchMap[researchPairKey(canonical(activeA), canonical(activeB))] ||
    researchMap[pairKey(activeA, activeB)];
  if (!hit) return null;

  if (hit.evidence === "Low" && hit.status !== "incompatible") {
    return { ...LEGAL_NO_MIX, category: hit.category };
  }

  return formatSourcedMessage({
    status: hit.status,
    reason: hit.reason,
    mixOrder: hit.mixOrder,
    phytotoxicity: hit.phytotoxicity,
    confidence: hit.evidence,
    sourceTag: hit.category,
  });
}

/** Primary API — technical / research ids. Optional formulation codes (EC, SC, WP…). */
export function checkTankMixByActives(
  activeA: string,
  activeB: string,
  category?: TankMixCategory,
  formA?: string,
  formB?: string
): TankMixCheckResult {
  if (!activeA || !activeB) {
    return {
      status: "caution",
      title: "दोनों दवाएँ चुनें",
      message: "मिलान जाँच के लिए दोनों ड्रॉपडाउन से नाम चुनें।",
    };
  }

  if (canonical(activeA) === canonical(activeB)) {
    return {
      status: "incompatible",
      title: "न मिलाएँ",
      message: "एक ही अणु दो बार चुनने से टैंक-मिक्स जाँच नहीं होती। दो अलग अणु चुनें।",
    };
  }

  let result: TankMixCheckResult | null = null;

  // 1) Research extension
  result = fromResearch(activeA, activeB);

  // 2) NPK helper (only when both sides are fert/micro)
  if (!result && (category === "npk" || category === "micro+pgr" || category === "chem+fertilizer")) {
    const npk = checkNpkCompatibility(canonical(activeA), canonical(activeB));
    if (npk) {
      result = {
        status: npk.status,
        title: STATUS_HI[npk.status].title,
        message: `${npk.message}\n\nनोट: उत्पाद लेबल अंतिम है।`,
        category: category ?? "npk",
      };
    }
  }

  // 3) Excel India workbook
  if (!result) {
    const hit =
      data.pairs[pairKey(activeA, activeB)] ||
      data.pairs[pairKey(canonical(activeA), canonical(activeB))];
    if (hit) {
      if (isLowConfidence(hit.confidence) && hit.status !== "incompatible") {
        result = { ...LEGAL_NO_MIX, category: hit.category };
      } else {
        result = formatSourcedMessage({
          status: hit.status,
          reason: hit.reason || hit.notes || hit.farmNote,
          mixOrder: hit.mixOrder,
          confidence: hit.confidence,
          sourceTag: hit.category || "excel",
        });
      }
    }
  }

  // 4) NPK hard rules when both are fertilizers (any category)
  if (!result) {
    const npkFallback = checkNpkCompatibility(canonical(activeA), canonical(activeB));
    if (npkFallback) {
      result = {
        status: npkFallback.status,
        title: STATUS_HI[npkFallback.status].title,
        message: `${npkFallback.message}\n\nनोट: उत्पाद लेबल अंतिम है।`,
        category: category ?? "npk",
      };
    }
  }

  // 5) Class rules — only Medium/High; Low/default already returns न मिलाएँ
  if (!result) {
    const classHit = checkClassCompatibility(canonical(activeA), canonical(activeB));
    if (classHit) {
      if (classHit.evidence === "Low" || classHit.category?.startsWith("no-source")) {
        result = {
          status: "incompatible",
          title: STATUS_HI.incompatible.title,
          message: `${shorten(classHit.reason)}\n\nनोट: उत्पाद लेबल / CIBRC निर्देश अंतिम हैं।`,
          category: classHit.category,
          confidence: classHit.evidence,
        };
      } else {
        result = formatSourcedMessage({
          status: classHit.status,
          reason: classHit.reason,
          mixOrder: classHit.mixOrder,
          phytotoxicity: classHit.phytotoxicity,
          confidence: classHit.evidence,
          sourceTag: classHit.category,
        });
      }
    }
  }

  if (!result) {
    result = { ...LEGAL_NO_MIX, category };
  }

  return toBinaryVerdict(applyFormulation(result, formA, formB));
}

export function checkTankMixCompatibility(
  productIdA: string,
  productIdB: string
): TankMixCheckResult {
  const a = getProductById(productIdA);
  const b = getProductById(productIdB);
  if (!a || !b) {
    return {
      status: "caution",
      title: "दोनों उत्पाद चुनें",
      message: "मिलान जाँच के लिए दोनों ड्रॉपडाउन से कृषि रसायन चुनें।",
    };
  }
  if (a.id === b.id) {
    return {
      status: "caution",
      title: "एक ही उत्पाद चुना",
      message: "टैंक मिक्स के लिए दो अलग उत्पाद चुनें।",
    };
  }

  const byActive = checkTankMixByActives(
    a.activeIngredient,
    b.activeIngredient,
    undefined,
    a.productName,
    b.productName
  );
  return {
    ...byActive,
    message: `${a.productName} + ${b.productName}\n\n${byActive.message}`,
  };
}

export function formatProductOption(label: string): string {
  return label;
}

export function formatMoleculeOption(m: { label: string; forms?: string[] }): string {
  if (m.forms && m.forms.length) return `${m.label} · ${m.forms.slice(0, 2).join(", ")}`;
  return m.label;
}
