"use client";

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { useFarmData } from "@/hooks/useFarmData";
import { useActiveField } from "@/hooks/useActiveField";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { daysAfterSowingISO } from "@/lib/farm/fieldStatus";
import { fieldAcresValue } from "@/lib/farm/fieldLinks";
import { getStageAdvisory, type StageActionItem } from "@/lib/field-advisor/stageAdvisories";
import { scaleAdvisoryLine } from "@/lib/field-advisor/scaleAdvice";
import { preferredFarmerPlace } from "@/lib/farmerPlaceName";
import type { FarmField } from "@/lib/farm/types";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { Camera, Mic } from "lucide-react";

function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function areaLabel(field: FarmField | null, acres: number | null): string {
  if (field?.bighaDisplay?.trim()) return field.bighaDisplay.trim();
  if (acres != null && acres > 0) {
    const n = Number.isInteger(acres) ? String(acres) : String(Number(acres.toFixed(2)));
    return `${n} एकड़`;
  }
  return "";
}

function stageLabel(name: string, das: number | null): string {
  const short = name.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  return das != null ? `${short} (${das} दिन)` : short;
}

function placesOverlap(a: string, b: string): boolean {
  const parts = (s: string) =>
    s
      .toLowerCase()
      .split(/[^a-z\u0900-\u097F]+/i)
      .filter((p) => p.length > 3);
  const left = parts(a);
  const right = new Set(parts(b));
  return left.some((p) => right.has(p));
}

function forecastLine(weather: WeatherViewModel): string {
  if (weather.isDemo) {
    return "मौसम का नमूना दिख रहा है। छिड़काव से पहले आज का मौसम देख लें।";
  }
  const days = weather.dailyForecast.slice(0, 3);
  if (!days.length) return "छिड़काव से पहले आज का मौसम देख लें।";
  const maxRain = Math.max(...days.map((d) => d.rainChance));
  if (maxRain >= 50) return "अगले दिनों में बारिश का अंदेशा है। छिड़काव से पहले मौसम देख लें।";
  if (maxRain >= 30) return "हल्की बारिश हो सकती है। पानी देने से पहले खेत की नमी देखें।";
  return "अगले 3 दिन बारिश कम दिख रही है। सिंचाई या छिड़काव से पहले एक बार मौसम देख लें।";
}

function careTitle(action: string): string {
  if (/खरपतवार|डंडा|WP|EC|SL|SC|छिड़क|स्प्रे|दवा|ग्राम|किग्रा|ml/i.test(action)) return "खरपतवार";
  return "देखभाल";
}

function AdviceCard({
  title,
  forArea,
  item,
  acres,
  action,
}: {
  title: string;
  forArea?: string;
  item: StageActionItem;
  acres: number | null;
  action?: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <p className="text-[18px] font-bold leading-snug text-[#14532D]">{title}</p>
      {forArea ? <p className="mt-0.5 text-sm font-semibold text-[#15803D]">{forArea}</p> : null}
      <p className="mt-2 text-sm leading-relaxed text-[#1F2937]">{scaleAdvisoryLine(item.action, acres)}</p>
      {item.tip ? <p className="mt-2 text-sm leading-relaxed text-[#1F2937]">{item.tip}</p> : null}
      {action}
    </article>
  );
}

function FieldAdvisorContent() {
  const searchParams = useSearchParams();
  const qCrop = searchParams.get("crop");
  const qSowing = searchParams.get("sowing");
  const qFieldId = searchParams.get("fieldId");
  const { showToast } = useToast();

  const alerts = useDashboardAlerts(4);
  const { data: farmData, hydrated: farmHydrated, addActivity } = useFarmData();
  const { profile } = useFarmerProfile();
  const { weather } = useLiveWeather();
  const fields = farmData.fields;
  const { activeField, setActiveField } = useActiveField(fields, farmHydrated);
  const appliedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!farmHydrated) return;
    if (qFieldId && fields.some((f) => f.id === qFieldId) && appliedQueryRef.current !== qFieldId) {
      appliedQueryRef.current = qFieldId;
      setActiveField(qFieldId);
    }
  }, [farmHydrated, qFieldId, fields, setActiveField]);

  const cropSlug = activeField?.cropSlug || qCrop || "";
  const cropName = activeField?.crop || qCrop || "फसल";
  const acres = activeField ? fieldAcresValue(activeField) ?? null : null;
  const area = areaLabel(activeField, acres);
  const forField = area ? `आपके ${area} के लिए` : "प्रति एकड़";

  const das = useMemo(() => {
    const fromField =
      daysAfterSowingISO(activeField?.sowingDateIso) ?? daysAfterSowingISO(activeField?.sowingDate);
    if (fromField != null) return fromField;
    if (!activeField) return daysAfterSowingISO(qSowing);
    return null;
  }, [activeField, qSowing]);

  const advisory = useMemo(() => {
    if (!cropSlug || das == null) return null;
    return getStageAdvisory(cropSlug, das);
  }, [cropSlug, das]);

  const irrigatedToday = (farmData.activities ?? []).some(
    (a) => a.task === "सिंचाई हो गई" && a.field === (activeField?.id ?? "") && a.date === todayKey()
  );

  const fieldPlace = preferredFarmerPlace(profile, activeField).full;
  const weatherPlace = weather?.location?.trim() || "";
  const splitPlaces = Boolean(fieldPlace && weatherPlace && !placesOverlap(fieldPlace, weatherPlace));

  const irrig = advisory?.checklist.find((item) => item.category === "सिंचाई");
  const fert = advisory?.checklist.find((item) => item.category === "खाद");
  const weed = advisory?.checklist.find((item) => item.category === "निराई / देखभाल");

  const safeAlerts = alerts.filter((a) => {
    if (/NDVI|कमजोर|Mixed Pixel/i.test(`${a.title} ${a.body}`)) return false;
    if (cropSlug && a.cropSlug && a.cropSlug !== cropSlug) return false;
    if (irrig && /सिंचाई|पानी/.test(a.title)) return false;
    return true;
  });

  if (!farmHydrated) {
    return <p className="px-1 py-6 text-sm font-semibold text-[#14532D]">सलाह खुल रही है…</p>;
  }

  return (
    <div className="space-y-3 pb-44">
      {fields.length > 0 ? (
        <label className="block">
          <span className="sr-only">खेत बदलें</span>
          <select
            value={activeField?.id ?? ""}
            onChange={(e) => setActiveField(e.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-3 py-3 text-base font-bold text-[#14532D]"
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.crop} · {areaLabel(f, fieldAcresValue(f) ?? null) || f.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-[18px] font-bold text-[#14532D]">पहले खेत जोड़ें</p>
          <p className="mt-1 text-sm leading-relaxed text-[#1F2937]">
            फसल और बुवाई की तारीख के बिना सलाह नहीं बनती।
          </p>
          <AppLink
            href="/my-farm"
            className="mt-3 inline-flex rounded-xl bg-[#14532D] px-4 py-2.5 text-sm font-bold text-white"
          >
            खेत जोड़ो
          </AppLink>
        </div>
      )}

      {activeField && das == null ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-[18px] font-bold text-[#14532D]">बुवाई की तारीख डालें</p>
          <p className="mt-1 text-sm leading-relaxed text-[#1F2937]">
            {cropName} की सही सलाह के लिए बुवाई का दिन चाहिए।
          </p>
          <AppLink
            href={`/my-farm/${activeField.id}`}
            className="mt-3 inline-flex rounded-xl bg-[#14532D] px-4 py-2.5 text-sm font-bold text-white"
          >
            तारीख डालें
          </AppLink>
        </div>
      ) : advisory ? (
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-sm font-bold text-[#15803D]">फसल की स्थिति</p>
          <h2 className="mt-1 text-[18px] font-bold leading-snug text-[#14532D]">
            {stageLabel(advisory.stageNameHi, das)}
          </h2>
          {weather ? <p className="mt-2 text-sm leading-relaxed text-[#1F2937]">{forecastLine(weather)}</p> : null}
          {splitPlaces ? (
            <div className="mt-2 space-y-0.5 text-sm text-[#1F2937]">
              <p>खेत: {fieldPlace}</p>
              <p>मौसम: {weatherPlace}</p>
            </div>
          ) : fieldPlace ? (
            <p className="mt-2 text-sm text-[#1F2937]">जगह: {fieldPlace}</p>
          ) : weatherPlace ? (
            <p className="mt-2 text-sm text-[#1F2937]">मौसम: {weatherPlace}</p>
          ) : null}
        </section>
      ) : null}

      {advisory && irrig ? (
        <AdviceCard
          title="सिंचाई"
          item={irrig}
          acres={acres}
          action={
            activeField ? (
              <button
                type="button"
                disabled={irrigatedToday}
                onClick={() => {
                  addActivity({
                    task: "सिंचाई हो गई",
                    field: activeField.id,
                    date: todayKey(),
                    category: "सिंचाई",
                  });
                  showToast("सिंचाई दर्ज हो गई");
                }}
                className="mt-3 w-full rounded-xl bg-[#F4FBF7] px-3 py-2.5 text-sm font-bold text-[#14532D] disabled:opacity-70"
              >
                {irrigatedToday ? "आज की सिंचाई दर्ज है" : "सिंचाई हो गई"}
              </button>
            ) : null
          }
        />
      ) : null}

      {advisory && fert ? (
        <AdviceCard title="खाद" forArea={forField} item={fert} acres={acres} />
      ) : null}

      {advisory && weed ? (
        <AdviceCard
          title={careTitle(weed.action)}
          forArea={/ग्राम|किग्रा|kg|ml|लीटर/i.test(weed.action) ? forField : undefined}
          item={weed}
          acres={acres}
        />
      ) : null}

      {safeAlerts[0] ? (
        <AppLink href={safeAlerts[0].actionHref ?? "/alerts"} className="block rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3">
          <p className="text-sm font-bold text-[#14532D]">{safeAlerts[0].title}</p>
          <p className="mt-0.5 text-sm text-[#1F2937]">{safeAlerts[0].body}</p>
        </AppLink>
      ) : null}

      <div className="fixed inset-x-0 bottom-[7.25rem] z-40 px-3 lg:bottom-4">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          <AppLink
            href="/ai-doctor"
            className="flex min-h-[52px] items-center justify-center gap-1.5 rounded-2xl bg-[#14532D] px-2 text-center text-sm font-bold text-white"
          >
            <Camera className="h-4 w-4 shrink-0" />
            फोटो से पहचानें
          </AppLink>
          <AppLink
            href="/ask-query?voice=1"
            className="flex min-h-[52px] items-center justify-center gap-1.5 rounded-2xl border border-[#14532D] bg-white px-2 text-center text-sm font-bold text-[#14532D]"
          >
            <Mic className="h-4 w-4 shrink-0" />
            बोलकर पूछें
          </AppLink>
        </div>
      </div>
    </div>
  );
}

export default function FieldAdvisorPage() {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title="फसल सलाह"
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: "फसल सलाह" }]}
    >
      <Suspense fallback={<p className="px-1 py-6 text-sm font-semibold text-[#14532D]">सलाह खुल रही है…</p>}>
        <FieldAdvisorContent />
      </Suspense>
    </AppShell>
  );
}
