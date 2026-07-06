export interface AgroShop {
  id: string;
  name: string;
  distanceKm: number;
  stock: string[];
  phone?: string;
}

const SHOPS: AgroShop[] = [
  {
    id: "s1",
    name: "Ram Beej Bhandar",
    distanceKm: 4.2,
    stock: ["HD-3086 wheat", "P3522 maize", "Mancozeb", "Urea", "DAP"],
    phone: "98765-43210",
  },
  {
    id: "s2",
    name: "Sharma Agro Store",
    distanceKm: 2.8,
    stock: ["Chlorantraniliprole", "Mancozeb", "Tricyclazole", "Imidacloprid"],
    phone: "98123-45678",
  },
  {
    id: "s3",
    name: "Krishi Kendra Supply",
    distanceKm: 6.1,
    stock: ["Certified paddy seed", "Buprofezin", "Zinc sulphate", "Validamycin"],
    phone: "97555-11223",
  },
  {
    id: "s4",
    name: "Verma Fertilizer & Seeds",
    distanceKm: 3.5,
    stock: ["Tomato hybrid", "Neem oil", "Trichoderma", "Boron"],
    phone: "98989-33445",
  },
];

export function findNearestAgroShop(_district: string): AgroShop {
  return SHOPS[Math.floor(Math.random() * 2)] ?? SHOPS[0];
}

export function allAgroShops(): AgroShop[] {
  return SHOPS;
}
