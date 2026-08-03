"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

type Slide = {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  illustration: "wheat" | "ai" | "mandi" | "guide";
};

const SLIDES: Slide[] = [
  {
    id: "farm",
    title: "Smart Farm Management",
    titleHi: "स्मार्ट खेत प्रबंधन",
    subtitle:
      "Track your crops, expenses, and harvests. Get profit reports for every crop cycle.",
    subtitleHi:
      "फसल, खर्च और उपज ट्रैक करें। हर फसल चक्र का लाभ रिपोर्ट पाएं।",
    illustration: "wheat",
  },
  {
    id: "ai",
    title: "AI Crop Doctor",
    titleHi: "एआई फसल डॉक्टर",
    subtitle:
      "Snap a leaf photo to spot pests and disease early — with clear spray guidance.",
    subtitleHi:
      "पत्ते की फोटो से कीट-रोग जल्दी पहचानें — साफ छिड़काव मार्गदर्शन के साथ।",
    illustration: "ai",
  },
  {
    id: "mandi",
    title: "Live Mandi Prices",
    titleHi: "लाइव मंडी भाव",
    subtitle:
      "Check nearby market rates and decide the best day to sell your harvest.",
    subtitleHi:
      "नज़दीकी मंडी के भाव देखें और बेचने का सही दिन चुनें।",
    illustration: "mandi",
  },
  {
    id: "guide",
    title: "Stage-wise Guidance",
    titleHi: "चरणबद्ध सलाह",
    subtitle:
      "Fertilizer, irrigation, and spray tips matched to your crop growth stage.",
    subtitleHi:
      "खाद, सिंचाई और स्प्रे — फसल की अवस्था के मुताबिक सलाह।",
    illustration: "guide",
  },
];

function SlideArt({ kind }: { kind: Slide["illustration"] }) {
  return (
    <div className="relative mx-auto flex h-[210px] w-[210px] items-center justify-center sm:h-[230px] sm:w-[230px]">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #5EEAD4 0%, #00A86B 45%, #1E4D40 100%)",
          boxShadow: "0 24px 50px -20px rgba(0,168,107,0.45)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-[10px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle at 70% 75%, rgba(212,175,55,0.55), transparent 55%)",
        }}
      />
      <svg viewBox="0 0 120 120" className="relative z-10 h-[58%] w-[58%]" aria-hidden>
        {kind === "wheat" && (
          <>
            <path d="M60 102 V42" stroke="#ECFDF5" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="48" cy="48" rx="9" ry="16" fill="#D4AF37" transform="rotate(-32 48 48)" />
            <ellipse cx="60" cy="40" rx="9" ry="16" fill="#F0D78C" />
            <ellipse cx="72" cy="48" rx="9" ry="16" fill="#D4AF37" transform="rotate(32 72 48)" />
            <path d="M42 70 C28 58 24 44 30 30 C42 40 46 56 42 70 Z" fill="#A7F3D0" />
            <path d="M78 72 C92 58 96 44 90 30 C78 42 74 58 78 72 Z" fill="#6EE7B7" />
          </>
        )}
        {kind === "ai" && (
          <>
            <rect x="28" y="34" width="64" height="52" rx="12" fill="#ECFDF5" opacity="0.95" />
            <circle cx="60" cy="58" r="14" fill="#00A86B" />
            <path d="M54 58 L58 62 L68 50" fill="none" stroke="#ECFDF5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40 92 C48 84 72 84 80 92" fill="none" stroke="#ECFDF5" strokeWidth="3" strokeLinecap="round" />
            <circle cx="44" cy="28" r="4" fill="#D4AF37" />
            <circle cx="76" cy="28" r="4" fill="#D4AF37" />
          </>
        )}
        {kind === "mandi" && (
          <>
            <path d="M30 86 H90 V78 L78 48 H42 L30 78 Z" fill="#ECFDF5" opacity="0.95" />
            <rect x="52" y="58" width="16" height="28" rx="2" fill="#1E4D40" />
            <path d="M42 48 L60 28 L78 48" fill="none" stroke="#D4AF37" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="60" cy="40" r="5" fill="#00A86B" />
          </>
        )}
        {kind === "guide" && (
          <>
            <path d="M40 88 V40 C40 32 50 28 60 28 C70 28 80 32 80 40 V88" fill="none" stroke="#ECFDF5" strokeWidth="5" strokeLinecap="round" />
            <path d="M48 52 H72 M48 64 H68 M48 76 H64" stroke="#A7F3D0" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="84" cy="36" r="12" fill="#D4AF37" />
            <path d="M84 30 V42 M78 36 H90" stroke="#1E4D40" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
}

type Props = {
  onComplete: () => void;
  locale?: "hi" | "en";
};

/**
 * Post-splash intro carousel (4 slides). Skip → language/login path (caller completes).
 */
export default function IntroCarousel({ onComplete, locale = "hi" }: Props) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const touchX = useRef<number | null>(null);
  const isLast = index >= SLIDES.length - 1;
  const slide = SLIDES[index]!;
  const hi = locale !== "en";

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
          "linear-gradient(180deg, #F8F9FA 0%, #F4F6F0 48%, #EEF3EA 100%)",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-end px-5 pt-[max(0.85rem,env(safe-area-inset-top))]"
      >
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg px-3 py-2 text-[14px] font-semibold text-[#1E4D40]/70 transition hover:bg-[#1E4D40]/8 hover:text-[#1E4D40]"
        >
          {hi ? "आगे बढ़ें" : "Skip"}
        </button>
      </div>

      {/* Slide */}
      <div
        className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6"
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
          className="agriveda-intro__slide flex w-full max-w-md flex-col items-center text-center"
          style={{ ["--slide-dir" as string]: String(dir) }}
        >
          <SlideArt kind={slide.illustration} />
          <h2 className="mt-8 m-0 font-sans text-[clamp(1.45rem,5.5vw,1.85rem)] font-bold leading-tight tracking-tight text-[#1E4D40]">
            {hi ? slide.titleHi : slide.title}
          </h2>
          {!hi ? null : (
            <p className="mt-1.5 text-[13px] font-medium text-[#00A86B]">{slide.title}</p>
          )}
          <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-[#1E4D40]/72">
            {hi ? slide.subtitleHi : slide.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mb-5 flex items-center justify-center gap-2" aria-label={`Page ${index + 1} of ${SLIDES.length}`}>
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
                  background: active ? "#1E4D40" : "rgba(30,77,64,0.22)",
                }}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={next}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E4D40] px-5 py-[15px] text-[16px] font-bold text-white shadow-[0_14px_32px_-14px_rgba(30,77,64,0.65)] transition active:scale-[0.99]"
        >
          <span>{isLast ? (hi ? "शुरू करें" : "Get Started") : hi ? "आगे जाएं" : "Next"}</span>
          <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
        </button>
      </div>

      <style>{`
        .agriveda-intro__slide {
          animation: agriveda-intro-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes agriveda-intro-in {
          from {
            opacity: 0;
            transform: translateX(calc(var(--slide-dir, 1) * 28px));
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .agriveda-intro__slide {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
