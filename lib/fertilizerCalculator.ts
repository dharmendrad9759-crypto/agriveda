export function calculateFertilizerForArea(dosePerAcre: number, areaAcres: number): number {
  if (dosePerAcre <= 0 || areaAcres <= 0) {
    return 0;
  }

  return Math.round(dosePerAcre * areaAcres * 100) / 100;
}

export function splitBasalAndTopDress(totalKg: number, basalRatio = 0.4): { basal: number; topDress: number } {
  const basal = Math.round(totalKg * basalRatio * 100) / 100;
  return {
    basal,
    topDress: Math.round((totalKg - basal) * 100) / 100,
  };
}
