import { cropCatalog, type CatalogCrop, type CropCategory } from "@/data/crop-catalog";
import { getCropPestDisease } from "@/data/pest-disease";
import type { Crop } from "@/types/crop";
import { resolveCropImage } from "@/lib/crops/cropImages";

const SCIENTIFIC: Record<string, string> = {
  bhindi: "Abelmoschus esculentus",
  mustard: "Brassica juncea",
  mango: "Mangifera indica",
  banana: "Musa spp.",
  grapes: "Vitis vinifera",
  moong: "Vigna radiata",
  pulses: "Cajanus cajan",
  chana: "Cicer arietinum",
  masoor: "Lens culinaris",
  urad: "Vigna mungo",
  ginger: "Zingiber officinale",
  garlic: "Allium sativum",
};

const SEASON_BY_SLUG: Record<string, string> = {
  bhindi: "Kharif / Summer",
  mustard: "Rabi",
  mango: "Year-round (orchard)",
  banana: "Year-round",
  grapes: "Year-round",
  moong: "Kharif / Zaid",
  pulses: "Kharif",
  chana: "Rabi",
  masoor: "Rabi",
  urad: "Kharif",
  ginger: "Kharif",
  garlic: "Rabi",
};

function mapCategory(cat: CropCategory): Crop["category"] {
  switch (cat) {
    case "Cereals":
      return "Cereals";
    case "Pulses":
      return "Pulses";
    case "Cash Crops":
      return "Cash-Crops";
    case "Oilseeds":
      return "Pulses";
    case "Fruits":
    case "Vegetables":
    case "Spices":
    default:
      return "Vegetables";
  }
}

/**
 * Minimal Crop for catalog entries not yet detailed in `data/crops.ts`.
 * Honest thin-content note in Hindi; no invented pesticide doses.
 * When IPM/PDW exists, surface pest/disease names so crop pages aren't blank.
 */
export function buildStubCrop(catalogEntry: CatalogCrop): Crop {
  const hi = catalogEntry.nameHi ?? catalogEntry.name;
  const season = SEASON_BY_SLUG[catalogEntry.slug] ?? "Main season";
  const scientific =
    SCIENTIFIC[catalogEntry.slug] ?? `${catalogEntry.name} (species TBA)`;

  // When IPM/PDW exists, surface names so crop pages aren't blank.
  const pd = getCropPestDisease(catalogEntry.slug);
  const majorPests = pd.pests.map((p) => p.name).slice(0, 8);
  const majorDiseases = pd.diseases.map((d) => d.name).slice(0, 8);
  const hasPdw = majorPests.length + majorDiseases.length + pd.weeds.length > 0;

  return {
    slug: catalogEntry.slug,
    name: catalogEntry.name,
    scientificName: scientific,
    category: mapCategory(catalogEntry.category),
    image: resolveCropImage({ slug: catalogEntry.slug, name: catalogEntry.name }),
    overview: hasPdw
      ? `${hi} की संक्षिप्त गाइड है। कीट-रोग सूची उपलब्ध है — नीचे या कीट-रोग हब में देखें। विस्तृत किस्म/खाद तालिका अधूरी हो सकती है। कीटनाशक खुराक लेबल / कृषि अधिकारी से लें।`
      : `${hi} की संक्षिप्त गाइड है। इस फसल की विस्तृत कीट-रोग सूची अभी ऐप में नहीं है — AI Doctor या कृषि विभाग से सलाह लें। यहाँ कोई कीटनाशक खुराक नहीं दी गई।`,
    durationDays: "—",
    estimatedYield: "क्षेत्र अनुसार अलग",
    seedRate: "स्थानीय कृषि विभाग / पैकेट लेबल देखें",
    spacing: "किस्म और विधि अनुसार",
    suitableSeason: season,
    suitableSoil: "अच्छी जल निकासी वाली दोमट / क्षेत्रीय मिट्टी",
    climate: "क्षेत्रीय जलवायु के अनुसार",
    sowingGuide: {
      bestSowingTime: season,
      seedRate: "स्थानीय सिफारिश देखें",
      seedTreatment: "विश्वसनीय स्रोत का बीज; उपचार कृषि सलाहकार से पूछें",
      spacing: "पंक्ति और पौधों की दूरी किस्म अनुसार",
      sowingMethod: "बुवाई / रोपाई — क्षेत्रीय प्रथा",
    },
    fertilizerSchedule: {
      basalDose: ["मिट्टी जाँच के बाद खाद — खुराक यहाँ सूचीबद्ध नहीं"],
      stageWise: [
        {
          stage: "सामान्य",
          details: ["विस्तृत उर्वरक तालिका अधूरी — fertilizer calculator या कृषि विभाग देखें"],
        },
      ],
      micronutrients: ["जरूरत मिट्टी जाँच से तय करें"],
      foliarSpray: [],
    },
    irrigationManagement: {
      waterRequirement: "फसल अवस्था और मिट्टी नमी अनुसार",
      criticalStages: ["अंकुरण / शुरुआती वृद्धि", "फूल / फल भरना"],
      schedule: ["ऊपरी मिट्टी सूखने पर सिंचाई; जलभराव से बचें"],
    },
    cropProtection: {
      majorPests,
      majorDiseases,
      weedManagement: pd.weeds.length
        ? pd.weeds.slice(0, 5).map((w) => w.name)
        : ["समय पर निराई; रासायनिक weedicide stub में नहीं"],
      symptoms: [],
      prevention: ["साफ बीज / बीजकंद, फसल चक्र, खेत की सफाई"],
      control: hasPdw
        ? ["कीट-रोग हब / AI Doctor देखें — खुराक लेबल से"]
        : ["खुराक नहीं दी गई — AI Doctor या कृषि सलाहकार से पूछें"],
    },
    nutrientDeficiencies: [],
    harvestAndYield: {
      harvestingTime: "परिपक्वता के लक्षण आने पर",
      maturitySigns: ["फसल-विशिष्ट चिह्न — विस्तृत गाइड जल्द"],
      yield: "क्षेत्र और प्रबंधन अनुसार",
      storageTips: ["साफ सुखाकर भंडारण; नमी से बचाएँ"],
    },
    marketInformation: {
      majorMarkets: ["नजदीकी मंडी"],
      demand: "स्थानीय माँग अनुसार",
      msp: "लागू हो तो सरकारी अधिसूचना देखें",
      priceTrend: "मंडी भाव प्रतिदिन जाँचें",
    },
    isStub: true,
  };
}

/** Full listing: detailed crops first, then catalog stubs for missing slugs. */
export function listCropsWithCatalogStubs(detailed: Crop[]): Crop[] {
  const bySlug = new Map(detailed.map((c) => [c.slug, c]));
  const out: Crop[] = [...detailed];
  for (const entry of cropCatalog) {
    if (!bySlug.has(entry.slug)) {
      out.push(buildStubCrop(entry));
    }
  }
  return out;
}

export function resolveCropOrStub(slug: string, detailed: Crop[]): Crop | undefined {
  const key = slug.trim().toLowerCase();
  const found = detailed.find((c) => c.slug === key);
  if (found) return found;
  const entry = cropCatalog.find((c) => c.slug === key);
  return entry ? buildStubCrop(entry) : undefined;
}
