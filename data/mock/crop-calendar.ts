export const CALENDAR_FILTERS = {
  crops: ["Paddy (धान)", "Soybean", "Maize", "Wheat"],
  seasons: ["Kharif 2024", "Rabi 2024-25", "Zaid 2024"],
  fields: ["Main Farm - 12.50 Acre", "North Field - 3.20 Acre", "West Field - 2.80 Acre"],
};

export const GROWTH_STAGES = [
  { name: "Nursery", color: "#86efac", weeks: [0, 1] },
  { name: "Transplanting", color: "#10b981", weeks: [1, 2] },
  { name: "Tillering", color: "#a3e635", weeks: [2, 6] },
  { name: "Panicle Init.", color: "#fbbf24", weeks: [6, 9] },
  { name: "Flowering", color: "#f97316", weeks: [9, 11] },
  { name: "Grain Filling", color: "#d97706", weeks: [11, 14] },
  { name: "Maturity", color: "#92400e", weeks: [14, 16] },
];

export const CALENDAR_ACTIVITIES = [
  { name: "Land Preparation", color: "#64748b", start: 0, end: 2 },
  { name: "Nursery Preparation", color: "#86efac", start: 0, end: 3 },
  { name: "Transplanting", color: "#10b981", start: 3, end: 4 },
  { name: "Irrigation", color: "#38bdf8", start: 2, end: 16 },
  { name: "Fertilizer Application", color: "#a78bfa", start: 4, end: 14 },
  { name: "Pest Management", color: "#f87171", start: 5, end: 12 },
  { name: "Harvesting", color: "#fbbf24", start: 15, end: 16 },
];

export const UPCOMING_CALENDAR = [
  { task: "Irrigation", desc: "Light irrigation required", date: "Tomorrow", status: "Tomorrow" },
  { task: "Urea Top Dressing", desc: "40 kg/acre in Main Farm", date: "14 May", status: "In 2 Days" },
  { task: "Pest Monitoring", desc: "Check for stem borer traps", date: "15 May", status: "In 3 Days" },
];

export const CALENDAR_SUMMARY = {
  progress: 42,
  totalDays: "150-160 Days",
  daysPassed: "64 Days",
  daysRemaining: "86-96 Days",
  harvest: "20 Oct - 5 Nov 2024",
};

export const RECOMMENDED_INPUTS = [
  { type: "Fertilizer", item: "Urea 40 kg/acre" },
  { type: "Pesticide", item: "Cartap Hydrochloride 1 kg/acre" },
  { type: "Micronutrient", item: "Zinc Sulphate 5 kg/acre" },
  { type: "Biostimulant", item: "Seaweed extract 2 ml/liter" },
];

export const STAGE_TIPS = [
  "टिलरिंग स्टेज में पानी का स्तर 2-3 सेमी रखें",
  "यूरिया की दूसरी खुराक अब लगाएं",
  "कीट नियंत्रण के लिए फील्ड की नियमित निगरानी करें",
];

export const CALENDAR_ALERTS = [
  { text: "अगले 2 दिनों में हल्की बारिश की संभावना — सिंचाई स्थगित करें", date: "12 May" },
  { text: "तापमान 38°C तक पहुंच सकता है — पत्तियों पर स्प्रे से बचें", date: "13 May" },
];
