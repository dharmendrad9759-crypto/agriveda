/** Supplementary crop page data — stage-wise alerts, tasks, varieties, expert tips */

export interface CropTaskDue {
  id: string;
  task: string;
  due: string;
  priority: "high" | "medium" | "low";
}

export interface CropStageAlert {
  id: string;
  stage: string;
  alert: string;
  level: "high" | "medium" | "low";
}

export interface CropVariety {
  name: string;
  trait: string;
  season: string;
}

export interface CropExpertTip {
  title: string;
  tip: string;
  action?: { label: string; href: string };
}

export const CROP_TASKS_DUE: CropTaskDue[] = [
  { id: "1", task: "Top dressing — Urea 25 kg/acre", due: "Tomorrow", priority: "high" },
  { id: "2", task: "Scout for stem borer", due: "In 3 days", priority: "medium" },
  { id: "3", task: "Weed management — post-emergence", due: "Next week", priority: "low" },
];

export const CROP_STAGE_ALERTS: CropStageAlert[] = [
  { id: "1", stage: "Tillering", alert: "High BPH risk — monitor leaf bases", level: "high" },
  { id: "2", stage: "Panicle initiation", alert: "Ensure adequate N & moisture", level: "medium" },
  { id: "3", stage: "Grain filling", alert: "Avoid water stress for yield", level: "low" },
];

export const CROP_RECOMMENDED_VARIETIES: CropVariety[] = [
  { name: "MTU-1010", trait: "High yield, medium duration", season: "Kharif" },
  { name: "IR-64", trait: "Fine grain, export quality", season: "Kharif / Rabi" },
  { name: "PR-126", trait: "Salt tolerant", season: "Kharif" },
];

export const CROP_EXPERT_TIP: CropExpertTip = {
  title: "Tillering stage tip",
  tip: "Maintain 2–3 cm standing water during tillering. Scout fields every 5 days for stem borer — early detection saves 15–20% yield.",
  action: { label: "Ask AI Doctor", href: "/ai-doctor" },
};

export const CROP_IRRIGATION_SUMMARY = {
  frequency: "Every 5–7 days",
  method: "Flood / alternate wetting",
  nextDue: "In 2 days",
  criticalNote: "Do not let soil crack during panicle initiation.",
};

export const CROP_PEST_RISK = { level: "medium" as const, top: "Stem Borer", pct: 62 };
export const CROP_DISEASE_RISK = { level: "low" as const, top: "Blast", pct: 28 };
