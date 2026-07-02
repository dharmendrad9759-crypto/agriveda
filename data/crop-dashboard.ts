export interface GrowthStageItem {
  id: string;
  name: string;
  das: string;
  status: "completed" | "current" | "upcoming";
  emoji: string;
}

export interface PestDiseaseItem {
  id: string;
  name: string;
  image: string;
  stage: string;
}

export interface ExpertAdviceItem {
  id: string;
  farmerName: string;
  crop: string;
  location: string;
  date: string;
  query: string;
  expertName: string;
  expertDate: string;
  answerPreview: string;
}

export interface AgronomicField {
  label: string;
  value: string;
}

export interface AgronomicSection {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  fields: AgronomicField[];
  tips: string[];
}

export interface CropDashboardData {
  slug: string;
  name: string;
  emoji: string;
  currentStage: string;
  growthStages: GrowthStageItem[];
  pestsAndDiseases: PestDiseaseItem[];
  expertAdvice: ExpertAdviceItem[];
  sowingGuide: AgronomicSection;
  fertilizerSchedule: AgronomicSection;
  irrigationManagement: AgronomicSection;
  nutrientDeficiency: AgronomicSection;
  harvestingYield: AgronomicSection;
  marketInformation: AgronomicSection;
}

export function getCropDashboard(slug: string): CropDashboardData {
  return cropDashboardData[slug] ?? cropDashboardData.paddy;
}

export const cropDashboardData: Record<string, CropDashboardData> = {
  paddy: {
    slug: "paddy",
    name: "Paddy (Transplanted)",
    emoji: "🌾",
    currentStage: "Tillering",
    growthStages: [
      { id: "1", name: "Field preparation", das: "Pre-sowing", status: "completed", emoji: "🚜" },
      { id: "2", name: "Transplanting", das: "0–7 DAS", status: "completed", emoji: "🌱" },
      { id: "3", name: "Tillering", das: "15–45 DAS", status: "current", emoji: "🌿" },
      { id: "4", name: "Panicle initiation", das: "45–60 DAS", status: "upcoming", emoji: "🌾" },
      { id: "5", name: "Flowering", das: "60–75 DAS", status: "upcoming", emoji: "🌸" },
      { id: "6", name: "Grain filling", das: "75–105 DAS", status: "upcoming", emoji: "🫘" },
      { id: "7", name: "Maturity", das: "105–130 DAS", status: "upcoming", emoji: "✅" },
    ],
    pestsAndDiseases: [
      { id: "1", name: "Army worm", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop", stage: "Tillering" },
      { id: "2", name: "Ear cutting caterpillar", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", stage: "Tillering" },
      { id: "3", name: "Brown planthopper", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", stage: "Tillering" },
      { id: "4", name: "Blast disease", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop", stage: "Tillering" },
    ],
    expertAdvice: [
      {
        id: "1",
        farmerName: "Farmer",
        crop: "Paddy (Transplanted)",
        location: "Punjab",
        date: "12 May 2025",
        query: "Leaf problem and fungal growth on paddy leaves during tillering stage. What should I spray?",
        expertName: "Agriveda Expert",
        expertDate: "13 May 2025",
        answerPreview: "Namaste farmer Ji, based on your description this appears to be sheath blight. Apply a recommended fungicide and avoid excess nitrogen...",
      },
    ],
    sowingGuide: {
      id: "sowing",
      title: "Sowing Guide",
      emoji: "🌱",
      summary: "Transplanted paddy establishment protocol",
      fields: [
        { label: "Nursery sowing", value: "May–June (Kharif season)" },
        { label: "Seed rate (nursery)", value: "40–50 kg/ha" },
        { label: "Seedling age", value: "25–30 days at transplanting" },
        { label: "Spacing", value: "20 × 15 cm (transplanted)" },
        { label: "Seed treatment", value: "Carbendazim 2 g/kg + Trichoderma 10 g/kg" },
      ],
      tips: [
        "Raise nursery on raised beds with proper drainage",
        "Harden seedlings 5–7 days before transplanting",
        "Transplant 2–3 seedlings per hill at 3–4 leaf stage",
      ],
    },
    fertilizerSchedule: {
      id: "fertilizer",
      title: "Fertilizer Schedule",
      emoji: "🧪",
      summary: "Balanced NPK with stage-wise split application",
      fields: [
        { label: "Basal dose (at transplanting)", value: "N 60 + P₂O₅ 30 + K₂O 30 kg/ha" },
        { label: "1st top-dress (25 DAS)", value: "Urea 50 kg/ha" },
        { label: "2nd top-dress (45 DAS)", value: "Urea 50 kg/ha" },
        { label: "Micronutrients", value: "ZnSO₄ 25 kg/ha at tillering" },
        { label: "Foliar spray", value: "2% DAP at panicle initiation" },
      ],
      tips: [
        "Apply zinc in zinc-deficient soils at tillering",
        "Avoid excess nitrogen after panicle initiation",
        "Use leaf colour chart for nitrogen management",
      ],
    },
    irrigationManagement: {
      id: "irrigation",
      title: "Irrigation Management",
      emoji: "💧",
      summary: "Critical water stages for transplanted paddy",
      fields: [
        { label: "Water requirement", value: "1100–1500 mm total" },
        { label: "Transplanting", value: "Maintain 2–3 cm standing water" },
        { label: "Tillering (15–45 DAS)", value: "Shallow flooding, 5 cm depth" },
        { label: "Panicle initiation", value: "Critical stage — no moisture stress" },
        { label: "Before harvest", value: "Drain field 7–10 days before harvest" },
      ],
      tips: [
        "Alternate wetting and drying saves 15–30% water",
        "Never allow cracking during panicle initiation",
        "Stop irrigation 10 days before harvest for uniform maturity",
      ],
    },
    nutrientDeficiency: {
      id: "deficiency",
      title: "Nutrient Deficiency",
      emoji: "🔬",
      summary: "Common deficiency symptoms in paddy",
      fields: [
        { label: "Nitrogen (N)", value: "Pale yellow leaves, stunted tillers, reduced panicles" },
        { label: "Phosphorus (P)", value: "Dark green leaves, poor root development" },
        { label: "Potassium (K)", value: "Brown leaf margins, lodging, empty grains" },
        { label: "Zinc (Zn)", value: "Khaira disease — brown spots on midrib" },
        { label: "Iron (Fe)", value: "Interveinal chlorosis on young leaves" },
      ],
      tips: [
        "Apply zinc sulphate in alkaline soils",
        "Split nitrogen to reduce lodging risk",
        "Soil test before every season for precise dosing",
      ],
    },
    harvestingYield: {
      id: "harvest",
      title: "Harvesting & Yield",
      emoji: "🌾",
      summary: "Maturity indicators and yield expectations",
      fields: [
        { label: "Maturity signs", value: "80% grains turn golden yellow, hard dough stage" },
        { label: "Harvest time", value: "105–130 DAS depending on variety" },
        { label: "Average yield", value: "40–50 quintals/ha (transplanted)" },
        { label: "Cutting height", value: "10–15 cm above ground level" },
        { label: "Storage moisture", value: "Below 14% for safe storage" },
      ],
      tips: [
        "Harvest at 20–25% grain moisture for best quality",
        "Dry grains to 14% moisture before storage",
        "Use combine harvester for large areas to reduce losses",
      ],
    },
    marketInformation: {
      id: "market",
      title: "Market Information",
      emoji: "📈",
      summary: "Price outlook and market demand",
      fields: [
        { label: "MSP (Common Paddy)", value: "₹2,300/quintal (2025-26)" },
        { label: "Major markets", value: "Punjab, Haryana, AP, West Bengal mandis" },
        { label: "Demand trend", value: "Stable — staple food crop" },
        { label: "Export potential", value: "Basmati varieties — high export value" },
        { label: "Price trend", value: "Moderate upward in Kharif season" },
      ],
      tips: [
        "Register on e-NAM for better price discovery",
        "Grade paddy before sale for premium pricing",
        "Store in moisture-proof bags to avoid quality loss",
      ],
    },
  },

  potato: {
    slug: "potato",
    name: "Potato",
    emoji: "🥔",
    currentStage: "Tuber bulking",
    growthStages: [
      { id: "1", name: "Planting", das: "0 DAS", status: "completed", emoji: "🌱" },
      { id: "2", name: "Emergence", das: "0–15 DAS", status: "completed", emoji: "🍃" },
      { id: "3", name: "Vegetative", das: "15–30 DAS", status: "completed", emoji: "🌿" },
      { id: "4", name: "Tuber initiation", das: "30–45 DAS", status: "completed", emoji: "🥔" },
      { id: "5", name: "Tuber bulking", das: "45–75 DAS", status: "current", emoji: "📈" },
      { id: "6", name: "Maturity", das: "75–90 DAS", status: "upcoming", emoji: "✅" },
    ],
    pestsAndDiseases: [
      { id: "1", name: "Late blight", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop", stage: "Tuber bulking" },
      { id: "2", name: "Cut worm", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop", stage: "Tuber bulking" },
      { id: "3", name: "Aphids", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", stage: "Tuber bulking" },
    ],
    expertAdvice: [],
    sowingGuide: {
      id: "sowing",
      title: "Sowing Guide",
      emoji: "🌱",
      summary: "Seed potato planting best practices",
      fields: [
        { label: "Best sowing time", value: "Oct–Nov (Rabi), Jan–Feb (Spring)" },
        { label: "Seed rate", value: "2,000–2,500 kg/ha (medium size tubers)" },
        { label: "Spacing", value: "60 × 20 cm (ridges)" },
        { label: "Planting depth", value: "5–7 cm below ridge surface" },
        { label: "Seed treatment", value: "Mancozeb 2 g/kg + Quinolinic acid dip" },
      ],
      tips: [
        "Use certified disease-free seed tubers",
        "Cut large tubers — each piece must have 2–3 eyes",
        "Allow cut pieces to heal 2–3 days before planting",
      ],
    },
    fertilizerSchedule: {
      id: "fertilizer",
      title: "Fertilizer Schedule",
      emoji: "🧪",
      summary: "High potassium need for tuber development",
      fields: [
        { label: "Basal (at planting)", value: "N 120 + P₂O₅ 80 + K₂O 120 kg/ha" },
        { label: "1st earthing up (25 DAS)", value: "Urea 60 kg/ha" },
        { label: "2nd earthing up (45 DAS)", value: "Urea 60 kg/ha + MOP 50 kg/ha" },
        { label: "Micronutrients", value: "Boron 1 kg/ha at tuber initiation" },
        { label: "Organic matter", value: "FYM 15–20 tonnes/ha at land prep" },
      ],
      tips: [
        "Potassium is critical for tuber size and quality",
        "Avoid fresh FYM at planting — causes scab",
        "Apply boron at tuber initiation for better shape",
      ],
    },
    irrigationManagement: {
      id: "irrigation",
      title: "Irrigation Management",
      emoji: "💧",
      summary: "Light, frequent irrigation for tuber development",
      fields: [
        { label: "Total water need", value: "500–600 mm per season" },
        { label: "Germination (0–15 DAS)", value: "Light irrigation every 4–5 days" },
        { label: "Tuber initiation (30–45 DAS)", value: "Critical — maintain field capacity" },
        { label: "Tuber bulking (45–75 DAS)", value: "Regular irrigation, avoid waterlogging" },
        { label: "Before harvest", value: "Stop irrigation 10–15 days before digging" },
      ],
      tips: [
        "Water stress at tuber initiation reduces yield by 30%",
        "Use drip for water efficiency in sandy soils",
        "Hard soil at harvest damages tuber skin — irrigate lightly if dry",
      ],
    },
    nutrientDeficiency: {
      id: "deficiency",
      title: "Nutrient Deficiency",
      emoji: "🔬",
      summary: "Key deficiency symptoms in potato",
      fields: [
        { label: "Nitrogen (N)", value: "Pale green leaves, reduced haulm, small tubers" },
        { label: "Phosphorus (P)", value: "Dark green/purple leaves, delayed maturity" },
        { label: "Potassium (K)", value: "Brown leaf margins, poor tuber size" },
        { label: "Calcium (Ca)", value: "Internal brown spot in tubers" },
        { label: "Magnesium (Mg)", value: "Interveinal chlorosis on older leaves" },
      ],
      tips: [
        "Calcium deficiency causes internal brown spot — apply gypsum",
        "Potassium foliar spray at bulking stage improves size",
        "Soil pH 5.5–6.5 prevents scab and nutrient lock-up",
      ],
    },
    harvestingYield: {
      id: "harvest",
      title: "Harvesting & Yield",
      emoji: "🌾",
      summary: "Harvest timing and yield benchmarks",
      fields: [
        { label: "Maturity signs", value: "Haulm turns yellow, skin sets firmly" },
        { label: "Harvest time", value: "75–90 DAS (90–120 days crop)" },
        { label: "Average yield", value: "200–300 quintals/ha" },
        { label: "Harvest method", value: "Manual digging or potato digger" },
        { label: "Curing", value: "14°C, 85% RH for 10–14 days for table varieties" },
      ],
      tips: [
        "Harvest when skin is set — scrape test on tuber",
        "Avoid bruising during harvest and transport",
        "Grade by size for better market price",
      ],
    },
    marketInformation: {
      id: "market",
      title: "Market Information",
      emoji: "📈",
      summary: "Market demand and pricing outlook",
      fields: [
        { label: "Major markets", value: "Agra, Indore, Ahmedabad, Bengaluru APMC" },
        { label: "Demand", value: "High — year-round consumption & processing" },
        { label: "Price range", value: "₹800–1,500/quintal (seasonal)" },
        { label: "Processing demand", value: "Chips & fries industry — premium for large tubers" },
        { label: "Export", value: "Bangladesh, Nepal, Middle East markets" },
      ],
      tips: [
        "Store in cold storage for off-season premium prices",
        "Large, uniform tubers fetch 20–30% higher rates",
        "Contract farming with processors ensures stable income",
      ],
    },
  },

  tomato: {
    slug: "tomato",
    name: "Tomato",
    emoji: "🍅",
    currentStage: "Flowering",
    growthStages: [
      { id: "1", name: "Seedling", das: "0–25 DAS", status: "completed", emoji: "🌱" },
      { id: "2", name: "Vegetative", das: "25–45 DAS", status: "completed", emoji: "🍃" },
      { id: "3", name: "Flowering", das: "45–60 DAS", status: "current", emoji: "🌸" },
      { id: "4", name: "Fruiting", das: "60–85 DAS", status: "upcoming", emoji: "🍅" },
      { id: "5", name: "Harvest", das: "85–110 DAS", status: "upcoming", emoji: "✅" },
    ],
    pestsAndDiseases: [
      { id: "1", name: "Fruit borer", image: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=200&h=200&fit=crop", stage: "Flowering" },
      { id: "2", name: "Early blight", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop", stage: "Flowering" },
    ],
    expertAdvice: [
      {
        id: "1",
        farmerName: "Farmer",
        crop: "Tomato",
        location: "Maharashtra",
        date: "10 Apr 2025",
        query: "Yellowing leaves on lower branches during flowering.",
        expertName: "Agriveda Expert",
        expertDate: "11 Apr 2025",
        answerPreview: "This could indicate nitrogen deficiency or early blight. Check for spots on leaves...",
      },
    ],
    sowingGuide: {
      id: "sowing",
      title: "Sowing Guide",
      emoji: "🌱",
      summary: "Nursery and transplanting protocol",
      fields: [
        { label: "Nursery sowing", value: "July–Aug (Kharif), Nov–Dec (Rabi)" },
        { label: "Seed rate", value: "400–500 g/ha (transplanted)" },
        { label: "Transplanting age", value: "25–30 days old seedlings" },
        { label: "Spacing", value: "75 × 45 cm" },
      ],
      tips: ["Use staking for indeterminate varieties", "Transplant in evening hours"],
    },
    fertilizerSchedule: {
      id: "fertilizer",
      title: "Fertilizer Schedule",
      emoji: "🧪",
      summary: "Stage-wise nutrition plan",
      fields: [
        { label: "Basal", value: "N 80 + P₂O₅ 60 + K₂O 60 kg/ha" },
        { label: "Flowering", value: "Urea 50 kg/ha + Boron foliar" },
      ],
      tips: ["Calcium spray prevents blossom end rot"],
    },
    irrigationManagement: {
      id: "irrigation",
      title: "Irrigation Management",
      emoji: "💧",
      summary: "Drip irrigation recommended",
      fields: [
        { label: "Method", value: "Drip — 4 LPH, 2 lines per bed" },
        { label: "Frequency", value: "Daily 2–3 hours in summer" },
      ],
      tips: ["Avoid overhead irrigation during flowering"],
    },
    nutrientDeficiency: {
      id: "deficiency",
      title: "Nutrient Deficiency",
      emoji: "🔬",
      summary: "Common tomato deficiencies",
      fields: [
        { label: "Calcium", value: "Blossom end rot on fruits" },
        { label: "Boron", value: "Cracked fruits, hollow stems" },
      ],
      tips: ["Maintain consistent soil moisture for calcium uptake"],
    },
    harvestingYield: {
      id: "harvest",
      title: "Harvesting & Yield",
      emoji: "🌾",
      summary: "Multi-pick harvest system",
      fields: [
        { label: "Yield", value: "300–500 quintals/ha" },
        { label: "Harvest", value: "7–10 picks at 3–4 day intervals" },
      ],
      tips: ["Harvest at breaker stage for long-distance transport"],
    },
    marketInformation: {
      id: "market",
      title: "Market Information",
      emoji: "📈",
      summary: "High-value vegetable market",
      fields: [
        { label: "Demand", value: "Very high — fresh & processing" },
        { label: "Price trend", value: "Volatile — peaks in off-season" },
      ],
      tips: ["Direct marketing to retailers improves margins"],
    },
  },
};
