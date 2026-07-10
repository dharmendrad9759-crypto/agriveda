"use client";

import AppLink from "@/components/ui/AppLink";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  Camera,
  ChevronRight,
  Droplets,
  MessageCircle,
  Sprout,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useSprayFields } from "@/hooks/useSprayFields";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { buildFieldAlerts, type FarmAlert } from "@/lib/agriveda2/farmAlertsEngine";
import { getCropDashboard } from "@/data/crop-dashboard";
import { daysAfterSowing, applySowingToStages } from "@/lib/cropGrowthStage";
import { cropCatalog } from "@/data/crop-catalog";
import { fetchSprayWeatherForProfile } from "@/lib/sprayWeatherApi";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function FarmDashboard({ compact = false }: { compact?: boolean }) {
  const { fields } = useSprayFields();
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { t } = useLocale();
  const [weather, setWeather] = useState<{ tempC?: number; rain?: number }>({});

  useEffect(() => {
    fetchSprayWeatherForProfile(profile.district, profile.state).then((b) => {
      if (!b) return;
      setWeather({
        tempC: Math.round(b.current.temperatureC),
        rain: Math.round(b.current.rainProbabilityNext3h * 100),
      });
    });
  }, [profile.district, profile.state]);

  const fieldCards = useMemo(() => {
    const list = compact
      ? crops.map((c) => ({
          id: `crop-${c.slug}`,
          name: c.name,
          cropSlug: c.slug,
          areaAcres: undefined as string | undefined,
        }))
      : fields.length > 0
        ? fields
        : crops.map((c, i) => ({
            id: `crop-${c.slug}`,
            name: profile.village ? `${profile.village} field` : `Field ${i + 1}`,
            cropSlug: c.slug,
            areaAcres: "2",
          }));

    return list.map((field) => {
      const sowing = profile.sowingDates[field.cropSlug];
      const das = sowing ? daysAfterSowing(sowing) : null;
      const dashboard = getCropDashboard(field.cropSlug);
      const growthState = sowing
        ? applySowingToStages(dashboard.growthStages, sowing)
        : {
            stages: dashboard.growthStages,
            currentStageName: dashboard.currentStage,
            currentStageDas: null,
            das: null,
          };
      const growth = growthState.stages;
      const alerts = buildFieldAlerts(field, sowing, weather);
      const currentStage = growth.find((s) => s.status === "current");

      return { field, sowing, das, growth, alerts, currentStage };
    });
  }, [fields, crops, profile, weather, compact]);

  const totalAlerts = fieldCards.reduce((n, f) => n + f.alerts.length, 0);

  if (compact) {
    return (
      <section>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              {t("farmSectionLabel")}
            </p>
            <h2 className="text-sm font-extrabold theme-text-primary">{t("farmSectionTitle")}</h2>
          </div>
          <AppLink href="/dashboard" className="text-[10px] font-bold text-emerald-600">
            {t("viewAll")} →
          </AppLink>
        </div>

        <GlassCard className="p-3">
          {fieldCards.length === 0 ? (
            <p className="py-2 text-center text-xs theme-text-muted">{t("farmEmptyCompact")}</p>
          ) : (
            <div className="space-y-2">
              {fieldCards.map(({ field, das, currentStage, alerts }) => {
                const crop = cropCatalog.find((c) => c.slug === field.cropSlug);
                const alertLabel =
                  alerts.length === 1
                    ? t("farmAlertCount").replace("{n}", "1")
                    : t("farmAlertCountPlural").replace("{n}", String(alerts.length));
                return (
                  <AppLink
                    key={field.id}
                    href={`/crops/${field.cropSlug}`}
                    className="flex items-center gap-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-2 active:scale-[0.99]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/60 text-lg dark:bg-black/20">
                      {crop?.emoji ?? "🌾"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold theme-text-primary">
                        {crop?.name ?? field.name}
                      </p>
                      <p className="truncate text-[10px] theme-text-muted">
                        {currentStage?.name ?? t("farmSetSowingDate")}
                        {das != null ? ` · ${t("daysAfterSowing")} ${das}` : ""}
                      </p>
                    </div>
                    {alerts.length > 0 ? (
                      <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                        {alertLabel}
                      </span>
                    ) : (
                      <span className="shrink-0 text-[9px] font-bold text-emerald-600">✓</span>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-emerald-600/60" />
                  </AppLink>
                );
              })}
            </div>
          )}

          <div className="mt-2.5 flex gap-2 border-t border-emerald-500/10 pt-2.5">
            <MiniAction href="/ai-doctor" icon={<Camera className="h-3.5 w-3.5" />} label={t("farmActionScan")} />
            <MiniAction href="/weather/spray-advisory" icon={<Droplets className="h-3.5 w-3.5" />} label={t("farmActionSpray")} />
            <MiniAction href="/community" icon={<MessageCircle className="h-3.5 w-3.5" />} label={t("farmActionCommunity")} />
            <MiniAction href="/alerts" icon={<AlertTriangle className="h-3.5 w-3.5" />} label={t("farmActionAlerts")} />
          </div>
        </GlassCard>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
            Crops & Fields
          </p>
          <h2 className="text-lg font-extrabold theme-text-primary">
            {profile.district ? `${profile.district}, ${profile.state || "UP"}` : "मेरे खेत"}
          </h2>
        </div>
        <AppLink href="/alerts" className="text-xs font-bold text-emerald-600">
          {totalAlerts} alerts →
        </AppLink>
      </div>

      {fieldCards.map(({ field, das, growth, alerts, currentStage }) => {
        const crop = cropCatalog.find((c) => c.slug === field.cropSlug);
        const progress = growth.filter((s) => s.status === "completed").length;
        const total = growth.length || 1;
        const pct = Math.round((progress / total) * 100);

        return (
          <GlassCard key={field.id} neon className="p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-2xl">
                {crop?.emoji ?? "🌾"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold theme-text-primary">{field.name}</p>
                <p className="mt-0.5 text-xs theme-text-muted">
                  {crop?.name} · {field.areaAcres ?? "—"} acre
                </p>
                <p className="mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {currentStage?.name ?? "Set sowing date"}
                  {das != null ? ` · DAS ${das}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400"
                style={{ width: `${Math.max(10, pct)}%` }}
              />
            </div>

            {alerts.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {alerts.slice(0, 2).map((a) => (
                  <AlertRow key={a.id} alert={a} />
                ))}
              </div>
            )}

            <div className="mt-3 grid grid-cols-4 gap-1.5 border-t border-emerald-500/10 pt-3">
              <FieldAction href="/ai-doctor" icon={<Camera className="h-4 w-4" />} label="Scan" />
              <FieldAction href="/weather/spray-advisory" icon={<Droplets className="h-4 w-4" />} label="Spray" />
              <FieldAction href="/community" icon={<MessageCircle className="h-4 w-4" />} label="Community" />
              <FieldAction href={`/crops/${field.cropSlug}`} icon={<BookOpen className="h-4 w-4" />} label="Guide" />
            </div>
          </GlassCard>
        );
      })}

      <div className="grid grid-cols-2 gap-2">
        <QuickAppLink href="/services/seed-calculator" icon={<Sprout className="h-4 w-4" />} label="बीज कैलकुलेटर" />
        <QuickAppLink href="/sowing-window" icon={<Droplets className="h-4 w-4" />} label="बुआई समय" />
        <QuickAppLink href="/smart-crop" icon={<Sprout className="h-4 w-4" />} label="Smart crop" />
        <QuickAppLink href="/crop-problem" icon={<AlertTriangle className="h-4 w-4" />} label="समस्या → समाधान" />
      </div>
    </div>
  );
}

function MiniAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <AppLink
      href={href}
      className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-emerald-700 dark:text-emerald-400"
    >
      {icon}
      <span className="text-[8px] font-bold">{label}</span>
    </AppLink>
  );
}

function FieldAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <AppLink
      href={href}
      className="flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-emerald-600 active:scale-95"
    >
      {icon}
      <span className="text-[8px] font-bold">{label}</span>
    </AppLink>
  );
}

function AlertRow({ alert }: { alert: FarmAlert }) {
  const color =
    alert.severity === "critical"
      ? "border-red-300 bg-red-50 text-red-900 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200"
      : alert.severity === "warning"
        ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200"
        : "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-200";

  const inner = (
    <div className={`flex items-start gap-2 rounded-xl border px-2.5 py-2 text-[11px] ${color}`}>
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-bold">{alert.title}</p>
        <p className="line-clamp-2 opacity-90">{alert.body}</p>
      </div>
      {alert.actionHref && <ChevronRight className="h-4 w-4 shrink-0" />}
    </div>
  );

  if (alert.actionHref) {
    return <AppLink href={alert.actionHref}>{inner}</AppLink>;
  }
  return inner;
}

function QuickAppLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <AppLink
      href={href}
      className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3 text-xs font-bold text-emerald-800 dark:text-emerald-300"
    >
      {icon}
      {label}
    </AppLink>
  );
}
