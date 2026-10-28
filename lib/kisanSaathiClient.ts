import type { SaathiContext } from "@/lib/geminiKisanSaathi";

export function clientKisanSaathiFallback(
  userMessage: string,
  context: SaathiContext
): string {
  const q = userMessage.toLowerCase();
  const crop = context.cropName ?? context.cropSlug ?? "aapki fasal";

  if (/peeli|yellow|chlorosis/.test(q)) {
    return `🔍 PEHCHAAN: Peeli pattiyaan — deficiency ya disease ho sakti hai

Pehle check karein: neeche ki purani pattiyaan peeli hain (N ki kami) ya ooper nayi (Zn/Fe/Mg)?

💊 Quick action:
→ N ki kami: Urea 38 kg/acre (21 DAS) — CRI stage
→ Zn ki kami: ZnSO4 21% — 5 kg/acre basal
→ Photo bhejein AI Doctor mein: /ai-doctor

📍 ${crop} | ${context.district ?? "North India"}`;
  }

  if (/spray|sprey|dawai/.test(q)) {
    return `🌦️ SPRAY ADVISORY — ${crop}

Subah 7-9 baje ya shaam 5-7 baje spray best hota hai.
Hawa < 10 km/h, baarish 24h mein nahi honi chahiye.

→ Weather page: /weather/spray-advisory
→ IRAC group rotate karein — ek molecule 2 baar mat lagao
→ PHI hamesha follow karein

Agar kida/bimari ka naam batao to exact dose dunga.`;
  }

  if (/buwai|sowing|beej/.test(q)) {
    return `📅 BUWAI / BEEJ — ${crop}

→ Seed calculator: /services/seed-calculator
→ Buwai samay: /sowing-window
→ Verified North India calendar use karein

${context.district ? `Aapka zila: ${context.district} — iske hisaab se window adjust hoti hai.` : "Profile mein zila set karein."}`;
  }

  if (/khad|urea|dap|fertilizer|poshan/.test(q)) {
    return `🌱 POSHAN — ${crop}

→ Khad calculator: /services/fertilizer-calculator
→ N, P, K + Zn, S sab fasal-wise milega
→ Basal + top-dress split zaroor follow karein

Zinc ${context.state?.toLowerCase().includes("up") || context.state?.toLowerCase().includes("bihar") ? "UP/Bihar ki mitti mein bahut zaroori" : "deficiency history ho to dein"}.`;
  }

  if (/bigha|zameen|jameen|acre|hectare|kattha|kanal|biswa/.test(q)) {
    return `📏 ZAMEEN NAAP / BIGHA CONVERTER

→ Zameen Naap Calculator: /services/land-area-converter
→ UP, Rajasthan, Bihar, Haryana, Punjab, MP ke anusaar Bigha (Pucca/Kachcha), Acre, Hectare, Kattha, Kanal instant convert karein.`;
  }

  if (/kcc|loan|byaj|credit|emi/.test(q)) {
    return `💳 KCC & AGRI LOAN CALCULATOR

→ KCC Calculator: /services/kcc-calculator
→ 7% base mein 3% prompt repayment chhoot se net 4% effective interest aur bachat dekhein.
→ Tractor, Dairy, Solar Pump EMI calculator bhi available hai.`;
  }

  if (/tractor|rotavator|seeder|diesel|harrow/.test(q)) {
    return `🚜 TRACTOR HP & DIESEL CALCULATOR

→ Tractor Matching Calculator: /services/tractor-hp-calculator
→ HP (25–65+ HP), 2WD/4WD aur mitti ke anusaar sahi Rotavator, Cultivator, Super Seeder aur diesel khapat dekhein.`;
  }

  return `🌾 Kisan Saathi — ${crop}

Aapki baat: "${userMessage.slice(0, 100)}"

📍 ${[context.village, context.district, context.state].filter(Boolean).join(", ") || "Location profile mein add karein"}

Abhi server se AI slow hai — ye quick guide hai:
• Photo diagnosis → AI Doctor
• Lakshan se khoj → Pest Solver  
• Khad plan → Fertilizer Calculator
• Beej matra → Seed Calculator

Sawal specific likhein (jaise "tomato mein safed makkhi") — poora ILAJ format mein jawab milega.`;
}
