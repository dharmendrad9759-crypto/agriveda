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

export default function FarmerAppTour({
  forceOpen = false,
  onClose,
}: FarmerAppTourProps) {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const driverRef = useRef<Driver | null>(null);

  const startTour = useCallback(
    (manual = false) => {
      // Clean up previous instance if running
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }

      const steps: DriveStep[] = [
        // Step 1: Center FAB Camera Button
        {
          element: "#tour-ai-doctor",
          popover: {
            title: isHi
              ? "📸 एआई फसल डॉक्टर (फोटो लें)"
              : "📸 AI Crop Doctor (Take Photo)",
            description: isHi
              ? "खेत में पौधे या पत्ते पर कोई भी कीड़ा, धब्बा या रोग दिखे — यहाँ टैप करके सीधे फोटो लें। <b>10 सेकंड में रोग की पहचान</b> और <b>15 लीटर टंकी के नाप</b> से पक्की दवा पाएं!"
              : "Spot any pest or leaf disease in your field? Tap here to take a photo. Get <b>instant AI diagnosis</b> and <b>exact 15L spray tank dosage</b>!",
            side: "top",
            align: "center",
          },
        },
        // Step 2: Crops Tracker in Bottom Nav
        {
          element: "#tour-nav-crops",
          popover: {
            title: isHi
              ? "🌱 मेरी फसल (दैनिक फसल चक्र)"
              : "🌱 My Crops (Daily Advisory)",
            description: isHi
              ? "अपनी बोई हुई फसलें यहाँ जोड़ें। बुवाई की तारीख अनुसार <b>रोज़ाना खाद, सिंचाई और स्प्रे का सही शेड्यूल</b> देखें ताकि फसल स्वस्थ रहे।"
              : "Add your crops here to track <b>day-by-day schedules</b> for fertilizer application, watering, and sprays based on sowing date.",
            side: "top",
            align: "start",
          },
        },
        // Step 3: Mandi Bhav in Bottom Nav
        {
          element: "#tour-nav-mandi",
          popover: {
            title: isHi
              ? "💰 लाइव मंडी भाव (सरकारी APMC)"
              : "💰 Live Mandi Rates",
            description: isHi
              ? "अपनी नज़दीकी मंडियों के <b>आज के ताज़ा न्यूनतम, मॉडल व अधिकतम सरकारी भाव</b> देखें ताकि व्यापारी से अपनी उपज का सही दाम पा सकें।"
              : "Check today's real-time government APMC market rates across nearby mandis to negotiate the best price for your harvest.",
            side: "top",
            align: "end",
          },
        },
        // Step 4: Home Leaf Photo Scan Card
        {
          element: "#tour-home-camera-card",
          popover: {
            title: isHi
              ? "🔍 होम स्क्रीन से तुरंत जाँच"
              : "🔍 Instant Scan from Home",
            description: isHi
              ? "होम स्क्रीन पर मौजूद इस कार्ड पर टैप करके भी आप सीधे कैमरे से <b>पत्ती या पौधे की फोटो खींचकर रोग जाँच</b> शुरू कर सकते हैं।"
              : "You can also launch instant disease diagnosis directly from this camera card on your home screen.",
            side: "bottom",
            align: "center",
          },
        },
        // Step 5: Language Switcher in Top Bar
        {
          element: "#tour-language-btn",
          popover: {
            title: isHi
              ? "🌐 भाषा बदलें (EN / हिन्दी)"
              : "🌐 Language Switcher",
            description: isHi
              ? "यहाँ से कभी भी एक टैप में पूरी ऐप को अपनी पसंद की भाषा <b>हिन्दी या English</b> में आसानी से बदल सकते हैं।"
              : "Switch the entire app between <b>Hindi and English</b> at any time with just one tap.",
            side: "bottom",
            align: "end",
          },
        },
        // Step 6: Alerts & Weather Bell in Top Bar
        {
          element: "#tour-alerts-btn",
          popover: {
            title: isHi
              ? "🔔 मौसम व सिंचाई अलर्ट"
              : "🔔 Weather & Spray Alerts",
            description: isHi
              ? "अगले <b>7 दिनों का बारिश का पूर्वानुमान</b>, स्प्रे के लिए अनुकूल मौसम और सिंचाई के ज़रूरी अलर्ट यहाँ मिलेंगे।"
              : "Receive <b>7-day rainfall forecasts</b>, safe spray time windows, and critical farm alerts right here.",
            side: "bottom",
            align: "end",
          },
        },
      ];

      // Check if at least one target element is mounted in DOM
      const hasAnyElement = steps.some((s) => {
        if (typeof s.element === "string") {
          return document.querySelector(s.element) !== null;
        }
        return false;
      });

      if (!hasAnyElement && !manual) {
        return;
      }

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
    // If explicitly forced open (e.g. from a button or ?tour=1 URL query)
    const queryHasTour =
      typeof window !== "undefined" && window.location.search.includes("tour=1");

    if (forceOpen || queryHasTour) {
      const timer = setTimeout(() => startTour(true), 500);
      return () => clearTimeout(timer);
    }

    // Auto-launch for first-time visitors
    try {
      const seen = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!seen) {
        // Allow DOM to settle before highlighting
        const timer = setTimeout(() => startTour(false), 900);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore */
    }
  }, [forceOpen, startTour]);

  // Listen for global custom event to trigger tour from drawer or profile
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
