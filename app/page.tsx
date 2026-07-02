"use client";

import Link from "next/link";
import {
  Bug,
  MessageCircleQuestion,
  BookOpen,
  Plus,
  Sparkles,
  CloudSun,
  Sprout,
} from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { myCrops } from "@/data/crop-dashboard";

const keyFeatures = [
  {
    title: "Pest & diseases",
    icon: Bug,
    href: "/crop-details/paddy",
    color: "bg-[#006432]",
  },
  {
    title: "Agriveda Expert",
    icon: MessageCircleQuestion,
    href: "/community",
    color: "bg-[#006432]",
  },
  {
    title: "Agri Diary",
    icon: BookOpen,
    href: "/crops",
    color: "bg-[#006432]",
  },
];

const quickAccess = [
  { title: "Crops", icon: Sprout, href: "/crops", color: "bg-emerald-600" },
  { title: "Weather", icon: CloudSun, href: "/weather", color: "bg-sky-500" },
  { title: "AI Doctor", icon: Sparkles, href: "/ai-doctor", color: "bg-violet-500" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="mx-auto max-w-lg px-5 pt-6 space-y-8">

        {/* Brand header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2D8A5B]">
              Agriveda
            </p>
            <h1 className="text-2xl font-extrabold text-gray-900">My Farm</h1>
          </div>
          <Link
            href="/ai-doctor"
            className="flex items-center gap-1.5 rounded-full bg-[#006432] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AgriChat AI
          </Link>
        </div>

        {/* My crops */}
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-gray-900">My crops.</h2>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {myCrops.map((crop) => (
              <Link
                key={crop.slug}
                href={`/crop-details/${crop.slug}`}
                className="flex flex-shrink-0 flex-col items-center gap-2"
              >
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-4xl shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
                  {crop.emoji}
                </div>
                <span className="max-w-[88px] text-center text-xs font-semibold text-gray-700 leading-tight">
                  {crop.name}
                </span>
              </Link>
            ))}
            <Link
              href="/crops"
              className="flex flex-shrink-0 flex-col items-center gap-2"
            >
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white transition-all hover:border-[#2D8A5B]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006432] text-white">
                  <Plus className="h-5 w-5" />
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-500">Add / Remove</span>
            </Link>
          </div>
        </section>

        {/* AgriChat AI bar */}
        <section>
          <h2 className="mb-3 text-lg font-extrabold text-gray-900">AgriChat AI.</h2>
          <Link
            href="/ai-doctor"
            className="flex items-center gap-3 rounded-full bg-gray-100 px-4 py-3.5 transition-colors hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#006432]">
              <div className="grid grid-cols-2 gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">Click to ask about crops.</span>
          </Link>
        </section>

        {/* Key features — compact circular icons */}
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-gray-900">Key features.</h2>
          <div className="flex justify-around gap-2">
            {keyFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group flex flex-col items-center gap-2"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${feature.color} text-white shadow-md transition-transform group-hover:scale-105 group-active:scale-95`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.75} />
                  </div>
                  <span className="max-w-[80px] text-center text-[11px] font-semibold text-gray-700 leading-tight">
                    {feature.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick access — compact row */}
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-gray-900">Quick access.</h2>
          <div className="flex justify-around gap-2">
            {quickAccess.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col items-center gap-2"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-95`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Ask query CTA */}
        <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
          <h3 className="text-base font-bold text-gray-900">Need expert help?</h3>
          <p className="mt-1 text-sm text-gray-500">
            Ask our Agriveda Expert about crop issues, pests, or diseases.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/ask-query"
              className="flex-1 rounded-xl bg-[#88B498] py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#7aa88a]"
            >
              Ask query
            </Link>
            <Link
              href="/community"
              className="flex-1 rounded-xl border border-[#2D8A5B] py-2.5 text-center text-sm font-bold text-[#2D8A5B] transition-colors hover:bg-emerald-50"
            >
              View feed
            </Link>
          </div>
        </section>

      </div>

      {/* Floating AgriChat AI pill */}
      <Link
        href="/ai-doctor"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-[#006432] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 md:bottom-8"
      >
        <div className="grid grid-cols-2 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
          ))}
        </div>
        AgriChat AI
      </Link>

      <BottomNav />
    </div>
  );
}
