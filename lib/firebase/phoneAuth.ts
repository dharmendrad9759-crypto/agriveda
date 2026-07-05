import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/client";

const RECAPTCHA_CONTAINER_ID = "firebase-recaptcha-container";

let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

function firebaseAuthError(err: unknown): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code: string }).code)
      : "";

  if (code === "auth/invalid-phone-number") {
    return "मोबाइल नंबर गलत है। 10 अंकों का सही नंबर डालें।";
  }
  if (code === "auth/too-many-requests") {
    return "बहुत ज़्यादा कोशिश। थोड़ी देर बाद फिर करें।";
  }
  if (code === "auth/invalid-verification-code") {
    return "OTP गलत है। फिर से कोशिश करें।";
  }
  if (code === "auth/code-expired") {
    return "OTP expire हो गया। नया OTP भेजें।";
  }
  if (code === "auth/captcha-check-failed") {
    return "reCAPTCHA fail। Page refresh करके फिर कोशिश करें।";
  }
  if (err instanceof Error && err.message) return err.message;
  return "Firebase OTP में समस्या। Firebase Console settings check करें।";
}

async function getRecaptchaVerifier(): Promise<RecaptchaVerifier> {
  const auth = getAuth(getFirebaseApp());

  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      /* ignore */
    }
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, {
    size: "invisible",
  });

  await recaptchaVerifier.render();
  return recaptchaVerifier;
}

/** Send OTP via Firebase Phone Auth (+91 India). */
export async function sendFirebasePhoneOtp(phone10: string): Promise<void> {
  const digits = phone10.replace(/\D/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(digits)) {
    throw new Error("सही 10 अंकों का मोबाइल नंबर डालें");
  }

  const auth = getAuth(getFirebaseApp());
  const verifier = await getRecaptchaVerifier();
  confirmationResult = await signInWithPhoneNumber(auth, `+91${digits}`, verifier);
}

/** Confirm OTP and sign in Firebase user. */
export async function verifyFirebasePhoneOtp(otp: string): Promise<User> {
  if (!confirmationResult) {
    throw new Error("पहले OTP भेजें");
  }

  try {
    const result = await confirmationResult.confirm(otp.trim());
    return result.user;
  } catch (err) {
    throw new Error(firebaseAuthError(err));
  }
}

export { RECAPTCHA_CONTAINER_ID, firebaseAuthError };
