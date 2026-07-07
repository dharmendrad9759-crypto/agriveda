import type { CropProtectionProfile } from "@/types/crop-protection";

export const OTHER_PROFILES: CropProtectionProfile[] = [
  {
    slug: "soybean",
    name: "Soybean",
    nameHi: "सोयाबीन",
    scientificName: "Glycine max",
    emoji: "🫘",
    groupId: "oilseeds",
    groupLabel: "तिलहन",
    diseases: [
      {
        id: "ymv",
        name: "Yellow Mosaic Virus",
        type: "disease",
        symptoms: ["Bright yellow mosaic — viral, no chemical cure"],
        stages: [
          {
            stage: "early",
            label: "Vector + hygiene",
            chemistry: "Rogue plants + Thiamethoxam 25% WG → Diafenthiuron/Pyriproxyfen",
            dose: "40 g/acre early — YMV-tolerant varieties (JS-2069), yellow sticky traps",
          },
        ],
      },
      {
        id: "rust",
        name: "Rust",
        scientificName: "Phakopsora pachyrhizi",
        type: "disease",
        stages: [
          { stage: "early", label: "First pustules", chemistry: "Hexaconazole 5% EC", dose: "400 ml/acre" },
          {
            stage: "advanced",
            label: "Defoliation risk",
            chemistry: "Azoxystrobin + Difenoconazole",
            dose: "200 ml/acre — 15 din baad repeat",
          },
        ],
      },
    ],
    pests: [
      {
        id: "girdle-beetle",
        name: "Girdle Beetle",
        scientificName: "Obereopsis brevis",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "First girdling",
            chemistry: "Thiamethoxam 25% WG ya Triazophos 40% EC",
            dose: "40 g/acre ya 320 ml/acre",
          },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Chlorantraniliprole/Thiamethoxam — girdled parts clip & destroy",
            dose: "Label dose",
          },
        ],
      },
      {
        id: "defoliators",
        name: "Semilooper / Spodoptera / BHC",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "Small larvae",
            chemistry: "Azadirachtin 1500 ppm ya Emamectin benzoate 5% SG",
            dose: "400 ml/acre ya 80-90 g/acre (IRAC 6)",
          },
          {
            stage: "advanced",
            label: "Heavy defoliation",
            chemistry: "Chlorantraniliprole 18.5% SC ya Spinetoram ya Indoxacarb",
            dose: "60 ml/acre ya 100 ml/acre ya 200 ml/acre + pheromone traps",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "soybean-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          {
            stage: "preventive",
            label: "Pre-emergence",
            chemistry: "Pendimethalin ya Diclosulam 84% WDG",
            dose: "1 L/acre ya 12.4 g/acre",
          },
          {
            stage: "early",
            label: "Post-emergence",
            chemistry: "Imazethapyr + Imazamox ready-mix",
            dose: "400 ml/acre grasses+broadleaf+sedge",
          },
        ],
      },
    ],
  },
  {
    slug: "moongfali",
    name: "Groundnut",
    nameHi: "मूंगफली",
    scientificName: "Arachis hypogaea",
    emoji: "🥜",
    groupId: "oilseeds",
    groupLabel: "तिलहन",
    diseases: [
      {
        id: "tikka",
        name: "Tikka Leaf Spot (Early & Late)",
        type: "disease",
        symptoms: ["Brown spots yellow halo (early); darker rough underside (late)"],
        stages: [
          { stage: "early", label: "30-40 DAS", chemistry: "Mancozeb ya Chlorothalonil", dose: "600 g/acre ya 500 g/acre" },
          {
            stage: "advanced",
            label: "Spreading + rust",
            chemistry: "Hexaconazole ya Tebuconazole+Trifloxystrobin ya Azoxystrobin+Difenoconazole",
            dose: "400 ml/acre ya 100 g/acre ya 200 ml/acre — 2-3 sprays 15 din",
          },
        ],
      },
    ],
    pests: [
      {
        id: "leaf-miner",
        name: "Leaf Miner",
        scientificName: "Aproaerema modicella",
        type: "pest",
        stages: [
          { stage: "early", label: "Mines", chemistry: "Quinalphos 25% EC ya Dimethoate", dose: "400 ml/acre ya 300 ml/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Chlorantraniliprole ya Emamectin",
            dose: "60 ml/acre ya 80 g/acre",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "groundnut-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          { stage: "preventive", label: "Pre-emergence", chemistry: "Pendimethalin", dose: "1 L/acre" },
          {
            stage: "early",
            label: "Critical pegging (40-60 DAS)",
            chemistry: "Weed-free rakhein — soil disturb mat karein after pegging",
            dose: "Imazethapyr POST if needed @ 300 ml/acre",
          },
        ],
      },
    ],
  },
  {
    slug: "cotton",
    name: "Cotton",
    nameHi: "कपास",
    scientificName: "Gossypium hirsutum",
    emoji: "🌸",
    groupId: "cash",
    groupLabel: "नकदी फसल",
    diseases: [
      {
        id: "clcuv",
        name: "Cotton Leaf Curl Virus",
        type: "disease",
        symptoms: ["Leaf curling, vein thickening, enations — whitefly vectored, no cure"],
        stages: [
          {
            stage: "early",
            label: "Whitefly + hygiene",
            chemistry: "Resistant Bt hybrids, rogue plants, reflective mulch, border crop",
            dose: "Diafenthiuron/Flonicamid for whitefly — see pests",
          },
        ],
      },
      {
        id: "bacterial-blight",
        name: "Bacterial Blight",
        scientificName: "Xanthomonas",
        type: "disease",
        stages: [
          {
            stage: "early",
            label: "Foliar",
            chemistry: "Copper oxychloride 50% WP + Streptocycline",
            dose: "500 g/acre + 6 g/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "pink-bollworm",
        name: "Pink Bollworm",
        scientificName: "Pectinophora gossypiella",
        type: "pest",
        symptoms: ["Rosetted flowers, boll holes, stained lint"],
        stages: [
          {
            stage: "early",
            label: "Pheromone traps / first flowers",
            chemistry: "Pheromone traps 8/acre + Profenophos 50% EC ya Thiodicarb at squaring",
            dose: "400 ml/acre ya 400 g/acre",
          },
          {
            stage: "advanced",
            label: "Boll formation",
            chemistry: "Rotate: Chlorantraniliprole → Emamectin → Spinosad",
            dose: "60 ml/acre → 88 g/acre → 60 ml/acre — destroy rosette flowers",
          },
        ],
        rotationNotes: "Bt refuge rows, timely crop termination, pyrethroid se bachna (whitefly flare).",
      },
      {
        id: "whitefly",
        name: "Whitefly",
        scientificName: "Bemisia tabaci",
        type: "pest",
        iracGroup: "IRAC 12A / 7C",
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Diafenthiuron 50% WP ya Flonicamid 50% WG", dose: "240 g/acre ya 60 g/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Pyriproxyfen 10% EC ya Spiromesifen 22.9% SC",
            dose: "200 ml/acre ya 200 ml/acre",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "cotton-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          { stage: "preventive", label: "Pre-emergence", chemistry: "Pendimethalin ya Diuron", dose: "1.3 L/acre ya 400 g/acre" },
          {
            stage: "early",
            label: "Post-directed",
            chemistry: "Quizalofop (grass) + Pyrithiobac (broadleaf) — hooded Glyphosate in RR-Flex rows only",
            dose: "400 ml/acre + 250 ml/acre",
          },
        ],
      },
    ],
  },
  {
    slug: "bhindi",
    name: "Bhindi",
    nameHi: "भिंडी",
    scientificName: "Abelmoschus esculentus",
    emoji: "🫛",
    groupId: "cucurbits",
    groupLabel: "भिंडी",
    diseases: [
      {
        id: "yvmv",
        name: "Yellow Vein Mosaic Virus",
        type: "disease",
        symptoms: ["Yellow vein network → poor fruit — whitefly vectored"],
        stages: [
          {
            stage: "early",
            label: "Resistant variety + vector",
            chemistry: "Arka Anamika, Kashi Kranti + whitefly control + rogue + yellow traps",
            dose: "See whitefly pest entry",
          },
        ],
      },
      {
        id: "powdery-mildew",
        name: "Powdery Mildew",
        type: "disease",
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Wettable sulphur 80% WG", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Hexaconazole ya Azoxystrobin",
            dose: "400 ml/acre ya 200 ml/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "whitefly",
        name: "Whitefly (YVMV vector)",
        type: "pest",
        continuousHarvest: true,
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Thiamethoxam 25% WG ya Acetamiprid", dose: "40 g/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Diafenthiuron ya Pyriproxyfen ya Spiromesifen",
            dose: "240 g/acre ya 200 ml/acre ya 200 ml/acre",
          },
        ],
      },
      {
        id: "shoot-fruit-borer",
        name: "Shoot & Fruit Borer",
        scientificName: "Earias vittella",
        type: "pest",
        continuousHarvest: true,
        symptoms: ["Drooping bored shoots → fruit holes with frass"],
        stages: [
          {
            stage: "early",
            label: "IPM",
            chemistry: "Clip bored shoots + pheromone traps + Bt/Azadirachtin",
            dose: "Weekly clipping sabse important",
          },
          {
            stage: "advanced",
            label: "Escalation",
            chemistry: "Emamectin → Chlorantraniliprole → Flubendiamide",
            dose: "88 → 60 → 40 ml/acre — short PHI, harvest har 2-3 din",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "bhindi-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          { stage: "preventive", label: "Pre-emergence", chemistry: "Pendimethalin 30% EC", dose: "1 L/acre" },
          {
            stage: "early",
            label: "First 40-45 days",
            chemistry: "Quizalofop for grasses + 1-2 hand weedings",
            dose: "400 ml/acre",
          },
        ],
      },
    ],
  },
  {
    slug: "cucumber",
    name: "Cucumber",
    nameHi: "खीरा",
    scientificName: "Cucumis sativus",
    emoji: "🥒",
    groupId: "cucurbits",
    groupLabel: "ककड़ी परिवार",
    diseases: [
      {
        id: "downy-mildew",
        name: "Downy Mildew",
        scientificName: "Pseudoperonospora cubensis",
        type: "disease",
        symptoms: ["Angular yellow patches bounded by veins, purplish downy underside"],
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Mancozeb ya Chlorothalonil", dose: "500 g/acre ya 400 g/acre" },
          {
            stage: "advanced",
            label: "Humid spread",
            chemistry: "Metalaxyl-M+Mancozeb ya Dimethomorph ya Cymoxanil+Mancozeb",
            dose: "500 g/acre ya 400 g/acre ya 600 g/acre",
          },
        ],
      },
      {
        id: "powdery-mildew",
        name: "Powdery Mildew",
        type: "disease",
        stages: [
          {
            stage: "early",
            label: "Shuruat",
            chemistry: "Wettable sulphur 80% WG",
            dose: "500 g/acre (melon par garm din sulphur se bachna)",
          },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Azoxystrobin ya Hexaconazole ya Myclobutanil",
            dose: "200 ml/acre ya 400 ml/acre ya 160 g/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "fruit-fly",
        name: "Fruit Fly",
        scientificName: "Bactrocera cucurbitae",
        type: "pest",
        symptoms: ["#1 fruit pest — rotting/dropping fruits"],
        stages: [
          {
            stage: "early",
            label: "Traps + baits (primary)",
            chemistry: "Cue-lure pheromone traps 8-10/acre + poison bait (jaggery+Malathion spots)",
            dose: "Spray alone fail hota hai — fallen fruits daily collect karein",
          },
          {
            stage: "advanced",
            label: "Supplement",
            chemistry: "Spinosad 45% SC bait spray + fruit bagging high-value crops",
            dose: "60 ml/acre",
          },
        ],
      },
      {
        id: "red-pumpkin-beetle",
        name: "Red Pumpkin Beetle",
        scientificName: "Aulacophora foveicollis",
        type: "pest",
        symptoms: ["Cotyledon stage par seedlings kha jata hai"],
        stages: [
          {
            stage: "early",
            label: "Cotyledon — most vulnerable",
            chemistry: "Carbaryl 50% WP ya Malathion 50% EC",
            dose: "600 g/acre ya 400 ml/acre; subah ash dust low-cost option",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "cucumber-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          { stage: "preventive", label: "Pre-emergence", chemistry: "Pendimethalin 30% EC", dose: "1 L/acre" },
          {
            stage: "early",
            label: "Best practice",
            chemistry: "Plastic mulch on bed + trellising",
            dose: "Fruit fly + fruit rot bhi kam hota hai",
          },
        ],
      },
    ],
  },
  {
    slug: "mustard",
    name: "Mustard",
    nameHi: "सरसों",
    scientificName: "Brassica juncea",
    emoji: "🌼",
    groupId: "oilseeds",
    groupLabel: "तिलहन",
    diseases: [
      {
        id: "white-rust",
        name: "White Rust",
        scientificName: "Albugo candida",
        type: "disease",
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Mancozeb 75% WP", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Metalaxyl-M + Mancozeb",
            dose: "500 g/acre",
          },
        ],
      },
      {
        id: "alternaria",
        name: "Alternaria Leaf Spot",
        type: "disease",
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Mancozeb", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "Fail raha hai",
            chemistry: "Azoxystrobin + Difenoconazole",
            dose: "200 ml/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "aphids",
        name: "Aphids",
        type: "pest",
        stages: [
          { stage: "early", label: "Colonies", chemistry: "Thiamethoxam 25% WG ya Dimethoate", dose: "40 g/acre ya 300 ml/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Imidacloprid 17.8% SL ya Acetamiprid",
            dose: "60 ml/acre ya 40 g/acre",
          },
        ],
      },
      {
        id: "dbm",
        name: "Diamondback Moth",
        scientificName: "Plutella xylostella",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "Small larvae",
            chemistry: "Bt @ 400 g/acre ya Spinosad 45% SC",
            dose: "400 g/acre ya 60 ml/acre + sticker",
          },
          {
            stage: "advanced",
            label: "Resistance-prone",
            chemistry: "Spinetoram ya Chlorantraniliprole ya Emamectin",
            dose: "100 ml/acre ya 60 ml/acre ya 88 g/acre — strict rotation",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "mustard-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          { stage: "preventive", label: "Pre-emergence", chemistry: "Pendimethalin 30% EC", dose: "1 L/acre" },
          { stage: "early", label: "Cultural", chemistry: "1-2 hand weedings", dose: "20 & 40 DAS" },
        ],
      },
    ],
  },
  {
    slug: "cauliflower",
    name: "Cauliflower",
    nameHi: "फूल गोभी",
    scientificName: "Brassica oleracea var. botrytis",
    emoji: "🥦",
    groupId: "cole",
    groupLabel: "गोभी",
    diseases: [
      {
        id: "downy-mildew",
        name: "Downy Mildew",
        type: "disease",
        stages: [
          { stage: "early", label: "Shuruat + sticker", chemistry: "Mancozeb 75% WP", dose: "500 g/acre + 0.5 ml/L sticker" },
          {
            stage: "advanced",
            label: "Curd par bhi",
            chemistry: "Metalaxyl-M+Mancozeb ya Dimethomorph",
            dose: "500 g/acre ya 400 g/acre",
          },
        ],
      },
      {
        id: "black-rot",
        name: "Black Rot",
        scientificName: "Xanthomonas campestris",
        type: "disease",
        symptoms: ["V-shaped yellow lesions, blackened veins"],
        stages: [
          {
            stage: "preventive",
            label: "Seed treatment",
            chemistry: "Hot-water seed 50°C/30 min + Streptocycline soak",
            dose: "Foliar: Copper + Streptocycline @ 500 g + 6 g/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "dbm",
        name: "Diamondback Moth",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "Biologicals first",
            chemistry: "Bt @ 400 g/acre ya Spinosad",
            dose: "400 g/acre ya 60 ml/acre",
          },
          {
            stage: "advanced",
            label: "Escalation",
            chemistry: "Spinetoram ya Chlorantraniliprole ya Emamectin + sticker",
            dose: "100/60/88 — DBM sab kuch resist kar leta hai",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "cauliflower-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          { stage: "preventive", label: "Pre-transplant", chemistry: "Pendimethalin", dose: "1 L/acre + hand weeding/mulch" },
        ],
      },
    ],
  },
  {
    slug: "onion",
    name: "Onion",
    nameHi: "प्याज",
    scientificName: "Allium cepa",
    emoji: "🧅",
    groupId: "cole",
    groupLabel: "प्याज",
    diseases: [
      {
        id: "purple-blotch",
        name: "Purple Blotch",
        scientificName: "Alternaria porri",
        type: "disease",
        symptoms: ["#1 onion disease"],
        stages: [
          { stage: "early", label: "Shuruat + sticker mandatory", chemistry: "Mancozeb", dose: "500 g/acre + sticker" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Azoxystrobin + Difenoconazole",
            dose: "200 ml/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "thrips",
        name: "Thrips",
        type: "pest",
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Fipronil 5% SC ya Spinosad", dose: "400 ml/acre ya 60 ml/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Spinetoram ya Cyantraniliprole",
            dose: "100 ml/acre ya 360 ml/acre",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "onion-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          { stage: "preventive", label: "Pre-emergence", chemistry: "Pendimethalin", dose: "1 L/acre" },
        ],
      },
    ],
  },
];
