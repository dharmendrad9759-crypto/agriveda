// app/weather/page.tsx
import Link from "next/link";

export default function WeatherPage() {
  // अभी हम स्टेटिक प्रीमियम डेटा रख रहे हैं, जिसे बाद में OpenWeather API से जोड़ेंगे
  const weatherData = {
    temp: "34°C",
    condition: "आंशिक रूप से बादल (Partly Cloudy)",
    humidity: "65%",
    windSpeed: "12 किमी/घंटा",
    rainfallAlert: "शाम को हल्की बूंदाबांदी की संभावना (20%)",
    location: "जयपुर / छत्तीसगढ़ क्षेत्र",
    hourlyForecast: [
      { time: "09:00 AM", temp: "31°C", icon: "☀️" },
      { time: "12:00 PM", temp: "35°C", icon: "🌤️" },
      { time: "03:00 PM", temp: "34°C", icon: "☁️" },
      { time: "06:00 PM", temp: "32°C", icon: "🌦️" },
    ],
    recommendations: [
      { title: "लौकी और करेला", advice: "हवा में नमी (65%) अधिक होने के कारण डाउनी मिल्ड्यू का खतरा बढ़ सकता है। पत्तों के नीचे निगरानी रखें।" },
      { title: "टमाटर (Tomato)", advice: "यदि आज सिंचाई करने वाले हैं तो शाम के समय केवल हल्की ड्रिप चलाएं, क्योंकि रात में बूंदाबांदी की संभावना है।" },
      { title: "धान (Paddy) नर्सरी", advice: "छत्तीसगढ़ के कन्हार खेतों में पानी का निकास सही रखें ताकि भारी बारिश होने पर पौध गले नहीं।" }
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-12 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* ऊपर का हेडर */}
        <div className="space-y-2 border-b border-white/5 pb-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            AGRIVEDA WEATHER INTELLIGENCE
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            मौसम पूर्वानुमान एवं कृषि सलाह
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl">
            लाइव सैटेलाइट डेटा के आधार पर आपकी मिट्टी और फसलों के लिए कस्टमाइज्ड मौसम रिपोर्ट।
          </p>
        </div>

        {/* ================= MAIN WEATHER DISPLAY ================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* करंट वेदर कार्ड (Stripe Style) */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-950 p-6 md:p-8 shadow-2xl">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-blue-400 font-mono tracking-wider">{weatherData.location}</p>
                <h2 className="mt-4 text-6xl md:text-7xl font-black tracking-tighter text-white">{weatherData.temp}</h2>
                <p className="mt-2 text-lg font-medium text-slate-300">{weatherData.condition}</p>
              </div>
              <div className="text-5xl md:text-6xl">🌤️</div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6 text-sm text-slate-400">
              <div>
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-500">नमी (Humidity)</span>
                <span className="mt-1 block text-base font-bold text-slate-200">{weatherData.humidity}</span>
              </div>
              <div>
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-500">हवा की गति</span>
                <span className="mt-1 block text-base font-bold text-slate-200">{weatherData.windSpeed}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-blue-500/5 border border-blue-500/10 p-3 text-xs text-blue-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              <strong>अलर्ट:</strong> {weatherData.rainfallAlert}
            </div>
          </div>

          {/* हर घंटे का पूर्वानुमान (Hourly Forecast) */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-3">
              आज का प्रति घंटा अपडेट
            </h3>
            <div className="divide-y divide-white/5 mt-2">
              {weatherData.hourlyForecast.map((hour, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-slate-400 font-mono">{hour.time}</span>
                  <span className="text-xl">{hour.icon}</span>
                  <span className="font-bold text-white">{hour.temp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= FARMER RECOMMENDATIONS ================= */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            इस मौसम में फसलों के लिए विशेष वैज्ञानिक सलाह
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {weatherData.recommendations.map((rec, i) => (
              <div key={i} className="rounded-2xl border border-white/5 bg-slate-900/20 p-5 hover:border-emerald-500/20 transition-all">
                <h3 className="font-bold text-emerald-400 text-base">{rec.title}</h3>
                <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed">
                  {rec.advice}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* पीछे जाने का बटन */}
        <div className="pt-4">
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors">
            ← मुख्य डैशबोर्ड पर लौटें
          </Link>
        </div>

      </div>
    </main>
  );
}