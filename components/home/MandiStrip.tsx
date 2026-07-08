"use client";

import AppLink from "@/components/ui/AppLink";
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { MANDI_SNAPSHOT } from "@/data/mandi-snapshot";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function MandiStrip() {
  const { t } = useLocale();

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{t("mandiLiveBadge")}</p>
          <h2 className="text-sm font-extrabold theme-text-primary">{t("market")}</h2>
        </div>
        <AppLink href="/mandi" className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
          {t("viewAll")} <ChevronRight className="h-3.5 w-3.5" />
        </AppLink>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
        {MANDI_SNAPSHOT.map((item) => (
          <AppLink key={item.crop} href="/mandi" className="shrink-0">
            <GlassCard className="min-w-[100px] px-3 py-2.5">
              <p className="text-xs font-extrabold theme-text-primary">{item.crop}</p>
              <p className="mt-0.5 text-[10px] theme-text-muted">{item.mandi}</p>
              <p className="mt-1.5 text-sm font-black text-emerald-700 dark:text-emerald-400">
                {item.price}
              </p>
              <p
                className={`mt-0.5 flex items-center gap-0.5 text-[10px] font-bold ${
                  item.trend === "up"
                    ? "text-emerald-600"
                    : item.trend === "down"
                      ? "text-red-500"
                      : "theme-text-muted"
                }`}
              >
                {item.trend === "up" && <TrendingUp className="h-3 w-3" />}
                {item.trend === "down" && <TrendingDown className="h-3 w-3" />}
                {item.change}
              </p>
            </GlassCard>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
