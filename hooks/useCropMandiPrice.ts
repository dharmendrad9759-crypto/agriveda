"use client";

import { useMemo } from "react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { bestMandiRowForSlug, mandiCropForSlug } from "@/lib/mandi/cropSlugMap";

export function useCropMandiPrice(cropSlug: string) {
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || "Madhya Pradesh";
  const district = profile.district.trim() || undefined;
  const { data, loading } = useMandiPrices({ state, district });

  const row = useMemo(
    () => bestMandiRowForSlug(data?.rows ?? [], cropSlug),
    [data?.rows, cropSlug]
  );

  const mandiCrop = mandiCropForSlug(cropSlug);
  const locationLabel = district ? `${district}, ${state}` : state;

  return {
    row,
    loading,
    mandiCrop,
    locationLabel,
    source: data?.source,
    lastUpdated: data?.lastUpdated,
    hasMapping: Boolean(mandiCrop),
  };
}
