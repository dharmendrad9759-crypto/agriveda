"use client";

import { useEffect, useRef, useCallback } from "react";
import { driver, type Driver, type DriveStep, type PopoverDOM, type HookOpts } from "driver.js";
import "driver.js/dist/driver.css";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { speakFarmerText, stopFarmerSpeech, isFarmerSpeaking } from "@/lib/speech/farmerVoice";

export const TOUR_STORAGE_KEY = "agriveda_farmer_spotlight_tour_seen_v2";

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
      stopFarmerSpeech();
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }

      const stepsData = [
        // Step 1: Center FAB Camera Button
        {
          target: "#tour-ai-doctor",
          fallback: "#tour-home-camera-card, a[href='/ai-doctor']",
          radius: 9999,
          padding: 2,
          hiTitle: "📸 फोटो खींचें, बीमारी जानें",
          hiDesc: "फसल में कोई भी कीड़ा या रोग दिखे, तो यहाँ दबाकर फोटो खींचें। तुरंत बीमारी का पता चलेगा और 15 लीटर टंकी के हिसाब से सही दवा मिलेगी।",
          enTitle: "📸 Take Photo, Check Disease",
          enDesc: "See any pest or spot on your crop? Tap here to take a photo. Get instant disease check and exact medicine dose for a 15L tank.",
          align: "center" as const,
        },
        // Step 2: Crops Tracker in Bottom Nav
        {
          target: "#tour-nav-crops",
          fallback: "a[href='/crops']",
          radius: 14,
          padding: 2,
          hiTitle: "🌱 मेरी फसल और खाद-पानी",
          hiDesc: "अपनी फसल और बुवाई की तारीख यहाँ जोड़ें। किस दिन कौन-सी खाद डालनी है और कब पानी देना है, इसकी पूरी जानकारी यहाँ मिलेगी।",
          enTitle: "🌱 My Crop & Care Plan",
          enDesc: "Add your crop and sowing date here. Know exactly when to give fertilizer, water, and spray at the right time.",
          align: "start" as const,
        },
        // Step 3: Mandi Bhav in Bottom Nav
        {
          target: "#tour-nav-mandi",
          fallback: "a[href='/mandi']",
          radius: 14,
          padding: 2,
          hiTitle: "💰 आज का ताज़ा मंडी भाव",
          hiDesc: "अपने पास की मंडियों के आज के ताज़ा रेट यहाँ देखें, ताकि आप अपनी फसल सही और पूरे दाम पर बेच सकें।",
          enTitle: "💰 Today's Live Mandi Rates",
          enDesc: "Check today's latest crop prices from nearby mandis so you always get the best rate for your harvest.",
          align: "end" as const,
        },
        // Step 4: Home Leaf Photo Scan Card
        {
          target: "#tour-home-camera-card",
          fallback: "a[href='/ai-doctor']",
          radius: 18,
          padding: 2,
          hiTitle: "🔍 सीधे यहाँ से भी जाँच करें",
          hiDesc: "आप इस बड़े कार्ड को दबाकर भी सीधे खराब पत्ती की फोटो खींच सकते हैं और बीमारी का इलाज जान सकते हैं।",
          enTitle: "🔍 Quick Check from Home",
          enDesc: "You can also tap this card directly to take a leaf photo and find the right treatment quickly.",
          align: "center" as const,
        },
        // Step 5: Language Switcher in Top Bar
        {
          target: "#tour-language-btn",
          fallback: "header button, a[href='/settings']",
          radius: 12,
          padding: 2,
          hiTitle: "🌐 अपनी भाषा चुनें (हिन्दी / EN)",
          hiDesc: "यहाँ दबाकर आप कभी भी ऐप को हिन्दी या English में बदल सकते हैं।",
          enTitle: "🌐 Change Language (हिन्दी / EN)",
          enDesc: "Tap here anytime to easily switch the app between Hindi and English.",
          align: "end" as const,
        },
        // Step 6: Alerts & Weather Bell in Top Bar
        {
          target: "#tour-alerts-btn",
          fallback: "header a[href='/alerts'], a[href='/alerts']",
          radius: 12,
          padding: 2,
          hiTitle: "🔔 मौसम और बारिश की जानकारी",
          hiDesc: "आने वाले 7 दिनों में बारिश कब होगी, और खाद या स्प्रे करने का सही समय क्या है, उसके अलर्ट यहाँ मिलेंगे।",
          enTitle: "🔔 Weather & Rain Alerts",
          enDesc: "Check the 7-day rain update and get alerts on the best time to water or spray your crops.",
          align: "end" as const,
        },
      ];

      const steps: DriveStep[] = stepsData.map((item) => {
        return {
          element: () => getVisibleElement(item.target, item.fallback) as Element,
          popover: {
            title: isHi ? item.hiTitle : item.enTitle,
            description: isHi ? item.hiDesc : item.enDesc,
            side: getOptimalSide(getVisibleElement(item.target, item.fallback)),
            align: item.align,
          },
          onHighlightStarted: (element, step, opts) => {
            stopFarmerSpeech();
            opts.driver.setConfig({
              ...opts.driver.getConfig(),
              stageRadius: item.radius,
              stagePadding: item.padding,
            });
          },
          onDeselected: () => {
            stopFarmerSpeech();
          },
        };
      });

      const driverInstance = driver({
        animate: true,
        smoothScroll: true,
        allowClose: true,
        stagePadding: 2,
        stageRadius: 9999,
        overlayColor: "#02120b",
        overlayOpacity: 0.82,
        popoverClass: "agriveda-driver-popover",
        showProgress: true,
        progressText: isHi ? "{{current}} / {{total}}" : "{{current}} of {{total}}",
        nextBtnText: isHi ? "आगे बढ़ें →" : "Next →",
        prevBtnText: isHi ? "← पीछे" : "← Back",
        doneBtnText: isHi ? "शुरू करें 👍" : "Get Started 👍",
        steps,
        onPopoverRender: (popoverDOM: PopoverDOM, { state }: HookOpts) => {
          const activeIndex = state.activeIndex ?? 0;
          const currentData = stepsData[activeIndex];
          const total = stepsData.length;

          // 1. Modern Animated Progress Dots
          let dotsHtml = '<div class="agriveda-tour-dots" aria-hidden="true">';
          for (let i = 0; i < total; i++) {
            const isActive = i === activeIndex;
            dotsHtml += `<span class="agriveda-tour-dot ${isActive ? "active" : ""}"></span>`;
          }
          dotsHtml += "</div>";
          popoverDOM.progress.innerHTML = dotsHtml;

          // 2. Audio Speaker Guide Button
          let speakerBtn = popoverDOM.wrapper.querySelector(
            ".agriveda-tour-speaker-btn"
          ) as HTMLButtonElement | null;

          if (!speakerBtn) {
            speakerBtn = document.createElement("button");
            speakerBtn.className = "agriveda-tour-speaker-btn";
            speakerBtn.type = "button";

            const headerContainer = document.createElement("div");
            headerContainer.className = "agriveda-tour-top-bar";
            
            popoverDOM.title.parentNode?.insertBefore(headerContainer, popoverDOM.title);
            headerContainer.appendChild(speakerBtn);
          }

          const updateSpeakerBtn = (speaking: boolean) => {
            if (speaking) {
              speakerBtn!.innerHTML = `
                <span class="agriveda-sound-waves" aria-hidden="true">
                  <span class="wave bar-1"></span>
                  <span class="wave bar-2"></span>
                  <span class="wave bar-3"></span>
                </span>
                <span class="speaker-text">${isHi ? "बोल रहे हैं..." : "Speaking..."}</span>
              `;
              speakerBtn!.classList.add("speaking");
            } else {
              speakerBtn!.innerHTML = `
                <svg class="speaker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
                <span class="speaker-text">${isHi ? "आवाज़ सुनें" : "Listen"}</span>
              `;
              speakerBtn!.classList.remove("speaking");
            }
          };

          updateSpeakerBtn(isFarmerSpeaking());

          const spokenTitle = isHi ? currentData.hiTitle : currentData.enTitle;
          const spokenDesc = isHi ? currentData.hiDesc : currentData.enDesc;
          const cleanSpeech = `${spokenTitle}. ${spokenDesc}`
            .replace(/[📸🌱💰🔍🌐🔔👍]/g, "")
            .trim();

          speakerBtn.onclick = (e) => {
            e.stopPropagation();
            if (isFarmerSpeaking()) {
              stopFarmerSpeech();
              updateSpeakerBtn(false);
            } else {
              updateSpeakerBtn(true);
              speakFarmerText(cleanSpeech, isHi, () => {
                updateSpeakerBtn(false);
              });
            }
          };

          // 3. Skip Button Text with 'छोड़ें' (Skip) next to ✕
          popoverDOM.closeButton.innerHTML = `<span>${isHi ? "छोड़ें" : "Skip"}</span> <span class="close-x">✕</span>`;
          popoverDOM.closeButton.className = "driver-popover-close-btn agriveda-tour-skip-btn";

          // 4. Final step button label
          if (activeIndex === total - 1) {
            popoverDOM.nextButton.textContent = isHi ? "शुरू करें 👍" : "Get Started 👍";
          } else {
            popoverDOM.nextButton.textContent = isHi ? "आगे बढ़ें →" : "Next →";
          }
        },
        onDestroyed: () => {
          stopFarmerSpeech();
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
      stopFarmerSpeech();
      window.removeEventListener("agriveda:start-tour", handleStartEvent);
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }
    };
  }, [startTour]);

  return null;
}
