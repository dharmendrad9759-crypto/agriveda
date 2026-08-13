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

export const CHEM_BOTTLE_CATALOG: ChemBottleEntry[] = [
  ...MODERN_TECHNICALS.map((t) => ({
    slug: t.slug,
    name: t.name,
    formulation: t.formulation,
    category: t.category,
    aliases: t.aliases,
  })),
  {
    slug: "deltamethrin-2-8-ec",
    name: "Deltamethrin",
    formulation: "2.8% EC",
    category: "insecticide",
    aliases: ["deltamethrin"],
  },
  {
    slug: "emamectin-benzoate-5-sg",
    name: "Emamectin benzoate",
    formulation: "5% SG",
    category: "insecticide",
    aliases: ["emamectin", "proclaim"],
  },
  {
    slug: "fipronil-0-3-gr",
    name: "Fipronil",
    formulation: "0.3% GR",
    category: "insecticide",
    aliases: ["fipronil", "regent"],
  },
  {
    slug: "imidacloprid-17-8-sl",
    name: "Imidacloprid",
    formulation: "17.8% SL",
    category: "insecticide",
    aliases: ["imidacloprid", "confidor"],
  },
  {
    slug: "thiamethoxam-25-wg",
    name: "Thiamethoxam",
    formulation: "25% WG",
    category: "insecticide",
    aliases: ["thiamethoxam", "actara"],
  },
  {
    slug: "acephate-75-sp",
    name: "Acephate",
    formulation: "75% SP",
    category: "insecticide",
    aliases: ["acephate"],
  },
  {
    slug: "cartap-4-gr",
    name: "Cartap hydrochloride",
    formulation: "4% GR",
    category: "insecticide",
    aliases: ["cartap"],
  },
  {
    slug: "buprofezin-25-sc",
    name: "Buprofezin",
    formulation: "25% SC",
    category: "insecticide",
    aliases: ["buprofezin"],
  },
  {
    slug: "spinosad-45-sc",
    name: "Spinosad",
    formulation: "45% SC",
    category: "insecticide",
    aliases: ["spinosad"],
  },
  {
    slug: "lambda-cyhalothrin-5-ec",
    name: "Lambda-cyhalothrin",
    formulation: "5% EC",
    category: "insecticide",
    aliases: ["lambda", "cyhalothrin"],
  },
  {
    slug: "carbendazim-50-wp",
    name: "Carbendazim",
    formulation: "50% WP",
    category: "fungicide",
    aliases: ["carbendazim", "bavistin"],
  },
  {
    slug: "tricyclazole-75-wp",
    name: "Tricyclazole",
    formulation: "75% WP",
    category: "fungicide",
    aliases: ["tricyclazole"],
  },
  {
    slug: "mancozeb-75-wp",
    name: "Mancozeb",
    formulation: "75% WP",
    category: "fungicide",
    aliases: ["mancozeb"],
  },
  {
    slug: "hexaconazole-5-ec",
    name: "Hexaconazole",
    formulation: "5% EC",
    category: "fungicide",
    aliases: ["hexaconazole"],
  },
  {
    slug: "azoxystrobin-250-sc",
    name: "Azoxystrobin",
    formulation: "250 SC",
    category: "fungicide",
    aliases: ["azoxystrobin"],
  },
  {
    slug: "pretilachlor-50-ec",
    name: "Pretilachlor",
    formulation: "50% EC",
    category: "herbicide",
    aliases: ["pretilachlor"],
  },
  {
    slug: "butachlor-50-ec",
    name: "Butachlor",
    formulation: "50% EC",
    category: "herbicide",
    aliases: ["butachlor"],
  },
];
