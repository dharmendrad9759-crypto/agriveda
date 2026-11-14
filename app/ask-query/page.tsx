"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Check,
  Leaf,
  Mic,
  Send,
  Square,
  X,
} from "lucide-react";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  buildExpertQueryText,
  clearAiDoctorExpertReferral,
  readAiDoctorExpertReferral,
} from "@/lib/aiDoctorExpertReferral";
import { cn } from "@/lib/cn";

interface ChatMessage {
  id: string;
  sender: "user" | "doctor";
  text: string;
  photo?: string;
  time: string;
  cropName?: string;
  ticketId?: string;
}

const COMMON_CROP_CHIPS = [
  { slug: "general", nameHi: "सामान्य सवाल", emoji: "🌱" },
  { slug: "wheat", nameHi: "गेहूं", emoji: "🌾" },
  { slug: "paddy", nameHi: "धान", emoji: "🌾" },
  { slug: "mustard", nameHi: "सरसों", emoji: "🌼" },
  { slug: "tomato", nameHi: "टमाटर", emoji: "🍅" },
  { slug: "potato", nameHi: "आलू", emoji: "🥔" },
  { slug: "maize", nameHi: "मक्का", emoji: "🌽" },
  { slug: "soybean", nameHi: "सोयाबीन", emoji: "🫘" },
  { slug: "cotton", nameHi: "कपास", emoji: "🌱" },
  { slug: "chilli", nameHi: "मिर्च", emoji: "🌶️" },
  { slug: "onion", nameHi: "प्याज", emoji: "🧅" },
];

const CROP_SUGGESTIONS: Record<string, string[]> = {
  wheat: [
    "पीला रतुआ का पक्का इलाज?",
    "कल्ले व फुटाव कैसे बढ़ाएं?",
    "माहू (चेपा) कीट की दवा?",
    "पहला पानी व यूरिया कब दें?",
  ],
  paddy: [
    "पत्ती पीली पड़ने का उपाय?",
    "तना छेदक व पत्ता लपेटक दवा?",
    "जिंक की सही खुराक क्या है?",
    "कल्ले बढ़ाने का अचूक तरीका?",
  ],
  tomato: [
    "पत्ता मरोड़ (Whitefly) का इलाज?",
    "फल छेदक सुंडी की अचूक दवा?",
    "फल सड़न व फफूंद से बचाव?",
    "फूल झड़ने से रोकने का स्प्रे?",
  ],
  mustard: [
    "माहू कीट की रोकथाम?",
    "सल्फर कब और कितना डालें?",
    "सफेद रतुआ का स्प्रे?",
    "दाने में तेल बढ़ाने का उपाय?",
  ],
  potato: [
    "पछेती झुलसा का तुरंत इलाज?",
    "कंद का आकार बढ़ाने का स्प्रे?",
    "अगेती झुलसा की दवा?",
    "आलू में पोटाश की मात्रा?",
  ],
  general: [
    "पीली पत्ती का अचूक इलाज?",
    "सुंडी व कीड़े की असरदार दवा?",
    "कल्ले व बढ़वार बढ़ाने का उपाय?",
    "खरपतवार नाशक स्प्रे की सलाह?",
  ],
};

function generateDoctorAdvice(
  queryText: string,
  cropSlug: string,
  cropName: string
): string {
  const text = queryText.toLowerCase();
  const mentionsTomato =
    cropSlug === "tomato" || /tamatar|tomato|टमाटर/.test(text);
  const leafCurl =
    /leaf|virus|curl|lip color|लीफ|मरोड़|सफेद मक्खी/.test(text);

  if (mentionsTomato && leafCurl) {
    return `🍅 **टमाटर: पत्ता मरोड़ — सफेद मक्खी रोकें**\n\n1. **यह वायरस की दवा नहीं है।** पत्ता मरोड़ सफेद मक्खी से फैलता है। कोई स्प्रे वायरस को 100% खत्म नहीं करता।\n2. **सफेद मक्खी:** डायफेनथियूरॉन 50% WP @ 250 ग्राम/एकड़, या एसिटामिप्रिड 20% SP @ 80 ग्राम, 150 लीटर पानी में। लेबल पढ़ें।\n3. **पीले ट्रैप:** 10–12 पीले चिपचिपे कार्ड लगाएं।\n4. **बहुत मरे पौधे** उखाड़कर दबा दें। NPK 19:19:19 इस बीमारी की दवा नहीं है।`;
  }

  if (/खरपतवार|weed|herbicide|नाशक स्प्रे/.test(text)) {
    return `🌿 **खरपतवार की दवा यहीं से नहीं**\n\n1. **फसल बताएं** — बिना फसल के खरपतवार नाशक नहीं लिखा जाता। गलत फसल पर दवा फसल जला देती है।\n2. **ऐप में** उस फसल का खरपतवार नियंत्रण खोलें। वहीं अवस्था और मात्रा है।\n3. **NPK 19:19:19 खरपतवार की दवा नहीं है।**`;
  }

  // Wheat (गेहूं)
  if (cropSlug === "wheat" || text.includes("गेहूं") || text.includes("wheat")) {
    if (text.includes("पील") || text.includes("रतुआ") || text.includes("rust") || text.includes("पत्ता")) {
      return `🌾 **गेहूं विशेषज्ञ निदान: पीला रतुआ (Yellow Rust) व पीलापन**\n\n1. **निदान:** पत्तियों पर हल्दी जैसा पीला पाउडर दिखना पीला रतुआ हो सकता है या नाइट्रोजन/जिंक की कमी।\n2. **प्रमाणित दवा:** प्रोपिकोनाजोल 25% EC (टिल्ट / बंपर) @ 200 ml प्रति एकड़ 200 लीटर पानी में मिलाकर स्प्रे करें।\n3. **पोषण स्प्रे:** साथ में 19:19:19 @ 1 kg प्रति एकड़ मिलाएं जिससे पौधे को तुरंत ताकत मिले।\n4. **सावधानी:** स्प्रे सुबह ओस सूखने के बाद या दोपहर बाद धूप कम होने पर करें। 12 दिन बाद जरूरत पड़ने पर दोहराएं।`;
    }
    if (text.includes("कल्ले") || text.includes("फुटाव") || text.includes("बढ़वार") || text.includes("tillering")) {
      return `🌾 **गेहूं विशेषज्ञ सलाह: कल्ले व फुटाव बढ़ाने का उपाय**\n\n1. **सिंचाई:** बुवाई के 21-25 दिन पर CRI स्टेज पर पहली हल्की सिंचाई करें।\n2. **खाद:** सिंचाई के 2 दिन बाद यूरिया 40-45 kg प्रति एकड़ + जिंक सल्फेट 33% @ 5 kg छिड़कें।\n3. **स्प्रे टॉनिक:** अधिक फुटाव के लिए चिलेटेड माइक्रो-न्यूट्रिएंट्स (Zn-EDTA + Fe) या ह्यूमिक एसिड 12% @ 500 ml/एकड़ स्प्रे करें।`;
    }
    if (text.includes("माहू") || text.includes("चेपा") || text.includes("aphid") || text.includes("कीट") || text.includes("दीमक")) {
      return `🌾 **गेहूं विशेषज्ञ सलाह: माहू (चेपा) व दीमक नियंत्रण**\n\n1. **माहू (चेपा) दवा:** थायमेथोक्सम 25% WG @ 80-100 ग्राम प्रति एकड़ या इमिडाक्लोप्रिड 17.8% SL @ 60 ml/एकड़ स्प्रे करें।\n2. **दीमक के लिए:** क्लोरपायरीफॉस 20% EC @ 1 लीटर/एकड़ पहली सिंचाई के पानी के साथ चलाएं।\n3. **सलाह:** बालियों पर दाना बनते समय तेज धूप में छिड़काव न करें।`;
    }
    return `🌾 **गेहूं समग्र फसल सलाह:**\n\nगेहूं की अच्छी पैदावार के लिए समय पर सिंचाई और संतुलित खाद जरूरी है। कल्ले फूटते समय यूरिया की आधी खुराक दें। चौड़ी पत्ती वाले खरपतवार दिखने पर 2,4-D अमाइन का प्रयोग 30-35 दिन पर करें। रोग का कोई भी लक्षण दिखने पर तुरंत फोटो भेजें।`;
  }

  // Paddy (धान)
  if (cropSlug === "paddy" || text.includes("धान") || text.includes("paddy")) {
    if (text.includes("पील") || text.includes("खैरा") || text.includes("zinc") || text.includes("पत्ता")) {
      return `🌾 **धान विशेषज्ञ निदान: खैरा रोग व पीलापन निवारण**\n\n1. **निदान:** धान में नीचे की पत्तियों का पीला पड़ना और कथई धब्बे बनना जिंक (खैरा) की कमी है।\n2. **उपचार:** जिंक सल्फेट 33% @ 5 kg/एकड़ यूरिया के साथ मिट्टी में दें।\n3. **तत्काल पत्ती स्प्रे:** चिलेटेड जिंक (Zn-EDTA 12%) @ 1 ग्राम/लीटर + यूरिया 10 ग्राम/लीटर पानी में घोलकर स्प्रे करें।\n4. **सावधानी:** जिंक सल्फेट को DAP या SSP के साथ कभी न मिलाएं।`;
    }
    if (text.includes("सुंडी") || text.includes("तना छेदक") || text.includes("पत्ता लपेटक") || text.includes("borer") || text.includes("कीट")) {
      return `🌾 **धान विशेषज्ञ सलाह: तना छेदक व पत्ता लपेटक सुंडी नियंत्रण**\n\n1. **प्रमाणित दवा:** कोराजन (क्लोरेंट्रानिलिप्रोल 18.5% SC) @ 60 ml प्रति एकड़ 150 लीटर पानी में स्प्रे करें।\n2. **वैकल्पिक दवा:** कारटाप हाइड्रोक्लोराइड 4% GR @ 7.5 kg/एकड़ खेत में 2-3 सेमी पानी रखकर बिखेरें।\n3. **असर:** यह दवा पत्ती लपेटक और तना छेदक दोनों पर 20-25 दिन तक असरदार रहती है।`;
    }
    return `🌾 **धान फसल विशेषज्ञ सलाह:**\n\nधान में कल्ले फूटने की अवस्था में खेत में 2-3 सेमी पानी बनाए रखें। कल्ले बढ़ाते समय यूरिया 30-35 kg/एकड़ के साथ पोटाश 15 kg जरूर दें। किसी कीट या बीमारी की आशंका हो तो तुरंत पौधे की स्पष्ट फोटो भेजें।`;
  }

  // Tomato (टमाटर)
  if (cropSlug === "tomato" || text.includes("टमाटर") || text.includes("tomato") || text.includes("tamatar")) {
    if (text.includes("मरोड़") || text.includes("curl") || text.includes("leaf") || text.includes("virus") || text.includes("पत्ता") || text.includes("सफेद मक्खी") || text.includes("lip color")) {
      return `🍅 **टमाटर विशेषज्ञ निदान: पत्ता मरोड़ वायरस (Leaf Curl)**\n\n1. **कारण:** यह वायरस सफेद मक्खी (Whitefly) के रस चूसने से फैलता है।\n2. **दवा:** पेगासस (डायफेनथियूरॉन 50% WP) @ 250 ग्राम/एकड़ या एसिटामिप्रिड 20% SP @ 80 ग्राम प्रति 150 लीटर पानी में स्प्रे करें।\n3. **पीले ट्रैप:** खेत में 10-12 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं ताकि मक्खियां उसमें फंस जाएं।\n4. **सावधानी:** अत्यधिक ग्रसित पौधों को उखाड़कर जमीन में दबा दें।`;
    }
    if (text.includes("सुंडी") || text.includes("छेदक") || text.includes("फल") || text.includes("borer")) {
      return `🍅 **टमाटर फल छेदक सुंडी नियंत्रण:**\n\n1. **दवा:** कोराजन @ 60 ml प्रति एकड़ या एप्लीगो (क्लोरांट्रानिलिप्रोल + लैम्ब्डा) @ 80 ml/एकड़ का छिड़काव करें।\n2. **फल सड़न से बचाव:** फल का निचला हिस्सा काला पड़ने (BER) से बचाने के लिए कैल्शियम नाइट्रेट 5 ग्राम/लीटर + बोरॉन 1 ग्राम/लीटर स्प्रे करें।`;
    }
    return `🍅 **टमाटर फसल परामर्श:**\n\nटमाटर में फूल व फल की अच्छी संख्या के लिए बोरॉन 20% @ 1 ग्राम प्रति लीटर पानी का स्प्रे करें। अगेती व पछेती झुलसा से बचाव के लिए मैंकोजेब 75% WP @ 2.5 ग्राम/लीटर पानी में 10 दिन के अंतराल पर छिड़कें।`;
  }

  // Mustard (सरसों)
  if (cropSlug === "mustard" || text.includes("सरसों") || text.includes("mustard")) {
    if (text.includes("माहू") || text.includes("चेपा") || text.includes("aphid")) {
      return `🌼 **सरसों विशेषज्ञ सलाह: माहू (चेपा) कीट रोकथाम**\n\n1. **दवा:** इमिडाक्लोप्रिड 17.8% SL @ 60-70 ml प्रति एकड़ 150 लीटर पानी में घोलकर छिड़कें।\n2. **वैकल्पिक दवा:** डायमेथोएट 30% EC (रोगोर) @ 250-300 ml प्रति एकड़।\n3. **सावधानी:** छिड़काव हमेशा दोपहर बाद 3 बजे के बाद करें जब मित्र कीट (मधुमक्खियां) अपने छत्तों में लौट चुकी हों।`;
    }
    return `🌼 **सरसों फसल पोषण व रोग नियंत्रण:**\n\n1. **सल्फर की खुराक:** सरसों में तेल प्रतिशत बढ़ाने के लिए बेंटोनाइट सल्फर 90% @ 10 kg/एकड़ बुवाई के समय या पहली सिंचाई पर दें।\n2. **सफेद रतुआ (White Rust):** पत्तियों के नीचे सफेद फफोले दिखें तो रिडोमिल गोल्ड @ 2 ग्राम/लीटर पानी में स्प्रे करें।`;
  }

  // Potato (आलू)
  if (cropSlug === "potato" || text.includes("आलू") || text.includes("potato")) {
    return `🥔 **आलू विशेषज्ञ सलाह: झुलसा रोग व कंद बढ़वार**\n\n1. **पछेती झुलसा (Late Blight):** कोहरा या बादल छाए रहने पर सेक्टिन (फेनोमेक्सडोन + मैंकोजेब) @ 3 ग्राम/लीटर या एक्रोबेट @ 2 ग्राम/लीटर पानी में छिड़कें।\n2. **कंद का आकार बढ़ाना:** 50-60 दिन की फसल पर 00:00:50 (SOP) @ 1 kg प्रति एकड़ + बोरॉन 100 ग्राम प्रति 150 लीटर पानी में स्प्रे करें।`;
  }

  // General Diagnostic Engine for any crop
  if (text.includes("पील") || text.includes("पत्ता") || text.includes("yellow")) {
    return `👨‍🌾 **${cropName} विशेषज्ञ निदान: पत्तियों का पीलापन**\n\n1. **कारण:** यह पोषक तत्वों (नाइट्रोजन/जिंक/आयरन) की कमी या जड़ गलन फफूंद का संकेत हो सकता है।\n2. **उपाय:** NPK 19:19:19 @ 1 kg/एकड़ + चिलेटेड माइक्रोन्यूट्रिएंट्स @ 100 ग्राम/एकड़ 150 लीटर पानी में मिलाकर स्प्रे करें।\n3. **जड़ जांच:** यदि पौधे की जड़ें काली पड़ रही हों, तो कॉपर ऑक्सीक्लोराइड 50% WP @ 3 ग्राम/लीटर से जड़ों के पास ड्रेंचिंग करें।\n4. **सावधानी:** खेत में जरूरत से ज्यादा पानी जमा न रहने दें।`;
  }

  if (text.includes("सुंडी") || text.includes("कीड़ा") || text.includes("कीट") || text.includes("worm") || text.includes("pest")) {
    return `👨‍🌾 **${cropName} विशेषज्ञ सलाह: कीट व सुंडी नियंत्रण**\n\n1. **सुंडी के लिए:** इमामेक्टिन बेंजोएट 5% SG @ 80-100 ग्राम प्रति एकड़ या कोराजन @ 60 ml/एकड़ 150 लीटर पानी में मिलाकर स्प्रे करें।\n2. **रस चूसक कीटों के लिए:** इमिडाक्लोप्रिड 17.8% SL @ 60 ml प्रति एकड़ छिड़कें।\n3. **स्प्रे का समय:** कीटनाशक का छिड़काव हमेशा शाम के समय करें जब कीड़े पत्तियों पर सक्रिय होते हैं।`;
  }

  if (text.includes("खाद") || text.includes("कल्ले") || text.includes("बढ़वार") || text.includes("फूल")) {
    return `👨‍🌾 **${cropName} विशेषज्ञ पोषण सलाह:**\n\n1. **बढ़वार व फुटाव:** वानस्पतिक अवस्था में NPK 19:19:19 @ 1 kg/एकड़ के साथ ह्यूमिक एसिड स्प्रे करें।\n2. **फूल व फल अवस्था:** फूल आने के समय 00:52:34 @ 1 kg/एकड़ + बोरॉन 20% @ 1 ग्राम/लीटर स्प्रे करें जिससे फूल झड़ने की समस्या समाप्त हो जाती है।\n3. **सावधानी:** दवा हमेशा साफ पानी में ही घोलें।`;
  }

  return `👨‍🌾 **इस सवाल का पक्का जवाब नहीं बना**\n\n1. ऊपर से **फसल चुनें**।\n2. बीमार पत्ती या कीड़े की **साफ फोटो** भेजें।\n3. बिना पहचान खाद या दवा नहीं लिख रहा — NPK 19:19:19 बीमारी की दवा नहीं है।`;
}

function MessageBody({ text }: { text: string }) {
  const cleaned = text.replace(
    /^(?:[\u{1F300}-\u{1FAFF}\u2600-\u27BF]\uFE0F?\s*)+/u,
    ""
  );
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function AskQueryPage() {
  const router = useRouter();
  const { crops } = useMyCrops();
  const { queries, addQuery } = useQueryHistory();
  const { profile } = useFarmerProfile();
  const { showToast } = useToast();
  const { locale } = useLocale();
  const isHi = locale === "hi";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  const [selectedCrop, setSelectedCrop] = useState<string>("general");
  const [inputText, setInputText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const selectedCropObj =
    COMMON_CROP_CHIPS.find((c) => c.slug === selectedCrop) || {
      slug: "general",
      nameHi: "सामान्य सवाल",
      emoji: "🌱",
    };

  // Chat message initial state with clear explanation of where questions go
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initial: ChatMessage[] = [
      {
        id: "msg-welcome",
        sender: "doctor",
        text: "बीमारी, कीड़ा या खाद का सवाल लिखें, या पत्ती की फोटो भेजें। दवा और खुराक यहीं मिलेगी।",
        time: "अभी",
      },
    ];

    if (queries && queries.length > 0) {
      queries
        .slice(0, 5)
        .reverse()
        .forEach((q) => {
          initial.push({
            id: `q-${q.id}`,
            sender: "user",
            text: q.query,
            photo: q.image,
            time: q.date,
            cropName: q.crop,
          });
          if (q.expertResponse?.fullAnswer || q.expertResponse?.preview) {
            initial.push({
              id: `ans-${q.id}`,
              sender: "doctor",
              text: q.expertResponse.fullAnswer || q.expertResponse.preview,
              time: q.date,
            });
          }
        });
    }

    return initial;
  });

  // Handle AI Doctor referral if directed here
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromDoctor =
      new URLSearchParams(window.location.search).get("from") === "ai-doctor";
    if (!fromDoctor) return;

    const referral = readAiDoctorExpertReferral();
    if (!referral) return;

    const cropLabel =
      referral.cropSlug === "other" && referral.result.cropContext
        ? referral.result.cropContext
        : referral.cropName;

    setSelectedCrop(referral.cropSlug);
    const referralText = buildExpertQueryText({ ...referral, cropName: cropLabel });

    const userMsg: ChatMessage = {
      id: `ref-${Date.now()}`,
      sender: "user",
      text: referralText,
      photo: referral.photoDataUrl || undefined,
      time: "अभी",
      cropName: cropLabel,
    };

    setMessages((prev) => [...prev, userMsg]);
    clearAiDoctorExpertReferral();
    showToast(isHi ? "AI डॉक्टर निदान लोड हो गया ✓" : "AI Doctor diagnosis loaded ✓");

    setIsTyping(true);
    setTimeout(() => {
      const docMsg: ChatMessage = {
        id: `ref-doc-${Date.now()}`,
        sender: "doctor",
        text: `👨‍🌾 **${cropLabel} की AI रिपोर्ट प्राप्त हो गई है।**\n\nरोग के लक्षणों की जांच कर समाधान और दवा की खुराक नीचे दी जा रही है।`,
        time: "अभी",
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, docMsg]);
    }, 1000);
  }, [isHi, showToast]);

  // Dynamic visualViewport tracking for software keyboard docking & WhatsApp-style layout
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [viewportStyle, setViewportStyle] = useState<React.CSSProperties>({
    height: "100svh",
    maxHeight: "100svh",
    top: 0,
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
  });

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastKey = "";
    const updateViewport = () => {
      const vv = window.visualViewport;
      if (vv) {
        const keyboardGap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        const visible = Math.max(0, Math.round(vv.height));
        const key = `${visible}:${Math.round(vv.offsetTop)}:${keyboardGap > 80 ? 1 : 0}`;
        if (key === lastKey) return;
        lastKey = key;
        setKeyboardOpen(keyboardGap > 80);
        setViewportStyle({
          position: "fixed",
          top: `${vv.offsetTop}px`,
          left: 0,
          right: 0,
          height: `${visible}px`,
          maxHeight: `${visible}px`,
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        });
      } else {
        setKeyboardOpen(false);
        setViewportStyle({
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "100svh",
          maxHeight: "100svh",
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        });
      }
      const typing = document.activeElement === chatInputRef.current;
      if (!typing) {
        setTimeout(() => {
          scrollToBottom(false);
        }, 50);
      }
    };

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", updateViewport);
      vv.addEventListener("scroll", updateViewport);
    }
    window.addEventListener("resize", updateViewport);
    updateViewport();

    return () => {
      if (vv) {
        vv.removeEventListener("resize", updateViewport);
        vv.removeEventListener("scroll", updateViewport);
      }
      window.removeEventListener("resize", updateViewport);
    };
  }, [scrollToBottom]);

  // Scroll to bottom on message updates
  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isTyping, scrollToBottom]);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech = Boolean(
        (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition
      );
      setSpeechSupported(hasSpeech);
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast(isHi ? "कृपया फोटो फ़ाइल चुनें" : "Please select an image file", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target?.result as string);
      showToast(isHi ? "फोटो जुड़ गई ✓" : "Photo attached ✓");
    };
    reader.readAsDataURL(file);
  };

  // Real Speech Recognition handler
  const stopVoiceRecording = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setRecordSeconds(0);
  }, []);

  const startVoiceRecording = useCallback(async () => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      showToast(
        isHi
          ? "माइक सपोर्ट नहीं मिला — कृपया सवाल लिखकर पूछें"
          : "Voice input not supported in this browser",
        "error"
      );
      return;
    }

    // Request microphone permission cleanly
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        showToast(
          isHi
            ? "माइक की अनुमति नहीं मिली — ब्राउज़र सेटिंग्स में Microphone Allow करें"
            : "Microphone permission denied",
          "error"
        );
        return;
      }
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "hi-IN";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordSeconds(0);
        showToast(isHi ? "आवाज़ रिकॉर्डिंग शुरू… बोलें" : "Listening… speak now");
        timerIntervalRef.current = setInterval(() => {
          setRecordSeconds((s) => s + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let completeTranscript = "";
        for (let i = 0; i < event.results.length; ++i) {
          completeTranscript += event.results[i][0].transcript;
        }
        if (completeTranscript.trim()) {
          setInputText(completeTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        const errType = event?.error;
        if (errType !== "no-speech") {
          showToast(
            isHi
              ? "माइक में दिक्कत आई — कृपया पुनः प्रयास करें"
              : "Voice recognition error",
            "error"
          );
        }
        stopVoiceRecording();
      };

      recognition.onend = () => {
        stopVoiceRecording();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      showToast(isHi ? "माइक शुरू नहीं हो सका" : "Could not start microphone", "error");
      stopVoiceRecording();
    }
  }, [isHi, showToast, stopVoiceRecording]);

  const handleToggleVoice = () => {
    if (isRecording) {
      stopVoiceRecording();
      showToast(isHi ? "आवाज़ दर्ज हो गई ✓" : "Voice saved ✓");
    } else {
      startVoiceRecording();
    }
  };

  const voiceBooted = useRef(false);
  useEffect(() => {
    if (voiceBooted.current) return;
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("voice") !== "1") return;
    voiceBooted.current = true;
    void startVoiceRecording();
  }, [startVoiceRecording]);

  // Clean up timer/recognition on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleSend = () => {
    if (isRecording) {
      stopVoiceRecording();
    }

    if (!inputText.trim() && !photoPreview) return;

    const timeNow = new Date().toLocaleTimeString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const currentText = inputText.trim();
    const currentPhoto = photoPreview;
    const currentCropName =
      selectedCrop === "general" ? "सामान्य कृषि प्रश्न" : selectedCropObj.nameHi;

    const ticketNum = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `AGV-${ticketNum}`;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text:
        currentText ||
        (currentPhoto
          ? "कृषि डॉक्टर, कृपया इस फोटो को देखकर बीमारी और दवा बताएं।"
          : ""),
      photo: currentPhoto || undefined,
      time: timeNow,
      cropName: currentCropName,
      ticketId,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setPhotoPreview(null);
    setIsTyping(true);

    // Contextual intelligent doctor response tailored to what was actually asked
    const tailoredAdvice = generateDoctorAdvice(
      currentText || "रोग पहचान फोटो",
      selectedCrop,
      currentCropName
    );

    // Save to user query history (persisted in local storage and routed to /my-queries)
    addQuery({
      crop: selectedCrop,
      cropName: currentCropName,
      query: currentText || "फोटो द्वारा रोग जांच",
      image: currentPhoto || undefined,
      farmerName: profile.name || "आप",
      expertResponse: {
        expertName: "AgriVeda कृषि डॉक्टर",
        date: "उत्तर प्राप्त",
        preview: tailoredAdvice.slice(0, 140) + "…",
        fullAnswer: tailoredAdvice,
      },
    });

    // Background push to server expert query ticket
    try {
      fetch("/api/expert-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryText: currentText || "फोटो द्वारा रोग जांच परामर्श",
          cropName: currentCropName,
          cropSlug: selectedCrop,
          farmerName: profile.name || "किसान भाई",
        }),
      }).catch(() => {
        // graceful offline fallback
      });
    } catch {
      // ignore
    }

    // Realistic doctor consultation reply
    setTimeout(() => {
      setIsTyping(false);
      const doctorMessage: ChatMessage = {
        id: `doc-${Date.now()}`,
        sender: "doctor",
        text: tailoredAdvice,
        time: new Date().toLocaleTimeString("hi-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, doctorMessage]);
    }, 1200);
  };

  const activeSuggestions =
    CROP_SUGGESTIONS[selectedCrop] || CROP_SUGGESTIONS.general;
  const onlyWelcome =
    messages.length === 1 && messages[0]?.id === "msg-welcome";

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex h-[100svh] max-h-[100svh] w-full max-w-full select-none flex-col overflow-hidden overflow-x-hidden overscroll-none bg-[#F8FAF9] text-[var(--av-text-primary)] dark:bg-[var(--av-surface-muted)]"
      style={viewportStyle}
    >
      <header className="shrink-0 border-b border-[#b7dcc8] bg-[#f4fbf7] dark:border-white/10 dark:bg-[var(--av-surface)]">
        <div className="flex items-center gap-2.5 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--av-text-primary)] active:bg-[var(--av-surface-inset)]"
            aria-label="वापस"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-mark.png"
            alt=""
            className="h-10 w-10 shrink-0 object-contain"
          />

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#8a6a32]">
              AGRIVEDA
            </p>
            <h1 className="truncate text-[16px] font-semibold leading-tight text-[var(--av-text-primary)]">
              कृषि डॉक्टर
            </h1>
          </div>

          <Link
            href="/my-queries"
            className="shrink-0 text-[13px] font-semibold text-[#0f6b45] dark:text-emerald-300"
          >
            पुराने जवाब
            {queries.length > 0 ? ` · ${queries.length}` : ""}
          </Link>
        </div>
      </header>

      <div className="shrink-0 border-b border-[#d5eadc] bg-[#f4fbf7] px-3 pb-3 pt-2.5 dark:border-white/10 dark:bg-[var(--av-surface)]">
        <p className="mb-1.5 text-[13px] font-semibold text-[var(--av-text-secondary)]">
          किस फसल पर बात करें
        </p>
        <div className="flex w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {COMMON_CROP_CHIPS.map((chip) => {
            const active = selectedCrop === chip.slug;
            return (
              <button
                key={chip.slug}
                type="button"
                onClick={() => setSelectedCrop(chip.slug)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold active:scale-[0.98] ${
                  active
                    ? "bg-[#059669] text-white shadow-[var(--av-shadow-sm)]"
                    : "border border-[#cfe5d8] bg-white text-[var(--av-text-primary)] dark:border-white/10 dark:bg-[var(--av-surface-muted)]"
                }`}
              >
                {chip.nameHi}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain select-text [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          onlyWelcome ? "flex flex-col" : "space-y-3 px-4 py-4"
        }`}
      >
        {onlyWelcome ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-4 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b7dcc8] bg-[#f4fbf7] text-[#0f6b45] shadow-[var(--av-shadow-sm)] dark:bg-[var(--av-surface)] dark:text-emerald-200">
              <Leaf className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-[18px] font-semibold leading-tight text-[var(--av-text-primary)]">
              नमस्ते किसान भाई
            </h2>
            <span className="mt-2.5 h-px w-10 bg-[#a6843e]" />
            {selectedCrop !== "general" ? (
              <p className="mt-2.5 text-[15px] font-semibold text-[#0f6b45] dark:text-emerald-200">
                {selectedCropObj.nameHi}
              </p>
            ) : null}
            <p className="mt-2.5 max-w-[22rem] select-text text-[15px] font-medium leading-snug text-[var(--av-text-secondary)]">
              {messages[0]?.text}
            </p>
          </div>
        ) : null}

        {!onlyWelcome ? (
        <p className="text-center text-[12px] font-medium text-[var(--av-text-muted)]">
          आज
        </p>
        ) : null}

        {!onlyWelcome && messages.map((m) => {
          const isMe = m.sender === "user";
          const isWelcome = m.id === "msg-welcome";
          if (isWelcome) {
            if (messages.some((item) => item.sender === "user")) return null;
            return (
              <div
                key={m.id}
                className="rounded-3xl border border-[#E5E7EB] bg-white px-4 py-4 dark:bg-[var(--av-surface)]"
              >
                <p className="text-[13px] font-semibold text-[#8a6a32]">
                  नमस्ते किसान भाई
                </p>
                <p className="mt-1.5 select-text text-[15px] font-medium leading-snug text-[var(--av-text-primary)]">
                  {m.text}
                </p>
              </div>
            );
          }
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] px-3.5 py-3 sm:max-w-[75%] ${
                  isMe
                    ? "rounded-[22px] rounded-br-md bg-[#14532D] text-white"
                    : "rounded-[22px] rounded-bl-md border border-[#E5E7EB] border-l-[3px] border-l-[#16A34A] bg-white text-[var(--av-text-primary)] dark:border-white/10 dark:bg-[var(--av-surface)]"
                }`}
              >
                {isMe && m.cropName ? (
                  <p className="mb-1 text-[12px] font-semibold text-[#e7d7b1]">
                    {m.cropName}
                  </p>
                ) : null}

                {m.photo ? (
                  <div className="mb-2.5 overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.photo}
                      alt="फसल की फोटो"
                      className="max-h-60 w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="select-text whitespace-pre-wrap text-[15px] font-medium leading-snug">
                  <MessageBody text={m.text} />
                </div>
                <p
                  className={`mt-1.5 text-right text-[11px] ${
                    isMe ? "text-[#d9cba8]" : "text-[var(--av-text-muted)]"
                  }`}
                >
                  {m.time}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping ? (
          <p className="text-[13px] font-medium text-[var(--av-text-secondary)]">
            जवाब लिख रहे हैं…
          </p>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      {/* Part C: Bottom Input Bar (shrink-0 mt-auto) */}
      <div
        className={cn(
          "mt-auto w-full max-w-full shrink-0 border-t border-[#d5eadc] bg-[#f4fbf7] dark:border-white/10 dark:bg-[var(--av-surface)]",
          keyboardOpen
            ? "pb-2"
            : "pb-[max(1rem,env(safe-area-inset-bottom))]"
        )}
      >
        <div className="border-b border-[var(--av-border-subtle)] px-3 py-2.5">
          <p className="mb-1.5 text-[13px] font-semibold text-[var(--av-text-secondary)]">
            ये पूछ सकते हैं
          </p>
          <div className="flex w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {activeSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setInputText(prompt);
                  scrollToBottom(true);
                }}
                className="shrink-0 rounded-full border border-[#b7dcc8] bg-[#e8f6ee] px-3 py-1.5 text-[13px] font-semibold text-[var(--av-text-primary)] active:scale-[0.98] dark:bg-[var(--av-surface-muted)]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Live Voice Recording Status Overlay & Photo Preview */}
        <div className="p-2.5 pt-1 space-y-2">
          {isRecording && (
            <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-300">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping" />
                <div className="flex flex-col">
                  <span className="text-xs font-black">
                    आवाज़ सुनी जा रही है… बोलें ({recordSeconds}s)
                  </span>
                  <span className="text-[10px] opacity-80">
                    बोलने के बाद 'सही' दबाएं या सीधे भेजें
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="flex h-8 items-center gap-1 rounded-xl bg-emerald-600 px-2.5 text-xs font-bold text-white shadow-xs active:scale-95"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>हो गया</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopVoiceRecording();
                    setInputText("");
                  }}
                  className="rounded-xl p-1.5 text-stone-500 hover:bg-black/10 dark:text-stone-300"
                  title="रद्द करें"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {photoPreview && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Selected"
                  className="h-11 w-11 rounded-lg object-cover border border-emerald-600/30"
                />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                  बीमारी/पत्ती की फोटो तैयार है ✓
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="rounded-full p-1.5 text-stone-500 hover:bg-black/10 dark:text-stone-300"
                title="फोटो हटाएं"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Input Controls Row */}
          <div className="flex min-w-0 items-center gap-2">
            {/* File Upload Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {/* Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d5eadc] bg-[#e8f6ee] text-[#0f6b45] active:scale-95 dark:border-white/10 dark:bg-[var(--av-surface-muted)] dark:text-emerald-200"
              title="पत्ती या कीड़े की फोटो जोड़ें"
            >
              <Camera className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleToggleVoice}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:scale-95 ${
                isRecording
                  ? "bg-rose-600 text-white"
                  : "border border-[#d5eadc] bg-[#e8f6ee] text-[#0f6b45] dark:border-white/10 dark:bg-[var(--av-surface-muted)] dark:text-emerald-200"
              }`}
              title="बोलकर सवाल पूछें"
            >
              {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            {/* Text Input Field */}
            <input
              ref={chatInputRef}
              type="text"
              autoFocus
              enterKeyHint="send"
              autoComplete="off"
              placeholder={
                isRecording
                  ? "आपकी आवाज़ दर्ज हो रही है… बोलें"
                  : selectedCrop === "general"
                  ? "फसल की समस्या या सवाल लिखें…"
                  : `${selectedCropObj.nameHi} में क्या समस्या है? लिखें…`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => {
                setTimeout(() => scrollToBottom(true), 100);
                setTimeout(() => scrollToBottom(true), 300);
                setTimeout(() => scrollToBottom(true), 500);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="h-12 min-w-0 flex-1 rounded-full border border-[#cfe5d8] bg-white px-4 text-[16px] font-medium text-[var(--av-text-primary)] outline-none focus:border-[#059669] dark:border-white/15 dark:bg-[var(--av-surface-muted)]"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() && !photoPreview}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#059669] text-white shadow-[var(--av-shadow-sm)] active:scale-95 disabled:opacity-40"
              title="भेजें"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
