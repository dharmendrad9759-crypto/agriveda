import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { BRAND } from "@/lib/brand";
import { APP_VERSION } from "@/lib/appMeta";

export const metadata = {
  title: `Privacy Policy | ${BRAND}`,
  description: "Agriveda privacy policy — how we handle farmer data, photos, and location.",
};

const SECTIONS = [
  {
    title: "जानकारी जो हम लेते हैं",
    body: [
      "फोन नंबर — OTP login और account के लिए (अगर आप login करते हैं)।",
      "नाम, गाँव, राज्य, ज़िला — आपकी सलाह को स्थानीय बनाने के लिए।",
      "GPS / लोकेशन — मौसम, मंडी और outbreak radar के लिए (सिर्फ आपकी अनुमति पर)।",
      "फसल की फोटो — AI Doctor रोग पहचान के लिए (आप upload करते हैं)।",
      "ऐप उपयोग — क्रैश लॉग और बेसिक analytics (बेहतर सेवा के लिए)।",
    ],
  },
  {
    title: "डेटा का उपयोग",
    body: [
      "फसल सलाह, मौसम, मंडी भाव और कीट-रोग जानकारी दिखाने के लिए।",
      "AI Doctor फोटो का विश्लेषण Google Gemini API के ज़रिए होता है — फोटो सुरक्षित तरीके से server पर भेजी जाती है।",
      "आपका डेटा बेचा नहीं जाता।",
    ],
  },
  {
    title: "तृतीय-पक्ष सेवाएँ",
    body: [
      "Google Gemini — AI Doctor और Kisan Saathi chat।",
      "OpenWeather — मौसम डेटा।",
      "data.gov.in — लाइव मंडी भाव (जब configured हो)।",
      "Supabase / Firebase — cloud sync और OTP (जब enabled हो)।",
    ],
  },
  {
    title: "आपके अधिकार",
    body: [
      "Profile से अपनी जानकारी बदल या हटा सकते हैं।",
      "Location permission कभी भी phone settings से बंद कर सकते हैं।",
      "Account / डेटा हटाने के लिए ऐप में Ask Query या support से संपर्क करें।",
    ],
  },
  {
    id: "terms",
    title: "नियम और शर्तें",
    body: [
      `${BRAND} कृषि सलाह केवल सूचनात्मक उद्देश्य से है — रासायनिक dose हमेशा label और स्थानीय कृषि अधिकारी से verify करें।`,
      "गलत फसल सलाह से होने वाले नुकसान की ज़िम्मेदारी किसान की अपनी जाँच पर है।",
      "ऐप का उपयोग करके आप इन शर्तों से सहमत मानें जाएँगे।",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <AppShell
      className="!bg-transparent"
      title="Privacy Policy"
      subtitle="गोपनीयता नीति — आपका डेटा सुरक्षित रखने का वादा"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
    >
      <DarkCard>
        <p className="text-sm text-[var(--av-text-secondary)]">
          {BRAND} v{APP_VERSION} · Last updated: July 2026
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">
          यह नीति बताती है कि Agriveda ऐप आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करता है।
        </p>
      </DarkCard>

      <div className="mt-4 space-y-4">
        {SECTIONS.map((s) => (
          <div key={s.title} id={s.id}>
            <DarkCard>
              <h2 className="text-sm font-bold text-[var(--av-text-primary)]">{s.title}</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--av-text-secondary)]">
                {s.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </DarkCard>
          </div>
        ))}
      </div>

      <DarkCard className="mt-4">
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">संपर्क</h2>
        <p className="mt-2 text-sm text-[var(--av-text-secondary)]">
          Privacy या डेटा हटाने के लिए:{" "}
          <a href="mailto:support@agriveda.in" className="font-semibold text-[var(--av-accent)] hover:underline">
            support@agriveda.in
          </a>
        </p>
      </DarkCard>
    </AppShell>
  );
}
