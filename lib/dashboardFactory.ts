import { cropCatalog } from "@/data/crop-catalog";
import { getCropPestDisease } from "@/data/pest-disease";
import type { CropDashboardData } from "@/data/crop-dashboard";

export function buildDashboardFromCatalog(slug: string): CropDashboardData | null {
  const catalog = cropCatalog.find((c) => c.slug === slug);
  if (!catalog) return null;

  const pd = getCropPestDisease(slug);

  return {
    slug: catalog.slug,
    name: catalog.name,
    emoji: catalog.emoji,
    currentStage: "Active growth",
    growthStages: [
      { id: "1", name: "Land preparation", das: "Pre-sowing", status: "completed", emoji: "🚜" },
      { id: "2", name: "Sowing / transplant", das: "0–7 DAS", status: "completed", emoji: "🌱" },
      { id: "3", name: "Vegetative growth", das: "15–45 DAS", status: "current", emoji: "🌿" },
      { id: "4", name: "Reproductive stage", das: "45–75 DAS", status: "upcoming", emoji: "🌸" },
      { id: "5", name: "Maturity", das: "75+ DAS", status: "upcoming", emoji: "✅" },
    ],
    pestsAndDiseases: [
      ...pd.pests.slice(0, 2).map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        stage: p.stage,
      })),
      ...pd.diseases.slice(0, 2).map((d) => ({
        id: d.id,
        name: d.name,
        image: d.image,
        stage: d.stage,
      })),
    ],
    expertAdvice: [],
    sowingGuide: {
      id: "sowing",
      title: "Sowing Guide",
      emoji: "🌱",
      summary: `${catalog.name} establishment protocol`,
      fields: [
        { label: "Season", value: "As per regional agro-climatic zone" },
        { label: "Seed/seedling", value: "Use certified seed from trusted source" },
        { label: "Spacing", value: "Follow package of practices for your variety" },
      ],
      tips: [
        "बुवाई से पहले बीज को फफूंदनाशक और जैविक दवा से उपचारित करें",
        "बीज सही गहराई पर बोएँ — बहुत गहरा न बोएँ",
        "अंकुरण के समय मिट्टी में सही नमी रखें",
      ],
    },
    fertilizerSchedule: {
      id: "fertilizer",
      title: "Fertilizer Schedule",
      emoji: "🧪",
      summary: "Split-dose nutrition for maximum yield",
      fields: [
        { label: "Basal", value: "50% N + full P + 50% K at sowing/transplant" },
        { label: "1st top-dress", value: "25% N at knee-high / tillering" },
        { label: "2nd top-dress", value: "25% N at flowering / panicle initiation" },
        { label: "Micronutrients", value: "ZnSO₄ foliar if deficiency symptoms appear" },
      ],
      tips: [
        "पूरी नाइट्रोजन एक साथ न डालें — पौधा गिर सकता है और बीमारी बढ़ती है",
        "हर मौसम मिट्टी जाँच कराकर ही खाद की मात्रा तय करें",
        "ड्रिप से खाद–पानी देने से खाद का फायदा ज़्यादा मिलता है",
      ],
    },
    irrigationManagement: {
      id: "irrigation",
      title: "Irrigation Management",
      emoji: "💧",
      summary: "Critical moisture stages",
      fields: [
        { label: "Germination", value: "Light frequent irrigation" },
        { label: "Critical stage", value: "No moisture stress at flowering/grain fill" },
        { label: "Method", value: "Drip or furrow — avoid waterlogging" },
      ],
      tips: [
        "सुबह या शाम पानी दें — धूप में पानी उड़ जाता है",
        "भारी बारिश के बाद खेत से अतिरिक्त पानी निकाल दें",
      ],
    },
    nutrientDeficiency: {
      id: "deficiency",
      title: "Nutrient Deficiency",
      emoji: "🔬",
      summary: "Watch for these symptoms",
      fields: [
        { label: "Nitrogen", value: "Pale yellow older leaves, stunted growth" },
        { label: "Phosphorus", value: "Dark green/purple leaves, poor root development" },
        { label: "Potassium", value: "Brown leaf margins, weak stems" },
        { label: "Zinc", value: "Interveinal chlorosis, stunted new leaves" },
      ],
      tips: [
        "पत्तों पर छिड़काव से कमी जल्दी ठीक होती है",
        "मिट्टी का pH जाँचें — गलत pH पर खाद काम नहीं करती",
      ],
    },
    harvestingYield: {
      id: "harvest",
      title: "Harvesting & Yield",
      emoji: "🌾",
      summary: "Timely harvest prevents losses",
      fields: [
        { label: "Maturity", value: "Harvest when crop-specific maturity signs appear" },
        { label: "Moisture", value: "Dry grains/tubers to safe storage moisture" },
      ],
      tips: ["सूखे मौसम में कटाई करें", "माल छाँटकर बेचें — मंडी में बेहतर भाव मिलता है"],
    },
    marketInformation: {
      id: "market",
      title: "Market Information",
      emoji: "📈",
      summary: "Selling strategy",
      fields: [
        { label: "Mandi", value: "Check e-NAM and local APMC rates daily" },
        { label: "MSP", value: "Verify government MSP for eligible crops" },
        { label: "Trend", value: "Prices peak in off-season for most crops" },
      ],
      tips: [
        "ठीक से रखें — भाव बढ़ने पर बेचें",
        "किसान समूह से सीधी बिक्री से मुनाफा बेहतर हो सकता है",
      ],
    },
  };
}
