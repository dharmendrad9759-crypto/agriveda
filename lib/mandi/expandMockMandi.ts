import { MANDI_PRICES } from "@/data/mock/mandi";
import { CROP_CATEGORY, CROP_HI } from "@/lib/mandi/constants";
import { getDistrictsForState } from "@/lib/india-locations";
import type { MandiRow } from "@/lib/mandi/types";

const GRADES = ["FAQ", "Local", "Hybrid", "Grade A"];

const BASE_PRICE: Record<string, number> = {
  Wheat: 2420,
  Mustard: 5450,
  Gram: 5280,
  Paddy: 2180,
  Onion: 1650,
  Potato: 1280,
  Cotton: 7050,
  Maize: 2090,
  Soybean: 4280,
  Chilli: 8120,
};

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

  // District drill-in: three APMC-style markets. State browse: one mandi per district.
  const markets = district
    ? [`${district} मुख्य मंडी`, `${district} अनाज मंडी`, `${district} सब्जी मंडी`]
    : stateDistricts.length > 0
      ? stateDistricts.map((d) => `${d} मुख्य मंडी`)
      : ["स्थानीय मंडी"];

  const allCrops = district
    ? ["Wheat", "Mustard", "Gram", "Paddy", "Onion", "Potato", "Cotton", "Maize"]
    : ["Wheat", "Mustard", "Gram", "Paddy", "Onion"];
  const grainCrops = allCrops.filter((c) =>
    ["Wheat", "Mustard", "Gram", "Paddy", "Maize", "Cotton", "Soybean"].includes(c)
  );
  const vegCrops = allCrops.filter((c) => ["Onion", "Potato", "Tomato", "Chilli"].includes(c));
  const rows: MandiRow[] = [...base];
  let i = 0;

  for (const mandi of markets) {
    const assignedDistrict =
      district ||
      mandi.replace(/\s+(मुख्य मंडी \(APMC\)|मुख्य मंडी|अनाज मंडी|सब्जी मंडी|फल-सब्जी मंडी|Mandi)$/i, "");
    const crops = mandi.includes("सब्जी")
      ? vegCrops.length
        ? vegCrops
        : allCrops
      : mandi.includes("अनाज")
        ? grainCrops.length
          ? grainCrops
          : allCrops
        : allCrops;
    for (const crop of crops) {
      if (rows.some((r) => r.mandi.toLowerCase().includes(mandi.toLowerCase()) && r.crop === crop)) continue;
      const seed = (assignedDistrict.length * 97 + mandi.length * 13 + crop.length * 31 + i) * 137;
      const modal = (BASE_PRICE[crop] ?? 2200) + (seed % 280) - 80;
      const spread = 70 + (seed % 140);
      const grades =
        crop === "Wheat" || crop === "Paddy" || crop === "Mustard"
          ? [GRADES[seed % GRADES.length], GRADES[(seed + 1) % GRADES.length]]
          : [GRADES[seed % GRADES.length]];
      for (const grade of grades) {
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
          modal: modal + (grade === grades[1] ? 40 : 0),
          change: ((seed % 500) - 250) / 100,
          changeAmt: (seed % 120) - 40,
          trend: sparkline(modal),
          category: CROP_CATEGORY[crop] ?? "Others",
          arrivalDate: new Date().toISOString().slice(0, 10),
          arrivals: 60 + (seed % 740),
        });
        i += 1;
      }
      if (rows.length >= 900) break;
    }
    if (rows.length >= 900) break;
  }

  return rows;
}
