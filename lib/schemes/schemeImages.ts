import type { FarmerScheme } from "@/data/schemes/farmerSchemes";

const CATEGORY_IMAGE: Record<FarmerScheme["category"], string> = {
  credit: "/images/schemes/scheme-kcc.jpg",
  mechanization: "/images/schemes/scheme-machinery.jpg",
  income: "/images/schemes/scheme-income.jpg",
  insurance: "/images/schemes/scheme-insurance.jpg",
  irrigation: "/images/schemes/scheme-irrigation.jpg",
  energy: "/images/schemes/scheme-irrigation.jpg",
  state: "/images/schemes/scheme-climate.jpg",
  protection: "/images/schemes/scheme-climate.jpg",
  livestock: "/images/schemes/scheme-livestock.jpg",
  horticulture: "/images/schemes/scheme-organic.jpg",
  processing: "/images/schemes/scheme-income.jpg",
};

const SCHEME_IMAGE: Record<string, string> = {
  kcc: "/images/schemes/scheme-kcc.jpg",
  pcc: "/images/schemes/scheme-livestock.jpg",
  "e-nwr": "/images/schemes/scheme-income.jpg",
  aif: "/images/schemes/scheme-income.jpg",
  "pm-kisan": "/images/schemes/scheme-income.jpg",
  "mp-cm-kisan": "/images/schemes/scheme-income.jpg",
  "rythu-bandhu": "/images/schemes/scheme-income.jpg",
  rgkny: "/images/schemes/scheme-income.jpg",
  "pm-kmy": "/images/schemes/scheme-income.jpg",
  pmfby: "/images/schemes/scheme-insurance.jpg",
  "cm-accident": "/images/schemes/scheme-insurance.jpg",
  "cm-krishak-sathi": "/images/schemes/scheme-insurance.jpg",
  smam: "/images/schemes/scheme-machinery.jpg",
  "chc-hire": "/images/schemes/scheme-machinery.jpg",
  "crop-residue": "/images/schemes/scheme-machinery.jpg",
  pmksy: "/images/schemes/scheme-irrigation.jpg",
  "agri-pipeline": "/images/schemes/scheme-irrigation.jpg",
  "free-boring": "/images/schemes/scheme-irrigation.jpg",
  "farm-pond": "/images/schemes/scheme-irrigation.jpg",
  "pm-kusum": "/images/schemes/scheme-irrigation.jpg",
  "rj-fencing": "/images/schemes/scheme-climate.jpg",
  "solar-fencing": "/images/schemes/scheme-climate.jpg",
  pmmsy: "/images/schemes/scheme-livestock.jpg",
  ahidf: "/images/schemes/scheme-livestock.jpg",
  nbhm: "/images/schemes/scheme-organic.jpg",
  "bamboo-mission": "/images/schemes/scheme-organic.jpg",
  "midh-polyhouse": "/images/schemes/scheme-organic.jpg",
  "pm-fme": "/images/schemes/scheme-income.jpg",
  "rkvy-raftaar": "/images/schemes/scheme-income.jpg",
  "up-khet-suraksha": "/images/schemes/scheme-climate.jpg",
  "up-nand-baba": "/images/schemes/scheme-livestock.jpg",
  "up-nishulk-boring": "/images/schemes/scheme-irrigation.jpg",
  "rj-kisan-samman-nidhi": "/images/schemes/scheme-income.jpg",
  "rj-gopal-card": "/images/schemes/scheme-kcc.jpg",
  "rj-kisan-mitra-urja": "/images/schemes/scheme-irrigation.jpg",
  "rj-tarbandi": "/images/schemes/scheme-climate.jpg",
  "bihar-krishi-input": "/images/schemes/scheme-insurance.jpg",
  "haryana-pashu-kcc": "/images/schemes/scheme-livestock.jpg",
  "punjab-pani-bachao": "/images/schemes/scheme-irrigation.jpg",
};

export function resolveSchemeImage(scheme: Pick<FarmerScheme, "id" | "category">): string {
  return SCHEME_IMAGE[scheme.id] ?? CATEGORY_IMAGE[scheme.category] ?? CATEGORY_IMAGE.state;
}

export const SCHEMES_HOME_BANNER = "/images/schemes/schemes-hero-cash.jpg";
