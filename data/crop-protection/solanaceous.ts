import type { CropProtectionProfile } from "@/types/crop-protection";

export const SOLANACEOUS_PROFILES: CropProtectionProfile[] = [
  {
    slug: "tomato",
    name: "Tomato",
    nameHi: "टमाटर",
    scientificName: "Solanum lycopersicum",
    emoji: "🍅",
    groupId: "solanaceous",
    groupLabel: "सोलनेसी",
    diseases: [
      {
        id: "late-blight",
        name: "Late Blight",
        scientificName: "Phytophthora infestans",
        type: "disease",
        fracGroup: "FRAC 4 → 40 → 21 → 27 + M3",
        continuousHarvest: true,
        symptoms: [
          "पानी से भीगे हरे-काले धब्बे, नीचे की ओर सफेद downy growth",
          "ठंड (10-22°C), बादल, नम मौसम में तेज़ी से फैलता है",
        ],
        stages: [
          {
            stage: "preventive",
            label: "STAGE 1 — Preventive (जोखिम वाला मौसम, 1-2 धब्बा)",
            chemistry: "Mancozeb 75% WP या Chlorothalonil 75% WP",
            dose: "500-600 g/acre (2-2.5 g/L) — हर 7-10 दिन जोखिम वाले मौसम में",
          },
          {
            stage: "early",
            label: "STAGE 2 — Early infection",
            chemistry: "Cymoxanil 8% + Mancozeb 64% WP या Metalaxyl-M + Mancozeb (Ridomil Gold)",
            dose: "600 g/acre या 500 g/acre (2.5 g/L)",
          },
          {
            stage: "advanced",
            label: "STAGE 3 — Advanced / severe",
            chemistry: "Dimethomorph + Mancozeb या Cyazofamid 34.5% SC या Famoxadone + Cymoxanil",
            dose: "400 g/acre + Mancozeb या 120-200 ml/acre combos — 5-7 दिन interval",
          },
        ],
        rotationNotes:
          "Metalaxyl/Mefenoxam (FRAC 4) दोहराएँ नहीं — हमेशा Mancozeb (FRAC M3) के साथ rotate करें।",
      },
      {
        id: "early-blight",
        name: "Early Blight",
        scientificName: "Alternaria solani",
        type: "disease",
        symptoms: ["Concentric-ring (target-board) brown spots on older leaves"],
        stages: [
          { stage: "early", label: "शुरुआत", chemistry: "Mancozeb 75% WP", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "फैल रहा है",
            chemistry: "Azoxystrobin 23% SC या Azoxystrobin + Difenoconazole",
            dose: "200 ml/acre",
          },
        ],
      },
      {
        id: "tolcv",
        name: "Tomato Leaf Curl Virus",
        type: "disease",
        symptoms: ["Whitefly-vectored — कोई chemical cure नहीं"],
        stages: [
          {
            stage: "early",
            label: "Vector control",
            chemistry: "Diafenthiuron 50% WP या Pyriproxyfen",
            dose: "240 g/acre — सहनशील hybrid, 40-50 mesh nursery net, संक्रमित पौधे हटाएँ",
          },
        ],
      },
      {
        id: "ber",
        name: "Blossom-End Rot (BER)",
        type: "disease",
        symptoms: ["Calcium disorder — fungicide से ठीक नहीं होता"],
        stages: [
          {
            stage: "early",
            label: "Correction",
            chemistry: "Calcium nitrate foliar",
            dose: "4-5 g/L + नियमित सिंचाई — ऐप में disease न दिखाएँ",
          },
        ],
      },
    ],
    pests: [
      {
        id: "fruit-borer",
        name: "Fruit Borer",
        scientificName: "Helicoverpa armigera",
        type: "pest",
        continuousHarvest: true,
        stages: [
          {
            stage: "early",
            label: "छोटे larvae",
            chemistry: "Bt @ 400 g/acre या Azadirachtin 1500 ppm + pheromone traps",
            dose: "400 ml/acre",
          },
          {
            stage: "advanced",
            label: "बड़े larvae",
            chemistry: "Chlorantraniliprole 18.5% SC या Emamectin benzoate 5% SG",
            dose: "60 ml/acre या 88 g/acre — low PHI, rotate",
          },
        ],
      },
      {
        id: "leaf-miner",
        name: "Leaf Miner",
        scientificName: "Liriomyza",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "Serpentine mines",
            chemistry: "Cyantraniliprole 10.26% OD या Abamectin 1.9% EC",
            dose: "360 ml/acre या 150 ml/acre",
          },
        ],
      },
      {
        id: "tuta",
        name: "Pinworm / Tuta absoluta",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "Pheromone traps + Bt",
            chemistry: "Mass trapping + Bt/Azadirachtin",
            dose: "Label dose",
          },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Cyantraniliprole या Chlorantraniliprole या Spinetoram",
            dose: "360 ml/acre या 60 ml/acre या 100 ml/acre",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "tomato-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          {
            stage: "preventive",
            label: "Pre-transplant",
            chemistry: "Pendimethalin 30% EC",
            dose: "1 L/acre before transplanting",
          },
          {
            stage: "early",
            label: "Best practice",
            chemistry: "Black plastic mulch + 1 hand weeding",
            dose: "Blast soil splash भी कम होता है",
          },
        ],
      },
    ],
  },
  {
    slug: "potato",
    name: "Potato",
    nameHi: "आलू",
    scientificName: "Solanum tuberosum",
    emoji: "🥔",
    groupId: "solanaceous",
    groupLabel: "सोलनेसी",
    diseases: [
      {
        id: "late-blight",
        name: "Late Blight",
        scientificName: "Phytophthora infestans",
        type: "disease",
        fracGroup: "FRAC 4 → 40 → 21",
        symptoms: ["Water-soaked lesions, white sporulation, cool humid weather — tuber rot"],
        stages: [
          {
            stage: "preventive",
            label: "STAGE 1 — Preventive (canopy cover / forecast risk)",
            chemistry: "Mancozeb 75% WP या Chlorothalonil",
            dose: "600 g/acre या 500 g/acre — 7-10 दिन schedule",
          },
          {
            stage: "early",
            label: "STAGE 2 — First appearance",
            chemistry: "Cymoxanil + Mancozeb या Metalaxyl-M + Mancozeb (Ridomil Gold)",
            dose: "600 g/acre या 500 g/acre",
          },
          {
            stage: "advanced",
            label: "STAGE 3 — Epidemic weather",
            chemistry: "Dimethomorph + Mancozeb या Cyazofamid 34.5% SC या Fluopicolide+Propamocarb",
            dose: "400 g/acre + Mancozeb या 120 ml/acre — earth-up, गंभीर हो तो dehaulm",
          },
        ],
        rotationNotes: "FRAC groups rotate; tuber protect के लिए earth-up।",
      },
      {
        id: "early-blight",
        name: "Early Blight",
        scientificName: "Alternaria solani",
        type: "disease",
        stages: [
          { stage: "early", label: "शुरुआत", chemistry: "Mancozeb", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "फैल रहा है",
            chemistry: "Azoxystrobin / Difenoconazole",
            dose: "200 ml/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "aphids",
        name: "Aphids",
        scientificName: "Myzus persicae",
        type: "pest",
        symptoms: ["PLRV, PVY vector — seed crop में critical"],
        stages: [
          {
            stage: "early",
            label: "शुरुआत",
            chemistry: "Imidacloprid 17.8% SL या Thiamethoxam 25% WG",
            dose: "60 ml/acre या 40 g/acre",
          },
          {
            stage: "advanced",
            label: "Seed crop threshold",
            chemistry: "Rogue + haulm cutting at 20 aphids/100 leaflets",
            dose: "Acetamiprid/Flonicamid rotation",
          },
        ],
      },
      {
        id: "tuber-moth",
        name: "Potato Tuber Moth",
        scientificName: "Phthorimaea operculella",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "Field",
            chemistry: "Proper earthing-up + Chlorantraniliprole/Spinosad",
            dose: "Exposed tubers मत रखें",
          },
          {
            stage: "advanced",
            label: "Storage",
            chemistry: "Neem/lantana leaf layering, pheromone traps",
            dose: "Exposed storage मत करें",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "potato-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          {
            stage: "preventive",
            label: "Pre-emergence",
            chemistry: "Metribuzin 70% WP या Pendimethalin 30% EC",
            dose: "300 g/acre या 1 L/acre after planting",
          },
          {
            stage: "early",
            label: "Cultural",
            chemistry: "Earthing-up at 25-30 DAS",
            dose: "Weed control + tuber protection दोनों",
          },
        ],
      },
    ],
  },
  {
    slug: "brinjal",
    name: "Brinjal",
    nameHi: "बैंगन",
    scientificName: "Solanum melongena",
    emoji: "🍆",
    groupId: "solanaceous",
    groupLabel: "सोलनेसी",
    diseases: [
      {
        id: "phomopsis",
        name: "Phomopsis Blight & Fruit Rot",
        scientificName: "Phomopsis vexans",
        type: "disease",
        stages: [
          {
            stage: "preventive",
            label: "Seed treatment",
            chemistry: "Thiram/Carbendazim",
            dose: "2-3 g/kg seed",
          },
          { stage: "early", label: "Foliar", chemistry: "Mancozeb", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "Fruit rot",
            chemistry: "Carbendazim 50% WP या Azoxystrobin + Difenoconazole",
            dose: "200 g/acre या 200 ml/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "bsfb",
        name: "Brinjal Shoot & Fruit Borer",
        scientificName: "Leucinodes orbonalis",
        type: "pest",
        continuousHarvest: true,
        symptoms: ["#1 pest — wilting shoots, bore holes in fruit"],
        stages: [
          {
            stage: "early",
            label: "IPM-first",
            chemistry: "Clip & destroy bored shoots weekly + pheromone traps + Bt/Azadirachtin",
            dose: "सबसे effective step — weekly",
          },
          {
            stage: "advanced",
            label: "Escalation",
            chemistry: "Emamectin benzoate → Chlorantraniliprole → Flubendiamide",
            dose: "88 g/acre → 60 ml/acre → 40 ml/acre — strict rotation + PHI",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "brinjal-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          {
            stage: "preventive",
            label: "Pre-transplant",
            chemistry: "Pendimethalin 30% EC",
            dose: "1 L/acre + mulch + hand weeding",
          },
        ],
      },
    ],
  },
  {
    slug: "chilli",
    name: "Chilli",
    nameHi: "मिर्च",
    scientificName: "Capsicum annuum",
    emoji: "🌶️",
    groupId: "solanaceous",
    groupLabel: "सोलनेसी",
    diseases: [
      {
        id: "anthracnose",
        name: "Anthracnose / Die-back & Fruit Rot",
        scientificName: "Colletotrichum",
        type: "disease",
        continuousHarvest: true,
        symptoms: ["Twig die-back, sunken circular fruit lesions"],
        stages: [
          { stage: "early", label: "Flowering / first symptoms", chemistry: "Mancozeb + prune dead twigs", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "Fruit development",
            chemistry: "Azoxystrobin + Difenoconazole या Difenoconazole 25% EC",
            dose: "200 ml/acre — repeat at fruit stage",
          },
        ],
      },
      {
        id: "leaf-curl-complex",
        name: "Leaf Curl Complex (Murda/Chur-chura)",
        type: "disease",
        symptoms: ["Thrips + mites + virus together — viral part = no cure"],
        stages: [
          {
            stage: "early",
            label: "Vector complex",
            chemistry: "Fipronil 5% SC या Spinosad 45% SC",
            dose: "400 ml/acre या 60 ml/acre",
          },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Spinetoram या Cyantraniliprole + blue sticky traps",
            dose: "100 ml/acre या 360 ml/acre",
          },
        ],
      },
    ],
    pests: [
      {
        id: "thrips",
        name: "Thrips",
        scientificName: "Scirtothrips dorsalis",
        type: "pest",
        continuousHarvest: true,
        stages: [
          { stage: "early", label: "शुरुआत", chemistry: "Fipronil या Spinosad", dose: "400 ml/acre या 60 ml/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Spinetoram या Cyantraniliprole",
            dose: "100 ml/acre या 360 ml/acre",
          },
        ],
      },
      {
        id: "mites",
        name: "Yellow / Broad Mite",
        type: "pest",
        stages: [
          {
            stage: "early",
            label: "Bronze underside",
            chemistry: "Spiromesifen 22.9% SC या Abamectin 1.9% EC",
            dose: "200 ml/acre या 150 ml/acre",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "chilli-weeds",
        name: "Weed Management",
        type: "weed",
        stages: [
          {
            stage: "preventive",
            label: "Pre-transplant",
            chemistry: "Pendimethalin 30% EC",
            dose: "1 L/acre + mulch",
          },
        ],
      },
    ],
  },
];
