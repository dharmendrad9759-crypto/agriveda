"use client";

import AppLink from "@/components/ui/AppLink";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Brain,
  Calculator,
  Calendar,
  ChevronRight,
  LayoutDashboard,
  LayoutGrid,
  Sparkles,
  Sprout,
  Stethoscope,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

const HUB_ITEMS: {
  href: string;
  icon: LucideIcon;
  labelKey: FarmerUiKey;
  glow: string;
}[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "toolDashboard", glow: "from-emerald-500/25 to-teal-500/10 border-emerald-400/40" },
  { href: "/services/seed-calculator", icon: Calculator, labelKey: "toolSeedCalc", glow: "from-sky-500/20 to-cyan-500/10 border-sky-400/40" },
  { href: "/sowing-window", icon: Calendar, labelKey: "toolSowing", glow: "from-sky-500/20 to-cyan-500/10 border-sky-400/40" },
  { href: "/smart-crop", icon: Brain, labelKey: "toolSmartCrop", glow: "from-violet-500/20 to-indigo-500/10 border-violet-400/40" },
  { href: "/crop-problem", icon: Stethoscope, labelKey: "toolCropProblem", glow: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-400/40" },
  { href: "/kisan-saathi", icon: Sparkles, labelKey: "toolKisanSaathi", glow: "from-emerald-500/20 to-lime-500/10 border-lime-400/40" },
  { href: "/alerts", icon: Bell, labelKey: "toolAlerts", glow: "from-rose-500/20 to-red-500/10 border-rose-400/40" },
  { href: "/services/fertilizer-calculator", icon: Sprout, labelKey: "svcFertilizer", glow: "from-lime-500/20 to-green-500/10 border-lime-400/40" },
];

export default function PremiumServiceHub({ onAllServices }: { onAllServices?: () => void }) {
  const { t } = useLocale();

  return (
    <section>
      <div className="mb-3">
        <p className="text-[10px] font-bold tracking-wide text-emerald-600">{t("hubBrand")}</p>
        <h2 className="text-base font-extrabold theme-text-primary">{t("mainServices")}</h2>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {HUB_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <AppLink key={item.href} href={item.href}>
              <GlassCard
                hover
                className={`flex h-full flex-col items-center justify-center gap-1.5 border bg-gradient-to-br p-2.5 text-center ${item.glow}`}
              >
                <Icon className="h-5 w-5 text-emerald-600" strokeWidth={2} />
                <span className="text-[9px] font-extrabold leading-tight theme-text-primary">
                  {t(item.labelKey)}
                </span>
              </GlassCard>
            </AppLink>
          );
        })}
      </div>

      {onAllServices && (
        <button
          type="button"
          onClick={onAllServices}
          className="mt-2.5 flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-cyan-500/35 bg-gradient-to-r from-cyan-500/8 to-emerald-500/8 px-3 py-2 active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/12 text-cyan-700">
              <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="text-left">
              <p className="text-xs font-black theme-text-primary">{t("toolAllServices")}</p>
              <p className="text-[9px] theme-text-muted">{t("servicesNote")}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-cyan-600" />
        </button>
      )}
    </section>
  );
}
