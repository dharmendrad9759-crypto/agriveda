"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
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

/** Re-apply Google Translate after Next.js client navigations (SPA). */
function reapplyGoogleTranslate(targetLang: string) {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select) return;

  const apply = () => {
    if (select.value !== targetLang) {
      select.value = targetLang;
      select.dispatchEvent(new Event("change"));
    } else {
      // Force re-scan of newly mounted React content
      select.value = "en";
      select.dispatchEvent(new Event("change"));
      window.setTimeout(() => {
        select.value = targetLang;
        select.dispatchEvent(new Event("change"));
      }, 80);
    }
  };

  window.setTimeout(apply, 120);
}

/** Loads Google Translate — deferred on native so cold open stays smooth */
export default function GoogleTranslateBootstrap() {
  const pathname = usePathname();
  const { locale, hydrated } = useLocale();

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

  // After client-side route changes, re-trigger translation for Hindi
  useEffect(() => {
    if (!hydrated || locale !== "hi") return;
    reapplyGoogleTranslate("hi");
  }, [pathname, locale, hydrated]);

  return <div id="google_translate_element" className="hidden" aria-hidden />;
}
