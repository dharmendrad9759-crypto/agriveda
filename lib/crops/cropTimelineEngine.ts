import { getBuwaiForSlug, pickBuwaiRegion } from "@/data/agriveda2/buwai-data";
import { formatSowingCard } from "@/lib/crops/cropAgroMeta";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getResearchDossier } from "@/lib/crops/researchDossierBridge";

export interface CropTimelineGuidance {
  days: number | null;
  hasSowingDate: boolean;
  sowingDateFormatted: string;
  optimalWindow: string;
  stageName: string;
  stageSubtitle: string;
  stageProgressPct: number;
  todayTask: {
    title: string;
    details: string;
    priority: "high" | "normal";
  };
  fertilizer: {
    isDueNow: boolean;
    badge: string;
    title: string;
    dose: string;
    tip: string;
    nextDueNote?: string;
  };
  speechScript: string;
}

/** Get official / optimum sowing window for farmer display */
export function getOptimalSowingWindow(slug: string, isHi: boolean): string {
  const buwai = getBuwaiForSlug(slug);
  if (buwai) {
    const region = pickBuwaiRegion(buwai, "UP/Bihar/Jharkhand");
    const firstWin = region.windows[0];
    if (firstWin) {
      const monthNames = isHi
        ? ["", "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"]
        : ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const start = `${firstWin.startDay} ${monthNames[firstWin.startMonth]}`;
      const end = `${firstWin.endDay} ${monthNames[firstWin.endMonth]}`;
      return `${start} – ${end}`;
    }
  }

  const agroWindow = formatSowingCard(slug, "");
  if (agroWindow) {
    // If it has English notes, provide clean Hindi range
    if (isHi) {
      if (slug.includes("wheat") || slug.includes("gehun")) return "25 अक्टूबर – 15 नवंबर";
      if (slug.includes("maize") || slug.includes("makka")) return "15 जून – 15 जुलाई (खरीफ) / 15 जन – 28 फर (बसंत)";
      if (slug.includes("paddy") || slug.includes("dhan")) return "15 जून – 15 जुलाई";
      if (slug.includes("mustard") || slug.includes("sarson")) return "1 – 25 अक्टूबर";
      if (slug.includes("potato") || slug.includes("alu")) return "15 अक्टूबर – 5 नवंबर";
      if (slug.includes("chana") || slug.includes("gram")) return "15 अक्टूबर – 15 नवंबर";
      if (slug.includes("cotton") || slug.includes("kapas")) return "15 अप्रैल – 15 मई";
    }
    return agroWindow.split("(")[0]?.trim() || agroWindow;
  }

  return isHi ? "मौसम अनुसार उचित समय पर" : "Timely as per regional season";
}

/** Calculate days since sowing date string (supports ISO YYYY-MM-DD or readable dates) */
export function calculateDaysSince(dateStr: string | undefined): number | null {
  if (!dateStr || !dateStr.trim()) return null;
  const sown = new Date(dateStr);
  if (Number.isNaN(sown.getTime())) return null;
  sown.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - sown.getTime()) / 86_400_000);
  return diff >= 0 ? diff : 0;
}

/** Format ISO date into clean farmer Hindi string (e.g. 1 नवंबर 2024) */
export function formatFarmerDate(dateStr: string | undefined, isHi: boolean): string {
  if (!dateStr || !dateStr.trim()) return isHi ? "तारीख नहीं डाली" : "No date set";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: isHi ? "long" : "short",
    year: "numeric",
  });
}

/** Complete agricultural timeline engine for any crop based on days elapsed */
export function getCropTimelineGuidance(opts: {
  cropSlug?: string;
  cropName: string;
  sowingDate?: string;
  isHi: boolean;
}): CropTimelineGuidance {
  const { cropSlug = "", cropName, sowingDate, isHi } = opts;
  const slug = cropSlug.trim().toLowerCase();
  const days = calculateDaysSince(sowingDate);
  const hasSowingDate = days !== null;
  const optimalWindow = getOptimalSowingWindow(slug, isHi);
  const hindiName = getCropHindiName(slug) || cropName;
  const displayName = isHi ? hindiName : cropName;
  const sowingDateFormatted = formatFarmerDate(sowingDate, isHi);

  // If no date set yet:
  if (!hasSowingDate) {
    return {
      days: null,
      hasSowingDate: false,
      sowingDateFormatted,
      optimalWindow,
      stageName: isHi ? "बुवाई की तारीख दर्ज करें" : "Set Sowing Date",
      stageSubtitle: isHi ? `उत्तम बुवाई समय: ${optimalWindow}` : `Optimal window: ${optimalWindow}`,
      stageProgressPct: 0,
      todayTask: {
        title: isHi ? "बुवाई की तारीख जोड़ें" : "Enter Sowing Date",
        details: isHi
          ? `तारीख जोड़ते ही फसल के कुल दिन, आज का जरूरी काम और सही खाद की मात्रा खुद दिखेगी।`
          : "Add sowing date to see exact day count, today's task, and fertilizer advice.",
        priority: "normal",
      },
      fertilizer: {
        isDueNow: false,
        badge: isHi ? "तारीख प्रतीक्षित" : "Date Needed",
        title: isHi ? "बुवाई के अनुसार खाद सलाह" : "Fertilizer Schedule",
        dose: isHi ? "तारीख दर्ज करने पर सटीक खुराक दिखेगी" : "Enter sowing date to unlock dosage",
        tip: isHi
          ? `सामान्य नियम: ${displayName} में बेसल खाद बुवाई के समय DAP/NPK और जिंक के साथ दी जाती है।`
          : "Basal fertilizer is typically applied at sowing with DAP/NPK & Zinc.",
      },
      speechScript: isHi
        ? `${displayName} की बुवाई तारीख दर्ज करें ताकि सही समय पर काम और खाद की सलाह मिल सके।`
        : `Please set sowing date for ${displayName} to get stage-wise guidance.`,
    };
  }

  // WHEAT / गेहूँ
  if (slug.includes("wheat") || slug.includes("gehun")) {
    if (days <= 20) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "अंकुरण व जड़ स्थापना" : "Germination & Crown Root Prep",
        stageSubtitle: isHi ? "0–20 दिन · पौधे स्थापित होने का समय" : "Days 0–20",
        stageProgressPct: 15,
        todayTask: {
          title: isHi ? "एकसमान अंकुरण व नमी की जाँच" : "Check germination uniformity",
          details: isHi
            ? "खेत में जहाँ बीज कम जमे हों वहाँ गैप भरें। खेत में जलभराव न होने दें, 21 दिन पर पहली सिंचाई होगी।"
            : "Monitor germination uniformity and avoid water stagnation.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: false,
          badge: isHi ? "ℹ️ इस हफ्ते कोई खाद नहीं" : "No fertilizer due",
          title: isHi ? "अभी कोई खाद न डालें" : "Basal already applied",
          dose: isHi ? "बुवाई के समय बेसल (DAP/NPK) दिया जा चुका है।" : "Basal dose active",
          tip: isHi
            ? "अगली खाद: 21–25 दिन पर पहली सिंचाई (CRI) के साथ यूरिया पहली खुराक (30–35 kg) + जिंक डलेगी।"
            : "Next fertilizer: Day 21–25 with 1st irrigation.",
          nextDueNote: isHi ? `अगली खाद: ${Math.max(1, 21 - days)} दिन बाद (CRI अवस्था पर)` : `Next in ${Math.max(1, 21 - days)} days`,
        },
        speechScript: isHi
          ? `गेहूँ में बुवाई के ${days} दिन हो चुके हैं। अंकुरण अवस्था है। 21 दिन पर पहली सिंचाई के साथ यूरिया डलेगी, अभी कोई खाद न डालें।`
          : `Wheat at Day ${days}. First irrigation due at Day 21 with Urea.`,
      };
    }

    if (days <= 25) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "क्राउन रूट (CRI अवस्था) — सबसे नाज़ुक समय" : "Crown Root Initiation (CRI)",
        stageSubtitle: isHi ? "21–25 दिन · कल्ले व जड़ें तय करने का समय" : "Days 21–25 · Critical",
        stageProgressPct: 22,
        todayTask: {
          title: isHi ? "पहली सिंचाई (CRI) — यह पैदावार तय करने वाली सबसे महत्वपूर्ण सिंचाई है!" : "1st Irrigation (CRI)",
          details: isHi
            ? "21 से 25 दिन पर पहली हल्की सिंचाई ज़रूर करें। पानी की कमी से कल्ले नहीं फूटेंगे और पैदावार घट जाएगी।"
            : "Timely 1st irrigation at 21–25 days is critical for tillering and yield.",
          priority: "high",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 अभी खाद का समय" : "Fertilizer Due Now",
          title: isHi ? "यूरिया पहली टॉप-ड्रेसिंग + जिंक सल्फेट" : "Urea 1st Top Dressing",
          dose: isHi ? "30–35 kg यूरिया/एकड़ + 5 kg जिंक सल्फेट (21%)" : "30–35 kg Urea/acre + Zinc",
          tip: isHi
            ? "सिंचाई के 2–3 दिन बाद जब ज़मीन में पैर टिकने लगे तब शाम के समय नमी में यूरिया बखेरें।"
            : "Broadcast Urea in moist soil 2-3 days after irrigation.",
          nextDueNote: isHi ? "अगली खाद: 40–45 दिन पर (गांठ बनते समय)" : "Next dose at Day 40–45",
        },
        speechScript: isHi
          ? `गेहूँ में बुवाई के ${days} दिन हो चुके हैं। यह CRI अवस्था है। पहली सिंचाई के साथ यूरिया 35 किलो और जिंक 5 किलो प्रति एकड़ अवश्य डालें।`
          : `Wheat at Day ${days}. CRI stage. Apply first dose of Urea with irrigation.`,
      };
    }

    if (days <= 40) {
      const nextDue = Math.max(1, 42 - days);
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "कल्ले फूटना (Tillering) व बढ़वार" : "Active Tillering",
        stageSubtitle: isHi ? "26–40 दिन · कल्ले फूटने का समय" : "Days 26–40",
        stageProgressPct: 35,
        todayTask: {
          title: isHi ? "खरपतवार नियंत्रण (गुल्ली-डंडा / बथुआ निकालें)" : "Weed Management",
          details: isHi
            ? "30–35 दिन पर खरपतवार की रोकथाम बहुत ज़रूरी है। पीला रतुआ (हल्दी रोग) के लिए पत्तियों की निचली सतह देखें।"
            : "Control weeds like Phalaris minor and check for early yellow rust signs.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: false,
          badge: isHi ? "ℹ️ इस हफ्ते कोई खाद नहीं" : "No fertilizer due",
          title: isHi ? "अभी कोई नई खाद न डालें" : "Current nutrition sufficient",
          dose: isHi ? "CRI पर दी गई पहली टॉप-ड्रेसिंग अभी पौधों को पोषण दे रही है।" : "First dose active",
          tip: isHi
            ? "इस समय केवल खरपतवार नियंत्रण व धूप पर ध्यान दें। अगली खाद दूसरी सिंचाई (42–45 दिन) पर डलेगी।"
            : "Next fertilizer dose will be at jointing with 2nd irrigation.",
          nextDueNote: isHi ? `अगली खाद: ${nextDue} दिन बाद (42–45वें दिन गांठ बनते समय)` : `Next in ${nextDue} days`,
        },
        speechScript: isHi
          ? `गेहूँ में बुवाई के ${days} दिन हो चुके हैं। कल्ले फूट रहे हैं। इस हफ्ते कोई खाद नहीं डालनी है, खरपतवार साफ़ रखें। अगली खाद ${nextDue} दिन बाद डलेगी।`
          : `Wheat at Day ${days}. Tillering stage. No fertilizer needed this week. Next dose in ${nextDue} days.`,
      };
    }

    if (days <= 55) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "गाभा / गांठ बनना (Jointing Stage)" : "Stem Elongation / Jointing",
        stageSubtitle: isHi ? "41–55 दिन · तना बढ़वार" : "Days 41–55",
        stageProgressPct: 50,
        todayTask: {
          title: isHi ? "दूसरी सिंचाई व पीला रतुआ की सघन जाँच" : "2nd Irrigation & Rust Check",
          details: isHi
            ? "गांठ बनते समय पौधों को पानी दें। पत्ती पर पीला चूर्ण दिखे तो तुरंत प्रोपिकोनाजोल (200 ml/एकड़) का स्प्रे करें।"
            : "Apply 2nd irrigation and monitor closely for yellow rust powdery stripes.",
          priority: "high",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 अभी खाद का समय" : "Fertilizer Due Now",
          title: isHi ? "यूरिया की दूसरी व अंतिम टॉप-ड्रेसिंग" : "Urea 2nd & Final Top Dressing",
          dose: isHi ? "25–30 kg यूरिया/एकड़" : "25–30 kg Urea/acre",
          tip: isHi
            ? "यह यूरिया की आखिरी खुराक है। इसके बाद ज़मीन में यूरिया न डालें, वरना फसल की लंबाई ज़्यादा होकर गिर सकती है।"
            : "Final soil Urea application. Avoid late nitrogen to prevent lodging.",
          nextDueNote: isHi ? "अगली खुराक: 65–70 दिन पर 0:52:34 पत्ती स्प्रे" : "Next: Foliar spray at booting",
        },
        speechScript: isHi
          ? `गेहूँ में ${days} दिन हो चुके हैं। गांठ बन रही है। दूसरी सिंचाई के साथ यूरिया 30 किलो प्रति एकड़ अंतिम खुराक दें।`
          : `Wheat at Day ${days}. Jointing stage. Apply second and final urea dose.`,
      };
    }

    if (days <= 80) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "बाली निकलना (Booting / Heading)" : "Booting & Heading",
        stageSubtitle: isHi ? "56–80 दिन · बाली बनने का समय" : "Days 56–80",
        stageProgressPct: 70,
        todayTask: {
          title: isHi ? "तीसरी सिंचाई व माहू (चेपा) निगरानी" : "3rd Irrigation & Aphid Watch",
          details: isHi
            ? "बाली निकलते समय खेत में नमी रहनी चाहिए। तेज़ हवा चलने के समय सिंचाई न करें ताकि फसल गिरे नहीं।"
            : "Maintain moisture at heading. Avoid irrigating in high winds to prevent lodging.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 पत्ती स्प्रे का समय" : "Foliar Spray Due",
          title: isHi ? "NPK 0:52:34 स्प्रे (बाली पोषण)" : "NPK 0:52:34 Foliar Spray",
          dose: isHi ? "1 kg NPK 0:52:34 को 150 लीटर पानी में प्रति एकड़" : "1 kg 0:52:34 / 150L water/acre",
          tip: isHi
            ? "बाली की लंबाई और दानों की संख्या बढ़ाने के लिए दोपहर बाद शांत मौसम में स्प्रे करें।"
            : "Spray foliar potassium and phosphorus to maximize grain count.",
          nextDueNote: isHi ? "अगली खाद: दाना भरते समय 0:0:50 स्प्रे" : "Next: 0:0:50 at milking",
        },
        speechScript: isHi
          ? `गेहूँ में बुवाई के ${days} दिन हो गए हैं। बाली निकल रही है। NPK 0:52:34 का स्प्रे करें और हवा न चलने पर ही पानी दें।`
          : `Wheat at Day ${days}. Heading stage. Spray NPK 0:52:34.`,
      };
    }

    if (days <= 105) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "दूधिया व दाना भराव (Milking / Dough)" : "Milk & Dough Stage",
        stageSubtitle: isHi ? "81–105 दिन · दाने में वज़न बनने का समय" : "Days 81–105",
        stageProgressPct: 85,
        todayTask: {
          title: isHi ? "हल्की सिंचाई (तेज धूप/हवा में दाना न सिकुड़े)" : "Light Irrigation for Grain Filling",
          details: isHi
            ? "दूधिया अवस्था में हल्की सिंचाई करें ताकि दाना मोटा और चमकदार बने। तेज़ हवा में पानी बिल्कुल न दें।"
            : "Light irrigation ensures plump grain fill. Do not irrigate on windy days.",
          priority: "high",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 पोटाश स्प्रे (वज़न व चमक)" : "Potash Foliar",
          title: isHi ? "0:0:50 (पोटैशियम सल्फेट) स्प्रे" : "SOP 0:0:50 Foliar Spray",
          dose: isHi ? "1 kg 0:0:50 / 150 लीटर पानी में" : "1 kg 0:0:50 / 150L water",
          tip: isHi
            ? "पोटाश स्प्रे से दाना वजनदार, सुडौल बनता है और पछुआ हवा की गर्मी से दाना सिकुड़ने से बचता है।"
            : "Protects against terminal heat stress and improves grain weight.",
          nextDueNote: isHi ? "इसके बाद खाद चक्र पूर्ण हो जाएगा" : "Final fertilizer treatment",
        },
        speechScript: isHi
          ? `गेहूँ में दाना भर रहा है, ${days} दिन हो चुके हैं। 0:0:50 का पोटाश स्प्रे करें ताकि दाना मोटा और चमकदार बने।`
          : `Wheat grain filling at Day ${days}. Apply 0:0:50 spray for grain weight.`,
      };
    }

    // Maturity
    return {
      days,
      hasSowingDate: true,
      sowingDateFormatted,
      optimalWindow,
      stageName: isHi ? "दाना पकना व कटाई (Maturity)" : "Maturity & Harvest",
      stageSubtitle: isHi ? "106+ दिन · कटाई की तैयारी" : "Days 106+ · Ready to Harvest",
      stageProgressPct: 100,
      todayTask: {
        title: isHi ? "सिंचाई पूरी तरह बंद करें व कटाई की तैयारी" : "Stop Irrigation & Prepare Harvest",
        details: isHi
          ? "बालियां सुनहरी पीली होने पर कटाई करें। कटाई के बाद खेत में 2 दिन सुखाकर गहाई करें।"
          : "Harvest when grain moisture drops to 14–18%.",
        priority: "normal",
      },
      fertilizer: {
        isDueNow: false,
        badge: isHi ? "✓ खाद चक्र पूर्ण" : "Fertilizer Complete",
        title: isHi ? "फसल पक चुकी है — कोई खाद नहीं" : "No more fertilizer",
        dose: isHi ? "अब किसी खाद या दवा की आवश्यकता नहीं है।" : "Harvest stage",
        tip: isHi ? "मौसम साफ़ रहने पर समय पर कटाई करें ताकि दाना न झड़े।" : "Harvest in dry weather.",
      },
      speechScript: isHi
        ? `गेहूँ की फसल पक चुकी है, बुवाई के ${days} दिन हो चुके हैं। अब किसी खाद की आवश्यकता नहीं है, कटाई की तैयारी करें।`
        : `Wheat is fully mature at Day ${days}. Prepare for harvest.`,
    };
  }

  // MAIZE / मक्का
  if (slug.includes("maize") || slug.includes("makka") || slug.includes("corn")) {
    if (days <= 20) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "अंकुरण व 2–4 पत्ती अवस्था (Seedling)" : "Seedling & Emergence",
        stageSubtitle: isHi ? "0–20 दिन · पौधे स्थापित होने का समय" : "Days 0–20",
        stageProgressPct: 18,
        todayTask: {
          title: isHi ? "पौधों का एकसमान जमाव व फॉल आर्मीवॉर्म निगरानी" : "Check Emergence & FAW",
          details: isHi
            ? "पत्तियों के गोफ (व्होर्ल) में बारीक छेद देखें। खेत में जलभराव न होने दें, जड़ सड़ सकती है।"
            : "Scout for Fall Armyworm pinholes in whorls. Ensure good drainage.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: false,
          badge: isHi ? "ℹ️ इस हफ्ते कोई खाद नहीं" : "No fertilizer due",
          title: isHi ? "अभी कोई खाद न दें" : "Basal active",
          dose: isHi ? "बुवाई के समय बेसल (DAP/NPK + जिंक) दिया जा चुका है।" : "Basal dose active",
          tip: isHi
            ? "अगली खाद: 25–30 दिन बाद घुटना ऊँचाई अवस्था पर यूरिया (30–35 kg/एकड़) डलेगी।"
            : "Next dose: Knee-high stage at Day 25–30.",
          nextDueNote: isHi ? `अगली खाद: ${Math.max(1, 25 - days)} दिन बाद (घुटना अवस्था पर)` : `Next in ${Math.max(1, 25 - days)} days`,
        },
        speechScript: isHi
          ? `मक्का में बुवाई के ${days} दिन हो चुके हैं। अंकुरण अवस्था है। अभी कोई खाद नहीं डालनी है।`
          : `Maize at Day ${days}. Seedling stage. Next fertilizer at knee-high.`,
      };
    }

    if (days <= 35) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "घुटना ऊँचाई अवस्था (Knee-high V6)" : "Knee-high Stage (V6)",
        stageSubtitle: isHi ? "21–35 दिन · तीव्र वृद्धि का समय" : "Days 21–35",
        stageProgressPct: 35,
        todayTask: {
          title: isHi ? "निराई-गुड़ाई व पौधों पर हल्की मिट्टी चढ़ाना" : "Interculture & Earthing Up",
          details: isHi
            ? "खरपतवार निकालें और पौधों की जड़ों पर हल्की मिट्टी चढ़ाएं ताकि पौधा गिरे नहीं। गोफ में कीड़ा देखें।"
            : "Weed and earth up to support roots. Check for stem borers and FAW.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 अभी खाद का समय" : "Fertilizer Due Now",
          title: isHi ? "यूरिया पहली टॉप-ड्रेसिंग (घुटना अवस्था)" : "Urea 1st Top Dressing",
          dose: isHi ? "30–35 kg यूरिया प्रति एकड़" : "30–35 kg Urea/acre",
          tip: isHi
            ? "पौधों से 5–7 सेमी दूर कतारों में डालें, सीधे गोफ में न गिरे। डालने के बाद हल्की सिंचाई करें।"
            : "Band apply urea 5-7cm away from plants in moist soil.",
          nextDueNote: isHi ? "अगली खाद: 50–55 दिन पर (नर मंजरी / टैसेलिंग पर)" : "Next at Day 50–55",
        },
        speechScript: isHi
          ? `मक्का में बुवाई के ${days} दिन हो चुके हैं। घुटना ऊँचाई अवस्था है। यूरिया 35 किलो प्रति एकड़ कतारों में डालें।`
          : `Maize at Day ${days}. Knee-high stage. Apply urea top-dressing.`,
      };
    }

    if (days <= 49) {
      const nextDue = Math.max(1, 50 - days);
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "तीव्र बढ़वार व 8 से 10 पत्तियाँ (V8–V10)" : "Grand Growth Stage (V8–V10)",
        stageSubtitle: isHi ? "36–49 दिन · मंजरी निकलने से पहले" : "Days 36–49",
        stageProgressPct: 48,
        todayTask: {
          title: isHi ? "नमी की जाँच और फॉल आर्मीवॉर्म (कीट) की सघन निगरानी" : "Check Moisture & Scout FAW",
          details: isHi
            ? "तेज़ बढ़वार का समय है। खेत में नमी कम न होने दें। गोफ में कीड़े का मल दिखे तो तुरंत स्प्रे करें।"
            : "Ensure steady soil moisture and scout leaves for Fall Armyworm damage.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: false,
          badge: isHi ? "ℹ️ इस हफ्ते कोई खाद नहीं" : "No fertilizer due",
          title: isHi ? "इस हफ्ते कोई खाद नहीं डालनी" : "No fertilizer this week",
          dose: isHi ? "घुटना अवस्था की पहली खुराक मिल चुकी है, अभी फसल बढ़वार ले रही है।" : "Previous dose active",
          tip: isHi
            ? `अगली खाद: ${nextDue} दिन बाद (50वें दिन) नर मंजरी (टैसेलिंग) निकलते समय यूरिया की दूसरी खुराक (25 kg/एकड़) डलेगी।`
            : `Next fertilizer due in ${nextDue} days at tasseling stage.`,
          nextDueNote: isHi ? `अगली खाद: ${nextDue} दिन बाद (टैसेलिंग / नर मंजरी अवस्था पर)` : `Next in ${nextDue} days at tasseling`,
        },
        speechScript: isHi
          ? `मक्का में बुवाई के ${days} दिन हो गए हैं। इस हफ्ते कोई खाद नहीं डालनी है। अगली खाद ${nextDue} दिन बाद टैसेलिंग अवस्था पर डलेगी।`
          : `Maize at Day ${days}. No fertilizer needed this week. Next dose in ${nextDue} days at tasseling.`,
      };
    }

    if (days <= 65) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "नर मंजरी (टैसेलिंग) व भुट्टे में सिल्क निकलना" : "Tasseling & Silking Stage",
        stageSubtitle: isHi ? "50–65 दिन · पैदावार तय करने वाला मुख्य समय" : "Days 50–65 · Peak Critical",
        stageProgressPct: 62,
        todayTask: {
          title: isHi ? "सिंचाई सबसे ज़रूरी (पानी की कमी बिल्कुल न होने दें)" : "Critical Irrigation Window",
          details: isHi
            ? "इस समय पानी की कमी होने से परागण खराब होता है और भुट्टे में दाने नहीं भरते (40% तक नुकसान)। खेत में नमी बनाए रखें।"
            : "Moisture stress at tasseling can reduce yield by up to 40%. Irrigate regularly.",
          priority: "high",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 अभी खाद का समय" : "Fertilizer Due Now",
          title: isHi ? "यूरिया दूसरी खुराक + बोरॉन स्प्रे" : "Urea 2nd Dose + Boron Spray",
          dose: isHi ? "यूरिया 25 kg/एकड़ + बोरॉन (20%) 1 gm/लीटर पानी में स्प्रे" : "25 kg Urea/acre + Boron 1g/L",
          tip: isHi
            ? "टैसेलिंग अवस्था पर बोरॉन व यूरिया देने से भुट्टे में ऊपर सिरे तक पूरे और मोटे दाने भरते हैं।"
            : "Boron improves pollination and ensures full grain set up to cob tip.",
          nextDueNote: isHi ? "अगली खाद: दाना भरते समय 0:0:50 पोटाश स्प्रे" : "Next: SOP spray at grain filling",
        },
        speechScript: isHi
          ? `मक्का में बुवाई के ${days} दिन हो चुके हैं। नर मंजरी निकल रही है। पानी की कमी न होने दें और यूरिया 25 किलो के साथ बोरॉन स्प्रे करें।`
          : `Maize at Day ${days}. Tasseling stage. Maintain irrigation and apply second urea dose.`,
      };
    }

    if (days <= 85) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "भुट्टे में दाना भराव (Milk to Dough)" : "Grain Filling (Milk-Dough)",
        stageSubtitle: isHi ? "66–85 दिन · दानों में वज़न का समय" : "Days 66–85",
        stageProgressPct: 80,
        todayTask: {
          title: isHi ? "दाना भराव व तना सड़न से बचाव" : "Grain Fill & Stalk Health",
          details: isHi
            ? "खेत में जलभराव न होने दें। भुट्टे पर पक्षियों व कीटों से सुरक्षा रखें और हल्की नमी बनाए रखें।"
            : "Prevent waterlogging to stop stalk rot. Protect cobs from pests and birds.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 पोटाश स्प्रे (वज़न व चमक)" : "Foliar Potash Due",
          title: isHi ? "0:0:50 (पोटैशियम सल्फेट) स्प्रे" : "0:0:50 Foliar Spray",
          dose: isHi ? "1 kg 0:0:50 / 150 लीटर पानी में प्रति एकड़" : "1 kg 0:0:50 / 150L water",
          tip: isHi
            ? "दाने का वज़न, आकार और चमक बढ़ाने के लिए यह स्प्रे बहुत लाभकारी होता है।"
            : "Enhances cob grain weight and test weight.",
          nextDueNote: isHi ? "इसके बाद खाद चक्र पूर्ण हो जाएगा" : "Final dose of season",
        },
        speechScript: isHi
          ? `मक्का में भुट्टा भर रहा है, ${days} दिन हो चुके हैं। 0:0:50 पोटाश का स्प्रे करें ताकि दाने मोटे और चमकदार बनें।`
          : `Maize grain filling at Day ${days}. Apply 0:0:50 foliar spray.`,
      };
    }

    // Maize Maturity
    return {
      days,
      hasSowingDate: true,
      sowingDateFormatted,
      optimalWindow,
      stageName: isHi ? "दाना पकना व भुट्टा तुड़ाई (Maturity)" : "Maturity & Harvest",
      stageSubtitle: isHi ? "86+ दिन · भुट्टा तुड़ाई" : "Days 86+ · Harvest Ready",
      stageProgressPct: 100,
      todayTask: {
        title: isHi ? "भुट्टे के छिलके सूखने पर तुड़ाई" : "Harvest Cobs when Husks Dry",
        details: isHi
          ? "भुट्टे के छिलके भूरे और सूख जाने पर तुड़ाई करें। तुड़ाई के बाद धूप में 3–4 दिन सुखाकर दाना निकालें।"
          : "Harvest when cob husks turn straw brown. Dry in sunlight to 12-14% moisture.",
        priority: "normal",
      },
      fertilizer: {
        isDueNow: false,
        badge: isHi ? "✓ खाद चक्र पूर्ण" : "Fertilizer Complete",
        title: isHi ? "फसल पक चुकी है — खाद की आवश्यकता नहीं" : "No more fertilizer",
        dose: isHi ? "कटाई व सुखाने पर ध्यान दें।" : "Harvest stage",
        tip: isHi ? "मौसम साफ़ देखकर तुड़ाई करें।" : "Harvest in sunny weather.",
      },
      speechScript: isHi
        ? `मक्का की फसल पक चुकी है, बुवाई के ${days} दिन हो चुके हैं। अब खाद की ज़रूरत नहीं है, भुट्टा तुड़ाई की तैयारी करें।`
        : `Maize is ready for harvest at Day ${days}. No more fertilizer needed.`,
    };
  }

  // PADDY / धान
  if (slug.includes("paddy") || slug.includes("dhan") || slug.includes("rice")) {
    if (days <= 20) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "रोपाई व स्थापना अवस्था" : "Transplanting & Establishment",
        stageSubtitle: isHi ? "0–20 दिन" : "Days 0–20",
        stageProgressPct: 18,
        todayTask: {
          title: isHi ? "खेत में 2–3 सेमी पानी बनाए रखें व गैप भरें" : "Maintain 2-3cm water & fill gaps",
          details: isHi ? "मरे हुए पौधों की जगह नए पौधे लगाएं। खेत में लगातार 2-3 सेमी पानी बनाए रखें।" : "Keep standing water.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: false,
          badge: isHi ? "ℹ️ इस हफ्ते कोई खाद नहीं" : "No fertilizer due",
          title: isHi ? "अभी कोई खाद न दें" : "Basal active",
          dose: isHi ? "रोपाई के समय बेसल दिया जा चुका है।" : "Basal dose active",
          tip: isHi ? "अगली खाद: 21–25 दिन पर कल्ले फूटते समय यूरिया + जिंक सल्फेट डलेगी।" : "Next: Urea + Zinc at tillering.",
          nextDueNote: isHi ? `अगली खाद: ${Math.max(1, 21 - days)} दिन बाद` : `Next in ${Math.max(1, 21 - days)} days`,
        },
        speechScript: isHi ? `धान में रोपाई के ${days} दिन हो गए हैं। 21 दिन पर यूरिया और जिंक डलेगी, अभी कोई खाद न डालें।` : `Paddy at Day ${days}.`,
      };
    }
    if (days <= 40) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "सक्रिय कल्ले फूटना (Tillering)" : "Active Tillering",
        stageSubtitle: isHi ? "21–40 दिन · कल्ले बढ़ाने का समय" : "Days 21–40",
        stageProgressPct: 35,
        todayTask: {
          title: isHi ? "तना छेदक व पत्ती लपेटक की निगरानी" : "Stem Borer & Leaf Folder Watch",
          details: isHi ? "पत्ती पर सफेद धारियां या सूखा गोफ (डेड हार्ट) देखें। 3–4 सेमी पानी बनाए रखें।" : "Scout for dead hearts.",
          priority: "high",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 अभी खाद का समय" : "Fertilizer Due Now",
          title: isHi ? "यूरिया पहली टॉप-ड्रेसिंग + जिंक सल्फेट" : "Urea 1st Top Dressing + Zinc",
          dose: isHi ? "30 kg यूरिया + 5 kg जिंक सल्फेट (21%) प्रति एकड़" : "30 kg Urea + 5 kg Zinc/acre",
          tip: isHi ? "खेत से अतिरिक्त पानी कम करके नमी में यूरिया बखेरें।" : "Broadcast in moist soil.",
          nextDueNote: isHi ? "अगली खाद: 50–55 दिन पर (गभोटा अवस्था)" : "Next at panicle initiation",
        },
        speechScript: isHi ? `धान में कल्ले फूट रहे हैं, ${days} दिन हो गए हैं। यूरिया 30 किलो और जिंक 5 किलो प्रति एकड़ डालें।` : `Paddy tillering at Day ${days}.`,
      };
    }
    if (days <= 65) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "गभोटा / बाली बनना (Panicle Initiation)" : "Panicle Initiation",
        stageSubtitle: isHi ? "41–65 दिन · बाली बनने का समय" : "Days 41–65",
        stageProgressPct: 60,
        todayTask: {
          title: isHi ? "शीथ ब्लाइट व गभोटा अवस्था में पानी प्रबंधन" : "Water Management & Sheath Blight",
          details: isHi ? "इस समय खेत कभी सूखना नहीं चाहिए। शीथ ब्लाइट (तने पर भूरे धब्बे) दिखे तो दवा स्प्रे करें।" : "Ensure continuous moisture.",
          priority: "high",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 अभी खाद का समय" : "Fertilizer Due Now",
          title: isHi ? "यूरिया अंतिम टॉप-ड्रेसिंग + 0:52:34" : "Final Urea + 0:52:34",
          dose: isHi ? "20–25 kg यूरिया/एकड़ या 0:52:34 (1 kg/एकड़) स्प्रे" : "20–25 kg Urea or 0:52:34 foliar",
          tip: isHi ? "बाली लंबी और दानों से भरी होने के लिए यह खुराक बहुत महत्वपूर्ण है।" : "Improves panicle size.",
          nextDueNote: isHi ? "अगली खाद: दूधिया अवस्था पर 0:0:50 स्प्रे" : "Next: 0:0:50 at milking",
        },
        speechScript: isHi ? `धान में गभोटा अवस्था है, ${days} दिन हो चुके हैं। अंतिम यूरिया खुराक या 0:52:34 स्प्रे करें।` : `Paddy panicle initiation.`,
      };
    }
    // Milking to harvest
    return {
      days,
      hasSowingDate: true,
      sowingDateFormatted,
      optimalWindow,
      stageName: isHi ? "दूधिया दाना व पकना (Milking to Maturity)" : "Milking to Harvest",
      stageSubtitle: isHi ? "66+ दिन" : "Days 66+",
      stageProgressPct: Math.min(100, Math.round((days / 110) * 100)),
      todayTask: {
        title: isHi ? "गंधी बग कीट की जाँच व कटाई पूर्व पानी निकासी" : "Gandhi Bug Scout & Drainage",
        details: isHi ? "कटाई से 10–12 दिन पहले खेत का पानी निकाल दें ताकि ज़मीन सूख जाए और कटाई आसान हो।" : "Drain field 10 days before harvest.",
        priority: "normal",
      },
      fertilizer: {
        isDueNow: days <= 85,
        badge: days <= 85 ? (isHi ? "🌿 पोटाश स्प्रे" : "Potash Spray") : (isHi ? "✓ खाद चक्र पूर्ण" : "Complete"),
        title: days <= 85 ? (isHi ? "0:0:50 पोटाश स्प्रे (दाना चमक)" : "0:0:50 Spray") : (isHi ? "खाद चक्र पूर्ण" : "Complete"),
        dose: days <= 85 ? (isHi ? "1 kg 0:0:50 प्रति एकड़" : "1 kg/acre") : (isHi ? "कोई खाद नहीं" : "None"),
        tip: isHi ? "दाने का वजन और चमक बढ़ाने के लिए।" : "Grain luster.",
      },
      speechScript: isHi ? `धान में दाना भर रहा है, ${days} दिन हो चुके हैं। कटाई पूर्व पानी निकासी सुनिश्चित करें।` : `Paddy ripening.`,
    };
  }

  // MUSTARD / सरसों
  if (slug.includes("mustard") || slug.includes("sarson")) {
    if (days <= 25) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "अंकुरण व विरलीकरण (Thinning)" : "Emergence & Thinning",
        stageSubtitle: isHi ? "0–25 दिन" : "Days 0–25",
        stageProgressPct: 20,
        todayTask: {
          title: isHi ? "विरलीकरण (घने पौधों को उखाड़कर 12 सेमी दूरी बनाएं)" : "Thinning to 12cm",
          details: isHi ? "पौधों के बीच 10–12 सेमी दूरी रखें। घनी फसल में शाखाएं कम फूटती हैं और पैदावार घटती है।" : "Thin plants.",
          priority: "normal",
        },
        fertilizer: {
          isDueNow: false,
          badge: isHi ? "ℹ️ इस हफ्ते कोई खाद नहीं" : "No fertilizer due",
          title: isHi ? "अभी कोई खाद न दें" : "Basal active",
          dose: isHi ? "बेसल खाद पर्याप्त है।" : "Basal active",
          tip: isHi ? "अगली खाद: 25–30 दिन पर पहली सिंचाई के साथ यूरिया (25–30 kg) + सल्फर डलेगी।" : "Next: Urea + Sulphur at 1st irrigation.",
          nextDueNote: isHi ? `अगली खाद: ${Math.max(1, 26 - days)} दिन बाद` : `Next in ${Math.max(1, 26 - days)} days`,
        },
        speechScript: isHi ? `सरसों में ${days} दिन हो गए हैं। विरलीकरण करें। पहली सिंचाई पर यूरिया और सल्फर डलेगी।` : `Mustard at Day ${days}.`,
      };
    }
    if (days <= 45) {
      return {
        days,
        hasSowingDate: true,
        sowingDateFormatted,
        optimalWindow,
        stageName: isHi ? "शाखाएं निकलना व पहली सिंचाई" : "Branching & 1st Irrigation",
        stageSubtitle: isHi ? "26–45 दिन" : "Days 26–45",
        stageProgressPct: 38,
        todayTask: {
          title: isHi ? "हल्की सिंचाई व माहू (चेपा) की शुरुआती जाँच" : "Light Irrigation & Aphid Scout",
          details: isHi ? "फूल खिलने से पहले पहली हल्की सिंचाई करें। पत्तियों के नीचे हरे-काले माहू की निगरानी करें।" : "First light irrigation.",
          priority: "high",
        },
        fertilizer: {
          isDueNow: true,
          badge: isHi ? "🌿 अभी खाद का समय" : "Fertilizer Due Now",
          title: isHi ? "यूरिया टॉप-ड्रेसिंग + सल्फर (गंधक)" : "Urea Top Dressing + Sulphur",
          dose: isHi ? "25–30 kg यूरिया + 3 kg सल्फर 90% (डब्ल्यूडीजी) प्रति एकड़" : "25–30 kg Urea + 3 kg Sulphur/acre",
          tip: isHi ? "सरसों में सल्फर तेल की मात्रा और दानों की चमक 15-20% बढ़ाता है।" : "Sulphur boosts oil percentage.",
          nextDueNote: isHi ? "अगली खाद: फली बनते समय 0:0:50 स्प्रे" : "Next: SOP at pod development",
        },
        speechScript: isHi ? `सरसों में शाखाएं निकल रही हैं, ${days} दिन हो गए हैं। यूरिया 30 किलो और सल्फर 3 किलो प्रति एकड़ डालें।` : `Mustard branching.`,
      };
    }
    // Flowering to pod
    return {
      days,
      hasSowingDate: true,
      sowingDateFormatted,
      optimalWindow,
      stageName: isHi ? "फूल व फली विकास (Flowering to Pod)" : "Flowering & Pod Fill",
      stageSubtitle: isHi ? "46+ दिन" : "Days 46+",
      stageProgressPct: Math.min(100, Math.round((days / 115) * 100)),
      todayTask: {
        title: isHi ? "माहू (चेपा) कीट की सख्त निगरानी" : "Aphid (Chetpa) Protection",
        details: isHi ? "फूल व फली पर माहू दिखे तो तुरंत नीम का तेल या अनुशंसित दवा का स्प्रे करें।" : "Monitor aphids on flowers.",
        priority: "high",
      },
      fertilizer: {
        isDueNow: days >= 55 && days <= 75,
        badge: days >= 55 && days <= 75 ? (isHi ? "🌿 पोटाश स्प्रे" : "Potash Spray") : (isHi ? "ℹ️ खाद की ज़रूरत नहीं" : "No fertilizer"),
        title: days >= 55 && days <= 75 ? (isHi ? "0:0:50 पोटाश स्प्रे" : "0:0:50 Spray") : (isHi ? "खाद चक्र पूर्ण" : "Complete"),
        dose: days >= 55 && days <= 75 ? (isHi ? "1 kg 0:0:50 / 150L पानी" : "1 kg/acre") : (isHi ? "फली पकने दें" : "Maturity"),
        tip: isHi ? "दाने मोटे और चमकदार बनने के लिए।" : "Improves seed weight.",
      },
      speechScript: isHi ? `सरसों में ${days} दिन हो चुके हैं। माहू की निगरानी रखें और समय पर स्प्रे करें।` : `Mustard at Day ${days}.`,
    };
  }

  // GENERIC DYNAMIC FALLBACK (for Potato, Chana, Soybean, Cotton, Tomato, etc.)
  // We utilize research dossiers if available or structured timeline
  const dossier = getResearchDossier(slug);
  const totalDuration = 120; // standard season
  const pct = Math.min(100, Math.round((days / totalDuration) * 100));

  let stageTitle = isHi ? "बढ़वार अवस्था" : "Vegetative Growth";
  let stageDetails = isHi ? "खेत में नमी और कीट-रोग का निरीक्षण करें।" : "Monitor moisture and crop health.";
  let fertDue = false;
  let fertTitle = isHi ? "इस हफ्ते कोई खाद नहीं" : "No fertilizer due";
  let fertDose = isHi ? "पिछली खुराक पर्याप्त है" : "Current nutrition active";
  let fertTip = isHi ? "मिट्टी की नमी अनुसार सिंचाई करें।" : "Maintain good irrigation.";

  if (dossier?.growthStages?.length) {
    // Look through dossier stages
    const matched = dossier.growthStages.find((st) => {
      const match = st.period.match(/(\d+)\s*[–-]\s*(\d+)/);
      if (match) {
        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);
        return days >= min && days <= max;
      }
      return false;
    });
    if (matched) {
      stageTitle = matched.title;
      if (matched.keyPoints?.[0]) stageDetails = matched.keyPoints[0];
    }
  }

  if (days <= 20) {
    stageTitle = isHi ? "अंकुरण व स्थापना" : "Seedling & Establishment";
    fertDue = false;
    fertTitle = isHi ? "इस हफ्ते कोई खाद नहीं" : "Basal active";
    fertDose = isHi ? "बुवाई के समय दी गई बेसल खाद अभी पर्याप्त है" : "Basal dose active";
    fertTip = isHi ? "अगली खाद पहली सिंचाई के साथ डलेगी।" : "Next fertilizer with 1st irrigation.";
  } else if (days <= 45) {
    fertDue = true;
    fertTitle = isHi ? "यूरिया / सूक्ष्म पोषक टॉप-ड्रेसिंग" : "Top Dressing Due";
    fertDose = isHi ? "25–30 kg यूरिया या संतुलित NPK/एकड़" : "25–30 kg Urea/acre";
    fertTip = isHi ? "सिंचाई के बाद नमी में दें।" : "Apply in moist soil.";
  } else if (days <= 75) {
    fertDue = true;
    fertTitle = isHi ? "फूल व फल पोषण स्प्रे" : "Foliar Spray";
    fertDose = isHi ? "0:52:34 या सूक्ष्म पोषक 1 kg/एकड़" : "0:52:34 foliar";
    fertTip = isHi ? "फूल व फल की गुणवत्ता बढ़ाने के लिए।" : "Boosts bloom and fruit set.";
  } else {
    fertDue = false;
    fertTitle = isHi ? "खाद चक्र पूर्ण" : "Complete";
    fertDose = isHi ? "कटाई की तैयारी करें" : "Maturity stage";
    fertTip = isHi ? "सिंचाई नियंत्रित रखें।" : "Control irrigation.";
  }

  return {
    days,
    hasSowingDate: true,
    sowingDateFormatted,
    optimalWindow,
    stageName: stageTitle,
    stageSubtitle: isHi ? `बुवाई के ${days} दिन` : `Day ${days}`,
    stageProgressPct: pct,
    todayTask: {
      title: isHi ? "आज का मुख्य कृषि कार्य" : "Today's Farm Task",
      details: stageDetails,
      priority: fertDue ? "high" : "normal",
    },
    fertilizer: {
      isDueNow: fertDue,
      badge: fertDue ? (isHi ? "🌿 अभी खाद का समय" : "Due Now") : (isHi ? "ℹ️ खाद की ज़रूरत नहीं" : "No Fertilizer"),
      title: fertTitle,
      dose: fertDose,
      tip: fertTip,
      nextDueNote: !fertDue ? (isHi ? "अगली खाद समय आने पर सूचित होगी" : "Next dose later") : undefined,
    },
    speechScript: isHi
      ? `${displayName} में बुवाई के ${days} दिन हो चुके हैं। ${stageTitle}। ${stageDetails}`
      : `${displayName} at Day ${days}. ${stageTitle}.`,
  };
}
