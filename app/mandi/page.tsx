// app/mandi/page.tsx
import Link from "next/link";

export default function MandiPage() {
  // अभी हम रीयल-टाइम लुकिंग स्टेटिक प्रीमियम डेटा रख रहे हैं, जिसे बाद में Mandi API से कनेक्ट करेंगे
  const mandiPrices = [
    { crop: "टमाटर (Tomato)", mandi: "जयपुर (राज.)", price: "₹2,400 - ₹3,200", unit: "क्विंटल", trend: "up", change: "+₹250" },
    { crop: "धान (Paddy - Basmati)", mandi: "करनाल (हरियाणा)", price: "₹3,800 - ₹4,500", unit: "क्विंटल", trend: "up", change: "+₹120" },
    { crop: "मक्का (Maize)", mandi: "अलीगढ़ (उ.प्र.)", price: "₹1,950 - ₹2,200", unit: "क्विंटल", trend: "down", change: "-₹40" },
    { crop: "कपास (Cotton)", mandi: "झाबुआ (म.प्र.)", price: "₹6,800 - ₹7,500", unit: "क्विंटल", trend: "up", change: "+₹400" },
    { crop: "आलू (Potato)", mandi: "आगरा (उ.प्र.)", price: "₹1,200 - ₹1,600", unit: "क्विंटल", trend: "stable", change: "₹0" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-12 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-5xl space-y-10">
        
        {/* ऊपर का हेडर */}
        <div className="space-y-2 border-b border-white/5 pb-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            AGRIVEDA MARKET INTELLIGENCE
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            मंडी भाव लाइव ट्रैकर
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl">
            देश की प्रमुख कृषि मंडियों के ताजा और सटीक भाव। स्मार्ट एल्गोरिदम के साथ दाम के उतार-चढ़ाव का विश्लेषण।
          </p>
        </div>

        {/* ================= MARKET OVERVIEW CARDS ================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "आज का मार्केट सेंटिमेंट", value: "तेज (Bullish)", desc: "कपास और टमाटर में भारी मांग", color: "text-emerald-400" },
            { label: "सर्वाधिक उछाल वाली फसल", value: "कपास (+₹400)", desc: "झाबुआ मंडी में रिकॉर्ड आवक", color: "text-emerald-400" },
            { label: "अपडेट का समय", value: "आज, 11:30 AM", desc: "AGMARKNET डेटा सोर्स आधारित", color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className={`mt-2 text-xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* ================= MANDI PRICES TABLE (Premium SaaS Style) ================= */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/20 overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/5">
                  <th className="px-6 py-4">फसल का नाम</th>
                  <th className="px-6 py-4">प्रमुख मंडी (राज्य)</th>
                  <th className="px-6 py-4">मूल्य सीमा (प्रति क्विंटल)</th>
                  <th className="px-6 py-4 text-right">बाजार का रुख (Trend)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {mandiPrices.map((item, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold text-white">{item.crop}</td>
                    <td className="px-6 py-4 text-slate-300">{item.mandi}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-400">{item.price}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                      {item.trend === "up" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400 border border-emerald-500/20">
                          ▲ {item.change}
                        </span>
                      )}
                      {item.trend === "down" && (
                        <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs text-red-400 border border-red-500/20">
                          ▼ {item.change}
                        </span>
                      )}
                      {item.trend === "stable" && (
                        <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs text-slate-400 border border-slate-500/20">
                          ● स्थिर
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* पीछे जाने का बटन */}
        <div className="pt-4">
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-amber-400 transition-colors">
            ← मुख्य डैशबोर्ड पर लौटें
          </Link>
        </div>

      </div>
    </main>
  );
}