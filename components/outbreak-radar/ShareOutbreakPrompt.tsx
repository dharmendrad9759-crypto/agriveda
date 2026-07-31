"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin, Radio, Shield } from "lucide-react";
import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import {
  diagnosisSeverityToOutbreak,
  mapDiagnosisToThreat,
  type DiagnosisThreatRef,
} from "@/lib/aiDiagnosisMap";
import { useReportOutbreak } from "@/hooks/useReportOutbreak";
import { useToast } from "@/components/ui/Toast";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropHindiName } from "@/lib/crops/crop-display";
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
  const cropLabel =
    getCropHindiName(mapped?.cropId ?? cropSlug) ??
    cropCatalog.find((c) => c.slug === (mapped?.cropId ?? cropSlug))?.name ??
    cropSlug;

  const handleShare = async () => {
    if (!mapped) {
      showToast("कैटलॉग से मिलान नहीं हो सका", "error");
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
      showToast("नज़दीकी किसानों को चेतावनी भेज दी ✓");
      if (res.clusters.length > 0) {
        showToast("आपके इलाके में क्लस्टर मिला", "info");
      }
    }
  };

  if (shared) {
    const advisory = mapped
      ? threatDetailPath(mapped.cropId, mapped.threatType as ThreatType, mapped.pestOrDiseaseId)
      : "/pest-outbreak-radar";
    return (
      <div className="overflow-hidden rounded-[20px] border border-emerald-500/25 bg-emerald-500/8 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
              रिपोर्ट साझा हो गई
            </p>
            <p className="mt-0.5 text-xs text-[var(--av-text-muted)]">
              आस-पास के किसानों को अलर्ट मिल सकता है — नाम गुप्त रहेगा।
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/pest-outbreak-radar"
                className="rounded-xl bg-emerald-700 px-3 py-2 text-[11px] font-bold text-white"
              >
                नज़दीकी अलर्ट →
              </Link>
              <Link
                href={advisory}
                className="rounded-xl border border-emerald-500/30 px-3 py-2 text-[11px] font-bold text-emerald-800 dark:text-emerald-200"
              >
                सलाह देखें
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-[var(--av-surface)] to-orange-500/5 p-4 shadow-[var(--av-shadow-sm)]">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <Radio className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--av-text-primary)]">
            आस-पास किसानों को बताएँ?
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--av-text-muted)]">
            एक टैप से इलाके में चेतावनी। नाम नहीं दिखेगा — सिर्फ फसल, रोग/कीट और लगभग जगह।
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2.5 py-1 text-[10px] font-semibold text-[var(--av-text-secondary)]">
          <Shield className="h-3 w-3 text-emerald-600" />
          पहचान गुप्त
        </span>
        {mapped ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-900 dark:text-amber-100">
            {mapped.threatName} · {cropLabel}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleShare}
        disabled={submitting || !mapped}
        className="mt-3.5 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-md shadow-amber-700/20 disabled:opacity-50"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        {submitting ? "भेज रहे हैं…" : "एक टैप में साझा करें"}
      </button>
      <Link
        href="/pest-outbreak-radar/report"
        className="mt-2 block text-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
      >
        पहले जगह ठीक करें →
      </Link>
    </div>
  );
}
