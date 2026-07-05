import type { GrowthStageItem } from "@/data/crop-dashboard";

export function daysAfterSowing(sowingDateISO: string): number {
  const sowing = new Date(`${sowingDateISO}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - sowing.getTime()) / 86400000);
}

function parseDasRange(das: string): { min: number; max: number } | null {
  const lower = das.toLowerCase();
  if (lower.includes("pre")) return { min: Number.NEGATIVE_INFINITY, max: 0 };

  const range = das.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (range) return { min: parseInt(range[1], 10), max: parseInt(range[2], 10) };

  const single = das.match(/(\d+)/);
  if (single) {
    const n = parseInt(single[1], 10);
    return { min: n, max: n };
  }
  return null;
}

function stageContainsDas(
  das: number,
  range: { min: number; max: number },
  index: number,
  total: number
): boolean {
  if (range.min === range.max) return das === range.min;
  if (index === total - 1) return das >= range.min && das <= range.max;
  return das >= range.min && das < range.max;
}

function rangeWidth(range: { min: number; max: number }): number {
  if (!Number.isFinite(range.min) || !Number.isFinite(range.max)) return Number.MAX_SAFE_INTEGER;
  return range.max - range.min;
}

function findCurrentStageIndex(stages: GrowthStageItem[], das: number): number | null {
  const matches: number[] = [];

  for (let i = 0; i < stages.length; i++) {
    const range = parseDasRange(stages[i].das);
    if (!range) continue;
    if (stageContainsDas(das, range, i, stages.length)) matches.push(i);
  }

  if (matches.length > 0) {
    return matches.sort((a, b) => {
      const ra = parseDasRange(stages[a].das)!;
      const rb = parseDasRange(stages[b].das)!;
      const widthDiff = rangeWidth(ra) - rangeWidth(rb);
      if (widthDiff !== 0) return widthDiff;
      return a - b;
    })[0];
  }

  const firstUpcoming = stages.findIndex((stage) => {
    const range = parseDasRange(stage.das);
    return range ? das < range.min : false;
  });

  if (firstUpcoming > 0) return firstUpcoming - 1;
  if (firstUpcoming === 0) return 0;

  return stages.length > 0 ? stages.length - 1 : null;
}

export interface GrowthState {
  stages: GrowthStageItem[];
  currentStageName: string | null;
  currentStageDas: string | null;
  das: number | null;
}

/** Single source of truth for timeline + header stage text. */
export function applySowingToStages(
  stages: GrowthStageItem[],
  sowingDateISO: string | undefined
): GrowthState {
  if (!sowingDateISO) {
    const staticCurrent = stages.find((s) => s.status === "current") ?? null;
    return {
      stages,
      currentStageName: staticCurrent?.name ?? null,
      currentStageDas: staticCurrent?.das ?? null,
      das: null,
    };
  }

  const das = daysAfterSowing(sowingDateISO);
  const currentIndex = findCurrentStageIndex(stages, das);

  const updated = stages.map((stage, index) => {
    if (currentIndex === null) return { ...stage, status: "upcoming" as const };
    if (index < currentIndex) return { ...stage, status: "completed" as const };
    if (index === currentIndex) return { ...stage, status: "current" as const };
    return { ...stage, status: "upcoming" as const };
  });

  const currentStage = currentIndex !== null ? updated[currentIndex] : null;

  return {
    stages: updated,
    currentStageName: currentStage?.name ?? null,
    currentStageDas: currentStage?.das ?? null,
    das,
  };
}

export function getDisplayStageLabel(
  growth: GrowthState,
  fallbackStage: string
): { name: string; das: number | null } {
  const active = growth.stages.find((s) => s.status === "current");
  return {
    name: active?.name ?? growth.currentStageName ?? fallbackStage,
    das: growth.das,
  };
}
