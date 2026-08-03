/**
 * Post-process machine translations: fix corrupted Latin names, mixed EN-HI, known errors.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const EXACT = {
  "धान/धान": "धान / चावल",
  "Paddy / Dhaan": "धान / चावल",
  "Zinc sulphate 21% + टेम्पलेट का पत्ता": "Zinc sulphate 21% + lime (पत्ती छिड़काव)",
  "Zinc sulphate 21% + नींबू का पत्ता": "Zinc sulphate 21% + lime (पत्ती छिड़काव)",
  "वर्कहॉर्स पोस्ट-एम; फिर छान लें": "मुख्य पोस्ट-इमर्जेंस; 2 दिन बाद पानी निकालें, फिर फिर से भरें",
  "The workhorse post-em; drain then re-flood after 2 days": "मुख्य पोस्ट-इमर्जेंस; 2 दिन बाद पानी निकालें, फिर फिर से भरें",
  "स्वस्थ प्रतिस्पर्धी फसल स्टैंड": "स्वस्थ, घनी फसल खड़ी",
  "Healthy competitive crop stand": "स्वस्थ, घनी फसल खड़ी",
  "स्काउट weed flush at 15 & 30 DAT; शाकनाशी चुनने के लिए घास बनाम सेज बनाम BLW की पहचान करें":
    "15 और 30 DAT पर खरपतवार की फ्लश जाँचें; शाकनाशी चुनने के लिए घास, नरस और चौड़ी पत्ती अलग पहचानें",
  "Scout weed flush at 15 & 30 DAT; identify grass vs sedge vs BLW to pick herbicide":
    "15 और 30 DAT पर खरपतवार की फ्लश जाँचें; शाकनाशी चुनने के लिए घास, नरस और चौड़ी पत्ती अलग पहचानें",
  "रोटरी/कोनो-weeder at 20 & 40 DAT अधिक दूरी में":
    "20 और 40 DAT पर रोटरी/कोनो-वीडर (चौड़ी दूरी पर)",
  "Rotary/cono-weeder at 20 & 40 DAT in wider spacing":
    "20 और 40 DAT पर रोटरी/कोनो-वीडर (चौड़ी दूरी पर)",
  "कांस्य/जंग लगे धब्बे on lower leaves 2-3 wk प्रत्यारोपण के बाद, बौनापन, देर से कल्ले फूटना":
    "रोपाई के 2-3 सप्ताह बाद निचली पत्तियों पर कांस्य/जंग जैसे धब्बे, बौना पौध, देर से कल्ले",
  "Bronze/rusty spots on lower leaves 2-3 wk after transplant, stunting, delayed tillering":
    "रोपाई के 2-3 सप्ताह बाद निचली पत्तियों पर कांस्य/जंग जैसे धब्बे, बौना पौध, देर से कल्ले",
  "ब्रोंजिंग देखें on lower leaves 15-20 DAT":
    "15-20 DAT पर निचली पत्तियों पर कांस्य रंग देखें",
  "Watch bronzing on lower leaves 15-20 DAT":
    "15-20 DAT पर निचली पत्तियों पर कांस्य रंग देखें",
  "लक्षणों पर, 10 days दोहराएँ": "लक्षण दिखने पर, 10 दिन बाद दोहराएँ",
  "on symptoms, repeat 10 days": "लक्षण दिखने पर, 10 दिन बाद दोहराएँ",
  "1 kg ZnSO4 + 0.5 kg lime in 200 L/acre": "1 kg ZnSO4 + 0.5 kg lime, 200 L/acre पानी में",
  "for the first 30  से 40 days": "पहले 30 से 40 दिन",
  "for the first 30 to 40 days": "पहले 30 से 40 दिन",
  "rainfall of about 600-1000": "लगभग 600-1000 mm वर्षा",
  "pH about 6.0-7.5": "pH लगभग 6.0-7.5",
  "plant spacing about 5-7 सेमी.": "पंक्ति में पौधे 5-7 cm दूरी",
  "Plant-to-plant spacing about 5-7 cm within row.": "पंक्ति में पौधे 5-7 cm दूरी",
  "एक deep ploughing and 2-3 हैरोविंग के साथ एक बढ़िया, दृढ़ और समतल बीज क्यारी तैयार करें।":
    "एक गहरी जुताई और 2-3 बखरों से बारीक, सख्त और समतल बीज क्यारी तैयार करें।",
  "Prepare a fine, firm and level seedbed with one deep ploughing and 2-3 harrowings.":
    "एक गहरी जुताई और 2-3 बखरों से बारीक, सख्त और समतल बीज क्यारी तैयार करें।",
  "mid-June से early July": "मध्य जून से शुरुआती जुलाई",
  "generally mid-June to early July": "आमतौर पर मध्य जून से शुरुआती जुलाई",
  "can यहां प्रकाश संश्लेषण को बुरी तरह से बाधित करते हैं":
    "यहाँ प्रकाश संश्लेषण बुरी तरह घटा सकते हैं",
  "Defoliators, girdle beetle and rust can cut photosynthesis badly here.":
    "पत्ती खाने वाले, गर्डल बीटल और रतुआ यहाँ प्रकाश संश्लेषण बुरी तरह घटा सकते हैं",
  "Hand weeding at 20 & 40 DAS": "20 और 40 DAS पर हाथ से निराई",
  "एक hand weeding at 30 DAS": "30 DAS पर एक बार हाथ से निराई",
  "One hand weeding at 30 DAS": "30 DAS पर एक बार हाथ से निराई",
  "Earthing up at 25 DAS": "25 DAS पर मेड़ चढ़ाना",
  "Interculture at 45 & 90 DAP": "45 और 90 DAP पर मेड़-निराई",
  "Hand weeding at 25 DAS": "25 DAS पर हाथ से निराई",
  "Stale seedbed, puddling before transplant": "बासी बीज क्यारी, रोपाई से पहले खेत पोखर",
  "Maintain 5 cm standing water": "5 cm पानी खड़ा रखें",
  "Deep ploughing, clean seed": "गहरी जुताई, साफ बीज",
  "Crop rotation with legumes": "दलहनी फसलों के साथ crop rotation",
  "Interculture at knee-high stage": "घुटने-ऊँचाई पर मेड़-निराई",
  "Deep summer ploughing": "गर्मी में गहरी जुताई",
  "Line sowing for inter-row cultivation": "पंक्ति बुवाई से मेड़-निराई",
  "Stale seedbed technique": "बासी बीज क्यारी विधि",
  "Competitive crop density": "घनी फसल खड़ी",
  "Earthing up covers small weeds": "मेड़ चढ़ाने से छोटे खरपतवार दब जाते हैं",
  "Mulching between rows": "पंक्तियों के बीच मल्च",
  "Black plastic mulch": "काली प्लास्टिक मल्च",
  "Raised bed, drip irrigation": "ऊँची क्यारी, ड्रिप सिंचाई",
  "Interculture with hoe": "कुदाल से मेड़-निराई",
  "Stale seedbed before transplant": "रोपाई से पहले बासी बीज क्यारी",
  "Mulching, shallow cultivation": "मल्च, उथली जुताई",
  "Nursery weed-free transplant": "नर्सरी साफ रखकर रोपाई",
  "Summer fallow": "गर्मी में खेत खाली रखना",
  "Raised beds with plastic mulch": "प्लास्टिक मल्च वाली ऊँची क्यारी",
  "Drip + mulching": "ड्रिप + मल्च",
  "Stale seedbed": "बासी बीज क्यारी",
  "Deep summer ploughing": "गर्मी में गहरी जुताई",
  "Narrow row spacing": "संकीर्ण पंक्ति दूरी",
  "Summer ploughing": "गर्मी में जुताई",
  "Clean seed, crop rotation": "साफ बीज, फसल चक्र",
  "Line sowing, early vigour varieties": "पंक्ति बुवाई, जल्दी उगने वाली किस्में",
  "Intercropping, basin mulching": "अंतःफसल, बेसिन में मल्च",
  "Black polythene mulching in basin": "बेसिन में काली पॉलिथीन मल्च",
  "Clean cultivation in orchard floor": "बाग में साफ खेत",
  "Polythene mulch in pits": "गड्ढों में पॉलिथीन मल्च",
  "Dried leaf mulch": "सूखी पत्ती मल्च",
  "Cover cropping between rows": "पंक्तियों के बीच cover crop",
  "Weed mat / live mulch": "वीड मैट / जीवित मल्च",
  "Plastic mulch under vines": "बेलों के नीचे प्लास्टिक मल्च",
  "Inter-row cover crop": "पंक्तियों के बीच cover crop",
  "Trash mulching, earthing up": "परali मल्च, मेड़ चढ़ाना",
  "Trash blanket suppresses weeds": "परali की परत खरपतवार दबाती है",
  "Hoeing at squaring": "कली बनने पर कुदाल",
  "Crop rotation with cereals": "अनाज फसलों के साथ crop rotation",
  "Glyphosate shielded inter-row": "Glyphosate ढककर पंक्तियों के बीच",
  "Hand weeding in basins": "बेसिन में हाथ से निराई",
  "Manual clean pits": "गड्ढे साफ रखें",
  "Inter-row tillage": "पंक्तियों के बीच जुताई",
  "Slashing": "काट-छाँट",
  "Mowing between rows": "पंक्तियों के बीच काटना",
  "Hand removal in basins": "बेसिन में हाथ से हटाएँ",
  "Manual before seed set": "बीज बनने से पहले हाथ से हटाएँ",
  "Slashing + mulching": "काट-छाँट + मल्च",
  "Mowing / hand pulling": "काटना / हाथ से उखाड़ना",
  "Manual removal before tuber formation": "कंद बनने से पहले हाथ से हटाएँ",
  "Manual removal before flowering": "फूल आने से पहले हाथ से हटाएँ",
  "Manual removal": "हाथ से हटाएँ",
  "Hand weeding + mulching": "हाथ से निराई + मल्च",
  "Hand weeding + plastic mulch": "हाथ से निराई + प्लास्टिक मल्च",
  "Interculture between rows": "पंक्तियों के बीच मेड़-निराई",
  "Interculture + hand weeding": "मेड़-निराई + हाथ से निराई",
  "Directed glyphosate between rows": "पंक्तियों के बीच ढककर Glyphosate",
  "Glyphosate shielded spray": "Glyphosate ढककर छिड़काव",
  "Glyphosate directed spray": "Glyphosate ढककर छिड़काव",
  "Glyphosate in basin (dormant)": "बेसिन में Glyphosate (सुस्त अवस्था)",
  "Glyphosate directed spray": "Glyphosate ढककर छिड़काव",
  "Glyphosate shielded": "Glyphosate ढककर",
  "Glyphosate before planting": "लगाने से पहले Glyphosate",
};

const KEY_WEEDS_HI = {
  "Echinochloa crus-galli/colona (sawank, grassy)": "Echinochloa crus-galli/colona (सांवा, घास)",
  "Cyperus rotundus/difformis (motha, sedge)": "Cyperus rotundus/difformis (मोथा, नरस)",
  "Ammania, Monochoria, Ludwigia (broadleaf)": "Ammania, Monochoria, Ludwigia (चौड़ी पत्ती)",
};

const PHRASE = [
  [/\bworkhorse\b/gi, "मुख्य"],
  [/\bpost-em\b/gi, "पोस्ट-इमर्जेंस"],
  [/\bpre-em\b/gi, "प्री-इमर्जेंस"],
  [/\blower leaves\b/gi, "निचली पत्तियाँ"],
  [/\bon lower leaves\b/gi, "निचली पत्तियों पर"],
  [/\bstanding water\b/gi, "खड़ा पानी"],
  [/\bwaterlogging\b/gi, "जलभराव"],
  [/\bweed flush\b/gi, "खरपतवार की फ्लश"],
  [/\bhand weeding\b/gi, "हाथ से निराई"],
  [/\bearthing up\b/gi, "मेड़ चढ़ाना"],
  [/\binterculture\b/gi, "मेड़-निराई"],
  [/\bdeep ploughing\b/gi, "गहरी जुताई"],
  [/\bharrowing\b/gi, "बखर"],
  [/\bseedbed\b/gi, "बीज क्यारी"],
  [/\bdefoliator(s)?\b/gi, "पत्ती खाने वाले"],
  [/\bgirdle beetle\b/gi, "गर्डल बीटल"],
  [/\bwhitefly\b/gi, "सफेद मक्खी"],
  [/\bvector\b/gi, "वाहक"],
  [/\bMoA\b/g, "MoA"],
  [/\brotate\b/gi, "घुमाएँ"],
  [/\bevening spray\b/gi, "शाम का छिड़काव"],
  [/\bboot leaf\b/gi, "बूट लीफ"],
  [/\bat first symptom\b/gi, "पहले लक्षण पर"],
  [/\bseed treatment\b/gi, "बीज उपचार"],
  [/\blight traps\b/gi, "प्रकाश जाल"],
  [/\bresistant varieties\b/gi, "प्रतिरोधी किस्में"],
  [/\bsoil solarization\b/gi, "मिट्टी सौरीकरण"],
  [/\bresistant hybrids\b/gi, "प्रतिरोधी संकर"],
  [/\bfield sanitation\b/gi, "खेत सफाई"],
  [/\bprophylactic spray\b/gi, "रोकथाम छिड़काव"],
  [/\bseed tuber treatment\b/gi, "बीज कंद उपचार"],
  [/\bbefore rains\b/gi, "बारिश से पहले"],
  [/\byellow sticky traps\b/gi, "पीले चिपचिपे जाल"],
  [/\bsoil drench\b/gi, "मिट्टी डrench"],
  [/\bdead-heart stage\b/gi, "डेड-हार्ट अवस्था"],
  [/\bremove infected heads\b/gi, "संक्रमित बालियाँ हटाएँ"],
  [/\bspray before flowering\b/gi, "फूल आने से पहले छिड़काव"],
  [/\brogue infected plants\b/gi, "संक्रमित पौधे उखाड़ें"],
  [/\bprune infected twigs\b/gi, "संक्रमित टहनियाँ काटें"],
  [/\bbt cotton\b/gi, "Bt cotton"],
  [/\bpheromone traps\b/gi, "फेरोमोन जाल"],
  [/\bacid-delinted seed\b/gi, "अम्ल-डिलिंटेड बीज"],
  [/\bhot water sett treatment\b/gi, "गर्म पानी से बीज उपचार"],
  [/\bremove whips\b/gi, "झाड़ियाँ हटाएँ"],
  [/\brogue infected clumps\b/gi, "संक्रमित गुच्छे उखाड़ें"],
  [/\bvector control\b/gi, "वाहक नियंत्रण"],
  [/\bremove girdled plants\b/gi, "कटे पौधे हटाएँ"],
  [/\bhand picking larvae\b/gi, "इल्लियाँ हाथ से उठाएँ"],
  [/\bcrop rotation\b/gi, "फसल चक्र"],
  [/\bavoid late sowing\b/gi, "देर से बुवाई से बचें"],
  [/\bavoid drift\b/gi, "ड्रिफ्ट से बचें"],
  [/\bconsecutively\b/gi, "लगातार"],
  [/\bdo not repeat\b/gi, "दोहराएँ नहीं"],
  [/\bseed dip\b/gi, "बीज डुबोना"],
  [/\bbulb dip\b/gi, "कंद डुबोना"],
  [/\bsett dip\b/gi, "बीज डुबोना"],
  [/\bsett treatment\b/gi, "बीज उपचार"],
  [/\bbagging bunches\b/gi, "गुच्छे ढकना"],
  [/\btrunk banding\b/gi, "तने पर बैंड"],
  [/\bbait spray\b/gi, "प्रलोभन छिड़काव"],
  [/\bpanicle emergence\b/gi, "बाली निकलना"],
  [/\bberry touch\b/gi, "दाने छूने"],
  [/\bafter pruning\b/gi, "छँटाई के बाद"],
  [/\bpre-monsoon\b/gi, "पूर्व-मानसून"],
  [/\bmonsoon flush\b/gi, "मानसूनी फ्लश"],
  [/\byear-round\b/gi, "सालभर"],
  [/\brainy season\b/gi, "बारिश का मौसम"],
  [/\bgrand growth\b/gi, "तेज़ वृद्धि अवस्था"],
  [/\bknee-high\b/gi, "घुटने-ऊँचाई"],
  [/\btasseling\b/gi, "अन्वल"],
  [/\bgrand Naine\b/gi, "Grand Naine"],
  [/\bearly growth\b/gi, "शुरुआती वृद्धि"],
  [/\bany stage\b/gi, "किसी भी अवस्था"],
  [/\bdry weather\b/gi, "सूखा मौसम"],
  [/\bnew flush\b/gi, "नई पत्तियाँ"],
  [/\bstorage\b/gi, "भंडारण"],
  [/\btuber bulking\b/gi, "कंद भरना"],
  [/\btuber formation\b/gi, "कंद बनना"],
  [/\bbulb formation\b/gi, "कंद बनना"],
  [/\bbulb development\b/gi, "कंद विकास"],
  [/\bfruiting\b/gi, "फल लगना"],
  [/\bflowering\b/gi, "फूल आना"],
  [/\bflowering–fruiting\b/gi, "फूल-फल"],
  [/\bvegetative\b/gi, "वनस्पति"],
  [/\bvegetative–fruiting\b/gi, "वनस्पति-फल"],
  [/\btillering\b/gi, "कल्ले"],
  [/\btillering–heading\b/gi, "कल्ले-बाली"],
  [/\bheading\b/gi, "बाली"],
  [/\bseedling\b/gi, "अंकुर"],
  [/\bpanicle initiation\b/gi, "बाली आरंभ"],
  [/\bmax tillering\b/gi, "अधिकतम कल्ले"],
  [/\bgrain fill(ing)?\b/gi, "दाना भरना"],
  [/\bgrain filling\b/gi, "दाना भरना"],
  [/\bsquare formation\b/gi, "कली बनना"],
  [/\bsquare–boll\b/gi, "कली-रुई"],
  [/\bboll development\b/gi, "रुई गाँठ"],
  [/\bgermination\b/gi, "अंकुरण"],
  [/\bgrand growth\b/gi, "तेज़ वृद्धि"],
  [/\bvegetative–PI\b/gi, "वनस्पति-बाली आरंभ"],
  [/\bvegetative–fruiting\b/gi, "वनस्पति-फल"],
  [/\bflowering–fruiting\b/gi, "फूल-फल"],
  [/\bearly growth\b/gi, "शुरुआती वृद्धि"],
  [/\bany stage\b/gi, "किसी भी अवस्था"],
  [/\bKharif\b/g, "खरीफ"],
  [/\bRabi\b/g, "रबी"],
  [/\bZaid\b/g, "ज़ायद"],
  [/\bstand\b/gi, "खड़ी"],
  [/\bnodulation\b/gi, "गांठ"],
  [/\blodging\b/gi, "लोडging"],
  [/\bshattering\b/gi, "बिखरना"],
  [/\byield\b/gi, "उपज"],
  [/\bscouting\b/gi, "जाँच"],
  [/\bscout\b/gi, "जाँच"],
  [/\bdrainage\b/gi, "जल निकास"],
  [/\bmulch(ing)?\b/gi, "मल्च"],
  [/\bintercrop\b/gi, "अंतःफसल"],
  [/\bcover crop\b/gi, "कवर crop"],
  [/\bFYM\b/g, "FYM"],
  [/\bBBF\b/g, "BBF"],
  [/\bPoP\b/g, "PoP"],
  [/\bMSP\b/g, "MSP"],
  [/\bETL\b/g, "ETL"],
  [/\bPHI\b/g, "PHI"],
  [/\bBLW\b/g, "BLW"],
  [/\bYMV\b/g, "YMV"],
  [/\bDSR\b/g, "DSR"],
  [/\bDAT\b/g, "DAT"],
  [/\bDAS\b/g, "DAS"],
  [/\bDAP\b/g, "DAP"],
  [/\bPE\b/g, "PE"],
  [/\bEPoE\b/g, "EPoE"],
  [/\bPoE\b/g, "PoE"],
  [/\bMoA\b/g, "MoA"],
  [/\bHRAC\b/g, "HRAC"],
  [/\bIRAC\b/g, "IRAC"],
  [/\bFRAC\b/g, "FRAC"],
  [/\bZn\b/g, "Zn"],
  [/\bpH\b/g, "pH"],
  [/\bEC\b/g, "EC"],
];

function fixString(s) {
  if (typeof s !== "string") return s;
  if (EXACT[s]) return EXACT[s];
  let out = s;
  for (const [re, rep] of PHRASE) out = out.replace(re, rep);
  return out;
}

function walkFix(node) {
  if (typeof node === "string") return fixString(node);
  if (Array.isArray(node)) return node.map(walkFix);
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "keyWeeds" && Array.isArray(v)) {
        out[k] = v.map((item) => KEY_WEEDS_HI[item] ?? fixString(item));
      } else {
        out[k] = walkFix(v);
      }
    }
    return out;
  }
  return node;
}

function restoreKeyWeedsFromGit() {
  const origPath = path.join(ROOT, "data/imports/agriveda-weeds-abiotic-batch.json");
  let orig;
  try {
    const raw = execSync("git show HEAD:data/imports/agriveda-weeds-abiotic-batch.json", {
      cwd: ROOT,
      encoding: "utf8",
    });
    orig = JSON.parse(raw);
  } catch {
    return null;
  }
  const cur = JSON.parse(fs.readFileSync(origPath, "utf8"));
  orig.crops.forEach((oc, i) => {
    if (!cur.crops[i]?.weeds?.keyWeeds || !oc.weeds?.keyWeeds) return;
    cur.crops[i].weeds.keyWeeds = oc.weeds.keyWeeds.map((kw) => {
      const hi = KEY_WEEDS_HI[kw];
      if (hi) return hi;
      return kw.replace(/\(([^)]+)\)/, (_, inner) => {
        const map = {
          "sawank, grassy": "सांवा, घास",
          "motha, sedge": "मोथा, नरस",
          broadleaf: "चौड़ी पत्ती",
          "broadleaf only": "केवल चौड़ी पत्ती",
          grassy: "घास",
          sedge: "नरस",
          "grasses": "घास",
          "grass+BLW": "घास+चौड़ी पत्ती",
        };
        const parts = inner.split(/,\s*/).map((p) => map[p.trim()] ?? p.trim());
        return `(${parts.join(", ")})`;
      });
    });
  });
  return cur;
}

function fixPestDisease() {
  const abs = path.join(ROOT, "data/pest-disease.ts");
  let src = fs.readFileSync(abs, "utf8");
  for (const [en, hi] of Object.entries(EXACT)) {
    if (src.includes(`"${en}"`)) {
      src = src.split(`"${en}"`).join(`"${hi.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
    }
  }
  src = src.replace(/(control|culturalControl|stage):\s*"((?:\\.|[^"\\])*)"/g, (m, key, val) => {
    const raw = val.replace(/\\"/g, '"');
    const fixed = fixString(raw);
    if (fixed === raw) return m;
    return `${key}: "${fixed.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  });
  fs.writeFileSync(abs, src, "utf8");
}

function main() {
  const weedsPath = path.join(ROOT, "data/imports/agriveda-weeds-abiotic-batch.json");
  const batch2Path = path.join(ROOT, "data/imports/agriveda-batch-2-priority-crops.json");

  let weeds = restoreKeyWeedsFromGit() ?? walkFix(JSON.parse(fs.readFileSync(weedsPath, "utf8")));
  weeds = walkFix(weeds);
  fs.writeFileSync(weedsPath, JSON.stringify(weeds, null, 2) + "\n", "utf8");
  JSON.parse(fs.readFileSync(weedsPath, "utf8"));
  console.log("weeds-abiotic: cleaned, JSON.parse OK");

  const batch2 = walkFix(JSON.parse(fs.readFileSync(batch2Path, "utf8")));
  fs.writeFileSync(batch2Path, JSON.stringify(batch2, null, 2) + "\n", "utf8");
  JSON.parse(fs.readFileSync(batch2Path, "utf8"));
  console.log("batch-2: cleaned, JSON.parse OK");

  fixPestDisease();
  console.log("pest-disease.ts: cleaned");
}

main();
