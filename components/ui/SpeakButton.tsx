"use client";

import { Volume2, Square } from "lucide-react";
import {
  speakFarmerText,
  stopFarmerSpeech,
  isFarmerSpeaking,
  onFarmerSpeechChange,
  warmFarmerVoices,
} from "@/lib/speech/farmerVoice";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function speakFarmer(text: string, hi: boolean, onEnd?: () => void) {
  const line = text.replace(/\s+/g, " ").trim();
  if (!line) return;
  speakFarmerText(line, hi, onEnd);
}

export default function SpeakButton({
  text,
  hi,
  className,
}: {
  text: string;
  hi: boolean;
  className?: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    warmFarmerVoices();
    setSpeaking(isFarmerSpeaking());
    const unsubscribe = onFarmerSpeechChange((isSpeaking) => {
      setSpeaking(isSpeaking);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (speaking) {
      stopFarmerSpeech();
      return;
    }

    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return;

    speakFarmerText(clean, hi);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={speaking ? (hi ? "आवाज़ बंद करें" : "Stop listening") : (hi ? "सुनें" : "Listen")}
      className={cn(
        "inline-flex min-h-11 sm:min-h-12 items-center gap-2 rounded-xl border px-3 text-[13px] font-black transition-all active:scale-95 shadow-xs",
        speaking
          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30"
          : "border-[#D0DDD7] bg-[var(--av-surface)] text-[#0B6B45] hover:border-emerald-600/50 hover:bg-emerald-50/50",
        className
      )}
    >
      {speaking ? (
        <>
          <span className="relative flex h-3.5 w-3.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <Square className="h-3 w-3 fill-emerald-700 text-emerald-700 dark:fill-emerald-300 dark:text-emerald-300" />
          </span>
          <span className="font-black text-emerald-800 dark:text-emerald-200">
            {hi ? "आवाज़ रोकें" : "Stop"}
          </span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4 text-[#0B6B45]" />
          <span>{hi ? "सुनें" : "Listen"}</span>
        </>
      )}
    </button>
  );
}
