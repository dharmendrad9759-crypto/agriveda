import type { CropManagementProfile } from "@/types/crop-management";

/**
 * Chilli (Capsicum annuum) — protection protocols with IRAC/FRAC/HRAC
 * codes aligned to data/moa-lookup.ts and Indian market products.
 */
export const chilliProfile: CropManagementProfile = {
  slug: "chilli",
  name: "Chilli (Mirch)",
  scientificName: "Capsicum annuum L.",
  category: "Vegetables",
  image: "/images/chilli.png",
  summary:
    "High-value spice/vegetable crop. Success depends on thrips–whitefly–virus management, drip irrigation, and balanced nutrition during flowering and fruiting.",
  overview:
    "Chilli is grown for green and dry fruit across India. Major yield losses come from thrips, yellow mite, fruit borer, anthracnose, and leaf curl virus (whitefly-transmitted). Rotate IRAC/FRAC groups — never spray the same MoA back-to-back.",
  climate: "Warm (20–30°C optimum). Sensitive to frost and prolonged waterlogging. Needs bright sunlight.",
  soil: "Well-drained sandy loam to loam, rich in organic matter; pH 6.0–7.0.",
  landPreparation: [
    "Deep plough + 2–3 harrowings for fine tilth.",
    "Apply FYM / compost 10–12 t/ha and incorporate.",
    "Prepare raised beds or ridges for drip + mulch systems.",
  ],
  seedSelection: [
    "Use certified hybrid or improved open-pollinated seed suited to market (green / dry / dual).",
    "Prefer leaf-curl and thrips-tolerant varieties where available (e.g. Arka series, local recommended hybrids).",
  ],
  seedTreatment: [
    "Carbendazim 50 WP @ 2 g/kg seed (FRAC 1).",
    "Trichoderma viride 1% WP @ 10 g/kg for damping-off.",
    "Imidacloprid 30 FS @ 5–7 ml/kg seed for early sucking pests (IRAC 4A) — optional.",
  ],
  sowingTime: [
    "Nursery: June–July (Kharif); Oct–Nov (Rabi in many states).",
    "Transplant 30–35 day seedlings at 4–5 leaf stage.",
    "Avoid transplanting into waterlogged or very hot dry soil.",
  ],
  seedRate: "200–250 g/acre (nursery seed)",
  spacing: "60 × 45 cm (transplanted); 45 × 45 cm for compact hybrids",
  nursery: [
    "Raised nursery beds 1 m wide with drainage.",
    "Protect from heavy rain with shade net if needed.",
    "Harden seedlings 5–7 days before transplanting.",
  ],
  transplanting: [
    "Transplant in evening; irrigate immediately.",
    "Gap fill within 7–10 days.",
    "Install yellow sticky traps @ 20–25/acre from transplanting.",
  ],
  irrigationSchedule: [
    "Light irrigation at transplanting and every 3–5 days initially.",
    "Critical stages: flowering and fruit set — avoid moisture stress.",
    "Prefer drip irrigation; avoid overhead irrigation that spreads anthracnose.",
    "Do not waterlog — root rot and wilt increase.",
  ],
  fertilizerSchedule: [
    "Basal: FYM 10–12 t/ha + NPK 40:40:40 kg/ha (or DAP + MOP as per soil test).",
    "Top-dress N in 2–3 splits at 30, 45 and 60 DAT.",
    "Potash and calcium important at fruiting — reduce fruit drop and tip burn.",
    "Foliar micronutrient mix (Zn, B, Ca) every 15 days during flowering–fruiting.",
  ],
  micronutrients: [
    "Boron 0.2% foliar at flowering (fruit set)",
    "Zinc sulphate 0.5% foliar if interveinal chlorosis",
    "Calcium nitrate foliar for blossom-end / tip disorders",
  ],
  growthStages: [
    { title: "Nursery", period: "0–35 DAS", keyPoints: ["Healthy seedlings", "Damping-off watch"] },
    { title: "Establishment", period: "0–20 DAT", keyPoints: ["Gap fill", "Thrips monitoring"] },
    { title: "Vegetative", period: "20–45 DAT", keyPoints: ["Canopy build", "Whitefly / leaf curl"] },
    { title: "Flowering–fruiting", period: "45–90 DAT", keyPoints: ["Fruit borer", "Anthracnose", "Mites"] },
  ],
  interculturalOperations: [
    "Hand weeding / interculture at 20 and 40 DAT if no herbicide.",
    "Plastic mulch on raised beds reduces weeds and soil splash.",
    "Stake or support tall hybrids if lodging occurs.",
  ],

  weedManagement: [
    {
      weedName: "Parthenium (Congress grass)",
      scientificName: "Parthenium hysterophorus",
      type: "Broadleaf",
      criticalPeriod: "0–40 DAT",
      preEmergenceHerbicide: "Pendimethalin 30 EC @ 1.0 kg a.i./ha on moist soil within 3 DAT (directed, crop-safe)",
      postEmergenceHerbicide: "Hand weeding + mulching; avoid non-selective herbicides on crop",
      hracGroup: "HRAC 3",
      dose: "Pendimethalin ≈3.3 L/ha product in 500 L water; keep spray off crop foliage",
    },
    {
      weedName: "Trianthema (Bishkhapra)",
      scientificName: "Trianthema portulacastrum",
      type: "Broadleaf",
      criticalPeriod: "10–35 DAT",
      preEmergenceHerbicide: "Pendimethalin 30 EC @ 1.0 kg a.i./ha",
      postEmergenceHerbicide: "Interculture between rows; plastic mulch preferred",
      hracGroup: "HRAC 3",
      dose: "Pre-em on moist soil; one hand weeding at 20–25 DAT if needed",
    },
    {
      weedName: "Grassy weeds (Digitaria / Echinochloa)",
      scientificName: "Digitaria sanguinalis",
      type: "Grassy",
      criticalPeriod: "0–25 DAT",
      preEmergenceHerbicide: "Pendimethalin 30 EC @ 1.0 kg a.i./ha",
      postEmergenceHerbicide: "Quizalofop-ethyl 5 EC @ 50 g a.i./ha (directed between rows if label allows)",
      hracGroup: "HRAC 3 / HRAC 1",
      dose: "Quizalofop ≈1 L/ha product; apply when grasses 2–4 leaf; avoid drift on crop",
    },
  ],

  pestManagement: [
    {
      pestName: "Chilli Thrips",
      scientificName: "Scirtothrips dorsalis",
      identification:
        "Tiny yellow–brown insects on young leaves and buds; leaves curl upward and become brittle; silvering on underside.",
      symptoms: [
        "Upward leaf curl and crinkling",
        "Brown scars on fruits (bird-eye spots)",
        "Stunted tender shoots",
        "Heavy infestation reduces flowering",
      ],
      etl: "2–5 thrips/leaf or 10% damaged leaves — act early; thrips also worsen virus symptoms",
      biologicalControl: [
        "Blue / yellow sticky traps @ 20–25/acre",
        "Avoid excess nitrogen (soft growth attracts thrips)",
        "Conserve predatory mites where possible",
      ],
      chemicalControl: [
        "Fipronil 5 SC — IRAC 2B",
        "Diafenthiuron 50 WP (e.g. Pegasus / Polo) — IRAC 12A",
        "Spinosad 45 SC — IRAC 5",
        "Rotate groups — do not use IRAC 4A neonics repeatedly",
      ],
      iracGroup: "IRAC 2B / 12A / 5",
      activeIngredient: "Fipronil 5 SC",
      dose: "1.5–2.0 ml/L; Diafenthiuron 1 g/L alternate spray after 10 days; PHI 7–14 days as per label",
    },
    {
      pestName: "Whitefly",
      scientificName: "Bemisia tabaci",
      identification:
        "White insects on leaf undersides; fly up when plant is shaken. Main vector of chilli leaf curl virus.",
      symptoms: [
        "Yellowing and sooty mould from honeydew",
        "Leaf curl virus symptoms if viruliferous",
        "Stunted plants and flower drop",
      ],
      etl: "5–10 adults/leaf or first virus symptoms in field — prioritise vector control",
      biologicalControl: [
        "Yellow sticky traps @ 20–25/acre",
        "Remove and destroy severely virus-infected plants",
        "Avoid continuous solanaceous cropping",
      ],
      chemicalControl: [
        "Pyriproxyfen 10 EC — IRAC 7C (IGR — good for nymphs)",
        "Diafenthiuron 50 WP — IRAC 12A",
        "Spiromesifen 240 SC (e.g. Oberon) — IRAC 23",
        "Do not rely only on IRAC 4A neonics",
      ],
      iracGroup: "IRAC 7C / 12A / 23",
      activeIngredient: "Pyriproxyfen 10 EC",
      dose: "1 ml/L; Diafenthiuron 1 g/L or Spiromesifen 0.5 ml/L as rotation; PHI 7–14 days",
    },
    {
      pestName: "Fruit Borer",
      scientificName: "Helicoverpa armigera",
      identification:
        "Larvae bore into buds and fruits; entry holes with frass; damaged fruits rot and drop.",
      symptoms: [
        "Holes in green fruits",
        "Flower and bud drop",
        "Internal feeding and secondary rot",
      ],
      etl: "1 larva/plant or 5% damaged fruits / buds",
      biologicalControl: [
        "HaNPV @ 250 LE/ha in evening",
        "Pheromone traps @ 5/ha for monitoring",
        "Trichogramma chilonis @ 50,000/ha weekly × 4",
      ],
      chemicalControl: [
        "Emamectin benzoate 5 SG — IRAC 6",
        "Chlorantraniliprole 18.5 SC — IRAC 28",
        "Indoxacarb 14.5 SC — IRAC 22A",
        "Spray at evening; cover fruits and buds",
      ],
      iracGroup: "IRAC 6 / 28 / 22A",
      activeIngredient: "Emamectin benzoate 5 SG",
      dose: "0.4 g/L (≈80–100 g/ha); Chlorantraniliprole 0.4 ml/L alternate; PHI 7–14 days",
    },
    {
      pestName: "Yellow Mite (Broad mite)",
      scientificName: "Polyphagotarsonemus latus",
      identification:
        "Microscopic mites on young leaves; leaves become narrow, downward-curled, bronzed; common in dry weather.",
      symptoms: [
        "Downward leaf curl (vs upward curl of thrips)",
        "Elongated narrow leaves",
        "Bronzing and corky fruit surface",
        "Terminal shoot distortion",
      ],
      etl: "First bronzing / downward curl on tender leaves — treat immediately",
      biologicalControl: [
        "Avoid dusty dry conditions; maintain soil moisture",
        "Do not use pyrethroids repeatedly (flare mites)",
      ],
      chemicalControl: [
        "Abamectin 1.9 EC — IRAC 6",
        "Spiromesifen 240 SC — IRAC 23",
        "Propargite 57 EC — IRAC 12C (where registered)",
        "Spray undersides of young leaves thoroughly",
      ],
      iracGroup: "IRAC 6 / 23 / 12C",
      activeIngredient: "Abamectin 1.9 EC",
      dose: "0.5–0.75 ml/L; Spiromesifen 0.5 ml/L as alternate MoA; PHI 7 days",
    },
    {
      pestName: "Aphids",
      scientificName: "Aphis gossypii / Myzus persicae",
      identification:
        "Soft-bodied insects in colonies on tender shoots and leaf undersides; honeydew and sooty mould.",
      symptoms: [
        "Curled tender leaves",
        "Sticky honeydew",
        "Virus transmission risk",
      ],
      etl: "10–20 aphids/leaf or colony on 10% plants",
      biologicalControl: [
        "Ladybird beetles and syrphids — avoid early broad-spectrum sprays",
        "Yellow sticky traps",
      ],
      chemicalControl: [
        "Acetamiprid 20 SP — IRAC 4A",
        "Thiamethoxam 25 WG — IRAC 4A (one use only in rotation)",
        "Prefer non-4A options if already used for whitefly",
      ],
      iracGroup: "IRAC 4A",
      activeIngredient: "Acetamiprid 20 SP",
      dose: "0.2–0.3 g/L; PHI 7–14 days",
    },
  ],

  diseaseManagement: [
    {
      diseaseName: "Anthracnose / Fruit Rot",
      pathogen: "Colletotrichum capsici",
      type: "Fungal",
      symptoms: [
        "Sunken circular spots on fruits with concentric rings",
        "Black acervuli in centre of lesions",
        "Fruit rot and drop in humid weather",
      ],
      favourableConditions: [
        "High humidity and rain splash",
        "Overhead irrigation",
        "Dense canopy and injured fruits",
      ],
      integratedManagement: [
        "Avoid overhead irrigation — use drip",
        "Remove infected fruits from field",
        "Stake plants for airflow",
        "Rotate FRAC groups — do not use only FRAC 1 or 11",
      ],
      biologicalControl: ["Pseudomonas fluorescens foliar 10 g/L preventive"],
      chemicalControl: [
        "Mancozeb 75 WP — FRAC M3",
        "Carbendazim 50 WP — FRAC 1",
        "Azoxystrobin 250 SC — FRAC 11 (rotate; high resistance risk)",
        "Copper oxychloride 50 WP — FRAC M1",
      ],
      fracGroup: "FRAC M3 / 1 / 11",
      activeIngredient: "Mancozeb 75 WP + Carbendazim 50 WP",
      dose: "Mancozeb 2 g/L + Carbendazim 1 g/L tank mix at first symptom; PHI 7–14 days",
      waitingPeriod: "7–14 days",
    },
    {
      diseaseName: "Die-back / Twig Blight",
      pathogen: "Colletotrichum gloeosporioides / C. capsici",
      type: "Fungal",
      symptoms: [
        "Die-back of tender twigs from tip",
        "Necrotic lesions on stems",
        "Flower and fruit drop",
      ],
      favourableConditions: ["Humid weather", "Wounds from insects or pruning", "Water stress"],
      integratedManagement: [
        "Prune and destroy infected twigs",
        "Disinfect tools",
        "Balanced nutrition — avoid excess N",
      ],
      biologicalControl: ["Trichoderma soil application 2.5 kg/ha"],
      chemicalControl: [
        "Copper oxychloride 50 WP — FRAC M1 after pruning",
        "Propiconazole 25 EC — FRAC 3",
        "Hexaconazole 5 EC — FRAC 3 (rotate with multi-site copper)",
      ],
      fracGroup: "FRAC M1 / 3",
      activeIngredient: "Copper oxychloride 50 WP",
      dose: "3 g/L after pruning; Propiconazole 1 ml/L if severe; PHI 14 days",
      waitingPeriod: "14 days",
    },
    {
      diseaseName: "Leaf Curl Virus (ChiLCV)",
      pathogen: "Begomovirus (whitefly-transmitted)",
      type: "Viral",
      symptoms: [
        "Upward leaf curling and yellowing from margins",
        "Stunted bushy plants",
        "Reduced flowering and fruiting",
        "Vein thickening in severe cases",
      ],
      favourableConditions: [
        "High whitefly population",
        "Continuous solanaceous crops nearby",
        "Late planting coinciding with vector peaks",
      ],
      integratedManagement: [
        "No chemical cures the virus — control whitefly vector",
        "Rogue and destroy infected plants early",
        "Use tolerant/resistant varieties next season",
        "Avoid tomato–chilli–brinjal continuous sequence",
      ],
      biologicalControl: ["Reflective mulch reduces whitefly landing"],
      chemicalControl: [
        "Manage whitefly: Pyriproxyfen 10 EC (IRAC 7C)",
        "Diafenthiuron 50 WP (IRAC 12A)",
        "Spiromesifen 240 SC (IRAC 23)",
        "Imidacloprid seed treatment only at start — not as sole strategy",
      ],
      fracGroup: "— (vector management)",
      activeIngredient: "Pyriproxyfen 10 EC (vector control)",
      dose: "1 ml/L for whitefly; remove infected plants same day",
      waitingPeriod: "7–14 days",
    },
    {
      diseaseName: "Powdery Mildew",
      pathogen: "Leveillula taurica",
      type: "Fungal",
      symptoms: [
        "White powdery growth on leaf undersides",
        "Yellow patches on upper leaf surface",
        "Premature leaf drop",
      ],
      favourableConditions: [
        "Dry days with high humidity nights",
        "Moderate temperatures 20–27°C",
        "Dense canopy",
      ],
      integratedManagement: [
        "Avoid excess nitrogen",
        "Improve airflow — wider spacing",
        "Remove severely infected lower leaves",
      ],
      biologicalControl: ["Potassium bicarbonate 5 g/L organic option"],
      chemicalControl: [
        "Wettable sulphur 80 WP — FRAC M2",
        "Hexaconazole 5 EC — FRAC 3",
        "Do not spray sulphur in hot midday sun",
      ],
      fracGroup: "FRAC M2 / 3",
      activeIngredient: "Wettable sulphur 80 WP",
      dose: "2–3 g/L early morning; Hexaconazole 1 ml/L if severe; PHI 7 days",
      waitingPeriod: "7 days",
    },
    {
      diseaseName: "Damping-off / Wilt (seedling & soil-borne)",
      pathogen: "Pythium / Fusarium / Rhizoctonia spp.",
      type: "Fungal",
      symptoms: [
        "Seedling collapse at soil line",
        "Wilting of transplanted plants",
        "Brown vascular discoloration (Fusarium)",
      ],
      favourableConditions: [
        "Overwatering and poor drainage",
        "Infected nursery soil",
        "Continuous chilli / solanaceous cropping",
      ],
      integratedManagement: [
        "Raised nursery beds with drainage",
        "Crop rotation 2–3 years",
        "Avoid waterlogging after transplant",
      ],
      biologicalControl: [
        "Trichoderma viride 10 g/kg seed + 2.5 kg/ha soil",
        "Pseudomonas fluorescens seedling dip",
      ],
      chemicalControl: [
        "Carbendazim 50 WP seed treatment — FRAC 1",
        "Metalaxyl + Mancozeb (e.g. Ridomil Gold) drench for Pythium — FRAC 4+M3",
        "Copper oxychloride soil drench in nursery — FRAC M1",
      ],
      fracGroup: "FRAC 1 / 4+M3",
      activeIngredient: "Carbendazim 50 WP (seed) / Metalaxyl + Mancozeb (drench)",
      dose: "Seed: 2 g/kg; Drench: Metalaxyl+Mancozeb 2 g/L in nursery beds",
      waitingPeriod: "— (nursery / early field)",
    },
  ],

  physiologicalDisorders: [
    "Flower / fruit drop: moisture stress, high temperature, boron deficiency.",
    "Sunscald on fruits: sparse canopy after mite/thrips damage.",
    "Tip burn: calcium deficiency under irregular irrigation.",
  ],
  nutrientDeficiencies: [
    {
      name: "Nitrogen",
      role: "Vegetative growth and leaf area",
      deficiencySymptoms: ["Pale green older leaves", "Stunted plants", "Poor branching"],
      excessSymptoms: ["Soft growth", "More thrips and mites", "Delayed fruiting"],
      management: ["Split N application", "Avoid excess N after flowering starts"],
      recommendedFertilizers: ["Urea", "Calcium ammonium nitrate"],
    },
    {
      name: "Potassium",
      role: "Fruit quality, disease tolerance, water regulation",
      deficiencySymptoms: ["Leaf margin scorch", "Poor fruit colour", "Weak plants"],
      excessSymptoms: ["May induce Mg deficiency"],
      management: ["Apply MOP / SOP at fruiting", "Foliar KNO₃ 1% if needed"],
      recommendedFertilizers: ["MOP", "SOP", "Potassium nitrate foliar"],
    },
    {
      name: "Boron",
      role: "Flowering and fruit set",
      deficiencySymptoms: ["Flower drop", "Hollow / cracked fruits", "Brittle growing tips"],
      excessSymptoms: ["Leaf tip burn"],
      management: ["Borax / solubor foliar 0.2% at flowering"],
      recommendedFertilizers: ["Borax", "Solubor foliar"],
    },
  ],
  harvesting: [
    "Green chilli: harvest when fruits are firm and full size (multiple pickings).",
    "Dry chilli: harvest when fruits turn red and partially dry on plant.",
    "Pick in morning; avoid damaged fruits for market.",
  ],
  yield: "Green: 80–120 q/acre (hybrids); Dry: 15–25 q/acre depending on variety",
  storage: [
    "Green: cool, ventilated crates; market within 2–3 days.",
    "Dry: sun-dry to 8–10% moisture; store in dry godown away from moisture.",
  ],
  marketInformation: {
    majorMarkets: ["Guntur (AP)", "Khammam", "Byadgi (Karnataka)", "Delhi Azadpur", "Nagpur"],
    demand: "Strong year-round for green; dry chilli peaks post-harvest season",
    msp: "Not under central MSP — market-driven",
    priceTrend: "Volatile; quality (colour, pungency) and export demand drive premiums",
  },
  faqs: [
    {
      question: "Leaf curl ho raha hai — kya spray karun?",
      answer:
        "Virus ka seedha ilaj nahi hai. Whitefly control karo (Pyriproxyfen / Diafenthiuron), severely infected plants hatao, aur agle season resistant variety lagao.",
    },
    {
      question: "Thrips aur mite mein fark kaise pata chale?",
      answer:
        "Thrips: leaves upward curl, fruit pe bird-eye scars. Yellow mite: leaves downward curl, narrow/bronzed tender leaves. Treatment alag MoA groups se karo.",
    },
    {
      question: "Fruit pe black sunken spots kyun?",
      answer:
        "Zyadatar anthracnose (Colletotrichum). Mancozeb + Carbendazim spray, drip irrigation use karo, infected fruits field se hatao.",
    },
  ],
};
