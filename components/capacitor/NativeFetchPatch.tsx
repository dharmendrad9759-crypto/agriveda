"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { signalForceUpdate, withNativeAppHeaders } from "@/lib/nativeAppInfo";

let patched = false;

/**
 * On Capacitor Android, attach X-App-* headers to fetch and surface FORCE_UPDATE.
 */
export function installNativeFetchPatch() {
  if (typeof window === "undefined" || patched) return;
  if (!Capacitor.isNativePlatform()) return;
  patched = true;

  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const nextInit: RequestInit = { ...init };
    nextInit.headers = await withNativeAppHeaders(init?.headers);
    const res = await original(input, nextInit);
    if (res.status === 426) {
      try {
        const clone = res.clone();
        const body = (await clone.json()) as { minVersionCode?: number };
        signalForceUpdate(body.minVersionCode);
      } catch {
        signalForceUpdate();
      }
    }
    return res;
  };
}

export default function NativeFetchPatch() {
  useEffect(() => {
    installNativeFetchPatch();
  }, []);
  return null;
}
