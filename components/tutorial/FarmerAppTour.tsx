"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  Sprout,
  TrendingUp,
  Scale,
  CloudSun,
  Calculator,
  Play,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Layers,
  HelpCircle,
} from "lucide-react";
import { speakFarmer } from "@/components/ui/SpeakButton";

const TOUR_STORAGE_KEY = "agriveda_farmer_screen_tour_seen_v2";

interface TourStep {
  id: string;
  badge: string;
  titleHi: string;
  titleEn: string;
  taglineHi: string;
  descriptionHi: string;
  icon: any;
  accent: string;
  mockup: {
    title: string;
    chip: string;
    mainText: string;
    subText: string;
    buttons: string[];
    extraBadge?: string;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "home-task",
    badge: "कदम 1 · होम स्क्रीन",
    titleHi: "आज का मुख्य काम व फसल ट्रैकिंग",
    titleEn: "Today's Task & Crop Tracking",
    taglineHi: "आपकी फसल का रोज़ाना हिसाब — कब कौन-सी खाद डालें",
    descriptionHi:
      "होम स्क्रीन पर आपकी जोड़ी गई फसल के दिन (जैसे 42 दिन) दिखते हैं। आज कौन-सी खाद देनी है और इस हफ्ते का क्या काम है, यहाँ 1-क्लिक में पता चलता है।",
    icon: Sprout,
    accent: "emerald",
    mockup: {
      title: "मूंगफली (Groundnut)",
      chip: "42 दिन बाद",
      mainText: "आज का मुख्य काम: फूल बनते समय जिप्सम डालें",
      subText: "200 kg/एकड़ जिप्सम जड़ों के पास डालें ताकि दाना पूरा भरे।",
      buttons: ["अभी कौन-सी खाद डालें", "इस हफ्ते का काम"],
      extraBadge: "⚡ दैनिक कृषि सलाह",
    },
  },
  {
    id: "doctor",
    badge: "कदम 2 · फसल डॉक्टर",
    titleHi: "कीट-रोग पहचान व 4-स्तरीय दवा",
    titleEn: "Pest Diagnosis & Prescription",
    taglineHi: "पत्ते की फोटो खींचें — तुरंत असली टेक्निकल दवा जानें",
    descriptionHi:
      "खेत में पौधे पर कीड़ा या फफूंद दिखते ही कैमरे से फोटो लें। तुरंत लक्षण पहचानकर 4-स्तरीय दवा, 16L पंप (टंकी) में सही खुराक और बाज़ार के ब्रांड नाम जानें।",
    icon: Camera,
    accent: "teal",
    mockup: {
      title: "रोग पहचान: टिक्का / पत्ती धब्बा",
      chip: "सटीकता: 96%",
      mainText: "सही दवा: टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
      subText: "मात्रा: 1 मिली/लीटर (16L टंकी में 15–20 मिली दवा)",
      buttons: ["दुकानदार के लिए पर्ची कॉपी करें", "रोकथाम के घरेलू उपाय"],
      extraBadge: "🔬 ICAR-IPM प्रमाणित",
    },
  },
  {
    id: "mandi-weather",
    badge: "कदम 3 · मंडी व मौसम",
    titleHi: "लाइव मंडी भाव व 7-दिन का मौसम",
    titleEn: "Live Mandi Rates & Weather",
    taglineHi: "फसल बेचने से पहले आज का ताज़ा भाव ज़रूर देखें",
    descriptionHi:
      "आस-पास की मंडियों के न्यूनतम, मॉडल व उच्चतम भाव रोज़ाना देखें ताकि व्यापारी से सही मोलभाव कर सकें। बारिश का सटीक अलर्ट देखें ताकि स्प्रे का खर्चा न डूबे।",
    icon: Scale,
    accent: "amber",
    mockup: {
      title: "राजकोट मंडी — मूंगफली (Groundnut)",
      chip: "आज की आवक",
      mainText: "मॉडल भाव: ₹6,750 / क्विंटल (स्थिर)",
      subText: "मौसम अलर्ट: 2 दिन बाद 65% बारिश की संभावना (स्प्रे रोकें)",
      buttons: ["नज़दीकी 5 मंडियों के भाव", "7 दिनों का मौसम"],
      extraBadge: "📊 लाइव सरकारी मंडी डेटा",
    },
  },
  {
    id: "calculator",
    badge: "कदम 4 · खाद कैलकुलेटर",
    titleHi: "खाद कैलकुलेटर — बोरी का सही हिसाब",
    titleEn: "Fertilizer Calculator by Acre",
    taglineHi: "ज़मीन (एकड़) के अनुसार यूरिया, डीएपी, पोटाश की बोरियां",
    descriptionHi:
      "दुकान पर जरूरत से ज्यादा महंगी खाद खरीदने से बचें। अपनी एकड़ दर्ज करें और जानें कि बुवाई, कल्ले फूटते समय और फल बनते समय कितनी बोरी खाद चाहिए।",
    icon: Calculator,
    accent: "blue",
    mockup: {
      title: "2 एकड़ ज़मीन की संतुलित खाद",
      chip: "बोरी व किलो हिसाब",
      mainText: "यूरिया: 2 बोरी (90 kg) · डीएपी: 2 बोरी (100 kg)",
      subText: "एमओपी पोटाश: 40 kg · जिंक सल्फेट: 20 kg",
      buttons: ["खाद का पूरा शेड्यूल देखें", "खाद मिलाने के नियम"],
      extraBadge: "🌾 संतुलित पोषण गाइड",
    },
  },
];

interface VideoGuide {
  id: string;
  title: string;
  duration: string;
  category: string;
  thumbnail: string;
  steps: string[];
  audioText: string;
}

const VIDEO_GUIDES: VideoGuide[] = [
  {
    id: "v-crop",
    title: "1. अपनी फसल कैसे जोड़ें व रोज़ का काम देखें",
    duration: "1:20 मिनट",
    category: "फसल प्रबंधन",
    thumbnail: "/images/home/home-job-plan.jpg",
    steps: [
      "होम स्क्रीन पर 'मेरी फसल' पर क्लिक करें।",
      "अपनी फसल (जैसे मूंगफली, धान, गेहूं) और बुवाई की तारीख चुनें।",
      "ऐप आपकी फसल के दिनों के हिसाब से रोज़ का खाद और पानी का काम बताएगा।",
    ],
    audioText:
      "नमस्ते किसान भाई। ऐप में फसल जोड़ने के लिए होम स्क्रीन पर मेरी फसल पर क्लिक करें। बुवाई की तारीख चुनते ही ऐप आपको रोज़ाना खाद और सिंचाई का सही काम बताएगा।",
  },
  {
    id: "v-doctor",
    title: "2. पत्ते की फोटो से रोग पहचानें व दवा की पर्ची बनाएं",
    duration: "1:45 मिनट",
    category: "फसल डॉक्टर",
    thumbnail: "/images/home/home-cta-scan.jpg",
    steps: [
      "रोग व कीट डॉक्टर पर क्लिक करके कैमरे से साफ फोटो लें।",
      "ऐप तुरंत रोग पहचानकर 4 स्तर की दवा बताएगा।",
      "'दुकानदार पर्ची' कॉपी करके खाद-बीज वाले को दिखाएं और सही दवा लें।",
    ],
    audioText:
      "अगर खेत में कोई कीड़ा या रोग दिखे, तो कैमरे से पत्ते की फोटो खींचें। ऐप तुरंत बीमारी पहचानकर सही दवा और टंकी की मात्रा बताएगा, जिसकी पर्ची आप दुकानदार को दिखा सकते हैं।",
  },
  {
    id: "v-calc",
    title: "3. खाद कैलकुलेटर से अपनी ज़मीन की बोरियां निकालें",
    duration: "1:15 मिनट",
    category: "खाद हिसाब",
    thumbnail: "/images/fertilizer/npk-191919.jpg",
    steps: [
      "खाद कैलकुलेटर खोलें और अपनी ज़मीन (जैसे 1.5 एकड़) दर्ज करें।",
      "यूरिया, डीएपी और पोटाश की सटीक बोरियों की संख्या तुरंत देखें।",
      "स्प्रे के लिए 19-19-19 व जिंक की सही मात्रा जानें।",
    ],
    audioText:
      "अपनी ज़मीन के लिए खाद कैलकुलेटर खोलें और एकड़ दर्ज करें। आपको यूरिया और डीएपी की सटीक बोरियों का हिसाब मिल जाएगा ताकि फालतू खर्चा न हो।",
  },
  {
    id: "v-mandi",
    title: "4. आज का मंडी भाव व बारिश का अलर्ट देखना",
    duration: "1:30 मिनट",
    category: "मंडी व मौसम",
    thumbnail: "/images/home/home-job-mandi.jpg",
    steps: [
      "मंडी भाव पर जाएं और अपनी फसल व जिला चुनें।",
      "आज के न्यूनतम, मॉडल और अधिकतम भाव देखें।",
      "मौसम स्क्रीन पर 7 दिनों का बारिश अलर्ट देखें।",
    ],
    audioText:
      "मंडी में फसल ले जाने से पहले आज का ताज़ा भाव चेक करें। साथ ही मौसम स्क्रीन पर बारिश का पूर्वानुमान देखें ताकि छिड़काव का पैसा बेकार न जाए।",
  },
];

export default function FarmerAppTour({
  forceOpen = false,
  onClose,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tour" | "videos">("tour");
  const [currentStep, setCurrentStep] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    // Check if seen before
    try {
      const seen = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!seen) {
        // Small delay so user sees dashboard first
        const t = setTimeout(() => setIsOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsOpen(false);
    onClose?.();
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      handleDismiss();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1);
    }
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-3.5 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-emerald-500/30 bg-[#071912] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Atmosphere Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl"
        />

        {/* 1. Header with Title & Skip Button */}
        <header className="relative z-10 flex items-center justify-between border-b border-emerald-900/30 px-5 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                AgriVeda · किसान गाइड
              </p>
              <h2 className="text-sm font-extrabold text-white">
                {activeTab === "tour" ? `स्क्रीन गाइड (${currentStep + 1} / 4)` : "सहायता वीडियो गाइड"}
              </h2>
            </div>
          </div>

          {/* Prominent Farmer Skip Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-3 py-1.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900 hover:text-white active:scale-95"
          >
            <span>छोड़ें (Skip)</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        {/* 2. Mode Selector Tabs: Screen Tour vs Video Demos */}
        <div className="relative z-10 flex border-b border-emerald-900/20 bg-emerald-950/40 p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("tour")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
              activeTab === "tour"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-300 hover:bg-emerald-900/40"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>ऐप की 4 मुख्य चीजें</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
              activeTab === "videos"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-300 hover:bg-emerald-900/40"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>वीडियो डेमो गाइड</span>
          </button>
        </div>

        {/* 3. Tab Content */}
        <div className="relative z-10 max-h-[70vh] overflow-y-auto px-5 py-4">
          {activeTab === "tour" ? (
            <div className="space-y-4">
              {/* Step Badge & Title */}
              <div>
                <span className="inline-block rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10.5px] font-bold text-emerald-300">
                  {step.badge}
                </span>
                <h3 className="mt-1.5 text-lg font-black text-white">
                  {step.titleHi}
                </h3>
                <p className="mt-0.5 text-xs font-semibold text-emerald-300">
                  {step.taglineHi}
                </p>
              </div>

              {/* Interactive Screen Feature Mockup */}
              <div className="overflow-hidden rounded-2xl border border-emerald-500/35 bg-gradient-to-b from-[#0b2b1d] to-[#04160e] p-3.5 shadow-inner">
                <div className="flex items-center justify-between border-b border-emerald-800/30 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <StepIcon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">{step.mockup.title}</p>
                      <p className="text-[10px] text-emerald-400">{step.mockup.extraBadge}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-600/30 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                    {step.mockup.chip}
                  </span>
                </div>

                <div className="mt-2.5 rounded-xl bg-black/40 p-2.5">
                  <p className="text-xs font-black text-amber-300 leading-snug">
                    {step.mockup.mainText}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">
                    {step.mockup.subText}
                  </p>
                </div>

                {/* Quick Action Preview Buttons */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {step.mockup.buttons.map((btn, bIdx) => (
                    <span
                      key={bIdx}
                      className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[10.5px] font-bold text-emerald-300 border border-emerald-500/25"
                    >
                      {btn}
                    </span>
                  ))}
                </div>
              </div>

              {/* Farmer Friendly Explanation */}
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-900/30 bg-emerald-950/30 p-3 text-xs leading-relaxed text-emerald-100">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <p>{step.descriptionHi}</p>
              </div>
            </div>
          ) : (
            /* Video Guides Tab */
            <div className="space-y-3">
              <p className="text-xs font-medium text-emerald-300">
                किसी भी वीडियो कार्ड पर क्लिक करके देखें कि ऐप के मुख्य फीचर्स कैसे काम करते हैं:
              </p>

              {VIDEO_GUIDES.map((vg) => {
                const isSelected = playingVideoId === vg.id;

                return (
                  <div
                    key={vg.id}
                    className={`overflow-hidden rounded-2xl border transition-all ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-950/70"
                        : "border-emerald-900/30 bg-emerald-950/30 hover:border-emerald-700"
                    }`}
                  >
                    <div
                      onClick={() => {
                        setPlayingVideoId(isSelected ? null : vg.id);
                        if (!isSelected) {
                          speakFarmer(vg.audioText, true);
                        }
                      }}
                      className="flex cursor-pointer items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                          <Play className={`h-5 w-5 ${isSelected ? "text-emerald-300 fill-emerald-300" : ""}`} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-snug">{vg.title}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-emerald-400">
                            <span>{vg.category}</span>
                            <span>•</span>
                            <span>{vg.duration}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakFarmer(vg.audioText, true);
                        }}
                        className="rounded-full bg-emerald-900/50 p-1.5 text-emerald-300 hover:text-white"
                        title="आवाज़ सुनें"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Expanded Steps Demonstration */}
                    {isSelected && (
                      <div className="border-t border-emerald-900/40 bg-black/40 p-3 text-xs">
                        <p className="font-bold text-amber-300 mb-2">कैसे काम करता है (3 सरल चरण):</p>
                        <ol className="space-y-1.5 text-slate-200">
                          {vg.steps.map((st, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2 text-[11.5px]">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                                {sIdx + 1}
                              </span>
                              <span>{st}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Footer Navigation Controls */}
        <footer className="relative z-10 flex items-center justify-between border-t border-emerald-900/30 bg-[#05140e] px-5 py-3">
          {activeTab === "tour" ? (
            <>
              {/* Dot Step Indicators */}
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentStep === idx
                        ? "w-6 bg-emerald-400"
                        : "w-2 bg-emerald-900 hover:bg-emerald-700"
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev & Next Buttons */}
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1 rounded-xl border border-emerald-800/40 bg-emerald-950/60 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>पीछे</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-md hover:bg-emerald-500 active:scale-95"
                >
                  <span>
                    {currentStep === TOUR_STEPS.length - 1
                      ? "समझ गए — ऐप शुरू करें"
                      : "आगे बढ़ें"}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab("tour")}
                className="text-xs font-bold text-emerald-400 underline"
              >
                ‹ स्क्रीन टूर पर वापस जाएं
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-500"
              >
                ऐप में जाएं
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
