import {
  KCC_SOF_CROPS,
  KCC_SOF_DISCLAIMER_HI,
  type KccSofCrop,
} from "@/data/schemes/kccScaleOfFinance";

export type KccLimitInput = {
  areaAcres: number;
  cropId: string;
};

export type KccLimitBreakdown = {
  crop: KccSofCrop;
  areaHa: number;
  sofBaseInr: number;
  /** 10% of SoF — post-harvest / household (RBI) */
  postHarvestInr: number;
  /** 20% of SoF — farm asset repair / agri services (RBI) */
  maintenanceInr: number;
  /** sof + 10% + 20%; insurance not included (add at bank) */
  estimateInr: number;
  disclaimerHi: string;
  formulaSourceHi: string;
};

const ACRES_PER_HA = 2.471;

export const KCC_FORMULA_SOURCE_HI =
  "सूत्र स्रोत: RBI Kisan Credit Card Master Directions — (i) SoF×क्षेत्र (ii) +10% कटाई/घरेलू (iii) +20% मरम्मत/कृषि सेवाएँ (iv) बीमा अलग। जिले की असली SoF DLTC/SLTC तय करती है।";

export function getKccSofCrop(cropId: string): KccSofCrop {
  return KCC_SOF_CROPS.find((c) => c.id === cropId) ?? KCC_SOF_CROPS[KCC_SOF_CROPS.length - 1]!;
}

/**
 * Illustrative short-term drawing limit per RBI KCC formula components
 * (SoF × area) + 10% + 20%. Does not include insurance premiums.
 */
export function estimateKccLimit(input: KccLimitInput): KccLimitBreakdown | null {
  const areaAcres = Number(input.areaAcres);
  if (!Number.isFinite(areaAcres) || areaAcres <= 0) return null;

  const crop = getKccSofCrop(input.cropId);
  const areaHa = areaAcres / ACRES_PER_HA;
  const sofBaseInr = Math.round(crop.sofPerHaInr * areaHa);
  const postHarvestInr = Math.round(sofBaseInr * 0.1);
  const maintenanceInr = Math.round(sofBaseInr * 0.2);
  const estimateInr = sofBaseInr + postHarvestInr + maintenanceInr;

  return {
    crop,
    areaHa: Math.round(areaHa * 100) / 100,
    sofBaseInr,
    postHarvestInr,
    maintenanceInr,
    estimateInr,
    disclaimerHi: KCC_SOF_DISCLAIMER_HI,
    formulaSourceHi: KCC_FORMULA_SOURCE_HI,
  };
}

export function formatInrHi(n: number): string {
  return `₹${n.toLocaleString("hi-IN")}`;
}
