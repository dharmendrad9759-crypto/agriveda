"use client";

import AppLink from "@/components/ui/AppLink";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Bug,
  ChevronRight,
  CloudSun,
  FlaskConical,
  Home,
  Landmark,
  Languages,
  Leaf,
  Menu,
  MessageCircle,
  Scissors,
  Settings,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Tractor,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { APP_VERSION } from "@/lib/appMeta";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { useNavDrawer } from "./NavDrawerProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { farmerPlaceLine } from "@/lib/farmerPlaceName";

interface ShellNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface DrawerCategory {
  titleHi: string;
  titleEn: string;
  items: {
    labelHi: string;
    labelEn: string;
    href: string;
    icon: LucideIcon;
    badgeHi?: string;
    badgeEn?: string;
    badgeColor?: string;
    match?: (path: string) => boolean;
  }[];
}

const DRAWER_CATEGORIES: DrawerCategory[] = [
  {
    titleHi: "मुख्य सेवाएं",
    titleEn: "Main Services",
    items: [
      {
        labelHi: "होम",
        labelEn: "Home",
        href: "/",
        icon: Home,
        match: (p) => p === "/" || p === "/dashboard",
      },
      {
        labelHi: "मेरा खेत",
        labelEn: "My Farm",
        href: "/my-farm",
        icon: Tractor,
        match: (p) => p.startsWith("/my-farm"),
      },
      {
        labelHi: "AI फसल डॉक्टर",
        labelEn: "AI Crop Doctor",
        href: "/ai-doctor",
        icon: Stethoscope,
        badgeHi: "स्कैन",
        badgeEn: "Scan",
        badgeColor: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300",
        match: (p) => p.startsWith("/ai-doctor"),
      },
    ],
  },
  {
    titleHi: "फसल सुरक्षा व खाद",
    titleEn: "Crop Care & Nutrition",
    items: [
      {
        labelHi: "फसल गाइड",
        labelEn: "Crop Guide",
        href: "/crops",
        icon: BookOpen,
        match: (p) =>
          p.startsWith("/crops") &&
          !p.includes("/pests") &&
          !p.includes("/diseases") &&
          !p.includes("/nutrients") &&
          !p.includes("/fertilizer") &&
          !p.includes("/care"),
      },
      {
        labelHi: "कीट-रोग पहचान",
        labelEn: "Pest & Disease",
        href: "/pest-diseases",
        icon: Bug,
        match: (p) =>
          (p.includes("/pests") ||
            p.includes("/diseases") ||
            p.startsWith("/pest-diseases") ||
            p === "/pest-solver") &&
          !p.includes("type=weed"),
      },
      {
        labelHi: "खाद योजना",
        labelEn: "Fertilizer Plan",
        href: "/fertilizer",
        icon: FlaskConical,
        match: (p) => p.startsWith("/fertilizer") || p.includes("/services/fertilizer"),
      },
      {
        labelHi: "खरपतवार नियंत्रण",
        labelEn: "Weed Control",
        href: "/pest-diseases?type=weed",
        icon: Scissors,
        match: (p) => p.includes("type=weed") || p.startsWith("/weeds") || p.startsWith("/herbicide"),
      },
      {
        labelHi: "पोषक तत्व कमी",
        labelEn: "Nutrients",
        href: "/deficiencies",
        icon: Leaf,
        match: (p) => p.startsWith("/deficiencies") || p.includes("/nutrients"),
      },
    ],
  },
  {
    titleHi: "मंडी व सरकारी योजना",
    titleEn: "Mandi & Schemes",
    items: [
      {
        labelHi: "मंडी भाव",
        labelEn: "Mandi Rates",
        href: "/mandi",
        icon: TrendingUp,
        badgeHi: "लाइव",
        badgeEn: "Live",
        badgeColor: "bg-amber-500/20 text-amber-800 dark:text-amber-300",
        match: (p) => p.startsWith("/mandi") || p.startsWith("/market-trends"),
      },
      {
        labelHi: "सरकारी योजनाएं",
        labelEn: "Govt Schemes",
        href: "/schemes",
        icon: Landmark,
        match: (p) => p.startsWith("/schemes"),
      },
      {
        labelHi: "मौसम व बारिश",
        labelEn: "Weather",
        href: "/weather",
        icon: CloudSun,
        match: (p) => p.startsWith("/weather"),
      },
    ],
  },
  {
    titleHi: "सेटिंग्स व सहायता",
    titleEn: "Settings & Support",
    items: [
      {
        labelHi: "भाषा व थीम",
        labelEn: "Language & Theme",
        href: "/settings",
        icon: Languages,
        match: (p) => p === "/settings",
      },
      {
        labelHi: "प्रोफ़ाइल सेटिंग्स",
        labelEn: "Profile",
        href: "/profile",
        icon: Settings,
        match: (p) => p.startsWith("/profile"),
      },
      {
        labelHi: "मदद व संपर्क",
        labelEn: "Kisan Saathi Help",
        href: "/kisan-saathi",
        icon: MessageCircle,
        match: (p) => p.startsWith("/kisan-saathi") || p.startsWith("/ask-query"),
      },
    ],
  },
];

export default function ShellNavDrawer({ open, onClose }: ShellNavDrawerProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { locale, t } = useLocale();
  const isHi = locale === "hi";
  const { profile } = useFarmerProfile();

  const farmerName = profile.name.trim() || (isHi ? "किसान भाई" : "Farmer");
  const initial = farmerName.charAt(0).toUpperCase() || "क";
  const place = farmerPlaceLine(profile).full;
  const phoneOrPlace = profile.phone
    ? `+91 ${profile.phone}`
    : place || (isHi ? "स्थान जोड़ें" : "Add location");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.fast }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            aria-label={t("shellCloseMenu")}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-label={t("shellNavAria")}
            initial={reduced ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduced ? undefined : { x: "-100%" }}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
            className="av-sidebar absolute left-0 top-0 flex h-full w-[min(19rem,88vw)] flex-col bg-[var(--av-surface)] shadow-[var(--av-shadow-lg)]"
          >
            {/* Top Profile Header */}
            <div className="border-b border-[var(--av-border)] bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 p-3.5 text-white">
              <div className="flex items-center justify-between gap-2">
                <AppLink
                  href="/profile"
                  onClick={onClose}
                  className="flex min-w-0 flex-1 items-center gap-3 transition active:opacity-90"
                >
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-[1.1rem] font-black text-white shadow-md ring-2 ring-white/20">
                    {initial}
                    {profile.phoneVerified ? (
                      <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-emerald-950 bg-emerald-400 text-emerald-950">
                        <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                    ) : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold leading-tight text-white">
                      {farmerName}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-emerald-100/75">
                      {phoneOrPlace}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-emerald-200/60" />
                </AppLink>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-100 transition hover:bg-white/20 hover:text-white"
                  aria-label={t("shellCloseMenu")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Navigation Categories */}
            <nav className="flex-1 overflow-y-auto px-2.5 py-2 scrollbar-hide" aria-label={t("bottomNavLabel")}>
              {DRAWER_CATEGORIES.map((cat, cIdx) => (
                <div key={cat.titleEn} className={cIdx > 0 ? "mt-3 pt-2.5 border-t border-[var(--av-border)]/60" : "pt-1"}>
                  <p className="px-2.5 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    {isHi ? cat.titleHi : cat.titleEn}
                  </p>
                  <ul className="space-y-0.5">
                    {cat.items.map((item) => {
                      const active = item.match ? item.match(pathname) : pathname === item.href;
                      const Icon = item.icon;
                      const label = isHi ? item.labelHi : item.labelEn;
                      const badge = isHi ? item.badgeHi : item.badgeEn;

                      return (
                        <li key={item.href + item.labelEn}>
                          <AppLink
                            href={item.href}
                            onClick={onClose}
                            className={`relative flex min-h-[42px] items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-semibold transition-colors duration-150 ${
                              active
                                ? "bg-[var(--av-accent-soft)] text-[var(--av-accent)] font-bold"
                                : "text-[var(--av-text-secondary)] hover:bg-[var(--av-surface-muted)] hover:text-[var(--av-text-primary)]"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              {active && (
                                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[var(--av-accent)]" />
                              )}
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                  active
                                    ? "bg-[var(--av-accent)] text-white"
                                    : "bg-[var(--av-surface-muted)] text-[var(--av-text-muted)]"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="truncate">{label}</span>
                            </span>

                            {badge ? (
                              <span
                                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9.5px] font-bold ${
                                  item.badgeColor || "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                }`}
                              >
                                {badge}
                              </span>
                            ) : null}
                          </AppLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Bottom Footer */}
            <div className="border-t border-[var(--av-border)] p-3 bg-[var(--av-surface-muted)]/50">
              <AppLink
                href="/kisan-saathi"
                onClick={onClose}
                className="flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.99]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {isHi ? "किसान साथी — सीधा सवाल पूछें" : "Kisan Saathi — Ask Help"}
              </AppLink>

              <div className="mt-2 flex items-center justify-between px-1 text-[9.5px] text-[var(--av-text-muted)]">
                <span>{BRAND} v{APP_VERSION}</span>
                <span>{isHi ? "किसानों के लिए समर्पित" : "Built for Farmers"}</span>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Hamburger / brand trigger for mobile header */
export function NavDrawerTrigger({
  variant = "menu",
  className = "",
}: {
  variant?: "menu" | "brand";
  className?: string;
}) {
  const { openDrawer } = useNavDrawer();
  const { t } = useLocale();

  if (variant === "brand") {
    return (
      <button
        type="button"
        onClick={openDrawer}
        className={`flex items-center gap-1.5 text-left ${className}`}
        aria-label={t("shellNavAria")}
      >
        <Leaf className="h-4 w-4 text-[var(--av-accent)]" />
        <span className="text-xs font-black tracking-wide text-[var(--av-text-primary)]">{BRAND}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:text-[var(--av-accent)] ${className}`}
      aria-label={t("shellNavAria")}
    >
      <Menu className="h-4 w-4" />
    </button>
  );
}
