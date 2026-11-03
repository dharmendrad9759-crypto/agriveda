"use client";

import { useEffect, useState } from "react";
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
        // App UI is Hindi-first — treating page as English makes Translate scramble copy
        pageLanguage: "hi",
        includedLanguages: "hi,en,pa,gu,mr,bn,ta,te,kn,ml,or,ur",
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

/** Web only. On the phone this script rewrote the page after a good first open. */
export default function GoogleTranslateBootstrap() {
  const [native] = useState(() =>
    typeof window !== "undefined" ? isCapacitorNative() : false
  );

  useEffect(() => {
    if (native) return;
    injectTranslate();
  }, [native]);

  if (native) return null;

  return <div id="google_translate_element" className="hidden" aria-hidden />;
}
