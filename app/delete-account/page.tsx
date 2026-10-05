import type { Metadata } from "next";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";
import { BRAND } from "@/lib/brand";
import { APP_VERSION, SUPPORT_EMAIL } from "@/lib/appMeta";
import DeleteAccountClientForm from "./DeleteAccountClientForm";

export const metadata: Metadata = {
  title: `Account & Data Deletion | ${BRAND}`,
  description:
    "Request permanent account and personal data deletion for Agriveda in compliance with Google Play Store policies and the Indian DPDP Act.",
};

export default function DeleteAccountPage() {
  return (
    <AppShell
      className="!bg-transparent"
      title="खाता व डेटा हटाएँ (Account Deletion)"
      breadcrumbs={[
        { label: "होम", href: "/" },
        { label: "गोपनीयता", href: "/privacy" },
        { label: "डेटा हटाएँ" },
      ]}
    >
      {/* Overview Banner */}
      <DarkCard>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--av-text-secondary)]">
            Google Play Policy & DPDP Act Compliance
          </p>
        </div>
        <h1 className="mt-2 text-lg font-bold text-[var(--av-text-primary)]">
          {BRAND} खाता और डेटा हटाने की नीति (Account & Data Deletion)
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--av-text-secondary)]">
          Google Play नियमों और भारतीय डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) कानून के तहत आपको अपने खाते और संबंधित डेटा को स्थायी रूप से मिटाने का पूर्ण अधिकार है।
        </p>
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          {BRAND} v{APP_VERSION} · Official Deletion Portal
        </p>
      </DarkCard>

      {/* Option 1: In-App Instant Deletion */}
      <DarkCard className="mt-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-sm font-bold text-[var(--av-text-primary)]">
            ऐप के अंदर से तुरंत हटाएँ (Instant In-App Deletion)
          </h2>
        </div>
        <p className="mt-2 text-xs text-[var(--av-text-secondary)]">
          यदि आपके फोन में {BRAND} ऐप इंस्टॉल है, तो आप 10 सेकंड में स्वयं खाता हटा सकते हैं:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-[var(--av-text-secondary)]">
          <li>
            ऐप खोलें और नीचे दिए गए मेन्यू से <strong>Settings (सेटिंग्स)</strong> पर जाएँ।
          </li>
          <li>
            स्क्रीन के नीचे स्क्रॉल करें और <strong>खाता हटाएँ (Delete Account)</strong> बटन पर टैप करें।
          </li>
          <li>
            पुष्टि (Confirm) करें। पुष्टि होते ही आपका सर्वर डेटा (प्रोफ़ाइल, फोटो, प्रश्न) और लोकल ऐप डेटा तुरंत हमेशा के लिए मिट जाएगा।
          </li>
        </ol>
        <div className="mt-4">
          <AppLink
            href="/settings"
            className="inline-flex items-center rounded-lg bg-[var(--av-accent)] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
          >
            सेटिंग्स में जाएँ (Open In-App Settings)
          </AppLink>
        </div>
      </DarkCard>

      {/* Option 2: Web Deletion Request (For users who uninstalled the app) */}
      <DarkCard className="mt-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
            2
          </span>
          <h2 className="text-sm font-bold text-[var(--av-text-primary)]">
            वेब अनुरोध (Web Request — यदि ऐप अनइंस्टॉल कर दिया है)
          </h2>
        </div>
        <p className="mt-2 text-xs text-[var(--av-text-secondary)]">
          यदि आपने ऐप हटा दिया है या फोन उपलब्ध नहीं है, तो आप नीचे अपना पंजीकृत Google Email या मोबाइल नंबर दर्ज करके खाता हटाने का अनुरोध भेज सकते हैं:
        </p>
        <div className="mt-4">
          <DeleteAccountClientForm supportEmail={SUPPORT_EMAIL} />
        </div>
      </DarkCard>

      {/* What Data is Deleted */}
      <DarkCard className="mt-4">
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">
          कौन-सा डेटा हटाया जाता है? (What Data is Deleted)
        </h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs text-[var(--av-text-secondary)]">
          <li>
            <strong>किसान प्रोफ़ाइल:</strong> नाम, गाँव, राज्य, फोन नंबर और ईमेल।
          </li>
          <li>
            <strong>फसल व खेत डेटा:</strong> खेतों के नाम, रकबा, बोई गई फसलें और तारीखें।
          </li>
          <li>
            <strong>फसल जांच व फोटो:</strong> AI Doctor या विशेषज्ञ से पूछे गए प्रश्नों की सभी तस्वीरें और चैट हिस्ट्री।
          </li>
          <li>
            <strong>छिड़काव व अलर्ट:</strong> स्प्रे लॉग्स और डिवाइस नोटिफिकेशन टोकन्स।
          </li>
          <li>
            <strong>Google / Firebase Authentication:</strong> Firebase Auth से आपका यूज़र रिकॉर्ड हमेशा के लिए डिलीट कर दिया जाता है।
          </li>
        </ul>
      </DarkCard>

      {/* Data Retention Policy */}
      <DarkCard className="mt-4">
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">
          डेटा संरक्षण नीति (Data Retention & Safeguards)
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-[var(--av-text-secondary)]">
          खाता हटाने के बाद {BRAND} आपके किसी भी व्यक्तिगत डेटा को विज्ञापनों या दलालों के लिए सुरक्षित नहीं रखता। केवल कानूनन अनिवार्य रिकॉर्ड्स (यदि कोई कानूनी आदेश हो) को छोड़कर सभी डेटाबेस रिकॉर्ड्स और प्राइवेट स्टोरेज फोटोज़ को <strong>शून्य (Zero Retention)</strong> कर दिया जाता है।
        </p>
        <p className="mt-3 text-xs text-[var(--av-text-muted)]">
          अन्य नियम व शर्तों के लिए हमारी{" "}
          <AppLink href="/privacy" className="font-semibold text-[var(--av-accent)] hover:underline">
            Privacy Policy
          </AppLink>{" "}
          और{" "}
          <AppLink href="/terms" className="font-semibold text-[var(--av-accent)] hover:underline">
            Terms of Service
          </AppLink>{" "}
          देखें।
        </p>
      </DarkCard>
    </AppShell>
  );
}
