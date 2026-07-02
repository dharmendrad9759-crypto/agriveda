"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerBarProps {
  duration: string;
}

export default function AudioPlayerBar({ duration }: AudioPlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = 35;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5">
      <button
        type="button"
        onClick={() => setIsPlaying(!isPlaying)}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#006432] text-white transition-transform active:scale-95"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
      </button>

      <div className="flex flex-1 items-center gap-2">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-emerald-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#006432] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-gray-600 tabular-nums">
          0:00 / {duration}
        </span>
      </div>
    </div>
  );
}
