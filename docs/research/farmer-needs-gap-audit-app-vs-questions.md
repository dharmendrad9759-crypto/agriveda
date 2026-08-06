# Agriveda Gap Audit — Farmer questions vs App vs Research

> **Method:** Research Phase 1–3 (`docs/research/farmer-needs-phase1-up-app-crops.md`, `…phase2-india-major-crops.md`, `…phase3-paddy-deep.md`) + `docs/ARCHITECTURE.md` पढ़े गए। App की असली coverage **कोड पढ़कर** आँकी गई (invent नहीं) — `data/`, `app/`, `components/`, `lib/`। **कोई app code नहीं बदला गया।**
>
> Scoring key: **पूरा (Full)** = किसान को सीधा, structured जवाब मिलता है · **आधा (Partial)** = कुछ है पर उथला/अधूरा/कुछ ही फसलों में · **गायब (Missing)** = app में कोई UI/route/data नहीं।

---

## Executive verdict (क्या ऐप “पूरा” है?)

**Partially — अभी "पूरा" नहीं है।** खेती-विज्ञान वाला core (कीट/रोग→स्प्रे with IRAC/FRAC MoA, tank-mix जाँच, मौसम-आधारित स्प्रे-विंडो, खाद कैलकुलेटर, सिंचाई शेड्यूल, 12-सेक्शन crop detail) **मजबूत और production-grade** है — ये किसान के 8/14 मुख्य सवाल ठीक हल करते हैं। लेकिन किसान की **पूरी दुनिया का एक बड़ा हिस्सा g_गायब_ है: कोई योजना/सब्सिडी/KCC/PM-KISAN मॉड्यूल नहीं** (यंत्र सब्सिडी, तारबंदी, फसल बीमा, लोन — किसान के सबसे भावनात्मक व पैसे वाले सवाल), और variety-सलाह उथली है (2–4 किस्में/फसल, धान की ecology/duration/grain-type फ़िल्टर नहीं जो Phase 3 का केंद्र था)। साथ ही **कल्लों का फुटाव/PGR-टॉनिक honesty** (Phase 3 §4 — साख बनाने वाला) एक dedicated मॉड्यूल के रूप में नहीं है, और catalog 22 फसलें हैं जबकि research 40 तक जाती है (9/22 फसलें profile में पतली हैं)।

**एक लाइन में:** *"बीमारी का इलाज ऐप अच्छा बताता है; पर पैसा/योजना/किस्म/बढ़वार वाले सवालों पर किसान को अभी भी बाहर जाना पड़ता है।"*

---

## Scorecard table (हर सवाल पर score)

| # | किसान सवाल | Research depth | App status | Evidence (file / route) | Priority |
|---|---|---|---|---|---|
| 1 | कीट/रोग → कौन सी स्प्रे? | P1 §A/C, P2, **P3 §8–9** | **पूरा / Full** | `data/spray-advisory-recommendations.ts` (MoA-tagged), `data/crop-protection/{cereals,solanaceous,other-profiles}.ts` (IRAC/FRAC codes), `data/moa-lookup.ts`, `components/pest-solver/`, `app/pest-diseases/[cropSlug]/[threatType]/[threatId]`, `app/pest-solver` | — |
| 2 | बढ़वार / कल्लों का फुटाव | **P3 §4 (deep)**, P1 §C1 | **आधा / Partial** | N-split timing है (`data/crop-detail-timing.ts` paddy active-tillering split; `data/paddy-profile.ts`), पर PGR/"बढ़वार टॉनिक" honesty व कल्ला-लीवर explainer मॉड्यूल नहीं | **P1** |
| 3 | पूरी फसल पैकेज (बुवाई→कटाई) | P1 §C (22), P2 (40) | **पूरा (core) / आधा (पूँछ)** | `data/crops.ts` (13 crops richly filled), `components/crops/sections/*` (12 sections), `app/crops/[slug]`, `app/crop-details/[slug]/[section]` — पर onion/mustard/cotton/bhindi/moong/pulses/mango/banana/grapes पतली (fallback `baseCrop`/`imported-crop-exports.ts`) | P1 |
| 4 | खरपतवार → क्या डालें? | P1 §C, **P3 §7** | **पूरा (covered) / आधा (पूँछ)** | `components/crops/sections/CropWeedSection.tsx`, `lib/weeds/expandCropWeeds.ts`, `lib/crops/weedAbioticBridge.ts`, `/pest-diseases?type=weed`, `data/imports/agriveda-weeds-abiotic-batch.json` | P2 |
| 5 | सिंचाई कब/कितने दिन? | P1 §C, **P3 §6 (AWD)** | **पूरा / Full** | `app/services/irrigation`, `data/crop-detail-timing.ts` (stage irrigations), `components/crops/sections/CropIrrigationSection.tsx` — पर AWD/safe-AWD reminder engine नहीं | P2 |
| 6 | राज्य/UP किस्म सलाह | P1 §C, P2 deltas, **P3 §1–2** | **आधा / Partial** | `lib/crops/cropVarieties.ts` (state-aware govt/private) + `components/crops/sections/CropVarietiesSection.tsx` — पर सिर्फ़ 2–4 किस्में/फसल, धान ecology(ऊसर/बाढ़/DSR)+duration+grain-type फ़िल्टर नहीं | **P1** |
| 7 | ट्रैक्टर/रोटावेटर/तारबंदी सब्सिडी | **P1 §B/B2/B4**, P2 §B3 | **गायब / Missing** | कोई route/component/data नहीं — `lib/services/agrivedaServiceIcons.ts` में कोई scheme टाइल नहीं; `app/**` में कोई schemes page नहीं | **P0** |
| 8 | KCC लोन | **P1 §B3** | **गायब / Missing** | पूरे codebase में कोई KCC UI/route/data नहीं | **P0** |
| 9 | भारत/राज्य योजनाएँ (PM-KISAN/PMFBY/eNAM…) | **P1 §B1**, P2 §B3 | **गायब / Missing** | "scheme/yojana/PM-KISAN" केवल research docs + `data/crops.ts` MSP text में मिला, कोई feature नहीं | **P0** |
| 10 | मौसम → आज स्प्रे? | P1 §A#9, P3 §8 | **पूरा / Full** | `app/weather/spray-advisory` (`components/weather/SprayAdvisoryShell`), `lib/sprayWindow.ts`, `lib/sprayWeatherApi.ts`, `AgriVedaHome.tsx` "आज स्प्रे मत करो" कार्ड | — |
| 11 | टैंक-मिक्स मिलाऊँ? | P1 (anti-cocktail), P3 §8.2 | **पूरा / Full** | `lib/tankMixCompatibility.ts` + `data/tank-mix/{lookup.json,classRules.ts,npk.ts,researchPairs.ts}` | — |
| 12 | मंडी भाव | P1 §A#8 | **पूरा (mock fallback) / Full** | `app/mandi`, `app/mandi/[id]`, `lib/mandi/mapDataGov.ts` (data.gov.in), `data/mandi-snapshot.ts`, `app/market-trends` | P2 |
| 13 | मिट्टी कमी / Soil Health | P1 §B (SHC), **P3 §10** | **आधा / Partial** | `app/deficiencies`, `app/deficiencies/[nutrient]`, `data/deficiencies.ts`, `lib/nutrients/nutrientDeficiencyBridge.ts` (खैरा/Zn/Fe) — पर Soil Health Card इनपुट/soil-test-adjust नहीं | P2 |
| 14 | खाद कब-कितनी? | P1 §C, **P3 §5** | **पूरा / Full** | `app/services/fertilizer-calculator` (`lib/agriveda2/fertilizerEngine.ts`, बीघा/एकड़/हे॰), `data/crop-detail-timing.ts` (N 3-split, Zn), `app/crops/[slug]/fertilizer-schedule` — soil-test-adjust नहीं | P2 |

**Tally → Full: 8 · Partial: 3 · Missing: 3** (14 सवाल)।
- **Full (8):** 1, 3\*, 4\*, 5, 10, 11, 12, 14  (\*3 और 4 core फसलों में Full, पूँछ में Partial)
- **Partial (3):** 2, 6, 13
- **Missing (3):** 7, 8, 9  (तीनों schemes/finance परिवार के)

---

## Top 10 gaps (farmer pain × business value क्रम में)

1. **योजना/सब्सिडी/KCC hub पूरी तरह गायब (सवाल 7–8–9).** किसान का सबसे भावनात्मक + पैसे वाला सवाल — SMAM यंत्र (रोटावेटर/सीड ड्रिल), PM-KISAN, PMFBY फसल बीमा, KCC लोन, PMKSY सिंचाई, तारबंदी। Research P1 §B पूरा तैयार है; app में एक भी route नहीं। **यही सबसे बड़ा trust + retention leak।** → **P0**
2. **Variety picker उथला + धान ecology फ़िल्टर नहीं (सवाल 6).** `cropVarieties.ts` में 2–4 किस्में/फसल; Phase 3 का मूल — *"पानी रुकता है? ऊसर? बाढ़? बासमती भाव?"* → ecology/duration/grain-type छँटाई — पूरी तरह अनुपस्थित। → **P0/P1**
3. **कल्ले/बढ़वार + PGR-टॉनिक honesty मॉड्यूल नहीं (सवाल 2).** Phase 3 §4 का flagship साख-निर्माता: "टॉनिक नहीं — N-timing + Zn + पानी उथला"। abhi सिर्फ़ fertilizer timing है, farmer-facing honest explainer नहीं। → **P1**
4. **Crop coverage पतली पूँछ + catalog 22 vs research 40.** 9/22 catalog फसलें (onion/mustard/cotton/bhindi/moong/pulses/mango/banana/grapes) `data/crops.ts` में custom profile नहीं रखतीं; chana/masoor/urad/turmeric/ginger/garlic/jowar/ragi/guava/papaya/pomegranate आदि (Phase 2) catalog में ही नहीं। → **P1**
5. **हर स्प्रे लाइन पर legal-caveat + evidence-tier badge व्यवस्थित नहीं.** Research हर रासायनिक लाइन पर "लेबल अनिवार्य + CIBRC + PHI + tier" माँगता है; app में MoA तो है पर सुसंगत compliance badge नहीं (कानूनी जोखिम)। → **P0 (compliance)**
6. **Sugarcane — UP का सबसे बड़ा cash crop — profile पतला + कोई E-Ganna/cane-portal.** `data/crops.ts` में sugarcane है पर `data/crop-protection/*` में IPM profile नहीं; पर्ची/भुगतान (caneup.in) deep-link गायब। → **P1**
7. **Soil Health Card / soil-test-adjust खाद नहीं (सवाल 13/14).** deficiency मॉड्यूल है पर मिट्टी-जाँच इनपुट से खुराक समायोजन नहीं; research इसे guardrail बनाता है। → **P2**
8. **AWD / stage-based सिंचाई reminder engine नहीं (सवाल 5 depth).** static schedule है; Phase 3 §6 का AWD + "PI/flowering पर न सुखाएँ" push नहीं। → **P2**
9. **बासमती बनाम common पैकेज + MRL/export अनुशासन नहीं (P3 §12).** पश्चिम-UP/पंजाब किसान के लिए बड़ा निर्यात-जोखिम; app में कोई अलग बासमती-कम-N/MRL चेतावनी नहीं। → **P2**
10. **पराली/CRM guidance + छोटी-अवधि किस्म nudge नहीं (P3 §13).** कानूनी burn-ban + Happy/Super Seeder सब्सिडी + PR-126 nudge — NW-India के लिए अहम, app में अनुपस्थित। → **P2**

---

## What's already strong (keep — मत तोड़ो)

- **कीट/रोग → स्प्रे with MoA rotation:** `data/spray-advisory-recommendations.ts`, `data/crop-protection/*` (IRAC/FRAC/HRAC codes), `data/moa-lookup.ts` — research की "class + example AI + rotate" माँग से मेल खाता।
- **Tank-mix compatibility checker:** `lib/tankMixCompatibility.ts` + `data/tank-mix/*` — असली logic (safe/caution/incompatible + mix-order), anti-cocktail सिद्धांत के अनुरूप।
- **मौसम-आधारित स्प्रे-विंडो:** `lib/sprayWindow.ts` + `/weather/spray-advisory` + home "आज स्प्रे मत करो" — सवाल 10 का सीधा, अच्छा जवाब।
- **खाद कैलकुलेटर:** `lib/agriveda2/fertilizerEngine.ts` (बीघा/एकड़/हेक्टेयर, राज्य-वार बीघा) + DAS/DAT N-split (`data/crop-detail-timing.ts`)।
- **12-सेक्शन crop detail architecture:** `components/crops/sections/*` (overview→varieties→weed→irrigation→pests→diseases→nutrients→fertilizer→harvest→faq) — विस्तार के लिए मजबूत आधार।
- **State-aware variety scaffolding:** `lib/crops/cropVarieties.ts` (govt/private + state highlight) — deepen करने का ढाँचा तैयार।
- **Mandi (data.gov.in) + AI Doctor (Gemini) + Kisan Saathi + Nutrient deficiency (खैरा/Zn/Fe):** सब live मॉड्यूल।

---

## Recommended build order (user approval के बाद — अभी implement नहीं)

**Phase A — P0 (सबसे बड़ा दर्द + compliance):**
1. **Schemes/KCC/सब्सिडी hub** — PM-KISAN, PMFBY, SMAM/यंत्र, KCC, PMKSY, eNAM, तारबंदी(राजस्थान-flag), गन्ना cane-portal। हर पर: उद्देश्य + आवेदन-रास्ता + deep-link + **"दर बदलती है — verify" (कोई % hard-code नहीं)**। Research P1 §B तैयार-content।
2. **Legal-caveat + evidence-tier component** — हर स्प्रे/dose लाइन पर auto "लेबल अनिवार्य + PHI" + High/Medium/Low badge।
3. **Variety picker deepening + धान ecology फ़िल्टर** — ecology(सिंचित/ऊसर/बाढ़/DSR) + duration + grain-type; Phase 3 §2 lists।

**Phase B — P1:**
4. **कल्ले/बढ़वार honesty मॉड्यूल (धान-first)** — N-timing + Zn(खैरा) + पानी उथला + "टॉनिक पर पैसा न लगाएँ" (Phase 3 §4)।
5. **Sugarcane full profile + E-Ganna deep-link** (UP flagship cash crop)।
6. **Crop coverage पूँछ भरना** — 9 पतली फसलें full करें; फिर उच्च-मूल्य नई फसलें (chana/masoor/urad/turmeric/ginger/garlic — Phase 2)।
7. **Stage-based सिंचाई/AWD reminder engine।**

**Phase C — P2:**
8. **Soil Health Card link + soil-test-adjust खाद कैलकुलेटर।**
9. **बासमती बनाम common पैकेज + MRL/export module (P3 §12)।**
10. **पराली/CRM guidance + region dimension (pan-India, Phase 2 §B1)।**

---

## Risk / legal gaps (खास ध्यान)

- **Spray advice (जोखिम सबसे ऊँचा):** हर रासायनिक सुझाव पर **"class + example AI + लेबल अनिवार्य + CIBRC + PHI"** सुसंगत रूप से दिखे — अभी badge व्यवस्थित नहीं। **वायरस रोग (leaf-curl/YMV/tungro/red rot) पर "कोई रासायनिक इलाज नहीं — vector/किस्म प्रबंधन"** honesty और **BPH पर pyrethroid-resurgence चेतावनी** को हर जगह enforce करें।
- **Anti-cocktail:** किसान-defined multi-AI mix कभी suggest न हो; केवल CIBRC-पंजीकृत ready-mix (tank-mix checker पहले से इस दिशा में — बनाए रखें)।
- **Schemes % / MSP-FRP freshness:** जब schemes hub बने — **कोई सब्सिडी %/दर/MSP hard-code न करें**; deep-link + "दर बदलती रहती है, जिला कृषि कार्यालय/पोर्टल verify" + last-checked तिथि। तारबंदी को UP-wide दावे के बिना (मुख्यतः राजस्थान) दिखाएँ।
- **Variety freshness:** किस्म-सूची "as of तारीख + KVK verify" के साथ (portfolio हर 3–5 साल बदलता, रोग-प्रतिरोध टूटता)।
- **बासमती MRL/export:** किसी AI-अनुमति का दावा hard-code न करें — APEDA/लेबल verify।
- **Mandi mock fallback:** जहाँ mock डेटा दिखे (`data/mandi-snapshot.ts`) उसे "अनुमानित/डेमो" स्पष्ट लेबल करें ताकि किसान भाव को आधिकारिक न समझे।

---

*तैयार: Agriveda product+agronomy gap audit — 14 farmer-question checklist × research Phase 1–3 × real app coverage (कोड-पठित)। कोई app code नहीं बदला गया।*
