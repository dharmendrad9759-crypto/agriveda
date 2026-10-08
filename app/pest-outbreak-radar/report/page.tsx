"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { Camera, CheckCircle2, Loader2, MapPin, RefreshCw, Upload } from "lucide-react";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropPestDisease } from "@/data/pest-disease";
import { useReportOutbreak } from "@/hooks/useReportOutbreak";
import { useToast } from "@/components/ui/Toast";
import { requestUserLocation } from "@/lib/weatherApi";
import type { OutbreakSeverity } from "@/types/outbreak";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import { useLocale } from "@/components/i18n/LocaleProvider";

const OutbreakMap = dynamic(() => import("@/components/outbreak-radar/OutbreakMap"), {
  ssr: false,
});

export default function ReportOutbreakPage() {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const navigate = useAppNavigate();
  const { showToast } = useToast();
  const { submit, submitting } = useReportOutbreak();

  const [cropId, setCropId] = useState(cropCatalog[0]?.slug ?? "paddy");
  const [threatKey, setThreatKey] = useState("");
  const [severity, setSeverity] = useState<OutbreakSeverity>("medium");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [locLoading, setLocLoading] = useState(false);

  const pd = getCropPestDisease(cropId);

  const parsedThreat = useMemo(() => {
    if (!threatKey) return null;
    if (threatKey.startsWith("p-")) {
      return { threatType: "pest" as const, pestOrDiseaseId: threatKey.slice(2) };
    }
    if (threatKey.startsWith("d-")) {
      return { threatType: "disease" as const, pestOrDiseaseId: threatKey.slice(2) };
    }
    return null;
  }, [threatKey]);

  const captureGps = async () => {
    setLocLoading(true);
    try {
      const pos = await requestUserLocation();
      setLat(pos.coords.latitude);
      setLon(pos.coords.longitude);
      showToast(isHi ? "खेत की लोकेशन लॉक हो गई ✓" : "GPS location captured ✓", "success");
    } catch {
      showToast(isHi ? "GPS लोकेशन की अनुमति आवश्यक है" : "GPS permission required", "error");
    } finally {
      setLocLoading(false);
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!parsedThreat) {
      showToast(isHi ? "कृपया कीट या बीमारी चुनें" : "Select pest or disease", "error");
      return;
    }
    if (lat == null || lon == null) {
      showToast(isHi ? "पहले GPS लोकेशन लें" : "Capture GPS location first", "error");
      return;
    }

    const res = await submit({
      cropId,
      threatType: parsedThreat.threatType,
      pestOrDiseaseId: parsedThreat.pestOrDiseaseId,
      severity,
      photoUrl: photoUrl ?? undefined,
      latitude: lat,
      longitude: lon,
    });

    if (res) {
      showToast(isHi ? "प्रकोप रिपोर्ट सफलतापूर्वक भेजी गई ✓" : "Outbreak report submitted ✓", "success");
      navigate("/pest-outbreak-radar");
    }
  };

  return (
    <AppShell
      title={isHi ? "प्रकोप रिपोर्ट दर्ज करें" : "Report an Issue"}
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: isHi ? "प्रकोप रडार" : t("toolOutbreak"), href: "/pest-outbreak-radar" },
        { label: isHi ? "समस्या दर्ज करें" : t("outbreakReport") },
      ]}
    >
      <DarkCard>
        {/* 1. Crop Selection */}
        <label className="block">
          <span className={AV.label}>{isHi ? "फसल चुनें (Crop)" : "Crop"}</span>
          <select
            value={cropId}
            onChange={(e) => {
              setCropId(e.target.value);
              setThreatKey("");
            }}
            className="av-input mt-2 w-full text-sm font-semibold"
          >
            {cropCatalog.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.emoji} {isHi && c.nameHi ? `${c.nameHi} (${c.name})` : c.name}
              </option>
            ))}
          </select>
        </label>

        {/* 2. Pest or Disease Selection */}
        <label className="mt-3.5 block">
          <span className={AV.label}>{isHi ? "कीट या बीमारी चुनें (Pest / Disease)" : "Pest / Disease"}</span>
          <select
            value={threatKey}
            onChange={(e) => setThreatKey(e.target.value)}
            className="av-input mt-2 w-full text-sm font-medium"
          >
            <option value="">{isHi ? "— कीट या बीमारी चुनें —" : "— Select —"}</option>
            {pd.pests.length > 0 && (
              <optgroup label={isHi ? "कीट (Pests)" : "Pests"}>
                {pd.pests.map((p) => (
                  <option key={p.id} value={`p-${p.id}`}>
                    🐛 {p.name}
                  </option>
                ))}
              </optgroup>
            )}
            {pd.diseases.length > 0 && (
              <optgroup label={isHi ? "रोग / बीमारी (Diseases)" : "Diseases"}>
                {pd.diseases.map((d) => (
                  <option key={d.id} value={`d-${d.id}`}>
                    🦠 {d.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>

        {/* 3. Severity Level */}
        <div className="mt-3.5">
          <span className={AV.label}>{isHi ? "गंभीरता / खतरा स्तर (Severity)" : "Severity (self-rated)"}</span>
          <div className="mt-2 flex gap-2">
            {([
              { key: "low" as const, labelHi: "कम (Low)", labelEn: "Low", color: "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" },
              { key: "medium" as const, labelHi: "मध्यम (Medium)", labelEn: "Medium", color: "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" },
              { key: "high" as const, labelHi: "गंभीर (High)", labelEn: "High", color: "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300" },
            ]).map((s) => {
              const active = severity === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSeverity(s.key)}
                  className={cn(
                    "flex-1 rounded-xl py-2.5 text-xs font-bold transition-all border",
                    active
                      ? `${s.color} shadow-sm ring-2 ring-emerald-500/20 font-black`
                      : "border-[var(--av-border)] text-[var(--av-text-muted)] bg-[var(--av-surface)] hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {isHi ? s.labelHi : s.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </DarkCard>

      {/* 4. Photo Attachment */}
      <DarkCard className="mt-4" delay={1}>
        <span className={AV.label}>{isHi ? "खेत या पौधे की फोटो (वैकल्पिक)" : "Photo (optional)"}</span>
        <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-3 hover:border-emerald-500 transition">
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handlePhoto} />
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-16 w-16 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-sm" />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <Camera className="h-7 w-7" />
            </span>
          )}
          <div>
            <p className="text-xs font-bold text-[var(--av-text-primary)]">
              {photoUrl
                ? (isHi ? "फोटो जोड़ी गई (बदलने के लिए टैप करें)" : "Photo attached (tap to change)")
                : (isHi ? "खेत या पत्ती की फोटो जोड़ें" : "Take or upload field photo")}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
              {isHi ? "इससे आसपास के किसानों को बीमारी पहचानने में मदद मिलेगी" : "Helps neighboring farmers identify the issue"}
            </p>
          </div>
        </label>
      </DarkCard>

      {/* 5. GPS Location Capture & Map Snippet with Feedback */}
      <DarkCard className="mt-4" delay={2}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <MapPin className="h-4 w-4" />
            </span>
            <span className={AV.label}>{isHi ? "खेत की लोकेशन (GPS व नक्शा)" : "Location (adjust pin on map)"}</span>
          </div>
          <button
            type="button"
            onClick={captureGps}
            disabled={locLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 px-3 py-1.5 text-xs font-black text-white shadow-sm transition"
          >
            {locLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                <span>{isHi ? "खोज रहे हैं…" : "Locating…"}</span>
              </>
            ) : lat != null && lon != null ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 text-white" />
                <span>{isHi ? "पुनः GPS लें" : "Refresh GPS"}</span>
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5 text-white" />
                <span>{isHi ? "GPS लोकेशन लें" : "Capture GPS"}</span>
              </>
            )}
          </button>
        </div>

        {/* Loading Spinner State */}
        {locLoading && (
          <div className="mt-3 flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 py-8">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
              {isHi ? "सैटेलाइट से खेत की सटीक लोकेशन ली जा रही है…" : "Fetching GPS coordinates from device…"}
            </p>
          </div>
        )}

        {/* Locked State with Mini-Map Snippet */}
        {!locLoading && lat != null && lon != null ? (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30 px-3.5 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-extrabold text-emerald-900 dark:text-emerald-200">
                    {isHi ? "लोकेशन लॉक हो गई (GPS Locked)" : "GPS Locked"}
                  </p>
                  <p className="font-mono text-[11px] text-emerald-700/90 dark:text-emerald-300/90">
                    {lat.toFixed(4)}° N, {lon.toFixed(4)}° E
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                {isHi ? "पिन हिलाकर बदलें" : "Draggable pin"}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-emerald-500/20 shadow-sm">
              <OutbreakMap
                lat={lat}
                lon={lon}
                reports={[]}
                draggablePin
                pinLat={lat}
                pinLon={lon}
                height="220px"
                onAdjustPin={(newLat, newLon) => {
                  setLat(newLat);
                  setLon(newLon);
                }}
              />
            </div>
          </div>
        ) : !locLoading ? (
          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 px-4 py-7 text-center">
            <MapPin className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-500" />
            <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              {isHi ? "खेत की लोकेशन दर्ज करना आवश्यक है" : "GPS required to tag outbreak location"}
            </p>
            <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
              {isHi ? "ऊपर 'GPS लोकेशन लें' बटन दबाएँ" : "Click 'Capture GPS' above"}
            </p>
          </div>
        ) : null}
      </DarkCard>

      {/* 6. Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-4 flex w-full items-center justify-center gap-2 min-h-[52px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm shadow-md shadow-emerald-700/25 transition disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" strokeWidth={2.4} />}
        <span>{isHi ? "प्रकोप रिपोर्ट दर्ज करें (Submit Report)" : "Submit report"}</span>
      </button>
    </AppShell>
  );
}
