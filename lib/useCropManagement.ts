"use client";

import { useMemo } from "react";
import { getCropManagementProfile } from "@/data/crop-management";
import type { CropManagementProfile } from "@/types/crop-management";

export function useCropManagement(slug: string): CropManagementProfile | null {
  return useMemo(() => getCropManagementProfile(slug), [slug]);
}
