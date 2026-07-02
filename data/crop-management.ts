import type { Crop as LegacyCrop } from "@/types/crop";
import type { CropManagementProfile } from "@/types/crop-management";
import { cropsData as legacyCrops } from "@/data/crops";

const tomatoProfile: CropManagementProfile = {
  slug: "tomato",
  name: "Tomato",
  scientificName: "Solanum lycopersicum",
  category: "Vegetables",
  image: "/images/tomato.png",
  summary: "High-value vegetable crop requiring balanced nutrition, timely irrigation and early pest-disease management.",
  overview:
    "Tomato is a warm-season crop grown widely for fresh consumption, processing and export. It responds very well to drip irrigation, fertigation and staking for improved fruit quality.",
  climate: "Warm and sunny climate with temperatures around 20-30°C. Avoid frost and waterlogging.",
  soil: "Well-drained loamy soil rich in organic matter with a pH of 6.0-7.0.",
  landPreparation: [
    "Deep ploughing followed by 2-3 harrowings.",
    "Add FYM at 10-12 tonnes per acre and mix thoroughly.",
    "Prepare raised beds or ridges for better root aeration.",
  ],
  seedSelection: [
    "Choose hybrid or improved varieties depending on market demand and disease tolerance.",
    "Use certified, disease-free seedlings for transplanting.",
  ],
  seedTreatment: [
    "Treat seeds with Trichoderma and a recommended fungicide before sowing.",
    "Soak seeds for 8-10 hours for better germination.",
  ],
  sowingTime: [
    "Nursery sowing: July-August for main season.",
    "Transplanting: 25-30 days after sowing in the main field.",
  ],
  seedRate: "10,000-12,000 seedlings per acre",
  spacing: "75 × 45 cm",
  nursery: [
    "Raise seedlings in a protected nursery for 25-30 days.",
    "Harden seedlings 5-7 days before transplanting.",
  ],
  transplanting: [
    "Transplant in the evening for better establishment.",
    "Maintain proper spacing and avoid planting too deep.",
  ],
  irrigationSchedule: [
    "Give light irrigation immediately after transplanting.",
    "Irrigate every 3-4 days in dry weather and avoid waterlogging.",
    "Increase frequency during flowering and fruit enlargement.",
  ],
  fertilizerSchedule: [
    "Apply FYM and basal fertilizers before transplanting.",
    "Use split nitrogen applications for better vegetative growth.",
    "Supplement with micronutrients at flowering and fruit set.",
  ],
  micronutrients: [
    "Zinc sulfate at 2-3 kg/acre",
    "Boron at 250 g/acre",
    "Calcium and magnesium support during fruit set",
  ],
  growthStages: [
    {
      title: "Seedling Stage",
      period: "0-25 days",
      keyPoints: ["Healthy nursery growth", "Harden seedlings before transplanting"],
    },
    {
      title: "Vegetative Growth",
      period: "25-45 days",
      keyPoints: ["Develop strong foliage", "Apply balanced nutrition"],
    },
    {
      title: "Flowering and Fruiting",
      period: "45-75 days",
      keyPoints: ["Support pollination", "Ensure calcium and boron availability"],
    },
    {
      title: "Harvesting",
      period: "75-95 days",
      keyPoints: ["Harvest at full color", "Prevent over-ripening and cracking"],
    },
  ],
  interculturalOperations: [
    "Stake plants for support and cleaner fruits.",
    "Remove side shoots and maintain 2-3 stems where required.",
    "Mulch to reduce evaporation and suppress weeds.",
  ],
  weedManagement: [
    {
      weedName: "Cyperus rotundus",
      scientificName: "Cyperus rotundus",
      type: "Sedge",
      criticalPeriod: "First 30 days",
      preEmergenceHerbicide: "Pendimethalin 1.0-1.5 L/acre",
      postEmergenceHerbicide: "Quizalofop 400 ml/acre",
      hracGroup: "HRAC O / A",
      dose: "As per label recommendation",
    },
  ],
  pestManagement: [
    {
      pestName: "Whitefly",
      scientificName: "Bemisia tabaci",
      identification: "Small white insects on lower leaf surface",
      symptoms: ["Yellowing", "Honeydew and sooty mold"],
      etl: "More than 5 adults per leaf",
      biologicalControl: ["Release Encarsia parasitoids", "Encourage predator spiders"],
      chemicalControl: ["Use recommended insecticide only when ETL crosses"],
      iracGroup: "IRAC 4A",
      activeIngredient: "Imidacloprid",
      dose: "0.3-0.4 ml/L",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "Early Blight",
      pathogen: "Alternaria solani",
      type: "Fungal",
      symptoms: ["Target-like leaf spots", "Yellowing and defoliation"],
      favourableConditions: ["High humidity", "Warm weather", "Crowded canopy"],
      integratedManagement: ["Use resistant varieties", "Maintain airflow", "Remove infected leaves"],
      biologicalControl: ["Trichoderma spray or seedling drench"],
      chemicalControl: ["Use fungicide rotation as per local recommendation"],
      fracGroup: "FRAC M5",
      activeIngredient: "Mancozeb",
      dose: "2.0 g/L",
      waitingPeriod: "5 days",
    },
  ],
  physiologicalDisorders: [
    "Blossom end rot: manage calcium and irrigation consistency.",
    "Fruit cracking: avoid sudden irrigation and high humidity.",
  ],
  nutrientDeficiencies: [
    {
      name: "Nitrogen",
      role: "Promotes vegetative growth and leaf development",
      deficiencySymptoms: ["Pale older leaves", "Stunted growth"],
      excessSymptoms: ["Excessive leafy growth", "Delayed flowering"],
      management: ["Apply split nitrogen applications", "Use compost and organic matter"],
      recommendedFertilizers: ["Urea", "Neem-coated urea"],
    },
    {
      name: "Boron",
      role: "Supports flowering and fruit set",
      deficiencySymptoms: ["Poor flowering", "Fruit cracking"],
      excessSymptoms: ["Leaf tip burn", "Reduced growth"],
      management: ["Use boron-based foliar spray", "Avoid over-application"],
      recommendedFertilizers: ["Boron spray", "Borax in low dose"],
    },
  ],
  harvesting: [
    "Harvest when fruits attain full color and firm texture.",
    "Avoid harvesting during heavy dew to reduce disease spread.",
  ],
  yield: "180-220 quintals per acre under good management",
  storage: [
    "Store in cool shaded areas.",
    "Keep fruits dry and avoid bruising.",
  ],
  marketInformation: {
    majorMarkets: ["Local mandi", "Processing units", "Retail wholesalers"],
    demand: "Strong demand in fresh and processing markets",
    msp: "No fixed MSP",
    priceTrend: "Seasonal and market-sensitive",
  },
  faqs: [
    {
      question: "What is the best planting time for tomato?",
      answer: "Tomato is commonly transplanted in the late monsoon or early winter season depending on the region and variety.",
    },
    {
      question: "How often should tomato be irrigated?",
      answer: "Frequent but moderate irrigation works best, especially during flowering and fruit enlargement.",
    },
  ],
};

const potatoProfile: CropManagementProfile = {
  slug: "potato",
  name: "Potato",
  scientificName: "Solanum tuberosum",
  category: "Vegetables",
  image: "/images/potato.png",
  summary: "A high-yielding tuber crop that needs proper seed size, balanced nutrition and disease management.",
  overview:
    "Potato is an important food and cash crop cultivated for tubers. It performs best under cool weather, good soil aeration and careful management of late blight.",
  climate: "Cool climate with moderate temperatures and adequate sunlight.",
  soil: "Well-drained loamy soil with good organic content and pH 5.5-6.5.",
  landPreparation: [
    "Deep ploughing and proper leveling.",
    "Add 10-12 tonnes FYM per acre before planting.",
    "Prepare ridges or beds before planting seed tubers.",
  ],
  seedSelection: [
    "Select certified seed tubers of proper size and healthy appearance.",
    "Use disease-free planting material from reliable sources.",
  ],
  seedTreatment: [
    "Treat seed tubers with a recommended fungicide before planting.",
    "Use bioagents to reduce soil-borne diseases.",
  ],
  sowingTime: [
    "Planting generally begins in early winter under Indian conditions.",
    "Avoid planting during extreme cold or hot spells.",
  ],
  seedRate: "1.5-2.0 tonnes per acre",
  spacing: "60 × 20 cm",
  nursery: [
    "No nursery is required; use seed tubers directly.",
    "Cut larger tubers into seed pieces with at least one eye.",
  ],
  transplanting: [
    "Plant seed pieces at proper depth for uniform emergence.",
    "Ensure spacing and ridge formation for tuber development.",
  ],
  irrigationSchedule: [
    "Light irrigation immediately after planting.",
    "Maintain moisture during tuber initiation and bulking.",
    "Avoid excess water near maturity.",
  ],
  fertilizerSchedule: [
    "Apply basal dose of NPK before planting.",
    "Use top dressing as tubers begin forming.",
    "Supplement with potassium for good tuber bulking.",
  ],
  micronutrients: ["Zinc", "Boron", "Sulfur in deficient soils"],
  growthStages: [
    {
      title: "Sprouting",
      period: "0-15 days",
      keyPoints: ["Seed pieces sprout and establish", "Ensure proper moisture"],
    },
    {
      title: "Vegetative Growth",
      period: "15-35 days",
      keyPoints: ["Develop canopy", "Protect from early blight"],
    },
    {
      title: "Tuber Initiation",
      period: "35-55 days",
      keyPoints: ["Support tuber formation", "Maintain balanced irrigation"],
    },
    {
      title: "Tuber Bulking",
      period: "55-90 days",
      keyPoints: ["Optimize nutrition and water", "Monitor late blight"],
    },
  ],
  interculturalOperations: [
    "Hill up soil to protect developing tubers.",
    "Perform weeding early and keep the field clean.",
  ],
  weedManagement: [
    {
      weedName: "Parthenium",
      scientificName: "Parthenium hysterophorus",
      type: "Broadleaf",
      criticalPeriod: "First 30 days",
      preEmergenceHerbicide: "Metribuzin as per label",
      postEmergenceHerbicide: "Quizalofop",
      hracGroup: "HRAC C3 / A",
      dose: "As per local recommendation",
    },
  ],
  pestManagement: [
    {
      pestName: "Aphids",
      scientificName: "Myzus persicae",
      identification: "Small sap-sucking insects on tender shoots",
      symptoms: ["Curling leaves", "Stunted growth"],
      etl: "Above 10 aphids per 100 compound leaves",
      biologicalControl: ["Ladybird beetle release", "Conserve natural predators"],
      chemicalControl: ["Apply insecticide only above ETL"],
      iracGroup: "IRAC 4A",
      activeIngredient: "Imidacloprid",
      dose: "0.3 ml/L",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "Late Blight",
      pathogen: "Phytophthora infestans",
      type: "Oomycete",
      symptoms: ["Water-soaked lesions", "White fungal growth under humid conditions"],
      favourableConditions: ["Cool humid weather", "Cloudy periods", "Dense canopy"],
      integratedManagement: ["Use resistant varieties", "Avoid overhead irrigation", "Remove infected foliage"],
      biologicalControl: ["Trichoderma-based application"],
      chemicalControl: ["Fungicide rotation as per recommendation"],
      fracGroup: "FRAC 40",
      activeIngredient: "Metalaxyl-M",
      dose: "2 g/L",
      waitingPeriod: "7 days",
    },
  ],
  physiologicalDisorders: [
    "Hollow heart: manage irrigation and nutrition balance.",
    "Greening: avoid exposure of tubers to sunlight.",
  ],
  nutrientDeficiencies: [
    {
      name: "Potassium",
      role: "Improves tuber size and quality",
      deficiencySymptoms: ["Leaf margin burn", "Poor bulking"],
      excessSymptoms: ["Reduced uptake of magnesium", "Salt stress"],
      management: ["Apply MOP at appropriate stage", "Maintain regular irrigation"],
      recommendedFertilizers: ["MOP", "Sulphate of potash"],
    },
  ],
  harvesting: [
    "Harvest when tubers attain marketable size and skin sets properly.",
    "Avoid harvesting in wet soil to prevent bruising and rotting.",
  ],
  yield: "140-180 quintals per acre under good management",
  storage: [
    "Store in cool, dark and well-ventilated storage.",
    "Cure tubers before storage and sort damaged material.",
  ],
  marketInformation: {
    majorMarkets: ["Seed potato traders", "Fresh market", "Cold storage chains"],
    demand: "Stable demand for food and processing",
    msp: "No fixed MSP",
    priceTrend: "Sensitive to storage and market arrival",
  },
  faqs: [
    {
      question: "How can late blight be controlled?",
      answer: "Use resistant varieties, maintain spacing, avoid wet foliage and follow fungicide schedules.",
    },
  ],
};

const paddyProfile: CropManagementProfile = {
  slug: "paddy",
  name: "Paddy (Transplanted)",
  scientificName: "Oryza sativa L.",
  category: "Cereals",
  image: "/images/paddy.png",
  summary: "Staple cereal crop requiring precise water management, balanced NPK and IPM during tillering and panicle initiation.",
  overview:
    "Transplanted paddy is the dominant rice cultivation system in India. Critical growth stages include tillering (15–45 DAS), panicle initiation (45–60 DAS), and grain filling (75–105 DAS).",
  climate: "Hot humid tropical/sub-tropical; 20–35°C during growth; 1000–2000 mm rainfall or irrigation.",
  soil: "Clay loam to loam; pH 5.5–7.0; good water retention capacity.",
  landPreparation: [
    "Deep ploughing and puddling for transplanted rice.",
    "Level field for uniform water depth (2–5 cm).",
    "Apply 10–12 t FYM/ha during final puddling.",
  ],
  seedSelection: [
    "Use certified seeds of high-yielding varieties (HYV) or hybrids.",
    "Select seeds with >80% germination from authorized sources.",
  ],
  seedTreatment: [
    "Seed treatment with Carbendazim 2 g/kg seed.",
    "Trichoderma viride 10 g/kg for soil-borne disease suppression.",
  ],
  sowingTime: [
    "Nursery sowing: May–June (Kharif); Nov–Dec (Rabi in some regions).",
    "Transplanting: 25–30 days after nursery sowing at 2–3 leaf stage.",
    "Optimal transplanting window: June–July for Kharif season.",
  ],
  seedRate: "40–50 kg/ha (nursery); 2–3 seedlings/hill in main field",
  spacing: "20 × 15 cm (transplanted); 20 × 10 cm for high density",
  nursery: [
    "Raise nursery on raised beds 1.0 m wide with drainage channels.",
    "Apply 2 kg urea + 2 kg SSP per 100 m² nursery area.",
  ],
  transplanting: [
    "Transplant 25–30 day old seedlings with 2–3 seedlings per hill.",
    "Maintain 2–3 cm standing water immediately after transplanting.",
    "Avoid deep planting — root collar at soil surface.",
  ],
  irrigationSchedule: [
    "0–7 DAS: Maintain 2–3 cm standing water after transplanting.",
    "15–45 DAS (Tillering): Shallow flooding 5 cm; critical for tiller production.",
    "45–60 DAS (Panicle initiation): Most critical stage — no moisture stress allowed.",
    "60–75 DAS (Flowering): Continuous shallow submergence.",
    "75–105 DAS (Grain filling): Gradual water reduction.",
    "105+ DAS: Drain field 7–10 days before harvest.",
  ],
  fertilizerSchedule: [
    "Basal (at transplanting): N 60 + P₂O₅ 30 + K₂O 30 kg/ha + full FYM.",
    "1st top-dress (25 DAS): Urea 50 kg/ha — supports tillering.",
    "2nd top-dress (45 DAS): Urea 50 kg/ha — at panicle initiation.",
    "Micronutrient: ZnSO₄ 25 kg/ha at tillering in deficient soils.",
    "Foliar: 2% DAP spray at panicle initiation for grain set.",
  ],
  micronutrients: [
    "Zinc sulphate 25 kg/ha (Khaira disease prevention)",
    "Iron sulphate foliar 0.5% in iron-deficient soils",
    "Boron 0.2% foliar at flowering if deficiency suspected",
  ],
  growthStages: [
    { title: "Transplanting", period: "0–7 DAS", keyPoints: ["Establish seedlings", "Maintain standing water"] },
    { title: "Tillering", period: "15–45 DAS", keyPoints: ["Maximum tiller production", "1st N top-dress"] },
    { title: "Panicle Initiation", period: "45–60 DAS", keyPoints: ["Critical moisture stage", "2nd N top-dress"] },
    { title: "Grain Filling", period: "75–105 DAS", keyPoints: ["Grain weight determination", "Reduce irrigation gradually"] },
  ],
  interculturalOperations: [
    "Gap filling within 7–10 days of transplanting.",
    "Hand weeding at 20 and 40 DAS or use recommended herbicide.",
  ],
  weedManagement: [
    {
      weedName: "Barnyard grass",
      scientificName: "Echinochloa crus-galli",
      type: "Grassy weed",
      criticalPeriod: "0–30 DAS",
      preEmergenceHerbicide: "Pretilachlor 0.75 kg/ha at 3 DAS",
      postEmergenceHerbicide: "Bispyribac-sodium 25 g/ha at 15–20 DAS",
      hracGroup: "HRAC B",
      dose: "As per label within 15–20 DAS",
    },
  ],
  pestManagement: [
    {
      pestName: "Brown Planthopper",
      scientificName: "Nilaparvata lugens",
      identification: "Brown insects at base of tillers; hopperburn in severe infestation",
      symptoms: ["Circular yellow patches", "Hopperburn", "Graining failure"],
      etl: "5 hoppers per hill (vegetative); 10 per hill (reproductive)",
      biologicalControl: ["Release Cyrtorhinus lividipennis", "Avoid broad-spectrum insecticides"],
      chemicalControl: ["Buprofezin 1 ml/L (IRAC 16)", "Pymetrozine 0.75 g/L (IRAC 9B)"],
      iracGroup: "IRAC 16 / 9B",
      activeIngredient: "Buprofezin",
      dose: "1.0 ml/L; PHI 14 days",
    },
    {
      pestName: "Stem Borer",
      scientificName: "Scirpophaga incertulas",
      identification: "Dead hearts in vegetative stage; white ears in reproductive stage",
      symptoms: ["Dead heart", "White ear head", "Reduced panicle emergence"],
      etl: "5% dead hearts (vegetative); 1 egg mass/m²",
      biologicalControl: ["Trichogramma japonicum release @ 50,000/ha weekly × 6"],
      chemicalControl: ["Cartap hydrochloride 1 kg/ha granules at tillering"],
      iracGroup: "IRAC 14",
      activeIngredient: "Cartap hydrochloride",
      dose: "1 kg/ha granules; PHI 21 days",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "Blast",
      pathogen: "Magnaporthe oryzae (Pyricularia oryzae)",
      type: "Fungal (Ascomycete)",
      symptoms: ["Diamond-shaped leaf lesions with grey center", "Neck blast on panicle", "Node rot"],
      favourableConditions: ["High humidity >90%", "Cool nights 20–25°C", "Excess nitrogen"],
      integratedManagement: ["Use resistant varieties (e.g., Pusa Basmati 1121 with moderate resistance)", "Avoid excess N", "Silicon application 200 kg/ha"],
      biologicalControl: ["Pseudomonas fluorescens seed treatment 10 g/kg"],
      chemicalControl: ["Tricyclazole 0.6 g/L (FRAC 3) at boot leaf stage", "Isoprothiolane 1.5 ml/L"],
      fracGroup: "FRAC 3",
      activeIngredient: "Tricyclazole",
      dose: "0.6 g/L foliar; repeat at 10-day interval if needed",
      waitingPeriod: "21 days",
    },
    {
      diseaseName: "Sheath Blight",
      pathogen: "Rhizoctonia solani AG-1 IA",
      type: "Fungal (Basidiomycete)",
      symptoms: ["Oval greenish-grey lesions on leaf sheath", "Lesions coalesce causing sheath rot", "Unfilled grains"],
      favourableConditions: ["High humidity", "Dense canopy", "Excess nitrogen", "25–32°C"],
      integratedManagement: ["Wider spacing for airflow", "Balanced fertilization", "Remove infected debris"],
      biologicalControl: ["Trichoderma harzianum soil application 2.5 kg/ha"],
      chemicalControl: ["Validamycin 2.5 ml/L (FRAC 32)", "Hexaconazole 1 ml/L (FRAC 3)"],
      fracGroup: "FRAC 32",
      activeIngredient: "Validamycin",
      dose: "2.5 ml/L at first symptom; PHI 15 days",
      waitingPeriod: "15 days",
    },
  ],
  physiologicalDisorders: [
    "Akiochi (straighthead): zinc deficiency + organic matter interaction in drained soils.",
    "Chalky grain: potassium deficiency during grain filling.",
  ],
  nutrientDeficiencies: [
    {
      name: "Nitrogen",
      role: "Primary driver of tiller number, leaf area, and grain protein",
      deficiencySymptoms: ["Uniform pale yellowing of older leaves", "Reduced tiller count", "Stunted growth"],
      excessSymptoms: ["Dark green lush growth", "Increased blast susceptibility", "Lodging"],
      management: ["Split N application at 25 and 45 DAS", "Use LCC (Leaf Colour Chart) for N management"],
      recommendedFertilizers: ["Urea", "Neem-coated urea", "DAP as basal"],
    },
    {
      name: "Zinc",
      role: "Enzyme activation; critical for tillering and grain set",
      deficiencySymptoms: ["Khaira disease: brown rusty spots on midrib", "Dusty brown patches in field", "Stunted plants"],
      excessSymptoms: ["Iron deficiency induced", "Reduced phosphorus uptake"],
      management: ["Apply ZnSO₄ 25 kg/ha at transplanting in alkaline soils", "Foliar 0.5% ZnSO₄ at tillering"],
      recommendedFertilizers: ["Zinc sulphate heptahydrate", "Zinc-enriched NPK"],
    },
    {
      name: "Iron",
      role: "Chlorophyll synthesis; electron transport in photosynthesis",
      deficiencySymptoms: ["Interveinal chlorosis on young leaves", "Severe cases: entire leaf bleached white"],
      excessSymptoms: ["Rare in paddy; may cause manganese deficiency"],
      management: ["Foliar FeSO₄ 0.5–1.0% in calcareous soils", "Improve drainage in waterlogged conditions"],
      recommendedFertilizers: ["Ferrous sulphate foliar", "Fe-EDDHA chelate in severe cases"],
    },
  ],
  harvesting: [
    "Harvest when 80% grains turn golden yellow and moisture is 20–22%.",
    "Cut at 10–15 cm above ground using sickle or combine harvester.",
    "Thresh within 24–48 hours to prevent grain discoloration.",
  ],
  yield: "40–55 quintals/ha (transplanted HYV); 60+ q/ha with SRI methods",
  storage: [
    "Dry grains to 14% moisture before storage.",
    "Use hermetic storage or treat with phosphine fumigation for long-term.",
  ],
  marketInformation: {
    majorMarkets: ["Karnal (Haryana)", "Ludhiana (Punjab)", "Delhi Azadpur", "Kolkata", "Hyderabad"],
    demand: "Stable staple demand; basmati commands export premium",
    msp: "₹2,300/quintal (Common Grade, 2025-26)",
    priceTrend: "Moderate upward in Kharif; basmati peaks Oct–Dec",
  },
  faqs: [
    {
      question: "When is the critical irrigation stage for paddy?",
      answer: "Panicle initiation (45–60 DAS) is the most critical — moisture stress here can reduce yield by 30–50%.",
    },
  ],
};

function mapLegacyCrop(crop: LegacyCrop): CropManagementProfile {
  return {
    slug: crop.slug,
    name: crop.name,
    scientificName: crop.scientificName,
    category: crop.category,
    image: crop.image,
    summary: crop.overview,
    overview: crop.overview,
    climate: crop.climate,
    soil: crop.suitableSoil,
    landPreparation: [
      "Prepare the field well before sowing or transplanting.",
      "Use organic matter and maintain proper field leveling.",
    ],
    seedSelection: ["Use certified seed or healthy seedlings.", "Select strong and vigorous planting material."],
    seedTreatment: [crop.sowingGuide.seedTreatment],
    sowingTime: [crop.sowingGuide.bestSowingTime],
    seedRate: crop.seedRate,
    spacing: crop.spacing,
    nursery: ["Raise nursery as per local recommendation."],
    transplanting: [crop.sowingGuide.sowingMethod],
    irrigationSchedule: crop.irrigationManagement.schedule,
    fertilizerSchedule: [
      ...crop.fertilizerSchedule.basalDose,
      ...crop.fertilizerSchedule.stageWise.flatMap((stage) => stage.details),
    ],
    micronutrients: crop.fertilizerSchedule.micronutrients,
    growthStages: [
      {
        title: "Establishment",
        period: "Early growth",
        keyPoints: ["Ensure good establishment"],
      },
      {
        title: "Development",
        period: "Mid growth",
        keyPoints: ["Support active growth"],
      },
      {
        title: "Reproductive",
        period: "Flowering or grain filling",
        keyPoints: ["Support yield formation"],
      },
    ],
    interculturalOperations: ["Use timely interculture and mulching."],
    weedManagement: [
      {
        weedName: "Common weed",
        scientificName: "Mixed flora",
        type: "General",
        criticalPeriod: "Early crop growth",
        preEmergenceHerbicide: "Follow local recommendation",
        postEmergenceHerbicide: "Follow local recommendation",
        hracGroup: "HRAC",
        dose: "As per label",
      },
    ],
    pestManagement: [
      {
        pestName: "Major pest",
        scientificName: "Local pest",
        identification: "Check local agronomic guidance",
        symptoms: ["Observe field regularly"],
        etl: "Follow local ETL",
        biologicalControl: ["Conserve natural enemies"],
        chemicalControl: ["Use pesticide only when required"],
        iracGroup: "IRAC",
        activeIngredient: "Follow label",
        dose: "As per label",
      },
    ],
    diseaseManagement: [
      {
        diseaseName: "Major disease",
        pathogen: "Follow diagnosis",
        type: "Field dependent",
        symptoms: ["Inspect field regularly"],
        favourableConditions: ["High humidity", "Dense canopy"],
        integratedManagement: ["Use disease-free seed and sanitation"],
        biologicalControl: ["Use biological options where available"],
        chemicalControl: ["Follow disease-specific recommendation"],
        fracGroup: "FRAC",
        activeIngredient: "Follow label",
        dose: "As per label",
        waitingPeriod: "As per label",
      },
    ],
    physiologicalDisorders: ["Observe crop stress and manage irrigation pace."],
    nutrientDeficiencies: crop.nutrientDeficiencies.map((item) => ({
      name: item.nutrient,
      role: "Supports crop growth",
      deficiencySymptoms: [item.symptoms],
      excessSymptoms: ["Excess application may cause imbalance"],
      management: [item.solution],
      recommendedFertilizers: [item.solution],
    })),
    harvesting: [crop.harvestAndYield.harvestingTime, ...crop.harvestAndYield.storageTips],
    yield: crop.harvestAndYield.yield,
    storage: crop.harvestAndYield.storageTips,
    marketInformation: crop.marketInformation,
    faqs: [
      {
        question: "How to manage this crop effectively?",
        answer: "Follow balanced nutrition, timely irrigation and recommended crop protection schedules.",
      },
    ],
  };
}

export const cropManagementCatalog: CropManagementProfile[] = [
  tomatoProfile,
  potatoProfile,
  paddyProfile,
  ...legacyCrops.map(mapLegacyCrop),
];

export function getCropManagementProfile(slug: string): CropManagementProfile | null {
  return cropManagementCatalog.find((crop) => crop.slug === slug) ?? null;
}
