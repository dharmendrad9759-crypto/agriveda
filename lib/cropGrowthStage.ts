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

export function applySowingToStages(
  stages: GrowthStageItem[],
  sowingDateISO: string | undefined
): { stages: GrowthStageItem[]; currentStageName: string | null; das: number | null } {
  if (!sowingDateISO) {
    return { stages, currentStageName: null, das: null };
  }

  const das = daysAfterSowing(sowingDateISO);
  let currentStageName: string | null = null;

  const updated = stages.map((stage) => {
    const range = parseDasRange(stage.das);
    if (!range) return stage;

    if (das < range.min) return { ...stage, status: "upcoming" as const };
    if (das > range.max) return { ...stage, status: "completed" as const };

    currentStageName = stage.name;
    return { ...stage, status: "current" as const };
  });

  if (!currentStageName) {
    const allCompleted = updated.every((s) => s.status === "completed");
    const allUpcoming = updated.every((s) => s.status === "upcoming");

    if (allCompleted && updated.length > 0) {
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = { ...last, status: "current" };
      currentStageName = last.name;
    } else if (allUpcoming && updated.length > 0) {
      const first = updated[0];
      updated[0] = { ...first, status: "current" };
      currentStageName = first.name;
    }
  }

  return { stages: updated, currentStageName, das };
}
