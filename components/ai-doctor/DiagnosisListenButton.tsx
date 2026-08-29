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

  if (!text.trim()) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-800 transition active:scale-[0.99] dark:text-emerald-200",
        className
      )}
    >
      {speaking ? (
        <>
          <Square className="h-4 w-4 fill-current" />
          {hi ? "रोकें" : "Stop"}
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" />
          {hi ? "सुनें — पूरा जवाब" : "Listen — full answer"}
        </>
      )}
    </button>
  );
}
