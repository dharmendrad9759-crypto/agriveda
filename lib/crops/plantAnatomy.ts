/**
 * Plant X-Ray adapter. Reads existing crop-problem text.
 * Does not invent diseases, doses, or symptom links.
 */

import {
  getCropProblemCrop,
  type CropProblemItem,
} from "@/data/crop-curative-problems";
import { dxPartsForCrop } from "@/data/partDiagnostics";
import {
  assembleHubProblem,
  SYMPTOM_CHIPS,
  type HubProblem,
  type HubSymptomChip,
} from "@/lib/crops/intelligenceHub";

export type PlantPart =
  | "root"
  | "stem"
  | "pseudostem"
  | "leaf"
  | "flower"
  | "fruit"
  | "ear"
  | "tuber"
  | "bunch";

export type MorphologyType = "cereal" | "banana" | "tuber" | "tomato" | "generic";

export type PlantPartDef = {
  id: PlantPart;
  labelHi: string;
  /** Percent position of the 44px touch target on the figure. */
  x: number;
  y: number;
};

export type CropAnatomy = {
  cropId: string;
  morphologyType: MorphologyType;
  parts: PlantPartDef[];
};

const WHEAT_PARTS: PlantPartDef[] = [
  { id: "ear", labelHi: "बाली", x: 54, y: 14 },
  { id: "leaf", labelHi: "पत्ती", x: 22, y: 38 },
  { id: "stem", labelHi: "तना", x: 46, y: 52 },
  { id: "root", labelHi: "जड़", x: 50, y: 80 },
];

const PADDY_PARTS: PlantPartDef[] = [
  { id: "ear", labelHi: "बाली", x: 42, y: 16 },
  { id: "leaf", labelHi: "पत्ती", x: 20, y: 40 },
  { id: "stem", labelHi: "तना", x: 52, y: 56 },
  { id: "root", labelHi: "जड़", x: 50, y: 80 },
];

const BANANA_PARTS: PlantPartDef[] = [
  { id: "bunch", labelHi: "गुच्छा", x: 66, y: 44 },
  { id: "leaf", labelHi: "पत्ती", x: 30, y: 18 },
  { id: "pseudostem", labelHi: "तना", x: 46, y: 52 },
  { id: "root", labelHi: "जड़", x: 50, y: 84 },
];

const TUBER_PARTS: PlantPartDef[] = [
  { id: "leaf", labelHi: "पत्ती", x: 34, y: 22 },
  { id: "stem", labelHi: "तना", x: 50, y: 44 },
  { id: "tuber", labelHi: "कंद", x: 72, y: 78 },
  { id: "root", labelHi: "जड़", x: 40, y: 72 },
];

const TOMATO_PARTS: PlantPartDef[] = [
  { id: "flower", labelHi: "फूल", x: 66, y: 24 },
  { id: "fruit", labelHi: "फल", x: 66, y: 44 },
  { id: "leaf", labelHi: "पत्ती", x: 24, y: 36 },
  { id: "stem", labelHi: "तना", x: 46, y: 50 },
  { id: "root", labelHi: "जड़", x: 50, y: 80 },
];

const GENERIC_PARTS: PlantPartDef[] = [
  { id: "leaf", labelHi: "पत्ती", x: 28, y: 26 },
  { id: "stem", labelHi: "तना", x: 50, y: 46 },
  { id: "root", labelHi: "जड़", x: 50, y: 74 },
];

const PRIORITY: Record<string, { morphologyType: MorphologyType; parts: PlantPartDef[] }> = {
  wheat: { morphologyType: "cereal", parts: WHEAT_PARTS },
  paddy: { morphologyType: "cereal", parts: PADDY_PARTS },
  banana: { morphologyType: "banana", parts: BANANA_PARTS },
  potato: { morphologyType: "tuber", parts: TUBER_PARTS },
  tomato: { morphologyType: "tomato", parts: TOMATO_PARTS },
};

const FALLBACK_PIN: Record<PlantPart, PlantPartDef> = {
  root: { id: "root", labelHi: "जड़", x: 50, y: 80 },
  stem: { id: "stem", labelHi: "तना", x: 50, y: 50 },
  pseudostem: { id: "pseudostem", labelHi: "तना", x: 46, y: 52 },
  leaf: { id: "leaf", labelHi: "पत्ती", x: 28, y: 32 },
  flower: { id: "flower", labelHi: "फूल", x: 66, y: 22 },
  fruit: { id: "fruit", labelHi: "फल", x: 66, y: 44 },
  ear: { id: "ear", labelHi: "बाली", x: 48, y: 14 },
  tuber: { id: "tuber", labelHi: "कंद", x: 72, y: 78 },
  bunch: { id: "bunch", labelHi: "गुच्छा", x: 66, y: 44 },
};

export function anatomyForCrop(cropId: string): CropAnatomy {
  const known = PRIORITY[cropId];
  const base = known ? known.parts : GENERIC_PARTS;
  const have = new Set(base.map((part) => part.id));
  const extra = dxPartsForCrop(cropId)
    .filter((id) => !have.has(id))
    .map((id) => FALLBACK_PIN[id]);
  return {
    cropId,
    morphologyType: known?.morphologyType ?? "generic",
    parts: [...base, ...extra],
  };
}

export function partLabel(cropId: string, part: PlantPart): string {
  return anatomyForCrop(cropId).parts.find((p) => p.id === part)?.labelHi ?? part;
}

export function isPlantPart(value: string): value is PlantPart {
  return [
    "root",
    "stem",
    "pseudostem",
    "leaf",
    "flower",
    "fruit",
    "ear",
    "tuber",
    "bunch",
  ].includes(value);
}

const PART_RE: Record<PlantPart, RegExp> = {
  root: /जड़|जड़ों|root/i,
  leaf: /पत्ती|पत्ति|पत्ते|पत्ता|leaf/i,
  ear: /बाली|बालि|earhead|ear\s*head/i,
  tuber: /कंद|tuber/i,
  bunch: /गुच्छा|घौद|bunch/i,
  flower: /फूल|flower/i,
  fruit: /फलों?|fruit/i,
  stem: /तना|तने|गोभ|stem/i,
  pseudostem: /तना|तने|स्यूडो|pseudostem|stem/i,
};

/** Words for the phrase the farmer actually tapped. Rot is not "पत्ती सूखना". */
const PHRASE_RE: Record<PlantPart, Partial<Record<HubSymptomChip, RegExp>>> = {
  root: {
    wilt: /सूख|सड़|गल|मुरझा/i,
    yellow: /पील|yellow/i,
    holes: /छेद/i,
    stunt: /बढ़वार|रुक|बौना/i,
  },
  stem: {
    wilt: /सूख|सड़|गल|मुरझा/i,
    spots: /धब्ब|झुलसा|पपड़ी/i,
    holes: /छेद|गोभ/i,
    yellow: /पील/i,
    curl: /मुड़|मरोड़/i,
  },
  pseudostem: {
    wilt: /सूख|सड़|गल/i,
    spots: /धब्ब|झुलसा/i,
    holes: /छेद/i,
    yellow: /पील/i,
  },
  leaf: {
    curl: /मुड़|कुकड़|मरोड़|curl/i,
    spots: /धब्ब|छल्ल|झुलसा|रतुआ|spot|टिक्का|चूर्ण|mildew|पपड़ी/i,
    yellow: /पील|yellow|हल्दी/i,
    wilt: /सूख|मुरझा/i,
    holes: /छेद|सुरंग/i,
    stunt: /बौना|छोटी|बढ़वार/i,
  },
  flower: {
    wilt: /सूख|झड़|मुरझा/i,
    spots: /धब्ब|पपड़ी/i,
    curl: /मुड़|मरोड़/i,
    holes: /छेद/i,
    yellow: /पील/i,
  },
  fruit: {
    spots: /धब्ब|पपड़ी|spot/i,
    holes: /छेद/i,
    yellow: /पील/i,
    wilt: /सड़|गल/i,
    curl: /मुड़/i,
  },
  ear: {
    spots: /धब्ब|रतुआ|काला/i,
    holes: /छेद/i,
    yellow: /पील/i,
    wilt: /सूख|सफेद बाली/i,
  },
  tuber: {
    spots: /धब्ब|पपड़ी/i,
    holes: /छेद/i,
    wilt: /सड़|गल/i,
    yellow: /पील/i,
  },
  bunch: {
    spots: /धब्ब/i,
    wilt: /सड़|गल/i,
    yellow: /पील/i,
    holes: /छेद/i,
  },
};

const PHRASE: Record<PlantPart, Partial<Record<HubSymptomChip, string>>> = {
  root: { wilt: "जड़ सड़ना", yellow: "जड़ का पीलापन", holes: "जड़ में छेद", stunt: "जड़ से बढ़वार रुकना" },
  stem: { wilt: "तना सड़ना", spots: "तना पर धब्बे", holes: "तना या गोभ में छेद", yellow: "तना पीला", curl: "तना मुड़ना" },
  pseudostem: { wilt: "तना सड़ना", spots: "तना पर धब्बे", holes: "तना में छेद", yellow: "तना पीला" },
  leaf: {
    curl: "पत्ती मुड़ना",
    spots: "पत्ती पर धब्बे",
    yellow: "पत्ती पीली",
    wilt: "पत्ती सूखना",
    holes: "पत्ती में छेद",
    stunt: "पत्ती छोटी रहना",
  },
  flower: { wilt: "फूल सूखना", spots: "फूल पर धब्बे", curl: "फूल मुड़ना", holes: "फूल में छेद", yellow: "फूल पीला" },
  fruit: { spots: "फल पर धब्बे", holes: "फल में छेद", yellow: "फल पीला", wilt: "फल सड़ना", curl: "फल मुड़ना" },
  ear: { spots: "बाली पर धब्बे", holes: "बाली में छेद", yellow: "बाली पीली", wilt: "बाली सूखना" },
  tuber: { spots: "कंद पर धब्बे", holes: "कंद में छेद", wilt: "कंद सड़ना", yellow: "कंद पीला" },
  bunch: { spots: "गुच्छे पर धब्बे", wilt: "गुच्छा सड़ना", yellow: "गुच्छा पीला", holes: "गुच्छे में छेद" },
};

function focusClauses(problem: CropProblemItem): string[] {
  return [problem.nameHi, problem.nameEn, problem.specialFactHi ?? "", problem.whatHi]
    .flatMap((line) => line.split(/[।;,|\n]|\sऔर\s/))
    .map((line) => line.trim())
    .filter((line) => line.length > 6 && !/अवस्था/.test(line));
}

/** Stage talk ("फल अवस्था", "फल नहीं बनते") is not a mark on the fruit. */
function clauseNamesPart(clause: string, part: PlantPart): boolean {
  if (part === "fruit") {
    const stripped = clause
      .replace(/फल\s*अवस्था/gi, "")
      .replace(/फूल[\s./-]*फल/gi, "")
      .replace(/फल[\s./-]*फूल/gi, "")
      .replace(/फल\s*नहीं[^।]*/gi, "")
      .replace(/fruiting/gi, "");
    return /फलों?|fruit/i.test(stripped);
  }
  if (part === "flower") {
    const stripped = clause.replace(/फूल[\s./-]*फल/gi, "").replace(/फल[\s./-]*फूल/gi, "");
    return PART_RE.flower.test(stripped);
  }
  return PART_RE[part].test(clause);
}

export function symptomPhrase(part: PlantPart, id: HubSymptomChip): string {
  return PHRASE[part][id] ?? symptomLabel(id);
}

/** The sentence that actually ties this symptom to this organ. */
export function evidenceClause(
  problem: CropProblemItem,
  part: PlantPart,
  symptom: HubSymptomChip
): string | null {
  const re = PHRASE_RE[part][symptom];
  if (!re) return null;
  for (const clause of focusClauses(problem)) {
    if (clauseNamesPart(clause, part) && re.test(clause)) return clause;
  }
  return null;
}

/** Symptoms whose own sentence names this organ. A leaf sentence does not count for fruit. */
export function symptomsOnPart(cropId: string, problem: CropProblemItem, part: PlantPart): HubSymptomChip[] {
  const allowed = anatomyForCrop(cropId).parts.some((p) => p.id === part);
  if (!allowed) return [];
  return SYMPTOM_CHIPS.map((chip) => chip.id).filter((id) => evidenceClause(problem, part, id));
}

/** Organs named in the existing Hindi/English record. No guessed links. */
export function partsMentioned(cropId: string, problem: CropProblemItem): PlantPart[] {
  const allowed = anatomyForCrop(cropId).parts.map((p) => p.id);
  return allowed.filter((part) => focusClauses(problem).some((clause) => clauseNamesPart(clause, part)));
}

export type PartMatch = {
  hub: HubProblem;
  parts: PlantPart[];
  reasonHi: string;
};

export function symptomLabel(id: HubSymptomChip): string {
  return SYMPTOM_CHIPS.find((c) => c.id === id)?.labelHi ?? id;
}

export function symptomsForPart(cropId: string, part: PlantPart): { id: HubSymptomChip; labelHi: string }[] {
  const crop = getCropProblemCrop(cropId);
  if (!crop) return [];
  const ids = new Set<HubSymptomChip>();
  for (const problem of crop.problems) {
    symptomsOnPart(cropId, problem, part).forEach((id) => ids.add(id));
  }
  return SYMPTOM_CHIPS.filter((chip) => ids.has(chip.id)).map((chip) => ({
    id: chip.id,
    labelHi: symptomPhrase(part, chip.id),
  }));
}

export function matchProblems(opts: {
  cropId: string;
  part?: PlantPart | null;
  symptoms?: HubSymptomChip[];
}): { matches: PartMatch[]; unmapped: number } {
  const crop = getCropProblemCrop(opts.cropId);
  if (!crop) return { matches: [], unmapped: 0 };

  const symptoms = (opts.symptoms ?? []).filter(Boolean);
  let unmapped = 0;
  const matches: PartMatch[] = [];

  for (const problem of crop.problems) {
    const parts = partsMentioned(crop.slug, problem);
    if (parts.length === 0) unmapped += 1;
    if (opts.part && !parts.includes(opts.part)) continue;

    const hub = assembleHubProblem(crop.slug, problem.id);
    if (!hub) continue;
    const onPart = opts.part ? symptomsOnPart(crop.slug, problem, opts.part) : hub.symptomChips;
    if (symptoms.length > 0 && !symptoms.every((s) => onPart.includes(s))) continue;
    if (!opts.part && symptoms.length === 0) continue;

    const partName = opts.part ? partLabel(crop.slug, opts.part) : parts.map((p) => partLabel(crop.slug, p)).join(", ");
    const symptomNames = opts.part
      ? symptoms.map((id) => symptomPhrase(opts.part as PlantPart, id))
      : symptoms.map(symptomLabel);
    const quoted = opts.part
      ? symptoms
          .map((id) => evidenceClause(problem, opts.part as PlantPart, id))
          .filter((line): line is string => Boolean(line))
      : [];
    const reasonHi = quoted.length
      ? quoted[0]
      : symptomNames.length
        ? `${partName}: ${symptomNames.join(", ")}`
        : `${partName} का नाम मौजूदा विवरण में है`;

    matches.push({ hub, parts, reasonHi });
  }

  return { matches, unmapped };
}

export function xrayHref(cropId: string, part?: string | null, symptoms?: string[]): string {
  const params = new URLSearchParams();
  if (part) params.set("part", part);
  if (symptoms?.length) params.set("symptoms", symptoms.join(","));
  const q = params.toString();
  return `/crop-problems/${cropId}/xray${q ? `?${q}` : ""}`;
}

export function galleryHref(cropId: string, part?: string | null, symptoms?: string[]): string {
  const params = new URLSearchParams();
  if (part) params.set("part", part);
  if (symptoms?.length) params.set("symptoms", symptoms.join(","));
  params.set("from", "xray");
  const q = params.toString();
  return `/crop-problems/${cropId}?${q}`;
}
