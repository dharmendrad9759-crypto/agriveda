"use client";

import { useEffect, useState } from "react";
import { isCapacitorNative } from "@/lib/capacitorNav";

/**
 * SecurityProtectionBootstrap
 * Comprehensive Anti-Screenshot, Anti-Recording & Anti-Copy Protection Layer:
 * 1. Native Android: Activates WindowManager FLAG_SECURE (hardware screenshot & recording blacked out).
 * 2. Web & Browser: Blocks right-click context menu, text selection, image drag, and copy/cut events.
 * 3. Keyboard: Intercepts Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, F12, DevTools shortcuts, and PrintScreen.
 * 4. Screen Capture Defense: Displays an opaque blackout shield if PrintScreen is triggered.
 */
export default function SecurityProtectionBootstrap() {
  const [shieldActive, setShieldActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Android Native Protection via FLAG_SECURE
    if (typeof window !== "undefined") {
      // Direct JS interface bridge
      if (
        (window as unknown as { AgrivedaAndroid?: { setScreenProtection?: (enable: boolean) => void } })
          .AgrivedaAndroid?.setScreenProtection
      ) {
        try {
          (
            window as unknown as { AgrivedaAndroid: { setScreenProtection: (enable: boolean) => void } }
          ).AgrivedaAndroid.setScreenProtection(true);
        } catch {
          /* ignore */
        }
      }

      // Capacitor plugin bridge
      if (isCapacitorNative()) {
        void (async () => {
          try {
            const { registerPlugin } = await import("@capacitor/core");
            const AgrivedaSettings = registerPlugin<{
              setScreenProtection: (options: { enable: boolean }) => Promise<void>;
            }>("AgrivedaSettings");
            await AgrivedaSettings.setScreenProtection({ enable: true });
          } catch {
            /* optional on web */
          }
        })();
      }
    }

    const showWarning = (msg: string) => {
      setToastMessage(msg);
      window.clearTimeout((window as unknown as { _secToastTimer?: number })._secToastTimer);
      (window as unknown as { _secToastTimer?: number })._secToastTimer = window.setTimeout(() => {
        setToastMessage(null);
      }, 2500);
    };

    const isEditable = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toUpperCase();
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target.isContentEditable ||
        target.classList.contains("allow-select")
      );
    };

    // 2. Disable Context Menu (Right Click & Long Press)
    const handleContextMenu = (e: MouseEvent) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
      showWarning("सुरक्षा नीति: सामग्री कॉपी या डाउनलोड करना प्रतिबंधित है।");
    };

    // 3. Disable Copy & Cut
    const handleCopyCut = (e: ClipboardEvent) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.clearData();
        e.clipboardData.setData("text/plain", "Agriveda - सामग्री सुरक्षित है");
      }
      showWarning("सुरक्षा नीति: सामग्री कॉपी करना प्रतिबंधित है।");
    };

    // 4. Disable Dragging (Images, Text)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 5. Intercept Shortcuts & PrintScreen
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // PrintScreen key (Screenshot on Desktop/Windows)
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        // Clear clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("").catch(() => {});
        }
        // Activate blackout shield temporarily
        setShieldActive(true);
        setTimeout(() => setShieldActive(false), 2000);
        showWarning("सुरक्षा नीति: स्क्रीनशॉट लेना प्रतिबंधित है।");
        return;
      }

      // Block Ctrl+C / Ctrl+X outside inputs
      if (isCtrlOrMeta && (key === "c" || key === "x")) {
        if (!isEditable(e.target)) {
          e.preventDefault();
          showWarning("सुरक्षा नीति: कॉपी करना प्रतिबंधित है।");
          return;
        }
      }

      // Block Ctrl+U (View Source), Ctrl+S (Save Page), Ctrl+P (Print)
      if (isCtrlOrMeta && (key === "u" || key === "s" || key === "p")) {
        e.preventDefault();
        showWarning("सुरक्षा नीति: यह क्रिया प्रतिबंधित है।");
        return;
      }

      // Block F12 and DevTools shortcuts
      if (
        e.key === "F12" ||
        (isCtrlOrMeta && e.shiftKey && (key === "i" || key === "j" || key === "c"))
      ) {
        e.preventDefault();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        setShieldActive(true);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("").catch(() => {});
        }
        setTimeout(() => setShieldActive(false), 2000);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("copy", handleCopyCut, { capture: true });
    document.addEventListener("cut", handleCopyCut, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("keyup", handleKeyUp, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      document.removeEventListener("copy", handleCopyCut, { capture: true });
      document.removeEventListener("cut", handleCopyCut, { capture: true });
      document.removeEventListener("dragstart", handleDragStart, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
    };
  }, []);

  return (
    <>
      {/* Blackout shield when screenshot / capture attempt is detected */}
      {shieldActive && (
        <div
          className="security-screen-shield fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black text-white p-6 text-center"
          aria-hidden="true"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-3xl mb-4">
            🔒
          </div>
          <h2 className="text-xl font-bold text-emerald-400 mb-2">
            सुरक्षा नीति (Security Policy)
          </h2>
          <p className="text-sm text-gray-300 max-w-sm">
            Agriveda में स्क्रीनशॉट और स्क्रीन रिकॉर्डिंग प्रतिबंधित है।
          </p>
        </div>
      )}

      {/* Floating security warning toast */}
      {toastMessage && (
        <div
          role="alert"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[999998] flex items-center gap-2.5 rounded-full bg-stone-900/95 border border-emerald-500/50 px-4 py-2.5 text-xs font-semibold text-emerald-300 shadow-2xl backdrop-blur-md animate-fade-in pointer-events-none"
        >
          <span className="text-sm">🛡️</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
