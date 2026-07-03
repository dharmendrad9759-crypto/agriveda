                  import type { CropManagementProfile } from "@/types/crop-management";

/**
 * Paddy (transplanted) — protection protocols aligned with
 * IRAC Ed. 11.5 / FRAC 2024 / HRAC numeric codes (user PDFs)
 * and common Indian market products in data/spray-products.ts.
 */
export const paddyProfile: CropManagementProfile = {
  slug: "paddy",
  name: "Paddy (Transplanted)",
  scientificName: "Oryza sativa L.",
  category: "Cereals",
  image: "/images/paddy.png",
  summary:
    "Staple cereal requiring precise water management, balanced NPK, and IPM during tillering and panicle initiation.",
  overview:
    "Transplanted paddy is the dominant rice system in India. Critical stages: tillering (15–45 DAS), panicle initiation (45–60 DAS), and grain filling (75–105 DAS). Rotate IRAC/FRAC groups — never spray the same MoA back-to-back.",
  climate: "Hot humid tropical/sub-tropical; 20–35°C; 1000–2000 mm rainfall or irrigation.",
  soil: "Clay loam to loam; pH 5.5–7.0; good water retention.",
  landPreparation: [
    "Deep ploughing and puddling for transplanted rice.",
    "Level field for uniform water depth (2–5 cm).",
    "Apply 10–12 t FYM/ha during final puddling.",
  ],
  seedSelection: [
    "Use certified HYV or hybrid seed from authorized sources.",
    "Select seed with >80% germination.",
  ],
  seedTreatment: [
    "Carbendazim 50 WP @ 2 g/kg seed (FRAC 1).",
    "Trichoderma viride 1% WP @ 10 g/kg for soil-borne pathogens.",
  ],
  sowingTime: [
    "Nursery: May–June (Kharif); Nov–Dec (Rabi in some regions).",
    "Transplant 25–30 day seedlings at 2–3 leaf stage.",
    "Kharif transplanting window: June–July.",
  ],
  seedRate: "40–50 kg/ha (nursery); 2–3 seedlings/hill in main field",
  spacing: "20 × 15 cm (transplanted); 20 × 10 cm for high density",
  nursery: [
    "Raised beds 1.0 m wide with drainage channels.",
    "Apply 2 kg urea + 2 kg SSP per 100 m² nursery.",
  ],
  transplanting: [
    "Transplant 25–30 day seedlings, 2–3 per hill.",
    "Maintain 2–3 cm standing water immediately after transplanting.",
    "Avoid deep planting — root collar at soil surface.",
  ],
  irrigationSchedule: [
    "0–7 DAS: 2–3 cm standing water.",
    "15–45 DAS (Tillering): Shallow flooding ~5 cm.",
    "45–60 DAS (Panicle initiation): Most critical — no moisture stress.",
    "60–75 DAS (Flowering): Continuous shallow submergence.",
    "75–105 DAS: Gradual water reduction.",
    "Drain field 7–10 days before harvest.",
  ],
  fertilizerSchedule: [
    "Basal: N 60 + P₂O₅ 30 + K₂O 30 kg/ha + full FYM.",
    "1st top-dress (25 DAS): Urea 50 kg/ha.",
    "2nd top-dress (45 DAS): Urea 50 kg/ha at panicle initiation.",
    "ZnSO₄ 25 kg/ha at tillering in deficient soils.",
  ],
  micronutrients: [
    "Zinc sulphate 25 kg/ha (Khaira disease prevention)",
    "Iron sulphate foliar 0.5% in iron-deficient soils",
    "Boron 0.2% foliar at flowering if needed",
  ],
  growthStages: [
    { title: "Transplanting", period: "0–7 DAS", keyPoints: ["Establish seedlings", "Standing water"] },
    { title: "Tillering", period: "15–45 DAS", keyPoints: ["Max tillers", "1st N top-dress", "BPH & blast watch"] },
    { title: "Panicle Initiation", period: "45–60 DAS", keyPoints: ["Critical moisture", "2nd N", "Stem borer / sheath blight"] },
    { title: "Grain Filling", period: "75–105 DAS", keyPoints: ["Grain weight", "Reduce irrigation"] },
  ],
  interculturalOperations: [
    "Gap filling within 7–10 days of transplanting.",
    "Hand weeding at 20 and 40 DAS if herbicide not used.",
  ],

  weedManagement: [
    {
      weedName: "Barnyard Grass (Sanwa)",
      scientificName: "Echinochloa crus-galli",
      type: "Grassy",
      criticalPeriod: "0–45 DAS",
      preEmergenceHerbicide: "Pretilachlor 50 EC (e.g. Refit / Sofit) @ 0.6–0.75 kg a.i./ha at 3 DAS on moist soil",
      postEmergenceHerbicide: "Bispyribac-sodium 10 SC (e.g. Nominee Gold) @ 25 g a.i./ha at 15–20 DAS",
      hracGroup: "HRAC 15 (pre) / HRAC 2 (post)",
      dose: "Pre: 1.2–1.5 L/ha product in 500 L water; Post: 250 ml/ha product when weeds 2–4 leaf",
    },
    {
      weedName: "Flat Sedge (Motha)",
      scientificName: "Cyperus iria",
      type: "Sedge",
      criticalPeriod: "15–60 DAS",
      preEmergenceHerbicide: "Pretilachlor 50 EC + Pyrazosulfuron-ethyl 10 WP (tank mix or ready mix)",
      postEmergenceHerbicide: "Bispyribac-sodium 10 SC @ 25 g a.i./ha or Pyrazosulfuron 10 WP @ 20 g a.i./ha",
      hracGroup: "HRAC 15 + 2",
      dose: "Pyrazosulfuron 200 g/ha product at 3–5 DAS; maintain 5 cm standing water",
    },
    {
      weedName: "Monochoria / Broadleaf weeds",
      scientificName: "Monochoria vaginalis",
      type: "Broadleaf",
      criticalPeriod: "20–50 DAS",
      preEmergenceHerbicide: "Pretilachlor 50 EC @ 0.6 kg a.i./ha",
      postEmergenceHerbicide: "2,4-D Na salt 80 WP @ 0.5 kg a.i./ha (direct-seeded only; avoid on basmati at PI)",
      hracGroup: "HRAC 15 / HRAC 4",
      dose: "2,4-D: 625 g/ha product in 500 L water; hand weed at 20 & 40 DAS if needed",
    },
  ],

  pestManagement: [
    {
      pestName: "Brown Planthopper (BPH)",
      scientificName: "Nilaparvata lugens",
      identification:
        "Small brown hoppers at base of tillers; plants turn yellow in circular patches (hopperburn).",
      symptoms: [
        "Circular yellow patches in field",
        "Hopperburn — plants dry from base",
        "Honeydew and sooty mould on lower leaves",
        "Poor grain filling in severe cases",
      ],
      etl: "5–10 hoppers/hill (vegetative); 10–20/hill (reproductive) — count at base of plant",
      biologicalControl: [
        "Conserve Cyrtorhinus lividipennis (mirid bug)",
        "Avoid early broad-spectrum sprays that kill natural enemies",
        "Alternate wetting and drying reduces BPH build-up",
      ],
      chemicalControl: [
        "Buprofezin 25 SC (e.g. Applaud) — IRAC 16",
        "Pymetrozine 50 WG (e.g. Chess) — IRAC 9B",
        "Triflumezopyrim 106 SC (e.g. Pexalon) — IRAC 4E (rotate; do not use 4A neonics back-to-back)",
        "Never spray same IRAC group in consecutive sprays",
      ],
      iracGroup: "IRAC 16 / 9B / 4E",
      activeIngredient: "Buprofezin 25 SC",
      dose: "1.0 ml/L (≈200–250 ml/ha); PHI 14 days. Alternate with Pymetrozine 0.75 g/L or Triflumezopyrim 0.5 ml/L",
    },
    {
      pestName: "Yellow Stem Borer",
      scientificName: "Scirpophaga incertulas",
      identification:
        "Dead hearts in vegetative stage; white ear heads at reproductive stage; larvae bore inside stem.",
      symptoms: [
        "Dead heart — central shoot dries and pulls out easily",
        "White ear — empty chaffy panicle",
        "Bore holes and frass in stem",
      ],
      etl: "5% dead hearts (vegetative) or 1 egg mass/m²; 1% white ears (reproductive)",
      biologicalControl: [
        "Trichogramma japonicum @ 50,000/ha weekly × 6 releases from 30 DAS",
        "Light traps @ 1/ha for monitoring",
        "Clip seedling tips before transplant to remove egg masses",
      ],
      chemicalControl: [
        "Cartap hydrochloride 50 SP / 4G — IRAC 14",
        "Chlorantraniliprole 18.5 SC (e.g. Coragen / Rynaxypyr) — IRAC 28",
        "Fipronil 0.3 GR (e.g. Regent) in nursery/early field — IRAC 2B",
      ],
      iracGroup: "IRAC 14 / 28",
      activeIngredient: "Cartap hydrochloride 50 SP",
      dose: "1 kg/ha granules at tillering OR 1 g/L spray; Chlorantraniliprole 0.4 ml/L; PHI 21 days (cartap)",
    },
    {
      pestName: "Leaf Folder",
      scientificName: "Cnaphalocrocis medinalis",
      identification:
        "Leaves folded longitudinally and scraped white; larvae inside fold.",
      symptoms: [
        "Longitudinal leaf folds",
        "White scraped patches on leaves",
        "Reduced photosynthesis and grain filling",
      ],
      etl: "1–2 freshly damaged leaves/hill or 10% leaves damaged",
      biologicalControl: [
        "Trichogramma release",
        "Avoid excess nitrogen which increases leaf folder",
      ],
      chemicalControl: [
        "Flubendiamide 20 WG — IRAC 28",
        "Spinosad 45 SC — IRAC 5",
        "Chlorantraniliprole 18.5 SC — IRAC 28 (rotate with IRAC 5)",
      ],
      iracGroup: "IRAC 28 / 5",
      activeIngredient: "Flubendiamide 20 WG",
      dose: "0.25 g/L (≈50 g/ha); Spinosad 0.3 ml/L; PHI 14–21 days as per label",
    },
    {
      pestName: "Rice Armyworm / Swarming Caterpillar",
      scientificName: "Spodoptera mauritia / Mythimna separata",
      identification:
        "Larvae feed on leaves at night; can defoliate patches overnight after rain.",
      symptoms: [
        "Skeletonised or completely eaten leaves",
        "Larvae hide in soil/cracks by day",
        "Rapid patchy damage after rains",
      ],
      etl: "1–2 larvae/hill or visible defoliation patches",
      biologicalControl: [
        "Flood field briefly to drown larvae where possible",
        "Light traps for moth monitoring",
      ],
      chemicalControl: [
        "Emamectin benzoate 5 SG (e.g. Proclaim) — IRAC 6",
        "Chlorantraniliprole 18.5 SC — IRAC 28",
        "Spray in evening when larvae are active",
      ],
      iracGroup: "IRAC 6 / 28",
      activeIngredient: "Emamectin benzoate 5 SG",
      dose: "0.4 g/L (≈80–100 g/ha); PHI 14 days",
    },
    {
      pestName: "Green Leafhopper (GLH)",
      scientificName: "Nephotettix virescens",
      identification:
        "Green hoppers on leaves; important vector of rice tungro virus.",
      symptoms: [
        "Yellowing of leaves",
        "Stunted plants if tungro transmitted",
        "Hopper populations on upper canopy",
      ],
      etl: "5–10 hoppers/hill; act early if tungro history in area",
      biologicalControl: [
        "Remove weed hosts around field",
        "Synchronised planting in village reduces vector pressure",
      ],
      chemicalControl: [
        "Imidacloprid 200 SL (e.g. Confidor) — IRAC 4A",
        "Thiamethoxam 25 WG (e.g. Actara) — IRAC 4A",
        "Acetamiprid 20 SP (e.g. Pride) — IRAC 4A — rotate away from 4A after one use",
      ],
      iracGroup: "IRAC 4A",
      activeIngredient: "Imidacloprid 200 SL",
      dose: "0.3 ml/L; Thiamethoxam 0.2 g/L; PHI 14–21 days",
    },
  ],

  diseaseManagement: [
    {
      diseaseName: "Rice Blast",
      pathogen: "Magnaporthe oryzae (Pyricularia oryzae)",
      type: "Fungal",
      symptoms: [
        "Diamond-shaped leaf lesions with grey centre and brown margin",
        "Neck blast — blackened panicle neck, chaffy grains",
        "Node rot causing plant breakage",
      ],
      favourableConditions: [
        "Humidity >90%",
        "Cool nights 20–25°C",
        "Excess nitrogen",
        "Prolonged leaf wetness",
      ],
      integratedManagement: [
        "Avoid excess N — use Leaf Colour Chart (LCC)",
        "Silicon application 200 kg/ha reduces severity",
        "Use moderately resistant varieties where available",
        "Rotate FRAC groups — Tricyclazole is FRAC 16.1, not DMI group 3",
      ],
      biologicalControl: ["Pseudomonas fluorescens seed treatment 10 g/kg"],
      chemicalControl: [
        "Tricyclazole 75 WP (e.g. Beam / Sivic) — FRAC 16.1 @ boot leaf",
        "Isoprothiolane 40 EC — FRAC 6",
        "Azoxystrobin 250 SC — FRAC 11 (rotate; high resistance risk)",
        "Nativo (Trifloxystrobin + Tebuconazole) — FRAC 11+3",
      ],
      fracGroup: "FRAC 16.1 / 6 / 11",
      activeIngredient: "Tricyclazole 75 WP",
      dose: "0.6 g/L (≈120 g/ha) at boot leaf; repeat after 10 days if needed; PHI 21 days",
      waitingPeriod: "21 days",
    },
    {
      diseaseName: "Sheath Blight",
      pathogen: "Rhizoctonia solani AG-1 IA",
      type: "Fungal",
      symptoms: [
        "Oval greenish-grey lesions on leaf sheath near water line",
        "Lesions coalesce; sheath and leaves dry",
        "Unfilled grains and lodging in severe cases",
      ],
      favourableConditions: [
        "High humidity and dense canopy",
        "Excess nitrogen",
        "25–32°C",
        "Close spacing",
      ],
      integratedManagement: [
        "Wider spacing for airflow",
        "Balanced NPK — avoid excess N",
        "Remove infected debris after harvest",
      ],
      biologicalControl: ["Trichoderma harzianum soil application 2.5 kg/ha"],
      chemicalControl: [
        "Validamycin 3 L — FRAC 26",
        "Hexaconazole 5 EC — FRAC 3",
        "Propiconazole 25 EC (e.g. Tilt) — FRAC 3 (rotate with Validamycin)",
      ],
      fracGroup: "FRAC 26 / 3",
      activeIngredient: "Validamycin 3 L",
      dose: "2.5 ml/L at first symptom; Hexaconazole 1 ml/L alternate spray; PHI 15 days",
      waitingPeriod: "15 days",
    },
    {
      diseaseName: "Bacterial Leaf Blight (BLB)",
      pathogen: "Xanthomonas oryzae pv. oryzae",
      type: "Bacterial",
      symptoms: [
        "Water-soaked lesions on leaf margins turning yellow then white",
        "Kresek — wilting of seedlings/tillers",
        "Milky bacterial ooze on lesions in morning",
      ],
      favourableConditions: [
        "Heavy rain and wind",
        "Excess nitrogen",
        "Wounds from storms or insects",
      ],
      integratedManagement: [
        "Resistant varieties (IR 64, Swarna-Sub1 where suitable)",
        "Avoid excess N",
        "Brief drainage to reduce canopy humidity",
        "Clean tools and avoid working in wet fields",
      ],
      biologicalControl: ["Pseudomonas fluorescens foliar 10 g/L as preventive"],
      chemicalControl: [
        "Streptocycline 90 SP (streptomycin + tetracycline) — FRAC 25+41",
        "Copper oxychloride 50 WP (e.g. Blitox) — FRAC M1",
        "Tank-mix Streptocycline + Copper for better control",
      ],
      fracGroup: "FRAC 25 + M1",
      activeIngredient: "Streptocycline + Copper oxychloride",
      dose: "Streptocycline 0.15 g/L + Copper oxychloride 3 g/L; 2 sprays at 10-day interval",
      waitingPeriod: "15 days",
    },
    {
      diseaseName: "Brown Spot",
      pathogen: "Bipolaris oryzae (Helminthosporium oryzae)",
      type: "Fungal",
      symptoms: [
        "Oval brown spots with grey centre on leaves",
        "Spots on glumes — grain discolouration",
        "More severe in nutrient-poor soils",
      ],
      favourableConditions: [
        "Nutrient deficiency (especially K, Si)",
        "Water stress",
        "High humidity",
      ],
      integratedManagement: [
        "Balanced fertilization — correct K and Zn deficiency",
        "Use healthy seed",
        "Avoid continuous rice–rice without residue management",
      ],
      biologicalControl: ["Seed treatment with Trichoderma 10 g/kg"],
      chemicalControl: [
        "Mancozeb 75 WP — FRAC M3",
        "Propiconazole 25 EC — FRAC 3",
        "Carbendazim 50 WP — FRAC 1 (seed treatment preferred)",
      ],
      fracGroup: "FRAC M3 / 3",
      activeIngredient: "Mancozeb 75 WP",
      dose: "2 g/L foliar; Propiconazole 1 ml/L if severe; PHI 15–21 days",
      waitingPeriod: "15 days",
    },
    {
      diseaseName: "False Smut",
      pathogen: "Ustilaginoidea virens",
      type: "Fungal",
      symptoms: [
        "Orange to greenish-black spore balls replacing grains",
        "Few to many grains per panicle affected",
        "Late infection after flowering",
      ],
      favourableConditions: [
        "High humidity at flowering",
        "Excess nitrogen at PI",
        "Late-maturing varieties",
      ],
      integratedManagement: [
        "Avoid excess N at panicle initiation",
        "Remove infected panicles from seed plots",
        "Deep ploughing of infected residue",
      ],
      biologicalControl: ["No strong bio-control — focus on cultural + chemical at boot"],
      chemicalControl: [
        "Propiconazole 25 EC — FRAC 3 at boot leaf to early flowering",
        "Copper oxychloride 50 WP — FRAC M1",
      ],
      fracGroup: "FRAC 3 / M1",
      activeIngredient: "Propiconazole 25 EC",
      dose: "1 ml/L at boot leaf stage; PHI 30 days",
      waitingPeriod: "30 days",
    },
  ],

  physiologicalDisorders: [
    "Akiochi (straighthead): zinc deficiency + organic matter interaction in drained soils.",
    "Chalky grain: potassium deficiency during grain filling.",
    "Khaira disease: zinc deficiency — rusty brown spots on midrib.",
  ],
  nutrientDeficiencies: [
    {
      name: "Nitrogen",
      role: "Tiller number, leaf area, grain protein",
      deficiencySymptoms: ["Pale yellow older leaves", "Reduced tillers", "Stunted growth"],
      excessSymptoms: ["Dark green lush growth", "More blast & BPH", "Lodging"],
      management: ["Split N at 25 and 45 DAS", "Use LCC for N management"],
      recommendedFertilizers: ["Urea", "Neem-coated urea", "DAP basal"],
    },
    {
      name: "Zinc",
      role: "Enzyme activation; tillering and grain set",
      deficiencySymptoms: ["Khaira — brown rusty spots on midrib", "Dusty brown field patches"],
      excessSymptoms: ["May induce iron deficiency"],
      management: ["ZnSO₄ 25 kg/ha at transplanting", "Foliar 0.5% ZnSO₄ at tillering"],
      recommendedFertilizers: ["Zinc sulphate heptahydrate"],
    },
    {
      name: "Iron",
      role: "Chlorophyll synthesis",
      deficiencySymptoms: ["Interveinal chlorosis on young leaves", "Bleached white leaves in severe cases"],
      excessSymptoms: ["Rare; may induce Mn deficiency"],
      management: ["Foliar FeSO₄ 0.5–1.0% in calcareous soils"],
      recommendedFertilizers: ["Ferrous sulphate foliar"],
    },
  ],
  harvesting: [
    "Harvest when 80% grains are golden yellow (20–22% moisture).",
    "Cut 10–15 cm above ground.",
    "Thresh within 24–48 hours.",
  ],
  yield: "40–55 q/ha (transplanted HYV); 60+ q/ha with SRI",
  storage: [
    "Dry to 14% moisture before storage.",
    "Hermetic storage or phosphine fumigation for long-term.",
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
      answer:
        "Panicle initiation (45–60 DAS) is most critical — moisture stress here can cut yield by 30–50%.",
    },
    {
      question: "Why did my spray fail on BPH?",
      answer:
        "Often wrong MoA rotation or spray only on canopy. BPH sits at the base — direct spray to plant base and rotate IRAC 16 / 9B / 4E. Avoid repeated IRAC 4A neonics.",
    },
    {
      question: "Tricyclazole is which FRAC group?",
      answer:
        "FRAC 16.1 (melanin biosynthesis), not FRAC 3. Do not treat it as a DMI/triazole for rotation planning.",
    },
  ],
};
