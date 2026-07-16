"use client";

import { motion, useReducedMotion } from "framer-motion";
import AppLink from "@/components/ui/AppLink";
import BiHeading from "@/components/i18n/BiHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion/variants";

const FEATURES: {
  label: string;
  labelHi: string;
  sub: string;
  subHi: string;
  href: string;
  imageSrc: string;
  ring: string;
}[] = [
  {
    label: "Nutrients",
    labelHi: "पोषक तत्व",
    sub: "Deficiency",
    subHi: "कमी",
    href: "/deficiencies",
    imageSrc: "/images/icons/tools/nutrients.png",
    ring: "ring-lime-500/40",
  },
  {
    label: "Advisor",
    labelHi: "सलाहकार",
    sub: "Field",
    subHi: "खेती",
    href: "/field-advisor",
    imageSrc: "/images/icons/tools/advisor.png",
    ring: "ring-emerald-500/40",
  },
  {
    label: "Sowing",
    labelHi: "बुआई",
    sub: "Window",
    subHi: "समय",
    href: "/sowing-window",
    imageSrc: "/images/icons/tools/sowing-window.png",
    ring: "ring-indigo-500/40",
  },
  {
    label: "Spray",
    labelHi: "स्प्रे",
    sub: "Advisory",
    subHi: "सलाह",
    href: "/weather/spray-advisory",
    imageSrc: "/images/icons/tools/spray-advisory.png",
    ring: "ring-cyan-500/40",
  },
  {
    label: "Alerts",
    labelHi: "अलर्ट",
    sub: "Farm",
    subHi: "खेत",
    href: "/alerts",
    imageSrc: "/images/icons/tools/farm-alert.png",
    ring: "ring-red-500/40",
  },
  {
    label: "Weeds",
    labelHi: "खरपतवार",
    sub: "Guide",
    subHi: "गाइड",
    href: "/pest-diseases?type=weed",
    imageSrc: "/images/icons/tools/weed-guide.png",
    ring: "ring-orange-500/40",
  },
];

export default function HomeFeatureGrid() {
  const reduced = useReducedMotion();
  const { locale } = useLocale();
  const isHi = locale === "hi" || locale === "hinglish";

  return (
    <section className="min-w-0">
      <div className="mb-1.5 px-0.5">
            <BiHeading
              en="More Tools"
              hi="और टूल्स"
              as="h2"
              className="font-display text-sm font-bold tracking-tight text-[var(--av-text-primary)]"
            />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.href + f.label}
            className="min-w-0"
            initial={reduced ? false : { opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 + Math.min(i, 8) * 0.04, duration: 0.4, ease: EASE_OUT }}
            whileHover={reduced ? undefined : { y: -3 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
          >
            <AppLink
              href={f.href}
              className={cn(
                "group av-tool-press flex h-full flex-col items-center gap-1 rounded-2xl border border-emerald-500/15 bg-[var(--av-surface)]/90 p-2 text-center shadow-sm backdrop-blur-sm",
                "transition duration-200 hover:border-[var(--av-accent)]/40 hover:shadow-[0_10px_28px_rgba(0,100,50,0.14)]"
              )}
            >
              <span
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500/10 to-transparent ring-1 sm:h-16 sm:w-16",
                  f.ring
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.imageSrc}
                  alt=""
                  className="h-full w-full scale-[1.18] object-cover"
                  draggable={false}
                />
              </span>
              <span className="line-clamp-1 text-[10px] font-bold text-[var(--av-text-primary)]">
                {isHi ? f.labelHi : f.label}
              </span>
              <span className="line-clamp-1 text-[8px] text-[var(--av-text-muted)]">
                {isHi ? f.subHi : f.sub}
              </span>
            </AppLink>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
