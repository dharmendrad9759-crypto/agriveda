/** बाज़ार / दुकान — farmer-facing brand hint under technical names. */

export function shopBrandLine(brands: string[] | undefined, hi: boolean): string {
  const names = (brands ?? []).map((b) => b.trim()).filter(Boolean);
  if (!names.length) return "";
  const joined = names.join(" · ");
  return hi
    ? `बाज़ार / दुकान में इस नाम से मिल सकती है: ${joined}`
    : `Ask in market/shop by this name: ${joined}`;
}

/** Short chip label when space is tight */
export function shopBrandChip(hi: boolean): string {
  return hi ? "बाज़ार नाम" : "Shop name";
}
