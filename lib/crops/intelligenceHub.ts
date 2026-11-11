/**
 * Crop Intelligence Hub assembler — adapters over existing crop-problems data.
 * Never invents PHI / IRAC / look-alikes. Missing stays missing.
 */

import {
  CROP_PROBLEM_CROPS,
  getCropProblem,
  getCropProblemCrop,
  type CropProblemCrop,
  type CropProblemItem,
  type GrowthStage,
} from "@/data/crop-curative-problems";
import { getHubOverlay } from "@/data/hub/priorityOverlays";
import { lookupMoA } from "@/data/moa-lookup";
import { getCurativeMedicines, type CurativeMedicine } from "@/lib/crops/cropProblemMedicines";
import { isPreMixFormulation } from "@/lib/crops/medicineParser";

export type HubKind = "pest" | "disease" | "weed" | "nutrient" | "abiotic";
export type HubSymptomChip = "curl" | "spots" | "wilt" | "holes" | "stunt" | "yellow";
export type HubStageChip = "nursery" | "early" | "flower" | "ripen";
export type EvidenceStatus = "verified" | "pending" | "conflicting" | "missing";

export type HubLookAlike = {
  id: string;
  similarHi: string;
  differHi: string;
};

export type HubOverlay = {
  fieldCheckHi?: string;
  dontDoHi?: string[];
  localAliases?: string[];
  lookAlikes?: HubLookAlike[];
  sprayWindow?: "morning" | "evening" | "either";
  nozzleHi?: string;
  sticker?: "yes" | "no" | "unknown";
  /** Only set when formulation-specific and sourced — otherwise omit */
  phiNoteHi?: string;
  reviewedOn?: string;
  sourceLabel?: string;
};

export type HubProblem = {
  crop: CropProblemCrop;
  problem: CropProblemItem;
  kind: HubKind;
  subtype?: "viral" | "fungal" | "bacterial" | "insect" | "mite";
  symptomChips: HubSymptomChip[];
  stageChip: HubStageChip | null;
  medicines: CurativeMedicine[];
  overlay: HubOverlay;
};

export const SYMPTOM_CHIPS: { id: HubSymptomChip; labelHi: string }[] = [
  { id: "curl", labelHi: "पत्ती मुड़ना" },
  { id: "spots", labelHi: "पत्ती पर धब्बे" },
  { id: "wilt", labelHi: "पौधा सूखना" },
  { id: "holes", labelHi: "फल/गोभ में छेद" },
  { id: "stunt", labelHi: "बढ़वार रुकना" },
  { id: "yellow", labelHi: "पीलापन" },
];

export const STAGE_CHIPS: { id: HubStageChip; labelHi: string }[] = [
  { id: "nursery", labelHi: "नर्सरी" },
  { id: "early", labelHi: "15–30 दिन" },
  { id: "flower", labelHi: "फूल-फल" },
  { id: "ripen", labelHi: "पकने पर" },
];

export const KIND_CHIPS: { id: HubKind | "all"; labelHi: string }[] = [
  { id: "all", labelHi: "सभी" },
  { id: "pest", labelHi: "कीट" },
  { id: "disease", labelHi: "रोग" },
  { id: "weed", labelHi: "खरपतवार" },
  { id: "nutrient", labelHi: "कमी" },
  { id: "abiotic", labelHi: "मौसम/लवण" },
];

const CURL_RE = /मुड़|कुकड़|मरोड़|curl|थ्रिप्स|thrips|सफेद मक्खी|whitefly|जासिड|तेला/i;
const SPOT_RE = /धब्ब|झुलसा|ब्लास्ट|रतुआ|blight|blast|rust|spot|टिक्का|anthracnose|चूर्ण|mildew/i;
const WILT_RE = /सूख|गलन|उकठा|wilt|rot|सड़|damping|डैम्पिंग|जल/i;
const HOLE_RE = /छेद|सुंडी|borer|इल्ली|फल मक्खी|fruit.?fly|गोभ|dead heart|white ear/i;
const STUNT_RE = /बौना|रुक|stunt|बढ़वार न|little leaf/i;
const YELLOW_RE = /पील|yellow|chlorosis|हल्दी|hopper burn/i;

export function matchSymptomChips(p: CropProblemItem): HubSymptomChip[] {
  const blob = `${p.nameHi} ${p.nameEn} ${p.tagHi} ${p.whatHi} ${p.specialFactHi ?? ""}`;
  const out: HubSymptomChip[] = [];
  if (CURL_RE.test(blob)) out.push("curl");
  if (SPOT_RE.test(blob)) out.push("spots");
  if (WILT_RE.test(blob)) out.push("wilt");
  if (HOLE_RE.test(blob)) out.push("holes");
  if (STUNT_RE.test(blob)) out.push("stunt");
  if (YELLOW_RE.test(blob)) out.push("yellow");
  return out;
}

export function classifyKind(p: CropProblemItem): { kind: HubKind; subtype?: HubProblem["subtype"] } {
  if (p.isVirus || /वायरस|virus|मोजेक|mosaic|leaf.?curl/i.test(`${p.tagHi} ${p.nameEn} ${p.id}`)) {
    return { kind: "disease", subtype: "viral" };
  }
  if (/खरपतवार|weed/i.test(p.tagHi)) return { kind: "weed" };
  if (/कमी|nutrient|zinc|लोह|नत्रजन/i.test(`${p.tagHi} ${p.nameHi}`)) return { kind: "nutrient" };
  if (/कीट|इल्ली|सुंडी|माइट|थ्रिप्स|मक्खी|तेला|aphid|borer|mite|thrips/i.test(`${p.tagHi} ${p.nameEn} ${p.nameHi}`)) {
    const mite = /माइट|mite|मकड़ी/i.test(`${p.nameHi} ${p.nameEn} ${p.tagHi}`);
    return { kind: "pest", subtype: mite ? "mite" : "insect" };
  }
  if (/जीवाणु|bacterial/i.test(p.tagHi)) return { kind: "disease", subtype: "bacterial" };
  if (/फफूंद|fung|झुलसा|ब्लास्ट|रतुआ|उकठा/i.test(`${p.tagHi} ${p.nameHi}`)) {
    return { kind: "disease", subtype: "fungal" };
  }
  if (/धूप|लवण|जलभराव|abiotic/i.test(`${p.tagHi} ${p.nameHi}`)) return { kind: "abiotic" };
  return { kind: "disease" };
}

export function matchStageChip(p: CropProblemItem): HubStageChip | null {
  const t = `${p.stageHi} ${(p.stages ?? []).join(" ")}`.toLowerCase();
  if (/नर्सरी|nursery|damping|1-15|1–15/.test(t) || /1-30|1–30/.test(p.stageHi) && /नर्सरी/.test(p.stageHi)) {
    if (/नर्सरी|nursery|पौध/.test(t)) return "nursery";
  }
  if (/नर्सरी|nursery|पौध गलन|damping/.test(`${p.stageHi} ${p.nameHi} ${p.id}`)) return "nursery";
  if (/पक|बाली|कटाई|ripen|fruiting|दाना/.test(t)) return "ripen";
  if (/फूल|फल|गाभा|गभोट|flower|fruit/.test(t) || p.stages?.includes("flowering") || p.stages?.includes("fruiting")) {
    return "flower";
  }
  if (/वानस्पतिक|15-30|15–45|vegetative|1-30|रोपाई/.test(t) || p.stages?.includes("vegetative")) {
    return "early";
  }
  return null;
}

export function listCanonicalProblems(): { cropSlug: string; problemId: string }[] {
  return CROP_PROBLEM_CROPS.flatMap((c) => c.problems.map((p) => ({ cropSlug: c.slug, problemId: p.id })));
}

export function assembleHubProblem(cropSlug: string, problemId: string): HubProblem | undefined {
  const hit = getCropProblem(cropSlug, problemId);
  if (!hit) return undefined;
  const { kind, subtype } = classifyKind(hit.problem);
  return {
    crop: hit.crop,
    problem: hit.problem,
    kind,
    subtype,
    symptomChips: matchSymptomChips(hit.problem),
    stageChip: matchStageChip(hit.problem),
    medicines: getCurativeMedicines(hit.crop.slug, hit.problem.id, hit.problem.cureChemicalHi),
    overlay: getHubOverlay(hit.crop.slug, hit.problem.id),
  };
}

export function hubProblemHref(cropSlug: string, problemId: string): string {
  const hit = getCropProblem(cropSlug, problemId);
  if (!hit) return `/crop-problems/${cropSlug}`;
  return `/crop-problems/${hit.crop.slug}/${hit.problem.id}`;
}

/** Split premix / mix names into IRAC/FRAC/HRAC groups. Empty if unknown. */
export function moaGroupsFromTechnical(technical: string): string[] {
  const found = lookupMoA(technical);
  if (!found?.group) return [];
  return found.group.split("+").map((g) => g.trim()).filter(Boolean);
}

export function isLikelyPremix(technical: string): boolean {
  return isPreMixFormulation(technical) || /\d+\s*%\s*\+/.test(technical);
}

export function formulationHint(technical: string): string | null {
  const m = technical.match(/\b(WP|EC|SC|SG|WG|WDG|SL|SP|FS|OD|ZC|DF|GR|WS)\b/i);
  return m ? m[1].toUpperCase() : null;
}

export function groupsOverlap(a: string[], b: string[]): boolean {
  const bs = new Set(b.map((x) => x.toLowerCase()));
  return a.some((x) => bs.has(x.toLowerCase()));
}

export type SwapTone = "green" | "yellow" | "red" | "unknown";

export function checkShopSwap(opts: {
  offeredText: string;
  recommended: CurativeMedicine[];
  lastMoaGroups?: string[];
  problemKind: HubKind;
}): { tone: SwapTone; messageHi: string } {
  const q = opts.offeredText.trim().toLowerCase();
  if (q.length < 3) return { tone: "unknown", messageHi: "दुकान वाली बोतल का टेक्निकल नाम लिखें।" };

  const recGroups = opts.recommended.flatMap((m) => moaGroupsFromTechnical(m.technical));
  const recCats = opts.recommended.map((m) => m.technical.toLowerCase());
  const offeredMoa = lookupMoA(opts.offeredText);
  const offeredGroups = offeredMoa?.group ? offeredMoa.group.split("+").map((g) => g.trim()) : [];

  const sameName = opts.recommended.some(
    (m) =>
      m.technical.toLowerCase().includes(q) ||
      q.includes(m.technical.toLowerCase().slice(0, 10)) ||
      m.brands.some((b) => b.toLowerCase().includes(q) || q.includes(b.toLowerCase().split(" ")[0] ?? ""))
  );

  const kindWord =
    opts.problemKind === "disease"
      ? /insecticide|कीट|imidacloprid|cypermethrin|emamectin|chlorantraniliprole/i
      : opts.problemKind === "pest"
        ? /fungicide|फफूंद|mancozeb|carbendazim|propiconazole|azoxystrobin/i
        : null;

  if (kindWord && kindWord.test(opts.offeredText) && !sameName) {
    return {
      tone: "red",
      messageHi:
        opts.problemKind === "disease"
          ? "सावधान! आप रोग की दवा लेने गए थे — यह कीड़े मारने वाली लगती है। मत लें।"
          : "सावधान! आप कीट की दवा लेने गए थे — यह फफूंद वाली लगती है। मत लें।",
    };
  }

  if (sameName || (offeredGroups.length > 0 && groupsOverlap(offeredGroups, recGroups))) {
    if (opts.lastMoaGroups?.length && groupsOverlap(offeredGroups.length ? offeredGroups : recGroups, opts.lastMoaGroups)) {
      return {
        tone: "yellow",
        messageHi: "यह काम तो कर सकती है, पर पिछली बार आपने यही ग्रुप डाला था — असर कम हो सकता है। नीचे वाली दूसरी दवा लें।",
      };
    }
    return { tone: "green", messageHi: "हाँ, यह उसी काम की दवा है — ले सकते हैं।" };
  }

  if (offeredGroups.length === 0 && recCats.length > 0) {
    return { tone: "unknown", messageHi: "नाम पक्का नहीं मिला। बोतल पर अंग्रेज़ी टेक्निकल नाम देखकर फिर लिखें।" };
  }

  return {
    tone: "red",
    messageHi: "यह ऐप वाली दवा से मेल नहीं खाती। दुकानदार से उसी टेक्निकल नाम की माँगें।",
  };
}

export function findHubProblemByName(cropSlug: string, name: string): HubProblem | undefined {
  const crop = getCropProblemCrop(cropSlug);
  if (!crop) return undefined;
  const n = name.toLowerCase();
  const problem = crop.problems.find((p) => {
    const overlay = getHubOverlay(crop.slug, p.id);
    const aliases = overlay.localAliases ?? [];
    return (
      p.nameHi.toLowerCase().includes(n) ||
      p.nameEn.toLowerCase().includes(n) ||
      p.id.replace(/-/g, " ").includes(n) ||
      aliases.some((a) => a.toLowerCase().includes(n) || n.includes(a.toLowerCase()))
    );
  });
  if (!problem) return undefined;
  return assembleHubProblem(crop.slug, problem.id);
}

export function recentSprayMayScorch(logs: { sprayDate: string; cropId?: string }[], cropSlug: string, withinDays = 4): boolean {
  const cut = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return logs.some((l) => {
    if (l.cropId && l.cropId !== cropSlug) return false;
    const t = Date.parse(l.sprayDate);
    return Number.isFinite(t) && t >= cut;
  });
}

export function rankProblemsForStage<T extends { stageChip: HubStageChip | null }>(
  items: T[],
  stage: HubStageChip | "all"
): { featured: T[]; rest: T[] } {
  if (stage === "all") return { featured: items, rest: [] };
  const featured = items.filter((x) => x.stageChip === stage);
  const rest = items.filter((x) => x.stageChip !== stage);
  return { featured, rest };
}

export function localSearchBlob(p: CropProblemItem, overlay: HubOverlay): string {
  return [p.nameHi, p.nameEn, p.tagHi, p.whatHi, ...(overlay.localAliases ?? [])].join(" ");
}

export { getCropProblemCrop, CROP_PROBLEM_CROPS };
export type { GrowthStage };
