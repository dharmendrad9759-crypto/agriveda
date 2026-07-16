"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { Camera, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { EASE_OUT } from "@/lib/motion/variants";

const HERO_IMG = "/images/agriveda-scan-hero.jpg";

export default function HomeScanHero() {
  const { profile } = useFarmerProfile();
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const isHi = locale === "hi" || locale === "hinglish";
  const name = profile.name.trim() || (isHi ? "किसान भाई" : "Farmer");

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="relative isolate overflow-hidden rounded-[1.75rem] shadow-[0_18px_44px_-16px_rgba(4,80,40,0.45)]"
      aria-label="Scan crop problem"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Farmer scanning a crop leaf with a phone for disease detection"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 512px"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062416]/95 via-[#0a3d24]/55 to-[#0a3d24]/25" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/35 via-transparent to-amber-900/20" />
      </div>

      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-6 h-28 w-28 rounded-full bg-lime-300/25 blur-3xl"
          animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative z-10 flex min-h-[220px] flex-col justify-between p-4 sm:min-h-[240px] sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-[1.65rem] font-extrabold leading-none tracking-tight text-white sm:text-[1.85rem]">
              AgriVeda
            </p>
            <p className="mt-2 text-[15px] font-semibold leading-snug text-emerald-50/95">
              {isHi
                ? `नमस्ते ${name} — आज फसल के लिए क्या करें?`
                : `Namaste ${name} — aaj fasal ke liye kya karein?`}
            </p>
            <p className="mt-1 max-w-[18rem] text-[12px] leading-relaxed text-emerald-100/80">
              {isHi
                ? "पत्ती की फोटो लें, AI Doctor तुरंत बताएगा।"
                : "Leaf ki photo lo — AI Doctor turant batayega."}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200/35 bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold text-amber-50 backdrop-blur-md">
            <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
            {isHi ? "भरोसेमंद" : "Trusted"}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <AppLink
            href="/ai-doctor"
            className="group inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-[15px] font-bold text-emerald-900 shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition hover:bg-emerald-50 active:scale-[0.98]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition group-hover:scale-105">
              <Camera className="h-4 w-4" strokeWidth={2.4} />
            </span>
            {isHi ? "समस्या स्कैन करें" : "Scan Problem"}
          </AppLink>

          <AppLink
            href="/ai-doctor"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-white/30 bg-white/12 px-4 py-2.5 text-[13px] font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98]"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-200" />
            {isHi ? "AI Doctor से पूछें" : "Ask AI Doctor"}
          </AppLink>
        </div>
      </div>
    </motion.section>
  );
}
