"use client";

import React, { useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Copy,
  Check,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { AgriVedaSparkleIcon } from "@/components/brand/icons";
import { getAgrivedaShareData, softTap } from "@/lib/appEssentials";

interface ShareAgrivedaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "hi" | "en";
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.194 1.006.131.832.926z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function ShareAgrivedaModal({
  isOpen,
  onClose,
  lang = "hi",
}: ShareAgrivedaModalProps) {
  useBodyScrollLock(isOpen);
  const isHi = lang === "hi";
  const [copied, setCopied] = useState(false);
  const { title, text, url } = getAgrivedaShareData();

  const fullShareText = `${text}\n\n👇 अभी देखें / खोलें:\n${url}`;

  const handleCopy = async () => {
    softTap(15);
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  const handleWhatsApp = () => {
    softTap();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleTelegram = () => {
    softTap();
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, "_blank", "noopener,noreferrer");
  };

  const handleSms = () => {
    softTap();
    const smsUrl = `sms:?body=${encodeURIComponent(fullShareText)}`;
    window.location.href = smsUrl;
  };

  const handleFacebook = () => {
    softTap();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    softTap();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: fullShareText, url });
        onClose();
      } catch {
        // user cancelled
      }
    }
  };

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 touch-none select-none overscroll-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm touch-none overscroll-none"
          />

          {/* Modal / Centered Dialog */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-lg rounded-[28px] border border-emerald-500/25 bg-[var(--av-surface)] p-5 sm:p-6 shadow-2xl shadow-emerald-950/40 text-[var(--foreground)] overflow-hidden touch-auto max-h-[88vh] overflow-y-auto"
          >
            {/* Top Drag Handle (Mobile) */}
            <div className="mx-auto -mt-1 mb-4 h-1.5 w-12 rounded-full bg-stone-300 dark:bg-stone-700 sm:hidden" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-600/25">
                  <Share2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[var(--av-text-primary)]">
                    {isHi ? "एग्रीवेदा को और लोगों तक पहुँचाएँ" : "Share AgriVeda with others"}
                  </h3>
                  <p className="text-xs text-[var(--av-text-muted)] font-medium">
                    {isHi
                      ? "किसान भाई, मित्र व परिजनों के साथ साझा करें"
                      : "Share with farmers, friends & family"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Share Grid / Options */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsApp}
                className="group flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50/70 p-3 text-left transition hover:bg-emerald-100/80 hover:border-emerald-500/40 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition group-hover:scale-105">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                    {isHi ? "व्हाट्सएप" : "WhatsApp"}
                  </div>
                  <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400 truncate">
                    {isHi ? "सीधे चैट / ग्रुप में" : "Chat or group"}
                  </div>
                </div>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={handleTelegram}
                className="group flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-50/70 p-3 text-left transition hover:bg-sky-100/80 hover:border-sky-500/40 dark:bg-sky-950/30 dark:hover:bg-sky-900/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-600/30 transition group-hover:scale-105">
                  <TelegramIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-sky-900 dark:text-sky-200">
                    {isHi ? "टेलीग्राम" : "Telegram"}
                  </div>
                  <div className="text-[10px] text-sky-700/80 dark:text-sky-400 truncate">
                    {isHi ? "चैनल या दोस्तों को" : "Channel / contact"}
                  </div>
                </div>
              </button>

              {/* SMS */}
              <button
                type="button"
                onClick={handleSms}
                className="group flex items-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-50/70 p-3 text-left transition hover:bg-indigo-100/80 hover:border-indigo-500/40 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition group-hover:scale-105">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-indigo-900 dark:text-indigo-200">
                    {isHi ? "SMS संदेश" : "SMS Text"}
                  </div>
                  <div className="text-[10px] text-indigo-700/80 dark:text-indigo-400 truncate">
                    {isHi ? "फ़ोन मैसेज भेजें" : "Phone message"}
                  </div>
                </div>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleFacebook}
                className="group flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-50/70 p-3 text-left transition hover:bg-blue-100/80 hover:border-blue-500/40 dark:bg-blue-950/30 dark:hover:bg-blue-900/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30 transition group-hover:scale-105">
                  <FacebookIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-blue-900 dark:text-blue-200">
                    {isHi ? "फेसबुक" : "Facebook"}
                  </div>
                  <div className="text-[10px] text-blue-700/80 dark:text-blue-400 truncate">
                    {isHi ? "पोस्ट या ग्रुप में" : "Share on feed"}
                  </div>
                </div>
              </button>
            </div>

            {/* Native Share button (if browser supports Web Share) */}
            {canNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-500/15 dark:text-emerald-300"
              >
                <ExternalLink className="h-4 w-4" />
                {isHi ? "फ़ोन के अन्य सभी ऐप्स देखें (More Apps)" : "More phone apps…"}
              </button>
            )}

            {/* Copy Link Section */}
            <div className="mt-4 rounded-2xl border border-stone-200/80 bg-stone-50/90 p-3 dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-[11px] font-bold text-[var(--av-text-muted)] mb-1.5">
                <span>{isHi ? "सीधा लिंक (Direct Link)" : "App Link"}</span>
                {copied && (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                    {isHi ? "कॉपी हो गया!" : "Copied!"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={url}
                  className="w-full min-w-0 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 select-all focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{isHi ? "कॉपी हुआ" : "Copied"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>{isHi ? "कॉपी करें" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Motivational message */}
            <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              <AgriVedaSparkleIcon className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                {isHi
                  ? "आपके एक शेयर से किसी किसान भाई की फसल रोग से बच सकती है।"
                  : "Your share can help a farmer protect their crop and livelihood."}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
