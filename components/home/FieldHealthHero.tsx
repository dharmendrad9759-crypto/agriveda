"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropDashboard } from "@/data/crop-dashboard";
import { applySowingToStages, daysAfterSowing } from "@/lib/cropGrowthStage";
import { cropCatalog } from "@/data/crop-catalog";

export default function FieldHealthHero() {
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { t } = useLocale();

  const hero = useMemo(() => {
    const crop = crops[0];
    if (!crop) return null;

    const sowing = profile.sowingDates[crop.slug];
    const das = sowing ? daysAfterSowing(sowing) : null;
    const dashboard = getCropDashboard(crop.slug);
    const growthState = sowing
      ? applySowingToStages(dashboard.growthStages, sowing)
      : {
          stages: dashboard.growthStages,
          currentStageName: dashboard.currentStage,
          currentStageDas: null,
          das: null,
        };
    const growth = growthState.stages;
    const currentIdx = growth.findIndex((s) => s.status === "current");
    const progress =
      das != null && growth.length > 0
        ? Math.min(100, Math.round(((currentIdx >= 0 ? currentIdx + 1 : 1) / growth.length) * 100))
        : 35;

    const suffix = t("fieldHealthFieldSuffix");
    const fieldName = profile.village
      ? `${profile.village} ${suffix}`
      : profile.district
        ? `${profile.district} ${suffix}`
        : t("fieldHealthMyField");

    return { crop, das, growth, progress, fieldName };
  }, [crops, profile, t]);

  if (!hero) {
    return (
      <GlassCard className="p-5 text-center">
        <p className="text-sm font-bold theme-text-primary">{t("fieldHealthPickCrop")}</p>
        <p className="mt-1 text-xs theme-text-muted">{t("fieldHealthPickCropHint")}</p>
      </GlassCard>
    );
  }

  const { crop, das, growth, progress, fieldName } = hero;
  const catalog = cropCatalog.find((c) => c.slug === crop.slug);
  const currentStage = growth.find((s) => s.status === "current")?.name ?? growth[0]?.name ?? "—";
  const nextStage = growth.find((s) => s.status === "upcoming")?.name ?? "—";

  return (
    <GlassCard neon className="overflow-hidden p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            <MapPin className="h-3 w-3" />
            {profile.district && profile.state
              ? `${profile.district}, ${profile.state}`
              : t("fieldHealthSetLocation")}
          </p>
          <h2 className="mt-0.5 text-lg font-extrabold theme-text-primary">
            {fieldName} · {catalog?.name ?? crop.name}
          </h2>
        </div>
        <span className="text-4xl">{catalog?.emoji ?? crop.emoji}</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 h-20 w-20 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#dasGreen)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.64} 264`}
            />
            <defs>
              <linearGradient id="dasGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center">
            <p className="text-[8px] font-bold uppercase text-emerald-600">{t("daysAfterSowing")}</p>
            <p className="text-lg font-black theme-text-primary">{das ?? "—"}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-emerald-600">{t("fieldHealthGoodGrowth")}</p>
          <p className="text-[10px] theme-text-muted">
            {t("fieldHealthOptimal").replace("{pct}", String(progress))} · {currentStage}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
            {t("fieldHealthNext").replace("{stage}", nextStage)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex justify-between gap-1">
        {growth.slice(0, 4).map((stage) => {
          const active = stage.status === "current";
          const done = stage.status === "completed";
          return (
            <div key={stage.id} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  active
                    ? "border-2 border-emerald-500 bg-emerald-500/15"
                    : done
                      ? "border border-emerald-500/30 bg-emerald-500/10"
                      : "border border-gray-200 bg-black/5 opacity-50 dark:border-white/10"
                }`}
              >
                {stage.emoji}
              </span>
              <span
                className={`max-w-[52px] truncate text-center text-[7px] font-bold ${
                  active ? "text-emerald-700 dark:text-emerald-400" : "theme-text-muted"
                }`}
              >
                {stage.name.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-all duration-500"
          style={{ width: `${Math.max(8, progress)}%` }}
        />
      </div>
    </GlassCard>
  );
}
