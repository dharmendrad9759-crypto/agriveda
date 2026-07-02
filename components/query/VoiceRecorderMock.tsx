"use client";

import { useState } from "react";
import { Mic, Square } from "lucide-react";

interface VoiceRecorderMockProps {
  onRecorded?: () => void;
}

export default function VoiceRecorderMock({ onRecorded }: VoiceRecorderMockProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
      onRecorded?.();
    } else {
      setIsRecording(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${
        isRecording
          ? "border-red-300 bg-red-50 text-red-600"
          : hasRecording
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : "border-gray-200 bg-white text-[#2D8A5B] hover:border-emerald-200 hover:bg-emerald-50/50"
      }`}
    >
      {isRecording ? (
        <>
          <Square className="h-4 w-4 fill-current" />
          Stop recording (0:08)
        </>
      ) : hasRecording ? (
        <>
          <Mic className="h-4 w-4" />
          Voice note added — tap to re-record
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Add voice note
        </>
      )}
    </button>
  );
}
