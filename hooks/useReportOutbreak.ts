"use client";

import { useCallback, useState } from "react";
import type { OutbreakSeverity, OutbreakThreatType } from "@/types/outbreak";
import { submitOutbreakReport, imageUrlToDataUrl } from "@/lib/outbreakApi";
import { useFarmerId } from "@/hooks/useFarmerId";
import { requestUserLocation } from "@/lib/weatherApi";

export interface ReportOutbreakParams {
  cropId: string;
  threatType: OutbreakThreatType;
  pestOrDiseaseId: string;
  severity: OutbreakSeverity;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
}

export function useReportOutbreak() {
  const farmerId = useFarmerId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (params: ReportOutbreakParams) => {
      if (!farmerId) return null;
      setSubmitting(true);
      setError(null);
      try {
        let lat = params.latitude;
        let lon = params.longitude;

        if (lat == null || lon == null) {
          const pos = await requestUserLocation();
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        }

        let photoUrl = params.photoUrl;
        if (photoUrl && !photoUrl.startsWith("data:")) {
          photoUrl = await imageUrlToDataUrl(photoUrl);
        }

        const result = await submitOutbreakReport({
          farmerId,
          cropId: params.cropId,
          threatType: params.threatType,
          pestOrDiseaseId: params.pestOrDiseaseId,
          severity: params.severity,
          photoUrl,
          latitude: lat,
          longitude: lon,
        });

        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Submit failed");
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [farmerId]
  );

  return { submit, submitting, error };
}
