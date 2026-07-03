export interface SpacingResult {
  rowSpacingCm: number;
  plantSpacingCm: number;
  plantsPerAcre: number;
}

function parseSpacing(spacing: string): { rowSpacingCm: number; plantSpacingCm: number } | null {
  const match = spacing.match(/([\d.]+)\s*[×x]\s*([\d.]+)\s*cm/i);
  if (!match) {
    return null;
  }

  const rowSpacingCm = Number(match[1]);
  const plantSpacingCm = Number(match[2]);
  if (Number.isNaN(rowSpacingCm) || Number.isNaN(plantSpacingCm) || rowSpacingCm <= 0 || plantSpacingCm <= 0) {
    return null;
  }

  return { rowSpacingCm, plantSpacingCm };
}

export function calculatePlantPopulation(spacing: string, areaAcres = 1): SpacingResult | null {
  const parsed = parseSpacing(spacing);
  if (!parsed) {
    return null;
  }

  const sqCmPerAcre = 40468564.224;
  const plantsPerAcre = Math.floor(sqCmPerAcre / (parsed.rowSpacingCm * parsed.plantSpacingCm));

  return {
    ...parsed,
    plantsPerAcre: Math.floor(plantsPerAcre * areaAcres),
  };
}
