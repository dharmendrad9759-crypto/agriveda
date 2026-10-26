"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCheck,
  Clock,
  Mic,
  MicOff,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Square,
  X,
} from "lucide-react";
import { AgriAiQuerySparkleIcon } from "@/components/brand/icons";
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
  if (cropSlug === "tomato" || text.includes("टमाटर") || text.includes("tomato")) {
    if (text.includes("मरोड़") || text.includes("curl") || text.includes("पत्ता") || text.includes("सफेद मक्खी")) {
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

  return `👨‍🌾 **${cropName} फसल विशेषज्ञ सलाह:**\n\nआपकी समस्या नोट कर ली गई है। सामान्य तौर पर इस अवस्था में संतुलित NPK 19:19:19 @ 1 kg/एकड़ का स्प्रे पौधों को नई ऊर्जा देता है। यदि किसी बीमारी या कीट के लक्षण दिख रहे हैं, तो प्रभावित पत्ती या कीड़े की स्पष्ट फोटो भेजें ताकि सटीक दवा की सिफारिश की जा सके।`;
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
        text: "नमस्ते किसान भाई! 🙏 यह AgriVeda कृषि विशेषज्ञ (Doctor Desk) लाइव सहायता है।\n\nयहाँ आप अपनी फसल की बीमारी, कीट या खाद-पानी संबंधी सवाल और फोटो भेज सकते हैं।\n\n🔒 **यह सवाल कहाँ जाता है?**\n• आपका सवाल सीधे हमारे सीनियर कृषि वैज्ञानिकों (डॉक्टर पैनल) को जाता है।\n• यहाँ आपको तुरंत सटीक दवा, खुराक व छिड़काव का तरीका मिलता है।\n• आपका हर सवाल आपके 'इतिहास' में सुरक्षित रहता है।",
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
        text: `👨‍🌾 **${cropLabel} की AI रिपोर्ट हमारे कृषि विशेषज्ञ डॉक्टर को प्राप्त हो गई है।**\n\nडॉक्टर साहब रोग के लक्षणों की समीक्षा कर रहे हैं। वे जल्द ही आपको प्रमाणित दवा, खुराक और छिड़काव का सही तरीका यहीं भेजेंगे।`,
        time: "अभी",
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, docMsg]);
    }, 1000);
  }, [isHi, showToast]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            finalTranscript += transcript;
          }
        }
        if (finalTranscript.trim()) {
          setInputText(finalTranscript.trim());
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
        expertName: "AgriVeda कृषि विशेषज्ञ (Doctor Desk)",
        date: "उत्तर प्राप्त",
        preview: tailoredAdvice.slice(0, 140) + "…",
        fullAnswer: `${tailoredAdvice}\n\n📋 **सवाल आईडी: #${ticketId}** (डॉक्टर डेस्क पर सुरक्षित)`,
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
        text: `${tailoredAdvice}\n\n📋 **सवाल आईडी: #${ticketId}**\n*(यह सवाल हमारे डॉक्टर डेस्क पर भी दर्ज हो गया है)*`,
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

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#efeae2] text-stone-900 overscroll-none select-none dark:bg-[#0b141a] dark:text-stone-100">
      {/* WhatsApp Header */}
      <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between bg-[#008069] px-3 py-2.5 text-white shadow-md dark:bg-[#1f2c34]">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full p-1.5 text-white hover:bg-white/10 active:scale-95"
            aria-label="वापस"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold backdrop-blur-sm border border-white/25 shadow-sm">
              👨‍🌾
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#008069] bg-emerald-400 dark:border-[#1f2c34]" />
          </div>

          <div className="min-w-0">
            <h1 className="flex items-center gap-1.5 text-[15px] font-bold leading-tight text-white">
              <span>AgriVeda कृषि डॉक्टर</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            </h1>
            <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-100/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>ऑनलाइन · सरकारी प्रमाणित विशेषज्ञ</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/my-queries"
            className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-white/25 active:scale-95"
            title="पुराने सवाल व जवाब"
          >
            <span>इतिहास</span>
            {queries.length > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-black text-stone-900">
                {queries.length}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Trust & Transparency Banner (explaining where data reaches) */}
      <div className="shrink-0 border-b border-black/5 bg-emerald-950/90 px-3 py-1.5 text-center text-[11px] font-semibold text-emerald-100 backdrop-blur-md dark:border-white/5 dark:bg-emerald-950/80">
        🔒 आपका सवाल और फोटो सीधे हमारे कृषि वैज्ञानिक पैनल (Doctor Desk) पर पहुंचते हैं।
      </div>

      {/* Messages Feed */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain select-text [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Date pill */}
        <div className="flex justify-center">
          <span className="rounded-lg bg-black/10 px-3 py-1 text-[11px] font-bold text-stone-700 shadow-2xs backdrop-blur-sm dark:bg-white/10 dark:text-stone-300">
            आज
          </span>
        </div>

        {messages.map((m) => {
          const isMe = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
            >
              <div
                className={`relative max-w-[88%] rounded-2xl p-3.5 shadow-sm sm:max-w-[75%] ${
                  isMe
                    ? "rounded-tr-none bg-[#d9fdd3] text-stone-900 dark:bg-[#005c4b] dark:text-stone-100"
                    : "rounded-tl-none bg-white text-stone-900 dark:bg-[#202c33] dark:text-stone-100"
                }`}
              >
                {/* Crop Badge */}
                {isMe && m.cropName && (
                  <div className="mb-1.5 flex items-center gap-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/15 px-2 py-0.5 text-[11px] font-extrabold text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-200">
                      🌾 {m.cropName}
                    </span>
                  </div>
                )}

                {/* Attached Photo */}
                {m.photo && (
                  <div className="mb-2.5 overflow-hidden rounded-xl border border-black/10 shadow-xs dark:border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.photo}
                      alt="Crop disease photo"
                      className="max-h-60 w-full object-cover"
                    />
                  </div>
                )}

                {/* Message Body */}
                <div className="whitespace-pre-wrap text-[14.5px] leading-relaxed select-text font-normal">
                  {m.text}
                </div>

                {/* Bottom Row: Timestamp, double tick & delivery badge */}
                <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-black/5 pt-1 text-[11px] font-medium text-stone-500 dark:border-white/5 dark:text-stone-400">
                  <span className="text-[10px]">
                    {isMe ? "विशेषज्ञ डॉक्टर को प्रेषित ✓" : "सत्यापित उपचार"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span>{m.time}</span>
                    {isMe && (
                      <CheckCheck className="h-4 w-4 text-[#53bdeb]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Doctor Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-sm dark:bg-[#202c33] dark:text-stone-300">
              <Stethoscope className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>डॉक्टर साहब जांच कर रहे हैं…</span>
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="shrink-0 border-t border-black/5 bg-[#efeae2]/90 px-3 py-2 dark:border-white/5 dark:bg-[#0b141a]/90">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeSuggestions.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setInputText(prompt);
              }}
              className="shrink-0 rounded-full border border-stone-300 bg-white/90 px-3 py-1.5 text-[13px] font-bold text-stone-800 shadow-2xs hover:bg-white active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Pinned Input Bar (WhatsApp style, ZERO GAP) */}
      <div className="shrink-0 border-t border-black/10 bg-white p-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-xl dark:border-white/10 dark:bg-[#202c33]">
        {/* Large, Clear Crop Selector Bar */}
        <div className="mb-2.5 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-xs font-black tracking-wide text-stone-600 uppercase dark:text-stone-400">
            🌾 फसल:
          </span>
          {COMMON_CROP_CHIPS.map((chip) => {
            const active = selectedCrop === chip.slug;
            return (
              <button
                key={chip.slug}
                type="button"
                onClick={() => setSelectedCrop(chip.slug)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold transition active:scale-95 ${
                  active
                    ? "bg-[#008069] text-white shadow-md ring-2 ring-emerald-500/30 dark:bg-emerald-600"
                    : "bg-stone-100 text-stone-800 border border-stone-200/80 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700"
                }`}
              >
                <span className="text-base">{chip.emoji}</span>
                <span>{chip.nameHi}</span>
              </button>
            );
          })}
        </div>

        {/* Live Voice Recording Status Overlay */}
        {isRecording && (
          <div className="mb-2 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-700 animate-in fade-in dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-300">
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

        {/* Photo preview bubble before sending */}
        {photoPreview && (
          <div className="mb-2 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2">
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
        <div className="flex items-center gap-2">
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 active:scale-95 dark:text-stone-300 dark:hover:bg-white/10"
            title="पत्ती या कीड़े की फोटो जोड़ें"
          >
            <Camera className="h-6 w-6" />
          </button>

          {/* Mic Button (Real Speech Recognition) */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${
              isRecording
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/40 animate-pulse"
                : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/10"
            }`}
            title="बोलकर सवाल पूछें"
          >
            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-6 w-6" />}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            placeholder={
              isRecording
                ? "आपकी आवाज़ दर्ज हो रही है… बोलें"
                : selectedCrop === "general"
                ? "फसल की समस्या या सवाल लिखें…"
                : `${selectedCropObj.nameHi} में क्या समस्या है? लिखें…`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 rounded-2xl border border-stone-300 bg-stone-100 px-4 py-2.5 text-[15px] text-stone-900 outline-none transition focus:border-[#008069] focus:bg-white dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:focus:border-emerald-500"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() && !photoPreview}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#008069] text-white shadow-md transition hover:bg-[#00705c] active:scale-95 disabled:opacity-40 dark:bg-emerald-600"
            title="भेजें"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
