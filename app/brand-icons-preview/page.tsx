"use client";

import { useState } from "react";
import { Sparkles, ArrowLeft, Check, Layers, Eye } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import {
  AgriVedaSparkleIcon,
  CropDoctorSparkleIcon,
  FieldAdviceSparkleIcon,
  CropGrowthSparkleIcon,
  AgriWeatherSparkleIcon,
  TankMixSparkleIcon,
  SprayRotationSparkleIcon,
  GovtSchemeSparkleIcon,
  FasalPustikaSparkleIcon,
  FertilizerNpkSparkleIcon,
  CropMedicineSparkleIcon,
  AgriAiQuerySparkleIcon,
  FarmerTourSparkleIcon,
  type AgriIconProps,
} from "@/components/brand/icons";

interface IconShowcaseItem {
  id: string;
  name: string;
  nameHi: string;
  component: React.ComponentType<AgriIconProps>;
  usedIn: string[];
  contextExplanation: string;
  contextExplanationHi: string;
  colorAccent: string;
}

const ICONS_CATALOG: IconShowcaseItem[] = [
  {
    id: "agriveda-brand",
    name: "AgriVedaSparkleIcon",
    nameHi: "एग्रीवेदा ब्रांड मार्क (हेडर एवं लोगो)",
    component: AgriVedaSparkleIcon,
    usedIn: [
      "components/crop-problems/ProblemFlowShell.tsx (Line 72)",
      "components/shell/AppShell.tsx",
      "components/brand/AgriVedaBrandMark.tsx",
    ],
    contextExplanation:
      "Vedic Sprout + Radiant Wisdom Star. Replaces generic 4-pointed sparkle next to 'AgriVeda' brand name with sacred twin leaves and central agricultural enlightenment star.",
    contextExplanationHi:
      "वैदिक अंकुर + ज्ञान तारा। हेडर में 'AgriVeda' के आगे साधारण 4-कोने वाले स्पार्कल की जगह यह कृषि एवं ज्ञान का प्रतीक वैदिक अंकुर है।",
    colorAccent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "crop-doctor",
    name: "CropDoctorSparkleIcon",
    nameHi: "फसल डॉक्टर एवं रोग निदान",
    component: CropDoctorSparkleIcon,
    usedIn: [
      "components/dashboard/AgriVedaHome.tsx (Line 45)",
      "app/ai-doctor/page.tsx",
      "components/crop-problems/ProblemFlowShell.tsx",
    ],
    contextExplanation:
      "Medicinal Botanical Leaf with Clinical Health Pulse and Diagnostic Ray. Specially designed for crop disease detection and plant pathology diagnosis.",
    contextExplanationHi:
      "औषधीय पत्ती + क्लीनिकल हेल्थ पल्स। फसल के कीड़े व रोग की तुरंत वैज्ञानिक पहचान और उपचार के लिए विशेष डिज़ाइन।",
    colorAccent: "text-emerald-500 dark:text-emerald-300",
  },
  {
    id: "field-advice",
    name: "FieldAdviceSparkleIcon",
    nameHi: "मेरी खेत सलाह (दैनिक कृषि ज्ञान)",
    component: FieldAdviceSparkleIcon,
    usedIn: [
      "components/dashboard/AgriVedaHome.tsx (Line 527)",
      "app/field-advisor/page.tsx (Line 164)",
    ],
    contextExplanation:
      "Rising Dawn Sun over Plowed Farm Furrows with Wisdom Rays. Represents personalized daily agronomic guidance for the farmer's soil.",
    contextExplanationHi:
      "खेत की जुताई लाइनों (फरोज़) पर उगता प्रभात सूर्य व ज्ञान किरणें। रोज़ाना खेत की ताज़ा सलाह व सुझावों के लिए।",
    colorAccent: "text-teal-600 dark:text-teal-300",
  },
  {
    id: "crop-growth",
    name: "CropGrowthSparkleIcon",
    nameHi: "फसल अवस्था व विकास माइलस्टोन",
    component: CropGrowthSparkleIcon,
    usedIn: [
      "components/dashboard/HomeCropStatusCard.tsx (Line 392)",
      "components/crops/sections/CropTimelineSection.tsx",
    ],
    contextExplanation:
      "Active Growing Shoot breaking through soil with upward vitality rings. Perfectly signifies tillering, vegetative, and flowering stages.",
    contextExplanationHi:
      "ज़मीन से फूटता सजीव अंकुर व विकास चक्र (वाइटैलिटी रिंग्स)। फसल की विभिन्न अवस्थाओं (फुटाव, कल्ले, फूल) को दर्शाता है।",
    colorAccent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "agri-weather",
    name: "AgriWeatherSparkleIcon",
    nameHi: "कृषि मौसम व स्प्रे अनुकूलता",
    component: AgriWeatherSparkleIcon,
    usedIn: [
      "components/weather/WeatherRedesign.tsx (Line 389)",
      "app/spray-window/page.tsx",
    ],
    contextExplanation:
      "Micro-Climate Cloud + Sunbeam nurturing an emerging seedling with dew drops. Represents agricultural weather advisory and spray suitability.",
    contextExplanationHi:
      "मौसम का बादल + स्वर्णिम धूप जो अंकुर को सींच रही है। बारिश, हवा और स्प्रे के लिए मौसम की अनुकूलता का संकेत।",
    colorAccent: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "tank-mix",
    name: "TankMixSparkleIcon",
    nameHi: "टंकी मिक्स व दवा अनुकूलता एडवाइजर",
    component: TankMixSparkleIcon,
    usedIn: [
      "components/mix-advisor/MixAdvisorClient.tsx (Lines 689, 924, 1204)",
      "app/mix-advisor/page.tsx",
    ],
    contextExplanation:
      "Agro-chemical Flask containing Synergistic Plant Leaves with Safety Shield. Replaces generic sparkles in pesticide-fungicide compatibility checks.",
    contextExplanationHi:
      "प्रयोगशाला फ्लास्क + सुरक्षित पत्ती। 2 या 3 दवाओं को एक साथ टंकी में घोलते समय फटने या खराब होने से बचाने का सुरक्षा प्रतीक।",
    colorAccent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "spray-rotation",
    name: "SprayRotationSparkleIcon",
    nameHi: "स्प्रे रोटेशन व कीट प्रतिरोध सुरक्षा",
    component: SprayRotationSparkleIcon,
    usedIn: [
      "components/spray-rotation/SuggestedSprayCard.tsx (Line 31)",
      "app/spray-rotation/page.tsx (Line 215)",
    ],
    contextExplanation:
      "Precision Agricultural Spray Nozzle atomizing conical mist onto a protected crop shield foliage to prevent chemical resistance.",
    contextExplanationHi:
      "सटीक स्प्रे नोज़ल + सुरक्षित पत्ती ढाल। एक ही दवा बार-बार डालने से कीड़ों में प्रतिरोध न बने, उसके वैज्ञानिक चक्र का प्रतीक।",
    colorAccent: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "govt-scheme",
    name: "GovtSchemeSparkleIcon",
    nameHi: "सरकारी योजनाएं, सब्सिडी व अनुदान",
    component: GovtSchemeSparkleIcon,
    usedIn: [
      "components/schemes/SchemesClient.tsx (Line 433)",
      "components/schemes/SchemeDetailClient.tsx (Lines 235, 523)",
    ],
    contextExplanation:
      "Twin Golden Ears of Wheat (Baliyan) framing a Subsidy Prosperity Seal. Represents PM-Kisan, state grants, and farmer welfare benefits.",
    contextExplanationHi:
      "गेहूं की दो सुनहरी बालियां + सरकारी अनुदान मुहर। पीएम किसान व सरकारी सब्सिडी योजनाओं की पात्रता जांच हेतु।",
    colorAccent: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "fasal-pustika",
    name: "FasalPustikaSparkleIcon",
    nameHi: "फसल पुस्तिका व कृषि ग्रंथ",
    component: FasalPustikaSparkleIcon,
    usedIn: [
      "components/crops/CropGuideFasalPustika.tsx (Line 396)",
      "app/crops/[slug]/page.tsx",
    ],
    contextExplanation:
      "Open Agricultural Handbook Pages blossoming into living botanical leaves. Replaces generic sparkles in scientific crop guidebooks.",
    contextExplanationHi:
      "खुली ज्ञान पुस्तक जिससे हरी पत्तियां खिल रही हैं। फसल की वैज्ञानिक खेती (पैकेज ऑफ प्रैक्टिसेज) की विस्तृत मार्गदर्शिका।",
    colorAccent: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "fertilizer-npk",
    name: "FertilizerNpkSparkleIcon",
    nameHi: "खाद व एनपीके (NPK) पोषण कैलकुलेटर",
    component: FertilizerNpkSparkleIcon,
    usedIn: [
      "components/crops/sections/CropFertilizerSection.tsx (Lines 561, 957)",
      "components/crops/sections/CropFertilizerMixinPanel.tsx (Line 93)",
      "app/services/fertilizer-calculator/page.tsx (Line 792)",
    ],
    contextExplanation:
      "Mineral Nutrient Crystal (N-P-K) directly feeding into soil root networks. Replaces sparkles in fertilizer dosage and soil nutrition panels.",
    contextExplanationHi:
      "एन-पी-के पोषक तत्व क्रिस्टल + जड़ प्रणाली। खेत की मिट्टी में यूरिया, डीएपी, पोटाश की सटीक संतुलित मात्रा के लिए।",
    colorAccent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "crop-medicine",
    name: "CropMedicineSparkleIcon",
    nameHi: "फसल दवाई एवं उपचार डोज",
    component: CropMedicineSparkleIcon,
    usedIn: [
      "components/crops/FieldMedicinePanel.tsx (Line 110)",
      "components/crops/sections/CropExpertSection.tsx (Line 58)",
    ],
    contextExplanation:
      "Medicinal Remedy Capsule intertwined with herbal healing shoots. Highlights verified dosage per 15-liter pump spray.",
    contextExplanationHi:
      "औषधि कैप्सूल + उपचारात्मक बेल। 15 लीटर पंप के हिसाब से सटीक दवा की मात्रा (ग्राम/मिली) दर्शाने का प्रतीक।",
    colorAccent: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "ai-query",
    name: "AgriAiQuerySparkleIcon",
    nameHi: "एआई कृषि सवाल-जवाब एवं वॉइस चैट",
    component: AgriAiQuerySparkleIcon,
    usedIn: [
      "app/ask-query/page.tsx (Line 329)",
      "components/dashboard/AskQueryCard.tsx",
    ],
    contextExplanation:
      "Acoustic Speech Bubble blossoming into an Agricultural Intelligence Flower. Designed for farmer voice queries and intelligent answers.",
    contextExplanationHi:
      "आवाज़/बोलने का बबल जो ज्ञान के फूल में बदलता है। किसान के बोलकर या लिखकर पूछे गए सवालों के जवाब हेतु।",
    colorAccent: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "farmer-tour",
    name: "FarmerTourSparkleIcon",
    nameHi: "किसान ऐप टूर व दिशा-निर्देश",
    component: FarmerTourSparkleIcon,
    usedIn: [
      "components/tutorial/FarmerAppTour.tsx (Lines 134, 225)",
      "components/onboarding/FarmSetupStep.tsx (Line 149)",
      "components/onboarding/FarmerOnboardingGate.tsx (Line 506)",
    ],
    contextExplanation:
      "Agricultural 4-Cardinal Grain Compass Star guiding the farmer through app features and smart farm onboarding.",
    contextExplanationHi:
      "चारों दिशाओं में सुनहरे दानों से बना कृषि दिशा-सूचक (कंपास)। किसान को ऐप के हर फीचर को आसानी से समझाने हेतु।",
    colorAccent: "text-amber-500 dark:text-amber-400",
  },
];

export default function BrandIconsPreviewPage() {
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const [scale, setScale] = useState<"12" | "16" | "24" | "36" | "48">("24");

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        selectedTheme === "dark" ? "bg-[#06170f] text-emerald-50" : "bg-[#f8faf8] text-[#072417]"
      }`}
    >
      {/* Top Bar */}
      <header
        className={`sticky top-0 z-40 border-b px-4 py-3.5 backdrop-blur-xl transition-colors ${
          selectedTheme === "dark"
            ? "border-emerald-500/20 bg-[#06170f]/90"
            : "border-emerald-900/10 bg-white/85"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AppLink
              href="/"
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${
                selectedTheme === "dark"
                  ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                  : "border-emerald-900/10 bg-white text-emerald-800 shadow-xs"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
            </AppLink>
            <div>
              <div className="flex items-center gap-1.5">
                <AgriVedaSparkleIcon className="h-4 w-4 text-emerald-600" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                  AgriVeda Custom SVG System
                </span>
              </div>
              <h1 className="text-base font-black sm:text-lg">
                यूनिक कृषि SVG डिज़ाइन्स रिव्यू व अनुमति
              </h1>
            </div>
          </div>

          {/* Theme & Size Toggles */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center rounded-xl border p-1 text-xs font-bold ${
                selectedTheme === "dark"
                  ? "border-emerald-500/30 bg-emerald-950/50"
                  : "border-emerald-900/10 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedTheme("light")}
                className={`rounded-lg px-2.5 py-1 transition ${
                  selectedTheme === "light"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-800 hover:text-emerald-950"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setSelectedTheme("dark")}
                className={`rounded-lg px-2.5 py-1 transition ${
                  selectedTheme === "dark"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-400 hover:text-white"
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {/* Exact Header Comparison Card: Element User Clicked On */}
        <section
          className={`mb-8 overflow-hidden rounded-3xl border p-5 shadow-lg sm:p-6 ${
            selectedTheme === "dark"
              ? "border-emerald-500/25 bg-[#0b2418]/90 shadow-emerald-950/50"
              : "border-emerald-900/10 bg-white shadow-emerald-900/5"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-600">
              <Eye className="h-4 w-4" />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              सीधा तुलनात्मक परीक्षण (Direct Before / After Mockup)
            </span>
          </div>
          <h2 className="mt-1 text-lg font-black sm:text-xl">
            वही हेडर एलिमेंट जिसे आपने इंस्पेक्ट करके सेलेक्ट किया था
          </h2>
          <p className="mt-1 text-xs text-emerald-900/70 dark:text-emerald-200/70">
            ProblemFlowShell.tsx (Line 72) — जहाँ पुराना जेनेरिक 4-कोने वाला सितारा लगा था, उसकी जगह
            अब नया वैदिक अंकुर स्टार दिखेगा।
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Old / Current Generic */}
            <div
              className={`rounded-2xl border p-4 ${
                selectedTheme === "dark"
                  ? "border-rose-500/30 bg-rose-950/20"
                  : "border-rose-900/15 bg-rose-50/50"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  ❌ पहले (Old Generic Lucide Sparkles)
                </span>
                <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                  ऑटो-जेनेरेटेड टेक स्टार
                </span>
              </div>

              {/* Exact Header Reproduction with old Sparkles */}
              <div className="rounded-xl border border-emerald-900/10 bg-white/90 p-3 shadow-xs dark:border-white/10 dark:bg-black/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-900/10 bg-white text-emerald-800">
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-emerald-600" />
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700/85">
                        AgriVeda
                      </p>
                    </div>
                    <p className="truncate text-xs font-bold text-[#052e1c] dark:text-white">
                      फसल समस्या की पहचान
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-rose-700/80 dark:text-rose-300/80">
                साधारण सॉफ्टवेयर चमक (✨) — किसी भी टेक ऐप की तरह, कृषि का कोई संबंध नहीं।
              </p>
            </div>

            {/* New Bespoke AgriVeda SVG */}
            <div
              className={`rounded-2xl border p-4 ${
                selectedTheme === "dark"
                  ? "border-emerald-500/40 bg-emerald-950/30"
                  : "border-emerald-600/30 bg-emerald-50/60"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  ✅ नया (AgriVeda Unique Custom SVG)
                </span>
                <span className="rounded-md bg-emerald-600/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  वैदिक अंकुर + ज्ञान तारा
                </span>
              </div>

              {/* Exact Header Reproduction with NEW AgriVedaSparkleIcon */}
              <div className="rounded-xl border border-emerald-900/10 bg-white/90 p-3 shadow-xs dark:border-white/10 dark:bg-black/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-900/10 bg-white text-emerald-800">
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <AgriVedaSparkleIcon className="h-3 w-3 text-emerald-600" />
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700/85">
                        AgriVeda
                      </p>
                    </div>
                    <p className="truncate text-xs font-bold text-[#052e1c] dark:text-white">
                      फसल समस्या की पहचान
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-emerald-800 dark:text-emerald-300">
                सटीक 12px पर भी स्पष्ट दिखने वाला वैदिक कृषि अंकुर और शीर्ष पर ज्ञान तारा!
              </p>
            </div>
          </div>
        </section>

        {/* Catalog Control Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight sm:text-xl">
              सभी 13 यूनिक कृषि SVG डिज़ाइन्स की सूची
            </h2>
            <p className="text-xs text-emerald-900/60 dark:text-emerald-200/60">
              हर फीचर की आवश्यकता और कृषि कार्य के अनुरूप विशेष रूप से हस्तनिर्मित
            </p>
          </div>

          {/* Size Inspector */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-emerald-900/70 dark:text-emerald-200/70">साइज देखें:</span>
            {(["12", "16", "24", "36", "48"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScale(s)}
                className={`rounded-lg px-2 py-0.5 transition ${
                  scale === s
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-600/10 text-emerald-800 hover:bg-emerald-600/20 dark:text-emerald-200"
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* Grid of all 13 bespoke SVGs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ICONS_CATALOG.map((item, idx) => {
            const IconComponent = item.component;
            const currentSize = Number(scale);

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between overflow-hidden rounded-2xl border p-4.5 transition-all hover:shadow-md ${
                  selectedTheme === "dark"
                    ? "border-emerald-500/20 bg-[#091f14]/80 hover:border-emerald-500/40"
                    : "border-emerald-900/10 bg-white hover:border-emerald-600/30"
                }`}
              >
                <div>
                  {/* Top Header & Index */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600/15 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                          {idx + 1}
                        </span>
                        <h3 className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-300">
                          {item.name}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-xs font-extrabold text-[#062416] dark:text-white">
                        {item.nameHi}
                      </p>
                    </div>

                    {/* Live Render Tile */}
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${
                        selectedTheme === "dark"
                          ? "border-emerald-500/25 bg-black/40"
                          : "border-emerald-900/10 bg-emerald-50/50"
                      }`}
                    >
                      <IconComponent
                        size={currentSize}
                        className={item.colorAccent}
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Multi-Size Showcase Strip */}
                  <div
                    className={`mt-3 flex items-center justify-around rounded-xl p-2.5 ${
                      selectedTheme === "dark" ? "bg-black/30" : "bg-emerald-50/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-emerald-900/50 dark:text-emerald-200/50">
                        12px (h-3)
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center">
                        <IconComponent size={12} className={item.colorAccent} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-emerald-900/50 dark:text-emerald-200/50">
                        16px (h-4)
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center">
                        <IconComponent size={16} className={item.colorAccent} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-emerald-900/50 dark:text-emerald-200/50">
                        24px (h-6)
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center">
                        <IconComponent size={24} className={item.colorAccent} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-emerald-900/50 dark:text-emerald-200/50">
                        32px (h-8)
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center">
                        <IconComponent size={32} className={item.colorAccent} />
                      </div>
                    </div>
                  </div>

                  {/* Context & Meaning */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    <p className="font-semibold text-emerald-900/85 dark:text-emerald-100/90 leading-relaxed">
                      🌱 {item.contextExplanationHi}
                    </p>
                    <p className="text-[11px] text-emerald-900/60 dark:text-emerald-200/60">
                      {item.contextExplanation}
                    </p>
                  </div>
                </div>

                {/* Where it is used */}
                <div
                  className={`mt-4 rounded-xl border p-2.5 text-[10px] font-mono ${
                    selectedTheme === "dark"
                      ? "border-emerald-500/15 bg-emerald-950/40 text-emerald-300"
                      : "border-emerald-900/10 bg-stone-50 text-emerald-900/80"
                  }`}
                >
                  <span className="block font-sans font-bold text-[10px] uppercase text-emerald-700 dark:text-emerald-400">
                    उपयोग का स्थान (Target Files):
                  </span>
                  {item.usedIn.map((path, pIdx) => (
                    <span key={pIdx} className="block truncate">
                      • {path}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ready to Apply Notice */}
        <section
          className={`mt-8 rounded-3xl border p-5 sm:p-6 text-center ${
            selectedTheme === "dark"
              ? "border-emerald-500/30 bg-[#072417]"
              : "border-emerald-900/15 bg-emerald-50/70"
          }`}
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <Check className="h-5 w-5" />
          </div>
          <h3 className="mt-2 text-base font-black sm:text-lg">
            आपकी अनुमति के लिए पूरी तरह तैयार
          </h3>
          <p className="mx-auto mt-1 max-w-xl text-xs sm:text-sm text-emerald-900/75 dark:text-emerald-200/75">
            जैसा आपने कहा था:{" "}
            <span className="font-bold text-emerald-800 dark:text-emerald-200">
              "लगाएंगे मेरी अनुमति के बाद ही लगेंगे, पहले तुम बना के दिखाओ मुझे सारे।"
            </span>
            <br />
            सभी 13 कस्टम एसवीजी तैयार कर दिए गए हैं। आपके 'हाँ' कहते ही इन्हें संबंधित फाइलों में
            स्थान दिया जाएगा।
          </p>
        </section>
      </main>
    </div>
  );
}
