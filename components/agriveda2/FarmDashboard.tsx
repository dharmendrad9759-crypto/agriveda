"use client";

import AppLink from "@/components/ui/AppLink";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Droplets,
  MapPin,
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
import { fetchSprayWeatherFromSaved } from "@/lib/sprayWeatherApi";

export default function FarmDashboard({ compact = false }: { compact?: boolean }) {
  const { fields } = useSprayFields();
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const [weather, setWeather] = useState<{ tempC?: number; rain?: number }>({});

  useEffect(() => {
    fetchSprayWeatherFromSaved().then((b) => {
      if (!b) return;
      setWeather({
        tempC: Math.round(b.current.temperatureC),
        rain: Math.round(b.current.rainProbabilityNext3h * 100),
      });
    });
  }, []);

  const fieldCards = useMemo(() => {
    const list =
      fields.length > 0
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
      const growth = sowing
        ? applySowingToStages(dashboard.growthStages, sowing)
        : null;
      const alerts = buildFieldAlerts(field, sowing, weather);

      return { field, sowing, das, growth, alerts };
    });
  }, [fields, crops, profile, weather]);

  const totalAlerts = fieldCards.reduce((n, f) => n + f.alerts.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
            मेरा खेत
          </p>
          <h2 className="text-lg font-extrabold theme-text-primary">मेरा खेत</h2>
        </div>
        {!compact && (
          <AppLink href="/alerts" className="text-xs font-bold text-emerald-600">
            {totalAlerts} alerts →
          </AppLink>
        )}
      </div>

      {fieldCards.map(({ field, das, growth, alerts }) => {
        const crop = cropCatalog.find((c) => c.slug === field.cropSlug);
        return (
          <GlassCard key={field.id} neon className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-extrabold theme-text-primary">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {field.name}
                </p>
                <p className="mt-0.5 text-xs theme-text-muted">
                  {crop?.emoji} {crop?.name ?? field.cropSlug}
                  {field.areaAcres ? ` · ${field.areaAcres} acre` : ""}
                </p>
              </div>
              <AppLink
                href={`/crop-details/${field.cropSlug}`}
                className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-700"
              >
                Guide
              </AppLink>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-black/5 p-2 dark:bg-white/5">
                <p className="theme-text-muted">Stage</p>
                <p className="font-bold theme-text-primary">
                  {growth?.currentStageName ?? "Set sowing date"}
                </p>
                {das != null && <p className="text-[10px] text-emerald-600">Day {das}</p>}
              </div>
              <div className="rounded-xl bg-black/5 p-2 dark:bg-white/5">
                <p className="theme-text-muted">Next action</p>
                <p className="font-bold theme-text-primary">
                  {alerts[0]?.title.slice(0, 28) ?? "All clear ✓"}
                </p>
              </div>
            </div>

            {alerts.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {alerts.slice(0, compact ? 1 : 2).map((a) => (
                  <AlertRow key={a.id} alert={a} />
                ))}
              </div>
            )}
          </GlassCard>
        );
      })}

      {!compact && (
        <div className="grid grid-cols-2 gap-2">
          <QuickAppLink href="/services/seed-calculator" icon={<Sprout className="h-4 w-4" />} label="बीज कैलकुलेटर" />
          <QuickAppLink href="/sowing-window" icon={<Droplets className="h-4 w-4" />} label="बुआई समय" />
          <QuickAppLink href="/smart-crop" icon={<Sprout className="h-4 w-4" />} label="Smart crop" />
          <QuickAppLink href="/crop-problem" icon={<AlertTriangle className="h-4 w-4" />} label="समस्या → समाधान" />
        </div>
      )}
    </div>
  );
}

function AlertRow({ alert }: { alert: FarmAlert }) {
  const color =
    alert.severity === "critical"
      ? "border-red-300 bg-red-50 text-red-900"
      : alert.severity === "warning"
        ? "border-amber-300 bg-amber-50 text-amber-900"
        : "border-sky-300 bg-sky-50 text-sky-900";

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
      className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3 text-xs font-bold text-emerald-800"
    >
      {icon}
      {label}
    </AppLink>
  );
}
