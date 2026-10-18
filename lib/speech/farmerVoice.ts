/**
 * Authoritative Browser TTS — natural fluent Hindi/English voice.
 * Provides Dual-Engine architecture:
 * 1. Native Web SpeechSynthesis when real Hindi voice exists
 * 2. High-fidelity streamed MP3 audio via /api/tts when Hindi voice is missing (Windows, WebView, etc.)
 * 3. Reactive state subscription for SpeakButton & DiagnosisListenButton
 */

const FEMALE_HINT =
  /female|woman|swara|kalpana|lekha|heera|sapna|neerja|google.*hindi|हिन्दी|hindi.*india/i;
const MALE_HINT = /\bmale\b|\bman\b|\bravi\b|\bmadhur\b|\bdavid\b|\bmark\b|\bjames\b/i;

const VOICE_PRIORITY: RegExp[] = [
  /natural|neural|premium|wavenet|online/i,
  /google.*hindi/i,
  /google.*हिन्दी/i,
  /microsoft.*swara/i,
  /\bswara\b/i,
  /microsoft.*kalpana/i,
  /\bkalpana\b/i,
  /hi-in.*female/i,
  /hi-in/i,
];

let voicesReady = false;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeAudio: HTMLAudioElement | null = null;
let watchdogTimer: any = null;
let queueChunks: string[] = [];
let queueIndex = 0;
let queueIsHi = true;
let queueOnEnd: (() => void) | null = null;

let isCurrentlySpeaking = false;
const speechListeners: Set<(speaking: boolean) => void> = new Set();

function setSpeaking(val: boolean) {
  if (isCurrentlySpeaking !== val) {
    isCurrentlySpeaking = val;
    speechListeners.forEach((cb) => {
      try {
        cb(val);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

export function isFarmerSpeaking(): boolean {
  return isCurrentlySpeaking;
}

export function onFarmerSpeechChange(callback: (speaking: boolean) => void): () => void {
  speechListeners.add(callback);
  return () => {
    speechListeners.delete(callback);
  };
}

function allVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  try {
    return window.speechSynthesis.getVoices() || [];
  } catch {
    return [];
  }
}

export function hasNativeHindiVoice(): boolean {
  const voices = allVoices();
  return voices.some(
    (v) =>
      v.lang.toLowerCase().startsWith("hi") ||
      /hindi|swara|kalpana|lekha|heera|sapna|neerja/i.test(v.name)
  );
}

function scoreVoice(voice: SpeechSynthesisVoice, hi: boolean): number {
  const blob = `${voice.name} ${voice.voiceURI} ${voice.lang}`.toLowerCase();
  let score = 0;

  if (hi && (voice.lang.toLowerCase().startsWith("hi") || /hindi/i.test(blob))) score += 45;
  if (!hi && voice.lang.toLowerCase().startsWith("en")) score += 35;

  if (/natural|neural|premium|wavenet|online/i.test(blob)) score += 50;
  if (/google/i.test(blob)) score += 30;
  if (!voice.localService) score += 15;

  if (FEMALE_HINT.test(blob)) score += 15;
  if (MALE_HINT.test(blob)) score -= 40;

  for (let i = 0; i < VOICE_PRIORITY.length; i++) {
    if (VOICE_PRIORITY[i]!.test(blob)) {
      score += 24 - i * 2;
      break;
    }
  }

  return score;
}

export function pickFarmerVoice(hi: boolean): SpeechSynthesisVoice | null {
  const voices = allVoices();
  if (!voices.length) return null;

  const langPrefix = hi ? "hi" : "en";
  const pool = voices.filter(
    (v) => v.lang.toLowerCase().startsWith(langPrefix) || (hi && /hindi/i.test(v.name))
  );
  const candidates = pool.length ? pool : voices;

  return [...candidates].sort((a, b) => scoreVoice(b, hi) - scoreVoice(a, hi))[0] ?? null;
}

export function warmFarmerVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    allVoices();
    if (!voicesReady) {
      const onChange = () => {
        voicesReady = allVoices().length > 0;
      };
      window.speechSynthesis.addEventListener("voiceschanged", onChange);
      onChange();
    }
  } catch {
    /* ignore */
  }
}

/** Split long text into natural sentences (100–160 chars max) for reliable browser playback */
function splitIntoSpokenChunks(text: string): string[] {
  const cleaned = text.replace(/[*_#`]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const rawParts = cleaned.split(/(?<=[।?!.\n])\s+/);
  const chunks: string[] = [];

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.length <= 160) {
      chunks.push(trimmed);
    } else {
      const subParts = trimmed.split(/(?<=[,;])\s+/);
      for (const sub of subParts) {
        if (sub.length <= 160) {
          chunks.push(sub.trim());
        } else {
          const words = sub.split(" ");
          let buf = "";
          for (const w of words) {
            if ((buf + " " + w).length > 150) {
              if (buf) chunks.push(buf.trim());
              buf = w;
            } else {
              buf = buf ? `${buf} ${w}` : w;
            }
          }
          if (buf.trim()) chunks.push(buf.trim());
        }
      }
    }
  }

  return chunks.filter(Boolean);
}

function stopWatchdog(): void {
  if (watchdogTimer) {
    clearInterval(watchdogTimer);
    watchdogTimer = null;
  }
}

function startWatchdog(): void {
  stopWatchdog();
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  watchdogTimer = setInterval(() => {
    try {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    } catch {
      /* ignore */
    }
  }, 10000);
}

function playNextAudioChunk(): void {
  if (typeof window === "undefined") {
    stopFarmerSpeech();
    return;
  }

  if (queueIndex >= queueChunks.length) {
    const finishCb = queueOnEnd;
    stopFarmerSpeech();
    finishCb?.();
    return;
  }

  const chunk = queueChunks[queueIndex];
  queueIndex += 1;

  const primaryUrl = `/api/tts?text=${encodeURIComponent(chunk)}&lang=${queueIsHi ? "hi" : "en"}`;
  const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${
    queueIsHi ? "hi" : "en"
  }&client=tw-ob&q=${encodeURIComponent(chunk)}`;

  const audio = new Audio(primaryUrl);
  activeAudio = audio;

  audio.onended = () => {
    if (activeAudio === audio) {
      setTimeout(() => playNextAudioChunk(), 50);
    }
  };

  audio.onerror = () => {
    // If local endpoint fails, fallback to direct Google TTS URL
    const fallbackAudio = new Audio(directUrl);
    activeAudio = fallbackAudio;
    fallbackAudio.onended = () => {
      if (activeAudio === fallbackAudio) {
        setTimeout(() => playNextAudioChunk(), 50);
      }
    };
    fallbackAudio.onerror = () => {
      setTimeout(() => playNextAudioChunk(), 50);
    };
    fallbackAudio.play().catch(() => {
      setTimeout(() => playNextAudioChunk(), 50);
    });
  };

  audio.play().catch(() => {
    // Fallback on play error
    const fallbackAudio = new Audio(directUrl);
    activeAudio = fallbackAudio;
    fallbackAudio.onended = () => {
      if (activeAudio === fallbackAudio) {
        setTimeout(() => playNextAudioChunk(), 50);
      }
    };
    fallbackAudio.play().catch(() => {
      stopFarmerSpeech();
    });
  });
}

function playNextChunk(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    playNextAudioChunk();
    return;
  }

  if (queueIndex >= queueChunks.length) {
    const finishCb = queueOnEnd;
    stopFarmerSpeech();
    finishCb?.();
    return;
  }

  const chunk = queueChunks[queueIndex];
  queueIndex += 1;

  try {
    const utterance = new SpeechSynthesisUtterance(chunk);
    activeUtterance = utterance;
    if (typeof window !== "undefined") {
      (window as any).__agrivedaUtterance = utterance;
    }

    const voice = pickFarmerVoice(queueIsHi);
    utterance.lang = voice?.lang || (queueIsHi ? "hi-IN" : "en-IN");
    if (voice) utterance.voice = voice;

    utterance.rate = 0.96;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setTimeout(() => playNextChunk(), 40);
    };

    utterance.onerror = (e) => {
      if (e?.error === "interrupted" || e?.error === "canceled") {
        return;
      }
      console.warn("SpeechSynthesis error, falling back to audio:", e?.error);
      stopWatchdog();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* ignore */
        }
      }
      // Revert chunk index by 1 so the audio stream plays this sentence
      queueIndex = Math.max(0, queueIndex - 1);
      playNextAudioChunk();
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("SpeechSynthesis error, falling back to audio:", err);
    queueIndex = Math.max(0, queueIndex - 1);
    playNextAudioChunk();
  }
}

export function speakFarmerText(
  text: string,
  hi: boolean,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined" || !text.trim()) return false;

  stopFarmerSpeech();

  const chunks = splitIntoSpokenChunks(text);
  if (!chunks.length) return false;

  queueChunks = chunks;
  queueIndex = 0;
  queueIsHi = hi;
  queueOnEnd = onEnd ?? null;
  setSpeaking(true);

  // If Hindi requested, check if browser has a real native Hindi voice.
  // When no Hindi voice exists (Windows SAPI, missing mobile speech data),
  // immediately stream audio for flawless, crystal-clear Hindi pronunciation.
  const hasHiVoice = hasNativeHindiVoice();

  if (hi && !hasHiVoice) {
    playNextAudioChunk();
    return true;
  }

  if (window.speechSynthesis) {
    startWatchdog();
    playNextChunk();
    return true;
  }

  playNextAudioChunk();
  return true;
}

export function stopFarmerSpeech(): void {
  stopWatchdog();
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      /* ignore */
    }
    activeAudio = null;
  }
  queueChunks = [];
  queueIndex = 0;
  activeUtterance = null;
  if (typeof window !== "undefined") {
    (window as any).__agrivedaUtterance = null;
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    }
  }
  setSpeaking(false);
}
