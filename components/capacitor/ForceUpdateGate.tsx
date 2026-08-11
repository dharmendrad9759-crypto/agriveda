"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  FORCE_UPDATE_EVENT,
  getNativeAppInfo,
  publicMinNativeVersionCode,
} from "@/lib/nativeAppInfo";
import { APP_NAME } from "@/lib/appMeta";

const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ||
  "https://play.google.com/store/apps/details?id=com.agriveda.app";

/**
 * Full-screen block when native versionCode is below MIN / after API 426.
 */
export default function ForceUpdateGate() {
  const [blocked, setBlocked] = useState(false);
  const [minCode, setMinCode] = useState(0);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cancelled = false;
    (async () => {
      const info = await getNativeAppInfo();
      const min = publicMinNativeVersionCode();
      if (cancelled || !info || min <= 0) return;
      if (info.build > 0 && info.build < min) {
        setMinCode(min);
        setBlocked(true);
      }
    })();

    const onForce = (ev: Event) => {
      const detail = (ev as CustomEvent<{ minVersionCode?: number }>).detail;
      setMinCode(detail?.minVersionCode ?? publicMinNativeVersionCode());
      setBlocked(true);
    };
    window.addEventListener(FORCE_UPDATE_EVENT, onForce);
    return () => {
      cancelled = true;
      window.removeEventListener(FORCE_UPDATE_EVENT, onForce);
    };
  }, []);

  if (!blocked) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-[var(--av-bg,#04140f)] px-6 text-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="force-update-title"
    >
      <h1
        id="force-update-title"
        className="text-xl font-bold text-[var(--av-text-primary,#f8faf8)]"
      >
        नया संस्करण ज़रूरी है
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-[var(--av-text-secondary,#c5d4c8)]">
        {APP_NAME} का यह पुराना वर्जन अब काम नहीं करता
        {minCode > 0 ? ` (न्यूनतम बिल्ड ${minCode})` : ""}. कृपया Play Store से
        अपडेट करें, फिर ऐप खोलें।
      </p>
      <a
        href={PLAY_STORE_URL}
        className="mt-2 inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-sm font-bold text-white active:scale-[0.98]"
      >
        अपडेट करें
      </a>
    </div>
  );
}
