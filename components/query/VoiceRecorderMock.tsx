"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/LocaleProvider";

type RecorderState = "idle" | "recording" | "recorded";

interface VoiceRecorderMockProps {
  onRecorded?: () => void;
}

export default function VoiceRecorderMock({ onRecorded }: VoiceRecorderMockProps) {
  const { t } = useLocale();
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === "recording") {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const startRecording = () => {
    setSeconds(0);
    setState("recording");
    setIsPlaying(false);
  };

  const stopRecording = () => {
    setState("recorded");
    onRecorded?.();
  };

  const deleteRecording = () => {
    setState("idle");
    setSeconds(0);
    setIsPlaying(false);
  };

  if (state === "idle") {
    return (
      <button
        type="button"
        onClick={startRecording}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3.5 text-sm font-bold text-emerald-400 transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:shadow-[0_0_16px_rgba(0,255,136,0.15)]"
      >
        <Mic className="h-4 w-4" />
        {t("voiceAddNote")}
      </button>
    );
  }

  if (state === "recording") {
    return (
      <div
        className="overflow-hidden rounded-2xl border-2 border-red-500/50 bg-red-500/10 p-4 shadow-[0_0_24px_rgba(239,68,68,0.2)]"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
            </span>
            <div>
              <span className="block text-sm font-black text-red-500">{t("voiceRecording")}</span>
              <span className="text-[10px] font-semibold text-red-400/90">{t("voiceListening")}</span>
            </div>
          </div>
          <span className="font-mono text-sm font-bold text-red-300 tabular-nums">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="mt-4 flex h-14 items-end justify-center gap-1">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-red-700 to-red-400 wave-bar"
              style={{
                height: `${24 + ((Math.sin(i * 0.65 + seconds * 0.4) + 1) / 2) * 76}%`,
                animationDelay: `${i * 0.04}s`,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={stopRecording}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-black text-white transition-colors hover:bg-red-500"
        >
          <Square className="h-4 w-4 fill-current" />
          {t("voiceStop")}
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-400">{t("voiceReady")}</p>
        <span className="font-mono text-xs text-emerald-400/70 tabular-nums">
          {formatTime(seconds || 8)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 transition-all",
            isPlaying && "animate-pulse-glow bg-emerald-500/30"
          )}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>

        <div className="flex h-8 flex-1 items-end gap-0.5">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-full bg-emerald-500/40 transition-all",
                isPlaying && i < 18 ? "bg-emerald-400" : "bg-emerald-500/20"
              )}
              style={{ height: `${30 + (Math.sin(i * 0.5) + 1) * 35}%` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={startRecording}
          className="flex-1 rounded-xl border border-emerald-500/20 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10"
        >
          {t("voiceRerecord")}
        </button>
        <button
          type="button"
          onClick={deleteRecording}
          className="flex items-center gap-1 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t("voiceDelete")}
        </button>
      </div>
    </div>
  );
}
