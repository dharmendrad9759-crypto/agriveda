"use client";

import { useEffect, useState } from "react";
import { isCapacitorNative } from "@/lib/capacitorNav";

/**
 * Native WebView bootstrap: connection help.
 * Brand splash + intro carousel live in LaunchFlow (shared web/native).
 */
export default function CapacitorBootstrap() {
  const [connectionHelp, setConnectionHelp] = useState(false);
  // Sync on first paint so splash is not delayed one frame
  const [native] = useState(() =>
    typeof window !== "undefined" ? isCapacitorNative() : false
  );

  const [devHost] = useState(() => {
    if (typeof window === "undefined" || window.location.protocol !== "http:") return false;
    const h = window.location.hostname;
    return (
      h === "localhost" ||
      h === "127.0.0.1" ||
      h === "10.0.2.2" ||
      /^192\.168\./.test(h) ||
      /^10\./.test(h) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h)
    );
  });

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
      {connectionHelp ? (
        <div
          id="capacitor-connection-help"
          className="fixed inset-0 z-[99999] flex flex-col justify-center gap-3 bg-[#030712] p-6 text-[#f1f5f9]"
          style={{ fontFamily: "system-ui,sans-serif" }}
        >
          <h1 className="m-0 text-[22px] font-extrabold">Agriveda</h1>
          {devHost ? (
            <>
              <p className="m-0 leading-relaxed opacity-95">PC के dev server से नहीं जुड़ पाया।</p>
              <ol className="m-0 list-decimal space-y-1 pl-[18px] text-sm leading-relaxed">
                <li>
                  PC पर: <b>npm run dev:lan</b>
                </li>
                <li>
                  USB: phone connect + <b>npm run android:usb</b>
                </li>
                <li>
                  Wi-Fi: <b>npm run android:wifi</b>
                </li>
                <li>Android Studio से दोबारा Run</li>
              </ol>
            </>
          ) : (
            <p className="m-0 text-base leading-relaxed opacity-95">
              नेट धीमा है या बंद है। इंटरनेट चालू करके फिर खोलें — एक बार खुले पेज अगली बार बिना नेट भी खुल सकते हैं।
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-xl border-none bg-emerald-500 px-6 py-3.5 text-[15px] font-extrabold text-[#042]"
          >
            फिर खोलें
          </button>
        </div>
      ) : null}
    </>
  );
}
