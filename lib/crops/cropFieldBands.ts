/** Indicative soil pH and per-acre ₹ bands for farmer overview (not a guarantee). */
export type CropFieldBand = {
  phMin: number;
  phMax: number;
  costMin: number;
  costMax: number;
  profitMin: number;
  profitMax: number;
};

/**
 * Soil pH: ICAR crop PoP typical ranges.
 * Cost / net: rounded farmer bands (seed+fert+labour+spray, variable cost) —
 * mandi, season and irrigation change the real number.
 */
const BANDS: Record<string, CropFieldBand> = {
  paddy: { phMin: 5.5, phMax: 7.5, costMin: 18000, costMax: 32000, profitMin: 8000, profitMax: 25000 },
  wheat: { phMin: 6.0, phMax: 7.5, costMin: 15000, costMax: 28000, profitMin: 10000, profitMax: 22000 },
  maize: { phMin: 5.5, phMax: 7.5, costMin: 12000, costMax: 22000, profitMin: 8000, profitMax: 20000 },
  bajra: { phMin: 6.0, phMax: 8.0, costMin: 8000, costMax: 15000, profitMin: 5000, profitMax: 14000 },
  soybean: { phMin: 6.0, phMax: 7.5, costMin: 12000, costMax: 20000, profitMin: 8000, profitMax: 22000 },
  moongfali: { phMin: 6.0, phMax: 7.5, costMin: 18000, costMax: 30000, profitMin: 10000, profitMax: 28000 },
  mustard: { phMin: 6.0, phMax: 7.5, costMin: 10000, costMax: 18000, profitMin: 12000, profitMax: 25000 },
  pulses: { phMin: 6.5, phMax: 7.5, costMin: 12000, costMax: 20000, profitMin: 10000, profitMax: 25000 },
  moong: { phMin: 6.2, phMax: 7.2, costMin: 8000, costMax: 14000, profitMin: 6000, profitMax: 16000 },
  chana: { phMin: 6.0, phMax: 8.0, costMin: 10000, costMax: 18000, profitMin: 10000, profitMax: 22000 },
  masoor: { phMin: 6.0, phMax: 7.5, costMin: 8000, costMax: 14000, profitMin: 8000, profitMax: 18000 },
  urad: { phMin: 6.0, phMax: 7.5, costMin: 8000, costMax: 15000, profitMin: 6000, profitMax: 16000 },
  potato: { phMin: 5.0, phMax: 6.5, costMin: 35000, costMax: 60000, profitMin: 15000, profitMax: 50000 },
  tomato: { phMin: 6.0, phMax: 7.0, costMin: 40000, costMax: 80000, profitMin: 20000, profitMax: 120000 },
  onion: { phMin: 6.0, phMax: 7.0, costMin: 30000, costMax: 55000, profitMin: 15000, profitMax: 70000 },
  chilli: { phMin: 6.0, phMax: 7.0, costMin: 40000, costMax: 80000, profitMin: 20000, profitMax: 100000 },
  cauliflower: { phMin: 5.5, phMax: 6.8, costMin: 25000, costMax: 45000, profitMin: 15000, profitMax: 50000 },
  cucumber: { phMin: 6.0, phMax: 7.0, costMin: 20000, costMax: 40000, profitMin: 10000, profitMax: 45000 },
  brinjal: { phMin: 5.5, phMax: 6.8, costMin: 25000, costMax: 50000, profitMin: 15000, profitMax: 60000 },
  bhindi: { phMin: 6.0, phMax: 6.8, costMin: 18000, costMax: 35000, profitMin: 10000, profitMax: 40000 },
  cotton: { phMin: 6.0, phMax: 8.0, costMin: 20000, costMax: 40000, profitMin: 10000, profitMax: 35000 },
  sugarcane: { phMin: 6.0, phMax: 7.5, costMin: 40000, costMax: 70000, profitMin: 25000, profitMax: 80000 },
  ginger: { phMin: 5.5, phMax: 6.5, costMin: 80000, costMax: 150000, profitMin: 40000, profitMax: 200000 },
  garlic: { phMin: 6.0, phMax: 7.0, costMin: 40000, costMax: 80000, profitMin: 25000, profitMax: 120000 },
  mango: { phMin: 5.5, phMax: 7.5, costMin: 15000, costMax: 30000, profitMin: 40000, profitMax: 150000 },
  banana: { phMin: 6.0, phMax: 7.5, costMin: 50000, costMax: 90000, profitMin: 40000, profitMax: 120000 },
  grapes: { phMin: 6.5, phMax: 7.5, costMin: 80000, costMax: 150000, profitMin: 50000, profitMax: 250000 },
};

const FALLBACK: CropFieldBand = {
  phMin: 6.0,
  phMax: 7.5,
  costMin: 12000,
  costMax: 28000,
  profitMin: 8000,
  profitMax: 25000,
};

function slugKey(slug: string): string {
  if (slug === "groundnut" || slug === "mungfali") return "moongfali";
  if (slug === "rice" || slug === "dhaan") return "paddy";
  if (slug === "arhar" || slug === "tur") return "pulses";
  return slug;
}

export function getCropFieldBand(slug: string): CropFieldBand {
  return BANDS[slugKey(slug)] ?? FALLBACK;
}

export function formatInrRange(min: number, max: number): string {
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  return `${fmt(min)}–${fmt(max)}`;
}
