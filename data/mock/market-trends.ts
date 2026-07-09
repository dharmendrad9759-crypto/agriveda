export const MARKET_STATS = {
  tracked: 32,
  trend: "Bullish",
  avgChange: 2.38,
  lastUpdated: "07 May, 2024 09:30 AM",
};

export const PRICE_TREND_LABELS = ["01 May", "02 May", "03 May", "04 May", "05 May", "06 May", "07 May"];

export const PRICE_TREND_SERIES = [
  { name: "Modal Price", data: [2100, 2120, 2140, 2150, 2160, 2170, 2180], color: "#10b981" },
  { name: "Min Price", data: [2080, 2090, 2100, 2110, 2120, 2130, 2140], color: "#38bdf8" },
  { name: "Max Price", data: [2200, 2210, 2220, 2230, 2240, 2250, 2260], color: "#f59e0b" },
];

export const TOP_MARKETS_TREND = [
  { market: "Indore Mandi", price: 4280, change: 1.2, trend: [4200, 4220, 4240, 4250, 4260, 4270, 4280] },
  { market: "Bhopal Mandi", price: 2340, change: 0.8, trend: [2300, 2310, 2320, 2325, 2330, 2335, 2340] },
  { market: "Ujjain Mandi", price: 2180, change: 2.1, trend: [2100, 2120, 2140, 2150, 2160, 2170, 2180] },
];

export const COMMODITY_TRENDS = [
  { name: "Paddy", change: 2.38, up: true, trend: [2100, 2120, 2140, 2150, 2160, 2170, 2180] },
  { name: "Wheat", change: 0.5, up: true, trend: [2320, 2325, 2330, 2332, 2335, 2338, 2340] },
  { name: "Soybean", change: 1.2, up: true, trend: [4200, 4220, 4240, 4250, 4260, 4270, 4280] },
  { name: "Maize", change: -0.8, up: false, trend: [2120, 2110, 2100, 2095, 2090, 2085, 2080] },
];

export const MARKET_INSIGHTS = [
  "Paddy prices expected to rise 2-4% in next week",
  "Soybean demand strong in export markets",
  "Wheat prices stable near MSP levels",
];

export const FORECAST_BARS = [2180, 2190, 2200, 2210, 2220, 2230, 2240];
