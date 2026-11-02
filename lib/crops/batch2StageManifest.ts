/**
 * Dedicated Stage-wise Photo Manifest for Batch 2 Crops:
 * 1. Soybean (सोयाबीन) - 6 threats
 * 2. Mustard (सरसों) - 4 threats
 * 3. Potato (आलू) - 5 threats
 * 4. Chilli (मिर्च) - 6 threats
 * 5. Sugarcane (गन्ना) - 6 threats
 * 6. Chickpea / Chana (चना) - 5 threats
 * Total: 32 threats x 3 stages = 96 photos.
 *
 * Each threat contains:
 * - Stage 1: Adult / Early Symptoms (प्रौढ़ कीट / शुरुआती लक्षण)
 * - Stage 2: Larva or Nymph / Severe Infection (इल्ली / सुंडी / गंभीर अवस्था)
 * - Stage 3: Field Damage Symptoms / Field Spread (खेत में नुकसान / फैलाव)
 * - locationHi: कहाँ देखना है (पौधे का अंग / स्थान)
 * - thumbRuleHi: किसान पहचान सूत्र (खेत में तुरंत पहचानने का पक्का नियम)
 */

import type { StagePhotoItem } from "./batch1StageManifest";

export const BATCH2_STAGE_MAP: Record<string, StagePhotoItem[]> = {
  "soybean/stem-fly": [
    {
      "url": "/images/pests/pest-melanagromyza-obtusa.jpg",
      "badgeHi": "🦗 तना मक्खी (वयस्क)",
      "badgeEn": "Adult Stem Fly",
      "captionHi": "चमकदार काली-नीली छोटी मक्खी जो अंकुरण के समय नई पत्तियों पर अंडे देती है",
      "captionEn": "Shiny metallic blackish-blue agromyzid fly ovipositing on young unifoliate leaves",
      "locationHi": "तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "बुवाई के 15-20 दिन बाद पौधे को बीच से चीरें; यदि तने के अंदर लाल-भूरे रंग की टेढ़ी-मेढ़ी सुरंग दिखे, तो तना मक्खी का हमला है।"
    },
    {
      "url": "/images/crop-identification/03_soybean/stem_fly.webp",
      "badgeHi": "🐛 तने में मैगट (सुंडी)",
      "badgeEn": "Stem Fly Maggot",
      "captionHi": "तना चीरने पर अंदर लाल-भूरे रंग की सुरंग और गूदे को खाती बिना पैर वाली सफेद मैगट",
      "captionEn": "Legless creamy-white maggot tunneling down through pith and vascular bundles",
      "locationHi": "तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "बुवाई के 15-20 दिन बाद पौधे को बीच से चीरें; यदि तने के अंदर लाल-भूरे रंग की टेढ़ी-मेढ़ी सुरंग दिखे, तो तना मक्खी का हमला है।"
    },
    {
      "url": "/images/crop-identification/03_soybean/stem_fly.webp",
      "badgeHi": "🌾 पत्तियां सूखना व बढ़वार रुकना",
      "badgeEn": "Stunted Growth & Drying",
      "captionHi": "मुख्य तने की बढ़वार रुकना, पत्तियां पीली पड़कर सूखना और पौधा मुरझाना",
      "captionEn": "Pith destruction leading to stunted tillering, withered leaves, and seedling mortality",
      "locationHi": "तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "बुवाई के 15-20 दिन बाद पौधे को बीच से चीरें; यदि तने के अंदर लाल-भूरे रंग की टेढ़ी-मेढ़ी सुरंग दिखे, तो तना मक्खी का हमला है।"
    }
  ],
  "soybean/charcoal-rot": [
    {
      "url": "/images/diseases/disease-rhizoctonia-bataticola.jpg",
      "badgeHi": "🟡 तने पर राख जैसा धब्बा",
      "badgeEn": "Ash-grey Culm Lesion",
      "captionHi": "ज़मीन के पास तने पर राख या धूसर रंग का घाव और पत्तियां पीली पड़ना",
      "captionEn": "Ash-grey to dull brown water-soaked lesions developing near collar region",
      "locationHi": "जड़ व निचले तने की छाल के नीचे",
      "thumbRuleHi": "तने के निचले हिस्से की छाल को नाखून से खुरचें; यदि अंदर लकड़ी पर कोयले का बारीक चूर्ण (काले दाने) दिखे, तो यह चारकोल रॉट है।"
    },
    {
      "url": "/images/diseases/disease-rhizoctonia-bataticola-2.jpg",
      "badgeHi": "🔴 छाल के नीचे काले दाने",
      "badgeEn": "Charcoal Microsclerotia",
      "captionHi": "तने की छाल हटाने पर अंदर कोयले के बारीक चूर्ण जैसे लाखों काले बीजाणु (माइक्रोस्क्लेरोशिया)",
      "captionEn": "Vascular tissues peppered with minute charcoal-black jet microsclerotia",
      "locationHi": "जड़ व निचले तने की छाल के नीचे",
      "thumbRuleHi": "तने के निचले हिस्से की छाल को नाखून से खुरचें; यदि अंदर लकड़ी पर कोयले का बारीक चूर्ण (काले दाने) दिखे, तो यह चारकोल रॉट है।"
    },
    {
      "url": "/images/diseases/disease-rhizoctonia-bataticola-3.jpg",
      "badgeHi": "🌾 अचानक सूखना व पौधा मरना",
      "badgeEn": "Premature Dry Wilt",
      "captionHi": "फलियां भरते समय गर्म-सूखे मौसम में पौधे की पत्तियां हरी रहते हुए ही सूखकर लटक जाती हैं",
      "captionEn": "Sudden wilting and total drying of leaves remaining attached to dead plants in field",
      "locationHi": "जड़ व निचले तने की छाल के नीचे",
      "thumbRuleHi": "तने के निचले हिस्से की छाल को नाखून से खुरचें; यदि अंदर लकड़ी पर कोयले का बारीक चूर्ण (काले दाने) दिखे, तो यह चारकोल रॉट है।"
    }
  ],
  "soybean/girdle-beetle": [
    {
      "url": "/images/pests/pest-oberea-brevis.jpg",
      "badgeHi": "🦗 चक्र भृंग (वयस्क बीटल)",
      "badgeEn": "Adult Girdle Beetle",
      "captionHi": "लंबा भूरा-नारंगी भृंग कीट जिसके सिर पर लंबे एंटीना होते हैं (Oberea brevis)",
      "captionEn": "Slender brownish-orange longhorned beetle active during vegetative stage",
      "locationHi": "तने व डंठल पर बने दो गोल छल्ले",
      "thumbRuleHi": "सोयाबीन के मुख्य तने या पत्ती के डंठल पर दो गोल रिंग (छल्ले) कटे दिखें और उसके ऊपर की पत्ती सूखी लटकी हो, तो 100% गर्डल बीटल है।"
    },
    {
      "url": "/images/pests/pest-oberea-brevis-2.jpg",
      "badgeHi": "🐛 तने पर दो छल्ले (रिंग)",
      "badgeEn": "Parallel Girdle Rings",
      "captionHi": "मादा कीट तने पर दो समानांतर गोल छल्ले (रिंग) काटती है और बीच में अंडा देती है",
      "captionEn": "Characteristic double spiral parallel cuts made by female around stem circumference",
      "locationHi": "तने व डंठल पर बने दो गोल छल्ले",
      "thumbRuleHi": "सोयाबीन के मुख्य तने या पत्ती के डंठल पर दो गोल रिंग (छल्ले) कटे दिखें और उसके ऊपर की पत्ती सूखी लटकी हो, तो 100% गर्डल बीटल है।"
    },
    {
      "url": "/images/pests/pest-oberea-brevis-3.jpg",
      "badgeHi": "🌾 छल्ले के ऊपर टहनी सूखना",
      "badgeEn": "Dry Drooping Shoots",
      "captionHi": "छल्ला कटने के 2-3 दिन में ऊपर की पत्तियां व टहनियां सूखकर नीचे लटक जाती हैं",
      "captionEn": "Severed sap-flow causing apical shoots above the girdles to wither and droop",
      "locationHi": "तने व डंठल पर बने दो गोल छल्ले",
      "thumbRuleHi": "सोयाबीन के मुख्य तने या पत्ती के डंठल पर दो गोल रिंग (छल्ले) कटे दिखें और उसके ऊपर की पत्ती सूखी लटकी हो, तो 100% गर्डल बीटल है।"
    }
  ],
  "soybean/ymv": [
    {
      "url": "/images/diseases/disease-mungbean-yellow-mosaic-virus.jpg",
      "badgeHi": "🟡 पत्तियों पर पीले धब्बे",
      "badgeEn": "Early Yellow Mosaic",
      "captionHi": "हरी पत्तियों पर irregular चमकीले पीले रंग के मोज़ेक जैसे धब्बे उभरना",
      "captionEn": "Scattered bright yellow chlorotic patches contrasting against green leaf lamina",
      "locationHi": "शीर्ष की नई पत्तियों पर",
      "thumbRuleHi": "यदि नई पत्तियों पर चितकबरे चमकीले पीले धब्बे दिखें और पत्ती हिलाने पर छोटी सफेद मक्खियां उड़ें, तो सफेद मक्खी तुरंत नियंत्रित करें।"
    },
    {
      "url": "/images/diseases/disease-mungbean-yellow-mosaic-virus-2.jpg",
      "badgeHi": "🔴 पूरी पत्ती पीली पड़ना",
      "badgeEn": "Complete Leaf Chlorosis",
      "captionHi": "धब्बे मिलकर पूरी पत्ती को चमकदार पीला कर देते हैं, नसें भी पीली हो जाती हैं",
      "captionEn": "Coalescence of yellow islands turning entire foliage into vivid chrome-yellow",
      "locationHi": "शीर्ष की नई पत्तियों पर",
      "thumbRuleHi": "यदि नई पत्तियों पर चितकबरे चमकीले पीले धब्बे दिखें और पत्ती हिलाने पर छोटी सफेद मक्खियां उड़ें, तो सफेद मक्खी तुरंत नियंत्रित करें।"
    },
    {
      "url": "/images/crop-identification/03_soybean/yellow_mosaic.webp",
      "badgeHi": "🌾 खेत में पीलापन व फलियां न लगना",
      "badgeEn": "Field-wide Mosaic & Pod Loss",
      "captionHi": "सफेद मक्खी द्वारा पूरे खेत में फैलाव; प्रभावित पौधों में फलियां नहीं लगतीं या दाने सिकुड़ जाते हैं",
      "captionEn": "Crop-wide vector spread by whiteflies causing stunted seed-setting and yield decline",
      "locationHi": "शीर्ष की नई पत्तियों पर",
      "thumbRuleHi": "यदि नई पत्तियों पर चितकबरे चमकीले पीले धब्बे दिखें और पत्ती हिलाने पर छोटी सफेद मक्खियां उड़ें, तो सफेद मक्खी तुरंत नियंत्रित करें।"
    }
  ],
  "soybean/spodoptera-semilooper": [
    {
      "url": "/images/pests/pest-spodoptera-litura.jpg",
      "badgeHi": "🦗 तंबाकू इल्ली का पतंगा",
      "badgeEn": "Adult Spodoptera Moth",
      "captionHi": "भूरे-काले पंखों वाला मजबूत रात में उड़ने वाला पतंगा (पंखों पर सफेद लकीरें)",
      "captionEn": "Nocturnal robust moth with intricate grey-brown and whitish forewing patterns",
      "locationHi": "पत्तियों की निचली सतह व फलियों पर",
      "thumbRuleHi": "पत्तियों पर बड़े-बड़े छेद और केवल नसें बची दिखें (जालीदार रूप) और ज़मीन पर हरा-काला मल गिरा मिले, तो यह स्पोडोप्टेरा इल्ली है।"
    },
    {
      "url": "/images/pests/pest-spodoptera-litura-2.jpg",
      "badgeHi": "🐛 हरी व काली धारीदार सुंडी",
      "badgeEn": "Striped Defoliating Larva",
      "captionHi": "पत्तियों को छलनी की तरह खाती हुई बड़ी चिकनी धारीदार इल्लियां (Spodoptera व Semilooper)",
      "captionEn": "Stout cylindrical caterpillars with dark dorsal triangles feeding voraciously",
      "locationHi": "पत्तियों की निचली सतह व फलियों पर",
      "thumbRuleHi": "पत्तियों पर बड़े-बड़े छेद और केवल नसें बची दिखें (जालीदार रूप) और ज़मीन पर हरा-काला मल गिरा मिले, तो यह स्पोडोप्टेरा इल्ली है।"
    },
    {
      "url": "/images/pests/pest-spodoptera-litura-3.jpg",
      "badgeHi": "🌾 छलनी पत्तियां व जालीदार खेत",
      "badgeEn": "Skeletonized Canopy Damage",
      "captionHi": "सुंडी केवल पत्तियों की नसें छोड़ती है (जालीदार पत्ती); पूरा खेत पत्तियों से खाली हो जाता है",
      "captionEn": "Leaves completely skeletonized leaving only the tough structural veins intact",
      "locationHi": "पत्तियों की निचली सतह व फलियों पर",
      "thumbRuleHi": "पत्तियों पर बड़े-बड़े छेद और केवल नसें बची दिखें (जालीदार रूप) और ज़मीन पर हरा-काला मल गिरा मिले, तो यह स्पोडोप्टेरा इल्ली है।"
    }
  ],
  "soybean/pod-blight": [
    {
      "url": "/images/diseases/disease-cercospora-sojina.jpg",
      "badgeHi": "🟡 पत्तियों पर गोल धब्बे",
      "badgeEn": "Frogeye Leaf Spots",
      "captionHi": "पत्तियों पर भूरे-कत्थई गोल धब्बे जिनके किनारे गहरे लाल-भूरे होते हैं (Frogeye)",
      "captionEn": "Circular to angular tan lesions with dark purplish-brown borders on leaves",
      "locationHi": "फलियों व पत्तियों पर",
      "thumbRuleHi": "फलियों के ऊपर काले धंसे हुए दाग दिखें और दाना निकालने पर दाने की सतह पर बैंगनी-गुलाबी धब्बा दिखे, तो यह पॉड ब्लाइट है।"
    },
    {
      "url": "/images/diseases/disease-cercospora-sojina-2.jpg",
      "badgeHi": "🔴 फलियों पर धंसे काले घाव",
      "badgeEn": "Depressed Pod Cankers",
      "captionHi": "हरी फलियों पर धंसे हुए गहरे कत्थई-काले घाव, नमी में गुलाबी-सफेद फफूंद",
      "captionEn": "Sunken necrotic lesions on pods hindering embryonic seed development",
      "locationHi": "फलियों व पत्तियों पर",
      "thumbRuleHi": "फलियों के ऊपर काले धंसे हुए दाग दिखें और दाना निकालने पर दाने की सतह पर बैंगनी-गुलाबी धब्बा दिखे, तो यह पॉड ब्लाइट है।"
    },
    {
      "url": "/images/crop-identification/03_soybean/anthracnose.webp",
      "badgeHi": "🌾 फलियां सूखना व बैंगनी दाना",
      "badgeEn": "Purple Seed Staining",
      "captionHi": "फलियां समय से पहले सूख जाती हैं और दानों पर बैंगनी-गुलाबी दाग (Purple stain) बन जाते हैं",
      "captionEn": "Premature pod drop, poor filling, and characteristic purple discoloration of harvested seed",
      "locationHi": "फलियों व पत्तियों पर",
      "thumbRuleHi": "फलियों के ऊपर काले धंसे हुए दाग दिखें और दाना निकालने पर दाने की सतह पर बैंगनी-गुलाबी धब्बा दिखे, तो यह पॉड ब्लाइट है।"
    }
  ],
  "mustard/mustard-aphid": [
    {
      "url": "/images/pests/pest-lipaphis-erysimi.jpg",
      "badgeHi": "🦗 टहनी पर माहू (चेपा) झुंड",
      "badgeEn": "Mustard Aphid Colony",
      "captionHi": "शीर्ष टहनी व फूलों पर चिपके हजारों हल्के हरे-धूसर रंग के छोटे माहू (चेपा)",
      "captionEn": "Massive colonies of greyish-green aphids encrusting terminal inflorescence",
      "locationHi": "चोटी की टहनियों, फूलों व फलियों पर",
      "thumbRuleHi": "दिसंबर-जनवरी में जब बादल छाए हों, पौधे की चोटी को देखें; यदि चिपचिपे हरे-भूरे कीड़ों का झुंड दिखे और फूल मुरझाएं, तो तुरंत स्प्रे करें।"
    },
    {
      "url": "/images/pests/pest-lipaphis-erysimi-2.jpg",
      "badgeHi": "🪲 रस चूसने की अवस्था",
      "badgeEn": "Sap Sucking Nymphs",
      "captionHi": "कलियों, फूलों व फलियों से रस चूसकर पौधे को कमजोर व मुड़ा हुआ बनाना",
      "captionEn": "Intense sap-extraction from developing pods and pedicels causing curling and abortion",
      "locationHi": "चोटी की टहनियों, फूलों व फलियों पर",
      "thumbRuleHi": "दिसंबर-जनवरी में जब बादल छाए हों, पौधे की चोटी को देखें; यदि चिपचिपे हरे-भूरे कीड़ों का झुंड दिखे और फूल मुरझाएं, तो तुरंत स्प्रे करें।"
    },
    {
      "url": "/images/pests/pest-lipaphis-erysimi-3.jpg",
      "badgeHi": "🌾 चिपचिपा रस व काली फफूंद",
      "badgeEn": "Honeydew & Sooty Mold",
      "captionHi": "पौधे पर शहद जैसा चिपचिपा स्राव और काली फफूंद; फलियों में दाना नहीं भरता",
      "captionEn": "Foliage blackened with sooty mold growing over copious sticky honeydew excretions",
      "locationHi": "चोटी की टहनियों, फूलों व फलियों पर",
      "thumbRuleHi": "दिसंबर-जनवरी में जब बादल छाए हों, पौधे की चोटी को देखें; यदि चिपचिपे हरे-भूरे कीड़ों का झुंड दिखे और फूल मुरझाएं, तो तुरंत स्प्रे करें।"
    }
  ],
  "mustard/white-rust-alternaria": [
    {
      "url": "/images/diseases/disease-albugo-candida.jpg",
      "badgeHi": "🟡 पत्ती के नीचे सफेद फफोले",
      "badgeEn": "White Rust Pustules",
      "captionHi": "पत्तियों की निचली सतह पर सफेद-क्रीम रंग के चमकदार उभरे हुए फफोले",
      "captionEn": "Chalky white, raised, blister-like pustules erupting through lower leaf epidermis",
      "locationHi": "पत्ती की निचली सतह व फूलों की टहनी पर",
      "thumbRuleHi": "पत्ती के नीचे सफेद चमकदार फफोले दिखें और ऊपर की टहनी फूलकर मोटी व हिरन के सींग जैसी मुड़ी दिखे, तो यह सफेद रतुआ (व्हाइट रस्ट) है।"
    },
    {
      "url": "/images/diseases/disease-albugo-candida-2.jpg",
      "badgeHi": "🔴 फूलों का विकृत होना (हिरन सींग)",
      "badgeEn": "Staghead Floral Malformation",
      "captionHi": "फूलों की टहनी फूलकर मोटी, हरी व मुड़ी हुई हिरन के सींग जैसी (Staghead) हो जाती है",
      "captionEn": "Hypertrophied, distorted, sterile floral branches forming characteristic staghead galls",
      "locationHi": "पत्ती की निचली सतह व फूलों की टहनी पर",
      "thumbRuleHi": "पत्ती के नीचे सफेद चमकदार फफोले दिखें और ऊपर की टहनी फूलकर मोटी व हिरन के सींग जैसी मुड़ी दिखे, तो यह सफेद रतुआ (व्हाइट रस्ट) है।"
    },
    {
      "url": "/images/diseases/disease-albugo-candida-3.jpg",
      "badgeHi": "🌾 पत्तियों व फलियों पर काले छल्ले",
      "badgeEn": "Alternaria Concentric Rings",
      "captionHi": "पत्तियों व फलियों पर गोल काले छल्लेदार धब्बे, फलियों में दाना सिकुड़ना",
      "captionEn": "Target-board concentric dark spots on siliquae (pods) shriveling seeds inside",
      "locationHi": "पत्ती की निचली सतह व फूलों की टहनी पर",
      "thumbRuleHi": "पत्ती के नीचे सफेद चमकदार फफोले दिखें और ऊपर की टहनी फूलकर मोटी व हिरन के सींग जैसी मुड़ी दिखे, तो यह सफेद रतुआ (व्हाइट रस्ट) है।"
    }
  ],
  "mustard/sclerotinia-rot": [
    {
      "url": "/images/diseases/disease-sclerotinia-sclerotiorum.jpg",
      "badgeHi": "🟡 तने पर सफेद-धूसर घाव",
      "badgeEn": "Bleached Stem Lesions",
      "captionHi": "ज़मीन के पास तने पर पानी में भीगा सफेद-धूसर धब्बा, जिसपर सफेद फफूंद जमती है",
      "captionEn": "Water-soaked bleached, straw-colored lesions girdling the basal mustard stem",
      "locationHi": "निचले तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "सूखे हुए तने को बीच से चीरें; यदि तने के अंदर चूहे की मींगनी जैसे काले कड़क दाने (स्क्लेरोशिया) मिलें, तो यह स्क्लेरोटिनिया तना गलन (पोलियो रोग) है।"
    },
    {
      "url": "/images/crop-identification/24_mustard/sclerotinia_stem_rot.webp",
      "badgeHi": "🔴 तने में काले दाने (स्क्लेरोशिया)",
      "badgeEn": "Internal Black Sclerotia",
      "captionHi": "तने को चीरने पर अंदर खोखले भाग में चूहे की मींगनी जैसे काले कड़क दाने मिलते हैं",
      "captionEn": "Hollow stem interior packed with hard, irregular mouse-dropping-like black sclerotia",
      "locationHi": "निचले तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "सूखे हुए तने को बीच से चीरें; यदि तने के अंदर चूहे की मींगनी जैसे काले कड़क दाने (स्क्लेरोशिया) मिलें, तो यह स्क्लेरोटिनिया तना गलन (पोलियो रोग) है।"
    },
    {
      "url": "/images/diseases/disease-sclerotium-rolfsii-2.jpg",
      "badgeHi": "🌾 तना टूटना व पौधा सूखना",
      "badgeEn": "Stem Shredding & Plant Collapse",
      "captionHi": "तना कमजोर होकर पुआल जैसा सफेद हो जाता है और तेज हवा में बीच से टूटकर गिर जाता है",
      "captionEn": "Brittle, papery culm snapping in the wind, leading to premature lodging and total crop loss",
      "locationHi": "निचले तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "सूखे हुए तने को बीच से चीरें; यदि तने के अंदर चूहे की मींगनी जैसे काले कड़क दाने (स्क्लेरोशिया) मिलें, तो यह स्क्लेरोटिनिया तना गलन (पोलियो रोग) है।"
    }
  ],
  "mustard/painted-bug-sawfly": [
    {
      "url": "/images/pests/pest-bagrada-hilaris.jpg",
      "badgeHi": "🦗 चितकबरा कीट (बग)",
      "badgeEn": "Adult Painted Bug",
      "captionHi": "काला-नारंगी-पीला चितकबरा ढाल जैसा बग (Bagrada hilaris)",
      "captionEn": "Distinctive black bug patterned with bright orange and yellow markings",
      "locationHi": "नन्हें अंकुरित पौधों व पत्तियों पर",
      "thumbRuleHi": "अंकुरण के समय पौधे पर काले-नारंगी चितकबरे कीड़े या काली सुंडी दिखे और पत्तियों में गोल छेद हों, तो सुबह के समय राख व कीटनाशक डालें।"
    },
    {
      "url": "/images/pests/pest-bagrada-hilaris-2.jpg",
      "badgeHi": "🐛 आरा मक्खी की काली सुंडी",
      "badgeEn": "Sawfly Dark Grub",
      "captionHi": "अंकुरण के समय सुबह-शाम पत्तियों को किनारों से कुतरती गहरी काली-हरी सुंडी",
      "captionEn": "Dark greenish-black cylindrical sawfly larvae feeding on tender cotyledons and leaves",
      "locationHi": "नन्हें अंकुरित पौधों व पत्तियों पर",
      "thumbRuleHi": "अंकुरण के समय पौधे पर काले-नारंगी चितकबरे कीड़े या काली सुंडी दिखे और पत्तियों में गोल छेद हों, तो सुबह के समय राख व कीटनाशक डालें।"
    },
    {
      "url": "/images/crop-identification/24_mustard/painted_bug.webp",
      "badgeHi": "🌾 अंकुरित पौध का सूखना",
      "badgeEn": "Seedling Wilting & Drying",
      "captionHi": "रस चूसने से पत्तियों पर सफेद धब्बे पड़ते हैं और नन्हें पौधे सूखकर मर जाते हैं",
      "captionEn": "Severely punctured seedlings turning bleached, wilting, and dying in nursery stage",
      "locationHi": "नन्हें अंकुरित पौधों व पत्तियों पर",
      "thumbRuleHi": "अंकुरण के समय पौधे पर काले-नारंगी चितकबरे कीड़े या काली सुंडी दिखे और पत्तियों में गोल छेद हों, तो सुबह के समय राख व कीटनाशक डालें।"
    }
  ],
  "potato/late-blight": [
    {
      "url": "/images/diseases/disease-phytophthora-infestans.jpg",
      "badgeHi": "🟡 पत्तियों पर गीले काले धब्बे",
      "badgeEn": "Water-soaked Dark Blight",
      "captionHi": "पत्तियों के किनारों पर पानी में भीगे जैसे तेजी से फैलने वाले गहरे कत्थई-काले धब्बे",
      "captionEn": "Fast-spreading water-soaked greasy brown lesions on potato leaf margins",
      "locationHi": "पत्तियों, तने व कंदों (आलू) पर",
      "thumbRuleHi": "बादल छाए रहने पर पत्तियों पर गीले काले धब्बे, नीचे सफेद रूई जैसी फफूंद और पूरे खेत से सड़े हुए आलू जैसी तेज तीखी बदबू आती है।"
    },
    {
      "url": "/images/diseases/disease-phytophthora-infestans-2.jpg",
      "badgeHi": "🔴 पत्ती के नीचे सफेद फफूंद",
      "badgeEn": "Downy White Mildew Halo",
      "captionHi": "सुबह की ओस में धब्बे के किनारों पर निचली सतह पर बारीक सफेद रुई जैसी फफूंद",
      "captionEn": "Delicate ring of white downy fungal mildew active along underside of lesions",
      "locationHi": "पत्तियों, तने व कंदों (आलू) पर",
      "thumbRuleHi": "बादल छाए रहने पर पत्तियों पर गीले काले धब्बे, नीचे सफेद रूई जैसी फफूंद और पूरे खेत से सड़े हुए आलू जैसी तेज तीखी बदबू आती है।"
    },
    {
      "url": "/images/crop-identification/13_potato/late_blight.webp",
      "badgeHi": "🌾 खेत में झुलसा व सड़े कंद",
      "badgeEn": "Canopy Burn & Tuber Rot",
      "captionHi": "2-3 दिन में पूरा खेत जलने जैसा काला हो जाता है; कंदों पर कड़क चमड़े जैसे भूरे घाव",
      "captionEn": "Total foliar collapse with firm rusty brown dry-rot invading into harvested tubers",
      "locationHi": "पत्तियों, तने व कंदों (आलू) पर",
      "thumbRuleHi": "बादल छाए रहने पर पत्तियों पर गीले काले धब्बे, नीचे सफेद रूई जैसी फफूंद और पूरे खेत से सड़े हुए आलू जैसी तेज तीखी बदबू आती है।"
    }
  ],
  "potato/early-blight": [
    {
      "url": "/images/diseases/disease-alternaria-solani.jpg",
      "badgeHi": "🟡 पत्तियों पर गोल छल्लेदार धब्बे",
      "badgeEn": "Target-board Rings",
      "captionHi": "निचली पत्तियों पर गहरे भूरे गोल धब्बे जिनमें लकड़ी के गोल छल्ले (Target-board) दिखते हैं",
      "captionEn": "Concentric dark brown circular rings forming target patterns on lower leaves",
      "locationHi": "निचली पुरानी पत्तियों व कंदों पर",
      "thumbRuleHi": "पत्तियों पर गोल गहरे भूरे धब्बे देखें जिनमें पेड़ के छल्लों जैसे गोल घेरे हों और चारों तरफ पीला घेरा बना हो, तो यह अगेती झुलसा है।"
    },
    {
      "url": "/images/diseases/disease-alternaria-solani-2.jpg",
      "badgeHi": "🔴 पत्ती पीली पड़कर सूखना",
      "badgeEn": "Foliar Chlorosis & Desiccation",
      "captionHi": "धब्बे आपस में मिलकर पूरी पत्ती को सुखा देते हैं, पत्तियां मुड़कर झुलस जाती हैं",
      "captionEn": "Yellow halos expanding outwards causing lower leaves to curl and dry prematurely",
      "locationHi": "निचली पुरानी पत्तियों व कंदों पर",
      "thumbRuleHi": "पत्तियों पर गोल गहरे भूरे धब्बे देखें जिनमें पेड़ के छल्लों जैसे गोल घेरे हों और चारों तरफ पीला घेरा बना हो, तो यह अगेती झुलसा है।"
    },
    {
      "url": "/images/crop-identification/13_potato/early_blight.webp",
      "badgeHi": "🌾 कंद पर धंसे भूरे घाव",
      "badgeEn": "Sunken Tuber Lesions",
      "captionHi": "आलू के कंदों पर गहरे कत्थई धंसे हुए सूखे घाव, छिलका सिकुड़ जाना",
      "captionEn": "Dark, sunken, leathery lesions on potato tubers with raised purple-brown margins",
      "locationHi": "निचली पुरानी पत्तियों व कंदों पर",
      "thumbRuleHi": "पत्तियों पर गोल गहरे भूरे धब्बे देखें जिनमें पेड़ के छल्लों जैसे गोल घेरे हों और चारों तरफ पीला घेरा बना हो, तो यह अगेती झुलसा है।"
    }
  ],
  "potato/cutworm": [
    {
      "url": "/images/pests/pest-agrotis-ipsilon.jpg",
      "badgeHi": "🦗 कटुआ कीट का पतंगा",
      "badgeEn": "Black Cutworm Moth",
      "captionHi": "रात में उड़ने वाला भारी शरीर का गहरे धूसर-भूरे पंखों वाला पतंगा (Agrotis ipsilon)",
      "captionEn": "Nocturnal dark grey-brown owlet moth with characteristic dagger-shaped wing marks",
      "locationHi": "पौधे के आधार पर 2-3 सेमी मिट्टी खोदकर",
      "thumbRuleHi": "सुबह खेत में पौधे ज़मीन से कटे गिरे मिलें, तो कटे पौधे के पास की 2-3 इंच मिट्टी खुरचें; अंदर कुंडली मारे भूरी-काली सुंडी छिपी मिलेगी।"
    },
    {
      "url": "/images/pests/pest-agrotis-ipsilon-2.jpg",
      "badgeHi": "🐛 मिट्टी में कुंडली मारकर सुंडी",
      "badgeEn": "Curled Soil Cutworm",
      "captionHi": "ज़मीन के ठीक नीचे मिट्टी में छिपी चिकनी मटमैली-काली सुंडी जो छूने पर गोल 'C' आकार बना लेती है",
      "captionEn": "Smooth greasy greyish-black caterpillar tightly curled into a C-shape in topsoil",
      "locationHi": "पौधे के आधार पर 2-3 सेमी मिट्टी खोदकर",
      "thumbRuleHi": "सुबह खेत में पौधे ज़मीन से कटे गिरे मिलें, तो कटे पौधे के पास की 2-3 इंच मिट्टी खुरचें; अंदर कुंडली मारे भूरी-काली सुंडी छिपी मिलेगी।"
    },
    {
      "url": "/images/pests/pest-agrotis-ipsilon-3.jpg",
      "badgeHi": "🌾 ज़मीन के पास से कटे पौधे",
      "badgeEn": "Severed Stems at Ground Level",
      "captionHi": "रात के समय नन्हें पौधों को ज़मीन की सतह से काटकर गिरा देना",
      "captionEn": "Young potato stems neatly felled at the soil line by nocturnal caterpillars",
      "locationHi": "पौधे के आधार पर 2-3 सेमी मिट्टी खोदकर",
      "thumbRuleHi": "सुबह खेत में पौधे ज़मीन से कटे गिरे मिलें, तो कटे पौधे के पास की 2-3 इंच मिट्टी खुरचें; अंदर कुंडली मारे भूरी-काली सुंडी छिपी मिलेगी।"
    }
  ],
  "potato/black-scurf": [
    {
      "url": "/images/diseases/disease-rhizoctonia-solani.jpg",
      "badgeHi": "🟡 आलू पर चिपकी काली पपड़ी",
      "badgeEn": "Black Scurf Sclerotia on Tuber",
      "captionHi": "आलू के छिलके पर चिपके काले-भूरे कड़क दाने जो पानी से धोने पर भी नहीं छूटते",
      "captionEn": "Hard black cushion-like sclerotial crust adhering tightly to potato skin",
      "locationHi": "आलू के कंद व ज़मीन के अंदर तने पर",
      "thumbRuleHi": "आलू पर मिट्टी जैसे काले दाने दिखें; यदि पानी से धोने पर भी न छूटें (काली पपड़ी), तो यह ब्लैक स्कर्फ है।"
    },
    {
      "url": "/images/diseases/disease-rhizoctonia-solani-2.jpg",
      "badgeHi": "🔴 अंकुर व तने पर काला कैंकर",
      "badgeEn": "Stem & Stolon Canker",
      "captionHi": "ज़मीन के नीचे नए अंकुरों व तनों पर धंसे हुए कत्थई-काले घाव, अंकुर गलना",
      "captionEn": "Sunken dark brown cankers girdling subterranean sprouts and stolons",
      "locationHi": "आलू के कंद व ज़मीन के अंदर तने पर",
      "thumbRuleHi": "आलू पर मिट्टी जैसे काले दाने दिखें; यदि पानी से धोने पर भी न छूटें (काली पपड़ी), तो यह ब्लैक स्कर्फ है।"
    },
    {
      "url": "/images/crop-identification/13_potato/black_scurf.webp",
      "badgeHi": "🌾 तने पर हवाई आलू बनना",
      "badgeEn": "Aerial Tubers on Stems",
      "captionHi": "नीचे संवहन रुकने से तने की गांठों पर हवा में छोटे-छोटे आलू (Aerial tubers) बन जाते हैं",
      "captionEn": "Vascular blockage forcing plant to produce small, deformed green aerial tubers on axils",
      "locationHi": "आलू के कंद व ज़मीन के अंदर तने पर",
      "thumbRuleHi": "आलू पर मिट्टी जैसे काले दाने दिखें; यदि पानी से धोने पर भी न छूटें (काली पपड़ी), तो यह ब्लैक स्कर्फ है।"
    }
  ],
  "potato/aphid-whitefly": [
    {
      "url": "/images/pests/pest-myzus-persicae.jpg",
      "badgeHi": "🦗 पत्ती पर माहू (एफिड)",
      "badgeEn": "Green Peach Aphid",
      "captionHi": "पत्ती के नीचे चिपके हल्के हरे रंग के कोमल माहू जो रस चूसते हैं",
      "captionEn": "Pale green soft-bodied aphids colonizing undersides of young potato leaves",
      "locationHi": "पत्ती की निचली सतह व नई शाखाओं पर",
      "thumbRuleHi": "पत्ती की निचली सतह पर छोटे हरे माहू या सफेद मक्खी दिखें; यह वायरस फैलाकर बीज आलू की फसल बर्बाद कर देते हैं।"
    },
    {
      "url": "/images/pests/pest-myzus-persicae-2.jpg",
      "badgeHi": "🪲 निम्फ व चिपचिपा स्राव",
      "badgeEn": "Nymphs & Honeydew Excretion",
      "captionHi": "पत्तियों पर चिपचिपा शहद जैसा स्राव और काली फफूंद",
      "captionEn": "Heavy honeydew secretion encouraging sooty mold and impeding photosynthesis",
      "locationHi": "पत्ती की निचली सतह व नई शाखाओं पर",
      "thumbRuleHi": "पत्ती की निचली सतह पर छोटे हरे माहू या सफेद मक्खी दिखें; यह वायरस फैलाकर बीज आलू की फसल बर्बाद कर देते हैं।"
    },
    {
      "url": "/images/pests/pest-bemisia-tabaci.jpg",
      "badgeHi": "🌾 वायरस फैलाव (पत्ता मरोड़)",
      "badgeEn": "Virus Vector Transmission",
      "captionHi": "माहू व सफेद मक्खी द्वारा आलू का लीफ रोल वायरस (PLRV) फैलाना; पत्तियां चम्मच जैसी मुड़ना",
      "captionEn": "Vectoring potato leafroll and mosaic viruses causing rolling and severe degeneration",
      "locationHi": "पत्ती की निचली सतह व नई शाखाओं पर",
      "thumbRuleHi": "पत्ती की निचली सतह पर छोटे हरे माहू या सफेद मक्खी दिखें; यह वायरस फैलाकर बीज आलू की फसल बर्बाद कर देते हैं।"
    }
  ],
  "chilli/thrips": [
    {
      "url": "/images/pests/pest-scirtothrips-dorsalis.jpg",
      "badgeHi": "🦗 थ्रिप्स वयस्क कीट",
      "badgeEn": "Adult Chilli Thrips",
      "captionHi": "पत्तियों व फूलों पर बैठा बहुत छोटा पतला भूरा-पीला कीट (Scirtothrips dorsalis)",
      "captionEn": "Minute straw-yellow thrips actively crawling between veins and floral parts",
      "locationHi": "शीर्ष की कोमल पत्तियों व फूलों पर",
      "thumbRuleHi": "मिर्च की पत्तियां यदि ऊपर की ओर मुड़कर नाव या चम्मच जैसी हो जाएं, तो यह थ्रिप्स है। (यदि नीचे की ओर मुड़ें तो मकड़ी है)।"
    },
    {
      "url": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
      "badgeHi": "🪲 पत्ती खुरचते निम्फ",
      "badgeEn": "Feeding Yellow Nymphs",
      "captionHi": "पत्ती की निचली सतह को खुरचकर रस चूसते हुए नन्हें पीले निम्फ",
      "captionEn": "Translucent yellow wingless nymphs rasping tender epidermis and sucking sap",
      "locationHi": "शीर्ष की कोमल पत्तियों व फूलों पर",
      "thumbRuleHi": "मिर्च की पत्तियां यदि ऊपर की ओर मुड़कर नाव या चम्मच जैसी हो जाएं, तो यह थ्रिप्स है। (यदि नीचे की ओर मुड़ें तो मकड़ी है)।"
    },
    {
      "url": "/images/pests/pest-scirtothrips-dorsalis-3.jpg",
      "badgeHi": "🌾 पत्तियां ऊपर मुड़ना (नाव जैसी)",
      "badgeEn": "Upward Boat-shaped Cupping",
      "captionHi": "पत्तियों के किनारे ऊपर की ओर मुड़कर नाव या कटोरी जैसे हो जाते हैं; पौधे की बढ़वार रुकना",
      "captionEn": "Upward boat-shaped curling of leaves with bronzed marginal veins (Murda rog)",
      "locationHi": "शीर्ष की कोमल पत्तियों व फूलों पर",
      "thumbRuleHi": "मिर्च की पत्तियां यदि ऊपर की ओर मुड़कर नाव या चम्मच जैसी हो जाएं, तो यह थ्रिप्स है। (यदि नीचे की ओर मुड़ें तो मकड़ी है)।"
    }
  ],
  "chilli/broad-mite": [
    {
      "url": "/images/pests/pest-polyphagotarsonemus-latus.jpg",
      "badgeHi": "🦗 पीली मकड़ी (अति सूक्ष्म)",
      "badgeEn": "Broad Mite Microscopic",
      "captionHi": "पत्ती के नीचे लेंस से दिखने वाली नन्हीं पीली-सफेद मकड़ी (Polyphagotarsonemus latus)",
      "captionEn": "Microscopic translucent amber broad mite moving rapidly beneath leaves",
      "locationHi": "नई कोमल पत्तियों की निचली सतह पर",
      "thumbRuleHi": "यदि मिर्च की नई पत्तियां नीचे की ओर मुड़कर कड़क हो जाएं और डंठल खींचे हुए लंबे दिखें, तो यह पीली मकड़ी (माइट) का हमला है।"
    },
    {
      "url": "/images/crop-identification/06_chilli/broad_mite.webp",
      "badgeHi": "🔴 पत्तियां नीचे मुड़ना (उल्टी नाव)",
      "badgeEn": "Downward Inverted Cupping",
      "captionHi": "पत्तियों के किनारे नीचे की ओर मुड़कर कड़क व गहरे हरे उल्टे चम्मच जैसे हो जाते हैं",
      "captionEn": "Downward inverted curl with thickened, brittle, glossy dark-green leaf texture",
      "locationHi": "नई कोमल पत्तियों की निचली सतह पर",
      "thumbRuleHi": "यदि मिर्च की नई पत्तियां नीचे की ओर मुड़कर कड़क हो जाएं और डंठल खींचे हुए लंबे दिखें, तो यह पीली मकड़ी (माइट) का हमला है।"
    },
    {
      "url": "/images/crop-identification/06_chilli/broad_mite.webp",
      "badgeHi": "🌾 मोटी कड़क पत्तियां व झुलसा",
      "badgeEn": "Elongated Petioles & Stunting",
      "captionHi": "पत्तियों का डंठल लंबा हो जाता है और पत्तियां उल्टे कप जैसी कड़क होकर झड़ जाती हैं",
      "captionEn": "Petioles elongated into inverted umbrellas with bud drop and severe stunting",
      "locationHi": "नई कोमल पत्तियों की निचली सतह पर",
      "thumbRuleHi": "यदि मिर्च की नई पत्तियां नीचे की ओर मुड़कर कड़क हो जाएं और डंठल खींचे हुए लंबे दिखें, तो यह पीली मकड़ी (माइट) का हमला है।"
    }
  ],
  "chilli/anthracnose-dieback": [
    {
      "url": "/images/diseases/disease-colletotrichum-gloeosporioides.jpg",
      "badgeHi": "🟡 पके फल पर धंसे काले छल्ले",
      "badgeEn": "Sunken Fruit Lesions",
      "captionHi": "पकी व हरी मिर्च पर गोल धंसे हुए धब्बे जिनमें काले बिंदुओं के छल्ले होते हैं",
      "captionEn": "Sunken circular necrotic spots on ripening pods with black acervuli rings",
      "locationHi": "पकी/हरी मिर्चियों व टहनी की नोक पर",
      "thumbRuleHi": "लाल या हरी मिर्च पर गोल धंसे हुए काले छल्ले दिखें और टहनियां ऊपर से नीचे की ओर सूखने लगें, तो यह एन्थ्रेक्नोज (डाई-बैक) है।"
    },
    {
      "url": "/images/diseases/disease-colletotrichum-gloeosporioides-2.jpg",
      "badgeHi": "🔴 टहनी ऊपर से नीचे सूखना (डाइबैक)",
      "badgeEn": "Dieback from Twig Apex",
      "captionHi": "टहनी की नोक से सूखना शुरू होकर नीचे की ओर बढ़ता है और टहनी पुआल जैसी सफेद हो जाती है",
      "captionEn": "Progressive basipetal withering and whitening of top twigs from apex downward",
      "locationHi": "पकी/हरी मिर्चियों व टहनी की नोक पर",
      "thumbRuleHi": "लाल या हरी मिर्च पर गोल धंसे हुए काले छल्ले दिखें और टहनियां ऊपर से नीचे की ओर सूखने लगें, तो यह एन्थ्रेक्नोज (डाई-बैक) है।"
    },
    {
      "url": "/images/diseases/disease-colletotrichum-gloeosporioides-3.jpg",
      "badgeHi": "🌾 सड़ी सूखी मिर्चियां व फल गिरना",
      "badgeEn": "Mummified Bleached Pods",
      "captionHi": "मिर्चें सूखकर सफेदी लिए भूरी हो जाती हैं और टूटकर गिर जाती हैं; भारी उपज हानि",
      "captionEn": "Straw-colored shriveled mummified fruits dropping and rotting on the ground",
      "locationHi": "पकी/हरी मिर्चियों व टहनी की नोक पर",
      "thumbRuleHi": "लाल या हरी मिर्च पर गोल धंसे हुए काले छल्ले दिखें और टहनियां ऊपर से नीचे की ओर सूखने लगें, तो यह एन्थ्रेक्नोज (डाई-बैक) है।"
    }
  ],
  "chilli/powdery-mildew": [
    {
      "url": "/images/diseases/disease-podosphaera-xanthii.jpg",
      "badgeHi": "🟡 पत्ती के नीचे सफेद पाउडर",
      "badgeEn": "White Fungal Powder Beneath",
      "captionHi": "पत्ती की निचली सतह पर सफेद आटे जैसी फफूंद का चूर्ण दिखना",
      "captionEn": "White powdery patches of fungal growth spreading on lower leaf epidermis",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्ती की निचली सतह पर सफेद आटे जैसा पाउडर दिखे और ऊपर पीला धब्बा हो, तथा हल्की हवा से भी पत्तियां झड़ने लगें, तो यह पाउडरी मिल्ड्यू है।"
    },
    {
      "url": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
      "badgeHi": "🔴 ऊपरी सतह पर पीले धब्बे",
      "badgeEn": "Chlorotic Patches on Upper Leaf",
      "captionHi": "सफेद पाउडर के ठीक ऊपर पत्ती की ऊपरी सतह पर पीले धब्बे उभरते हैं",
      "captionEn": "Bright yellow chlorotic blotches corresponding to powdery growth on reverse",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्ती की निचली सतह पर सफेद आटे जैसा पाउडर दिखे और ऊपर पीला धब्बा हो, तथा हल्की हवा से भी पत्तियां झड़ने लगें, तो यह पाउडरी मिल्ड्यू है।"
    },
    {
      "url": "/images/crop-identification/06_chilli/powdery_mildew.webp",
      "badgeHi": "🌾 पत्तियां झड़ना (नंगी टहनियां)",
      "badgeEn": "Premature Defoliation",
      "captionHi": "प्रभावित पत्तियां तेजी से पीली होकर झड़ जाती हैं और केवल मिर्चियों से लदी नंगी टहनियां बचती हैं",
      "captionEn": "Extensive leaf shedding leaving chili plants stripped bare with exposed fruits",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्ती की निचली सतह पर सफेद आटे जैसा पाउडर दिखे और ऊपर पीला धब्बा हो, तथा हल्की हवा से भी पत्तियां झड़ने लगें, तो यह पाउडरी मिल्ड्यू है।"
    }
  ],
  "chilli/fruit-borer": [
    {
      "url": "/images/pests/pest-helicoverpa-armigera.jpg",
      "badgeHi": "🦗 फल छेदक पतंगा",
      "badgeEn": "Adult Borer Moth",
      "captionHi": "मजबूत शरीर वाला पीले-भूरे रंग का रात में सक्रिय पतंगा",
      "captionEn": "Stout noctuid moth with dusky forewings active during night laying eggs on leaves",
      "locationHi": "मिर्च के फल पर",
      "thumbRuleHi": "मिर्च की सतह पर गोल छेद और डंठल के पास काला मल दिखे तथा फल समय से पहले पीला होकर गिर जाए, तो फल छेदक सुंडी है।"
    },
    {
      "url": "/images/pests/pest-helicoverpa-armigera-2.jpg",
      "badgeHi": "🐛 मिर्च में छेद करती सुंडी",
      "badgeEn": "Caterpillar Boring in Pod",
      "captionHi": "मिर्च के अंदर घुसकर बीजों व गूदे को खाती हुई धारीदार सुंडी",
      "captionEn": "Smooth striped borer larva inside dissected pod devouring developing seeds",
      "locationHi": "मिर्च के फल पर",
      "thumbRuleHi": "मिर्च की सतह पर गोल छेद और डंठल के पास काला मल दिखे तथा फल समय से पहले पीला होकर गिर जाए, तो फल छेदक सुंडी है।"
    },
    {
      "url": "/images/crop-identification/06_chilli/helicoverpa_fruit_borer.webp",
      "badgeHi": "🌾 मिर्च पर गोल छेद व फल सड़ना",
      "badgeEn": "Circular Boreholes & Rot",
      "captionHi": "मिर्च पर साफ गोल छेद दिखता है और अंदर से मिर्च पीली पड़कर सड़ जाती है",
      "captionEn": "Clean circular exit holes with secondary fungal decay turning pod mushy",
      "locationHi": "मिर्च के फल पर",
      "thumbRuleHi": "मिर्च की सतह पर गोल छेद और डंठल के पास काला मल दिखे तथा फल समय से पहले पीला होकर गिर जाए, तो फल छेदक सुंडी है।"
    }
  ],
  "chilli/collar-rot-wilt": [
    {
      "url": "/images/diseases/disease-fusarium-ciceri.jpg",
      "badgeHi": "🟡 तने के जोड़ पर गीला घाव",
      "badgeEn": "Collar Rot Watery Girdle",
      "captionHi": "ज़मीन की सतह पर तने के आधार पर काला-भूरा सड़न का घाव",
      "captionEn": "Dark water-soaked necrotic collar constriction girdling base of chili plant",
      "locationHi": "ज़मीन के पास तने के जोड़ व जड़ों में",
      "thumbRuleHi": "ज़मीन की सतह के पास तने को छूने पर यदि छाल सड़ी व गीली निकले और पौधा दिन में मुरझाए, तो यह कॉलर रॉट / विल्ट है।"
    },
    {
      "url": "/images/diseases/disease-fusarium-ciceri-2.jpg",
      "badgeHi": "🔴 तने के पास सफेद फफूंद",
      "badgeEn": "Basal White Mycelial Fan",
      "captionHi": "तने के आधार व मिट्टी पर सफेद फफूंद के जाले और सरसों जैसे भूरे दाने",
      "captionEn": "Cottony white fungal hyphae and brown spherical sclerotia around stem base",
      "locationHi": "ज़मीन के पास तने के जोड़ व जड़ों में",
      "thumbRuleHi": "ज़मीन की सतह के पास तने को छूने पर यदि छाल सड़ी व गीली निकले और पौधा दिन में मुरझाए, तो यह कॉलर रॉट / विल्ट है।"
    },
    {
      "url": "/images/crop-identification/06_chilli/collar_rot.webp",
      "badgeHi": "🌾 पूरा पौधा अचानक मुरझाना",
      "badgeEn": "Sudden Wilt Collapse",
      "captionHi": "सिंचाई या बारिश के बाद हरा-भरा पौधा अचानक 2-3 दिन में सूखकर मर जाता है",
      "captionEn": "Complete irreversible daytime wilting and collapse of lush green bearing plants",
      "locationHi": "ज़मीन के पास तने के जोड़ व जड़ों में",
      "thumbRuleHi": "ज़मीन की सतह के पास तने को छूने पर यदि छाल सड़ी व गीली निकले और पौधा दिन में मुरझाए, तो यह कॉलर रॉट / विल्ट है।"
    }
  ],
  "sugarcane/red-rot": [
    {
      "url": "/images/diseases/disease-colletotrichum-falcatum.jpg",
      "badgeHi": "🟡 तीसरी-चौथी पत्ती का सूखना",
      "badgeEn": "Crown Leaf Desiccation",
      "captionHi": "गोभ की तीसरी व चौथी पत्ती किनारों से सूखने लगती है और पूरा अगोला पीला पड़ जाता है",
      "captionEn": "Third and fourth whorl leaves drying inwards with yellowing of the crown",
      "locationHi": "गन्ने के तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "मुरझाए गन्ने को बीच से चीरें; यदि अंदर लाल गूदे में सफेद आड़ी पट्टियां दिखें और सड़े सिरके जैसी खट्टी बदबू आए, तो यह गन्ने का कैंसर (रेड रॉट) है।"
    },
    {
      "url": "/images/crop-identification/12_sugarcane/red_rot.webp",
      "badgeHi": "🔴 चीरने पर लाल गूदा व सफेद पट्टियां",
      "badgeEn": "Red Pith with White Bands",
      "captionHi": "गन्ने को लंबाई में चीरने पर अंदर लाल रंग का गूदा और बीच-बीच में सफेद चौड़ी आड़ी पट्टियां",
      "captionEn": "Internodes showing vivid crimson-red pith interspersed with broad white transverse bands",
      "locationHi": "गन्ने के तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "मुरझाए गन्ने को बीच से चीरें; यदि अंदर लाल गूदे में सफेद आड़ी पट्टियां दिखें और सड़े सिरके जैसी खट्टी बदबू आए, तो यह गन्ने का कैंसर (रेड रॉट) है।"
    },
    {
      "url": "/images/diseases/disease-colletotrichum-falcatum.jpg",
      "badgeHi": "🌾 सड़े गुड़ जैसी बदबू व गन्ने का सूखना",
      "badgeEn": "Sour Alcoholic Rot",
      "captionHi": "गन्ने से सड़े सिरके या शराब जैसी तीखी बदबू आती है और गन्ना अंदर से खोखला हो जाता है",
      "captionEn": "Pith shriveling into hollow cavity emitting distinct fermented alcoholic sour aroma",
      "locationHi": "गन्ने के तने के अंदर (चीरकर देखें)",
      "thumbRuleHi": "मुरझाए गन्ने को बीच से चीरें; यदि अंदर लाल गूदे में सफेद आड़ी पट्टियां दिखें और सड़े सिरके जैसी खट्टी बदबू आए, तो यह गन्ने का कैंसर (रेड रॉट) है।"
    }
  ],
  "sugarcane/early-shoot-borer": [
    {
      "url": "/images/pests/pest-chilo-infuscatellus.jpg",
      "badgeHi": "🦗 अगेती तना छेदक पतंगा",
      "badgeEn": "Early Shoot Borer Moth",
      "captionHi": "पुआल के रंग का हल्के भूरे पंखों वाला छोटा पतंगा (Chilo infuscatellus)",
      "captionEn": "Small straw-colored moth with tiny black spots along outer wing margins",
      "locationHi": "ज़मीन की सतह के पास नन्हे गन्ने के तने में",
      "thumbRuleHi": "गर्मी के महीनों में गन्ने की सूखी गोभ को खींचें; यदि वह सड़ी हुई बदबू के साथ आसानी से निकल आए, तो कंसुआ (अगेती तना छेदक) है।"
    },
    {
      "url": "/images/pests/pest-chilo-infuscatellus-2.jpg",
      "badgeHi": "🐛 तने में सुंडी (कंसुआ)",
      "badgeEn": "Borer Caterpillar in Shoot",
      "captionHi": "अंकुरण के समय ज़मीन की सतह के पास तने में छेद करके अंदर खाती मटमैली सुंडी",
      "captionEn": "Dirty white caterpillar with five violet-brown stripes tunneling near base",
      "locationHi": "ज़मीन की सतह के पास नन्हे गन्ने के तने में",
      "thumbRuleHi": "गर्मी के महीनों में गन्ने की सूखी गोभ को खींचें; यदि वह सड़ी हुई बदबू के साथ आसानी से निकल आए, तो कंसुआ (अगेती तना छेदक) है।"
    },
    {
      "url": "/images/pests/pest-chilo-infuscatellus-3.jpg",
      "badgeHi": "🌾 सूखा गोभ (सड़ी बदबू)",
      "badgeEn": "Deadheart with Foul Odor",
      "captionHi": "बुवाई के 1-3 महीने में बीच की गोभ सूख जाती है और खींचने पर सड़ी बदबू के साथ निकलती है",
      "captionEn": "Central deadheart pulling out with ease and producing foul rotting stench",
      "locationHi": "ज़मीन की सतह के पास नन्हे गन्ने के तने में",
      "thumbRuleHi": "गर्मी के महीनों में गन्ने की सूखी गोभ को खींचें; यदि वह सड़ी हुई बदबू के साथ आसानी से निकल आए, तो कंसुआ (अगेती तना छेदक) है।"
    }
  ],
  "sugarcane/top-borer": [
    {
      "url": "/images/pests/pest-scirpophaga-excerptalis.jpg",
      "badgeHi": "🦗 चोटी बेधक पतंगा",
      "badgeEn": "Top Borer Pure White Moth",
      "captionHi": "सफेद चमकदार पंखों वाला पतंगा (मादा के पिछले सिरे पर लाल-नारंगी बालों का गुच्छा)",
      "captionEn": "Pure silvery-white moth; female bearing a crimson-red tuft of anal hairs",
      "locationHi": "गन्ने की चोटी (अगोला) व मध्य नस पर",
      "thumbRuleHi": "पत्ती की बीच वाली मोटी नस में लाल रंग की सुरंग दिखे और चोटी पर कई छोटी पत्तियां निकलकर झाड़ीनुमा (बंची टॉप) हो जाएं, तो यह टॉप बोरर है।"
    },
    {
      "url": "/images/pests/pest-scirpophaga-excerptalis-2.jpg",
      "badgeHi": "🐛 मध्य नस में लाल सुरंग",
      "badgeEn": "Midrib Tunneling & Shot-holes",
      "captionHi": "पत्ती की बीच की मोटी नस में लाल रंग की सुरंग और पत्तियों पर छलनी जैसे गोल छेद",
      "captionEn": "Reddish streak inside leaf midrib and parallel rows of shot-holes on leaf blade",
      "locationHi": "गन्ने की चोटी (अगोला) व मध्य नस पर",
      "thumbRuleHi": "पत्ती की बीच वाली मोटी नस में लाल रंग की सुरंग दिखे और चोटी पर कई छोटी पत्तियां निकलकर झाड़ीनुमा (बंची टॉप) हो जाएं, तो यह टॉप बोरर है।"
    },
    {
      "url": "/images/pests/pest-scirpophaga-excerptalis-3.jpg",
      "badgeHi": "🌾 चोटी झाड़ीनुमा होना (बंची टॉप)",
      "badgeEn": "Bunchy Top Appearance",
      "captionHi": "बढ़वार बिंदु नष्ट होने से चोटी पर चारों तरफ छोटी-छोटी पत्तियां निकलकर झाड़ी (Bunchy top) बन जाती हैं",
      "captionEn": "Destruction of apical growing point forcing side buds into a dense bunchy top",
      "locationHi": "गन्ने की चोटी (अगोला) व मध्य नस पर",
      "thumbRuleHi": "पत्ती की बीच वाली मोटी नस में लाल रंग की सुरंग दिखे और चोटी पर कई छोटी पत्तियां निकलकर झाड़ीनुमा (बंची टॉप) हो जाएं, तो यह टॉप बोरर है।"
    }
  ],
  "sugarcane/pyrilla-woolly-aphid": [
    {
      "url": "/images/pests/pest-pyrilla-perpusilla.jpg",
      "badgeHi": "🦗 पायरिला वयस्क फुदका",
      "badgeEn": "Pyrilla Adult Hopper",
      "captionHi": "आगे की ओर चोंच जैसा सिर वाला भूरे-पीले पंखों वाला फुदका कीट (Pyrilla perpusilla)",
      "captionEn": "Straw-colored planthopper with prominent snout-like head projection",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्तियों के नीचे मोमी सफेद पूंछ वाले निम्फ फुदकते दिखें और पूरा खेत चिपचिपा व काला (काली फफूंद) दिखने लगे, तो यह पायरिला है।"
    },
    {
      "url": "/images/pests/pest-pyrilla-perpusilla-2.jpg",
      "badgeHi": "🪲 सफेद पूंछ वाले निम्फ",
      "badgeEn": "Nymphs with Waxy Tails",
      "captionHi": "पत्तियों के नीचे चिपके निम्फ जिनके पिछले हिस्से पर दो सफेद मोमी धागे (पूंछ) होते हैं",
      "captionEn": "Greenish-brown nymphs bearing a pair of characteristic white cottony caudal threads",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्तियों के नीचे मोमी सफेद पूंछ वाले निम्फ फुदकते दिखें और पूरा खेत चिपचिपा व काला (काली फफूंद) दिखने लगे, तो यह पायरिला है।"
    },
    {
      "url": "/images/pests/pest-pyrilla-perpusilla-3.jpg",
      "badgeHi": "🌾 पत्तियां काली पड़ना व रस सूखना",
      "badgeEn": "Black Sooty Cane Canopy",
      "captionHi": "मीठे स्राव पर पूरी पत्तियां काली पड़ जाती हैं, गुड़ की रिकवरी भारी घट जाती है",
      "captionEn": "Dense black sooty mold covering entire leaf surface reducing sucrose content drastically",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्तियों के नीचे मोमी सफेद पूंछ वाले निम्फ फुदकते दिखें और पूरा खेत चिपचिपा व काला (काली फफूंद) दिखने लगे, तो यह पायरिला है।"
    }
  ],
  "sugarcane/termite-white-grub": [
    {
      "url": "/images/pests/pest-odontotermes-obesus.jpg",
      "badgeHi": "🦗 दीमक के श्रमिक",
      "badgeEn": "Subterranean Termites",
      "captionHi": "गन्ने के टुकड़ों (सेट्स) और जड़ों को खाती हुई सफेद दीमक",
      "captionEn": "Creamy white worker termites tunneling inside planted sugarcane setts and roots",
      "locationHi": "ज़मीन के अंदर जड़ों व गन्ने के टुकड़ों पर",
      "thumbRuleHi": "सूखे हुए गन्ने के थान को हिलाकर देखें; यदि वह बिना जोर लगाए उखड़ जाए और नीचे जड़ें कटी मिलें, तो मिट्टी में सफेद लट या दीमक है।"
    },
    {
      "url": "/images/pests/pest-odontotermes-obesus-2.jpg",
      "badgeHi": "🐛 सफेद लट (व्हाइट ग्रब)",
      "badgeEn": "C-shaped White Grub",
      "captionHi": "मिट्टी के अंदर जड़ों को काटती हुई मोटी सफेद मुड़ी हुई 'C' आकार की लट",
      "captionEn": "Thick fleshy C-shaped scarabaeid grub with yellowish-brown head gnawing roots",
      "locationHi": "ज़मीन के अंदर जड़ों व गन्ने के टुकड़ों पर",
      "thumbRuleHi": "सूखे हुए गन्ने के थान को हिलाकर देखें; यदि वह बिना जोर लगाए उखड़ जाए और नीचे जड़ें कटी मिलें, तो मिट्टी में सफेद लट या दीमक है।"
    },
    {
      "url": "/images/crop-identification/12_sugarcane/white_grub.webp",
      "badgeHi": "🌾 गन्ने का थान सूखना",
      "badgeEn": "Clump Desiccation & Lodging",
      "captionHi": "जड़ें कटने से पूरा थान पीला पड़कर सूख जाता है और आसानी से उखड़ जाता है",
      "captionEn": "Entire cane stools turning chlorotic, desiccating, and toppling over easily",
      "locationHi": "ज़मीन के अंदर जड़ों व गन्ने के टुकड़ों पर",
      "thumbRuleHi": "सूखे हुए गन्ने के थान को हिलाकर देखें; यदि वह बिना जोर लगाए उखड़ जाए और नीचे जड़ें कटी मिलें, तो मिट्टी में सफेद लट या दीमक है।"
    }
  ],
  "sugarcane/pokkah-boeng": [
    {
      "url": "/images/diseases/disease-fusarium-moniliforme.jpg",
      "badgeHi": "🟡 पत्तियों के आधार पर सफेदी",
      "badgeEn": "Basal Chlorosis on Leaves",
      "captionHi": "शीर्ष की युवा पत्तियों के आधार पर सफेद-पीलापन और पत्तियां सिकुड़ना",
      "captionEn": "Pronounced chlorotic whitening developing at base of youngest emerging leaves",
      "locationHi": "चोटी की नई पत्तियों व बढ़वार बिंदु पर",
      "thumbRuleHi": "मानसून के समय गन्ने की चोटी की नई पत्तियां मुड़ी-तुड़ी व सिकुड़ी दिखें और आधार पर लाल-भूरे कट के निशान हों, तो यह पोक्का बोइंग है।"
    },
    {
      "url": "/images/crop-identification/12_sugarcane/pokkah_boeng.webp",
      "badgeHi": "🔴 पत्तियां मुड़ना व सीढ़ीदार घाव",
      "badgeEn": "Twisted Foliage & Ladder Lesions",
      "captionHi": "पत्तियां विकृत होकर आपस में उलझ जाती हैं और नसों पर सीढ़ी जैसे लाल-भूरे कट दिखते हैं",
      "captionEn": "Severe twisting, wrinkling, and ladder-like transverse reddish cuts along leaf blades",
      "locationHi": "चोटी की नई पत्तियों व बढ़वार बिंदु पर",
      "thumbRuleHi": "मानसून के समय गन्ने की चोटी की नई पत्तियां मुड़ी-तुड़ी व सिकुड़ी दिखें और आधार पर लाल-भूरे कट के निशान हों, तो यह पोक्का बोइंग है।"
    },
    {
      "url": "/images/diseases/disease-fusarium-moniliforme.jpg",
      "badgeHi": "🌾 चोटी सड़ना (चाकू कट लक्षण)",
      "badgeEn": "Top Rot & Knife Cut Stage",
      "captionHi": "गंभीर अवस्था में चोटी पूरी तरह सड़ जाती है और तने पर चाकू से कटे जैसा निशान दिखता है",
      "captionEn": "Growing point rots away completely with deep horizontal cuts resembling knife incisions",
      "locationHi": "चोटी की नई पत्तियों व बढ़वार बिंदु पर",
      "thumbRuleHi": "मानसून के समय गन्ने की चोटी की नई पत्तियां मुड़ी-तुड़ी व सिकुड़ी दिखें और आधार पर लाल-भूरे कट के निशान हों, तो यह पोक्का बोइंग है।"
    }
  ],
  "chana/pod-borer": [
    {
      "url": "/images/pests/pest-helicoverpa-armigera.jpg",
      "badgeHi": "🦗 फली छेदक पतंगा",
      "badgeEn": "Helicoverpa Pod Borer Moth",
      "captionHi": "पीले-भूरे पंखों वाला रात में उड़ने वाला पतंगा (Helicoverpa armigera)",
      "captionEn": "Stout nocturnal moth resting among foliage during day and flying at dusk",
      "locationHi": "चने की हरी फलियों व फूलों पर",
      "thumbRuleHi": "चने की फली पर गोल छेद दिखे और अंदर दाना खाया हुआ मिले, या हरी सुंडी फली से सिर घुसाए मिले, तो यह चने की मुख्य इल्ली (घाटी सुंडी) है।"
    },
    {
      "url": "/images/pests/pest-helicoverpa-armigera-2.jpg",
      "badgeHi": "🐛 फली में सुंडी (इल्ली)",
      "badgeEn": "Borer Larva in Pod",
      "captionHi": "हरी-भूरी धारीदार सुंडी अपना सिर फली में घुसाकर दाना खाती है और पिछला हिस्सा बाहर रहता है",
      "captionEn": "Voracious caterpillar inserting anterior body into pod while feeding on seeds",
      "locationHi": "चने की हरी फलियों व फूलों पर",
      "thumbRuleHi": "चने की फली पर गोल छेद दिखे और अंदर दाना खाया हुआ मिले, या हरी सुंडी फली से सिर घुसाए मिले, तो यह चने की मुख्य इल्ली (घाटी सुंडी) है।"
    },
    {
      "url": "/images/crop-identification/22_chickpea/helicoverpa_pod_borer.webp",
      "badgeHi": "🌾 फली में गोल छेद व खाली फलियां",
      "badgeEn": "Bored Pods & Damaged Seeds",
      "captionHi": "चने की फलियों में साफ गोल छेद दिखता है और अंदर का दाना पूरी तरह खाया हुआ होता है",
      "captionEn": "Emptied pods with round entry holes resulting in massive direct yield destruction",
      "locationHi": "चने की हरी फलियों व फूलों पर",
      "thumbRuleHi": "चने की फली पर गोल छेद दिखे और अंदर दाना खाया हुआ मिले, या हरी सुंडी फली से सिर घुसाए मिले, तो यह चने की मुख्य इल्ली (घाटी सुंडी) है।"
    }
  ],
  "chana/fusarium-wilt-root-rot": [
    {
      "url": "/images/diseases/disease-fusarium-ciceri.jpg",
      "badgeHi": "🟡 पत्तियों का झुकना व मुरझाना",
      "badgeEn": "Drooping Chlorotic Foliage",
      "captionHi": "पौधे की पत्तियां ऊपर से नीचे की ओर झुककर फीकी-पीली पड़ जाती हैं और पौधा मुरझाता है",
      "captionEn": "Characteristic dull green to yellow drooping of leaves starting from crown",
      "locationHi": "जड़ों व मुख्य तने के संवहन तंत्र में",
      "thumbRuleHi": "मुरझाए पौधे की मुख्य जड़ को नाखून या चाकू से लंबाई में फाड़ें; यदि अंदर बीच की नस काली-कत्थई दिखे, तो यह उकठा (विल्ट) रोग है।"
    },
    {
      "url": "/images/diseases/disease-fusarium-ciceri-2.jpg",
      "badgeHi": "🔴 जड़ चीरने पर काली-भूरी नसें",
      "badgeEn": "Internal Vascular Browning",
      "captionHi": "जड़ को बीच से चीरने पर अंदर की संवहनी नलियां (Xylem) गहरे भूरे या काले रंग की दिखती हैं",
      "captionEn": "Longitudinally split taproot showing prominent dark brown to black vascular discoloration",
      "locationHi": "जड़ों व मुख्य तने के संवहन तंत्र में",
      "thumbRuleHi": "मुरझाए पौधे की मुख्य जड़ को नाखून या चाकू से लंबाई में फाड़ें; यदि अंदर बीच की नस काली-कत्थई दिखे, तो यह उकठा (विल्ट) रोग है।"
    },
    {
      "url": "/images/crop-identification/22_chickpea/dry_root_rot.webp",
      "badgeHi": "🌾 खेत में सूखे पौधों के पैच",
      "badgeEn": "Dry Root Rot Patches",
      "captionHi": "खेत में जगह-जगह गोलाकार पैच में चने के पौधे पूरी तरह सूखकर भूरे-सफेद हो जाते हैं",
      "captionEn": "Patches of completely dried, straw-colored dead plants scattered across field",
      "locationHi": "जड़ों व मुख्य तने के संवहन तंत्र में",
      "thumbRuleHi": "मुरझाए पौधे की मुख्य जड़ को नाखून या चाकू से लंबाई में फाड़ें; यदि अंदर बीच की नस काली-कत्थई दिखे, तो यह उकठा (विल्ट) रोग है।"
    }
  ],
  "chana/flower-thrips-aphid": [
    {
      "url": "/images/pests/pest-scirtothrips-dorsalis.jpg",
      "badgeHi": "🦗 फूल के अंदर थ्रिप्स",
      "badgeEn": "Flower Thrips inside Blossom",
      "captionHi": "फूलों की पंखुड़ियों के अंदर छिपे नन्हें पीले-भूरे थ्रिप्स कीट",
      "captionEn": "Tiny slender thrips moving briskly inside pea-type blossoms feeding on pollen and ovary",
      "locationHi": "फूलों, कलियों व शीर्ष टहनियों पर",
      "thumbRuleHi": "फूलों को हाथ की हथेली पर हल्के से झाड़ें; यदि हथेली पर नन्हें पीले कीड़े चलते दिखें और फूल झड़ रहे हों, तो यह थ्रिप्स है।"
    },
    {
      "url": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
      "badgeHi": "🪲 टहनियों पर काला माहू",
      "badgeEn": "Black Cowpea Aphid Colony",
      "captionHi": "टहनियों व कलियों पर चिपके काले-चमकदार एफिड (माहू) का झुंड",
      "captionEn": "Dense clusters of shiny black aphids (Aphis craccivora) sucking sap from shoots",
      "locationHi": "फूलों, कलियों व शीर्ष टहनियों पर",
      "thumbRuleHi": "फूलों को हाथ की हथेली पर हल्के से झाड़ें; यदि हथेली पर नन्हें पीले कीड़े चलते दिखें और फूल झड़ रहे हों, तो यह थ्रिप्स है।"
    },
    {
      "url": "/images/crop-identification/22_chickpea/flower_thrips.webp",
      "badgeHi": "🌾 फूल झड़ना व फलियां न लगना",
      "badgeEn": "Floral Abortion & Poor Podding",
      "captionHi": "रस चूसने से फूल सूखकर झड़ जाते हैं और पौधे पर फलियां बहुत कम या खाली लगती हैं",
      "captionEn": "Desiccated petals, blossom drop, and failure of fertilized ovules to form pods",
      "locationHi": "फूलों, कलियों व शीर्ष टहनियों पर",
      "thumbRuleHi": "फूलों को हाथ की हथेली पर हल्के से झाड़ें; यदि हथेली पर नन्हें पीले कीड़े चलते दिखें और फूल झड़ रहे हों, तो यह थ्रिप्स है।"
    }
  ],
  "chana/powdery-ascochyta": [
    {
      "url": "/images/diseases/disease-ascochyta-rabiei.jpg",
      "badgeHi": "🟡 पत्तियों व फलियों पर गोल धब्बे",
      "badgeEn": "Ascochyta Circular Lesions",
      "captionHi": "पत्तियों व फलियों पर गोल भूरे धब्बे जिनके केंद्र में बारीक काले बिंदुओं के छल्ले होते हैं",
      "captionEn": "Circular to oval brown lesions on leaflets and pods with concentric rings of pycnidia",
      "locationHi": "पत्तियों, तने व फलियों पर",
      "thumbRuleHi": "पत्तियों और फलियों पर गोल भूरे धब्बे देखें जिनमें बारीक काले बिंदी जैसे छल्ले हों, और शाखाएं बीच से टूटें, तो यह एस्कोकाइटा झुलसा है।"
    },
    {
      "url": "/images/diseases/disease-ascochyta-rabiei-2.jpg",
      "badgeHi": "🔴 तने पर धंसे कत्थई घाव",
      "badgeEn": "Stem Girdling Cankers",
      "captionHi": "तने के चारों तरफ गहरा धंसा हुआ घाव जिससे शाखा वहीं से टूटकर लटक जाती है",
      "captionEn": "Deep elongated brown cankers girdling stems causing snapping of vegetative branches",
      "locationHi": "पत्तियों, तने व फलियों पर",
      "thumbRuleHi": "पत्तियों और फलियों पर गोल भूरे धब्बे देखें जिनमें बारीक काले बिंदी जैसे छल्ले हों, और शाखाएं बीच से टूटें, तो यह एस्कोकाइटा झुलसा है।"
    },
    {
      "url": "/images/crop-identification/22_chickpea/ascochyta_blight.webp",
      "badgeHi": "🌾 खेत में झुलसा व फलियां दागदार",
      "badgeEn": "Crop Blight & Shriveled Seeds",
      "captionHi": "बादल व बारिश के बाद पूरा खेत झुलसा दिखता है और फलियों के अंदर दाने सिकुड़ जाते हैं",
      "captionEn": "Widespread rapid foliar blighting after rain events resulting in discolored, shrunken seed",
      "locationHi": "पत्तियों, तने व फलियों पर",
      "thumbRuleHi": "पत्तियों और फलियों पर गोल भूरे धब्बे देखें जिनमें बारीक काले बिंदी जैसे छल्ले हों, और शाखाएं बीच से टूटें, तो यह एस्कोकाइटा झुलसा है।"
    }
  ],
  "chana/ymv-whitefly": [
    {
      "url": "/images/diseases/disease-mungbean-yellow-mosaic-virus.jpg",
      "badgeHi": "🟡 पत्तियों पर पीला मोज़ेक",
      "badgeEn": "Chickpea Yellow Mosaic",
      "captionHi": "पत्तियों पर अनियमित चमकदार पीले धब्बे उभरना और पत्तियां छोटी होना",
      "captionEn": "Vivid golden-yellow mosaic blotches scattered across pinnate leaflets",
      "locationHi": "शीर्ष की युवा पत्तियों पर",
      "thumbRuleHi": "चने की पत्तियों पर यदि चमकीले पीले धब्बे दिखें और पौधा झाड़ीनुमा बौना होने लगे, तो तुरंत सफेद मक्खी का नियंत्रण करें।"
    },
    {
      "url": "/images/pests/pest-bemisia-tabaci.jpg",
      "badgeHi": "🦗 सफेद मक्खी (वाहक कीट)",
      "badgeEn": "Whitefly Vector",
      "captionHi": "पत्तियों के नीचे छोटी सफेद मक्खियां जो वायरस को एक पौधे से दूसरे में फैलाती हैं",
      "captionEn": "Minute powdery whitefly vectors transmitting begomoviruses between field plants",
      "locationHi": "शीर्ष की युवा पत्तियों पर",
      "thumbRuleHi": "चने की पत्तियों पर यदि चमकीले पीले धब्बे दिखें और पौधा झाड़ीनुमा बौना होने लगे, तो तुरंत सफेद मक्खी का नियंत्रण करें।"
    },
    {
      "url": "/images/crop-identification/22_chickpea/yellow_mosaic.webp",
      "badgeHi": "🌾 बौनापन व दाना न बनना",
      "badgeEn": "Severe Bushy Stunting",
      "captionHi": "पौधा छोटा, झाड़ीनुमा रह जाता है और फलियों में दाना नहीं भरता",
      "captionEn": "Bushy stunted chickpea growth with reduced flowering and completely empty pods",
      "locationHi": "शीर्ष की युवा पत्तियों पर",
      "thumbRuleHi": "चने की पत्तियों पर यदि चमकीले पीले धब्बे दिखें और पौधा झाड़ीनुमा बौना होने लगे, तो तुरंत सफेद मक्खी का नियंत्रण करें।"
    }
  ]
};

// Reverse index by primary image url for instant O(1) lookup
const URL_TO_STAGE_MAP_B2: Record<string, StagePhotoItem[]> = {};

for (const [key, items] of Object.entries(BATCH2_STAGE_MAP)) {
  for (const item of items) {
    if (!URL_TO_STAGE_MAP_B2[item.url]) {
      URL_TO_STAGE_MAP_B2[item.url] = items;
    }
  }
}

/**
 * Get Batch 2 Stage-wise photos either by threat key (e.g. 'soybean/girdle-beetle')
 * or by primary image URL.
 */
export function getBatch2StagePhotos(
  cropSlug?: string,
  threatId?: string,
  primaryImageUrl?: string
): StagePhotoItem[] | null {
  if (cropSlug && threatId) {
    const key = `${cropSlug}/${threatId}`;
    if (BATCH2_STAGE_MAP[key]) return BATCH2_STAGE_MAP[key];
  }

  if (primaryImageUrl) {
    const cleanUrl = primaryImageUrl.split("?")[0];
    if (URL_TO_STAGE_MAP_B2[cleanUrl]) return URL_TO_STAGE_MAP_B2[cleanUrl];

    const normalized = cleanUrl.replace(/-[23]\.jpg$/, ".jpg");
    if (URL_TO_STAGE_MAP_B2[normalized]) return URL_TO_STAGE_MAP_B2[normalized];
  }

  return null;
}
