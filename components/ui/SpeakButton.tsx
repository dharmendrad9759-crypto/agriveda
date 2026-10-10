import { Volume2 } from "lucide-react";
import { speakFarmerText, stopFarmerSpeech } from "@/lib/speech/farmerVoice";

export function speakFarmer(text: string, hi: boolean) {
  const line = text.replace(/\s+/g, " ").trim();
  if (!line) return;
  speakFarmerText(line, hi);
}

export default function SpeakButton({
  text,
  hi,
}: {
  text: string;
  hi: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        speakFarmer(text, hi);
      }}
      aria-label={hi ? "सुनें" : "Listen"}
      className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-[#D0DDD7] bg-[var(--av-surface)] px-3 text-[13px] font-bold text-[#0B6B45]"
    >
      <Volume2 className="h-4 w-4" />
      {hi ? "सुनें" : "Listen"}
    </button>
  );
}
