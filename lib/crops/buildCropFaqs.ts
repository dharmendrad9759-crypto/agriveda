import type { Crop } from "@/types/crop";
import {
  formatSowingCard,
  getCropIrrigationSummary,
  getCropPestRisk,
  getCropDiseaseRisk,
  farmerThreatHi,
} from "@/lib/crops/cropAgroMeta";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";

export function buildCropFaqs(crop: Crop): { question: string; answer: string }[] {
  const irrigation = getCropIrrigationSummary(crop);
  const pest = getCropPestRisk(crop);
  const disease = getCropDiseaseRisk(crop);
  const varieties = getVarietiesForCrop(crop.slug).slice(0, 3).map((v) => v.name);
  const basal = crop.fertilizerSchedule.basalDose[0];
  const weeds = crop.cropProtection.weedManagement[0];
  const cropHi = getCropHindiName(crop.slug) || crop.name;
  const otherPests = crop.cropProtection.majorPests
    .slice(0, 3)
    .map((p) => farmerThreatHi(p))
    .join(", ");
  const otherDiseases = crop.cropProtection.majorDiseases
    .slice(0, 3)
    .map((d) => farmerThreatHi(d))
    .join(", ");

  const riskHi = (level: string) =>
    level === "high" ? "ज़्यादा खतरा" : level === "medium" ? "मध्यम खतरा" : "कम खतरा";

  return [
    {
      question: `${cropHi} कब बोएँ / लगाएँ?`,
      answer: formatSowingCard(crop.slug, crop.sowingGuide.bestSowingTime),
    },
    {
      question: `कितना पानी चाहिए?`,
      answer: `${irrigation.totalWater}. ${irrigation.criticalNote}`,
    },
    {
      question: `मुख्य कीट कौनसा?`,
      answer: `${farmerThreatHi(pest.top)} — ${riskHi(pest.level)}। हर हफ्ते खेत देखें; कीड़े ज़्यादा हों तभी दवा डालें। अन्य: ${otherPests || "कीट टैब देखें"}।`,
    },
    {
      question: `मुख्य बीमारी कौनसी?`,
      answer: `${farmerThreatHi(disease.top)} — ${riskHi(disease.level)}। ${otherDiseases || "रोग टैब देखें"}।`,
    },
    {
      question: `शुरुआत में कौनसी खाद डालें?`,
      answer: basal
        ? `${basal}। बाकी किस्तें खाद टैब में हैं — मिट्टी जाँच के बाद ठीक करें।`
        : `शुरुआत की खाद मिट्टी जाँच के हिसाब से डालें। ${cropHi} की पूरी योजना खाद टैब में है।`,
    },
    {
      question: `कितनी पैदावार उम्मीद?`,
      answer: `${crop.estimatedYield}। अवधि: ${crop.durationDays}। कटाई का संकेत: ${crop.harvestAndYield.maturitySigns[0] ?? crop.harvestAndYield.harvestingTime}।`,
    },
    ...(varieties.length
      ? [
          {
            question: `कौनसी किस्म चुनें?`,
            answer: `आम विकल्प: ${varieties.join(", ")}। अपने इलाके की प्रमाणित बीज दुकान या किस्म टैब से चुनें।`,
          },
        ]
      : []),
    ...(weeds
      ? [
          {
            question: `खरपतवार कब साफ करें?`,
            answer: weeds,
          },
        ]
      : []),
  ];
}
