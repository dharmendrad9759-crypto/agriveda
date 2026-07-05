export interface Helpline {
  name: string;
  number: string;
  tel: string;
  desc: string;
}

export const KISAN_HELPLINES: Helpline[] = [
  {
    name: "Kisan Call Centre",
    number: "1800-180-1551",
    tel: "18001801551",
    desc: "24×7 — सभी फसल सवाल",
  },
  {
    name: "Kisan Sanchar",
    number: "1551",
    tel: "1551",
    desc: "IVRS — मौसम, mandi, सलाह",
  },
  {
    name: "Soil Health Helpline",
    number: "1800-267-6768",
    tel: "18002676768",
    desc: "मिट्टी परीक्षण जानकारी",
  },
];
