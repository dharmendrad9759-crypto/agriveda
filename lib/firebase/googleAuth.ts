import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  indexedDBLocalPersistence,
  initializeAuth,
  signInWithCredential,
  signInWithPopup,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/client";

let cachedAuth: Auth | null = null;

/** On Capacitor, IndexedDB persistence keeps the JS user signed in across restarts. */
function getFirebaseAuth(): Auth {
  if (cachedAuth) return cachedAuth;
  const app = getFirebaseApp();
  if (Capacitor.isNativePlatform()) {
    try {
      cachedAuth = initializeAuth(app, { persistence: indexedDBLocalPersistence });
    } catch {
      cachedAuth = getAuth(app);
    }
  } else {
    cachedAuth = getAuth(app);
  }
  return cachedAuth;
}

export function firebaseAuthError(err: unknown): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code: string }).code)
      : "";
  const message =
    err instanceof Error
      ? err.message
      : typeof err === "object" && err !== null && "message" in err
        ? String((err as { message: string }).message)
        : "";

  if (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request" ||
    /cancel|canceled|cancelled/i.test(code) ||
    /cancel|canceled|cancelled/i.test(message)
  ) {
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
  if (/google-services|DEVELOPER_ERROR|10:|ApiException: 10/i.test(message)) {
    return "Android Google Sign-In setup अधूरा है — google-services.json और SHA-1 Firebase में जोड़ें।";
  }
  if (/no credentials? available|NoCredentialException|cannot find a matching credential/i.test(message)) {
    return "Google खाता नहीं मिला। फोन में Gmail login करें, फिर ऐप फिर से खोलकर Google से लॉगिन करें। अगर फिर भी न चले तो Firebase में SHA-1 जोड़ें।";
  }
  if (message) return message;
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
 * Native Android: only collect Google idToken — session is created on Agriveda server
 * (avoids Firebase JS auth/network-request-failed inside Capacitor WebView).
 */
export async function getNativeGoogleIdToken(): Promise<{
  googleIdToken: string;
  displayName: string | null;
  email: string | null;
}> {
  try {
    const result = await FirebaseAuthentication.signInWithGoogle({
      skipNativeAuth: true,
      useCredentialManager: false,
    });
    const googleIdToken = result.credential?.idToken;
    if (!googleIdToken) {
      throw new Error(
        "Google idToken नहीं मिला — android/app/google-services.json और Firebase SHA-1 चेक करें।"
      );
    }
    return {
      googleIdToken,
      displayName: result.user?.displayName ?? null,
      email: result.user?.email ?? null,
    };
  } catch (err) {
    throw new Error(firebaseAuthError(err));
  }
}

/**
 * Native: OS account picker (phone की Gmail) — Chrome नहीं खुलता।
 * Web: popup.
 *
 * Prefer getNativeGoogleIdToken() + /api/auth/session/firebase on Capacitor.
 * This path still uses Firebase JS (web / legacy).
 *
 * NOTE: Android Credential Manager often fails with "No credentials available"
 * even when a Google account exists (SHA/JSON ok). Legacy Google Sign-In Intent
 * shows the picker reliably — so useCredentialManager: false on native.
 */
export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();

  if (Capacitor.isNativePlatform()) {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle({
        skipNativeAuth: true,
        useCredentialManager: false,
      });
      const idToken = result.credential?.idToken;
      if (!idToken) {
        throw new Error(
          "Google idToken नहीं मिला — android/app/google-services.json और Firebase SHA-1 चेक करें।"
        );
      }
      const credential = GoogleAuthProvider.credential(idToken);
      const cred = await signInWithCredential(auth, credential);
      return cred.user;
    } catch (err) {
      throw new Error(firebaseAuthError(err));
    }
  }

  try {
    const result = await signInWithPopup(auth, googleProvider());
    return result.user;
  } catch (err) {
    throw new Error(firebaseAuthError(err));
  }
}

/** Leftover web redirect completion only. Native no longer uses redirect/Chrome. */
export async function completeGoogleRedirectIfAny(): Promise<User | null> {
  if (Capacitor.isNativePlatform()) return null;
  try {
    const auth = getFirebaseAuth();
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch (err) {
    throw new Error(firebaseAuthError(err));
  }
}
