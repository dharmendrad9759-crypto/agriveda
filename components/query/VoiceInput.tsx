"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useToast } from "@/components/ui/Toast";
import { AV } from "@/lib/design/tokens";

interface SpeechRecognitionEventLike {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  compact?: boolean;
}

export default function VoiceInput({ onTranscript, className = "", compact }: VoiceInputProps) {
  const { t } = useLocale();
  const { showToast } = useToast();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const w = window as SpeechWindow;
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const w = window as SpeechWindow;
    const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      showToast("Voice input is not supported in this browser", "error");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript?.trim();
      if (text) {
        onTranscript(text);
        showToast("Voice note added ✓");
      }
    };
    recognition.onerror = () => {
      showToast("Mic / voice error — try again", "error");
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [onTranscript, showToast]);

  useEffect(() => () => stop(), [stop]);

  if (!supported) {
    return (
      <p className={`text-[10px] text-[var(--av-text-muted)] ${className}`}>
        Voice typing: Chrome / Edge mobile par best kaam karta hai.
      </p>
    );
  }

  if (listening) {
    return (
      <div className={`rounded-xl border border-red-500/40 bg-red-500/10 p-3 ${className}`}>
        <p className="text-xs font-semibold text-red-600">{t("voiceListening")}</p>
        <button
          type="button"
          onClick={stop}
          className={`mt-2 inline-flex gap-1.5 ${AV.btnSecondarySm} border-red-500/30 text-red-600`}
        >
          <Square className="h-3.5 w-3.5" />
          {t("voiceStop")}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      className={`inline-flex gap-1.5 ${compact ? AV.btnSecondarySm : AV.btnSecondary} ${className}`}
    >
      <Mic className="h-3.5 w-3.5" />
      {t("voiceAddNote")}
    </button>
  );
}
