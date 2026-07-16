/** Soft haptic feedback — works on Android WebView / modern browsers */
export function softTap(ms = 12) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(ms);
    }
  } catch {
    /* ignore */
  }
}

export async function shareAgriveda() {
  const url =
    typeof window !== "undefined" ? window.location.origin : "https://agriveda-theta.vercel.app";
  const data = {
    title: "Agriveda",
    text: "खेत की बुद्धि — Agriveda Smart Farm Advisory",
    url,
  };
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share(data);
      return true;
    }
  } catch {
    /* user cancelled or share failed */
  }
  try {
    await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
    return "copied" as const;
  } catch {
    return false;
  }
}
