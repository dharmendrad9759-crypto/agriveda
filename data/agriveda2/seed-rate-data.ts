import { dataKeyForSlug } from "@/data/agriveda2/crop-slug-map";

export interface SeedRateMethod {
  id: string;
  label: string;
  min: number;
  max: number;
  unit: string;
  note?: string;
}

export interface SeedRateEntry {
  methods: SeedRateMethod[];
  seedTreatment: string;
  unitExplanation: string;
  proTip?: string;
}

export const SEED_RATE_DATA: Record<string, SeedRateEntry> = {
  "Gehun (Wheat)": {
    methods: [
      { id: "seed_drill", label: "Seed drill", min: 35, max: 40, unit: "kg/acre" },
      { id: "broadcast", label: "Broadcast", min: 45, max: 50, unit: "kg/acre" },
      {
        id: "late_sowing",
        label: "Late sowing (Nov 15+)",
        min: 50,
        max: 55,
        unit: "kg/acre",
        note: "Nov 15 ke baad",
      },
    ],
    seedTreatment: "Thiram 2g + Carbendazim 1g + Imidacloprid 4.8% FS 2ml — pratikg beej",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Dhan (Paddy)": {
    methods: [
      {
        id: "transplanted",
        label: "Transplanted (nursery seed)",
        min: 5,
        max: 6,
        unit: "kg/acre (nursery ke liye)",
        note: "1 acre nursery se lagbhag 8-10 acre main field transplant",
      },
      { id: "direct_wet", label: "Direct seeded (wet)", min: 10, max: 12, unit: "kg/acre" },
      { id: "direct_dry", label: "Direct seeded (dry)", min: 15, max: 18, unit: "kg/acre" },
    ],
    seedTreatment: "Carbendazim 2g/kg + Tricyclazole 1g/kg beej",
    unitExplanation: "kg/acre — nursery ke liye alag, direct seeding ke liye alag",
  },

  "Makka (Maize)": {
    methods: [
      {
        id: "hybrid",
        label: "Hybrid",
        min: 8,
        max: 10,
        unit: "kg/acre",
        note: "60x20 cm spacing",
      },
      { id: "composite", label: "Composite", min: 12, max: 15, unit: "kg/acre" },
    ],
    seedTreatment:
      "Thiram 2g + Carbendazim 1g pratikg beej; Atrazine 500g/acre (weed control)",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Sarson (Mustard)": {
    methods: [
      {
        id: "line_sowing",
        label: "Line sowing",
        min: 1.5,
        max: 2,
        unit: "kg/acre",
        note: "30 cm row spacing",
      },
      { id: "broadcast", label: "Broadcast", min: 2, max: 2.5, unit: "kg/acre" },
    ],
    seedTreatment: "Thiram 2g/kg + Carbendazim 1g/kg beej",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Chana (Chickpea)": {
    methods: [
      { id: "desi", label: "Desi chana", min: 30, max: 35, unit: "kg/acre" },
      {
        id: "kabuli",
        label: "Kabuli chana",
        min: 35,
        max: 40,
        unit: "kg/acre",
        note: "Kabuli dane bade hote hain",
      },
    ],
    seedTreatment:
      "Thiram 2g + Carbendazim 1g/kg; Rhizobium culture 200g/10kg beej — zaroor lagaen",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Soybean": {
    methods: [
      {
        id: "line_sowing",
        label: "Line sowing",
        min: 25,
        max: 30,
        unit: "kg/acre",
        note: "45 cm spacing",
      },
    ],
    seedTreatment:
      "Thiram 1.5g + Carbendazim 1.5g/kg; Rhizobium + PSB culture — yield 20% badhti hai",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Moong (Green Gram)": {
    methods: [
      { id: "kharif", label: "Kharif", min: 8, max: 10, unit: "kg/acre" },
      {
        id: "zaid",
        label: "Zaid",
        min: 10,
        max: 12,
        unit: "kg/acre",
        note: "Zaid mein germination ke liye thodi adhik matra",
      },
    ],
    seedTreatment: "Thiram 2g/kg; Rhizobium culture 200g/10kg beej",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Bajra (Pearl Millet)": {
    methods: [
      {
        id: "hybrid",
        label: "Hybrid",
        min: 1.5,
        max: 2,
        unit: "kg/acre",
        note: "45x15 cm spacing",
      },
    ],
    seedTreatment: "Thiram 3g/kg; Metalaxyl 6g/kg (Downy Mildew rokne ke liye)",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Alu (Potato)": {
    methods: [
      {
        id: "cut_tuber",
        label: "Cut tuber",
        min: 8,
        max: 10,
        unit: "quintal/acre",
        note: "Puri ganti use kar sakte hain ya cut",
      },
      {
        id: "whole_small",
        label: "Whole small tuber",
        min: 10,
        max: 12,
        unit: "quintal/acre",
      },
    ],
    seedTreatment:
      "Mancozeb 75WP 3g/litre paani mein 10 min bhegoyen phir chhanv mein sukhayein",
    unitExplanation: "quintal/acre — kyunki aloo ke tukde/gantiyan beej ke roop mein bote hain",
  },

  "Ganna (Sugarcane)": {
    methods: [
      {
        id: "spring",
        label: "Spring planting",
        min: 25,
        max: 30,
        unit: "quintal/acre (3-aankhi pindiyaan/setts)",
      },
      { id: "autumn", label: "Autumn planting", min: 30, max: 35, unit: "quintal/acre" },
    ],
    seedTreatment:
      "Aervit/Carbendazim 0.1% + Mancozeb 0.25% ke ghol mein 30 min bhegoyen",
    unitExplanation: "quintal/acre — 3-aankhi pindiyaan (setts) bote hain",
  },

  "Tamatar (Tomato)": {
    methods: [
      {
        id: "nursery",
        label: "Nursery seed",
        min: 100,
        max: 150,
        unit: "gram/acre (nursery ke liye paafi hai)",
      },
    ],
    seedTreatment: "Thiram 2g/kg; Trichoderma 5g/kg; 30 min garam paani (50°C) treatment",
    unitExplanation:
      "gram/acre — kyunki in faslon ki nursery pehle tayar hoti hai, seedling transplant hoti hai",
    proTip: "1 gram beej se lagbhag 100 paudhe — 1 acre mein 3,500-4,500 paudhe chahiye",
  },

  "Baingan (Brinjal)": {
    methods: [
      {
        id: "nursery",
        label: "Nursery seed",
        min: 200,
        max: 250,
        unit: "gram/acre (nursery ke liye)",
      },
    ],
    seedTreatment: "Thiram 2g/kg; Imidacloprid 5ml/kg",
    unitExplanation:
      "gram/acre — kyunki in faslon ki nursery pehle tayar hoti hai, seedling transplant hoti hai",
    proTip: "1 acre main field ke liye 60-70 sq.m nursery area kaafi hai",
  },

  "Mirch (Chilli)": {
    methods: [
      {
        id: "nursery",
        label: "Nursery seed",
        min: 200,
        max: 300,
        unit: "gram/acre (nursery ke liye)",
      },
    ],
    seedTreatment: "Trichoderma viride 5g/kg; Thiram 2g/kg",
    unitExplanation:
      "gram/acre — kyunki in faslon ki nursery pehle tayar hoti hai, seedling transplant hoti hai",
    proTip: "1 acre ke liye 50 sq.m nursery",
  },

  "Bhindi (Okra)": {
    methods: [
      {
        id: "spring",
        label: "Spring",
        min: 4,
        max: 5,
        unit: "kg/acre",
        note: "45x30 cm spacing",
      },
      { id: "kharif", label: "Kharif", min: 3, max: 4, unit: "kg/acre" },
    ],
    seedTreatment: "Thiram 2g + Carbendazim 1g/kg; 12 ghante paani mein bhegoyen",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Gobhi (Cauliflower)": {
    methods: [
      {
        id: "nursery",
        label: "Nursery seed",
        min: 150,
        max: 200,
        unit: "gram/acre (nursery ke liye)",
      },
    ],
    seedTreatment: "Thiram 2g/kg; Trichoderma 5g/kg",
    unitExplanation:
      "gram/acre — kyunki in faslon ki nursery pehle tayar hoti hai, seedling transplant hoti hai",
    proTip: "1 acre main field: 60x45 cm spacing, 3,200-3,500 paudhe",
  },

  "Gajar (Carrot)": {
    methods: [
      {
        id: "optimal",
        label: "Optimal",
        min: 3,
        max: 4,
        unit: "kg/acre",
        note: "30x7.5 cm spacing",
      },
    ],
    seedTreatment: "Thiram 2g/kg",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },

  "Palak (Spinach)": {
    methods: [
      {
        id: "optimal",
        label: "Optimal",
        min: 8,
        max: 10,
        unit: "kg/acre (flat bed ya ridge)",
      },
    ],
    seedTreatment: "Thiram 2g/kg",
    unitExplanation: "kg/acre — poora beej seedling nahi, directly khet mein bota hai",
  },
};

export function getSeedRateForSlug(slug: string): SeedRateEntry | null {
  const key = dataKeyForSlug(slug);
  return key ? SEED_RATE_DATA[key] ?? null : null;
}

export function unitExplainForSlug(slug: string): string {
  const entry = getSeedRateForSlug(slug);
  return entry?.unitExplanation ?? "kg/acre — poora beej seedling nahi, directly khet mein bota hai";
}
