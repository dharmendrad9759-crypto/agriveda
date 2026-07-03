"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Loader2, Upload } from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import BottomNav from "@/components/layout/BottomNav";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropPestDisease } from "@/data/pest-disease";
import { useReportOutbreak } from "@/hooks/useReportOutbreak";
import { useToast } from "@/components/ui/Toast";
import { requestUserLocation } from "@/lib/weatherApi";
import type { OutbreakSeverity } from "@/types/outbreak";
import { cn } from "@/lib/cn";

const OutbreakMap = dynamic(() => import("@/components/outbreak-radar/OutbreakMap"), {
  ssr: false,
});

export default function ReportOutbreakPage() {
  const router = useRouter();
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
      router.push("/pest-outbreak-radar");
    }
  };

  return (
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Link
            href="/pest-outbreak-radar"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-extrabold theme-text-primary">Report an Issue</h1>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg space-y-4 px-4 py-5">
        <label className="block">
          <span className="text-xs font-bold theme-text-muted">Crop</span>
          <select
            value={cropId}
            onChange={(e) => {
              setCropId(e.target.value);
              setThreatKey("");
            }}
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
          >
            {cropCatalog.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold theme-text-muted">Pest / Disease</span>
          <select
            value={threatKey}
            onChange={(e) => setThreatKey(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
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

        <div>
          <span className="text-xs font-bold theme-text-muted">Severity (self-rated)</span>
          <div className="mt-1 flex gap-2">
            {(["low", "medium", "high"] as OutbreakSeverity[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeverity(s)}
                className={cn(
                  "flex-1 rounded-xl py-2 text-xs font-bold capitalize",
                  severity === s ? "bg-emerald-600 text-white" : "border theme-text-muted"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold theme-text-muted">Photo (optional)</span>
          <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed px-4 py-3">
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handlePhoto} />
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <Camera className="h-8 w-8 text-emerald-500" />
            )}
            <span className="text-xs theme-text-muted">Tap to add field photo</span>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold theme-text-muted">Location (adjust pin on map)</span>
            <button
              type="button"
              onClick={captureGps}
              disabled={locLoading}
              className="text-xs font-bold text-emerald-600"
            >
              {locLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Capture GPS"}
            </button>
          </div>
          {lat != null && lon != null ? (
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
          ) : (
            <p className="mt-2 rounded-xl border border-dashed px-4 py-6 text-center text-xs theme-text-muted">
              GPS required to tag outbreak location
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006432] py-4 text-sm font-black text-white disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          Submit report
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
