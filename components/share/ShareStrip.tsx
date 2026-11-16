"use client";

import { PLAY_STORE_URL, PUBLIC_APP_URL } from "@/lib/appMeta";

export default function ShareStrip({
  text,
  downloadName,
  onDownload,
}: {
  text: string;
  downloadName?: string;
  onDownload?: () => void;
}) {
  const share = async () => {
    const payload = `${text}\n${PUBLIC_APP_URL}\nPlay: ${PLAY_STORE_URL}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: payload });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard?.writeText(payload);
  };

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void share()}
          className="flex-1 rounded-xl border border-emerald-700 py-2 text-[12px] font-black text-emerald-900"
        >
          शेयर
        </button>
        {onDownload ? (
          <button
            type="button"
            onClick={onDownload}
            className="flex-1 rounded-xl bg-emerald-800 py-2 text-[12px] font-black text-white"
          >
            {downloadName || "फोटो डाउनलोड"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
