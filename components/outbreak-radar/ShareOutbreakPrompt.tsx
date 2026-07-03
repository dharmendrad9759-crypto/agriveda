"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Share2, Loader2 } from "lucide-react";
import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import {
  diagnosisSeverityToOutbreak,
  mapDiagnosisToThreat,
  type DiagnosisThreatRef,
} from "@/lib/aiDiagnosisMap";
import { useReportOutbreak } from "@/hooks/useReportOutbreak";
import { useToast } from "@/components/ui/Toast";
import { cropCatalog } from "@/data/crop-catalog";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import type { ThreatType } from "@/types/pest-disease-ui";

interface ShareOutbreakPromptProps {
  result: DiagnosisResult;
  cropSlug: string;
  photoUrl?: string | null;
}

export default function ShareOutbreakPrompt({
  result,
  cropSlug,
  photoUrl,
}: ShareOutbreakPromptProps) {
  const { submit, submitting } = useReportOutbreak();
  const { showToast } = useToast();
  const [shared, setShared] = useState(false);
  const [threatRef, setThreatRef] = useState<DiagnosisThreatRef | null>(null);

  const mapped = threatRef ?? mapDiagnosisToThreat(result, cropSlug);

  const handleShare = async () => {
    if (!mapped) {
      showToast("Could not map diagnosis to pest catalog", "error");
      return;
    }
    setThreatRef(mapped);
    const res = await submit({
      cropId: mapped.cropId,
      threatType: mapped.threatType,
      pestOrDiseaseId: mapped.pestOrDiseaseId,
      severity: diagnosisSeverityToOutbreak(result.severity),
      photoUrl: photoUrl ?? undefined,
    });
    if (res) {
      setShared(true);
      showToast("Report shared with nearby farmers ✓");
      if (res.clusters.length > 0) {
        showToast("Outbreak cluster detected in your area", "info");
      }
    }
  };

  if (shared) {
    const advisory = mapped
      ? threatDetailPath(mapped.cropId, mapped.threatType as ThreatType, mapped.pestOrDiseaseId)
      : "/pest-outbreak-radar";
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
          धन्यवाद! आपकी रिपोर्ट नज़दीकी किसानों के साथ साझा हो गई।
        </p>
        <Link
          href="/pest-outbreak-radar"
          className="mt-2 inline-block text-xs font-bold text-emerald-600 underline"
        >
          View Nearby Alerts →
        </Link>
        <Link href={advisory} className="ml-3 text-xs font-bold text-emerald-600 underline">
          Advisory
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
      <p className="flex items-center gap-2 text-sm font-extrabold text-orange-700 dark:text-orange-300">
        <Share2 className="h-4 w-4" />
        Share this with nearby farmers?
      </p>
      <p className="mt-1 text-xs theme-text-muted">
        नज़दीकी किसानों को जल्दी चेतावनी मिले — आपकी पहचान गुप्त रहेगी, सिर्फ़ फसल + कीट/रोग + लगभग लोकेशन दिखेगा।
      </p>
      {mapped && (
        <p className="mt-2 text-xs font-bold text-emerald-600">
          Will report: {mapped.threatName} on{" "}
          {cropCatalog.find((c) => c.slug === mapped.cropId)?.name ?? mapped.cropId}
        </p>
      )}
      <button
        type="button"
        onClick={handleShare}
        disabled={submitting}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-black text-white disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        One-tap share (GPS location)
      </button>
      <Link
        href="/pest-outbreak-radar/report"
        className="mt-2 block text-center text-[10px] font-bold text-emerald-600 underline"
      >
        Adjust location before sharing
      </Link>
    </div>
  );
}
