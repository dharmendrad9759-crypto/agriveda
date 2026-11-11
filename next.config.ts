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
      `script-src 'self' 'unsafe-inline'${
        process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"
      } https://translate.google.com https://translate.googleapis.com https://www.gstatic.com https://www.google.com https://www.googleapis.com https://*.firebaseapp.com https://*.firebase.com`,
      "style-src 'self' 'unsafe-inline' https://www.gstatic.com https://fonts.googleapis.com https://unpkg.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.googleusercontent.com https://lh3.googleusercontent.com https://unpkg.com https://mt0.google.com https://mt1.google.com https://mt2.google.com https://mt3.google.com https://server.arcgisonline.com https://*.tile.openstreetmap.org https://*.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.firebaseio.com https://*.firebase.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseinstallations.googleapis.com https://fcm.googleapis.com https://www.google.com https://apis.google.com https://nominatim.openstreetmap.org https://api.open-meteo.com https://geocoding-api.open-meteo.com https://air-quality-api.open-meteo.com https://translate.googleapis.com https://translate.google.com wss://*.firebaseio.com wss://*.googleapis.com",
      "media-src 'self' blob: https://translate.google.com",
      "frame-src 'self' https://www.google.com https://*.firebaseapp.com https://translate.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  allowedDevOrigins: lanDevOrigins(),
  images: {
    formats: ["image/webp"],
    qualities: [45, 50, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/ask",
        destination: "/ask-query",
        permanent: true,
      },
      {
        source: "/expert-chat",
        destination: "/ask-query",
        permanent: true,
      },
      {
        source: "/fertilizer",
        destination: "/services/fertilizer-calculator",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
