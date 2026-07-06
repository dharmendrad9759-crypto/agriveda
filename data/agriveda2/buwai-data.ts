import { dataKeyForSlug } from "@/data/agriveda2/crop-slug-map";

export interface BuwaiDateWindow {
  label: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  note?: string;
}

export interface BuwaiCropEntry {
  season?: string;
  state_wise?: Record<string, Record<string, string>>;
  windowsByRegion?: Record<string, BuwaiDateWindow[]>;
  seasons?: Record<string, Record<string, string> & { region?: string; note?: string }>;
  critical_note: string;
  late_variety?: string;
}

export const BUWAI_DATA: Record<string, BuwaiCropEntry> = {
  "Dhan (Paddy)": {
    season: "Kharif",
    state_wise: {
      "UP/Bihar/Jharkhand": {
        nursery: "1–15 June",
        transplanting: "15 June – 15 July",
        direct_seeded: "20 June – 10 July",
      },
      "Punjab/Haryana": {
        nursery: "25 May – 10 June",
        transplanting: "10–30 June (PR varieties), 1–20 July (Basmati)",
      },
      "MP/Chhattisgarh": {
        nursery: "1–20 June",
        transplanting: "20 June – 20 July",
      },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Nursery", startMonth: 6, startDay: 1, endMonth: 6, endDay: 15 },
        { label: "Transplanting (timely)", startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
        { label: "Direct seeded", startMonth: 6, startDay: 20, endMonth: 7, endDay: 10 },
      ],
      "Punjab/Haryana": [
        { label: "Nursery", startMonth: 5, startDay: 25, endMonth: 6, endDay: 10 },
        { label: "Transplanting PR", startMonth: 6, startDay: 10, endMonth: 6, endDay: 30 },
        { label: "Transplanting Basmati", startMonth: 7, startDay: 1, endMonth: 7, endDay: 20 },
      ],
      "MP/Chhattisgarh": [
        { label: "Nursery", startMonth: 6, startDay: 1, endMonth: 6, endDay: 20 },
        { label: "Transplanting", startMonth: 6, startDay: 20, endMonth: 7, endDay: 20 },
      ],
    },
    critical_note:
      "Transplanting 30 June ke baad karne se yield 1 q/acre per week kam hoti hai",
    late_variety: "MTU-7029, NDR-359 (picheti buwai ke liye)",
  },

  "Gehun (Wheat)": {
    season: "Rabi",
    state_wise: {
      "UP/Bihar/Jharkhand": {
        timely: "25 Oct – 15 Nov",
        late: "15 Nov – 15 Dec",
        very_late: "15 Dec – 31 Dec (yield loss 1-2 q/acre)",
      },
      "Punjab/Haryana": { timely: "1 Nov – 20 Nov", late: "20 Nov – 10 Dec" },
      "MP/Rajasthan": { timely: "20 Oct – 10 Nov", late: "10 Nov – 30 Nov" },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Timely sowing", startMonth: 10, startDay: 25, endMonth: 11, endDay: 15 },
        { label: "Late sowing", startMonth: 11, startDay: 15, endMonth: 12, endDay: 15 },
        { label: "Very late", startMonth: 12, startDay: 15, endMonth: 12, endDay: 31 },
      ],
      "Punjab/Haryana": [
        { label: "Timely", startMonth: 11, startDay: 1, endMonth: 11, endDay: 20 },
        { label: "Late", startMonth: 11, startDay: 20, endMonth: 12, endDay: 10 },
      ],
      "MP/Rajasthan": [
        { label: "Timely", startMonth: 10, startDay: 20, endMonth: 11, endDay: 10 },
        { label: "Late", startMonth: 11, startDay: 10, endMonth: 11, endDay: 30 },
      ],
      Rajasthan: [
        { label: "Timely", startMonth: 10, startDay: 20, endMonth: 11, endDay: 10 },
        { label: "Late", startMonth: 11, startDay: 10, endMonth: 11, endDay: 30 },
      ],
    },
    critical_note: "15 Nov ke baad har hafta delay se 1.5-2 q/acre yield ghatti hai",
    late_variety: "WH-1270, PBW-373, NW-1014 (picheti buwai ke liye)",
  },

  "Makka (Maize)": {
    season: "Kharif",
    state_wise: {
      "UP/Bihar/Jharkhand": {
        optimal: "15 June – 15 July",
        spring: "15 Jan – 28 Feb (spring maize)",
      },
      "Punjab/Haryana": { optimal: "15 June – 10 July" },
      "MP/Rajasthan": { optimal: "20 June – 20 July" },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Kharif optimal", startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
        { label: "Spring maize", startMonth: 1, startDay: 15, endMonth: 2, endDay: 28 },
      ],
      "Punjab/Haryana": [
        { label: "Optimal", startMonth: 6, startDay: 15, endMonth: 7, endDay: 10 },
      ],
      "MP/Rajasthan": [
        { label: "Optimal", startMonth: 6, startDay: 20, endMonth: 7, endDay: 20 },
      ],
      Rajasthan: [
        { label: "Optimal", startMonth: 6, startDay: 20, endMonth: 7, endDay: 20 },
      ],
    },
    critical_note:
      "July 20 ke baad buwai se silk-tassel mismatch ka risk, yield gir sakti hai",
  },

  "Sarson (Mustard)": {
    season: "Rabi",
    state_wise: {
      "UP/Bihar/Jharkhand": { timely: "25 Sep – 15 Oct", late: "15 Oct – 31 Oct" },
      "Punjab/Haryana/Rajasthan": { timely: "1–25 Oct", late: "25 Oct – 10 Nov" },
      "MP/Chhattisgarh": { timely: "1–20 Oct" },
      Rajasthan: { timely: "1–25 Oct", late: "25 Oct – 10 Nov" },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Timely", startMonth: 9, startDay: 25, endMonth: 10, endDay: 15 },
        { label: "Late", startMonth: 10, startDay: 15, endMonth: 10, endDay: 31 },
      ],
      "Punjab/Haryana/Rajasthan": [
        { label: "Timely", startMonth: 10, startDay: 1, endMonth: 10, endDay: 25 },
        { label: "Late", startMonth: 10, startDay: 25, endMonth: 11, endDay: 10 },
      ],
      Rajasthan: [
        { label: "Timely", startMonth: 10, startDay: 1, endMonth: 10, endDay: 25 },
        { label: "Late", startMonth: 10, startDay: 25, endMonth: 11, endDay: 10 },
      ],
      "MP/Chhattisgarh": [
        { label: "Timely", startMonth: 10, startDay: 1, endMonth: 10, endDay: 20 },
      ],
    },
    critical_note: "October 15 ke baad buwai se Aphid infestation ka risk badhta hai",
    late_variety: "Kranti, RH-30 (picheti buwai ke liye)",
  },

  "Chana (Chickpea)": {
    season: "Rabi",
    state_wise: {
      "UP/Bihar/MP": { desi: "25 Oct – 15 Nov", kabuli: "20 Oct – 10 Nov" },
      Rajasthan: { optimal: "15 Oct – 5 Nov" },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Desi chana", startMonth: 10, startDay: 25, endMonth: 11, endDay: 15 },
        { label: "Kabuli", startMonth: 10, startDay: 20, endMonth: 11, endDay: 10 },
      ],
      "UP/Bihar/MP": [
        { label: "Desi", startMonth: 10, startDay: 25, endMonth: 11, endDay: 15 },
        { label: "Kabuli", startMonth: 10, startDay: 20, endMonth: 11, endDay: 10 },
      ],
      Rajasthan: [{ label: "Optimal", startMonth: 10, startDay: 15, endMonth: 11, endDay: 5 }],
    },
    critical_note: "November ke baad buwai se wilt disease ka risk zyada hota hai",
  },

  "Soybean": {
    season: "Kharif",
    state_wise: {
      "MP/Maharashtra/Rajasthan": {
        optimal: "20 June – 10 July",
        critical: "July 15 tak buwai zaroor ho jani chahiye",
      },
      "UP/Bihar/Jharkhand": { optimal: "25 June – 15 July" },
    },
    windowsByRegion: {
      "MP/Maharashtra/Rajasthan": [
        { label: "Optimal", startMonth: 6, startDay: 20, endMonth: 7, endDay: 10 },
      ],
      "MP/Chhattisgarh": [
        { label: "Optimal", startMonth: 6, startDay: 20, endMonth: 7, endDay: 10 },
      ],
      Rajasthan: [
        { label: "Optimal", startMonth: 6, startDay: 20, endMonth: 7, endDay: 10 },
      ],
      "UP/Bihar/Jharkhand": [
        { label: "Optimal", startMonth: 6, startDay: 25, endMonth: 7, endDay: 15 },
      ],
    },
    critical_note:
      "Buwai se pehle Rhizobium + PSB culture zaroor lagayen — yield 15-20% badhti hai",
  },

  "Bajra (Pearl Millet)": {
    season: "Kharif",
    state_wise: {
      "Rajasthan/Haryana/Gujarat": { optimal: "15 June – 15 July" },
      "UP/Bihar/Jharkhand": { optimal: "20 June – 20 July" },
    },
    windowsByRegion: {
      "Rajasthan/Haryana/Gujarat": [
        { label: "Optimal", startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
      ],
      "Punjab/Haryana": [
        { label: "Optimal", startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
      ],
      Rajasthan: [
        { label: "Optimal", startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
      ],
      "UP/Bihar/Jharkhand": [
        { label: "Optimal", startMonth: 6, startDay: 20, endMonth: 7, endDay: 20 },
      ],
    },
    critical_note: "July 20 ke baad buwai se downy mildew ka risk badhta hai",
  },

  "Moong (Green Gram)": {
    season: "Kharif + Zaid",
    state_wise: {
      "Kharif (all North India)": { optimal: "20 June – 10 July" },
      "Zaid (UP/Bihar/Punjab)": {
        optimal: "15 Feb – 31 March",
        note: "Zaid moong mein zyada profit — kharif gehun ke baad lete hain",
      },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Kharif", startMonth: 6, startDay: 20, endMonth: 7, endDay: 10 },
        { label: "Zaid", startMonth: 2, startDay: 15, endMonth: 3, endDay: 31 },
      ],
      "Punjab/Haryana": [
        { label: "Kharif", startMonth: 6, startDay: 20, endMonth: 7, endDay: 10 },
        { label: "Zaid", startMonth: 2, startDay: 15, endMonth: 3, endDay: 31 },
      ],
    },
    critical_note: "Zaid moong — gehun ke baad zyada munafa",
  },

  "Alu (Potato)": {
    season: "Rabi + Spring",
    state_wise: {
      "UP/Bihar/Jharkhand": {
        early: "25 Sep – 15 Oct",
        main: "15 Oct – 15 Nov",
        late: "15 Nov – 30 Nov",
      },
      "Punjab/Haryana": { optimal: "15 Sep – 31 Oct" },
      "Spring crop (UP/Bihar)": { optimal: "15 Jan – 28 Feb" },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Early Rabi", startMonth: 9, startDay: 25, endMonth: 10, endDay: 15 },
        { label: "Main Rabi", startMonth: 10, startDay: 15, endMonth: 11, endDay: 15 },
        { label: "Late Rabi", startMonth: 11, startDay: 15, endMonth: 11, endDay: 30 },
        { label: "Spring", startMonth: 1, startDay: 15, endMonth: 2, endDay: 28 },
      ],
      "Punjab/Haryana": [
        { label: "Optimal", startMonth: 9, startDay: 15, endMonth: 10, endDay: 31 },
      ],
    },
    critical_note:
      "October buwai se late blight ka risk zyada — Mancozeb preventive spray zaroori",
  },

  "Tamatar (Tomato)": {
    seasons: {
      "Rabi/Winter (main crop)": {
        nursery: "15 Aug – 15 Sep",
        transplanting: "15 Sep – 15 Oct",
        region: "All North India",
        note: "Best quality + price is season mein",
      },
      "Kharif (monsoon)": {
        nursery: "May 15 – June 15",
        transplanting: "June 15 – July 15",
        region: "UP/Bihar/MP",
        note: "Disease risk zyada, fungicide spray important",
      },
      "Spring/Summer": {
        nursery: "Jan 15 – Feb 15",
        transplanting: "Feb 15 – Mar 15",
        region: "Plains area",
        note: "Fruit cracking aur heat stress ka dhyan rakhen",
      },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Rabi transplanting", startMonth: 9, startDay: 15, endMonth: 10, endDay: 15 },
        { label: "Kharif transplanting", startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
        { label: "Spring transplanting", startMonth: 2, startDay: 15, endMonth: 3, endDay: 15 },
      ],
    },
    critical_note: "Rabi season — sabse acchi quality aur mandi bhav",
  },

  "Baingan (Brinjal)": {
    seasons: {
      Kharif: { nursery: "May – June", transplanting: "June – July" },
      Rabi: { nursery: "Aug – Sep", transplanting: "Sep – Oct" },
      Spring: { nursery: "Jan – Feb", transplanting: "Feb – Mar" },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Kharif transplant", startMonth: 6, startDay: 1, endMonth: 7, endDay: 31 },
        { label: "Rabi transplant", startMonth: 9, startDay: 1, endMonth: 10, endDay: 31 },
        { label: "Spring transplant", startMonth: 2, startDay: 1, endMonth: 3, endDay: 31 },
      ],
    },
    critical_note: "Fruit & Shoot Borer ke liye BACI spray nursery se hi shuru karein",
  },

  "Mirch (Chilli)": {
    seasons: {
      Kharif: { nursery: "May 15 – June 15", transplanting: "June 15 – July 15" },
      Rabi: { nursery: "Aug 15 – Sep 15", transplanting: "Sep 15 – Oct 15" },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Kharif transplant", startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
        { label: "Rabi transplant", startMonth: 9, startDay: 15, endMonth: 10, endDay: 15 },
      ],
    },
    critical_note:
      "Transplanting se pehle Trichoderma + Carbendazim se root drenching zaroori",
  },

  "Bhindi (Okra)": {
    state_wise: {
      "Spring-Summer": {
        optimal: "15 Feb – 30 March",
        note: "Sabse zyada profit is season mein",
      },
      Kharif: {
        optimal: "20 June – 20 July",
        note: "Yellow Vein Mosaic Virus risk — whitefly control critical",
      },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Spring-Summer", startMonth: 2, startDay: 15, endMonth: 3, endDay: 30 },
        { label: "Kharif", startMonth: 6, startDay: 20, endMonth: 7, endDay: 20 },
      ],
    },
    critical_note: "Spring okra — zyada munafa; Kharif mein YVMV se bachav",
  },

  "Gobhi (Cauliflower)": {
    seasons: {
      "Early crop": {
        nursery: "June 15 – July 15",
        transplanting: "July 15 – Aug 15",
        variety: "Early Kunwari, Pusa Meghna",
      },
      "Main crop": {
        nursery: "July 15 – Aug 15",
        transplanting: "Aug 15 – Sep 15",
        variety: "Pusa Snowball K-1, Pant Gobhi-3",
      },
      "Late crop": {
        nursery: "Sep 1 – Oct 1",
        transplanting: "Oct 1 – Nov 1",
        variety: "Pusa Snowball-16, Dania Polaris",
      },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Early transplant", startMonth: 7, startDay: 15, endMonth: 8, endDay: 15 },
        { label: "Main transplant", startMonth: 8, startDay: 15, endMonth: 9, endDay: 15 },
        { label: "Late transplant", startMonth: 10, startDay: 1, endMonth: 11, endDay: 1 },
      ],
    },
    critical_note: "Variety selection season ke hisaab se — early/main/late",
  },

  "Ganna (Sugarcane)": {
    season: "Spring planting (main)",
    state_wise: {
      "UP/Uttarakhand/Bihar": {
        spring: "15 Feb – 31 March (BEST)",
        autumn: "Sep 15 – Oct 31",
      },
    },
    windowsByRegion: {
      "UP/Bihar/Jharkhand": [
        { label: "Spring planting (best)", startMonth: 2, startDay: 15, endMonth: 3, endDay: 31 },
        { label: "Autumn planting", startMonth: 9, startDay: 15, endMonth: 10, endDay: 31 },
      ],
    },
    critical_note: "Spring planting > Autumn planting — yield 15-20% zyada hoti hai",
  },
};

export function getBuwaiForSlug(slug: string): BuwaiCropEntry | null {
  const key = dataKeyForSlug(slug);
  return key ? BUWAI_DATA[key] ?? null : null;
}

export function pickBuwaiRegion(
  entry: BuwaiCropEntry,
  region: string,
): { regionKey: string; windows: BuwaiDateWindow[]; stateData: Record<string, string> } {
  const byRegion = entry.windowsByRegion ?? {};
  const stateWise = entry.state_wise ?? {};

  const regionCandidates = [
    region,
    "UP/Bihar/Jharkhand",
    "Punjab/Haryana",
    "MP/Chhattisgarh",
    "MP/Rajasthan",
    "Rajasthan",
    ...Object.keys(byRegion),
    ...Object.keys(stateWise),
  ];

  for (const key of regionCandidates) {
    if (byRegion[key]) {
      return {
        regionKey: key,
        windows: byRegion[key],
        stateData: stateWise[key] ?? {},
      };
    }
  }

  const firstKey = Object.keys(byRegion)[0] ?? Object.keys(stateWise)[0] ?? region;
  return {
    regionKey: firstKey,
    windows: byRegion[firstKey] ?? [],
    stateData: stateWise[firstKey] ?? {},
  };
}
