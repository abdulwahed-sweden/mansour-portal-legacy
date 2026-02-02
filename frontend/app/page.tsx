"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

const IMAGE_URL = "https://gateway.pinata.cloud/ipfs/QmbmreB8fSVruYEGZZqdnxxyvdEyibiBp21nG84qtKca3F";

interface AuraInfo {
  name: string;
  description: string;
  gradient: string;
  accent: string;
  particleColor: string;
}

const AURAS: Record<string, AuraInfo> = {
  sereneDawn: {
    name: "Serene Dawn",
    description: "Morning light bathes the painting in tranquility",
    gradient: "from-rose-950 via-orange-900 to-amber-800",
    accent: "text-amber-400",
    particleColor: "rgba(251, 191, 36, 0.3)",
  },
  goldenRadiance: {
    name: "Golden Radiance",
    description: "Afternoon sun paints it with golden warmth",
    gradient: "from-amber-900 via-yellow-800 to-orange-700",
    accent: "text-yellow-400",
    particleColor: "rgba(250, 204, 21, 0.3)",
  },
  mysticalShadows: {
    name: "Twilight Veil",
    description: "Evening shadows bring mystery and depth",
    gradient: "from-slate-900 via-gray-900 to-stone-900",
    accent: "text-slate-300",
    particleColor: "rgba(148, 163, 184, 0.3)",
  },
  silentGuardian: {
    name: "Silent Guardian",
    description: "Night watch - the painting guards grandmother's memory",
    gradient: "from-gray-950 via-slate-950 to-neutral-950",
    accent: "text-cyan-400",
    particleColor: "rgba(34, 211, 238, 0.3)",
  },
};

function getCairoTime(): { hour: number; minute: number; auraKey: string } {
  const now = new Date();
  const cairoOffset = 2;
  const utcHour = now.getUTCHours();
  const cairoHour = (utcHour + cairoOffset) % 24;
  const minute = now.getUTCMinutes();

  let auraKey: string;
  if (cairoHour >= 5 && cairoHour < 12) {
    auraKey = "sereneDawn";
  } else if (cairoHour >= 12 && cairoHour < 17) {
    auraKey = "goldenRadiance";
  } else if (cairoHour >= 17 && cairoHour < 21) {
    auraKey = "mysticalShadows";
  } else {
    auraKey = "silentGuardian";
  }

  return { hour: cairoHour, minute, auraKey };
}

export default function Home() {
  const { connected } = useWallet();
  const [cairoTime, setCairoTime] = useState(getCairoTime());
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setIsVisible(true), 100);
    const interval = setInterval(() => {
      setCairoTime(getCairoTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const aura = AURAS[cairoTime.auraKey];

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${aura.gradient} transition-all duration-[2000ms] relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    Mansour&apos;s Portal
                  </h1>
                  <p className="text-xs text-gray-400">Legacy Collection</p>
                </div>
              </div>
              <WalletMultiButton className="!bg-white/10 !backdrop-blur-md hover:!bg-white/20 !transition-all !duration-300 !border !border-white/20 !rounded-xl" />
            </div>
          </div>
        </header>

        <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-white font-medium">Forever Enshrined in Cairo</span>
              </div>

              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                The Resilient Bloom
              </h2>

              <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
                A legacy NFT immortalizing a family painting&apos;s journey from Sweden to Gaza
              </p>

              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <div className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <span className="text-gray-300">Painted by Sara Mansour, age 10</span>
                </div>
                <div className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <span className="text-gray-300">Norrköping, Sweden</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-3xl opacity-75 group-hover:opacity-100 blur transition duration-500 animate-pulse" />

                  <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-2xl">
                      <Image
                        src={IMAGE_URL}
                        alt="The Resilient Bloom by Sara Mansour"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div>
                        <p className="text-white font-semibold text-lg">The Resilient Bloom</p>
                        <p className="text-gray-400 text-sm">Sara Mansour, 2014</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">1st Place</p>
                        <p className="text-white text-sm font-medium">School Competition</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Current Aura</h3>
                      <p className="text-gray-400 text-sm">Updates with Cairo timezone</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cairo Time</div>
                      <div className="text-2xl font-bold text-white font-mono">
                        {cairoTime.hour.toString().padStart(2, "0")}:{cairoTime.minute.toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>

                  <div className={`text-4xl font-bold ${aura.accent} mb-3 tracking-tight`}>
                    {aura.name}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">{aura.description}</p>

                  <div className="pt-6 border-t border-white/10">
                    <blockquote className="italic text-gray-300 text-base leading-relaxed">
                      &ldquo;The painting looks different every time I gaze at it.&rdquo;
                    </blockquote>
                    <p className="text-gray-500 text-sm mt-2">— Grandmother, Cairo</p>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
                  <h3 className="text-xl font-bold text-white mb-6">The Journey</h3>

                  <div className="space-y-6">
                    {[
                      { location: "Born in Norrköping, Sweden", color: "blue", glow: "shadow-blue-400/50" },
                      { location: "Gifted to Grandmother in Cairo", color: "amber", glow: "shadow-amber-400/50" },
                      { location: "Survived 5 years in Gaza", color: "red", glow: "shadow-red-500/50" },
                      { location: "Family returned to Stockholm", color: "green", glow: "shadow-green-400/50" }
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-4 group">
                        <div className={`relative flex-shrink-0`}>
                          <div className={`w-5 h-5 rounded-full bg-${step.color}-400 shadow-lg ${step.glow} group-hover:scale-125 transition-transform duration-300`} />
                          {index < 3 && (
                            <div className="absolute left-1/2 top-full w-px h-6 bg-gradient-to-b from-white/30 to-transparent -translate-x-1/2" />
                          )}
                        </div>
                        <span className="text-gray-200 group-hover:text-white transition-colors duration-300">{step.location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20">
                  <h3 className="text-xl font-bold text-white mb-6">Physical Legacy</h3>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                    <span className="text-green-400 font-bold text-lg">Forever Enshrined</span>
                  </div>

                  <p className="text-gray-200 leading-relaxed mb-3">
                    The original canvas remains in grandmother&apos;s room in Cairo.
                  </p>
                  <p className="text-amber-200 font-semibold">
                    We choose NOT to move it.
                  </p>
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl rounded-3xl p-12 border border-amber-500/30 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <blockquote className="text-center">
                <p className="text-2xl sm:text-3xl text-white italic leading-relaxed mb-4">
                  &ldquo;In memory of our beloved Grandmother in Cairo.<br />
                  You held this light when the world was dark.<br />
                  The canvas stays with you; its soul travels the world.&rdquo;
                </p>
                <footer className="text-gray-400">— The Mansour Family</footer>
              </blockquote>
            </div>

            <div className={`bg-black/60 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-3xl font-bold text-white mb-8 text-center">On-Chain Details</h3>

              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "NFT Mint", value: "GdSW2Drudy2VxYb1ZtHm9AmjsvJ9artaeSRmYqTxUX8m" },
                  { label: "Program ID", value: "DuusvRtdzX2epK2F2WGdDwCktWoCWHaLg6zWXjTmVPqA" },
                  { label: "Network", value: "Solana Devnet", short: true }
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">{item.label}</p>
                    <p className={`text-white ${item.short ? 'font-semibold text-lg' : 'font-mono text-xs break-all'}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { href: "https://explorer.solana.com/address/GdSW2Drudy2VxYb1ZtHm9AmjsvJ9artaeSRmYqTxUX8m?cluster=devnet", label: "View on Explorer", primary: true },
                  { href: "https://gateway.pinata.cloud/ipfs/QmY3p5oZV7ffAu4u9cFRHD44qnfykMzP5ZH5MNPJN3NHTF", label: "View Metadata", primary: false },
                  { href: "https://gateway.pinata.cloud/ipfs/QmbmreB8fSVruYEGZZqdnxxyvdEyibiBp21nG84qtKca3F", label: "View Full Image", primary: false }
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border ${
                      link.primary
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="py-12 bg-black/40 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Mansour&apos;s Portal</p>
                  <p className="text-gray-400 text-xs">Created by Abdulwahed Mansour</p>
                </div>
              </div>
              <a
                href="https://github.com/abdulwahed-sweden/mansour-portal-legacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300 underline decoration-dashed underline-offset-4"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
