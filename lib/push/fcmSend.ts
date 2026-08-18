/**
 * FCM HTTP v1 send — optional.
 * Needs FIREBASE_SERVICE_ACCOUNT_JSON (full service-account JSON string)
 * and NEXT_PUBLIC_FIREBASE_PROJECT_ID.
 */
import { createSign } from "crypto";

type ServiceAccount = {
  client_email: string;
  private_key: string;
  project_id?: string;
};

let cachedToken: { accessToken: string; expMs: number } | null = null;

function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    if (!parsed.client_email || !parsed.private_key) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isFcmSendConfigured(): boolean {
  return Boolean(readServiceAccount() && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim());
}

function b64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf.toString("base64url");
}

async function getAccessToken(sa: ServiceAccount): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && cachedToken.expMs > now + 60_000) return cachedToken.accessToken;

  const iat = Math.floor(now / 1000);
  const exp = iat + 3600;
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat,
      exp,
    })
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(sa.private_key.replace(/\\n/g, "\n"), "base64url");
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    console.error("[fcm] token", await res.text());
    return null;
  }
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) return null;
  cachedToken = {
    accessToken: json.access_token,
    expMs: now + (json.expires_in ?? 3600) * 1000,
  };
  return json.access_token;
}

export async function sendFcmToToken(input: {
  token: string;
  title: string;
  body: string;
  href?: string;
}): Promise<boolean> {
  const sa = readServiceAccount();
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || sa?.project_id?.trim();
  if (!sa || !projectId || !input.token) return false;

  const accessToken = await getAccessToken(sa);
  if (!accessToken) return false;

  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token: input.token,
          notification: {
            title: input.title.slice(0, 120),
            body: input.body.slice(0, 240),
          },
          data: {
            href: input.href || "/",
          },
          android: {
            priority: "HIGH",
          },
        },
      }),
    }
  );

  if (!res.ok) {
    console.error("[fcm] send", await res.text());
    return false;
  }
  return true;
}

/** Approx km between two WGS84 points */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
