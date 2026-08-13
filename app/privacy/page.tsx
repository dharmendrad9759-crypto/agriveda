import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";
import { BRAND } from "@/lib/brand";
import { APP_VERSION, SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/appMeta";

export const metadata = {
  title: `Privacy Policy | ${BRAND}`,
  description: "Agriveda privacy — farmer-first, minimal data, no selling.",
};

const SECTIONS = [
  {
    title: "हमारा वादा (साफ बात)",
    body: [
      "आपका डेटा बेचा नहीं जाता — न Google Ads को, न दलालों को।",
      "तीसरे पक्ष के crash / ads SDK (Firebase Crashlytics, Sentry, Meta Pixel आदी) अभी ऐप में नहीं हैं।",
      "Product analytics डिफ़ॉल्ट बंद — Settings में आप चाहें तभी चालू करें; phone/name/photo कभी analytics में नहीं जाते।",
      "कानूनी माँग (court / lawful order) पर सिर्फ जितना जरूरी और जितना हमारे पास हो — बिना ज़रूरत के share नहीं।",
    ],
  },
  {
    title: "जानकारी जो लग सकती है",
    body: [
      "Google खाता — लॉगिन के लिए (Firebase / Google Sign-In)। फोन OTP अभी ऐप में बंद है।",
      "नाम / गाँव / राज्य — ज़्यादातर आपके फोन की localStorage पर; सर्वर पर limited farmer record जब login हो।",
      "Device id — anonymous, queries जोड़ने के लिए।",
      "लोकेशन — सिर्फ आप अनुमति दें तो मौसम/मंडी/outbreak के लिए।",
      "फसल फोटो — AI Doctor: request पूरा होते ही Agriveda DB में scan photo store नहीं होती; Gemini API को सुरक्षित server के ज़रिए भेजते हैं (Google की अपनी API नीति लागू)।",
      "विशेषज्ञ प्रश्न की फोटो — अगर आप Ask Query भेजें तो private storage में तब तक रह सकती है जब तक आप खाता न हटाएँ।",
    ],
  },
  {
    title: "डेटा का उपयोग",
    body: [
      "सिर्फ ऐप चलाने और सलाह दिखाने के लिए।",
      "मंडी / मौसम कभी उदाहरण हो सकता है अगर लाइव API न हो — स्क्रीन पर बताया जाता है।",
      "कोई छुपा tracking profile / scoring आपके खिलाफ नहीं बनाते।",
    ],
  },
  {
    title: "तृतीय-पक्ष (जब enabled हो)",
    body: [
      "Google Gemini — AI सुझाव (photo/symptoms)।",
      "Supabase — farmers, expert queries, notifications (जब configured)।",
      "OpenWeather / Open-Meteo, data.gov.in — मौसम / मंडी।",
      "विशेषज्ञ जवाब — WhatsApp/SMS सिर्फ जब आप query भेजें और टीम जवाब दे (अलग SMS OTP लॉगिन नहीं)।",
    ],
  },
  {
    title: "आपके अधिकार (Play + किसान)",
    body: [
      "Settings → मेरा डेटा डाउनलोड — फोन पर जो है वो JSON में।",
      "Settings → खाता हटाएँ — server (farmer, queries, photos, notifications) + phone wipe।",
      "लॉग आउट — सिर्फ session; crop data फोन पर रहता है।",
      "Location phone settings से कभी भी बंद।",
      "सहायता: " + SUPPORT_EMAIL,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <AppShell
      className="!bg-transparent"
      title="गोपनीयता नीति"
      subtitle="किसान पहले — कम डेटा, साफ नियंत्रण"
      breadcrumbs={[{ label: "होम", href: "/" }, { label: "गोपनीयता" }]}
    >
      <DarkCard>
        <p className="text-sm text-[var(--av-text-secondary)]">
          {BRAND} v{APP_VERSION} · Last updated: August 2026
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">
          यह नीति बताती है डेटा कैसे संभाला जाता है। नियम:{" "}
          <AppLink href="/terms" className="font-semibold text-[var(--av-accent)] hover:underline">
            /terms
          </AppLink>
          .
        </p>
      </DarkCard>

      <div className="mt-4 space-y-4">
        {SECTIONS.map((s) => (
          <DarkCard key={s.title}>
            <h2 className="text-sm font-bold text-[var(--av-text-primary)]">{s.title}</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--av-text-secondary)]">
              {s.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </DarkCard>
        ))}
      </div>

      <DarkCard className="mt-4">
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">संपर्क</h2>
        <p className="mt-2 text-sm text-[var(--av-text-secondary)]">
          Privacy या डेटा हटाने के लिए:{" "}
          <a href={SUPPORT_MAILTO} className="font-semibold text-[var(--av-accent)] hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </DarkCard>
    </AppShell>
  );
}
