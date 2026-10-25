"use client";

import { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Camera,
  Sprout,
  Scale,
  Calculator,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CloudSun,
} from "lucide-react";
import { FarmerTourSparkleIcon } from "@/components/brand/icons";

const TOUR_STORAGE_KEY = "agriveda_farmer_screen_tour_seen_v2";

interface TourStep {
  id: string;
  badge: string;
  titleHi: string;
  taglineHi: string;
  descriptionHi: string;
  icon: any;
  accentColor: string;
  highlights: {
    icon: any;
    title: string;
    desc: string;
  }[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    badge: "कदम 1/4 · स्वागत",
    titleHi: "AgriVeda में आपका स्वागत है",
    taglineHi: "भारतीय किसान का सच्चा और भरोसेमंद डिजिटल कृषि साथी",
    descriptionHi:
      "AgriVeda आपकी फसल की बुवाई से लेकर कटाई तक हर कदम पर वैज्ञानिक सलाह देता है — सही समय पर खाद, कीट-रोग का पक्का समाधान और सरकारी मंडी के ताज़ा भाव।",
    icon: Sprout,
    accentColor: "emerald",
    highlights: [
      {
        icon: Sprout,
        title: "दैनिक फसल ट्रैकिंग",
        desc: "बुवाई के दिनों अनुसार रोज़ाना खाद और पानी का सही काम",
      },
      {
        icon: Camera,
        title: "एआई फसल डॉक्टर",
        desc: "पत्ते की फोटो खींचकर तुरंत रोग पहचान और पक्का इलाज",
      },
      {
        icon: Scale,
        title: "लाइव मंडी व मौसम",
        desc: "आज का ताज़ा मंडी भाव और 7-दिन का बारिश अलर्ट",
      },
    ],
  },
  {
    id: "doctor",
    badge: "कदम 2/4 · फसल डॉक्टर",
    titleHi: "पत्ते की फोटो से तुरंत रोग पहचानें",
    taglineHi: "कैमरे से फोटो लें — 10 सेकंड में सही दवा व सटीक टंकी नाप",
    descriptionHi:
      "खेत में पौधे पर कीड़ा या फफूंद दिखते ही कैमरे से फोटो लें। AgriVeda तुरंत बीमारी पहचानकर 15 लीटर टंकी के अनुसार सही दवा, ग्राम/मिली मात्रा और बाज़ार के ब्रांड नाम बताता है।",
    icon: Camera,
    accentColor: "teal",
    highlights: [
      {
        icon: Camera,
        title: "1-क्लिक कैमरा जाँच",
        desc: "पत्ते या पौधे की फोटो से 99% सटीक वैज्ञानिक पहचान",
      },
      {
        icon: ShieldCheck,
        title: "असली टेक्निकल दवाएं",
        desc: "बाज़ार के प्रमाणित ब्रांड और दुकानदार को दिखाने वाली पर्ची",
      },
      {
        icon: Calculator,
        title: "15L टंकी की सही खुराक",
        desc: "ढोलकी टंकी में कितनी दवा और कितना स्टीकर मिलाना है",
      },
    ],
  },
  {
    id: "mandi-calc",
    badge: "कदम 3/4 · मंडी व खाद",
    titleHi: "लाइव मंडी भाव, मौसम व खाद हिसाब",
    taglineHi: "फसल का सही दाम पाएं और खाद का फालतू खर्चा बचाएं",
    descriptionHi:
      "नज़दीकी APMC मंडियों के आज के ताज़ा भाव देखें ताकि व्यापारी से सही मोलभाव कर सकें। बारिश का सटीक अलर्ट देखकर ही स्प्रे करें और एकड़ अनुसार यूरिया/डीएपी की सही बोरियां जानें।",
    icon: Scale,
    accentColor: "amber",
    highlights: [
      {
        icon: Scale,
        title: "सरकारी लाइव मंडी भाव",
        desc: "न्यूनतम, मॉडल और अधिकतम भाव रोज़ाना अपडेट",
      },
      {
        icon: CloudSun,
        title: "बारिश व मौसम अलर्ट",
        desc: "स्प्रे करने से पहले बारिश का पूर्वानुमान ज़रूर देखें",
      },
      {
        icon: Calculator,
        title: "एकड़ खाद कैलकुलेटर",
        desc: "अपनी ज़मीन दर्ज करें और यूरिया, डीएपी, पोटाश की सटीक बोरियां निकालें",
      },
    ],
  },
  {
    id: "start",
    badge: "कदम 4/4 · तैयार हैं",
    titleHi: "खेत को बनाएं डिजिटल और मुनाफा बढ़ाएं",
    taglineHi: "अब बिना किसी झंझट सीधे AgriVeda का इस्तेमाल शुरू करें!",
    descriptionHi:
      "अपनी पहली फसल जोड़ें या सीधे होम स्क्रीन से किसी भी फीचर का उपयोग करें। AgriVeda के साथ हर कदम पर सही और निष्पक्ष कृषि सलाह आपके हाथ में है।",
    icon: CheckCircle2,
    accentColor: "emerald",
    highlights: [
      {
        icon: CheckCircle2,
        title: "100% निःशुल्क व सुरक्षित",
        desc: "भारतीय किसानों के लिए बनाया गया सबसे सरल ऐप",
      },
      {
        icon: FarmerTourSparkleIcon,
        title: "विशेषज्ञ कृषि सलाह",
        desc: "वैज्ञानिक रूप से प्रमाणित कृषि अनुसंधान पर आधारित",
      },
      {
        icon: ArrowRight,
        title: "सीधे खेत से शुरुआत करें",
        desc: "नीचे दिए गए बटन पर टैप करें और ऐप में प्रवेश करें",
      },
    ],
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
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setCurrentStep(0);
      setIsOpen(true);
      return;
    }
    try {
      const seen = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!seen) {
        setCurrentStep(0);
        setIsOpen(true);
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
  const isLast = currentStep === TOUR_STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3.5 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-[26px] border border-emerald-500/30 bg-[#071b13] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Atmosphere Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-500/20 blur-3xl"
        />

        {/* Header with Title & Skip Button */}
        <header className="relative z-10 flex items-center justify-between border-b border-emerald-900/35 px-4.5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
              <FarmerTourSparkleIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                AgriVeda किसान टूर
              </p>
              <h2 className="text-xs font-extrabold text-white">
                चरण {currentStep + 1} / {TOUR_STEPS.length}
              </h2>
            </div>
          </div>

          {/* Skip Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-950/70 px-3 py-1 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-900 hover:text-white active:scale-95"
          >
            <span>छोड़ें (Skip)</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        {/* Body Content */}
        <div className="relative z-10 space-y-3 px-4.5 py-4">
          {/* Badge & Title */}
          <div>
            <span className="inline-block rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10.5px] font-bold text-emerald-300">
              {step.badge}
            </span>
            <h3 className="mt-1 text-base sm:text-lg font-black text-white leading-tight">
              {step.titleHi}
            </h3>
            <p className="mt-0.5 text-[11.5px] font-semibold text-emerald-300/90 leading-snug">
              {step.taglineHi}
            </p>
          </div>

          {/* Description Box */}
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/40 p-2.5 text-[12px] leading-relaxed text-emerald-100">
            <p>{step.descriptionHi}</p>
          </div>

          {/* Feature Highlight Pills */}
          <div className="space-y-2">
            {step.highlights.map((h, i) => {
              const HIcon = h.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-black/35 p-2.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <HIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-white leading-tight">
                      {h.title}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-slate-300 leading-tight">
                      {h.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <footer className="relative z-10 flex items-center justify-between border-t border-emerald-900/35 bg-[#05140e] px-4.5 py-3">
          {/* Step Dots */}
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

          {/* Navigation Buttons */}
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
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black text-white shadow-md transition active:scale-95 ${
                isLast
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              <span>{isLast ? "ऐप शुरू करें 🚀" : "आगे बढ़ें (Next)"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
