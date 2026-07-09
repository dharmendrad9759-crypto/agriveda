export const FERTILIZER_SUMMARY = {
  npk: "120 : 60 : 60",
  cost: "₹2,850",
  stages: 6,
  nextApp: "Tillering Stage (In 5 Days)",
  lastUpdated: "07 May, 2024 09:30 AM",
};

export const FERTILIZER_SCHEDULE = [
  { stage: 1, dat: "0-3", growth: "Land Preparation", fertilizer: "Urea (20kg), DAP (50kg), MOP (20kg)", nutrients: "N:28 P:23 K:12", method: "Soil Application" },
  { stage: 2, dat: "15-20", growth: "Active Tillering", fertilizer: "Urea (40kg), MOP (20kg)", nutrients: "N:18 K:12", method: "Soil Application" },
  { stage: 3, dat: "35-40", growth: "Panicle Initiation", fertilizer: "Urea (40kg), MOP (20kg)", nutrients: "N:18 K:12", method: "Soil Application" },
  { stage: 4, dat: "55-60", growth: "Booting", fertilizer: "Urea (20kg)", nutrients: "N:9", method: "Soil Application" },
  { stage: 5, dat: "75-80", growth: "Flowering", fertilizer: "Potassium Nitrate (10kg), Zinc Sulphate (5kg)", nutrients: "N:1.3 K:4.6 Zn:1", method: "Soil/Foliar" },
  { stage: 6, dat: "95-100", growth: "Grain Filling", fertilizer: "Urea (20kg)", nutrients: "N:9", method: "Soil Application" },
];

export const NPK_DISTRIBUTION = [
  { label: "N (Nitrogen)", value: 120, color: "#10b981", pct: 50 },
  { label: "P₂O₅ (Phosphorus)", value: 60, color: "#a78bfa", pct: 25 },
  { label: "K₂O (Potassium)", value: 60, color: "#f472b6", pct: 25 },
];

export const FERTILIZER_TIPS = [
  "Apply fertilizers in split doses for better efficiency",
  "Incorporate basal dose during land preparation",
  "Avoid application during heavy rainfall",
  "Follow 4R principle: Right source, dose, time, place",
  "Conduct soil test every 2-3 years",
];

export const FERTILIZER_PRODUCTS = [
  { name: "Urea", npk: "46-0-0", dose: "140 kg/acre" },
  { name: "DAP", npk: "18-46-0", dose: "50 kg/acre" },
  { name: "MOP", npk: "0-0-60", dose: "40 kg/acre" },
  { name: "Zinc Sulphate", npk: "Zn 21%", dose: "5 kg/acre" },
  { name: "Potassium Nitrate", npk: "13-0-45", dose: "10 kg/acre" },
];
