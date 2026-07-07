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
          "Gardan/node par kaala padna — neck blast sabse bada nuksan",
        ],
        stages: [
          {
            stage: "early",
            label: "Pehli spot / high-risk mausam",
            chemistry: "Tricyclazole 75% WP ya Isoprothiolane 40% EC",
            dose: "120 g/acre (0.6 g/L) ya 300 ml/acre",
          },
          {
            stage: "advanced",
            label: "Boot-to-heading / failta hua",
            chemistry: "Tricyclazole 45% + Hexaconazole 10% WG ya Azoxystrobin + Difenoconazole SC",
            dose: "200 g/acre ya 200 ml/acre — boot + 50% heading par spray",
          },
        ],
        rotationNotes: "Poori season sirf Tricyclazole mat chalao — FRAC 11+3 se rotate karein. Late nitrogen se bachna.",
      },
      {
        id: "sheath-blight",
        name: "Sheath Blight",
        scientificName: "Rhizoctonia solani",
        type: "disease",
        symptoms: ["Paani ki line ke paas greenish-grey lesions", "Snake-skin pattern upar chadhta hai"],
        stages: [
          {
            stage: "early",
            label: "Shuruat",
            chemistry: "Hexaconazole 5% SC/EC ya Validamycin 3% L",
            dose: "400 ml/acre",
          },
          {
            stage: "advanced",
            label: "Fail raha hai",
            chemistry: "Azoxystrobin + Difenoconazole SC ya Propiconazole 25% EC",
            dose: "200 ml/acre + paani kam karein, spacing badhayein",
          },
        ],
      },
      {
        id: "blb",
        name: "Bacterial Leaf Blight",
        scientificName: "Xanthomonas oryzae",
        type: "disease",
        symptoms: ["Patte ke tip se neeche peela-khraab margin", "Nursery mein kresek (murjhana)"],
        stages: [
          {
            stage: "early",
            label: "Shuruat",
            chemistry: "Copper oxychloride 50% WP + Streptocycline",
            dose: "500 g/acre + 6 g/acre — N top-dressing rok dein",
          },
          {
            stage: "advanced",
            label: "Fail raha hai",
            chemistry: "Copper + Streptocycline repeat",
            dose: "7 din interval — khet khali karein, curative nahi hai",
            notes: "Agle season resistant variety use karein",
          },
        ],
      },
      {
        id: "brown-spot",
        name: "Brown Spot",
        scientificName: "Bipolaris oryzae",
        type: "disease",
        symptoms: ["Potash ki kami se juda stress disease"],
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Mancozeb 75% WP", dose: "600 g/acre" },
          { stage: "advanced", label: "Fail raha hai", chemistry: "Propiconazole 25% EC", dose: "200 ml/acre" },
        ],
        extraNotes: ["Potash theek karein"],
      },
      {
        id: "false-smut",
        name: "False Smut",
        scientificName: "Ustilaginoidea virens",
        type: "disease",
        symptoms: ["Dane par greenish-yellow spore balls"],
        stages: [
          {
            stage: "preventive",
            label: "Booting par (sirf yahi window)",
            chemistry: "Propiconazole 25% EC ya Copper oxychloride",
            dose: "200 ml/acre ya 500 g/acre at boot leaf",
            notes: "Smut ball banne ke baad koi ilaj nahi",
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
            label: "Dead hearts <5% ya 30-35 DAT",
            chemistry: "Cartap hydrochloride 4G ya Chlorantraniliprole 0.4% GR",
            dose: "8 kg/acre granular (khade paani mein)",
          },
          {
            stage: "advanced",
            label: "Moth flush / white ears",
            chemistry: "Chlorantraniliprole 18.5% SC ya Flubendiamide 39.35% SC",
            dose: "60 ml/acre ya 40 ml/acre — ETL par spray, calendar par nahi",
          },
        ],
      },
      {
        id: "bph",
        name: "Brown Plant Hopper",
        scientificName: "Nilaparvata lugens",
        type: "pest",
        iracGroup: "IRAC 9B / 4A",
        symptoms: ["Hopper burn — gol patch sukhe paudhe", "Base par insects"],
        stages: [
          {
            stage: "early",
            label: "Shuruat",
            chemistry: "Pymetrozine 50% WG ya Buprofezin 25% SC",
            dose: "120 g/acre ya 320 ml/acre — canopy kholo, paani nikalo",
          },
          {
            stage: "advanced",
            label: "Hopper burn fail raha",
            chemistry: "Dinotefuran 20% SG ya Flonicamid 50% WG",
            dose: "60 g/acre — plant ke base par direct spray",
          },
        ],
        rotationNotes: "Synthetic pyrethroid aur excess N se bachna — BPH badh jata hai.",
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
            chemistry: "Flubendiamide 20% WG ya Chlorantraniliprole 18.5% SC",
            dose: "50 g/acre ya 60 ml/acre",
          },
        ],
      },
      {
        id: "rice-bug",
        name: "Gundhi Bug / Rice Bug",
        scientificName: "Leptocorisa",
        type: "pest",
        symptoms: ["Doodh pakne par dane choosna"],
        stages: [
          {
            stage: "advanced",
            label: "Heading stage",
            chemistry: "Malathion 50% EC ya Deltamethrin 2.8% EC",
            dose: "400 ml/acre ya 200 ml/acre",
          },
        ],
      },
    ],
    weeds: [
      {
        id: "paddy-weeds",
        name: "Grassy, Sedge & Broadleaf Weeds",
        type: "weed",
        symptoms: ["Echinochloa (sawank), Cyperus (motha), Ammania, Monochoria"],
        stages: [
          {
            stage: "preventive",
            label: "Pre-emergence (0-3 DAT)",
            chemistry: "Pretilachlor 50% EC ya Pendimethalin 30% EC",
            dose: "600 ml/acre ya 1 L/acre — patla paani film rakhein",
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
        symptoms: ["Peeli powder pustules veins ke saath stripes mein", "Thand mein failta hai (Dec-Feb)"],
        stages: [
          {
            stage: "early",
            label: "Pehli pustules",
            chemistry: "Propiconazole 25% EC ya Tebuconazole 25.9% EC",
            dose: "200 ml/acre (0.1%)",
          },
          {
            stage: "advanced",
            label: "Fail raha hai",
            chemistry: "Azoxystrobin + Difenoconazole SC ya Trifloxystrobin + Tebuconazole WG",
            dose: "200 ml/acre ya 100 g/acre — 15 din baad repeat agar mausam favourable",
          },
        ],
        rotationNotes: "Resistant varieties: DBW-187, DBW-222, HD-3086. Tillering se scout karein.",
      },
      {
        id: "brown-rust",
        name: "Brown / Leaf Rust",
        scientificName: "Puccinia triticina",
        type: "disease",
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Propiconazole / Tebuconazole", dose: "200 ml/acre" },
          {
            stage: "advanced",
            label: "Fail raha hai",
            chemistry: "Strobilurin + triazole combo",
            dose: "Label ke hisaab se",
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
            label: "Sirf beej treatment",
            chemistry: "Carboxin + Thiram DS ya Tebuconazole 2% DS",
            dose: "2.5-3 g/kg seed ya 1-1.5 g/kg — foliar cure nahi",
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
            label: "Ear emergence par",
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
            label: "Shuruat",
            chemistry: "Propiconazole / Tebuconazole",
            dose: "200 ml/acre",
          },
          {
            stage: "advanced",
            label: "Fail raha hai",
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
        symptoms: ["Flag leaf/ear par colonies", "BYDV vector"],
        stages: [
          {
            stage: "early",
            label: "Kam colony",
            chemistry: "Ladybird encourage karein; spot spray Thiamethoxam 25% WG",
            dose: "40 g/acre",
          },
          {
            stage: "advanced",
            label: "Ear covered",
            chemistry: "Imidacloprid 17.8% SL ya Dimethoate 30% EC",
            dose: "60 ml/acre ya 300 ml/acre",
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
            label: "Buwai par",
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
        symptoms: ["Gulli danda, wild oat, bathua, senji — sabse bada yield loss factor"],
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
            chemistry: "Clodinafop 15% WP ya Pinoxaden 5% EC",
            dose: "160 g/acre ya 400 ml/acre",
          },
          {
            stage: "advanced",
            label: "Grass + broadleaf combo",
            chemistry: "Sulfosulfuron + Metsulfuron ready-mix ya Mesosulfuron+Iodosulfuron",
            dose: "16 g/acre ya 160 g/acre",
          },
        ],
        rotationNotes: "Phalaris minor Punjab/Haryana mein isoproturon resistant — Clodinafop/Pinoxaden rotate karein.",
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
        symptoms: ["Lambi cigar-shaped grey-green lesions"],
        stages: [
          { stage: "early", label: "Shuruat", chemistry: "Mancozeb 75% WP", dose: "600 g/acre" },
          {
            stage: "advanced",
            label: "Fail raha hai",
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
            chemistry: "Validamycin 3% L ya Hexaconazole 5% EC",
            dose: "400 ml/acre — lower sheath par directed",
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
            label: "Beej treatment",
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
          "Whorl mein ragged feeding + moist frass",
          "Inverted-Y head par + last segment par 4 dots",
        ],
        stages: [
          {
            stage: "early",
            label: "0-25% whorl damage, chhote larvae",
            chemistry: "Azadirachtin 1500 ppm ya Spinetoram 11.7% SC ya Emamectin benzoate 5% SG",
            dose: "400 ml/acre ya 100 ml/acre ya 80 g/acre — whorl mein direct",
          },
          {
            stage: "advanced",
            label: ">25% damage, bade larvae",
            chemistry: "Chlorantraniliprole 18.5% SC ya Spinetoram",
            dose: "60 ml/acre ya 100 ml/acre + poison bait (rice bran+jaggery+Thiodicarb)",
          },
        ],
        rotationNotes: "IRAC 5 → 6 → 28 cycle; subah/sham whorl mein spray.",
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
            chemistry: "Cartap 4G ya Chlorantraniliprole 0.4% GR in whorl",
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
            dose: "400-500 g/acre (pulse/veg intercrop mein mat use karein)",
          },
          {
            stage: "early",
            label: "Post-emergence (20-25 DAS)",
            chemistry: "Tembotrione 34.4% SC ya Topramezone 33.6% SC",
            dose: "115 ml/acre + surfactant ya 30 ml/acre",
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
        symptoms: ["Chlorosis + white downy underside", "Baal green leafy structures ban jate hain"],
        stages: [
          {
            stage: "preventive",
            label: "Primary — beej treatment",
            chemistry: "Metalaxyl 35% WS",
            dose: "6 g/kg seed",
          },
          {
            stage: "early",
            label: "Foliar + rogue",
            chemistry: "Metalaxyl + Mancozeb",
            dose: "400 g/acre — infected plants ukhad dein",
          },
        ],
        extraNotes: ["Resistant hybrids: HHB-67 Improved. Green ear banne ke baad cure nahi."],
      },
      {
        id: "ergot",
        name: "Ergot",
        scientificName: "Claviceps fusiformis",
        type: "disease",
        symptoms: ["Pink honeydew phir kaale sclerotia — toxic"],
        stages: [
          {
            stage: "preventive",
            label: "Flowering par",
            chemistry: "Mancozeb ya Ziram",
            dose: "600 g/acre boot & 50% flowering par",
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
            label: "Buwai par",
            chemistry: "Imidacloprid 70% WS seed treatment",
            dose: "5 g/kg",
          },
          {
            stage: "early",
            label: "Whorl",
            chemistry: "Cartap 4G",
            dose: "Label dose whorl mein",
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
            chemistry: "Chlorpyriphos 20% EC soil ya Fipronil seed treatment",
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
            chemistry: "Atrazine 50% WP ya Pendimethalin",
            dose: "200-300 g/acre (halki mitti) ya 1 L/acre",
          },
          {
            stage: "early",
            label: "Cultural",
            chemistry: "Hand weeding / hoeing",
            dose: "20 & 35 DAS par — dryland mein sabse economical",
          },
        ],
      },
    ],
  },
];
