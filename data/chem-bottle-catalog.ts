/**
 * Bottle lookup catalog — derived from modern technicals master list.
 */

import { MODERN_TECHNICALS, type ChemBottleCategory } from "@/data/modern-technicals";

export type { ChemBottleCategory };

export type ChemBottleEntry = {
  slug: string;
  name: string;
  formulation: string;
  category: ChemBottleCategory;
  aliases?: string[];
};

export const CHEM_BOTTLE_CATALOG: ChemBottleEntry[] = MODERN_TECHNICALS.map((t) => ({
  slug: t.slug,
  name: t.name,
  formulation: t.formulation,
  category: t.category,
  aliases: t.aliases,
}));
