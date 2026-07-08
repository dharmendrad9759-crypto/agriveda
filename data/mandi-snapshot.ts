/** Shared mandi snapshot for home strip + mandi page */
export interface MandiPriceItem {
  crop: string;
  mandi: string;
  price: string;
  trend: "up" | "down" | "stable";
  change: string;
}

export const MANDI_SNAPSHOT: MandiPriceItem[] = [
  { crop: "गेहूँ", mandi: "मेरठ", price: "₹2,350", trend: "stable", change: "MSP" },
  { crop: "धान", mandi: "करनाल", price: "₹4,200", trend: "up", change: "+₹120" },
  { crop: "टमाटर", mandi: "जयपुर", price: "₹2,800", trend: "up", change: "+₹250" },
  { crop: "आलू", mandi: "आगरा", price: "₹1,400", trend: "stable", change: "₹0" },
  { crop: "सरसों", mandi: "बुलंदशहर", price: "₹5,450", trend: "up", change: "+₹180" },
];
