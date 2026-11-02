/**
 * Dedicated Stage-wise Photo Manifest for Batch 1 Crops:
 * 1. Paddy / Rice (धान) - 9 threats
 * 2. Wheat (गेहूं) - 7 threats
 * 3. Maize (मक्का) - 6 threats
 * 4. Tomato (टमाटर) - 11 threats
 * 5. Cotton (कपास) - 6 threats
 * Total: 39 threats x 3 stages = 117 photos.
 *
 * Each threat contains:
 * - Stage 1: Adult / Early Symptoms (प्रौढ़ कीट / शुरुआती लक्षण)
 * - Stage 2: Larva or Nymph / Severe Infection (इल्ली / सुंडी / गंभीर अवस्था)
 * - Stage 3: Field Damage Symptoms / Field Spread (खेत में नुकसान / फैलाव)
 * - locationHi: कहाँ देखना है (पौधे का अंग / स्थान)
 * - thumbRuleHi: किसान पहचान सूत्र (खेत में तुरंत पहचानने का पक्का नियम)
 */

export interface StagePhotoItem {
  url: string;
  badgeHi: string;
  badgeEn: string;
  captionHi: string;
  captionEn: string;
  locationHi?: string;
  thumbRuleHi?: string;
}

export const BATCH1_STAGE_MAP: Record<string, StagePhotoItem[]> = {
  "paddy/stem-borer": [
    {
      "url": "/images/pests/pest-scirpophaga-incertulas.jpg",
      "badgeHi": "🦗 प्रौढ़ पतंगा",
      "badgeEn": "Adult Moth",
      "captionHi": "पत्ती पर बैठा पीले-सफेद पंखों वाला प्रौढ़ पतंगा (अगले पंखों पर काला बिंदु)",
      "captionEn": "Adult female moth with distinct black spot on yellow forewings resting on rice leaf",
      "locationHi": "तने के अंदर (तने को फाड़कर देखें)",
      "thumbRuleHi": "वानस्पतिक अवस्था में बीच की सूखी गोभ को हल्के हाथ से खींचें; यदि वह बिना ज़ोर लगाए आसानी से हाथ में आ जाए, तो अंदर तना छेदक की सुंडी है।"
    },
    {
      "url": "/images/pests/pest-scirpophaga-incertulas-2.jpg",
      "badgeHi": "🐛 तने में भीतरी सुंडी",
      "badgeEn": "Stem Borer Larva",
      "captionHi": "तने को चीरने पर अंदर तने का गूदा खाती हुई पीली-सफेद सुंडी (इल्ली)",
      "captionEn": "Smooth yellowish-white borer caterpillar feeding inside hollow rice stem",
      "locationHi": "तने के अंदर (तने को फाड़कर देखें)",
      "thumbRuleHi": "वानस्पतिक अवस्था में बीच की सूखी गोभ को हल्के हाथ से खींचें; यदि वह बिना ज़ोर लगाए आसानी से हाथ में आ जाए, तो अंदर तना छेदक की सुंडी है।"
    },
    {
      "url": "/images/pests/pest-scirpophaga-incertulas-3.jpg",
      "badgeHi": "🌾 डेड हार्ट व सफेद बाली",
      "badgeEn": "Dead Heart & White Ear",
      "captionHi": "वानस्पतिक अवस्था में सूखा गोभ (Dead Heart) व बाली निकलने पर सफेद खाली बाली (White Earhead)",
      "captionEn": "Vegetative deadheart (dry central tiller) and reproductive white empty earhead",
      "locationHi": "तने के अंदर (तने को फाड़कर देखें)",
      "thumbRuleHi": "वानस्पतिक अवस्था में बीच की सूखी गोभ को हल्के हाथ से खींचें; यदि वह बिना ज़ोर लगाए आसानी से हाथ में आ जाए, तो अंदर तना छेदक की सुंडी है।"
    }
  ],
  "paddy/leaf-folder": [
    {
      "url": "/images/pests/pest-cnaphalocrocis-medinalis.jpg",
      "badgeHi": "🦗 प्रौढ़ कीट",
      "badgeEn": "Adult Moth",
      "captionHi": "पत्ती पर बैठा हल्के सुनहरे-भूरे रंग के पंखों वाला छोटा पतंगा",
      "captionEn": "Small golden-brown leaf roller moth with dark wavy wing margins on rice leaf",
      "locationHi": "मुड़ी हुई पत्तियों के अंदर",
      "thumbRuleHi": "पत्ती को लंबाई में मोड़कर सफेद रेशमी धागों से चिपकाया हुआ दिखेगा; खोलने पर अंदर हरी सुंडी और खुरचे हुए सफेद पारदर्शी हिस्से दिखेंगे।"
    },
    {
      "url": "/images/pests/pest-cnaphalocrocis-medinalis-2.jpg",
      "badgeHi": "🐛 मुड़ी पत्ती में सुंडी",
      "badgeEn": "Larva in Rolled Leaf",
      "captionHi": "पत्ती को लंबाई में मोड़कर रेशमी धागों से चिपकाकर अंदर हरा भाग खाती हरी सुंडी",
      "captionEn": "Greenish caterpillar inside longitudinal leaf roll scraping the chlorophyll tissue",
      "locationHi": "मुड़ी हुई पत्तियों के अंदर",
      "thumbRuleHi": "पत्ती को लंबाई में मोड़कर सफेद रेशमी धागों से चिपकाया हुआ दिखेगा; खोलने पर अंदर हरी सुंडी और खुरचे हुए सफेद पारदर्शी हिस्से दिखेंगे।"
    },
    {
      "url": "/images/pests/pest-cnaphalocrocis-medinalis-3.jpg",
      "badgeHi": "🌾 सफेद धारियाँ (क्षति)",
      "badgeEn": "White Streaks Damage",
      "captionHi": "क्लोरोफिल खाने से पत्तियां झिल्लीदार व सफेद धारियों से भर जाती हैं, खेत सूखा दिखता है",
      "captionEn": "Membranous white papery streaks across damaged leaves leading to scorched field appearance",
      "locationHi": "मुड़ी हुई पत्तियों के अंदर",
      "thumbRuleHi": "पत्ती को लंबाई में मोड़कर सफेद रेशमी धागों से चिपकाया हुआ दिखेगा; खोलने पर अंदर हरी सुंडी और खुरचे हुए सफेद पारदर्शी हिस्से दिखेंगे।"
    }
  ],
  "paddy/bph": [
    {
      "url": "/images/pests/pest-nilaparvata-lugens.jpg",
      "badgeHi": "🦗 भूरा फुदका (वयस्क)",
      "badgeEn": "Adult BPH",
      "captionHi": "तने के निचले हिस्से पर चिपका भूरा-काला पंख वाला फुदका कीट (तेला)",
      "captionEn": "Brown plant hopper adult clinging to lower stem nodes of paddy tiller",
      "locationHi": "पानी की सतह के पास तने के आधार पर",
      "thumbRuleHi": "पौधों को थोड़ा झुकाकर पानी की सतह के पास तने पर देखें — भूरे फुदके और निम्फ तेजी से भागते दिखेंगे। खेत में गोलाकार जले हुए पैच (हॉपर बर्न) बनते हैं।"
    },
    {
      "url": "/images/pests/pest-nilaparvata-lugens-2.jpg",
      "badgeHi": "🪲 तने पर निम्फ झुंड",
      "badgeEn": "Hopper Nymphs Colony",
      "captionHi": "पानी की सतह के पास तनों पर चिपके सैकड़ों हल्के भूरे निम्फ जो लगातार रस चूसते हैं",
      "captionEn": "Dense colony of wingless nymphs clustered at the water-line sucking vascular sap",
      "locationHi": "पानी की सतह के पास तने के आधार पर",
      "thumbRuleHi": "पौधों को थोड़ा झुकाकर पानी की सतह के पास तने पर देखें — भूरे फुदके और निम्फ तेजी से भागते दिखेंगे। खेत में गोलाकार जले हुए पैच (हॉपर बर्न) बनते हैं।"
    },
    {
      "url": "/images/pests/pest-nilaparvata-lugens-3.jpg",
      "badgeHi": "🌾 हॉपर बर्न (सूखे गोल घेरे)",
      "badgeEn": "Hopper Burn Patch",
      "captionHi": "खेत में जगह-जगह गोलाकार जले हुए सूखे पुआल जैसे घेरे (हॉपर बर्न लक्षण)",
      "captionEn": "Circular scorched dead patches of plants in the field termed hopper burn",
      "locationHi": "पानी की सतह के पास तने के आधार पर",
      "thumbRuleHi": "पौधों को थोड़ा झुकाकर पानी की सतह के पास तने पर देखें — भूरे फुदके और निम्फ तेजी से भागते दिखेंगे। खेत में गोलाकार जले हुए पैच (हॉपर बर्न) बनते हैं।"
    }
  ],
  "paddy/sheath-blight": [
    {
      "url": "/images/diseases/disease-rhizoctonia-solani.jpg",
      "badgeHi": "🟡 शुरुआती तना धब्बा",
      "badgeEn": "Early Sheath Lesion",
      "captionHi": "पानी की सतह के पास पर्ण-आवरण (शीथ) पर अंडाकार हरे-भूरे जलसिक्त धब्बे",
      "captionEn": "Water-soaked oval greenish-grey spots on leaf sheath near water level",
      "locationHi": "पानी की सतह पर तने के आवरण (शीथ) पर",
      "thumbRuleHi": "पानी की सतह के ठीक ऊपर पर्ण-आवरण पर सांप की केंचुली जैसे अनियमित हरे-भूरे धब्बे दिखते हैं जो ऊपर की ओर फैलते हैं।"
    },
    {
      "url": "/images/diseases/disease-rhizoctonia-solani-2.jpg",
      "badgeHi": "🔴 गंभीर सर्पाकार फैलाव",
      "badgeEn": "Severe Snake-skin Blight",
      "captionHi": "धब्बे बढ़कर अनियमित सांप की केंचुली जैसे होकर ऊपरी पत्तियों तक फैलते हैं",
      "captionEn": "Irregular serpentine blotches coalescing upwards along entire leaf canopy",
      "locationHi": "पानी की सतह पर तने के आवरण (शीथ) पर",
      "thumbRuleHi": "पानी की सतह के ठीक ऊपर पर्ण-आवरण पर सांप की केंचुली जैसे अनियमित हरे-भूरे धब्बे दिखते हैं जो ऊपर की ओर फैलते हैं।"
    },
    {
      "url": "/images/diseases/disease-rhizoctonia-solani-3.jpg",
      "badgeHi": "🌾 तना सड़न व पौधा गिरना",
      "badgeEn": "Lodging & Drying",
      "captionHi": "तने का आधार कमजोर होने से धान की फसल खेत में गिर जाती है (Lodging)",
      "captionEn": "Culm rot and premature lodging of heavily infected paddy crop",
      "locationHi": "पानी की सतह पर तने के आवरण (शीथ) पर",
      "thumbRuleHi": "पानी की सतह के ठीक ऊपर पर्ण-आवरण पर सांप की केंचुली जैसे अनियमित हरे-भूरे धब्बे दिखते हैं जो ऊपर की ओर फैलते हैं।"
    }
  ],
  "paddy/blast": [
    {
      "url": "/images/diseases/disease-magnaporthe-oryzae.jpg",
      "badgeHi": "🟡 आंखनुमा पत्ती धब्बे",
      "badgeEn": "Leaf Blast Eye-spots",
      "captionHi": "पत्तियों पर आंख या नाव के आकार के विशिष्ट धब्बे (किनारे भूरे, बीच में राख जैसा रंग)",
      "captionEn": "Spindle-shaped diamond lesions on leaves with brown margins and greyish-white center",
      "locationHi": "पत्तियों व बाली की गर्दन पर",
      "thumbRuleHi": "पत्तियों पर नाव या आंख के आकार के धब्बे (किनारे भूरे, बीच में राख जैसा रंग); बाली निकलते समय गर्दन पर काला छल्ला बनने से बाली टूट जाती है।"
    },
    {
      "url": "/images/diseases/disease-magnaporthe-oryzae-2.jpg",
      "badgeHi": "🔴 गर्दन तोड़ (नेक ब्लास्ट)",
      "badgeEn": "Neck Blast Girdling",
      "captionHi": "बाली के आधार (गर्दन) पर काला-भूरा सड़न का छल्ला जिससे बाली टूटकर लटक जाती है",
      "captionEn": "Blackish-brown necrotic collar rot causing the emergent panicle to break and hang",
      "locationHi": "पत्तियों व बाली की गर्दन पर",
      "thumbRuleHi": "पत्तियों पर नाव या आंख के आकार के धब्बे (किनारे भूरे, बीच में राख जैसा रंग); बाली निकलते समय गर्दन पर काला छल्ला बनने से बाली टूट जाती है।"
    },
    {
      "url": "/images/diseases/disease-magnaporthe-oryzae-3.jpg",
      "badgeHi": "🌾 खाली थोथी बालियां",
      "badgeEn": "Chaffy Panicles",
      "captionHi": "खेत में काली टूटी हुई बालियां, दाना नहीं भरता और पैदावार भारी घटती है",
      "captionEn": "Completely sterile, bleached chaffy panicles drooping in infected field",
      "locationHi": "पत्तियों व बाली की गर्दन पर",
      "thumbRuleHi": "पत्तियों पर नाव या आंख के आकार के धब्बे (किनारे भूरे, बीच में राख जैसा रंग); बाली निकलते समय गर्दन पर काला छल्ला बनने से बाली टूट जाती है।"
    }
  ],
  "paddy/blb": [
    {
      "url": "/images/diseases/disease-xanthomonas-oryzae.jpg",
      "badgeHi": "🟡 किनारों से पीलापन",
      "badgeEn": "Early Margin Blight",
      "captionHi": "पत्ती की नोक व दोनों किनारों से लहरदार पीली-सफेद धारियों की शुरुआत",
      "captionEn": "Wavy water-soaked yellowish-white stripes initiating from leaf tips and margins",
      "locationHi": "पत्ती की नोक व किनारों पर",
      "thumbRuleHi": "पत्तियों के दोनों किनारों से लहरदार पीली-सफेद धारियां नीचे की ओर बढ़ती हैं; सुबह के समय पत्ती पर जीवाणु की दूधिया बूंदें जमती हैं।"
    },
    {
      "url": "/images/diseases/disease-xanthomonas-oryzae-2.jpg",
      "badgeHi": "🔴 पूरी पत्ती सूखना (क्रेसेक)",
      "badgeEn": "Severe Blight & Kresek",
      "captionHi": "पत्तियां किनारों से अंदर की ओर सूखकर पुआल जैसी सफेद हो जाती हैं; सुबह जीवाणु ऊज़ की बूंदें",
      "captionEn": "Extensive straw-colored leaf desiccation and milky bacterial exudate droplets",
      "locationHi": "पत्ती की नोक व किनारों पर",
      "thumbRuleHi": "पत्तियों के दोनों किनारों से लहरदार पीली-सफेद धारियां नीचे की ओर बढ़ती हैं; सुबह के समय पत्ती पर जीवाणु की दूधिया बूंदें जमती हैं।"
    },
    {
      "url": "/images/diseases/disease-xanthomonas-oryzae-3.jpg",
      "badgeHi": "🌾 खेत स्तर पर झुलसा",
      "badgeEn": "Field Blight Severity",
      "captionHi": "तेज हवा और बारिश के बाद पूरे खेत की ऊपरी फसल झुलसी व सूखी दिखती है",
      "captionEn": "Canopy-wide blighted appearance after monsoon winds and rainfall",
      "locationHi": "पत्ती की नोक व किनारों पर",
      "thumbRuleHi": "पत्तियों के दोनों किनारों से लहरदार पीली-सफेद धारियां नीचे की ओर बढ़ती हैं; सुबह के समय पत्ती पर जीवाणु की दूधिया बूंदें जमती हैं।"
    }
  ],
  "paddy/foot-rot": [
    {
      "url": "/images/threat-stages/02_paddy/paddy_bakanae_seedling_elongation_jpg_1793606944616.jpg",
      "badgeHi": "🟡 लंबा पतला पौधा (बकाने)",
      "badgeEn": "Abnormally Tall Seedling",
      "captionHi": "खेत में सामान्य पौधों से 20-30% ज्यादा लंबा, दुबला व पीला दिखने वाला पौधा (Foolish seedling)",
      "captionEn": "Conspicuous hyper-elongated, slender, pale yellowish seedling standing tall in field",
      "locationHi": "पूरे पौधे व निचली गांठों पर",
      "thumbRuleHi": "खेत में बाकी स्वस्थ पौधों से 20-30% ज्यादा लंबा, दुबला व पीला दिखने वाला पौधा; निचली गांठों पर गुलाबी-सफेद फफूंद व अपस्थानिक जड़ें निकलती हैं।"
    },
    {
      "url": "/images/threat-stages/02_paddy/paddy_bakanae_nodal_mold_jpg_1793606964874.jpg",
      "badgeHi": "🔴 गांठों पर गुलाबी फफूंद",
      "badgeEn": "Nodal Pink Mycelium",
      "captionHi": "निचली गांठों पर गुलाबी-सफेद फफूंद का पाउडर व ऊपरी गांठों से अपस्थानिक जड़ें फूटना",
      "captionEn": "Pinkish-white fungal growth encrusting lower stem nodes with aerial adventitious roots",
      "locationHi": "पूरे पौधे व निचली गांठों पर",
      "thumbRuleHi": "खेत में बाकी स्वस्थ पौधों से 20-30% ज्यादा लंबा, दुबला व पीला दिखने वाला पौधा; निचली गांठों पर गुलाबी-सफेद फफूंद व अपस्थानिक जड़ें निकलती हैं।"
    },
    {
      "url": "/images/diseases/disease-fusarium-fujikuroi.jpg",
      "badgeHi": "🌾 सूखा पौधा व उपज हानि",
      "badgeEn": "Wilted Dead Plant",
      "captionHi": "बाली निकलने से पहले ही पौधा सूखकर सड़ जाता है, फसल में दाना नहीं बनता",
      "captionEn": "Lower stem rot leading to total plant wilt, drying, and zero grain setting",
      "locationHi": "पूरे पौधे व निचली गांठों पर",
      "thumbRuleHi": "खेत में बाकी स्वस्थ पौधों से 20-30% ज्यादा लंबा, दुबला व पीला दिखने वाला पौधा; निचली गांठों पर गुलाबी-सफेद फफूंद व अपस्थानिक जड़ें निकलती हैं।"
    }
  ],
  "paddy/false-smut": [
    {
      "url": "/images/diseases/disease-ustilaginoidea-virens.jpg",
      "badgeHi": "🟡 पीले मखमली गोले",
      "badgeEn": "Early Yellow Smut Balls",
      "captionHi": "बाली के दानों पर छोटे पीले-नारंगी रंग के मखमली बीजाणु गोले बनना",
      "captionEn": "Early bright yellow to orange velvety fungal masses replacing individual rice grains",
      "locationHi": "बाली के दानों पर",
      "thumbRuleHi": "बाली के दानों की जगह पीले-नारंगी मखमली बीजाणु गोले बनते हैं जो पकने पर जैतूनी हरे से काले चूर्ण में बदल जाते हैं।"
    },
    {
      "url": "/images/threat-stages/02_paddy/paddy_false_smut_mature_jpg_1793606985070.jpg",
      "badgeHi": "🔴 हरे-काले बीजाणु पिंड",
      "badgeEn": "Mature Olive-Black Spores",
      "captionHi": "परिपक्व होने पर गोले बड़े (1 सेमी) और गहरे जैतूनी हरे से काले चूर्ण में बदल जाते हैं",
      "captionEn": "Large mature velvety olive-green to black spore balls bursting through glumes",
      "locationHi": "बाली के दानों पर",
      "thumbRuleHi": "बाली के दानों की जगह पीले-नारंगी मखमली बीजाणु गोले बनते हैं जो पकने पर जैतूनी हरे से काले चूर्ण में बदल जाते हैं।"
    },
    {
      "url": "/images/crop-identification/02_paddy/false_smut.webp",
      "badgeHi": "🌾 खेत में कंडुआ फैलाव",
      "badgeEn": "Field Smut Incidence",
      "captionHi": "बालियों में जगह-जगह काले-हरे फुलावदार गोले, चावल की गुणवत्ता और भाव में गिरावट",
      "captionEn": "Panicles showing widespread false smut infection compromising milling quality",
      "locationHi": "बाली के दानों पर",
      "thumbRuleHi": "बाली के दानों की जगह पीले-नारंगी मखमली बीजाणु गोले बनते हैं जो पकने पर जैतूनी हरे से काले चूर्ण में बदल जाते हैं।"
    }
  ],
  "paddy/gundhi-bug": [
    {
      "url": "/images/pests/pest-leptocorisa-oratorius.jpg",
      "badgeHi": "🦗 गंधी बग (वयस्क)",
      "badgeEn": "Adult Gundhi Bug",
      "captionHi": "दुधिया बाली पर बैठा लंबा, पतला भूरे-हरे रंग का बग (बदबू छोड़ने वाला कीट)",
      "captionEn": "Slender brownish-green adult bug with long legs and antennae feeding on milky grains",
      "locationHi": "दूधिया अवस्था में बालियों पर",
      "thumbRuleHi": "सुबह या शाम को बालियों पर लंबा पतला भूरा-हरा बग बैठा दिखेगा और खेत में खट्टी बदबू आएगी; रस चूसने से दाने काले धब्बेदार व थोथे रह जाते हैं।"
    },
    {
      "url": "/images/crop-identification/02_paddy/gundhi_bug.webp",
      "badgeHi": "🪲 निम्फ अवस्था",
      "badgeEn": "Nymph Stage on Ear",
      "captionHi": "हरी-पीली छोटी निम्फ अवस्था जो दानों से रस चूसती है",
      "captionEn": "Wingless greenish nymphs clustered on spikelets piercing tender grains",
      "locationHi": "दूधिया अवस्था में बालियों पर",
      "thumbRuleHi": "सुबह या शाम को बालियों पर लंबा पतला भूरा-हरा बग बैठा दिखेगा और खेत में खट्टी बदबू आएगी; रस चूसने से दाने काले धब्बेदार व थोथे रह जाते हैं।"
    },
    {
      "url": "/images/crop-identification/02_paddy/gundhi_bug.webp",
      "badgeHi": "🌾 काले धब्बे व थोथे दाने",
      "badgeEn": "Spotted Chaffy Grains",
      "captionHi": "रस चूसने से दानों पर काले-भूरे छिद्र, दाने अंदर से खाली (थोथे) रह जाते हैं",
      "captionEn": "Necrotic puncture spots and completely chaffy, empty, discolored grain setting",
      "locationHi": "दूधिया अवस्था में बालियों पर",
      "thumbRuleHi": "सुबह या शाम को बालियों पर लंबा पतला भूरा-हरा बग बैठा दिखेगा और खेत में खट्टी बदबू आएगी; रस चूसने से दाने काले धब्बेदार व थोथे रह जाते हैं।"
    }
  ],
  "wheat/termite-root-aphid": [
    {
      "url": "/images/pests/pest-odontotermes-obesus.jpg",
      "badgeHi": "🦗 दीमक श्रमिक कीट",
      "badgeEn": "Worker Termites",
      "captionHi": "जड़ों व तने के निचले हिस्से पर मिट्टी की नालियां बनाकर खाती सफेद-पीली दीमक",
      "captionEn": "White-bodied subterranean worker termites building earthen galleries on roots",
      "locationHi": "जड़ों में व ज़मीन की सतह पर",
      "thumbRuleHi": "मुरझाए पौधे को खींचने पर बिना प्रयास खिंच आता है क्योंकि जड़ें कटी होती हैं; तने पर मिट्टी की नलियां और दीमक दिखती हैं।"
    },
    {
      "url": "/images/pests/pest-odontotermes-obesus-2.jpg",
      "badgeHi": "🪲 जड़ माहू (एफिड)",
      "badgeEn": "Root Aphid Colony",
      "captionHi": "मिट्टी के अंदर गेहूं की जड़ों से चिपके गोलाकार भूरे-काले जड़ माहू",
      "captionEn": "Subterranean root aphid colonies clustered on underground wheat crown roots",
      "locationHi": "जड़ों में व ज़मीन की सतह पर",
      "thumbRuleHi": "मुरझाए पौधे को खींचने पर बिना प्रयास खिंच आता है क्योंकि जड़ें कटी होती हैं; तने पर मिट्टी की नलियां और दीमक दिखती हैं।"
    },
    {
      "url": "/images/pests/pest-odontotermes-obesus-3.jpg",
      "badgeHi": "🌾 खेत में पीलापन व पौधे सूखना",
      "badgeEn": "Dry Patches in Field",
      "captionHi": "जड़ें कटने से पौधे सूखकर आसानी से खिंच जाते हैं और खेत में सूखे धब्बे बन जाते हैं",
      "captionEn": "Damaged tillers wither and pull out effortlessly, creating patchy yellow areas",
      "locationHi": "जड़ों में व ज़मीन की सतह पर",
      "thumbRuleHi": "मुरझाए पौधे को खींचने पर बिना प्रयास खिंच आता है क्योंकि जड़ें कटी होती हैं; तने पर मिट्टी की नलियां और दीमक दिखती हैं।"
    }
  ],
  "wheat/pink-stem-borer": [
    {
      "url": "/images/pests/pest-sesamia-inferens.jpg",
      "badgeHi": "🦗 प्रौढ़ पतंगा",
      "badgeEn": "Adult Moth",
      "captionHi": "पुआल के रंग का हल्के भूरे पंखों वाला प्रौढ़ पतंगा (Sesamia inferens)",
      "captionEn": "Straw-colored stout nocturnal moth resting near wheat base",
      "locationHi": "गेहूं के तने के अंदर",
      "thumbRuleHi": "कल्ले फूटने के समय बीच की मुख्य गोभ सूखकर डेड हार्ट बन जाती है; तना चीरने पर अंदर गुलाबी बेलनाकार सुंडी मिलती है।"
    },
    {
      "url": "/images/crop-identification/15_wheat/pink_stem_borer.webp",
      "badgeHi": "🐛 तने में गुलाबी सुंडी",
      "badgeEn": "Pink Borer Larva",
      "captionHi": "तने के अंदर चिकनी, गुलाबी-बैंगनी रंग की बेलनाकार सुंडी (20-25 मिमी)",
      "captionEn": "Pinkish cylindrical borer caterpillar boring inside central wheat stem",
      "locationHi": "गेहूं के तने के अंदर",
      "thumbRuleHi": "कल्ले फूटने के समय बीच की मुख्य गोभ सूखकर डेड हार्ट बन जाती है; तना चीरने पर अंदर गुलाबी बेलनाकार सुंडी मिलती है।"
    },
    {
      "url": "/images/crop-identification/15_wheat/pink_stem_borer.webp",
      "badgeHi": "🌾 डेड हार्ट लक्षण",
      "badgeEn": "Dead Heart in Wheat",
      "captionHi": "बीच की गोभ सूखकर पीली-सफेद (Dead Heart) हो जाती है और खींचने पर आसानी से निकल आती है",
      "captionEn": "Drying central tiller symptom (Deadheart) pulling out freely upon tugging",
      "locationHi": "गेहूं के तने के अंदर",
      "thumbRuleHi": "कल्ले फूटने के समय बीच की मुख्य गोभ सूखकर डेड हार्ट बन जाती है; तना चीरने पर अंदर गुलाबी बेलनाकार सुंडी मिलती है।"
    }
  ],
  "wheat/yellow-rust": [
    {
      "url": "/images/diseases/disease-puccinia-striiformis.jpg",
      "badgeHi": "🟡 पत्तियों पर पीली कतारें",
      "badgeEn": "Linear Yellow Pustules",
      "captionHi": "पत्तियों की नसों के समानांतर चमकीले पीले-नारंगी फफोलों की सीधी धारियां (स्ट्राइप)",
      "captionEn": "Linear stripe-like rows of bright yellow uredinial pustules along leaf veins",
      "locationHi": "पत्तियों की ऊपरी सतह पर",
      "thumbRuleHi": "पत्तियों पर समानांतर कतारों में चमकदार पीले फफोले; उंगली से छूने पर हल्दी जैसा पीला पाउडर हाथ पर चिपक जाता है।"
    },
    {
      "url": "/images/diseases/disease-puccinia-striiformis-2.jpg",
      "badgeHi": "🔴 हाथ पर पीला पाउडर",
      "badgeEn": "Powdery Spores",
      "captionHi": "पत्ती छूने पर उंगली पर हल्दी जैसा चमकदार पीला बीजाणु पाउडर लग जाता है",
      "captionEn": "Profuse yellow spore dust rubbing off easily onto hands and clothes",
      "locationHi": "पत्तियों की ऊपरी सतह पर",
      "thumbRuleHi": "पत्तियों पर समानांतर कतारों में चमकदार पीले फफोले; उंगली से छूने पर हल्दी जैसा पीला पाउडर हाथ पर चिपक जाता है।"
    },
    {
      "url": "/images/diseases/disease-puccinia-striiformis-3.jpg",
      "badgeHi": "🌾 खेत में पीला झुलसा",
      "badgeEn": "Field-wide Yellow Rust",
      "captionHi": "गंभीर अवस्था में पूरी पत्तियां झुलसकर सूख जाती हैं और बालियों में दाना बारीक रह जाता है",
      "captionEn": "Canopy-wide rust desiccation causing severe grain shriveling and yield loss",
      "locationHi": "पत्तियों की ऊपरी सतह पर",
      "thumbRuleHi": "पत्तियों पर समानांतर कतारों में चमकदार पीले फफोले; उंगली से छूने पर हल्दी जैसा पीला पाउडर हाथ पर चिपक जाता है।"
    }
  ],
  "wheat/brown-rust": [
    {
      "url": "/images/diseases/disease-puccinia-triticina.jpg",
      "badgeHi": "🟡 बिखरे भूरे फफोले",
      "badgeEn": "Scattered Brown Pustules",
      "captionHi": "पत्तियों पर बिना किसी कतार के अनियमित बिखरे हुए गोल भूरे-नारंगी फफोले",
      "captionEn": "Small round orange-brown pustules scattered randomly across upper leaf surface",
      "locationHi": "पत्तियों की ऊपरी सतह पर",
      "thumbRuleHi": "पत्तियों पर बिना किसी कतार के गोल भूरे-नारंगी फफोले बिखरे रहते हैं; तापमान 20°C से ऊपर जाने पर तेजी से बढ़ता है।"
    },
    {
      "url": "/images/diseases/disease-puccinia-triticina-2.jpg",
      "badgeHi": "🔴 पत्ती का भूरापन",
      "badgeEn": "Leaf Desiccation",
      "captionHi": "तापमान बढ़ने पर फफोले काले टेलिया में बदलने लगते हैं और पत्तियां सूखने लगती हैं",
      "captionEn": "Pustules turning dark brown to blackish teliospores as temperatures rise",
      "locationHi": "पत्तियों की ऊपरी सतह पर",
      "thumbRuleHi": "पत्तियों पर बिना किसी कतार के गोल भूरे-नारंगी फफोले बिखरे रहते हैं; तापमान 20°C से ऊपर जाने पर तेजी से बढ़ता है।"
    },
    {
      "url": "/images/diseases/disease-puccinia-triticina-3.jpg",
      "badgeHi": "🌾 खेत स्तर पर फैलाव",
      "badgeEn": "Canopy Rust Spread",
      "captionHi": "मार्च के महीने में गर्म मौसम होने पर ऊपरी पत्तियों का सूखना व दाना सिकुड़ना",
      "captionEn": "Late-season canopy blight during grain-filling stage reducing test weight",
      "locationHi": "पत्तियों की ऊपरी सतह पर",
      "thumbRuleHi": "पत्तियों पर बिना किसी कतार के गोल भूरे-नारंगी फफोले बिखरे रहते हैं; तापमान 20°C से ऊपर जाने पर तेजी से बढ़ता है।"
    }
  ],
  "wheat/yellow-brown-rust": [
    {
      "url": "/images/diseases/disease-puccinia-striiformis-2.jpg",
      "badgeHi": "🟡 पीला रतुआ (धारियां)",
      "badgeEn": "Stripe Rust (Yellow)",
      "captionHi": "पत्तियों पर समानांतर कतारों में चमकदार पीला पाउडर (शीत लहर के समय)",
      "captionEn": "Linear stripes of yellow pustules appearing during cool winter months",
      "locationHi": "पत्तियों की ऊपरी व निचली सतह पर",
      "thumbRuleHi": "पत्तियों पर पीली धारियां और भूरे बिखरे फफोले एक साथ दिखते हैं; प्रकाश संश्लेषण रुकने से दाने सिकुड़कर हल्के रह जाते हैं।"
    },
    {
      "url": "/images/diseases/disease-puccinia-triticina.jpg",
      "badgeHi": "🔴 भूरा रतुआ (बिखरे धब्बे)",
      "badgeEn": "Leaf Rust (Brown)",
      "captionHi": "तापमान बढ़ने पर पत्तियों पर बिखरे भूरे-नारंगी गोल फफोले",
      "captionEn": "Randomly scattered brownish-orange rust pustules appearing with rising temperatures",
      "locationHi": "पत्तियों की ऊपरी व निचली सतह पर",
      "thumbRuleHi": "पत्तियों पर पीली धारियां और भूरे बिखरे फफोले एक साथ दिखते हैं; प्रकाश संश्लेषण रुकने से दाने सिकुड़कर हल्के रह जाते हैं।"
    },
    {
      "url": "/images/diseases/disease-puccinia-striiformis-3.jpg",
      "badgeHi": "🌾 संयुक्त रतुआ प्रकोप",
      "badgeEn": "Combined Rust Damage",
      "captionHi": "दोनों रतुआ का संयुक्त असर: प्रकाश संश्लेषण रुकने से दाने सिकुड़कर हल्के रह जाते हैं",
      "captionEn": "Severe dual rust infection reducing photosynthetic leaf area and grain yield",
      "locationHi": "पत्तियों की ऊपरी व निचली सतह पर",
      "thumbRuleHi": "पत्तियों पर पीली धारियां और भूरे बिखरे फफोले एक साथ दिखते हैं; प्रकाश संश्लेषण रुकने से दाने सिकुड़कर हल्के रह जाते हैं।"
    }
  ],
  "wheat/powdery-karnal-bunt": [
    {
      "url": "/images/diseases/disease-tilletia-indica.jpg",
      "badgeHi": "🟡 करनाल बंट (मछली जैसी बदबू)",
      "badgeEn": "Karnal Bunt Grain",
      "captionHi": "दाने का निचला हिस्सा काले चूर्ण में बदल जाता है और सड़ी मछली जैसी दुर्गंध आती है",
      "captionEn": "Partial conversion of wheat kernel into foul-smelling black teliospore powder",
      "locationHi": "बाली के दानों व पत्ती पर",
      "thumbRuleHi": "दाने का निचला हिस्सा काले चूर्ण में बदल जाता है और सड़ी मछली जैसी तीखी दुर्गंध आती है; पत्ती पर सफेद आटे जैसी फफूंद दिखती है।"
    },
    {
      "url": "/images/diseases/disease-tilletia-indica-2.jpg",
      "badgeHi": "🔴 चूर्णी फफूंद (पाउडरी मिल्ड्यू)",
      "badgeEn": "Powdery Mildew Coating",
      "captionHi": "पत्तियों व तनों पर सफेद-धूसर आटे जैसा चूर्ण फैल जाना",
      "captionEn": "White floury powdery fungal growth covering leaf sheaths and leaves",
      "locationHi": "बाली के दानों व पत्ती पर",
      "thumbRuleHi": "दाने का निचला हिस्सा काले चूर्ण में बदल जाता है और सड़ी मछली जैसी तीखी दुर्गंध आती है; पत्ती पर सफेद आटे जैसी फफूंद दिखती है।"
    },
    {
      "url": "/images/diseases/disease-tilletia-indica-3.jpg",
      "badgeHi": "🌾 दूषित दाने व फसल हानि",
      "badgeEn": "Bunted Grains & Spoilage",
      "captionHi": "मड़ाई के समय काले टूटे दाने और आटे में दुर्गंध, मंडी में भाव कटना",
      "captionEn": "Bunted black grain contamination rendering produce unfit for commercial milling",
      "locationHi": "बाली के दानों व पत्ती पर",
      "thumbRuleHi": "दाने का निचला हिस्सा काले चूर्ण में बदल जाता है और सड़ी मछली जैसी तीखी दुर्गंध आती है; पत्ती पर सफेद आटे जैसी फफूंद दिखती है।"
    }
  ],
  "wheat/earhead-aphid": [
    {
      "url": "/images/pests/pest-rhopalosiphum-maidis.jpg",
      "badgeHi": "🦗 बाली पर माहू झुंड",
      "badgeEn": "Aphid Colony on Spike",
      "captionHi": "निकलती हुई हरी बाली पर चिपके सैकड़ों हरे-काले छोटे माहू (चेपा कीट)",
      "captionEn": "Dense colony of tiny green and brown aphids clustering on developing wheat spike",
      "locationHi": "निकलती हुई बालियों पर",
      "thumbRuleHi": "हरी बालियों पर सैकड़ों हरे-काले छोटे माहू चिपके रहते हैं; चिपचिपे रस पर काली फफूंद जमने से बालियां काली पड़ जाती हैं।"
    },
    {
      "url": "/images/crop-identification/15_wheat/earhead_aphid.webp",
      "badgeHi": "🪲 रस चूसने की अवस्था",
      "badgeEn": "Grain Sap Sucking",
      "captionHi": "दुधिया अवस्था में दानों से रस चूसकर दानों को कमजोर व सिकुड़ा हुआ बनाना",
      "captionEn": "Continuous sap-sucking from young spikelets during milky grain development",
      "locationHi": "निकलती हुई बालियों पर",
      "thumbRuleHi": "हरी बालियों पर सैकड़ों हरे-काले छोटे माहू चिपके रहते हैं; चिपचिपे रस पर काली फफूंद जमने से बालियां काली पड़ जाती हैं।"
    },
    {
      "url": "/images/crop-identification/15_wheat/earhead_aphid.webp",
      "badgeHi": "🌾 चिपचिपा रस व काली फफूंद",
      "badgeEn": "Honeydew & Sooty Mold",
      "captionHi": "माहू द्वारा छोड़े गए चिपचिपे मीठे रस पर काली फफूंद (Sooty Mold) जम जाना",
      "captionEn": "Black sooty mold developing on honeydew deposits coating maturing wheat heads",
      "locationHi": "निकलती हुई बालियों पर",
      "thumbRuleHi": "हरी बालियों पर सैकड़ों हरे-काले छोटे माहू चिपके रहते हैं; चिपचिपे रस पर काली फफूंद जमने से बालियां काली पड़ जाती हैं।"
    }
  ],
  "maize/fall-armyworm": [
    {
      "url": "/images/pests/pest-spodoptera-frugiperda.jpg",
      "badgeHi": "🦗 फॉल आर्मीवर्म पतंगा",
      "badgeEn": "FAW Adult Moth",
      "captionHi": "धूसर-भूरे पंखों वाला प्रौढ़ पतंगा (नर के पंखों पर त्रिकोणीय सफेद धब्बे)",
      "captionEn": "Mottled brownish-grey adult moth with distinct white apical triangular patches",
      "locationHi": "गाभा (केंद्रीय चक्र) के अंदर",
      "thumbRuleHi": "गोभ के अंदर लकड़ी के बुरादे जैसा गीला मल भरा होता है; इल्ली के सिर पर उल्टा 'Y' निशान और पिछले हिस्से पर 4 चौकोर काले बिंदु होते हैं।"
    },
    {
      "url": "/images/pests/pest-spodoptera-frugiperda-2.jpg",
      "badgeHi": "🐛 गाभा में इल्ली (सुंडी)",
      "badgeEn": "Larva with 4 Pinacula",
      "captionHi": "सिर पर उल्टा 'Y' निशान और पिछले हिस्से पर चौकोर काले 4 बिंदु वाली धारीदार इल्ली",
      "captionEn": "Characteristic inverted Y on head capsule and square arrangement of 4 black dorsal spots",
      "locationHi": "गाभा (केंद्रीय चक्र) के अंदर",
      "thumbRuleHi": "गोभ के अंदर लकड़ी के बुरादे जैसा गीला मल भरा होता है; इल्ली के सिर पर उल्टा 'Y' निशान और पिछले हिस्से पर 4 चौकोर काले बिंदु होते हैं।"
    },
    {
      "url": "/images/pests/pest-spodoptera-frugiperda-3.jpg",
      "badgeHi": "🌾 बुरादे जैसा मल व कटे पत्ते",
      "badgeEn": "Frass & Shot-hole Damage",
      "captionHi": "गाभा (Whorl) में गीला लकड़ी के बुरादे जैसा मल और छलनी जैसे बड़े गोल छेद",
      "captionEn": "Heavy sawdust-like wet frass in central whorl with ragged shot-hole defoliation",
      "locationHi": "गाभा (केंद्रीय चक्र) के अंदर",
      "thumbRuleHi": "गोभ के अंदर लकड़ी के बुरादे जैसा गीला मल भरा होता है; इल्ली के सिर पर उल्टा 'Y' निशान और पिछले हिस्से पर 4 चौकोर काले बिंदु होते हैं।"
    }
  ],
  "maize/stem-borer": [
    {
      "url": "/images/pests/pest-chilo-partellus.jpg",
      "badgeHi": "🦗 तना छेदक पतंगा",
      "badgeEn": "Chilo partellus Moth",
      "captionHi": "पुआल के रंग का हल्के पीले-भूरे पंखों वाला प्रौढ़ पतंगा (काले बिंदुओं की कतार)",
      "captionEn": "Straw-colored adult moth resting with wings wrapped around abdomen",
      "locationHi": "तने के अंदर व गाभा में",
      "thumbRuleHi": "पत्तियों पर गोल छेद की कतारें और तने में छेद से बुरादा बाहर गिरना; बीच की गोभ सूखकर डेड हार्ट बन जाती है।"
    },
    {
      "url": "/images/pests/pest-chilo-partellus-2.jpg",
      "badgeHi": "🐛 तने में सुंडी (इल्ली)",
      "badgeEn": "Stem Borer Caterpillar",
      "captionHi": "तने के अंदर सुरंग बनाकर खाती हुई भूरे धब्बों वाली मटमैली सुंडी",
      "captionEn": "Spotted stalk borer larva feeding internally and tunneling through stem pith",
      "locationHi": "तने के अंदर व गाभा में",
      "thumbRuleHi": "पत्तियों पर गोल छेद की कतारें और तने में छेद से बुरादा बाहर गिरना; बीच की गोभ सूखकर डेड हार्ट बन जाती है।"
    },
    {
      "url": "/images/pests/pest-chilo-partellus-3.jpg",
      "badgeHi": "🌾 डेड हार्ट व तना टूटना",
      "badgeEn": "Dead Heart & Stem Breakage",
      "captionHi": "बीच की गोभ सूखकर डेड हार्ट बनना और तेज हवा में तने बीच से टूट जाना",
      "captionEn": "Central deadheart drying in young plants and stalk breakage at maturity",
      "locationHi": "तने के अंदर व गाभा में",
      "thumbRuleHi": "पत्तियों पर गोल छेद की कतारें और तने में छेद से बुरादा बाहर गिरना; बीच की गोभ सूखकर डेड हार्ट बन जाती है।"
    }
  ],
  "maize/shoot-fly": [
    {
      "url": "/images/pests/pest-atherigona-approximata.jpg",
      "badgeHi": "🦗 तना मक्खी (वयस्क)",
      "badgeEn": "Adult Shoot Fly",
      "captionHi": "घरेलू मक्खी से छोटी, भूरे-धूसर रंग की तना मक्खी (Atherigona soccata)",
      "captionEn": "Small greyish-brown fly with distinct abdominal black spots",
      "locationHi": "अंकुरण के 1-4 हफ्ते में तने में",
      "thumbRuleHi": "बुवाई के 7 से 28 दिन में बीच की पत्ती सूख जाती है और खींचने पर सड़ी दुर्गंध के साथ बाहर निकल आती है।"
    },
    {
      "url": "/images/pests/pest-atherigona-approximata-2.jpg",
      "badgeHi": "🐛 तने में मैगट (सुंडी)",
      "badgeEn": "Shoot Fly Maggot",
      "captionHi": "अंकुरण के 1-4 हफ्ते में तने के अंदर घुसकर बढ़वार बिंदु को काटती बिना पैर वाली मैगट",
      "captionEn": "Legless white creeping maggot boring into growing shoot tip at seedling stage",
      "locationHi": "अंकुरण के 1-4 हफ्ते में तने में",
      "thumbRuleHi": "बुवाई के 7 से 28 दिन में बीच की पत्ती सूख जाती है और खींचने पर सड़ी दुर्गंध के साथ बाहर निकल आती है।"
    },
    {
      "url": "/images/pests/pest-atherigona-approximata-3.jpg",
      "badgeHi": "🌾 सूखा गोभ (सड़ी दुर्गंध)",
      "badgeEn": "Dead Heart & Rot",
      "captionHi": "मुख्य गोभ सूख जाती है और खींचने पर सड़ी हुई दुर्गंध के साथ बाहर निकलती है",
      "captionEn": "Deadheart shoot withering with characteristic rotting odor upon extraction",
      "locationHi": "अंकुरण के 1-4 हफ्ते में तने में",
      "thumbRuleHi": "बुवाई के 7 से 28 दिन में बीच की पत्ती सूख जाती है और खींचने पर सड़ी दुर्गंध के साथ बाहर निकल आती है।"
    }
  ],
  "maize/turcicum-blight": [
    {
      "url": "/images/diseases/disease-exserohilum-turcicum.jpg",
      "badgeHi": "🟡 नाव के आकार के धब्बे",
      "badgeEn": "Spindle Leaf Lesions",
      "captionHi": "पत्तियों पर लंबे (2.5 से 15 सेमी) नाव या तकली के आकार के भूरे-धूसर धब्बे",
      "captionEn": "Long elliptical boat-shaped greyish-green to tan lesions on lower leaves",
      "locationHi": "निचली से ऊपरी पत्तियों पर",
      "thumbRuleHi": "पत्तियों पर 5-15 सेमी लंबे नाव या तकली के आकार के बड़े भूरे धब्बे; ज्यादा नमी में पूरी पत्ती जलने जैसी सूख जाती है।"
    },
    {
      "url": "/images/diseases/disease-exserohilum-turcicum-2.jpg",
      "badgeHi": "🔴 धब्बों का आपस में मिलना",
      "badgeEn": "Coalescing Blight",
      "captionHi": "धब्बे आपस में मिलकर पूरी पत्ती को झुलसा देते हैं, नमी में गहरे बीजाणु जमते हैं",
      "captionEn": "Large necrotic blighted areas coalescing across leaves during high humidity",
      "locationHi": "निचली से ऊपरी पत्तियों पर",
      "thumbRuleHi": "पत्तियों पर 5-15 सेमी लंबे नाव या तकली के आकार के बड़े भूरे धब्बे; ज्यादा नमी में पूरी पत्ती जलने जैसी सूख जाती है।"
    },
    {
      "url": "/images/diseases/disease-exserohilum-turcicum-3.jpg",
      "badgeHi": "🌾 खेत में जला हुआ रूप",
      "badgeEn": "Burnt Canopy Appearance",
      "captionHi": "खेत स्तर पर पत्तियां जलने जैसी दिखती हैं और भुट्टे छोटे व हल्के रह जाते हैं",
      "captionEn": "Canopy-wide scorched field appearance severely curtailing cob filling",
      "locationHi": "निचली से ऊपरी पत्तियों पर",
      "thumbRuleHi": "पत्तियों पर 5-15 सेमी लंबे नाव या तकली के आकार के बड़े भूरे धब्बे; ज्यादा नमी में पूरी पत्ती जलने जैसी सूख जाती है।"
    }
  ],
  "maize/post-flowering-stalk-rot": [
    {
      "url": "/images/crop-identification/04_maize/post_flowering_stalk_rot.webp",
      "badgeHi": "🟡 निचले तने पर भूरा धब्बा",
      "badgeEn": "Lower Culm Lesion",
      "captionHi": "ज़मीन के पास तने की निचली गांठों पर जलसिक्त भूरे-काले धब्बे और तने का मुलायम होना",
      "captionEn": "Water-soaked brownish soft discoloration developing on lower stalk internodes",
      "locationHi": "निचले तने की गांठों पर",
      "thumbRuleHi": "निचला तना मुलायम होकर सड़ता है; तना चीरने पर अंदर का गूदा बिखरकर रेशेदार हो जाता है और गुलाबी-बैंगनी रंग दिखता है।"
    },
    {
      "url": "/images/diseases/disease-fusarium-moniliforme.jpg",
      "badgeHi": "🔴 तना चीरने पर रेशेदार गूदा",
      "badgeEn": "Shredded Pith Tissue",
      "captionHi": "तना चीरने पर अंदर का गूदा धागों (रेशों) की तरह बिखर जाता है और गुलाबी-बैंगनी रंग दिखता है",
      "captionEn": "Complete disintegration of inner pith into shredded vascular strands with pinkish rot",
      "locationHi": "निचले तने की गांठों पर",
      "thumbRuleHi": "निचला तना मुलायम होकर सड़ता है; तना चीरने पर अंदर का गूदा बिखरकर रेशेदार हो जाता है और गुलाबी-बैंगनी रंग दिखता है।"
    },
    {
      "url": "/images/diseases/disease-fusarium-oxysporum.jpg",
      "badgeHi": "🌾 तना टूटना व फसल गिरना",
      "badgeEn": "Stalk Breakage & Lodging",
      "captionHi": "भुट्टा भरते समय भारी तने नीचे से टूटकर खेत में गिर जाते हैं (Lodging)",
      "captionEn": "Weakened rotting stalks snapping over in the field prior to harvest",
      "locationHi": "निचले तने की गांठों पर",
      "thumbRuleHi": "निचला तना मुलायम होकर सड़ता है; तना चीरने पर अंदर का गूदा बिखरकर रेशेदार हो जाता है और गुलाबी-बैंगनी रंग दिखता है।"
    }
  ],
  "maize/common-rust": [
    {
      "url": "/images/diseases/disease-puccinia-sorghi.jpg",
      "badgeHi": "🟡 पत्तियों पर भूरे फफोले",
      "badgeEn": "Brown Rust Pustules",
      "captionHi": "पत्ती के दोनों तरफ छोटे, गोलाकार से अंडाकार सुनहरे-भूरे उभरे हुए फफोले",
      "captionEn": "Small powdery cinnamon-brown uredinial pustules scattered on both leaf surfaces",
      "locationHi": "पत्ती के दोनों तरफ",
      "thumbRuleHi": "पत्ती के दोनों तरफ छोटे गोल भूरे उभरे हुए फफोले; उंगली से रगड़ने पर भूरा बीजाणु पाउडर छूटता है।"
    },
    {
      "url": "/images/diseases/disease-puccinia-sorghi-2.jpg",
      "badgeHi": "🔴 भूरा बीजाणु पाउडर",
      "badgeEn": "Powdery Spores Spread",
      "captionHi": "फफोले फटने पर भूरा-नारंगी पाउडर निकलता है जो हवा से पूरे खेत में फैलता है",
      "captionEn": "Ruptured epidermal pustules releasing powdery brown spore clouds in the wind",
      "locationHi": "पत्ती के दोनों तरफ",
      "thumbRuleHi": "पत्ती के दोनों तरफ छोटे गोल भूरे उभरे हुए फफोले; उंगली से रगड़ने पर भूरा बीजाणु पाउडर छूटता है।"
    },
    {
      "url": "/images/diseases/disease-puccinia-sorghi-3.jpg",
      "badgeHi": "🌾 पत्तियां सूखना व उपज कमी",
      "badgeEn": "Severe Foliar Blight",
      "captionHi": "ऊपरी पत्तियां समय से पहले पीली होकर सूख जाती हैं जिससे भुट्टे ठीक से नहीं भरते",
      "captionEn": "Premature chlorosis and drying of functional leaves reducing cob size",
      "locationHi": "पत्ती के दोनों तरफ",
      "thumbRuleHi": "पत्ती के दोनों तरफ छोटे गोल भूरे उभरे हुए फफोले; उंगली से रगड़ने पर भूरा बीजाणु पाउडर छूटता है।"
    }
  ],
  "tomato/damping-off": [
    {
      "url": "/images/diseases/disease-damping-off.jpg",
      "badgeHi": "🟡 नर्सरी में तना सिकुड़ना",
      "badgeEn": "Collar Constriction",
      "captionHi": "ज़मीन की सतह के पास तना पतला, जलसिक्त व भूरा होकर सिकुड़ जाता है",
      "captionEn": "Water-soaked soft constriction at soil line on tender nursery seedlings",
      "locationHi": "नर्सरी में ज़मीन की सतह पर तने पर",
      "thumbRuleHi": "ज़मीन के पास तना पतला व गीला होकर सड़ जाता है और स्वस्थ पौध अचानक ज़मीन पर गिरकर 24 घंटे में गल जाती है।"
    },
    {
      "url": "/images/diseases/disease-damping-off-2.jpg",
      "badgeHi": "🔴 पौध का गिरना व सड़ना",
      "badgeEn": "Seedling Toppling",
      "captionHi": "वज़न न संभलने से पौधा ज़मीन पर गिर जाता है और 24-48 घंटे में सड़कर नष्ट हो जाता है",
      "captionEn": "Infected seedlings toppling over at ground level and rotting rapidly",
      "locationHi": "नर्सरी में ज़मीन की सतह पर तने पर",
      "thumbRuleHi": "ज़मीन के पास तना पतला व गीला होकर सड़ जाता है और स्वस्थ पौध अचानक ज़मीन पर गिरकर 24 घंटे में गल जाती है।"
    },
    {
      "url": "/images/diseases/disease-damping-off-3.jpg",
      "badgeHi": "🌾 नर्सरी में खाली पैच",
      "badgeEn": "Nursery Bed Gaps",
      "captionHi": "नर्सरी की क्यारी में जगह-जगह गोल खाली पैच बन जाते हैं जहां पौध पूरी तरह गल चुकी होती है",
      "captionEn": "Circular bald patches in seedbed where entire groups of seedlings died",
      "locationHi": "नर्सरी में ज़मीन की सतह पर तने पर",
      "thumbRuleHi": "ज़मीन के पास तना पतला व गीला होकर सड़ जाता है और स्वस्थ पौध अचानक ज़मीन पर गिरकर 24 घंटे में गल जाती है।"
    }
  ],
  "tomato/leaf-miner": [
    {
      "url": "/images/pests/pest-liriomyza-trifolii.jpg",
      "badgeHi": "🦗 लीफ माइनर मक्खी",
      "badgeEn": "Adult Leafminer Fly",
      "captionHi": "छोटी काली-पीली मक्खी (1.5-2 मिमी) जो पत्ती की ऊपरी सतह पर अंडे देती है",
      "captionEn": "Minute black and yellow fly puncturing leaf surface for feeding and oviposition",
      "locationHi": "पत्तियों के अंदर (नागअली)",
      "thumbRuleHi": "पत्तियों के अंदर सफेद रंग की टेढ़ी-मेढ़ी सांप जैसी लकीरें (सुरंगें) दिखती हैं; रोशनी के सामने देखने पर सुरंग में सुंडी दिखती है।"
    },
    {
      "url": "/images/pests/pest-liriomyza-trifolii-2.jpg",
      "badgeHi": "🐛 पत्ती में टेढ़ी-मेढ़ी सुरंग",
      "badgeEn": "Serpentine Leaf Mines",
      "captionHi": "पत्ती के अंदर सुंडी टेढ़ी-मेढ़ी सफेद सांप जैसी सुरंग बनाती है (नागअली)",
      "captionEn": "Serpentine white winding mines carved out between epidermal layers by feeding larva",
      "locationHi": "पत्तियों के अंदर (नागअली)",
      "thumbRuleHi": "पत्तियों के अंदर सफेद रंग की टेढ़ी-मेढ़ी सांप जैसी लकीरें (सुरंगें) दिखती हैं; रोशनी के सामने देखने पर सुरंग में सुंडी दिखती है।"
    },
    {
      "url": "/images/pests/pest-liriomyza-trifolii-3.jpg",
      "badgeHi": "🌾 पत्तियां सूखना व झड़ना",
      "badgeEn": "Severe Mined Canopy",
      "captionHi": "ज्यादा सुरंगें बनने से पत्तियां सूखकर झुलस जाती हैं और समय से पहले गिर जाती हैं",
      "captionEn": "Extensive tunneling causing desiccation, leaf scorch, and early defoliation",
      "locationHi": "पत्तियों के अंदर (नागअली)",
      "thumbRuleHi": "पत्तियों के अंदर सफेद रंग की टेढ़ी-मेढ़ी सांप जैसी लकीरें (सुरंगें) दिखती हैं; रोशनी के सामने देखने पर सुरंग में सुंडी दिखती है।"
    }
  ],
  "tomato/whitefly": [
    {
      "url": "/images/pests/pest-bemisia-tabaci.jpg",
      "badgeHi": "🦗 सफेद मक्खी (वयस्क)",
      "badgeEn": "Adult Whiteflies",
      "captionHi": "पत्ती की निचली सतह पर चिपकी सफेद मोमी पंखों वाली छोटी मक्खियां (1 मिमी)",
      "captionEn": "Tiny moth-like whiteflies with snow-white powdery wings under leaf surface",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पौधे की शाखा को हिलाने पर पत्तियों के नीचे से नन्हीं सफेद मक्खियां बादलों की तरह उड़ती हैं; पत्तियों पर चिपचिपा रस जम जाता है।"
    },
    {
      "url": "/images/pests/pest-bemisia-tabaci-2.jpg",
      "badgeHi": "🪲 निम्फ व चिपचिपा रस",
      "badgeEn": "Nymphs & Honeydew",
      "captionHi": "पत्तियों के नीचे चिपके चपटे पीले-हरे निम्फ और पत्तियों पर चमकदार चिपचिपा शहद जैसा स्राव",
      "captionEn": "Flat scale-like greenish nymphs excreting sticky honeydew on foliage",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पौधे की शाखा को हिलाने पर पत्तियों के नीचे से नन्हीं सफेद मक्खियां बादलों की तरह उड़ती हैं; पत्तियों पर चिपचिपा रस जम जाता है।"
    },
    {
      "url": "/images/pests/pest-bemisia-tabaci-3.jpg",
      "badgeHi": "🌾 काली फफूंद व लीफ कर्ल",
      "badgeEn": "Sooty Mold & Virus Vector",
      "captionHi": "चिपचिपे रस पर काली फफूंद जमना और पत्ता मरोड़ वायरस (ToLCV) का खेत में फैलाव",
      "captionEn": "Black sooty mold blanket and transmission of destructive leaf curl virus",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पौधे की शाखा को हिलाने पर पत्तियों के नीचे से नन्हीं सफेद मक्खियां बादलों की तरह उड़ती हैं; पत्तियों पर चिपचिपा रस जम जाता है।"
    }
  ],
  "tomato/early-blight": [
    {
      "url": "/images/diseases/disease-alternaria-solani.jpg",
      "badgeHi": "🟡 छल्लेदार भूरे धब्बे",
      "badgeEn": "Target-board Leaf Spots",
      "captionHi": "निचली पत्तियों पर गोल भूरे धब्बे जिनमें लकड़ी के गोल छल्ले (Target-board rings) दिखते हैं",
      "captionEn": "Concentric dark brown circular rings with target-board pattern on lower leaves",
      "locationHi": "निचली पुरानी पत्तियों व तने पर",
      "thumbRuleHi": "पत्तियों पर गहरे भूरे गोल धब्बे जिनमें लकड़ी के वार्षिक छल्लों जैसे गोल घेरे (Target-board) दिखते हैं; चारों तरफ पीला हलो होता है।"
    },
    {
      "url": "/images/diseases/disease-alternaria-solani-2.jpg",
      "badgeHi": "🔴 पत्ती का पीला पड़कर सूखना",
      "badgeEn": "Chlorotic Blight Spread",
      "captionHi": "धब्बों के चारों ओर पीला घेरा (हलो) बनता है और पत्तियां नीचे से ऊपर की ओर सूखने लगती हैं",
      "captionEn": "Yellow chlorotic halos surrounding lesions, spreading acropetally up the vine",
      "locationHi": "निचली पुरानी पत्तियों व तने पर",
      "thumbRuleHi": "पत्तियों पर गहरे भूरे गोल धब्बे जिनमें लकड़ी के वार्षिक छल्लों जैसे गोल घेरे (Target-board) दिखते हैं; चारों तरफ पीला हलो होता है।"
    },
    {
      "url": "/images/diseases/disease-alternaria-solani-3.jpg",
      "badgeHi": "🌾 फल के डंठल पर काला धब्बा",
      "badgeEn": "Stem & Fruit Rot",
      "captionHi": "फल के डंठल के पास धंसे हुए काले-कत्थई छल्लेदार धब्बे, फल पकने से पहले गिरना",
      "captionEn": "Sunken leathery black lesions at stem-end of tomato fruit causing premature drop",
      "locationHi": "निचली पुरानी पत्तियों व तने पर",
      "thumbRuleHi": "पत्तियों पर गहरे भूरे गोल धब्बे जिनमें लकड़ी के वार्षिक छल्लों जैसे गोल घेरे (Target-board) दिखते हैं; चारों तरफ पीला हलो होता है।"
    }
  ],
  "tomato/thrips": [
    {
      "url": "/images/pests/pest-thrips-tabaci.jpg",
      "badgeHi": "🦗 थ्रिप्स वयस्क कीट",
      "badgeEn": "Adult Thrips on Flower",
      "captionHi": "फूलों व पत्तियों पर बैठा बहुत छोटा (1 मिमी) पतला पीला-भूरा कीट जिसके पंखों पर रेशे होते हैं",
      "captionEn": "Slender yellowish-brown thrips with fringed wings active inside blossoms",
      "locationHi": "फूलों व नई कोमल पत्तियों पर",
      "thumbRuleHi": "पत्तियों के किनारे ऊपर की ओर मुड़कर नाव जैसे हो जाते हैं और पत्ती की निचली सतह पर चांदी जैसी चमक (Silvery sheen) दिखती है।"
    },
    {
      "url": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
      "badgeHi": "🪲 निम्फ व पत्ती खुरचना",
      "badgeEn": "Nymphs Feeding",
      "captionHi": "पत्ती की निचली सतह को खुरचकर रस चूसते हुए हल्के पीले रंग के नन्हे निम्फ",
      "captionEn": "Tiny pale nymphs rasping leaf epidermis and sucking emerging sap",
      "locationHi": "फूलों व नई कोमल पत्तियों पर",
      "thumbRuleHi": "पत्तियों के किनारे ऊपर की ओर मुड़कर नाव जैसे हो जाते हैं और पत्ती की निचली सतह पर चांदी जैसी चमक (Silvery sheen) दिखती है।"
    },
    {
      "url": "/images/crop-identification/01_tomato/thrips.webp",
      "badgeHi": "🌾 पत्तियां ऊपर मुड़ना व चांदी जैसी चमक",
      "badgeEn": "Upward Cupping & Silvering",
      "captionHi": "पत्तियों के किनारे ऊपर की ओर नाव की तरह मुड़ना (Upward cup) और चांदी जैसी चमकीली धारियां",
      "captionEn": "Boat-shaped upward curling of leaflets and characteristic silvery stippling",
      "locationHi": "फूलों व नई कोमल पत्तियों पर",
      "thumbRuleHi": "पत्तियों के किनारे ऊपर की ओर मुड़कर नाव जैसे हो जाते हैं और पत्ती की निचली सतह पर चांदी जैसी चमक (Silvery sheen) दिखती है।"
    }
  ],
  "tomato/red-spider-mite": [
    {
      "url": "/images/pests/pest-tetranychus-urticae.jpg",
      "badgeHi": "🦗 लाल मकड़ी व जाला",
      "badgeEn": "Spider Mites & Webbing",
      "captionHi": "पत्ती की निचली सतह पर बारीक रेशमी जाले के अंदर घूमती नन्हीं लाल-भूरे रंग की मकड़ियां",
      "captionEn": "Fine protective silken webbing with red-amber two-spotted spider mites beneath leaves",
      "locationHi": "पत्तियों की निचली सतह पर बारीक जाले में",
      "thumbRuleHi": "पत्ती की ऊपरी सतह पर हजारों बारीक पीले बिंदु उभरते हैं और पत्ती कांसे/तांबे (Bronze) जैसी होकर सूखने लगती है; नीचे बारीक जाला दिखता है।"
    },
    {
      "url": "/images/crop-identification/01_tomato/red_spider_mite.webp",
      "badgeHi": "🟡 पत्ती पर बारीक पीले बिंदु",
      "badgeEn": "Yellow Stippling",
      "captionHi": "पत्ती की ऊपरी सतह पर हजारों बारीक पीले-सफेद बिंदु (Stippling) उभरना",
      "captionEn": "Dense speckling and chlorotic stippling across upper leaf surface from feeding",
      "locationHi": "पत्तियों की निचली सतह पर बारीक जाले में",
      "thumbRuleHi": "पत्ती की ऊपरी सतह पर हजारों बारीक पीले बिंदु उभरते हैं और पत्ती कांसे/तांबे (Bronze) जैसी होकर सूखने लगती है; नीचे बारीक जाला दिखता है।"
    },
    {
      "url": "/images/crop-identification/01_tomato/red_spider_mite.webp",
      "badgeHi": "🌾 कांसे जैसा रंग (ब्रोंजिंग)",
      "badgeEn": "Severe Bronzing & Drying",
      "captionHi": "पत्तियां तांबे-कांसे जैसी (Bronzing) होकर कड़क हो जाती हैं और सूखकर झुलस जाती हैं",
      "captionEn": "Rusty bronzed appearance with dry curled margins and premature foliage drop",
      "locationHi": "पत्तियों की निचली सतह पर बारीक जाले में",
      "thumbRuleHi": "पत्ती की ऊपरी सतह पर हजारों बारीक पीले बिंदु उभरते हैं और पत्ती कांसे/तांबे (Bronze) जैसी होकर सूखने लगती है; नीचे बारीक जाला दिखता है।"
    }
  ],
  "tomato/leaf-curl": [
    {
      "url": "/images/diseases/disease-tomato-leaf-curl-photoreal.jpg",
      "badgeHi": "🟡 पत्तियां ऊपर की ओर मुड़ना",
      "badgeEn": "Upward Leaf Curling",
      "captionHi": "पत्तियों के किनारे अंदर व ऊपर की ओर कपनुमा मुड़ जाना और पत्तियां मोटी व कड़क होना",
      "captionEn": "Severe inward and upward curling of leaflets with thick, leathery texture",
      "locationHi": "शीर्ष की नई पत्तियों पर",
      "thumbRuleHi": "पत्तियां ऊपर व अंदर की ओर मुड़कर कप जैसी और मोटी-कड़क हो जाती हैं; पौधे की बढ़वार रुककर पौधा झाड़ीनुमा (बौना) हो जाता है।"
    },
    {
      "url": "/images/diseases/disease-begomovirus-leaf-curl.jpg",
      "badgeHi": "🔴 नसों का पीला पड़ना व बौनापन",
      "badgeEn": "Vein Clearing & Stunting",
      "captionHi": "पत्तियों की नसें पीली पड़ जाती हैं और पौधे की बढ़वार रुककर पौधा झाड़ीनुमा (बौना) हो जाता है",
      "captionEn": "Vein clearing, severe chlorosis, and bushy dwarfed appearance of infected plants",
      "locationHi": "शीर्ष की नई पत्तियों पर",
      "thumbRuleHi": "पत्तियां ऊपर व अंदर की ओर मुड़कर कप जैसी और मोटी-कड़क हो जाती हैं; पौधे की बढ़वार रुककर पौधा झाड़ीनुमा (बौना) हो जाता है।"
    },
    {
      "url": "/images/diseases/disease-begomovirus-leaf-curl-2.jpg",
      "badgeHi": "🌾 फूल झड़ना व फल न लगना",
      "badgeEn": "Flower Drop & Zero Fruit",
      "captionHi": "प्रभावित पौधों से फूल झड़ जाते हैं, फल बहुत छोटे विकृत लगते हैं या बिल्कुल नहीं लगते",
      "captionEn": "Profuse blossom drop, highly deformed stunted fruit, and drastic yield loss",
      "locationHi": "शीर्ष की नई पत्तियों पर",
      "thumbRuleHi": "पत्तियां ऊपर व अंदर की ओर मुड़कर कप जैसी और मोटी-कड़क हो जाती हैं; पौधे की बढ़वार रुककर पौधा झाड़ीनुमा (बौना) हो जाता है।"
    }
  ],
  "tomato/bacterial-spot-wilt": [
    {
      "url": "/images/diseases/disease-ralstonia-solanacearum.jpg",
      "badgeHi": "🟡 दिन में मुरझाना (उकठा)",
      "badgeEn": "Daytime Wilting",
      "captionHi": "पौधे की पत्तियां हरी रहते हुए ही दिन की धूप में अचानक मुरझा जाती हैं (बैक्टीरियल विल्ट)",
      "captionEn": "Rapid daytime drooping and wilting of lush green foliage without initial yellowing",
      "locationHi": "पूरे पौधे के संवहन तंत्र में",
      "thumbRuleHi": "दिन की तेज़ धूप में हरा पौधा अचानक मुरझा जाता है; तना काटकर कांच के गिलास में पानी में लटकाने पर दूधिया धागे जैसा बैक्टीरिया ऊज़ निकलता है।"
    },
    {
      "url": "/images/diseases/disease-ralstonia-solanacearum-2.jpg",
      "badgeHi": "🔴 तना चीरने पर जीवाणु ऊज़",
      "badgeEn": "Bacterial Streaming (Ooze)",
      "captionHi": "तना काटकर साफ पानी में रखने पर संवहनी बंडलों से सफेद दूधिया धागे जैसा बैक्टीरिया ऊज़ निकलता है",
      "captionEn": "Cut stem showing characteristic white milky bacterial streaming in clear water",
      "locationHi": "पूरे पौधे के संवहन तंत्र में",
      "thumbRuleHi": "दिन की तेज़ धूप में हरा पौधा अचानक मुरझा जाता है; तना काटकर कांच के गिलास में पानी में लटकाने पर दूधिया धागे जैसा बैक्टीरिया ऊज़ निकलता है।"
    },
    {
      "url": "/images/diseases/disease-ralstonia-solanacearum-3.jpg",
      "badgeHi": "🌾 पूरा पौधा सूखकर नष्ट",
      "badgeEn": "Complete Plant Death",
      "captionHi": "तने का संवहन तंत्र बंद होने से पूरा पौधा सूखकर मर जाता है, फल सड़ने लगते हैं",
      "captionEn": "Total vascular blockage leading to irreversible plant collapse and rot",
      "locationHi": "पूरे पौधे के संवहन तंत्र में",
      "thumbRuleHi": "दिन की तेज़ धूप में हरा पौधा अचानक मुरझा जाता है; तना काटकर कांच के गिलास में पानी में लटकाने पर दूधिया धागे जैसा बैक्टीरिया ऊज़ निकलता है।"
    }
  ],
  "tomato/fruit-borer": [
    {
      "url": "/images/pests/pest-helicoverpa-armigera.jpg",
      "badgeHi": "🦗 फल छेदक पतंगा",
      "badgeEn": "Adult Helicoverpa Moth",
      "captionHi": "मजबूत शरीर वाला पीले-भूरे रंग का पतंगा (पिछले पंखों पर चौड़ा काला किनारा)",
      "captionEn": "Stout yellowish-brown adult moth with dark band along hindwing margins",
      "locationHi": "हरे व पके टमाटर के फल पर",
      "thumbRuleHi": "टमाटर पर गोल छेद दिखता है और धारीदार सुंडी अपना आधा शरीर फल के अंदर घुसाकर गूदा खाती है, पिछला हिस्सा बाहर लटका रहता है।"
    },
    {
      "url": "/images/pests/pest-helicoverpa-armigera-2.jpg",
      "badgeHi": "🐛 फल में छेद करती सुंडी",
      "badgeEn": "Borer Larva in Fruit",
      "captionHi": "हरी-भूरी धारीदार सुंडी अपना आधा शरीर फल के अंदर घुसाकर गूदा खाती है और आधा हिस्सा बाहर रहता है",
      "captionEn": "Striped caterpillar thrusting half its body inside tomato fruit feeding on pulp",
      "locationHi": "हरे व पके टमाटर के फल पर",
      "thumbRuleHi": "टमाटर पर गोल छेद दिखता है और धारीदार सुंडी अपना आधा शरीर फल के अंदर घुसाकर गूदा खाती है, पिछला हिस्सा बाहर लटका रहता है।"
    },
    {
      "url": "/images/pests/pest-helicoverpa-armigera-3.jpg",
      "badgeHi": "🌾 गोल छेद व सड़ा हुआ फल",
      "badgeEn": "Boreholes & Fruit Rot",
      "captionHi": "टमाटर पर गोल छेद व काला मल दिखता है, छेद से फफूंद व बैक्टीरिया घुसकर फल सड़ा देते हैं",
      "captionEn": "Circular entry holes with wet frass causing internal rotting and fruit drop",
      "locationHi": "हरे व पके टमाटर के फल पर",
      "thumbRuleHi": "टमाटर पर गोल छेद दिखता है और धारीदार सुंडी अपना आधा शरीर फल के अंदर घुसाकर गूदा खाती है, पिछला हिस्सा बाहर लटका रहता है।"
    }
  ],
  "tomato/pinworm": [
    {
      "url": "/images/pests/pest-tomato-tuta-absoluta-photoreal.jpg",
      "badgeHi": "🦗 पिनवर्म पतंगा (Tuta)",
      "badgeEn": "Adult Tuta absoluta Moth",
      "captionHi": "छोटा (5-6 मिमी) भूरा-धूसर पतंगा जो शाम के समय सक्रिय होकर पत्तियों व फलों पर अंडे देता है",
      "captionEn": "Minute silvery-grey moth active at dusk laying eggs on foliage and sepals",
      "locationHi": "पत्तियों पर छाले व फल के डंठल पर",
      "thumbRuleHi": "पत्तियों पर पारदर्शी फफोले जैसे बड़े छाले (Blotch mines) बनते हैं और फल के डंठल (कैलिक्स) के पास सुई जैसे बारीक पिन छेद होते हैं।"
    },
    {
      "url": "/images/crop-identification/01_tomato/tuta_absoluta.webp",
      "badgeHi": "🐛 पत्ती में पारदर्शी छाला सुरंग",
      "badgeEn": "Blotch Mine & Larva",
      "captionHi": "पत्ती के दोनों परतों के बीच का हरा गूदा खाकर पारदर्शी छाला (Blotch mine) बनाती छोटी इल्ली",
      "captionEn": "Young larva mining out irregular transparent blotch cavities between leaf epidermis",
      "locationHi": "पत्तियों पर छाले व फल के डंठल पर",
      "thumbRuleHi": "पत्तियों पर पारदर्शी फफोले जैसे बड़े छाले (Blotch mines) बनते हैं और फल के डंठल (कैलिक्स) के पास सुई जैसे बारीक पिन छेद होते हैं।"
    },
    {
      "url": "/images/crop-identification/01_tomato/leaf_miner.webp",
      "badgeHi": "🌾 डंठल व फल में पिन छेद",
      "badgeEn": "Fruit Calyx Pinholes",
      "captionHi": "फल के डंठल (कैलिक्स) के पास सुंडी सुई के छेद जैसे पिन छेद बनाकर अंदर घुसती है",
      "captionEn": "Pin-sized entry punctures under the green calyx with dark granular frass",
      "locationHi": "पत्तियों पर छाले व फल के डंठल पर",
      "thumbRuleHi": "पत्तियों पर पारदर्शी फफोले जैसे बड़े छाले (Blotch mines) बनते हैं और फल के डंठल (कैलिक्स) के पास सुई जैसे बारीक पिन छेद होते हैं।"
    }
  ],
  "tomato/late-blight": [
    {
      "url": "/images/diseases/disease-phytophthora-infestans.jpg",
      "badgeHi": "🟡 जलसिक्त गहरे धब्बे",
      "badgeEn": "Water-soaked Dark Lesions",
      "captionHi": "पत्तियों पर अनियमित बड़े जलसिक्त धब्बे जो ठंडे-नम मौसम में तेजी से गहरे भूरे-काले हो जाते हैं",
      "captionEn": "Large irregular water-soaked greasy brown lesions rapidly expanding in cool humid weather",
      "locationHi": "पत्तियों, तने व फलों पर",
      "thumbRuleHi": "ठंडे-नम मौसम में पत्तियों पर गीले काले-भूरे धब्बे, सुबह निचली सतह पर सफेद फफूंद और फलों पर कड़क चमड़े जैसे भूरे घाव; खेत से सड़ी बदबू आती है।"
    },
    {
      "url": "/images/diseases/disease-phytophthora-infestans-2.jpg",
      "badgeHi": "🔴 पत्ती के नीचे सफेद फफूंद",
      "badgeEn": "White Downy Fungal Ring",
      "captionHi": "सुबह के समय पत्ती की निचली सतह पर धब्बों के किनारों पर सफेद रोयेंदार फफूंद (Downy mold) दिखना",
      "captionEn": "Delicate white downy fungal mildew visible around margins on leaf underside",
      "locationHi": "पत्तियों, तने व फलों पर",
      "thumbRuleHi": "ठंडे-नम मौसम में पत्तियों पर गीले काले-भूरे धब्बे, सुबह निचली सतह पर सफेद फफूंद और फलों पर कड़क चमड़े जैसे भूरे घाव; खेत से सड़ी बदबू आती है।"
    },
    {
      "url": "/images/diseases/disease-phytophthora-infestans-3.jpg",
      "badgeHi": "🌾 कत्थई फल सड़न व फसल झुलसा",
      "badgeEn": "Firm Brown Fruit Rot",
      "captionHi": "हरे व पके टमाटरों पर कड़क चमड़े जैसे गहरे कत्थई धब्बे और 2-3 दिन में पूरे खेत का जल जाना",
      "captionEn": "Firm, greasy, leathery brown rot on green tomatoes and total field collapse",
      "locationHi": "पत्तियों, तने व फलों पर",
      "thumbRuleHi": "ठंडे-नम मौसम में पत्तियों पर गीले काले-भूरे धब्बे, सुबह निचली सतह पर सफेद फफूंद और फलों पर कड़क चमड़े जैसे भूरे घाव; खेत से सड़ी बदबू आती है।"
    }
  ],
  "cotton/jassid-aphid": [
    {
      "url": "/images/pests/pest-amrasca-biguttula.jpg",
      "badgeHi": "🦗 हरा तेला (जैसिड वयस्क)",
      "badgeEn": "Green Leafhopper (Jassid)",
      "captionHi": "पत्ती के नीचे तिरछा चलने वाला पच्चरनुमा हल्का हरा फुदका कीट (Amrasca biguttula)",
      "captionEn": "Wedge-shaped pale green leafhopper running sideways rapidly beneath cotton leaves",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "हल्का हरा फुदका पत्ती के नीचे तिरछा भागता है; रस चूसने से पत्तियां नीचे की ओर मुड़कर किनारों से ईंट जैसी लाल होकर सूख जाती हैं।"
    },
    {
      "url": "/images/pests/pest-amrasca-biguttula-2.jpg",
      "badgeHi": "🪲 निम्फ व पत्ती किनारों से लाल होना",
      "badgeEn": "Hopper Burn & Yellowing",
      "captionHi": "रस चूसने से पत्तियों के किनारे पीले होकर नीचे की ओर मुड़ते हैं और लाल-भूरे हो जाते हैं",
      "captionEn": "Downward curling with marginal yellowing turning into reddish-brown hopper burn",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "हल्का हरा फुदका पत्ती के नीचे तिरछा भागता है; रस चूसने से पत्तियां नीचे की ओर मुड़कर किनारों से ईंट जैसी लाल होकर सूख जाती हैं।"
    },
    {
      "url": "/images/pests/pest-amrasca-biguttula-3.jpg",
      "badgeHi": "🌾 हॉपर बर्न व पत्ती गिरना",
      "badgeEn": "Severe Leaf Scorch",
      "captionHi": "पत्तियां ईंट जैसी लाल होकर कड़क हो जाती हैं और टूटकर गिर जाती हैं",
      "captionEn": "Brittle brick-red scorched foliage with severe defoliation and shed squares",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "हल्का हरा फुदका पत्ती के नीचे तिरछा भागता है; रस चूसने से पत्तियां नीचे की ओर मुड़कर किनारों से ईंट जैसी लाल होकर सूख जाती हैं।"
    }
  ],
  "cotton/thrips": [
    {
      "url": "/images/pests/pest-thrips-tabaci.jpg",
      "badgeHi": "🦗 थ्रिप्स वयस्क कीट",
      "badgeEn": "Adult Cotton Thrips",
      "captionHi": "पत्तियों व कलियों पर बैठा बहुत छोटा पतला भूरा-काला कीट (Thrips tabaci)",
      "captionEn": "Elongate dark brown to black thrips actively moving across terminal bud",
      "locationHi": "कलियों व नई पत्तियों पर",
      "thumbRuleHi": "पत्तियों के किनारे ऊपर की ओर मुड़कर कटोरी जैसे हो जाते हैं और पत्तियों की निचली सतह चांदी जैसी चमकदार दिखती है।"
    },
    {
      "url": "/images/pests/pest-thrips-tabaci-2.jpg",
      "badgeHi": "🪲 निम्फ व पत्ती खुरचना",
      "badgeEn": "Thrips Nymphs",
      "captionHi": "पत्ती की निचली सतह को खुरचकर रस चूसते हुए नन्हे पीले रंग के निम्फ",
      "captionEn": "Translucent yellow nymphs rasping leaf tissue between minor veins",
      "locationHi": "कलियों व नई पत्तियों पर",
      "thumbRuleHi": "पत्तियों के किनारे ऊपर की ओर मुड़कर कटोरी जैसे हो जाते हैं और पत्तियों की निचली सतह चांदी जैसी चमकदार दिखती है।"
    },
    {
      "url": "/images/pests/pest-thrips-tabaci-3.jpg",
      "badgeHi": "🌾 ऊपर मुड़ी पत्तियां व चांदी चमक",
      "badgeEn": "Cup-shaped Silvering",
      "captionHi": "पत्तियां ऊपर की ओर कप जैसी मुड़ जाती हैं और निचली सतह पर चांदी जैसी चमक (Silvery shine) दिखती है",
      "captionEn": "Leaves cupping upward like small bowls with silvery sheen beneath",
      "locationHi": "कलियों व नई पत्तियों पर",
      "thumbRuleHi": "पत्तियों के किनारे ऊपर की ओर मुड़कर कटोरी जैसे हो जाते हैं और पत्तियों की निचली सतह चांदी जैसी चमकदार दिखती है।"
    }
  ],
  "cotton/whitefly": [
    {
      "url": "/images/pests/pest-bemisia-tabaci.jpg",
      "badgeHi": "🦗 सफेद मक्खी (वयस्क)",
      "badgeEn": "Adult Cotton Whitefly",
      "captionHi": "पत्ती के नीचे चिपकी सफेद मोमी पंखों वाली छोटी मक्खियां (Bemisia tabaci)",
      "captionEn": "Tiny moth-like whiteflies with pure white powdery wings underneath leaf",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्तियों के नीचे मोमी सफेद मक्खियों का झुंड; चिपचिपे स्राव पर काली फफूंद जमती है और पत्ता मरोड़ वायरस (CLCuV) फैलता है।"
    },
    {
      "url": "/images/pests/pest-bemisia-tabaci-2.jpg",
      "badgeHi": "🪲 निम्फ व चिपचिपा स्राव",
      "badgeEn": "Nymphs & Honeydew",
      "captionHi": "पत्ती के नीचे चिपके चपटे स्केल जैसे निम्फ और पत्तियों पर चिपचिपा मीठा स्राव (Honeydew)",
      "captionEn": "Scale-like greenish nymphs feeding on sap and coating leaves in honeydew",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्तियों के नीचे मोमी सफेद मक्खियों का झुंड; चिपचिपे स्राव पर काली फफूंद जमती है और पत्ता मरोड़ वायरस (CLCuV) फैलता है।"
    },
    {
      "url": "/images/pests/pest-bemisia-tabaci-3.jpg",
      "badgeHi": "🌾 काली फफूंद व पत्ता मरोड़ (CLCuV)",
      "badgeEn": "Sooty Mold & Cotton Leaf Curl",
      "captionHi": "चिपचिपे रस पर काली फफूंद जमना और कपास का खतरनाक पत्ता मरोड़ वायरस (CLCuV) फैलाना",
      "captionEn": "Black sooty mold blanket and vectoring devastating Cotton Leaf Curl Virus",
      "locationHi": "पत्तियों की निचली सतह पर",
      "thumbRuleHi": "पत्तियों के नीचे मोमी सफेद मक्खियों का झुंड; चिपचिपे स्राव पर काली फफूंद जमती है और पत्ता मरोड़ वायरस (CLCuV) फैलता है।"
    }
  ],
  "cotton/mealybug": [
    {
      "url": "/images/pests/pest-phenacoccus-solenopsis.jpg",
      "badgeHi": "🦗 मिलीबग का सफेद मोमी झुंड",
      "badgeEn": "Waxy Mealybug Cluster",
      "captionHi": "कपास की नई शाखाओं व कलियों पर सफेद मोमी पाउडर से ढके सैकड़ों अंडाकार मिलीबग",
      "captionEn": "Dense powdery white waxy clusters of oval mealybugs smothering apical shoot",
      "locationHi": "शाखाओं के शीर्ष, कलियों व टिंडों पर",
      "thumbRuleHi": "नई टहनियों व कलियों पर सफेद मोमी पाउडर से ढके सैकड़ों मिलीबग का चिपचिपा गुच्छा; टहनी विकृत होकर गुच्छेदार (Bunchy top) हो जाती है।"
    },
    {
      "url": "/images/crop-identification/18_cotton/mealybug.webp",
      "badgeHi": "🪲 कलियों व टिंडों पर रस चूसना",
      "badgeEn": "Square & Boll Infestation",
      "captionHi": "फूल की कलियों और हरे टिंडों पर चिपककर रस चूसना, चींटियों का झुंड दिखना",
      "captionEn": "Severe sap-sucking on fruiting forms attended by predatory and mutualist ants",
      "locationHi": "शाखाओं के शीर्ष, कलियों व टिंडों पर",
      "thumbRuleHi": "नई टहनियों व कलियों पर सफेद मोमी पाउडर से ढके सैकड़ों मिलीबग का चिपचिपा गुच्छा; टहनी विकृत होकर गुच्छेदार (Bunchy top) हो जाती है।"
    },
    {
      "url": "/images/crop-identification/18_cotton/mealybug.webp",
      "badgeHi": "🌾 पत्तियां मुड़ना व पौधा बौना होना",
      "badgeEn": "Bunchy Top & Stunting",
      "captionHi": "शाखाएं विकृत होकर गुच्छेदार (Bunchy top) हो जाती हैं और टिंडे सूखकर झड़ जाते हैं",
      "captionEn": "Severe rosette bunchy top stunting, deformed bolls, and premature square drop",
      "locationHi": "शाखाओं के शीर्ष, कलियों व टिंडों पर",
      "thumbRuleHi": "नई टहनियों व कलियों पर सफेद मोमी पाउडर से ढके सैकड़ों मिलीबग का चिपचिपा गुच्छा; टहनी विकृत होकर गुच्छेदार (Bunchy top) हो जाती है।"
    }
  ],
  "cotton/pink-bollworm": [
    {
      "url": "/images/pests/pest-pectinophora-gossypiella.jpg",
      "badgeHi": "🦗 गुलाबी सुंडी का पतंगा",
      "badgeEn": "Pink Bollworm Moth",
      "captionHi": "भूरे-धूसर रंग का छोटा पतंगा (पंखों के किनारों पर लंबे बारीक रेशे)",
      "captionEn": "Small mottled grey-brown moth with fringed hair along wing margins",
      "locationHi": "फूलों व हरे टिंडों के अंदर",
      "thumbRuleHi": "फूल की पंखुड़ियां आपस में जुड़कर गुलाब जैसी (Rosette) हो जाती हैं; 20 दिन के हरे टिंडे को काटने पर अंदर गुलाबी सुंडी व सड़े बिनौले मिलते हैं।"
    },
    {
      "url": "/images/pests/pest-pectinophora-gossypiella-2.jpg",
      "badgeHi": "🐛 टिंडे में गुलाबी सुंडी",
      "badgeEn": "Pink Caterpillar in Boll",
      "captionHi": "हरे टिंडे को काटने पर अंदर बिनौले व रेशे को खाती हुई चमकीली गुलाबी रंग की सुंडी",
      "captionEn": "Characteristic bright pink segmented larva feeding internally on cottonseed and lint",
      "locationHi": "फूलों व हरे टिंडों के अंदर",
      "thumbRuleHi": "फूल की पंखुड़ियां आपस में जुड़कर गुलाब जैसी (Rosette) हो जाती हैं; 20 दिन के हरे टिंडे को काटने पर अंदर गुलाबी सुंडी व सड़े बिनौले मिलते हैं।"
    },
    {
      "url": "/images/pests/pest-pectinophora-gossypiella-3.jpg",
      "badgeHi": "🌾 गुलाबनुमा फूल व सड़े टिंडे",
      "badgeEn": "Rosetted Flower & Stained Lint",
      "captionHi": "फूल की पंखुड़ियां आपस में जुड़कर गुलाब जैसी (Rosetted flower) होना और टिंडे के अंदर सड़ी-दागदार रुई",
      "captionEn": "Webbed rosetted flower petals and completely discolored stained low-grade lint",
      "locationHi": "फूलों व हरे टिंडों के अंदर",
      "thumbRuleHi": "फूल की पंखुड़ियां आपस में जुड़कर गुलाब जैसी (Rosette) हो जाती हैं; 20 दिन के हरे टिंडे को काटने पर अंदर गुलाबी सुंडी व सड़े बिनौले मिलते हैं।"
    }
  ],
  "cotton/boll-rot-blight": [
    {
      "url": "/images/diseases/disease-xanthomonas-citri-malvacearum.jpg",
      "badgeHi": "🟡 कोणीय पत्ती धब्बा (Angular Spot)",
      "badgeEn": "Angular Leaf Spots",
      "captionHi": "पत्तियों की नसों के बीच फंसे कोणीय जलसिक्त धब्बे जो बाद में गहरे लाल-भूरे हो जाते हैं",
      "captionEn": "Angular water-soaked lesions bounded by minor veinlets turning reddish-brown",
      "locationHi": "पत्तियों की नसों, तने व टिंडों पर",
      "thumbRuleHi": "पत्तियों पर नसों से घिरे कोणीय (Angular) जलसिक्त धब्बे; शाखाओं पर काले धंसे घाव (Black arm) और हरे टिंडों का सड़ना।"
    },
    {
      "url": "/images/diseases/disease-xanthomonas-citri-malvacearum-2.jpg",
      "badgeHi": "🔴 काली शाखा (ब्लैक आर्म)",
      "badgeEn": "Black Arm Stem Cankers",
      "captionHi": "शाखाओं व तनों पर गहरे काले धंसे हुए घाव जिससे शाखाएं सूखकर टूट जाती हैं (Black arm)",
      "captionEn": "Elongated black sunken cankers girdling fruiting branches leading to snap-off",
      "locationHi": "पत्तियों की नसों, तने व टिंडों पर",
      "thumbRuleHi": "पत्तियों पर नसों से घिरे कोणीय (Angular) जलसिक्त धब्बे; शाखाओं पर काले धंसे घाव (Black arm) और हरे टिंडों का सड़ना।"
    },
    {
      "url": "/images/diseases/disease-xanthomonas-citri-malvacearum-3.jpg",
      "badgeHi": "🌾 टिंडा सड़न (Boll Rot)",
      "badgeEn": "Boll Rot & Bad Opening",
      "captionHi": "हरे टिंडों पर काले जलसिक्त धब्बे, टिंडे अंदर से सड़ जाते हैं और ठीक से नहीं खिलते",
      "captionEn": "Water-soaked black lesions rotting green bolls preventing normal fluff opening",
      "locationHi": "पत्तियों की नसों, तने व टिंडों पर",
      "thumbRuleHi": "पत्तियों पर नसों से घिरे कोणीय (Angular) जलसिक्त धब्बे; शाखाओं पर काले धंसे घाव (Black arm) और हरे टिंडों का सड़ना।"
    }
  ]
};

// Reverse index by primary image url for instant O(1) lookup
const URL_TO_STAGE_MAP: Record<string, StagePhotoItem[]> = {};

for (const [key, items] of Object.entries(BATCH1_STAGE_MAP)) {
  for (const item of items) {
    if (!URL_TO_STAGE_MAP[item.url]) {
      URL_TO_STAGE_MAP[item.url] = items;
    }
  }
}

/**
 * Get Batch 1 Stage-wise photos either by threat key (e.g. 'paddy/stem-borer')
 * or by primary image URL.
 */
export function getBatch1StagePhotos(
  cropSlug?: string,
  threatId?: string,
  primaryImageUrl?: string
): StagePhotoItem[] | null {
  if (cropSlug && threatId) {
    const key = `${cropSlug}/${threatId}`;
    if (BATCH1_STAGE_MAP[key]) return BATCH1_STAGE_MAP[key];
  }

  if (primaryImageUrl) {
    const cleanUrl = primaryImageUrl.split("?")[0];
    if (URL_TO_STAGE_MAP[cleanUrl]) return URL_TO_STAGE_MAP[cleanUrl];

    const normalized = cleanUrl.replace(/-[23]\.jpg$/, ".jpg");
    if (URL_TO_STAGE_MAP[normalized]) return URL_TO_STAGE_MAP[normalized];
  }

  return null;
}
