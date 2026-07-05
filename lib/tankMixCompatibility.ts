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
      title: "Select both products",
      message: "Choose two agrochemicals from the dropdowns to run a compatibility check.",
    };
  }

  if (a.id === b.id) {
    return {
      status: "caution",
      title: "Same product selected",
      message: "Select two different products to test tank-mix compatibility.",
    };
  }

  const reasons: string[] = [];

  if (isHerbicide(a) && isHerbicide(b)) {
    return {
      status: "incompatible",
      title: "Incompatible — Herbicide clash",
      message:
        "Two herbicides in one tank are rarely compatible and may cause antagonism or crop injury. Apply separately unless using a registered premix.",
    };
  }

  if (
    containsAny(a.activeIngredient, STRONG_HERBICIDES) ||
    containsAny(b.activeIngredient, STRONG_HERBICIDES)
  ) {
    return {
      status: "incompatible",
      title: "Incompatible — Non-selective herbicide",
      message:
        "Glyphosate, Paraquat, or 2,4-D must not be tank-mixed with insecticides/fungicides. Risk of phytotoxicity and formulation breakdown.",
    };
  }

  if (isCopper(a) || isCopper(b)) {
    const other = isCopper(a) ? b : a;
    if (other.category === "insecticide" && other.moaType === "IRAC") {
      return {
        status: "incompatible",
        title: "Incompatible — Copper + insecticide",
        message:
          "Copper fungicides often react with alkaline-sensitive insecticides, causing precipitation and loss of efficacy. Risk of nozzle clogging and leaf burn.",
      };
    }
    if (other.category === "fungicide") {
      reasons.push("copper with another fungicide");
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
      title: "Incompatible — Cholinesterase inhibitors",
      message:
        "Organophosphates (IRAC 1B) and carbamates (IRAC 1A/14) must not be mixed — synergistic toxicity to applicator and non-target organisms.",
    };
  }

  if (
    a.moaType === b.moaType &&
    a.moaType === "IRAC" &&
    moaFamily(a.moaGroup) === moaFamily(b.moaGroup)
  ) {
    return {
      status: "caution",
      title: "Caution — Same MoA group",
      message: `Both products share ${a.moaType} Group ${a.moaGroup}. Physically they may mix, but combining same MoA accelerates resistance — use sequentially, not in one tank.`,
    };
  }

  const ecWpMismatch =
    (isOilBasedFormulation(a.productName) && isPowderFormulation(b.productName)) ||
    (isOilBasedFormulation(b.productName) && isPowderFormulation(a.productName));

  if (ecWpMismatch) {
    return {
      status: "caution",
      title: "Caution — Formulation mismatch",
      message:
        "EC/SC liquids with WP/WG powders can settle or gel. Always run a jar test (1:10 dilution) and spray within 30 minutes of mixing.",
    };
  }

  const fungInsect =
    (a.category === "fungicide" && b.category === "insecticide") ||
    (a.category === "insecticide" && b.category === "fungicide");

  if (fungInsect) {
    return {
      status: "safe",
      title: "Safe to Mix",
      message: `${a.productName} + ${b.productName} is a common fungicide–insecticide combination. Add WP first, then liquid, with constant agitation. Jar-test before full tank.`,
    };
  }

  if (reasons.length > 0) {
    return {
      status: "caution",
      title: "Caution — Verify before mixing",
      message: `Potential issue: ${reasons.join(", ")}. Conduct a jar compatibility test and follow label order of addition.`,
    };
  }

  return {
    status: "safe",
    title: "Likely Compatible",
    message:
      "No major incompatibility flags detected. Still perform a jar test, maintain constant agitation, and spray within 2 hours of mixing.",
  };
}

export function formatProductOption(p: SprayProduct): string {
  const cat = p.category.charAt(0).toUpperCase() + p.category.slice(1);
  return `${p.productName} — ${p.activeIngredient} (${cat})`;
}
