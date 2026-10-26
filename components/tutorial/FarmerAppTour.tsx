"use client";

import { useEffect, useRef, useCallback } from "react";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { useLocale } from "@/components/i18n/LocaleProvider";

export const TOUR_STORAGE_KEY = "agriveda_farmer_spotlight_tour_seen_v1";

interface FarmerAppTourProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

/** Returns the currently visible element in the DOM (checking both mobile and desktop navs) */
function getVisibleElement(
  primarySelector: string,
  fallbackSelector?: string
): Element | undefined {
  if (typeof document === "undefined") return undefined;
  const primary = document.querySelector(primarySelector) as HTMLElement | null;
  if (
    primary &&
    primary.offsetParent !== null &&
    primary.getBoundingClientRect().height > 0
  ) {
    return primary;
  }
  if (fallbackSelector) {
    const fallbacks = document.querySelectorAll(fallbackSelector);
    for (const el of Array.from(fallbacks)) {
      const htmlEl = el as HTMLElement;
      if (
        htmlEl.offsetParent !== null &&
        htmlEl.getBoundingClientRect().height > 0
      ) {
        return htmlEl;
      }
    }
  }
  return (primary as Element) || undefined;
}

/** Determines best tooltip placement side based on element's on-screen coordinates */
function getOptimalSide(el?: Element | null): "top" | "bottom" | "left" | "right" {
  if (!el || typeof window === "undefined") return "top";
  const rect = el.getBoundingClientRect();
  if (rect.bottom >= window.innerHeight - 110) return "top";
  if (rect.top <= 130) return "bottom";
  if (rect.right <= 280) return "right";
  return rect.top > window.innerHeight / 2 ? "top" : "bottom";
}

export default function FarmerAppTour({
  forceOpen = false,
  onClose,
}: FarmerAppTourProps) {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const driverRef = useRef<Driver | null>(null);

  const startTour = useCallback(
    (manual = false) => {
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }

      const steps: DriveStep[] = [
        // Step 1: Center FAB Camera Button
        {
          element: () =>
            getVisibleElement(
              "#tour-ai-doctor",
              "#tour-home-camera-card, a[href='/ai-doctor']"
            ) as Element,
          popover: {
            title: isHi
              ? "📸 एआई फसल डॉक्टर (फोटो लें)"
              : "📸 AI Crop Doctor (Take Photo)",
            description: isHi
              ? "खेत में पौधे या पत्ते पर कोई भी कीड़ा, धब्बा या रोग दिखे — यहाँ टैप करके सीधे फोटो लें। <b>10 सेकंड में रोग की पहचान</b> और <b>15 लीटर टंकी के नाप</b> से पक्की दवा पाएं!"
              : "Spot any pest or leaf disease in your field? Tap here to take a photo. Get <b>instant AI diagnosis</b> and <b>exact 15L spray tank dosage</b>!",
            side: getOptimalSide(
              getVisibleElement(
                "#tour-ai-doctor",
                "#tour-home-camera-card, a[href='/ai-doctor']"
              )
            ),
            align: "center",
          },
        },
        // Step 2: Crops Tracker in Bottom Nav
        {
          element: () =>
            getVisibleElement("#tour-nav-crops", "a[href='/crops']") as Element,
          popover: {
            title: isHi
              ? "🌱 मेरी फसल (दैनिक फसल चक्र)"
              : "🌱 My Crops (Daily Advisory)",
            description: isHi
              ? "अपनी बोई हुई फसलें यहाँ जोड़ें। बुवाई की तारीख अनुसार <b>रोज़ाना खाद, सिंचाई और स्प्रे का सही शेड्यूल</b> देखें ताकि फसल स्वस्थ रहे।"
              : "Add your crops here to track <b>day-by-day schedules</b> for fertilizer application, watering, and sprays based on sowing date.",
            side: getOptimalSide(
              getVisibleElement("#tour-nav-crops", "a[href='/crops']")
            ),
            align: "start",
          },
        },
        // Step 3: Mandi Bhav in Bottom Nav
        {
          element: () =>
            getVisibleElement("#tour-nav-mandi", "a[href='/mandi']") as Element,
          popover: {
            title: isHi
              ? "💰 लाइव मंडी भाव (सरकारी APMC)"
              : "💰 Live Mandi Rates",
            description: isHi
              ? "अपनी नज़दीकी मंडियों के <b>आज के ताज़ा न्यूनतम, मॉडल व अधिकतम सरकारी भाव</b> देखें ताकि व्यापारी से अपनी उपज का सही दाम पा सकें।"
              : "Check today's real-time government APMC market rates across nearby mandis to negotiate the best price for your harvest.",
            side: getOptimalSide(
              getVisibleElement("#tour-nav-mandi", "a[href='/mandi']")
            ),
            align: "end",
          },
        },
        // Step 4: Home Leaf Photo Scan Card
        {
          element: () =>
            getVisibleElement(
              "#tour-home-camera-card",
              "a[href='/ai-doctor']"
            ) as Element,
          popover: {
            title: isHi
              ? "🔍 होम स्क्रीन से तुरंत जाँच"
              : "🔍 Instant Scan from Home",
            description: isHi
              ? "होम स्क्रीन पर मौजूद इस कार्ड पर टैप करके भी आप सीधे कैमरे से <b>पत्ती या पौधे की फोटो खींचकर रोग जाँच</b> शुरू कर सकते हैं।"
              : "You can also launch instant disease diagnosis directly from this camera card on your home screen.",
            side: getOptimalSide(
              getVisibleElement(
                "#tour-home-camera-card",
                "a[href='/ai-doctor']"
              )
            ),
            align: "center",
          },
        },
        // Step 5: Language Switcher in Top Bar
        {
          element: () =>
            getVisibleElement(
              "#tour-language-btn",
              "header button, a[href='/settings']"
            ) as Element,
          popover: {
            title: isHi
              ? "🌐 भाषा बदलें (EN / हिन्दी)"
              : "🌐 Language Switcher",
            description: isHi
              ? "यहाँ से कभी भी एक टैप में पूरी ऐप को अपनी पसंद की भाषा <b>हिन्दी या English</b> में आसानी से बदल सकते हैं।"
              : "Switch the entire app between <b>Hindi and English</b> at any time with just one tap.",
            side: getOptimalSide(
              getVisibleElement(
                "#tour-language-btn",
                "header button, a[href='/settings']"
              )
            ),
            align: "end",
          },
        },
        // Step 6: Alerts & Weather Bell in Top Bar
        {
          element: () =>
            getVisibleElement(
              "#tour-alerts-btn",
              "header a[href='/alerts'], a[href='/alerts']"
            ) as Element,
          popover: {
            title: isHi
              ? "🔔 मौसम व सिंचाई अलर्ट"
              : "🔔 Weather & Spray Alerts",
            description: isHi
              ? "अगले <b>7 दिनों का बारिश का पूर्वानुमान</b>, स्प्रे के लिए अनुकूल मौसम और सिंचाई के ज़रूरी अलर्ट यहाँ मिलेंगे।"
              : "Receive <b>7-day rainfall forecasts</b>, safe spray time windows, and critical farm alerts right here.",
            side: getOptimalSide(
              getVisibleElement(
                "#tour-alerts-btn",
                "header a[href='/alerts'], a[href='/alerts']"
              )
            ),
            align: "end",
          },
        },
      ];

      const driverInstance = driver({
        animate: true,
        smoothScroll: true,
        allowClose: true,
        stagePadding: 8,
        stageRadius: 18,
        overlayColor: "#02120b",
        overlayOpacity: 0.82,
        popoverClass: "agriveda-driver-popover",
        showProgress: true,
        progressText: isHi ? "{{current}} / {{total}}" : "{{current}} of {{total}}",
        nextBtnText: isHi ? "आगे बढ़ें →" : "Next →",
        prevBtnText: isHi ? "← पीछे" : "← Back",
        doneBtnText: isHi ? "समझ गए (शुरू करें) 🚀" : "Got it (Start) 🚀",
        steps,
        onDestroyed: () => {
          try {
            localStorage.setItem(TOUR_STORAGE_KEY, "1");
          } catch {
            /* ignore */
          }
          onClose?.();
        },
      });

      driverRef.current = driverInstance;
      driverInstance.drive();
    },
    [isHi, onClose]
  );

  useEffect(() => {
    const queryHasTour =
      typeof window !== "undefined" && window.location.search.includes("tour=1");

    if (forceOpen || queryHasTour) {
      const timer = setTimeout(() => startTour(true), 500);
      return () => clearTimeout(timer);
    }

    try {
      const seen = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!seen) {
        const timer = setTimeout(() => startTour(false), 900);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore */
    }
  }, [forceOpen, startTour]);

  useEffect(() => {
    const handleStartEvent = () => startTour(true);
    window.addEventListener("agriveda:start-tour", handleStartEvent);
    return () => {
      window.removeEventListener("agriveda:start-tour", handleStartEvent);
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }
    };
  }, [startTour]);

  return null;
}
