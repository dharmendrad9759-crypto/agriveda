"use client";

import { Capacitor } from "@capacitor/core";

export type NativeAppInfo = {
  platform: "android";
  version: string;
  build: number;
};

let cached: NativeAppInfo | null | undefined;

/** Capacitor native build info (versionCode as build). Cached after first read. */
export async function getNativeAppInfo(): Promise<NativeAppInfo | null> {
  if (cached !== undefined) return cached;
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) {
    cached = null;
    return null;
  }
  try {
    const { App } = await import("@capacitor/app");
    const info = await App.getInfo();
    const build = Number.parseInt(String(info.build ?? "0"), 10);
    cached = {
      platform: "android",
      version: String(info.version || "0"),
      build: Number.isFinite(build) && build > 0 ? build : 0,
    };
    return cached;
  } catch {
    cached = null;
    return null;
  }
}

export function publicMinNativeVersionCode(): number {
  const raw = process.env.NEXT_PUBLIC_MIN_NATIVE_VERSION_CODE?.trim();
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export const FORCE_UPDATE_EVENT = "agriveda:force-update";

export function signalForceUpdate(minVersionCode?: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(FORCE_UPDATE_EVENT, {
      detail: { minVersionCode: minVersionCode ?? publicMinNativeVersionCode() },
    })
  );
}

/** Merge native version headers into a HeadersInit. */
export async function withNativeAppHeaders(
  init?: HeadersInit
): Promise<Headers> {
  const headers = new Headers(init);
  const info = await getNativeAppInfo();
  if (info) {
    headers.set("X-App-Platform", info.platform);
    headers.set("X-App-Build", String(info.build));
    headers.set("X-App-Version", info.version);
  }
  return headers;
}
