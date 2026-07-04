export interface TranslateLanguage {
  code: string;
  label: string;
  /** Google Translate code (Haryanvi/Rajasthani use Hindi) */
  googleCode: string;
  note?: string;
}

/** App UI stays English; these languages are applied via Google Translate. */
export const TRANSLATE_LANGUAGES: TranslateLanguage[] = [
  { code: "en", label: "English", googleCode: "en" },
  { code: "hi", label: "Hindi", googleCode: "hi" },
  { code: "pa", label: "Punjabi", googleCode: "pa" },
  { code: "gu", label: "Gujarati", googleCode: "gu" },
  { code: "mr", label: "Marathi", googleCode: "mr" },
  {
    code: "raj",
    label: "Rajasthani",
    googleCode: "hi",
    note: "Shown via Hindi (closest supported)",
  },
  {
    code: "bgc",
    label: "Haryanvi",
    googleCode: "hi",
    note: "Shown via Hindi (closest supported)",
  },
  { code: "bn", label: "Bengali", googleCode: "bn" },
  { code: "ta", label: "Tamil", googleCode: "ta" },
  { code: "te", label: "Telugu", googleCode: "te" },
  { code: "kn", label: "Kannada", googleCode: "kn" },
  { code: "ml", label: "Malayalam", googleCode: "ml" },
  { code: "or", label: "Odia", googleCode: "or" },
  { code: "ur", label: "Urdu", googleCode: "ur" },
];

const STORAGE_KEY = "agriveda-translate-lang";

export function getSavedTranslateCode(): string {
  if (typeof window === "undefined") return "en";
  try {
    return localStorage.getItem(STORAGE_KEY) || "en";
  } catch {
    return "en";
  }
}

export function saveTranslateCode(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  const host = window.location.hostname;
  if (host && host !== "localhost") {
    document.cookie = `${name}=${value}; expires=${expires}; path=/; domain=${host}`;
  }
}

function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  const host = window.location.hostname;
  if (host && host !== "localhost") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host}`;
  }
}

/** Apply Google Translate for the whole page (reload required). */
export function applyPageTranslation(lang: TranslateLanguage): void {
  saveTranslateCode(lang.code);

  if (lang.googleCode === "en") {
    clearCookie("googtrans");
    clearCookie("googtrans");
    window.location.reload();
    return;
  }

  const value = `/en/${lang.googleCode}`;
  setCookie("googtrans", value);
  window.location.reload();
}
