export const FARM_STATS = {
  totalFields: 4,
  totalArea: "12.50 Acre",
  cropsGrowing: 3,
  upcomingTasks: 5,
  healthScore: 85,
};

export const FARM_FIELDS = [
  { id: "1", name: "Field 1 - Main Farm", area: "3.50 Acre", ownership: "Owned", crop: "Paddy (PB 1121)", status: "Active", sowingDate: "15 Apr 2024", emoji: "🌾" },
  { id: "2", name: "Field 2 - North", area: "3.20 Acre", ownership: "Owned", crop: "Soybean (JS 335)", status: "Active", sowingDate: "20 Jun 2024", emoji: "🫘" },
  { id: "3", name: "Field 3 - West", area: "2.80 Acre", ownership: "Leased", crop: "Maize (HQPM-1)", status: "Active", sowingDate: "10 Jul 2024", emoji: "🌽" },
  { id: "4", name: "Field 4 - South", area: "3.00 Acre", ownership: "Owned", crop: "Wheat (HD 2967)", status: "Upcoming", sowingDate: "15 Nov 2024", emoji: "🌾" },
];

export const FARM_CROPS = [
  { name: "Paddy", variety: "PB 1121", field: "Main Farm", stage: "Tillering", progress: 42 },
  { name: "Soybean", variety: "JS 335", field: "North Field", stage: "Flowering", progress: 68 },
  { name: "Maize", variety: "HQPM-1", field: "West Field", stage: "Grain Filling", progress: 85 },
];

export const FARM_INSIGHTS = [
  { label: "Irrigation Efficiency", value: "78%", icon: "💧" },
  { label: "Nutrient Management", value: "82%", icon: "🌱" },
  { label: "Pest Pressure Risk", value: "Low", icon: "🐛" },
  { label: "Yield Prediction", value: "22.4 q/acre", icon: "📈" },
];

export const FARM_RECORDS = [
  { type: "Fertilizer", desc: "Urea top dressing", detail: "40 kg/acre", date: "10 May 2024" },
  { type: "Pesticide", desc: "Chlorantraniliprole spray", detail: "150 ml/acre", date: "08 May 2024" },
  { type: "Irrigation", desc: "Light irrigation", detail: "All fields", date: "06 May 2024" },
  { type: "Activity", desc: "Weed management", detail: "North Field", date: "04 May 2024" },
];

export const FARM_NOTES = [
  { title: "Paddy Nursery Prep", body: "Prepare nursery bed for next season by mid-October", date: "05 May", pinned: true },
  { title: "Soil Test Due", body: "Schedule soil test for South Plot before wheat sowing", date: "03 May", pinned: false },
];
