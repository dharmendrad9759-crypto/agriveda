/** Replace pest-disease control/stage/culturalControl using EN source + curated map. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN = path.join(__dirname, "../.tmp/pest-disease.en.ts");
const OUT = path.join(__dirname, "../data/pest-disease.ts");

// eslint-disable-next-line import/no-anonymous-default-export
const MAP = Object.fromEntries(
  Object.entries({
    "Tillering–heading": "कल्ले–बाली",
    "Vegetative–PI": "वनस्पति–बाली आरंभ",
    Tillering: "कल्ले",
    "Panicle initiation": "बाली आरंभ",
    Vegetative: "वनस्पति",
    Heading: "बाली",
    Seedling: "अंकुर",
    "Knee-high": "घुटने-ऊँचाई",
    Tasseling: "अन्वल",
    "Grand growth": "तेज़ वृद्धि",
    Flowering: "फूल आना",
    "Grain filling": "दाना भरना",
    "Tillering–grain fill": "कल्ले–दाना भरना",
    "Max tillering": "अधिकतम कल्ले",
    "Early growth": "शुरुआती वृद्धि",
    Storage: "भंडारण",
    "Tuber bulking": "कंद भरना",
    "Tuber formation": "कंद बनना",
    Fruiting: "फल लगना",
    "Fruit development": "फल विकास",
    "Any stage": "किसी भी अवस्था",
    "Bulb formation": "कंद बनना",
    "Bulb development": "कंद विकास",
    Maturity: "पकना",
    "Vegetative–fruiting": "वनस्पति–फल",
    "Flowering–fruiting": "फूल–फल",
    "Dry weather": "सूखा मौसम",
    "Square formation": "कली बनना",
    "Square–boll": "कली–रुई",
    "Boll development": "रुई गाँठ",
    "Grand Naine": "Grand Naine",
    "Bunch development": "गुच्छा बनना",
    "Berry development": "दाना बनना",
    "Berry ripening": "दाना पकना",
    "New flush": "नई पत्तियाँ",
    "Pre-monsoon": "पूर्व-मानसून",
    "Monsoon flush": "मानसूनी फ्लश",
    "Flowering–fruit": "फूल–फल",
    "Nursery–early field": "नर्सरी–शुरुआती खेत",
    "Pod formation": "फली बनना",
    "Pod filling": "फली भरना",
    Flush: "नई पत्तियाँ",
    Germination: "अंकुरण",
    "Inter-row year-round": "पंक्तियों के बीच — सालभर",
    "Rainy season": "बारिश का मौसम",
    "Year-round basin": "बेसिन — सालभर",

    "Buprofezin 25 SC @ 1 ml/L or Pymetrozine 50 WG @ 0.75 g/L or Triflumezopyrim 106 SC @ 0.5 ml/L — rotate MoA":
      "Buprofezin 25 SC @ 1 ml/L या Pymetrozine 50 WG @ 0.75 g/L या Triflumezopyrim 106 SC @ 0.5 ml/L — MoA घुमाएँ",
    "Cartap hydrochloride 50 SP @ 1 kg/ha or Chlorantraniliprole 18.5 SC @ 0.4 ml/L":
      "Cartap hydrochloride 50 SP @ 1 kg/ha या Chlorantraniliprole 18.5 SC @ 0.4 ml/L",
    "Emamectin benzoate 5 SG @ 0.4 g/L evening spray":
      "Emamectin benzoate 5 SG @ 0.4 g/L — शाम को छिड़काव",
    "Flubendiamide 20 WG @ 0.25 g/L or Spinosad 45 SC @ 0.3 ml/L":
      "Flubendiamide 20 WG @ 0.25 g/L या Spinosad 45 SC @ 0.3 ml/L",
    "Imidacloprid 200 SL @ 0.3 ml/L or Thiamethoxam 25 WG @ 0.2 g/L (tungro vector)":
      "Imidacloprid 200 SL @ 0.3 ml/L या Thiamethoxam 25 WG @ 0.2 g/L (tungro वाहक)",
    "Tricyclazole 75 WP @ 0.6 g/L at boot leaf; alternate Isoprothiolane 40 EC @ 1.5 ml/L":
      "Tricyclazole 75 WP @ 0.6 g/L बूट लीफ पर; बदलकर Isoprothiolane 40 EC @ 1.5 ml/L",
    "Validamycin 3 L @ 2.5 ml/L or Hexaconazole 5 EC @ 1 ml/L":
      "Validamycin 3 L @ 2.5 ml/L या Hexaconazole 5 EC @ 1 ml/L",
    "Streptocycline @ 0.15 g/L + Copper oxychloride 50 WP @ 3 g/L":
      "Streptocycline @ 0.15 g/L + Copper oxychloride 50 WP @ 3 g/L",
    "Mancozeb 75 WP @ 2 g/L or Propiconazole 25 EC @ 1 ml/L":
      "Mancozeb 75 WP @ 2 g/L या Propiconazole 25 EC @ 1 ml/L",
    "Propiconazole 25 EC @ 1 ml/L at boot leaf stage":
      "Propiconazole 25 EC @ 1 ml/L बूट लीफ अवस्था पर",
    "Imidacloprid seed treatment / Dimethoate spray":
      "Imidacloprid बीज उपचार / Dimethoate छिड़काव",
    "Chlorpyrifos seed treatment": "Chlorpyrifos बीज उपचार",
    "Cartap hydrochloride spray": "Cartap hydrochloride छिड़काव",
    "Propiconazole / Tebuconazole at first symptom":
      "Propiconazole / Tebuconazole पहले लक्षण पर",
    "Carboxin seed treatment, avoid late sowing":
      "Carboxin बीज उपचार, देर से बुवाई से बचें",
    "Carboxin / Tebuconazole seed treatment":
      "Carboxin / Tebuconazole बीज उपचार",
    "Emamectin benzoate / Chlorantraniliprole":
      "Emamectin benzoate / Chlorantraniliprole",
    "Cartap hydrochloride, light traps":
      "Cartap hydrochloride, प्रकाश जाल",
    "Carbofuran granules at sowing": "Carbofuran granules बुवाई पर",
    "Mancozeb + Metalaxyl spray": "Mancozeb + Metalaxyl छिड़काव",
    "Carbendazim / Mancozeb": "Carbendazim / Mancozeb",
    "Validamycin soil drench": "Validamycin मिट्टी डrench",
    "Carbofuran 3G @ 8 kg/ha at sowing":
      "Carbofuran 3G @ 8 kg/ha बुवाई पर",
    "Quinalphos spray at dead-heart stage":
      "Quinalphos छिड़काव — डेड-हार्ट अवस्था पर",
    "Indoxacarb / HaNPV spray": "Indoxacarb / HaNPV छिड़काव",
    "Metalaxyl seed treatment, resistant varieties":
      "Metalaxyl बीज उपचार, प्रतिरोधी किस्में",
    "Remove infected heads, spray before flowering":
      "संक्रमित बालियाँ हटाएँ, फूल आने से पहले छिड़काव",
    "Mancozeb / Propiconazole": "Mancozeb / Propiconazole",
    "Imidacloprid / Dimethoate": "Imidacloprid / Dimethoate",
    "Chlorpyrifos drench at soil level":
      "Chlorpyrifos मिट्टी स्तर पर डrench",
    "Malathion dust in store, field sanitation":
      "Malathion powder भंडार में, खेत सफाई",
    "Metalaxyl-M + Mancozeb prophylactic spray":
      "Metalaxyl-M + Mancozeb रोकथाम छिड़काव",
    "Mancozeb / Chlorothalonil": "Mancozeb / Chlorothalonil",
    "Carbendazim seed tuber treatment":
      "Carbendazim बीज-कंद उपचार",
    "Emamectin benzoate / HaNPV at ETL":
      "Emamectin benzoate / HaNPV — ETL पर",
    "Thiamethoxam / Neem oil": "Thiamethoxam / Neem oil",
    "Abamectin / Yellow sticky traps":
      "Abamectin / पीले चिपचिपे जाल",
    "Mancozeb + Copper oxychloride": "Mancozeb + Copper oxychloride",
    "Metalaxyl-M spray before rains":
      "Metalaxyl-M छिड़काव — बारिश से पहले",
    "Resistant hybrids, soil solarization":
      "प्रतिरोधी संकर, मिट्टी सौरीकरण",
    "Fipronil / Spinosad spray": "Fipronil / Spinosad छिड़काव",
    "Chlorpyrifos drench at planting":
      "Chlorpyrifos रोपाई/लगाई पर डrench",
    "Chlorantraniliprole bait": "Chlorantraniliprole प्रलोभन",
    "Mancozeb + Matalaxyl spray": "Mancozeb + Metalaxyl छिड़काव",
    "Propiconazole / Iprodione": "Propiconazole / Iprodione",
    "Carbendazim bulb dip, crop rotation":
      "Carbendazim कंद डुबोना, फसल चक्र",
    "Fipronil 5 SC @ 1.5–2 ml/L or Diafenthiuron 50 WP @ 1 g/L — rotate MoA":
      "Fipronil 5 SC @ 1.5–2 ml/L या Diafenthiuron 50 WP @ 1 g/L — MoA घुमाएँ",
    "Pyriproxyfen 10 EC @ 1 ml/L or Diafenthiuron 50 WP @ 1 g/L (leaf curl vector)":
      "Pyriproxyfen 10 EC @ 1 ml/L या Diafenthiuron 50 WP @ 1 g/L (पत्ती मरोड़ वाहक)",
    "Emamectin benzoate 5 SG @ 0.4 g/L or Chlorantraniliprole 18.5 SC @ 0.4 ml/L":
      "Emamectin benzoate 5 SG @ 0.4 g/L या Chlorantraniliprole 18.5 SC @ 0.4 ml/L",
    "Abamectin 1.9 EC @ 0.5–0.75 ml/L or Spiromesifen 240 SC @ 0.5 ml/L":
      "Abamectin 1.9 EC @ 0.5–0.75 ml/L या Spiromesifen 240 SC @ 0.5 ml/L",
    "Acetamiprid 20 SP @ 0.2–0.3 g/L — do not repeat 4A consecutively":
      "Acetamiprid 20 SP @ 0.2–0.3 g/L — 4A समूह लगातार दोहराएँ नहीं",
    "Mancozeb 75 WP @ 2 g/L + Carbendazim 50 WP @ 1 g/L":
      "Mancozeb 75 WP @ 2 g/L + Carbendazim 50 WP @ 1 g/L",
    "Prune infected twigs + Copper oxychloride 50 WP @ 3 g/L":
      "संक्रमित टहनियाँ काटें + Copper oxychloride 50 WP @ 3 g/L",
    "Rogue infected plants; Pyriproxyfen / Diafenthiuron for whitefly":
      "संक्रमित पौधे उखाड़ें; सफेद मक्खी के लिए Pyriproxyfen / Diafenthiuron",
    "Wettable sulphur 80 WP @ 2–3 g/L or Hexaconazole 5 EC @ 1 ml/L":
      "Wettable sulphur 80 WP @ 2–3 g/L या Hexaconazole 5 EC @ 1 ml/L",
    "Carbendazim seed treatment 2 g/kg; Metalaxyl+Mancozeb drench 2 g/L":
      "Carbendazim बीज उपचार 2 g/kg; Metalaxyl+Mancozeb डrench 2 g/L",
    "Bt cotton + pheromone traps, Flubendiamide":
      "Bt cotton + फेरोमोन जाल, Flubendiamide",
    "Pyriproxyfen / Diafenthiuron": "Pyriproxyfen / Diafenthiuron",
    "Imidacloprid seed treatment": "Imidacloprid बीज उपचार",
    "Acid-delinted seed, Streptocycline spray":
      "अम्ल-डिलिंटेड बीज, Streptocycline छिड़काव",
    "Mancozeb / Carbendazim": "Mancozeb / Carbendazim",
    "Trichoderma seed treatment, drainage":
      "Trichoderma बीज उपचार, जल निकास",
    "Carbofuran sett treatment, Trichogramma":
      "Carbofuran बीज उपचार, Trichogramma",
    "Dimethoate + release Epiricania": "Dimethoate + Epiricania छोड़ें",
    "Chlorpyrifos sett dip": "Chlorpyrifos बीज डुबोना",
    "Resistant varieties, hot water sett treatment":
      "प्रतिरोधी किस्में, गर्म पानी से बीज उपचार",
    "Remove whips, sett treatment with Carbendazim":
      "झाड़ियाँ हटाएँ, Carbendazim से बीज उपचार",
    "Rogue infected clumps, vector control":
      "संक्रमित गुच्छे उखाड़ें, वाहक नियंत्रण",
    "Carbofuran granules, remove girdled plants":
      "Carbofuran granules, कटे पौधे हटाएँ",
    "Novaluron / Indoxacarb": "Novaluron / Indoxacarb",
    "Thiamethoxam seed treatment": "Thiamethoxam बीज उपचार",
    "Propiconazole / Tebuconazole": "Propiconazole / Tebuconazole",
    "Resistant varieties, whitefly control":
      "प्रतिरोधी किस्में, सफेद मक्खी नियंत्रण",
    "Trichoderma seed treatment, well-drained soil":
      "Trichoderma बीज उपचार, अच्छी जल निकास वाली मिट्टी",
    "Dimethoate / Imidacloprid at ETL":
      "Dimethoate / Imidacloprid — ETL पर",
    "Quinalphos spray": "Quinalphos छिड़काव",
    "Quinalphos / Hand picking larvae":
      "Quinalphos / इल्लियाँ हाथ से उठाएँ",
    "Mancozeb / Metalaxyl spray": "Mancozeb / Metalaxyl छिड़काव",
    "Mancozeb + Carbendazim": "Mancozeb + Carbendazim",
    "Carbendazim at 50% flowering":
      "Carbendazim — 50% फूल आने पर",
    "HaNPV / Emamectin benzoate": "HaNPV / Emamectin benzoate",
    "Dimethoate spray at ETL": "Dimethoate छिड़काव — ETL पर",
    "Neem oil / Phosphine fumigation in store":
      "Neem oil / Phosphine धूमन — भंडार में",
    "Trichoderma seed treatment, resistant varieties":
      "Trichoderma बीज उपचार, प्रतिरोधी किस्में",
    "Wettable sulphur / Hexaconazole":
      "Wettable sulphur / Hexaconazole",
    "Mancozeb spray": "Mancozeb छिड़काव",
    "Imidacloprid / Buprofezin at panicle emergence":
      "Imidacloprid / Buprofezin — बाली निकलने पर",
    "Methyl eugenol traps + bait spray":
      "Methyl eugenol जाल + प्रलोभन छिड़काव",
    "Chlorpyrifos trunk banding + spray":
      "Chlorpyrifos तने पर बैंड + छिड़काव",
    "Copper oxychloride before rains":
      "Copper oxychloride — बारिश से पहले",
    "Prune 15 cm below infection, Bordeaux paste":
      "संक्रमण से 15 cm नीचे काटें, Bordeaux paste",
    "Imidacloprid drench (Bunchy Top vector)":
      "Imidacloprid डrench (Bunchy Top वाहक)",
    "Carbofuran corm treatment, pheromone traps":
      "Carbofuran कंद उपचार, फेरोमोन जाल",
    "Spinosad / bagging bunches": "Spinosad / गुच्छे ढकना",
    "Propiconazole / Oil emulsion spray":
      "Propiconazole / Oil emulsion छिड़काव",
    "Resistant varieties (Grand Naine), drench Carbendazim":
      "प्रतिरोधी किस्में (Grand Naine), Carbendazim डrench",
    "Rogue infected plants, aphid control":
      "संक्रमित पौधे उखाड़ें, एफिड नियंत्रण",
    "Fipronil / Spinosad at berry touch":
      "Fipronil / Spinosad — दाने छूने पर",
    "Quinalphos spray on new leaves":
      "Quinalphos छिड़काव — नई पत्तियों पर",
    "Buprofezin / Cryptolaemus release":
      "Buprofezin / Cryptolaemus छोड़ें",
    "Metalaxyl + Mancozeb before rains":
      "Metalaxyl + Mancozeb — बारिश से पहले",
    "Sulphur dust / Hexaconazole": "Sulphur dust / Hexaconazole",
    "Copper oxychloride after pruning":
      "Copper oxychloride — छँटाई के बाद",

    "Stale seedbed, puddling before transplant":
      "बासी बीज क्यारी, रोपाई से पहले खेत पोखर",
    "Maintain 5 cm standing water": "5 cm पानी खड़ा रखें",
    "Hand weeding at 20 & 40 DAS": "20 और 40 DAS पर हाथ से निराई",
    "Deep ploughing, clean seed": "गहरी जुताई, साफ बीज",
    "Crop rotation with legumes": "दलहनी फसलों के साथ फसल चक्र",
    "One hand weeding at 30 DAS": "30 DAS पर एक बार हाथ से निराई",
    "Interculture at knee-high stage": "घुटने-ऊँचाई पर मेड़-निराई",
    "Earthing up at 25 DAS": "25 DAS पर मेड़ चढ़ाना",
    "Deep summer ploughing": "गर्मी में गहरी जुताई",
    "Line sowing for inter-row cultivation":
      "पंक्ति बुवाई — मेड़-निराई के लिए",
    "Stale seedbed technique": "बासी बीज क्यारी विधि",
    "Competitive crop density": "घनी फसल खड़ी",
    "Earthing up covers small weeds":
      "मेड़ चढ़ाने से छोटे खरपतवार दब जाते हैं",
    "Mulching between rows": "पंक्तियों के बीच मल्च",
    "Deep ploughing in summer": "गर्मी में गहरी जुताई",
    "Deep ploughing": "गहरी जुताई",
    "Black plastic mulch": "काली प्लास्टिक मल्च",
    "Raised bed, drip irrigation": "ऊँची क्यारी, ड्रिप सिंचाई",
    "Interculture with hoe": "कुदाल से मेड़-निराई",
    "Stale seedbed before transplant":
      "रोपाई से पहले बासी बीज क्यारी",
    "Mulching, shallow cultivation": "मल्च, उथली जुताई",
    "Nursery weed-free transplant": "नर्सरी साफ रखकर रोपाई",
    "Summer fallow": "गर्मी में खेत खाली",
    "Raised beds with plastic mulch":
      "प्लास्टिक मल्च वाली ऊँची क्यारी",
    "Drip + mulching": "ड्रिप + मल्च",
    "Stale seedbed": "बासी बीज क्यारी",
    "Narrow row spacing": "संकीर्ण पंक्ति दूरी",
    "Summer ploughing": "गर्मी में जुताई",
    "Clean seed, crop rotation": "साफ बीज, फसल चक्र",
    "Line sowing, early vigour varieties":
      "पंक्ति बुवाई, जल्दी उगने वाली किस्में",
    "Intercropping, basin mulching": "अंतःफसल, बेसिन में मल्च",
    "Black polythene mulching in basin":
      "बेसिन में काली पॉलिथीन मल्च",
    "Clean cultivation in orchard floor": "बाग में साफ खेत",
    "Polythene mulch in pits": "गड्ढों में पॉलिथीन मल्च",
    "Dried leaf mulch": "सूखी पत्ती मल्च",
    "Cover cropping between rows":
      "पंक्तियों के बीच cover crop",
    "Weed mat / live mulch": "वीड मैट / जीवित मल्च",
    "Plastic mulch under vines": "बेलों के नीचे प्लास्टिक मल्च",
    "Inter-row cover crop": "पंक्तियों के बीच cover crop",
    "Trash mulching, earthing up": "परali मल्च, मेड़ चढ़ाना",
    "Trash blanket suppresses weeds":
      "परali की परत खरपतवार दबाती है",
    "Hoeing at squaring": "कली बनने पर कुदाल",
    "Crop rotation with cereals": "अनाज फसलों के साथ फसल चक्र",
    "Interculture + hand weeding": "मेड़-निराई + हाथ से निराई",
    "Line sowing for inter-row weeding":
      "पंक्ति बुवाई — मेड़-निराई के लिए",
    "Hand weeding at rosette stage":
      "रोसेट अवस्था पर हाथ से निराई",
    "Hand weeding at 25 DAS": "25 DAS पर हाथ से निराई",
    "Interculture at 45 & 90 DAP":
      "45 और 90 DAP पर मेड़-निराई",
    "Slashing + mulching": "काट-छाँट + मल्च",
    "Mowing / hand pulling": "काटना / हाथ से उखाड़ना",
    "Manual removal before tuber formation":
      "कंद बनने से पहले हाथ से हटाएँ",
    "Manual removal before flowering":
      "फूल आने से पहले हाथ से हटाएँ",
    "Hand weeding + mulching": "हाथ से निराई + मल्च",
    "Hand weeding + plastic mulch":
      "हाथ से निराई + प्लास्टिक मल्च",
    "Interculture between rows": "पंक्तियों के बीच मेड़-निराई",
    "Glyphosate in basin (dormant)":
      "बेसिन में Glyphosate (सुस्त अवस्था)",
    "Glyphosate directed spray": "Glyphosate ढककर छिड़काव",
    "Glyphosate shielded spray": "Glyphosate ढककर छिड़काव",
    "Glyphosate shielded": "Glyphosate ढककर",
    "Glyphosate before planting": "लगाने से पहले Glyphosate",
    "Glyphosate shielded inter-row":
      "Glyphosate ढककर पंक्तियों के बीच",
    "Manual clean pits": "गड्ढे साफ रखें",
    "Inter-row tillage": "पंक्तियों के बीच जुताई",
    Slashing: "काट-छाँट",
    "Mowing between rows": "पंक्तियों के बीच काटना",
    "Hand removal in basins": "बेसिन में हाथ से हटाएँ",
    "Manual before seed set": "बीज बनने से पहले हाथ से हटाएँ",
    "Clean vineyard floor": "अंगूर के बाग की जमीन साफ",
    "Glyphosate in vine-free zone":
      "बेल-मुक्त क्षेत्र में Glyphosate",
    "Manual removal": "हाथ से हटाएँ",
  })
);

function extractFields(text) {
  const re = /(control|culturalControl|stage):\s*"((?:\\.|[^"\\])*)"/g;
  const out = [];
  let m;
  while ((m = re.exec(text))) {
    out.push({
      field: m[1],
      en: m[2].replace(/\\"/g, '"'),
      full: m[0],
    });
  }
  return out;
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normDash(s) {
  return s
    .replace(/\u2013|\u2014|ΓÇô|ΓÇö|–|—/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function mapLookup(en) {
  const n = normDash(en);
  if (MAP[en]) return MAP[en];
  if (MAP[n]) return MAP[n];
  for (const [k, v] of Object.entries(MAP)) {
    if (normDash(k) === n) return v;
  }
  return null;
}

const enFields = extractFields(fs.readFileSync(EN, "utf8"));
let outText = fs.readFileSync(OUT, "utf8");
const outFields = extractFields(outText);

if (enFields.length !== outFields.length) {
  console.error(`Field count mismatch EN=${enFields.length} OUT=${outFields.length}`);
  process.exit(1);
}

let applied = 0;
let missing = [];
for (let i = 0; i < enFields.length; i++) {
  const hi = mapLookup(enFields[i].en);
  if (!hi) {
    missing.push(enFields[i].en);
    continue;
  }
  if (outFields[i].full === `${enFields[i].field}: "${esc(hi)}"`) continue;
  outText = outText.replace(outFields[i].full, `${enFields[i].field}: "${esc(hi)}"`);
  applied++;
}

fs.writeFileSync(OUT, outText, "utf8");
console.log(`Applied ${applied} replacements`);
if (missing.length) {
  const uniq = [...new Set(missing)];
  console.log(`Missing map entries: ${uniq.length}`);
  uniq.slice(0, 8).forEach((x) => console.log(" -", x));
}
