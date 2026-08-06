# Agriveda Farmer Needs — Phase 3: Paddy / Rice Deep Dossier (धान बहुत गहरा)

> **Scope note:** This is a product/agronomy research deliverable, **not** app code. It is the user-chosen **Phase 3** option — *"पहले धान बहुत गहरा"* — an **exhaustive, single-crop deep dive on Paddy / Rice (*Oryza sativa*)** for Indian smallholders, **Uttar Pradesh first**, then the major India rice belts. It deliberately expands **far beyond** the paddy dossier in [Phase 1 §C1](./farmer-needs-phase1-up-app-crops.md#c1-paddy--rice-धान--cereals-oryza-sativa) and the [Phase 2 §C1 delta](./farmer-needs-phase2-india-major-crops.md). Where Phase 1/2 said it in one line, this file says it in a section.
>
> **Relationship to earlier phases:** Phase 1 = 22 app crops, UP-first, with a *thin* paddy entry. Phase 2 = pan-India ~40 crops, paddy got only a short delta (SRI, gall midge, false smut, tungro, Sub1). **Phase 3 is the full paddy manual.** Cross-cutting schemes/KCC/mechanization are NOT repeated here — see [Phase 1 §B](./farmer-needs-phase1-up-app-crops.md#b-cross-cutting-schemes-kcc-tractorimplementsfencing-subsidies-up--india). Only paddy-specific scheme context (parali/CRM, SRI/DSR push) appears here (§12).
>
> **⚠️ Universal legal disclaimer (applies to EVERY spray / dose / variety / scheme line below):**
> - रासायनिक सिफ़ारिश केवल **श्रेणी (MoA / chemistry group) + उदाहरण active ingredient (AI)** के रूप में है। **लेबल अनिवार्य** — डोज़, PHI (कटाई-पूर्व अंतराल), फसल-अनुमोदन व मिश्रण-निषेध हमेशा **product label + CIBRC पंजीकरण + स्थानीय कृषि अधिकारी / KVK** से तय करें। **लेबल व स्थानीय कृषि अधिकारी अंतिम प्रमाण।**
> - किसी भी **अवैध / अ-अनुमोदित मिश्रण (illegal cocktail)** की सिफ़ारिश नहीं की गई। एक बार में एक लक्षित समस्या का समाधान बेहतर व सुरक्षित।
> - खुराक (kg/acre, ml/l) यहाँ **स्किलेटन / सांकेतिक** हैं — **मिट्टी जाँच (Soil Health Card) + लेबल के अनुसार समायोजित करें।** ये prescription नहीं, extension *guidance* हैं।
> - **कोई नकली सब्सिडी % / MSP राशि नहीं** — दर बदलती रहती है, आधिकारिक पोर्टल पर verify।
> - **वायरस रोग (tungro आदि) का कोई सीधा रासायनिक इलाज नहीं** — केवल vector (leafhopper) नियंत्रण + प्रतिरोधी किस्म + रोगग्रस्त पौधा हटाना।
> - Evidence tiers (**High / Medium / Low**) §15 में परिभाषित; जहाँ Low/Medium, वहाँ inline चिह्नित।

---

## Table of contents

1. [Rice ecology & how to think about paddy choices](#1-rice-ecology--how-to-think-about-paddy-choices)
2. [Varieties by ecology, duration & grain type (with किसान नाम)](#2-varieties-by-ecology-duration--grain-type-with-किसान-नाम)
3. [Establishment: nursery, transplanting, DSR, SRI — calendars, seed rate, spacing](#3-establishment-nursery-transplanting-dsr-sri--calendars-seed-rate-spacing)
4. [Tillering & growth — honest science (कल्लों का फुटाव, बढ़वार) + PGR truth](#4-tillering--growth--honest-science-कल्लों-का-फुटाव-बढ़वार--pgr-truth)
5. [Fertilizer full skeleton — NPK stages, Zn, Fe, organics, overuse risks](#5-fertilizer-full-skeleton--npk-stages-zn-fe-organics-overuse-risks)
6. [Irrigation & water — critical stages, AWD vs flooding, rainfed](#6-irrigation--water--critical-stages-awd-vs-flooding-rainfed)
7. [Weeds — major weeds + PRE/POST herbicides (class + AI) + hand weeding](#7-weeds--major-weeds--prepost-herbicides-class--ai--hand-weeding)
8. [Pests — ETL, MoA classes + example AIs, resistance & stewardship](#8-pests--etl-moa-classes--example-ais-resistance--stewardship)
9. [Diseases — conditions & management (variety + chemistry class)](#9-diseases--conditions--management-variety--chemistry-class)
10. [Nutrient disorders that look like disease (Zn, Fe, K, S, P + toxicities)](#10-nutrient-disorders-that-look-like-disease-zn-fe-k-s-p--toxicities)
11. [Harvest, lodging, milling quality & moisture](#11-harvest-lodging-milling-quality--moisture)
12. [Basmati vs common rice — package differences farmers confuse](#12-basmati-vs-common-rice--package-differences-farmers-confuse)
13. [Parali / residue / Happy Seeder / legal burn-ban (NW India)](#13-parali--residue--happy-seeder--legal-burn-ban-nw-india)
14. [Farmer Q&A — 32 real Hindi questions → short answers](#14-farmer-qa--32-real-hindi-questions--short-answers)
15. [Data model suggestion for Agriveda (fields only — NOT implement)](#15-data-model-suggestion-for-agriveda-fields-only--not-implement)
16. [Evidence tiers & legal disclaimer](#16-evidence-tiers--legal-disclaimer)

---

## 1. Rice ecology & how to think about paddy choices

किसान का असली सवाल कभी "*Oryza sativa* की कौन सी किस्म?" नहीं होता — वह होता है *"मेरे खेत में पानी कितना रुकता है, बारिश पर हूँ या नलकूप पर, ज़मीन ऊसर तो नहीं, और बासमती का भाव मिलेगा या नहीं?"* इसलिए हर paddy सलाह की **पहली छँटाई ecology (परिस्थिति) से होती है, किस्म-नाम से नहीं।** नीचे वह मानसिक नक्शा है जिससे app को farmer को छाँटना चाहिए।

### 1.1 Rice ecologies (परिस्थिति) — the master filter

| Ecology (परिस्थिति) | पानी की स्थिति | कहाँ (India / UP) | किस्म-प्राथमिकता | Evidence |
|---|---|---|---|---|
| **Irrigated transplanted (सिंचित रोपाई)** | नलकूप/नहर, खड़ा पानी नियंत्रित | पश्चिम UP, पंजाब, हरियाणा, AP-TG delta, TN delta | उच्च-उपज अर्ध-बौनी + hybrids + basmati | High |
| **Rainfed lowland (वर्षा-निचली)** | बारिश पर, खेत में पानी रुकता | पूर्वी UP, बिहार, WB, ओडिशा, असम | मध्यम-अवधि, कुछ submergence-सहन | High |
| **Rainfed upland / aerobic (वर्षा-ऊँची/एरोबिक)** | बिना खड़े पानी, DSR-जैसा | झारखंड, छत्तीसगढ़ पठार, बुंदेलखंड, पूर्वी UP टीले | जल्दी, सूखा-सहन, aerobic | High |
| **Deepwater / flood-prone (गहरा पानी/बाढ़)** | 50 cm–कई फ़ुट, अचानक डूब | पूर्वी UP तराई-नीचट, बिहार कोसी, WB, असम | submergence Sub1 किस्में | High |
| **Coastal / inland saline-sodic (ऊसर/लवणीय)** | खारा/सोडिक (ऊँचा pH/ESP) | पूर्वी UP ऊसर बेल्ट (रायबरेली/सुल्तानपुर/अमेठी), coastal OD/WB/TN | salt-tolerant CSR/Narendra Usar | High |
| **Boro / summer rice (गर्मी की धान)** | पूरी सिंचाई, जनवरी-मई | WB, असम, पूर्वी बिहार | boro-अनुकूल, ठंड-सहन nursery | Medium |

**Design line for app (किसान-facing):** पहले पूछो — *"आपके खेत में बारिश के बाद पानी रुकता है या निकल जाता है? नलकूप है या सिर्फ़ बारिश? ज़मीन ऊसर/खारी तो नहीं?"* — फिर किस्म सुझाओ।

### 1.2 Duration classes (अवधि) — the second filter

| Class (अवधि) | दिन (nursery→पकाव, मोटा) | कब चुनें | Evidence |
|---|---|---|---|
| **जल्दी / early (short)** | ~90–115 दिन | देर से रोपाई, धान-आलू/धान-सरसों double crop, पराली-समय बचाना, कम पानी | High |
| **मध्यम / medium** | ~120–140 दिन | सामान्य खरीफ, अच्छी उपज संतुलन | High |
| **देर / late (long)** | ~145–160+ दिन | जल्दी रोपाई, बासमती परंपरागत, deepwater | High |

**क्यों अहम:** धान-गेहूँ बेल्ट (NW India) में देर से पकने वाली धान = देर से गेहूँ बुवाई = गेहूँ उपज घटती **और** पराली जलाने का दबाव। इसलिए PR-126 जैसी **छोटी-अवधि** किस्में सरकार बढ़ावा दे रही हैं (कम पानी + जल्दी खेत खाली)। (High.)

### 1.3 Grain type (दाना/भाव) — the third filter

- **Non-basmati common (मोटा/महीन, PDS/घरेलू):** उपज-केंद्रित, MSP-आधारित। अधिकांश किसान।
- **Basmati (सुगंधित, निर्यात-भाव):** लंबा दाना + खुशबू; पश्चिम UP + पंजाब + हरियाणा GI बेल्ट; **कम N, कम पानी, कीटनाशक-अवशेष (MRL) अनुशासन** ज़रूरी (§12)।
- **Fine non-basmati (महीन, दक्षिण/पूर्व):** Sona Masoori (BPT-5204), Swarna — बाज़ार-पसंद महीन चावल।
- **Aromatic short-grain (क्षेत्रीय):** कालानमक (पूर्वी UP/सिद्धार्थनगर GI), जोहा (असम), गोविंदभोग/तुलाईपंजी (WB) — niche premium।

---

## 2. Varieties by ecology, duration & grain type (with किसान नाम)

> **How to read:** नाम वही रखे गए हैं जो किसान डीलर/KVK पर बोलते हैं (नाम)। किस्म-पोर्टफ़ोलियो **हर 3–5 साल बदलता है** (नई release + पुरानी में रोग-टूट) — इसलिए app को variety list **"as of" तारीख + KVK-verify** के साथ दिखानी चाहिए। Evidence: नाम अधिकतर **High**; "अभी सबसे अच्छी" जैसी दावेदारी **Medium** (जिले/साल पर निर्भर)।

### 2.1 Uttar Pradesh — notified / popular (UP-first)

| उपयोग / ecology | किस्में (किसान नाम) | अवधि | टिप्पणी | Evidence |
|---|---|---|---|---|
| **जल्दी, सिंचित/देर-रोपाई** | **PR-126, MTU-1010 (श्रीराम/"एमटीयू"), Pant Dhan-12, Narendra-359 (NDR-359), Sarju-52** | ~110–125 | double-crop व पराली-समय को उपयुक्त | High |
| **मध्यम, सिंचित** | **Pant Dhan-4/24, HUR-105, BPT-5204 (सोना मसूरी — पूर्वी UP लोकप्रिय), Sambha (Samba Mahsuri type)** | ~130–140 | अच्छी उपज + बाज़ार-पसंद महीन | High |
| **बासमती (पश्चिम UP GI)** | **Pusa Basmati-1121 ("ग्यारह-इक्कीस"), PB-1509 ("पंद्रह-नौ", जल्दी), PB-1718, PB-1401, PB-1637, PB-1692 (जल्दी), Pusa Basmati-6 (1401 पुराना)** | 1509 जल्दी ~120; 1121 लंबी | निर्यात-भाव; §12 पैकेज अलग | High |
| **Hybrid (उच्च-इनपुट)** | निजी hybrids (Arize, US, VNR, Sava आदि डीलर-ब्रांड) + सार्वजनिक **DRRH/PRH** | मध्यम | अधिक बीज-लागत, अच्छे प्रबंधन में उपज ↑ | Medium |
| **ऊसर / सोडिक-लवणीय (पूर्वी UP)** | **CSR-36, CSR-43, CSR-30 (basmati-type salt-tol), Narendra Usar Dhan-2/3, NDRK-5002** | मध्यम | जिप्सम + Zn के साथ; §10 | High |
| **सुगंधित शॉर्ट-ग्रेन (GI)** | **कालानमक (Kalanamak — सिद्धार्थनगर/तराई GI), Kalanamak-3/KN-3 (बौनी सुधरी)** | देर, प्रकाश-संवेदी | ऊँची किस्में गिरती हैं → बौनी सुधरी बेहतर | Medium |
| **submergence (तराई बाढ़)** | **Swarna-Sub1, Samba Mahsuri-Sub1, BINA Dhan-11** | मध्यम | ~2 सप्ताह डूब सह लेती | High |

### 2.2 Duration × ecology quick-pick (any belt)

| चाहिए | सुझाव-वर्ग (example नाम) |
|---|---|
| सबसे जल्दी खेत खाली + कम पानी | PR-126, MTU-1010, Sahbhagi Dhan (rainfed) |
| अच्छी उपज, सामान्य सिंचित | Swarna (MTU-7029), BPT-5204, HUR-105 |
| बासमती भाव | PB-1509 (जल्दी) / PB-1121 (लंबी, प्रीमियम) |
| बाढ़/डूब का डर | Swarna-Sub1, Samba Mahsuri-Sub1 |
| ऊसर/खारी ज़मीन | CSR-36/43, Narendra Usar-2/3 |
| सूखा/बिना खड़े पानी (aerobic/DSR) | Sahbhagi Dhan, DRR Dhan-42/44, MAS-946-1, CR Dhan-201/204 |

### 2.3 Major India rice states — distinctive varieties (brief)

> केवल वहीं जहाँ किस्म-चयन UP से **अलग/विशिष्ट** है। पूरी सूची स्थानीय SAU/KVK से।

| राज्य | प्रमुख/विशिष्ट किस्में (नाम) | खास बात | Evidence |
|---|---|---|---|
| **Punjab (PB)** | **PR-126, PR-121, PR-131, Pusa-44 (लंबी — सरकार हतोत्साहित, ज़्यादा पानी/पराली), PB-1509/1121/1847 (बासमती)** | **Pusa-44 से PR-126 की ओर shift (पानी + पराली)**; heavy DSR push | High |
| **Haryana (HR)** | PR-सीरीज़ + बासमती (1509/1121/1718/1401); traditional CSR-30 basmati salt-tol | बासमती GI बेल्ट; DSR | High |
| **Andhra Pradesh (AP)** | **BPT-5204 (Samba Mahsuri), MTU-1010, MTU-7029 (Swarna), NLR/RGL सीरीज़** | delta, दो फसल, महीन दाना | High |
| **Telangana (TG)** | **Telangana Sona (RNR-15048 — slender, कम chalky, लोकप्रिय), MTU-1010, BPT-5204** | RNR-15048 बहुत चला | High |
| **Odisha (OD)** | **Swarna, Swarna-Sub1, Pooja, CR Dhan सीरीज़, Lalat, Pratikshya** | rainfed lowland + submergence + coastal saline | High |
| **West Bengal (WB)** | **Swarna, IET-4786 (Shatabdi), MTU-7029, Gobindobhog/तुलाईपंजी (सुगंधित GI), boro किस्में** | aman/aus/boro तीन मौसम; सुगंधित premium | High |
| **Bihar (BR)** | Swarna, Swarna-Sub1, Rajendra सीरीज़, BPT-5204; sadabahar/कतरनी (सुगंधित GI) | बाढ़-प्रवण → Sub1; कतरनी niche | High |
| **Jharkhand (JH)** | **Sahbhagi Dhan (सूखा-सहन), IR-64 Drought, Lalat, अपलैंड किस्में** | upland/aerobic, सूखा-प्रवण | High |
| **Assam (AS)** | **Ranjit, Bahadur, Ranjit-Sub1, जोहा (सुगंधित), boro किस्में; Bao (deepwater)** | बाढ़ + deepwater + boro; जोहा premium | High |
| **Tamil Nadu (TN)** | **ADT-43/45/37/51, CO-51, TKM-9, Bhavani, ASD सीरीज़** | delta multi-season, **SRI बहुत आम** | High |
| **Kerala (KL)** | **Uma (Mo-16), Jyothi, Jaya, Pokkali (खारा-सहन landrace — निचली तटीय)** | Kuttanad below-sea-level + Pokkali saline | Medium/High |
| **Karnataka (KA)** | **BPT-5204 (Sona Masoori — बहुत बड़ा), Jaya, Jyothi, IR-64, MTU-1001** | Sona Masoori बाज़ार-पसंद | High |
| **Maharashtra (MH)** | **Indrayani (सुगंधित, पश्चिम MH लोकप्रिय), Ambemohar (पारंपरिक सुगंधित), Karjat सीरीज़, Ratna** | Konkan + घाट; Indrayani/Ambemohar premium | Medium/High |

### 2.4 Stress-tolerant "special-purpose" varieties (cross-cutting)

- **Submergence / बाढ़ (Sub1 gene):** Swarna-Sub1, Samba Mahsuri-Sub1, Ranjit-Sub1, BINA Dhan-11 — ~10–17 दिन पूर्ण डूब सह लेती हैं (बाढ़-प्रवण तराई/कोसी/डेल्टा को)। (High.)
- **Salinity / sodicity (ऊसर):** CSR-36, CSR-43, CSR-30 (basmati salt-tol), Narendra Usar Dhan-2/3, coastal Pokkali (KL) — जिप्सम/Zn सुधार के साथ। (High.)
- **Drought / upland (सूखा-aerobic):** Sahbhagi Dhan, DRR Dhan-42/44, MAS-946-1, CR Dhan-201/204 — कम/अनिश्चित बारिश, DSR/aerobic को। (High.)
- **Biofortified (पोषण):** CR Dhan-310/315 (उच्च प्रोटीन), Zinc rice (DRR Dhan-45/49, CR Dhan-311) — पोषण-कार्यक्रम/NFSM push। (Medium.)
- **Herbicide-tolerant (DSR-अनुकूल):** Imazethapyr-tolerant "Clearfield-type" rice किस्में (कुछ निजी/सार्वजनिक) — **केवल matched herbicide + लेबल के साथ; बिना-अनुमोदन नहीं।** (Medium; stewardship-संवेदनशील।)

---

## 3. Establishment: nursery, transplanting, DSR, SRI — calendars, seed rate, spacing

धान लगाने के **चार बड़े तरीके** हैं — किसान अक्सर इन्हें मिला देते हैं। हर तरीके का बीज-दर, पौध-उम्र, spacing व पानी अलग है।

### 3.1 पद्धति-तुलना (method comparison)

| पद्धति | संक्षेप | बीज-दर (मोटा) | पौध-उम्र | खास लाभ | खास जोखिम | Evidence |
|---|---|---|---|---|---|---|
| **Transplanting — normal (सामान्य रोपाई)** | नर्सरी → 20–30 दिन पौध → कीचड़ खेत में रोपाई | ~12–20 kg/acre (नर्सरी बीज) | 20–25 दिन (जल्दी किस्म), 25–30 (मध्यम/देर) | खरपतवार दमन, स्थापित फसल | मज़दूरी अधिक, पानी अधिक | High |
| **DSR — dry direct-seeded (सूखी सीधी बुवाई)** | सूखे/तर खेत में drill से बीज सीधे | ~8–12 kg/acre | — (नर्सरी नहीं) | पानी + मज़दूरी + समय बचत, जल्दी खेत खाली | **खरपतवार सबसे बड़ी चुनौती; लोहा/Zn कमी; समतल खेत ज़रूरी** | High |
| **Wet-DSR / drum-seeder (तर सीधी बुवाई)** | कीचड़ खेत में अंकुरित बीज drum से | ~8–10 kg/acre | — | पानी बचत, मज़दूरी कम | पक्षी/शैवाल, समतलन ज़रूरी | Medium |
| **SRI (श्री विधि)** | 8–12 दिन की एकल पौध, चौड़ा spacing, नमी (बिना खड़े पानी), कोनो-वीडर | **~2–3 kg/acre (बहुत कम)** | **8–15 दिन (बहुत छोटी)** | कम बीज/पानी, अधिक कल्ले/उपज संभावित | श्रम/निराई-कौशल, सटीक जल-प्रबंधन | Medium/High |

### 3.2 Belt-wise calendar (broad — मानसून/नहर पर shift)

| बेल्ट | नर्सरी | रोपाई / DSR बुवाई | कटाई (मोटा) |
|---|---|---|---|
| **पश्चिम UP / पंजाब / हरियाणा (सिंचित, बासमती)** | मई-जून (नॉन-बासमती जल्दी); बासमती जून | जून-अंत–जुलाई (रोपाई); **DSR जून की शुरुआत** | अक्टूबर-नवंबर |
| **पूर्वी UP / बिहार / WB (rainfed lowland)** | जून (मानसून-पूर्व) | जुलाई (मानसून पर) | अक्टूबर-नवंबर |
| **AP-TG / TN delta (multi-season)** | खरीफ जून-जुलाई; रबी/samba अलग | जुलाई-अगस्त; delta रबी दिसं-जन | नवंबर + मार्च-अप्रैल |
| **WB/असम boro (गर्मी धान)** | नवंबर-दिसंबर | जनवरी-फ़रवरी | अप्रैल-मई |

> **UP-specific नियम:** धान-गेहूँ चक्र में **देर रोपाई से बचें** — जुलाई-मध्य तक रोपाई पूरी हो, वरना धान देर से पकेगी → गेहूँ देर → दोनों उपज घटेंगी + पराली जलाने का दबाव। छोटी-अवधि किस्म (PR-126) देर-रोपाई/समय-बचत को।

### 3.3 Nursery (नर्सरी) — key numbers

- **क्षेत्र:** ~1 एकड़ रोपाई के लिए ~4–5 सेंट (≈0.04 एकड़) नर्सरी (मोटा)।
- **बीज उपचार (अनिवार्य आदत):** नमक-पानी से भरे बीज छाँटना (bold बीज) → फिर fungicide (उदा. **carbendazim/tricyclazole class** या **Trichoderma** बायो) + जहाँ ज़रूरी **bakanae** के लिए बीज उपचार। बासमती में bakanae (foolish seedling) आम — बीज उपचार अहम (§9)।
- **Zn नर्सरी टिप:** नर्सरी में ही Zn कमी दिखे (खैरा) तो zinc sulphate का हल्का छिड़काव; स्वस्थ पौध = अच्छा tillering।

### 3.4 Plant population & spacing (पौध-संख्या)

| पद्धति | spacing | पौध/हिल | लक्ष्य hills |
|---|---|---|---|
| सामान्य रोपाई | **20 × 15 cm** (या 20×10 सघन) | 2–3 पौध | ~33 hills/m² (मोटा) |
| देर-रोपाई | 15 × 15 cm (सघन, कम tillering भरपाई) | 3–4 पौध | अधिक |
| SRI | **25 × 25 cm** (चौड़ा) | **1 पौध** | ~16 hills/m² पर अधिक कल्ले/पौधा |
| DSR (drill) | पंक्ति ~20–22.5 cm | बीज-प्रवाह | पौध-दर seed-rate-आधारित |

**किसान-facing (Hindi):** "मोटा-मोटा नियम: **20×15 सेमी**, हर जगह 2–3 पौध। देर से रोपाई हो तो थोड़ा सघन लगाएँ। SRI में सिर्फ़ **एक** छोटी पौध, पर दूरी ज़्यादा।"

---

## 4. Tillering & growth — honest science (कल्लों का फुटाव, बढ़वार) + PGR truth

> यह किसान का **#1 सवाल** है: *"कल्ले नहीं फूट रहे, बढ़वार कम है — कौन सा टॉनिक/स्प्रे डालूँ?"* ईमानदार जवाब बाज़ारू टॉनिक नहीं, बल्कि **पाँच असली लीवर** हैं। Agriveda की साख इसी honesty पर टिकेगी।

### 4.1 कल्ले (tiller) कैसे बनते हैं — बुनियाद

धान रोपाई/अंकुरण के बाद **active tillering** अवस्था (~रोपाई के 20–40 दिन बाद, किस्म-अनुसार) में मुख्य तने की गाँठों से नए कल्ले निकालता है। हर **productive tiller = एक बाली (panicle) = दाने।** अनुत्पादक (देर से निकले) कल्ले सिर्फ़ पोषण खाते हैं, बाली नहीं देते। इसलिए लक्ष्य है **समय पर, स्वस्थ, उत्पादक कल्ले** — न कि सिर्फ़ "ज़्यादा" कल्ले।

### 4.2 पाँच असली लीवर (evidence-tiered)

| # | लीवर | क्या करें | असर | Evidence |
|---|---|---|---|---|
| **(a)** | **किस्म की जेनेटिक्स** | कल्ला-क्षमता किस्म में तय है; hybrid/कुछ किस्में कम-पर-भारी कल्ले, कुछ अधिक | स्प्रे से नहीं बदलती | **High** |
| **(b)** | **Nitrogen की timing (सबसे बड़ा लीवर)** | N को split करो; **active tillering (~रोपाई+21–25 दिन) पर top-dress सबसे असरदार** | समय पर N = अधिक उत्पादक कल्ले; देर से N = सिर्फ़ पत्ती/रोग | **High** |
| **(c)** | **Zinc कमी सुधार (खैरा)** | खैरा दिखे तो **zinc sulphate** मिट्टी/छिड़काव | Zn कमी बढ़वार रोकती; सुधार पर लौटती | **High** |
| **(d)** | **पानी की गहराई** | tillering पर **उथला पानी (2–3 cm) या mid-season drainage/AWD** | गहरा खड़ा पानी कल्ले दबाता; उथला बढ़ाता | **High** |
| **(e)** | **spacing + खरपतवार** | सही दूरी + समय पर निराई (पहले 40 दिन weed-free) | भीड़/खरपतवार कल्ले घटाते | **High** |

### 4.3 खैरा (Zn deficiency) — पहचान व सुधार (UP में बहुत आम)

- **लक्षण (नाम — "खैरा रोग"):** रोपाई के 2–3 सप्ताह बाद निचली पत्तियों पर **जंग-रंग/भूरे धब्बे**, मध्य-शिरा पीली, पौधा बौना, कल्ले रुके, खेत में **धब्बेदार पीलापन** (patchy)। किसान इसे "रोग" समझकर fungicide डालते हैं — **यह पोषण-कमी है, फफूँदनाशक बेकार।**
- **कहाँ ज़्यादा:** ऊसर/सोडिक (ऊँचा pH), लगातार जलमग्न, अधिक P/चूना, लगातार धान-धान।
- **सुधार:** **Zinc sulphate** (heptahydrate ~10 kg/acre या monohydrate कम, मिट्टी में basal) + खड़ी फसल में कमी दिखे तो **ZnSO₄ का छिड़काव (थोड़े चूने/यूरिया घोल के साथ)**। रोकथाम > इलाज — basal में Zn डालें। (High.)

### 4.4 "बढ़वार टॉनिक" / PGR दावे — legal-safe, honest stance

> **यह section जानबूझकर सतर्क है — Agriveda को कभी बिना-अनुमोदन/over-claimed टॉनिक बेचता नहीं दिखना चाहिए।**

| उत्पाद-वर्ग | बाज़ार दावा | ईमानदार evidence | legal-safe रुख |
|---|---|---|---|
| **सामान्य "बढ़वार/कल्ला टॉनिक" (मिश्रित micronutrient + अज्ञात PGR)** | "कल्ले दुगुने" | **Low** — नियंत्रित परिस्थिति में कल्ला-वृद्धि का भरोसेमंद प्रमाण कमज़ोर; असर अक्सर छुपी Zn/N कमी के सुधार का | **इन पर पैसा न लगाएँ जब तक Zn/N ठीक न हो; कोई कल्ला-गारंटी नहीं** |
| **Gibberellic acid (GA₃)** | "बढ़वार/ऊँचाई" | कद बढ़ाता है पर **धान में उत्पादक-कल्ले/उपज नहीं बढ़ाता; बल्कि lodging/रोग जोखिम** | धान tillering के लिए **अनुशंसित नहीं**; केवल विशेष बीज-उत्पादन में विशेषज्ञ-निर्देशित |
| **Cytokinin/seaweed/humic biostimulants** | "जड़/कल्ले" | **Low/Medium** — कभी हल्का पूरक असर, पर N-timing/Zn का विकल्प नहीं | पूरक मान सकते हैं, **मूल समाधान नहीं**; label + अनुमोदन देखें |
| **"नैनो/चमत्कारी" अपंजीकृत उत्पाद** | बड़े दावे | कोई भरोसेमंद प्रमाण | **प्रोत्साहित न करें — CIBRC/लेबल-अनुमोदन ज़रूरी** |

**किसान-facing (Hindi, यही app में दिखे):** "कल्ले बढ़ाने का असली उपाय बाज़ारू टॉनिक नहीं है। तीन काम करें — (1) **समय पर नाइट्रोजन** (रोपाई के ~20–25 दिन पर यूरिया top-dress), (2) **खैरा दिखे तो ज़िंक सल्फेट**, (3) **tillering पर पानी उथला रखें/एक बार सुखाएँ**। किस्म की अपनी कल्ला-क्षमता होती है — उसे स्प्रे से नहीं बदल सकते। महँगे 'बढ़वार टॉनिक' पर पैसा लगाने से पहले ये तीन काम करें।"

---

## 5. Fertilizer full skeleton — NPK stages, Zn, Fe, organics, overuse risks

> **⚠️ स्किलेटन only** — वास्तविक मात्रा **मिट्टी जाँच (Soil Health Card) + किस्म (hybrid ज़्यादा माँगती) + ecology** पर निर्भर। नीचे मध्यम-उपज सिंचित non-basmati के लिए *सांकेतिक* ढाँचा। बासमती के लिए **N घटाएँ** (§12)।

### 5.1 अवस्था-वार NPK ढाँचा (transplanted, प्रति एकड़ सांकेतिक)

| अवस्था (timing) | N | P₂O₅ | K₂O | अन्य | नोट |
|---|---|---|---|---|---|
| **Basal (रोपाई के समय)** | ~⅓ N | **पूरा P** | ~½ K | **Zinc sulphate** (कमी-प्रवण खेत) | P व Zn साथ न मिलाएँ (fixation) — Zn अलग/छिड़काव |
| **Active tillering (~21–25 DAT)** | ~⅓ N | — | — | — | **कल्ले का मुख्य लीवर (§4)** |
| **Panicle initiation / PI (~40–50 DAT)** | ~⅓ N | — | ~½ K | — | बाली-संख्या/दाना-भराव को K व N यहाँ अहम |
| **(वैकल्पिक) heading** | हल्का N केवल कमी पर | — | — | — | देर से भारी N = रोग/lodging |

- **N स्रोत:** मुख्यतः यूरिया; **LCC (Leaf Colour Chart) / SPAD** से N-timing सटीक — पत्ती हरी हो तो N रोकें, पीली पड़े तो दें (over-use घटाता है)। (High.)
- **P स्रोत:** DAP/SSP (SSP से S भी मिलता); **पूरा basal** (धान में P स्थिर, बाद में कम असर)।
- **K स्रोत:** MOP; **split (basal + PI)** — K दाना-भराव, तना-मज़बूती (anti-lodging) व रोग-सहनशीलता बढ़ाता; भारत की बहुत मिट्टियों में K की अनदेखी होती है।

### 5.2 Micronutrients — Zn व Fe (UP/calcareous soils विशेष)

| तत्व | कमी-लक्षण (नाम) | कहाँ ज़्यादा | सुधार | Evidence |
|---|---|---|---|---|
| **Zinc (Zn)** | खैरा — जंग-भूरे धब्बे, बौनापन, कल्ले रुके (§4.3, §10) | ऊसर/सोडिक, जलमग्न, अधिक P/चूना, धान-धान | ZnSO₄ basal + छिड़काव | **High** |
| **Iron (Fe)** | नई पत्तियों की **शिराओं के बीच पीलापन (interveinal chlorosis)**, ऊपरी नई पत्ती सबसे पीली | **calcareous/ऊँचा pH, aerobic/DSR/upland (जहाँ खड़ा पानी नहीं → Fe घुलनशील कम)** | **FeSO₄ का छिड़काव** (मिट्टी में Fe अक्सर असरहीन ऊँचे pH पर); DSR में Fe कमी आम | **High** |
| **Sulphur (S)** | समान हल्का पीलापन (N-जैसा पर नई पत्तियों पर) | हल्की/बलुई, कम-organic | SSP/जिप्सम/ammonium sulphate | Medium |

> **महत्वपूर्ण:** पारंपरिक जलमग्न धान में Fe कमी दुर्लभ (जलमग्न मिट्टी Fe घोलती है), पर **DSR/aerobic/ऊँचे-pH में Fe कमी नई समस्या** — किसान इसे "पीला रोग" समझ लेता है। यह पोषण है, fungicide नहीं। (High — DSR-adoption के साथ बढ़ती।)

### 5.3 Organic / FYM

- **FYM/compost ~2–4 टन/एकड़ basal** — मिट्टी-संरचना, धीमा-N, micronutrient व Zn/Fe उपलब्धता सुधारता; लगातार रासायनिक-only खेती की भरपाई।
- **Green manure (ढैंचा/Sesbania):** रोपाई-पूर्व ढैंचा उगाकर मिट्टी में मिलाना = जैविक N + सुधरी मिट्टी (UP में परंपरागत, अब कम — बढ़ावा योग्य)।
- **Biofertilizers:** Azospirillum/BGA (blue-green algae)/Azolla धान में जैविक N पूरक (जलमग्न में Azolla उपयोगी)।

### 5.4 Overuse risks (अति के नुकसान — किसान को साफ़ बताएँ)

- **अधिक N:** गहरा-हरा भड़कीला पौधा जो **BPH, blast, sheath blight, BLB व false smut को न्यौता देता है**; तना कमज़ोर → **lodging (गिरना)**; बासमती की खुशबू/दाना-गुणवत्ता गिरती। *"ज़्यादा यूरिया = ज़्यादा कीड़ा-रोग + गिरी फसल।"*
- **N का गलत समय:** देर से (heading-बाद) N कल्ले नहीं, सिर्फ़ पत्ती/रोग बढ़ाता।
- **P की अति + Zn:** ज़्यादा P, Zn को बाँध देता → खैरा बढ़ता।
- **असंतुलन (N-only, K की अनदेखी):** कमज़ोर तना, रोग-संवेदनशील, दाना हल्का।

---

## 6. Irrigation & water — critical stages, AWD vs flooding, rainfed

धान को "हमेशा भरा पानी चाहिए" — यह **मिथक** है। धान बाढ़ **सह** सकता है, पर उसे हर समय गहरा पानी **चाहिए नहीं**। समझदार जल-प्रबंधन पानी बचाता **और** कल्ले/उपज सुधारता है।

### 6.1 Critical stages (जहाँ पानी की कमी सबसे महँगी)

| अवस्था | पानी की ज़रूरत | कमी का नुकसान |
|---|---|---|
| रोपाई-स्थापना (0–7 DAT) | उथला पानी | पौध सूखना |
| **active tillering** | उथला/नमी (गहरा नहीं) | गहरा = कल्ले दबे |
| **panicle initiation (PI)** — **सबसे नाज़ुक** | पर्याप्त नमी | बाली/स्पाइकलेट घटती |
| **flowering (फूल/perकींग)** — **सबसे नाज़ुक** | पानी की कमी बिल्कुल नहीं | बंध्यता (खाली दाना) |
| grain-filling (दाना-भराव) | नमी | हल्का/अधूरा दाना |
| पकाव (कटाई-पूर्व) | **पानी बंद ~7–10 दिन पहले** | देर से पानी = कटाई कठिन, दाना-गुणवत्ता |

**किसान नियम (Hindi):** "अगर पानी सीमित है तो **बाली बनने (PI) और फूल आने** के समय हरगिज़ कमी मत होने दो — यहीं दाना बनता या बिगड़ता है।"

### 6.2 AWD (Alternate Wetting & Drying) — पानी बचत बिना उपज-हानि

- **क्या है:** लगातार गहरा पानी रखने के बजाय, पानी को **खेत में सूखने दें जब तक ज़मीन में ~15 cm नीचे तक पानी उतरे** (perch/"पानी की नली"/pani-pipe से देखें), फिर दोबारा उथला भरें। (Safe-AWD.)
- **लाभ:** ~15–30% तक सिंचाई-पानी बचत; **methane उत्सर्जन कम; जड़ें गहरी; कल्ले बेहतर; कम BPH**; नलकूप-बिजली/डीज़ल खर्च घटता। (High.)
- **कब सावधानी:** **PI व flowering पर सूखने न दें** (safe-AWD में इन नाज़ुक अवस्थाओं पर पानी रखें); ऊसर/खारी ज़मीन में सावधानी।
- **किसान-facing:** "हर समय भरा पानी ज़रूरी नहीं। पानी सूखने पर फिर भरें (AWD) — डीज़ल/बिजली बचेगी, कल्ले भी अच्छे। बस **बाली व फूल** के समय पानी मत सूखने दें।"

### 6.3 Continuous flooding (लगातार खड़ा पानी) — कब उचित

- खरपतवार-दमन (गहरा पानी घास दबाता), ऊसर-सुधार, या जहाँ AWD-निगरानी संभव नहीं। पर **पानी/बिजली/methane महँगे** — जहाँ नलकूप-आधारित, AWD बेहतर।

### 6.4 Rainfed & DSR notes

- **Rainfed lowland:** बारिश-निर्भर; बीच-मानसून सूखा-अंतराल (dry spell) पर **PI/flowering बचाने को जीवनरक्षक सिंचाई** (जहाँ स्रोत हो)। submergence जोखिम → Sub1 किस्में।
- **DSR/aerobic:** खड़ा पानी नहीं; **समय पर हल्की सिंचाई + Fe/Zn कमी पर नज़र + खरपतवार सख़्त प्रबंधन**; बचत बड़ी पर प्रबंधन-अनुशासन ज़रूरी।

---

## 7. Weeds — major weeds + PRE/POST herbicides (class + AI) + hand weeding

> **खरपतवार धान की सबसे कम आँकी गई उपज-चोर हैं — खासकर DSR में #1 चुनौती।** पहले **40 दिन weed-free** रखना सबसे अहम। रासायनिक नाम **class + example AI**; **लेबल अनिवार्य**, अवस्था-मिलान ज़रूरी।

### 7.1 प्रमुख धान-खरपतवार (India/UP)

| प्रकार | खरपतवार (नाम) | कहाँ |
|---|---|---|
| **घास (grasses)** | **सांवक/सामा — Echinochloa (barnyard grass, "जंगली धान जैसा")**, Leptochloa, wild rice, crabgrass | सबसे हानिकारक, DSR में भारी |
| **मोथा (sedges)** | **मोथा — Cyperus (nutsedge/डिला)**, Fimbristylis | जलमग्न में आम |
| **चौड़ी पत्ती (broadleaf)** | Ammannia, Ludwigia (जल-प्रिमरोज़), Monochoria (घास-कमल), Sphenoclea, Marsilea (सुसनी) | जलमग्न/निचली |
| **समस्या-विशेष** | **Weedy rice / "करगा"/जंगली धान (crop-mimic — DSR में उभरती बड़ी समस्या)** | DSR — herbicide से नहीं मरती (धान-जैसी) |

### 7.2 Herbicide guidance (class + example AI + timing)

| समय/लक्ष्य | chemistry class | example AI | timing (मोटा) | नोट |
|---|---|---|---|---|
| **PRE (अंकुरण-पूर्व) — transplanted** | chloroacetamide | **Pretilachlor (safener-युक्त भी)** | रोपाई के 2–4 दिन बाद, नम खेत, 2–3 cm पानी | घास+कुछ मोथा |
| **PRE — DSR** | dinitroaniline / chloroacetamide / oxadiazole | **Pendimethalin**, **Oxadiazon**, Pyrazosulfuron (PRE-broadleaf/sedge) | बुवाई के 0–3 दिन (नम, weed-अंकुरण-पूर्व) | DSR में PRE ज़रूरी |
| **early POST (broad-spectrum)** | pyrimidinyl-benzoate (ALS) | **Bispyribac-sodium** | 15–25 DAS/DAT, 2–4 पत्ती weed | घास+मोथा+कुछ broadleaf; DSR/transplant दोनों |
| **POST — घास-केंद्रित** | ACCase / aryloxyphenoxy | **Cyhalofop-butyl**, Fenoxaprop | early POST घास पर | Echinochloa/Leptochloa |
| **POST — sedge/broadleaf** | ALS-sulfonylurea / triketone | **Bispyribac + Metsulfuron (लेबल-mix)**, Pyrazosulfuron, **Triafamone+Ethoxysulfuron (लेबल-ready mix)** | early POST | मोथा/चौड़ी पत्ती |
| **combination (DSR ready-mix)** | AI-निर्माता लेबल-mix | Penoxsulam+Cyhalofop, Bispyribac+... (लेबल-अनुमोदित तैयार mix) | early POST | **केवल पंजीकृत ready-mix — खुद न मिलाएँ** |

> **⚠️ Anti-cocktail नियम:** ऊपर mixes **केवल जहाँ निर्माता/CIBRC-पंजीकृत ready-mix** के रूप में उपलब्ध हों। किसान द्वारा **मनमाना herbicide-मिश्रण न करें** — फसल-जलन (phytotoxicity) व अवशेष जोखिम। एक बार में एक अवस्था-मिलान उत्पाद।

### 7.3 Weedy rice (जंगली/करगा धान) — DSR की खास चेतावनी

- यह **धान-जैसी** है → चुनिंदा herbicide इसे नहीं मारता (crop भी मर जाएगी)।
- प्रबंधन: **प्रमाणित/साफ़ बीज, पिछले खेत-इतिहास देखें, स्टेल-सीडबेड (बुवाई-पूर्व एक अंकुरण को उगाकर मारना), समय पर बाढ़/पानी, hand-rogue (उखाड़ना), फसल-चक्र।** herbicide-tolerant rice + matched herbicide एक विकल्प पर **stewardship ज़रूरी**। (Medium/High.)

### 7.4 Hand weeding / mechanical

- **समय:** पहला 15–20 दिन, दूसरा 35–40 दिन (weed-free window)।
- **SRI/transplant:** **कोनो-वीडर/rotary weeder** पंक्ति-रोपाई में असरदार + मिट्टी-वातन (कल्ले बढ़ाता)।
- **पानी:** transplant में **उथला खड़ा पानी खुद कई घास दबाता** — herbicide का पूरक।

---

## 8. Pests — ETL, MoA classes + example AIs, resistance & stewardship

> **सिद्धांत:** पहले **scouting/ETL** (आर्थिक-क्षति-सीमा), फिर IPM (light trap, बायो, प्रतिरोधी किस्म), फिर **ETL पार होने पर** लक्षित रासायनिक — **MoA rotate**, **कोई अवैध cocktail नहीं**, **मधुमक्खी/मित्र-कीट संरक्षण**। ETL मान क्षेत्र/किस्म/अवस्था पर बदलते — नीचे मोटे संकेत (verify with KVK)।

### 8.1 प्रमुख कीट — पहचान, ETL, chemistry

| कीट (नाम) | पहचान / नुकसान | ETL (मोटा, verify) | chemistry class → example AI | नोट / stewardship |
|---|---|---|---|---|
| **Yellow/tana Stem Borer (तना छेदक)** | वानस्पतिक: **dead heart (सूखा गोभ)**; बाली: **white ear/सफ़ेद बाली (खाली)** | ~1 egg-mass/m² या 5% dead heart; moth/light-trap | **Diamide → Chlorantraniliprole / Flubendiamide**; **Cartap hydrochloride**; granular **Chlorantraniliprole** | Trichogramma (bio) कार्ड; egg-mass हटाना; pyrethroid से बचें (resurgence) |
| **Leaf Folder (पत्ती लपेटक)** | पत्ती अनुदैर्ध्य मोड़, अंदर से खुरचन → सफ़ेद धारियाँ | ~1–2 ताज़ा-क्षति पत्ती/पौधा; boot-leaf बचाएँ | **Diamide (Chlorantraniliprole)**, **Cartap**, Flubendiamide | early N-भड़क घटाएँ; boot-leaf रक्षा अहम |
| **Brown Plant Hopper (BPH — भूरा फुदका)** | तने के **आधार** पर झुंड; **"hopper burn" — गोल पीला-सूखा धब्बा** खेत में | ~5–10 hopper/hill (tillering); बाद में कम | **Buprofezin (IGR)**, **Pymetrozine**, **Dinotefuran**, Flonicamid; **Triflumezopyrim (नया)** | **synthetic pyrethroid व अंधाधुंध कीटनाशक BPH भड़काते (resurgence) — सख़्त मना**; AWD + कम N + hill-आधार जाँच |
| **White-Backed Plant Hopper (WBPH — सफ़ेदपीठ फुदका)** | BPH-जैसा, अक्सर पहले | BPH-समान | BPH-जैसा | वही stewardship |
| **Gall Midge (गॉल मिज — "सिल्वर शूट/प्याज़-पत्ती")** | कल्ला **प्याज़-पत्ती/चांदी-नली** में बदल, बाली नहीं | biotype-आधारित; दक्षिण/पूर्व में अहम | **प्रतिरोधी किस्म मुख्य**; systemic (Cartap/Fipronil* per label) early | **प्रतिरोधी किस्म सबसे कारगर**; biotype जिले-अनुसार |
| **Rice Hispa (हिस्पा — काला काँटेदार भृंग)** | पत्ती पर **सफ़ेद समानांतर खुरचन-रेखाएँ**, grub सुरंग | पूर्वी UP/असम/WB में आम | label contact (per approval) | नई पत्ती-टिप कतरना; अधिक N घटाएँ |
| **Armyworm / Swarming caterpillar (सैनिक/लश्कर इल्ली)** | झुंड में पत्ती/बाली कतरना, अक्सर देर-रात/बादल में, **ear-cutting** पकाव पर | अचानक भारी → देखते ही | **Emamectin benzoate**, **Chlorantraniliprole**, Novaluron; poison-bait शाम को | निचले/जलभराव-बाद outbreak; रात-scouting |
| **Caseworm (केसवर्म/पत्ती-नाव)** | पत्ती के टुकड़े की **नाव/ट्यूब** में लार्वा, पानी पर तैरती; पत्ती खुरची | जलमग्न tillering में | पानी निकालकर + label; IGR/diamide | खेत का पानी निकालना असरदार |
| **Gundhi bug / Rice earhead bug (गंधी बग)** | **दूधिया-दाना (milky) अवस्था** पर रस चूसना → **खाली/धब्बेदार दाना, बदबू** | milky-dough पर ~1–2 bug/hill | label contact (per approval), शाम | दुर्गंध से पहचान; milky पर monitor |
| **Thrips (थ्रिप्स — नर्सरी/शुरुआती)** | पौध-पत्ती **नोक मुड़-चांदी**, नर्सरी में | सूखे-आरंभ में | systemic (per label) | अक्सर पानी-भरने पर कम |
| **Whorl/Rice root/Root-knot nematode** | जड़-गाँठ, DSR/aerobic में पीलापन/बौनापन | — | रोगमुक्त बीज, फसल-चक्र, soil health | DSR में बढ़ती |
| **Mealybug / Ear-cutting / cutworm (क्षेत्रीय)** | स्थानीय outbreak | — | scouting-आधारित label | जिला-अनुसार |

\*Fipronil व कुछ AI phase-out/प्रतिबंध-समीक्षा के दायरे में आ सकते — **वर्तमान CIBRC पंजीकरण व लेबल ही अंतिम।**

### 8.2 Resistance & stewardship (साफ़ नियम)

1. **BPH/WBPH resurgence:** synthetic pyrethroid व broad-spectrum कीटनाशकों का अंधाधुंध छिड़काव मित्र-कीट (मकड़ी/mirid) मारकर **BPH भड़काता** — सबसे बड़ा किसान-गलती। कम N + AWD + IGR/चुनिंदा AI + hill-base scouting।
2. **MoA rotation:** stem borer/leaf folder में diamide हर बार न दोहराएँ; Cartap/अन्य class से घुमाएँ।
3. **कोई अवैध cocktail नहीं:** "एक टंकी में 3–4 दवा" = अवशेष, phytotoxicity, resistance, बासमती-निर्यात-अस्वीकृति जोखिम। एक लक्षित उत्पाद।
4. **मधुमक्खी/मित्र-कीट:** ज़रूरत-आधारित छिड़काव; व्यापक prophylactic spray न करें।
5. **PHI / MRL (बासमती विशेष):** कटाई-पूर्व अंतराल का पालन — निर्यात-बासमती में अवशेष-अस्वीकृति बड़ा नुकसान (§12)।

---

## 9. Diseases — conditions & management (variety + chemistry class)

> धान के रोग मुख्यतः **नमी + अधिक N + संवेदनशील किस्म** के मेल से भड़कते हैं। **प्रतिरोधी किस्म + संतुलित N + बीज उपचार = 70% रोकथाम।** रासायनिक = class + example AI, **लेबल अनिवार्य**। वायरस का सीधा इलाज नहीं।

### 9.1 प्रमुख रोग तालिका

| रोग (नाम) | कारक/प्रकार | अनुकूल परिस्थिति | पहचान | प्रबंधन (किस्म + chemistry class → AI) | Evidence |
|---|---|---|---|---|---|
| **Blast (झोंका/झुलसा — leaf, neck, node)** | फफूँद *Pyricularia/Magnaporthe* | ठंडी रातें+ओस, अधिक N, नर्सरी, पहाड़/तराई | पत्ती पर **आँख/नाव-आकार धूसर-केंद्र भूरा-किनारा धब्बा**; **neck blast = गर्दन काली-टूटी, बाली सफ़ेद/खाली (सबसे घातक)** | प्रतिरोधी किस्म; N संतुलित; बीज उपचार; **Tricyclazole**, Isoprothiolane, **azoxystrobin+difenoconazole (strobilurin+triazole)** — नर्सरी व **boot/neck-emergence पर निवारक** | High |
| **Bacterial Leaf Blight (BLB — झुलसा/पर्ण-अंगमारी)** | जीवाणु *Xanthomonas oryzae* | अधिक N, बारिश/आँधी-चोट, जलभराव | पत्ती **किनारे/नोक से पीली-लहरदार सूखन**, सुबह जीवाणु-बूँद; kresek (पौध-मुरझान) | **प्रतिरोधी किस्म मुख्य**; N घटाएँ; संतुलित K; **कोई भरोसेमंद रासायनिक इलाज सीमित** — copper + (कुछ जगह) antibiotic केवल integrated/लेबल-सावधानी; खेत-जल-निकास | High |
| **Sheath Blight (शीथ ब्लाइट/पर्णच्छद अंगमारी)** | फफूँद *Rhizoctonia solani* | घना पौधा, अधिक N, गर्म-आर्द्र, खड़ा पानी | तने-आवरण पर **साँप-खाल/जल-धब्बा जैसे अनियमित घाव**, ऊपर चढ़ते | संतुलित N + spacing; **Validamycin**, **Hexaconazole/Propiconazole (triazole)**, azoxystrobin | High |
| **False Smut (झूठा कंड/हल्दी-गाँठ — "लक्ष्मी"?)** | फफूँद *Ustilaginoidea* | **फूल-दाना अवस्था पर बारिश/नमी, अधिक N** | दाने की जगह **हरे→पीले→जैतून-काले मख़मली गोले** | संतुलित N; निवारक **triazole (Propiconazole)+ copper** boot/heading पर; प्रतिरोधी-सहन किस्म | Medium/High (बढ़ती समस्या) |
| **Brown Spot (भूरा धब्बा)** | फफूँद *Bipolaris* | **पोषण-भूखी/कमज़ोर मिट्टी, K/सूखा-तनाव, ऊसर** | पत्ती-दाने पर **तिल-जैसे भूरे अंडाकार धब्बे** | **यह अक्सर पोषण-संकेत — मिट्टी सुधारें (K/संतुलन)**; बीज उपचार; Mancozeb/triazole | High |
| **Rice Tungro (टुंग्रो — वायरस)** | वायरस, **green leafhopper (GLH) वाहक** | दक्षिण/पूर्व India, धब्बेदार खेत | पौधा **बौना, पत्ती नारंगी-पीली (नोक से)**, कम कल्ले | **कोई रासायनिक इलाज नहीं** — प्रतिरोधी किस्म + **GLH (vector) नियंत्रण** + रोगग्रस्त हटाना + synchronised बुवाई | High |
| **Sheath Rot (पर्णच्छद सड़न)** | फफूँद *Sarocladium* | boot अवस्था नमी, कीट-चोट | **boot/ध्वज-आवरण पर सड़न, बाली न निकले/सड़े** | संतुलित N; बीज उपचार; triazole boot पर | Medium |
| **Bakanae (फूलिश-सीडलिंग/बकानी)** | फफूँद *Fusarium fujikuroi* | **बासमती में आम**, बीज-जनित | पौध **असामान्य लंबी-पीली-पतली**, फिर मरती | **बीज उपचार अनिवार्य** (carbendazim/Trichoderma + नमक-पानी बीज-छँटाई); स्वच्छ बीज | Medium/High |
| **Stem Rot / Foot rot** | फफूँद | जलमग्न देर-अवस्था | तने-आधार काला-सड़न, lodging | जल-निकास, संतुलित पोषण, ठूँठ प्रबंधन | Medium |
| **Grain discolouration / dirty panicle** | मिश्रित फफूँद/जीवाणु | heading-नमी | दाने धब्बेदार-रंगहीन | boot/heading पर निवारक + संतुलित N | Medium |

### 9.2 Cross-cutting रोग-नियम

- **N ही मुख्य ट्रिगर:** blast, BLB, sheath blight, false smut — सब **अधिक N** से भड़कते। "यूरिया घटाओ" अक्सर पहली दवा।
- **बीज उपचार = सस्ती बीमा:** blast/bakanae/brown spot नर्सरी-स्तर पर बीज उपचार से बहुत घटते।
- **प्रतिरोधी किस्म = टिकाऊ:** BLB/blast/tungro/gall midge में किस्म-प्रतिरोध रसायन से सस्ता व टिकाऊ; पर प्रतिरोध **टूटता** है (नई race) → किस्म-rotation।
- **वायरस (tungro):** दवा नहीं — **vector (GLH) + किस्म + sanitation**। (Phase 1/2 की "no chemical cure" honesty यहाँ भी।)

---

## 10. Nutrient disorders that look like disease (Zn, Fe, K, S, P + toxicities)

> किसान की बड़ी गलती: **पोषण-कमी को "रोग" समझकर fungicide/कीटनाशक डालना।** नीचे भ्रम-निवारक तालिका — पैसा व फसल दोनों बचाती है।

| दिखावट (किसान क्या देखता) | असली कारण | disease-भ्रम | सही कदम | Evidence |
|---|---|---|---|---|
| निचली पत्तियों पर **जंग-भूरे धब्बे + बौनापन + पैचदार पीलापन (खैरा)**, रोपाई+2–3 हफ़्ते | **Zn कमी** | brown spot/blast समझकर fungicide | **ZnSO₄** मिट्टी+छिड़काव; रोकथाम basal Zn | High |
| **नई ऊपरी पत्तियों की शिराओं-बीच पीलापन**, DSR/aerobic/ऊँचे-pH में | **Fe कमी** | "पीला रोग"/वायरस | **FeSO₄ छिड़काव** (मिट्टी-Fe अक्सर असरहीन ऊँचे pH पर) | High (DSR में बढ़ती) |
| **पुरानी पत्तियों के किनारे/नोक भूरे-सूखे**, कमज़ोर तना/lodging, रोग-संवेदनशील | **K कमी** | leaf blight/झुलसा | **MOP (K)** split; brown-spot भी घटता | High |
| समान हल्का पीलापन **नई पत्तियों पर** (N-जैसा पर ऊपरी) | **S कमी** | N कमी समझकर सिर्फ़ यूरिया | S-युक्त (SSP/ammonium sulphate/जिप्सम) | Medium |
| पौधा गहरा-नीलापन-हरा, बौना, बैंगनी-आभा, कम कल्ले | **P कमी** | — | basal P (DAP/SSP) | Medium |
| समान हल्का-हरा/पीला पूरा पौधा, धीमी वृद्धि | **N कमी** | कभी-कभी रोग | N top-dress (LCC-आधारित) | High |
| निचली पत्तियों पर **कांस्य/जंग-चकत्ते + जड़ काली-दुर्गंध (H₂S)**, अम्लीय/जलमग्न | **Iron toxicity / akiochi (H₂S)** | brown spot/blast | **जल-निकास/AWD + K + चूना (अम्लीय में) + Zn**; लगातार गहरा-जलमग्न घटाएँ | Medium |
| ऊसर/खारी ज़मीन पर बौनापन, नोक-जलन, पैच | **लवणता/सोडिकता + अक्सर Zn** | रोग | **जिप्सम + Zn + salt-tol किस्म (CSR)** + पानी-निकास | High |

**किसान-facing नियम (Hindi):** "अगर पीलापन/धब्बे **खेत में धब्बेदार (पैच)** हैं और मौसम-रोग जैसा नहीं फैल रहे — पहले **पोषण-कमी (ज़िंक/लोहा/पोटाश)** सोचें, दवा नहीं। ज़िंक/लोहा छिड़काव सस्ता है; fungicide बेकार जाएगा।"

---

## 11. Harvest, lodging, milling quality & moisture

### 11.1 कटाई-समय व नमी (moisture)

- **कब काटें:** ~80–85% दाने भूसे/सुनहरे, ऊपरी दाने कड़े, निचले आटे-जैसे; बाली झुकी। किस्म-अनुसार फूल के ~28–35 दिन बाद।
- **दाना-नमी:** कटाई पर आदर्श **~20–22%**; **भंडारण/बिक्री को ~13–14% तक सुखाएँ** (बासमती व बीज को धीमा-छायादार सुखाना, तेज़-धूप में दाना **टूटता/चटकता → milling कम**)।
- **पानी बंद:** कटाई से **~7–10 दिन पहले** सिंचाई रोकें (सुगमता + दाना-गुणवत्ता)।

### 11.2 Lodging (गिरना) — कारण व रोकथाम

- **कारण:** अधिक N + देर N, लंबी/पुरानी किस्म, K कमी, घना पौधा, अंत में गहरा पानी + आँधी, stem rot।
- **रोकथाम:** **अर्ध-बौनी किस्म**, संतुलित N (देर-N नहीं), **पर्याप्त K (तना-मज़बूती)**, spacing, अंत-अवस्था पानी घटाना। बासमती लंबी किस्में स्वभावतः गिरने-प्रवण → N कम रखें।

### 11.3 Milling quality (कुटाई/HRR)

- **Head Rice Recovery (साबुत-चावल %):** अधिकतम आय। घटाने वाले: **खेत में अधिक-पकाना (चटकन), तेज़-धूप/असमान सुखान, बहुत सूखा फिर नमी, कीट/रोगग्रस्त दाना।**
- **Chalkiness (दूधियापन/धुँधलापन):** दाना-भराव पर गर्मी-तनाव/असंतुलित पोषण → बाज़ार-मूल्य घटाता (Sona Masoori/बासमती में अहम)।
- **किसान-facing:** "समय पर काटें, **धीरे सुखाएँ** (तेज़ धूप में नहीं) — तभी चावल टूटेगा कम और भाव मिलेगा ज़्यादा।"

---

## 12. Basmati vs common rice — package differences farmers confuse

> यह अलग section इसलिए कि पश्चिम UP/पंजाब/हरियाणा किसान अक्सर **बासमती को common धान की तरह** उगाते हैं — ज़्यादा यूरिया, ज़्यादा दवा — और फिर **खुशबू/भाव/निर्यात** गँवाते हैं।

| पहलू | Common (non-basmati) | Basmati (सुगंधित निर्यात) |
|---|---|---|
| **लक्ष्य** | उपज (MSP) | दाना-लंबाई + खुशबू + **कम अवशेष (MRL)** = निर्यात-भाव |
| **N (यूरिया)** | मध्यम-उच्च | **कम** — अधिक N खुशबू घटाता, lodging + false smut बढ़ाता |
| **किस्म** | उपज-किस्में | PB-1509 (जल्दी), PB-1121 (लंबी प्रीमियम), 1718/1401/1637/1692 |
| **कद/lodging** | अर्ध-बौनी | अक्सर लंबी → **गिरने-प्रवण → N व पानी संयमित** |
| **कीटनाशक** | लेबल-अनुसार | **सख़्त MRL** — कई देश कुछ AI (जैसे कुछ triazole/insecticide) पर अवशेष-सीमा कठोर; **प्रतिबंधित/निगरानी-सूची AI से बचें; PHI का कड़ा पालन** |
| **पानी** | ecology-अनुसार | संयमित; देर-पानी + N = गिरना |
| **कटाई/सुखान** | सामान्य | **धीरे सुखान** (खुशबू व साबुत-दाना), नमी-सावधानी |
| **बाज़ार** | मंडी/PDS | निर्यातक/APEDA-मानक, GI (basmati GI बेल्ट) |

**किसान-facing (Hindi):** "बासमती को common धान की तरह मत उगाइए — **यूरिया कम, दवा सोच-समझकर (अवशेष-सीमा सख़्त है), किस्म-अनुसार पानी।** ज़्यादा यूरिया बासमती की **खुशबू और भाव दोनों** मार देता है, और निर्यात में अवशेष पकड़ा गया तो पूरी खेप लौट सकती है।"

> **⚠️ MRL/निर्यात नोट (Low/Medium — बदलती सूची):** प्रतिबंधित/सीमित AI व MRL देश-अनुसार बदलते हैं; कोई विशिष्ट AI-अनुमति का दावा app में hard-code न करें — **APEDA/निर्यातक/लेबल से वर्तमान सूची verify।**

---

## 13. Parali / residue / Happy Seeder / legal burn-ban (NW India)

> यह पश्चिम UP + पंजाब + हरियाणा का बड़ा **कानूनी + पर्यावरण + अगली-फसल** मुद्दा है। धान-गेहूँ बेल्ट में धान-कटाई (combine) के बाद बचा **पराली (धान-ठूँठ/भूसा)** जलाना **कानूनन प्रतिबंधित** (NGT/राज्य आदेश; जुर्माना/रेड-एंट्री संभव)।

### 13.1 क्यों समस्या

- Combine ऊँचा ठूँठ छोड़ता; गेहूँ-बुवाई की **सिर्फ़ ~2–3 सप्ताह की खिड़की** → किसान जल्दी सफ़ाई को **जलाता** → वायु-प्रदूषण + **मिट्टी-जीव/organic C/N नुकसान + agni से micronutrient हानि**।

### 13.2 विकल्प (in-situ व ex-situ)

| उपाय | क्या | लाभ |
|---|---|---|
| **Happy Seeder** | ठूँठ खड़ा रखते हुए सीधे गेहूँ बुवाई (ठूँठ mulch) | जलाना नहीं, नमी-संरक्षण, समय बचत |
| **Super Seeder** | ठूँठ काट-मिलाकर एक-पास में गेहूँ बुवाई | साफ़ बुवाई + residue मिट्टी में |
| **Mulcher + Zero-till drill** | ठूँठ कतरना फिर ZT बुवाई | लागत कम विकल्प |
| **SMS (Straw Management System) combine-attach** | कटाई-साथ भूसा फैलाना | Happy Seeder-अनुकूल |
| **Baler (ex-situ)** | पराली गाँठ बनाकर उद्योग/चारा/ऊर्जा को | आय + खेत साफ़ |
| **Bio-decomposer (जैव-अपघटक)** | ठूँठ-गलन तेज़ करने का घोल छिड़काव | कुछ मदद (समय ज़रूरी) |

### 13.3 सलाह + scheme संदर्भ

- **धान-किस्म से शुरुआत:** **छोटी-अवधि किस्म (PR-126) = जल्दी कटाई = गेहूँ-बुवाई खिड़की चौड़ी = पराली-जल्दबाज़ी कम।** मूल हल किस्म-चयन से जुड़ा।
- **यंत्र सब्सिडी:** Happy/Super Seeder, Mulcher, Baler, SMS पर **CRM सब्सिडी + CHC/यंत्र-बैंक किराया** (राज्य कृषि यंत्र पोर्टल)। **दर/स्लैब बदलते — पोर्टल/जिला कार्यालय verify** (कोई % hard-code नहीं; Phase 1 §B व §B2 देखें)।
- **किसान-facing (Hindi):** "पराली जलाना कानूनन मना है और मिट्टी की जान जलाता है। **Happy/Super Seeder से बिना जलाए गेहूँ बोएँ** — यंत्र पर सब्सिडी/किराया मिलता है (पोर्टल पर दर देखें)। और **जल्दी पकने वाली धान (PR-126)** लगाएँ ताकि गेहूँ का समय मिले।"

---

## 14. Farmer Q&A — 32 real Hindi questions → short answers

> छोटे, farmer-ready उत्तर। **कोई नकली जिला-विशिष्ट खुराक नहीं** — किस्म/अवस्था-सलाह सामान्य; डोज़ लेबल/KVK। रासायनिक = class + example AI।

**किस्म / बुवाई**
1. **"UP में कौन सी धान लगाऊँ?"** → पहले बताएँ पानी की स्थिति व भाव: जल्दी/सिंचित → PR-126/MTU-1010; अच्छी उपज → Swarna/BPT-5204/HUR-105; बासमती-भाव → PB-1509 (जल्दी) या PB-1121; ऊसर → CSR-36/Narendra Usar; बाढ़ → Swarna-Sub1।
2. **"जल्दी पकने वाली किस्म चाहिए, गेहूँ का समय मिले।"** → PR-126/MTU-1010 (~110–120 दिन) + पराली को Happy/Super Seeder।
3. **"बासमती और सादी धान में क्या फ़र्क़ रखूँ?"** → बासमती में **यूरिया कम, दवा सोच-समझकर (अवशेष-सीमा), पानी संयमित** — वरना खुशबू/भाव जाता (§12)।
4. **"ऊसर/खारी ज़मीन में धान होगी?"** → salt-tol किस्म (CSR-36/43, Narendra Usar-2/3) + जिप्सम + ज़िंक; पानी-निकास।
5. **"बाढ़ में डूब जाती है, क्या करूँ?"** → submergence Sub1 किस्में (Swarna-Sub1) — ~2 हफ़्ते डूब सहती हैं।
6. **"DSR (सीधी बुवाई) करूँ या रोपाई?"** → DSR पानी/मज़दूरी बचाता पर **खरपतवार व Fe/Zn सख़्ती से सँभालें + समतल खेत**; नए हैं तो एक भाग में आज़माएँ।
7. **"SRI क्या है, फ़ायदा?"** → कम बीज (~2–3 kg/एकड़), छोटी पौध, चौड़ा spacing, नमी (बिना गहरा पानी), वीडर — कम लागत में अधिक कल्ले/उपज संभव।

**कल्ले / बढ़वार**
8. **"कल्ले कम फूट रहे, बढ़वार नहीं — कौन सा टॉनिक?"** → टॉनिक नहीं: (1) रोपाई+~20–25 दिन पर **यूरिया top-dress**, (2) खैरा हो तो **ज़िंक सल्फेट**, (3) पानी उथला/एक बार सुखाएँ। किस्म की क्षमता स्प्रे से नहीं बदलती।
9. **"बाज़ार वाला 'बढ़वार टॉनिक' काम करेगा?"** → भरोसा कमज़ोर (Low evidence)। पहले N-timing + ज़िंक ठीक करें; टॉनिक पर पैसा बाद में।
10. **"पत्तियाँ पीली-धब्बेदार, बौना (खैरा)?"** → ज़िंक कमी — **ZnSO₄** मिट्टी+छिड़काव; fungicide बेकार।
11. **"नई ऊपरी पत्ती शिराओं-बीच पीली (DSR में)?"** → लोहा (Fe) कमी — **FeSO₄ छिड़काव**।
12. **"यूरिया कब-कब डालूँ?"** → 3 बार: रोपाई/basal, active tillering (~21–25 दिन), बाली-बनना (PI ~40–50 दिन)। देर से भारी N मत दें।

**पानी**
13. **"धान को हमेशा भरा पानी चाहिए?"** → नहीं। AWD करें (पानी सूखने पर फिर भरें); बस **बाली व फूल** के समय कमी न हो; कटाई से ~हफ़्ता पहले पानी बंद।
14. **"पानी कब सबसे ज़रूरी?"** → बाली बनना (PI) व फूल (flowering) — यहीं दाना बनता/बिगड़ता।
15. **"नलकूप महँगा, पानी कैसे बचाऊँ?"** → AWD + लेज़र-लेवलिंग + छोटी-अवधि किस्म + (संभव हो) DSR/SRI।

**खरपतवार**
16. **"घास/सांवक बहुत, क्या डालूँ?"** → transplant: PRE **Pretilachlor** (रोपाई+2–4 दिन) → ज़रूरत पर early-POST **Bispyribac-sodium**; DSR: PRE **Pendimethalin** + POST। **लेबल+अवस्था**।
17. **"मोथा/डिला नहीं मरता?"** → sedge को ALS (Pyrazosulfuron / लेबल-mix Bispyribac+Metsulfuron); अवस्था-मिलान।
18. **"खेत में धान-जैसी जंगली घास (करगा) आ गई?"** → weedy rice — herbicide से नहीं मरती; साफ़ बीज + स्टेल-सीडबेड + उखाड़ना + फसल-चक्र।

**कीट**
19. **"गोभ/बीच का अंकुर सूखा (dead heart), बाद में सफ़ेद बाली?"** → तना छेदक — ETL पार पर **Chlorantraniliprole/Cartap**; Trichogramma + egg-mass हटाना।
20. **"पत्ती मुड़ी, अंदर खुरची, सफ़ेद धारी?"** → leaf folder — **Chlorantraniliprole/Cartap**; boot-leaf बचाएँ।
21. **"तने के पास भूरे फुदके, गोल पीला-सूखा धब्बा (hopper burn)?"** → BPH — **Buprofezin/Pymetrozine/Dinotefuran**; **pyrethroid मत डालें (भड़केगा)**; यूरिया घटाएँ + AWD।
22. **"कल्ला प्याज़-पत्ती/चांदी-नली बन गया, बाली नहीं?"** → gall midge — **प्रतिरोधी किस्म मुख्य**; early systemic per label।
23. **"पत्ती पर सफ़ेद खुरची-रेखाएँ, काला काँटेदार भृंग (hispa)?"** → rice hispa — प्रभावित नोक कतरें + लेबल दवा; N घटाएँ।
24. **"झुंड में इल्ली बाली/पत्ती काट रही (armyworm)?"** → **Emamectin benzoate/Chlorantraniliprole** + शाम को poison-bait; रात-scouting।
25. **"दूधिया दाने पर बदबूदार बग, दाना खाली?"** → gundhi bug (milky पर) — लेबल contact, शाम; monitor।
26. **"एक टंकी में 3–4 दवा मिला दूँ?"** → **नहीं** — अवैध/जोखिमभरा (phytotoxicity, अवशेष, resistance); एक लक्षित उत्पाद, MoA घुमाएँ।

**रोग**
27. **"गर्दन काली, बाली सफ़ेद/खाली (neck blast)?"** → blast — प्रतिरोधी किस्म + N संतुलित + **Tricyclazole/isoprothiolane** boot/neck पर निवारक।
28. **"पत्ती किनारे से पीली-लहरदार सूख रही (BLB)?"** → जीवाणु — **यूरिया घटाएँ**, प्रतिरोधी किस्म, K संतुलित; सीधा रासायनिक इलाज सीमित (copper/integrated); पानी-निकास।
29. **"तने-आवरण पर साँप-खाल जैसे धब्बे (sheath blight)?"** → **Validamycin/Hexaconazole (triazole)**; N कम + spacing।
30. **"दाने की जगह हरे-काले मख़मली गोले (false smut)?"** → संतुलित N + boot/heading पर निवारक **triazole+copper**; अगली बार सहन-किस्म; अधिक N से बचें।
31. **"पत्ती पर तिल-जैसे भूरे धब्बे (brown spot)?"** → अक्सर **पोषण-कमी संकेत** (K/संतुलन/ऊसर) — मिट्टी सुधारें + बीज उपचार; ज़रूरत पर Mancozeb/triazole।
32. **"पौधा बौना, पत्ती नारंगी-पीली, कम कल्ले (tungro)?"** → वायरस — **दवा नहीं**; green leafhopper (vector) रोकें + प्रतिरोधी किस्म + रोगग्रस्त हटाएँ + एक-साथ बुवाई।

---

## 15. Data model suggestion for Agriveda (fields only — NOT implement)

> **यह केवल fields/शेप सुझाव है — implement नहीं।** मौजूदा app-idiom से मेल: crop `slug` ("paddy"), timing `DAS/DAT` + `timingRef` (`data/crop-detail-timing.ts`), `TimedApplication`-शैली, catalog `category` ("Cereals")। Paddy को **ecology/duration/grain-type** आयाम चाहिए जो सामान्य crop-schema में नहीं हैं — इसलिए एक **paddy-aware overlay**।

### 15.1 Core: `crop × stage × problem → action-class` row (Phase 1/2 P0 dataset का paddy-विस्तार)

सुझाए fields (नाम केवल संकेत):

```
PaddyAdvisoryRow {
  cropSlug            // "paddy" (मौजूदा catalog slug से align)
  ecology             // enum: irrigated_transplanted | rainfed_lowland | upland_aerobic_dsr | deepwater_submergence | saline_sodic | boro
  durationClass       // enum: early | medium | late
  grainType           // enum: non_basmati_common | basmati | fine_non_basmati | aromatic_short
  establishment       // enum: transplant | dry_dsr | wet_dsr | sri  (मौजूदा Establishment type का superset)
  stage               // enum: nursery | transplant | active_tillering | panicle_initiation | booting | heading_flowering | milk_dough | maturity
  stageTimingRef      // "DAS" | "DAT"  (मौजूदा TimingRef reuse)
  stageWindow         // e.g. "21-25 DAT" (मौजूदा timing string शैली)
  problemType         // enum: pest | disease | weed | nutrient_disorder | agronomy_growth | water | lodging | postharvest
  problemKey          // stable id, e.g. "stem_borer" | "blast_neck" | "zn_deficiency_khaira" | "bph"
  symptomHindi        // farmer-facing लक्षण (नाम) — e.g. "गोभ सूखा (dead heart)"
  symptomEnglish      // "dead heart / white ear"
  lookalikeOf         // optional: भ्रम-निवारण link (e.g. brown_spot ↔ k_deficiency)
  actionClass         // MoA/chemistry group or agronomic-action class (NOT brand)
  exampleAI           // example active ingredient(s), string[]  (brand नहीं)
  nonChemicalFirst    // string[]: IPM/agronomy steps (Trichogramma, egg-mass हटाना, N घटाएँ…)
  etlNote             // economic threshold note (जहाँ लागू; verify-flag)
  isVirusNoCure       // bool: true → "कोई रासायनिक इलाज नहीं — vector/किस्म" honesty badge
  legalCaveat         // "लेबल अनिवार्य" + PHI/MRL flag (बासमती-निर्यात के लिए विशेष)
  beeCaution          // bool: फूल-अवस्था छिड़काव सावधानी
  evidenceTier        // "High" | "Medium" | "Low"
  regionTags          // string[]: UP zones + states (Phase 2 region dimension reuse)
  asOfDate + verifyWithKVK  // variety/portfolio समय-संवेदी flag
}
```

### 15.2 Variety picker overlay: `PaddyVariety`

```
PaddyVariety {
  name                // किसान नाम, e.g. "PR-126", "Pusa Basmati-1121"
  aliases             // ["ग्यारह-इक्कीस", "1121"] farmer-spoken नाम
  ecology[]           // किन परिस्थितियों को
  durationClass       // early|medium|late  + approxDays
  grainType
  specialTolerance[]  // submergence_sub1 | salinity | drought | biofortified_zn | herbicide_tolerant
  notifiedRegions[]   // UP + states
  packageDeltas       // e.g. basmati → lowN, MRL-strict, lodging-prone
  evidenceTier
  asOfDate
}
```

### 15.3 Stage-schedule overlay (मौजूदा `CropTimingPack` का paddy-रूप)

- `fertilizers: TimedApplication[]` — N 3-split + basal P + K-split + Zn/Fe (मौजूदा `TimedApplication` reuse)।
- `irrigations: TimedIrrigation[]` — critical-stage + **AWD toggle** (continuous | safe_awd) + "PI/flowering पर न सुखाएँ" flag।
- `weedWindow` — PRE/early-POST timing + establishment-conditional (DSR बनाम transplant)।

### 15.4 Guardrail flags (हर row पर, non-negotiable — Phase 1/2 से carry)

`illegalMixBlocked` (कभी multi-AI cocktail suggest न हो) · `subsidyPercentNever` (कोई % hard-code नहीं) · `virusNoCureBadge` · `bphResurgenceWarn` (pyrethroid-block on BPH) · `basmatiMRLWarn` · `evidenceTier` अनिवार्य।

---

## 16. Evidence tiers & legal disclaimer

**Evidence tiers used above:**
- **High** — ICAR/SAU व्यापक-स्थापित धान-agronomy: ICAR-**NRRI (Cuttack)**, **IIRR (Hyderabad)**, **CSSRI (Karnal — ऊसर/salt-tol)**, GBPUAT Pantnagar, NDUAT Ayodhya, CSAUAT Kanpur, IARI (बासमती — Pusa), PAU/CCS-HAU (DSR/PR-किस्में), TNAU (SRI/delta), KVK अनुशंसाएँ। इसमें अधिकांश किस्म-नाम, प्रमुख कीट/रोग-श्रेणी, N-timing/खैरा/Fe/AWD विज्ञान, ecology-मानचित्र आते हैं।
- **Medium** — क्षेत्रीय रूप से सही पर समय/जिले पर बदलती बातें: "अभी सबसे अच्छी किस्म" दावे, नई किस्म-स्थिति (RNR-15048, Kalanamak-3), hybrid-portfolio, false smut/DSR-Fe जैसी **बढ़ती** समस्याएँ, boro/aromatic niche।
- **Low** — अनिश्चित/समय-संवेदी: **बाज़ारू PGR/"बढ़वार टॉनिक" दावे, बासमती MRL/निर्यात प्रतिबंधित-AI सूची, subsidy %/CRM यंत्र-दर, biotype-विशिष्ट gall-midge सलाह, कोई भी जिला-विशिष्ट खुराक।** इन्हें app में **"आधिकारिक पोर्टल / KVK / लेबल पर verify"** के साथ दिखाएँ।

**महत्वपूर्ण सीमाएँ / चेतावनी (paddy-विशेष):**
1. यह deliverable कृषि-विस्तार *मार्गदर्शन* है, **नुस्खा/prescription नहीं**। अंतिम खुराक, फसल-अनुमोदन, PHI, MRL व मिश्रण-निषेध हमेशा **product label + CIBRC पंजीकरण + स्थानीय कृषि अधिकारी/KVK** से तय हों।
2. रासायनिक नाम **class + example AI** के रूप में; डीलर-ब्रांड भिन्न; कुछ AI (जैसे कुछ पुराने कीटनाशक) **पुनरीक्षा/प्रतिबंध** के दायरे में — **वर्तमान CIBRC पंजीकरण ही अंतिम**।
3. **BPH resurgence:** synthetic pyrethroid/अंधाधुंध छिड़काव BPH भड़काता — सख़्त परहेज़; कम N + AWD + चुनिंदा AI।
4. **कोई अवैध cocktail नहीं** — एक बार में एक अवस्था-मिलान लक्षित उत्पाद; MoA rotate (stem borer/leaf folder/BPH/false smut)।
5. **वायरस (tungro) का रासायनिक इलाज नहीं** — vector (GLH) + प्रतिरोधी किस्म + sanitation।
6. **पोषण ≠ रोग:** खैरा (Zn), Fe/K/S कमी को fungicide से न भ्रमित करें (§10) — सस्ता व सही सुधार।
7. **बासमती निर्यात MRL** समय-संवेदी — कोई AI-अनुमति hard-code न करें; APEDA/निर्यातक/लेबल verify (§12)।
8. **पराली जलाना कानूनन प्रतिबंधित** (NW India) — Happy/Super Seeder + छोटी-अवधि किस्म; यंत्र-सब्सिडी दर पोर्टल पर verify (§13)।
9. किस्म-पोर्टफ़ोलियो **हर कुछ साल बदलता** (नई release + रोग-टूट) — app को variety list "as of" + KVK-verify के साथ रखें।

*तैयार: Agriveda Phase 3 — Paddy / Rice single-crop deep dossier (Oryza sativa), UP-first + India rice belts। Schemes/KCC/mechanization base = Phase 1 §B; pan-India crop context = Phase 2। No app code modified.*
