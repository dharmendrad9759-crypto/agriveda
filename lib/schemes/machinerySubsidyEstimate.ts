import {
  MACHINERY_SUBSIDY_BANDS,
  MACHINERY_SUBSIDY_DISCLAIMER_HI,
  type MachineryFarmerCategory,
  type MachineryKind,
  type SubsidyBand,
} from "@/data/schemes/machinerySubsidyBands";

export type MachinerySubsidyInput = {
  kind: MachineryKind;
  category: MachineryFarmerCategory;
  priceInr?: number;
};

export type MachinerySubsidyResult = {
  band: SubsidyBand;
  kind: MachineryKind;
  category: MachineryFarmerCategory;
  midPct: number;
  /** low end: min(% of price, low ceiling) when price set */
  estimateMinInr: number | null;
  estimateMaxInr: number | null;
  isHireOnly: boolean;
  disclaimerHi: string;
};

function capped(price: number, pct: number, ceiling: number | undefined): number {
  const fromPct = Math.round((price * pct) / 100);
  if (ceiling == null) return fromPct;
  return Math.min(fromPct, ceiling);
}

export function estimateMachinerySubsidy(
  input: MachinerySubsidyInput
): MachinerySubsidyResult {
  const band = MACHINERY_SUBSIDY_BANDS[input.kind][input.category];
  const midPct = Math.round((band.minPct + band.maxPct) / 2);
  const isHireOnly = input.kind === "chc_hire" || (band.minPct === 0 && band.maxPct === 0);

  const price = Number(input.priceInr);
  const hasPrice = Number.isFinite(price) && price > 0 && !isHireOnly;

  let estimateMinInr: number | null = null;
  let estimateMaxInr: number | null = null;

  if (hasPrice) {
    estimateMinInr = capped(price, band.minPct, band.ceilingMinInr);
    estimateMaxInr = capped(price, band.maxPct, band.ceilingMaxInr ?? band.ceilingMinInr);
    if (estimateMinInr > estimateMaxInr) {
      const t = estimateMinInr;
      estimateMinInr = estimateMaxInr;
      estimateMaxInr = t;
    }
  } else if (!isHireOnly && band.ceilingMinInr != null && band.ceilingMaxInr != null) {
    // No price: show ceiling band farmers often hear (esp. tractor ₹1.5–3L)
    estimateMinInr = band.ceilingMinInr;
    estimateMaxInr = band.ceilingMaxInr;
  }

  return {
    band,
    kind: input.kind,
    category: input.category,
    midPct,
    estimateMinInr,
    estimateMaxInr,
    isHireOnly,
    disclaimerHi: MACHINERY_SUBSIDY_DISCLAIMER_HI,
  };
}

export function formatInrShort(n: number): string {
  return `₹${n.toLocaleString("hi-IN")}`;
}
