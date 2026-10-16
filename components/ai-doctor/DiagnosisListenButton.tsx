"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { isHindiLocale } from "@/lib/i18n/farmer-ui";
import { cn } from "@/lib/cn";
import { speakFarmerText, stopFarmerSpeech, warmFarmerVoices } from "@/lib/speech/farmerVoice";
import { Volume2, Square } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Props {
  text: string;
  className?: string;
}

export default function DiagnosisListenButton({ text, className }: Props) {
  const { locale } = useLocale();
  const hi = isHindiLocale(locale);
  const [speaking, setSpeaking] = useState(false);

  const stop = useCallback(() => {
    stopFarmerSpeech();
    setSpeaking(false);
  }, []);

  useEffect(() => {
    warmFarmerVoices();
    return () => stop();
  }, [stop]);

  const toggle = () => {
    if (!text.trim()) return;
    if (speaking) {
      stop();
      return;
    }
    setSpeaking(true);
    speakFarmerText(text, hi, () => setSpeaking(false));
  };

  const replay = () => {
    stop();
    setTimeout(() => {
      setSpeaking(true);
      speakFarmerText(text, hi, () => setSpeaking(false));
    }, 100);
  };

  if (!text.trim()) return null;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800 transition active:scale-95 hover:bg-emerald-100 dark:border-emerald-600/40 dark:bg-emerald-950/60 dark:text-emerald-200",
          className
        )}
      >
        <Volume2 className={`h-4 w-4 ${speaking ? "text-emerald-600 animate-pulse" : ""}`} />
        <span>{speaking ? (hi ? "आवाज़ चल रही है" : "Speaking…") : (hi ? "सुनें" : "Listen")}</span>
      </button>

      {/* Floating Bottom Mini-Player when Speaking */}
      {speaking && (
        <div className="fixed bottom-20 inset-x-4 z-50 mx-auto max-w-sm rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur-md animate-fade-in">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white animate-pulse">
                <Volume2 className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate">
                  {hi ? "रिपोर्ट सुनाई जा रही है" : "Playing Diagnosis Audio"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <p className="text-[10px] text-emerald-300 font-semibold truncate">
                    {hi ? "रोग व दवा की पूरी जानकारी" : "Disease & chemical guidance"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={replay}
                className="rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-700"
              >
                {hi ? "दोबारा" : "Replay"}
              </button>
              <button
                type="button"
                onClick={stop}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                aria-label="बंद करें"
              >
                <Square className="h-3 w-3 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
