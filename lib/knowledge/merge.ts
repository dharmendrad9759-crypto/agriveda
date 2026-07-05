import type { CropManagementProfile, FAQItem } from "@/types/crop-management";
import { KNOWLEDGE_CHUNKS } from "@/data/knowledge/chunks";
import { getFertilizerForCrop } from "@/data/knowledge/fertilizer-recommendations";

function dedupeLines(existing: string[], additions: string[]): string[] {
  const seen = new Set(existing.map((s) => s.toLowerCase().trim()));
  const out = [...existing];
  for (const line of additions) {
    const key = line.toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out;
}

/** Merge knowledge/ PDF chunks into an existing crop profile (no extra UI). */
export function mergeKnowledgeIntoProfile(profile: CropManagementProfile): CropManagementProfile {
  const cropChunks = KNOWLEDGE_CHUNKS.filter((c) => c.crops.includes(profile.slug));
  if (cropChunks.length === 0) {
    const fertOnly = getFertilizerForCrop(profile.slug);
    if (!fertOnly) return profile;
    return {
      ...profile,
      fertilizerSchedule: dedupeLines(profile.fertilizerSchedule, [
        `NPK (kg/ha): ${fertOnly.n} N + ${fertOnly.p2o5} P₂O₅ + ${fertOnly.k2o} K₂O — ${fertOnly.source}`,
        ...(fertOnly.splits ?? []),
        ...(fertOnly.micronutrients ?? []),
        ...(fertOnly.notes ?? []),
      ]),
    };
  }

  const knowledgeFaqs: FAQItem[] = cropChunks.map((c) => ({
    question: c.title,
    answer: c.text.length > 480 ? `${c.text.slice(0, 477)}…` : c.text,
  }));

  const existingFaqQ = new Set(profile.faqs.map((f) => f.question.toLowerCase()));
  const mergedFaqs = [
    ...profile.faqs,
    ...knowledgeFaqs.filter((f) => !existingFaqQ.has(f.question.toLowerCase())),
  ].slice(0, 14);

  const fertRec = getFertilizerForCrop(profile.slug);
  const fertLines = fertRec
    ? [
        `NPK (kg/ha): ${fertRec.n} N + ${fertRec.p2o5} P₂O₅ + ${fertRec.k2o} K₂O — ${fertRec.source}`,
        ...(fertRec.splits ?? []),
        ...(fertRec.micronutrients ?? []),
        ...(fertRec.notes ?? []),
      ]
    : [];

  const sowingLines = cropChunks
    .filter((c) => c.topics.includes("sowing"))
    .flatMap((c) => c.text.split(/(?<=[.।])\s+/).slice(0, 2));

  const irrigationLines = cropChunks
    .filter((c) => c.topics.includes("irrigation"))
    .flatMap((c) => c.text.split(/(?<=[.।])\s+/).slice(0, 2));

  const harvestLines = cropChunks
    .filter((c) => c.topics.includes("harvest"))
    .flatMap((c) => c.text.split(/(?<=[.।])\s+/).slice(0, 2));

  return {
    ...profile,
    fertilizerSchedule: dedupeLines(profile.fertilizerSchedule, fertLines),
    sowingTime: dedupeLines(profile.sowingTime, sowingLines),
    irrigationSchedule: dedupeLines(profile.irrigationSchedule, irrigationLines),
    harvesting: dedupeLines(profile.harvesting, harvestLines),
    faqs: mergedFaqs,
  };
}

const profileCache = new Map<string, CropManagementProfile>();

export function getEnrichedCropProfile(
  base: CropManagementProfile | null
): CropManagementProfile | null {
  if (!base) return null;
  const cached = profileCache.get(base.slug);
  if (cached) return cached;
  const merged = mergeKnowledgeIntoProfile(base);
  profileCache.set(base.slug, merged);
  return merged;
}
