"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { isCapacitorNative } from "@/lib/capacitorNav";

/** Fire page_view on route changes */
export default function AnalyticsBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    track("page_view", {
      path: pathname,
      native: isCapacitorNative(),
    });
  }, [pathname]);

  return null;
}
