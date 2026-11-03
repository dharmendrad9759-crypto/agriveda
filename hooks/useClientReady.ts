"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

/** False on SSR + first hydrate paint; true after client commit. Avoids hydration mismatches. */
export function useClientReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * Prefer the static (reduced) motion path until the client is ready so SSR
 * markup matches the first hydrated paint. Then honor the real preference.
 */
export function useSafeReducedMotion(): boolean {
  const ready = useClientReady();
  const prefersReduced = useReducedMotion();
  if (!ready) return true;
  return prefersReduced === true;
}
