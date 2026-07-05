// app/layout.tsx
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export const metadata = {
  title: "Agriveda - Smart Farm Advisory",
  description:
    "सटीक स्टेज-वाइज फर्टिगेशन, एडवांस्ड स्प्रे शेड्यूल और स्मार्ट रोग प्रबंधन प्लेटफॉर्म",
  applicationName: "Agriveda",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriVeda",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#006432",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("agriveda-theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");var l=localStorage.getItem("agriveda-app-locale");if(!l){l=localStorage.getItem("agriveda-translate-lang");}document.documentElement.lang=l==="hi"?"hi":"en";}catch(e){document.documentElement.setAttribute("data-theme","light");document.documentElement.lang="en";}})();`,
          }}
        />
      </head>
      <body
        className="antialiased flex flex-col min-h-screen"
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
