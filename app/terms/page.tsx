import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";
import { BRAND } from "@/lib/brand";
import { APP_VERSION } from "@/lib/appMeta";

export const metadata = {
  title: `Terms of Service | ${BRAND}`,
  description: "Agriveda terms — agricultural advice disclaimers and acceptable use.",
};

const SECTIONS = [
  {
    title: "स्वीकृति",
    body: [
      `ऐप खोलकर या लॉगिन करके आप ${BRAND} की इन शर्तों और गोपनीयता नीति से सहमत होते हैं।`,
      "सहमत नहीं हैं तो ऐप का उपयोग बंद करें और Settings से खाता हटा सकते हैं।",
    ],
  },
  {
    title: "सेवा क्या है",
    body: [
      `${BRAND} भारतीय किसानों के लिए मौसम, मंडी जानकारी, फसल गाइड और AI आधारित कीट-रोग सुझाव देता है।`,
      "कुछ डेटा (मंडी / मौसम) बाहरी स्रोतों पर निर्भर है — कभी-कभी उदाहरण या सीमित डेटा दिख सकता है; ऐप में लेबल देखें।",
    ],
  },
  {
    title: "उम्र और उपयोगकर्ता",
    body: [
      "यह ऐप 18 वर्ष या उससे ऊपर के किसानों / खेत प्रबंधकों के लिए है — बच्चों के लिए डिज़ाइन नहीं।",
      "Families / बच्चों वाला Play category नहीं है।",
    ],
  },
  {
    title: "कृषि सलाह — महत्वपूर्ण अस्वीकरण",
    body: [
      "AI Doctor, फसल गाइड और विशेषज्ञ जवाब सिर्फ सूचनात्मक सुझाव हैं — लाइसेंसशुदा कृषि वैज्ञानिक, डॉक्टर या सरकारी आदेश का विकल्प नहीं।",
      "यह मेडिकल / वेटरनरी डिवाइस नहीं है। दवा, dose, PHI और spray हमेशा उत्पाद लेबल और स्थानीय कृषि अधिकारी / KVK से verify करें।",
      "गलत पहचान, गलत dose या देरी से नुकसान की ज़िम्मेदारी उपयोगकर्ता की अपनी जाँच और फैसला पर है।",
    ],
  },
  {
    title: "खाता और डेटा",
    body: [
      "लॉगिन Google Sign-In (Firebase) से होता है। सेशन में device id और (जब उपलब्ध हो) Google नाम / ईमेल जुड़ सकता है। फोन OTP लॉगिन बंद है।",
      "आप Settings में लॉग आउट, डेटा डाउनलोड, या खाता स्थायी रूप से हटा सकते हैं (Google-only खाते पर भी — device id से server wipe)।",
      "Product analytics बंद रखकर आप चुपचाप इस्तेमाल कर सकते हैं।",
      "हम डेटा नहीं बेचते। वैध कानूनी आदेश के बिना व्यक्तिगत डेटा नहीं बाँटते।",
    ],
  },
  {
    title: "स्वीकार्य उपयोग",
    body: [
      "ऐप का दुरुपयोग, API पर हमला, या नकली outbreak / spam query न भेजें।",
      "दूसरों की फोटो / निजी डेटा बिना अनुमति न अपलोड करें।",
    ],
  },
  {
    title: "संपर्क",
    body: [
      "सवाल या शिकायत: support@agriveda.in",
      "गोपनीयता विवरण Privacy Policy पृष्ठ पर है।",
    ],
  },
];

export default function TermsPage() {
  return (
    <AppShell
      className="!bg-transparent"
      title="नियम और शर्तें"
      subtitle="Terms of Service — साफ और सीधी बात"
      breadcrumbs={[{ label: "होम", href: "/" }, { label: "नियम" }]}
    >
      <DarkCard>
        <p className="text-sm text-[var(--av-text-secondary)]">
          {BRAND} v{APP_VERSION} · Last updated: August 2026
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">
          ये शर्तें Play Store और वास्तविक खेत उपयोग दोनों के लिए हैं। विवरण बदल सकते हैं — महत्वपूर्ण बदलाव
          ऐप में दिखाए जाएँगे।
        </p>
        <p className="mt-2 text-xs text-[var(--av-text-muted)]">
          देखें:{" "}
          <AppLink href="/privacy" className="font-semibold text-[var(--av-accent)] hover:underline">
            गोपनीयता नीति
          </AppLink>
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
    </AppShell>
  );
}
