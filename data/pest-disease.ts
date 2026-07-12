import { cropCatalog } from "@/data/crop-catalog";

const IMG = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80";
const IMG2 = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80";
const IMG3 = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80";
const IMG_WEED = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&q=80";
const IMG_APHID = "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=600&h=400&fit=crop&q=80";
const IMG_RUST = "https://images.unsplash.com/photo-1622205313162-b1e0aafd392f?w=600&h=400&fit=crop&q=80";

export interface PestItem {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  stage: string;
  iracGroup?: string;
  control?: string;
}

export interface DiseaseItem {
  id: string;
  name: string;
  pathogen: string;
  image: string;
  stage: string;
  fracGroup?: string;
  control?: string;
}

export interface WeedItem {
  id: string;
  name: string;
  scientificName: string;
  type: string;
  criticalPeriod: string;
  preEmergence: string;
  postEmergence: string;
  culturalControl: string;
  image?: string;
}

export interface CropPestDiseaseData {
  slug: string;
  name: string;
  emoji: string;
  pests: PestItem[];
  diseases: DiseaseItem[];
  weeds: WeedItem[];
}

export const cropPestDiseaseData: Record<string, CropPestDiseaseData> = {
  paddy: {
    slug: "paddy", name: "Paddy", emoji: "🌾",
    pests: [
      { id: "p1", name: "Brown Planthopper", scientificName: "Nilaparvata lugens", image: IMG3, stage: "Tillering–heading", iracGroup: "IRAC 16 / 9B / 4E", control: "Buprofezin 25 SC @ 1 ml/L or Pymetrozine 50 WG @ 0.75 g/L or Triflumezopyrim 106 SC @ 0.5 ml/L — rotate MoA" },
      { id: "p2", name: "Yellow Stem Borer", scientificName: "Scirpophaga incertulas", image: IMG, stage: "Vegetative–PI", iracGroup: "IRAC 14 / 28", control: "Cartap hydrochloride 50 SP @ 1 kg/ha or Chlorantraniliprole 18.5 SC @ 0.4 ml/L" },
      { id: "p3", name: "Rice Armyworm", scientificName: "Spodoptera mauritia", image: IMG3, stage: "Tillering", iracGroup: "IRAC 6 / 28", control: "Emamectin benzoate 5 SG @ 0.4 g/L evening spray" },
      { id: "p4", name: "Leaf Folder", scientificName: "Cnaphalocrocis medinalis", image: IMG, stage: "Panicle initiation", iracGroup: "IRAC 28 / 5", control: "Flubendiamide 20 WG @ 0.25 g/L or Spinosad 45 SC @ 0.3 ml/L" },
      { id: "p5", name: "Green Leafhopper", scientificName: "Nephotettix virescens", image: IMG3, stage: "Vegetative", iracGroup: "IRAC 4A", control: "Imidacloprid 200 SL @ 0.3 ml/L or Thiamethoxam 25 WG @ 0.2 g/L (tungro vector)" },
    ],
    diseases: [
      { id: "d1", name: "Rice Blast", pathogen: "Magnaporthe oryzae", image: IMG2, stage: "Tillering–heading", fracGroup: "FRAC 16.1", control: "Tricyclazole 75 WP @ 0.6 g/L at boot leaf; alternate Isoprothiolane 40 EC @ 1.5 ml/L" },
      { id: "d2", name: "Sheath Blight", pathogen: "Rhizoctonia solani", image: IMG, stage: "Panicle initiation", fracGroup: "FRAC 26 / 3", control: "Validamycin 3 L @ 2.5 ml/L or Hexaconazole 5 EC @ 1 ml/L" },
      { id: "d3", name: "Bacterial Leaf Blight", pathogen: "Xanthomonas oryzae pv. oryzae", image: IMG2, stage: "Max tillering", fracGroup: "FRAC 25 + M1", control: "Streptocycline @ 0.15 g/L + Copper oxychloride 50 WP @ 3 g/L" },
      { id: "d4", name: "Brown Spot", pathogen: "Bipolaris oryzae", image: IMG, stage: "Tillering–grain fill", fracGroup: "FRAC M3 / 3", control: "Mancozeb 75 WP @ 2 g/L or Propiconazole 25 EC @ 1 ml/L" },
      { id: "d5", name: "False Smut", pathogen: "Ustilaginoidea virens", image: IMG2, stage: "Flowering", fracGroup: "FRAC 3", control: "Propiconazole 25 EC @ 1 ml/L at boot leaf stage" },
    ],
    weeds: [
      { id: "w1", name: "Barnyard Grass", scientificName: "Echinochloa crus-galli", type: "Grassy", criticalPeriod: "0–45 DAS", preEmergence: "Pretilachlor 50 EC @ 0.6–0.75 kg a.i./ha (HRAC 15) at 3 DAS", postEmergence: "Bispyribac-sodium 10 SC @ 25 g a.i./ha (HRAC 2) at 15–20 DAS", culturalControl: "Stale seedbed, puddling before transplant", image: IMG_WEED },
      { id: "w2", name: "Flat Sedge", scientificName: "Cyperus iria", type: "Sedge", criticalPeriod: "15–60 DAS", preEmergence: "Pretilachlor + Pyrazosulfuron-ethyl 10 WP @ 20 g a.i./ha (HRAC 2)", postEmergence: "Bispyribac-sodium 10 SC @ 25 g a.i./ha", culturalControl: "Maintain 5 cm standing water" },
      { id: "w3", name: "Monochoria (Broadleaf)", scientificName: "Monochoria vaginalis", type: "Broadleaf", criticalPeriod: "20–50 DAS", preEmergence: "Pretilachlor 50 EC @ 0.6 kg a.i./ha", postEmergence: "2,4-D Na salt 80 WP @ 0.5 kg a.i./ha (direct-seeded only; HRAC 4)", culturalControl: "Hand weeding at 20 & 40 DAS" },
    ],
  },
  wheat: {
    slug: "wheat", name: "Wheat", emoji: "🌾",
    pests: [
      { id: "p1", name: "Aphids", scientificName: "Sitobion avenae", image: IMG3, stage: "Heading", iracGroup: "IRAC 4A", control: "Imidacloprid seed treatment / Dimethoate spray" },
      { id: "p2", name: "Termites", scientificName: "Odontotermes obesus", image: IMG, stage: "Seedling", iracGroup: "IRAC 13", control: "Chlorpyrifos seed treatment" },
      { id: "p3", name: "Pink Stem Borer", scientificName: "Sesamia inferens", image: IMG3, stage: "Tillering", iracGroup: "IRAC 28", control: "Cartap hydrochloride spray" },
    ],
    diseases: [
      { id: "d1", name: "Yellow Rust", pathogen: "Puccinia striiformis", image: IMG2, stage: "Tillering–heading", fracGroup: "FRAC 3", control: "Propiconazole / Tebuconazole at first symptom" },
      { id: "d2", name: "Karnal Bunt", pathogen: "Tilletia indica", image: IMG, stage: "Grain filling", fracGroup: "—", control: "Carboxin seed treatment, avoid late sowing" },
      { id: "d3", name: "Loose Smut", pathogen: "Ustilago tritici", image: IMG2, stage: "Heading", fracGroup: "—", control: "Carboxin / Tebuconazole seed treatment" },
    ],
    weeds: [
      { id: "w1", name: "Phalaris minor", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "20–60 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Clodinafop @ 60 g/ha", culturalControl: "Deep ploughing, clean seed" },
      { id: "w2", name: "Wild Oat", scientificName: "Avena fatua", type: "Grassy", criticalPeriod: "25–55 DAS", preEmergence: "Pendimethalin", postEmergence: "Clodinafop propargyl", culturalControl: "Crop rotation with legumes" },
      { id: "w3", name: "Chenopodium", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–45 DAS", preEmergence: "Pendimethalin", postEmergence: "Metsulfuron methyl @ 4 g/ha", culturalControl: "One hand weeding at 30 DAS" },
    ],
  },
  maize: {
    slug: "maize", name: "Maize", emoji: "🌽",
    pests: [
      { id: "p1", name: "Fall Armyworm", scientificName: "Spodoptera frugiperda", image: IMG3, stage: "Vegetative", iracGroup: "IRAC 28", control: "Emamectin benzoate / Chlorantraniliprole" },
      { id: "p2", name: "Stem Borer", scientificName: "Chilo partellus", image: IMG, stage: "Knee-high", iracGroup: "IRAC 14", control: "Cartap hydrochloride, light traps" },
      { id: "p3", name: "Shoot Fly", scientificName: "Atherigona soccata", image: IMG3, stage: "Seedling", iracGroup: "IRAC 3A", control: "Carbofuran granules at sowing" },
    ],
    diseases: [
      { id: "d1", name: "Turcicum Leaf Blight", pathogen: "Exserohilum turcicum", image: IMG2, stage: "Vegetative", fracGroup: "FRAC 3", control: "Mancozeb + Metalaxyl spray" },
      { id: "d2", name: "Maydis Leaf Blight", pathogen: "Bipolaris maydis", image: IMG, stage: "Tasseling", fracGroup: "FRAC M5", control: "Carbendazim / Mancozeb" },
      { id: "d3", name: "Banded Leaf Sheath Blight", pathogen: "Rhizoctonia solani", image: IMG2, stage: "Grand growth", fracGroup: "FRAC 32", control: "Validamycin soil drench" },
    ],
    weeds: [
      { id: "w1", name: "Barnyard Grass", scientificName: "Echinochloa colona", type: "Grassy", criticalPeriod: "0–35 DAS", preEmergence: "Atrazine @ 1.0 kg/ha", postEmergence: "Tembotrione @ 120 g/ha", culturalControl: "Interculture at knee-high stage" },
      { id: "w2", name: "Trianthema", scientificName: "Trianthema portulacastrum", type: "Broadleaf", criticalPeriod: "10–30 DAS", preEmergence: "Atrazine", postEmergence: "2,4-D Na salt @ 0.5 kg/ha", culturalControl: "Earthing up at 25 DAS" },
      { id: "w3", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "15–40 DAS", preEmergence: "Atrazine + Alachlor", postEmergence: "Halosulfuron methyl", culturalControl: "Deep summer ploughing" },
    ],
  },
  bajra: {
    slug: "bajra", name: "Bajra", emoji: "🌿",
    pests: [
      { id: "p1", name: "Shoot Fly", scientificName: "Atherigona approximata", image: IMG3, stage: "Seedling", iracGroup: "IRAC 3A", control: "Carbofuran 3G @ 8 kg/ha at sowing" },
      { id: "p2", name: "Stem Borer", scientificName: "Coniesta ignefusalis", image: IMG, stage: "Tillering", iracGroup: "IRAC 14", control: "Quinalphos spray at dead-heart stage" },
      { id: "p3", name: "Earhead Caterpillar", scientificName: "Helicoverpa armigera", image: IMG3, stage: "Flowering", iracGroup: "IRAC 28", control: "Indoxacarb / HaNPV spray" },
    ],
    diseases: [
      { id: "d1", name: "Downy Mildew", pathogen: "Sclerospora graminicola", image: IMG2, stage: "Seedling", fracGroup: "FRAC 4", control: "Metalaxyl seed treatment, resistant varieties" },
      { id: "d2", name: "Ergot", pathogen: "Claviceps fusiformis", image: IMG, stage: "Flowering", fracGroup: "—", control: "Remove infected heads, spray before flowering" },
      { id: "d3", name: "Rust", pathogen: "Puccinia penniseti", image: IMG2, stage: "Grain filling", fracGroup: "FRAC 3", control: "Mancozeb / Propiconazole" },
    ],
    weeds: [
      { id: "w1", name: "Wild Sorghum", scientificName: "Sorghum halepense", type: "Grassy", criticalPeriod: "10–35 DAS", preEmergence: "Atrazine @ 0.5 kg/ha", postEmergence: "2,4-D Na salt", culturalControl: "Line sowing for inter-row cultivation" },
      { id: "w2", name: "Digitaria", scientificName: "Digitaria sanguinalis", type: "Grassy", criticalPeriod: "0–25 DAS", preEmergence: "Pendimethalin", postEmergence: "Hand weeding", culturalControl: "Stale seedbed technique" },
      { id: "w3", name: "Parthenium", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "15–40 DAS", preEmergence: "Atrazine", postEmergence: "Manual removal before flowering", culturalControl: "Competitive crop density" },
    ],
  },
  potato: {
    slug: "potato", name: "Potato", emoji: "🥔",
    pests: [
      { id: "p1", name: "Aphids", scientificName: "Myzus persicae", image: IMG3, stage: "Vegetative", iracGroup: "IRAC 4A", control: "Imidacloprid / Dimethoate" },
      { id: "p2", name: "Cut Worm", scientificName: "Agrotis ipsilon", image: IMG, stage: "Early growth", iracGroup: "IRAC 1A", control: "Chlorpyrifos drench at soil level" },
      { id: "p3", name: "Potato Tuber Moth", scientificName: "Phthorimaea operculella", image: IMG3, stage: "Storage", iracGroup: "IRAC 22A", control: "Malathion dust in store, field sanitation" },
    ],
    diseases: [
      { id: "d1", name: "Late Blight", pathogen: "Phytophthora infestans", image: IMG2, stage: "Tuber bulking", fracGroup: "FRAC 40", control: "Metalaxyl-M + Mancozeb prophylactic spray" },
      { id: "d2", name: "Early Blight", pathogen: "Alternaria solani", image: IMG, stage: "Vegetative", fracGroup: "FRAC M5", control: "Mancozeb / Chlorothalonil" },
      { id: "d3", name: "Black Scurf", pathogen: "Rhizoctonia solani", image: IMG2, stage: "Tuber formation", fracGroup: "FRAC 32", control: "Carbendazim seed tuber treatment" },
    ],
    weeds: [
      { id: "w1", name: "Bathua", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–45 DAS", preEmergence: "Metribuzin @ 0.35 kg/ha", postEmergence: "Rimsulfuron @ 25 g/ha", culturalControl: "Earthing up covers small weeds" },
      { id: "w2", name: "Wild Mustard", scientificName: "Brassica campestris", type: "Broadleaf", criticalPeriod: "20–50 DAS", preEmergence: "Metribuzin", postEmergence: "Hand weeding before tuber initiation", culturalControl: "Mulching between rows" },
      { id: "w3", name: "Cyperus", scientificName: "Cyperus esculentus", type: "Sedge", criticalPeriod: "10–40 DAS", preEmergence: "Metribuzin + Pendimethalin", postEmergence: "Glyphosate directed spray (pre-emergence crop)", culturalControl: "Deep ploughing in summer" },
    ],
  },
  tomato: {
    slug: "tomato", name: "Tomato", emoji: "🍅",
    pests: [
      { id: "p1", name: "Fruit Borer", scientificName: "Helicoverpa armigera", image: IMG3, stage: "Fruiting", iracGroup: "IRAC 28", control: "Emamectin benzoate / HaNPV at ETL" },
      { id: "p2", name: "Whitefly", scientificName: "Bemisia tabaci", image: IMG3, stage: "Vegetative", iracGroup: "IRAC 4A", control: "Thiamethoxam / Neem oil" },
      { id: "p3", name: "Leaf Miner", scientificName: "Liriomyza trifolii", image: IMG, stage: "Vegetative", iracGroup: "IRAC 17", control: "Abamectin / Yellow sticky traps" },
    ],
    diseases: [
      { id: "d1", name: "Early Blight", pathogen: "Alternaria solani", image: IMG2, stage: "Vegetative", fracGroup: "FRAC M5", control: "Mancozeb + Copper oxychloride" },
      { id: "d2", name: "Late Blight", pathogen: "Phytophthora infestans", image: IMG, stage: "Fruiting", fracGroup: "FRAC 40", control: "Metalaxyl-M spray before rains" },
      { id: "d3", name: "Bacterial Wilt", pathogen: "Ralstonia solanacearum", image: IMG2, stage: "Any stage", fracGroup: "—", control: "Resistant hybrids, soil solarization" },
    ],
    weeds: [
      { id: "w1", name: "Parthenium", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "0–30 DAT", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Hand weeding + mulching", culturalControl: "Black plastic mulch" },
      { id: "w2", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "10–45 DAT", preEmergence: "Pendimethalin + Oxyfluorfen", postEmergence: "Glyphosate shielded spray", culturalControl: "Raised bed, drip irrigation" },
      { id: "w3", name: "Digitaria", scientificName: "Digitaria spp.", type: "Grassy", criticalPeriod: "0–25 DAT", preEmergence: "Pendimethalin", postEmergence: "Interculture with hoe", culturalControl: "Stale seedbed before transplant" },
    ],
  },
  onion: {
    slug: "onion", name: "Onion", emoji: "🧅",
    pests: [
      { id: "p1", name: "Thrips", scientificName: "Thrips tabaci", image: IMG3, stage: "Bulb formation", iracGroup: "IRAC 4A", control: "Fipronil / Spinosad spray" },
      { id: "p2", name: "Onion Maggot", scientificName: "Delia antiqua", image: IMG, stage: "Seedling", iracGroup: "IRAC 1B", control: "Chlorpyrifos drench at planting" },
      { id: "p3", name: "Cut Worm", scientificName: "Agrotis spp.", image: IMG3, stage: "Early growth", iracGroup: "IRAC 1A", control: "Chlorantraniliprole bait" },
    ],
    diseases: [
      { id: "d1", name: "Purple Blotch", pathogen: "Alternaria porri", image: IMG2, stage: "Bulb development", fracGroup: "FRAC M5", control: "Mancozeb + Matalaxyl spray" },
      { id: "d2", name: "Stemphylium Blight", pathogen: "Stemphylium vesicarium", image: IMG, stage: "Maturity", fracGroup: "FRAC 3", control: "Propiconazole / Iprodione" },
      { id: "d3", name: "Basal Rot", pathogen: "Fusarium oxysporum", image: IMG2, stage: "Storage", fracGroup: "—", control: "Carbendazim bulb dip, crop rotation" },
    ],
    weeds: [
      { id: "w1", name: "Chenopodium", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–45 DAS", preEmergence: "Oxyfluorfen @ 0.15 kg/ha", postEmergence: "Hand weeding (no selective herbicide)", culturalControl: "Mulching, shallow cultivation" },
      { id: "w2", name: "Phalaris", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "10–35 DAS", preEmergence: "Pendimethalin", postEmergence: "Manual removal", culturalControl: "Nursery weed-free transplant" },
      { id: "w3", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "20–50 DAS", preEmergence: "Oxyfluorfen + Pendimethalin", postEmergence: "Directed glyphosate between rows", culturalControl: "Summer fallow" },
    ],
  },
  chilli: {
    slug: "chilli", name: "Chilli", emoji: "🌶️",
    pests: [
      { id: "p1", name: "Chilli Thrips", scientificName: "Scirtothrips dorsalis", image: IMG3, stage: "Vegetative–fruiting", iracGroup: "IRAC 2B / 12A / 5", control: "Fipronil 5 SC @ 1.5–2 ml/L or Diafenthiuron 50 WP @ 1 g/L — rotate MoA" },
      { id: "p2", name: "Whitefly", scientificName: "Bemisia tabaci", image: IMG3, stage: "Vegetative", iracGroup: "IRAC 7C / 12A / 23", control: "Pyriproxyfen 10 EC @ 1 ml/L or Diafenthiuron 50 WP @ 1 g/L (leaf curl vector)" },
      { id: "p3", name: "Fruit Borer", scientificName: "Helicoverpa armigera", image: IMG, stage: "Flowering–fruiting", iracGroup: "IRAC 6 / 28 / 22A", control: "Emamectin benzoate 5 SG @ 0.4 g/L or Chlorantraniliprole 18.5 SC @ 0.4 ml/L" },
      { id: "p4", name: "Yellow Mite", scientificName: "Polyphagotarsonemus latus", image: IMG3, stage: "Dry weather", iracGroup: "IRAC 6 / 23", control: "Abamectin 1.9 EC @ 0.5–0.75 ml/L or Spiromesifen 240 SC @ 0.5 ml/L" },
      { id: "p5", name: "Aphids", scientificName: "Aphis gossypii", image: IMG, stage: "Vegetative", iracGroup: "IRAC 4A", control: "Acetamiprid 20 SP @ 0.2–0.3 g/L — do not repeat 4A consecutively" },
    ],
    diseases: [
      { id: "d1", name: "Anthracnose / Fruit Rot", pathogen: "Colletotrichum capsici", image: IMG2, stage: "Fruiting", fracGroup: "FRAC M3 / 1", control: "Mancozeb 75 WP @ 2 g/L + Carbendazim 50 WP @ 1 g/L" },
      { id: "d2", name: "Die-back", pathogen: "Colletotrichum gloeosporioides", image: IMG, stage: "Any stage", fracGroup: "FRAC M1 / 3", control: "Prune infected twigs + Copper oxychloride 50 WP @ 3 g/L" },
      { id: "d3", name: "Leaf Curl Virus", pathogen: "Begomovirus (whitefly vector)", image: IMG2, stage: "Vegetative", fracGroup: "— (vector)", control: "Rogue infected plants; Pyriproxyfen / Diafenthiuron for whitefly" },
      { id: "d4", name: "Powdery Mildew", pathogen: "Leveillula taurica", image: IMG, stage: "Vegetative–fruiting", fracGroup: "FRAC M2 / 3", control: "Wettable sulphur 80 WP @ 2–3 g/L or Hexaconazole 5 EC @ 1 ml/L" },
      { id: "d5", name: "Damping-off / Wilt", pathogen: "Pythium / Fusarium / Rhizoctonia", image: IMG2, stage: "Nursery–early field", fracGroup: "FRAC 1 / 4+M3", control: "Carbendazim seed treatment 2 g/kg; Metalaxyl+Mancozeb drench 2 g/L" },
    ],
    weeds: [
      { id: "w1", name: "Parthenium", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "0–40 DAT", preEmergence: "Pendimethalin 30 EC @ 1.0 kg a.i./ha (HRAC 3) within 3 DAT", postEmergence: "Hand weeding + plastic mulch", culturalControl: "Raised beds with plastic mulch" },
      { id: "w2", name: "Trianthema", scientificName: "Trianthema portulacastrum", type: "Broadleaf", criticalPeriod: "10–35 DAT", preEmergence: "Pendimethalin 30 EC @ 1.0 kg a.i./ha", postEmergence: "Interculture between rows", culturalControl: "Drip + mulching" },
      { id: "w3", name: "Digitaria (Grassy)", scientificName: "Digitaria sanguinalis", type: "Grassy", criticalPeriod: "0–25 DAT", preEmergence: "Pendimethalin 30 EC @ 1.0 kg a.i./ha", postEmergence: "Quizalofop-ethyl 5 EC @ 50 g a.i./ha directed (HRAC 1)", culturalControl: "Stale seedbed" },
    ],
  },
  cotton: {
    slug: "cotton", name: "Cotton", emoji: "🌸",
    pests: [
      { id: "p1", name: "Pink Bollworm", scientificName: "Pectinophora gossypiella", image: IMG3, stage: "Square–boll", iracGroup: "IRAC 28", control: "Bt cotton + pheromone traps, Flubendiamide" },
      { id: "p2", name: "Whitefly", scientificName: "Bemisia tabaci", image: IMG3, stage: "Vegetative", iracGroup: "IRAC 4A", control: "Pyriproxyfen / Diafenthiuron" },
      { id: "p3", name: "Jassids", scientificName: "Amrasca biguttula", image: IMG, stage: "Square formation", iracGroup: "IRAC 4A", control: "Imidacloprid seed treatment" },
    ],
    diseases: [
      { id: "d1", name: "Bacterial Blight", pathogen: "Xanthomonas citri pv. malvacearum", image: IMG2, stage: "Vegetative", fracGroup: "—", control: "Acid-delinted seed, Streptocycline spray" },
      { id: "d2", name: "Alternaria Leaf Spot", pathogen: "Alternaria macrospora", image: IMG, stage: "Boll development", fracGroup: "FRAC M5", control: "Mancozeb / Carbendazim" },
      { id: "d3", name: "Root Rot", pathogen: "Rhizoctonia bataticola", image: IMG2, stage: "Seedling", fracGroup: "FRAC 32", control: "Trichoderma seed treatment, drainage" },
    ],
    weeds: [
      { id: "w1", name: "Trianthema", scientificName: "Trianthema portulacastrum", type: "Broadleaf", criticalPeriod: "0–45 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Interculture + hand weeding", culturalControl: "Deep summer ploughing" },
      { id: "w2", name: "Digitaria", scientificName: "Digitaria spp.", type: "Grassy", criticalPeriod: "10–40 DAS", preEmergence: "Pendimethalin", postEmergence: "Hoeing at squaring", culturalControl: "Narrow row spacing" },
      { id: "w3", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "15–50 DAS", preEmergence: "Pendimethalin + Fluchloralin", postEmergence: "Glyphosate directed spray", culturalControl: "Crop rotation with cereals" },
    ],
  },
  sugarcane: {
    slug: "sugarcane", name: "Sugarcane", emoji: "🎋",
    pests: [
      { id: "p1", name: "Top Borer", scientificName: "Scirpophaga excerptalis", image: IMG3, stage: "Grand growth", iracGroup: "IRAC 14", control: "Carbofuran sett treatment, Trichogramma" },
      { id: "p2", name: "Pyrilla", scientificName: "Pyrilla perpusilla", image: IMG3, stage: "Tillering", iracGroup: "IRAC 4A", control: "Dimethoate + release Epiricania" },
      { id: "p3", name: "Termites", scientificName: "Odontotermes spp.", image: IMG, stage: "Germination", iracGroup: "IRAC 13", control: "Chlorpyrifos sett dip" },
    ],
    diseases: [
      { id: "d1", name: "Red Rot", pathogen: "Colletotrichum falcatum", image: IMG2, stage: "Maturity", fracGroup: "—", control: "Resistant varieties, hot water sett treatment" },
      { id: "d2", name: "Smut", pathogen: "Sporisorium scitamineum", image: IMG, stage: "Tillering", fracGroup: "—", control: "Remove whips, sett treatment with Carbendazim" },
      { id: "d3", name: "Grassy Shoot", pathogen: "Phytoplasma (leafhopper vector)", image: IMG2, stage: "Vegetative", fracGroup: "—", control: "Rogue infected clumps, vector control" },
    ],
    weeds: [
      { id: "w1", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "0–90 DAP", preEmergence: "Atrazine @ 2.0 kg/ha", postEmergence: "2,4-D Na salt @ 1.0 kg/ha", culturalControl: "Trash mulching, earthing up" },
      { id: "w2", name: "Hariali Grass", scientificName: "Cynodon dactylon", type: "Grassy", criticalPeriod: "30–120 DAP", preEmergence: "Atrazine", postEmergence: "Glyphosate shielded spray", culturalControl: "Interculture at 45 & 90 DAP" },
      { id: "w3", name: "Parthenium", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "20–60 DAP", preEmergence: "Atrazine", postEmergence: "Manual removal", culturalControl: "Trash blanket suppresses weeds" },
    ],
  },
  soybean: {
    slug: "soybean", name: "Soybean", emoji: "🫘",
    pests: [
      { id: "p1", name: "Girdle Beetle", scientificName: "Oberea brevis", image: IMG3, stage: "Flowering", iracGroup: "IRAC 28", control: "Carbofuran granules, remove girdled plants" },
      { id: "p2", name: "Semilooper", scientificName: "Chrysodeixis acuta", image: IMG3, stage: "Pod formation", iracGroup: "IRAC 28", control: "Novaluron / Indoxacarb" },
      { id: "p3", name: "Whitefly", scientificName: "Bemisia tabaci", image: IMG, stage: "Vegetative", iracGroup: "IRAC 4A", control: "Thiamethoxam seed treatment" },
    ],
    diseases: [
      { id: "d1", name: "Rust", pathogen: "Phakopsora pachyrhizi", image: IMG2, stage: "Pod filling", fracGroup: "FRAC 3", control: "Propiconazole / Tebuconazole" },
      { id: "d2", name: "Yellow Mosaic", pathogen: "Mungbean Yellow Mosaic Virus", image: IMG, stage: "Vegetative", fracGroup: "—", control: "Resistant varieties, whitefly control" },
      { id: "d3", name: "Rhizoctonia Root Rot", pathogen: "Rhizoctonia solani", image: IMG2, stage: "Seedling", fracGroup: "FRAC 32", control: "Trichoderma seed treatment, well-drained soil" },
    ],
    weeds: [
      { id: "w1", name: "Phalaris minor", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "20–45 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Quizalofop @ 50 g/ha", culturalControl: "Narrow row spacing" },
      { id: "w2", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "15–40 DAS", preEmergence: "Pendimethalin + Imazethapyr", postEmergence: "Imazethapyr @ 100 g/ha", culturalControl: "Summer ploughing" },
      { id: "w3", name: "Digitaria", scientificName: "Digitaria sanguinalis", type: "Grassy", criticalPeriod: "0–25 DAS", preEmergence: "Pendimethalin", postEmergence: "Quizalofop ethyl", culturalControl: "Clean seed, crop rotation" },
    ],
  },
  mustard: {
    slug: "mustard", name: "Mustard", emoji: "🌼",
    pests: [
      { id: "p1", name: "Aphids", scientificName: "Lipaphis erysimi", image: IMG3, stage: "Flowering", iracGroup: "IRAC 4A", control: "Dimethoate / Imidacloprid at ETL" },
      { id: "p2", name: "Painted Bug", scientificName: "Bagrada hilaris", image: IMG3, stage: "Seedling", iracGroup: "IRAC 3A", control: "Quinalphos spray" },
      { id: "p3", name: "Mustard Sawfly", scientificName: "Athalia proxima", image: IMG, stage: "Vegetative", iracGroup: "IRAC 28", control: "Quinalphos / Hand picking larvae" },
    ],
    diseases: [
      { id: "d1", name: "White Rust", pathogen: "Albugo candida", image: IMG2, stage: "Flowering", fracGroup: "FRAC M5", control: "Mancozeb / Metalaxyl spray" },
      { id: "d2", name: "Alternaria Blight", pathogen: "Alternaria brassicae", image: IMG, stage: "Pod formation", fracGroup: "FRAC M5", control: "Mancozeb + Carbendazim" },
      { id: "d3", name: "Sclerotinia Stem Rot", pathogen: "Sclerotinia sclerotiorum", image: IMG2, stage: "Flowering", fracGroup: "FRAC 2", control: "Carbendazim at 50% flowering" },
    ],
    weeds: [
      { id: "w1", name: "Chenopodium", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–40 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Ethoxysulfuron @ 15 g/ha", culturalControl: "Line sowing for inter-row weeding" },
      { id: "w2", name: "Wild Oat", scientificName: "Avena fatua", type: "Grassy", criticalPeriod: "20–45 DAS", preEmergence: "Pendimethalin", postEmergence: "Clodinafop (if grassy dominant)", culturalControl: "Deep ploughing" },
      { id: "w3", name: "Phalaris", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "10–35 DAS", preEmergence: "Pendimethalin", postEmergence: "Hand weeding at rosette stage", culturalControl: "Stale seedbed" },
    ],
  },
  pulses: {
    slug: "pulses", name: "Pulses", emoji: "🫛",
    pests: [
      { id: "p1", name: "Pod Borer", scientificName: "Helicoverpa armigera", image: IMG3, stage: "Pod formation", iracGroup: "IRAC 28", control: "HaNPV / Emamectin benzoate" },
      { id: "p2", name: "Aphids", scientificName: "Aphis craccivora", image: IMG3, stage: "Flowering", iracGroup: "IRAC 4A", control: "Dimethoate spray at ETL" },
      { id: "p3", name: "Bruchids", scientificName: "Callosobruchus chinensis", image: IMG, stage: "Storage", iracGroup: "IRAC 13", control: "Neem oil / Phosphine fumigation in store" },
    ],
    diseases: [
      { id: "d1", name: "Wilt", pathogen: "Fusarium oxysporum", image: IMG2, stage: "Vegetative", fracGroup: "—", control: "Trichoderma seed treatment, resistant varieties" },
      { id: "d2", name: "Powdery Mildew", pathogen: "Erysiphe pisi", image: IMG, stage: "Flowering", fracGroup: "FRAC 3", control: "Wettable sulphur / Hexaconazole" },
      { id: "d3", name: "Cercospora Leaf Spot", pathogen: "Cercospora canescens", image: IMG2, stage: "Pod filling", fracGroup: "FRAC M5", control: "Mancozeb spray" },
    ],
    weeds: [
      { id: "w1", name: "Phalaris minor", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "20–45 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Quizalofop @ 50 g/ha", culturalControl: "Line sowing, early vigour varieties" },
      { id: "w2", name: "Chenopodium", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–40 DAS", preEmergence: "Pendimethalin", postEmergence: "Imazethapyr (in soybean intercrop)", culturalControl: "Hand weeding at 25 DAS" },
      { id: "w3", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "15–45 DAS", preEmergence: "Pendimethalin", postEmergence: "Manual removal", culturalControl: "Summer ploughing" },
    ],
  },
  mango: {
    slug: "mango", name: "Mango", emoji: "🥭",
    pests: [
      { id: "p1", name: "Mango Hopper", scientificName: "Idioscopus clypealis", image: IMG3, stage: "Flowering", iracGroup: "IRAC 4A", control: "Imidacloprid / Buprofezin at panicle emergence" },
      { id: "p2", name: "Fruit Fly", scientificName: "Bactrocera dorsalis", image: IMG3, stage: "Fruit development", iracGroup: "IRAC 1B", control: "Methyl eugenol traps + bait spray" },
      { id: "p3", name: "Mango Mealybug", scientificName: "Drosicha mangiferae", image: IMG, stage: "Flush", iracGroup: "IRAC 4A", control: "Chlorpyrifos trunk banding + spray" },
    ],
    diseases: [
      { id: "d1", name: "Anthracnose", pathogen: "Colletotrichum gloeosporioides", image: IMG2, stage: "Flowering–fruit", fracGroup: "FRAC M5", control: "Copper oxychloride before rains" },
      { id: "d2", name: "Powdery Mildew", pathogen: "Oidium mangiferae", image: IMG, stage: "Flowering", fracGroup: "FRAC 3", control: "Wettable sulphur / Hexaconazole" },
      { id: "d3", name: "Die-back", pathogen: "Lasiodiplodia theobromae", image: IMG2, stage: "Any stage", fracGroup: "—", control: "Prune 15 cm below infection, Bordeaux paste" },
    ],
    weeds: [
      { id: "w1", name: "Parthenium", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "Monsoon flush", preEmergence: "Glyphosate in basin (dormant)", postEmergence: "Slashing + mulching", culturalControl: "Intercropping, basin mulching" },
      { id: "w2", name: "Cynodon", scientificName: "Cynodon dactylon", type: "Grassy", criticalPeriod: "Year-round basin", preEmergence: "Glyphosate directed spray", postEmergence: "Mowing / hand pulling", culturalControl: "Black polythene mulching in basin" },
      { id: "w3", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "Rainy season", preEmergence: "Glyphosate shielded", postEmergence: "Manual removal before tuber formation", culturalControl: "Clean cultivation in orchard floor" },
    ],
  },
  banana: {
    slug: "banana", name: "Banana", emoji: "🍌",
    pests: [
      { id: "p1", name: "Banana Aphid", scientificName: "Pentalonia nigronervosa", image: IMG3, stage: "Vegetative", iracGroup: "IRAC 4A", control: "Imidacloprid drench (Bunchy Top vector)" },
      { id: "p2", name: "Rhizome Weevil", scientificName: "Cosmopolites sordidus", image: IMG, stage: "Grand Naine", iracGroup: "IRAC 15", control: "Carbofuran corm treatment, pheromone traps" },
      { id: "p3", name: "Thrips", scientificName: "Chaetanaphothrips signipennis", image: IMG3, stage: "Bunch development", iracGroup: "IRAC 4A", control: "Spinosad / bagging bunches" },
    ],
    diseases: [
      { id: "d1", name: "Sigatoka Leaf Spot", pathogen: "Mycosphaerella musicola", image: IMG2, stage: "Vegetative", fracGroup: "FRAC 3", control: "Propiconazole / Oil emulsion spray" },
      { id: "d2", name: "Panama Wilt", pathogen: "Fusarium oxysporum f.sp. cubense", image: IMG, stage: "Any stage", fracGroup: "—", control: "Resistant varieties (Grand Naine), drench Carbendazim" },
      { id: "d3", name: "Bunchy Top", pathogen: "Banana Bunchy Top Virus", image: IMG2, stage: "Vegetative", fracGroup: "—", control: "Rogue infected plants, aphid control" },
    ],
    weeds: [
      { id: "w1", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "0–90 DAP", preEmergence: "Glyphosate before planting", postEmergence: "Glyphosate shielded inter-row", culturalControl: "Polythene mulch in pits" },
      { id: "w2", name: "Parthenium", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "20–60 DAP", preEmergence: "Manual clean pits", postEmergence: "Hand weeding in basins", culturalControl: "Dried leaf mulch" },
      { id: "w3", name: "Digitaria", scientificName: "Digitaria spp.", type: "Grassy", criticalPeriod: "10–45 DAP", preEmergence: "Inter-row tillage", postEmergence: "Slashing", culturalControl: "Cover cropping between rows" },
    ],
  },
  grapes: {
    slug: "grapes", name: "Grapes", emoji: "🍇",
    pests: [
      { id: "p1", name: "Thrips", scientificName: "Scirtothrips dorsalis", image: IMG3, stage: "Berry development", iracGroup: "IRAC 4A", control: "Fipronil / Spinosad at berry touch" },
      { id: "p2", name: "Flea Beetle", scientificName: "Altica spp.", image: IMG3, stage: "New flush", iracGroup: "IRAC 3A", control: "Quinalphos spray on new leaves" },
      { id: "p3", name: "Mealybug", scientificName: "Maconellicoccus hirsutus", image: IMG, stage: "Berry ripening", iracGroup: "IRAC 4A", control: "Buprofezin / Cryptolaemus release" },
    ],
    diseases: [
      { id: "d1", name: "Downy Mildew", pathogen: "Plasmopara viticola", image: IMG2, stage: "Pre-monsoon", fracGroup: "FRAC 40", control: "Metalaxyl + Mancozeb before rains" },
      { id: "d2", name: "Powdery Mildew", pathogen: "Erysiphe necator", image: IMG, stage: "Berry development", fracGroup: "FRAC 3", control: "Sulphur dust / Hexaconazole" },
      { id: "d3", name: "Anthracnose", pathogen: "Elsinoe ampelina", image: IMG2, stage: "New flush", fracGroup: "FRAC M5", control: "Copper oxychloride after pruning" },
    ],
    weeds: [
      { id: "w1", name: "Cynodon", scientificName: "Cynodon dactylon", type: "Grassy", criticalPeriod: "Inter-row year-round", preEmergence: "Glyphosate in vine-free zone", postEmergence: "Mowing between rows", culturalControl: "Weed mat / live mulch" },
      { id: "w2", name: "Cyperus", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "Rainy season", preEmergence: "Glyphosate directed", postEmergence: "Hand removal in basins", culturalControl: "Plastic mulch under vines" },
      { id: "w3", name: "Parthenium", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "Monsoon", preEmergence: "Clean vineyard floor", postEmergence: "Manual before seed set", culturalControl: "Inter-row cover crop" },
    ],
  },
};

import { getIpmCatalogEntry, mergeIpmCatalog } from "@/lib/crops/ipmDataBridge";
import { mergeCropFieldGuideCatalog } from "@/lib/crops/cropFieldGuideBridge";
import { mergeWeedAbioticCatalog } from "@/lib/crops/weedAbioticBridge";

export function getCropPestDisease(slug: string): CropPestDiseaseData {
  const base = cropPestDiseaseData[slug] ?? getIpmCatalogEntry(slug);
  if (!base) return cropPestDiseaseData.paddy;
  return mergeWeedAbioticCatalog(mergeCropFieldGuideCatalog(mergeIpmCatalog(base)));
}

export const pestDiseaseCropList = [
  ...cropCatalog.map((c) => ({
    slug: c.slug,
    name: c.name,
    emoji: c.emoji,
  })),
  ...["brinjal", "bhindi", "cauliflower", "cabbage", "capsicum", "cucumber", "moong"]
    .filter((slug) => getIpmCatalogEntry(slug) && !cropCatalog.some((c) => c.slug === slug))
    .map((slug) => {
      const entry = getIpmCatalogEntry(slug)!;
      return { slug, name: entry.name, emoji: entry.emoji };
    }),
];
