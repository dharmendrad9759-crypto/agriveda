"use client";

import { useEffect } from "react";
import { AV } from "@/lib/design/tokens";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error?.digest || error?.message);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--av-accent)]">Agriveda</p>
      <h1 className="mt-2 text-xl font-extrabold text-[var(--av-text-primary)]">
        कुछ गलत हो गया
      </h1>
      <p className="mt-2 text-sm text-[var(--av-text-secondary)]">
        स्क्रीन लोड नहीं हो पाई। दोबारा कोशिश करें — डेटा सुरक्षित है।
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button type="button" onClick={reset} className={AV.btnPrimarySm}>
          फिर से कोशिश
        </button>
        <a href="/" className={AV.btnSecondarySm}>
          होम पर जाएँ
        </a>
      </div>
    </div>
  );
}
