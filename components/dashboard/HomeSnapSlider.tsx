"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

interface HomeSnapSliderProps {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
  autoPlayMs?: number;
  itemCount?: number;
}

/** Horizontal snap slider for home — swipe on mobile, arrows on desktop */
export default function HomeSnapSlider({
  children,
  className,
  showArrows = true,
  autoPlayMs,
  itemCount = 0,
}: HomeSnapSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  const scrollByCard = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + 10 : el.clientWidth * 0.7;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.querySelector<HTMLElement>("[data-slide]");
      const step = card ? card.offsetWidth + 10 : 120;
      setIndex(Math.round(el.scrollLeft / step));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!autoPlayMs || reduced || itemCount < 2) return;
    const id = window.setInterval(() => scrollByCard(1), autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlayMs, reduced, itemCount]);

  return (
    <div className={cn("relative min-w-0", className)}>
      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByCard(-1)}
            className="absolute -left-1 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--av-border)] bg-[var(--av-surface)]/95 text-[var(--av-text-primary)] shadow-md backdrop-blur sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByCard(1)}
            className="absolute -right-1 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--av-border)] bg-[var(--av-surface)]/95 text-[var(--av-text-primary)] shadow-md backdrop-blur sm:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      <motion.div
        ref={ref}
        className="scrollbar-hide flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 scroll-smooth"
        initial={reduced ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: MOTION.slow, ease: EASE_OUT }}
      >
        {children}
      </motion.div>

      {itemCount > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {Array.from({ length: Math.min(itemCount, 8) }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === index % Math.min(itemCount, 8)
                  ? "w-4 bg-[var(--av-accent)]"
                  : "w-1 bg-[var(--av-border)]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HomeTipCarousel({
  tips,
}: {
  tips: { title: string; body: string; href?: string }[];
}) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || tips.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % tips.length), 4500);
    return () => window.clearInterval(id);
  }, [tips.length, reduced]);

  const tip = tips[i];
  if (!tip) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-[var(--av-surface)] to-lime-500/5 p-3">
      <div className="pointer-events-none absolute inset-0 agriveda-shimmer opacity-60" />
      <AnimatePresence mode="wait">
        <motion.div
          key={tip.title}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          className="relative"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Smart tip
          </p>
          <p className="mt-0.5 text-sm font-bold text-[var(--av-text-primary)]">{tip.title}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-[var(--av-text-muted)]">{tip.body}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 flex gap-1">
        {tips.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Tip ${idx + 1}`}
            onClick={() => setI(idx)}
            className={cn(
              "h-1 rounded-full transition-all",
              idx === i ? "w-5 bg-emerald-500" : "w-1.5 bg-[var(--av-border)]"
            )}
          />
        ))}
      </div>
    </div>
  );
}
