/**
 * Display titles = field / market famous names (India).
 * Often English for diseases (Sheath Blight, Blast); Hindi when that is what farmers say.
 * Used on pest + disease + weed list/detail across all crops.
 */

type TitleMap = { match: RegExp; primary: string; secondary?: string };

/** More-specific first. primary = famous name shown big. */
const TITLE_MAP: TitleMap[] = [
  // ─── Paddy pests ───
  {
    match: /yellow\s*stem\s*borer|पीला\s*तना|incertulas/i,
    primary: "Yellow Stem Borer",
    secondary: "तना छेदक",
  },
  {
    match: /leaf\s*folder|पत्ती\s*मोड़क|cnaphalocrocis/i,
    primary: "Leaf Folder",
    secondary: "पत्ती मोड़क",
  },
  {
    match: /brown\s*plant\s*hopper|\bBPH\b|भूरा\s*फुदका|nilaparvata/i,
    primary: "BPH",
    secondary: "भूरा फुदका",
  },
  {
    match: /white\s*backed|\bWBPH\b|सफेद\s*पीठ|sogatella/i,
    primary: "WBPH",
    secondary: "सफेद पीठ फुदका",
  },
  {
    match: /green\s*leaf\s*hopper|\bGLH\b|हरा\s*(पत्ती\s*)?फुदका|nephotettix/i,
    primary: "GLH",
    secondary: "हरा फुदका",
  },
  {
    match: /gall\s*midge|गॉल\s*मिज|orseolia/i,
    primary: "Gall Midge",
    secondary: "गॉल मिज",
  },
  {
    match: /rice\s*hispa|हिस्पा|dicladispa/i,
    primary: "Rice Hispa",
    secondary: "धान हिस्पा",
  },
  {
    match: /gundhi|गंधी|leptocorisa/i,
    primary: "Gundhi Bug",
    secondary: "गंधी बग",
  },
  {
    match: /rice\s*armyworm|धान\s*सेना|spodoptera\s*mauritia/i,
    primary: "Rice Armyworm",
    secondary: "सेना इल्ली",
  },

  // ─── Paddy diseases ───
  {
    match: /sheath\s*rot|शीथ\s*रॉट|sarocladium/i,
    primary: "Sheath Rot",
    secondary: "म्यान सड़न",
  },
  {
    match: /sheath\s*blight|शीथ\s*ब्लाइट|पर्ण\s*आवरण|म्यान\s*झुलसा|rhizoctonia\s*solani/i,
    primary: "Sheath Blight",
    secondary: "म्यान झुलसा",
  },
  {
    match: /bacterial\s*leaf\s*blight|\bBLB\b|जीवाणु\s*पत्ती|xanthomonas\s*oryzae/i,
    primary: "BLB",
    secondary: "पत्ती झुलसा",
  },
  {
    match: /false\s*smut|फॉल्स\s*स्मट|झूठा\s*कंड|ustilaginoidea/i,
    primary: "False Smut",
    secondary: "झूठा कंड",
  },
  {
    match: /brown\s*spot|ब्राउन\s*स्पॉट|भूरा\s*धब्बा|bipolaris\s*oryzae/i,
    primary: "Brown Spot",
    secondary: "भूरा धब्बा",
  },
  {
    match: /\bblast\b|ब्लास्ट|धान\s*झुलसा|magnaporthe/i,
    primary: "Blast",
    secondary: "ब्लास्ट",
  },
  {
    match: /tungro|टंग्रो/i,
    primary: "Tungro",
    secondary: "टंग्रो",
  },
  {
    match: /bakanae|बकाने|फुट\s*रॉट|fujikuroi/i,
    primary: "Bakanae",
    secondary: "बकाने",
  },

  // ─── Wheat ───
  {
    match: /yellow\s*rust|stripe\s*rust|पीला\s*रतुआ|striiformis/i,
    primary: "Yellow Rust",
    secondary: "पीला रतुआ",
  },
  {
    match: /brown\s*rust|leaf\s*rust|भूरा\s*रतुआ|triticina/i,
    primary: "Brown Rust",
    secondary: "भूरा रतुआ",
  },
  {
    match: /karnal\s*bunt|करनाल\s*कंड|tilletia\s*indica/i,
    primary: "Karnal Bunt",
    secondary: "करनाल कंड",
  },
  {
    match: /loose\s*smut|ढीला\s*कंड|ustilago\s*tritici/i,
    primary: "Loose Smut",
    secondary: "ढीला कंड",
  },
  {
    match: /spot\s*blotch|स्पॉट\s*ब्लॉच|sorokiniana/i,
    primary: "Spot Blotch",
    secondary: "पत्ती धब्बा",
  },
  {
    match: /powdery\s*mildew|चूर्णिल|blumeria/i,
    primary: "Powdery Mildew",
    secondary: "चूर्णिल फफूंद",
  },
  {
    match: /head\s*blight|स्कैब|सिर\s*झुलसा|graminearum/i,
    primary: "Head Blight",
    secondary: "बाली झुलसा",
  },
  {
    match: /pink\s*stem\s*borer|गुलाबी\s*तना|sesamia/i,
    primary: "Pink Stem Borer",
    secondary: "गुलाबी तना छेदक",
  },

  // ─── Maize / Bajra ───
  {
    match: /fall\s*army|फॉल\s*आर्मी|फौजी|frugiperda/i,
    primary: "Fall Armyworm",
    secondary: "फौजी कीड़ा",
  },
  {
    match: /shoot\s*fly|अंकुर\s*मक्खी|atherigona/i,
    primary: "Shoot Fly",
    secondary: "अंकुर मक्खी",
  },
  {
    match: /turcicum|टर्सिकम|exserohilum/i,
    primary: "Turcicum Leaf Blight",
    secondary: "पत्ती झुलसा",
  },
  {
    match: /maydis|मेडिस|bipolaris\s*maydis/i,
    primary: "Maydis Leaf Blight",
    secondary: "पत्ती धब्बा",
  },
  {
    match: /banded\s*leaf|पट्टेदार/i,
    primary: "Banded Leaf Blight",
    secondary: "म्यान झुलसा",
  },
  {
    match: /common\s*rust|सामान्य\s*रतुआ|puccinia\s*sorghi/i,
    primary: "Common Rust",
    secondary: "रतुआ",
  },
  {
    match: /charcoal\s*rot|चारकोल|macrophomina/i,
    primary: "Charcoal Rot",
    secondary: "तना सड़न",
  },
  {
    match: /downy\s*mildew|बलूत|रोमिल|sclerospora|peronospora/i,
    primary: "Downy Mildew",
    secondary: "झुलसा फफूंद",
  },
  {
    match: /\bergot\b|अर्गोट|claviceps/i,
    primary: "Ergot",
    secondary: "अर्गोट",
  },
  {
    match: /grain\s*smut|tolyposporium/i,
    primary: "Grain Smut",
    secondary: "दंड कंड",
  },
  {
    match: /earhead\s*caterpillar|बाली\s*इल्ली/i,
    primary: "Earhead Caterpillar",
    secondary: "बाली इल्ली",
  },
  {
    match: /stem\s*borer|तना\s*छेदक|chilo\s*partellus|coniesta/i,
    primary: "Stem Borer",
    secondary: "तना छेदक",
  },

  // ─── Potato / Tomato ───
  {
    match: /late\s*blight|देर\s*से\s*झुलसा|पछेती|phytophthora\s*infestans/i,
    primary: "Late Blight",
    secondary: "पछेती झुलसा",
  },
  {
    match: /early\s*blight|शुरुआती\s*झुलसा|अगेती|alternaria\s*solani/i,
    primary: "Early Blight",
    secondary: "अगेती झुलसा",
  },
  {
    match: /black\s*scurf|काला\s*कवच|काली\s*पपड़ी/i,
    primary: "Black Scurf",
    secondary: "काली पपड़ी",
  },
  {
    match: /common\s*scab|आम\s*स्कैब|कंद\s*खुजली|streptomyces\s*scabies/i,
    primary: "Common Scab",
    secondary: "कंद खुजली",
  },
  {
    match: /potato\s*tuber\s*moth|आलू\s*कंद|phthorimaea/i,
    primary: "Potato Tuber Moth",
    secondary: "कंद कीड़ा",
  },
  {
    match: /potato\s*mosaic|पत्ती\s*मोज़ेक|पच्चीकारी|potato\s*virus/i,
    primary: "Potato Mosaic",
    secondary: "पच्चीकारी",
  },
  {
    match: /cut\s*worms?|कटवर्म|तना\s*काट|agrotis/i,
    primary: "Cutworm",
    secondary: "कटवर्म",
  },
  {
    match: /fruit\s*borer|फल\s*छेदक|helicoverpa/i,
    primary: "Fruit Borer",
    secondary: "फल छेदक",
  },
  {
    match: /leaf\s*curl|पत्ती\s*मुड़|begomovirus/i,
    primary: "Leaf Curl",
    secondary: "पत्ती मोड़ रोग",
  },
  {
    match: /leaf\s*miner|पत्ती\s*खनक|liriomyza/i,
    primary: "Leaf Miner",
    secondary: "पत्ती सुरंग कीड़ा",
  },
  {
    match: /fusarium\s*wilt|जड़\s*मुरझान|fusarium\s*lycopersici/i,
    primary: "Fusarium Wilt",
    secondary: "जड़ मुरझान",
  },
  {
    match: /bacterial\s*wilt|जीवाणु\s*मुरझान|ralstonia/i,
    primary: "Bacterial Wilt",
    secondary: "जीवाणु मुरझान",
  },

  // ─── Onion ───
  {
    match: /purple\s*blotch|बैंगनी\s*धब्बा|alternaria\s*porri/i,
    primary: "Purple Blotch",
    secondary: "बैंगनी धब्बा",
  },
  {
    match: /stemphylium/i,
    primary: "Stemphylium Blight",
    secondary: "पत्ती झुलसा",
  },
  {
    match: /basal\s*rot|आधार\s*सड़न/i,
    primary: "Basal Rot",
    secondary: "जड़ सड़न",
  },
  {
    match: /\bthrips\b|थ्रिप्स|thrips\s*tabaci/i,
    primary: "Thrips",
    secondary: "थ्रिप्स",
  },

  // ─── Cotton ───
  {
    match: /pink\s*bollworm|गुलाबी\s*सुंडी|pectinophora/i,
    primary: "Pink Bollworm",
    secondary: "गुलाबी सुंडी",
  },
  {
    match: /american\s*bollworm|अमेरिकी\s*सुंडी/i,
    primary: "American Bollworm",
    secondary: "अमेरिकी सुंडी",
  },
  {
    match: /spotted\s*bollworm|चित्तीदार\s*सुंडी/i,
    primary: "Spotted Bollworm",
    secondary: "चित्तीदार सुंडी",
  },
  {
    match: /cotton\s*jassid|जैसिड|amrasca|\bjassid\b/i,
    primary: "Jassid",
    secondary: "तेला",
  },

  // ─── General pests / diseases ───
  {
    match: /pod\s*borer|फली\s*छेदक/i,
    primary: "Pod Borer",
    secondary: "फली छेदक",
  },
  {
    match: /whitefly|सफेद\s*मक्खी|सफ़ेद\s*मक्खी|bemisia/i,
    primary: "Whitefly",
    secondary: "सफेद मक्खी",
  },
  {
    match: /\baphids?\b|एफिड|माहू|sitobion|myzus|lipaphis|aphis/i,
    primary: "Aphid",
    secondary: "माहू",
  },
  {
    match: /termites?|दीमक|odontotermes/i,
    primary: "Termite",
    secondary: "दीमक",
  },
  {
    match: /mealy\s*bug|मिलीबग/i,
    primary: "Mealybug",
    secondary: "मिलीबग",
  },
  {
    match: /red\s*spider|लाल\s*मकड़ी|spider\s*mite|tetranychus/i,
    primary: "Red Spider Mite",
    secondary: "लाल मकड़ी",
  },
  {
    match: /diamond\s*back|डायमंड|plutella/i,
    primary: "Diamondback Moth",
    secondary: "हीरा पीठ इल्ली",
  },
  {
    match: /sawfly|athalia/i,
    primary: "Sawfly",
    secondary: "पत्ती कुतरने वाली मक्खी",
  },
  {
    match: /tobacco\s*caterpillar|तंबाकू|spodoptera\s*litura/i,
    primary: "Tobacco Caterpillar",
    secondary: "तंबाकू इल्ली",
  },
  {
    match: /anthracnose|एंथ्रेक्नोज|colletotrichum/i,
    primary: "Anthracnose",
    secondary: "एंथ्रेक्नोज",
  },
  {
    match: /alternaria\s*leaf|अल्टरनेरिया/i,
    primary: "Alternaria Leaf Spot",
    secondary: "पत्ती धब्बा",
  },
  {
    match: /cercospora|सरकोस्पोरा/i,
    primary: "Cercospora Leaf Spot",
    secondary: "पत्ती धब्बा",
  },
  {
    match: /damping\s*off/i,
    primary: "Damping Off",
    secondary: "पौध गलन",
  },
  {
    match: /root\s*rot|जड़\s*सड़न/i,
    primary: "Root Rot",
    secondary: "जड़ सड़न",
  },
  {
    match: /fusarium\s*wilt|मुरझान/i,
    primary: "Wilt",
    secondary: "मुरझान",
  },
  {
    match: /\brust\b|रतुआ|puccinia/i,
    primary: "Rust",
    secondary: "रतुआ",
  },
  {
    match: /mosaic|मोज़ेक/i,
    primary: "Mosaic",
    secondary: "मोज़ेक",
  },

  // ─── Weeds (field famous) ───
  {
    match: /barnyard|सांवा|echinochloa/i,
    primary: "Barnyard Grass",
    secondary: "सांवा",
  },
  {
    match: /flat\s*sedge|चपटा\s*नागरमोथा|cyperus\s*iria/i,
    primary: "Flat Sedge",
    secondary: "नागरमोथा",
  },
  {
    match: /monochoria|मोनोकोरिया/i,
    primary: "Monochoria",
    secondary: "चौड़ी पत्ती खरपतवार",
  },
  {
    match: /phalaris|गुल्ली|गुल्ली-डंडा/i,
    primary: "Phalaris minor",
    secondary: "गुल्ली डंडा",
  },
  {
    match: /wild\s*oat|जंगली\s*जई|avena\s*fatua/i,
    primary: "Wild Oat",
    secondary: "जंगली जई",
  },
  {
    match: /chenopodium|बथुआ|bathua/i,
    primary: "Bathua",
    secondary: "बथुआ",
  },
  {
    match: /parthenium|गाजर\s*घास/i,
    primary: "Parthenium",
    secondary: "गाजर घास",
  },
  {
    match: /cyperus\s*rotundus|मोठा|nutsedge/i,
    primary: "Nutsedge",
    secondary: "मोठा",
  },
  {
    match: /trianthema|इटसा/i,
    primary: "Trianthema",
    secondary: "इटसा घास",
  },
  {
    match: /sorghum\s*halepense|जंगली\s*ज्वार/i,
    primary: "Wild Sorghum",
    secondary: "जंगली ज्वार",
  },
  {
    match: /digitaria|काकरा/i,
    primary: "Digitaria",
    secondary: "काकरा घास",
  },
  {
    match: /wild\s*mustard|जंगली\s*सरसों/i,
    primary: "Wild Mustard",
    secondary: "जंगली सरसों",
  },
];

/**
 * Prefer field/market famous name as primary (often English for diseases).
 */
export function farmerThreatDisplayName(
  name: string,
  scientific?: string
): { primary: string; english?: string } {
  const blob = `${name} ${scientific ?? ""}`;
  for (const row of TITLE_MAP) {
    if (row.match.test(blob)) {
      return {
        primary: row.primary,
        english: row.secondary,
      };
    }
  }

  // "हिंदी (English Famous)" → famous English on top when present
  const m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m?.[1] && m[2]) {
    const hi = m[1].trim();
    const en = m[2].trim();
    // If English half looks like a real field name, put it on top
    if (/^[A-Za-z]/.test(en) && en.length >= 3) {
      return { primary: en, english: hi };
    }
    return { primary: hi, english: en };
  }

  return { primary: name.trim() };
}
