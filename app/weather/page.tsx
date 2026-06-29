"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Aligarh"); // डिफ़ॉल्ट सिटी सेट की है

  // ⚠️ अपनी OpenWeather API Key यहाँ डालें या .env.local फ़ाइल में NEXT_PUBLIC_OPENWEATHER_API_KEY नाम से रखें
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "7329dc97e3c822b153c190c7c1b5e85d";

  useEffect(() => {
    async function getLiveWeather() {
      try {
        setLoading(true);
        setError(null);

        // 1. Current Weather API Call
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=hi`
        );
        
        if (!currentRes.ok) {
          throw new Error("शहर का डेटा नहीं मिला या API Key इनवैलिड है।");
        }
        const currentData = await currentRes.json();

        // 2. 5-Day / 3-Hour Forecast API Call (for hourly updates)
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=hi`
        );
        const forecastData = await forecastRes.json();

        // 3. Extracting Hourly Forecast (taking first 4 slots)
        const hourly = forecastData.list.slice(0, 4).map((item: any) => {
          const timeStr = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          
          // Simple icon mapping based on OpenWeather icons
          let emoji = "🌤️";
          if (item.weather[0].main === "Rain") emoji = "🌦️";
          if (item.weather[0].main === "Clear") emoji = "☀️";
          if (item.weather[0].main === "Clouds") emoji = "☁️";

          return {
            time: timeStr,
            temp: `${Math.round(item.main.temp)}°C`,
            icon: emoji,
          };
        });

        // 4. Dynamic Recommendation Engine based on Live Humidity & Weather Condition
        const currentHumidity = currentData.main.humidity;
        const weatherMain = currentData.weather[0].main;

        const dynamicRecs = [
          {
            title: "लौकी और करेला",
            advice: currentHumidity > 70 
              ? `हवा में नमी (${currentHumidity}%) बहुत अधिक है। डाउनी मिल्ड्यू (Downy Mildew) और फंगस का खतरा है, पत्तों के नीचे तुरंत निगरानी रखें।`
              : "मौसम सामान्य है। बेल वाली फसलों में संतुलित नमी बनाए रखें और मल्चिंग की जांच करें।"
          },
          {
            title: "टमाटर (Tomato)",
            advice: weatherMain === "Rain"
              ? "बारिश की संभावना या लाइव अलर्ट है! खेत में जलभराव न होने दें। किसी भी कवकनाशक (Fungicide) का स्प्रे अभी टाल दें।"
              : `तापमान ${Math.round(currentData.main.temp)}°C है। यदि आज सिंचाई करने वाले हैं, तो शाम के समय ड्रिप चलाएं।`
          },
          {
            title: "धान (Paddy) नर्सरी",
            advice: currentData.wind.speed > 5
              ? "हवा की गति थोड़ी तेज़ है। नर्सरी बेड या कन्हाड़ खेतों में पानी का निकास सही रखें ताकि छोटे पौधे सुरक्षित रहें।"
              : "मौसम स्थिर है। नाइट्रोजन की अत्यधिक ओवरडोज़ देने से बचें ताकि तना छेदक (Stem Borer) का हमला न हो।"
          }
        ];

        // Setting unified clean state mapping directly into your premium UI layout
        setWeatherData({
          temp: `${Math.round(currentData.main.temp)}°C`,
          condition: currentData.weather[0].description,
          humidity: `${currentHumidity}%`,
          windSpeed: `${Math.round(currentData.wind.speed * 3.6)} किमी/घंटा`, // m/s to km/h convertor
          rainfallAlert: weatherMain === "Rain" ? "क्षेत्र में बारिश दर्ज की जा रही है।" : "अगले कुछ घंटों में भारी बारिश की कोई गंभीर चेतावनी नहीं है।",
          location: `${currentData.name}, ${currentData.sys.country} क्षेत्र`,
          hourlyForecast: hourly,
          recommendations: dynamicRecs,
        });

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "डेटा फेच करने में समस्या आई।");
        setLoading(false);
      }
    }

    getLiveWeather();
  }, [city, API_KEY]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-12 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* Header Section */}
        <div className="space-y-2 border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              AGRIVEDA WEATHER INTELLIGENCE
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-1">
              मौसम पूर्वानुमान एवं कृषि सलाह
            </h1>
          </div>

          {/* Interactive City Switcher Node */}
          <div className="flex gap-2 bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur">
            {["Aligarh", "Jaipur", "Raipur"].map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  city === c ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {c === "Aligarh" ? "अलीगढ़" : c === "Jaipur" ? "जयपुर" : "रायपुर"}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING FRAMEWORK STATE */}
        {loading && (
          <div className="py-24 text-center space-y-4 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500/20 border-t-blue-400 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-400 animate-pulse">सैटेलाइट नोड्स से लाइव मौसम डेटा फेच किया जा रहा है...</p>
          </div>
        )}

        {/* ERROR FALLBACK STATE */}
        {error && !loading && (
          <div className="p-8 text-center rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur max-w-md mx-auto space-y-4">
            <div className="text-3xl">⚠️</div>
            <p className="text-sm font-bold text-red-400">{error}</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              कृपया जांचें कि <code className="bg-black/40 px-1 py-0.5 rounded text-red-300">YOUR_OPENWEATHER_API_KEY</code> की जगह आपकी वैलिड API Key पेस्टेड है या नहीं।
            </p>
          </div>
        )}

        {/* MAIN WEATHER OUTPUT SHEET */}
        {!loading && !error && weatherData && (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              
              {/* Live Current Card */}
              <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-950 p-6 md:p-8 shadow-2xl">
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"></div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-blue-400 font-mono tracking-wider">{weatherData.location}</p>
                    <h2 className="mt-4 text-6xl md:text-7xl font-black tracking-tighter text-white">{weatherData.temp}</h2>
                    <p className="mt-2 text-lg font-medium text-slate-300 capitalize">{weatherData.condition}</p>
                  </div>
                  <div className="text-5xl md:text-6xl filter drop-shadow-md">🌤️</div>
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
                  <strong>रीडिंग नोट:</strong> {weatherData.rainfallAlert}
                </div>
              </div>

              {/* Dynamic Hourly Stream Card */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-3">
                  आगामी प्रति घंटा अपडेट (3-Hour Blocks)
                </h3>
                <div className="divide-y divide-white/5 mt-2">
                  {weatherData.hourlyForecast.map((hour: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-slate-400 font-mono">{hour.time}</span>
                      <span className="text-xl">{hour.icon}</span>
                      <span className="font-bold text-white">{hour.temp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Smart Recommendation Engine Block */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                इस लाइव मौसम में फसलों के लिए विशेष वैज्ञानिक सलाह
              </h2>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {weatherData.recommendations.map((rec: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-white/5 bg-slate-900/20 p-5 hover:border-emerald-500/20 transition-all">
                    <h3 className="font-bold text-emerald-400 text-base">{rec.title}</h3>
                    <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed">
                      {rec.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Return Button */}
        <div className="pt-4">
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors">
            ← मुख्य डैशबोर्ड पर लौटें
          </Link>
        </div>

      </div>
    </main>
  );
}