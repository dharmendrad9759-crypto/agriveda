"use client";

import { useEffect } from "react";
import { isCapacitorNative } from "@/lib/capacitorNav";

/**
 * Standard native essentials: Android back button, status bar polish.
 */
export default function NativeAppEssentials() {
  useEffect(() => {
    if (!isCapacitorNative()) return;
    let remove: (() => void) | undefined;

    (async () => {
      try {
        const { App } = await import("@capacitor/app");
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#04140f" });
        } catch {
          /* optional */
        }

        const handle = await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack || window.history.length > 1) {
            window.history.back();
            return;
          }
          void App.exitApp();
        });
        remove = () => {
          void handle.remove();
        };
      } catch {
        /* plugins optional on web */
      }
    })();

    return () => remove?.();
  }, []);

  return null;
}
