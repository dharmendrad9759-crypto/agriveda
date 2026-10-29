import { CHEM_BOTTLE_CATALOG, type ChemBottleCategory, type ChemBottleEntry } from "@/data/chem-bottle-catalog";

const FORM_RE =
  /(\d+(?:\.\d+)?\s*(?:%|g\/L|g\/l)\s*[A-Za-z]{1,4}(?:\s*\+\s*\d+(?:\.\d+)?\s*(?:%|g\/L|g\/l)\s*[A-Za-z]{1,4})*)/i;

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\+/g, " + ")
    .replace(/[^\p{L}\p{M}\p{N}+]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const FORM_ONLY_RE = /^\d+(?:\s*\.\s*\d+)?\s*(?:ec|sc|wp|wg|gr|sl|sp|fs|sg|zc|df|wdg|ws|od|sl|sl)$/i;

const byAlias = new Map<string, ChemBottleEntry>();
for (const entry of CHEM_BOTTLE_CATALOG) {
  const keys = [
    entry.slug.replace(/-/g, " "),
    `${entry.name} ${entry.formulation}`,
    entry.name,
    ...(entry.aliases ?? []),
  ];
  for (const key of keys) {
    const n = normalizeKey(key);
    if (!n || FORM_ONLY_RE.test(n)) continue;
    if (!byAlias.has(n)) byAlias.set(n, entry);
  }
}

const HINDI_AGRI_CHEM_MAP: Record<string, string> = {
  "00:60:20": "potassium-phosphite",
  "२,४-डी": "2-4-d-amine-58-sl",
  "2,4-डी": "2-4-d-amine-58-sl",
  "200 ppm naa": "naa-4-5-sl",
  "505": "chlorpyrifos-50-cypermethrin-5-ec",
  "benevia": "cyantraniliprole-10-od",
  "naa": "naa-4-5-sl",
  "अज़ाडिराक्टिन": "neem-oil",
  "अनिलोफॉस": "anilofos-30-ec",
  "अप्पलाउड": "buprofezin-25-sc",
  "अलिका": "thiamethoxam-lambda-zc",
  "अल्फा नेफ्थाइल": "naa-4-5-sl",
  "अवांट": "indoxacarb-14-5-sc",
  "असताफ": "acephate-75-sp",
  "आइसोप्रोथिओलेन": "isoprothiolane-40-ec",
  "आइसोप्रोथिओलेन 40%": "isoprothiolane-40-ec",
  "आइसोप्रोथियोलेन": "isoprothiolane-40-ec",
  "आइसोप्रोथियोलेन 40%": "isoprothiolane-40-ec",
  "आइसोसाइक्लोसेरम": "isocycloseram-10-dc",
  "इटोक्साज़ोल": "etoxazole-10-sc",
  "इंट्रेपिड": "chlorfenapyr-10-sc",
  "इंडीफ्लिन": "inpyrfluxam-30-sc",
  "इंडोक्साकार्ब": "indoxacarb-14-5-sc",
  "इंडोक्साकार्ब 14.5%": "indoxacarb-14-5-sc",
  "इंडोफिल": "mancozeb-75-wp",
  "इनपायर्फ्लक्सम": "inpyrfluxam-30-sc",
  "इनफिनिटो": "fluopicolide-propamocarb-sc",
  "इनसिपियो": "isocycloseram-10-dc",
  "इन्ट्रेपिड": "chlorfenapyr-10-sc",
  "इन्डाज़ीफ्लेम": "indaziflam-500-sc",
  "इन्फिनिटो": "fluopicolide-propamocarb-sc",
  "इपफ्लूफेनोक्विन": "ipflufenoquin-20-sc",
  "इपायरीफेनासिल": "epyrifenacil-ec",
  "इमाजेथापायर": "imazethapyr-10-sl",
  "इमामेक्टिन": "emamectin-benzoate-5-sg",
  "इमिडाक्लोप्रिड": "imidacloprid-17-8-sl",
  "इमिडाक्लोप्रिड 48%": "imidacloprid-48-fs",
  "इमिडाक्लोप्रिड 70%": "imidacloprid-70-ws",
  "इलाटस प्लस": "benzovindiflupyr-100-ec",
  "ईटोफेनप्रॉक्स": "etofenprox-10-ew",
  "ईथालफ्लूरालिन": "ethalfluralin-35-4-ec",
  "उलाला": "flonicamid-50-wg",
  "उस्ताद": "cypermethrin-25-ec",
  "एकतारा": "thiamethoxam-25-wg",
  "एकलक्स": "quinalphos-25-ec",
  "एक्यूरॉन": "bicyclopyrone-ec",
  "एक्रोबैट": "dimethomorph-50-wp",
  "एज़ाडिराक्टिन": "neem-oil",
  "एजोक्सीस्ट्रोबिन": "azoxystrobin-250-sc",
  "एज़ोक्सीस्ट्रोबिन": "azoxystrobin-250-sc",
  "एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल": "azoxystrobin-difenoconazole-sc",
  "एज़ोक्सीस्ट्रोबिन 18.2%": "azoxystrobin-difenoconazole-sc",
  "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4%": "azoxystrobin-difenoconazole-sc",
  "एंट्राकोल": "propineb-70-wp",
  "एट्राजिन": "atrazine-50-wp",
  "एट्राज़ीन": "atrazine-50-wp",
  "एफिडोपायरोपैन": "afidopyropen-50-dc",
  "एबाजेक्टिन": "abamectin-1-9-ec",
  "एबामेक्टिन": "abamectin-1-9-ec",
  "एमामेक्टिन": "emamectin-benzoate-5-sg",
  "एमिसुलब्रोम": "amisulbrom-17-7-sc",
  "एमिस्टार": "azoxystrobin-250-sc",
  "एमिस्टार टॉप": "azoxystrobin-difenoconazole-sc",
  "एमेटोक्ट्राडिन": "ametoctradin-dimethomorph-sc",
  "एलाक्लोर": "alachlor-50-ec",
  "एलाटस प्लस": "benzovindiflupyr-100-ec",
  "एलियट": "fosetyl-al-80-wp",
  "एलियन": "indaziflam-500-sc",
  "एलिवोर": "halauxifen-methyl-ec",
  "एवरगोल": "penflufen-240-fs",
  "एविटो": "fluoxastrobin-480-sc",
  "एसिटामिप्रिड": "acetamiprid-20-sp",
  "एसिनोनापायर": "acynonapyr-20-sc",
  "एसीफेट": "acephate-75-sp",
  "एसेफेट": "acephate-75-sp",
  "ऐसीफेट": "acephate-75-sp",
  "ऑक्सीडेमेटॉन मिथाइल": "oxydemeton-methyl-25-ec",
  "ऑक्सैथियापाइप्रोलिन": "oxathiapiprolin-10-1-od",
  "ऑर्केस्ट्रा": "benzpyrimoxan-10-sc",
  "ओबेरॉन": "spiromesifen-22-9-sc",
  "ओबेरोन": "spiromesifen-22-9-sc",
  "कन्फिडोर": "imidacloprid-17-8-sl",
  "कराटे": "lambda-cyhalothrin-5-ec",
  "कर्जेट": "cymoxanil-mancozeb-wp",
  "कल्टर": "paclobutrazol-23-sc",
  "कवच": "chlorothalonil-75-wp",
  "काउंसिल एक्टिव": "triafamone-ethoxysulfuron-wg",
  "कान्फिडोर": "imidacloprid-17-8-sl",
  "कार्टप": "cartap-4-gr",
  "कार्टप 50%": "cartap-50-sp",
  "कार्टप हाइड्रोक्लोराइड": "cartap-50-sp",
  "कार्टप हाइड्रोक्लोराइड 50%": "cartap-50-sp",
  "कार्टाप": "cartap-4-gr",
  "कार्टाप 4%": "cartap-4-gr",
  "कार्टाप 50%": "cartap-50-sp",
  "कार्टाप हाइड्रोक्लोराइड": "cartap-50-sp",
  "कार्टाप हाइड्रोक्लोराइड 4%": "cartap-4-gr",
  "कार्टाप हाइड्रोक्लोराइड 50%": "cartap-50-sp",
  "कार्टैप": "cartap-4-gr",
  "कार्टैप 4%": "cartap-4-gr",
  "कार्टैप 50%": "cartap-50-sp",
  "कार्टैप हाइड्रोक्लोराइड": "cartap-50-sp",
  "कार्टैप हाइड्रोक्लोराइड 4%": "cartap-4-gr",
  "कार्टैप हाइड्रोक्लोराइड 50%": "cartap-50-sp",
  "कार्बेंडाजिम": "carbendazim-50-wp",
  "कार्बेंडाजिम + मैनकोजेब": "carbendazim-mancozeb-wp",
  "कार्बेंडाजिम 12%": "carbendazim-mancozeb-wp",
  "कार्बेंडाजिम 12% + मैनकोजेब 63%": "carbendazim-mancozeb-wp",
  "कार्बेन्डाजिम": "carbendazim-50-wp",
  "कार्बेन्डाजिम + मैंकोजेब": "carbendazim-mancozeb-wp",
  "कार्बेन्डाजिम 12%": "carbendazim-mancozeb-wp",
  "कार्बेन्डाजिम 12% + मैंकोजेब 63%": "carbendazim-mancozeb-wp",
  "कार्बोफ्यूरान": "carbofuran-3-cg",
  "कासु-बी": "kasugamycin-3-sl",
  "कासुगामाइसिन": "kasugamycin-3-sl",
  "किक्सोर": "saflufenacil-70-wg",
  "किटाजिन": "kitazin-48-ec",
  "किटाज़िन": "kitazin-48-ec",
  "किटाजिन 48%": "kitazin-48-ec",
  "किटाज़िन 48%": "kitazin-48-ec",
  "कीफन": "tolfenpyrad-15-ec",
  "कैप्टन": "captan-50-wp",
  "कैप्टन 50%": "captan-50-wp",
  "कैप्टन 70% + हेक्साकोनाज़ोल 5%": "captan-hexaconazole-wp",
  "कैब्रियो टॉप": "metiram-55",
  "कैब्रियोटॉप": "metiram-55",
  "कैल्शियम क्लोराइड": "calcium-boron",
  "कॉन्टैफ़": "hexaconazole-5-ec",
  "कॉपर ऑक्सीक्लोराइड": "copper-oxychloride-50-wp",
  "कॉपर सल्फेट": "bordeaux-mixture",
  "कॉपर हाइड्रोक्साइड": "copper-hydroxide-53-8-df",
  "कोराजन": "chlorantraniliprole-18-5-sc",
  "कोल्ट": "pyrifluquinazon-20-sc",
  "कोसाइड": "copper-hydroxide-53-8-df",
  "क्यूराक्रॉन": "profenofos-50-ec",
  "क्रेजोक्सिम-मिथाइल": "kresoxim-methyl-44-sc",
  "क्रेज़ोक्सिम-मिथाइल": "kresoxim-methyl-44-sc",
  "क्लोडिनाफॉप": "clodinafop-15-wp",
  "क्लोथियानिडिन": "clothianidin-50-wdg",
  "क्लोथियानिडिन 50%": "clothianidin-50-wdg",
  "क्लोथियानिडिन 50% wdg": "clothianidin-50-wdg",
  "क्लोरएंट्रानिलिप्रोल": "chlorantraniliprole-18-5-sc",
  "क्लोरपायरीफॉस": "chlorpyrifos-50-cypermethrin-5-ec",
  "क्लोरपायरीफॉस + साइपरमेथ्रिन": "chlorpyrifos-50-cypermethrin-5-ec",
  "क्लोरपायरीफॉस 1.5": "chlorpyrifos-1-5-dp",
  "क्लोरपायरीफॉस 1.5%": "chlorpyrifos-1-5-dp",
  "क्लोरपायरीफॉस 1.5% dp": "chlorpyrifos-1-5-dp",
  "क्लोरपायरीफॉस 50% + साइपरमेथ्रिन 5%": "chlorpyrifos-50-cypermethrin-5-ec",
  "क्लोरपायरीफॉस 50% + साइपरमेथ्रिन 5% ec": "chlorpyrifos-50-cypermethrin-5-ec",
  "क्लोरपायरीफॉस डस्ट": "chlorpyrifos-1-5-dp",
  "क्लोरफेनापायर": "chlorfenapyr-10-sc",
  "क्लोरांट्रानिलिप्रोल": "chlorantraniliprole-18-5-sc",
  "क्लोरांट्रानिलिप्रोल 0.4%": "chlorantraniliprole-0-4-gr",
  "क्लोरांट्रानिलीप्रोल": "chlorantraniliprole-18-5-sc",
  "क्लोरांट्रानिलीप्रोल 0.4%": "chlorantraniliprole-0-4-gr",
  "क्लोरेंट्रानिलिप्रोल": "chlorantraniliprole-18-5-sc",
  "क्लोरेंट्रानिलिप्रोल 0.4%": "chlorantraniliprole-0-4-gr",
  "क्लोरोथैलोनिल": "chlorothalonil-75-wp",
  "क्लोरोपायरीफॉस": "chlorpyrifos-50-cypermethrin-5-ec",
  "क्लोरोपायरीफॉस + साइपरमेथ्रिन": "chlorpyrifos-50-cypermethrin-5-ec",
  "क्लोरोपायरीफॉस 1.5": "chlorpyrifos-1-5-dp",
  "क्लोरोपायरीफॉस 1.5%": "chlorpyrifos-1-5-dp",
  "क्लोरोपायरीफॉस 1.5% dp": "chlorpyrifos-1-5-dp",
  "क्लोरोपायरीफॉस 50% + साइपरमेथ्रिन 5%": "chlorpyrifos-50-cypermethrin-5-ec",
  "क्लोरोपायरीफॉस 50% + साइपरमेथ्रिन 5% ec": "chlorpyrifos-50-cypermethrin-5-ec",
  "क्लोरोपायरीफॉस डस्ट": "chlorpyrifos-1-5-dp",
  "क्लोर्मेक्वाट": "chlormequat-chloride-50-sl",
  "क्विजालोफॉप": "quizalofop-5-ec",
  "क्विनालफास": "quinalphos-25-ec",
  "क्विनालफास 25%": "quinalphos-25-ec",
  "क्विनालफॉस": "quinalphos-25-ec",
  "क्विनालफॉस 25%": "quinalphos-25-ec",
  "क्विनोफ्यूमेलिन": "quinofumelin-25-sc",
  "गुड़ या गन्ने का शीरा": "jaggery-molasses-bait",
  "गुड़ शीरा": "jaggery-molasses-bait",
  "गुड़/शीरा": "jaggery-molasses-bait",
  "गैलेंट": "haloxyfop-r-methyl-10-5-ec",
  "ग्रेशिया": "fluxametamide-10-ec",
  "ग्रेसिया": "fluxametamide-10-ec",
  "ग्लाइफोसेट": "glyphosate-41-sl",
  "घुलनशील गंधक": "wettable-sulphur-80-wdg",
  "घुलनशील सल्फर": "wettable-sulphur-80-wdg",
  "चिपको": "silicon-spreader",
  "चिलेटेड कैल्शियम": "calcium-boron",
  "चिलेटेड जिंक": "chelated-zinc-12",
  "चिलेटेड जिंक व बोरॉन": "micronutrient-mixture",
  "चिलेटेड बोरॉन": "boron-20",
  "चिलेटेड बोरॉन 20%": "boron-20",
  "चिलेटेड माइक्रोन्यूट्रिएंट्स": "micronutrient-mixture",
  "चेस": "pymetrozine-50-wg",
  "चोकर": "bran-cutworm-bait",
  "जिंक सल्फेट": "chelated-zinc-12",
  "जिनेब": "zineb-75-wp",
  "ज़िनेब": "zineb-75-wp",
  "ज़िराम": "ziram-27-sc",
  "जैम्परो": "ametoctradin-dimethomorph-sc",
  "ज़ैम्परो": "ametoctradin-dimethomorph-sc",
  "जोरवेक": "oxathiapiprolin-10-1-od",
  "ज़ोरवेक": "oxathiapiprolin-10-1-od",
  "टरगा": "quizalofop-5-ec",
  "टायरेक्सोर": "trifludimoxazin-wg",
  "टालस्टार": "bifenthrin-10-ec",
  "टियाफेनासिल": "tiafenacil-70-wg",
  "टिल्ट": "propiconazole-25-ec",
  "टेटफ्लूपीरोलिमेट": "tetflupyrolimet-sc",
  "टेट्राकोनाज़ोल": "tetraconazole-3-8-ew",
  "टेट्रानीलीप्रोल": "tetraniliprole-200-sc",
  "टेट्रासाइक्लिन": "streptocycline-sp",
  "टेंडो": "topramezone-33-sc",
  "टेबुकोनाजोल": "tebuconazole-25-9-ec",
  "टेबुकोनाज़ोल": "tebuconazole-25-9-ec",
  "टेबुकोनाज़ोल + ट्राइफ्लॉक्सीस्ट्रोबिन": "tebuconazole-trifloxystrobin-wg",
  "टेबुकोनाज़ोल 25.9%": "tebuconazole-25-9-ec",
  "टेबुकोनाज़ोल 50%": "tebuconazole-trifloxystrobin-wg",
  "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25%": "tebuconazole-trifloxystrobin-wg",
  "टेबुफेनपायराड": "tebufenpyrad-20-wp",
  "टेम्बोट्रिओन": "tembotrione-34-sc",
  "टेराडोर": "tiafenacil-70-wg",
  "टॉलफेनपायराड": "tolfenpyrad-15-ec",
  "टॉलफेनपायराड 15%": "tolfenpyrad-15-ec",
  "टोकन": "dinotefuran-20-sg",
  "टोपाज": "penconazole-10-ec",
  "टोपास": "penconazole-10-ec",
  "टोपिक": "clodinafop-15-wp",
  "टोप्रेमेज़ोन": "topramezone-33-sc",
  "टोलफेनपायराड": "tolfenpyrad-15-ec",
  "टोलफेनपायराड 15%": "tolfenpyrad-15-ec",
  "ट्राइकोडर्मा": "trichoderma-viride-1-wp",
  "ट्राइफ्लूमेज़ोपायरीम": "triflumezopyrim-10-sc",
  "ट्राइफ्लॉक्सीस्ट्रोबिन + टेबुकोनाज़ोल": "tebuconazole-trifloxystrobin-wg",
  "ट्राइफ्लॉक्सीस्ट्रोबिन 25% + टेबुकोनाज़ोल 50%": "tebuconazole-trifloxystrobin-wg",
  "ट्राइसाइकलाज़ोल": "tricyclazole-75-wp",
  "ट्राइसाइक्लाजोल": "tricyclazole-75-wp",
  "ट्राइसाइक्लाज़ोल": "tricyclazole-75-wp",
  "ट्राईपायरासल्फोन": "tripyrasulfone-sc",
  "ट्राईफा़मोन": "triafamone-ethoxysulfuron-wg",
  "ट्राईफ्लूडीमॉक्साज़िन": "trifludimoxazin-wg",
  "ट्राईफ्लूरालिन": "trifluralin-48-ec",
  "ट्राईफ्लॉक्सीस्ट्रोबिन": "trifloxystrobin-25-wg",
  "ट्राईफ्लोक्सीस्ट्रोबिन": "trifloxystrobin-25-wg",
  "ट्रांसफार्म": "sulfoxaflor-21-8-sc",
  "ट्रांसफॉर्म": "sulfoxaflor-21-8-sc",
  "डाइक्लोरोमेज़ोटियाज़": "dicloromezotiaz-10-sc",
  "डाइक्लोरोवोस": "dichlorvos-76-ec",
  "डाइथेन": "mancozeb-75-wp",
  "डाइनोकैप": "dinocap-48-ec",
  "डाइनोकैप 48%": "dinocap-48-ec",
  "डाइमेथोमॉर्फ": "dimethomorph-50-wp",
  "डाईमेथोमॉर्फ": "dimethomorph-50-wp",
  "डानटॉप": "clothianidin-50-wdg",
  "डायफेंथियूरॉन": "diafenthiuron-50-wp",
  "डिनोटेफ्यूरन": "dinotefuran-20-sg",
  "डिनोटेफ्यूरॉन": "dinotefuran-20-sg",
  "डिफेनथियूरॉन": "diafenthiuron-50-wp",
  "डिफेनोकोनाजोल": "difenoconazole-25-ec",
  "डिफेनोकोनाज़ोल": "difenoconazole-25-ec",
  "डिफेनोकोनाज़ोल + एज़ोक्सीस्ट्रोबिन": "azoxystrobin-difenoconazole-sc",
  "डिफेनोकोनाज़ोल 11.4% + एज़ोक्सीस्ट्रोबिन 18.2%": "azoxystrobin-difenoconazole-sc",
  "डेनिटोल": "fenpropathrin-10-ec",
  "डेलीगेट": "spinetoram-11-7-sc",
  "डेल्टामेथ्रिन": "deltamethrin-2-8-ec",
  "डैनिटोल": "fenpropathrin-10-ec",
  "डैन्टॉप": "clothianidin-50-wdg",
  "डोमार्क": "tetraconazole-3-8-ew",
  "ड्रॉप": "thidiazuron-50-wp",
  "तरल कैल्शियम-बोरॉन सस्पेंशन": "calcium-boron",
  "ताकत": "captan-hexaconazole-wp",
  "थाइडियाज़्यूरॉन": "thidiazuron-50-wp",
  "थाइफ्लूज़ामाइड": "thifluzamide-24-sc",
  "थायमेथॉक्सम": "thiamethoxam-25-wg",
  "थायमेथॉक्सम + लैम्ब्डा": "thiamethoxam-lambda-zc",
  "थायमेथॉक्सम 12.6% + लैम्ब्डा 9.5%": "thiamethoxam-lambda-zc",
  "थायमेथॉक्सम 30%": "thiamethoxam-30-fs",
  "थायामेथोक्साम": "thiamethoxam-25-wg",
  "थायोक्साज़ाफेन": "tioxazafen-500-fs",
  "थायोडिकार्ब": "thiodicarb-75-wp",
  "थायोडिकार्ब 75%": "thiodicarb-75-wp",
  "थायोफैनेट": "thiophanate-methyl-70-wp",
  "थियामेथोक्सम": "thiamethoxam-25-wg",
  "थिरम": "thiram-75-wp",
  "दंतोत्सु": "clothianidin-50-wdg",
  "निकोसेल्फ्यूरॉन": "nicosulfuron-75-wg",
  "निमित्ज़": "fluensulfone-480-ec",
  "निशिको": "cyflufenamid-5-ew",
  "नीम ऑयल": "neem-oil",
  "नीम का तेल": "neem-oil-10000-ppm",
  "नीम खली": "neem-cake",
  "नीम तेल": "neem-oil",
  "नूवान": "dichlorvos-76-ec",
  "नेआल्टा": "cyflumetofen-20-sc",
  "नेटिवो": "tebuconazole-trifloxystrobin-wg",
  "नोमिनी गोल्ड": "bispyribac-sodium-10-sc",
  "नोवालुरॉन": "novaluron-10-ec",
  "नोवाल्यूरॉन": "novaluron-10-ec",
  "नोवेक्ट": "florpyrauxifen-benzyl-2-7-ec",
  "परस्यूट": "imazethapyr-10-sl",
  "परेड": "pyraziflumid-20-sc",
  "पल्सर": "thifluzamide-24-sc",
  "पाइमेट्रोज़िन": "pymetrozine-50-wg",
  "पाइरीप्रॉक्सीफेन": "pyriproxyfen-10-ec",
  "पायमेट्रोजिन": "pymetrozine-50-wg",
  "पायमेट्रोज़िन": "pymetrozine-50-wg",
  "पायराक्लोस्ट्रोबिन": "pyraclostrobin-20-wg",
  "पायराक्लोस्ट्रोबिन + मेटिराम": "metiram-55-pyraclostrobin-5-wg",
  "पायराक्लोस्ट्रोबिन 5% + मेटिराम 55%": "metiram-55-pyraclostrobin-5-wg",
  "पायराज़ीफ्लूमिड": "pyraziflumid-20-sc",
  "पायराजोसल्फ्यूरॉन": "pyrazosulfuron-10-wp",
  "पायरानिका": "acynonapyr-20-sc",
  "पायरीडालिल": "pyridalyl-10-ec",
  "पायरीप्रॉक्सीफेन": "pyriproxyfen-10-ec",
  "पायरीप्रॉक्सीफेन + बाइफेंथ्रिन": "pyriproxyfen-bifenthrin-ec",
  "पायरीप्रॉक्सीफेन 10% + बाइफेंथ्रिन 10%": "pyriproxyfen-bifenthrin-ec",
  "पायरीप्रॉक्सीफेन 10% + बायफेंथ्रिन 10%": "pyriproxyfen-bifenthrin-ec",
  "पायरीफ्लूक्विनाज़ोन": "pyrifluquinazon-20-sc",
  "पायरोक्सासल्फॉन": "pyroxasulfone-85-wg",
  "पिनोक्साडेन": "pinoxaden-5-ec",
  "पेगासस": "diafenthiuron-50-wp",
  "पेंडिमेथालिन": "pendimethalin-30-ec",
  "पेंडीमेथलीन": "pendimethalin-30-ec",
  "पेनकोनाजोल": "penconazole-10-ec",
  "पेनकोनाज़ोल": "penconazole-10-ec",
  "पेनफ्लूफेन": "penflufen-240-fs",
  "पेन्थियोपाइरैड": "penthiopyrad-20-sc",
  "पैक्लोब्यूट्राजोल": "paclobutrazol-23-sc",
  "पैराक्वाट": "paraquat-dichloride-24-sl",
  "पैराक्वॉट": "paraquat-dichloride-24-sl",
  "पॉलीराम": "metiram-70-wg",
  "पोटेशियम फॉस्फाइट": "potassium-phosphite",
  "पोटेशियम साल्ट्स ऑफ फॉस्फोरस एसिड": "potassium-phosphite",
  "प्राइड": "acetamiprid-20-sp",
  "प्रियाक्सर": "fluxapyroxad-pyraclostrobin-sc",
  "प्रिविक्युर": "propamocarb-53-2-sl",
  "प्रिविक्यूर": "propamocarb-53-2-sl",
  "प्रेटिलाक्लोर": "pretilachlor-50-ec",
  "प्रोथियोकोनाज़ोल": "prothioconazole-37-8-sc",
  "प्रोपिकोनाज़ोल": "propiconazole-25-ec",
  "प्रोपिनेब": "propineb-70-wp",
  "प्रोपेमोकार्ब": "propamocarb-53-2-sl",
  "प्रोफेक्स": "profenofos-cypermethrin-ec",
  "प्रोफेनोफॉस": "profenofos-50-ec",
  "प्रोफेनोफॉस 50%": "profenofos-50-ec",
  "प्रोलाइन": "prothioconazole-37-8-sc",
  "प्रोहाइड्रोजैस्मोन": "prohydrojasmon-5-sl",
  "प्रोहेक्साडायोन": "prohexadione-calcium-wdg",
  "प्लानोफिक्स": "naa-4-5-sl",
  "प्लियोरा": "pyridalyl-10-ec",
  "फरटेरा": "chlorantraniliprole-0-4-gr",
  "फर्टेरा": "chlorantraniliprole-0-4-gr",
  "फिप्रोनिल": "fipronil-0-3-gr",
  "फ़िप्रोनिल": "fipronil-0-3-gr",
  "फिप्रोनिल .3%": "fipronil-0-3-gr",
  "फ़िप्रोनिल .3%": "fipronil-0-3-gr",
  "फिप्रोनिल .6%": "fipronil-0-6-gr",
  "फ़िप्रोनिल .6%": "fipronil-0-6-gr",
  "फिप्रोनिल 0.3%": "fipronil-0-3-gr",
  "फ़िप्रोनिल 0.3%": "fipronil-0-3-gr",
  "फिप्रोनिल 0.3% जीआर": "fipronil-0-3-gr",
  "फ़िप्रोनिल 0.3% जीआर": "fipronil-0-3-gr",
  "फिप्रोनिल 0.6%": "fipronil-0-6-gr",
  "फ़िप्रोनिल 0.6%": "fipronil-0-6-gr",
  "फिप्रोनिल 0.6% जीआर": "fipronil-0-6-gr",
  "फ़िप्रोनिल 0.6% जीआर": "fipronil-0-6-gr",
  "फिप्रोनिल 40": "fipronil-40-imidacloprid-40-wg",
  "फ़िप्रोनिल 40": "fipronil-40-imidacloprid-40-wg",
  "फिप्रोनिल 40%": "fipronil-40-imidacloprid-40-wg",
  "फ़िप्रोनिल 40%": "fipronil-40-imidacloprid-40-wg",
  "फिप्रोनिल 40% + इमिडाक्लोप्रिड 40%": "fipronil-40-imidacloprid-40-wg",
  "फ़िप्रोनिल 40% + इमिडाक्लोप्रिड 40%": "fipronil-40-imidacloprid-40-wg",
  "फिप्रोनिल 5%": "fipronil-5-sc",
  "फ़िप्रोनिल 5%": "fipronil-5-sc",
  "फिप्रोनिल 80%": "fipronil-80-wg",
  "फुजिओन": "isoprothiolane-40-ec",
  "फुजी-वन": "isoprothiolane-40-ec",
  "फेनक्विनोट्रियोन": "fenquinotrione-sc",
  "फेनपायरोक्सीमेट": "fenpyroximate-5-ec",
  "फेनप्रोपेथ्रिन": "fenpropathrin-10-ec",
  "फेनामिडोन": "fenamidone-10-sc",
  "फेम": "flubendiamide-39-sc",
  "फेरस": "micronutrient-mixture",
  "फॉलिकुर": "tebuconazole-25-9-ec",
  "फोंटेलिस": "penthiopyrad-20-sc",
  "फोसेटाइल-एएल": "fosetyl-al-80-wp",
  "फ्यूराडान": "carbofuran-3-cg",
  "फ्लक्सामेटामाइड": "fluxametamide-10-ec",
  "फ्लुअज़िनम": "fluazinam-39-5-sc",
  "फ्लुओपायराम": "fluopyram-34-48-sc",
  "फ्लुओपिकोलाइड": "fluopicolide-propamocarb-sc",
  "फ्लुओपिकोलाइड + प्रोपामोकार्ब": "fluopicolide-propamocarb-sc",
  "फ्लुओपिकोलाइड 4.44% + प्रोपामोकार्ब": "fluopicolide-propamocarb-sc",
  "फ्लुक्सापायरोक्साड": "fluxapyroxad-250-sc",
  "फ्लुक्सापायरोक्साड + पायराक्लोस्ट्रोबिन": "fluxapyroxad-pyraclostrobin-sc",
  "फ्लुबेंडियामाइड": "flubendiamide-39-sc",
  "फ्लूआज़ाइनडोलिज़ाइन": "fluazaindolizine-500-sc",
  "फ्लूइंडोपायर": "isopyrazam-12-sc",
  "फ्लूइंडोपायर 14%": "isopyrazam-12-sc",
  "फ्लूएनसल्फोन": "fluensulfone-480-ec",
  "फ्लूऑक्सास्ट्रोबिन": "fluoxastrobin-480-sc",
  "फ्लूपीराडिफ्यूरोन": "flupyradifurone-17-09-sl",
  "फ्लूपीरीमिन": "flupyrimin-10-sc",
  "फ्लूबेंडियामाइड": "flubendiamide-39-sc",
  "फ्लूमीऑक्साज़िन": "flumioxazin-50-sc",
  "फ्लोनिकामिड": "flonicamid-50-wg",
  "फ्लोनिकैमिड": "flonicamid-50-wg",
  "फ्लोरपायरोक्सीफेन": "florpyrauxifen-benzyl-2-7-ec",
  "बरोक": "etoxazole-10-sc",
  "बाइफेंथ्रिन": "bifenthrin-10-ec",
  "बाइफेंथ्रिन + पायरीप्रॉक्सीफेन": "pyriproxyfen-bifenthrin-ec",
  "बाइफेंथ्रिन 10%": "bifenthrin-10-ec",
  "बाइफेंथ्रिन 10% + पायरीप्रॉक्सीफेन 10%": "pyriproxyfen-bifenthrin-ec",
  "बाइसाइक्लोपायरोन": "bicyclopyrone-ec",
  "बान": "tricyclazole-75-wp",
  "बायफेंथ्रिन": "bifenthrin-10-ec",
  "बायफेंथ्रिन 10%": "bifenthrin-10-ec",
  "बायफेंथ्रिन 10% + पायरीप्रॉक्सीफेन 10%": "pyriproxyfen-bifenthrin-ec",
  "बायेगो": "tetraniliprole-200-sc",
  "बाविस्टिन": "carbendazim-50-wp",
  "बिसपायरीबैक": "bispyribac-sodium-10-sc",
  "बीटा साइफ्लूथरिन": "beta-cyfluthrin-8-49-sc",
  "बीटा-साइफ्लूथरिन": "beta-cyfluthrin-8-49-sc",
  "बुझा चूना": "bordeaux-mixture",
  "बेंज़पायरीमॉक्सन": "benzpyrimoxan-10-sc",
  "बेंज़ोविन्डीफ्लूपीर": "benzovindiflupyr-100-ec",
  "बेनेविया": "cyantraniliprole-10-od",
  "बेनोमाइल": "benomyl-50-wp",
  "बैसिलस थुरिंजिएंसिस": "bacillus-thuringiensis-wp",
  "बोरिक एसिड": "boron-20",
  "बोरेक्स": "boron-20",
  "बोरॉन 20%": "boron-20",
  "बोर्डो मिश्रण": "bordeaux-mixture",
  "ब्यूप्रोफेज़िन": "buprofezin-25-sc",
  "ब्रोफ्लानिलाइड": "broflanilide-300-sc",
  "ब्रोफ्लेनीलाइड": "broflanilide-20-sc",
  "ब्रोफ्लैनिलाइड": "broflanilide-300-sc",
  "ब्लीचिंग पाउडर": "bleaching-powder",
  "मानिक": "acetamiprid-20-sp",
  "मिथाइल पैराथियान": "methyl-parathion-2-dp",
  "मिथाइल पैराथियान 2% dp": "methyl-parathion-2-dp",
  "मिथाइल पैराथियान 2% डस्ट": "methyl-parathion-2-dp",
  "मिथाइल पैराथियान डस्ट": "methyl-parathion-2-dp",
  "मिथाइल पैराथियॉन": "methyl-parathion-2-dp",
  "मिराविस डुओ": "pydiflumetofen-fludioxonil-sc",
  "मेटाफ्लूमीज़ोन": "metaflumizone-24-sc",
  "मेटालेक्सिल": "metalaxyl-m-mancozeb-wp",
  "मेटालैक्सिल": "metalaxyl-m-mancozeb-wp",
  "मेटासिस्टॉक्स": "oxydemeton-methyl-25-ec",
  "मेटिराम": "metiram-70-wg",
  "मेटिराम + पायराक्लोस्ट्रोबिन": "metiram-55-pyraclostrobin-5-wg",
  "मेटिराम 55%": "metiram-55-pyraclostrobin-5-wg",
  "मेटिराम 55% + पायराक्लोस्ट्रोबिन 5%": "metiram-55-pyraclostrobin-5-wg",
  "मेटीराम": "metiram-70-wg",
  "मेट्राफेनोन": "metrafenone-50-sc",
  "मेट्रिब्यूजिन": "metribuzin-70-wp",
  "मेडेन": "hexythiazox-5-45-ec",
  "मेथॉक्सीफेनोसाइड": "methoxyfenozide-150-sc",
  "मेरीवोन": "fluxapyroxad-250-sc",
  "मेलाथियान": "malathion-50-ec",
  "मेलाथियान 50%": "malathion-50-ec",
  "मैंकोजेब": "mancozeb-75-wp",
  "मैंकोजेब + कार्बेन्डाजिम": "carbendazim-mancozeb-wp",
  "मैंकोजेब 63% + कार्बेन्डाजिम 12%": "carbendazim-mancozeb-wp",
  "मैग्नीशियम सल्फेट": "magnesium-sulphate",
  "मैंडीप्रोपामिड": "mandipropamid-23-sc",
  "मैनकोजेब": "mancozeb-75-wp",
  "मैनकोज़ेब": "mancozeb-75-wp",
  "मैनकोजेब + कार्बेंडाजिम": "carbendazim-mancozeb-wp",
  "मैनकोजेब 63% + कार्बेंडाजिम 12%": "carbendazim-mancozeb-wp",
  "मोनोक्रोटोफॉस": "monocrotophos-36-sl",
  "मोवेंटो": "spirotetramat-15-od",
  "राउंडअप": "glyphosate-41-sl",
  "रिडोमिल": "metalaxyl-m-mancozeb-wp",
  "रिमोन": "novaluron-10-ec",
  "रीजेंट": "fipronil-0-3-gr",
  "रेक्लेमेल": "fluazaindolizine-500-sc",
  "रेवुस": "mandipropamid-23-sc",
  "रोको": "thiophanate-methyl-70-wp",
  "लक्सिमो": "cinmethylin-ec",
  "लक्सीमो": "cinmethylin-ec",
  "लार्विन": "thiodicarb-75-wp",
  "लिएटो": "amisulbrom-17-7-sc",
  "लिहोसिन": "chlormequat-chloride-50-sl",
  "लीडर": "sulfosulfuron-75-wg",
  "लैनो": "pyriproxyfen-10-ec",
  "लैम्ब्डा": "lambda-cyhalothrin-5-ec",
  "लैंसर गोल्ड": "acephate-75-sp",
  "लॉडिस": "tembotrione-34-sc",
  "वाइब्रेंस": "sedaxane-50-fs",
  "वायेगो": "tetraniliprole-200-sc",
  "विवांडो": "metrafenone-50-sc",
  "वेलम प्राइम": "fluopyram-34-48-sc",
  "वैलिडामाइसिन": "validamycin-3-l",
  "शीथमार": "validamycin-3-l",
  "समुद्री शैवाल": "seaweed-amino-acids",
  "समुराई": "tebufenpyrad-20-wp",
  "सल्फर": "wettable-sulphur-80-wdg",
  "सल्फर 80%": "wettable-sulphur-80-wdg",
  "सल्फोक्साफ्लोर": "sulfoxaflor-21-8-sc",
  "सल्फोसल्फ्यूरॉन": "sulfosulfuron-75-wg",
  "साइंट्रानिलिप्रोल": "cyantraniliprole-10-od",
  "साइपरमेथ्रिन": "cypermethrin-10-ec",
  "साइपरमेथ्रिन 10%": "cypermethrin-10-ec",
  "साइपरमेथ्रिन 25%": "cypermethrin-25-ec",
  "साइपायराफ्लूओन": "cypyrafluone-sc",
  "साइफ्लूफेनामाइड": "cyflufenamid-5-ew",
  "साइफ्लूमीटोफेन": "cyflumetofen-20-sc",
  "साइमोक्सानिल": "cymoxanil-mancozeb-wp",
  "साइहलोडायामाइड": "cyhalodiamide-10-sc",
  "साथी": "pyrazosulfuron-10-wp",
  "साफ": "carbendazim-mancozeb-wp",
  "सायाज़ोफामिड": "cyazofamid-34-5-sc",
  "सिनमिथाइलिन": "cinmethylin-ec",
  "सिमेग्रा": "broflanilide-300-sc",
  "सिमोडिस": "isocycloseram-10-dc",
  "सिम्पिल": "dicloromezotiaz-10-sc",
  "सिलिकिक एसिड आधारित वायरस सप्रेसर": "potassium-phosphite",
  "सिलिकॉन": "silicon-spreader",
  "सिलिकॉन स्टीकर": "silicon-spreader",
  "सिलिकॉन स्प्रेडर": "silicon-spreader",
  "सिवांटो": "flupyradifurone-17-09-sl",
  "सिवांतो": "flupyradifurone-17-09-sl",
  "सीमेग्रा": "broflanilide-20-sc",
  "सीवीड": "seaweed-amino",
  "सुमीमैक्स": "flumioxazin-50-sc",
  "सूक्ष्म पोषक तत्व": "micronutrient-mixture",
  "सूक्ष्म पोषक तत्व मिश्रण": "micronutrient-mixture",
  "सूडोमोनास": "pseudomonas-fluorescens-1-wp",
  "सेक्टिन": "fenamidone-10-sc",
  "सेडना": "fenpyroximate-5-ec",
  "सेडाक्सेन": "sedaxane-50-fs",
  "सेदना": "fenpyroximate-5-ec",
  "सेनकोर": "metribuzin-70-wp",
  "सेफिना": "afidopyropen-50-dc",
  "सेम्प्रा": "halosulfuron-75-wg",
  "सैफ्लूफेनासिल": "saflufenacil-70-wg",
  "सोनालान": "ethalfluralin-35-4-ec",
  "सोलाटेनोल": "benzovindiflupyr-100-ec",
  "सोलोमन": "beta-cyfluthrin-8-49-sc",
  "स्कोर": "difenoconazole-25-ec",
  "स्टॉम्प": "pendimethalin-30-ec",
  "स्ट्रेप्टोमाइसिन": "streptocycline-sp",
  "स्ट्रेप्टोसाइक्लिन": "streptocycline-sp",
  "स्पाइनोसैड": "spinosad-45-sc",
  "स्पाइरोमेसिफेन": "spiromesifen-22-9-sc",
  "स्पायरोटेट्रामैट": "spirotetramat-15-od",
  "स्पायरोमेसिफेन": "spiromesifen-22-9-sc",
  "स्पिनेटोरम": "spinetoram-11-7-sc",
  "स्पिनोसैड": "spinosad-45-sc",
  "स्यूडोमोनास": "pseudomonas-fluorescens",
  "स्यूडोमोनास फ्लोरेसेंस": "pseudomonas-fluorescens-1-wp",
  "हमला": "chlorpyrifos-50-cypermethrin-5-ec",
  "हमला 550": "chlorpyrifos-50-cypermethrin-5-ec",
  "हिनोसन": "edifenphos-50-ec",
  "हेक्साकोनाज़ोल": "hexaconazole-5-ec",
  "हेक्सीथियाज़ॉक्स": "hexythiazox-5-45-ec",
  "हैलॉक्सीफेन": "halauxifen-methyl-ec",
  "हैलॉक्सीफॉप": "haloxyfop-r-methyl-10-ec",
  "हैलोक्सीफॉप": "haloxyfop-r-methyl-10-5-ec",
  "हैलोसल्फ्यूरॉन": "halosulfuron-75-wg",
  "होमोब्रासिनोलाइड": "homobrassinolide-004",
  "ह्यूमिक एसिड": "humic-acid-12",
  "ह्यूमिक एसिड 12%": "humic-acid-12",
};

/** Prefer the earliest and longest alias match so "एसीफेट 50% + इमिडाक्लोप्रिड 1.8% SP" matches Acephate and "chlorantraniliprole 0.4% gr" beats generic name. */
export function lookupChemBottle(raw: string): ChemBottleEntry | undefined {
  if (!raw) return undefined;

  // 1. Check Hindi mapping first: pick the keyword that appears earliest in raw
  //    (breaking ties by longest keyword length)
  let bestHindiSlug: string | undefined;
  let bestHindiIdx = Infinity;
  let bestHindiLen = 0;

  for (const [hiWord, targetSlug] of Object.entries(HINDI_AGRI_CHEM_MAP)) {
    const idx = raw.indexOf(hiWord);
    if (idx !== -1) {
      if (idx < bestHindiIdx || (idx === bestHindiIdx && hiWord.length > bestHindiLen)) {
        bestHindiIdx = idx;
        bestHindiLen = hiWord.length;
        bestHindiSlug = targetSlug;
      }
    }
  }

  if (bestHindiSlug) {
    const match = CHEM_BOTTLE_CATALOG.find((e) => e.slug === bestHindiSlug);
    if (match) return match;
  }

  // 2. English / normalized search
  const n = normalizeKey(raw);
  if (!n) return undefined;
  if (byAlias.has(n)) return byAlias.get(n);

  let best: ChemBottleEntry | undefined;
  let bestLen = 0;
  let bestIdx = Infinity;
  for (const [key, entry] of byAlias) {
    if (key.length < 4) continue;
    // Guard: wettable sulphur must never match herbicides or weeds with sulf- in name
    if (entry.slug === "wettable-sulphur-80-wdg") {
      if (
        n.includes("uron") ||
        n.includes("sulfuron") ||
        n.includes("sulfone") ||
        n.includes("herbicide") ||
        n.includes("weed") ||
        n.includes("घास") ||
        n.includes("खरपतवार")
      ) {
        continue;
      }
    }
    const idx = n.indexOf(key);
    if (idx !== -1) {
      // Require whole word boundary match so "sulfur" does not match within "sulfosulfuron"
      const charBefore = idx > 0 ? n[idx - 1] : " ";
      const charAfter = idx + key.length < n.length ? n[idx + key.length] : " ";
      if (charBefore !== " " || charAfter !== " ") {
        continue;
      }

      if (key.length > bestLen || (key.length === bestLen && idx < bestIdx)) {
        best = entry;
        bestLen = key.length;
        bestIdx = idx;
      }
    }
  }
  return best;
}

function hyphenSplit(word: string, max: number): string[] {
  if (word.length <= max) return [word];
  const lines: string[] = [];
  let rest = word;
  while (rest.length > max) {
    lines.push(`${rest.slice(0, max - 1)}-`);
    rest = rest.slice(max - 1);
  }
  if (rest) lines.push(rest);
  return lines;
}

export function wrapBottleWords(text: string, maxChars = 13, maxLines = 3): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let cur = "";

  const push = (line: string) => {
    if (line && lines.length < maxLines) lines.push(line);
  };

  for (const word of words) {
    if (lines.length >= maxLines) break;
    const pieces = hyphenSplit(word, maxChars);
    for (const piece of pieces) {
      if (lines.length >= maxLines) break;
      const next = cur ? `${cur} ${piece}` : piece;
      if (next.length <= maxChars) {
        cur = next;
      } else {
        push(cur);
        cur = piece;
      }
    }
  }
  push(cur);
  return lines.filter(Boolean);
}

function cleanTechnical(technical: string): string {
  return technical
    .replace(/\([^)]*(?:IRAC|FRAC|HRAC|Group)[^)]*\)/gi, " ")
    .replace(/\b(?:IRAC|FRAC|HRAC)\s*\S*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function wrapNameForBottle(name: string): string[] {
  const raw = name.replace(/\s+/g, " ").trim();
  if (!raw) return [];
  if (raw.includes("+")) {
    return raw
      .split("+")
      .map((part, i) => {
        const t = part.trim().toUpperCase();
        return i === 0 ? t : `+ ${t}`;
      })
      .slice(0, 3);
  }
  const words = raw.split(" ").filter(Boolean);
  if (words.length >= 2) {
    return wrapBottleWords(raw.toUpperCase(), 10, 3);
  }
  const u = raw.toUpperCase();
  if (u.length <= 12) return [u];
  if (u.length <= 20) {
    const mid = Math.ceil(u.length / 2);
    return [u.slice(0, mid), u.slice(mid)];
  }
  const a = Math.ceil(u.length / 3);
  return [u.slice(0, a), u.slice(a, a * 2), u.slice(a * 2)];
}

export function toEnglishTechnical(raw: string): string {
  if (!raw) return "";
  const hit = lookupChemBottle(raw);
  if (hit) return hit.name.toUpperCase();

  let s = raw;
  const map: Array<[RegExp, string]> = [
    [/इमामेक्टिन\s*(?:बेन्जोएट|बेंजोएट)?/gi, "EMAMECTIN BENZOATE"],
    [/एमामेक्टिन\s*(?:बेन्जोएट|बेंजोएट)?/gi, "EMAMECTIN BENZOATE"],
    [/क्लोरांट्रानिलीप्रोल/gi, "CHLORANTRANILIPROLE"],
    [/कोराजन/gi, "CHLORANTRANILIPROLE"],
    [/इमिडाक्लोप्रिड/gi, "IMIDACLOPRID"],
    [/कान्फिडोर|कन्फिडोर/gi, "IMIDACLOPRID"],
    [/थायमेथॉक्सम|थियामेथोक्सम/gi, "THIAMETHOXAM"],
    [/फिप्रोनिल|फ़िप्रोनिल/gi, "FIPRONIL"],
    [/फ्लोनिकामिड/gi, "FLONICAMID"],
    [/उलाला/gi, "FLONICAMID"],
    [/एफिडोपायरोपैन/gi, "AFIDOPYROPEN"],
    [/सेफिना/gi, "AFIDOPYROPEN"],
    [/डिनोटेफ्यूरॉन|डिनोटेफ्यूरन/gi, "DINOTEFURAN"],
    [/क्लोथियानिडिन/gi, "CLOTHIANIDIN"],
    [/मिथाइल\s*पैराथियान|मिथाइल\s*पैराथियॉन/gi, "METHYL PARATHION"],
    [/स्पायरोटेट्रामैट/gi, "SPIROTETRAMAT"],
    [/मोवेंटो/gi, "SPIROTETRAMAT"],
    [/कार्टाप|कार्टप/gi, "CARTAP HYDROCHLORIDE"],
    [/लैम्ब्डा(?:\s*साइहलोथ्रिन)?/gi, "LAMBDA-CYHALOTHRIN"],
    [/कराटे/gi, "LAMBDA-CYHALOTHRIN"],
    [/स्पिनोसैड/gi, "SPINOSAD"],
    [/स्पिनेटोरम/gi, "SPINETORAM"],
    [/डेलीगेट/gi, "SPINETORAM"],
    [/फ्लुबेंडियामाइड/gi, "FLUBENDIAMIDE"],
    [/फेम/gi, "FLUBENDIAMIDE"],
    [/डेल्टामेथ्रिन/gi, "DELTAMETHRIN"],
    [/ब्यूप्रोफेज़िन/gi, "BUPROFEZIN"],
    [/डायफेंथियूरॉन/gi, "DIAFENTHIURON"],
    [/स्पाइरोमेसिफेन/gi, "SPIROMESIFEN"],
    [/साइपरमेथ्रिन/gi, "CYPERMETHRIN"],
    [/एसेफेट|एसीफेट|ऐसीफेट|असताफ|लैंसर\s*गोल्ड/gi, "ACEPHATE"],
    [/थायोडिकार्ब|लार्विन/gi, "THIODICARB"],
    [/नोवाल्यूरॉन|नोवालुरॉन|रिमोन/gi, "NOVALURON"],
    [/पायरीप्रॉक्सीफेन|पाइरीप्रॉक्सीफेन|लैनो/gi, "PYRIPROXYFEN"],
    [/टोलफेनपायराड|कीफन/gi, "TOLFENPYRAD"],
    [/कार्बोफ्यूरान|फ्यूराडान/gi, "CARBOFURAN"],
    [/नीम\s*तेल|नीम\s*ऑयल|एज़ाडिराक्टिन|अज़ाडिराक्टिन/gi, "AZADIRACHTIN (NEEM OIL)"],
    [/ट्राइकोडर्मा(?:\s*विरिडी|\s*हर्जियानम)?/gi, "TRICHODERMA VIRIDE"],
    [/स्यूडोमोनास(?:\s*फ्लोरेसेंस)?/gi, "PSEUDOMONAS FLUORESCENS"],
    [/घुलनशील\s*सल्फर|सल्फर/gi, "WETTABLE SULPHUR"],
    [/पायराक्लोस्ट्रोबिन|कैब्रियो\s*टॉप/gi, "PYRACLOSTROBIN"],
    [/पाइमेट्रोज़िन/gi, "PYMETROZINE"],
    [/क्लोरफेनापायर/gi, "CHLORFENAPYR"],
    [/ब्रोफ्लै?निलाइड/gi, "BROFLANILIDE"],
    [/सिमेग्रा/gi, "BROFLANILIDE"],
    [/मैंकोजेब|मैनकोजेब|मैनकोज़ेब/gi, "MANCOZEB"],
    [/डाइथेन|इंडोफिल/gi, "MANCOZEB"],
    [/कार्बेन्डाजिम|कार्बेंडाजिम/gi, "CARBENDAZIM"],
    [/बाविस्टिन/gi, "CARBENDAZIM"],
    [/रिडोमिल(?:\s*गोल्ड)?|मेटालेक्सिल|मेटालैक्सिल/gi, "METALAXYL-M + MANCOZEB"],
    [/साफ\s*(?:फंगीसाइड)?/gi, "CARBENDAZIM + MANCOZEB"],
    [/नेटिवो/gi, "TEBUCONAZOLE + TRIFLOXYSTROBIN"],
    [/एमिस्टार\s*टॉप/gi, "AZOXYSTROBIN + DIFENOCONAZOLE"],
    [/स्ट्रेप्टोसाइक्लिन|स्ट्रेप्टोमाइसिन/gi, "STREPTOCYCLINE"],
    [/वैलिडामाइसिन|शीथमार/gi, "VALIDAMYCIN"],
    [/क्लोरोपायरीफॉस|हमला/gi, "CHLORPYRIFOS + CYPERMETHRIN"],
    [/क्लोरपायरीफॉस/gi, "CHLORPYRIFOS + CYPERMETHRIN"],
    [/गुड़\s*(?:व|\/|या)\s*(?:गन्ने\s*का\s*)?शीरा|गुड़\/शीरा/gi, "JAGGERY & MOLASSES BAIT"],
    [/प्रोफेनोफॉस|प्रोफेक्स/gi, "PROFENOFOS + CYPERMETHRIN"],
    [/एसिटामिप्रिड|प्राइड|मानिक/gi, "ACETAMIPRID"],
    [/इंडोक्साकार्ब|अवांट/gi, "INDOXACARB"],
    [/प्रोपिनेब/gi, "PROPINEB"],
    [/एंट्राकोल/gi, "PROPINEB"],
    [/डिफेनोकोनाज़ोल|डिफेनोकोनाजोल/gi, "DIFENOCONAZOLE"],
    [/स्कोर/gi, "DIFENOCONAZOLE"],
    [/टेबुकोनाज़ोल|टेबुकोनाजोल/gi, "TEBUCONAZOLE"],
    [/फॉलिकुर/gi, "TEBUCONAZOLE"],
    [/एज़ोक्सीस्ट्रोबिन|एजोक्सीस्ट्रोबिन/gi, "AZOXYSTROBIN"],
    [/एमिस्टार/gi, "AZOXYSTROBIN"],
    [/क्लोरोथैलोनिल/gi, "CHLOROTHALONIL"],
    [/कवच/gi, "CHLOROTHALONIL"],
    [/कॉपर\s*ऑक्सीक्लोराइड/gi, "COPPER OXYCHLORIDE"],
    [/कॉपर\s*हाइड्रोक्साइड/gi, "COPPER HYDROXIDE"],
    [/डाइमेथोमॉर्फ|डाईमेथोमॉर्फ/gi, "DIMETHOMORPH"],
    [/मैंडीप्रोपामिड/gi, "MANDIPROPAMID"],
    [/थायोफैनेट(?:\s*मिथाइल)?/gi, "THIOPHANATE METHYL"],
    [/कासुगामाइसिन/gi, "KASUGAMYCIN"],
    [/थाइफ्लूज़ामाइड|थायफ्लूजामाइड/gi, "THIFLUZAMIDE"],
    [/हेक्साकोनाज़ोल/gi, "HEXACONAZOLE"],
    [/ट्राइसाइ[क]?लाज़ोल|ट्राइसाइक्लो[ज़ाज़]ोल/gi, "TRICYCLAZOLE"],
    [/फ्लुक्सापायरोक्साड/gi, "FLUXAPYROXAD"],
    [/प्रोपिकोनाज़ोल/gi, "PROPICONAZOLE"],
    [/साइमोक्सानिल|कर्जेट/gi, "CYMOXANIL + MANCOZEB"],
    [/आइसोप्रोथिओलेन/gi, "ISOPROTHIOLANE"],
    [/हिनोसन/gi, "EDIFENPHOS"],
    [/डाइनोकैप/gi, "DINOCAP"],
    [/कैप्टन/gi, "CAPTAN"],
    [/पेनकोनाज़ोल|पेनकोनाजोल/gi, "PENCONAZOLE"],
    [/क्रे[ज़ज]ोक्सिम(?:\s*मिथाइल)?/gi, "KRESOXIM-METHYL"],
    [/नोवाल्यूरॉन|नोवाल्यूरोन/gi, "NOVALURON"],
    [/ज़िनेब|जिनेब/gi, "ZINEB"],
    [/थिरम|थाइरम|थीरम/gi, "THIRAM"],
    [/बेनोमाइल|बेनोमिल/gi, "BENOMYL"],
    [/डाइक्लोरोवोस/gi, "DICHLORVOS"],
    [/मोनोक्रोटोफॉस|मोनोक्रोटोफास/gi, "MONOCROTOPHOS"],
    [/ऑक्सीडेमेटॉन(?:\s*मिथाइल)?/gi, "OXYDEMETON-METHYL"],
    [/फ्लुअज़िनम|फ्लुआजिनाम/gi, "FLUAZINAM"],
    [/साया[ज़ज]ोफामिड/gi, "CYAZOFAMID"],
    [/ज़िराम|जिराम/gi, "ZIRAM"],
    [/पायमेट्रोज़िन|पायमेट्रोजिन/gi, "PYMETROZINE"],
    [/स्यूडोमोनास|सूडोमोनास/gi, "PSEUDOMONAS FLUORESCENS"],
    [/बैसिलस(?:\s*थुरिंजिएंसिस)?/gi, "BACILLUS THURINGIENSIS"],
    [/नीम\s*खली/gi, "NEEM CAKE ORGANIC AMENDMENT"],
    [/बोर्डो\s*मिश्रण/gi, "BORDEAUX MIXTURE"],
    [/पोटेशियम\s*फॉस्फाइट/gi, "POTASSIUM PHOSPHITE"],
    [/घुलनशील\s*गंधक/gi, "WETTABLE SULPHUR"],
    [/एफिडोपायरोपैन/gi, "AFIDOPYROPEN"],
    [/फ्लुओपायराम/gi, "FLUOPYRAM"],
    [/चिलेटेड\s*बोरॉन|बोरॉन\s*20%|बोरेक्स|बोरॉन/gi, "SOLUBLE BORON"],
    [/चिलेटेड\s*जिंक|जिंक\s*सल्फेट/gi, "CHELATED ZINC EDTA"],
    [/मैग्नीशियम\s*सल्फेट/gi, "MAGNESIUM SULPHATE"],
    [/ह्यूमिक\s*एसिड/gi, "HUMIC ACID 12%"],
    [/ब्लीचिंग\s*पाउडर/gi, "BLEACHING POWDER"],
    [/फ्लूइंडोपायर/gi, "ISOPYRAZAM"],
    [/टेट्रासाइक्लिन/gi, "TETRACYCLINE"],
    [/कैल्शियम\s*क्लोराइड|चिलेटेड\s*कैल्शियम/gi, "CHELATED CALCIUM"],
    [/सूक्ष्म\s*पोषक\s*तत्व/gi, "MICRONUTRIENT MIXTURE"],
    [/एट्राजिन|एट्राज़ीन/gi, "ATRAZINE"],
    [/पेंडिमेथालिन|पेंडीमेथलीन/gi, "PENDIMETHALIN"],
    [/ग्लाइफोसेट/gi, "GLYPHOSATE"],
    [/पैराक्वाट/gi, "PARAQUAT"],
    [/प्रेटिलाक्लोर/gi, "PRETILACHLOR"],
    [/बिसपायरीबैक(?:\s*सोडियम)?/gi, "BISPYRIBAC SODIUM"],
    [/क्लोडिनाफॉप/gi, "CLODINAFOP"],
    [/सल्फोसल्फ्यूरॉन|लीडर/gi, "SULFOSULFURON"],
    [/मेट्रिब्यूजिन/gi, "METRIBUZIN"],
    [/पायरोक्सासल्फॉन/gi, "PYROXASULFONE"],
    [/टेम्बोट्रिओन/gi, "TEMBOTRIONE"],
    [/पायराजोसल्फ्यूरॉन|साथी/gi, "PYRAZOSULFURON-ETHYL"],
    [/इमाजेथापायर|परस्यूट/gi, "IMAZETHAPYR"],
    [/क्विजालोफॉप|टरगा/gi, "QUIZALOFOP-ETHYL"],
    [/हैलोसल्फ्यूरॉन|सेम्प्रा/gi, "HALOSULFURON-METHYL"],
    [/२,४-डी|2,4-डी/gi, "2,4-D AMINE SALT"],
    [/पैक्लोब्यूट्राजोल|कल्टर/gi, "PACLOBUTRAZOL"],
    [/क्लोर्मेक्वाट|लिहोसिन/gi, "CHLORMEQUAT CHLORIDE"],
  ];

  for (const [re, repl] of map) {
    if (re.test(s)) {
      s = s.replace(re, repl);
    }
  }

  return s.toUpperCase().trim();
}

export function bottleLabelParts(technical: string): {
  name: string;
  formulation: string;
  nameLines: string[];
} {
  const cleaned = cleanTechnical(technical);
  const hit = lookupChemBottle(cleaned);
  if (hit) {
    return {
      name: hit.name.toUpperCase(),
      formulation: hit.formulation.trim().toUpperCase(),
      nameLines: wrapNameForBottle(hit.name.toUpperCase()),
    };
  }

  const formMatch = cleaned.match(FORM_RE);
  const formulation = (formMatch?.[1]?.trim() ?? "").toUpperCase();
  const rawName = (formMatch ? cleaned.replace(formMatch[0], " ") : cleaned)
    .replace(/\s*[+]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const englishName = toEnglishTechnical(rawName) || rawName.toUpperCase();

  return {
    name: englishName,
    formulation,
    nameLines: wrapNameForBottle(englishName),
  };
}

export function bottleLabelLines(technical: string): string[] {
  const { nameLines, formulation } = bottleLabelParts(technical);
  if (formulation && !nameLines.some((l) => l.toLowerCase().includes(formulation.toLowerCase()))) {
    return [...nameLines, formulation].slice(0, 3);
  }
  return nameLines.slice(0, 3);
}

export function bottleCategory(technical: string): ChemBottleCategory {
  return lookupChemBottle(technical)?.category ?? "insecticide";
}

/** Pull a printable technical from a farmer dose line. */
export function technicalFromSprayLine(line: string): string {
  return line
    .split(/[·•@→]|\/लीटर|\/L\s*water/i)[0]
    ?.replace(/^Chemical:\s*/i, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim() || line.slice(0, 48);
}

export type ChemPackageType = "bottle" | "pouch";

export function getChemPackageType(technical: string, formulation?: string): ChemPackageType {
  const t = `${technical} ${formulation || ""}`.toUpperCase();
  if (
    /\b(?:WP|WG|WDG|SG|SP|GR|DF|WS|DP)\b/.test(t) ||
    /पाउच|पैकेट|चूर्ण|घुलनशील\s*पाउडर|POUCH|PACKET|SACHET|DUST|डस्ट/i.test(technical)
  ) {
    return "pouch";
  }
  return "bottle";
}

