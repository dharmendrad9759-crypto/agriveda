// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/80 backdrop-blur-md py-8 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        
        {/* लेफ्ट साइड: कॉपीराइट */}
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            AGRIVEDA PRO
          </span>
          <span>© 2026 सर्वाधिकार सुरक्षित।</span>
        </div>

        {/* मिडिल: क्विक लिंक्स */}
        <div className="flex items-center gap-6">
          <Link href="/crops" className="hover:text-emerald-400 transition-colors">क्रॉप इंजन</Link>
          <Link href="/weather" className="hover:text-blue-400 transition-colors">वेदर इंटेलिजेंस</Link>
          <Link href="/ai-doctor" className="hover:text-purple-400 transition-colors">AI डॉक्टर</Link>
          <Link href="/mandi" className="hover:text-amber-400 transition-colors">मंडी भाव</Link>
        </div>

        {/* राइट साइड: टैगलाइन */}
        <div className="text-slate-600 font-mono text-[10px] uppercase tracking-widest">
          Precision Agronomy Engine
        </div>

      </div>
    </footer>
  );
}