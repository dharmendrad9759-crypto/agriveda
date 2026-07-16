"use client";

import { useEffect } from "react";
import { isCapacitorNative } from "@/lib/capacitorNav";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          opts: { pageLanguage: string; includedLanguages?: string; autoDisplay?: boolean },
          id: string
        ) => void;
      };
    };
  }
}

function injectTranslate() {
  if (document.getElementById("google-translate-script")) return;

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate) return;
    // eslint-disable-next-line no-new
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,hi,pa,gu,mr,bn,ta,te,kn,ml,or,ur",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

/** Loads Google Translate — deferred on native so cold open stays smooth */
export default function GoogleTranslateBootstrap() {
  useEffect(() => {
    const native = isCapacitorNative();
    if (native) {
      const idle =
        "requestIdleCallback" in window
          ? window.requestIdleCallback(() => injectTranslate(), { timeout: 5000 })
          : null;
      const fallback = window.setTimeout(injectTranslate, 3500);
      return () => {
        if (idle != null && "cancelIdleCallback" in window) {
          window.cancelIdleCallback(idle);
        }
        window.clearTimeout(fallback);
      };
    }

    injectTranslate();
  }, []);

  return <div id="google_translate_element" className="hidden" aria-hidden />;
}
