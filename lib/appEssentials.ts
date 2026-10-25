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

export function getAgrivedaShareData() {
  const isProd =
    typeof window !== "undefined" &&
    window.location.origin &&
    !window.location.origin.includes("localhost") &&
    !window.location.origin.includes("127.0.0.1") &&
    !window.location.origin.includes("192.168.");
  const url = isProd ? window.location.origin : "https://agriveda-theta.vercel.app";
  const title = "एग्रीवेदा — खेत की बुद्धि";
  const text =
    "🌾 एग्रीवेदा (AgriVeda) — किसान भाइयों के लिए स्मार्ट कृषि ऐप! फसल रोग पहचान, खाद-स्प्रे की सही मात्रा और मंडी भाव।";
  return { title, text, url };
}

export type ShareAgrivedaResult = "native" | "cancelled" | "fallback";

export async function shareAgriveda(): Promise<ShareAgrivedaResult> {
  const { title, text, url } = getAgrivedaShareData();

  // 1. Try Capacitor Native Share first if on mobile native shell
  try {
    if (typeof window !== "undefined") {
      const { Capacitor } = await import("@capacitor/core");
      if (Capacitor.isNativePlatform()) {
        const { Share } = await import("@capacitor/share");
        await Share.share({
          title,
          text: `${text}\n${url}`,
          url,
          dialogTitle: "एग्रीवेदा को और लोगों तक पहुँचाएँ",
        });
        return "native";
      }
    }
  } catch (err: any) {
    const msg = String(err?.message || "").toLowerCase();
    if (
      err?.name === "AbortError" ||
      msg.includes("cancel") ||
      msg.includes("dismiss") ||
      msg.includes("abort")
    ) {
      return "cancelled";
    }
    // else fallback to web share or modal
  }

  // 2. Try Web Share API (mobile Chrome / Safari / supported platforms)
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      const sharePayload = {
        title,
        text: `${text}\n${url}`,
        url,
      };
      if (!navigator.canShare || navigator.canShare(sharePayload)) {
        await navigator.share(sharePayload);
        return "native";
      }
    }
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return "cancelled";
    }
    // failed, fall through to fallback modal
  }

  // 3. Native share unavailable -> request UI to open share options modal
  return "fallback";
}
