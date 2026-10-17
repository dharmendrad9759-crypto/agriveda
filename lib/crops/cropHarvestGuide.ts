import type { Crop } from "@/types/crop";
import { harvestActionForCrop } from "./harvestLabel";

export interface HarvestStepGuide {
  id: string;
  badgeHi: string;
  badgeEn: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  pointsHi: string[];
  pointsEn: string[];
  alertHi?: string;
  alertEn?: string;
  iconType: "check" | "shovel" | "sun" | "storage";
}

export interface DetailedHarvestProtocol {
  leadTitleHi: string;
  leadTitleEn: string;
  timingRuleHi: string;
  timingRuleEn: string;
  steps: HarvestStepGuide[];
}

export function getCropHarvestProtocol(
  crop: Pick<Crop, "slug" | "category" | "name" | "harvestAndYield">,
  hi: boolean
): DetailedHarvestProtocol {
  const slug = crop.slug.toLowerCase();
  const action = harvestActionForCrop(crop);

  // 1. GROUNDNUT / MOONGFALI / PEANUT
  if (slug === "moongfali" || slug === "groundnut" || slug === "peanut") {
    return {
      leadTitleHi: "मूंगफली खुदाई व सुरक्षित भंडारण का सही तरीका",
      leadTitleEn: "Groundnut Digging & Safe Storage Protocol",
      timingRuleHi: "बुवाई के 105–120 दिन बाद (किस्म अनुसार जब 75–80% फलियां पक जाएं)",
      timingRuleEn: "105–120 days after sowing (when 75–80% pods mature)",
      steps: [
        {
          id: "maturity",
          badgeHi: "कदम 1 · असली पहचान",
          badgeEn: "Step 1 · Maturity Check",
          titleHi: "पक्की फली की असली पहचान (भीतरी छिलके की जांच)",
          titleEn: "Pod Maturity Check (Inner Shell Color)",
          subtitleHi: "सिर्फ पत्तों के पीले होने पर न जाएं, फली खोलकर देखें",
          subtitleEn: "Inspect inner shell color before digging",
          pointsHi: [
            "खेत के अलग-अलग कोनों से 4-5 पौधे उखाड़कर 15–20 फलियों को छीलें।",
            "अंदरूनी छिलका कत्थई या काला: यदि फली के भीतरी खोल का रंग गहरा भूरा/काला हो चुका है, तो फली पूरी तरह पक चुकी है।",
            "दाना पूरा भरा हुआ: दाना छिलके से चिपका न हो और बीज का छिलका अपनी किस्म का असली रंग (गुलाबी/लाल) ले चुका हो।",
            "निर्णय: यदि 75% से अधिक फलियों का भीतरी छिलका काला/कत्थई हो, तो तुरंत खुदाई शुरू करें।",
          ],
          pointsEn: [
            "Sample 4-5 plants across the field and crack open 15–20 pods.",
            "Inner shell color: Dark brown or blackish inner lining confirms physiological maturity.",
            "Kernel plumpness: Kernels should be fully developed and separate easily from the shell.",
            "Decision: Begin harvest when 75% or more pods show dark inner shell coloration.",
          ],
          alertHi: "अपरिपक्व (कच्ची) फलियों में भीतरी छिलका सफेद रहता है, ऐसी फलियों में तेल कम और सिकुड़न ज्यादा होती है।",
          alertEn: "Immature pods have white inner shells, resulting in low oil content and shriveled seeds.",
          iconType: "check",
        },
        {
          id: "soil-check",
          badgeHi: "कदम 2 · खुदाई का नियम",
          badgeEn: "Step 2 · Digging Method",
          titleHi: "मिट्टी में नमी की जांच (फलियां जमीन में टूटने से बचाएं)",
          titleEn: "Soil Moisture Check Prior to Digging",
          subtitleHi: "सख्त मिट्टी में कभी न खींचें, पेग टूटने का खतरा",
          subtitleEn: "Ensure workable moisture to avoid peg snapping",
          pointsHi: [
            "खुदाई से 2-3 दिन पहले खेत की मिट्टी में नमी (बतर) जांचें।",
            "सख्त सूखी मिट्टी में पौधे खींचने से पेग (pegs) टूट जाते हैं और 20–30% फलियां जमीन के अंदर ही छूट जाती हैं।",
            "यदि मिट्टी बहुत सख्त हो गई हो, तो खुदाई से 2-3 दिन पहले एक बहुत हल्की सिंचाई दें ताकि मिट्टी मुलायम हो जाए।",
            "मूंगफली डिगर (ट्रैक्टर चालित) या देसी हल की मदद से पौधे उखाड़ें ताकि सारी फलियां सही-सलामत बाहर आएं।",
          ],
          pointsEn: [
            "Check soil moisture (workable tilth) 2-3 days before pulling plants.",
            "Pulling plants in bone-dry, hard soil snaps pegs, leaving 20–30% pods underground.",
            "If the field is hard, apply a light pre-harvest irrigation 2-3 days prior to digging.",
            "Use a tractor-mounted groundnut digger or country plough to bring all pods intact to the surface.",
          ],
          alertHi: "जल्दबाजी में सूखी जमीन में पौधे खींचने से प्रति एकड़ 3 से 5 क्विंटल पैदावार का सीधा नुकसान हो सकता है।",
          alertEn: "Forcing plants in dry ground can lose 3–5 quintals of pods per acre left in the soil.",
          iconType: "shovel",
        },
        {
          id: "curing",
          badgeHi: "कदम 3 · धूप में सुखाना",
          badgeEn: "Step 3 · Field Sun Curing",
          titleHi: "पौधों को उल्टा करके सुखाना (Inverted Windrows)",
          titleEn: "Inverted Vine Sun-Curing in the Field",
          subtitleHi: "फलियां ऊपर और जड़ें नीचे रखकर 2–3 दिन सुखाएं",
          subtitleEn: "Dry pods facing the sun away from damp ground",
          pointsHi: [
            "उखाड़ने के तुरंत बाद पौधों को खेत में इस तरह रखें कि फलियां ऊपर (सीधी धूप में) और पत्ते/जड़ें नीचे ज़मीन की तरफ रहें।",
            "पौधों को 2 से 3 दिन तक खेत में ही उलटा करके धूप में सूखने दें। इससे फलियों में ज़मीन की सीलन नहीं लगती।",
            "यह प्रक्रिया फली के छिलके को मजबूत बनाती है और दानों में सुरक्षित नमी घटाती है।",
            "जब फली को हिलाने पर अंदर दाना साफ 'खड़कने' लगे, तब थ्रेशर या हाथों से फलियां अलग करें।",
          ],
          pointsEn: [
            "Immediately arrange pulled plants with pods facing up towards the sun and vines touching the ground.",
            "Sun-cure in the field for 2–3 days so pods dry quickly without moisture contact with damp soil.",
            "This inverted curing hardens pod shells and rapidly reduces pod moisture.",
            "When shaking a pod produces a clear rattling sound of the kernel inside, detach pods via thresher.",
          ],
          alertHi: "फलियों को सीधे गीली मिट्टी के संपर्क में न रहने दें, नहीं तो फफूंद व बदरंग होने का खतरा बढ़ जाता है।",
          alertEn: "Never let pods rest directly on wet mud to prevent mold contamination and discoloration.",
          iconType: "sun",
        },
        {
          id: "storage",
          badgeHi: "कदम 4 · सुरक्षित भंडारण",
          badgeEn: "Step 4 · Safe Storage & Aflatoxin",
          titleHi: "सुरक्षित नमी (8–9%) व अफ्लाटॉक्सिन फफूंद से बचाव",
          titleEn: "Moisture Control (8–9%) & Aflatoxin Prevention",
          subtitleHi: "दांत से काटने पर 'कट' की आवाज़ आने तक सुखाएं",
          subtitleEn: "Ensure dry moisture before bagging to stop mold",
          pointsHi: [
            "गहाई के बाद फलियों को पक्के फर्श या तिरपाल पर फैलाकर 3-4 दिन अच्छी धूप दिखाएं जब तक नमी 8–9% तक न आ जाए।",
            "देसी दांत टेस्ट: सूखे दाने को दांत से दबाने पर अगर कड़क 'कट' की स्पष्ट आवाज़ आए, तो समझें नमी सुरक्षित है।",
            "सावधानी: 9% से अधिक नमी रहने पर एस्परजिलस (Aspergillus flavus) फफूंद लग जाती है, जो जहरीला अफ्लाटॉक्सिन बनाती है और बीज सड़ जाता है।",
            "भंडारण का नियम: बोरियों को सीधे सीमेंट के फर्श पर न रखें; लकड़ी के तख्तों (pallets) पर दीवार से 1 फीट दूर हवादार कमरे में रखें।",
          ],
          pointsEn: [
            "Spread harvested pods on clean tarpaulins for 3-4 days of sun drying until moisture drops to 8–9%.",
            "Farmer bite test: Biting a dried kernel should produce a crisp, sharp cracking sound.",
            "Aflatoxin prevention: Moisture above 9% triggers Aspergillus flavus mold, contaminating pods with toxic aflatoxin.",
            "Bagging rule: Place gunny bags on raised wooden pallets, 1 foot away from walls in a well-ventilated storeroom.",
          ],
          alertHi: "अफ्लाटॉक्सिन लगी मूंगफली को मंडी में व्यापारी कौड़ियों के भाव लेते हैं; इसलिए 8–9% नमी तक सुखाना सबसे अहम है।",
          alertEn: "Aflatoxin mold ruins market grading; drying to 8–9% moisture guarantees top mandi price.",
          iconType: "storage",
        },
      ],
    };
  }

  // 2. POTATO
  if (slug === "potato") {
    return {
      leadTitleHi: "आलू खुदाई व सुरक्षित भंडारण का सही तरीका",
      leadTitleEn: "Potato Harvesting & Curing Protocol",
      timingRuleHi: "रोपाई के 90–120 दिन बाद (किस्म व बाज़ार मांग अनुसार)",
      timingRuleEn: "90–120 days after planting depending on maturity & market",
      steps: [
        {
          id: "dehaulming",
          badgeHi: "कदम 1 · बेल कटाई",
          badgeEn: "Step 1 · Dehaulming",
          titleHi: "खुदाई से 10–12 दिन पहले बेल काटना (Dehaulming)",
          titleEn: "Vine Cutting 10–12 Days Before Harvest",
          subtitleHi: "कंद का छिलका सख्त करने के लिए सबसे जरूरी कदम",
          subtitleEn: "Toughens tuber skin to avoid skinning injuries",
          pointsHi: [
            "खुदाई से 10-12 दिन पहले सिंचाई पूरी तरह बंद करें और पौधों की ऊपरी बेल को ज़मीन से काट दें।",
            "इससे आलू की ऊपरी त्वचा (skin) सख्त हो जाती है, जिससे खुदाई के समय छिलका नहीं उतरता।",
            "छिलका सख्त होने से भंडारण और ढुलाई में आलू सड़ने से बचता है।",
          ],
          pointsEn: [
            "Stop irrigation completely and cut above-ground vines 10-12 days before digging.",
            "This process cures the skin underground, preventing skin peeling during mechanical digging.",
            "Toughened skin dramatically extends storage life and reduces transit damage.",
          ],
          iconType: "check",
        },
        {
          id: "digging",
          badgeHi: "कदम 2 · खुदाई",
          badgeEn: "Step 2 · Digging",
          titleHi: "खेत में हल्की नमी व ठंडे समय खुदाई",
          titleEn: "Careful Digging at Moderate Soil Moisture",
          subtitleHi: "दोपहर की तेज़ धूप से कंदों को बचाएं",
          subtitleEn: "Avoid hot afternoon sun on freshly dug tubers",
          pointsHi: [
            "खुदाई सुबह के समय करें जब मौसम ठंडा हो। तेज़ धूप में आलू पर हरापन व सड़न बढ़ सकती है।",
            "पोटैटो डिगर या खुरपी से सावधानी से निकालें ताकि कंदों पर कट या खरोंच न लगे।",
          ],
          pointsEn: [
            "Harvest during cool morning hours. Exposure to intense sun causes greening and rot.",
            "Use well-adjusted potato diggers to prevent physical cuts and bruising.",
          ],
          iconType: "shovel",
        },
        {
          id: "curing",
          badgeHi: "कदम 3 · क्यूरिंग",
          badgeEn: "Step 3 · Curing",
          titleHi: "छायादार हवादार जगह पर 10–15 दिन क्यूरिंग",
          titleEn: "Shade Curing for 10–15 Days",
          subtitleHi: "घाव भरने व छिलका पक्का करने के लिए",
          subtitleEn: "Heals micro-wounds and hardens skin for storage",
          pointsHi: [
            "खुदाई के बाद आलू को सीधे धूप में न रखें; छायादार, हवादार फर्श पर 2-3 फीट मोटी परत में फैलाएं।",
            "10 से 15 दिन में आलू के छोटे-मोटे घाव भर जाते हैं और छिलका पूरी तरह सेट हो जाता है।",
          ],
          pointsEn: [
            "Spread tubers in a cool, ventilated shed in 2-3 feet heaps for 10–15 days.",
            "Curing heals minor harvest abrasions and reduces post-harvest fungal infection.",
          ],
          iconType: "sun",
        },
        {
          id: "storage",
          badgeHi: "कदम 4 · छंटाई व कोल्ड स्टोर",
          badgeEn: "Step 4 · Grading & Cold Store",
          titleHi: "छंटाई (ग्रेडिंग) व 10–12°C पर सुरक्षित भंडारण",
          titleEn: "Grading & Cold Storage at 10–12°C",
          subtitleHi: "कटे, हरे व सड़े कंद अलग करके ही स्टोर करें",
          subtitleEn: "Separate cut, green, or diseased tubers before bagging",
          pointsHi: [
            "आकार के अनुसार छंटाई करें (बड़ा, मध्यम, छोटा)। कटे, सड़े व हरे आलू तुरंत अलग निकालें।",
            "कोल्ड स्टोर में 10–12°C तापमान और 90–95% आर्द्रता पर जालीदार बोरियों में रखें।",
          ],
          pointsEn: [
            "Grade into large, medium, and small tubers. Discard diseased, cut, or green potatoes.",
            "Store in mesh bags at 10–12°C and 90–95% RH in ventilated cold storage facilities.",
          ],
          iconType: "storage",
        },
      ],
    };
  }

  // 3. ONION / GARLIC
  if (slug === "onion" || slug === "garlic") {
    return {
      leadTitleHi: "प्याज व लहसुन खुदाई व क्यूरिंग का सही तरीका",
      leadTitleEn: "Onion & Garlic Digging and Curing Protocol",
      timingRuleHi: "जब 50–70% पौधों की गर्दन झुक जाए (Neck Fall)",
      timingRuleEn: "When 50–70% foliage tops collapse (Neck Fall)",
      steps: [
        {
          id: "neckfall",
          badgeHi: "कदम 1 · सही समय",
          badgeEn: "Step 1 · Timing",
          titleHi: "गर्दन झुकने (Neck-Fall) पर सिंचाई बंद करना",
          titleEn: "Top Neck-Fall & Irrigation Cutoff",
          subtitleHi: "50-70% गर्दन मुड़ने पर सिंचाई रोकें",
          subtitleEn: "Stop watering when half the crop tops collapse",
          pointsHi: [
            "जब खेत के 50–70% पौधों की पत्तियां गर्दन से मुड़कर गिरने लगें, तो सिंचाई तुरंत बंद कर दें।",
            "सिंचाई रोकने के 7-10 दिन बाद सूखी मिट्टी से कंद उखाड़ें ताकि कंद ठोस रहें।",
          ],
          pointsEn: [
            "Halt all irrigation when 50–70% of plant tops collapse at neck level.",
            "Harvest 7–10 days after water cutoff to ensure firm, well-matured bulbs.",
          ],
          iconType: "check",
        },
        {
          id: "curing",
          badgeHi: "कदम 2 · खेत में क्यूरिंग",
          badgeEn: "Step 2 · Windrow Curing",
          titleHi: "कंदों को पत्तियों से ढककर 3–4 दिन सुखाना",
          titleEn: "Field Windrow Curing for 3–4 Days",
          subtitleHi: "कंदों पर सीधी धूप न पड़ने दें",
          subtitleEn: "Cover bulbs with foliage to avoid sunscalding",
          pointsHi: [
            "उखाड़ने के बाद कंदों को खेत में कतार में रखें और आगे वाले पौधे की पत्तियों से पीछे वाले के कंद ढकें।",
            "3-4 दिन खेत में सुखाने से गर्दन पूरी तरह सूखकर बंद हो जाती है और फफूंद अंदर नहीं घुस पाती।",
          ],
          pointsEn: [
            "Arrange bulbs in rows such that the green leaves of one row shade the bulbs of the previous row.",
            "3–4 days of windrow drying tightens the bulb neck, preventing rot pathogens from entering.",
          ],
          iconType: "sun",
        },
        {
          id: "topping",
          badgeHi: "कदम 3 · छंटाई व कटाई",
          badgeEn: "Step 3 · Topping",
          titleHi: "2–2.5 सेमी गर्दन छोड़कर पत्तियां काटना",
          titleEn: "Topping Leaving 2–2.5 cm Neck Intact",
          subtitleHi: "बहुत पास से काटने पर कंद में सड़न शुरू हो जाती है",
          subtitleEn: "Never trim too close to the bulb apex",
          pointsHi: [
            "पत्तियां काटते समय कंद के ऊपर कम से कम 2 से 2.5 सेमी गर्दन ज़रूर छोड़ें।",
            "बिल्कुल सटाकर काटने से कवक व जीवाणु कंद के अंदर चले जाते हैं और प्याज अंदर से गलने लगता है।",
          ],
          pointsEn: [
            "Trim dry tops leaving at least 2 to 2.5 cm of stem neck above the bulb.",
            "Trimming flush with the bulb invites bacterial soft rot and black mold during storage.",
          ],
          iconType: "shovel",
        },
        {
          id: "storage",
          badgeHi: "कदम 4 · सुरक्षित भंडारण",
          badgeEn: "Step 4 · Safe Storage",
          titleHi: "हवादार जालीदार शेड में लकड़ी के रैक पर भंडारण",
          titleEn: "Well-Ventilated Shed Storage on Wooden Racks",
          subtitleHi: "प्लास्टिक की थैलियों में कभी न रखें",
          subtitleEn: "Use open wooden slatted racks, never airtight plastic",
          pointsHi: [
            "प्याज को जालीदार हवादार बोरियों में या लकड़ी के रैक पर 4–6 इंच मोटी परत में रखें।",
            "कमरे में हवा का आर-पार प्रवाह (cross-ventilation) होना चाहिए ताकि नमी न जमे।",
          ],
          pointsEn: [
            "Store in ventilated mesh bags or on raised slatted wooden racks in 4–6 inch layers.",
            "Maintain continuous cross-ventilation to keep humidity below 70% and prevent sprouting.",
          ],
          iconType: "storage",
        },
      ],
    };
  }

  // 4. SOYBEAN & PULSES
  if (slug === "soybean" || slug === "moong" || slug === "urad" || slug === "chana" || slug === "arhar") {
    return {
      leadTitleHi: "सोयाबीन व दलहन कटाई व थ्रेशिंग का सही तरीका",
      leadTitleEn: "Soybean & Pulses Harvesting Protocol",
      timingRuleHi: "जब 85–90% पत्तियां झड़ जाएं व फलियां सुनहरी-भूरी हो जाएं",
      timingRuleEn: "When 85–90% leaves drop and pods turn golden-brown",
      steps: [
        {
          id: "maturity",
          badgeHi: "कदम 1 · सही समय",
          badgeEn: "Step 1 · Maturity",
          titleHi: "फलियों के रंग व खड़खड़ाहट की पहचान",
          titleEn: "Pod Color & Seed Rattle Check",
          subtitleHi: "85% फलियां पकने पर कटाई का सही समय",
          subtitleEn: "Pods turn brown and seeds rattle inside",
          pointsHi: [
            "पौधों की पत्तियां पीली होकर गिरने लगें और फलियों का रंग भूरा/सुनहरा हो जाए।",
            "फली हिलाने पर दाना अंदर खड़कने लगे।",
          ],
          pointsEn: [
            "Leaves turn yellow and drop; pods turn straw-yellow or brown.",
            "Seeds rattle freely within pods when gently shaken.",
          ],
          iconType: "check",
        },
        {
          id: "timing",
          badgeHi: "कदम 2 · कटाई का समय",
          badgeEn: "Step 2 · Harvest Timing",
          titleHi: "सुबह या शाम के समय कटाई (फलियां चिटकने से बचाएं)",
          titleEn: "Early Morning Harvest to Avoid Shattering",
          subtitleHi: "दोपहर की तेज धूप में कटाई से दाने बिखर जाते हैं",
          subtitleEn: "Dry afternoon heat causes pods to shatter and spill grains",
          pointsHi: [
            "कटाई हमेशा सुबह के समय या शाम को करें जब फलियों में हल्की नमी/लचक हो।",
            "दोपहर की कड़ी धूप में फलियां चिटककर (pod shattering) दाने खेत में गिर जाते हैं जिससे 15-20% नुकसान हो सकता है।",
          ],
          pointsEn: [
            "Harvest during early morning hours when slight dew preserves pod elasticity.",
            "Afternoon heat makes pods brittle, causing severe pod shattering and 15–20% grain loss in the field.",
          ],
          alertHi: "दोपहर की धूप में कटाई करने से दाने खेत में बिखर जाते हैं; सुबह की कटाई सबसे सुरक्षित है।",
          alertEn: "Avoid afternoon harvesting; early morning harvest prevents expensive grain shattering.",
          iconType: "shovel",
        },
        {
          id: "threshing",
          badgeHi: "कदम 3 · थ्रेशिंग",
          badgeEn: "Step 3 · Threshing",
          titleHi: "थ्रेशर की गति (RPM) नियंत्रित रखें (बीज टूटने से बचाएं)",
          titleEn: "Controlled Thresher Speed (RPM Control)",
          subtitleHi: "तेज गति से बीज का भ्रूण टूट जाता है",
          subtitleEn: "Excessive drum speed fractures seed embryos",
          pointsHi: [
            "थ्रेशर का ड्रम 400–500 RPM से अधिक गति पर न चलाएं।",
            "तेज गति पर दाल/बीज दो टुकड़ों में टूट जाती है और अंकुरण क्षमता नष्ट हो जाती है।",
          ],
          pointsEn: [
            "Keep thresher cylinder speed below 400–500 RPM.",
            "High drum speed cracks the seed coat and damages the embryo, destroying germination.",
          ],
          iconType: "sun",
        },
        {
          id: "storage",
          badgeHi: "कदम 4 · सुरक्षित भंडारण",
          badgeEn: "Step 4 · Safe Storage",
          titleHi: "9–10% सुरक्षित नमी तक धूप में सुखाएं",
          titleEn: "Sun Dry to 9–10% Moisture Before Bagging",
          subtitleHi: "दांत से काटने पर 'कट' की आवाज़ आनी चाहिए",
          subtitleEn: "Crisp bite test ensures safety against pulse beetles",
          pointsHi: [
            "थ्रेशिंग के बाद दानों को 2-3 दिन धूप में सुखाएं जब तक नमी 9–10% न आ जाए।",
            "भंडारण में घुन (bruchids) से बचाने के लिए बोरियों को नीम के तेल या सुरक्षित पाउडर से उपचारित रखें।",
          ],
          pointsEn: [
            "Sun-dry cleaned grains for 2-3 days until moisture settles at 9–10%.",
            "Protect against bruchids (pulse beetles) using neem oil coating or approved storage dusts.",
          ],
          iconType: "storage",
        },
      ],
    };
  }

  // 5. FRUITING VEGETABLES (TOMATO, CHILLI, BRINJAL, OKRA, CUCUMBERS)
  if (action === "pick" || crop.category === "Vegetables") {
    return {
      leadTitleHi: `${crop.name} की तुड़ाई व मंडी तैयारी का सही तरीका`,
      leadTitleEn: `${crop.name} Picking & Market Preparation Protocol`,
      timingRuleHi: "सुबह या शाम के ठंडे समय (बाज़ार मांग अनुसार अवस्था चुनें)",
      timingRuleEn: "Cool morning or late afternoon hours based on market distance",
      steps: [
        {
          id: "pick-time",
          badgeHi: "कदम 1 · सही समय",
          badgeEn: "Step 1 · Timing",
          titleHi: "सुबह के ठंडे समय तुड़ाई (फलों की ताजगी बनाए रखें)",
          titleEn: "Harvest in Cool Morning Hours",
          subtitleHi: "दोपहर की धूप में तोड़े गए फल जल्दी मुरझा जाते हैं",
          subtitleEn: "Afternoon picking accelerates wilting and shelf decay",
          pointsHi: [
            "तुड़ाई हमेशा सुबह ओस सूखने के तुरंत बाद या शाम 4 बजे के बाद करें।",
            "तेज़ धूप में तोड़े गए फलों का तापमान बढ़ जाता है, जिससे वे 24 घंटे में ही झुर्रीदार होने लगते हैं।",
          ],
          pointsEn: [
            "Pick immediately after morning dew dries, or after 4 PM in the evening.",
            "Fruits harvested under direct midday heat carry high field heat, leading to rapid shriveling.",
          ],
          iconType: "check",
        },
        {
          id: "stalk",
          badgeHi: "कदम 2 · तुड़ाई का तरीका",
          badgeEn: "Step 2 · Picking Technique",
          titleHi: "डंठल (Pedicel) के साथ हल्के हाथ से तोड़ें",
          titleEn: "Retain Stalk (Pedicel) to Extend Freshness",
          subtitleHi: "फलों को खींचे नहीं, डंठल से मोड़कर अलग करें",
          subtitleEn: "Gently snap at the natural abscission joint",
          pointsHi: [
            "फलों को डंठल के साथ तोड़ें; इससे फल की नमी नहीं उड़ती और फल 3–4 दिन ज्यादा ताज़ा रहता है।",
            "फलों को खींचकर न तोड़ें, इससे शाखा टूट सकती है और अगले फूलों को नुकसान पहुंचता है।",
          ],
          pointsEn: [
            "Harvest with the stalk attached; this seals fruit moisture and prolongs shelf-life by 3–4 days.",
            "Do not yank fruits violently; snap gently at the node to protect upcoming flowers.",
          ],
          iconType: "shovel",
        },
        {
          id: "crates",
          badgeHi: "कदम 3 · क्रेट में रखरखाव",
          badgeEn: "Step 3 · Crates & Handling",
          titleHi: "हवादार प्लास्टिक क्रेट्स का उपयोग (बोरियों में न भरें)",
          titleEn: "Use Ventilated Plastic Crates (Never Jute Bags)",
          subtitleHi: "दबने से फल खराब होने से बचाएं",
          subtitleEn: "Prevents crushing and skin abrasions",
          pointsHi: [
            "तोड़े गए फलों को सीधे हवादार प्लास्टिक क्रेट्स में रखें।",
            "सब्जियों को कभी भी जूट या प्लास्टिक की बोरियों में न ठूंसें; दबने से नीचे के 20% फल पिचक जाते हैं।",
          ],
          pointsEn: [
            "Transfer picked produce directly into ventilated plastic harvest crates.",
            "Never cram vegetables into sacks; crushing destroys up to 20% of marketable grade.",
          ],
          iconType: "sun",
        },
        {
          id: "grading",
          badgeHi: "कदम 4 · ग्रेडिंग व मंडी",
          badgeEn: "Step 4 · Grading & Mandi Value",
          titleHi: "आकार व रंग अनुसार छंटाई (15–25% अधिक भाव)",
          titleEn: "Grading by Size & Color (+15–25% Mandi Price)",
          subtitleHi: "दागी व कटे फल अलग क्रेट में रखें",
          subtitleEn: "Separate uniform top grade from blemished produce",
          pointsHi: [
            "फलों को आकार (बड़ा, मध्यम), रंग और चमक के आधार पर 2 ग्रेड में छांटें।",
            "दागी, कीड़े लगे या कटे-फटे फल तुरंत अलग करें। एक समान क्रेट का व्यापारी सबसे ऊंचा भाव देते हैं।",
          ],
          pointsEn: [
            "Sort produce into Grade A (uniform size, color, shine) and Grade B.",
            "Remove blemished, pest-bitten, or undersized fruits. Uniform crates fetch premium bids.",
          ],
          iconType: "storage",
        },
      ],
    };
  }

  // 6. DEFAULT / GRAINS FALLBACK
  return {
    leadTitleHi: `${crop.name} की ${action === "dig" ? "खुदाई" : "कटाई"} व सुरक्षित भंडारण`,
    leadTitleEn: `${crop.name} Harvesting & Safe Handling Protocol`,
    timingRuleHi: crop.harvestAndYield?.harvestingTime || "फसल की पूर्ण परिपक्वता पर",
    timingRuleEn: crop.harvestAndYield?.harvestingTime || "At full physiological maturity",
    steps: [
      {
        id: "maturity",
        badgeHi: "कदम 1 · सही समय",
        badgeEn: "Step 1 · Maturity",
        titleHi: "फसल पकने की पहचान",
        titleEn: "Crop Maturity Signs",
        subtitleHi: "दाने में सुरक्षित नमी व पौधे का रंग",
        subtitleEn: "Inspect grain hardness and plant coloration",
        pointsHi: crop.harvestAndYield?.maturitySigns?.length
          ? crop.harvestAndYield.maturitySigns
          : [
              "पौधे की पत्तियां और बालियां/फलियां सुनहरी-पीली हो चुकी हों।",
              "दाने सख्त हो चुके हों और सुरक्षित नमी का स्तर आ चुका हो।",
            ],
        pointsEn: [
          "Foliage and ears/pods turn uniformly golden yellow.",
          "Grains harden and reach safe harvest moisture.",
        ],
        iconType: "check",
      },
      {
        id: "harvest-op",
        badgeHi: "कदम 2 · सही तरीका",
        badgeEn: "Step 2 · Method",
        titleHi: "खेत में कटाई व सावधानी",
        titleEn: "Field Harvesting Method",
        subtitleHi: "साफ मौसम में कटाई करें",
        subtitleEn: "Harvest in clear weather to avoid moisture damage",
        pointsHi: [
          "मौसम का पूर्वानुमान देखकर साफ धूप वाले दिन ही कटाई करें।",
          "कटाई के बाद खेत में 1-2 दिन सूखने दें ताकि गहाई आसान हो।",
        ],
        pointsEn: [
          "Schedule harvest during clear, dry weather windows.",
          "Allow 1-2 days of field curing prior to threshing.",
        ],
        iconType: "shovel",
      },
      {
        id: "storage",
        badgeHi: "कदम 3 · सुरक्षित भंडारण",
        badgeEn: "Step 3 · Safe Storage",
        titleHi: "सुरक्षित नमी व भंडारण के नियम",
        titleEn: "Safe Storage & Moisture Thresholds",
        subtitleHi: "दाने अच्छी तरह सुखाकर ही बोरियों में रखें",
        subtitleEn: "Dry grains thoroughly to protect against pests & molds",
        pointsHi: crop.harvestAndYield?.storageTips?.length
          ? crop.harvestAndYield.storageTips
          : [
              "भंडारण से पहले दानों को धूप में 10–12% सुरक्षित नमी तक सुखाएं।",
              "बोरियों को सीधे ज़मीन पर न रखें; लकड़ी के तख्तों पर रखें।",
            ],
        pointsEn: [
          "Dry grains to 10–12% safe moisture before sacking.",
          "Store on elevated wooden pallets away from damp floors and walls.",
        ],
        iconType: "storage",
      },
    ],
  };
}
