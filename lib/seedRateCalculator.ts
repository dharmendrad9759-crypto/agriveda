export interface SeedRateResult {
  perAcre: number;
  total: number;
  unit: string;
}

function parseSeedRate(seedRate: string): { value: number; unit: string } | null {
  const match = seedRate.match(/([\d,]+(?:\.\d+)?)\s*([a-zA-Z/]+)?/);
  if (!match) {
    return null;
  }

  const value = Number(match[1].replace(/,/g, ""));
  if (Number.isNaN(value)) {
    return null;
  }

  return { value, unit: match[2]?.trim() || "units/acre" };
}

export function calculateSeedRequirement(seedRate: string, areaAcres: number): SeedRateResult | null {
  const parsed = parseSeedRate(seedRate);
  if (!parsed) {
    return null;
  }

  return {
    perAcre: parsed.value,
    total: Math.ceil(parsed.value * areaAcres),
    unit: parsed.unit,
  };
}
