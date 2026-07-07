"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { hardNavigate, isCapacitorNative } from "@/lib/capacitorNav";

export function useAppNavigate() {
  const router = useRouter();

  return useCallback(
    (path: string) => {
      if (isCapacitorNative()) {
        hardNavigate(path);
        return;
      }
      router.push(path);
    },
    [router]
  );
}
