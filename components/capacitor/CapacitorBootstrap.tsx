"use client";

import { useEffect, useState } from "react";
import { isCapacitorNative } from "@/lib/capacitorNav";

/**
 * Native WebView: hide splash, surface load failures.
 * All UI via React — no imperative DOM remove/insert on React-managed nodes.
 */
export default function CapacitorBootstrap() {
  const [connectionHelp, setConnectionHelp] = useState(false);

  useEffect(() => {
    const native = isCapacitorNative();
    if (native) {
      document.documentElement.setAttribute("data-capacitor-native", "true");
    }

    const hideSplash = async () => {
      if (!native) return;
      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        // Let cinematic BootSplash take over — hide native splash after short beat
        await new Promise((r) => window.setTimeout(r, 280));
        await SplashScreen.hide({ fadeOutDuration: 400 });
      } catch {
        /* plugin optional */
      }
    };

    void hideSplash();

    if (!native) return;

    const timer = window.setTimeout(() => {
      const main = document.querySelector("main");
      const text = (main?.textContent ?? document.body.textContent ?? "").replace(/\s+/g, "");
      if (text.length < 60) setConnectionHelp(true);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!connectionHelp) return null;

  return (
    <div
      id="capacitor-connection-help"
      className="fixed inset-0 z-[99999] flex flex-col justify-center gap-3 bg-[#030712] p-6 text-[#f1f5f9]"
      style={{ fontFamily: "system-ui,sans-serif" }}
    >
      <h1 className="m-0 text-[22px] font-extrabold">Agriveda</h1>
      <p className="m-0 leading-relaxed opacity-95">PC se connect nahi ho paaya.</p>
      <ol className="m-0 list-decimal space-y-1 pl-[18px] text-sm leading-relaxed">
        <li>
          PC par: <b>npm run dev:lan</b>
        </li>
        <li>
          USB: phone connect + <b>npm run android:usb</b>
        </li>
        <li>
          Wi-Fi: <b>npm run android:fix</b>
        </li>
        <li>Android Studio se dubara Run</li>
      </ol>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-2 rounded-xl border-none bg-emerald-500 px-6 py-3.5 text-[15px] font-extrabold text-[#042]"
      >
        Dubara try karein
      </button>
    </div>
  );
}
