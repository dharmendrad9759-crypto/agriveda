export interface MandiRow {
  id: string;
  crop: string;
  cropHi: string;
  variety: string;
  mandi: string;
  state: string;
  min: number;
  max: number;
  modal: number;
  change: number;
  changeAmt: number;
  trend: number[];
  category: string;
}

export const MANDI_STATS = {
  location: "Sehore Mandi, Madhya Pradesh",
  commodities: 32,
  status: "Active",
  lastUpdated: "07 May, 2024 09:30 AM",
  activeAlerts: 3,
};

export const MANDI_PRICES: MandiRow[] = [
  { id: "1", crop: "Paddy", cropHi: "धान", variety: "Lok-1", mandi: "Sehore", state: "M.P.", min: 2100, max: 2250, modal: 2180, change: 2.38, changeAmt: 50, trend: [2100, 2120, 2140, 2150, 2160, 2170, 2180], category: "Cereals" },
  { id: "2", crop: "Soybean", cropHi: "सोयाबीन", variety: "JS 335", mandi: "Indore", state: "M.P.", min: 4100, max: 4450, modal: 4280, change: 1.2, changeAmt: 50, trend: [4200, 4220, 4240, 4250, 4260, 4270, 4280], category: "Oilseeds" },
  { id: "3", crop: "Wheat", cropHi: "गेहूँ", variety: "HD 2967", mandi: "Ujjain", state: "M.P.", min: 2275, max: 2400, modal: 2340, change: 0.5, changeAmt: 12, trend: [2320, 2325, 2330, 2332, 2335, 2338, 2340], category: "Cereals" },
  { id: "4", crop: "Maize", cropHi: "मक्का", variety: "HQPM-1", mandi: "Bhopal", state: "M.P.", min: 1950, max: 2200, modal: 2080, change: -0.8, changeAmt: -17, trend: [2120, 2110, 2100, 2095, 2090, 2085, 2080], category: "Cereals" },
  { id: "5", crop: "Gram", cropHi: "चना", variety: "JG 11", mandi: "Vidisha", state: "M.P.", min: 5400, max: 5800, modal: 5620, change: 1.8, changeAmt: 100, trend: [5500, 5520, 5550, 5570, 5580, 5600, 5620], category: "Pulses" },
  { id: "6", crop: "Mustard", cropHi: "सरसों", variety: "Pusa Bold", mandi: "Bhopal", state: "M.P.", min: 5200, max: 5650, modal: 5420, change: 2.1, changeAmt: 110, trend: [5300, 5320, 5350, 5370, 5390, 5410, 5420], category: "Oilseeds" },
  { id: "7", crop: "Cotton", cropHi: "कपास", variety: "Bt Cotton", mandi: "Khandwa", state: "M.P.", min: 6800, max: 7500, modal: 7150, change: 3.2, changeAmt: 220, trend: [6900, 6950, 7000, 7050, 7080, 7120, 7150], category: "Cash Crops" },
  { id: "8", crop: "Tomato", cropHi: "टमाटर", variety: "Hybrid", mandi: "Indore", state: "M.P.", min: 2400, max: 3200, modal: 2800, change: 4.5, changeAmt: 120, trend: [2600, 2650, 2680, 2720, 2750, 2780, 2800], category: "Vegetables" },
];

export const TOP_MANDIS = [
  { name: "Indore Mandi", price: 4280, change: 1.2 },
  { name: "Bhopal Mandi", price: 2340, change: 0.8 },
  { name: "Ujjain Mandi", price: 2180, change: 2.1 },
  { name: "Sehore Mandi", price: 2180, change: 2.38 },
];

export const MANDI_INSIGHTS = [
  "Paddy prices increased by 2.38% in last 7 days",
  "Soybean demand strong in Indore mandi",
  "Maize prices slightly down due to fresh arrivals",
];

export const MANDI_NEWS = [
  { title: "Wheat prices likely to remain stable this week", date: "07 May 2024", snippet: "Government procurement continues at MSP rates..." },
  { title: "Good rainfall boosts paddy output forecast", date: "06 May 2024", snippet: "IMD predicts normal monsoon for central India..." },
  { title: "Soybean exports drive price rally in MP mandis", date: "05 May 2024", snippet: "Export demand from Southeast Asia remains strong..." },
];

export const PRICE_ALERTS = [
  { crop: "Paddy", target: 2200, enabled: true },
  { crop: "Soybean", target: 4500, enabled: true },
  { crop: "Wheat", target: 2400, enabled: false },
];

export const COMMODITY_CATEGORIES = [
  { label: "Cereals", value: 45, color: "#10b981" },
  { label: "Pulses", value: 25, color: "#8b5cf6" },
  { label: "Oilseeds", value: 20, color: "#f59e0b" },
  { label: "Others", value: 10, color: "#64748b" },
];
