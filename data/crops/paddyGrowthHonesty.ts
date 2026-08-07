/**
 * Farmer-facing honesty notes for paddy tillering / "growth tonics" / PGR.
 * Hindi-first copy — no IRAC / product codes in tips.
 */

export type HonestyBlock = {
  id: string;
  titleHi: string;
  titleEn: string;
  bodyHi: string;
  bodyEn: string;
  bulletsHi?: string[];
  bulletsEn?: string[];
};

export const PADDY_GROWTH_HONESTY: {
  headlineHi: string;
  headlineEn: string;
  subHi: string;
  subEn: string;
  blocks: HonestyBlock[];
} = {
  headlineHi: "कल्ले सच में कैसे बढ़ते हैं?",
  headlineEn: "What actually drives tillering?",
  subHi: "धान में — बिना फर्जी बढ़वार टॉनिक के",
  subEn: "Paddy — without miracle growth tonics",
  blocks: [
    {
      id: "drivers",
      titleHi: "कल्ले बढ़ाने वाली असली चीज़ें",
      titleEn: "What really drives tillers",
      bodyHi:
        "कल्ले मुख्य रूप से नाइट्रोजन का सही समय, जिंक की कमी न होना, और शुरुआत में उथला पानी — इन तीनों पर टिके होते हैं। बीज की उम्र और पौध संख्या भी मायने रखती है।",
      bodyEn:
        "Tillering hangs on nitrogen timing, avoiding zinc hunger, and shallow early water. Seedling age and plant population also matter.",
      bulletsHi: [
        "बेसल + कल्ले अवस्था पर नाइट्रोजन — एक साथ पूरी न डालें",
        "जिंक सल्फेट / मिट्टी जाँच — खैरा या रुके पौधे दिखें तो पहले Zn सोचें",
        "रोपाई के बाद 2–3 सेमी उथला पानी; लम्बे समय सूखा या बहुत गहरा पानी कल्ले रोकता है",
        "बहुत पुरानी या घनी पौध → कम फलदायी कल्ले",
      ],
      bulletsEn: [
        "Split nitrogen — basal + tillering; don’t dump all at once",
        "Zinc sulphate / soil test — if khaira or stuck plants, think Zn first",
        "2–3 cm shallow water after transplant; long dry or deep flood slows tillers",
        "Over-aged or overcrowded seedlings → fewer productive tillers",
      ],
    },
    {
      id: "tonic",
      titleHi: "“बढ़वार टॉनिक” अक्सर बेकार क्यों?",
      titleEn: "Why “growth tonic” is usually waste",
      bodyHi:
        "दुकान वाला “बढ़वार / बूस्टर / जैविक टॉनिक” नाम से मिलावट या पानी-सा घोल बेचता है — इसमें न पर्याप्त नाइट्रोजन होती है, न जिंक। कल्ले खेत की उर्वरता और पानी से आते हैं, बोतल से नहीं। पैसा यूरिया-जिंक-पानी प्रबंधन पर लगाना सस्ता और साफ हिसाब है।",
      bodyEn:
        "Shop “growth / booster / organic tonic” bottles are often dilute or filler — not real N or Zn. Tillers come from field nutrition and water, not a miracle bottle. Spend on urea timing, zinc, and water management instead.",
      bulletsHi: [
        "लेबल पर साफ सक्रिय मात्रा न हो तो संदेह करें",
        "“सभी फसलों में चमत्कार” का दावा = लाल झंडा",
        "मिट्टी जाँच + सही यूरिया-समय > कोई भी बेनाम टॉनिक",
      ],
      bulletsEn: [
        "No clear active dose on the label? Be suspicious",
        "“Miracle for every crop” claims = red flag",
        "Soil test + timed urea beats unnamed tonics",
      ],
    },
    {
      id: "pgr",
      titleHi: "PGR / एथेलिफॉन — सिर्फ लेबल सावधानी",
      titleEn: "PGR / ethephon — label-only caution",
      bodyHi:
        "पाक्लोब्यूट्राज़ोल, एथेलिफॉन जैसी PGR दवाएँ कुछ फसल/बागवानी के लेबल पर सीमित उपयोग के लिए आती हैं — धान के कल्ले “जबरदस्ती” बढ़ाने का आम घरेलू नुस्खा नहीं। गलत समय या मात्रा से बाली/दाना बिगड़ सकता है। तभी लें जब लेबल पर धान लिखा हो, खुराक-समय स्पष्ट हो, और स्थानीय अधिकारी/कृषि विभाग सलाह दे।",
      bodyEn:
        "Paclobutrazol, ethephon and similar PGRs are label-limited tools — not a home hack to force paddy tillers. Wrong timing or dose can hurt panicle and grain. Use only if the label covers paddy, dose/timing is clear, and local agronomy advice backs it.",
      bulletsHi: [
        "लेबल पर फसल + खुराक + PHI न दिखे → न डालें",
        "कल्ले कम = पहले N / Zn / पानी जाँचें, PGR नहीं",
        "अधिकारिक सलाह या खेत प्रयोग के बिना स्प्रे न चलाएँ",
      ],
      bulletsEn: [
        "No crop + dose + PHI on label → don’t spray",
        "Few tillers? Check N / Zn / water first — not PGR",
        "Skip spray without official or trial-backed advice",
      ],
    },
  ],
};

export function getPaddyGrowthHonesty() {
  return PADDY_GROWTH_HONESTY;
}
