/** Farmer-facing dose formatting — acre units, no FRAC/IRAC jargon. */

/** 1 hectare ≈ 2.471 acres → divide per-ha rates by 2.47 for per-acre. */
export function formatDoseHaToAcre(text: string): string {
  if (!text) return text;
  return text
    .replace(
      /(\d+(?:\.\d+)?)\s*(kg|g|L|ml|ली|ग्राम)\s*(?:a\.?i\.?\s*)?\/?\s*ha\b/gi,
      (_m, n: string, u: string) => {
        const acre = Number(n) / 2.47;
        const rounded =
          acre >= 10 ? Math.round(acre) : Math.round(acre * 10) / 10;
        return `${rounded} ${u}/acre`;
      }
    )
    .replace(/\bkg\/ha\b/gi, "kg/acre")
    .replace(/\bg\/ha\b/gi, "g/acre")
    .replace(/\bL\/ha\b/gi, "L/acre")
    .replace(/\bml\/ha\b/gi, "ml/acre")
    .replace(/\bper\s*ha\b/gi, "per acre")
    .replace(/\bhectare(s)?\b/gi, "acre$1")
    .replace(/\bहेक्टेयर\b/g, "एकड़")
    .replace(/\/ha\b/gi, "/acre");
}

/** Drop FRAC / IRAC / HRAC group tags from farmer-facing strings. */
export function stripMoaCodes(text: string): string {
  if (!text) return text;
  return text
    .replace(/\(?\s*(?:FRAC|IRAC|HRAC)\s*(?:Group\s*)?[\w+./\-]+\s*\)?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,·])/g, "$1")
    .trim();
}

export function formatFarmerDose(text: string): string {
  return stripMoaCodes(formatDoseHaToAcre(text));
}
