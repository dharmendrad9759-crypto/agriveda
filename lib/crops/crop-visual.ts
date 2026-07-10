import { getCropDashboard } from "@/data/crop-dashboard";

const CROP_EMOJI: Record<string, string> = {
  paddy: "🌾",
  rice: "🌾",
  wheat: "🌾",
  maize: "🌽",
  soybean: "🌱",
  chilli: "🌶️",
  "ground-nut": "🥜",
  groundnut: "🥜",
  potato: "🥔",
  tomato: "🍅",
  cotton: "🌿",
  sugarcane: "🎋",
  bajra: "🌾",
  moong: "🫘",
};

export function getCropEmoji(slug: string): string {
  return getCropDashboard(slug)?.emoji ?? CROP_EMOJI[slug] ?? "🌿";
}

export function getCropHealthScore(slug: string): { score: number; label: string; tone: "emerald" | "amber" | "rose" } {
  const dash = getCropDashboard(slug);
  if (!dash) return { score: 72, label: "Good", tone: "emerald" };
  const current = dash.growthStages.find((s) => s.status === "current");
  if (current) return { score: 78, label: "On track", tone: "emerald" };
  return { score: 65, label: "Monitor", tone: "amber" };
}
