// app/ai-doctor/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function AIDoctorPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    // 3 सेकंड के बाद एआई स्कैनिंग का नाटक (Simulation) खत्म होगा
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-12 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-4xl space-y-10">
        
        {/* ऊपर का हेডার / टाइटल सेक्शन */}
        <div className="space-y-2 border-b border-white/5 pb-6 text-center md:text-left">
          <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-purple-400 border border-purple-500/20">
            AGRIVEDA AI ENGINE
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2">
            एआई फसल डॉक्टर (AI Plant Doctor)
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl">
            अपनी प्रभावित फसल के पत्तों या संक्रमित हिस्से की तस्वीर अपलोड करें। हमारा एडवांस कंप्यूटर विजन तुरंत बीमारी की पहचान कर सटीक वैज्ञानिक इलाज बताएगा।
          </p>
        </div>

        {/* ================= MAIN INTERFACE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* लेफ्ट साइड: अपलोड/स्कैन बॉक्स */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span>
              इमेज इनपुट (Image Input)
            </h3>
            
            {/* स्कैनिंग या नॉर्मल बॉक्स */}
            <div className="relative border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center bg-slate-950/40 transition-all hover:border-purple-500/30 p-4 text-center group">
              {isScanning ? (
                <div className="space-y-4">
                  {/* स्कैनिंग एनिमेटेड लाइन */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-bounce top-12"></div>
                  <div className="text-4xl animate-pulse">🧬</div>
                  <p className="text-sm font-semibold text-purple-400 animate-pulse">फंगल और पेस्ट पैथोलॉजी स्कैन की जा रही है...</p>
                </div>
              ) : scanComplete ? (
                <div className="space-y-2">
                  <div className="text-4xl">✅</div>
                  <p className="text-sm font-bold text-emerald-400">सैंपल इमेज स्कैन सफलतापूर्वक पूर्ण!</p>
                  <p className="text-xs text-slate-500">Tomato_Leaf_Sample_021.jpg</p>
                </div>
              ) : (
                <div className="space-y-3 cursor-pointer">
                  <div className="text-4xl transition-transform group-hover:scale-110 duration-300">📸</div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">पत्ते की फोटो खींचें या अपलोड करें</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG (अधिकतम 10MB)</p>
                  </div>
                </div>
              )}
            </div>

            {/* ट्रिगर बटन */}
            {!scanComplete && (
              <button 
                onClick={handleStartScan}
                disabled={isScanning}
                className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md ${isScanning ? "bg-purple-950 text-purple-400 border border-purple-500/20" : "bg-purple-600 text-white hover:bg-purple-500 hover:scale-[1.01]"}`}
              >
                {isScanning ? "प्रोसेसिंग..." : "एआई एनालिसिस शुरू करें →"}
              </button>
            )}

            {scanComplete && (
              <button 
                onClick={() => setScanComplete(false)}
                className="mt-4 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/10 transition-all"
              >
                दूसरा पौधा स्कैन करें
              </button>
            )}
          </div>

          {/* राइट साइड: एआई डायग्नोसिस रिजल्ट */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/20 p-6 flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-3">
                एआई जनरेटेड पर्चा (Diagnosis Report)
              </h3>
              
              {!scanComplete && !isScanning && (
                <div className="py-16 text-center text-slate-500 text-sm">
                  🌾 बाईं ओर इमेज डालकर एआई डॉक्टर को एक्टिवेट करें। रिपोर्ट यहाँ लाइव दिखाई देगी।
                </div>
              )}

              {isScanning && (
                <div className="py-16 text-center text-purple-400/70 text-sm animate-pulse">
                  🤖 एआई एल्गोरिदम इमेज के पिक्सल्स और स्पॉट्स को मैच कर रहा है...
                </div>
              )}

              {scanComplete && (
                <div className="mt-4 space-y-5 animate-fade-in">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                      उच्च संक्रमण (High Severity)
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1">अगेती झुलसा (Early Blight)</h4>
                    <p className="text-xs text-slate-400">संभावित रोगजनक: <span className="font-mono italic">Alternaria solani</span> (कवक)</p>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-400">सटीक रासायनिक नियंत्रण (Chemical Control):</p>
                    <ul className="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside">
                      <li><strong>Fency Eradicor:</strong> कॉपर ऑक्सीक्लोराइड 50% WP @ 500 ग्राम प्रति एकड़ 200 लीटर पानी में।</li>
                      <li>या फिर, <strong>Amistar Top:</strong> एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल @ 200 मिली प्रति एकड़ की दर से स्प्रे करें।</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-white/5 pt-3 text-xs">
                    <p className="font-bold text-emerald-400">एग्रोनॉमी सलाह:</p>
                    <p className="text-slate-400 leading-relaxed">खेत में नमी को संतुलित रखें और नाइट्रोजन की अत्यधिक खुराक तुरंत रोकें ताकि फंगस और न फैले।</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* पीछे जाने का बटन */}
        <div className="pt-4 text-center md:text-left">
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-purple-400 transition-colors">
            ← मुख्य डैशबोर्ड पर लौटें
          </Link>
        </div>

      </div>
    </main>
  );
}