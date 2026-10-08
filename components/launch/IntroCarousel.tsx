"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Camera,
  CloudSun,
  FileSearch,
  Leaf,
  MapPin,
  ShieldCheck,
  Sprout,
  TrendingUp,
  IndianRupee,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

type Feature = {
  icon: ReactNode;
  title: string;
  sub: string;
  accent: "emerald" | "amber" | "sky" | "teal";
};

type Slide = {
  id: string;
  hero: string;
  badge: string;
  badgeIcon: ReactNode;
  floatingTag: string;
  titleHi: string;
  titleEn: string;
  bodyHi: string;
  features: Feature[];
  ctaHi: string;
  theme: {
    gradient: string;
    glow: string;
    accent: string;
  };
};

const SLIDES: Slide[] = [
  {
    id: "farm",
    hero: "/onboarding/01-farm-v2.jpg",
    badge: "स्मार्ट खेत प्रबंधन",
    badgeIcon: <Sprout className="h-3.5 w-3.5" />,
    floatingTag: "🛰️ डिजिटल खेत रिकॉर्ड",
    titleHi: "स्मार्ट खेत प्रबंधन",
    titleEn: "Smart Farm Management",
    bodyHi: "फसल, खर्च और उपज का एक-एक हिसाब रखें। हर फसल चक्र पर मुनाफा बढ़ाएं।",
    features: [
      {
        icon: <TrendingUp className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "फसल ट्रैकिंग",
        sub: "बुवाई से कटाई का पूरा रिकॉर्ड",
        accent: "emerald",
      },
      {
        icon: <IndianRupee className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "खर्च और मुनाफा",
        sub: "सटीक बैलेंस व बचत रिपोर्ट",
        accent: "amber",
      },
      {
        icon: <CloudSun className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "सटीक मौसम",
        sub: "बारिश व तापमान का लाइव अलर्ट",
        accent: "sky",
      },
    ],
    ctaHi: "आगे जाएं",
    theme: {
      gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
      glow: "rgba(16, 185, 129, 0.25)",
      accent: "#059669",
    },
  },
  {
    id: "ai",
    hero: "/onboarding/02-ai-doctor-v2.jpg",
    badge: "24x7 एआई फसल डॉक्टर",
    badgeIcon: <Sparkles className="h-3.5 w-3.5" />,
    floatingTag: "⚡ 10 सेकंड में रोग पहचान",
    titleHi: "एआई फसल डॉक्टर",
    titleEn: "AI Crop Doctor & Diagnosis",
    bodyHi: "पत्ते की एक फोटो खींचें और तुरंत कीट-रोग की सटीक पहचान व रासायनिक छिड़काव सलाह पाएं।",
    features: [
      {
        icon: <Camera className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "फोटो से पहचान",
        sub: "कैमरे से तुरंत पत्ते की जांच",
        accent: "teal",
      },
      {
        icon: <FileSearch className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "AI स्कैनिंग",
        sub: "99% सटीक वैज्ञानिक विश्लेषण",
        accent: "emerald",
      },
      {
        icon: <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "सही दवा व डोज़",
        sub: "FRAC/IRAC प्रमाणित सलाह",
        accent: "amber",
      },
    ],
    ctaHi: "आगे जाएं",
    theme: {
      gradient: "from-teal-500/15 via-emerald-500/10 to-transparent",
      glow: "rgba(20, 184, 166, 0.25)",
      accent: "#0d9488",
    },
  },
  {
    id: "mandi",
    hero: "/onboarding/03-mandi-v2.jpg",
    badge: "लाइव मंडी भाव",
    badgeIcon: <IndianRupee className="h-3.5 w-3.5" />,
    floatingTag: "🌾 APMC दैनिक दरें",
    titleHi: "लाइव मंडी भाव",
    titleEn: "Live Mandi Prices & Trends",
    bodyHi: "अपने नज़दीकी मंडियों के ताज़ा भाव देखें, तेज़ी-मंदी ट्रैक करें और फसल बेचने का सही दिन चुनें।",
    features: [
      {
        icon: <TrendingUp className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "दैनिक लाइव भाव",
        sub: "हजारों मंडियों के ताज़ा रेट",
        accent: "emerald",
      },
      {
        icon: <MapPin className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "नज़दीकी मंडी",
        sub: "दूरी व परिवहन अनुसार तुलना",
        accent: "sky",
      },
      {
        icon: <Bell className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "भाव अलर्ट",
        sub: "कीमत बढ़ते ही फोन पर सूचना",
        accent: "amber",
      },
    ],
    ctaHi: "आगे जाएं",
    theme: {
      gradient: "from-amber-500/15 via-emerald-500/10 to-transparent",
      glow: "rgba(245, 158, 11, 0.22)",
      accent: "#d97706",
    },
  },
  {
    id: "guide",
    hero: "/onboarding/04-guidance-v2.jpg",
    badge: "चरणबद्ध फसल चक्र सलाह",
    badgeIcon: <CalendarDays className="h-3.5 w-3.5" />,
    floatingTag: "🌱 बुवाई से कटाई तक",
    titleHi: "चरणबद्ध फसल सलाह",
    titleEn: "Stage-wise Crop Guidance",
    bodyHi: "शुरुआत, लगाना, देखभाल और सुरक्षा — हर अवस्था पर क्या करें और कब करें की संपूर्ण जानकारी।",
    features: [
      {
        icon: <CalendarDays className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "4 मुख्य चरण",
        sub: "शुरुआत, रोपाई, बढ़वार व सुरक्षा",
        accent: "emerald",
      },
      {
        icon: <Sprout className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "खाद व सिंचाई",
        sub: "समय पर सही पोषण की मात्रा",
        accent: "teal",
      },
      {
        icon: <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2.4} />,
        title: "बंपर पैदावार",
        sub: "वैज्ञानिक व भरोसेमंद मार्गदर्शन",
        accent: "amber",
      },
    ],
    ctaHi: "शुरू करें",
    theme: {
      gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
      glow: "rgba(16, 185, 129, 0.25)",
      accent: "#059669",
    },
  },
];

type Props = { onComplete: () => void };

export default function IntroCarousel({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const touchX = useRef<number | null>(null);
  const isLast = index >= SLIDES.length - 1;
  const slide = SLIDES[index]!;

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= SLIDES.length) return;
      setDir(next > index ? 1 : -1);
      setIndex(next);
    },
    [index]
  );

  const next = useCallback(() => {
    if (isLast) {
      onComplete();
      return;
    }
    go(index + 1);
  }, [go, index, isLast, onComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "Escape") onComplete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, next, onComplete]);

  return (
    <div
      id="agriveda-intro-carousel"
      className="agriveda-intro fixed inset-0 z-[99999] flex flex-col justify-between overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#F7FAF7] via-[#F0F7EE] to-[#E8F3E5] text-slate-800 antialiased"
    >
      {/* Decorative background ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-40 blur-3xl transition-all duration-700"
        style={{ background: slide.theme.glow }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{ background: slide.theme.glow }}
      />

      {/* Top Bar: Brand Pill + Skip Button */}
      <header className="relative z-20 flex shrink-0 items-center justify-between px-5 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-1 shadow-xs backdrop-blur-md">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
            <Leaf className="h-3 w-3" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-xs font-black tracking-tight text-emerald-950">
            AgriVeda
          </span>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center gap-1 rounded-full border border-emerald-900/10 bg-white/70 px-3.5 py-1.5 text-xs font-bold text-emerald-900 shadow-xs transition hover:bg-white active:scale-95 backdrop-blur-md"
        >
          <span>छोड़ें (Skip)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Middle Interactive Slide Area */}
      <main
        className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-4 py-2 sm:px-6"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          if (start == null) return;
          const end = e.changedTouches[0]?.clientX ?? start;
          const delta = end - start;
          if (delta < -50) next();
          else if (delta > 50) go(index - 1);
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -35 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex w-full max-w-md flex-col items-center text-center"
          >
            {/* Visual Hero Card */}
            <div className="relative mb-3 flex w-full items-center justify-center">
              <div
                className="relative aspect-square w-[min(65vw,250px)] max-h-[250px] overflow-hidden rounded-[2rem] border-2 border-white/90 bg-white shadow-[0_20px_45px_-15px_rgba(20,83,45,0.22)] ring-1 ring-emerald-900/5 sm:w-[260px] sm:max-h-[260px]"
              >
                <Image
                  src={slide.hero}
                  alt={slide.titleHi}
                  fill
                  priority
                  sizes="(max-width: 640px) 250px, 280px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Subtle gradient vignette at bottom of image */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating pill tag inside image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-emerald-950 shadow-md backdrop-blur-md">
                    {slide.floatingTag}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage / Feature Category Pill */}
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-[11px] font-black tracking-wide text-emerald-800">
              {slide.badgeIcon}
              <span>{slide.badge}</span>
            </div>

            {/* Titles */}
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,5.5vw,1.95rem)] font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-2xl">
              {slide.titleHi}
            </h1>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-emerald-700/80">
              {slide.titleEn}
            </p>

            {/* Description Body */}
            <p className="mt-2 max-w-[36ch] text-xs leading-relaxed text-slate-600 sm:text-[13px]">
              {slide.bodyHi}
            </p>

            {/* 3 Feature Pills */}
            <div className="mt-4 grid w-full grid-cols-3 gap-2">
              {slide.features.map((f, fIdx) => (
                <div
                  key={fIdx}
                  className="flex flex-col items-center rounded-2xl border border-white/80 bg-white/75 p-2 shadow-xs backdrop-blur-sm transition hover:bg-white"
                >
                  <div
                    className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-full ${
                      f.accent === "emerald"
                        ? "bg-emerald-100 text-emerald-700"
                        : f.accent === "amber"
                        ? "bg-amber-100 text-amber-700"
                        : f.accent === "sky"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {f.icon}
                  </div>
                  <p className="text-[11px] font-black leading-tight text-slate-900 line-clamp-1">
                    {f.title}
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium leading-tight text-slate-500 line-clamp-1">
                    {f.sub}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Sticky Action Area */}
      <footer className="relative z-20 shrink-0 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto max-w-md">
          {/* Pagination Dots / Progress Pill */}
          <div
            className="mb-3.5 flex items-center justify-center gap-2"
            aria-label={`Slide ${index + 1} of ${SLIDES.length}`}
          >
            {SLIDES.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? "step" : undefined}
                  onClick={() => go(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: active ? 28 : 8,
                    backgroundColor: active ? "#059669" : "rgba(5, 150, 105, 0.2)",
                  }}
                />
              );
            })}
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={next}
            className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-base font-black text-white shadow-[0_12px_28px_-8px_rgba(5,150,105,0.5)] transition duration-200 hover:from-emerald-500 hover:to-teal-600 active:scale-[0.98]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:rotate-12">
              <Leaf className="h-4 w-4 text-white" strokeWidth={2.4} />
            </span>
            <span className="tracking-wide">{slide.ctaHi}</span>
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.6} />
          </button>
        </div>
      </footer>
    </div>
  );
}
