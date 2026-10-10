/**
 * Authoritative Browser TTS — natural fluent Hindi/English voice.
 * Solves all known Chromium & Android WebView SpeechSynthesis bugs:
 * 1. Garbage collection (persistent utterance ref)
 * 2. Immediate cancel -> speak race condition (50ms tick)
 * 3. Stuck paused state (explicit resume)
 * 4. Long text cutoff (sentence-by-sentence queue)
 * 5. 14-second Chromium freeze watchdog
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
let watchdogTimer: any = null;
let queueChunks: string[] = [];
let queueIndex = 0;
let queueIsHi = true;
let queueOnEnd: (() => void) | null = null;

function allVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  try {
    return window.speechSynthesis.getVoices() || [];
  } catch {
    return [];
  }
}

function scoreVoice(voice: SpeechSynthesisVoice, hi: boolean): number {
  const blob = `${voice.name} ${voice.voiceURI} ${voice.lang}`.toLowerCase();
  let score = 0;

  if (hi && (voice.lang.toLowerCase().startsWith("hi") || /hindi/i.test(blob))) score += 45;
  if (!hi && voice.lang.toLowerCase().startsWith("en")) score += 35;

  // Prefer cloud / neural voices — usually much more fluent
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

  // Split on Hindi danda '।', periods, question marks, exclamation, semicolons, or newlines
  const rawParts = cleaned.split(/(?<=[।?!.\n])\s+/);
  const chunks: string[] = [];

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.length <= 160) {
      chunks.push(trimmed);
    } else {
      // Split on commas or spaces if sentence is too long
      const subParts = trimmed.split(/(?<=[,;])\s+/);
      for (const sub of subParts) {
        if (sub.length <= 160) {
          chunks.push(sub.trim());
        } else {
          // Hard split on word boundaries
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
  // Chromium pauses speech silently every ~14 seconds. Poking pause/resume keeps it alive.
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

function playNextChunk(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
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

  try {
    const utterance = new SpeechSynthesisUtterance(chunk);
    activeUtterance = utterance;
    if (typeof window !== "undefined") {
      (window as any).__agrivedaUtterance = utterance;
    }

    const voice = pickFarmerVoice(queueIsHi);
    utterance.lang = queueIsHi ? "hi-IN" : "en-IN";
    if (voice) utterance.voice = voice;

    utterance.rate = 0.96;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      // Play next sentence smoothly
      setTimeout(() => playNextChunk(), 40);
    };

    utterance.onerror = (e) => {
      // If user stopped or error occurred, proceed or end
      if (e?.error === "interrupted" || e?.error === "canceled") {
        return;
      }
      setTimeout(() => playNextChunk(), 40);
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("SpeechSynthesis error:", err);
    stopFarmerSpeech();
    queueOnEnd?.();
  }
}

export function speakFarmerText(
  text: string,
  hi: boolean,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis || !text.trim()) return false;

  stopFarmerSpeech();

  const chunks = splitIntoSpokenChunks(text);
  if (!chunks.length) return false;

  queueChunks = chunks;
  queueIndex = 0;
  queueIsHi = hi;
  queueOnEnd = onEnd ?? null;

  startWatchdog();

  // Small 60ms delay after cancel so browser audio thread resets cleanly
  setTimeout(() => {
    playNextChunk();
  }, 60);

  return true;
}

export function stopFarmerSpeech(): void {
  stopWatchdog();
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
}
