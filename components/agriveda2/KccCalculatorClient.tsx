"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  Banknote,
  PiggyBank,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Percent,
  Calendar,
  Sparkles,
  Tractor,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";

type CalcMode = "kcc" | "term";

export default function KccCalculatorClient() {
  const [mode, setMode] = useState<CalcMode>("kcc");

  // KCC State
  const [kccAmount, setKccAmount] = useState<string>("160000"); // Standard ₹1.60L collateral-free
  const [kccMonths, setKccMonths] = useState<number>(12); // Standard 1 year crop cycle
  const [kccCopied, setKccCopied] = useState(false);

  // Term Loan State
  const [termAmount, setTermAmount] = useState<string>("500000"); // e.g. Tractor / Dairy
  const [termRate, setTermRate] = useState<string>("9.5"); // Typical farm term loan 9-10%
  const [termYears, setTermYears] = useState<number>(5);
  const [repaymentFreq, setRepaymentFreq] = useState<"monthly" | "halfYearly">("halfYearly");

  // KCC Calculation Logic
  const kccResult = useMemo(() => {
    const P = parseFloat(kccAmount) || 0;
    if (P <= 0) return null;

    const tenureYears = kccMonths / 12;

    // Normal interest @ 7%
    const normalRate = 0.07;
    const normalInterest = P * normalRate * tenureYears;

    // Subsidized net interest @ 4% (7% - 3% Prompt Repayment Incentive up to ₹3 Lakh)
    const subsidizedLimit = 300000;
    const subsidizedP = Math.min(P, subsidizedLimit);
    const regularP = Math.max(0, P - subsidizedLimit);

    const netInterestSubsidized = subsidizedP * 0.04 * tenureYears;
    const netInterestRegular = regularP * normalRate * tenureYears;
    const totalNetInterest = netInterestSubsidized + netInterestRegular;

    const totalSavings = normalInterest - totalNetInterest;
    const totalPayableWithIncentive = P + totalNetInterest;
    const totalPayableDefault = P + normalInterest;

    return {
      principal: P,
      normalInterest: Math.round(normalInterest),
      netInterest: Math.round(totalNetInterest),
      savings: Math.round(totalSavings),
      totalPayable: Math.round(totalPayableWithIncentive),
      totalPayableDefault: Math.round(totalPayableDefault),
      isAboveLimit: P > subsidizedLimit,
    };
  }, [kccAmount, kccMonths]);

  // Term Loan EMI Logic
  const termResult = useMemo(() => {
    const P = parseFloat(termAmount) || 0;
    const rAnnual = (parseFloat(termRate) || 0) / 100;
    const nYears = termYears || 1;

    if (P <= 0 || rAnnual <= 0) return null;

    if (repaymentFreq === "monthly") {
      const n = nYears * 12;
      const r = rAnnual / 12;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - P;
      return {
        installment: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        periods: n,
        labelHi: "मासिक किस्त (Monthly EMI)",
      };
    } else {
      // Half-Yearly (2 times a year, matching Rabi/Kharif harvests)
      const n = nYears * 2;
      const r = rAnnual / 2;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - P;
      return {
        installment: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        periods: n,
        labelHi: "छमाही किस्त (Half-Yearly Instalment - फसल कटाई अनुसार)",
      };
    }
  }, [termAmount, termRate, termYears, repaymentFreq]);

  const handleKccShare = () => {
    if (!kccResult) return;
    const text = `🌾 *Agriveda KCC ब्याज व बचत कैलकुलेटर*\n\n💳 *ऋण राशि:* ₹${kccResult.principal.toLocaleString("en-IN")}\n⏱️ *अवधि:* ${kccMonths} महीने (1 फसल चक्र)\n\n✅ *समय पर चुकाने पर ब्याज (4%):* ₹${kccResult.netInterest.toLocaleString("en-IN")}\n❌ *देरी होने पर ब्याज (7%):* ₹${kccResult.normalInterest.toLocaleString("en-IN")}\n💰 *सीधी सरकारी ब्याज बचत:* ₹${kccResult.savings.toLocaleString("en-IN")}\n\n👉 *कुल वापसी (4% पर):* ₹${kccResult.totalPayable.toLocaleString("en-IN")}\n\nKCC और सरकारी योजनाओं की सटीक जानकारी के लिए Agriveda ऐप डाउनलोड करें!`;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleKccCopy = () => {
    if (!kccResult) return;
    const text = `KCC लोन: ₹${kccResult.principal.toLocaleString("en-IN")} | 4% प्रभावी ब्याज: ₹${kccResult.netInterest.toLocaleString("en-IN")} | सरकारी ब्याज छूट बचत: ₹${kccResult.savings.toLocaleString("en-IN")}`;
    navigator.clipboard?.writeText(text);
    setKccCopied(true);
    setTimeout(() => setKccCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={() => setMode("kcc")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            mode === "kcc"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
              : "theme-text-muted hover:theme-text-primary"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>KCC ब्याज बचत (4%)</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("term")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            mode === "term"
              ? "bg-amber-600 text-white shadow-md shadow-amber-900/40"
              : "theme-text-muted hover:theme-text-primary"
          }`}
        >
          <Tractor className="h-4 w-4" />
          <span>ट्रैक्टर/डेयरी लोन EMI</span>
        </button>
      </div>

      {mode === "kcc" ? (
        <>
          {/* Main KCC Calculator Card */}
          <DarkCard className="p-4 border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-emerald-400" />
                <h2 className="text-base font-bold theme-text-primary">
                  KCC ब्याज व बचत कैलकुलेटर
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                4% प्रभावी ब्याज
              </span>
            </div>

            <p className="text-xs theme-text-muted mb-4 leading-relaxed">
              सरकारी नियम अनुसार 7% सामान्य ब्याज में 3% समय पर चुकाने की छूट (Prompt Repayment Incentive) मिलती है, जिससे किसान को शुद्ध केवल <b className="text-emerald-400 font-bold">4% वार्षिक ब्याज</b> ही देना होता है।
            </p>

            {/* Loan Amount Input */}
            <div>
              <label className="block text-xs font-bold theme-text-muted mb-1">
                KCC ऋण राशि (रुपये में)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-lg font-bold text-emerald-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="5000"
                  min="10000"
                  max="1000000"
                  value={kccAmount}
                  onChange={(e) => setKccAmount(e.target.value)}
                  className="theme-input w-full rounded-xl border pl-8 pr-3 py-3 text-lg font-bold"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: "₹50 हज़ार", val: 50000 },
                  { label: "₹1 लाख", val: 100000 },
                  { label: "₹1.60 लाख (बिना बंधक)", val: 160000 },
                  { label: "₹3 लाख (मैक्स 4%)", val: 300000 },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => setKccAmount(String(chip.val))}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      kccAmount === String(chip.val)
                        ? "bg-emerald-600 text-white"
                        : "bg-white/5 theme-text-muted hover:bg-white/10"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Tenure Selector */}
            <div className="mt-4">
              <label className="block text-xs font-bold theme-text-muted mb-1">
                ऋण अवधि (महीने)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "3 माह", val: 3 },
                  { label: "6 माह (1 फसल)", val: 6 },
                  { label: "9 माह", val: 9 },
                  { label: "12 माह (1 वर्ष)", val: 12 },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setKccMonths(t.val)}
                    className={`rounded-xl py-2 px-1 text-xs font-bold transition text-center ${
                      kccMonths === t.val
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white/5 theme-text-muted hover:bg-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Highlights */}
            {kccResult && (
              <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 via-emerald-900/20 to-transparent p-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-semibold theme-text-muted">
                    शुद्ध ब्याज (4% समय पर चुकता दर)
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    ₹{kccResult.netInterest.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-b border-white/10 text-xs">
                  <div>
                    <div className="text-amber-400/80 font-medium">देरी होने पर (7% ब्याज)</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">
                      ₹{kccResult.normalInterest.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-medium flex items-center justify-end gap-1">
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                      <span>आपकी सीधी बचत</span>
                    </div>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">
                      ₹{kccResult.savings.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] theme-text-muted">कुल वापसी (मूल + 4% ब्याज)</div>
                    <div className="text-lg font-black theme-text-primary">
                      ₹{kccResult.totalPayable.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleKccCopy}
                      className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1.5 text-xs font-medium theme-text-primary transition"
                    >
                      {kccCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{kccCopied ? "कॉपी" : "कॉपी"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleKccShare}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition shadow"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>शेयर</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DarkCard>

          {/* Golden Rules of KCC (किसान जरूरी नियम) */}
          <DarkCard className="p-4 border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold theme-text-primary">
                KCC के 4 सुनहरे नियम (ब्याज बचत की गारंटी)
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                <span className="font-bold text-emerald-400 shrink-0">1.</span>
                <span className="theme-text-muted">
                  <b>12 महीने के अंदर एक बार पूरा खाता शून्य (Rollover) करें:</b> फसल बेचने के बाद मूलधन व ब्याज जमा कर दें। अगले ही दिन आप पुनः पैसे निकाल सकते हैं।
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                <span className="font-bold text-emerald-400 shrink-0">2.</span>
                <span className="theme-text-muted">
                  <b>₹1.60 लाख तक कोई जमीन बंधक नहीं:</b> RBI गाइडलाइन अनुसार ₹1,60,000 तक KCC लोन बिना किसी भूमि बंधक (Collateral Free) मिलता है।
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                <span className="font-bold text-emerald-400 shrink-0">3.</span>
                <span className="theme-text-muted">
                  <b>₹3 लाख तक 4% ब्याज सबवेंशन:</b> केंद्र सरकार की 3% ब्याज छूट अधिकतम ₹3,00,000 की लिमिट तक ही लागू होती है। ₹3 लाख से ऊपर 7% या सामान्य बैंक दर लगती है।
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                <span className="font-bold text-emerald-400 shrink-0">4.</span>
                <span className="theme-text-muted">
                  <b>पशुपालन व मछली पालन KCC:</b> बिना खेती की जमीन वाले पशुपालक भी ₹2 लाख तक पशु KCC (गाय/भैंस/बकरी) पर 4% ब्याज का लाभ ले सकते हैं।
                </span>
              </div>
            </div>

            {/* Direct Link to KCC Scheme & JanSamarth */}
            <div className="pt-2">
              <AppLink
                href="/schemes/kcc"
                className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 hover:bg-emerald-900/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-5 w-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-emerald-400">
                      KCC योजना की पूरी जानकारी व ऑनलाइन आवेदन
                    </div>
                    <div className="text-[11px] theme-text-muted">
                      दस्तावेज चेकलिस्ट, JanSamarth पोर्टल गाइड व बैंक शाखा रास्ता
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0" />
              </AppLink>
            </div>
          </DarkCard>
        </>
      ) : (
        <>
          {/* Term Loan EMI Calculator */}
          <DarkCard className="p-4 border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-amber-400" />
                <h2 className="text-base font-bold theme-text-primary">
                  एग्री टर्म लोन EMI कैलकुलेटर
                </h2>
              </div>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                ट्रैक्टर · डेयरी · सोलर पंप
              </span>
            </div>

            <p className="text-xs theme-text-muted mb-4 leading-relaxed">
              ट्रैक्टर, कंबाइन, रोटावेटर, डेयरी शेड या सोलर पंप के लिए बैंक ऋण की मासिक अथवा फसल कटाई (छमाही) अनुसार किस्त का हिसाब निकालें।
            </p>

            {/* Term Loan Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold theme-text-muted mb-1">
                  लोन राशि (Principal Amount)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-lg font-bold text-amber-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="10000"
                    min="20000"
                    value={termAmount}
                    onChange={(e) => setTermAmount(e.target.value)}
                    className="theme-input w-full rounded-xl border pl-8 pr-3 py-3 text-lg font-bold"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[200000, 500000, 750000, 1000000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setTermAmount(String(v))}
                      className="rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1 text-xs font-semibold theme-text-muted"
                    >
                      ₹{(v / 100000).toFixed(1)} लाख
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold theme-text-muted mb-1">
                    ब्याज दर (% प्रति वर्ष)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="20"
                    value={termRate}
                    onChange={(e) => setTermRate(e.target.value)}
                    className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold theme-text-muted mb-1">
                    लोन अवधि (वर्ष)
                  </label>
                  <select
                    value={termYears}
                    onChange={(e) => setTermYears(parseInt(e.target.value) || 1)}
                    className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 7].map((y) => (
                      <option key={y} value={y}>
                        {y} वर्ष ({y * 12} माह)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold theme-text-muted mb-1">
                  किस्त भुगतान का प्रकार
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRepaymentFreq("halfYearly")}
                    className={`rounded-xl py-2 px-2 text-xs font-bold transition text-center ${
                      repaymentFreq === "halfYearly"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-white/5 theme-text-muted hover:bg-white/10"
                    }`}
                  >
                    🌾 छमाही (फसल कटाई अनुसार)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepaymentFreq("monthly")}
                    className={`rounded-xl py-2 px-2 text-xs font-bold transition text-center ${
                      repaymentFreq === "monthly"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-white/5 theme-text-muted hover:bg-white/10"
                    }`}
                  >
                    📅 मासिक (हर महीने EMI)
                  </button>
                </div>
              </div>
            </div>

            {/* Term Loan Result */}
            {termResult && (
              <div className="mt-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/60 via-amber-900/20 to-transparent p-4">
                <div className="text-xs font-semibold theme-text-muted">
                  {termResult.labelHi}
                </div>
                <div className="text-3xl font-black text-amber-400 mt-1">
                  ₹{termResult.installment.toLocaleString("en-IN")}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <div className="theme-text-muted">कुल ब्याज (Interest)</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">
                      ₹{termResult.totalInterest.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <div className="theme-text-muted">कुल भुगतान (Total Amount)</div>
                    <div className="text-sm font-bold theme-text-primary mt-0.5">
                      ₹{termResult.totalPayment.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] theme-text-muted">
                  कुल {termResult.periods} किस्तों में ऋण चुकता होगा।
                </div>
              </div>
            )}
          </DarkCard>

          {/* Subsidies reminder */}
          <DarkCard className="p-4 border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold theme-text-primary">
                यंत्र व सोलर सब्सिडी से लोन कम कराएं
              </h3>
            </div>
            <p className="text-xs theme-text-muted leading-relaxed">
              ट्रैक्टर या कृषि यंत्र खरीदने से पहले <b>SMAM योजना</b> (40-50% सब्सिडी) या <b>PM-KUSUM</b> (60-80% सोलर पंप सब्सिडी) का टोकन बुक करें, जिससे लोन की जरूरत आधी हो जाती है।
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <AppLink
                href="/schemes/smam"
                className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-center text-xs font-bold text-emerald-400 hover:bg-white/10"
              >
                🚜 SMAM यंत्र सब्सिडी देखें
              </AppLink>
              <AppLink
                href="/schemes/pm-kusum"
                className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-center text-xs font-bold text-amber-400 hover:bg-white/10"
              >
                ☀️ PM-KUSUM सोलर देखें
              </AppLink>
            </div>
          </DarkCard>
        </>
      )}
    </div>
  );
}
