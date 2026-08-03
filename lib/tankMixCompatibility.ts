import type { SprayProduct } from "@/types/spray-rotation";
import { getProductById } from "@/data/spray-products";

export type TankMixStatus = "safe" | "caution" | "incompatible";

export interface TankMixCheckResult {
  status: TankMixStatus;
  title: string;
  message: string;
}

const COPPER_ACTIVES = ["copper oxychloride", "copper hydroxide", "streptocycline"];
const STRONG_HERBICIDES = ["glyphosate", "paraquat", "2,4-d"];
const ORGANOPHOSPHATES = ["monocrotophos", "quinalphos", "chlorpyrifos", "dimethoate", "triazophos", "profenophos", "acephate"];
const CARBAMATES = ["carbaryl", "thiodicarb", "methomyl", "cartap"];

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function containsAny(active: string, list: string[]): boolean {
  const a = normalize(active);
  return list.some((x) => a.includes(x));
}

function isCopper(p: SprayProduct): boolean {
  return containsAny(p.activeIngredient, COPPER_ACTIVES);
}

function isHerbicide(p: SprayProduct): boolean {
  return p.category === "herbicide";
}

function isOilBasedFormulation(name: string): boolean {
  return /\b(EC|EW|OD|SC)\b/i.test(name) || /emulsifiable/i.test(name);
}

function isPowderFormulation(name: string): boolean {
  return /\b(WP|WG|SP|SG|DF)\b/i.test(name);
}

function moaFamily(group: string): string {
  return group.split("+")[0].trim();
}

export function checkTankMixCompatibility(
  productIdA: string,
  productIdB: string
): TankMixCheckResult {
  const a = getProductById(productIdA);
  const b = getProductById(productIdB);

  if (!a || !b) {
    return {
      status: "caution",
      title: "दोनों उत्पाद चुनें",
      message: "मिलान जाँच के लिए दोनों ड्रॉपडाउन से कृषि रसायन चुनें।",
    };
  }

  if (a.id === b.id) {
    return {
      status: "caution",
      title: "एक ही उत्पाद चुना",
      message: "टैंक मिक्स (Tank mix) जाँच के लिए दो अलग उत्पाद चुनें।",
    };
  }

  const reasons: string[] = [];

  if (isHerbicide(a) && isHerbicide(b)) {
    return {
      status: "incompatible",
      title: "असंगत — दो खरपतवारनाशक",
      message:
        "एक टैंक में दो खरपतवारनाशक (Herbicide) शायद ही मिलते हैं — विरोध या फसल को नुकसान हो सकता है। पंजीकृत प्रीमिक्स (Premix) के बिना अलग-अलग छिड़काव करें।",
    };
  }

  if (
    containsAny(a.activeIngredient, STRONG_HERBICIDES) ||
    containsAny(b.activeIngredient, STRONG_HERBICIDES)
  ) {
    return {
      status: "incompatible",
      title: "असंगत — गैर-चयनात्मक खरपतवारनाशक",
      message:
        "Glyphosate, Paraquat या 2,4-D को कीटनाशक/फफूंदनाशक के साथ टैंक में न मिलाएँ। पौधे को नुकसान और फॉर्म्युलेशन खराब होने का जोखिम।",
    };
  }

  if (isCopper(a) || isCopper(b)) {
    const other = isCopper(a) ? b : a;
    if (other.category === "insecticide" && other.moaType === "IRAC") {
      return {
        status: "incompatible",
        title: "असंगत — ताँबा + कीटनाशक",
        message:
          "ताँबा वाले फफूंदनाशक अक्सर क्षार-संवेदनशील कीटनाशकों से प्रतिक्रिया करते हैं — अवक्षेप और असर कम। नोजल जाम और पत्ती जलने का जोखिम।",
      };
    }
    if (other.category === "fungicide") {
      reasons.push("ताँबा + दूसरा फफूंदनाशक");
    }
  }

  if (
    (containsAny(a.activeIngredient, ORGANOPHOSPHATES) &&
      containsAny(b.activeIngredient, CARBAMATES)) ||
    (containsAny(b.activeIngredient, ORGANOPHOSPHATES) &&
      containsAny(a.activeIngredient, CARBAMATES))
  ) {
    return {
      status: "incompatible",
      title: "असंगत — कोलीनएस्टरेज़ अवरोधक",
      message:
        "Organophosphates (IRAC 1B) और Carbamates (IRAC 1A/14) एक साथ न मिलाएँ — छिड़कावकर्ता और गैर-लक्षित जीवों के लिए जोड़ा हुआ विषैलापन।",
    };
  }

  if (
    a.moaType === b.moaType &&
    a.moaType === "IRAC" &&
    moaFamily(a.moaGroup) === moaFamily(b.moaGroup)
  ) {
    return {
      status: "caution",
      title: "सावधानी — एक ही MoA समूह",
      message: `दोनों उत्पाद ${a.moaType} Group ${a.moaGroup} साझा करते हैं। शारीरिक रूप से मिल सकते हैं, पर एक MoA मिलाने से प्रतिरोध जल्दी बढ़ता है — एक टैंक में नहीं, क्रम से छिड़कें।`,
    };
  }

  const ecWpMismatch =
    (isOilBasedFormulation(a.productName) && isPowderFormulation(b.productName)) ||
    (isOilBasedFormulation(b.productName) && isPowderFormulation(a.productName));

  if (ecWpMismatch) {
    return {
      status: "caution",
      title: "सावधानी — फॉर्म्युलेशन मेल नहीं",
      message:
        "EC/SC तरल और WP/WG पाउडर तल में बैठ या जैल बन सकते हैं। हमेशा जार टेस्ट (1:10 घोल) करें और मिलाने के 30 मिनट में छिड़कें।",
    };
  }

  const fungInsect =
    (a.category === "fungicide" && b.category === "insecticide") ||
    (a.category === "insecticide" && b.category === "fungicide");

  if (fungInsect) {
    return {
      status: "safe",
      title: "मिलान सुरक्षित",
      message: `${a.productName} + ${b.productName} सामान्य फफूंदनाशक–कीटनाशक संयोजन है। पहले WP, फिर तरल, लगातार हलचल के साथ। पूरे टैंक से पहले जार टेस्ट करें।`,
    };
  }

  if (reasons.length > 0) {
    return {
      status: "caution",
      title: "सावधानी — मिलाने से पहले जाँचें",
      message: `संभावित समस्या: ${reasons.join(", ")}। जार मिलान परीक्षण करें और लेबल के अनुसार मिलाने का क्रम मानें।`,
    };
  }

  return {
    status: "safe",
    title: "संभवतः संगत",
    message:
      "कोई बड़ी असंगतता नहीं मिली। फिर भी जार टेस्ट करें, लगातार हलचल रखें और मिलाने के 2 घंटे में छिड़कें।",
  };
}

export function formatProductOption(p: SprayProduct): string {
  const cat = p.category.charAt(0).toUpperCase() + p.category.slice(1);
  return `${p.productName} — ${p.activeIngredient} (${cat})`;
}
