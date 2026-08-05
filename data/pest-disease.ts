import { cropCatalog } from "@/data/crop-catalog";

const IMG = "/images/threats/threat-yellow.jpg";
const IMG2 = "/images/threats/threat-disease.jpg";
const IMG3 = "/images/threats/threat-insect.jpg";
const IMG_WEED = "/images/threats/threat-weed.jpg";
const IMG_APHID = "/images/threats/threat-insect.jpg";
const IMG_RUST = "/images/threats/threat-disease.jpg";

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
  /** Optional Hindi common name — filled via weedNamesHi when missing */
  nameHi?: string;
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
      { id: "p1", name: "भूरा फुदका (Brown Planthopper)", scientificName: "Nilaparvata lugens", image: IMG3, stage: "कल्ले–बाली", iracGroup: "IRAC 16 / 9B / 4E", control: "Buprofezin 25 SC @ 1 ml/L या Pymetrozine 50 WG @ 0.75 g/L या Triflumezopyrim 106 SC @ 0.5 ml/L — MoA घुमाएँ" },
      { id: "p2", name: "पीला तना छेदक (Yellow Stem Borer)", scientificName: "Scirpophaga incertulas", image: IMG, stage: "वनस्पति–बाली आरंभ", iracGroup: "IRAC 14 / 28", control: "Cartap hydrochloride 50 SP @ 1 kg/ha या Chlorantraniliprole 18.5 SC @ 0.4 ml/L" },
      { id: "p3", name: "धान सेना इल्ली (Rice Armyworm)", scientificName: "Spodoptera mauritia", image: IMG3, stage: "कल्ले", iracGroup: "IRAC 6 / 28", control: "Emamectin benzoate 5 SG @ 0.4 g/L — शाम को छिड़काव" },
      { id: "p4", name: "पत्ती मोड़क (Leaf Folder)", scientificName: "Cnaphalocrocis medinalis", image: IMG, stage: "बाली आरंभ", iracGroup: "IRAC 28 / 5", control: "Flubendiamide 20 WG @ 0.25 g/L या Spinosad 45 SC @ 0.3 ml/L" },
      { id: "p5", name: "हरा पत्ती फुदका (Green Leafhopper)", scientificName: "Nephotettix virescens", image: IMG3, stage: "वनस्पति", iracGroup: "IRAC 4A", control: "Imidacloprid 200 SL @ 0.3 ml/L या Thiamethoxam 25 WG @ 0.2 g/L (tungro वाहक)" },
    ],
    diseases: [
      { id: "d1", name: "धान ब्लास्ट (Rice Blast)", pathogen: "Magnaporthe oryzae", image: IMG2, stage: "कल्ले–बाली", fracGroup: "FRAC 16.1", control: "Tricyclazole 75 WP @ 0.6 g/L बूट लीफ पर; बदलकर Isoprothiolane 40 EC @ 1.5 ml/L" },
      { id: "d2", name: "पर्ण आवरण सड़न (Sheath Blight)", pathogen: "Rhizoctonia solani", image: IMG, stage: "बाली आरंभ", fracGroup: "FRAC 26 / 3", control: "Validamycin 3 L @ 2.5 ml/L या Hexaconazole 5 EC @ 1 ml/L" },
      { id: "d3", name: "जीवाणु पत्ती झुलसा (Bacterial Leaf Blight)", pathogen: "Xanthomonas oryzae pv. oryzae", image: IMG2, stage: "अधिकतम कल्ले", fracGroup: "FRAC 25 + M1", control: "Streptocycline @ 0.15 g/L + Copper oxychloride 50 WP @ 3 g/L" },
      { id: "d4", name: "भूरा धब्बा (Brown Spot)", pathogen: "Bipolaris oryzae", image: IMG, stage: "कल्ले–दाना भरना", fracGroup: "FRAC M3 / 3", control: "Mancozeb 75 WP @ 2 g/L या Propiconazole 25 EC @ 1 ml/L" },
      { id: "d5", name: "झूठा कंड (False Smut)", pathogen: "Ustilaginoidea virens", image: IMG2, stage: "फूल आना", fracGroup: "FRAC 3", control: "Propiconazole 25 EC @ 1 ml/L बूट लीफ अवस्था पर" },
    ],
    weeds: [
      { id: "w1", name: "सांवा घास (Barnyard Grass)", scientificName: "Echinochloa crus-galli", type: "Grassy", criticalPeriod: "0–45 DAS", preEmergence: "Pretilachlor 50 EC @ 0.6–0.75 kg a.i./ha (HRAC 15) at 3 DAS", postEmergence: "Bispyribac-sodium 10 SC @ 25 g a.i./ha (HRAC 2) at 15–20 DAS", culturalControl: "बासी बीज क्यारी, रोपाई से पहले खेत पोखर", image: IMG_WEED },
      { id: "w2", name: "चपटा नागरमोथा (Flat Sedge)", scientificName: "Cyperus iria", type: "Sedge", criticalPeriod: "15–60 DAS", preEmergence: "Pretilachlor + Pyrazosulfuron-ethyl 10 WP @ 20 g a.i./ha (HRAC 2)", postEmergence: "Bispyribac-sodium 10 SC @ 25 g a.i./ha", culturalControl: "5 cm पानी खड़ा रखें" },
      { id: "w3", name: "मोनोकोरिया — चौड़ी पत्ती (Monochoria)", scientificName: "Monochoria vaginalis", type: "Broadleaf", criticalPeriod: "20–50 DAS", preEmergence: "Pretilachlor 50 EC @ 0.6 kg a.i./ha", postEmergence: "2,4-D Na salt 80 WP @ 0.5 kg a.i./ha (direct-seeded only; HRAC 4)", culturalControl: "20 और 40 DAS पर हाथ से निराई" },
    ],
  },
  wheat: {
    slug: "wheat", name: "Wheat", emoji: "🌾",
    pests: [
      { id: "p1", name: "एफिड (Aphids)", scientificName: "Sitobion avenae", image: IMG3, stage: "बाली", iracGroup: "IRAC 4A", control: "Imidacloprid बीज उपचार / Dimethoate छिड़काव" },
      { id: "p2", name: "दीमक (Termites)", scientificName: "Odontotermes obesus", image: IMG, stage: "अंकुर", iracGroup: "IRAC 13", control: "Chlorpyrifos बीज उपचार" },
      { id: "p3", name: "गुलाबी तना छेदक (Pink Stem Borer)", scientificName: "Sesamia inferens", image: IMG3, stage: "कल्ले", iracGroup: "IRAC 28", control: "Cartap hydrochloride छिड़काव" },
    ],
    diseases: [
      { id: "d1", name: "पीला रतुआ (Yellow Rust)", pathogen: "Puccinia striiformis", image: IMG2, stage: "कल्ले–बाली", fracGroup: "FRAC 3", control: "Propiconazole / Tebuconazole पहले लक्षण पर" },
      { id: "d2", name: "करनाल कंड (Karnal Bunt)", pathogen: "Tilletia indica", image: IMG, stage: "दाना भरना", fracGroup: "—", control: "Carboxin बीज उपचार, देर से बुवाई से बचें" },
      { id: "d3", name: "ढीला कंड (Loose Smut)", pathogen: "Ustilago tritici", image: IMG2, stage: "बाली", fracGroup: "—", control: "Carboxin / Tebuconazole बीज उपचार" },
    ],
    weeds: [
      { id: "w1", name: "गुल्ली-डंडा (Phalaris minor)", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "20–60 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Clodinafop @ 60 g/ha", culturalControl: "गहरी जुताई, साफ बीज" },
      { id: "w2", name: "जंगली जई (Wild Oat)", scientificName: "Avena fatua", type: "Grassy", criticalPeriod: "25–55 DAS", preEmergence: "Pendimethalin", postEmergence: "Clodinafop propargyl", culturalControl: "दलहनी फसलों के साथ फसल चक्र" },
      { id: "w3", name: "बथुआ (Chenopodium)", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–45 DAS", preEmergence: "Pendimethalin", postEmergence: "Metsulfuron methyl @ 4 g/ha", culturalControl: "30 DAS पर एक बार हाथ से निराई" },
    ],
  },
  maize: {
    slug: "maize", name: "Maize", emoji: "🌽",
    pests: [
      { id: "p1", name: "फॉल आर्मीवर्म (Fall Armyworm)", scientificName: "Spodoptera frugiperda", image: IMG3, stage: "वनस्पति", iracGroup: "IRAC 28", control: "Emamectin benzoate / Chlorantraniliprole" },
      { id: "p2", name: "तना छेदक (Stem Borer)", scientificName: "Chilo partellus", image: IMG, stage: "घुटने-ऊँचाई", iracGroup: "IRAC 14", control: "Cartap hydrochloride, प्रकाश जाल" },
      { id: "p3", name: "अंकुर मक्खी (Shoot Fly)", scientificName: "Atherigona soccata", image: IMG3, stage: "अंकुर", iracGroup: "IRAC 3A", control: "Carbofuran granules बुवाई पर" },
    ],
    diseases: [
      { id: "d1", name: "टर्सिकम पत्ती झुलसा (Turcicum Leaf Blight)", pathogen: "Exserohilum turcicum", image: IMG2, stage: "वनस्पति", fracGroup: "FRAC 3", control: "Mancozeb + Metalaxyl छिड़काव" },
      { id: "d2", name: "मेडिस पत्ती झुलसा (Maydis Leaf Blight)", pathogen: "Bipolaris maydis", image: IMG, stage: "अन्वल", fracGroup: "FRAC M5", control: "Carbendazim / Mancozeb" },
      { id: "d3", name: "पट्टेदार पत्ती-आवरण सड़न (Banded Leaf Sheath Blight)", pathogen: "Rhizoctonia solani", image: IMG2, stage: "तेज़ वृद्धि", fracGroup: "FRAC 32", control: "Validamycin मिट्टी डrench" },
    ],
    weeds: [
      { id: "w1", name: "सांवा घास (Barnyard Grass)", scientificName: "Echinochloa colona", type: "Grassy", criticalPeriod: "0–35 DAS", preEmergence: "Atrazine @ 1.0 kg/ha", postEmergence: "Tembotrione @ 120 g/ha", culturalControl: "घुटने-ऊँचाई पर मेड़-निराई" },
      { id: "w2", name: "इटसा घास (Trianthema)", scientificName: "Trianthema portulacastrum", type: "Broadleaf", criticalPeriod: "10–30 DAS", preEmergence: "Atrazine", postEmergence: "2,4-D Na salt @ 0.5 kg/ha", culturalControl: "25 DAS पर मेड़ चढ़ाना" },
      { id: "w3", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "15–40 DAS", preEmergence: "Atrazine + Alachlor", postEmergence: "Halosulfuron methyl", culturalControl: "गर्मी में गहरी जुताई" },
    ],
  },
  bajra: {
    slug: "bajra", name: "Bajra", emoji: "🌿",
    pests: [
      { id: "p1", name: "अंकुर मक्खी (Shoot Fly)", scientificName: "Atherigona approximata", image: IMG3, stage: "अंकुर", iracGroup: "IRAC 3A", control: "Carbofuran 3G @ 8 kg/ha बुवाई पर" },
      { id: "p2", name: "तना छेदक (Stem Borer)", scientificName: "Coniesta ignefusalis", image: IMG, stage: "कल्ले", iracGroup: "IRAC 14", control: "Quinalphos छिड़काव — डेड-हार्ट अवस्था पर" },
      { id: "p3", name: "बाली इल्ली (Earhead Caterpillar)", scientificName: "Helicoverpa armigera", image: IMG3, stage: "फूल आना", iracGroup: "IRAC 28", control: "Indoxacarb / HaNPV छिड़काव" },
    ],
    diseases: [
      { id: "d1", name: "बलूत फफूंद (Downy Mildew)", pathogen: "Sclerospora graminicola", image: IMG2, stage: "अंकुर", fracGroup: "FRAC 4", control: "Metalaxyl बीज उपचार, प्रतिरोधी किस्में" },
      { id: "d2", name: "अर्गोट (Ergot)", pathogen: "Claviceps fusiformis", image: IMG, stage: "फूल आना", fracGroup: "—", control: "संक्रमित बालियाँ हटाएँ, फूल आने से पहले छिड़काव" },
      { id: "d3", name: "रतुआ (Rust)", pathogen: "Puccinia penniseti", image: IMG2, stage: "दाना भरना", fracGroup: "FRAC 3", control: "Mancozeb / Propiconazole" },
    ],
    weeds: [
      { id: "w1", name: "जंगली ज्वार (Wild Sorghum)", scientificName: "Sorghum halepense", type: "Grassy", criticalPeriod: "10–35 DAS", preEmergence: "Atrazine @ 0.5 kg/ha", postEmergence: "2,4-D Na salt", culturalControl: "पंक्ति बुवाई — मेड़-निराई के लिए" },
      { id: "w2", name: "काकरा घास (Digitaria)", scientificName: "Digitaria sanguinalis", type: "Grassy", criticalPeriod: "0–25 DAS", preEmergence: "Pendimethalin", postEmergence: "Hand weeding", culturalControl: "बासी बीज क्यारी विधि" },
      { id: "w3", name: "गाजर घास (Parthenium)", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "15–40 DAS", preEmergence: "Atrazine", postEmergence: "फूल आने से पहले हाथ से हटाएँ", culturalControl: "घनी फसल खड़ी" },
    ],
  },
  potato: {
    slug: "potato", name: "Potato", emoji: "🥔",
    pests: [
      { id: "p1", name: "एफिड (Aphids)", scientificName: "Myzus persicae", image: IMG3, stage: "वनस्पति", iracGroup: "IRAC 4A", control: "Imidacloprid / Dimethoate" },
      { id: "p2", name: "कटवर्म (Cut Worm)", scientificName: "Agrotis ipsilon", image: IMG, stage: "शुरुआती वृद्धि", iracGroup: "IRAC 1A", control: "Chlorpyrifos मिट्टी स्तर पर डrench" },
      { id: "p3", name: "आलू कंद मोथ (Potato Tuber Moth)", scientificName: "Phthorimaea operculella", image: IMG3, stage: "भंडारण", iracGroup: "IRAC 22A", control: "Malathion powder भंडार में, खेत सफाई" },
    ],
    diseases: [
      { id: "d1", name: "देर से झुलसा (Late Blight)", pathogen: "Phytophthora infestans", image: IMG2, stage: "कंद भरना", fracGroup: "FRAC 40", control: "Metalaxyl-M + Mancozeb रोकथाम छिड़काव" },
      { id: "d2", name: "शुरुआती झुलसा (Early Blight)", pathogen: "Alternaria solani", image: IMG, stage: "वनस्पति", fracGroup: "FRAC M5", control: "Mancozeb / Chlorothalonil" },
      { id: "d3", name: "काला कवच (Black Scurf)", pathogen: "Rhizoctonia solani", image: IMG2, stage: "कंद बनना", fracGroup: "FRAC 32", control: "Carbendazim बीज-कंद उपचार" },
    ],
    weeds: [
      { id: "w1", name: "बथुआ (Bathua)", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–45 DAS", preEmergence: "Metribuzin @ 0.35 kg/ha", postEmergence: "Rimsulfuron @ 25 g/ha", culturalControl: "मेड़ चढ़ाने से छोटे खरपतवार दब जाते हैं" },
      { id: "w2", name: "जंगली सरसों (Wild Mustard)", scientificName: "Brassica campestris", type: "Broadleaf", criticalPeriod: "20–50 DAS", preEmergence: "Metribuzin", postEmergence: "Hand weeding before tuber initiation", culturalControl: "पंक्तियों के बीच मल्च" },
      { id: "w3", name: "मोठा (Cyperus)", scientificName: "Cyperus esculentus", type: "Sedge", criticalPeriod: "10–40 DAS", preEmergence: "Metribuzin + Pendimethalin", postEmergence: "Glyphosate directed spray (pre-emergence crop)", culturalControl: "गर्मी में गहरी जुताई" },
    ],
  },
  tomato: {
    slug: "tomato", name: "Tomato", emoji: "🍅",
    pests: [
      { id: "p1", name: "फल छेदक (Fruit Borer)", scientificName: "Helicoverpa armigera", image: IMG3, stage: "फल लगना", iracGroup: "IRAC 28", control: "Emamectin benzoate / HaNPV — ETL पर" },
      { id: "p2", name: "सफेद मक्खी (Whitefly)", scientificName: "Bemisia tabaci", image: IMG3, stage: "वनस्पति", iracGroup: "IRAC 4A", control: "Thiamethoxam / Neem oil" },
      { id: "p3", name: "पत्ती खनक (Leaf Miner)", scientificName: "Liriomyza trifolii", image: IMG, stage: "वनस्पति", iracGroup: "IRAC 17", control: "Abamectin / पीले चिपचिपे जाल" },
    ],
    diseases: [
      { id: "d1", name: "शुरुआती झुलसा (Early Blight)", pathogen: "Alternaria solani", image: IMG2, stage: "वनस्पति", fracGroup: "FRAC M5", control: "Mancozeb + Copper oxychloride" },
      { id: "d2", name: "देर से झुलसा (Late Blight)", pathogen: "Phytophthora infestans", image: IMG, stage: "फल लगना", fracGroup: "FRAC 40", control: "Metalaxyl-M छिड़काव — बारिश से पहले" },
      { id: "d3", name: "जीवाणु मुरझान (Bacterial Wilt)", pathogen: "Ralstonia solanacearum", image: IMG2, stage: "किसी भी अवस्था", fracGroup: "—", control: "प्रतिरोधी संकर, मिट्टी सौरीकरण" },
    ],
    weeds: [
      { id: "w1", name: "गाजर घास (Parthenium)", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "0–30 DAT", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "हाथ से निराई + मल्च", culturalControl: "काली प्लास्टिक मल्च" },
      { id: "w2", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "10–45 DAT", preEmergence: "Pendimethalin + Oxyfluorfen", postEmergence: "Glyphosate ढककर छिड़काव", culturalControl: "ऊँची क्यारी, ड्रिप सिंचाई" },
      { id: "w3", name: "काकरा घास (Digitaria)", scientificName: "Digitaria spp.", type: "Grassy", criticalPeriod: "0–25 DAT", preEmergence: "Pendimethalin", postEmergence: "कुदाल से मेड़-निराई", culturalControl: "रोपाई से पहले बासी बीज क्यारी" },
    ],
  },
  onion: {
    slug: "onion", name: "Onion", emoji: "🧅",
    pests: [
      { id: "p1", name: "थ्रिप्स (Thrips)", scientificName: "Thrips tabaci", image: IMG3, stage: "कंद बनना", iracGroup: "IRAC 4A", control: "Fipronil / Spinosad छिड़काव" },
      { id: "p2", name: "प्याज की मक्खी (Onion Maggot)", scientificName: "Delia antiqua", image: IMG, stage: "अंकुर", iracGroup: "IRAC 1B", control: "Chlorpyrifos रोपाई/लगाई पर डrench" },
      { id: "p3", name: "कटवर्म (Cut Worm)", scientificName: "Agrotis spp.", image: IMG3, stage: "शुरुआती वृद्धि", iracGroup: "IRAC 1A", control: "Chlorantraniliprole प्रलोभन" },
    ],
    diseases: [
      { id: "d1", name: "बैंगनी धब्बा (Purple Blotch)", pathogen: "Alternaria porri", image: IMG2, stage: "कंद विकास", fracGroup: "FRAC M5", control: "Mancozeb + Metalaxyl छिड़काव" },
      { id: "d2", name: "स्टेम्फिलियम झुलसा (Stemphylium Blight)", pathogen: "Stemphylium vesicarium", image: IMG, stage: "पकना", fracGroup: "FRAC 3", control: "Propiconazole / Iprodione" },
      { id: "d3", name: "आधार सड़न (Basal Rot)", pathogen: "Fusarium oxysporum", image: IMG2, stage: "भंडारण", fracGroup: "—", control: "Carbendazim कंद डुबोना, फसल चक्र" },
    ],
    weeds: [
      { id: "w1", name: "बथुआ (Chenopodium)", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–45 DAS", preEmergence: "Oxyfluorfen @ 0.15 kg/ha", postEmergence: "Hand weeding (no selective herbicide)", culturalControl: "मल्च, उथली जुताई" },
      { id: "w2", name: "गुल्ली-डंडा (Phalaris)", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "10–35 DAS", preEmergence: "Pendimethalin", postEmergence: "हाथ से हटाएँ", culturalControl: "नर्सरी साफ रखकर रोपाई" },
      { id: "w3", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "20–50 DAS", preEmergence: "Oxyfluorfen + Pendimethalin", postEmergence: "पंक्तियों के बीच ढककर Glyphosate", culturalControl: "गर्मी में खेत खाली" },
    ],
  },
  chilli: {
    slug: "chilli", name: "Chilli", emoji: "🌶️",
    pests: [
      { id: "p1", name: "मिर्च थ्रिप्स (Chilli Thrips)", scientificName: "Scirtothrips dorsalis", image: IMG3, stage: "वनस्पति–फल", iracGroup: "IRAC 2B / 12A / 5", control: "Fipronil 5 SC @ 1.5–2 ml/L या Diafenthiuron 50 WP @ 1 g/L — MoA घुमाएँ" },
      { id: "p2", name: "सफेद मक्खी (Whitefly)", scientificName: "Bemisia tabaci", image: IMG3, stage: "वनस्पति", iracGroup: "IRAC 7C / 12A / 23", control: "Pyriproxyfen 10 EC @ 1 ml/L या Diafenthiuron 50 WP @ 1 g/L (पत्ती मरोड़ वाहक)" },
      { id: "p3", name: "फल छेदक (Fruit Borer)", scientificName: "Helicoverpa armigera", image: IMG, stage: "फूल–फल", iracGroup: "IRAC 6 / 28 / 22A", control: "Emamectin benzoate 5 SG @ 0.4 g/L या Chlorantraniliprole 18.5 SC @ 0.4 ml/L" },
      { id: "p4", name: "पीला माइट (Yellow Mite)", scientificName: "Polyphagotarsonemus latus", image: IMG3, stage: "सूखा मौसम", iracGroup: "IRAC 6 / 23", control: "Abamectin 1.9 EC @ 0.5–0.75 ml/L या Spiromesifen 240 SC @ 0.5 ml/L" },
      { id: "p5", name: "एफिड (Aphids)", scientificName: "Aphis gossypii", image: IMG, stage: "वनस्पति", iracGroup: "IRAC 4A", control: "Acetamiprid 20 SP @ 0.2–0.3 g/L — 4A समूह लगातार दोहराएँ नहीं" },
    ],
    diseases: [
      { id: "d1", name: "एन्थ्रेक्नोज / फल सड़न (Anthracnose)", pathogen: "Colletotrichum capsici", image: IMG2, stage: "फल लगना", fracGroup: "FRAC M3 / 1", control: "Mancozeb 75 WP @ 2 g/L + Carbendazim 50 WP @ 1 g/L" },
      { id: "d2", name: "सूखना-पीछे हटना (Die-back)", pathogen: "Colletotrichum gloeosporioides", image: IMG, stage: "किसी भी अवस्था", fracGroup: "FRAC M1 / 3", control: "संक्रमित टहनियाँ काटें + Copper oxychloride 50 WP @ 3 g/L" },
      { id: "d3", name: "पत्ती मोड़ वायरस (Leaf Curl Virus)", pathogen: "Begomovirus (whitefly vector)", image: IMG2, stage: "वनस्पति", fracGroup: "— (vector)", control: "संक्रमित पौधे उखाड़ें; सफेद मक्खी के लिए Pyriproxyfen / Diafenthiuron" },
      { id: "d4", name: "चूर्णिल फफूंद (Powdery Mildew)", pathogen: "Leveillula taurica", image: IMG, stage: "वनस्पति–फल", fracGroup: "FRAC M2 / 3", control: "Wettable sulphur 80 WP @ 2–3 g/L या Hexaconazole 5 EC @ 1 ml/L" },
      { id: "d5", name: "अंकुर मरण / मुरझान (Damping-off)", pathogen: "Pythium / Fusarium / Rhizoctonia", image: IMG2, stage: "नर्सरी–शुरुआती खेत", fracGroup: "FRAC 1 / 4+M3", control: "Carbendazim बीज उपचार 2 g/kg; Metalaxyl+Mancozeb डrench 2 g/L" },
    ],
    weeds: [
      { id: "w1", name: "गाजर घास (Parthenium)", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "0–40 DAT", preEmergence: "Pendimethalin 30 EC @ 1.0 kg a.i./ha (HRAC 3) within 3 DAT", postEmergence: "हाथ से निराई + प्लास्टिक मल्च", culturalControl: "प्लास्टिक मल्च वाली ऊँची क्यारी" },
      { id: "w2", name: "इटसा घास (Trianthema)", scientificName: "Trianthema portulacastrum", type: "Broadleaf", criticalPeriod: "10–35 DAT", preEmergence: "Pendimethalin 30 EC @ 1.0 kg a.i./ha", postEmergence: "पंक्तियों के बीच मेड़-निराई", culturalControl: "ड्रिप + मल्च" },
      { id: "w3", name: "काकरा घास — घास (Digitaria)", scientificName: "Digitaria sanguinalis", type: "Grassy", criticalPeriod: "0–25 DAT", preEmergence: "Pendimethalin 30 EC @ 1.0 kg a.i./ha", postEmergence: "Quizalofop-ethyl 5 EC @ 50 g a.i./ha directed (HRAC 1)", culturalControl: "बासी बीज क्यारी" },
    ],
  },
  cotton: {
    slug: "cotton", name: "Cotton", emoji: "🌸",
    pests: [
      { id: "p1", name: "गुलाबी रुई इल्ली (Pink Bollworm)", scientificName: "Pectinophora gossypiella", image: IMG3, stage: "कली–रुई", iracGroup: "IRAC 28", control: "Bt cotton + फेरोमोन जाल, Flubendiamide" },
      { id: "p2", name: "सफेद मक्खी (Whitefly)", scientificName: "Bemisia tabaci", image: IMG3, stage: "वनस्पति", iracGroup: "IRAC 4A", control: "Pyriproxyfen / Diafenthiuron" },
      { id: "p3", name: "हरा तैलक (Jassids)", scientificName: "Amrasca biguttula", image: IMG, stage: "कली बनना", iracGroup: "IRAC 4A", control: "Imidacloprid बीज उपचार" },
    ],
    diseases: [
      { id: "d1", name: "जीवाणु झुलसा (Bacterial Blight)", pathogen: "Xanthomonas citri pv. malvacearum", image: IMG2, stage: "वनस्पति", fracGroup: "—", control: "अम्ल-डिलिंटेड बीज, Streptocycline छिड़काव" },
      { id: "d2", name: "अल्टरनेरिया पत्ती धब्बा (Alternaria Leaf Spot)", pathogen: "Alternaria macrospora", image: IMG, stage: "रुई गाँठ", fracGroup: "FRAC M5", control: "Mancozeb / Carbendazim" },
      { id: "d3", name: "जड़ सड़न (Root Rot)", pathogen: "Rhizoctonia bataticola", image: IMG2, stage: "अंकुर", fracGroup: "FRAC 32", control: "Trichoderma बीज उपचार, जल निकास" },
    ],
    weeds: [
      { id: "w1", name: "इटसा घास (Trianthema)", scientificName: "Trianthema portulacastrum", type: "Broadleaf", criticalPeriod: "0–45 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "मेड़-निराई + हाथ से निराई", culturalControl: "गर्मी में गहरी जुताई" },
      { id: "w2", name: "काकरा घास (Digitaria)", scientificName: "Digitaria spp.", type: "Grassy", criticalPeriod: "10–40 DAS", preEmergence: "Pendimethalin", postEmergence: "कली बनने पर कुदाल", culturalControl: "संकीर्ण पंक्ति दूरी" },
      { id: "w3", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "15–50 DAS", preEmergence: "Pendimethalin + Fluchloralin", postEmergence: "Glyphosate ढककर छिड़काव", culturalControl: "अनाज फसलों के साथ फसल चक्र" },
    ],
  },
  sugarcane: {
    slug: "sugarcane", name: "Sugarcane", emoji: "🎋",
    pests: [
      { id: "p1", name: "ऊपरी छेदक (Top Borer)", scientificName: "Scirpophaga excerptalis", image: IMG3, stage: "तेज़ वृद्धि", iracGroup: "IRAC 14", control: "Carbofuran बीज उपचार, Trichogramma" },
      { id: "p2", name: "पायरिला (Pyrilla)", scientificName: "Pyrilla perpusilla", image: IMG3, stage: "कल्ले", iracGroup: "IRAC 4A", control: "Dimethoate + Epiricania छोड़ें" },
      { id: "p3", name: "दीमक (Termites)", scientificName: "Odontotermes spp.", image: IMG, stage: "अंकुरण", iracGroup: "IRAC 13", control: "Chlorpyrifos बीज डुबोना" },
    ],
    diseases: [
      { id: "d1", name: "लाल सड़न (Red Rot)", pathogen: "Colletotrichum falcatum", image: IMG2, stage: "पकना", fracGroup: "—", control: "प्रतिरोधी किस्में, गर्म पानी से बीज उपचार" },
      { id: "d2", name: "कंड रोग (Smut)", pathogen: "Sporisorium scitamineum", image: IMG, stage: "कल्ले", fracGroup: "—", control: "झाड़ियाँ हटाएँ, Carbendazim से बीज उपचार" },
      { id: "d3", name: "घास जैसी कली (Grassy Shoot)", pathogen: "Phytoplasma (leafhopper vector)", image: IMG2, stage: "वनस्पति", fracGroup: "—", control: "संक्रमित गुच्छे उखाड़ें, वाहक नियंत्रण" },
    ],
    weeds: [
      { id: "w1", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "0–90 DAP", preEmergence: "Atrazine @ 2.0 kg/ha", postEmergence: "2,4-D Na salt @ 1.0 kg/ha", culturalControl: "परali मल्च, मेड़ चढ़ाना" },
      { id: "w2", name: "हरियाली घास (Hariali Grass)", scientificName: "Cynodon dactylon", type: "Grassy", criticalPeriod: "30–120 DAP", preEmergence: "Atrazine", postEmergence: "Glyphosate ढककर छिड़काव", culturalControl: "45 और 90 DAP पर मेड़-निराई" },
      { id: "w3", name: "गाजर घास (Parthenium)", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "20–60 DAP", preEmergence: "Atrazine", postEmergence: "हाथ से हटाएँ", culturalControl: "परali की परत खरपतवार दबाती है" },
    ],
  },
  soybean: {
    slug: "soybean", name: "Soybean", emoji: "🫘",
    pests: [
      { id: "p1", name: "कमर बंद भृंग (Girdle Beetle)", scientificName: "Oberea brevis", image: IMG3, stage: "फूल आना", iracGroup: "IRAC 28", control: "Carbofuran granules, कटे पौधे हटाएँ" },
      { id: "p2", name: "अर्ध-लूपर इल्ली (Semilooper)", scientificName: "Chrysodeixis acuta", image: IMG3, stage: "फली बनना", iracGroup: "IRAC 28", control: "Novaluron / Indoxacarb" },
      { id: "p3", name: "सफेद मक्खी (Whitefly)", scientificName: "Bemisia tabaci", image: IMG, stage: "वनस्पति", iracGroup: "IRAC 4A", control: "Thiamethoxam बीज उपचार" },
    ],
    diseases: [
      { id: "d1", name: "रतुआ (Rust)", pathogen: "Phakopsora pachyrhizi", image: IMG2, stage: "फली भरना", fracGroup: "FRAC 3", control: "Propiconazole / Tebuconazole" },
      { id: "d2", name: "पीला मोज़ेक (Yellow Mosaic)", pathogen: "Mungbean Yellow Mosaic Virus", image: IMG, stage: "वनस्पति", fracGroup: "—", control: "प्रतिरोधी किस्में, सफेद मक्खी नियंत्रण" },
      { id: "d3", name: "जड़ सड़न (Rhizoctonia Root Rot)", pathogen: "Rhizoctonia solani", image: IMG2, stage: "अंकुर", fracGroup: "FRAC 32", control: "Trichoderma बीज उपचार, अच्छी जल निकास वाली मिट्टी" },
    ],
    weeds: [
      { id: "w1", name: "गुल्ली-डंडा (Phalaris minor)", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "20–45 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Quizalofop @ 50 g/ha", culturalControl: "संकीर्ण पंक्ति दूरी" },
      { id: "w2", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "15–40 DAS", preEmergence: "Pendimethalin + Imazethapyr", postEmergence: "Imazethapyr @ 100 g/ha", culturalControl: "गर्मी में जुताई" },
      { id: "w3", name: "काकरा घास (Digitaria)", scientificName: "Digitaria sanguinalis", type: "Grassy", criticalPeriod: "0–25 DAS", preEmergence: "Pendimethalin", postEmergence: "Quizalofop ethyl", culturalControl: "साफ बीज, फसल चक्र" },
    ],
  },
  mustard: {
    slug: "mustard", name: "Mustard", emoji: "🌼",
    pests: [
      { id: "p1", name: "एफिड (Aphids)", scientificName: "Lipaphis erysimi", image: IMG3, stage: "फूल आना", iracGroup: "IRAC 4A", control: "Dimethoate / Imidacloprid — ETL पर" },
      { id: "p2", name: "रंगीन बग (Painted Bug)", scientificName: "Bagrada hilaris", image: IMG3, stage: "अंकुर", iracGroup: "IRAC 3A", control: "Quinalphos छिड़काव" },
      { id: "p3", name: "सरसों की आरी मक्खी (Mustard Sawfly)", scientificName: "Athalia proxima", image: IMG, stage: "वनस्पति", iracGroup: "IRAC 28", control: "Quinalphos / इल्लियाँ हाथ से उठाएँ" },
    ],
    diseases: [
      { id: "d1", name: "सफेद रतुआ (White Rust)", pathogen: "Albugo candida", image: IMG2, stage: "फूल आना", fracGroup: "FRAC M5", control: "Mancozeb / Metalaxyl छिड़काव" },
      { id: "d2", name: "अल्टरनेरिया झुलसा (Alternaria Blight)", pathogen: "Alternaria brassicae", image: IMG, stage: "फली बनना", fracGroup: "FRAC M5", control: "Mancozeb + Carbendazim" },
      { id: "d3", name: "स्क्लेरोटिनिया तना सड़न (Sclerotinia Stem Rot)", pathogen: "Sclerotinia sclerotiorum", image: IMG2, stage: "फूल आना", fracGroup: "FRAC 2", control: "Carbendazim — 50% फूल आने पर" },
    ],
    weeds: [
      { id: "w1", name: "बथुआ (Chenopodium)", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–40 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Ethoxysulfuron @ 15 g/ha", culturalControl: "पंक्ति बुवाई — मेड़-निराई के लिए" },
      { id: "w2", name: "जंगली जई (Wild Oat)", scientificName: "Avena fatua", type: "Grassy", criticalPeriod: "20–45 DAS", preEmergence: "Pendimethalin", postEmergence: "Clodinafop (if grassy dominant)", culturalControl: "गहरी जुताई" },
      { id: "w3", name: "गुल्ली-डंडा (Phalaris)", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "10–35 DAS", preEmergence: "Pendimethalin", postEmergence: "Hand weeding at rosette stage", culturalControl: "बासी बीज क्यारी" },
    ],
  },
  pulses: {
    slug: "pulses", name: "Pulses", emoji: "🫛",
    pests: [
      { id: "p1", name: "फली छेदक (Pod Borer)", scientificName: "Helicoverpa armigera", image: IMG3, stage: "फली बनना", iracGroup: "IRAC 28", control: "HaNPV / Emamectin benzoate" },
      { id: "p2", name: "एफिड (Aphids)", scientificName: "Aphis craccivora", image: IMG3, stage: "फूल आना", iracGroup: "IRAC 4A", control: "Dimethoate छिड़काव — ETL पर" },
      { id: "p3", name: "दाल की कीड़ा (Bruchids)", scientificName: "Callosobruchus chinensis", image: IMG, stage: "भंडारण", iracGroup: "IRAC 13", control: "Neem oil / Phosphine धूमन — भंडार में" },
    ],
    diseases: [
      { id: "d1", name: "मुरझान (Wilt)", pathogen: "Fusarium oxysporum", image: IMG2, stage: "वनस्पति", fracGroup: "—", control: "Trichoderma बीज उपचार, प्रतिरोधी किस्में" },
      { id: "d2", name: "चूर्णिल फफूंद (Powdery Mildew)", pathogen: "Erysiphe pisi", image: IMG, stage: "फूल आना", fracGroup: "FRAC 3", control: "Wettable sulphur / Hexaconazole" },
      { id: "d3", name: "सर्कोस्पोरा पत्ती धब्बा (Cercospora Leaf Spot)", pathogen: "Cercospora canescens", image: IMG2, stage: "फली भरना", fracGroup: "FRAC M5", control: "Mancozeb छिड़काव" },
    ],
    weeds: [
      { id: "w1", name: "गुल्ली-डंडा (Phalaris minor)", scientificName: "Phalaris minor", type: "Grassy", criticalPeriod: "20–45 DAS", preEmergence: "Pendimethalin @ 1.0 kg/ha", postEmergence: "Quizalofop @ 50 g/ha", culturalControl: "पंक्ति बुवाई, जल्दी उगने वाली किस्में" },
      { id: "w2", name: "बथुआ (Chenopodium)", scientificName: "Chenopodium album", type: "Broadleaf", criticalPeriod: "15–40 DAS", preEmergence: "Pendimethalin", postEmergence: "Imazethapyr (in soybean intercrop)", culturalControl: "25 DAS पर हाथ से निराई" },
      { id: "w3", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "15–45 DAS", preEmergence: "Pendimethalin", postEmergence: "हाथ से हटाएँ", culturalControl: "गर्मी में जुताई" },
    ],
  },
  mango: {
    slug: "mango", name: "Mango", emoji: "🥭",
    pests: [
      { id: "p1", name: "आम फुदका (Mango Hopper)", scientificName: "Idioscopus clypealis", image: IMG3, stage: "फूल आना", iracGroup: "IRAC 4A", control: "Imidacloprid / Buprofezin — बाली निकलने पर" },
      { id: "p2", name: "फल मक्खी (Fruit Fly)", scientificName: "Bactrocera dorsalis", image: IMG3, stage: "फल विकास", iracGroup: "IRAC 1B", control: "Methyl eugenol जाल + प्रलोभन छिड़काव" },
      { id: "p3", name: "आम मिलीबग (Mango Mealybug)", scientificName: "Drosicha mangiferae", image: IMG, stage: "नई पत्तियाँ", iracGroup: "IRAC 4A", control: "Chlorpyrifos तने पर बैंड + छिड़काव" },
    ],
    diseases: [
      { id: "d1", name: "एन्थ्रेक्नोज (Anthracnose)", pathogen: "Colletotrichum gloeosporioides", image: IMG2, stage: "फूल–फल", fracGroup: "FRAC M5", control: "Copper oxychloride — बारिश से पहले" },
      { id: "d2", name: "चूर्णिल फफूंद (Powdery Mildew)", pathogen: "Oidium mangiferae", image: IMG, stage: "फूल आना", fracGroup: "FRAC 3", control: "Wettable sulphur / Hexaconazole" },
      { id: "d3", name: "सूखना-पीछे हटना (Die-back)", pathogen: "Lasiodiplodia theobromae", image: IMG2, stage: "किसी भी अवस्था", fracGroup: "—", control: "संक्रमण से 15 cm नीचे काटें, Bordeaux paste" },
    ],
    weeds: [
      { id: "w1", name: "गाजर घास (Parthenium)", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "Monsoon flush", preEmergence: "बेसिन में Glyphosate (सुस्त अवस्था)", postEmergence: "काट-छाँट + मल्च", culturalControl: "अंतःफसल, बेसिन में मल्च" },
      { id: "w2", name: "दूब घास (Cynodon)", scientificName: "Cynodon dactylon", type: "Grassy", criticalPeriod: "Year-round basin", preEmergence: "Glyphosate ढककर छिड़काव", postEmergence: "काटना / हाथ से उखाड़ना", culturalControl: "बेसिन में काली पॉलिथीन मल्च" },
      { id: "w3", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "Rainy season", preEmergence: "Glyphosate ढककर", postEmergence: "कंद बनने से पहले हाथ से हटाएँ", culturalControl: "बाग में साफ खेत" },
    ],
  },
  banana: {
    slug: "banana", name: "Banana", emoji: "🍌",
    pests: [
      { id: "p1", name: "केले का एफिड (Banana Aphid)", scientificName: "Pentalonia nigronervosa", image: IMG3, stage: "वनस्पति", iracGroup: "IRAC 4A", control: "Imidacloprid डrench (Bunchy Top वाहक)" },
      { id: "p2", name: "कंद घुंवा (Rhizome Weevil)", scientificName: "Cosmopolites sordidus", image: IMG, stage: "Grand Naine", iracGroup: "IRAC 15", control: "Carbofuran कंद उपचार, फेरोमोन जाल" },
      { id: "p3", name: "थ्रिप्स (Thrips)", scientificName: "Chaetanaphothrips signipennis", image: IMG3, stage: "गुच्छा बनना", iracGroup: "IRAC 4A", control: "Spinosad / गुच्छे ढकना" },
    ],
    diseases: [
      { id: "d1", name: "सिगाटोका पत्ती धब्बा (Sigatoka Leaf Spot)", pathogen: "Mycosphaerella musicola", image: IMG2, stage: "वनस्पति", fracGroup: "FRAC 3", control: "Propiconazole / Oil emulsion छिड़काव" },
      { id: "d2", name: "पनामा मुरझान (Panama Wilt)", pathogen: "Fusarium oxysporum f.sp. cubense", image: IMG, stage: "किसी भी अवस्था", fracGroup: "—", control: "प्रतिरोधी किस्में (Grand Naine), Carbendazim डrench" },
      { id: "d3", name: "गुच्छेदार शीर्ष (Bunchy Top)", pathogen: "Banana Bunchy Top Virus", image: IMG2, stage: "वनस्पति", fracGroup: "—", control: "संक्रमित पौधे उखाड़ें, एफिड नियंत्रण" },
    ],
    weeds: [
      { id: "w1", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "0–90 DAP", preEmergence: "लगाने से पहले Glyphosate", postEmergence: "Glyphosate ढककर पंक्तियों के बीच", culturalControl: "गड्ढों में पॉलिथीन मल्च" },
      { id: "w2", name: "गाजर घास (Parthenium)", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "20–60 DAP", preEmergence: "गड्ढे साफ रखें", postEmergence: "बेसिन में हाथ से निराई", culturalControl: "सूखी पत्ती मल्च" },
      { id: "w3", name: "काकरा घास (Digitaria)", scientificName: "Digitaria spp.", type: "Grassy", criticalPeriod: "10–45 DAP", preEmergence: "पंक्तियों के बीच जुताई", postEmergence: "काट-छाँट", culturalControl: "पंक्तियों के बीच cover crop" },
    ],
  },
  grapes: {
    slug: "grapes", name: "Grapes", emoji: "🍇",
    pests: [
      { id: "p1", name: "थ्रिप्स (Thrips)", scientificName: "Scirtothrips dorsalis", image: IMG3, stage: "दाना बनना", iracGroup: "IRAC 4A", control: "Fipronil / Spinosad — दाने छूने पर" },
      { id: "p2", name: "फुदका भृंग (Flea Beetle)", scientificName: "Altica spp.", image: IMG3, stage: "नई पत्तियाँ", iracGroup: "IRAC 3A", control: "Quinalphos छिड़काव — नई पत्तियों पर" },
      { id: "p3", name: "मिलीबग (Mealybug)", scientificName: "Maconellicoccus hirsutus", image: IMG, stage: "दाना पकना", iracGroup: "IRAC 4A", control: "Buprofezin / Cryptolaemus छोड़ें" },
    ],
    diseases: [
      { id: "d1", name: "बलूत फफूंद (Downy Mildew)", pathogen: "Plasmopara viticola", image: IMG2, stage: "पूर्व-मानसून", fracGroup: "FRAC 40", control: "Metalaxyl + Mancozeb — बारिश से पहले" },
      { id: "d2", name: "चूर्णिल फफूंद (Powdery Mildew)", pathogen: "Erysiphe necator", image: IMG, stage: "दाना बनना", fracGroup: "FRAC 3", control: "Sulphur dust / Hexaconazole" },
      { id: "d3", name: "एन्थ्रेक्नोज (Anthracnose)", pathogen: "Elsinoe ampelina", image: IMG2, stage: "नई पत्तियाँ", fracGroup: "FRAC M5", control: "Copper oxychloride — छँटाई के बाद" },
    ],
    weeds: [
      { id: "w1", name: "दूब घास (Cynodon)", scientificName: "Cynodon dactylon", type: "Grassy", criticalPeriod: "Inter-row year-round", preEmergence: "Glyphosate in vine-free zone", postEmergence: "पंक्तियों के बीच काटना", culturalControl: "वीड मैट / जीवित मल्च" },
      { id: "w2", name: "मोठा (Cyperus)", scientificName: "Cyperus rotundus", type: "Sedge", criticalPeriod: "Rainy season", preEmergence: "Glyphosate directed", postEmergence: "बेसिन में हाथ से हटाएँ", culturalControl: "बेलों के नीचे प्लास्टिक मल्च" },
      { id: "w3", name: "गाजर घास (Parthenium)", scientificName: "Parthenium hysterophorus", type: "Broadleaf", criticalPeriod: "Monsoon", preEmergence: "Clean vineyard floor", postEmergence: "बीज बनने से पहले हाथ से हटाएँ", culturalControl: "पंक्तियों के बीच cover crop" },
    ],
  },
};

import { getIpmCatalogEntry, mergeIpmCatalog } from "@/lib/crops/ipmDataBridge";
import { mergeCropFieldGuideCatalog } from "@/lib/crops/cropFieldGuideBridge";
import { mergeWeedAbioticCatalog } from "@/lib/crops/weedAbioticBridge";
import { normalizeCropSlug } from "@/lib/crops/cropImages";

/** Empty catalog — never silently reuse another crop's pests/diseases. */
export function emptyCropPestDisease(slug: string): CropPestDiseaseData {
  const key = normalizeCropSlug(slug);
  const named = cropCatalog.find((c) => c.slug === key);
  return {
    slug: key,
    name: named?.name ?? key,
    emoji: named?.emoji ?? "🌱",
    pests: [],
    diseases: [],
    weeds: [],
  };
}

export function getCropPestDisease(slug: string): CropPestDiseaseData {
  const key = normalizeCropSlug(slug);
  const base = cropPestDiseaseData[key] ?? getIpmCatalogEntry(key);
  if (!base) return emptyCropPestDisease(key);
  return mergeWeedAbioticCatalog(
    mergeCropFieldGuideCatalog(mergeIpmCatalog({ ...base, slug: key }))
  );
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
