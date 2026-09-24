/**
 * Split mixin guide into the 5 fertilizer sub-tabs + farmer-facing text cleanup.
 */

import {
  GLOBAL_MIXING_RULES_HI,
  type CropFertilizerMixinGuide,
  type FertilizerMixinStage,
  type MixinInput,
  type MixinKind,
} from "@/lib/crops/fertilizerMixinFieldGuide";

const META_JARGON =
  /SOURCE\s*DATA|VERIFY\s*BEFORE|OPERATIONAL\s*USE|VALIDATION|लेबल\s*\/?\s*स्थानीय\s*पंजीकरण|लेबल\s*जाँच|label\s*check|registration|PENDING_SOURCE/i;

export function isFarmerSafeText(text: string): boolean {
  return Boolean(text?.trim()) && !META_JARGON.test(text);
}

export function cleanFarmerLines(lines?: string[]): string[] {
  if (!lines?.length) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of lines) {
    const t = raw.trim();
    if (!isFarmerSafeText(t)) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

export function inputLabel(item: MixinInput): string {
  return [item.technical, item.formulation].filter(Boolean).join(" · ");
}

export function flattenOptions(items: MixinInput[]): MixinInput[] {
  const out: MixinInput[] = [];
  for (const item of items) {
    if (item.options?.length) {
      out.push(...flattenOptions(item.options));
    } else {
      out.push(item);
    }
  }
  return out;
}

const ORGANIC_KINDS = new Set<MixinKind>([
  "humic",
  "mycorrhiza",
  "biostimulant",
  "biofertilizer",
  "organic",
]);

export type MixinScheduleProduct = {
  name: string;
  doseHi: string;
  brands?: string[];
  noteHi?: string;
  tagHi?: string;
};

export type MixinScheduleStage = {
  stageNumber: number;
  titleHi: string;
  timingHi: string;
  products: MixinScheduleProduct[];
  howHi?: string;
  tipHi?: string;
};

/** खाद कब दें — soil/basal/seed/pest mix-ins (not foliar, not pure organic-only dumps) */
export function buildMixinScheduleStages(
  guide: CropFertilizerMixinGuide
): MixinScheduleStage[] {
  return guide.stages.map((stage) => {
    const products: MixinScheduleProduct[] = [];

    const push = (
      items: MixinInput[],
      tagHi?: string,
      preferOrganic = false
    ) => {
      for (const item of flattenOptions(items)) {
        // Foliar grades belong in पत्ती स्प्रे tab
        if (item.kind === "foliar") continue;
        if (
          !preferOrganic &&
          ORGANIC_KINDS.has(item.kind) &&
          !stage.fertilizers.length &&
          !stage.pestProtection.length &&
          !stage.seedTreatment.length
        ) {
          // pure organic stage (e.g. only humic) still show on schedule if it's the stage action
        }
        products.push({
          name: inputLabel(item),
          doseHi: item.doseHi,
          brands: item.brands,
          noteHi: item.targetHi || item.purposeHi,
          tagHi,
        });
      }
    };

    push(stage.seedTreatment, "बीज / जड़ उपचार");
    push(stage.fertilizers);
    push(stage.pestProtection, "कीट से बचाव");
    push(stage.diseaseProtection, "रोग से बचाव");
    // Root/bio that partners with basal fertilizer stays on schedule
    push(stage.rootBio);
    push(stage.pgr, "बढ़वार दवा");

    const howParts = [
      stage.placementHi,
      stage.applicationHi,
      stage.moistureHi,
      stage.mixingHi,
    ].filter((x): x is string => Boolean(x && isFarmerSafeText(x)));

    const tip =
      stage.fieldDoctorTipHi && isFarmerSafeText(stage.fieldDoctorTipHi)
        ? stage.fieldDoctorTipHi
        : undefined;

    return {
      stageNumber: stage.stageNumber,
      titleHi: stage.stageNameHi,
      timingHi: [stage.timingHi, stage.activityHi].filter(Boolean).join(" · "),
      products,
      howHi: howParts.length ? howParts.join(" · ") : undefined,
      tipHi: tip,
    };
  }).filter((s) => s.products.length > 0 || s.howHi);
}

export type MixinFoliarCard = {
  stageHi: string;
  timingHi: string;
  name: string;
  doseHi: string;
  waterHi?: string;
  brands?: string[];
  purposeHi?: string;
};

export function buildMixinFoliarCards(
  guide: CropFertilizerMixinGuide
): MixinFoliarCard[] {
  const cards: MixinFoliarCard[] = [];
  for (const stage of guide.stages) {
    const foliarish = [
      ...stage.foliar,
      ...stage.pgr.filter((p) => /ml|लीटर|L\b|ppm|स्प्रे|spray/i.test(p.doseHi + (p.waterHi || ""))),
    ];
    // Also include fertilizer grades that are clearly foliar tank mixes in foliar array only
    for (const item of flattenOptions(stage.foliar.length ? stage.foliar : [])) {
      cards.push({
        stageHi: stage.stageNameHi,
        timingHi: stage.timingHi,
        name: inputLabel(item),
        doseHi: item.doseHi,
        waterHi: item.waterHi,
        brands: item.brands,
        purposeHi: item.purposeHi || item.targetHi,
      });
    }
    // PGR foliar sprays that weren't duplicated
    for (const item of flattenOptions(stage.pgr)) {
      if (!/स्प्रे|spray|लीटर|L\b|ml|ppm/i.test(`${item.doseHi} ${item.waterHi || ""} ${stage.applicationHi || ""}`)) {
        // if stage is mostly foliar stage and pgr has water, include
        if (!item.waterHi && !/ml|मि\.?ली/i.test(item.doseHi)) continue;
      }
      // skip if already listed via foliar
      if (stage.foliar.some((f) => f.technical === item.technical)) continue;
      cards.push({
        stageHi: stage.stageNameHi,
        timingHi: stage.timingHi,
        name: inputLabel(item),
        doseHi: item.doseHi,
        waterHi: item.waterHi,
        brands: item.brands,
        purposeHi: item.purposeHi || item.targetHi,
      });
    }
    void foliarish;
  }
  return cards;
}

export type MixinOrganicCard = {
  stageHi: string;
  timingHi: string;
  name: string;
  doseHi: string;
  brands?: string[];
  purposeHi?: string;
  howHi?: string;
};

export function buildMixinOrganicCards(
  guide: CropFertilizerMixinGuide
): MixinOrganicCard[] {
  const cards: MixinOrganicCard[] = [];
  for (const stage of guide.stages) {
    const items = [
      ...stage.rootBio,
      ...stage.diseaseProtection.filter((d) =>
        ORGANIC_KINDS.has(d.kind) || /trichoderma|rhizobium|psb|fyм|fym|गोबर|नीम/i.test(d.technical)
      ),
      ...stage.seedTreatment.filter((s) =>
        ORGANIC_KINDS.has(s.kind) || /trichoderma|rhizobium|psb/i.test(s.technical)
      ),
      ...stage.fertilizers.filter((f) => ORGANIC_KINDS.has(f.kind) || /neem|नीम|fym|गोबर/i.test(f.technical)),
    ];
    for (const item of flattenOptions(items)) {
      if (
        !ORGANIC_KINDS.has(item.kind) &&
        !/trichoderma|rhizobium|psb|humic|seaweed|mycorrhiza|vam|neem|नीम|fym|गोबर|जैम|jaim|biostimulant|amino/i.test(
          item.technical
        )
      ) {
        continue;
      }
      cards.push({
        stageHi: stage.stageNameHi,
        timingHi: stage.timingHi,
        name: inputLabel(item),
        doseHi: item.doseHi,
        brands: item.brands,
        purposeHi: item.purposeHi || item.targetHi,
        howHi: stage.applicationHi || stage.placementHi,
      });
    }
  }
  // de-dupe by name+dose+stage
  const seen = new Set<string>();
  return cards.filter((c) => {
    const k = `${c.stageHi}|${c.name}|${c.doseHi}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export type MixinNotesBundle = {
  doList: string[];
  dontList: string[];
  warnings: string[];
  tips: string[];
  mixingRules: { titleHi: string; pointsHi: string[] }[];
};

export function buildMixinNotes(guide: CropFertilizerMixinGuide): MixinNotesBundle {
  const doList: string[] = [];
  const dontList: string[] = [];
  const warnings: string[] = [];
  const tips: string[] = [];

  for (const p of cleanFarmerLines(guide.principlesHi)) tips.push(p);
  for (const w of cleanFarmerLines(guide.globalWarningsHi)) warnings.push(w);

  for (const stage of guide.stages) {
    for (const d of cleanFarmerLines(stage.doHi)) doList.push(d);
    for (const d of cleanFarmerLines(stage.dontHi)) dontList.push(d);
    for (const w of cleanFarmerLines(stage.warningsHi)) warnings.push(w);
    if (stage.fieldDoctorTipHi && isFarmerSafeText(stage.fieldDoctorTipHi)) {
      tips.push(`${stage.stageNameHi}: ${stage.fieldDoctorTipHi}`);
    }
    if (stage.mixingStatus === "immediate") {
      warnings.push(
        `${stage.stageNameHi}: मिश्रण बनाकर मत रखो — मिलाकर तुरंत खेत में डालो`
      );
    }
    if (stage.mixingStatus === "do_not_mix") {
      dontList.push(`${stage.stageNameHi}: ये चीजें साथ मत मिलाओ`);
    }
  }

  const mixingRules = GLOBAL_MIXING_RULES_HI.filter(
    (r) => !/PENDING_SOURCE|नियम 4/i.test(r.titleHi + r.pointsHi.join(" "))
  ).map((r) => ({
    titleHi: r.titleHi,
    pointsHi: cleanFarmerLines(r.pointsHi),
  })).filter((r) => r.pointsHi.length);

  const uniq = (arr: string[]) => {
    const s = new Set<string>();
    return arr.filter((x) => {
      const k = x.toLowerCase();
      if (s.has(k)) return false;
      s.add(k);
      return true;
    });
  };

  return {
    doList: uniq(doList),
    dontList: uniq(dontList),
    warnings: uniq(warnings),
    tips: uniq(tips),
    mixingRules,
  };
}

/** Foliar-heavy stages: also pull NPK foliar grades stored in fertilizers when stage is foliar-named */
export function buildMixinFoliarCardsRich(
  guide: CropFertilizerMixinGuide
): MixinFoliarCard[] {
  const base = buildMixinFoliarCards(guide);
  if (base.length) return base;

  // Fallback: stages whose name suggests foliar / flowering sprays
  const cards: MixinFoliarCard[] = [];
  for (const stage of guide.stages) {
    const isFoliarStage =
      /फूल|स्प्रे|foliar|पत्ती|कली|pod|pegging|branch|वृद्धि|harvest|भराव|curd|button/i.test(
        `${stage.stageNameHi} ${stage.activityHi || ""}`
      );
    if (!isFoliarStage) continue;
    const pool = [
      ...stage.foliar,
      ...stage.fertilizers.filter((f) =>
        /19:19:19|0:52:34|0:0:50|13:0:45|boron|बोरॉन|amino|mkp|sop/i.test(
          f.technical + f.doseHi
        )
      ),
      ...stage.pgr,
    ];
    for (const item of flattenOptions(pool)) {
      cards.push({
        stageHi: stage.stageNameHi,
        timingHi: stage.timingHi,
        name: inputLabel(item),
        doseHi: item.doseHi,
        waterHi: item.waterHi,
        brands: item.brands,
        purposeHi: item.purposeHi || item.targetHi,
      });
    }
  }
  return cards;
}

export function stageHasSoilFertilizer(stage: FertilizerMixinStage): boolean {
  return stage.fertilizers.some((f) => f.kind === "fertilizer");
}
