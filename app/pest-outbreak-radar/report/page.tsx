"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { Camera, Loader2, Upload } from "lucide-react";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropPestDisease } from "@/data/pest-disease";
import { useReportOutbreak } from "@/hooks/useReportOutbreak";
import { useToast } from "@/components/ui/Toast";
import { requestUserLocation } from "@/lib/weatherApi";
import type { OutbreakSeverity } from "@/types/outbreak";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";

const OutbreakMap = dynamic(() => import("@/components/outbreak-radar/OutbreakMap"), {
  ssr: false,
});

export default function ReportOutbreakPage() {
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
    } catch {
      showToast("GPS permission required", "error");
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
      showToast("Select pest or disease", "error");
      return;
    }
    if (lat == null || lon == null) {
      showToast("Capture GPS location first", "error");
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
      showToast("Outbreak report submitted ✓");
      navigate("/pest-outbreak-radar");
    }
  };

  return (
    <AppShell
      title="Report an Issue"
      subtitle="Nearby farmers ko alert — GPS location zaroori"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Outbreak Radar", href: "/pest-outbreak-radar" },
        { label: "Report" },
      ]}
    >
      <DarkCard>
        <label className="block">
          <span className={AV.label}>Crop</span>
          <select
            value={cropId}
            onChange={(e) => {
              setCropId(e.target.value);
              setThreatKey("");
            }}
            className="av-input mt-2 w-full"
          >
            {cropCatalog.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-3 block">
          <span className={AV.label}>Pest / Disease</span>
          <select
            value={threatKey}
            onChange={(e) => setThreatKey(e.target.value)}
            className="av-input mt-2 w-full"
          >
            <option value="">— Select —</option>
            {pd.pests.map((p) => (
              <option key={p.id} value={`p-${p.id}`}>
                🐛 {p.name}
              </option>
            ))}
            {pd.diseases.map((d) => (
              <option key={d.id} value={`d-${d.id}`}>
                🦠 {d.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-3">
          <span className={AV.label}>Severity (self-rated)</span>
          <div className="mt-2 flex gap-2">
            {(["low", "medium", "high"] as OutbreakSeverity[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeverity(s)}
                className={cn(
                  "flex-1 rounded-xl py-2 text-xs font-bold capitalize",
                  severity === s
                    ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                    : "border border-[var(--av-border)] text-[var(--av-text-muted)]"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </DarkCard>

      <DarkCard className="mt-4" delay={1}>
        <span className={AV.label}>Photo (optional)</span>
        <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--av-border)] px-4 py-3">
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handlePhoto} />
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <Camera className="h-8 w-8 text-[var(--av-accent)]" />
          )}
          <span className="text-xs text-[var(--av-text-muted)]">Tap to add field photo</span>
        </label>
      </DarkCard>

      <DarkCard className="mt-4" delay={2}>
        <div className="flex items-center justify-between">
          <span className={AV.label}>Location (adjust pin on map)</span>
          <button
            type="button"
            onClick={captureGps}
            disabled={locLoading}
            className="text-xs font-bold text-[var(--av-accent)]"
          >
            {locLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Capture GPS"}
          </button>
        </div>
        {lat != null && lon != null ? (
          <div className="mt-2">
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
        ) : (
          <p className="mt-2 rounded-xl border border-dashed border-[var(--av-border)] px-4 py-6 text-center text-xs text-[var(--av-text-muted)]">
            GPS required to tag outbreak location
          </p>
        )}
      </DarkCard>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-4 flex w-full items-center justify-center gap-2 ${AV.btnPrimary} disabled:opacity-60`}
      >
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
        Submit report
      </button>
    </AppShell>
  );
}
