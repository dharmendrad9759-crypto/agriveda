export interface ProfitabilityEntry {
  cost_per_acre: number;
  avg_yield: string;
  avg_price: string;
  net_profit_range: string;
  risk: string;
  market_demand: string;
  note?: string;
}

export const SMART_CROP_DATA = {
  soilSuitability: {
    "Loamy (Domat)": {
      best: ["Gehun", "Sarson", "Makka", "Tamatar", "Aloo", "Chana"],
      good: ["Arhar", "Soybean", "Bhindi"],
      avoid: ["Dhan (without irrigation)", "Moongfali"],
    },
    "Sandy Loam (Balaui Domat)": {
      best: ["Moongfali", "Bajra", "Til", "Moong", "Urad", "Gajar"],
      good: ["Arhar", "Sarson", "Bhindi"],
      avoid: ["Dhan", "Sugarcane"],
    },
    "Clay (Bhaaree Mitti)": {
      best: ["Dhan", "Ganna", "Wheat (rabi)", "Arhar"],
      good: ["Chana", "Masoor"],
      avoid: ["Moongfali", "Bajra", "Gajar", "Alu"],
    },
    "Black Cotton (Kaali Mitti)": {
      best: ["Soybean", "Cotton", "Jowar", "Urad", "Arhar"],
      good: ["Gehun", "Chana", "Sarson"],
      avoid: ["Sandy soil crops"],
    },
  },

  irrigationWise: {
    "0 irrigation (Baraani)": {
      best: ["Bajra", "Arhar", "Moong", "Urad", "Til"],
      note: "500-700mm rainfall pe aadharit",
    },
    "1-2 irrigation": {
      best: ["Sarson", "Chana", "Masoor", "Barley (Jau)"],
      note: "Rabi mein bahut effective",
    },
    "3-4 irrigation": {
      best: ["Gehun", "Makka", "Soybean", "Bhindi"],
      note: "Medium water crops — sabse zyada area",
    },
    "Full irrigation (5+ watering)": {
      best: ["Dhan", "Ganna", "Tamatar", "Aloo", "Gobhi"],
      note: "Borewell ya nahar zaroor honi chahiye",
    },
  },

  profitability: {
    Tamatar: {
      cost_per_acre: 40000,
      avg_yield: "200-300 q/acre (hybrid)",
      avg_price: "Rs. 8-15/kg (season varies)",
      net_profit_range: "Rs. 40,000 – 1,20,000/acre",
      risk: "High (price fluctuation)",
      market_demand: "Very High",
    },
    "Aloo (Potato)": {
      cost_per_acre: 50000,
      avg_yield: "100-150 q/acre",
      avg_price: "Rs. 6-12/kg",
      net_profit_range: "Rs. 30,000 – 90,000/acre",
      risk: "Medium (cold storage needed)",
      market_demand: "Very High",
    },
    "Gehun (Wheat)": {
      cost_per_acre: 14000,
      avg_yield: "18-22 q/acre",
      avg_price: "MSP Rs. 2275/q (2024-25)",
      net_profit_range: "Rs. 25,000 – 35,000/acre",
      risk: "Low (MSP support)",
      market_demand: "Stable",
    },
    "Sarson (Mustard)": {
      cost_per_acre: 9000,
      avg_yield: "8-12 q/acre",
      avg_price: "MSP Rs. 5650/q (2024-25)",
      net_profit_range: "Rs. 35,000 – 55,000/acre",
      risk: "Low-Medium",
      market_demand: "High (edible oil)",
    },
    "Makka (Maize)": {
      cost_per_acre: 15000,
      avg_yield: "25-35 q/acre (hybrid)",
      avg_price: "MSP Rs. 2225/q (2024-25)",
      net_profit_range: "Rs. 40,000 – 62,000/acre",
      risk: "Medium (FAW pest risk)",
      market_demand: "High (poultry feed)",
    },
    "Bhindi (Okra)": {
      cost_per_acre: 20000,
      avg_yield: "40-60 q/acre",
      avg_price: "Rs. 15-30/kg",
      net_profit_range: "Rs. 50,000 – 1,40,000/acre",
      risk: "Medium (YVMV virus)",
      market_demand: "High",
    },
    "Dhan (Paddy — non-Basmati)": {
      cost_per_acre: 18000,
      avg_yield: "22-28 q/acre",
      avg_price: "MSP Rs. 2300/q (2024-25)",
      net_profit_range: "Rs. 32,000 – 48,000/acre",
      risk: "Low (MSP)",
      market_demand: "Stable",
    },
    "Dhan (Basmati — 1121/1509)": {
      cost_per_acre: 25000,
      avg_yield: "18-24 q/acre",
      avg_price: "Rs. 3000-5000/q (export quality)",
      net_profit_range: "Rs. 30,000 – 95,000/acre",
      risk: "Medium (export market)",
      market_demand: "Very High",
    },
    "Arhar (Pigeonpea)": {
      cost_per_acre: 8000,
      avg_yield: "6-10 q/acre",
      avg_price: "MSP Rs. 7550/q (2024-25)",
      net_profit_range: "Rs. 37,000 – 68,000/acre",
      risk: "Low-Medium",
      market_demand: "Very High (dal shortage)",
    },
    "Chana (Chickpea)": {
      cost_per_acre: 9000,
      avg_yield: "8-12 q/acre",
      avg_price: "MSP Rs. 5440/q (2024-25)",
      net_profit_range: "Rs. 35,000 – 56,000/acre",
      risk: "Low",
      market_demand: "High",
    },
    "Ganna (Sugarcane)": {
      cost_per_acre: 35000,
      avg_yield: "350-500 q/acre",
      avg_price: "SAP Rs. 370-400/q (state-wise varies)",
      net_profit_range: "Rs. 95,000 – 1,65,000/acre",
      risk: "Low (government price)",
      market_demand: "Stable",
      note: "Long duration 10-12 months crop",
    },
  } satisfies Record<string, ProfitabilityEntry>,
};

/** Slug → profitability key */
export const SLUG_TO_PROFIT_KEY: Record<string, string> = {
  tomato: "Tamatar",
  potato: "Aloo (Potato)",
  wheat: "Gehun (Wheat)",
  mustard: "Sarson (Mustard)",
  maize: "Makka (Maize)",
  bhindi: "Bhindi (Okra)",
  paddy: "Dhan (Paddy — non-Basmati)",
  pulses: "Chana (Chickpea)",
  sugarcane: "Ganna (Sugarcane)",
  soybean: "Soybean",
};

export function parseProfitMid(range: string): number {
  const nums = range.match(/[\d,]+/g)?.map((n) => parseInt(n.replace(/,/g, ""), 10)) ?? [];
  if (nums.length >= 2) return Math.round((nums[0] + nums[1]) / 2);
  return nums[0] ?? 20000;
}

export function riskLevelFromLabel(risk: string): "low" | "medium" | "high" {
  const r = risk.toLowerCase();
  if (r.includes("high")) return "high";
  if (r.includes("medium") || r.includes("low-medium")) return "medium";
  return "low";
}

export function mandiTrendFromDemand(demand: string): "↑ Rising" | "→ Stable" | "↓ Falling" {
  if (/very high|high/i.test(demand)) return "↑ Rising";
  if (/stable/i.test(demand)) return "→ Stable";
  return "→ Stable";
}
