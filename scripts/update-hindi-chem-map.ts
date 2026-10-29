import fs from 'fs';

const newHindiMappings: Record<string, string> = {
  // New Fungicides
  "ट्राईफ्लॉक्सीस्ट्रोबिन": "trifloxystrobin-25-wg",
  "ट्राईफ्लोक्सीस्ट्रोबिन": "trifloxystrobin-25-wg",
  "मेटीराम": "metiram-70-wg",
  "मेटिराम": "metiram-70-wg",
  "पॉलीराम": "metiram-70-wg",
  "कैब्रियो टॉप": "metiram-55",
  "कैब्रियोटॉप": "metiram-55",
  "एमिसुलब्रोम": "amisulbrom-17-7-sc",
  "लिएटो": "amisulbrom-17-7-sc",
  "टेट्राकोनाज़ोल": "tetraconazole-3-8-ew",
  "डोमार्क": "tetraconazole-3-8-ew",
  "मेट्राफेनोन": "metrafenone-50-sc",
  "विवांडो": "metrafenone-50-sc",
  "फेनामिडोन": "fenamidone-10-sc",
  "सेक्टिन": "fenamidone-10-sc",
  "प्रोपेमोकार्ब": "propamocarb-53-2-sl",
  "प्रिविक्यूर": "propamocarb-53-2-sl",
  "प्रिविक्युर": "propamocarb-53-2-sl",
  "जैम्परो": "ametoctradin-dimethomorph-sc",
  "ज़ैम्परो": "ametoctradin-dimethomorph-sc",
  "एमेटोक्ट्राडिन": "ametoctradin-dimethomorph-sc",
  "बेंज़ोविन्डीफ्लूपीर": "benzovindiflupyr-100-ec",
  "इलाटस प्लस": "benzovindiflupyr-100-ec",
  "एलाटस प्लस": "benzovindiflupyr-100-ec",
  "सोलाटेनोल": "benzovindiflupyr-100-ec",
  "प्रोथियोकोनाज़ोल": "prothioconazole-37-8-sc",
  "प्रोलाइन": "prothioconazole-37-8-sc",
  "ऑक्सैथियापाइप्रोलिन": "oxathiapiprolin-10-1-od",
  "ज़ोरवेक": "oxathiapiprolin-10-1-od",
  "जोरवेक": "oxathiapiprolin-10-1-od",
  "साइफ्लूफेनामाइड": "cyflufenamid-5-ew",
  "निशिको": "cyflufenamid-5-ew",
  "पायराज़ीफ्लूमिड": "pyraziflumid-20-sc",
  "परेड": "pyraziflumid-20-sc",
  "इनपायर्फ्लक्सम": "inpyrfluxam-30-sc",
  "इंडीफ्लिन": "inpyrfluxam-30-sc",
  "सेडाक्सेन": "sedaxane-50-fs",
  "वाइब्रेंस": "sedaxane-50-fs",
  "इपफ्लूफेनोक्विन": "ipflufenoquin-20-sc",
  "क्विनोफ्यूमेलिन": "quinofumelin-25-sc",
  "फ्लूऑक्सास्ट्रोबिन": "fluoxastrobin-480-sc",
  "एविटो": "fluoxastrobin-480-sc",
  "पेन्थियोपाइरैड": "penthiopyrad-20-sc",
  "फोंटेलिस": "penthiopyrad-20-sc",
  "मिराविस डुओ": "pydiflumetofen-fludioxonil-sc",

  // New Insecticides & Miticides
  "क्लोरफेनापायर": "chlorfenapyr-10-sc",
  "इन्ट्रेपिड": "chlorfenapyr-10-sc",
  "इंट्रेपिड": "chlorfenapyr-10-sc",
  "इटोक्साज़ोल": "etoxazole-10-sc",
  "बरोक": "etoxazole-10-sc",
  "फेनपायरोक्सीमेट": "fenpyroximate-5-ec",
  "सेदना": "fenpyroximate-5-ec",
  "सेडना": "fenpyroximate-5-ec",
  "हेक्सीथियाज़ॉक्स": "hexythiazox-5-45-ec",
  "मेडेन": "hexythiazox-5-45-ec",
  "बीटा-साइफ्लूथरिन": "beta-cyfluthrin-8-49-sc",
  "बीटा साइफ्लूथरिन": "beta-cyfluthrin-8-49-sc",
  "सोलोमन": "beta-cyfluthrin-8-49-sc",
  "फेनप्रोपेथ्रिन": "fenpropathrin-10-ec",
  "डेनिटोल": "fenpropathrin-10-ec",
  "डैनिटोल": "fenpropathrin-10-ec",
  "फ्लक्सामेटामाइड": "fluxametamide-10-ec",
  "ग्रेशिया": "fluxametamide-10-ec",
  "ग्रेसिया": "fluxametamide-10-ec",
  "आइसोसाइक्लोसेरम": "isocycloseram-10-dc",
  "सिमोडिस": "isocycloseram-10-dc",
  "इनसिपियो": "isocycloseram-10-dc",
  "ब्रोफ्लेनीलाइड": "broflanilide-20-sc",
  "सीमेग्रा": "broflanilide-20-sc",
  "टेट्रानीलीप्रोल": "tetraniliprole-200-sc",
  "बायेगो": "tetraniliprole-200-sc",
  "वायेगो": "tetraniliprole-200-sc",
  "फ्लूपीराडिफ्यूरोन": "flupyradifurone-17-09-sl",
  "सिवांतो": "flupyradifurone-17-09-sl",
  "सिवांटो": "flupyradifurone-17-09-sl",
  "सल्फोक्साफ्लोर": "sulfoxaflor-21-8-sc",
  "ट्रांसफॉर्म": "sulfoxaflor-21-8-sc",
  "ट्रांसफार्म": "sulfoxaflor-21-8-sc",
  "पायरीडालिल": "pyridalyl-10-ec",
  "प्लियोरा": "pyridalyl-10-ec",
  "बेंज़पायरीमॉक्सन": "benzpyrimoxan-10-sc",
  "ऑर्केस्ट्रा": "benzpyrimoxan-10-sc",
  "फ्लूआज़ाइनडोलिज़ाइन": "fluazaindolizine-500-sc",
  "रेक्लेमेल": "fluazaindolizine-500-sc",
  "डाइक्लोरोमेज़ोटियाज़": "dicloromezotiaz-10-sc",
  "सिम्पिल": "dicloromezotiaz-10-sc",
  "फ्लूपीरीमिन": "flupyrimin-10-sc",
  "फ्लूएनसल्फोन": "fluensulfone-480-ec",
  "निमित्ज़": "fluensulfone-480-ec",
  "साइफ्लूमीटोफेन": "cyflumetofen-20-sc",
  "नेआल्टा": "cyflumetofen-20-sc",
  "एसिनोनापायर": "acynonapyr-20-sc",
  "पायरानिका": "acynonapyr-20-sc",
  "पायरीफ्लूक्विनाज़ोन": "pyrifluquinazon-20-sc",
  "कोल्ट": "pyrifluquinazon-20-sc",
  "साइहलोडायामाइड": "cyhalodiamide-10-sc",
  "थायोक्साज़ाफेन": "tioxazafen-500-fs",
  "टेबुफेनपायराड": "tebufenpyrad-20-wp",
  "समुराई": "tebufenpyrad-20-wp",
  "मेथॉक्सीफेनोसाइड": "methoxyfenozide-150-sc",
  "ईटोफेनप्रॉक्स": "etofenprox-10-ew",
  "मेटाफ्लूमीज़ोन": "metaflumizone-24-sc",

  // New Herbicides
  "फ्लोरपायरोक्सीफेन": "florpyrauxifen-benzyl-2-7-ec",
  "नोवेक्ट": "florpyrauxifen-benzyl-2-7-ec",
  "हैलॉक्सीफेन": "halauxifen-methyl-ec",
  "एलिवोर": "halauxifen-methyl-ec",
  "टियाफेनासिल": "tiafenacil-70-wg",
  "टेराडोर": "tiafenacil-70-wg",
  "ट्राईफा़मोन": "triafamone-ethoxysulfuron-wg",
  "काउंसिल एक्टिव": "triafamone-ethoxysulfuron-wg",
  "फ्लूमीऑक्साज़िन": "flumioxazin-50-sc",
  "सुमीमैक्स": "flumioxazin-50-sc",
  "हैलोक्सीफॉप": "haloxyfop-r-methyl-10-5-ec",
  "गैलेंट": "haloxyfop-r-methyl-10-5-ec",
  "बाइसाइक्लोपायरोन": "bicyclopyrone-ec",
  "एक्यूरॉन": "bicyclopyrone-ec",
  "सिनमिथाइलिन": "cinmethylin-ec",
  "लक्सीमो": "cinmethylin-ec",
  "लक्सिमो": "cinmethylin-ec",
  "टेटफ्लूपीरोलिमेट": "tetflupyrolimet-sc",
  "ट्राईफ्लूडीमॉक्साज़िन": "trifludimoxazin-wg",
  "टायरेक्सोर": "trifludimoxazin-wg",
  "सैफ्लूफेनासिल": "saflufenacil-70-wg",
  "किक्सोर": "saflufenacil-70-wg",
  "इन्डाज़ीफ्लेम": "indaziflam-500-sc",
  "एलियन": "indaziflam-500-sc",
  "साइपायराफ्लूओन": "cypyrafluone-sc",
  "ट्राईपायरासल्फोन": "tripyrasulfone-sc",
  "इपायरीफेनासिल": "epyrifenacil-ec",
  "फेनक्विनोट्रियोन": "fenquinotrione-sc",
  "ईथालफ्लूरालिन": "ethalfluralin-35-4-ec",
  "सोनालान": "ethalfluralin-35-4-ec",
  "अनिलोफॉस": "anilofos-30-ec",
  "ट्राईफ्लूरालिन": "trifluralin-48-ec",
  "एलाक्लोर": "alachlor-50-ec",
  "पैराक्वाट": "paraquat-dichloride-24-sl",
  "पैराक्वॉट": "paraquat-dichloride-24-sl",
  "निकोसेल्फ्यूरॉन": "nicosulfuron-75-wg",

  // New PGRs
  "प्रोहेक्साडायोन": "prohexadione-calcium-wdg",
  "समुद्री शैवाल": "seaweed-amino-acids",
  "प्रोहाइड्रोजैस्मोन": "prohydrojasmon-5-sl",
  "थाइडियाज़्यूरॉन": "thidiazuron-50-wp",
  "ड्रॉप": "thidiazuron-50-wp",
};

const chemBottlePath = 'lib/crops/chemBottle.ts';
let chemBottleContent = fs.readFileSync(chemBottlePath, 'utf8');

const marker = 'const HINDI_AGRI_CHEM_MAP: Record<string, string> = {';
const endMarker = '};\n\n/** Prefer the earliest and longest alias match';

const startIdx = chemBottleContent.indexOf(marker);
const endIdx = chemBottleContent.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not find HINDI_AGRI_CHEM_MAP bounds in chemBottle.ts');
}

const currentObjText = chemBottleContent.substring(startIdx + marker.length, endIdx);
const lines = currentObjText.split('\n');

const currentMap: Record<string, string> = {};
for (const line of lines) {
  const match = line.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
  if (match) {
    currentMap[match[1]] = match[2];
  }
}

for (const [k, v] of Object.entries(newHindiMappings)) {
  currentMap[k] = v;
}

const sortedEntries = Object.entries(currentMap).sort(([a], [b]) => a.localeCompare(b));
const formattedEntries = sortedEntries.map(([k, v]) => `  "${k}": "${v}",`).join('\n');

const newContent =
  chemBottleContent.substring(0, startIdx + marker.length) +
  '\n' +
  formattedEntries +
  '\n' +
  chemBottleContent.substring(endIdx);

fs.writeFileSync(chemBottlePath, newContent, 'utf8');
console.log(`Updated HINDI_AGRI_CHEM_MAP with ${Object.keys(currentMap).length} entries.`);
