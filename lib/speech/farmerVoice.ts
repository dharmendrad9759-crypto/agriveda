/**
 * Browser TTS — natural fluent Hindi/English voice when available.
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

function allVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

function scoreVoice(voice: SpeechSynthesisVoice, hi: boolean): number {
  const blob = `${voice.name} ${voice.voiceURI} ${voice.lang}`.toLowerCase();
  let score = 0;

  if (hi && voice.lang.toLowerCase().startsWith("hi")) score += 35;
  if (!hi && voice.lang.toLowerCase().startsWith("en")) score += 35;

  // Prefer cloud / neural voices — usually more fluent
  if (/natural|neural|premium|wavenet|online/i.test(blob)) score += 50;
  if (/google/i.test(blob)) score += 28;
  if (!voice.localService) score += 12;

  if (FEMALE_HINT.test(blob)) score += 12;
  if (MALE_HINT.test(blob)) score -= 50;

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
  const pool = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
  const candidates = pool.length ? pool : voices;

  return [...candidates].sort((a, b) => scoreVoice(b, hi) - scoreVoice(a, hi))[0] ?? null;
}

export function warmFarmerVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  allVoices();
  if (!voicesReady) {
    const onChange = () => {
      voicesReady = allVoices().length > 0;
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    onChange();
  }
}

export function speakFarmerText(
  text: string,
  hi: boolean,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis || !text.trim()) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickFarmerVoice(hi);

  utterance.lang = hi ? "hi-IN" : "en-IN";
  if (voice) utterance.voice = voice;

  // Normal speed + natural pitch — browser default sounds most fluent
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopFarmerSpeech(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
