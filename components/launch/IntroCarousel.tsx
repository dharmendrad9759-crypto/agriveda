"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
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
} from "lucide-react";

type Feature = { icon: ReactNode; title: string; sub: string };

type Slide = {
  id: string;
  hero: string;
  /** object-position so circular crop hits the illustration */
  heroPos: string;
  titleHi: string;
  titleEn: string;
  bodyHi: string;
  features: Feature[];
  ctaHi: string;
  ctaIcon: "leaf" | "book" | "check";
};

const SLIDES: Slide[] = [
  {
    id: "farm",
    hero: "/onboarding/01-farm.png",
    heroPos: "50% 28%",
    titleHi: "स्मार्ट खेत प्रबंधन",
    titleEn: "Smart Farm Management",
    bodyHi: "फसल, खर्च और उपज ट्रैक करें। हर फसल चक्र का लाभ रिपोर्ट पाएं।",
    features: [
      {
        icon: <TrendingUp className="h-5 w-5" strokeWidth={2.2} />,
        title: "फसल ट्रेकिंग",
        sub: "पूरी जानकारी रखें",
      },
      {
        icon: <IndianRupee className="h-5 w-5" strokeWidth={2.2} />,
        title: "खर्च & लाभ रिपोर्ट",
        sub: "सटीक रिकॉर्ड पाएं",
      },
      {
        icon: <CloudSun className="h-5 w-5" strokeWidth={2.2} />,
        title: "मौसम अपडेट",
        sub: "रियल-टाइम जानकारी",
      },
    ],
    ctaHi: "आगे जाएं",
    ctaIcon: "leaf",
  },
  {
    id: "ai",
    hero: "/onboarding/02-ai-doctor.png",
    heroPos: "50% 26%",
    titleHi: "एआई फसल डॉक्टर",
    titleEn: "AI Crop Doctor",
    bodyHi: "पत्ते की फोटो से कीट-रोग जल्दी पहचानें — साफ छिड़काव मार्गदर्शन के साथ।",
    features: [
      {
        icon: <Camera className="h-5 w-5" strokeWidth={2.2} />,
        title: "फोटो से पहचान",
        sub: "पत्ते की फोटो अपलोड करें",
      },
      {
        icon: <FileSearch className="h-5 w-5" strokeWidth={2.2} />,
        title: "AI विश्लेषण",
        sub: "कीट-रोग का तुरंत पता",
      },
      {
        icon: <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />,
        title: "सटीक सलाह",
        sub: "बेहतर छिड़काव मार्गदर्शन",
      },
    ],
    ctaHi: "आगे जाएं",
    ctaIcon: "leaf",
  },
  {
    id: "mandi",
    hero: "/onboarding/03-mandi.png",
    heroPos: "50% 30%",
    titleHi: "लाइव मंडी भाव",
    titleEn: "Live Mandi Prices",
    bodyHi: "नज़दीकी मंडी के भाव देखें और बेचने का सही दिन चुनें।",
    features: [
      {
        icon: <TrendingUp className="h-5 w-5" strokeWidth={2.2} />,
        title: "लाइव भाव अपडेट",
        sub: "हर पल के ताज़ा मंडी भाव",
      },
      {
        icon: <MapPin className="h-5 w-5" strokeWidth={2.2} />,
        title: "अपनी नज़दीकी मंडी",
        sub: "अपने क्षेत्र की मंडी चुनें",
      },
      {
        icon: <Bell className="h-5 w-5" strokeWidth={2.2} />,
        title: "कीमत अलर्ट",
        sub: "भाव बढ़ते ही पाएं सूचना",
      },
    ],
    ctaHi: "आगे जाएं",
    ctaIcon: "leaf",
  },
  {
    id: "guide",
    hero: "/onboarding/04-guidance.png",
    heroPos: "50% 28%",
    titleHi: "चरणबद्ध सलाह",
    titleEn: "Stage-wise Guidance",
    bodyHi: "खाद, सिंचाई और स्प्रे — फसल की अवस्था के मुताबिक सलाह।",
    features: [
      {
        icon: <CalendarDays className="h-5 w-5" strokeWidth={2.2} />,
        title: "हर चरण की जानकारी",
        sub: "बुवाई से कटाई तक",
      },
      {
        icon: <Sprout className="h-5 w-5" strokeWidth={2.2} />,
        title: "क्या करें और कब करें",
        sub: "समय पर सही काम",
      },
      {
        icon: <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />,
        title: "बेहतर उत्पादन",
        sub: "वैज्ञानिक और भरोसेमंद सलाह",
      },
    ],
    ctaHi: "शुरू करें",
    ctaIcon: "book",
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
      className="agriveda-intro fixed inset-0 z-[99999] flex flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #FFFFFF 0%, #F7FAF6 45%, #EEF5EC 100%)",
      }}
    >
      {/* Soft leaf decor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 90 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M45 14c-9 16-9 34 0 50 9-16 9-34 0-50z' fill='%231E4D40'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex items-center justify-end px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[14px] font-bold text-[#1E4D40]/75 transition active:bg-[#1E4D40]/8"
        >
          आगे बढ़ें
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col px-5"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          if (start == null) return;
          const end = e.changedTouches[0]?.clientX ?? start;
          const delta = end - start;
          if (delta < -55) next();
          else if (delta > 55) go(index - 1);
        }}
      >
        <div
          key={slide.id}
          className="agriveda-intro__slide mx-auto flex w-full max-w-md flex-1 flex-col items-center"
          style={{ ["--slide-dir" as string]: String(dir) }}
        >
          {/* Circular hero */}
          <div className="relative mt-1 flex h-[min(42vw,210px)] w-[min(42vw,210px)] shrink-0 items-center justify-center sm:h-[230px] sm:w-[230px]">
            <div
              aria-hidden
              className="absolute -inset-2 rounded-full opacity-50"
              style={{
                background:
                  "conic-gradient(from 200deg, rgba(0,168,107,0.35), rgba(212,175,55,0.25), rgba(30,77,64,0.2), rgba(0,168,107,0.35))",
                filter: "blur(1px)",
              }}
            />
            <div className="relative h-full w-full overflow-hidden rounded-full bg-[#E8F5E9] shadow-[0_18px_40px_-16px_rgba(30,77,64,0.35)] ring-[6px] ring-white">
              <Image
                src={slide.hero}
                alt=""
                fill
                priority
                sizes="230px"
                className="object-cover"
                style={{ objectPosition: slide.heroPos }}
              />
            </div>
            <Leaf
              aria-hidden
              className="absolute -right-1 top-6 h-8 w-8 text-[#00A86B] drop-shadow"
              strokeWidth={1.75}
            />
            <Leaf
              aria-hidden
              className="absolute -left-2 bottom-10 h-7 w-7 -scale-x-100 text-[#1E4D40]/70 drop-shadow"
              strokeWidth={1.75}
            />
          </div>

          <h2 className="mt-5 m-0 text-center font-sans text-[clamp(1.45rem,5.8vw,1.85rem)] font-extrabold leading-tight tracking-tight text-[#1E4D40]">
            {slide.titleHi}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-px w-8 bg-[#00A86B]/35" />
            <Leaf className="h-3 w-3 text-[#00A86B]" />
            <p className="m-0 font-display text-[13px] font-semibold italic text-[#1E4D40]/65">
              {slide.titleEn}
            </p>
            <Leaf className="h-3 w-3 text-[#00A86B]" />
            <span className="h-px w-8 bg-[#00A86B]/35" />
          </div>
          <p className="mt-3 max-w-[34ch] text-center text-[14px] leading-relaxed text-[#1E4D40]/70">
            {slide.bodyHi}
          </p>

          {/* Feature strip */}
          <div className="mt-5 w-full rounded-2xl border border-[#1E4D40]/10 bg-white/80 p-3 shadow-[0_8px_24px_-18px_rgba(30,77,64,0.35)] backdrop-blur-sm">
            <div className="grid grid-cols-3 divide-x divide-[#1E4D40]/10">
              {slide.features.map((f) => (
                <div key={f.title} className="flex flex-col items-center px-1.5 py-1 text-center">
                  <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1E4D40]">
                    {f.icon}
                  </div>
                  <p className="m-0 text-[11px] font-extrabold leading-snug text-[#1E4D40]">{f.title}</p>
                  <p className="m-0 mt-0.5 text-[9px] font-medium leading-snug text-[#1E4D40]/55">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-[max(1.15rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mb-4 flex items-center justify-center gap-2" aria-label={`Slide ${index + 1} of ${SLIDES.length}`}>
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
                  width: active ? 26 : 8,
                  background: active ? "#1E4D40" : "rgba(30,77,64,0.2)",
                }}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={next}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#1E4D40] px-5 py-[15px] text-[16px] font-bold text-white shadow-[0_14px_32px_-12px_rgba(30,77,64,0.65)] transition active:scale-[0.99]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00A86B]/35">
            <Leaf className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <span>{slide.ctaHi}</span>
          <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
        </button>
      </div>

      <style>{`
        .agriveda-intro__slide {
          animation: agriveda-intro-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes agriveda-intro-in {
          from { opacity: 0; transform: translateX(calc(var(--slide-dir, 1) * 24px)); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .agriveda-intro__slide { animation: none; }
        }
      `}</style>
    </div>
  );
}
