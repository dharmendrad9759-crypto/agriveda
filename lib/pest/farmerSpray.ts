import type { StageSprayRecommendation } from "@/types/crop-protection";

/** Default spray water for 1 acre (farmer language) */
export const WATER_PER_ACRE_HI = "150–200 लीटर पानी / एकड़";
export const WATER_PER_ACRE_EN = "150–200 L water / acre";

export type IpmBucket = "cultural" | "mechanical" | "biological" | "prevention" | "chemical" | "other";

/** Parse remediation lines that were prefixed in data bridge */
export function parseRemediationBuckets(remediation: string[]) {
  const cultural: string[] = [];
  const mechanical: string[] = [];
  const biological: string[] = [];
  const prevention: string[] = [];
  const chemical: string[] = [];

  for (const raw of remediation) {
    const line = raw.trim();
    if (!line) continue;

    if (/^cultural\s*:/i.test(line)) {
      cultural.push(line.replace(/^cultural\s*:/i, "").trim());
    } else if (/^mechanical\s*:/i.test(line)) {
      mechanical.push(line.replace(/^mechanical\s*:/i, "").trim());
    } else if (/^biological\s*:/i.test(line)) {
      biological.push(line.replace(/^biological\s*:/i, "").trim());
    } else if (/^prevention\s*:/i.test(line)) {
      prevention.push(line.replace(/^prevention\s*:/i, "").trim());
    } else if (/^monitoring\s*:/i.test(line)) {
      prevention.push(line.replace(/^monitoring\s*:/i, "").trim());
    } else if (/^chemical\s*:/i.test(line)) {
      chemical.push(line.replace(/^chemical\s*:/i, "").trim());
    } else if (/^rotation\s*:/i.test(line)) {
      /* skip — shown once under chemical tip */
    } else if (/hand weed|trap|remove|plough|hoe|destroy|rogue/i.test(line)) {
      mechanical.push(line);
    } else if (/biological|parasitoid|predator|trichoderma|npv|pheromone/i.test(line)) {
      biological.push(line);
    } else if (/spray|insecticide|fungicide|@\s*\d|ml\/|g\/acre|kg\/|EC|WP|SC/i.test(line)) {
      chemical.push(line);
    } else if (/prevent|scout|field hygien|resistant|rotation|water|drain/i.test(line)) {
      prevention.push(line);
    }
    // else: ignore noisy leftovers — do not invent fake cultural cards
  }

  return { cultural, mechanical, biological, prevention, chemical };
}

export function shortRotationTip(notes?: string, hi = false): string | null {
  if (!notes?.trim()) return null;
  // Farmer tip only — do not dump IRAC codes / long science notes
  const needsRotate = /rotate|never repeat|alternate|group/i.test(notes);
  if (!needsRotate) return null;
  return hi
    ? "अगली स्प्रे: दूसरी ग्रुप की दवा लें — वही दवा बार-बार न डालें।"
    : "Next spray: change medicine group — don't repeat the same one.";
}

/** Prefer early then advanced; drop empty; keep max 2 cards for farmer */
export function pickFarmerStages(stages: StageSprayRecommendation[]): StageSprayRecommendation[] {
  const early =
    stages.find((s) => s.stage === "early") ??
    stages.find((s) => s.stage === "preventive") ??
    stages[0];
  const advanced = stages.find((s) => s.stage === "advanced");

  const out: StageSprayRecommendation[] = [];
  if (early) {
    out.push({
      ...early,
      stage: early.stage === "preventive" ? "early" : early.stage,
      label: early.stage === "advanced" ? early.label : early.label,
    });
  }
  if (advanced && advanced.chemistry !== early?.chemistry) {
    out.push(advanced);
  }
  return out.slice(0, 2);
}

/** Pull first technical name if chemistry is "A + B" */
export function primaryChemistry(chemistry: string): string {
  return chemistry.split("+")[0]?.trim() || chemistry;
}
