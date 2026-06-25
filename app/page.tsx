import Navbar from "@/components/Navbar";

const crops = [
  "Paddy",
  "Wheat",
  "Maize",
  "Bajra",
  "Soybean",
  "Cotton",
  "Sugarcane",
  "Potato",
  "Tomato",
  "Chilli",
  "Mustard",
  "Groundnut",
  "Onion",
  "Garlic",
  "Pulses",
  "Vegetables",
];

const modules = [
  {
    title: "Crop Knowledge",
    desc: "Detailed crop profiles with soil, climate, irrigation, pests, diseases, weeds, fertilizers, yield and market information.",
    icon: "🌾",
  },
  {
    title: "Weather",
    desc: "Live weather, humidity, rainfall, wind speed, alerts, hourly & weekly forecast.",
    icon: "🌦️",
  },
  {
    title: "Global Search",
    desc: "Search crops, pests, diseases, weeds, nutrient deficiencies and fertilizers.",
    icon: "🔍",
  },
  {
    title: "AI Doctor",
    desc: "Upload crop images and get AI-based disease diagnosis.",
    icon: "🤖",
  },
];

export default function Home() {
  return (
    <>

      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-900 to-black text-white">
        <section className="mx-auto max-w-7xl px-6 py-10">

          {/* Hero */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
            <p className="text-emerald-400 font-semibold tracking-[0.3em]">
              AGRIVEDA
            </p>

            <h1 className="mt-4 text-5xl font-bold">
              Digital Agriculture Encyclopedia
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Complete agriculture knowledge platform for Farmers,
              Agriculture Students, Agronomists and Agri Professionals.
            </p>
          </div>

          {/* Modules */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {modules.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg hover:scale-105 transition"
              >
                <div className="text-5xl">{item.icon}</div>

                <h2 className="mt-4 text-2xl font-bold">
                  {item.title}
                </h2>

                <p className="mt-3 text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Crop List */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-bold">
              Major Crops
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {crops.map((crop) => (
                <div
                  key={crop}
                  className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center font-semibold hover:bg-emerald-500/20 transition cursor-pointer"
                >
                  🌾 {crop}
                </div>
              ))}
            </div>
          </div>

          {/* Weather */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-2xl font-bold">
                Weather
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-black/20 p-4">
                  🌡️ 32°C
                </div>

                <div className="rounded-xl bg-black/20 p-4">
                  💧 68%
                </div>

                <div className="rounded-xl bg-black/20 p-4">
                  🌧️ 20%
                </div>

                <div className="rounded-xl bg-black/20 p-4">
                  💨 12 km/h
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-2xl font-bold">
                Future Modules
              </h2>

              <ul className="mt-5 space-y-3 text-slate-300">
                <li>✅ Crop Detail Pages</li>
                <li>✅ Disease Identification</li>
                <li>✅ Pest Management</li>
                <li>✅ Fertilizer Calculator</li>
                <li>✅ Mandi Prices</li>
                <li>✅ AI Doctor</li>
              </ul>
            </div>
          </div>

        </section>
      </main>
    </>
  );
}