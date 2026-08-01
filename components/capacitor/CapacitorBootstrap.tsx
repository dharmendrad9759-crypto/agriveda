"use client";

import { useEffect, useState } from "react";
import { isCapacitorNative } from "@/lib/capacitorNav";
import NativeLaunchSplash from "@/components/capacitor/NativeLaunchSplash";

/**
 * Native WebView bootstrap: branded splash + connection help.
 */
export default function CapacitorBootstrap() {
  const [connectionHelp, setConnectionHelp] = useState(false);
  // Sync on first paint so splash is not delayed one frame
  const [native] = useState(() =>
    typeof window !== "undefined" ? isCapacitorNative() : false
  );

  useEffect(() => {
    if (!native) return;
    document.documentElement.setAttribute("data-capacitor-native", "true");

    const timer = window.setTimeout(() => {
      const main = document.querySelector("main");
      const text = (main?.textContent ?? document.body.textContent ?? "").replace(/\s+/g, "");
      if (text.length < 60) setConnectionHelp(true);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [native]);

  return (
    <>
      {native ? <NativeLaunchSplash /> : null}
      {connectionHelp ? (
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
              Wi-Fi: <b>npm run android:wifi</b>
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
      ) : null}
    </>
  );
}
