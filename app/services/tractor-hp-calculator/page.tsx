import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import TractorHpCalculatorClient from "@/components/agriveda2/TractorHpCalculatorClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ट्रैक्टर HP व उपकरण मैचिंग कैलकुलेटर — रोटावेटर, कल्टीवेटर व डीजल खपत | Agriveda",
  description:
    "ट्रैक्टर की हॉर्सपावर (HP) और मिट्टी के अनुसार सही रोटावेटर, कल्टीवेटर, सुपर सीडर, डिस्क हैरो साइज और प्रति घंटा डीजल खपत निकालें।",
};

export default function TractorHpCalculatorPage() {
  return (
    <Agriveda2Shell
      title="ट्रैक्टर HP व उपकरण कैलकुलेटर"
      backHref="/dashboard"
    >
      <TractorHpCalculatorClient />
    </Agriveda2Shell>
  );
}
