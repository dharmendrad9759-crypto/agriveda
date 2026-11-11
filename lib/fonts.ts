import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";

/** Hindi UI — matras stay intact (no size-adjust fallback). */
export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-noto-sans",
});

/** Display titles and measured-area numerals. */
export const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["600", "700"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-noto-serif",
});
