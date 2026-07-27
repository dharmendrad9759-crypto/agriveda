"use client";

import { useEffect, useState } from "react";

export type NetworkStatus = {
  online: boolean;
  /** True after a long-running request crosses the slow threshold */
  slow: boolean;
  setSlow: (value: boolean) => void;
};

/**
 * Online/offline + slow-network helper for farmer flows on weak 4G.
 */
export function useNetworkStatus(slowAfterMs = 8000): NetworkStatus {
  const [online, setOnline] = useState(true);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const sync = () => setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    if (online) setSlow(false);
  }, [online]);

  return { online, slow, setSlow };
}

/** Run an async task; mark slow if it takes longer than `slowAfterMs`. */
export async function withSlowGuard<T>(
  task: () => Promise<T>,
  setSlow: (v: boolean) => void,
  slowAfterMs = 8000
): Promise<T> {
  setSlow(false);
  const timer = setTimeout(() => setSlow(true), slowAfterMs);
  try {
    return await task();
  } finally {
    clearTimeout(timer);
    setSlow(false);
  }
}
