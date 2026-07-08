import type { TimedApplication, TimedIrrigation, TimingRef } from "@/types/crop-detail";

export type Establishment = "transplant" | "direct-sown";

export interface CropTimingPack {
  establishment: Establishment;
  fertilizers: TimedApplication[];
  irrigations: TimedIrrigation[];
}

const TRANSPLANT_SLUGS = new Set([
  "tomato",
  "paddy",
  "chilli",
  "cauliflower",
  "brinjal",
  "cucumber",
  "onion",
  "potato",
]);

export function getEstablishment(slug: string): Establishment {
  return TRANSPLANT_SLUGS.has(slug) ? "transplant" : "direct-sown";
}

function ref(slug: string): TimingRef {
  return TRANSPLANT_SLUGS.has(slug) ? "DAT" : "DAS";
}

/** Per-crop DAS/DAT timing for fertilizer & irrigation */
export const CROP_TIMING: Record<string, CropTimingPack> = {
  tomato: {
    establishment: "transplant",
    fertilizers: [
      { label: "Basal — FYM + DAP + MOP", dose: "FYM 4-5 t/acre + DAP 50 kg + MOP 25 kg", timing: "0 DAT (transplanting day)", timingRef: "DAT", notes: "Mix in ridges before transplant" },
      { label: "First top-dress N", dose: "Urea 25 kg/acre", timing: "15-20 DAT", timingRef: "DAT" },
      { label: "Vegetative fertigation", dose: "19:19:19 @ 1 kg/acre", timing: "25-40 DAT (weekly)", timingRef: "DAT" },
      { label: "Flowering boost", dose: "MKP 2 kg/acre + Boron 250 g", timing: "45-50 DAT", timingRef: "DAT" },
      { label: "Fruit set foliar", dose: "Calcium nitrate + micronutrient", timing: "55-70 DAT (every 15 days)", timingRef: "DAT" },
      { label: "Micronutrients", dose: "ZnSO₄ 2-3 kg/acre (soil) or foliar", timing: "30 DAT", timingRef: "DAT" },
    ],
    irrigations: [
      { label: "Establishment", amount: "Light irrigation", timing: "0 DAT (immediately after transplant)", timingRef: "DAT" },
      { label: "Vegetative", amount: "Every 3-4 days", timing: "1-40 DAT", timingRef: "DAT", notes: "Avoid waterlogging" },
      { label: "Flowering & fruiting", amount: "Every 2-3 days", timing: "40-75 DAT", timingRef: "DAT", notes: "Critical stage — do not stress" },
      { label: "Ripening", amount: "Reduce frequency", timing: "75+ DAT", timingRef: "DAT" },
    ],
  },
  paddy: {
    establishment: "transplant",
    fertilizers: [
      { label: "Basal dose", dose: "N 60 + P₂O₅ 30 + K₂O 30 kg/ha", timing: "0 DAT (at transplanting)", timingRef: "DAT" },
      { label: "First nitrogen split", dose: "Urea 30 kg N/ha", timing: "20-25 DAT (active tillering)", timingRef: "DAT" },
      { label: "Second nitrogen split", dose: "Urea 30 kg N/ha", timing: "45-50 DAT (panicle initiation)", timingRef: "DAT" },
      { label: "Zinc (if deficient)", dose: "ZnSO₄ 25 kg/ha", timing: "0-7 DAT (basal)", timingRef: "DAT" },
      { label: "Panicle stage foliar", dose: "NPK foliar + Boron spray", timing: "50-55 DAT", timingRef: "DAT" },
    ],
    irrigations: [
      { label: "Puddling & transplant", amount: "2-5 cm standing water", timing: "0 DAT", timingRef: "DAT" },
      { label: "Tillering", amount: "Maintain 5 cm water", timing: "7-45 DAT", timingRef: "DAT" },
      { label: "Panicle initiation", amount: "Shallow flooding", timing: "45-60 DAT", timingRef: "DAT", notes: "Most critical stage" },
      { label: "Grain filling", amount: "Alternate wetting", timing: "60-100 DAT", timingRef: "DAT" },
      { label: "Pre-harvest", amount: "Drain field", timing: "10-15 days before harvest", timingRef: "DAT" },
    ],
  },
  wheat: {
    establishment: "direct-sown",
    fertilizers: [
      { label: "Basal dose", dose: "DAP 50 kg + MOP 25 kg/acre + FYM", timing: "0 DAS (at sowing)", timingRef: "DAS" },
      { label: "First nitrogen", dose: "Urea 25 kg/acre", timing: "21 DAS (CRI stage)", timingRef: "DAS", notes: "Critical — never miss" },
      { label: "Second nitrogen", dose: "Urea 25 kg/acre", timing: "45-50 DAS (tillering)", timingRef: "DAS" },
      { label: "Third nitrogen (if needed)", dose: "Urea 15-20 kg/acre", timing: "65-70 DAS (boot leaf)", timingRef: "DAS" },
    ],
    irrigations: [
      { label: "Crown root initiation", amount: "First irrigation", timing: "20-25 DAS", timingRef: "DAS", notes: "Most critical irrigation" },
      { label: "Tillering", amount: "Light irrigation", timing: "40-45 DAS", timingRef: "DAS" },
      { label: "Flowering", amount: "Moderate irrigation", timing: "60-65 DAS", timingRef: "DAS" },
      { label: "Grain filling", amount: "Last irrigation", timing: "80-85 DAS", timingRef: "DAS" },
    ],
  },
  maize: {
    establishment: "direct-sown",
    fertilizers: [
      { label: "Basal dose", dose: "DAP 50 kg + MOP 25 kg/acre", timing: "0 DAS (at sowing)", timingRef: "DAS" },
      { label: "First top-dress", dose: "Urea 30 kg/acre", timing: "25-30 DAS (knee-high)", timingRef: "DAS" },
      { label: "Second top-dress", dose: "Urea 20 kg/acre", timing: "45-50 DAS (tasseling)", timingRef: "DAS" },
      { label: "Micronutrients", dose: "ZnSO₄ foliar 0.5%", timing: "30 DAS", timingRef: "DAS" },
    ],
    irrigations: [
      { label: "Germination", amount: "Light irrigation", timing: "0-7 DAS", timingRef: "DAS" },
      { label: "Vegetative", amount: "Every 7-10 days", timing: "15-45 DAS", timingRef: "DAS" },
      { label: "Tasseling & silking", amount: "Every 5-7 days", timing: "45-65 DAS", timingRef: "DAS", notes: "Critical — moisture stress reduces yield" },
    ],
  },
  bajra: {
    establishment: "direct-sown",
    fertilizers: [
      { label: "Basal dose", dose: "DAP 40 kg + MOP 20 kg/acre", timing: "0 DAS", timingRef: "DAS" },
      { label: "Top-dress N", dose: "Urea 20 kg/acre", timing: "25-30 DAS", timingRef: "DAS" },
    ],
    irrigations: [
      { label: "Germination", amount: "Light irrigation", timing: "0-10 DAS", timingRef: "DAS" },
      { label: "Vegetative", amount: "Every 10-12 days", timing: "15-45 DAS", timingRef: "DAS" },
      { label: "Flowering", amount: "Critical irrigation", timing: "45-55 DAS", timingRef: "DAS" },
    ],
  },
  soybean: {
    establishment: "direct-sown",
    fertilizers: [
      { label: "Basal + Rhizobium", dose: "DAP 40 kg/acre + seed inoculation", timing: "0 DAS", timingRef: "DAS" },
      { label: "Top-dress", dose: "MOP 15 kg/acre", timing: "30-35 DAS (flowering)", timingRef: "DAS" },
    ],
    irrigations: [
      { label: "Germination", amount: "Light if dry", timing: "0-10 DAS", timingRef: "DAS" },
      { label: "Flowering & pod fill", amount: "One irrigation if rain fails", timing: "35-55 DAS", timingRef: "DAS", notes: "Most critical" },
    ],
  },
  chilli: {
    establishment: "transplant",
    fertilizers: [
      { label: "Basal", dose: "FYM + DAP 50 kg + MOP 25 kg/acre", timing: "0 DAT", timingRef: "DAT" },
      { label: "Vegetative N", dose: "Urea 20 kg/acre", timing: "20-25 DAT", timingRef: "DAT" },
      { label: "Flowering", dose: "MKP + micronutrient foliar", timing: "40-45 DAT", timingRef: "DAT" },
    ],
    irrigations: [
      { label: "Establishment", amount: "Light irrigation", timing: "0 DAT", timingRef: "DAT" },
      { label: "Vegetative", amount: "Every 4-5 days", timing: "1-40 DAT", timingRef: "DAT" },
      { label: "Fruiting", amount: "Every 3-4 days", timing: "40-90 DAT", timingRef: "DAT" },
    ],
  },
  brinjal: {
    establishment: "transplant",
    fertilizers: [
      { label: "Basal", dose: "FYM + DAP + MOP", timing: "0 DAT", timingRef: "DAT" },
      { label: "Top-dress N", dose: "Urea 25 kg/acre", timing: "25 DAT", timingRef: "DAT" },
      { label: "Fruiting", dose: "K + micronutrient foliar", timing: "45-50 DAT", timingRef: "DAT" },
    ],
    irrigations: [
      { label: "Establishment", amount: "Light irrigation", timing: "0 DAT", timingRef: "DAT" },
      { label: "Regular", amount: "Every 3-4 days", timing: "1-80 DAT", timingRef: "DAT" },
    ],
  },
  cauliflower: {
    establishment: "transplant",
    fertilizers: [
      { label: "Basal", dose: "FYM + DAP 60 kg + MOP 30 kg", timing: "0 DAT", timingRef: "DAT" },
      { label: "Curd formation", dose: "N top-dress + Boron foliar", timing: "40-45 DAT", timingRef: "DAT" },
    ],
    irrigations: [
      { label: "Establishment", amount: "Light irrigation", timing: "0 DAT", timingRef: "DAT" },
      { label: "Curd stage", amount: "Every 3 days", timing: "35-60 DAT", timingRef: "DAT", notes: "Never let dry" },
    ],
  },
  cucumber: {
    establishment: "transplant",
    fertilizers: [
      { label: "Basal", dose: "FYM + DAP + MOP", timing: "0 DAT", timingRef: "DAT" },
      { label: "Vegetative", dose: "19:19:19 fertigation", timing: "15-30 DAT", timingRef: "DAT" },
    ],
    irrigations: [
      { label: "Daily light", amount: "Drip / frequent", timing: "0-50 DAT", timingRef: "DAT" },
    ],
  },
  moongfali: {
    establishment: "direct-sown",
    fertilizers: [
      { label: "Basal + Gypsum", dose: "DAP 40 kg + Gypsum 100 kg/acre", timing: "0 DAS", timingRef: "DAS" },
      { label: "Pegging stage Ca", dose: "Gypsum 100 kg/acre", timing: "30-35 DAS", timingRef: "DAS", notes: "Critical for pod fill" },
    ],
    irrigations: [
      { label: "If rain fails", amount: "Light irrigation", timing: "25-35 DAS (pegging)", timingRef: "DAS" },
    ],
  },
  sugarcane: {
    establishment: "direct-sown",
    fertilizers: [
      { label: "Basal", dose: "DAP 50 kg + MOP 25 kg/acre", timing: "0 DAS (planting)", timingRef: "DAS" },
      { label: "Tillering N", dose: "Urea 50 kg/acre", timing: "45 DAS", timingRef: "DAS" },
      { label: "Grand growth N", dose: "Urea 50 kg/acre", timing: "90 DAS", timingRef: "DAS" },
    ],
    irrigations: [
      { label: "Germination", amount: "Light irrigation", timing: "0-20 DAS", timingRef: "DAS" },
      { label: "Grand growth", amount: "Heavy irrigation", timing: "60-180 DAS", timingRef: "DAS" },
    ],
  },
  potato: {
    establishment: "transplant",
    fertilizers: [
      { label: "Basal dose", dose: "DAP 80 kg + MOP 40 kg/acre + FYM", timing: "0 DAT (planting day)", timingRef: "DAT" },
      { label: "Earthing-up N", dose: "Urea 25 kg/acre", timing: "25-30 DAT", timingRef: "DAT" },
      { label: "Tuber initiation", dose: "MOP top-dress 15 kg/acre", timing: "35-40 DAT", timingRef: "DAT" },
    ],
    irrigations: [
      { label: "Planting", amount: "Light irrigation", timing: "0 DAT", timingRef: "DAT" },
      { label: "Vegetative", amount: "Every 5-7 days", timing: "10-40 DAT", timingRef: "DAT" },
      { label: "Tuber bulking", amount: "Every 7 days", timing: "40-70 DAT", timingRef: "DAT" },
      { label: "Pre-harvest", amount: "Stop irrigation", timing: "10 days before digging", timingRef: "DAT" },
    ],
  },
};

/** Fallback timing generated from crop strings */
export function buildFallbackTiming(
  slug: string,
  basalDose: string[],
  stageWise: { stage: string; details: string[] }[],
  irrigationSchedule: string[]
): CropTimingPack {
  const timingRef = ref(slug);
  const baseLabel = timingRef === "DAT" ? "DAT" : "DAS";

  const fertilizers: TimedApplication[] = basalDose.map((d, i) => ({
    label: i === 0 ? "Basal dose" : `Basal supplement ${i + 1}`,
    dose: d,
    timing: `0 ${baseLabel}`,
    timingRef,
    notes: timingRef === "DAT" ? "At transplanting / planting" : "At sowing",
  }));

  stageWise.forEach((s, i) => {
    s.details.forEach((d, j) => {
      fertilizers.push({
        label: s.stage,
        dose: d,
        timing: `${(i + 1) * 20}-${(i + 1) * 20 + 10} ${baseLabel}`,
        timingRef,
        notes: `Stage: ${s.stage}`,
      });
    });
  });

  const irrigations: TimedIrrigation[] = irrigationSchedule.map((s, i) => ({
    label: `Schedule ${i + 1}`,
    amount: s,
    timing: i === 0 ? `0-15 ${baseLabel}` : `${(i + 1) * 20}-${(i + 2) * 20} ${baseLabel}`,
    timingRef,
  }));

  return {
    establishment: getEstablishment(slug),
    fertilizers,
    irrigations,
  };
}
