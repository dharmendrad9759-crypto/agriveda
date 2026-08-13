/**
 * Farmer-facing modern technicals (Master List 2026).
 * Doses/brands are from the supplied agronomy list — always label-check per crop.
 */

export type ChemBottleCategory = "insecticide" | "fungicide" | "herbicide" | "pgr";

export type ModernKind = "pest" | "disease" | "weed" | "pgr";

export type ModernTechnical = {
  slug: string;
  name: string;
  formulation: string;
  category: ChemBottleCategory;
  kind: ModernKind;
  aliases?: string[];
  brands: string[];
  doseAcre: string;
  moa: string;
  crops: string[];
  keys: string[];
  bestStage: string;
  targetHi: string;
};

const PADDY = ["paddy"];
const WHEAT = ["wheat"];
const MAIZE = ["maize"];
const COTTON = ["cotton"];
const SUGAR = ["sugarcane"];
const TOMATO = ["tomato"];
const CHILLI = ["chilli"];
const BRINJAL = ["brinjal"];
const CAULI = ["cauliflower"];
const ONION = ["onion"];
const CUCUMBER = ["cucumber"];
const POTATO = ["potato"];
const SOY = ["soybean"];
const GNUT = ["moongfali"];
const MOONG = ["moong"];
const BAJRA = ["bajra"];
const VEG = [...TOMATO, ...CHILLI, ...BRINJAL, ...CAULI, ...ONION, ...CUCUMBER];
const SUCKING = [...COTTON, ...CHILLI, ...TOMATO, ...BRINJAL, ...SOY, ...GNUT, ...MOONG];
const BORER = [...PADDY, ...MAIZE, ...SUGAR, ...TOMATO, ...CHILLI, ...BRINJAL, ...COTTON, ...CAULI];
const CEREAL_DIS = [...PADDY, ...WHEAT, ...MAIZE, ...BAJRA];
const BLIGHT = [...TOMATO, ...POTATO, ...CHILLI, ...ONION];
const RUST = [...WHEAT, ...SOY, ...GNUT, ...BAJRA];

function m(
  slug: string,
  name: string,
  formulation: string,
  category: ChemBottleCategory,
  kind: ModernKind,
  brands: string[],
  doseAcre: string,
  moa: string,
  crops: string[],
  keys: string[],
  bestStage: string,
  targetHi: string,
  aliases?: string[]
): ModernTechnical {
  return {
    slug,
    name,
    formulation,
    category,
    kind,
    brands,
    doseAcre,
    moa,
    crops,
    keys,
    bestStage,
    targetHi,
    aliases,
  };
}

export const MODERN_TECHNICALS: ModernTechnical[] = [
  m("isocycloseram-10-dc", "Isocycloseram", "10% DC", "insecticide", "pest", ["Simodis", "Incipio"], "80–100 मिलीलीटर प्रति एकड़", "IRAC 30", [...PADDY, ...CHILLI, ...COTTON, ...TOMATO, ...MAIZE], ["thrips", "थ्रिप्स", "mite", "मकड़", "मकोड़", "bph", "भूरा", "तना छेदक", "stem borer", "इल्ली", "hopper"], "वानस्पतिक से फूल", "थ्रिप्स, मकोड़ा, इल्ली, BPH, तना छेदक", ["plinazolin", "simodis", "incipio"]),
  m("broflanilide-20-sc", "Broflanilide", "20% SC", "insecticide", "pest", ["Cimegra"], "25–30 मिलीलीटर प्रति एकड़", "IRAC 30", [...PADDY, ...MAIZE, ...SUGAR, ...COTTON], ["तना छेदक", "stem borer", "faw", "fall army", "फॉल", "आर्मीवर्म", "beetle", "भृंग", "hispa", "हिस्पा"], "कल्ले / वानस्पतिक", "तना छेदक, फॉल आर्मीवर्म, भृंग", ["cimegra"]),
  m("tetraniliprole-200-sc", "Tetraniliprole", "200 g/L SC", "insecticide", "pest", ["Vayego"], "100–120 मिलीलीटर प्रति एकड़", "IRAC 28", BORER, ["faw", "फॉल", "तना छेदक", "stem borer", "फल छेदक", "fruit borer", "इल्ली", "armyworm", "helicoverpa", "हेलिको"], "फूल–फल", "फॉल आर्मीवर्म, तना/फल छेदक, इल्ली", ["vayego"]),
  m("afidopyropen-50-dc", "Afidopyropen", "50 g/L DC", "insecticide", "pest", ["Sefina"], "400 मिलीलीटर प्रति एकड़", "IRAC 9D", SUCKING, ["whitefly", "सफेद मक्खी", "aphid", "माहू", "माहो", "चेपा", "jassid", "तेला", "hopper"], "चूसक कीट दिखते ही", "सफेद मक्खी, माहू, हरा तेला", ["sefina"]),
  m("triflumezopyrim-10-sc", "Triflumezopyrim", "10% SC", "insecticide", "pest", ["Pyraxalt", "Pexalon"], "94 मिलीलीटर प्रति एकड़", "IRAC 4E", PADDY, ["bph", "भूरा", "brown plant", "glh", "हरा फुदका", "हरा लाही", "hopper", "फुदका"], "कल्ले–गभोट", "धान का भूरा माहू (BPH), हरा लाही", ["pyraxalt", "pexalon"]),
  m("cyantraniliprole-10-od", "Cyantraniliprole", "10.26% OD", "insecticide", "pest", ["Benevia", "Verimark"], "240–360 मिलीलीटर प्रति एकड़", "IRAC 28", [...VEG, ...COTTON], ["thrips", "थ्रिप्स", "whitefly", "सफेद मक्खी", "fruit borer", "फल छेदक", "borer", "छेदक"], "रोपाई के बाद / फूल", "चूसक कीट एवं छेदक इल्ली", ["benevia", "verimark"]),
  m("spiropidion-150-ec", "Spiropidion", "150 EC", "insecticide", "pest", ["Elestal Neo"], "200–250 मिलीलीटर प्रति एकड़", "IRAC 23", SUCKING, ["whitefly", "सफेद मक्खी", "mite", "मकड़", "aphid", "चेपा", "माहू", "mealy", "मिलीबग"], "चूसक/मकड़ी प्रकोप", "सफेद मक्खी, मकड़ी, चेपा", ["elestal"]),
  m("flupyradifurone-17-sl", "Flupyradifurone", "17.09% SL", "insecticide", "pest", ["Sivanto Prime"], "200–250 मिलीलीटर प्रति एकड़", "IRAC 4D", [...SUCKING, ...PADDY], ["aphid", "माहू", "whitefly", "सफेद मक्खी", "hopper", "फुदका", "तेला"], "चूसक कीट", "माहू, सफेद मक्खी, हॉपर", ["sivanto"]),
  m("sulfoxaflor-21-sc", "Sulfoxaflor", "21.8% SC", "insecticide", "pest", ["Transform", "Isoclast"], "100–120 मिलीलीटर प्रति एकड़", "IRAC 4C", [...SUCKING, ...PADDY], ["aphid", "माहू", "whitefly", "सफेद मक्खी", "mealy", "मिलीबग", "hopper", "फुदका"], "चूसक कीट", "माहू, सफेद मक्खी, मिलीबग, प्लान्टहॉपर", ["transform", "isoclast"]),
  m("chlorantraniliprole-18-5-sc", "Chlorantraniliprole", "18.5% SC", "insecticide", "pest", ["Coragen", "Cover"], "60 मिलीलीटर प्रति एकड़", "IRAC 28", BORER, ["तना छेदक", "stem borer", "फल छेदक", "fruit borer", "dbm", "diamond", "डायमंड", "armyworm", "आर्मी", "leaf folder", "पत्ती मोड़क", "pod borer"], "ETL पर, कल्ले/फूल", "तना/फल छेदक, DBM, आर्मीवर्म", ["coragen", "cover"]),
  m("chlorantraniliprole-0-4-gr", "Chlorantraniliprole", "0.4% GR", "insecticide", "pest", ["Ferterra"], "4 किलोग्राम प्रति एकड़", "IRAC 28 (दाना)", [...PADDY, ...SUGAR], ["तना छेदक", "stem borer", "चोटी छेदक", "top borer", "early shoot"], "रोपाई/कल्ले — दाना बुरकाव", "धान व गन्ने का शुरुआती तना/चोटी छेदक", ["ferterra"]),
  m("fluxametamide-10-ec", "Fluxametamide", "10% EC", "insecticide", "pest", ["Gracia"], "160 मिलीलीटर प्रति एकड़", "IRAC 30", [...VEG, ...COTTON, ...CAULI], ["thrips", "थ्रिप्स", "fruit borer", "फल छेदक", "dbm", "diamond", "डायमंड"], "फूल–फल", "थ्रिप्स, फल छेदक, DBM", ["gracia"]),
  m("spinetoram-11-7-sc", "Spinetoram", "11.7% SC", "insecticide", "pest", ["Delegate"], "180–200 मिलीलीटर प्रति एकड़", "IRAC 5", [...VEG, ...COTTON, ...CAULI], ["thrips", "थ्रिप्स", "spodoptera", "स्पोडो", "fruit borer", "फल छेदक", "dbm"], "फूल–फल", "थ्रिप्स, स्पोडोप्टेरा, फल छेदक", ["delegate"]),
  m("flubendiamide-39-sc", "Flubendiamide", "39.35% SC", "insecticide", "pest", ["Fame"], "40–50 मिलीलीटर प्रति एकड़", "IRAC 28", [...COTTON, ...TOMATO, ...CHILLI, ...PADDY, ...GNUT], ["helicoverpa", "हेलिको", "अमेरिकी", "fruit borer", "फल छेदक", "तना छेदक", "stem borer", "pod borer"], "फूल–गांठ", "अमेरिकी सुंडी, फल/तना छेदक", ["fame"]),
  m("pyridalyl-10-ec", "Pyridalyl", "10% EC", "insecticide", "pest", ["Pleora"], "300–400 मिलीलीटर प्रति एकड़", "Cellular energy inhibitor", [...COTTON, ...CAULI, ...CHILLI, ...TOMATO], ["helicoverpa", "हेलिको", "spodoptera", "स्पोडो", "dbm", "diamond", "डायमंड"], "इल्ली प्रकोप", "हेलिकोवर्पा, स्पोडोप्टेरा, DBM", ["pleora"]),
  m("chlorfenapyr-10-sc", "Chlorfenapyr", "10% SC", "insecticide", "pest", ["Intrepid", "Keiron"], "300–400 मिलीलीटर प्रति एकड़", "IRAC 13", [...VEG, ...COTTON, ...CHILLI], ["mite", "मकड़", "dbm", "diamond", "thrips", "थ्रिप्स"], "मकड़ी/थ्रिप्स", "लाल मकड़ी, DBM, थ्रिप्स", ["intrepid", "keiron"]),
  m("spiromesifen-22-9-sc", "Spiromesifen", "22.9% SC", "insecticide", "pest", ["Oberon"], "150–200 मिलीलीटर प्रति एकड़", "IRAC 23", SUCKING, ["whitefly", "सफेद मक्खी", "mite", "मकड़", "nymph"], "सफेद मक्खी के बच्चे / मकड़ी", "सफेद मक्खी निम्फ, लाल मकड़ी", ["oberon"]),
  m("spirotetramat-15-od", "Spirotetramat", "15.31% OD", "insecticide", "pest", ["Movento Energy"], "200 मिलीलीटर प्रति एकड़", "IRAC 23", [...COTTON, ...CHILLI, ...CUCUMBER, ...BRINJAL], ["mealy", "मिलीबग", "scale", "स्केल", "whitefly", "सफेद मक्खी", "thrips", "थ्रिप्स"], "मिलीबग/स्केल", "मिलीबग, स्केल, सफेद मक्खी, थ्रिप्स", ["movento"]),
  m("dinotefuran-20-sg", "Dinotefuran", "20% SG", "insecticide", "pest", ["Oshin"], "60–80 ग्राम प्रति एकड़", "IRAC 4A", [...PADDY, ...CHILLI, ...COTTON], ["bph", "भूरा", "hopper", "फुदका", "thrips", "थ्रिप्स", "हरा मच्छर"], "कल्ले / चूसक", "BPH, हरा मच्छर, थ्रिप्स", ["oshin"]),
  m("pymetrozine-50-wg", "Pymetrozine", "50% WG", "insecticide", "pest", ["Chess"], "120–150 ग्राम प्रति एकड़", "IRAC 9B", PADDY, ["bph", "भूरा", "hopper", "फुदका", "aphid", "चेपा"], "BPH प्रकोप", "धान का भूरा माहू, चेपा", ["chess"]),
  m("benzpyrimoxan-10-sc", "Benzpyrimoxan", "10% SC", "insecticide", "pest", ["Orchestra"], "300 मिलीलीटर प्रति एकड़", "Chitin biosynthesis inhibitor", PADDY, ["bph", "भूरा", "nymph", "फुदका"], "BPH निम्फ", "धान का भूरा माहू (निम्फ)", ["orchestra"]),
  m("flonicamid-50-wg", "Flonicamid", "50% WG", "insecticide", "pest", ["Ulala"], "60–80 ग्राम प्रति एकड़", "IRAC 29", SUCKING, ["whitefly", "सफेद मक्खी", "aphid", "चेपा", "माहू", "jassid", "तेला", "thrips", "थ्रिप्स"], "चूसक कीट", "सफेद मक्खी, चेपा, तेला, थ्रिप्स", ["ulala"]),
  m("diafenthiuron-50-wp", "Diafenthiuron", "50% WP", "insecticide", "pest", ["Pegasus"], "200–250 ग्राम प्रति एकड़", "IRAC 12", [...COTTON, ...CHILLI, ...BRINJAL], ["thrips", "थ्रिप्स", "mite", "मकड़", "whitefly", "सफेद मक्खी"], "चूसक + मकड़ी", "थ्रिप्स, मकड़ी, सफेद मक्खी", ["pegasus"]),
  m("fluazaindolizine", "Fluazaindolizine", "Nematicide", "insecticide", "pest", ["Reklemel"], "मृदा उपचार — लेबल अनुसार", "Group N-1", [...TOMATO, ...CHILLI, ...CUCUMBER, ...GNUT, ...SOY, ...POTATO], ["nematode", "नेमाटोड", "सूत्रकृमि", "root-knot", "रूट-नॉट"], "रोपाई/बुवाई से पहले मिट्टी", "रूट-नॉट सूत्रकृमि", ["reklemel"]),
  m("dicloromezotiaz", "Dicloromezotiaz", "Mesoionic", "insecticide", "pest", ["Simpyl"], "80–100 मिलीलीटर प्रति एकड़", "IRAC 4E", PADDY, ["bph", "भूरा", "glh", "हरा लाही", "hopper", "फुदका"], "BPH/GLH", "धान का भूरा माहू, हरा लाही", ["simpyl"]),
  m("flupyrimin", "Flupyrimin", "Rice active", "insecticide", "pest", ["Syngenta Rice active"], "100 मिलीलीटर प्रति एकड़", "Nicotinic receptor modulator", PADDY, ["bph", "भूरा", "thrips", "थ्रिप्स", "hopper", "फुदका", "चूसक"], "चूसक कीट / BPH", "चूसक कीट, BPH, थ्रिप्स"),
  m("fluensulfone", "Fluensulfone", "Nematicide", "insecticide", "pest", ["Nimitz"], "1–1.5 लीटर प्रति एकड़ (मृदा)", "Fluoroalkenyl nematicide", [...TOMATO, ...CHILLI, ...CUCUMBER, ...GNUT, ...POTATO], ["nematode", "नेमाटोड", "सूत्रकृमि", "root-knot", "रूट-नॉट"], "मृदा उपचार", "रूट-नॉट नेमाटोड", ["nimitz"]),
  m("cyflumetofen-20-sc", "Cyflumetofen", "20% SC", "insecticide", "pest", ["Nealta"], "200–250 मिलीलीटर प्रति एकड़", "METI Complex II", [...CHILLI, ...BRINJAL, ...COTTON, ...CUCUMBER], ["mite", "मकड़", "spider mite", "लाल मकड़ी", "पीली मकड़ी"], "मकड़ी की सभी अवस्था", "लाल एवं पीली मकड़ी", ["nealta"]),
  m("acynonapyr", "Acynonapyr", "Acaricide", "insecticide", "pest", ["Pyranica"], "150–200 मिलीलीटर प्रति एकड़", "IRAC 25A", [...CHILLI, ...BRINJAL, ...COTTON], ["mite", "मकड़", "spider mite", "लाल मकड़ी"], "मकड़ी", "मकड़ी की सभी अवस्थाएँ", ["pyranica"]),
  m("pyrifluquinazon-20-sc", "Pyrifluquinazon", "20% SC", "insecticide", "pest", ["Colt"], "200 मिलीलीटर प्रति एकड़", "IRAC 9B", SUCKING, ["whitefly", "सफेद मक्खी", "aphid", "माहू", "thrips", "थ्रिप्स"], "चूसक कीट", "सफेद मक्खी, माहू, थ्रिप्स", ["colt"]),
  m("cyhalodiamide", "Cyhalodiamide", "Group 28", "insecticide", "pest", ["Syngenta Active"], "100–120 मिलीलीटर प्रति एकड़", "IRAC 28", BORER, ["फल छेदक", "fruit borer", "तना छेदक", "stem borer", "इल्ली", "borer"], "फूल–फल", "फल/तना छेदक, इल्ली"),
  m("fenpyroximate-5-ec", "Fenpyroximate", "5% EC", "insecticide", "pest", ["Sedna", "Pyrote"], "300–400 मिलीलीटर प्रति एकड़", "IRAC 21A", [...CHILLI, ...BRINJAL, ...COTTON], ["mite", "मकड़", "thrips", "थ्रिप्स"], "मकड़ी व थ्रिप्स", "लाल मकड़ी एवं थ्रिप्स", ["sedna", "pyrote"]),
  m("tioxazafen", "Tioxazafen", "Seed treatment", "insecticide", "pest", ["Bayer seed"], "बीजोपचार — लेबल अनुसार", "Nematicidal seed treatment", [...SOY, ...MAIZE], ["nematode", "नेमाटोड", "सूत्रकृमि"], "बीजोपचार", "सोयाबीन व मक्का में नेमाटोड"),
  m("tebufenpyrad-20-wp", "Tebufenpyrad", "20% WP", "insecticide", "pest", ["Samurai"], "100–150 ग्राम प्रति एकड़", "IRAC 21A", [...CHILLI, ...BRINJAL, ...COTTON], ["mite", "मकड़", "मकोड़"], "मकड़ी", "मकोड़ा/मकड़ी", ["samurai"]),

  m("pydiflumetofen-fludioxonil", "Pydiflumetofen + Fludioxonil", "7.5% + 2.5% SC", "fungicide", "disease", ["Miravis Duo"], "200 मिलीलीटर प्रति एकड़", "FRAC 7 + 12", [...VEG, ...GNUT, ...SOY], ["powdery", "पाउडरी", "alternaria", "अल्टरनेरिया", "fruit rot", "फल सड़न", "leaf spot", "धब्बा"], "फूल–फल", "पाउडरी मिलड्यू, अल्टरनेरिया, फल सड़न", ["miravis"]),
  m("fenpicoxamid", "Fenpicoxamid", "Inatreq", "fungicide", "disease", ["Questar", "Univoq"], "200–250 मिलीलीटर प्रति एकड़", "FRAC 21 QiI", [...WHEAT, ...PADDY], ["septoria", "सेप्टोरिया", "rust", "रतुआ", "blight", "झुलसा"], "पत्ती रोग", "सेप्टोरिया, रतुआ, झुलसा", ["questar", "univoq", "inatreq"]),
  m("isoflucypram-500-sc", "Isoflucypram", "500 SC", "fungicide", "disease", ["Cayunis"], "150–200 मिलीलीटर प्रति एकड़", "FRAC 7 SDHI", RUST, ["rust", "रतुआ", "leaf spot", "पत्ती धब्बा", "net blotch", "नेट ब्लॉच"], "पत्ती रोग", "रतुआ, पत्ती धब्बा, नेट ब्लॉच", ["cayunis"]),
  m("benzovindiflupyr", "Benzovindiflupyr", "Solatenol", "fungicide", "disease", ["Elatus Plus"], "150–200 मिलीलीटर प्रति एकड़", "FRAC 7 SDHI", [...CEREAL_DIS, ...SOY], ["rust", "रतुआ", "sheath blight", "शीथ", "leaf spot", "लीफ स्पॉट"], "कल्ले–गभोट", "रतुआ, शीथ ब्लाइट, लीफ स्पॉट", ["elatus", "solatenol"]),
  m("fluxapyroxad-250-sc", "Fluxapyroxad", "250 g/L SC", "fungicide", "disease", ["Sercadis", "Xemium"], "100–120 मिलीलीटर प्रति एकड़", "FRAC 7 SDHI", [...PADDY, ...SOY, ...GNUT, ...VEG], ["sheath blight", "शीथ", "powdery", "पाउडरी", "rhizoctonia", "राइज़ोक्टोनिया"], "पत्ती/तना रोग", "शीथ ब्लाइट, पाउडरी मिलड्यू, राइज़ोक्टोनिया", ["sercadis", "xemium"]),
  m("fluopyram-34-sc", "Fluopyram", "34.48% SC", "fungicide", "disease", ["Velum Prime"], "200–250 मिलीलीटर प्रति एकड़", "FRAC 7 / nematicide", [...TOMATO, ...CHILLI, ...GNUT, ...POTATO], ["nematode", "नेमाटोड", "powdery", "पाउडरी", "सूत्रकृमि"], "मृदा / पाउडरी", "रूट-नॉट नेमाटोड, पाउडरी मिलड्यू", ["velum"]),
  m("prothioconazole-37-sc", "Prothioconazole", "37.8% SC", "fungicide", "disease", ["Proline", "Redigo"], "150 मिलीलीटर प्रति एकड़", "FRAC 3 DMI", [...WHEAT, ...MAIZE, ...SOY], ["fusarium", "फ्यूजेरियम", "rust", "रतुआ", "blight", "झुलसा"], "पत्ती रोग", "फ्यूजेरियम, पीला रतुआ, पत्ती झुलसा", ["proline", "redigo"]),
  m("oxathiapiprolin-10-od", "Oxathiapiprolin", "10.1% OD", "fungicide", "disease", ["Zorvec Enicade"], "20 मिलीलीटर प्रति एकड़", "FRAC 49 OSBP", [...BLIGHT, ...CUCUMBER, ...GNUT], ["downy", "डाउनी", "late blight", "लेट ब्लाइट", "पिछेती", "phytophthora"], "डाउनी/लेट ब्लाइट", "डाउनी मिलड्यू, पिछेती झुलसा", ["zorvec"]),
  m("mandipropamid-23-sc", "Mandipropamid", "23.4% SC", "fungicide", "disease", ["Revus"], "200 मिलीलीटर प्रति एकड़", "FRAC 40 CAA", [...BLIGHT, ...CUCUMBER], ["late blight", "लेट ब्लाइट", "downy", "डाउनी", "phytophthora"], "लेट ब्लाइट / डाउनी", "लेट ब्लाइट, डाउनी मिलड्यू", ["revus"]),
  m("tebuconazole-trifloxystrobin", "Tebuconazole + Trifloxystrobin", "50% + 25% WG", "fungicide", "disease", ["Nativo"], "80–120 ग्राम प्रति एकड़", "FRAC 3 + 11", [...PADDY, ...SOY, ...GNUT, ...CHILLI], ["blast", "ब्लास्ट", "sheath blight", "शीथ", "anthracnose", "एंथ्रेक्नोज", "tikka", "टिक्का"], "गभोट / पत्ती रोग", "ब्लास्ट, शीथ ब्लाइट, एंथ्रेक्नोज", ["nativo"]),
  m("azoxystrobin-tebuconazole", "Azoxystrobin + Tebuconazole", "11% + 18.3% SC", "fungicide", "disease", ["Custodia"], "250–300 मिलीलीटर प्रति एकड़", "FRAC 11 + 3", [...PADDY, ...ONION, ...CHILLI, ...GNUT], ["fruit rot", "फ्रूट रॉट", "purple blotch", "पर्पल", "blast", "ब्लास्ट", "sheath blight", "शीथ"], "पत्ती/फल रोग", "फ्रूट रॉट, पर्पल ब्लॉच, ब्लास्ट", ["custodia"]),
  m("azoxystrobin-difenoconazole", "Azoxystrobin + Difenoconazole", "18.2% + 11.4% SC", "fungicide", "disease", ["Amistar Top"], "200 मिलीलीटर प्रति एकड़", "FRAC 11 + 3", [...VEG, ...PADDY, ...SOY], ["blight", "झुलसा", "leaf spot", "पत्ती धब्बा", "powdery", "पाउडरी", "rust", "रतुआ"], "पत्ती रोग", "झुलसा, पत्ती धब्बा, पाउडरी मिलड्यू", ["amistar"]),
  m("cyflufenamid-5-ew", "Cyflufenamid", "5% EW", "fungicide", "disease", ["Nishiko", "Cyfluid"], "100 मिलीलीटर प्रति एकड़", "FRAC U6", [...VEG, ...CUCUMBER, ...CHILLI], ["powdery", "पाउडरी", "mildew", "मिलड्यू"], "पाउडरी मिलड्यू", "पाउडरी मिलड्यू (सभी फसल)", ["nishiko", "cyfluid"]),
  m("kresoxim-methyl-44-sc", "Kresoxim-methyl", "44.3% SC", "fungicide", "disease", ["Ergon"], "200 मिलीलीटर प्रति एकड़", "FRAC 11 QoI", [...PADDY, ...VEG], ["blast", "ब्लास्ट", "powdery", "पाउडरी"], "ब्लास्ट / पाउडरी", "धान का ब्लास्ट, पाउडरी फफूंदी", ["ergon"]),
  m("thifluzamide-24-sc", "Thifluzamide", "24% SC", "fungicide", "disease", ["Pulsor"], "150 मिलीलीटर प्रति एकड़", "FRAC 7 SDHI", PADDY, ["sheath blight", "शीथ ब्लाइट", "sheath"], "शीथ ब्लाइट", "धान का शीथ ब्लाइट", ["pulsor"]),
  m("ametoctradin-dimethomorph", "Ametoctradin + Dimethomorph", "27% + 20.27% SC", "fungicide", "disease", ["Zampro"], "300–400 मिलीलीटर प्रति एकड़", "FRAC 45 + 40", [...POTATO, ...TOMATO, ...CUCUMBER, ...GNUT], ["downy", "डाउनी", "late blight", "लेट ब्लाइट", "phytophthora"], "लेट ब्लाइट / डाउनी", "डाउनी मिलड्यू, आलू का लेट ब्लाइट", ["zampro"]),
  m("pyraziflumid", "Pyraziflumid", "SDHI", "fungicide", "disease", ["Parade"], "150–200 मिलीलीटर प्रति एकड़", "FRAC 7 SDHI", [...VEG, ...SOY, ...WHEAT], ["rot", "सड़ांध", "sclerotinia", "स्क्लेरो", "rust", "रतुआ"], "सड़न / रतुआ", "सड़ांध, स्क्लेरोटिनिया, रतुआ", ["parade"]),
  m("metyltetraprorole", "Metyltetraprorole", "QoI", "fungicide", "disease", ["Pavecto"], "150 मिलीलीटर प्रति एकड़", "FRAC 11", [...WHEAT, ...PADDY], ["septoria", "सेप्टोरिया", "rust", "रतुआ"], "रतुआ (प्रतिरोधी)", "सेप्टोरिया, रतुआ", ["pavecto"]),
  m("inpyrfluxam", "Inpyrfluxam", "SDHI", "fungicide", "disease", ["Indiflin"], "100–120 मिलीलीटर प्रति एकड़", "FRAC 7", [...PADDY, ...ONION, ...WHEAT], ["sheath blight", "शीथ", "rust", "रतुआ", "purple blotch", "पर्पल"], "शीथ / रतुआ", "शेथ ब्लाइट, रतुआ, पर्पल ब्लॉच", ["indiflin"]),
  m("penflufen-240-fs", "Penflufen", "240 FS", "fungicide", "disease", ["Emesto Prime"], "100 मिली / 100 किलो बीज", "FRAC 7 seed", POTATO, ["black scurf", "ब्लैक स्कर्फ", "seed borne", "बीज जनित", "rhizoctonia"], "बीज/कंद उपचार", "आलू का ब्लैक स्कर्फ, बीज जनित फफूंद", ["emesto"]),
  m("sedaxane-50-fs", "Sedaxane", "50 FS", "fungicide", "disease", ["Vibrance"], "बीजोपचार — लेबल अनुसार", "FRAC 7 root health", [...WHEAT, ...MAIZE, ...SOY], ["root rot", "जड़ सड़न", "damping", "डैम्पिंग"], "बीजोपचार", "जड़ों का सड़न, डैम्पिंग ऑफ", ["vibrance"]),
  m("ipflufenoquin", "Ipflufenoquin", "Group 52", "fungicide", "disease", ["Nippon Soda Active"], "150–200 मिलीलीटर प्रति एकड़", "FRAC 52 DHODH", VEG, ["powdery", "पाउडरी", "scab", "स्कैब"], "पाउडरी / स्कैब", "पाउडरी मिलड्यू, स्कैब"),
  m("quinofumelin", "Quinofumelin", "Quinoline", "fungicide", "disease", ["Mitsui Active"], "150 मिलीलीटर प्रति एकड़", "Quinoline fungicide", [...VEG, ...SOY], ["sclerotinia", "स्क्लेरो", "botrytis", "बोट्रीटिस", "सड़ांध"], "सड़न", "स्क्लेरोटिनिया, बोट्रीटिस"),
  m("fluoxastrobin-480-sc", "Fluoxastrobin", "480 SC", "fungicide", "disease", ["Evito"], "150–200 मिलीलीटर प्रति एकड़", "FRAC 11", [...CEREAL_DIS, ...SOY], ["leaf spot", "लीफ स्पॉट", "rust", "रतुआ", "blight", "झुलसा"], "पत्ती रोग", "लीफ स्पॉट, रतुआ, झुलसा", ["evito"]),
  m("isopyrazam-12-sc", "Isopyrazam", "12.5% SC", "fungicide", "disease", ["Reflect"], "200 मिलीलीटर प्रति एकड़", "FRAC 7", [...WHEAT, ...VEG], ["tikka", "टिकैत", "powdery", "पाउडरी"], "टिकैत / पाउडरी", "टिकैत रोग, पाउडरी मिलड्यू", ["reflect"]),
  m("penthiopyrad-20-sc", "Penthiopyrad", "20% SC", "fungicide", "disease", ["Fontelis"], "200–250 मिलीलीटर प्रति एकड़", "FRAC 7", [...TOMATO, ...POTATO, ...ONION, ...GNUT], ["early blight", "अगेती", "alternaria", "अल्टरनेरिया"], "अगेती झुलसा", "अगेती झुलसा, अल्टरनेरिया", ["fontelis"]),
  m("fluoxapiprolin", "Fluoxapiprolin", "Group 49", "fungicide", "disease", ["Corteva Active"], "20–30 मिलीलीटर प्रति एकड़", "FRAC 49 OSBP", [...BLIGHT, ...CUCUMBER], ["downy", "डाउनी", "late blight", "लेट ब्लाइट"], "डाउनी / लेट ब्लाइट", "डाउनी मिलड्यू, लेट ब्लाइट"),

  m("florpyrauxifen-benzyl-2-7-ec", "Florpyrauxifen-benzyl", "2.7% EC", "herbicide", "weed", ["Novect", "Loyant"], "400 मिलीलीटर प्रति एकड़", "HRAC 4", PADDY, ["सावां", "barnyard", "मोथा", "sedge", "चौड़ी पत्ती", "broadleaf", "echinochloa"], "धान — पोस्ट इमर्जेंस", "धान में चौड़ी पत्ती, मोथा, सावां", ["rinskor", "novect", "loyant"]),
  m("halauxifen-methyl", "Halauxifen-methyl", "Arylex", "herbicide", "weed", ["Elevore", "Pixaro"], "10–12 ग्राम प्रति एकड़", "HRAC 4", WHEAT, ["चौड़ी पत्ती", "broadleaf", "गेहूं", "bathua", "बथुआ"], "गेहूं — चौड़ी पत्ती", "गेहूं में जिद्दी चौड़ी पत्ती खरपतवार", ["elevore", "pixaro", "arylex"]),
  m("pyroxasulfone-85-wg", "Pyroxasulfone", "85% WG", "herbicide", "weed", ["Yamato", "Zidua"], "60 ग्राम प्रति एकड़", "HRAC 15", WHEAT, ["गुल्ली", "phalaris", "सकरी पत्ती", "grass"], "गेहूं — प्री/अर्ली पोस्ट", "गेहूं में गुल्ली डंडा व सकरी पत्ती", ["yamato", "zidua"]),
  m("tembotrione-34-sc", "Tembotrione", "34.4% SC", "herbicide", "weed", ["Laudis"], "115 मिलीलीटर प्रति एकड़", "HRAC 27", MAIZE, ["मक्का", "चौड़ी", "सकरी", "grass", "broadleaf"], "मक्का — पोस्ट इमर्जेंस", "मक्का में चौड़ी व सकरी पत्ती", ["laudis"]),
  m("topramezone-33-sc", "Topramezone", "33.6% SC", "herbicide", "weed", ["Impact", "Xpert"], "30–40 मिलीलीटर प्रति एकड़", "HRAC 27", MAIZE, ["मक्का", "घास", "चौड़ी", "grass"], "मक्का — पोस्ट इमर्जेंस", "मक्का में घास व चौड़ी पत्ती", ["impact", "xpert"]),
  m("tiafenacil-70-wg", "Tiafenacil", "70% WG", "herbicide", "weed", ["Terrad'or"], "20–30 ग्राम प्रति एकड़", "HRAC 14", [...COTTON, ...SOY], ["बर्नडाउन", "burndown", "non-selective", "गैर-फसली"], "बुवाई से पहले बर्नडाउन", "गैर-फसली / बर्नडाउन", ["terrador"]),
  m("triafamone-ethoxysulfuron", "Triafamone + Ethoxysulfuron", "20% + 10% WG", "herbicide", "weed", ["Council Activ"], "90 ग्राम प्रति एकड़", "HRAC 2", PADDY, ["धान", "early weed", "सावां", "मोथा", "dsr"], "धान शुरुआती खरपतवार", "धान के शुरुआती खरपतवार", ["council"]),
  m("bispyribac-sodium-10-sc", "Bispyribac Sodium", "10% SC", "herbicide", "weed", ["Nominee Gold"], "80–100 मिलीलीटर प्रति एकड़", "HRAC 2", PADDY, ["सावां", "barnyard", "मोथा", "sedge", "चौड़ी", "धान"], "धान 15–25 दिन", "धान के प्रमुख सकरी व चौड़ी पत्ती खरपतवार", ["nominee"]),
  m("flumioxazin-50-sc", "Flumioxazin", "50% SC", "herbicide", "weed", ["Sumimax"], "100–120 मिलीलीटर प्रति एकड़", "HRAC 14", [...SOY, ...COTTON, ...GNUT], ["pre-emergence", "प्री-इमर्जेंस", "सोयाबीन", "कपास"], "प्री-इमर्जेंस", "सोयाबीन व कपास में प्री-इमर्जेंस", ["sumimax"]),
  m("pinoxaden-5-ec", "Pinoxaden", "5.1% EC", "herbicide", "weed", ["Axial"], "350–400 मिलीलीटर प्रति एकड़", "HRAC 1", WHEAT, ["गुल्ली", "phalaris", "जंगली जई", "wild oat", "सकरी"], "गेहूं — सकरी पत्ती", "गेहूं में गुल्ली डंडा एवं जंगली जई", ["axial"]),
  m("haloxyfop-r-methyl-10-ec", "Haloxyfop-R-methyl", "10.5% EC", "herbicide", "weed", ["Gallant", "Verdict"], "300–400 मिलीलीटर प्रति एकड़", "HRAC 1", [...SOY, ...COTTON, ...GNUT, ...MOONG], ["सकरी पत्ती", "grass", "narrow", "घास"], "दलहन/तिलहन — सकरी पत्ती", "चौड़ी पत्ती फसल में सकरी पत्ती घास", ["gallant", "verdict"]),
  m("bicyclopyrone", "Bicyclopyrone", "HPPD", "herbicide", "weed", ["Acuron"], "150–200 मिलीलीटर प्रति एकड़", "HRAC 27", MAIZE, ["मक्का", "जिद्दी", "grass", "broadleaf"], "मक्का", "मक्का में जिद्दी खरपतवार", ["acuron"]),
  m("cinmethylin", "Cinmethylin", "FAT inhibitor", "herbicide", "weed", ["Luximo"], "200 मिलीलीटर प्रति एकड़", "HRAC 30", WHEAT, ["गुल्ली", "phalaris", "blackgrass", "प्रतिरोधी"], "प्रतिरोधी गुल्ली डंडा", "प्रतिरोधी गुल्ली डंडा", ["luximo"]),
  m("tetflupyrolimet", "Tetflupyrolimet", "DHODH", "herbicide", "weed", ["FMC Rice Active"], "प्री/पोस्ट — लेबल अनुसार", "HRAC 28", PADDY, ["धान", "सावां", "grass", "प्रतिरोधी घास"], "धान प्रतिरोधी घास", "धान में प्रतिरोधी घास खरपतवार"),
  m("trifludimoxazin", "Trifludimoxazin", "PPO", "herbicide", "weed", ["Tirexor"], "20–30 ग्राम प्रति एकड़", "HRAC 14", [...SOY, ...COTTON], ["burndown", "बर्नडाउन", "pre-emergence", "प्री-इमर्जेंस"], "बर्नडाउन / प्री-इमर्जेंस", "बर्नडाउन एवं प्री-इमर्जेंस", ["tirexor"]),
  m("saflufenacil-70-wg", "Saflufenacil", "70% WG", "herbicide", "weed", ["Kixor", "Sharpen"], "20–35 ग्राम प्रति एकड़", "HRAC 14", [...SOY, ...COTTON, ...WHEAT], ["चौड़ी पत्ती", "broadleaf", "burndown"], "चौड़ी पत्ती / बर्नडाउन", "चौड़ी पत्ती वाले खरपतवार", ["kixor", "sharpen"]),
  m("indaziflam-500-sc", "Indaziflam", "500 SC", "herbicide", "weed", ["Alion"], "50–80 मिलीलीटर प्रति एकड़", "Cellulose biosynthesis", [...SUGAR], ["बागवानी", "एकवर्षीय", "grass"], "बागवानी / गन्ना", "एकवर्षीय घास व खरपतवार", ["alion"]),
  m("cypyrafluone", "Cypyrafluone", "HPPD", "herbicide", "weed", ["KingAgroot Active"], "20–30 ग्राम प्रति एकड़", "HRAC 27", WHEAT, ["गेहूं", "चौड़ी पत्ती", "broadleaf", "प्रतिरोधी"], "गेहूं प्रतिरोधी चौड़ी पत्ती", "गेहूं में प्रतिरोधी चौड़ी पत्ती"),
  m("tripyrasulfone", "Tripyrasulfone", "HPPD", "herbicide", "weed", ["KingAgroot Rice"], "150–200 मिलीलीटर प्रति एकड़", "HRAC 27", PADDY, ["सावां", "barnyard", "सकरी", "धान"], "धान — सावां", "धान में सावां व सकरी पत्ती घास"),
  m("epyrifenacil", "Epyrifenacil", "PPO", "herbicide", "weed", ["Sumitomo Active"], "15–20 ग्राम प्रति एकड़", "HRAC 14", [...SOY, ...COTTON], ["चौड़ी पत्ती", "broadleaf", "pre-emergence", "प्री"], "प्री/पोस्ट चौड़ी पत्ती", "प्री/पोस्ट इमर्जेंस चौड़ी पत्ती"),
  m("fenquinotrione", "Fenquinotrione", "HPPD", "herbicide", "weed", ["Kumiai Active"], "100–150 मिलीलीटर प्रति एकड़", "HRAC 27", PADDY, ["धान", "प्रतिरोधी", "सावां"], "धान प्रतिरोधी खरपतवार", "धान के प्रतिरोधी खरपतवार"),
  m("ethalfluralin-35-ec", "Ethalfluralin", "35.4% EC", "herbicide", "weed", ["Sonalan"], "1–1.2 लीटर प्रति एकड़", "Microtubule inhibitor", [...SOY, ...GNUT, ...MOONG], ["दलहन", "तिलहन", "प्री", "pre-emergence"], "तिलहन/दलहन प्री-इमर्जेंस", "तिलहन व दलहन के खरपतवार", ["sonalan"]),

  m("prohexadione-calcium", "Prohexadione-calcium", "PGR", "pgr", "pgr", ["Medax", "Regalis"], "100–150 ग्राम प्रति एकड़", "GA biosynthesis inhibitor", [...PADDY, ...WHEAT, ...MAIZE], ["lodging", "गिरने", "लॉजिंग", "वानस्पतिक वृद्धि"], "अत्यधिक बढ़वार / गिरने का खतरा", "वानस्पतिक वृद्धि रोकना, फसल गिरने से बचाना", ["medax", "regalis"]),
  m("paclobutrazol-23-sc", "Paclobutrazol", "23% SC", "pgr", "pgr", ["Cultar", "Tarpan"], "फसल/उम्र अनुसार लेबल देखें", "Triazole PGR", [...CHILLI, ...TOMATO, ...ONION], ["पुष्पन", "flowering", "बढ़वार", "growth retard"], "अनियंत्रित बढ़वार", "अनियंत्रित बढ़वार रोकना, पुष्पन बढ़ाना", ["cultar", "tarpan"]),
  m("forchlorfenuron-01-l", "Forchlorfenuron", "CPPU 0.1% L", "pgr", "pgr", ["Cropmax", "CPPU"], "1 मिली / लीटर पानी", "Cytokinin PGR", [...CUCUMBER, ...TOMATO], ["फल आकार", "berry", "अंगूर", "खीरा"], "फल बढ़वार", "फल एवं बेरी का आकार/वजन", ["cropmax", "cppu"]),
  m("homobrassinolide-004", "Homobrassinolide", "0.04%", "pgr", "pgr", ["Godrej Double", "Speed"], "100–150 मिलीलीटर प्रति एकड़", "Brassinosteroid", [...COTTON, ...SOY, ...GNUT, ...PADDY, ...CHILLI], ["तनाव", "stress", "उपज", "कोशिका"], "तनाव / फूल", "कोशिका विभाजन, तनाव सहनशीलता, उपज", ["godrej double"]),
  m("seaweed-amino", "Seaweed + Amino Acids", "Biostimulant", "pgr", "pgr", ["Sagarika", "Biozyme", "Quantis"], "250–500 मिलीलीटर प्रति एकड़", "Biostimulant", [...PADDY, ...WHEAT, ...COTTON, ...SOY, ...GNUT, ...VEG, ...MOONG], ["जड़", "root", "stress", "तनाव", "biostimulant"], "जड़ विकास / तनाव", "जड़ों का विकास, तनाव से सुरक्षा", ["sagarika", "biozyme", "quantis"]),
  m("chlormequat-chloride-50-sl", "Chlormequat Chloride", "50% SL", "pgr", "pgr", ["Lihocin"], "150–250 मिलीलीटर प्रति एकड़", "Growth retardant", [...COTTON, ...WHEAT, ...PADDY], ["lodging", "गिरने", "वानस्पतिक", "फूल"], "अत्यधिक बढ़वार", "वानस्पतिक वृद्धि रोकना, फल/फूल बढ़ाना", ["lihocin"]),
  m("mepiquat-chloride-5-as", "Mepiquat Chloride", "5% AS", "pgr", "pgr", ["Chamatkar"], "200–250 मिलीलीटर प्रति एकड़", "Growth retardant", [...COTTON, ...ONION], ["कपास", "बढ़वार", "square", "लहसुन"], "कपास/प्याज अनियंत्रित वृद्धि", "कपास, प्याज, लहसुन में अनियंत्रित वृद्धि", ["chamatkar"]),
  m("prohydrojasmon", "Prohydrojasmon", "PDJ", "pgr", "pgr", ["Jasmonate Active"], "100 मिलीलीटर प्रति एकड़", "Jasmonate", [...TOMATO, ...CHILLI], ["रंग", "चमक", "मिठास", "fruit colour"], "तुड़ाई के पास", "फलों में रंग, चमक और मिठास"),
  m("1-mcp", "1-Methylcyclopropene", "1-MCP", "pgr", "pgr", ["SmartFresh"], "तुड़ाई के बाद — लेबल अनुसार", "Ethylene inhibitor", [...TOMATO, ...ONION, ...POTATO], ["shelf", "शेल्फ", "तुड़ाई के बाद", "storage"], "तुड़ाई के बाद", "फलों की शेल्फ लाइफ", ["smartfresh", "1-mcp"]),
  m("thidiazuron-50-wp", "Thidiazuron", "TDZ 50% WP", "pgr", "pgr", ["Dropp"], "80–100 ग्राम प्रति एकड़", "Cytokinin defoliant", COTTON, ["defoliation", "पत्ती गिराना", "कपास तुड़ाई"], "कपास तुड़ाई से पहले", "कपास की पत्तियों को गिराना", ["dropp", "tdz"]),
];
