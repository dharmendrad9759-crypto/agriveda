import type { NextConfig } from "next";
import os from "os";

/** Hostnames allowed to load Next.js dev assets (phone / Capacitor WebView). */
function lanDevOrigins(): string[] {
  const origins = new Set<string>(["localhost", "127.0.0.1"]);

  for (const nets of Object.values(os.networkInterfaces())) {
    for (const net of nets ?? []) {
      if (net.family === "IPv4" && !net.internal) origins.add(net.address);
    }
  }

  const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();
  if (serverUrl) {
    try {
      origins.add(new URL(serverUrl).hostname);
    } catch {
      /* ignore invalid URL */
    }
  }

  return [...origins];
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://www.gstatic.com https://www.google.com https://www.googleapis.com https://*.firebaseapp.com https://*.firebase.com",
      "style-src 'self' 'unsafe-inline' https://www.gstatic.com https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https://www.google.com https://*.firebaseapp.com https://translate.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: lanDevOrigins(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
