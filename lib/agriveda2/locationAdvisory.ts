import type { SmartCropRank } from "@/lib/agriveda2/smartCropEngine";
import { getBighaInfo } from "@/lib/bighaConversion";

const MONTH_NAMES_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];

function currentSeasonLabel(month: number): string {
  if (month >= 6 && month <= 9) return "खरीफ (जून–सितंबर)";
  if (month >= 10 || month <= 2) return "रबी (अक्टूबर–मार्च)";
  return "ज़ैद (मार्च–जून)";
}

export function buildSmartCropLocationBanner(
  state: string,
  district: string,
  ranks: SmartCropRank[]
): { title: string; body: string; bighaNote: string } {
  const month = new Date().getMonth() + 1;
  const season = currentSeasonLabel(month);
  const loc =
    district && state ? `${district}, ${state}` : district || state || "आपका इलाका";
  const topNames = ranks.slice(0, 3).map((c) => `${c.emoji} ${c.name}`).join(" · ");
  const bigha = getBighaInfo(state, district);

  return {
    title: `📍 ${loc} — ${MONTH_NAMES_HI[month - 1]} (${season})`,
    body: topNames
      ? `अगर आप यहाँ ${topNames} जैसी फसलें उगाते हैं, तो नीचे की सूची आपके ज़िले, मौसम और verified mandi data के हिसाब से तैयार है। सबसे ऊपर वाली फसल में अभी ज़्यादा मुनाफ़े की संभावना दिख रही है।`
      : `पहले राज्य और ज़िला चुनें — फिर आपके इलाके के हिसाब से फसल सलाह दिखेगी।`,
    bighaNote: `बीघा यहाँ: ${bigha.label} = ${bigha.acresPerBigha} एकड़ (${bigha.note})`,
  };
}
