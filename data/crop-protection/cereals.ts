import type { CropProtectionProfile } from "@/types/crop-protection";

export const CEREAL_PROFILES: CropProtectionProfile[] = [
  {
    slug: "paddy",
    name: "Paddy",
    nameHi: "धान",
    scientificName: "Oryza sativa",
    emoji: "🌾",
    groupId: "cereals",
    groupLabel: "अनाज",
    diseases: [
      {
        id: "blast",
        name: "Blast",
        scientificName: "Pyricularia oryzae",
        type: "disease",
        fracGroup: "FRAC 16.1 / 11+3",
        symptoms: [
          "Spindle/eye-shaped spots, grey centre + brown margin",
          "गर्दन/गाँठ पर काला पड़ना — neck blast सबसे बड़ा नुकसान",
        ],
        stages: [
          {
            stage: "early",
            label: "पहली धब्बा / उच्च जोखिम वाला मौसम",
            chemistry: "Tricyclazole 75% WP या Isoprothiolane 40% EC",
            dose: "120 g/acre (0.6 g/L) या 300 ml/acre",
          },
          {
            stage: "advanced",
            label: "Boot-to-heading / फैलता हुआ",
            chemistry: "Tricyclazole 45% + Hexaconazole 10% WG या Azoxystrobin + Difenoconazole SC",
            dose: "200 g/acre या 200 ml/acre — boot + 50% heading पर spray",
          },
        ],
        rotationNotes: "पूरे सीज़न सिर्फ Tricyclazole न चलाएँ — FRAC 11+3 से rotate करें। देर से nitrogen से बचें।",
      },
      {
        id: "sheath-blight",
        name: "Sheath Blight",
        scientificName: "Rhizoctonia solani",
        type: "disease",
        symptoms: ["पानी की रेखा के पास हरा-धूसर घाव", "साँप की त्वचा जैसा पैटर्न ऊपर चढ़ता है"],
        stages: [
          {
            stage: "early",
            label: "शुरुआत",
            chemistry: "Hexaconazole 5% SC/EC या Validamycin 3% L",
            dose: "400 ml/acre",
          },
          {
            stage: "advanced",
            label: "फैल रहा है",
            chemistry: "Azoxystrobin + Difenoconazole SC या Propiconazole 25% EC",
            dose: "200 ml/acre + पानी कम करें, spacing बढ़ाएँ",
          },
        ],
      },
      {
        id: "blb",
        name: "Bacterial Leaf Blight",
        scientificName: "Xanthomonas oryzae",
        type: "disease",
        symptoms: ["पत्ते के सिरे से नीचे पीला-खराब किनारा", "नर्सरी में kresek (मुरझाना)"],
        stages: [
          {
            stage: "early",
            label: "शुरुआत",
            chemistry: "Copper oxychloride 50% WP + Streptocycline",
            dose: "500 g/acre + 6 g/acre — N top-dressing रोक दें",
          },
          {
            stage: "advanced",
            label: "फैल रहा है",
            chemistry: "Copper + Streptocycline repeat",
            dose: "7 दिन interval — खेत खाली करें, curative नहीं है",
            notes: "अगले सीज़न resistant variety लगाएँ",
          },
        ],
      },
      {
        id: "brown-spot",
        name: "Brown Spot",
        scientificName: "Bipolaris oryzae",
        type: "disease",
        symptoms: ["पोटाश की कमी से जुड़ा stress disease"],
        stages: [
          { stage: "early", label: "शुरुआत", chemistry: "Mancozeb 75% WP", dose: "600 g/acre" },
          { stage: "advanced", label: "फैल रहा है", chemistry: "Propiconazole 25% EC", dose: "200 ml/acre" },
        ],
        extraNotes: ["पोटाश ठीक करें"],
      },
      {
        id: "false-smut",
        name: "False Smut",
        scientificName: "Ustilaginoidea virens",
        type: "disease",
        symptoms: ["दानों पर greenish-yellow spore balls"],
        stages: [
          {
            stage: "preventive",
            label: "बूटिंग पर (सिर्फ यही window)",
            chemistry: "Propiconazole 25% EC या Copper oxychloride",
            dose: "200 ml/acre या 500 g/acre at boot leaf",
            notes: "Smut ball बनने के बाद कोई इलाज नहीं",
          },
        ],
      },
    ],
    pests: [
      {
        id: "ysb",
        name: "Yellow Stem Borer",
        scientificName: "Scirpophaga incertulas",
        type: "pest",
        iracGroup: "IRAC 14 / 28",
        symptoms: ["Dead heart (vegetative) / white ear (reproductive)"],
        stages: [
          {
            stage: "early",
            label: "Dead hearts <5% या 30-35 DAT",
            chemistry: "Cartap hydrochloride 4G या Chlorantraniliprole 0.4% GR",
            dose: "8 kg/acre granular (खड़े पानी में)",
          },
          {
            stage: "advanced",
            label: "Moth flush / white ears",
            chemistry: "Chlorantraniliprole 18.5% SC या Flubendiamide 39.35% SC",
            dose: "60 ml/acre या 40 ml/acre — ETL पर spray, कैलेंडर पर नहीं",
          },
        ],
      },
      {
        id: "bph",
        name: "Brown Plant Hopper",
        scientificName: "Nilaparvata lugens",
        type: "pest",
        iracGroup: "IRAC 9B / 4A",
        symptoms: ["Hopper burn — गोल patch सूखे पौधे", "Base पर insects"],
        stages: [
          {
            stage: "early",
            label: "शुरुआत",
            chemistry: "Pymetrozine 50% WG या Buprofezin 25% SC",
            dose: "120 g/acre या 320 ml/acre — canopy खोलें, पानी निकालें",
          },
          {
            stage: "advanced",
            label: "Hopper burn फैल रहा",
            chemistry: "Dinotefuran 20% SG या Flonicamid 50% WG",
            dose: "60 g/acre — plant के base पर direct spray",
          },
        ],
        rotationNotes: "Synthetic pyrethroid और excess N से बचें — BPH बढ़ जाता है।",
      },
      {
        id: "leaf-folder",
        name: "Leaf Folder",
        scientificName: "Cnaphalocrocis medinalis",
        type: "pest",
        stages: [
          { stage: "early", label: "Need-based", chemistry: "Cartap 50% SP", dose: "200 g/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Flubendiamide 20% WG या Chlorantraniliprole 18.5% SC",
            dose: "50 g/acre या 60 ml/acre",
          },
        ],
      },
      {
        id: "rice-bug",
        name: "Gundhi Bug / Rice Bug",
        scientificName: "Leptocorisa",
        type: "pest",
        symptoms: ["दूध पकने पर दाने चूसना"],
        stages: [
          {
            stage: "advanced",
            label: "Heading stage",
            chemistry: "Malathion 50% EC या Deltamethrin 2.8% EC",
            dose: "400 ml/acre या 200 ml/acre",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "paddy-weeds",
        name: "Grassy, Sedge & Broadleaf Weeds",
        type: "weed",
        symptoms: ["Echinochloa (सावांक), Cyperus (मोठा), Ammania, Monochoria"],
        stages: [
          {
            stage: "preventive",
            label: "Pre-emergence (0-3 DAT)",
            chemistry: "Pretilachlor 50% EC या Pendimethalin 30% EC",
            dose: "600 ml/acre या 1 L/acre — पतला पानी film रखें",
          },
          {
            stage: "early",
            label: "Post-emergence (15-20 DAT)",
            chemistry: "Bispyribac-sodium 10% SC",
            dose: "100 ml/acre (grass+sedge+broadleaf)",
          },
        ],
        extraNotes: ["DSR: Pyrazosulfuron 10% WP @ 80-100 g/acre pre-emergence"],
      },
    ],
  },
  {
    slug: "wheat",
    name: "Wheat",
    nameHi: "गेहूँ",
    scientificName: "Triticum aestivum",
    emoji: "🌾",
    groupId: "cereals",
    groupLabel: "अनाज",
    diseases: [
      {
        id: "yellow-rust",
        name: "Yellow / Stripe Rust",
        scientificName: "Puccinia striiformis",
        type: "disease",
        fracGroup: "FRAC 3 / 11+3",
        symptoms: ["पीली powder pustules veins के साथ stripes में", "ठंड में फैलता है (Dec-Feb)"],
        stages: [
          {
            stage: "early",
            label: "पहली pustules",
            chemistry: "Propiconazole 25% EC या Tebuconazole 25.9% EC",
            dose: "200 ml/acre (0.1%)",
          },
          {
            stage: "advanced",
            label: "फैल रहा है",
            chemistry: "Azoxystrobin + Difenoconazole SC या Trifloxystrobin + Tebuconazole WG",
            dose: "200 ml/acre या 100 g/acre — 15 दिन बाद repeat अगर mausam favourable",
          },
        ],
        rotationNotes: "Resistant varieties: DBW-187, DBW-222, HD-3086. Tillering से scout करें।",
      },
      {
        id: "brown-rust",
        name: "Brown / Leaf Rust",
        scientificName: "Puccinia triticina",
        type: "disease",
        stages: [
          { stage: "early", label: "शुरुआत", chemistry: "Propiconazole / Tebuconazole", dose: "200 ml/acre" },
          {
            stage: "advanced",
            label: "फैल रहा है",
            chemistry: "Strobilurin + triazole combo",
            dose: "Label के हिसाब से",
          },
        ],
      },
      {
        id: "loose-smut",
        name: "Loose Smut",
        scientificName: "Ustilago tritici",
        type: "disease",
        stages: [
          {
            stage: "preventive",
            label: "सिर्फ बीज treatment",
            chemistry: "Carboxin + Thiram DS या Tebuconazole 2% DS",
            dose: "2.5-3 g/kg seed या 1-1.5 g/kg — foliar cure नहीं",
          },
        ],
      },
      {
        id: "karnal-bunt",
        name: "Karnal Bunt",
        scientificName: "Tilletia indica",
        type: "disease",
        stages: [
          {
            stage: "preventive",
            label: "Ear emergence पर",
            chemistry: "Propiconazole 25% EC",
            dose: "200 ml/acre boot-to-heading",
          },
        ],
      },
      {
        id: "powdery-mildew",
        name: "Powdery Mildew",
        scientificName: "Blumeria graminis",
        type: "disease",
        stages: [
          {
            stage: "early",
            label: "शुरुआत",
            chemistry: "Propiconazole / Tebuconazole",
            dose: "200 ml/acre",
          },
          {
            stage: "advanced",
            label: "फैल रहा है",
            chemistry: "Wettable sulphur 80% WG",
            dose: "500 g/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "aphids",
        name: "Aphids",
        type: "pest",
        iracGroup: "IRAC 4A",
        symptoms: ["Flag leaf/ear पर colonies", "BYDV vector"],
        stages: [
          {
            stage: "early",
            label: "कम colony",
            chemistry: "Ladybird encourage करें; spot spray Thiamethoxam 25% WG",
            dose: "40 g/acre",
          },
          {
            stage: "advanced",
            label: "Ear covered",
            chemistry: "Imidacloprid 17.8% SL या Dimethoate 30% EC",
            dose: "60 ml/acre या 300 ml/acre",
          },
        ],
      },
      {
        id: "termites",
        name: "Termites",
        scientificName: "Odontotermes",
        type: "pest",
        stages: [
          {
            stage: "preventive",
            label: "बुवाई पर",
            chemistry: "Chlorpyriphos 20% EC seed treatment",
            dose: "4 ml/kg seed",
          },
          {
            stage: "advanced",
            label: "Standing crop",
            chemistry: "Chlorpyriphos 20% EC",
            dose: "1 L/acre with irrigation",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "wheat-weeds",
        name: "Phalaris, Wild Oat, Broadleaf",
        type: "weed",
        symptoms: ["गुल्ली-डंडा, wild oat, bathua, senji — सबसे बड़ा yield loss factor"],
        stages: [
          {
            stage: "preventive",
            label: "Pre-emergence (0-3 DAS)",
            chemistry: "Pendimethalin 30% EC",
            dose: "1-1.3 L/acre",
          },
          {
            stage: "early",
            label: "Grassy POST (30-35 DAS)",
            chemistry: "Clodinafop 15% WP या Pinoxaden 5% EC",
            dose: "160 g/acre या 400 ml/acre",
          },
          {
            stage: "advanced",
            label: "Grass + broadleaf combo",
            chemistry: "Sulfosulfuron + Metsulfuron ready-mix या Mesosulfuron+Iodosulfuron",
            dose: "16 g/acre या 160 g/acre",
          },
        ],
        rotationNotes: "Phalaris minor Punjab/Haryana में isoproturon resistant — Clodinafop/Pinoxaden rotate करें।",
      },
    ],
  },
  {
    slug: "maize",
    name: "Maize",
    nameHi: "मक्का",
    scientificName: "Zea mays",
    emoji: "🌽",
    groupId: "cereals",
    groupLabel: "अनाज",
    diseases: [
      {
        id: "tlb",
        name: "Turcicum Leaf Blight",
        scientificName: "Exserohilum turcicum",
        type: "disease",
        symptoms: ["लंबी cigar-shaped grey-green lesions"],
        stages: [
          { stage: "early", label: "शुरुआत", chemistry: "Mancozeb 75% WP", dose: "600 g/acre" },
          {
            stage: "advanced",
            label: "फैल रहा है",
            chemistry: "Azoxystrobin + Difenoconazole SC",
            dose: "200 ml/acre",
          },
        ],
      },
      {
        id: "blsb",
        name: "Banded Leaf & Sheath Blight",
        scientificName: "Rhizoctonia solani",
        type: "disease",
        stages: [
          {
            stage: "advanced",
            label: "Lower sheaths",
            chemistry: "Validamycin 3% L या Hexaconazole 5% EC",
            dose: "400 ml/acre — lower sheath पर directed",
          },
        ],
      },
      {
        id: "downy-mildew",
        name: "Downy Mildew",
        scientificName: "Peronosclerospora",
        type: "disease",
        stages: [
          {
            stage: "preventive",
            label: "बीज उपचार",
            chemistry: "Metalaxyl 35% WS",
            dose: "6 g/kg seed",
          },
          {
            stage: "early",
            label: "Foliar",
            chemistry: "Metalaxyl + Mancozeb (Ridomil)",
            dose: "400 g/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "faw",
        name: "Fall Armyworm",
        scientificName: "Spodoptera frugiperda",
        type: "pest",
        iracGroup: "IRAC 5 → 6 → 28",
        symptoms: [
          "Whorl में ragged feeding + moist frass",
          "Inverted-Y head पर + last segment पर 4 dots",
        ],
        stages: [
          {
            stage: "early",
            label: "0-25% whorl damage, छोटे larvae",
            chemistry: "Azadirachtin 1500 ppm या Spinetoram 11.7% SC या Emamectin benzoate 5% SG",
            dose: "400 ml/acre या 100 ml/acre या 80 g/acre — whorl में direct",
          },
          {
            stage: "advanced",
            label: ">25% damage, बड़े larvae",
            chemistry: "Chlorantraniliprole 18.5% SC या Spinetoram",
            dose: "60 ml/acre या 100 ml/acre + poison bait (rice bran+jaggery+Thiodicarb)",
          },
        ],
        rotationNotes: "IRAC 5 → 6 → 28 cycle; सुबह/शाम whorl में spray।",
      },
      {
        id: "stem-borer",
        name: "Stem Borer",
        scientificName: "Chilo partellus",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "Dead heart",
            chemistry: "Cartap 4G या Chlorantraniliprole 0.4% GR in whorl",
            dose: "8 kg/acre",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "maize-weeds",
        name: "Grassy & Broadleaf Weeds",
        type: "weed",
        stages: [
          {
            stage: "preventive",
            label: "Pre-emergence (0-3 DAS)",
            chemistry: "Atrazine 50% WP",
            dose: "400-500 g/acre (pulse/veg intercrop में उपयोग न करें)",
          },
          {
            stage: "early",
            label: "Post-emergence (20-25 DAS)",
            chemistry: "Tembotrione 34.4% SC या Topramezone 33.6% SC",
            dose: "115 ml/acre + surfactant या 30 ml/acre",
          },
        ],
      },
    ],
  },
  {
    slug: "bajra",
    name: "Bajra",
    nameHi: "बाजरा",
    scientificName: "Pennisetum glaucum",
    emoji: "🌿",
    groupId: "cereals",
    groupLabel: "अनाज",
    diseases: [
      {
        id: "downy-mildew",
        name: "Downy Mildew / Green Ear",
        scientificName: "Sclerospora graminicola",
        type: "disease",
        symptoms: ["पत्तियाँ पीली, नीचे सफेद बलूत फफूंद", "बालियाँ हरी पत्ती जैसी संरचनाएँ बन जाती हैं"],
        stages: [
          {
            stage: "preventive",
            label: "प्राथमिक — बीज उपचार",
            chemistry: "Metalaxyl 35% WS",
            dose: "6 g/kg seed",
          },
          {
            stage: "early",
            label: "Foliar + rogue",
            chemistry: "Metalaxyl + Mancozeb",
            dose: "400 g/acre — infected plants उखाड़ दें",
          },
        ],
        extraNotes: ["Resistant hybrids: HHB-67 Improved. Green ear बनने के बाद cure नहीं।"],
      },
      {
        id: "ergot",
        name: "Ergot",
        scientificName: "Claviceps fusiformis",
        type: "disease",
        symptoms: ["Pink honeydew फिर काले sclerotia — toxic"],
        stages: [
          {
            stage: "preventive",
            label: "Flowering पर",
            chemistry: "Mancozeb या Ziram",
            dose: "600 g/acre boot & 50% flowering पर",
          },
        ],
      },
    ],
    pests: [
      {
        id: "shoot-fly",
        name: "Shoot Fly & Stem Borer",
        type: "pest",
        stages: [
          {
            stage: "preventive",
            label: "बुवाई पर",
            chemistry: "Imidacloprid 70% WS seed treatment",
            dose: "5 g/kg",
          },
          {
            stage: "early",
            label: "Whorl",
            chemistry: "Cartap 4G",
            dose: "Label dose whorl में",
          },
        ],
      },
      {
        id: "white-grub",
        name: "White Grub",
        scientificName: "Holotrichia",
        type: "pest",
        stages: [
          {
            stage: "preventive",
            label: "Soil pest",
            chemistry: "Chlorpyriphos 20% EC soil या Fipronil seed treatment",
            dose: "1 L/acre soil application",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "bajra-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          {
            stage: "preventive",
            label: "Pre-emergence",
            chemistry: "Atrazine 50% WP या Pendimethalin",
            dose: "200-300 g/acre (हल्की मिट्टी) या 1 L/acre",
          },
          {
            stage: "early",
            label: "Cultural",
            chemistry: "Hand weeding / hoeing",
            dose: "20 & 35 DAS पर — dryland में सबसे economical",
          },
        ],
      },
    ],
  },
];
