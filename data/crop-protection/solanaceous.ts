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
          "Water-soaked greenish-black patches, underside par white downy growth",
          "Thand (10-22°C), cloudy, humid mausam mein tezi se failta hai",
        ],
        stages: [
          {
            stage: "preventive",
            label: "STAGE 1 — Preventive (mausam risky, 1-2 spot)",
            chemistry: "Mancozeb 75% WP ya Chlorothalonil 75% WP",
            dose: "500-600 g/acre (2-2.5 g/L) — har 7-10 din risk weather mein",
          },
          {
            stage: "early",
            label: "STAGE 2 — Early infection",
            chemistry: "Cymoxanil 8% + Mancozeb 64% WP ya Metalaxyl-M + Mancozeb (Ridomil Gold)",
            dose: "600 g/acre ya 500 g/acre (2.5 g/L)",
          },
          {
            stage: "advanced",
            label: "STAGE 3 — Advanced / severe",
            chemistry: "Dimethomorph + Mancozeb ya Cyazofamid 34.5% SC ya Famoxadone + Cymoxanil",
            dose: "400 g/acre + Mancozeb ya 120-200 ml/acre combos — 5-7 din interval",
          },
        ],
        rotationNotes:
          "Metalaxyl/Mefenoxam (FRAC 4) repeat mat karo — hamesha Mancozeb (FRAC M3) ke saath rotate karein.",
      },
      {
        id: "early-blight",
        name: "Early Blight",
        scientificName: "Alternaria solani",
        type: "disease",
        symptoms: ["Concentric-ring (target-board) brown spots on older leaves"],
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Mancozeb 75% WP", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "Fail raha hai",
            chemistry: "Azoxystrobin 23% SC ya Azoxystrobin + Difenoconazole",
            dose: "200 ml/acre",
          },
        ],
      },
      {
        id: "tolcv",
        name: "Tomato Leaf Curl Virus",
        type: "disease",
        symptoms: ["Whitefly-vectored — koi chemical cure nahi"],
        stages: [
          {
            stage: "early",
            label: "Vector control",
            chemistry: "Diafenthiuron 50% WP ya Pyriproxyfen",
            dose: "240 g/acre — tolerant hybrid, 40-50 mesh nursery net, rogue plants",
          },
        ],
      },
      {
        id: "ber",
        name: "Blossom-End Rot (BER)",
        type: "disease",
        symptoms: ["Calcium disorder — fungicide se theek nahi hota"],
        stages: [
          {
            stage: "early",
            label: "Correction",
            chemistry: "Calcium nitrate foliar",
            dose: "4-5 g/L + regular irrigation — app mein disease mat dikhayein",
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
            label: "Chhote larvae",
            chemistry: "Bt @ 400 g/acre ya Azadirachtin 1500 ppm + pheromone traps",
            dose: "400 ml/acre",
          },
          {
            stage: "advanced",
            label: "Bade larvae",
            chemistry: "Chlorantraniliprole 18.5% SC ya Emamectin benzoate 5% SG",
            dose: "60 ml/acre ya 88 g/acre — low PHI, rotate",
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
            chemistry: "Cyantraniliprole 10.26% OD ya Abamectin 1.9% EC",
            dose: "360 ml/acre ya 150 ml/acre",
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
            chemistry: "Cyantraniliprole ya Chlorantraniliprole ya Spinetoram",
            dose: "360 ml/acre ya 60 ml/acre ya 100 ml/acre",
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
            dose: "Blast soil splash bhi kam hota hai",
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
            chemistry: "Mancozeb 75% WP ya Chlorothalonil",
            dose: "600 g/acre ya 500 g/acre — 7-10 din schedule",
          },
          {
            stage: "early",
            label: "STAGE 2 — First appearance",
            chemistry: "Cymoxanil + Mancozeb ya Metalaxyl-M + Mancozeb (Ridomil Gold)",
            dose: "600 g/acre ya 500 g/acre",
          },
          {
            stage: "advanced",
            label: "STAGE 3 — Epidemic weather",
            chemistry: "Dimethomorph + Mancozeb ya Cyazofamid 34.5% SC ya Fluopicolide+Propamocarb",
            dose: "400 g/acre + Mancozeb ya 120 ml/acre — earth-up, severe ho to dehaulm",
          },
        ],
        rotationNotes: "FRAC groups rotate; tuber protect ke liye earth-up.",
      },
      {
        id: "early-blight",
        name: "Early Blight",
        scientificName: "Alternaria solani",
        type: "disease",
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Mancozeb", dose: "500 g/acre" },
          {
            stage: "advanced",
            label: "Fail raha hai",
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
        symptoms: ["PLRV, PVY vector — seed crop mein critical"],
        stages: [
          {
            stage: "early",
            label: "Shuruat",
            chemistry: "Imidacloprid 17.8% SL ya Thiamethoxam 25% WG",
            dose: "60 ml/acre ya 40 g/acre",
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
            dose: "Exposed tubers mat rakhein",
          },
          {
            stage: "advanced",
            label: "Storage",
            chemistry: "Neem/lantana leaf layering, pheromone traps",
            dose: "Exposed storage mat karein",
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
            chemistry: "Metribuzin 70% WP ya Pendimethalin 30% EC",
            dose: "300 g/acre ya 1 L/acre after planting",
          },
          {
            stage: "early",
            label: "Cultural",
            chemistry: "Earthing-up at 25-30 DAS",
            dose: "Weed control + tuber protection dono",
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
            chemistry: "Carbendazim 50% WP ya Azoxystrobin + Difenoconazole",
            dose: "200 g/acre ya 200 ml/acre",
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
            dose: "Sabse effective step — weekly",
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
            chemistry: "Azoxystrobin + Difenoconazole ya Difenoconazole 25% EC",
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
            chemistry: "Fipronil 5% SC ya Spinosad 45% SC",
            dose: "400 ml/acre ya 60 ml/acre",
          },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Spinetoram ya Cyantraniliprole + blue sticky traps",
            dose: "100 ml/acre ya 360 ml/acre",
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
          { stage: "early", label: "Shuruat", chemistry: "Fipronil ya Spinosad", dose: "400 ml/acre ya 60 ml/acre" },
          {
            stage: "advanced",
            label: "Heavy",
            chemistry: "Spinetoram ya Cyantraniliprole",
            dose: "100 ml/acre ya 360 ml/acre",
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
            chemistry: "Spiromesifen 22.9% SC ya Abamectin 1.9% EC",
            dose: "200 ml/acre ya 150 ml/acre",
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
