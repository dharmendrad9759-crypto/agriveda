import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/client";

function isNativeShell(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
    .Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

export function firebaseAuthError(err: unknown): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code: string }).code)
      : "";

  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Google login रद्द कर दिया गया।";
  }
  if (code === "auth/popup-blocked") {
    return "Popup block हो गया — browser में popup allow करें, या page refresh करके फिर कोशिश करें।";
  }
  if (code === "auth/unauthorized-domain") {
    return "यह domain Firebase में authorized नहीं — Console → Authentication → Settings → Authorized domains में Vercel domain जोड़ें।";
  }
  if (code === "auth/operation-not-allowed") {
    return "Firebase में Google Sign-in Enable नहीं है — Authentication → Sign-in method → Google → Enable।";
  }
  if (code === "auth/network-request-failed") {
    return "Internet समस्या — कनेक्शन चेक करके फिर कोशिश करें।";
  }
  if (err instanceof Error && err.message) return err.message;
  return "Google login में समस्या। Firebase Console settings चेक करें।";
}

function googleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope("email");
  provider.addScope("profile");
  return provider;
}

/**
 * Start Google sign-in.
 * - Browser: popup
 * - Capacitor/Android WebView: redirect (popup often blocked)
 * Returns null when redirect was started (page will reload).
 */
export async function signInWithGoogle(): Promise<User | null> {
  const auth = getAuth(getFirebaseApp());
  const provider = googleProvider();

  if (isNativeShell()) {
    await signInWithRedirect(auth, provider);
    return null;
  }

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code: string }).code)
        : "";
    // Fallback if popup blocked
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw new Error(firebaseAuthError(err));
  }
}

/** Call on app load — completes redirect-based Google sign-in if any. */
export async function completeGoogleRedirectIfAny(): Promise<User | null> {
  try {
    const auth = getAuth(getFirebaseApp());
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch (err) {
    throw new Error(firebaseAuthError(err));
  }
}
