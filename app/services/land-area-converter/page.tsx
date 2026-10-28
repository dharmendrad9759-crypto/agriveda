import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import LandAreaConverterClient from "@/components/agriveda2/LandAreaConverterClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ज़मीन नाप कैलकुलेटर (Land Area Converter) — बीघा, एकड़, हेक्टेयर, कट्ठा | Agriveda",
  description:
    "उत्तर प्रदेश, राजस्थान, बिहार, हरियाणा, पंजाब, MP व महाराष्ट्र के अनुसार बीघा, एकड़, हेक्टेयर, कट्ठा, कनाल, गुंठा व वर्ग फुट का सटीक रूपांतरण।",
};

export default function LandAreaConverterPage() {
  return (
    <Agriveda2Shell
      title="ज़मीन नाप कैलकुलेटर"
      backHref="/dashboard"
    >
      <LandAreaConverterClient />
    </Agriveda2Shell>
  );
}
