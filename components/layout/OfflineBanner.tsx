"use client";

import { useEffect, useState } from "react";
import { WifiOff, X } from "lucide-react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setOffline(!navigator.onLine);
      if (navigator.onLine) setDismissed(false);
    };
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline || dismissed) return null;

  return (
    <div className="sticky top-0 z-[60] flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/15 px-4 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
      <WifiOff className="h-4 w-4 shrink-0" />
      <p className="flex-1">
        इंटरनेट नहीं है — मौसम, AI और mandi के लिए net ज़रूरी। सेव की हुई जानकारी दिख सकती है।
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="rounded-lg p-1 hover:bg-amber-500/20"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
