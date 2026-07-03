export function calculateSeedlingsNeeded(plantsPerAcre: number, areaAcres: number, bufferPercent = 5): number {
  if (plantsPerAcre <= 0 || areaAcres <= 0) {
    return 0;
  }

  const base = plantsPerAcre * areaAcres;
  return Math.ceil(base + (base * bufferPercent) / 100);
}
