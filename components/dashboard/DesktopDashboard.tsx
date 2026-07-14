"use client";

import AppLink from "@/components/ui/AppLink";
import { Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import DashboardWeatherHero from "@/components/dashboard/DashboardWeatherHero";
import HomeFarmSnapshot from "@/components/dashboard/HomeFarmSnapshot";
import HomeFeatureGrid from "@/components/dashboard/HomeFeatureGrid";
import { HomeTipCarousel } from "@/components/dashboard/HomeSnapSlider";
import { QuickActionIcon } from "@/components/services/SpriteQuickIcon";
import BiHeading from "@/components/i18n/BiHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmData } from "@/hooks/useFarmData";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

const QUICK_ACTIONS: {
  label: string;
  labelHi: string;
  href: string;
  col?: number;
  row?: number;
  lucide?: typeof Plus;
  imageSrc?: string;
}[] = [
  { label: "AI Doctor", labelHi: "AI डॉक्टर", href: "/ai-doctor", imageSrc: "/images/icons/ai-doctor.png" },
  { label: "Add Field", labelHi: "खेत जोड़ें", href: "/my-farm", lucide: Plus },
  { label: "Crop Planner", labelHi: "फसल योजना", href: "/crop-calendar", col: 1, row: 0 },
  { label: "Pest Scanner", labelHi: "कीट स्कैन", href: "/pest-diseases", col: 3, row: 0 },
  { label: "Fertilizer", labelHi: "उर्वरक", href: "/services/fertilizer-calculator", col: 2, row: 0 },
  { label: "Mandi", labelHi: "मंडी", href: "/mandi", col: 5, row: 0 },
  { label: "Weather", labelHi: "मौसम", href: "/weather", col: 0, row: 1 },
];

const TIPS_EN = [
  { title: "Add your own farm data", body: "Enter acreage and crops in My Farm — alerts use your fields." },
  { title: "Check weather before spray", body: "Use Spray Advisory for wind and rain risk.", href: "/weather/spray-advisory" },
  { title: "Live mandi rates", body: "Check today’s prices before selling.", href: "/mandi" },
];

const TIPS_HI = [
  { title: "खेत का डेटा खुद भरें", body: "My Farm में रकबा और फसल जोड़ें — alerts उसी से आएंगे।" },
  { title: "स्प्रे से पहले मौसम देखें", body: "Spray Advisory में हवा और बारिश चेक करें।", href: "/weather/spray-advisory" },
  { title: "मंडी भाव live", body: "Mandi page पर आज के भाव — बेचने से पहले देखें।", href: "/mandi" },
];

export default function DesktopDashboard({ embedded: _embedded }: { embedded?: boolean } = {}) {
  const { data: farm } = useFarmData();
  const reduced = useReducedMotion();
  const { locale } = useLocale();
  const isHi = locale === "hi" || locale === "hinglish";

  return (
    <div className="min-w-0 max-w-full space-y-3 overflow-x-hidden">
      <DashboardWeatherHero />

      <HomeFarmSnapshot />

      <section className="min-w-0">
        <div className="mb-1.5 px-0.5">
          <BiHeading
            en="Quick Actions"
            hi="त्वरित सेवाएँ"
            as="h2"
            className="text-xs font-bold text-[var(--av-text-primary)]"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {QUICK_ACTIONS.map((a, i) => (
            <motion.div
              key={a.href + a.label}
              className="min-w-0"
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: MOTION.normal, ease: EASE_OUT }}
            >
              <AppLink
                href={a.href}
                className="group flex flex-col items-center gap-1 text-center active:scale-95"
              >
                <QuickActionIcon
                  label={a.label}
                  col={a.col}
                  row={a.row}
                  lucide={a.lucide}
                  imageSrc={a.imageSrc}
                />
                <span className="line-clamp-2 text-[9px] font-semibold leading-tight text-[var(--av-text-secondary)]">
                  {isHi ? a.labelHi : a.label}
                </span>
              </AppLink>
            </motion.div>
          ))}
        </div>
      </section>

      <HomeFeatureGrid />

      <HomeTipCarousel tips={isHi ? TIPS_HI : TIPS_EN} />

      {farm.activities.length > 0 && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3"
        >
          <div className="flex items-center justify-between">
            <BiHeading
              en="Your tasks"
              hi="आपके कार्य"
              as="h3"
              className="text-xs font-bold text-[var(--av-text-primary)]"
            />
            <AppLink href="/my-farm" className="text-[10px] font-bold text-[var(--av-accent)]">
              {isHi ? "सभी →" : "All →"}
            </AppLink>
          </div>
          <ul className="mt-2 space-y-1">
            {farm.activities.slice(0, 3).map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-[var(--av-surface-inset)] px-2.5 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-[var(--av-text-primary)]">{a.task}</p>
                  <p className="truncate text-[9px] text-[var(--av-text-muted)]">{a.field}</p>
                </div>
                <span className="shrink-0 text-[9px] font-bold text-[var(--av-accent)]">{a.date}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
