# Agriveda Farmer Needs — Phase 1 Deep Research (UP + App Crops)

> **Scope note:** This is a product/agronomy research deliverable, **not** app code. It maps the real questions UP/North-India smallholders ask to Agriveda modules, then gives per-crop dossiers for the 22 crops currently in the app catalog (`data/crop-catalog.ts`). Geography priority: **Uttar Pradesh first**, then North India general.
>
> **⚠️ Universal legal disclaimer (applies to every spray/dose/scheme line in this document):**
> - रासायनिक सिफ़ारिश केवल *श्रेणी + उदाहरण active ingredient (AI)* के रूप में दी गई है। **लेबल अनिवार्य है** — डोज़, PHI (कटाई-पूर्व अंतराल) और फसल-अनुमोदन हमेशा product label और स्थानीय कृषि अधिकारी/KVK से तय करें। **लेबल/स्थानीय कृषि अधिकारी अंतिम प्रमाण।**
> - किसी भी अवैध/अ-अनुमोदित मिश्रण (illegal cocktail) की सिफ़ारिश नहीं की गई है। एक बार में एक ही समस्या का लक्षित समाधान बेहतर है।
> - सब्सिडी दरें/प्रतिशत जानबूझकर नहीं दिए गए हैं जहाँ अनिश्चित हैं — **जिला कृषि कार्यालय / आधिकारिक पोर्टल पर दर बदलती रहती है।**
> - Evidence tiers (High / Medium / Low) Section E में परिभाषित हैं। जहाँ Low, वहाँ स्पष्ट रूप से चिह्नित।

---

## A. Farmer question map (what they ask → product module)

यह वह टैक्सोनॉमी है जो असल में किसान फ़ोन/आवाज़ में पूछते हैं। हर पंक्ति को एक Agriveda मॉड्यूल से जोड़ा गया है।

| # | किसान असल में क्या पूछता है (Hindi) | Intent (English) | Agriveda module / route | Data needed |
|---|---|---|---|---|
| 1 | "मेरी फसल में कीड़ा/रोग लग गया है, कौन सी दवा/स्प्रे डालूँ?" | Pest/disease → spray | Pest & Disease Solver (`components/pest-solver`) + crop dossier | crop × pest/disease → MoA class + example AI + ETL + caveat |
| 2 | "धान में बढ़वार नहीं है, कल्लों का फुटाव कैसे बढ़े?" | Growth / tillering / foliar boost | Crop dossier "Fertilizer + tillering notes" | N timing, Zn, water depth, variety genetics, PGR honesty |
| 3 | "पूरी फसल की जानकारी दो — बुवाई, बीज, खाद, अवस्थाएँ" | Full crop package | Crop detail page (`data/crops.ts`) | sowing window UP, seed rate, spacing, fertilizer skeleton, critical stages |
| 4 | "खरपतवार/घास बहुत है, क्या डालें?" | Weeds → herbicide | Crop dossier "Weeds" | crop × weed type → herbicide chemistry group, timing (PRE/POST), caveat |
| 5 | "कितने दिन पर पानी दूँ? किस अवस्था में सिंचाई?" | Irrigation scheduling | Crop dossier "Irrigation timing" | crop-stage critical irrigations (UP canal/tubewell) |
| 6 | "UP से बोल रहा हूँ, कौन सी किस्म बोऊँ?" | Variety selection | Crop dossier "Varieties (UP)" | notified/popular varieties by crop, maturity/ecology |
| 7 | "ट्रैक्टर/रोटावेटर/सीड ड्रिल पर सब्सिडी? KCC लोन कैसे लूँ?" | Subsidy & finance | Schemes module (Section B) | scheme names, eligibility, where to apply, "दर बदलती है" caveat |
| 8 | "मंडी भाव क्या है? MSP कितना है?" | Market/price | Mandi module (already in app) | mandi price feed, MSP table |
| 9 | "मौसम कैसा रहेगा, आज स्प्रे करूँ या नहीं?" | Weather-linked advisory | Weather module | rain/wind → spray-window guidance |

**Design implication:** Questions 1–6 are all **crop-scoped** → they belong inside the crop dossier data model. Question 7 is **cross-cutting** (Section B). The single highest-value structured dataset to add is a **`crop × problem → treatment-class` table** (Section C feeds this).

---

## B. Cross-cutting: Schemes, KCC, tractor/implements/fencing subsidies (UP + India)

> **⚠️ सभी योजनाओं के लिए:** पात्रता, दर और आवेदन की अंतिम तिथि **बदलती रहती है**। नीचे केवल योजना का नाम, मोटा उद्देश्य और आवेदन का रास्ता दिया गया है। **आधिकारिक पोर्टल / जिला कृषि कार्यालय पर वर्तमान दर ज़रूर देखें।** Evidence: scheme names High; exact %/limits Low (verify).

### B1. मुख्य केंद्रीय योजनाएँ (Central schemes)

| योजना | उद्देश्य (मोटे तौर पर) | किसान को क्या मिलता है | आवेदन कहाँ | Status/Evidence |
|---|---|---|---|---|
| **PM-KISAN** | छोटे/सीमांत किसानों को आय सहायता | सालाना ₹6,000 (तीन किस्तों में, DBT) | pmkisan.gov.in / CSC / लेखपाल-कृषि विभाग; e-KYC ज़रूरी | High (चालू). किस्त राशि verify करें |
| **PMFBY (फसल बीमा)** | प्राकृतिक आपदा से फसल नुकसान का बीमा | अधिसूचित फसल पर बीमा; किसान अंश खरीफ ~2%, रबी ~1.5%, बागवानी ~5% प्रीमियम | बैंक/CSC/बीमा कंपनी/pmfby.gov.in; कट-ऑफ तिथि सख़्त | High. फसल-वार अधिसूचना जिले पर निर्भर |
| **PMKSY (सिंचाई — Per Drop More Crop)** | ड्रिप/स्प्रिंकलर सूक्ष्म सिंचाई | सूक्ष्म सिंचाई उपकरण पर सब्सिडी | उद्यान/कृषि विभाग; UP: pmksy/उद्यान पोर्टल | High; दर वर्ग-वार (SC/ST/छोटे) अलग — verify |
| **SMAM (Sub-Mission on Agricultural Mechanization)** | कृषि यंत्रीकरण — ट्रैक्टर/इम्प्लीमेंट्स/CHC | यंत्रों पर सब्सिडी, कस्टम हायरिंग सेंटर | **UP: agrimachinery / यूपी कृषि विभाग "यंत्र" पोर्टल (टोकन/लॉटरी)** | High (योजना), दर Low — verify |
| **KCC (Kisan Credit Card)** | फसल/खेती के लिए सस्ता कार्यशील ऋण | ब्याज-छूट के साथ फसली ऋण (नीचे B3) | कोई भी बैंक/सहकारी बैंक/CSC | High |
| **Soil Health Card** | मिट्टी जाँच आधारित पोषण सलाह | मुफ़्त मिट्टी जाँच रिपोर्ट + खाद सिफ़ारिश | कृषि विभाग / मृदा परीक्षण प्रयोगशाला | High |
| **eNAM** | ऑनलाइन मंडी व्यापार | बेहतर भाव/पारदर्शी नीलामी | enam.gov.in / अधिसूचित मंडी | High |
| **Agriculture Infrastructure Fund (AIF)** | गोदाम/कोल्ड-स्टोर/प्रोसेसिंग पर सस्ता ऋण | ब्याज-छूट वाला ऋण | बैंक / AIF पोर्टल | High |
| **PM-KUSUM** | सोलर पंप / सोलर ऊर्जा | सोलर पंप पर सब्सिडी | UPNEDA / कृषि विभाग | High; दर Low — verify |

### B2. UP-विशेष / राज्य-स्तरीय बातें (state-specific — flagged)

- **कृषि यंत्र सब्सिडी (UP):** UP में ट्रैक्टर व इम्प्लीमेंट्स की सब्सिडी प्रायः राज्य कृषि विभाग के **यंत्र-टोकन/बुकिंग पोर्टल** से चलती है (ऑनलाइन टोकन → DBT → बिल अपलोड)। रोटावेटर, कल्टीवेटर, सीड ड्रिल, हैप्पी सीडर/सुपर सीडर (पराली प्रबंधन), थ्रेशर, लेज़र लैंड लेवलर आमतौर पर पात्र यंत्रों में आते हैं। **दर/स्लैब समय-समय पर बदलते हैं — पोर्टल देखें।** (Evidence: mechanism High, exact % Low.)
- **पराली/CRM (Crop Residue Management):** धान-गेहूँ बेल्ट (पश्चिमी UP) में सुपर सीडर, हैप्पी सीडर, मल्चर, बेलर पर विशेष सब्सिडी अक्सर उपलब्ध — जलाना कानूनन प्रतिबंधित। (Medium.)
- **गन्ना किसान (UP-विशेष):** UP गन्ना विभाग / **E-Ganna app & cane portal (enquiry.caneup.in)** से पर्ची (सट्टा/कैलेंडर), भुगतान, सर्वे देखे जाते हैं। यह UP में बहुत बड़ा किसान-प्रश्न है। (High.)
- **तारबंदी (farm fencing):** **तारबंदी सब्सिडी मुख्यतः राजस्थान की प्रमुख योजना है** (नीलगाय/आवारा पशु से फसल सुरक्षा हेतु कँटीली/चेन-लिंक बाड़)। **UP में समर्पित राज्यव्यापी "तारबंदी योजना" की पुष्टि अनिश्चित है (Low)** — UP किसान को "आवारा पशु/नीलगाय से फसल सुरक्षा" के लिए जिला कृषि/उद्यान कार्यालय व स्थानीय पशुधन/सोलर-फेंसिंग विकल्प पूछने की सलाह दें। **किसी UP तारबंदी % का दावा न करें — जिला कार्यालय पर verify।**
- **मुख्यमंत्री/राज्य विशेष योजनाएँ:** नाम व दायरा समय के साथ बदलते हैं — पोर्टल/जिला कार्यालय पर verify (Low)।

### B3. KCC (Kisan Credit Card) — किसान का सबसे common finance सवाल

- **क्या है:** खेती के कार्यशील खर्च (बीज, खाद, दवा, मज़दूरी) के लिए बैंक से सस्ता, घूमता (revolving) ऋण। पशुपालन/मत्स्य के लिए भी KCC उपलब्ध।
- **ब्याज लाभ:** समय पर चुकाने पर प्रभावी ब्याज बहुत कम हो जाता है (ब्याज छूट + समय पर भुगतान पर अतिरिक्त छूट)। **वर्तमान सीमा/दर बैंक व सरकार की अधिसूचना पर निर्भर — verify।** (High mechanism, exact rate Low.)
- **पात्रता:** ज़मीन का मालिक किसान, बटाईदार/मौखिक पट्टेदार भी (राज्य नियमानुसार), स्वयं-सहायता समूह के किसान।
- **कवर:** फसल उत्पादन खर्च + कुछ फसलोत्तर व घरेलू ज़रूरत + कृषि परिसंपत्ति रखरखाव।
- **आवेदन कहाँ:** किसी भी वाणिज्यिक/सहकारी/ग्रामीण बैंक शाखा या **CSC (जन सेवा केंद्र)**। ज़रूरी: पहचान (आधार), ज़मीन के कागज़ (खतौनी), फ़ोटो, बैंक खाता। PM-KISAN लाभार्थी को अक्सर सरल KCC मिलता है।
- **किसान-facing line (Hindi):** "KCC के लिए अपनी खतौनी, आधार और फ़ोटो लेकर नज़दीकी बैंक या CSC जाएँ। समय पर चुकाने पर ब्याज सबसे कम पड़ता है। दर बैंक से पूछें।"

### B4. ट्रैक्टर व इम्प्लीमेंट्स सब्सिडी — व्यावहारिक सलाह
- ट्रैक्टर पर व्यक्तिगत सब्सिडी सीमित/लॉटरी-आधारित होती है; **इम्प्लीमेंट्स (रोटावेटर, कल्टीवेटर, सीड ड्रिल, थ्रेशर, पंप, स्प्रेयर) पर सब्सिडी ज़्यादा सुलभ** — SMAM/राज्य यंत्र पोर्टल से।
- छोटे किसान के लिए **Custom Hiring Centre (CHC) / यंत्र बैंक** से किराये पर यंत्र लेना अक्सर सस्ता — इसे app में सुझाएँ।
- **किसान-facing line:** "यंत्र सब्सिडी के लिए UP कृषि विभाग के यंत्र पोर्टल पर टोकन बुक करें। दर बदलती रहती है, जिला कृषि कार्यालय से पक्की जानकारी लें।"

---

## C. Per-crop dossiers (22 app crops)

> हर दोसियर में: Varieties (UP) → Sowing & seed → Fertilizer skeleton + growth/tillering → Irrigation timing → Pests → Diseases → Weeds → Farmer FAQ.
> डोज़ जानबूझकर सामान्य/स्किलेटन रखे गए हैं; **मिट्टी जाँच + लेबल के अनुसार समायोजित करें।** रासायनिक नाम English Latin script में।

---

### C1. Paddy / Rice (धान) — Cereals, *Oryza sativa*

**Varieties (UP):** early/short-duration: **Pant Dhan-12, Narendra-359, MTU-1010, PR-126**; medium: **Sarju-52, Pant Dhan-4/24, HUR-105**; basmati (west UP): **Pusa Basmati-1121, 1509, 1718, 1401, 1637**; hybrids for high input. Salt/sodic soils (east UP): **CSR-36, CSR-43, Narendra Usar-2/3**. (Evidence: High for names; choose by duration & flood window.)

**Sowing & seed (UP):** नर्सरी जून; रोपाई जुलाई (20–25 दिन की पौध)। Seed ~20–25 kg/acre (transplanted); DSR/direct ऊँची। Spacing 20×15 cm. बीज उपचार: fungicide (e.g. carbendazim/tricyclazole class) + biofertilizer. सोडिक ज़मीन में जिप्सम/ज़िंक ज़रूरी।

**Fertilizer skeleton + tillering/growth (किसान का सबसे बड़ा सवाल — "कल्लों का फुटाव"):**
- Basal: DAP + MOP + **Zinc sulphate 10 kg/acre** (UP में Zn कमी आम — "खैरा रोग")।
- N को **3 split** में: (1) रोपाई/बेसल, (2) active tillering (~21–25 दिन — यही कल्ले बढ़ाता है), (3) panicle initiation।
- **कल्लों का फुटाव बढ़ाने का वैज्ञानिक सच (honest, legal-safe):**
  - (a) **किस्म की जेनेटिक्स:** कुछ किस्में स्वभाव से कम/ज़्यादा कल्ले देती हैं — इसे स्प्रे से नहीं बदल सकते।
  - (b) **N समय (सबसे प्रभावी लीवर):** active tillering पर समय पर nitrogen top-dress सबसे असरदार। देर से N देना कल्ले नहीं बढ़ाता, सिर्फ़ पत्ती/रोग बढ़ाता है।
  - (c) **Zinc/deficiency:** Zn कमी (खैरा) ठीक करने से बढ़वार लौटती है — zinc sulphate + थोड़ा चूना/यूरिया घोल।
  - (d) **पानी प्रबंधन:** tillering के समय हल्की/उथली पानी परत (या mid-season drainage/AWD) कल्ले बढ़ाती है; लगातार गहरा पानी कल्ले दबाता है।
  - (e) **PGR/टॉनिक दावे:** बाज़ारू "बढ़वार टॉनिक"/अनुमोदित-रहित PGR के कल्ला-बढ़ाने के दावे **कमज़ोर व जोखिमभरे** — इन पर पैसा न लगाएँ; N-timing + Zn ठीक करें। (Honest: Medium/Low evidence for tonics.)

**Irrigation timing:** critical — tillering, panicle initiation, flowering, grain-filling. 2–5 cm खड़ा पानी tillering–flowering में; **AWD (alternate wetting & drying)** से पानी बचत बिना उपज हानि (UP tubewell क्षेत्र में उपयोगी)। कटाई ~7–10 दिन पहले पानी बंद।

**Pests → spray guidance (class + example AI, लेबल अनिवार्य):**
- **Stem borer / Leaf folder:** ETL पार पर — Diamide class (e.g. chlorantraniliprole) या Cartap hydrochloride। शुरुआती light trap/hand-picking।
- **Brown Plant Hopper (BPH):** तने के पास देखें; Buprofezin (IGR) या Pymetrozine/Dinotefuran class। **synthetic pyrethroid से बचें — BPH भड़कता है।**
- **Gundhi bug:** milky stage पर monitor।

**Diseases → spray guidance:**
- **Blast (झुलसा):** Tricyclazole class (protectant/curative) — नर्सरी व boot-leaf पर।
- **Bacterial Leaf Blight (BLB):** copper + प्रतिरोधी किस्म; N अधिक न दें; कोई भरोसेमंद रासायनिक इलाज सीमित — रोकथाम मुख्य।
- **Sheath blight:** Validamycin या Hexaconazole class।

**Weeds → herbicide guidance:** PRE — Pretilachlor (रोपाई के 2–3 दिन बाद, नम खेत)। POST — Bispyribac-sodium (broad-spectrum, DSR/transplanted); सकाई/मोथा के लिए विशिष्ट। (लेबल व अवस्था अनिवार्य।)

**Farmer FAQ (≤5):**
1. कल्ले कम हैं? → tillering पर N top-dress + Zn जाँचें, गहरा पानी घटाएँ।
2. पत्ती नोक सूख रही (BLB)? → N घटाएँ, प्रतिरोधी किस्म, कॉपर।
3. खैरा (पीले धब्बे)? → zinc sulphate डालें।
4. कौन सी किस्म? → जल्दी पकने को PR-126/MTU-1010; बासमती को Pusa 1509/1121।
5. पानी कब बंद? → कटाई से ~1 सप्ताह पहले।

---

### C2. Wheat (गेहूं) — Cereals, *Triticum aestivum*

**Varieties (UP):** समय पर बुवाई: **HD-2967, HD-3086, DBW-187 (Karan Vandana), DBW-303, PBW-343 (पुरानी)**; late-sown: **DBW-173, HD-3059, Raj-3765**; heat-tolerant/wide: **DBW-222, WH-1105**. (High.)

**Sowing & seed (UP):** समय पर बुवाई **1–25 नवंबर** (best); देर से नवंबर-अंत/दिसंबर (उपज घटती है)। Seed 100–120 kg/acre (देर से बुवाई पर ऊँची seed rate)। Spacing 22.5 cm rows। बीज उपचार fungicide। **Zero-till/Happy seeder** धान-अवशेष खेत में उपयोगी (subsidy B2)।

**Fertilizer skeleton + growth:** Basal DAP + MOP; N को 2–3 split — **CRI (crown root initiation, ~21 दिन) पर पहली सिंचाई के साथ N सबसे ज़रूरी**, फिर tillering। Zn + Sulphur जहाँ कमी। देर से N/सिंचाई lodging बढ़ाती है।

**Irrigation timing (UP):** critical — **CRI (~20–25 दिन, सबसे महत्वपूर्ण)**, tillering, jointing, flowering/milk, dough। सीमित पानी में CRI व flowering को प्राथमिकता।

**Pests:** Aphids (सर्दी अंत, दाना भरने पर) — ETL पार पर systemic (e.g. Imidacloprid class) या ladybird संरक्षण; Termite (दीमक) — बीज उपचार/soil treatment (chlorpyriphos class per label)।

**Diseases:** **Yellow/stripe rust (पीला रतुआ — north UP/तराई में अहम)** व brown/leaf rust → Propiconazole/Tebuconazole (triazole class) समय पर; प्रतिरोधी किस्म मुख्य बचाव। Karnal bunt, loose smut → बीज उपचार।

**Weeds:** **Phalaris minor (गेहूँ का मंडूसी/गुल्ली-डंडा — UP में बड़ी समस्या, herbicide-resistance उभरता)** व जंगली जई → grassy: Clodinafop/Pinoxaden/Sulfosulfuron class (rotate MoA to fight resistance)। चौड़ी पत्ती (बथुआ) → 2,4-D/Metsulfuron class। समय: 30–35 दिन। **MoA घुमाएँ (rotation)।**

**Farmer FAQ (≤5):**
1. पहली सिंचाई कब? → ~20–25 दिन (CRI), N के साथ।
2. पीला रतुआ? → triazole स्प्रे तुरंत + प्रतिरोधी किस्म।
3. गुल्ली-डंडा? → समय पर grassy herbicide, हर साल group बदलें।
4. देर से बुवाई की किस्म? → DBW-173/Raj-3765, seed rate बढ़ाएँ।
5. गिर (lodging) रहा? → N व सिंचाई संतुलित, बौनी किस्म चुनें।

---

### C3. Maize (मक्का) — Cereals, *Zea mays*

**Varieties (UP):** hybrids — **DHM-117, Pioneer/DKC single-cross hybrids, Vivek QPM, HQPM-1/5 (quality protein), Pratap/Buland**; season: kharif, rabi (सिंचित), spring। (High names generic; hybrid चुनें।)

**Sowing & seed:** kharif मानसून-आरंभ; rabi अक्टूबर-नवंबर; spring जनवरी-फ़रवरी। Seed 8–10 kg/acre; spacing 60×20 cm। Ridge planting जलभराव में।

**Fertilizer + growth:** N भारी feeder — 3 split (basal, knee-high ~V6, tasseling से पहले)। Zn कमी आम। DAP+MOP basal।

**Irrigation:** critical — knee-high, **tasseling–silking (सबसे नाज़ुक — यहाँ पानी की कमी उपज गिराती है)**, grain-filling। जलभराव से बचें।

**Pests:** **Fall armyworm (FAW — अब मुख्य कीट)** → whorl में early — Spinetoram/Emamectin benzoate/Chlorantraniliprole class + शुरुआती scouting, ovicidal; Stem borer; Shoot fly (spring)। FAW में जल्दी पहचान अहम।

**Diseases:** Turcicum & Maydis leaf blight → Mancozeb/triazole class; Downy mildew → seed treatment (metalaxyl class)।

**Weeds:** PRE Atrazine (मक्का-विशिष्ट, दलहन-इंटरक्रॉप में सावधानी) + POST Tembotrione/Topramezone class; hand weeding 20–40 दिन।

**Farmer FAQ (≤5):**
1. पत्ती में छेद/मल (FAW)? → whorl में early Emamectin/Spinetoram, देर न करें।
2. कौन सा बीज? → single-cross hybrid, QPM पोषण को।
3. पानी कब ज़रूरी? → tasseling–silking पर बिल्कुल कमी न हो।
4. Atrazine सुरक्षित? → सिर्फ़ मक्का में लेबल अनुसार, अगली दलहन फसल पर ध्यान।
5. पीलापन? → N split + Zn।

---

### C4. Bajra / Pearl Millet (बाजरा) — Millets, *Pennisetum glaucum*

**Varieties (UP — पश्चिमी/बुंदेलखंड शुष्क बेल्ट):** hybrids **HHB-67 Improved (जल्दी, downy-mildew सहनशील), Pusa Composite, RHB, MPMH** series; downy-mildew प्रतिरोध प्राथमिकता। (Medium.)

**Sowing & seed:** जून-जुलाई मानसून पर; seed 3–4 kg/acre; spacing 45×10 cm। शुष्क क्षेत्र फसल।

**Fertilizer + growth:** कम-इनपुट; DAP basal + हल्का N; Zn/Fe जहाँ कमी।

**Irrigation:** मुख्यतः वर्षा-आधारित; critical — tillering व ear-head/grain-filling पर तनाव हो तो 1–2 जीवनरक्षक सिंचाई।

**Pests:** Shoot fly (early), Stem borer, white grub — बीज उपचार + early control।

**Diseases:** **Downy mildew (green ear — मुख्य)** → प्रतिरोधी hybrid + seed treatment (metalaxyl class); **Ergot (चारे में विषैला)** → रोगग्रस्त बालियाँ हटाएँ, स्वच्छ बीज।

**Weeds:** early hand weeding/interculture; Atrazine millet-लेबल पर सावधानी।

**Farmer FAQ (≤5):**
1. हरी बाली (downy)? → प्रतिरोधी hybrid + बीज उपचार, रोगग्रस्त हटाएँ।
2. जल्दी पकने की किस्म? → HHB-67 Improved।
3. पानी कब? → tillering व दाना भरने पर तनाव में ही।
4. Ergot? → संक्रमित बाली अलग करें, चारे में न दें।
5. कम बारिश में? → बाजरा वैसे भी सूखा-सहनशील, seed rate ठीक रखें।

---

### C5. Potato (आलू) — Vegetables, *Solanum tuberosum*

**Varieties (UP — बड़ा आलू राज्य):** **Kufri Bahar, Kufri Pukhraj (जल्दी, लोकप्रिय), Kufri Chipsona-1/3 (प्रोसेसिंग/चिप्स), Kufri Chandramukhi (जल्दी), Kufri Khyati, Kufri Sindhuri, Kufri Mohan**. (High.)

**Sowing & seed:** **अक्टूबर–नवंबर** (UP मैदान)। Seed rate 20–25 q/acre (बीज कंद); spacing 60×20 cm; अंकुरित/उपचारित बीज कंद। ठंडी दोमट।

**Fertilizer + growth:** भारी feeder — Compost + DAP basal; N व K को tuberization पर split; **मिट्टी चढ़ाना (earthing up) ज़रूरी** (हरे कंद रोकता है + tuber बढ़ाता है)।

**Irrigation:** हल्की बार-बार; critical — stolonization, tuber initiation, tuber bulking। जलभराव व अंतिम अधिक सिंचाई सड़न बढ़ाती है; कटाई ~10 दिन पहले पानी बंद।

**Pests:** Aphids (leaf-curl/PLRV वायरस वाहक — बीज-आलू में अहम), white grub, cutworm — Imidacloprid class/soil control per label।

**Diseases:** **Late blight (पछेती झुलसा — कोहरे/नमी में तेज़, सबसे बड़ा ख़तरा)** → protectant Mancozeb + रोग आने पर systemic (Cymoxanil/Dimethomorph/Metalaxyl class), मौसम-आधारित पूर्व-छिड़काव; Early blight → Mancozeb/Azoxystrobin class।

**Weeds:** earthing up + PRE Metribuzin/Pendimethalin class (लेबल अनुसार)।

**Farmer FAQ (≤5):**
1. कोहरे में पत्ती काली (late blight)? → तुरंत systemic + Mancozeb, मौसम पर पहले से protectant।
2. कौन सी किस्म? → खाने को Kufri Bahar/Pukhraj, चिप्स को Chipsona।
3. मिट्टी क्यों चढ़ाएँ? → कंद बढ़ते व हरे नहीं होते।
4. पानी कब बंद? → खुदाई से ~10 दिन पहले।
5. बीज कहाँ से? → प्रमाणित/रोगमुक्त बीज कंद ही लें।

---

### C6. Tomato (टमाटर) — Vegetables, *Solanum lycopersicum*

**Varieties (UP):** hybrids **Arka Rakshak (ToLCV+ triple resistance), Arka Samrat, Pusa Ruby, Pusa Rohini, Kashi Aman/Vishesh (IIVR Varanasi)**; leaf-curl-प्रतिरोधी hybrid प्राथमिकता। (High.)

**Sowing & seed:** नर्सरी → रोपाई (रबी/वसंत मुख्य UP)। Spacing 75×45 cm; staking बेहतर। Trichoderma + fungicide बीज उपचार।

**Fertilizer + growth:** DAP+MOP+compost basal; fruiting पर K व Ca (calcium nitrate) — **blossom-end rot रोकने को Ca**; boron flowering पर।

**Irrigation:** नियमित समान नमी (drip आदर्श); critical — flowering, fruit-set, fruit-development। असमान नमी → फल फटना व BER।

**Pests:** **Whitefly (leaf-curl वायरस वाहक — मुख्य), Thrips, Fruit borer (Helicoverpa), और Tuta absoluta (leaf miner — नया गंभीर कीट)** → Whitefly/Thrips: Diafenthiuron/Flonicamid class; Borer/Tuta: Chlorantraniliprole/Spinetoram class + pheromone trap। ETL व rotation ज़रूरी।

**Diseases:** Early blight & **Late blight** → Mancozeb + systemic (जैसा आलू); **Leaf curl (ToLCV — वायरस, whitefly से)** → कोई रासायनिक इलाज नहीं, whitefly नियंत्रण + प्रतिरोधी hybrid + रोगग्रस्त पौधा हटाएँ; Fusarium wilt → प्रतिरोधी किस्म/grafting।

**Weeds:** mulching (plastic/straw) + hand weeding; Pendimethalin PRE।

**Farmer FAQ (≤5):**
1. पत्ती मुड़/सिकुड़ रही (leaf curl)? → वायरस है; whitefly रोकें, प्रतिरोधी hybrid, संक्रमित हटाएँ।
2. फल के नीचे काला धब्बा (BER)? → calcium + समान सिंचाई।
3. फल में छेद? → borer/Tuta — diamide + trap।
4. कौन सा hybrid? → Arka Rakshak (रोग-प्रतिरोधी)।
5. फल फट रहे? → नमी एक-सी रखें, mulch।

---

### C7. Onion (प्याज़) — Vegetables, *Allium cepa*

**Varieties (UP):** **Pusa Red, Pusa Madhavi, Agrifound Light Red, Agrifound Dark Red, N-53 (kharif), Bhima series (Bhima Super, Bhima Red, Bhima Shakti — DOGR Rajgurunagar)**; रबी भंडारण को dark-red/Bhima Kiran। (High.)

**Sowing & seed:** रबी (मुख्य): नर्सरी अक्टूबर-नवंबर → रोपाई दिसंबर; kharif अलग। Seed ~3–4 kg/acre (नर्सरी); spacing 15×10 cm।

**Fertilizer + growth:** N+P+K; **Sulphur (प्याज़ में तीखापन/उपज बढ़ाता है)** ज़रूरी; bulb development पर K। अधिक/देर N गर्दन मोटी व भंडारण ख़राब करता है।

**Irrigation:** बार-बार हल्की; critical — bulb initiation व development। कटाई/neck-fall से ~10–15 दिन पहले पानी बंद (भंडारण को)।

**Pests:** **Thrips (मुख्य — पत्ती चाँदी जैसी)** → Fipronil/Spinosad/Fipronil-रोटेशन class + sticky trap; sticker/spreader ज़रूरी (मोमी पत्ती)।

**Diseases:** **Purple blotch (बैंगनी धब्बा — मुख्य), Stemphylium blight** → Mancozeb + Hexaconazole/Difenoconazole (triazole) class; Basal rot।

**Weeds:** धीमी शुरुआती वृद्धि → weed दबाव अधिक; Oxyfluorfen PRE + Quizalofop grassy POST + hand weeding।

**Farmer FAQ (≤5):**
1. पत्ती चाँदी/खुरचन (thrips)? → Fipronil/SpinosMD + sticker, rotate।
2. बैंगनी धब्बे? → Mancozeb + triazole छिड़काव।
3. भंडारण को कौन सी किस्म? → dark red / Bhima Kiran।
4. गर्दन मोटी क्यों? → देर/अधिक N घटाएँ।
5. पानी कब बंद? → खुदाई से ~2 सप्ताह पहले।

---

### C8. Chilli (मिर्च) — Vegetables, *Capsicum annuum*

**Varieties (UP):** **Kashi Anmol, Kashi Early (IIVR), Pusa Jwala, Pusa Sadabahar, LCA-334, Arka Lohit**; leaf-curl-सहनशील hybrid प्राथमिकता। (Medium/High.)

**Sowing & seed:** नर्सरी → 30–35 दिन बाद रोपाई; spacing 60×45 cm; Trichoderma बीज उपचार।

**Fertilizer + growth:** compost+DAP basal; fruiting पर K+Ca; boron flowering।

**Irrigation:** नियमित; critical flowering व fruiting; जलभराव dieback बढ़ाता है।

**Pests:** **Thrips (leaf-curl/"मुरड़ा" का मुख्य कारक — chilli में सबसे बड़ी समस्या), Mites (leaf-curl downward), Aphids, Whitefly, Fruit borer** → Thrips: Spinetoram/Fipronil class; Mites: Spiromesifen/abamectin class (कीटनाशक mite पर काम नहीं करता — अलग acaricide); Borer: diamide। **मुरड़ा = thrips+mite combo, दोनों देखें।**

**Diseases:** **Leaf curl (thrips-mite complex + वायरस), Anthracnose/Dieback (फल पर काला — मुख्य), Powdery mildew** → Anthracnose: Azoxystrobin/Mancozeb+carbendazim class; PM: sulphur/triazole।

**Weeds:** mulching + hand weeding; Pendimethalin PRE।

**Farmer FAQ (≤5):**
1. पत्ती मुरड़/ऊपर-नीचे मुड़ (मुरड़ा)? → thrips (ऊपर मुड़) + mite (नीचे मुड़) दोनों का इलाज, अलग-अलग दवा।
2. फल पर काला सड़न (anthracnose)? → Azoxystrobin/carbendazim class।
3. कौन सी किस्म? → Kashi Anmol/Pusa Jwala।
4. फल झड़ रहे? → boron/Ca + dieback नियंत्रण।
5. एक ही दवा बार-बार? → नहीं, group बदलें (resistance)।

---

### C9. Cauliflower (फूलगोभी) — Vegetables, *Brassica oleracea* var. *botrytis*

**Varieties (UP — मौसम-वार अहम):** early (सितंबर): **Pusa Meghna, early Indian types**; mid (अक्टू-नवं): **Pusa Sharad, Pant Gobhi**; late/snowball (दिसंबर-जनवरी): **Pusa Snowball K-1, Snowball-16**। **मौसम-मिलान गलत = curd नहीं बनेगा।** (High.)

**Sowing & seed:** नर्सरी → रोपाई; seed 400–500 g/acre; spacing 60×45 cm।

**Fertilizer + growth:** compost+DAP; **Boron व Molybdenum ज़रूरी (कमी = भूरा curd/whiptail)**; N curd-formation पर संतुलित।

**Irrigation:** समान नमी; curd-formation पर तनाव न हो।

**Pests:** **Diamondback moth (DBM — मुख्य, resistance-prone), Aphids** → DBM: Spinosad/Chlorantraniliprole/Bt class + rotate (DBM जल्दी resistant); Aphids: systemic।

**Diseases:** **Black rot (bacterial — V-आकार पीला किनारा), Downy mildew, Alternaria** → Black rot: बीज उपचार + copper, प्रतिरोधी; Downy: Mancozeb/metalaxyl class।

**Weeds:** hand weeding + mulching; Pendimethalin PRE।

**Farmer FAQ (≤5):**
1. curd भूरा/खोखला? → Boron कमी — boron डालें।
2. पत्ती V-आकार पीली (black rot)? → copper + बीज उपचार, फसल चक्र।
3. curd बना ही नहीं? → गलत किस्म/मौसम — मौसम-मिलान किस्म लें।
4. हरी सूँडी (DBM)? → Spinosad/Bt, दवा बदलते रहें।
5. whiptail (पत्ती पतली)? → molybdenum कमी।

---

### C10. Cucumber (खीरा) — Vegetables, *Cucumis sativus*

**Varieties (UP):** **Pusa Uday, Pusa Sanyog (hybrid), Kashi (IIVR) lines, Poinsette, Swarna Ageti**; polyhouse को parthenocarpic hybrids। (Medium.)

**Sowing & seed:** वसंत/गर्मी (व zaid); seed 1.5–2 kg/acre; spacing wide (बेल)। direct/transplant।

**Fertilizer + growth:** compost+DAP; fruiting पर K; boron/zinc।

**Irrigation:** मध्यम-नियमित; गर्मी में हर 2–3 दिन; फल-विकास पर तनाव कड़वापन/टेढ़ापन बढ़ाता है।

**Pests:** **Red pumpkin beetle (शुरुआती अवस्था — मुख्य), Fruit fly (फल में कीड़ा), Whitefly, Aphids** → Fruit fly: cue-lure pheromone trap + bait; beetle: early control per label।

**Diseases:** **Downy mildew व Powdery mildew (मुख्य)** → DM: Mancozeb/metalaxyl class; PM: sulphur/Azoxystrobin/triazole; Anthracnose।

**Weeds:** mulching + hand weeding।

**Farmer FAQ (≤5):**
1. फल में कीड़ा/सड़न (fruit fly)? → pheromone trap + bait, गिरे फल हटाएँ।
2. पत्ती पर सफ़ेद पाउडर (PM)? → sulphur/triazole।
3. खीरा कड़वा/टेढ़ा? → नमी एक-सी रखें, तनाव न हो।
4. छोटे पौधे कट रहे (beetle)? → early नियंत्रण।
5. कौन सी किस्म? → Pusa Sanyog/parthenocarpic hybrid (polyhouse)।

---

### C11. Brinjal / Eggplant (बैंगन) — Vegetables, *Solanum melongena*

**Varieties (UP):** **Pusa Purple Long, Pusa Kranti, Pant Rituraj, Kashi Taru/Kashi Prakash (IIVR), Punjab Sadabahar**; borer-सहन के लिए hybrid। (High.)

**Sowing & seed:** नर्सरी → रोपाई; spacing 75×60 cm।

**Fertilizer + growth:** compost+DAP; fruiting पर K+P; लंबी तुड़ाई अवधि → split N।

**Irrigation:** नियमित (3–4 दिन); flowering/fruiting पर कमी न हो।

**Pests:** **Shoot & Fruit Borer (BSFB — सबसे बड़ी समस्या, "तना व फल में कीड़ा")** → IPM पहले: मुरझाई टहनी/छेदित फल तोड़कर नष्ट + pheromone trap; रासायनिक: Chlorantraniliprole/Emamectin/Cyantraniliprole class, rotate; **synthetic pyrethroid के बार-बार प्रयोग से resistance — बचें**। Whitefly, Jassid, mites भी।

**Diseases:** **Bacterial/Fusarium wilt (मुरझाना), Phomopsis blight/fruit rot, little leaf (phytoplasma — leafhopper से)** → wilt: प्रतिरोधी किस्म + फसल चक्र + soil health; little leaf: रोगग्रस्त हटाएँ + vector control।

**Weeds:** mulching + hand weeding; Pendimethalin PRE।

**Farmer FAQ (≤5):**
1. फल/तना में कीड़ा (BSFB)? → छेदित भाग रोज़ तोड़कर नष्ट + trap + diamide, दवा बदलें।
2. पौधा अचानक मुरझाया (wilt)? → उखाड़ें, फसल चक्र, प्रतिरोधी किस्म।
3. छोटी-छोटी पत्तियाँ (little leaf)? → वायरस/phytoplasma — पौधा हटाएँ, leafhopper रोकें।
4. कौन सी किस्म? → Kashi/Pusa Kranti।
5. एक ही दवा? → नहीं, group rotate।

---

### C12. Bhindi / Okra (भिंडी) — Vegetables, *Abelmoschus esculentus*

**Varieties (UP):** **Kashi Kranti, Kashi Pragati (IIVR), Arka Anamika, Pusa Sawani, VRO-6, Parbhani Kranti (YVMV-सहनशील)**; **YVMV (पीला शिरा मोज़ेक) प्रतिरोध सबसे ज़रूरी।** (High.)

**Sowing & seed:** ग्रीष्म (फ़रवरी-मार्च) व खरीफ (जून-जुलाई); direct seeding; seed ~4–6 kg/acre; overnight भिगोना अंकुरण बढ़ाता है।

**Fertilizer + growth:** compost+DAP; N split (लंबी तुड़ाई); K fruiting पर।

**Irrigation:** गर्मी में 4–5 दिन; flowering/fruiting पर तनाव न हो।

**Pests:** **Shoot & Fruit Borer, Jassid/leafhopper (पत्ती किनारा पीला-मुड़), Whitefly (YVMV वाहक), Aphids, mites** → Jassid/whitefly: Diafenthiuron/Flonicamid class; Borer: diamide; **whitefly नियंत्रण = YVMV रोकथाम की कुंजी**।

**Diseases:** **YVMV / Yellow Vein Mosaic (वायरस — मुख्य, पत्ती की शिराएँ पीली, फल पीले-कठोर)** → कोई रासायनिक इलाज नहीं; प्रतिरोधी किस्म + whitefly नियंत्रण + रोगग्रस्त पौधा हटाएँ; Powdery mildew → sulphur/triazole।

**Weeds:** hand weeding 2–3 बार; Pendimethalin PRE।

**Farmer FAQ (≤5):**
1. पत्ती-शिरा पीली, फल पीले (YVMV)? → वायरस; प्रतिरोधी किस्म + whitefly रोकें + संक्रमित हटाएँ।
2. पत्ती किनारा पीला-मुड़ (jassid)? → systemic स्प्रे।
3. फल में छेद? → borer — diamide + छेदित फल हटाएँ।
4. कौन सी किस्म? → Kashi Kranti/Arka Anamika (YVMV-सहन)।
5. अंकुरण कम? → बीज रातभर भिगोएँ, नमी ठीक रखें।

---

### C13. Cotton (कपास) — Cash Crops, *Gossypium* spp.

> **UP note:** UP कपास का प्रमुख राज्य नहीं (कुछ पश्चिमी UP)। मुख्य Bt-कपास सलाह उत्तर-भारत (पंजाब/हरियाणा/राजस्थान) बेल्ट पर लागू; **UP किसान को स्थानीय KVK सलाह प्राथमिक।** State-specific — flagged.

**Varieties:** मुख्यतः **Bt cotton hybrids (BG-II)**; उत्तर-क्षेत्र में जल्दी पकने वाले, whitefly/CLCuV-सहन hybrids। किस्म बीज-थैली/डीलर व KVK से।

**Sowing & seed:** उत्तर भारत अप्रैल-मई (सिंचित)। Bt hybrid seed पैकेट-अनुसार; **refuge (non-Bt) अनिवार्य**।

**Fertilizer + growth:** N भारी + K; square/flowering/boll पर N-K; अधिक N vegetative अधिक व boll कम।

**Irrigation:** critical — squaring, flowering, boll-development। जलभराव संवेदनशील।

**Pests:** **Pink bollworm (PBW — Bt में भी बड़ा ख़तरा अब), Whitefly (CLCuV वाहक — उत्तर बेल्ट में विनाशकारी), Jassid, Thrips, Aphids** → PBW: pheromone trap monitoring + Chlorantraniliprole/Emamectin/Thiodicarb class, समय पर; Whitefly: Diafenthiuron/Flonicamid/Pyriproxyfen class, **synthetic pyrethroid से whitefly भड़कता — बचें**। ETL आधारित।

**Diseases:** **Cotton Leaf Curl Virus (CLCuV — whitefly से, उत्तर भारत मुख्य), Bacterial blight, root rot** → CLCuV: प्रतिरोधी hybrid + whitefly नियंत्रण (कोई सीधा रासायनिक इलाज नहीं)।

**Weeds:** Pendimethalin PRE + inter-culture + directed Glyphosate केवल non-crop/सावधानी (HTBt अवैध — प्रोत्साहित न करें)।

**Farmer FAQ (≤5):**
1. गुलाबी सुंडी (PBW)? → pheromone trap + समय पर diamide, फसल-अवशेष नष्ट।
2. पत्ती मुड़/CLCuV? → whitefly रोकें + प्रतिरोधी hybrid।
3. सफ़ेद मक्खी? → Diafenthiuron class, pyrethroid से बचें।
4. UP में कौन सी किस्म? → स्थानीय KVK/डीलर से अनुमोदित Bt hybrid।
5. refuge क्यों? → resistance रोकने को non-Bt refuge ज़रूरी।

---

### C14. Sugarcane (गन्ना) — Cash Crops, *Saccharum officinarum*

> **UP note:** UP भारत का सबसे बड़ा गन्ना राज्य — यह app का सबसे महत्वपूर्ण cash crop dossier। Cane-portal (पर्ची/भुगतान) integration high-value (Section D)।

**Varieties (UP):** **Co 0238 ("करण-4" — दशक की प्रमुख, अब red-rot दबाव से क्षेत्र घट रहा), Co 0118, CoLk 94184, Co 15023, Co 98014, CoS 8436/13235**; **red-rot प्रतिरोध अब वैरायटी-चयन का मुख्य आधार — Co 0238 विकल्पों की ओर बढ़ें।** (High; Co 0238 red rot advisory Medium/High.)

**Sowing & seed:** autumn (अक्टूबर) व spring (फ़रवरी-मार्च); 3-बड setts या single-bud; setts fungicide उपचार (red rot रोकथाम)। **Trench/ring-pit** विधि उपज बढ़ाती है।

**Fertilizer + growth:** भारी feeder — N भारी + P + K; N को 3–4 split (tillering व grand-growth पर); micronutrients (Zn, Fe)। earthing up + propping।

**Irrigation:** पूरे मौसम नियमित; critical — germination, tillering, grand growth (मई-जून गर्मी में सबसे ज़रूरी)। drip + trench पानी बचाता है।

**Pests:** **Early shoot borer, Top borer, Root borer, Pyrilla, whitefly** → borers: Chlorantraniliprole/Fipronil class soil/whorl application + light trap + Trichogramma (bio); dead-heart टिलर हटाएँ।

**Diseases:** **Red Rot (लाल सड़न — विनाशकारी, "गन्ना बीच से लाल+दुर्गंध"), Smut (काला चाबुक), Wilt** → कोई भरोसेमंद रासायनिक इलाज नहीं; **प्रतिरोधी किस्म + रोगमुक्त बीज + संक्रमित ठूँठ जलाना/हटाना + फसल चक्र** मुख्य।

**Weeds:** Atrazine/Metribuzin PRE + earthing up + intercrop (दलहन) से दमन।

**Farmer FAQ (≤5):**
1. गन्ना बीच से लाल+बदबू (red rot)? → रोग है; पौधे उखाड़ें, प्रतिरोधी किस्म बदलें, Co 0238 पर दोबारा न लगाएँ।
2. कौन सी किस्म? → red-rot-सहन नई किस्में (Co 0118/CoLk 94184 आदि), स्थानीय शक्कर मिल सलाह।
3. पर्ची/भुगतान? → E-Ganna app / caneup.in पर देखें।
4. बेधक (dead heart)? → सूखे टिलर हटाएँ + Trichogramma + लेबल दवा।
5. उपज कैसे बढ़े? → trench विधि + समय पर N split + गर्मी में सिंचाई।

---

### C15. Soybean (सोयाबीन) — Oilseeds, *Glycine max*

> UP में मुख्यतः बुंदेलखंड/दक्षिणी बेल्ट; प्रमुख बेल्ट MP/महाराष्ट्र।

**Varieties (UP/North):** **JS-9560, JS-2034 (जल्दी), JS-2069, NRC-131, RVS/ Pratap** series; जल्दी पकने + YMV-सहन प्राथमिकता। (Medium/High.)

**Sowing & seed:** जून-जुलाई पहली अच्छी मानसून बारिश (≥50–75 mm) के बाद; seed 25–30 kg/acre (बड़े-बीज किस्म पर वज़न-आधारित); Rhizobium + PSB + fungicide उपचार; BBF/ridge जल-निकासी को।

**Fertilizer + growth:** दलहन — कम N; DAP + **Sulphur (तेल-फसल में ज़रूरी)** + Zn basal; Rhizobium से जैविक N।

**Irrigation:** मुख्यतः वर्षा; critical — flowering व pod-filling; लंबे break पर जीवनरक्षक सिंचाई; जलभराव घातक।

**Pests:** **Girdle beetle, Stem fly, Defoliators (Semilooper, Tobacco caterpillar/Spodoptera), Whitefly** → defoliators: Chlorantraniliprole/Emamectin/Indoxacarb class; stem fly/girdle: systemic early।

**Diseases:** **Yellow Mosaic Virus (YMV — whitefly से, मुख्य), Rust, Charcoal rot, Anthracnose** → YMV: प्रतिरोधी किस्म + whitefly; Rust: triazole (hexaconazole/propiconazole) class।

**Weeds:** PRE Pendimethalin/imazethapyr (dलहन-लेबल) + POST imazethapyr/quizalofop; समय 15–20 दिन।

**Farmer FAQ (≤5):**
1. पत्ती पीली-चितकबरी (YMV)? → whitefly रोकें + प्रतिरोधी किस्म।
2. बुवाई कब? → पहली अच्छी बारिश (≥50 mm) के बाद ही।
3. पत्ती खा रहे कीड़े? → diamide/emamectin।
4. जल निकासी? → BBF/ridge, जलभराव मत होने दें।
5. कौन सी किस्म? → JS-9560/जल्दी YMV-सहन।

---

### C16. Moongfali / Groundnut (मूंगफली) — Oilseeds, *Arachis hypogaea*

**Varieties (UP/North):** **TG-37A, GG-20, Kadiri, DH-86, TAG-24, Girnar (high-oleic में नई)**; UP zaid/kharif spreading व bunch types। (Medium.)

**Sowing & seed:** kharif जून-जुलाई; zaid फ़रवरी (सिंचित); seed (गिरी) 80–100 kg/acre; Rhizobium + fungicide उपचार; बलुई दोमट।

**Fertilizer + growth:** DAP + **Gypsum (Ca+S — pegging पर ज़रूरी, फली-भराव बढ़ाता है)**; कम N (दलहन)।

**Irrigation:** critical — flowering, **pegging (सबसे नाज़ुक)**, pod-filling; जलभराव collar rot बढ़ाता है।

**Pests:** **Leaf miner, Spodoptera/tobacco caterpillar, Aphids/Jassid, Termite, White grub** → defoliators: emamectin/diamide; soil pests: बीज/भूमि उपचार per label।

**Diseases:** **Tikka (early & late leaf spot — मुख्य), Rust, Collar rot, Stem rot** → leaf spot/rust: Mancozeb/chlorothalonil + triazole (tebuconazole/hexaconazole) class; collar/stem rot: Trichoderma + बीज उपचार।

**Weeds:** PRE Pendimethalin + hand weeding; pegging के बाद गुड़ाई न करें (peg टूटते)।

**Farmer FAQ (≤5):**
1. पत्ती पर काले धब्बे (tikka)? → Mancozeb + triazole।
2. फली कम भर रही? → pegging पर gypsum + पानी।
3. Gypsum कब? → फूल/pegging अवस्था पर।
4. पौधे आधार पर सड़न (collar rot)? → Trichoderma + बीज उपचार।
5. गुड़ाई कब बंद? → pegging शुरू होते ही।

---

### C17. Mustard / Rapeseed (सरसों) — Oilseeds, *Brassica juncea*

> UP का प्रमुख रबी तिलहन — high-value dossier।

**Varieties (UP):** **Pusa Bold, Pusa Mustard-25/28/30, RH-30, RH-749, Varuna, Kranti, Giriraj, NRCHB-101 (hybrid)**; जल्दी बुवाई को Pusa Agrani; canola-quality नई। (High.)

**Sowing & seed:** **अक्टूबर (मध्य) best**; seed ~1.5–2 kg/acre; spacing 30–45 cm rows; समय पर बुवाई aphid/frost से बचाती है।

**Fertilizer + growth:** N + P + **Sulphur (तेल-मात्रा बढ़ाता — बहुत ज़रूरी)** + Zn/B; N split (basal + पहली सिंचाई)।

**Irrigation:** critical — pre-flowering/branching व siliqua (fruit) development; आमतौर पर 1–2 सिंचाई।

**Pests:** **Mustard aphid (माहू — सबसे बड़ा, फूल/फली पर झुंड), Painted bug, Sawfly** → aphid: Imidacloprid/Thiamethoxam/Dimethoate class ETL पार पर; **मधुमक्खी-संरक्षण के लिए फूल पर सुबह/शाम छिड़काव व सुरक्षित AI चुनें**।

**Diseases:** **White rust, Alternaria blight, Downy mildew, Sclerotinia stem rot** → Mancozeb + Metalaxyl/triazole class; प्रतिरोधी किस्म।

**Weeds:** Pendimethalin PRE + 1 hand weeding; Isoproturon/oxadiargyl per label।

**Farmer FAQ (≤5):**
1. फूल/फली पर माहू (aphid)? → ETL पर systemic, मधुमक्खी बचाकर शाम को।
2. Sulphur क्यों? → तेल-मात्रा व उपज बढ़ाता है।
3. बुवाई कब? → मध्य अक्टूबर सबसे अच्छा।
4. पत्ती पर सफ़ेद फफोले (white rust)? → Mancozeb + metalaxyl।
5. सिंचाई कब? → फूल-पूर्व व फली-बनने पर।

---

### C18. Pulses — Arhar/Tur & general (दलहन / अरहर) — *Cajanus cajan* आदि

> Catalog में "pulses" सामान्य वर्ग — मुख्यतः **अरहर/तुअर (tur)** + चना/उड़द संदर्भ। (मूंग अलग C19.)

**Varieties (Arhar, UP/North):** **UPAS-120 (जल्दी), Pusa-992, Narendra Arhar-1/2, Bahar (देर), Pusa Arhar-16 (जल्दी, मशीन-कटाई)**; wilt/SMD-प्रतिरोध प्राथमिकता। चना: **Pusa-372, Avrodhi, JG-11, DCP-92-3**। (Medium/High.)

**Sowing & seed:** अरहर जून-जुलाई (जल्दी किस्म); चना अक्टूबर-नवंबर। Rhizobium + PSB + fungicide उपचार; ridge जल-निकासी।

**Fertilizer + growth:** दलहन — कम N; DAP/SSP (P+S) basal + Rhizobium; Zn/B जहाँ कमी।

**Irrigation:** मुख्यतः वर्षा/सीमित; critical flowering व pod-filling; जलभराव wilt बढ़ाता है।

**Pests:** **Pod borer (Helicoverpa — मुख्य), Pod fly, Plume moth, Maruca** → Chlorantraniliprole/Emamectin/Indoxacarb class + pheromone trap + NPV (bio); flowering पर monitor।

**Diseases:** **Fusarium wilt, Sterility Mosaic (SMD — अरहर), Phytophthora blight; चना: Ascochyta/wilt** → प्रतिरोधी किस्म + बीज उपचार (Trichoderma) + फसल चक्र मुख्य।

**Weeds:** PRE Pendimethalin + hand weeding; POST imazethapyr (चना/कुछ दलहन लेबल)।

**Farmer FAQ (≤5):**
1. फली में कीड़ा (pod borer)? → trap + diamide/NPV फूल-अवस्था पर।
2. पौधा मुरझाया (wilt)? → प्रतिरोधी किस्म + फसल चक्र, उखाड़ें।
3. कौन सी किस्म? → जल्दी अरहर Pusa Arhar-16/UPAS-120।
4. N कितना? → कम — दलहन खुद N बनाती है, Rhizobium डालें।
5. पानी? → फूल व फली पर तनाव न हो।

---

### C19. Moong / Green Gram (मूंग) — Pulses, *Vigna radiata*

**Varieties (UP):** **IPM-02-3, IPM-02-14, Samrat, Pusa Vishal, Pusa-9531, SML-668, Virat, MH series**; **zaid (ग्रीष्म) मूंग UP में लोकप्रिय** (गेहूँ के बाद), जल्दी-एकसमान पकने वाली किस्में। (High.)

**Sowing & seed:** zaid मार्च-अप्रैल (सिंचित, गेहूँ के बाद) व kharif जुलाई; seed ~6–8 kg/acre (zaid अधिक); Rhizobium + fungicide उपचार।

**Fertilizer + growth:** कम N; DAP/SSP basal + Rhizobium; Sulphur/Zn जहाँ कमी।

**Irrigation:** zaid में 3–4 सिंचाई; critical flowering व pod-filling।

**Pests:** **Whitefly (YMV वाहक — मुख्य), Thrips, Pod borer, jassid** → whitefly/thrips: systemic (thiamethoxam/diafenthiuron class); borer: diamide।

**Diseases:** **Yellow Mosaic Virus (MYMV — मुख्य पीली-चितकबरी), Cercospora leaf spot, Powdery mildew** → YMV: प्रतिरोधी किस्म + whitefly नियंत्रण; leaf spot/PM: Mancozeb/triazole।

**Weeds:** short-duration → early hand weeding/Pendimethalin PRE; imazethapyr per label।

**Farmer FAQ (≤5):**
1. पत्ती पीली-चितकबरी (YMV)? → whitefly रोकें + प्रतिरोधी किस्म (IPM/Samrat)।
2. zaid में कब बोऊँ? → गेहूँ कटाई के तुरंत बाद, मार्च-अप्रैल।
3. कितनी सिंचाई? → zaid में 3–4, फूल/फली पर ज़रूरी।
4. फली में कीड़ा? → diamide फूल-अवस्था पर।
5. एक-साथ पकने की किस्म? → IPM-02-14/SML-668।

---

### C20. Mango (आम) — Fruits, *Mangifera indica*

> UP आम का बड़ा राज्य (**दशहरी — मलिहाबाद/लखनऊ बेल्ट**)। बहुवर्षीय — dossier orchard-focused।

**Varieties (UP):** **Dashehari (मुख्य), Langra, Chausa, Bombay Green (जल्दी), Amrapali (dwarf, regular bearer), Mallika**; व्यावसायिक बाग़ में Amrapali high-density। (High.)

**Sowing/planting:** grafted पौधा बरसात (जुलाई-अगस्त) या फ़रवरी; spacing 10×10 m (Amrapali 2.5×2.5 m high-density)।

**Fertilizer + growth:** उम्र-आधारित N:P:K + FYM साल में; फूल-पूर्व (अक्टूबर-नवंबर) पोषण; **alternate/biennial bearing समस्या** — पोषण व PGR (paclobutrazol — केवल विशेषज्ञ/लेबल अनुसार, अंधाधुंध नहीं) से प्रबंधन।

**Irrigation:** fruit-set व fruit-development पर; **फूल आने से ठीक पहले सिंचाई रोकना flowering को मदद** (established बाग़); नए पौधे नियमित।

**Pests:** **Mango Hopper (भुनगा — फूल पर, मुख्य), Mealybug (तने चढ़ते — sticky band से रोकें), Fruit fly, Stem borer, Shoot gall** → hopper: फूल-अवस्था पर Imidacloprid/Thiamethoxam class (मधुमक्खी-सुरक्षा); fruit fly: methyl-eugenol trap।

**Diseases:** **Powdery mildew (फूल पर सफ़ेद — दाना गिराता), Anthracnose (फल/पत्ती काला), Malformation (गुच्छा-विकृति)** → PM: sulphur/triazole (Hexaconazole) फूल-पूर्व; Anthracnose: Copper/Carbendazim/Azoxystrobin class; malformation: रोगग्रस्त panicle हटाएँ।

**Weeds:** basin साफ़ + mulching; अंतर-फसल दलहन।

**Farmer FAQ (≤5):**
1. फूल पर सफ़ेद पाउडर, दाना गिर रहा (PM)? → sulphur/hexaconazole फूल-पूर्व स्प्रे।
2. फूल पर फुदकने वाले कीड़े (hopper)? → फूल पर systemic, मधुमक्खी बचाकर।
3. हर दूसरे साल फल (biennial)? → पोषण संतुलन; paclobutrazol केवल विशेषज्ञ सलाह।
4. फल पर काला (anthracnose)? → copper/azoxystrobin + तुड़ाई-उपचार।
5. कौन सी किस्म? → UP को दशहरी/आम्रपाली (नियमित फल)।

---

### C21. Banana (केला) — Fruits, *Musa* spp.

> UP में बढ़ता क्षेत्र (कुशीनगर/पूर्वी UP)। tissue-culture आधारित।

**Varieties (UP):** **Grand Naine (G-9 — प्रमुख tissue-culture), Robusta, Dwarf Cavendish, Poovan/Ney Poovan, Red Banana (विशेष)**। (High.)

**Planting:** **tissue-culture पौधे सर्वोत्तम (रोगमुक्त, एकसमान)**; UP में जून-जुलाई/फ़रवरी; spacing ~1.8×1.8 m (या high-density paired)। drip + fertigation आदर्श।

**Fertilizer + growth:** भारी feeder — उच्च N व **K (उपज/गुणवत्ता की कुंजी)** + FYM; fertigation में split; Zn/B micronutrient; bunch पर पोषण। propping (सहारा) + desuckering।

**Irrigation:** नियमित (drip); जल-तनाव व जलभराव दोनों घातक; bunch-development पर कमी न हो।

**Pests:** **Pseudostem weevil, Rhizome weevil, Aphid (BBTV वायरस वाहक), Nematodes** → weevils: लेबल soil/pseudostem treatment + सफ़ाई; nematode: रोगमुक्त पौधा + soil health।

**Diseases:** **Panama wilt (Fusarium — TR/race, विनाशकारी), Sigatoka leaf spot, Bunchy top (BBTV — वायरस), Anthracnose (फल)** → Panama: प्रतिरोधी/tissue-culture + soil sanitation (रासायनिक इलाज सीमित); Sigatoka: Mancozeb/Propiconazole + oil; BBTV: रोगग्रस्त पौधा हटाएँ + aphid control।

**Weeds:** mulching (केला-अवशेष) + hand weeding; basin साफ़।

**Farmer FAQ (≤5):**
1. पौधा पीला-मुरझाया, तना फटा (Panama)? → उखाड़ें+नष्ट, वहाँ दोबारा केला नहीं, tissue-culture/प्रतिरोधी।
2. ऊपर गुच्छा-सी पत्तियाँ (bunchy top)? → वायरस — पौधा हटाएँ + aphid रोकें।
3. K क्यों ज़रूरी? → घौद का आकार/गुणवत्ता बढ़ाता है।
4. कौन सा पौधा लगाऊँ? → tissue-culture G-9।
5. पत्ती धब्बे (Sigatoka)? → Mancozeb/propiconazole + तेल।

---

### C22. Grapes (अंगूर) — Fruits, *Vitis vinifera*

> **UP note:** अंगूर मुख्यतः महाराष्ट्र/कर्नाटक/उत्तर (पंजाब-हरियाणा)। UP में सीमित; **state-specific — स्थानीय बागवानी विभाग/KVK प्राथमिक।** North-India table-grape संदर्भ।

**Varieties (North India):** **Perlette (जल्दी, बीजरहित — उत्तर भारत मुख्य), Thompson Seedless, Flame Seedless, Beauty Seedless, Pusa Seedless, Sharad Seedless**। (Medium/High.)

**Planting:** ग्राफ्टेड/rooted cutting; जनवरी-फ़रवरी; pandal/bower या Y-trellis; **pruning (छँटाई) उपज की कुंजी** (उत्तर भारत में मुख्यतः एक फसल — जनवरी pruning)।

**Fertilizer + growth:** FYM + N:P:K उम्र/छँटाई-आधारित; K व micronutrients (Zn, B, Fe); PGR (GA3) berry-size को — **केवल विशेषज्ञ/लेबल अनुसार**।

**Irrigation:** drip आदर्श; critical — नई वृद्धि, flowering, berry-development; पकाई पर पानी घटाएँ (फटन/गुणवत्ता)।

**Pests:** **Thrips (flowering पर), Mealybug, Flea beetle, Mites** → thrips: Spinosad/Fipronil class flowering पर; mealybug: तने-band + लेबल दवा।

**Diseases:** **Downy mildew (मुख्य, नमी में), Powdery mildew, Anthracnose, Bacterial leaf spot** → DM: Mancozeb/Metalaxyl/copper class; PM: sulphur/triazole; निवारक schedule pruning-आधारित।

**Weeds:** drip-line साफ़ + mulching + inter-row cover।

**Farmer FAQ (≤5):**
1. पत्ती नीचे रुई-सी फफूँद (downy)? → Mancozeb/metalaxyl, नमी में पूर्व-छिड़काव।
2. छँटाई कब? → उत्तर भारत जनवरी (एक फसल)।
3. UP में लगाऊँ? → सीमित; पहले स्थानीय बागवानी विभाग से पुष्टि।
4. बड़ा दाना (berry size)? → GA3 केवल विशेषज्ञ सलाह पर।
5. कौन सी किस्म? → उत्तर भारत Perlette/Thompson Seedless।

---

## D. Priority backlog for app (build order after user approves implant)

क्रम प्रभाव × प्रयास पर आधारित। **"Implant" = इस research को app में structured data/module के रूप में डालना।**

**P0 — highest value, build first:**
1. **`crop × problem → treatment-class` structured dataset** (Section C का मशीन-रूप): fields = crop, problem_type (pest/disease/weed/deficiency), symptom_hindi, MoA_class, example_AI, ETL_note, legal_caveat, evidence_tier. यही Pest & Disease Solver + crop पेज दोनों को feed करेगा। *(Biggest reuse; single source of truth.)*
2. **Variety picker (UP-first)**: crop → duration/ecology filter → notified variety list (Section C "Varieties")। किसान-सवाल #6 सीधे हल।
3. **Legal caveat + evidence-tier component**: हर spray/dose लाइन के साथ auto "लेबल अनिवार्य" + tier badge (compliance + trust)।

**P1 — high value:**
4. **Tillering/growth honesty module (paddy-first)**: N-timing + Zn + water depth explainer; बाज़ारू टॉनिक के बारे में honest note (Section C1)।
5. **Stage-based irrigation reminder**: crop + sowing date → critical-stage सिंचाई push (UP canal/tubewell context)।
6. **Schemes hub (Section B)**: PM-KISAN, PMFBY, SMAM/यंत्र, KCC, PMKSY, गन्ना cane-portal deep-link; हर पर "दर बदलती है — verify" + आवेदन-रास्ता।

**P2 — enhancement:**
7. **Gundhi/UP-specific advisories** (खैरा-Zn, गुल्ली-डंडा resistance rotation, पराली/CRM yantra subsidy)।
8. **Sugarcane cane-portal (E-Ganna) integration** — UP का सबसे बड़ा cash-crop किसान-प्रश्न (पर्ची/भुगतान)।
9. **Fertilizer skeleton → soil-test adjust calculator** (Soil Health Card link)।
10. **Weather-linked spray-window** ("आज हवा/बारिश में स्प्रे न करें")।

**Data-quality guardrails (non-negotiable):**
- कोई illegal mix/अनुमोदन-रहित combo नहीं।
- हर रासायनिक लाइन: class + example AI + "लेबल अनिवार्य" + evidence tier।
- कोई सब्सिडी % hard-code नहीं जहाँ अनिश्चित — पोर्टल deep-link + "दर बदलती है"।
- वायरस रोगों (leaf-curl, YMV, CLCuV, bunchy top, Panama, red rot) पर "कोई रासायनिक इलाज नहीं — vector/किस्म प्रबंधन" स्पष्ट।

---

## E. Evidence tier notes & legal disclaimer

**Evidence tiers used above:**
- **High** — ICAR/SAU (GBPUAU Pantnagar, CSAUAT Kanpur, NDUAT Ayodhya, IIVR Varanasi, DOGR, DGR), KVK व सामान्य CIBRC-typical अनुशंसित practice से मेल खाने वाली, व्यापक-स्थापित जानकारी (अधिकांश variety नाम, सामान्य agronomy, प्रमुख कीट/रोग-श्रेणी, योजना नाम)।
- **Medium** — क्षेत्रीय रूप से सही पर UP-लोकल पुष्टि/नई किस्म-स्थिति (जैसे कुछ oilseed/millet/grape variety lists, Co 0238 red-rot advisory) जो समय/जिले पर बदल सकती है।
- **Low** — अनिश्चित/समय-संवेदी: **exact subsidy %/limits, KCC ब्याज दर, राज्य-विशेष योजना दायरा, UP "तारबंदी" योजना की मौजूदगी, बाज़ारू PGR/टॉनिक दावे।** इन्हें app में "verify on official portal / जिला कृषि कार्यालय" के साथ दिखाएँ।

**महत्वपूर्ण सीमाएँ / चेतावनी:**
1. यह deliverable कृषि-विस्तार *मार्गदर्शन* है, **नुस्खा/prescription नहीं**। अंतिम खुराक, फसल-अनुमोदन, PHI व मिश्रण-निषेध हमेशा **product label + CIBRC पंजीकरण + स्थानीय कृषि अधिकारी/KVK** से तय हों।
2. रासायनिक नाम **class + example AI** के रूप में — डीलर पर उपलब्ध ब्रांड भिन्न हो सकते हैं; **लेबल अनिवार्य**।
3. **कीटनाशक-प्रतिरोध (resistance)** से बचने हेतु MoA rotation ज़रूरी (विशेष: DBM, Phalaris, whitefly, pink bollworm, Tuta)।
4. **मधुमक्खी/परागण संरक्षण**: फूल-अवस्था पर छिड़काव सुबह/शाम, मधुमक्खी-सुरक्षित AI।
5. **वायरस रोगों का रासायनिक इलाज नहीं** — केवल vector (whitefly/aphid/hopper) नियंत्रण + प्रतिरोधी किस्म + रोगग्रस्त पौधा हटाना।
6. सब्सिडी/वित्त जानकारी **समय-संवेदी** — आवेदन-तिथि, दर, पात्रता आधिकारिक पोर्टल पर बदलती है; app को हमेशा deep-link + तिथि-चेतावनी दिखानी चाहिए।
7. State-specific flags: **cotton (UP प्रमुख नहीं), grapes (UP सीमित), तारबंदी (मुख्यतः राजस्थान)** — इन पर UP किसान को स्थानीय KVK/विभाग प्राथमिक।

*तैयार: Agriveda Phase 1 deep-research — 22 app crops (`data/crop-catalog.ts`) + cross-cutting schemes/KCC/mechanization। No app code modified.*
