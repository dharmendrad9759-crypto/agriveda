"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

type RecorderState = "idle" | "recording" | "recorded";

interface VoiceRecorderMockProps {
  onRecorded?: () => void;
}

export default function VoiceRecorderMock({ onRecorded }: VoiceRecorderMockProps) {
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
        Add voice note
      </button>
    );
  }

  if (state === "recording") {
    return (
      <div className="overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-bold text-red-400">Recording audio...</span>
          </div>
          <span className="font-mono text-sm font-bold text-red-300 tabular-nums">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="mt-4 flex h-12 items-end justify-center gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-red-600 to-red-400 wave-bar"
              style={{
                height: `${20 + ((Math.sin(i * 0.7) + 1) / 2) * 80}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={stopRecording}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 py-2.5 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/30"
        >
          <Square className="h-4 w-4 fill-current" />
          Stop recording
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-400">Voice note ready</p>
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

        <div className="flex flex-1 items-end gap-0.5 h-8">
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
          Re-record
        </button>
        <button
          type="button"
          onClick={deleteRecording}
          className="flex items-center gap-1 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
