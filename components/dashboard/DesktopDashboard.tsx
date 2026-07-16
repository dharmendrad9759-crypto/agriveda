"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { motion, useReducedMotion } from "framer-motion";
import DashboardWeatherHero from "@/components/dashboard/DashboardWeatherHero";
import HomeFarmSnapshot from "@/components/dashboard/HomeFarmSnapshot";
import HomeFeatureGrid from "@/components/dashboard/HomeFeatureGrid";
import { HomeTipCarousel } from "@/components/dashboard/HomeSnapSlider";
import { QuickActionIcon } from "@/components/services/SpriteQuickIcon";
import BiHeading from "@/components/i18n/BiHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmData } from "@/hooks/useFarmData";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

const QUICK_ACTIONS: {
  label: string;
  labelHi: string;
  href: string;
  col?: number;
  row?: number;
  imageSrc?: string;
}[] = [
  { label: "AI Doctor", labelHi: "AI डॉक्टर", href: "/ai-doctor", imageSrc: "/images/icons/ai-doctor.png" },
  { label: "My Farm", labelHi: "मेरा खेत", href: "/my-farm", imageSrc: "/images/icons/tools/my-farm.png" },
  { label: "Crop Planner", labelHi: "फसल योजना", href: "/crop-calendar", imageSrc: "/images/icons/tools/crop-planner.png" },
  { label: "Pest Scanner", labelHi: "कीट स्कैन", href: "/pest-diseases", imageSrc: "/images/icons/tools/pest-scanner.png" },
  { label: "Fertilizer", labelHi: "उर्वरक", href: "/services/fertilizer-calculator", imageSrc: "/images/icons/tools/fertilizer.png" },
  { label: "Mandi", labelHi: "मंडी", href: "/mandi", imageSrc: "/images/icons/tools/mandi.png" },
  { label: "Weather", labelHi: "मौसम", href: "/weather", imageSrc: "/images/icons/tools/weather.png" },
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

  const primaryField = farm.fields[0];
  const backdropSrc = resolveCropImage({
    slug: primaryField?.cropSlug || "paddy",
    name: primaryField?.crop || "Paddy",
  });

  return (
    <div className="relative min-w-0 max-w-full overflow-x-hidden">
      {/* Atmospheric crop photo behind the whole home stack */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-12px] top-0 z-0 h-[min(72vh,640px)] overflow-hidden sm:inset-x-[-20px]"
      >
        <Image
          src={backdropSrc}
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1100px"
          className="object-cover object-[center_28%] scale-110 opacity-[0.52] dark:opacity-[0.34]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/30 via-[var(--background)]/58 to-[var(--background)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 via-transparent to-lime-500/10" />
        <div className="absolute -right-10 top-16 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -left-8 bottom-10 h-32 w-32 rounded-full bg-lime-400/15 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-3">
        <DashboardWeatherHero />

        <HomeFarmSnapshot />

        <section className="min-w-0">
          <div className="mb-1.5 px-0.5">
            <BiHeading
              en="Quick Actions"
              hi="त्वरित सेवाएँ"
              as="h2"
              className="font-display text-sm font-bold tracking-tight text-[var(--av-text-primary)]"
            />
            <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
              {isHi ? "एक टैप — स्मार्ट खेती" : "One tap — smarter farming"}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {QUICK_ACTIONS.map((a, i) => (
              <motion.div
                key={a.href + a.label}
                className="min-w-0"
                initial={reduced ? false : { opacity: 0, scale: 0.86, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04, duration: 0.4, ease: EASE_OUT }}
                whileHover={reduced ? undefined : { y: -3 }}
                whileTap={reduced ? undefined : { scale: 0.96 }}
              >
                <AppLink
                  href={a.href}
                  className="group flex flex-col items-center gap-1 text-center active:scale-95"
                >
                <QuickActionIcon
                  label={a.label}
                  col={a.col}
                  row={a.row}
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
            className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]/90 p-3 backdrop-blur-sm"
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
    </div>
  );
}
