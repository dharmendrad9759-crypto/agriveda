"use client";

import AppLink from "@/components/ui/AppLink";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Bug,
  Radar,
  Sparkles,
  Sprout,
  Droplets,
  CloudSun,
  Waves,
  Calculator,
  FlaskConical,
  TrendingUp,
  MessageCircleQuestion,
  Users,
  User,
  Stethoscope,
  LayoutDashboard,
  Calendar,
  Brain,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

export interface ServiceItem {
  titleKey: FarmerUiKey;
  href: string;
  icon: LucideIcon;
  glow: string;
}

export interface ServiceCategory {
  id: string;
  titleKey: FarmerUiKey;
  subtitleKey: FarmerUiKey;
  items: ServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "agriveda2",
    titleKey: "toolDashboard",
    subtitleKey: "homeSubtitle",
    items: [
      {
        titleKey: "toolDashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        glow: "shadow-[0_0_18px_rgba(16,185,129,0.35)] border-emerald-400/30",
      },
      {
        titleKey: "toolSeedCalc",
        href: "/services/seed-calculator",
        icon: Calculator,
        glow: "shadow-[0_0_18px_rgba(251,191,36,0.35)] border-amber-400/30",
      },
      {
        titleKey: "toolSowing",
        href: "/sowing-window",
        icon: Calendar,
        glow: "shadow-[0_0_18px_rgba(56,189,248,0.35)] border-sky-400/30",
      },
      {
        titleKey: "toolSmartCrop",
        href: "/smart-crop",
        icon: Brain,
        glow: "shadow-[0_0_18px_rgba(139,92,246,0.35)] border-violet-400/30",
      },
      {
        titleKey: "toolCropProblem",
        href: "/crop-problem",
        icon: Stethoscope,
        glow: "shadow-[0_0_18px_rgba(217,70,239,0.35)] border-fuchsia-400/30",
      },
      {
        titleKey: "toolKisanSaathi",
        href: "/kisan-saathi",
        icon: Sparkles,
        glow: "shadow-[0_0_18px_rgba(0,255,136,0.35)] border-emerald-400/30",
      },
      {
        titleKey: "toolAlerts",
        href: "/alerts",
        icon: Bell,
        glow: "shadow-[0_0_18px_rgba(244,63,94,0.35)] border-rose-400/30",
      },
    ],
  },
  {
    id: "protection",
    titleKey: "svcProtectionHi",
    subtitleKey: "svcProtectionEn",
    items: [
      {
        titleKey: "toolPest",
        href: "/pest-diseases",
        icon: Bug,
        glow: "shadow-[0_0_18px_rgba(239,68,68,0.35)] border-red-400/30",
      },
      {
        titleKey: "toolPestSolver",
        href: "/pest-solver",
        icon: Stethoscope,
        glow: "shadow-[0_0_18px_rgba(217,70,239,0.35)] border-fuchsia-400/30",
      },
      {
        titleKey: "toolOutbreak",
        href: "/pest-outbreak-radar",
        icon: Radar,
        glow: "shadow-[0_0_18px_rgba(244,63,94,0.35)] border-rose-400/30",
      },
      {
        titleKey: "toolAi",
        href: "/ai-doctor",
        icon: Sparkles,
        glow: "shadow-[0_0_18px_rgba(0,255,136,0.35)] border-emerald-400/30",
      },
    ],
  },
  {
    id: "field",
    titleKey: "svcFieldHi",
    subtitleKey: "svcFieldEn",
    items: [
      {
        titleKey: "toolCrops",
        href: "/crops",
        icon: Sprout,
        glow: "shadow-[0_0_18px_rgba(52,211,153,0.35)] border-emerald-400/30",
      },
      {
        titleKey: "toolSpray",
        href: "/spray-rotation",
        icon: Droplets,
        glow: "shadow-[0_0_18px_rgba(56,189,248,0.35)] border-sky-400/30",
      },
      {
        titleKey: "toolWeather",
        href: "/weather",
        icon: CloudSun,
        glow: "shadow-[0_0_18px_rgba(250,204,21,0.3)] border-amber-400/30",
      },
      {
        titleKey: "toolSprayAdvisory",
        href: "/weather/spray-advisory",
        icon: FlaskConical,
        glow: "shadow-[0_0_18px_rgba(99,102,241,0.35)] border-indigo-400/30",
      },
    ],
  },
  {
    id: "nutrition",
    titleKey: "svcNutritionHi",
    subtitleKey: "svcNutritionEn",
    items: [
      {
        titleKey: "svcIrrigation",
        href: "/services/irrigation",
        icon: Waves,
        glow: "shadow-[0_0_18px_rgba(34,211,238,0.35)] border-cyan-400/30",
      },
      {
        titleKey: "svcFertilizer",
        href: "/services/fertilizer-calculator",
        icon: Calculator,
        glow: "shadow-[0_0_18px_rgba(167,139,250,0.35)] border-violet-400/30",
      },
      {
        titleKey: "svcDeficiencies",
        href: "/deficiencies",
        icon: FlaskConical,
        glow: "shadow-[0_0_18px_rgba(251,191,36,0.35)] border-amber-400/30",
      },
    ],
  },
  {
    id: "community",
    titleKey: "svcCommunityHi",
    subtitleKey: "svcCommunityEn",
    items: [
      {
        titleKey: "askQuery",
        href: "/ask-query",
        icon: MessageCircleQuestion,
        glow: "shadow-[0_0_18px_rgba(52,211,153,0.35)] border-emerald-400/30",
      },
      {
        titleKey: "svcCommunity",
        href: "/community",
        icon: Users,
        glow: "shadow-[0_0_18px_rgba(96,165,250,0.35)] border-blue-400/30",
      },
      {
        titleKey: "toolMandi",
        href: "/mandi",
        icon: TrendingUp,
        glow: "shadow-[0_0_18px_rgba(251,191,36,0.35)] border-amber-400/30",
      },
      {
        titleKey: "navProfile",
        href: "/profile",
        icon: User,
        glow: "shadow-[0_0_18px_rgba(167,139,250,0.35)] border-violet-400/30",
      },
    ],
  },
];

interface ServicesHubSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function ServicesHubSheet({ open, onClose }: ServicesHubSheetProps) {
  const { t } = useLocale();

  return (
    <AnimatePresence>
      {open && (
        <div
          className="agriveda-force-dark fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
          data-theme="dark"
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label={t("closeServices")}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-label={t("servicesHubTitle")}
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-emerald-500/25 bg-[#030712] shadow-[0_-12px_48px_rgba(0,255,136,0.15)] sm:rounded-3xl"
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-emerald-500/40 sm:hidden" />
            <div className="flex items-center justify-between border-b border-emerald-500/15 px-5 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                  {t("servicesHubBadge")}
                </p>
                <h2 className="text-lg font-extrabold text-white">{t("servicesHubTitle")}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                aria-label={t("closeServices")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 pb-10">
              {SERVICE_CATEGORIES.map((category, catIndex) => (
                <motion.section
                  key={category.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + catIndex * 0.04 }}
                  className="mb-7 last:mb-0"
                >
                  <div className="mb-3">
                    <h3 className="text-sm font-extrabold text-emerald-300">{t(category.titleKey)}</h3>
                    <p className="text-[11px] font-medium text-slate-400">{t(category.subtitleKey)}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <AppLink
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className="group flex flex-col items-center gap-2"
                        >
                          <div
                            className={`flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border bg-[#0f172a] text-emerald-300 backdrop-blur-xl transition-transform group-hover:scale-110 group-active:scale-95 ${item.glow}`}
                          >
                            <Icon className="h-7 w-7" strokeWidth={1.75} />
                          </div>
                          <span className="max-w-[5.5rem] text-center text-[11px] font-bold leading-tight text-slate-100">
                            {t(item.titleKey)}
                          </span>
                        </AppLink>
                      );
                    })}
                  </div>
                </motion.section>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
