import { MANDI_PRICES } from "@/data/mock/mandi";
import { CROP_CATEGORY, CROP_HI } from "@/lib/mandi/constants";
import { EXTRA_CROP_OPTIONS } from "@/lib/mandi/marketAnalytics";
import { getDistrictsForState } from "@/lib/india-locations";
import type { MandiRow } from "@/lib/mandi/types";

const GRADES = ["FAQ", "Local", "Hybrid", "Grade A"];

function sparkline(modal: number): number[] {
  const base = modal * 0.97;
  return Array.from({ length: 7 }, (_, i) => Math.round(base + ((modal - base) * i) / 6));
}

/** Rich demo dataset aligned strictly with real districts of the selected state */
export function expandMockMandi(state: string, district?: string): MandiRow[] {
  const base = MANDI_PRICES
    .filter((r) => !r.state || r.state.toLowerCase() === state.toLowerCase())
    .map((r) => ({ ...r, state, district: district || r.district || r.mandi }));

  const stateDistricts = getDistrictsForState(state);
  
  // If specific district is requested, generate standard APMC mandis for that district
  const markets = district
    ? [
        `${district} मुख्य मंडी (APMC)`,
        `${district} अनाज मंडी`,
        `${district} फल-सब्जी मंडी`,
      ]
    : stateDistricts.length > 0
      ? stateDistricts.slice(0, 35)
      : ["स्थानीय मंडी"];

  const crops = EXTRA_CROP_OPTIONS.slice(0, 18);
  const rows: MandiRow[] = [...base];
  let i = 0;

  for (const mandi of markets) {
    const assignedDistrict = district || mandi.replace(/\s+(मुख्य मंडी \(APMC\)|अनाज मंडी|फल-सब्जी मंडी|Mandi)$/i, "");
    for (const crop of crops) {
      if (rows.some((r) => r.mandi.toLowerCase().includes(mandi.toLowerCase()) && r.crop === crop)) continue;
      const seed = (mandi.length + crop.length + i) * 137;
      const modal = 1200 + (seed % 6200);
      const spread = 80 + (seed % 200);
      const grade = GRADES[seed % GRADES.length];
      rows.push({
        id: `mock-${state}-${mandi.replace(/\s+/g, "_")}-${crop}-${grade}-${i}`,
        crop,
        cropHi: CROP_HI[crop] ?? crop,
        variety: grade,
        mandi: mandi.includes("मंडी") || mandi.includes("Mandi") ? mandi : `${mandi} Mandi`,
        state,
        district: assignedDistrict,
        min: modal - spread,
        max: modal + spread,
        modal,
        change: ((seed % 500) - 250) / 100,
        changeAmt: (seed % 120) - 40,
        trend: sparkline(modal),
        category: CROP_CATEGORY[crop] ?? "Others",
        arrivalDate: new Date().toISOString().slice(0, 10),
      });
      i += 1;
      if (rows.length >= 350) break;
    }
    if (rows.length >= 350) break;
  }

  return rows;
}
