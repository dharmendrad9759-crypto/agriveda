import type { Crop } from "@/types/crop";
import {
  formatSowingCard,
  getCropIrrigationSummary,
  getCropPestRisk,
  getCropDiseaseRisk,
} from "@/lib/crops/cropAgroMeta";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";

export function buildCropFaqs(crop: Crop): { question: string; answer: string }[] {
  const irrigation = getCropIrrigationSummary(crop);
  const pest = getCropPestRisk(crop);
  const disease = getCropDiseaseRisk(crop);
  const varieties = getVarietiesForCrop(crop.slug).slice(0, 3).map((v) => v.name);
  const basal = crop.fertilizerSchedule.basalDose[0];
  const weeds = crop.cropProtection.weedManagement[0];

  return [
    {
      question: `${crop.name} kab boein / lagayein?`,
      answer: formatSowingCard(crop.slug, crop.sowingGuide.bestSowingTime),
    },
    {
      question: `Kitna paani chahiye?`,
      answer: `${irrigation.totalWater}. ${irrigation.criticalNote}`,
    },
    {
      question: `Mukhya keet / pest kaunsa?`,
      answer: `${pest.top} — ${pest.level} attention. Scout regularly; spray only after threshold. Others: ${crop.cropProtection.majorPests.slice(0, 3).join(", ") || "see Pests tab"}.`,
    },
    {
      question: `Mukhya bimari kaunsi?`,
      answer: `${disease.top} — ${disease.level} attention. ${crop.cropProtection.majorDiseases.slice(0, 3).join(", ") || "See Diseases tab"}.`,
    },
    {
      question: `Uple / fertilizer shuruat mein kya dein?`,
      answer: basal
        ? `${basal}. Stage-wise splits Fertilizer tab mein hain — soil test ke baad adjust karein.`
        : `Basal NPK soil test ke hisaab se dein. Open Fertilizer tab for ${crop.name} schedule.`,
    },
    {
      question: `Kitni paidawar umeed?`,
      answer: `${crop.estimatedYield}. Duration: ${crop.durationDays}. Harvest sign: ${crop.harvestAndYield.maturitySigns[0] ?? crop.harvestAndYield.harvestingTime}.`,
    },
    ...(varieties.length
      ? [
          {
            question: `Kaunsi variety choose karein?`,
            answer: `Popular options: ${varieties.join(", ")}. Apne zila ke certified seed dealer / Varieties tab se zone-wise chunav karein.`,
          },
        ]
      : []),
    ...(weeds
      ? [
          {
            question: `Khapatwar control kab zaroori?`,
            answer: weeds,
          },
        ]
      : []),
  ];
}
