import type { SprayLog, SprayProduct, SprayWithProduct } from "@/types/spray-rotation";
import { sprayProducts, getProductById } from "@/data/spray-products";

const SEASON_START_MONTH = 6; // June — Kharif season start (India)

function getMoAGroup(product: SprayProduct | null | undefined): string {
  if (!product) return "N/A";
  const type = product.moaType ?? "";
  const group = product.moaGroup ?? "";
  return `${type} ${group}`.trim() || "N/A";
}

function getSeasonSprays(logs: SprayLog[]): SprayLog[] {
  if (!Array.isArray(logs) || logs.length === 0) return [];
  const now = new Date();
  const seasonYear = now.getMonth() >= SEASON_START_MONTH - 1 ? now.getFullYear() : now.getFullYear() - 1;
  const seasonStart = new Date(seasonYear, SEASON_START_MONTH - 1, 1);

  return logs
    .filter((l) => {
      if (!l || !l.sprayDate) return false;
      const d = new Date(l.sprayDate);
      return !isNaN(d.getTime()) && d >= seasonStart;
    })
    .sort((a, b) => {
      const tA = a.sprayDate ? new Date(a.sprayDate).getTime() : 0;
      const tB = b.sprayDate ? new Date(b.sprayDate).getTime() : 0;
      return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
    });
}

export function attachProducts(logs: SprayLog[]): SprayWithProduct[] {
  if (!Array.isArray(logs) || logs.length === 0) return [];
  return logs
    .filter((log): log is SprayLog => Boolean(log && log.productId))
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
      title: "इस सीजन अभी कोई छिड़काव दर्ज नहीं है",
      message: "नीचे बटन दबाकर अपनी पहली स्प्रे दर्ज करें ताकि रोटेशन रिकॉर्ड शुरू हो सके।",
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
  let title = "सुरक्षित चक्र (दवा असर करेगी ✓)";
  let message = "दवाएँ सही क्रम में बदलकर डाली जा रही हैं। कीट/रोग में दवा के प्रति प्रतिरोध (रेसिस्टेंस) नहीं बनेगा।";

  if (consecutiveWarning || repeatedGroups.length > 0) {
    risk = "high";
    title = "चेतावनी: दवा बेअसर होने का भारी खतरा ⚠️";
    message = consecutiveWarning
      ? `लगातार एक ही ग्रुप (${lastThreeGroups[0]}) की दवा छिड़की गई है। तुरंत अगली स्प्रे में दूसरी श्रेणी की दवा बदलें!`
      : `पिछली 3 स्प्रे में ग्रुप ${repeatedGroups.join(", ")} को 2 या अधिक बार दोहराया गया है। अगली बार बदलें।`;
  } else if (withProducts.length >= 2) {
    const lastTwoSame = lastThreeGroups.length >= 2 && lastThreeGroups[0] === lastThreeGroups[1];
    if (lastTwoSame) {
      risk = "medium";
      title = "सावधानी: अगली बार अलग दवा डालें";
      message = "कीटों को दवा की आदत पड़ने से रोकने के लिए अगली बार अलग ग्रुप की दवा का चुनाव करें।";
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

  const isNematicide = (p: SprayProduct) =>
    /velum|fluopyram|nematicide|सूत्रकृमि|नेमाटोड/i.test(p.productName + " " + p.activeIngredient);

  if (pestId) {
    const exactPest = candidates.filter((p) => p.targetPests?.includes(pestId));
    if (exactPest.length > 0) {
      candidates = exactPest;
    } else {
      const pestFiltered = candidates.filter((p) => p.category === "insecticide" && !isNematicide(p));
      if (pestFiltered.length > 0) candidates = pestFiltered;
    }
  } else if (diseaseId) {
    const exactDisease = candidates.filter((p) => p.targetDiseases?.includes(diseaseId) && !isNematicide(p));
    if (exactDisease.length > 0) {
      candidates = exactDisease;
    } else {
      const disFiltered = candidates.filter((p) => p.category === "fungicide" && !isNematicide(p));
      if (disFiltered.length > 0) candidates = disFiltered;
    }
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
      ? `अलग समूह (${product.moaType} ${product.moaGroup}) — पिछली स्प्रे से अलग है, इसलिए पूरा असर मिलेगा ✓`
      : `असरदार व सुरक्षित चक्र रोटेशन हेतु अनुशंसित`,
  }));
}

export function searchProducts(query: string, cropSlug?: string): SprayProduct[] {
  const q = query.trim().toLowerCase();
  let list = sprayProducts;
  if (cropSlug) {
    const slug = cropSlug === "groundnut" ? "moongfali" : cropSlug;
    list = list.filter((p) => p.cropRecommended.includes(slug) || p.cropRecommended.includes(cropSlug));
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
