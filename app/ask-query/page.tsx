"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCheck,
  ImagePlus,
  Mic,
  MicOff,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Stethoscope,
  X,
} from "lucide-react";
import { AgriAiQuerySparkleIcon } from "@/components/brand/icons";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropEmoji, getCropHindiName } from "@/lib/crops/crop-display";
import {
  buildExpertQueryText,
  clearAiDoctorExpertReferral,
  readAiDoctorExpertReferral,
  type AiDoctorExpertReferral,
} from "@/lib/aiDoctorExpertReferral";
import { cn } from "@/lib/cn";

interface ChatMessage {
  id: string;
  sender: "user" | "doctor";
  text: string;
  photo?: string;
  isAudio?: boolean;
  audioDuration?: string;
  time: string;
  cropName?: string;
}

const COMMON_CROP_CHIPS = [
  { slug: "paddy", nameHi: "धान", emoji: "🌾" },
  { slug: "wheat", nameHi: "गेहूं", emoji: "🌾" },
  { slug: "mustard", nameHi: "सरसों", emoji: "🌼" },
  { slug: "tomato", nameHi: "टमाटर", emoji: "🍅" },
  { slug: "maize", nameHi: "मक्का", emoji: "🌽" },
  { slug: "potato", nameHi: "आलू", emoji: "🥔" },
  { slug: "soybean", nameHi: "सोयाबीन", emoji: "🫘" },
  { slug: "cotton", nameHi: "कपास", emoji: "🌱" },
];

function generateDoctorAdvice(queryText: string, cropSlug: string, cropName: string): string {
  const text = queryText.toLowerCase();

  if (cropSlug === "paddy" || text.includes("धान") || text.includes("paddy")) {
    if (text.includes("पील") || text.includes("yellow") || text.includes("पत्ता")) {
      return `🌾 **धान - पत्ती पीली पड़ने का समाधान:**\n\n1. **निदान:** यह जिंक (खैरा रोग) या नाइट्रोजन की कमी हो सकती है।\n2. **उपाय:** जिंक सल्फेट 33% @ 5 kg/एकड़ यूरिया के साथ दें।\n3. **छिड़काव:** यदि कल्ले फूट रहे हों तो चिलेटेड जिंक (Zn-EDTA 12%) @ 1 ग्राम/लीटर या 19:19:19 @ 5 ग्राम/लीटर पानी में स्प्रे करें।\n4. **सावधानी:** जिंक और DAP को एक साथ कभी न मिलाएँ।`;
    }
    if (text.includes("सुंडी") || text.includes("कीट") || text.includes("छेदक") || text.includes("borer")) {
      return `🌾 **धान - तना छेदक व पत्ता लपेटक नियंत्रण:**\n\n1. **दवा:** कोराजन (क्लोरेंट्रानिलिप्रोल 18.5% SC) @ 60 ml प्रति एकड़।\n2. **पानी:** 150 लीटर पानी में घोलकर दोपहर बाद स्प्रे करें।\n3. **वैकल्पिक दवा:** कारटाप हाइड्रोक्लोराइड 4% GR @ 7.5 kg प्रति एकड़ मिट्टी में डालें।`;
    }
    return `🌾 **धान फसल परामर्श:**\n\nधान में अच्छी बढ़वार के लिए खेत में 2-3 सेमी पानी बनाए रखें। कल्ले फूटते समय यूरिया 30 kg/एकड़ के साथ जिंक की टॉप-ड्रेसिंग करें। किसी बीमारी के लक्षण दिखें तो तुरंत फोटो भेजें।`;
  }

  if (cropSlug === "wheat" || text.includes("गेहूं") || text.includes("wheat")) {
    if (text.includes("पील") || text.includes("रतुआ") || text.includes("rust")) {
      return `🌾 **गेहूं - पीला रतुआ (Yellow Rust) व पीलापन:**\n\n1. **निदान:** पत्तियों पर हल्दी जैसी पीली धारियां रतुआ का संकेत हैं।\n2. **दवा:** प्रोपिकोनाजोल 25% EC (टिल्ट) @ 200 ml प्रति एकड़ 200 लीटर पानी में स्प्रे करें।\n3. **दौरा:** 12-15 दिन बाद जरूरत पड़ने पर टेबुकोनाजोल का दूसरा स्प्रे करें।`;
    }
    if (text.includes("माहू") || text.includes("चेपा") || text.includes("aphid")) {
      return `🌾 **गेहूं - माहू (चेपा) कीट नियंत्रण:**\n\n1. **दवा:** थायमेथोक्सम 25% WG @ 80 ग्राम प्रति एकड़ या इमिडाक्लोप्रिड 17.8% SL @ 60 ml/एकड़।\n2. **सावधानी:** फूल खिलते समय तेज धूप में स्प्रे न करें।`;
    }
    return `🌾 **गेहूं फसल परामर्श:**\n\nबुवाई के 21 दिन पर पहली सिंचाई (CRI स्टेज) अवश्य करें। सिंचाई के 2 दिन बाद यूरिया 40 kg/एकड़ डालें। चौड़ी पत्ती के खरपतवार के लिए 2,4-D अमाइन का प्रयोग करें।`;
  }

  if (cropSlug === "tomato" || text.includes("टमाटर") || text.includes("tomato")) {
    if (text.includes("मरोड़") || text.includes("curl") || text.includes("पत्ता")) {
      return `🍅 **टमाटर - पत्ता मरोड़ वायरस (Leaf Curl):**\n\n1. **कारण:** यह वायरस सफेद मक्खी (Whitefly) द्वारा फैलता है।\n2. **नियंत्रण:** सफेद मक्खी के लिए पेगासस (डायफेनथियूरॉन 50% WP) @ 250 ग्राम/एकड़ या एसिटामिप्रिड 20% SP @ 60 ग्राम/एकड़ स्प्रे करें।\n3. **पीले ट्रैप:** खेत में 8-10 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं।`;
    }
    return `🍅 **टमाटर फसल परामर्श:**\n\nफल छेदक सुंडी से बचाव हेतु कोराजन @ 60 ml/एकड़ का स्प्रे करें। फल का निचला हिस्सा काला (BER) न पड़े इसके लिए कैल्शियम नाइट्रेट 5 ग्राम/लीटर का स्प्रे करें।`;
  }

  if (cropSlug === "mustard" || text.includes("सरसों") || text.includes("mustard")) {
    return `🌼 **सरसों - माहू कीट व पोषण सलाह:**\n\n1. **माहू नियंत्रण:** इमिडाक्लोप्रिड 17.8% SL @ 60-70 ml प्रति एकड़ 150 लीटर पानी में छिड़कें।\n2. **सल्फर की खुराक:** दानों में तेल की मात्रा बढ़ाने के लिए सल्फर 90% दानेदार @ 3-4 kg/एकड़ मिट्टी में दें।\n3. **सफेद रतुआ:** लक्षण दिखते ही मैंकोजेब 75% WP @ 500 ग्राम/एकड़ का छिड़काव करें।`;
  }

  return `👨‍🌾 **${cropName} फसल विशेषज्ञ सलाह:**\n\nआपकी समस्या नोट कर ली गई है। सामान्य तौर पर इस अवस्था में संतुलित NPK 19:19:19 @ 1 kg/एकड़ का स्प्रे पौधों को नई ऊर्जा देता है। यदि कीट का प्रकोप है तो क्लोरपायरीफॉस या इमिडाक्लोप्रिड का छिड़काव करें। सटीक दवा के लिए प्रभावित पत्ती या कीड़े की स्पष्ट फोटो भेजें।`;
}

export default function AskQueryPage() {
  const router = useRouter();
  const { crops, hydrated } = useMyCrops();
  const { queries, addQuery } = useQueryHistory();
  const { profile } = useFarmerProfile();
  const { showToast } = useToast();
  const { locale } = useLocale();
  const isHi = locale === "hi";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedCrop, setSelectedCrop] = useState<string>("general");
  const [inputText, setInputText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const selectedCropObj =
    COMMON_CROP_CHIPS.find((c) => c.slug === selectedCrop) || { slug: "general", nameHi: "सामान्य सवाल", emoji: "🌱" };

  // Initialize chat messages with welcome note and past user queries
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initial: ChatMessage[] = [
      {
        id: "msg-welcome",
        sender: "doctor",
        text: "नमस्ते किसान भाई! 🙏 यह AgriVeda कृषि विशेषज्ञ (Human Doctor) चैट है।\n\nयहाँ आप अपनी फसल की बीमारी, कीट या खाद-पानी संबंधी सवाल और फोटो भेज सकते हैं। आपका सवाल सीधे हमारे विशेषज्ञ डॉक्टर के पास पहुंचेगा और वे जांच करके आपको यहीं सही दवा और खुराक बताएंगे।",
        time: "अभी",
      },
    ];

    // Load existing queries from history into conversation
    if (queries && queries.length > 0) {
      queries.slice(0, 5).reverse().forEach((q) => {
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
    const fromDoctor = new URLSearchParams(window.location.search).get("from") === "ai-doctor";
    if (!fromDoctor) return;

    const referral = readAiDoctorExpertReferral();
    if (!referral) return;

    const cropLabel =
      referral.cropSlug === "other" && referral.result.cropContext
        ? referral.result.cropContext
        : referral.cropName;

    setSelectedCrop(referral.cropSlug);
    const referralText = buildExpertQueryText({ ...referral, cropName: cropLabel });

    // Send the referral into chat
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

    // Human doctor acknowledgement
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

  const handleSend = () => {
    if (!inputText.trim() && !photoPreview) return;

    const timeNow = new Date().toLocaleTimeString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const currentText = inputText.trim();
    const currentPhoto = photoPreview;
    const currentCropName = selectedCrop === "general" ? undefined : selectedCropObj.nameHi;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: currentText || (currentPhoto ? "कृषि डॉक्टर, कृपया इस फोटो को देखकर बीमारी और दवा बताएं।" : ""),
      photo: currentPhoto || undefined,
      time: timeNow,
      cropName: currentCropName,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setPhotoPreview(null);
    setIsTyping(true);

    // Save to user query history (routed to expert admin queue)
    addQuery({
      crop: selectedCrop,
      cropName: currentCropName || "सामान्य कृषि प्रश्न",
      query: currentText || "फोटो द्वारा रोग जांच",
      image: currentPhoto || undefined,
      farmerName: profile.name || "आप",
      expertResponse: {
        expertName: "AgriVeda कृषि विशेषज्ञ",
        date: "प्रतीक्षारत",
        preview: "आपका सवाल और फोटो हमारे कृषि विशेषज्ञ डॉक्टर के पास भेज दिया गया है।",
        fullAnswer: "आपका सवाल और फोटो हमारे कृषि विशेषज्ञ डॉक्टर के पास भेज दिया गया है। डॉक्टर साहब जांच करके जल्द ही आपको यहीं जवाब भेजेंगे।",
      },
    });

    // Human doctor acknowledgement message (NO instant AI bot reply)
    setTimeout(() => {
      setIsTyping(false);
      const ackMessage: ChatMessage = {
        id: `doc-ack-${Date.now()}`,
        sender: "doctor",
        text: "👨‍🌾 **आपका सवाल और फोटो हमारे कृषि विशेषज्ञ डॉक्टर के पास भेज दिया गया है।**\n\nडॉक्टर साहब जांच करके जल्द ही आपको यहीं जवाब भेजेंगे।",
        time: new Date().toLocaleTimeString("hi-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, ackMessage]);
    }, 1000);
  };

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast(isHi ? "वॉइस रिकॉर्डिंग शुरू… बोलें" : "Listening… speak now");
      // Simulation of voice recognition
      setTimeout(() => {
        setIsRecording(false);
        setInputText("धान में पत्तियां पीली पड़ रही हैं और किनारे सूख रहे हैं, क्या करें?");
        showToast(isHi ? "आवाज़ दर्ज हो गई ✓" : "Voice transcribed ✓");
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-[#efeae2] dark:bg-[#0b141a]">
      {/* WhatsApp-style Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-[#008069] px-3 py-2.5 text-white shadow-md dark:bg-[#1f2c34]">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full p-1 text-white hover:bg-white/10 active:scale-95"
            aria-label="वापस"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold backdrop-blur-sm border border-white/20">
              👨‍🌾
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#008069] bg-emerald-400 dark:border-[#1f2c34]" />
          </div>

          <div>
            <h1 className="text-[15px] font-bold leading-tight text-white">
              AgriVeda कृषि डॉक्टर
            </h1>
            <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>ऑनलाइन · तुरंत समाधान</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/kisan-saathi"
            className="rounded-full p-2 text-white hover:bg-white/10"
            title="किसान साथी"
          >
            <AgriAiQuerySparkleIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/my-queries"
            className="rounded-full px-2.5 py-1 text-xs font-bold text-white bg-white/15 hover:bg-white/25"
          >
            इतिहास
          </Link>
        </div>
      </header>

      {/* Messages Stream */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Date banner */}
        <div className="flex justify-center">
          <span className="rounded-lg bg-black/10 px-2.5 py-1 text-[11px] font-semibold text-stone-600 backdrop-blur-sm dark:bg-white/10 dark:text-stone-300">
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
                className={`relative max-w-[85%] rounded-2xl p-3 shadow-sm sm:max-w-[70%] ${
                  isMe
                    ? "rounded-tr-none bg-[#d9fdd3] text-stone-900 dark:bg-[#005c4b] dark:text-stone-100"
                    : "rounded-tl-none bg-white text-stone-900 dark:bg-[#202c33] dark:text-stone-100"
                }`}
              >
                {/* Crop Badge if specified by user */}
                {isMe && m.cropName && (
                  <span className="mb-1 inline-block rounded-md bg-black/10 px-1.5 py-0.5 text-[10px] font-bold dark:bg-white/10">
                    🌾 {m.cropName}
                  </span>
                )}

                {/* Photo attachment if present */}
                {m.photo && (
                  <div className="mb-2 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.photo}
                      alt="Crop disease photo"
                      className="max-h-56 w-full object-cover"
                    />
                  </div>
                )}

                {/* Message text with basic markdown formatting */}
                <div className="whitespace-pre-wrap text-[13.5px] leading-relaxed">
                  {m.text}
                </div>

                {/* Timestamp & Read ticks */}
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-medium text-stone-500 dark:text-stone-400">
                  <span>{m.time}</span>
                  {isMe && <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-600 shadow-sm dark:bg-[#202c33] dark:text-stone-300">
              <span>डॉक्टर जवाब लिख रहे हैं</span>
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
      <div className="border-t border-black/5 bg-[#efeae2]/80 px-3 py-1.5 dark:border-white/5 dark:bg-[#0b141a]/80">
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            "पीली पत्ती का इलाज?",
            "सुंडी की अचूक दवा?",
            "कल्ले बढ़ाने का उपाय?",
            "खरपतवार नाशक स्प्रे?",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setInputText(prompt);
              }}
              className="shrink-0 rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-stone-800 hover:bg-white active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-stone-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Bottom Input Bar (WhatsApp style) */}
      <div className="border-t border-black/10 bg-white p-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg dark:border-white/10 dark:bg-[#202c33]">
        {/* Compact Crop Selector Pills above input */}
        <div className="mb-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-[11px] font-bold text-stone-500 dark:text-stone-400">
            🌾 फसल:
          </span>
          {[{ slug: "general", nameHi: "सामान्य प्रश्न", emoji: "🌱" }, ...COMMON_CROP_CHIPS].map((chip) => {
            const active = selectedCrop === chip.slug;
            return (
              <button
                key={chip.slug}
                type="button"
                onClick={() => setSelectedCrop(chip.slug)}
                className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition active:scale-95 ${
                  active
                    ? "bg-[#008069] text-white shadow-xs dark:bg-emerald-600"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                }`}
              >
                <span>{chip.emoji}</span>
                <span>{chip.nameHi}</span>
              </button>
            );
          })}
        </div>

        {/* Photo preview bubble before sending */}
        {photoPreview && (
          <div className="mb-2 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Selected"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                फोटो तैयार है ✓
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPhotoPreview(null)}
              className="rounded-full p-1 text-stone-500 hover:bg-black/10 dark:text-stone-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* File Upload Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 active:scale-95 dark:text-stone-300 dark:hover:bg-white/10"
            title="फोटो जोड़ें"
          >
            <Camera className="h-5 w-5" />
          </button>

          {/* Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${
              isRecording
                ? "bg-rose-500 text-white animate-pulse"
                : "text-stone-500 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/10"
            }`}
            title="बोलकर पूछें"
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            placeholder={
              isRecording
                ? "बोलें, आवाज़ दर्ज हो रही है…"
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
            className="flex-1 rounded-2xl border border-stone-200 bg-stone-100 px-3.5 py-2 text-sm text-stone-900 outline-none transition focus:border-[#008069] focus:bg-white dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:focus:border-emerald-500"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() && !photoPreview}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#008069] text-white shadow-md transition hover:bg-[#00705c] active:scale-95 disabled:opacity-40 dark:bg-emerald-600"
            title="भेजें"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
