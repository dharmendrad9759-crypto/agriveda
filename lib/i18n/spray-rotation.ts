import type { SprayLocale } from "@/types/spray-rotation";

export type SprayTranslationKey =
  | "title"
  | "subtitle"
  | "logSpray"
  | "rotationStatus"
  | "suggestedNext"
  | "selectCrop"
  | "selectField"
  | "searchProduct"
  | "sprayDate"
  | "dose"
  | "growthStage"
  | "save"
  | "saved"
  | "riskLow"
  | "riskMedium"
  | "riskHigh"
  | "warningBanner"
  | "consecutiveWarning"
  | "timeline"
  | "noSprays"
  | "addField"
  | "fieldName"
  | "syncPending"
  | "synced"
  | "offlineNote"
  | "targetPest"
  | "moaGroup"
  | "lastSprays"
  | "recommendDifferent"
  | "language";

const translations: Record<SprayLocale, Record<SprayTranslationKey, string>> = {
  en: {
    title: "Spray Rotation Tracker",
    subtitle: "Prevent resistance — rotate MoA groups",
    logSpray: "Log a Spray",
    rotationStatus: "Rotation Status",
    suggestedNext: "Suggested Next Spray",
    selectCrop: "Select crop",
    selectField: "Select field",
    searchProduct: "Search product or ingredient...",
    sprayDate: "Spray date",
    dose: "Dose used",
    growthStage: "Growth stage",
    save: "Save spray log",
    saved: "Spray logged successfully",
    riskLow: "Low resistance risk",
    riskMedium: "Medium risk — consider rotating MoA",
    riskHigh: "High risk — do NOT repeat this MoA group",
    warningBanner: "Same MoA group used 2+ times in last 3 sprays",
    consecutiveWarning: "Consecutive sprays used the same MoA group",
    timeline: "Spray timeline this season",
    noSprays: "No sprays logged yet",
    addField: "Add field",
    fieldName: "Field name",
    syncPending: "Pending sync",
    synced: "Synced",
    offlineNote: "Saved offline — will sync when online",
    targetPest: "Target pest / disease (optional)",
    moaGroup: "MoA group",
    lastSprays: "Last sprays",
    recommendDifferent: "Rotate to a different MoA group",
    language: "Language",
  },
  hi: {
    title: "स्प्रे रोटेशन ट्रैकर",
    subtitle: "प्रतिरोध रोकें — MoA समूह बदलें",
    logSpray: "स्प्रे दर्ज करें",
    rotationStatus: "रोटेशन स्थिति",
    suggestedNext: "अगली स्प्रे सुझाव",
    selectCrop: "फसल चुनें",
    selectField: "खेत चुनें",
    searchProduct: "उत्पाद या सामग्री खोजें...",
    sprayDate: "स्प्रे की तारीख",
    dose: "प्रयुक्त मात्रा",
    growthStage: "वृद्धि अवस्था",
    save: "सेव करें",
    saved: "स्प्रे सफलतापूर्वक दर्ज",
    riskLow: "कम प्रतिरोध जोखिम",
    riskMedium: "मध्यम जोखिम — MoA बदलें",
    riskHigh: "उच्च जोखिम — यही MoA दोबारा न करें",
    warningBanner: "पिछली 3 स्प्रे में एक ही MoA 2+ बार",
    consecutiveWarning: "लगातार स्प्रे में एक ही MoA समूह",
    timeline: "इस सीजन की स्प्रे समयरेखा",
    noSprays: "अभी कोई स्प्रे दर्ज नहीं",
    addField: "खेत जोड़ें",
    fieldName: "खेत का नाम",
    syncPending: "सिंक बाकी",
    synced: "सिंक हो गया",
    offlineNote: "ऑफलाइन सेव — ऑनलाइन होने पर सिंक",
    targetPest: "लक्ष्य कीट / रोग (वैकल्पिक)",
    moaGroup: "MoA समूह",
    lastSprays: "पिछली स्प्रे",
    recommendDifferent: "अलग MoA समूह चुनें",
    language: "भाषा",
  },
  gu: {
    title: "સ્પ્રે રોટેશન ટ્રેકર",
    subtitle: "પ્રતિકાર અટકાવો — MoA જૂથ બદલો",
    logSpray: "સ્પ્રે નોંધો",
    rotationStatus: "રોટેશન સ્થિતિ",
    suggestedNext: "આગળની સ્પ્રે સૂચન",
    selectCrop: "પાક પસંદ કરો",
    selectField: "ખેતર પસંદ કરો",
    searchProduct: "ઉત્પાદન શોધો...",
    sprayDate: "સ્પ્રે તારીખ",
    dose: "ડોઝ",
    growthStage: "વૃદ્ધિ તબક્કો",
    save: "સાચવો",
    saved: "સ્પ્રે સાચવાઈ",
    riskLow: "ઓછો જોખમ",
    riskMedium: "મધ્યમ જોખમ — MoA બદલો",
    riskHigh: "ઊંચો જોખમ — આ MoA પુનરાવર્તન ન કરો",
    warningBanner: "છેલ્લી 3 સ્પ્રેમાં સમાન MoA 2+ વાર",
    consecutiveWarning: "સતત સ્પ્રેમાં સમાન MoA જૂથ",
    timeline: "આ સીઝનની સ્પ્રે ટાઇમલાઇન",
    noSprays: "હજી સ્પ્રે નોંધાયેલ નથી",
    addField: "ખેતર ઉમેરો",
    fieldName: "ખેતરનું નામ",
    syncPending: "સિંક બાકી",
    synced: "સિંક થયું",
    offlineNote: "ઑફલાઇન સાચવ્યું",
    targetPest: "લક્ષ્ય કીડી / રોગ",
    moaGroup: "MoA જૂથ",
    lastSprays: "છેલ્લી સ્પ્રે",
    recommendDifferent: "અલગ MoA જૂથ પસંદ કરો",
    language: "ભાષા",
  },
  kn: {
    title: "ಸ್ಪ್ರೇ ರೊಟೇಶನ್ ಟ್ರ್ಯಾಕರ್",
    subtitle: "ಪ್ರತಿರೋಧ ತಡೆಯಿರಿ — MoA ಗುಂಪು ಬದಲಿಸಿ",
    logSpray: "ಸ್ಪ್ರೇ ದಾಖಲಿಸಿ",
    rotationStatus: "ರೊಟೇಶನ್ ಸ್ಥಿತಿ",
    suggestedNext: "ಮುಂದಿನ ಸ್ಪ್ರೇ ಸಲಹೆ",
    selectCrop: "ಬೆಳೆ ಆಯ್ಕೆ",
    selectField: "ಹೊಲ ಆಯ್ಕೆ",
    searchProduct: "ಉತ್ಪನ್ನ ಹುಡುಕಿ...",
    sprayDate: "ಸ್ಪ್ರೇ ದಿನಾಂಕ",
    dose: "ಡೋಸ್",
    growthStage: "ಬೆಳವಣಿಗೆ ಹಂತ",
    save: "ಉಳಿಸಿ",
    saved: "ಸ್ಪ್ರೇ ದಾಖಲಾಯಿತು",
    riskLow: "ಕಡಿಮೆ ಅಪಾಯ",
    riskMedium: "ಮಧ್ಯಮ ಅಪಾಯ — MoA ಬದಲಿಸಿ",
    riskHigh: "ಹೆಚ್ಚು ಅಪಾಯ — ಅದೇ MoA ಪುನರಾವರ್ತನೆ ಬೇಡ",
    warningBanner: "ಕೊನೆಯ 3 ಸ್ಪ್ರೇಗಳಲ್ಲಿ ಅದೇ MoA 2+ ಬಾರಿ",
    consecutiveWarning: "ಸತತ ಸ್ಪ್ರೇಗಳಲ್ಲಿ ಅದೇ MoA ಗುಂಪು",
    timeline: "ಈ ಋತುವಿನ ಸ್ಪ್ರೇ ಟೈಮ್‌ಲೈನ್",
    noSprays: "ಇನ್ನೂ ಸ್ಪ್ರೇ ದಾಖಲಾಗಿಲ್ಲ",
    addField: "ಹೊಲ ಸೇರಿಸಿ",
    fieldName: "ಹೊಲದ ಹೆಸರು",
    syncPending: "ಸಿಂಕ್ ಬಾಕಿ",
    synced: "ಸಿಂಕ್ ಆಯಿತು",
    offlineNote: "ಆಫ್‌ಲೈನ್ ಉಳಿಸಲಾಗಿದೆ",
    targetPest: "ಗುರಿ ಕೀಟ / ರೋಗ",
    moaGroup: "MoA ಗುಂಪು",
    lastSprays: "ಕೊನೆಯ ಸ್ಪ್ರೇಗಳು",
    recommendDifferent: "ಬೇರೆ MoA ಗುಂಪು ಆಯ್ಕೆಮಾಡಿ",
    language: "ಭಾಷೆ",
  },
};

export function t(locale: SprayLocale, key: SprayTranslationKey): string {
  return translations[locale][key] ?? translations.en[key];
}

export const LOCALE_OPTIONS: { code: SprayLocale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
];
