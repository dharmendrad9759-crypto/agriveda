export const PADDY_DISEASES = [
  { id: "blast", name: "Blast", scientific: "Pyricularia oryzae", risk: "high" as const },
  { id: "blb", name: "Bacterial Leaf Blight", scientific: "Xanthomonas oryzae", risk: "high" as const },
  { id: "brown-spot", name: "Brown Spot", scientific: "Cochliobolus miyabeanus", risk: "medium" as const },
  { id: "sheath-blight", name: "Sheath Blight", scientific: "Rhizoctonia solani", risk: "medium" as const },
  { id: "false-smut", name: "False Smut", scientific: "Ustilaginoidea virens", risk: "low" as const },
];

export const BLAST_DETAIL = {
  name: "Blast",
  scientific: "Pyricularia oryzae",
  desc: "Most destructive fungal disease of rice affecting leaves, nodes, neck and panicle.",
  affects: ["Leaves", "Nodes", "Neck", "Panicle"],
  type: "Fungal",
  stage: "Tillering to Grain Filling",
  spread: ["Wind", "Rain splash", "Contaminated seed"],
  symptoms: [
    { name: "Leaf Blast", desc: "Diamond-shaped lesions with gray center" },
    { name: "Node Blast", desc: "Blackened nodes causing stem breakage" },
    { name: "Neck Blast", desc: "Neck rot causing panicle death" },
    { name: "Panicle Blast", desc: "Incomplete grain filling" },
  ],
  conditions: [
    { label: "Temperature", value: "20-28°C" },
    { label: "Humidity", value: ">90%" },
    { label: "Rainfall", value: "Frequent" },
    { label: "Soil", value: "High nitrogen" },
  ],
  cultural: ["Use resistant varieties", "Avoid excess nitrogen", "Maintain proper spacing", "Remove infected debris"],
  products: [
    { name: "Tricyclazole 75% WP", dose: "0.6 g/liter", group: "FRAC 3" },
    { name: "Azoxystrobin 18.2% + Difenoconazole 11.4%", dose: "150 ml/acre", group: "FRAC 3+11" },
    { name: "Isoprothiolane 40% EC", dose: "500 ml/acre", group: "FRAC 29" },
  ],
  expert: { name: "Dr. R. K. Singh", role: "Plant Pathologist, ICAR-IARI", tip: "Regular monitoring during tillering to flowering is critical for blast control." },
};
