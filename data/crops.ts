export interface Crop {
  slug: string;
  name: string;
  image: string;
  category: "Cereals" | "Vegetables" | "Pulses" | "Millets" | "Cash-Crops";
  scientificName: string;
  overview: string;
  durationDays: string;
  estimatedYield: string;
  seedRate: string;
  spacing: string;
  suitableSeason: string;
  suitableSoil: string;
  climate: string;
  sowingGuide: {
    bestSowingTime: string;
    seedRate: string;
    seedTreatment: string;
    spacing: string;
    sowingMethod: string;
  };
  fertilizerSchedule: {
    basalDose: string[];
    stageWise: { stage: string; details: string[] }[];
    micronutrients: string[];
    foliarSpray: string[];
  };
  irrigationManagement: {
    waterRequirement: string;
    criticalStages: string[];
    schedule: string[];
  };
  cropProtection: {
    majorPests: string[];
    majorDiseases: string[];
    weedManagement: string[];
    symptoms: string[];
    prevention: string[];
    control: string[];
  };
  nutrientDeficiencies: {
    nutrient: string;
    symptoms: string;
    cause: string;
    solution: string;
  }[];
  harvestAndYield: {
    harvestingTime: string;
    maturitySigns: string[];
    yield: string;
    storageTips: string[];
  };
  marketInformation: {
    majorMarkets: string[];
    demand: string;
    msp: string;
    priceTrend: string;
  };
}

const baseCrop = {
  image: "",
  durationDays: "90-120 Days",
  estimatedYield: "18-25 Quintals per Acre",
  seedRate: "15-25 kg/acre",
  spacing: "20 × 15 cm",
  suitableSeason: "Kharif",
  suitableSoil: "Well-drained loam",
  climate: "Warm and sunny",
  sowingGuide: {
    bestSowingTime: "Early season",
    seedRate: "15-25 kg/acre",
    seedTreatment: "Seed treatment with fungicide and biofertilizer",
    spacing: "20 × 15 cm",
    sowingMethod: "Line sowing or transplanting",
  },
  fertilizerSchedule: {
    basalDose: ["Apply compost and balanced basal fertilizer"],
    stageWise: [{ stage: "Early growth", details: ["Use light nitrogen and phosphorus"] }],
    micronutrients: ["Zinc and boron as needed"],
    foliarSpray: ["Foliar spray at critical growth stage"],
  },
  irrigationManagement: {
    waterRequirement: "Regular but not excessive irrigation",
    criticalStages: ["Germination", "Flowering"],
    schedule: ["Irrigate when topsoil dries"],
  },
  cropProtection: {
    majorPests: ["Aphids", "Thrips"],
    majorDiseases: ["Leaf blight", "Root rot"],
    weedManagement: ["Timely weeding and mulching"],
    symptoms: ["Yellowing", "Stunting"],
    prevention: ["Use clean seed and proper spacing"],
    control: ["Use recommended pesticides and biological agents"],
  },
  nutrientDeficiencies: [
    { nutrient: "Nitrogen", symptoms: "Yellow older leaves", cause: "Low soil nitrogen", solution: "Apply urea in split dose" },
    { nutrient: "Phosphorus", symptoms: "Poor root growth", cause: "Low available phosphorus", solution: "Apply DAP or SSP" },
    { nutrient: "Potassium", symptoms: "Leaf edge burn", cause: "Low potash", solution: "Apply MOP" },
    { nutrient: "Zinc", symptoms: "Interveinal chlorosis", cause: "Low zinc in soil", solution: "Apply zinc sulfate" },
    { nutrient: "Iron", symptoms: "Young leaves turn pale", cause: "Iron deficiency", solution: "Use iron chelate or foliar iron" },
    { nutrient: "Boron", symptoms: "Brittle growth and poor flowering", cause: "Low boron", solution: "Use boron spray" },
  ],
  harvestAndYield: {
    harvestingTime: "At full maturity",
    maturitySigns: ["Uniform color", "Drying of pods or fruits"],
    yield: "Good marketable yield",
    storageTips: ["Dry well before storage", "Store in clean containers"],
  },
  marketInformation: {
    majorMarkets: ["Local mandi", "Regional traders"],
    demand: "Steady demand in fresh market",
    msp: "Check current state MSP",
    priceTrend: "Seasonal price variation",
  },
};

export const rawCropsData: Crop[] = [
  {
    ...baseCrop,
    slug: "tomato",
    name: "Tomato (टमाटर)",
    category: "Vegetables",
    scientificName: "Solanum lycopersicum",
    overview: "A high-value vegetable crop that responds well to balanced nutrition, regular irrigation and early pest control.",
    durationDays: "90-100 Days",
    estimatedYield: "180-220 Quintals per Acre",
    seedRate: "12000-15000 plants/acre",
    spacing: "75 × 45 cm",
    suitableSeason: "Rabi and spring",
    suitableSoil: "Well-drained loam with good organic matter",
    climate: "Warm and sunny weather, avoid frost and waterlogging",
    sowingGuide: {
      bestSowingTime: "Nursery in late summer; transplant in early autumn",
      seedRate: "12000-15000 seedlings/acre",
      seedTreatment: "Treat seed with fungicide and Trichoderma",
      spacing: "75 × 45 cm",
      sowingMethod: "Transplant healthy seedlings in ridges",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "MOP 25 kg/acre", "Compost 4-5 t/acre"],
      stageWise: [
        { stage: "Vegetative stage", details: ["Apply 19:19:19 at 1 kg/acre weekly"] },
        { stage: "Flowering stage", details: ["Apply MKP 2 kg/acre and boron 250 g/acre"] },
      ],
      micronutrients: ["Zinc sulfate 2-3 kg/acre", "Boron 250 g/acre"],
      foliarSpray: ["Calcium nitrate spray during fruit set", "Micronutrient mix every 15 days"],
    },
    irrigationManagement: {
      waterRequirement: "Frequent light irrigation in early growth and fruiting",
      criticalStages: ["Transplanting", "Flowering", "Fruit enlargement"],
      schedule: ["Irrigate every 3-4 days in dry weather", "Avoid waterlogging"],
    },
    cropProtection: {
      majorPests: ["Whitefly", "Thrips", "Fruit borer"],
      majorDiseases: ["Early blight", "Late blight", "Root rot"],
      weedManagement: ["Mulching and hand weeding"],
      symptoms: ["Leaf yellowing", "Fruit rot", "Curling leaves"],
      prevention: ["Use disease-free seedlings", "Maintain spacing and airflow"],
      control: ["Use recommended insecticides and fungicides", "Remove infected leaves"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Older leaves turn pale", cause: "Low nitrogen supply", solution: "Apply urea in split doses" },
      { nutrient: "Zinc", symptoms: "White streaks on leaves", cause: "Low zinc in soil", solution: "Use zinc sulfate foliar feed" },
      { nutrient: "Boron", symptoms: "Flower drop and poor fruit set", cause: "Boron deficiency", solution: "Apply boron spray" },
    ],
    harvestAndYield: {
      harvestingTime: "75-90 Days after transplanting",
      maturitySigns: ["Color change to red", "Firm fruit texture"],
      yield: "180-220 q/acre",
      storageTips: ["Harvest at full color", "Store in cool shaded place"],
    },
    marketInformation: {
      majorMarkets: ["Local mandi", "Processing units", "Vegetable wholesalers"],
      demand: "Strong demand in fresh market",
      msp: "No fixed MSP",
      priceTrend: "Seasonal and market dependent",
    },
  },
  {
    ...baseCrop,
    slug: "paddy",
    name: "Paddy / Rice (धान)",
    category: "Cereals",
    scientificName: "Oryza sativa",
    overview: "A staple cereal crop that needs timely water management, balanced nutrition and early control of insect pests.",
    durationDays: "120-150 Days",
    estimatedYield: "20-28 Quintals per Acre",
    seedRate: "20-25 kg/acre",
    spacing: "20 × 15 cm",
    suitableSeason: "Kharif",
    suitableSoil: "Clay loam or heavy soils with good water holding capacity",
    climate: "Hot and humid weather with good sunshine",
    sowingGuide: {
      bestSowingTime: "Nursery in June-July; transplant after 20-25 days",
      seedRate: "20-25 kg/acre",
      seedTreatment: "Treat seed with fungicide and biofertilizer",
      spacing: "20 × 15 cm",
      sowingMethod: "Transplant seedlings in puddled field",
    },
    fertilizerSchedule: {
      basalDose: ["Zinc sulfate 10 kg/acre", "DAP 50 kg/acre", "MOP 20 kg/acre"],
      stageWise: [
        { stage: "Tillering", details: ["Apply urea in split dose"] },
        { stage: "Panicle initiation", details: ["Apply top dressing and potash"] },
      ],
      micronutrients: ["Zinc at basal stage", "Boron at panicle stage"],
      foliarSpray: ["NPK foliar spray at panicle stage", "Boron spray if deficiency appears"],
    },
    irrigationManagement: {
      waterRequirement: "Maintain 2-5 cm standing water during tillering and panicle initiation",
      criticalStages: ["Tillering", "Panicle initiation", "Grain filling"],
      schedule: ["Irrigate regularly and drain before harvest"],
    },
    cropProtection: {
      majorPests: ["Stem borer", "Brown plant hopper", "Leaf folder"],
      majorDiseases: ["Blast", "BLB", "Sheath blight"],
      weedManagement: ["Pre-emergence herbicide", "Manual weeding in early stage"],
      symptoms: ["Dead hearts", "Brown patches", "Leaf spots"],
      prevention: ["Use resistant varieties", "Keep field clean"],
      control: ["Use recommended insecticide and fungicide", "Remove infected plants"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Yellowing of older leaves", cause: "Low nitrogen availability", solution: "Split urea application" },
      { nutrient: "Zinc", symptoms: "Khaira-like yellow patches", cause: "Low zinc in soil", solution: "Apply zinc sulfate" },
      { nutrient: "Potassium", symptoms: "Leaf margin burn", cause: "Low potash", solution: "Apply MOP" },
    ],
    harvestAndYield: {
      harvestingTime: "105-140 Days after sowing",
      maturitySigns: ["Panicles turn golden", "Grains harden"],
      yield: "20-28 q/acre",
      storageTips: ["Dry grains to safe moisture", "Store in moisture-proof bags"],
    },
    marketInformation: {
      majorMarkets: ["Rice mandis", "Millers", "Procurement centers"],
      demand: "Strong and stable demand",
      msp: "Check current MSP",
      priceTrend: "Moderate seasonal movement",
    },
  },
  {
    ...baseCrop,
    slug: "soybean",
    name: "Soybean (सोयाबीन)",
    category: "Pulses",
    scientificName: "Glycine max",
    overview: "A profitable pulse crop that needs timely sowing, good nodulation and protection from insect pests.",
    durationDays: "90-110 Days",
    estimatedYield: "10-15 Quintals per Acre",
    seedRate: "60-70 kg/acre",
    spacing: "45 × 5 cm",
    suitableSeason: "Kharif",
    suitableSoil: "Well-drained black or loamy soil",
    climate: "Warm weather with moderate humidity",
    sowingGuide: {
      bestSowingTime: "June-July after first monsoon rain",
      seedRate: "60-70 kg/acre",
      seedTreatment: "Treat seed with Rhizobium and carbendazim",
      spacing: "45 × 5 cm",
      sowingMethod: "Line sowing at proper depth",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "Sulfur 10 kg/acre"],
      stageWise: [{ stage: "Vegetative stage", details: ["Apply a light nitrogen boost if needed"] }],
      micronutrients: ["Molybdenum and zinc as needed"],
      foliarSpray: ["Foliar spray at pod initiation"],
    },
    irrigationManagement: {
      waterRequirement: "Light irrigation during dry spell and flowering",
      criticalStages: ["Germination", "Flowering", "Pod filling"],
      schedule: ["Irrigate when topsoil dries"],
    },
    cropProtection: {
      majorPests: ["Stem fly", "Leaf eating caterpillar", "Whitefly"],
      majorDiseases: ["Yellow mosaic", "Rust", "Charcoal rot"],
      weedManagement: ["Two hand weedings or pre-emergence herbicide"],
      symptoms: ["Yellowing", "Leaf curling", "Pod drop"],
      prevention: ["Use disease-free seed", "Avoid dense sowing"],
      control: ["Use recommended insecticides and fungicides"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Pale leaves", cause: "Poor nodulation", solution: "Use Rhizobium and light nitrogen boost" },
      { nutrient: "Potassium", symptoms: "Leaf edge yellowing", cause: "Low potash", solution: "Apply MOP" },
      { nutrient: "Iron", symptoms: "Young leaves pale", cause: "Iron deficiency", solution: "Apply foliar iron" },
    ],
    harvestAndYield: {
      harvestingTime: "90-110 Days after sowing",
      maturitySigns: ["Pods turn brown", "Plants lose green color"],
      yield: "10-15 q/acre",
      storageTips: ["Dry pods well", "Store in clean bags"],
    },
    marketInformation: {
      majorMarkets: ["Pulse traders", "Oil mills", "Local mandi"],
      demand: "Good demand for edible oil and dal",
      msp: "Check market and state support",
      priceTrend: "Price varies with supply and oil demand",
    },
  },
  {
    ...baseCrop,
    slug: "maize",
    name: "Maize (मक्का)",
    category: "Cereals",
    scientificName: "Zea mays",
    overview: "A fast-growing cereal crop that needs strong nutrient management and timely irrigation for high grain yield.",
    durationDays: "90-110 Days",
    estimatedYield: "20-30 Quintals per Acre",
    seedRate: "8-10 kg/acre",
    spacing: "60 × 20 cm",
    suitableSeason: "Kharif and spring",
    suitableSoil: "Fertile loam with drainage",
    climate: "Warm and humid climate with bright sun",
    sowingGuide: {
      bestSowingTime: "Pre-monsoon to monsoon onset",
      seedRate: "8-10 kg/acre",
      seedTreatment: "Treat seed with fungicide and biofertilizer",
      spacing: "60 × 20 cm",
      sowingMethod: "Line sowing at proper depth",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "MOP 25 kg/acre"],
      stageWise: [{ stage: "Early growth", details: ["Apply nitrogen in split doses"] }],
      micronutrients: ["Zinc and sulfur as needed"],
      foliarSpray: ["Foliar NPK at knee-high stage"],
    },
    irrigationManagement: {
      waterRequirement: "Moderate irrigation, especially at tasseling and silking",
      criticalStages: ["Germination", "Tasseling", "Silking"],
      schedule: ["Irrigate during dry spells", "Avoid water stress at silking"],
    },
    cropProtection: {
      majorPests: ["Stem borer", "Fall armyworm", "Aphids"],
      majorDiseases: ["Turcicum leaf blight", "Maydis leaf blight"],
      weedManagement: ["Pre-emergence herbicide and hoeing"],
      symptoms: ["Leaf holes", "Dead hearts", "Chlorosis"],
      prevention: ["Use resistant hybrids", "Keep fields clean"],
      control: ["Use recommended control measures quickly"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Uniform pale green leaves", cause: "Low nitrogen", solution: "Apply split urea dose" },
      { nutrient: "Potassium", symptoms: "Leaf margins turn brown", cause: "Low potash", solution: "Apply MOP" },
      { nutrient: "Zinc", symptoms: "Interveinal striping", cause: "Low zinc", solution: "Apply zinc sulfate" },
    ],
    harvestAndYield: {
      harvestingTime: "90-110 Days after sowing",
      maturitySigns: ["Cob husk dries", "Grains become hard"],
      yield: "20-30 q/acre",
      storageTips: ["Dry grains before storage", "Use clean bags"],
    },
    marketInformation: {
      majorMarkets: ["Feed mills", "Grain traders", "Local mandi"],
      demand: "High demand for feed and food",
      msp: "Check local market rates",
      priceTrend: "Prices improve in lean supply periods",
    },
  },
  {
    ...baseCrop,
    slug: "moongfali",
    name: "Groundnut / Peanut (मूंगफली)",
    category: "Pulses",
    scientificName: "Arachis hypogaea",
    overview: "A valuable oilseed crop that performs best with good pod development, balanced nutrition and timely irrigation.",
    durationDays: "100-120 Days",
    estimatedYield: "12-18 Quintals per Acre",
    seedRate: "80-100 kg/acre",
    spacing: "30 × 10 cm",
    suitableSeason: "Kharif",
    suitableSoil: "Sandy loam with good drainage",
    climate: "Warm weather with moderate rainfall",
    sowingGuide: {
      bestSowingTime: "June-July after monsoon break",
      seedRate: "80-100 kg/acre",
      seedTreatment: "Treat seed with fungicide and Rhizobium",
      spacing: "30 × 10 cm",
      sowingMethod: "Line sowing at 5 cm depth",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "Gypsum 200 kg/acre"],
      stageWise: [{ stage: "Pegging stage", details: ["Apply potassium and gypsum"] }],
      micronutrients: ["Boron and calcium support pod filling"],
      foliarSpray: ["Foliar nutrient spray during pod development"],
    },
    irrigationManagement: {
      waterRequirement: "Light irrigation at sowing and pod formation",
      criticalStages: ["Flowering", "Pegging", "Pod filling"],
      schedule: ["Avoid waterlogging", "Irrigate during dry spells"],
    },
    cropProtection: {
      majorPests: ["Leaf miner", "Aphids", "Termites"],
      majorDiseases: ["Tikka leaf spot", "Collar rot"],
      weedManagement: ["Two hand weedings and mulching"],
      symptoms: ["Leaf spots", "Stunted plants", "Poor pod filling"],
      prevention: ["Use clean seed and proper spacing"],
      control: ["Use recommended fungicides and insecticides"],
    },
    nutrientDeficiencies: [
      { nutrient: "Phosphorus", symptoms: "Poor root and pod growth", cause: "Low phosphorus", solution: "Apply DAP or SSP" },
      { nutrient: "Potassium", symptoms: "Leaf margin burn", cause: "Low potash", solution: "Apply MOP" },
      { nutrient: "Boron", symptoms: "Poor pod filling", cause: "Low boron", solution: "Use boron spray" },
    ],
    harvestAndYield: {
      harvestingTime: "100-120 Days after sowing",
      maturitySigns: ["Pods turn dark", "Plants dry rapidly"],
      yield: "12-18 q/acre",
      storageTips: ["Dry pods before storage", "Keep away from moisture"],
    },
    marketInformation: {
      majorMarkets: ["Oil mills", "Groundnut traders", "Local mandi"],
      demand: "Good demand for edible oil",
      msp: "Check current support price",
      priceTrend: "Linked to oilseed market movement",
    },
  },
  {
    ...baseCrop,
    slug: "chilli",
    name: "Chilli (मिर्च)",
    category: "Vegetables",
    scientificName: "Capsicum annuum",
    overview: "A high-value vegetable crop that needs regular nutrition, timely irrigation and strong pest control.",
    durationDays: "90-120 Days",
    estimatedYield: "80-120 Quintals per Acre",
    seedRate: "200-250 g/acre",
    spacing: "60 × 45 cm",
    suitableSeason: "Rabi and spring",
    suitableSoil: "Well-drained loam rich in organic matter",
    climate: "Warm and humid climate with good sunlight",
    sowingGuide: {
      bestSowingTime: "Nursery in late summer; transplant after 30-35 days",
      seedRate: "200-250 g/acre",
      seedTreatment: "Treat seed with fungicide and Trichoderma",
      spacing: "60 × 45 cm",
      sowingMethod: "Transplant healthy seedlings",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 4-5 t/acre", "DAP 50 kg/acre"],
      stageWise: [{ stage: "Fruiting stage", details: ["Apply potash and calcium"] }],
      micronutrients: ["Boron, zinc and calcium"],
      foliarSpray: ["Foliar micronutrient spray every 15 days"],
    },
    irrigationManagement: {
      waterRequirement: "Regular irrigation during flowering and fruiting",
      criticalStages: ["Transplanting", "Flowering", "Fruit setting"],
      schedule: ["Keep soil moist but not waterlogged"],
    },
    cropProtection: {
      majorPests: ["Thrips", "Whitefly", "Fruit borer"],
      majorDiseases: ["Leaf curl", "Dieback", "Powdery mildew"],
      weedManagement: ["Mulching and regular weeding"],
      symptoms: ["Leaf curl", "Fruit drop", "Yellowing"],
      prevention: ["Use resistant variety", "Avoid overcrowding"],
      control: ["Use recommended insecticides and fungicides"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Pale leaves", cause: "Low nitrogen", solution: "Apply urea in split dose" },
      { nutrient: "Potassium", symptoms: "Leaf tip burn", cause: "Low potash", solution: "Apply MOP" },
      { nutrient: "Boron", symptoms: "Poor fruit set", cause: "Low boron", solution: "Apply boron spray" },
    ],
    harvestAndYield: {
      harvestingTime: "90-120 Days after transplanting",
      maturitySigns: ["Fruit turns shiny and dark", "Pods firm"],
      yield: "80-120 q/acre",
      storageTips: ["Dry and sort before storage", "Store in cool place"],
    },
    marketInformation: {
      majorMarkets: ["Vegetable market", "Spice traders", "Processing units"],
      demand: "High demand in fresh and spice market",
      msp: "No fixed MSP",
      priceTrend: "Depends on season and quality",
    },
  },
  {
    ...baseCrop,
    slug: "cauliflower",
    name: "Cauliflower (फूलगोभी)",
    category: "Vegetables",
    scientificName: "Brassica oleracea var. botrytis",
    overview: "A cool-season vegetable crop that needs careful nutrient balance and management of pests and water stress.",
    durationDays: "70-90 Days",
    estimatedYield: "150-220 Quintals per Acre",
    seedRate: "400-500 g/acre",
    spacing: "60 × 45 cm",
    suitableSeason: "Rabi",
    suitableSoil: "Rich and well-drained loam",
    climate: "Cool climate with moderate moisture",
    sowingGuide: {
      bestSowingTime: "Nursery in late summer; transplant in autumn",
      seedRate: "400-500 g/acre",
      seedTreatment: "Treat seed with fungicide",
      spacing: "60 × 45 cm",
      sowingMethod: "Transplant seedlings in ridges",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 5-6 t/acre", "DAP 50 kg/acre"],
      stageWise: [{ stage: "Head formation", details: ["Apply nitrogen and potash carefully"] }],
      micronutrients: ["Boron and molybdenum"],
      foliarSpray: ["Foliar micronutrient spray before heading"],
    },
    irrigationManagement: {
      waterRequirement: "Regular irrigation with moisture control",
      criticalStages: ["Transplanting", "Head formation"],
      schedule: ["Keep soil evenly moist"],
    },
    cropProtection: {
      majorPests: ["Diamondback moth", "Aphids"],
      majorDiseases: ["Black rot", "Downy mildew"],
      weedManagement: ["Mulching and hand weeding"],
      symptoms: ["Head discoloration", "Leaf curling", "Stunting"],
      prevention: ["Use healthy seedlings", "Crop rotation"],
      control: ["Use recommended insecticides and fungicides"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Yellowing of older leaves", cause: "Low nitrogen", solution: "Apply split urea" },
      { nutrient: "Boron", symptoms: "Head deformation", cause: "Low boron", solution: "Use boron spray" },
      { nutrient: "Molybdenum", symptoms: "Whiptail-like growth", cause: "Low molybdenum", solution: "Use molybdenum spray" },
    ],
    harvestAndYield: {
      harvestingTime: "70-90 Days after transplanting",
      maturitySigns: ["Compact white head", "Leaves slightly open"],
      yield: "150-220 q/acre",
      storageTips: ["Harvest in cool hours", "Store in ventilated place"],
    },
    marketInformation: {
      majorMarkets: ["Vegetable mandi", "Retail chains", "Wholesalers"],
      demand: "Steady demand in urban market",
      msp: "No fixed MSP",
      priceTrend: "Price varies with supply and season",
    },
  },
  {
    ...baseCrop,
    slug: "cucumber",
    name: "Cucumber (खीरा)",
    category: "Vegetables",
    scientificName: "Cucumis sativus",
    overview: "A fast-growing vine crop that performs well with timely irrigation, balanced feeding and good disease management.",
    durationDays: "45-60 Days",
    estimatedYield: "120-180 Quintals per Acre",
    seedRate: "1.5-2 kg/acre",
    spacing: "150 × 50 cm",
    suitableSeason: "Spring and summer",
    suitableSoil: "Well-drained sandy loam",
    climate: "Warm climate with high sunlight",
    sowingGuide: {
      bestSowingTime: "Spring or early summer",
      seedRate: "1.5-2 kg/acre",
      seedTreatment: "Treat seed with fungicide",
      spacing: "150 × 50 cm",
      sowingMethod: "Direct sowing or transplanting",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 3-4 t/acre", "DAP 40 kg/acre"],
      stageWise: [{ stage: "Fruiting stage", details: ["Apply potash and balanced NPK"] }],
      micronutrients: ["Boron and zinc"],
      foliarSpray: ["Foliar feed at early fruiting"],
    },
    irrigationManagement: {
      waterRequirement: "Regular irrigation with moderate moisture",
      criticalStages: ["Seedling", "Flowering", "Fruit development"],
      schedule: ["Water every 2-3 days in hot weather"],
    },
    cropProtection: {
      majorPests: ["Fruit fly", "Whitefly", "Aphids"],
      majorDiseases: ["Powdery mildew", "Downy mildew"],
      weedManagement: ["Mulching and hoeing"],
      symptoms: ["Leaf spots", "Fruit deformity", "Yellowing"],
      prevention: ["Good ventilation and sanitation"],
      control: ["Use recommended insecticides and fungicides"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Slow growth and pale leaves", cause: "Low nitrogen", solution: "Apply urea in split dose" },
      { nutrient: "Potassium", symptoms: "Leaf edge burn", cause: "Low potash", solution: "Apply MOP" },
      { nutrient: "Boron", symptoms: "Poor fruit set", cause: "Low boron", solution: "Use boron spray" },
    ],
    harvestAndYield: {
      harvestingTime: "45-60 Days after sowing",
      maturitySigns: ["Fruit becomes crisp and green", "Fruit length is proper"],
      yield: "120-180 q/acre",
      storageTips: ["Harvest in cool morning", "Store in cool place"],
    },
    marketInformation: {
      majorMarkets: ["Vegetable mandi", "Retail shops", "Wholesalers"],
      demand: "High demand in summer market",
      msp: "No fixed MSP",
      priceTrend: "Price rises in lean supply",
    },
  },
  {
    ...baseCrop,
    slug: "brinjal",
    name: "Brinjal / Eggplant (बैंगन)",
    category: "Vegetables",
    scientificName: "Solanum melongena",
    overview: "A popular vegetable crop that benefits from balanced nutrition, good drainage and early pest management.",
    durationDays: "90-120 Days",
    estimatedYield: "180-250 Quintals per Acre",
    seedRate: "300-400 g/acre",
    spacing: "75 × 60 cm",
    suitableSeason: "Kharif and spring",
    suitableSoil: "Well-drained fertile loam",
    climate: "Warm climate with moderate humidity",
    sowingGuide: {
      bestSowingTime: "Nursery in summer; transplant after 4-5 weeks",
      seedRate: "300-400 g/acre",
      seedTreatment: "Treat seed with fungicide",
      spacing: "75 × 60 cm",
      sowingMethod: "Transplant seedlings on ridges",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 5 t/acre", "DAP 50 kg/acre"],
      stageWise: [{ stage: "Fruiting stage", details: ["Apply potash and phosphorus"] }],
      micronutrients: ["Boron and zinc"],
      foliarSpray: ["Micronutrient spray at fruiting"],
    },
    irrigationManagement: {
      waterRequirement: "Regular irrigation especially during flowering and fruiting",
      criticalStages: ["Transplanting", "Flowering", "Fruit setting"],
      schedule: ["Irrigate every 3-4 days in dry weather"],
    },
    cropProtection: {
      majorPests: ["Shoot and fruit borer", "Whitefly", "Aphids"],
      majorDiseases: ["Wilt", "Phomopsis blight"],
      weedManagement: ["Hand weeding and mulching"],
      symptoms: ["Fruit holes", "Leaf yellowing", "Stunted plants"],
      prevention: ["Use healthy seedlings", "Regular monitoring"],
      control: ["Use recommended insecticides and fungicides"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Pale leaves and less growth", cause: "Low nitrogen", solution: "Apply split urea dose" },
      { nutrient: "Potassium", symptoms: "Leaf tip burn", cause: "Low potash", solution: "Apply MOP" },
      { nutrient: "Boron", symptoms: "Poor fruit development", cause: "Low boron", solution: "Use boron spray" },
    ],
    harvestAndYield: {
      harvestingTime: "90-120 Days after transplanting",
      maturitySigns: ["Glossy fruit skin", "Fruit becomes firm"],
      yield: "180-250 q/acre",
      storageTips: ["Store in cool place", "Keep away from moisture"],
    },
    marketInformation: {
      majorMarkets: ["Vegetable mandi", "Retail and wholesalers"],
      demand: "Strong demand in local market",
      msp: "No fixed MSP",
      priceTrend: "Stable with seasonal variation",
    },
  },
  {
    ...baseCrop,
    slug: "sugarcane",
    name: "Sugarcane (गन्ना)",
    category: "Cash-Crops",
    scientificName: "Saccharum officinarum",
    overview: "A long-duration cash crop that needs strong nutrition planning, timely irrigation and early pest control.",
    durationDays: "300-360 Days",
    estimatedYield: "500-700 Quintals per Acre",
    seedRate: "40,000-50,000 setts/acre",
    spacing: "90 × 45 cm",
    suitableSeason: "Spring and early summer",
    suitableSoil: "Deep loam or clay loam with drainage",
    climate: "Hot and humid climate with long sun",
    sowingGuide: {
      bestSowingTime: "Feb-March or spring planting",
      seedRate: "40,000-50,000 setts/acre",
      seedTreatment: "Treat setts with fungicide",
      spacing: "90 × 45 cm",
      sowingMethod: "Plant healthy setts in furrows",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 10 t/acre", "DAP 100 kg/acre"],
      stageWise: [{ stage: "Grand growth", details: ["Apply nitrogen and potash in splits"] }],
      micronutrients: ["Zinc, iron and manganese"],
      foliarSpray: ["NPK spray during grand growth"],
    },
    irrigationManagement: {
      waterRequirement: "Regular irrigation through the crop cycle",
      criticalStages: ["Germination", "Tillering", "Grand growth"],
      schedule: ["Irrigate at regular intervals", "Avoid water stress"],
    },
    cropProtection: {
      majorPests: ["Top borer", "Early shoot borer"],
      majorDiseases: ["Red rot", "Smut"],
      weedManagement: ["Early hoeing and herbicide use"],
      symptoms: ["Dead hearts", "Leaf reddening", "Poor growth"],
      prevention: ["Use disease-free setts", "Field sanitation"],
      control: ["Use recommended biological and chemical control"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Pale leaves", cause: "Low nitrogen", solution: "Use split nitrogen application" },
      { nutrient: "Phosphorus", symptoms: "Poor root growth", cause: "Low phosphorus", solution: "Apply DAP" },
      { nutrient: "Potassium", symptoms: "Leaf edge scorch", cause: "Low potash", solution: "Apply MOP" },
    ],
    harvestAndYield: {
      harvestingTime: "300-360 Days after planting",
      maturitySigns: ["Canes become hard", "Brix rises"],
      yield: "500-700 q/acre",
      storageTips: ["Harvest and crush quickly", "Store juice carefully"],
    },
    marketInformation: {
      majorMarkets: ["Sugar mills", "Sugarcane traders", "Local market"],
      demand: "Strong demand from sugar industry",
      msp: "No fixed MSP",
      priceTrend: "Linked to sugar mill rates",
    },
  },
  {
    ...baseCrop,
    slug: "potato",
    name: "Potato (आलू)",
    category: "Vegetables",
    scientificName: "Solanum tuberosum",
    overview: "A high-yielding tuber crop that needs balanced nutrition, careful irrigation and disease prevention.",
    durationDays: "80-100 Days",
    estimatedYield: "180-250 Quintals per Acre",
    seedRate: "20-25 q/acre",
    spacing: "60 × 20 cm",
    suitableSeason: "Rabi",
    suitableSoil: "Loose and well-drained loam",
    climate: "Cool season with moderate temperature",
    sowingGuide: {
      bestSowingTime: "October-November",
      seedRate: "20-25 q/acre",
      seedTreatment: "Treat seed tubers with fungicide",
      spacing: "60 × 20 cm",
      sowingMethod: "Plant healthy seed tubers in ridges",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 10 t/acre", "DAP 50 kg/acre"],
      stageWise: [{ stage: "Tuber bulking", details: ["Apply potash and nitrogen in splits"] }],
      micronutrients: ["Boron and zinc"],
      foliarSpray: ["Foliar micronutrient spray at tuber bulking"],
    },
    irrigationManagement: {
      waterRequirement: "Regular irrigation but avoid waterlogging",
      criticalStages: ["Sprouting", "Tuber initiation", "Bulking"],
      schedule: ["Irrigate based on soil dryness"],
    },
    cropProtection: {
      majorPests: ["Aphids", "White grub"],
      majorDiseases: ["Late blight", "Early blight"],
      weedManagement: ["Earthing up and weeding"],
      symptoms: ["Leaf blight", "Tuber rot", "Wilting"],
      prevention: ["Use healthy seed", "Crop rotation"],
      control: ["Use recommended fungicides and insecticides"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Yellowing and poor growth", cause: "Low nitrogen", solution: "Apply split nitrogen" },
      { nutrient: "Potassium", symptoms: "Leaf scorch", cause: "Low potash", solution: "Apply MOP" },
      { nutrient: "Boron", symptoms: "Poor tuber size", cause: "Low boron", solution: "Use boron spray" },
    ],
    harvestAndYield: {
      harvestingTime: "80-100 Days after sowing",
      maturitySigns: ["Plants dry", "Tubers firm and skin set"],
      yield: "180-250 q/acre",
      storageTips: ["Cure tubers before storage", "Store in cool dark place"],
    },
    marketInformation: {
      majorMarkets: ["Potato mandi", "Cold storage traders", "Retail chains"],
      demand: "Stable demand in fresh and processing market",
      msp: "No fixed MSP",
      priceTrend: "Seasonal and storage dependent",
    },
  },
  {
    ...baseCrop,
    slug: "bajra",
    name: "Bajra / Pearl Millet (बाजरा)",
    category: "Millets",
    scientificName: "Pennisetum glaucum",
    overview: "A hardy millet crop suited to dry areas that needs strong drought management and balanced nutrition.",
    durationDays: "70-90 Days",
    estimatedYield: "10-15 Quintals per Acre",
    seedRate: "3-4 kg/acre",
    spacing: "45 × 10 cm",
    suitableSeason: "Kharif",
    suitableSoil: "Light sandy loam and drought-prone soils",
    climate: "Hot dry climate with low rainfall",
    sowingGuide: {
      bestSowingTime: "June-July after monsoon onset",
      seedRate: "3-4 kg/acre",
      seedTreatment: "Treat seed with fungicide",
      spacing: "45 × 10 cm",
      sowingMethod: "Line sowing in dryland fields",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 30 kg/acre", "Compost 2-3 t/acre"],
      stageWise: [{ stage: "Early growth", details: ["Apply small nitrogen dose"] }],
      micronutrients: ["Zinc and iron"],
      foliarSpray: ["Foliar nutrient spray during stress period"],
    },
    irrigationManagement: {
      waterRequirement: "Low water requirement, irrigation only during stress",
      criticalStages: ["Tillering", "Booting"],
      schedule: ["Irrigate only when necessary"],
    },
    cropProtection: {
      majorPests: ["Shoot fly", "Stem borer"],
      majorDiseases: ["Downy mildew", "Ergot"],
      weedManagement: ["Early weeding and interculture"],
      symptoms: ["Leaf chlorosis", "Poor tillering", "Ergot symptoms"],
      prevention: ["Use resistant seed", "Timely weeding"],
      control: ["Use recommended fungicides and insecticides"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Yellowing of leaves", cause: "Low nitrogen", solution: "Apply split urea" },
      { nutrient: "Iron", symptoms: "Young leaves pale", cause: "Iron deficiency", solution: "Apply foliar iron" },
      { nutrient: "Zinc", symptoms: "Interveinal chlorosis", cause: "Low zinc", solution: "Apply zinc sulfate" },
    ],
    harvestAndYield: {
      harvestingTime: "70-90 Days after sowing",
      maturitySigns: ["Ear turns brown", "Grains harden"],
      yield: "10-15 q/acre",
      storageTips: ["Dry well before storage", "Store in cool dry place"],
    },
    marketInformation: {
      majorMarkets: ["Millet traders", "Feed industry", "Local mandi"],
      demand: "Good market for food and feed",
      msp: "Check state support price",
      priceTrend: "Stable with seasonal demand",
    },
  },
  {
    ...baseCrop,
    slug: "wheat",
    name: "Wheat (गेहूं)",
    category: "Cereals",
    scientificName: "Triticum aestivum",
    overview: "A major Rabi cereal crop that benefits from timely sowing, correct nutrition and early disease protection.",
    durationDays: "120-135 Days",
    estimatedYield: "18-25 Quintals per Acre",
    seedRate: "100-120 kg/acre",
    spacing: "22.5 × 5 cm",
    suitableSeason: "Rabi",
    suitableSoil: "Well-drained loam to clay loam",
    climate: "Cool season with bright sun during maturity",
    sowingGuide: {
      bestSowingTime: "Nov 1-25",
      seedRate: "100-120 kg/acre",
      seedTreatment: "Treat seed with fungicide",
      spacing: "22.5 × 5 cm",
      sowingMethod: "Line sowing at proper depth",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "MOP 25 kg/acre"],
      stageWise: [{ stage: "CRI stage", details: ["Apply urea and zinc sulfate"] }],
      micronutrients: ["Zinc and sulfur"],
      foliarSpray: ["Foliar spray at grain filling stage"],
    },
    irrigationManagement: {
      waterRequirement: "Critical irrigation at CRI and grain filling",
      criticalStages: ["CRI", "Tillering", "Flowering"],
      schedule: ["Provide timely irrigation", "Avoid water stress"],
    },
    cropProtection: {
      majorPests: ["Aphids", "Termites"],
      majorDiseases: ["Yellow rust", "Leaf rust"],
      weedManagement: ["Use herbicide and hand weeding"],
      symptoms: ["Leaf rust", "Yellowing", "Poor tillering"],
      prevention: ["Use resistant varieties", "Follow crop rotation"],
      control: ["Use recommended fungicide and herbicide"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "Pale leaves", cause: "Low nitrogen", solution: "Apply split urea" },
      { nutrient: "Zinc", symptoms: "Stunted growth", cause: "Low zinc", solution: "Apply zinc sulfate" },
      { nutrient: "Sulphur", symptoms: "Younger leaves pale", cause: "Low sulfur", solution: "Use sulfur fertilizer" },
    ],
    harvestAndYield: {
      harvestingTime: "120-135 Days after sowing",
      maturitySigns: ["Heads turn golden", "Grains harden"],
      yield: "18-25 q/acre",
      storageTips: ["Dry before storage", "Store in clean bags"],
    },
    marketInformation: {
      majorMarkets: ["Grain mandis", "Flour mills", "Cooperative centers"],
      demand: "Strong procurement demand",
      msp: "Check current MSP",
      priceTrend: "Generally stable and procurement-led",
    },
  },
];

import { importedCropListings } from "@/data/imported-crop-exports";

/** Legacy list merged with ClickUp / batch JSON imports */
export const cropsData: Crop[] = rawCropsData.map((crop) => {
  const patch = importedCropListings[crop.slug];
  return patch ? ({ ...crop, ...patch } as Crop) : crop;
});

export const crops = cropsData;
export default cropsData;