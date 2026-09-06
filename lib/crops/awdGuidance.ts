/**
 * धान — सूखा–गीला पानी तरीका (AWD)।
 * किसान भाषा में: ट्यूब से पानी देखो, ज़रूरत पर सींचो।
 */

export const AWD_FIELD_TUBE_CM = 15;

export const AWD_CHECK_STORAGE_KEY = "agriveda-awd-tube-check";

export interface AwdStep {
  id: string;
  titleHi: string;
  titleEn: string;
  detailHi: string;
  detailEn: string;
}

export interface AwdGuidance {
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  steps: AwdStep[];
  neverStressHi: string;
  neverStressEn: string;
  safeNotesHi: string[];
  safeNotesEn: string[];
  checklistLabelHi: string;
  checklistLabelEn: string;
}

export const AWD_GUIDANCE: AwdGuidance = {
  titleHi: "पानी बचाओ तरीका",
  titleEn: "Save-water method",
  subtitleHi: "खेत में छोटा पाइप गाड़ें · पानी सूखने पर फिर सींचें — रोज़ पानी भरना ज़रूरी नहीं",
  subtitleEn: "Put a small pipe in the field · water again when it dries — daily flooding not needed",
  steps: [
    {
      id: "tube",
      titleHi: "1. खेत में पाइप गाड़ें",
      titleEn: "1. Put a pipe in the field",
      detailHi:
        "एक छोटा पाइप (लगभग मुट्ठी जितना मोटा) खेत में आधा हाथ गहरा गाड़ दें। पाइप में छेद हों ताकि अंदर का पानी दिखे। यही बताएगा कि खेत में पानी कितना है।",
      detailEn:
        "Drive a small perforated pipe about half an arm deep. The water level inside shows how wet the field is.",
    },
    {
      id: "irrigate",
      titleHi: `2. पानी ${AWD_FIELD_TUBE_CM} सेमी नीचे उतरे तब सींचें`,
      titleEn: `2. Irrigate when water is ${AWD_FIELD_TUBE_CM} cm down`,
      detailHi: `ऊपर का खड़ा पानी सूखने दें। पाइप में पानी ज़मीन से करीब ${AWD_FIELD_TUBE_CM} सेमी (दो–तीन उंगली से ज़्यादा) नीचे दिखे — तब फिर हल्का पानी भरें (लगभग दो उंगली जितना)। रोज़ बाढ़ भरना ज़रूरी नहीं।`,
      detailEn: `Let surface water dry. When the pipe shows water about ${AWD_FIELD_TUBE_CM} cm below ground, flood lightly again (~2–5 cm). Continuous flooding is not needed.`,
    },
    {
      id: "never-pi",
      titleHi: "3. बाली–फूल समय पानी न रोकें",
      titleEn: "3. Never skip water at heading / flowering",
      detailHi:
        "जब बाली बनने लगे और फूल आए — तब खेत सूखने न दें। इस समय हमेशा हल्की नमी रखें। पानी कम हुआ तो पैदावार गिर सकती है।",
      detailEn:
        "From heading through flowering, keep the field moist — do not dry down. Skipping water now can cut yield.",
    },
  ],
  neverStressHi:
    "सबसे ज़रूरी: बाली निकलते और फूल आते समय खेत सूखा न छोड़ें — दाना कमज़ोर पड़ सकता है।",
  neverStressEn:
    "Most important: never let the field dry at heading or flowering — grain can suffer.",
  safeNotesHi: [
    "रोपाई के बाद पहले 10–15 दिन हल्का पानी रखें — जड़ पकड़े।",
    "बहुत रेतीली या खराब निकासी वाली ज़मीन पर यह तरीका सावधानी से अपनाएँ — पड़ोसी किसान या कृषि विभाग से पूछ लें।",
    "खरपतवार ज़्यादा हो तो कुछ दिन पानी खड़ा रख सकते हैं।",
    "यह आम सलाह है — अपने खेत की मिट्टी और ढलान देखकर पानी बदलें।",
  ],
  safeNotesEn: [
    "Keep light water for 10–15 days after transplant so roots establish.",
    "On very sandy or poorly drained land, use carefully — ask a local advisor.",
    "If weeds surge, keep standing water for a few days.",
    "General advice — adjust to your soil and slope.",
  ],
  checklistLabelHi: "आज पाइप में पानी देख लिया",
  checklistLabelEn: "Checked the field pipe today",
};

export function getAwdGuidance(): AwdGuidance {
  return AWD_GUIDANCE;
}

export function awdTodayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
