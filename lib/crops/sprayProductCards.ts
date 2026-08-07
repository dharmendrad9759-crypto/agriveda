import type { CropSprayProduct } from "@/types/crop-management";
import { formatFarmerChemicalLine, stripMoaCodes } from "@/lib/crops/farmerSprayDose";

/**
 * Build farmer medicine cards: structured products win; else parse chemicalControl lines.
 */
export function buildSprayProductCards(
  products: CropSprayProduct[] | undefined,
  chemicalLines: string[] | undefined,
  hi = true
): CropSprayProduct[] {
  if (products?.length) {
    return products.map((p) => ({
      technical: stripMoaCodes(p.technical),
      formulation: p.formulation,
      brands: p.brands?.filter(Boolean),
      doseAcre: p.doseAcre,
      bestStage: p.bestStage,
      bestUseCondition: p.bestUseCondition,
      points: p.points?.filter(Boolean),
      sourceConfidence: p.sourceConfidence,
    }));
  }

  if (!chemicalLines?.length) return [];

  return chemicalLines.slice(0, 6).map((line) => {
    const cleaned = stripMoaCodes(line);
    const doseMatch = cleaned.match(
      /(~?\s*\d+(?:\.\d+)?(?:\s*[–\-−to]+\s*\d+(?:\.\d+)?)?\s*(?:ml|g|मिली|मी\.?ली\.?)(?:\s*\/?\s*(?:acre|एकड़|ha))?)/i
    );
    const technical = cleaned
      .replace(doseMatch?.[0] ?? "", "")
      .replace(/\s*[·•—–-]+\s*$/g, "")
      .trim();
    const rawDose = doseMatch?.[0]?.trim();
    let doseAcre = hi ? "लेबल अनुसार प्रति एकड़" : "Follow label per acre";
    if (rawDose) {
      if (/एकड़|acre/i.test(rawDose)) {
        doseAcre = rawDose.replace(/acre/i, hi ? "एकड़" : "acre");
        if (hi && !/प्रति/.test(doseAcre)) {
          doseAcre = doseAcre.replace(/\/?\s*एकड़/i, " प्रति एकड़").replace(/ml/i, "मिलीलीटर");
        }
      } else if (/ml/i.test(rawDose)) {
        doseAcre = hi
          ? `${rawDose.replace(/~/g, "").trim().replace(/ml/i, "मिलीलीटर")} प्रति एकड़`
          : `${rawDose.replace(/~/g, "").trim()} per acre`;
      } else if (/g\b/i.test(rawDose)) {
        doseAcre = hi
          ? `${rawDose.replace(/~/g, "").trim().replace(/g\b/i, "ग्राम")} प्रति एकड़`
          : `${rawDose.replace(/~/g, "").trim()} per acre`;
      }
    }

    // Keep legacy per-L hint available as a soft point when converter works
    const perL = formatFarmerChemicalLine(line, hi);
    const perLOnly = perL.match(
      /(\d+(?:\.\d+)?(?:\s*[–\-]\s*\d+(?:\.\d+)?)?\s*(?:ml|g)(?:\/लीटर\s*पानी|\/L\s*water))/i
    )?.[0];

    const points = [
      hi ? "बोतल का लेबल (खुराक / PHI) ज़रूर पढ़ें" : "Always read the bottle label (dose / PHI)",
      perLOnly
        ? hi
          ? `टंकी: लगभग ${perLOnly} (~200 लीटर पानी/एकड़)`
          : `Tank mix ≈ ${perLOnly} (~200 L water/acre)`
        : null,
    ].filter(Boolean) as string[];

    return {
      technical: technical || cleaned,
      doseAcre,
      points,
    };
  });
}
