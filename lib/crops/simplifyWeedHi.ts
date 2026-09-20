/**
 * खरपतवार UI — किसान वाली सरल हिंदी।
 * शुद्ध साहित्यिक नहीं, आधी-अंग्रेज़ी भी नहीं।
 */

function replaceAll(text: string, pairs: [RegExp | string, string][]): string {
  let out = text;
  for (const [from, to] of pairs) {
    out = out.replace(from, to);
  }
  return out;
}

const JARGON: [RegExp | string, string][] = [
  [/Field Doctor Tips?/gi, "खेत की ज़रूरी बातें"],
  [/Field Doctor/gi, "खेत की सलाह"],
  [/Source field observation:?/gi, ""],
  [/Source field message:?/gi, ""],
  [/Source field rule:?/gi, ""],
  [/Source field recommendation:?/gi, ""],
  [/Source warning:?/gi, "सावधान:"],
  [/Source statement:?/gi, ""],
  [/Source description:?/gi, ""],
  [/Source-listed options:?/gi, "विकल्प:"],
  [/Source identify करता है:?/gi, "असल में:"],
  [/Farmer communication point:?/gi, ""],
  [/Farmer mistake:?/gi, "गलती:"],
  [/Farmer mistake/gi, "गलती"],
  [/Described symptom:?/gi, "लक्षण:"],
  [/Critical safety condition from source/gi, "बहुत ज़रूरी सावधानी"],
  [/Alternative source recommendation:?/gi, "बजाय:"],
  [/Weed-management role/gi, ""],
  [/Benefits:?/gi, "फायदा:"],
  [/Purpose/gi, "क्यों"],
  [/Result:?/gi, "नतीजा:"],
  [/Main options:?/gi, "मुख्य उपाय:"],
  [/Prevention:?/gi, "बचाव:"],
  [/Recommendation/gi, "सलाह"],
  [/TIP\s*\d+\s*[—\-–:]+\s*/gi, ""],
  [/\bNO CHEMICAL\b/gi, "दवा न डालें"],
  [/\bNO SPRAY\b/gi, "स्प्रे न करें"],
  [/\bRED ALERT\b/gi, "खतरा"],
  [/\bMAKOY\s*\/\s*SOLANUM NIGRUM\b/gi, "मकोई"],
  [/\bSOLANUM NIGRUM\b/gi, "मकोई"],
  [/\bSolanaceae\b/gi, "टमाटर-बैंगन परिवार"],
  [/\bsame family\b/gi, "एक ही परिवार"],
  [/\bTomato\b/g, "टमाटर"],
  [/\btomato\b/g, "टमाटर"],
  [/\bFLOWERING\b/gi, "फूल आने"],
  [/\bflowers?\b/gi, "फूल"],
  [/\bfruits?\b/gi, "फल"],
  [/\bLabour\b/gi, "मजदूर"],
  [/\bfield recommendation\b/gi, "खेत में यही सही है"],
  [/\bselective herbicide\b/gi, "ऐसी दवा"],
  [/\bherbicide\b/gi, "खरपतवार की दवा"],
  [/\bHerbicide Chemical Injury\b/gi, "दवा से फसल जलना"],
  [/\bHerbicide injury\b/gi, "दवा से नुकसान"],
  [/\bbroadleaf weeds?\b/gi, "चौड़ी पत्ती वाले खरपतवार"],
  [/\bbroadleaf\b/gi, "चौड़ी पत्ती"],
  [/\bgrass control\b/gi, "घास का नियंत्रण"],
  [/\bnarrow leaf weeds?\b/gi, "संकरी पत्ती वाले खरपतवार"],
  [/\bnarrow leaf\b/gi, "संकरी पत्ती"],
  [/\broot establishment\b/gi, "जड़ अच्छी तरह जम जाना"],
  [/\b100% safe\b/gi, "पूरी तरह सुरक्षित"],
  [/\broot से dry\b/gi, "जड़ से सुखा"],
  [/\bweeds को जलाकर खत्म करता है\b/gi, "खरपतवार को जलाकर खत्म करता है"],
  [/\bTomato crop पर\b/gi, "टमाटर पर"],
  [/टमाटर फसल पर/g, "टमाटर पर"],
  [/\bweak \/ yellow\b/gi, "कमजोर / पीला"],
  [/\bSencor\b/gi, "सेंकोर"],
  [/\bgrass(?:es)?\b/gi, "घास"],
  [/\bweed(?:s)?\b/gi, "खरपतवार"],
  [/\bcrop\b/gi, "फसल"],
  [/\bplant(?:s)?\b/gi, "पौधा"],
  [/\bmaize\b/gi, "मक्का"],
  [/\bcotton\b/gi, "कपास"],
  [/\bsoybean\b/gi, "सोयाबीन"],
  [/\bmustard\b/gi, "सरसों"],
  [/\bBanana\b/g, "केला"],
  [/\bGrape\b/g, "अंगूर"],
  [/\bmango\b/gi, "आम"],
  [/\bOnion\b/g, "प्याज"],
  [/\bOkra\b/g, "भिंडी"],
  [/\blegume intercrop\b/gi, "दलहनी अंतरफसल"],
  [/\bintercrop\b/gi, "अंतरफसल"],
  [/\bPre-em(?:ergence)?\b/gi, "उगने से पहले"],
  [/\bpost-emergence\b/gi, "उगने के बाद"],
  [/\bhand weeding\b/gi, "हाथ से निराई"],
  [/\bMechanical Weed Management\b/gi, "कुदाल / मशीन से निराई"],
  [/\bMechanical interculture\b/gi, "कल्टीवेटर / गुड़ाई"],
  [/\bPower weeder\b/gi, "पावर वीडर"],
  [/\bMini rotavator\b/gi, "मिनी रोटावेटर"],
  [/\bplastic mulch\b/gi, "प्लास्टिक मल्च"],
  [/\bMulching\b/gi, "मल्च बिछाना"],
  [/\bmulch\b/gi, "मल्च"],
  [/\bPegs?\b/g, "सूइयाँ"],
  [/\bPEGGING STAGE\b/gi, "सूइयाँ जमीन में जाने का समय"],
  [/\bCURD FORMATION NO-SPRAY RULE\b/gi, "फूल गोभी बनते समय स्प्रे बंद"],
  [/\bcurd\b/gi, "फूल गोभी का सिर"],
  [/\bmarket acceptance\b/gi, "बाजार में भाव"],
  [/\bThrips\b/gi, "थ्रिप्स"],
  [/\bfoliage\b/gi, "पत्तियाँ"],
  [/\brows?\b/gi, "कतारें"],
  [/\bfruit size\b/gi, "फल का आकार"],
  [/\bcrop growth improve\b/gi, "फसल की बढ़वार अच्छी"],
  [/\bnatural waxy cuticle\b/gi, "पत्तों पर प्राकृतिक चिकनाई"],
  [/\bpenetrate\b/gi, "अंदर घुस"],
  [/\bleaves\b/gi, "पत्तियाँ"],
  [/\bbulb\b/gi, "गाँठ / कंद"],
  [/\bsowing\b/gi, "बुवाई"],
  [/\brhizome rot\b/gi, "गाँठ सड़ना"],
  [/\bweed suppression\b/gi, "खरपतवार दबना"],
  [/\bsuppression\b/gi, "दबना"],
  [/\byear old\b/gi, "साल के"],
  [/\bmain trunk\b/gi, "मुख्य तना"],
  [/\bgreen\/tender\b/gi, "हरा और कोमल"],
  [/\bsystemic uptake\b/gi, "दवा जड़ तक पहुँचना"],
  [/\bpollinators?\b/gi, "मधुमक्खी जैसे परागण वाले कीट"],
  [/\bhoney bees?\b/gi, "मधुमक्खी"],
  [/\bhouse flies?\b/gi, "मक्खी"],
  [/\bpollination\b/gi, "परागण"],
  [/\bfruit set\b/gi, "फल लगना"],
  [/\bpseudostem\b/gi, "तना"],
  [/\bsuckers?\b/gi, "पुत्तियाँ"],
  [/\bHeart-rot\b/gi, "दिल सड़ना"],
  [/\bleaf deformation\b/gi, "पत्ती टेढ़ी"],
  [/\bbunch fail\b/gi, "घार नहीं निकलना"],
  [/\bGreen manure\b/gi, "हरी खाद"],
  [/\bSoil cover\b/gi, "मिट्टी ढकना"],
  [/\bLow-cost\b/gi, "सस्ता"],
  [/\bvapour drift\b/gi, "भाप / हवा से दवा उड़ना"],
  [/\bFan-shaped leaves\b/gi, "पंखा जैसी पत्तियाँ"],
  [/\bvine injury\b/gi, "बेल को नुकसान"],
  [/\bfruiting\b/gi, "फल आना"],
  [/\bPruning\b/gi, "छंटाई"],
  [/\bfresh cuts?\b/gi, "ताज़ा कट"],
  [/\bopen wounds?\b/gi, "खुले घाव"],
  [/\bsystemic\b/gi, "जड़ तक जाने वाली"],
  [/\bUI alert:?/gi, "अलर्ट:"],
  [/\bvarieties:?/gi, "किस्में:"],
  [/\bSoil-specific warning/gi, "मिट्टी वाली सावधानी"],
  [/\binfestation\b/gi, "खरपतवार ज्यादा"],
  [/\bsafe chemical control\b/gi, "सुरक्षित दवा"],
  [/\beffectively\b/gi, "अच्छी तरह"],
  [/\beffectiveness\b/gi, "असर"],
  [/\bgrowth\b/gi, "बढ़वार"],
  [/\bcontrol\b/gi, "नियंत्रण"],
  [/\bsensitive\b/gi, "संवेदनशील"],
  [/\bdrift\b/gi, "उड़कर"],
  [/\bhood\b/gi, "ढक्कन"],
  [/\bsafety cover\b/gi, "सुरक्षा ढक्कन"],
  [/\bBrand:?/gi, "ब्रांड:"],
  [/\bSpray:?/gi, "स्प्रे:"],
  [/\bSpray\b/g, "स्प्रे"],
  [/\bspray\b/g, "स्प्रे"],
  [/\bavoid करें\b/gi, "न डालें"],
  [/\bavoid\b/gi, "बचें"],
  [/\bideally\b/gi, "सबसे अच्छा"],
  [/\bpreferred field approach\b/gi, "खेत में यही बेहतर"],
  [/\bstanding crop\b/gi, "खड़ी फसल"],
  [/\bchemical risk\b/gi, "दवा का खतरा"],
  [/\bchemical smell\/droplets\b/gi, "दवा की गंध / बूँदें"],
  [/\bchemical activity\b/gi, "दवा का असर"],
  [/\bChemical\b/g, "दवा"],
  [/\bchemical\b/g, "दवा"],
  [/\bhard\/stunted\b/gi, "कठोर / छोटा रह जाना"],
  [/\bmain stem\b/gi, "मुख्य तना"],
  [/\bfruit soil contact\/rot\b/gi, "फल मिट्टी से लगना / सड़ना"],
  [/\bfruit soil contact\b/gi, "फल का मिट्टी से लगना"],
  [/\brot\b/gi, "सड़ना"],
  [/\bBed पर\b/gi, "क्यारी पर"],
  [/\bBed\b/g, "क्यारी"],
  [/\bDIRECTED\s*\/\s*HOODED SPRAY\b/gi, "ढक्कन लगाकर निर्देशित स्प्रे"],
  [/\bDIRECTED SPRAY\b/gi, "निर्देशित स्प्रे"],
  [/\bTRASH MULCHING\b/gi, "सूखी पत्ती की मल्च"],
  [/\bSEMPRA ACTION\b/gi, "सेंप्रा कैसे काम करती है"],
  [/\bBLEACHING ACTION\b/gi, "खरपतवार सफेद क्यों दिखते हैं"],
  [/\bMAIZE \+ PULSE INTERCROPPING\b/gi, "मक्का + दलहन एक साथ"],
  [/\bTANK MIXING WARNING\b/gi, "दूसरी दवा साथ न मिलाएँ"],
  [/\bNominee Gold application mistake\b/gi, "Nominee Gold की आम गलती"],
  [/\b2,4-D SAFETY\b/gi, "2,4-D की सावधानी"],
  [/\b2,4-D \+ GLYPHOSATE CAUTION\b/gi, "2,4-D और राउंडअप से सावधान"],
  [/\bSENCOR VARIETY SENSITIVITY\b/gi, "सेंकोर — किस्म की संवेदनशीलता"],
  [/\bEARTHING-UP \+ WEED MANAGEMENT\b/gi, "मिट्टी चढ़ाना और खरपतवार"],
  [/\bBROADLEAF HERBICIDE WARNING\b/gi, "चौड़ी पत्ती की दवा — सावधानी"],
  [/\bPYAJI \/ WILD ONION\b/gi, "प्याजी / जंगली प्याज"],
  [/\bKENA \/ COMMELINA\b/gi, "कनकौआ / केना"],
  [/\bYOUNG MANGO TREE \+ GLYPHOSATE RISK\b/gi, "नए आम के पेड़ पर ग्लाइफोसेट खतरा"],
  [/\bSAFER YOUNG TREE BASIN PRACTICE\b/gi, "नए पेड़ के थाले की सुरक्षित सफाई"],
  [/\bMANGO BLOOM NO-SPRAY\b/gi, "बौर खिलते समय स्प्रे बंद"],
  [/\bGLYPHOSATE RED ALERT\b/gi, "केले में ग्लाइफोसेट मत डालें"],
  [/\bLIVE MULCHING\b/gi, "जीवित मल्च (लोबिया / सनई)"],
  [/\bGRAPE PRUNING WOUND WARNING\b/gi, "छंटाई के घाव पर दवा न डालें"],
  [/\bDEW \/ RAIN WARNING\b/gi, "ओस / बारिश के बाद स्प्रे न करें"],
  [/\bBULB FORMATION NO-SPRAY\b/gi, "गाँठ बनते समय Goal न डालें"],
  [/\bLEAF MULCHING\b/gi, "पत्तों / पुआल की मल्च"],
  [/\bMULCHING IS THE PRIMARY DOCTOR\b/gi, "सबसे अच्छा उपाय — मल्च"],
  [/\bImazethapyr response\b/gi, "पर्स्यूट के बाद हल्का पीलापन"],
  [/20 साल का फील्ड अनुभव[·•\s]*/gi, ""],
  [/90% farmers?/gi, "ज्यादातर किसान"],
  [/\beffectively नहीं मरती\b/gi, "अच्छी तरह नहीं मरती"],
  [/\bside effect\b/gi, "नुकसान"],
  [/\bField condition:?/gi, "खेत की हालत:"],
  [/\*\s*/g, ""],
  [/\s{2,}/g, " "],
  [/·\s*·/g, "·"],
];

/** एक लाइन / पैरा — किसान हिंदी */
export function farmerWeedHi(text: string): string {
  if (!text?.trim()) return "";
  let t = text.trim();
  t = replaceAll(t, JARGON);
  // Clean leftover English section leftovers
  t = t
    .replace(/\b(Source|Farmer|Result|Benefits|Purpose|Prevention)\b:?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[:\-–—·•]+\s*/, "")
    .trim();
  return t;
}

/** टिप शीर्षक */
export function farmerWeedTipTitleHi(title: string): string {
  return farmerWeedHi(title)
    .replace(/^TIP\s*\d+\s*/i, "")
    .trim();
}

/** टिप पॉइंट्स — खाली / सिर्फ अंग्रेज़ी हेडर हटाएँ */
export function farmerWeedTipPointsHi(points: string[]): string[] {
  return points
    .map((p) => farmerWeedHi(p))
    .map((p) => p.replace(/^\d+\.\s*/, "").trim())
    .filter((p) => p.length > 1 && !/^(Source|Farmer|Result|Benefits|TIP)/i.test(p));
}

/** लक्ष्य सूची लेबल — निशाना नहीं */
export function weedTargetsLabelHi(): string {
  return "खरपतवार";
}
