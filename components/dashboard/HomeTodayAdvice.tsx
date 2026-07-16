"use client";

import AppLink from "@/components/ui/AppLink";
import { Lightbulb, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { buildFieldRecommendations } from "@/lib/field-advisor/buildFieldRecommendations";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

export default function HomeTodayAdvice() {
  const alerts = useDashboardAlerts(1);
  const recs = buildFieldRecommendations(alerts);
  const tip = recs[0];
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const isHi = locale === "hi" || locale === "hinglish";

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT, delay: 0.12 }}
    >
      <div className="mb-2 flex items-end justify-between px-0.5">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-[var(--av-text-primary)]">
            {isHi ? "आज की सलाह" : "Today’s Advice"}
          </h2>
          <p className="mt-0.5 text-[12px] text-[var(--av-text-muted)]">
            {isHi ? "एक साफ कदम — अभी करें" : "One clear step for today"}
          </p>
        </div>
      </div>

      <AppLink
        href={tip?.href ?? "/field-advisor"}
        className="av-tool-press relative block overflow-hidden rounded-[1.35rem] border border-emerald-500/20 bg-gradient-to-br from-[var(--av-accent-soft)] via-[var(--av-surface)] to-[var(--av-surface-muted)] p-4 shadow-[var(--av-shadow-md)]"
      >
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/15 blur-2xl" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
            <Lightbulb className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700/80 dark:text-emerald-300/80">
              {tip?.crop ?? (isHi ? "आपका खेत" : "Your field")}
            </p>
            <p className="mt-1 text-[15px] font-semibold leading-snug text-[var(--av-text-primary)]">
              {tip?.tip ??
                (isHi
                  ? "स्प्रे से पहले मौसम और हवा जाँचें।"
                  : "Spray se pehle hawa aur baarish check karein.")}
            </p>
            <span className="mt-2.5 inline-flex items-center gap-0.5 text-[12px] font-bold text-[var(--av-accent)]">
              {isHi ? "अभी देखें" : "Do this now"}
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </AppLink>
    </motion.section>
  );
}
