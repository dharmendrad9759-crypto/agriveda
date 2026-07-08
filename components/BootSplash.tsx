"use client";

import { useEffect, useState } from "react";

/** Loading overlay — hidden via React state (never imperative DOM remove). */
export default function BootSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setVisible(false);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="agriveda-boot"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[99998] flex flex-col items-center justify-center gap-3 bg-[#030712] text-[#f1f5f9]"
    >
      <h1 className="m-0 text-[26px] font-extrabold">Agriveda</h1>
      <div className="spinner h-9 w-9 rounded-full border-[3px] border-white/20 border-t-emerald-400 animate-spin" aria-hidden />
      <p className="m-0 text-sm opacity-90">Loading...</p>
    </div>
  );
}
