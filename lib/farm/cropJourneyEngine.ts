/**
 * Crop Journey Lifecycle Engine
 * Implements phenology stage estimation (Farmer Confirmed > GDD > Agronomic Window),
 * task generation, milestone progress, and multi-season management.
 */

import {
  CropSeason,
  CropStageDefinition,
  FarmTask,
  StageEstimationMethod,
} from "@/lib/farm/types";
import {
  WHEAT_ZADOKS_STAGES,
  getWheatStageById,
  getWheatStageByDays,
} from "@/lib/farm/wheatZadoksStages";

export function isWheatCrop(crop?: {
  crop?: string;
  cropSlug?: string;
  cropId?: string;
  cropName?: string;
}): boolean {
  const haystack = [crop?.cropId, crop?.cropSlug, crop?.crop, crop?.cropName]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes("wheat") || haystack.includes("गेहू");
}

export function calculateDaysAfterSowing(sowingDateIso: string): number {
  if (!sowingDateIso) return 0;
  const sowing = new Date(sowingDateIso);
  if (isNaN(sowing.getTime())) return 0;

  // Use midnight comparisons in local timezone
  sowing.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - sowing.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

export function estimateWheatStage(
  season: CropSeason,
  accumulatedGDD?: number
): {
  stage: CropStageDefinition;
  method: StageEstimationMethod;
} {
  // Priority 1: Farmer confirmed stage
  if (season.farmerConfirmedStageId) {
    const confirmed = getWheatStageById(season.farmerConfirmedStageId);
    if (confirmed) {
      return { stage: confirmed, method: "farmer_confirmed" };
    }
  }

  // Priority 2: Cumulative GDD if available
  if (typeof accumulatedGDD === "number" && accumulatedGDD > 0) {
    for (let i = WHEAT_ZADOKS_STAGES.length - 1; i >= 0; i--) {
      const stage = WHEAT_ZADOKS_STAGES[i];
      if (stage.targetGDD && accumulatedGDD >= stage.targetGDD[0]) {
        return { stage, method: "gdd_weather" };
      }
    }
  }

  // Priority 3: Agronomic DAS window
  const das = calculateDaysAfterSowing(season.sowingDate);
  const windowStage = getWheatStageByDays(das);
  return { stage: windowStage, method: "agronomic_window" };
}

export function generateWheatSeasonTasks(
  seasonId: string,
  fieldId: string
): Omit<FarmTask, "id">[] {
  return [
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "germination",
      category: "scouting",
      titleHi: "खेत में पौधों के जमाव की जांच करें",
      titleEn: "Check Field Germination & Stand",
      descriptionHi:
        "बुवाई के 6-8 दिन बाद खेत के अलग-अलग हिस्सों में देखें कि कतारों में बीज सही तरह से जम रहे हैं या नहीं।",
      dueDaysAfterSowing: [5, 10],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "cri",
      category: "irrigation",
      titleHi: "CRI अवस्था — पहला और सबसे जरूरी पानी लगाएं",
      titleEn: "Crown Root Irrigation (CRI - 1st Watering)",
      descriptionHi:
        "बुवाई के 20-22 दिन पर ताज जड़ें निकलती हैं। इस समय हल्की सिंचाई अवश्य करें। जलभराव न होने दें।",
      dueDaysAfterSowing: [18, 25],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "cri",
      category: "fertilizer",
      titleHi: "पहली यूरिया टॉप-ड्रेसिंग डालें",
      titleEn: "1st Urea Top-Dressing",
      descriptionHi:
        "पहली सिंचाई के 3-4 दिन बाद ओट आने पर 45-50 किग्रा यूरिया प्रति एकड़ समान रूप से बिखेरें।",
      dueDaysAfterSowing: [22, 28],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "tillering",
      category: "weeding",
      titleHi: "खरपतवार नाशक का समयबद्ध छिड़काव",
      titleEn: "Targeted Herbicide Application",
      descriptionHi:
        "गुल्ली डंडा व बथुआ की 2-3 पत्ती अवस्था में अनुमोदित खरपतवार नाशक का फ्लैट फैन नोजल से 150 लीटर पानी में स्प्रे करें।",
      dueDaysAfterSowing: [30, 38],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "tillering",
      category: "irrigation",
      titleHi: "दूसरी सिंचाई (कल्ले फूटने के समय)",
      titleEn: "2nd Irrigation at Tillering",
      descriptionHi:
        "40-45 दिन पर दूसरी सिंचाई करें। इससे सहायक कल्ले मजबूत होकर बालियों में बदलते हैं।",
      dueDaysAfterSowing: [40, 48],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "stem_elongation",
      category: "fertilizer",
      titleHi: "यूरिया की अंतिम टॉप-ड्रेसिंग पूरी करें",
      titleEn: "Final Nitrogen Top-Dressing",
      descriptionHi:
        "गांठ बनने से पहले यूरिया की शेष मात्रा डाल दें। बाद में यूरिया डालने से फसल गिरने का डर रहता है।",
      dueDaysAfterSowing: [50, 58],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "booting",
      category: "scouting",
      titleHi: "पीले रतुआ (Yellow Rust) और झंडा पत्ती का निरीक्षण",
      titleEn: "Flag Leaf & Yellow Rust Scouting",
      descriptionHi:
        "पत्तियों पर हल्दी जैसे पीले पाउडर की पट्टियां देखें। लक्षण दिखते ही प्रोपिकोनाज़ोल का स्प्रे करें।",
      dueDaysAfterSowing: [65, 75],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "heading",
      category: "spray",
      titleHi: "एनपीके 00:52:34 + बोरॉन 20% का पर्णीय स्प्रे",
      titleEn: "Foliar Spray of 00:52:34 & Boron",
      descriptionHi:
        "बाली निकलने से ठीक पहले 1 किग्रा 00:52:34 + 100 ग्राम बोरॉन का स्प्रे परागण को पुष्ट करता है।",
      dueDaysAfterSowing: [80, 90],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "milking",
      category: "irrigation",
      titleHi: "दुग्ध अवस्था में सिंचाई (दानों का भराव)",
      titleEn: "Irrigation at Milk Stage",
      descriptionHi:
        "दानों में दूध भरते समय खेत में नमी की कमी न होने दें। तेज हवा चलने पर पानी न लगाएं।",
      dueDaysAfterSowing: [105, 115],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "dough",
      category: "harvest",
      titleHi: "सिंचाई बंद करें व कटाई यंत्र की व्यवस्था करें",
      titleEn: "Stop Irrigation & Prepare Harvester",
      descriptionHi:
        "फसल पकने की ओर है। सिंचाई पूरी तरह बंद करें और कंबाइन हार्वेस्टर या थ्रेशर की अग्रिम बुकिंग करें।",
      dueDaysAfterSowing: [120, 130],
      status: "upcoming",
    },
    {
      fieldId,
      seasonId,
      cropId: "wheat",
      stageId: "ripening",
      category: "harvest",
      titleHi: "सुनहरी पक्वता पर कटाई व सुरक्षित भंडारण",
      titleEn: "Harvesting at Golden Maturity",
      descriptionHi:
        "जब दाने में नमी 12-14% हो, तभी कटाई करें। अनाज को सुखाकर साफ गोदाम में सुरक्षित रखें।",
      dueDaysAfterSowing: [135, 150],
      status: "upcoming",
    },
  ];
}

export function updateTaskStatusesByAge(
  tasks: FarmTask[],
  cropAgeDays: number
): FarmTask[] {
  return tasks.map((t) => {
    // Keep completed or skipped intact
    if (t.status === "completed" || t.status === "skipped") {
      return t;
    }
    const [startDay, endDay] = t.dueDaysAfterSowing;
    if (cropAgeDays >= startDay && cropAgeDays <= endDay) {
      return { ...t, status: "due" };
    }
    if (cropAgeDays > endDay) {
      return { ...t, status: "due" };
    }
    return { ...t, status: "upcoming" };
  });
}
