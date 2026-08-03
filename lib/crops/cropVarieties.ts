import type { CropVariety } from "@/data/mock/crop-overview";

export interface MarketVarietyRec extends CropVariety {
  /** States where this variety sells / grows well */
  states: string[];
  marketNote: string;
  /** Public/govt breeding vs private hybrid seed */
  source: "govt" | "private";
}

const VARIETIES_BY_CROP: Record<string, MarketVarietyRec[]> = {
  paddy: [
    { name: "PB 1121", trait: "लंबा दाना basmati, प्रीमियम mandi भाव", season: "Kharif", states: ["Haryana", "Punjab", "Uttar Pradesh"], source: "govt", marketNote: "शीर्ष basmati निर्यात और Delhi NCR mandi की माँग" },
    { name: "MTU-1010", trait: "उच्च उपज, मध्यम पतला दाना", season: "Kharif", states: ["Andhra Pradesh", "Telangana", "Odisha"], source: "govt", marketNote: "तटीय AP में miller की मजबूत खरीद" },
    { name: "PR-126", trait: "नमक सहनशील, शीघ्र", season: "Kharif", states: ["Punjab", "Haryana"], source: "govt", marketNote: "पानी कम वाले क्षेत्रों के लिए अच्छी" },
    { name: "Swarna", trait: "लोकप्रिय coarse grain", season: "Kharif", states: ["West Bengal", "Bihar", "Odisha", "Jharkhand"], source: "govt", marketNote: "सरकारी खरीद में स्थिर माँग" },
  ],
  wheat: [
    { name: "HD 2967", trait: "उच्च उपज, lodging सहनशील", season: "Rabi", states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"], source: "govt", marketNote: "MSP पसंदीदा — सबसे अधिक आवक" },
    { name: "DBW 187", trait: "Yellow rust प्रतिरोधी", season: "Rabi", states: ["Punjab", "Haryana"], source: "govt", marketNote: "उत्तर-पश्चिम भारत के व्यापारियों की पसंद" },
    { name: "GW 322", trait: "अच्छी chapati गुणवत्ता", season: "Rabi", states: ["Madhya Pradesh", "Gujarat", "Rajasthan"], source: "govt", marketNote: "MP/RJ mandi में मजबूत खरीद" },
  ],
  maize: [
    { name: "HQPM-1", trait: "Quality protein maize", season: "Kharif / Rabi", states: ["Bihar", "Karnataka", "Madhya Pradesh", "Rajasthan"], source: "govt", marketNote: "Feed mill + poultry की माँग बढ़ रही" },
    { name: "Pusa HM-8", trait: "Hybrid उच्च उपज", season: "Kharif", states: ["Uttar Pradesh", "Bihar"], source: "private", marketNote: "Industrial starch खरीदारों के लिए अच्छी" },
    { name: "DHM 117", trait: "सूखा सहनशील hybrid", season: "Kharif", states: ["Telangana", "Andhra Pradesh", "Maharashtra"], source: "private", marketNote: "वर्षा आधारित क्षेत्रों में पसंद" },
  ],
  soybean: [
    { name: "JS 335", trait: "व्यापक अनुकूल, अच्छा oil%", season: "Kharif", states: ["Madhya Pradesh", "Maharashtra", "Rajasthan"], source: "govt", marketNote: "MP Indore mandi में #1 आवक" },
    { name: "JS 9305", trait: "शीघ्र परिपक्व", season: "Kharif", states: ["Madhya Pradesh", "Rajasthan"], source: "govt", marketNote: "Oil millers में लोकप्रिय" },
    { name: "NRC 37", trait: "सिंचाई में उच्च उपज", season: "Kharif", states: ["Maharashtra", "Gujarat"], source: "govt", marketNote: "Crush की माँग बढ़ रही" },
  ],
  tomato: [
    { name: "Pusa Ruby", trait: "Open pollinated, table use", season: "Rabi / Zaid", states: ["Maharashtra", "Karnataka", "Andhra Pradesh"], source: "govt", marketNote: "स्थिर wholesale सब्जी mandi" },
    { name: "Arka Vikas", trait: "मजबूत फल, ढुलाई सहनशील", season: "Year-round", states: ["Karnataka", "Tamil Nadu"], source: "govt", marketNote: "Bengaluru / Hoskote hub की पसंद" },
    { name: "Hybrid 71", trait: "उच्च उपज hybrid", season: "Kharif / Rabi", states: ["Maharashtra", "Gujarat", "Madhya Pradesh"], source: "private", marketNote: "Nashik/Indore व्यापारिक मात्रा" },
  ],
  potato: [
    { name: "Kufri Jyoti", trait: "Table variety, व्यापक अनुकूल", season: "Rabi", states: ["Uttar Pradesh", "Bihar", "West Bengal", "Punjab"], source: "govt", marketNote: "देश में सबसे अधिक mandi आवक" },
    { name: "Kufri Bahar", trait: "शीघ्र, अच्छी storability", season: "Rabi", states: ["Uttar Pradesh", "Haryana"], source: "govt", marketNote: "Agra / Farrukhabad cold store व्यापार" },
    { name: "Kufri Chipsona", trait: "Processing / chips", season: "Rabi", states: ["Gujarat", "Punjab", "Uttar Pradesh"], source: "govt", marketNote: "Industry contract premium" },
  ],
  chilli: [
    { name: "G-4 (LCA 334)", trait: "लाल सूखी mirch, तीखी", season: "Kharif / Rabi", states: ["Andhra Pradesh", "Telangana"], source: "govt", marketNote: "Guntur mandi — शीर्ष मसाला व्यापार" },
    { name: "Byadgi", trait: "गहरा लाल रंग, कम तीखापन", season: "Kharif", states: ["Karnataka"], source: "govt", marketNote: "Premium colour grade निर्यात" },
    { name: "Teja", trait: "उच्च pungency", season: "Kharif / Rabi", states: ["Andhra Pradesh", "Telangana", "Madhya Pradesh"], source: "govt", marketNote: "निर्यात + powder industry की माँग" },
  ],
  cotton: [
    { name: "Bt Hybrid (BG II)", trait: "Bollworm सुरक्षा, उच्च lint", season: "Kharif", states: ["Maharashtra", "Gujarat", "Madhya Pradesh", "Telangana"], source: "private", marketNote: "CCI / private ginners मुख्य खरीद" },
    { name: "RCH 659 BG II", trait: "लोकप्रिय private hybrid", season: "Kharif", states: ["Maharashtra", "Gujarat"], source: "private", marketNote: "NACOF/व्यापारियों की मजबूत पसंद" },
  ],
  onion: [
    { name: "Agrifound Dark Red", trait: "अच्छा भंडारण, गहरा लाल", season: "Rabi", states: ["Maharashtra", "Karnataka", "Madhya Pradesh"], source: "govt", marketNote: "Lasalgaon / Pimpalgaon की मात्रा" },
    { name: "N-53", trait: "शीघ्र kharif प्रकार", season: "Kharif", states: ["Maharashtra", "Gujarat"], source: "govt", marketNote: "Off-season premium भाव" },
  ],
  mustard: [
    { name: "Pusa Bold", trait: "उच्च तेल, bold बीज", season: "Rabi", states: ["Rajasthan", "Haryana", "Madhya Pradesh", "Uttar Pradesh"], source: "govt", marketNote: "Oil mill की मौसमी माँग चरम पर" },
    { name: "RH 749", trait: "उपज + तेल संतुलन", season: "Rabi", states: ["Haryana", "Rajasthan"], source: "govt", marketNote: "उत्तर-पश्चिम भारत की मजबूत mandi" },
  ],
  sugarcane: [
    { name: "Co 0238", trait: "उच्च sucrose, शीघ्र", season: "Year-round", states: ["Uttar Pradesh", "Haryana", "Bihar"], source: "govt", marketNote: "Sugar mill crushing की पसंद" },
    { name: "Co 86032", trait: "सूखा सहनशील", season: "Year-round", states: ["Maharashtra", "Karnataka", "Tamil Nadu"], source: "govt", marketNote: "Peninsular mill contracts" },
  ],
  bajra: [
    { name: "HHB 67 Improved", trait: "शीघ्र hybrid, सूखे से बचाव", season: "Kharif", states: ["Rajasthan", "Haryana", "Gujarat"], source: "private", marketNote: "Feed + pearl millet mandi खरीद" },
    { name: "ICTP 8203", trait: "Open pollinated, लाभदायक", season: "Kharif", states: ["Maharashtra", "Rajasthan"], source: "govt", marketNote: "स्थानीय व्यापारी + poultry feed" },
  ],
  cucumber: [
    { name: "Pusa Uday", trait: "Parthenocarpic, greenhouse ready", season: "Zaid / Protected", states: ["Haryana", "Maharashtra", "Karnataka"], source: "govt", marketNote: "शहरी wholesale premium" },
    { name: "Poinsettee", trait: "Open field slicer", season: "Summer", states: ["Uttar Pradesh", "Bihar", "West Bengal"], source: "govt", marketNote: "स्थानीय mandi की दैनिक माँग" },
  ],
  brinjal: [
    { name: "Pusa Purple Long", trait: "लंबा फल, सामान्य बाजार प्रकार", season: "Year-round", states: ["Uttar Pradesh", "Bihar", "West Bengal"], source: "govt", marketNote: "स्थिर सब्जी mandi" },
    { name: "Arka Anand", trait: "Hybrid, bacterial wilt सहनशील", season: "Kharif / Rabi", states: ["Karnataka", "Andhra Pradesh", "Tamil Nadu"], source: "private", marketNote: "दक्षिण भारत wholesale hubs" },
  ],
  moong: [
    { name: "SML 668", trait: "छोटी अवधि की गर्मी की moong", season: "Zaid", states: ["Punjab", "Haryana", "Rajasthan"], source: "govt", marketNote: "Pulse mill और MSP रुचि" },
    { name: "IPM 02-3", trait: "Yellow mosaic सहनशील", season: "Kharif", states: ["Uttar Pradesh", "Madhya Pradesh", "Rajasthan"], source: "govt", marketNote: "स्थानीय व्यापारी की अच्छी माँग" },
  ],
  moongfali: [
    { name: "GG 20", trait: "गुजरात का सबसे लोकप्रिय bunch type", season: "Kharif / Summer", states: ["Gujarat", "Rajasthan"], source: "govt", marketNote: "Saurashtra किसानों की शीर्ष पसंद" },
    { name: "TG 37A", trait: "Spanish bunch, शीघ्र, व्यापक", season: "Kharif / Rabi", states: ["Gujarat", "Rajasthan", "Andhra Pradesh"], source: "govt", marketNote: "Oil + confectionery crush की माँग" },
    { name: "TAG 24", trait: "Bunch type, देशभर में स्थिर उपज", season: "Kharif", states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Gujarat"], source: "govt", marketNote: "लोकप्रिय certified seed विकल्प" },
    { name: "GJG 9", trait: "गुजरात के लिए उच्च उपज", season: "Kharif", states: ["Gujarat"], source: "govt", marketNote: "Saurashtra mandi की मात्रा" },
  ],
  groundnut: [
    { name: "GG 20", trait: "गुजरात का सबसे लोकप्रिय bunch type", season: "Kharif / Summer", states: ["Gujarat", "Rajasthan"], source: "govt", marketNote: "Saurashtra किसानों की शीर्ष पसंद" },
    { name: "TG 37A", trait: "Spanish bunch, शीघ्र, व्यापक", season: "Kharif / Rabi", states: ["Gujarat", "Rajasthan", "Andhra Pradesh"], source: "govt", marketNote: "Oil + confectionery crush की माँग" },
    { name: "TAG 24", trait: "Bunch type, देशभर में स्थिर उपज", season: "Kharif", states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Gujarat"], source: "govt", marketNote: "लोकप्रिय certified seed विकल्प" },
    { name: "GJG 9", trait: "गुजरात के लिए उच्च उपज", season: "Kharif", states: ["Gujarat"], source: "govt", marketNote: "Saurashtra mandi की मात्रा" },
  ],
  cauliflower: [
    { name: "Pusa Snowball K-1", trait: "Snowball curd, सर्दी की फसल", season: "Rabi", states: ["Uttar Pradesh", "Haryana", "Punjab", "Bihar"], source: "govt", marketNote: "उत्तर भारत wholesale की पसंद" },
    { name: "Pusa Sharad", trait: "मध्यम अवधि, compact head", season: "Rabi", states: ["Uttar Pradesh", "Madhya Pradesh", "Rajasthan"], source: "govt", marketNote: "स्थिर mandi आवक" },
    { name: "Himani", trait: "शीघ्र hybrid प्रकार", season: "Rabi / Late kharif", states: ["Maharashtra", "Karnataka", "Gujarat"], source: "private", marketNote: "शहरी बाजार premium" },
  ],
  bhindi: [
    { name: "Arka Anamika", trait: "Yellow vein mosaic सहनशील", season: "Kharif / Summer", states: ["Karnataka", "Andhra Pradesh", "Tamil Nadu", "Maharashtra"], source: "govt", marketNote: "दक्षिण + पश्चिम सब्जी mandis" },
    { name: "Pusa Sawani", trait: "लंबी फली, बहुउपयोगी", season: "Kharif / Summer", states: ["Uttar Pradesh", "Bihar", "Delhi"], source: "govt", marketNote: "उत्तर भारत दैनिक बाजार की मुख्य फसल" },
    { name: "Varsha Uphar", trait: "Hybrid उच्च उपज", season: "Kharif", states: ["Gujarat", "Maharashtra", "Rajasthan"], source: "private", marketNote: "व्यापारियों की अच्छी खरीद" },
  ],
  pulses: [
    { name: "ICPL 87119 (Asha)", trait: "Wilt प्रतिरोधी arhar/tur", season: "Kharif", states: ["Maharashtra", "Madhya Pradesh", "Karnataka", "Gujarat"], source: "govt", marketNote: "Dal mill की पसंद — Tur" },
    { name: "Maruti (ICP 8863)", trait: "व्यापक अनुकूल pigeonpea", season: "Kharif", states: ["Karnataka", "Andhra Pradesh", "Telangana"], source: "govt", marketNote: "दक्षिण भारत में मजबूत dal व्यापार" },
    { name: "UPAS 120", trait: "UP belt के लिए शीघ्र arhar", season: "Kharif", states: ["Uttar Pradesh", "Bihar"], source: "govt", marketNote: "उत्तर dal mandi की माँग" },
  ],
  mango: [
    { name: "Alphonso (Hapus)", trait: "Premium निर्यात variety", season: "Summer harvest", states: ["Maharashtra", "Gujarat", "Karnataka"], source: "govt", marketNote: "सबसे अधिक premium भाव" },
    { name: "Dashehari", trait: "उत्तर भारत table mango", season: "Summer harvest", states: ["Uttar Pradesh", "Bihar", "Uttarakhand"], source: "govt", marketNote: "Lucknow / Malihabad व्यापार" },
    { name: "Kesar", trait: "मीठा, Saurashtra speciality", season: "Summer harvest", states: ["Gujarat"], source: "govt", marketNote: "Gujarat mandi + processing" },
  ],
  banana: [
    { name: "Grand Naine (G-9)", trait: "Tissue culture, निर्यात प्रकार", season: "Year-round", states: ["Maharashtra", "Gujarat", "Andhra Pradesh", "Tamil Nadu"], source: "private", marketNote: "मुख्य wholesale + ripener की माँग" },
    { name: "Robusta", trait: "भारी गुच्छा, स्थानीय बाजार", season: "Year-round", states: ["Karnataka", "Tamil Nadu", "Kerala"], source: "govt", marketNote: "दक्षिण भारत retail की मुख्य फसल" },
    { name: "Nendran", trait: "Cooking banana, Kerala प्रकार", season: "Year-round", states: ["Kerala", "Tamil Nadu"], source: "govt", marketNote: "Chip / स्थानीय व्यंजन premium" },
  ],
  grapes: [
    { name: "Thompson Seedless", trait: "निर्यात table grape", season: "Winter / Spring", states: ["Maharashtra", "Karnataka"], source: "govt", marketNote: "Nashik export clusters" },
    { name: "Sharad Seedless", trait: "Black seedless, अच्छी shelf life", season: "Winter", states: ["Maharashtra"], source: "govt", marketNote: "घरेलू + निर्यात दोहरा बाजार" },
    { name: "Bangalore Blue", trait: "Juice / wine स्थानीय प्रकार", season: "Year-round flushes", states: ["Karnataka"], source: "govt", marketNote: "Bengaluru processing की माँग" },
  ],
  capsicum: [
    { name: "Indira", trait: "Blocky green hybrid", season: "Protected / Rabi", states: ["Maharashtra", "Karnataka", "Haryana"], source: "private", marketNote: "शहरी wholesale premium" },
    { name: "Bombay", trait: "Open field green bell", season: "Rabi", states: ["Maharashtra", "Madhya Pradesh"], source: "private", marketNote: "स्थिर सब्जी mandi" },
  ],
};

const FALLBACK: MarketVarietyRec[] = [
  { name: "Certified local HYV", trait: "राज्य seed corporation का stock उपयोग करें", season: "Main season", states: [], source: "govt", marketNote: "नजदीकी mandi में पूछें कि कौन-सी variety का भाव सबसे अच्छा मिलता है" },
];

function normalizeState(state?: string): string {
  return (state ?? "").trim().toLowerCase();
}

/** Per-crop varieties; prefer those matching farmer state for market tip ordering */
export function getVarietiesForCrop(cropSlug: string, state?: string): MarketVarietyRec[] {
  const slug = cropSlug.trim().toLowerCase();
  const aliased =
    slug === "groundnut" || slug === "mungfali"
      ? "moongfali"
      : slug === "arhar" || slug === "tur" || slug === "pigeonpea"
        ? "pulses"
        : slug === "rice" || slug === "dhaan"
          ? "paddy"
          : slug;

  const list = VARIETIES_BY_CROP[aliased] ?? FALLBACK;
  const s = normalizeState(state);
  if (!s) return list;
  const matched = list.filter((v) => v.states.some((st) => st.toLowerCase() === s));
  const rest = list.filter((v) => !v.states.some((st) => st.toLowerCase() === s));
  return matched.length ? [...matched, ...rest] : list;
}
