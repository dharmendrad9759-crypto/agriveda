import type { SprayLog, SprayProduct, SprayWithProduct } from "@/types/spray-rotation";
import { sprayProducts, getProductById } from "@/data/spray-products";

const SEASON_START_MONTH = 6; // June — Kharif season start (India)

function getMoAGroup(product: SprayProduct): string {
  return `${product.moaType} ${product.moaGroup}`;
}

function getSeasonSprays(logs: SprayLog[]): SprayLog[] {
  const now = new Date();
  const seasonYear = now.getMonth() >= SEASON_START_MONTH - 1 ? now.getFullYear() : now.getFullYear() - 1;
  const seasonStart = new Date(seasonYear, SEASON_START_MONTH - 1, 1);

  return logs
    .filter((l) => new Date(l.sprayDate) >= seasonStart)
    .sort((a, b) => new Date(b.sprayDate).getTime() - new Date(a.sprayDate).getTime());
}

export function attachProducts(logs: SprayLog[]): SprayWithProduct[] {
  return logs
    .map((log) => {
      const product = getProductById(log.productId);
      if (!product) return null;
      return { ...log, product };
    })
    .filter((x): x is SprayWithProduct => x !== null);
}

export function checkResistanceRisk(sprayHistory: SprayLog[]): import("@/types/spray-rotation").ResistanceCheckResult {
  const seasonLogs = getSeasonSprays(sprayHistory);
  const withProducts = attachProducts(seasonLogs);

  if (withProducts.length === 0) {
    return {
      risk: "low",
      title: "No sprays this season",
      message: "Log your first spray to start rotation tracking.",
      repeatedGroups: [],
      consecutiveWarning: false,
      lastThreeGroups: [],
    };
  }

  const lastThree = withProducts.slice(0, 3);
  const lastThreeGroups = lastThree.map((s) => getMoAGroup(s.product));

  const groupCounts = new Map<string, number>();
  for (const g of lastThreeGroups) {
    groupCounts.set(g, (groupCounts.get(g) ?? 0) + 1);
  }

  const repeatedGroups = [...groupCounts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([g]) => g);

  const consecutiveWarning =
    lastThreeGroups.length >= 2 && lastThreeGroups[0] === lastThreeGroups[1];

  let risk: "low" | "medium" | "high" = "low";
  let title = "Low resistance risk";
  let message = "MoA rotation looks good. Continue alternating mode-of-action groups.";

  if (consecutiveWarning || repeatedGroups.length > 0) {
    risk = "high";
    title = "High resistance risk";
    message = consecutiveWarning
      ? `Consecutive sprays used ${lastThreeGroups[0]}. Switch to a different IRAC/FRAC/HRAC group immediately.`
      : `MoA group(s) ${repeatedGroups.join(", ")} used 2+ times in last 3 sprays. Rotate before next application.`;
  } else if (withProducts.length >= 2) {
    const lastTwoSame = lastThreeGroups.length >= 2 && lastThreeGroups[0] === lastThreeGroups[1];
    if (lastTwoSame) {
      risk = "medium";
      title = "Medium resistance risk";
      message = "Consider rotating to a different MoA group for the next spray.";
    }
  }

  return {
    risk,
    title,
    message,
    repeatedGroups,
    consecutiveWarning,
    lastThreeGroups,
  };
}

export function suggestNextMoAGroup(
  cropId: string,
  pestId: string | undefined,
  diseaseId: string | undefined,
  sprayHistory: SprayLog[]
): import("@/types/spray-rotation").MoASuggestion[] {
  const seasonLogs = getSeasonSprays(sprayHistory);
  const withProducts = attachProducts(seasonLogs);

  const usedGroups = new Set(
    withProducts.slice(0, 2).map((s) => getMoAGroup(s.product))
  );

  let candidates = sprayProducts.filter((p) => p.cropRecommended.includes(cropId));

  if (pestId) {
    const pestFiltered = candidates.filter((p) => p.targetPests?.includes(pestId));
    if (pestFiltered.length > 0) candidates = pestFiltered;
  } else if (diseaseId) {
    const disFiltered = candidates.filter((p) => p.targetDiseases?.includes(diseaseId));
    if (disFiltered.length > 0) candidates = disFiltered;
  }

  const rotated = candidates.filter((p) => !usedGroups.has(getMoAGroup(p)));

  const pool = rotated.length > 0 ? rotated : candidates;

  const byGroup = new Map<string, SprayProduct>();
  for (const p of pool) {
    const key = getMoAGroup(p);
    if (!byGroup.has(key)) byGroup.set(key, p);
  }

  return [...byGroup.values()].slice(0, 3).map((product) => ({
    product,
    reason: usedGroups.size > 0
      ? `Different ${product.moaType} group (${product.moaGroup}) — not used in your last 2 sprays`
      : `Recommended for ${cropId} — ${product.activeIngredient}`,
  }));
}

export function searchProducts(query: string, cropSlug?: string): SprayProduct[] {
  const q = query.trim().toLowerCase();
  let list = sprayProducts;
  if (cropSlug) {
    list = list.filter((p) => p.cropRecommended.includes(cropSlug));
  }
  if (!q) return list.slice(0, 20);
  return list
    .filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.activeIngredient.toLowerCase().includes(q) ||
        p.moaGroup.toLowerCase().includes(q)
    )
    .slice(0, 15);
}

export function moaGroupColor(moaType: string, moaGroup: string): string {
  const hash = `${moaType}-${moaGroup}`.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  return colors[hash % colors.length];
}

export { getMoAGroup };
