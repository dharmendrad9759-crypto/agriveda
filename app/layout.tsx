// app/layout.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata = {
  title: "Agriveda Pro - आधुनिक कृषि इंटेलिजेंस",
  description: "सटीक स्टेज-वाइज फर्टिगेशन, एडवांस्ड स्प्रे शेड्यूल और स्मार्ट रोग प्रबंधन प्लेटफॉर्म",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body className="bg-slate-950 antialiased flex flex-col min-h-screen text-white">
        {/* ग्लोबल नेविगेशन बार */}
        <Navbar />
        
        {/* सभी पेजों का कंटेंट */}
        <div className="flex-grow">
          {children}
        </div>
        
        {/* ग्लोबल फूटर */}
        <Footer />
      </body>
    </html>
  );
}