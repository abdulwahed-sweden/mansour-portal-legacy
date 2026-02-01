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
}

const AURAS: Record<string, AuraInfo> = {
  sereneDawn: {
    name: "Serene Dawn",
    description: "Morning light bathes the painting in tranquility",
    gradient: "from-amber-700 via-orange-600 to-yellow-500",
    accent: "text-amber-300",
  },
  goldenRadiance: {
    name: "Golden Radiance",
    description: "Afternoon sun paints it with golden warmth",
    gradient: "from-yellow-600 via-amber-500 to-orange-400",
    accent: "text-yellow-300",
  },
  mysticalShadows: {
    name: "Mystical Shadows",
    description: "Evening shadows bring mystery and depth",
    gradient: "from-purple-900 via-indigo-800 to-violet-700",
    accent: "text-purple-300",
  },
  silentGuardian: {
    name: "Silent Guardian",
    description: "Night watch - the painting guards grandmother's memory",
    gradient: "from-slate-900 via-blue-950 to-indigo-950",
    accent: "text-blue-300",
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

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCairoTime(getCairoTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const aura = AURAS[cairoTime.auraKey];

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${aura.gradient} transition-all duration-1000`}>
      {/* Dark overlay for readability */}
      <div className="min-h-screen bg-black/40">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white drop-shadow-lg">
              Mansour&apos;s Portal
            </h1>
            <WalletMultiButton className="!bg-white/20 !backdrop-blur-md hover:!bg-white/30 !transition-all !border !border-white/20" />
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-28 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-12 bg-black/60 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4"
                  style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}>
                The Resilient Bloom
              </h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto"
                 style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>
                A Legacy NFT immortalizing a family painting&apos;s journey from Sweden to Gaza
              </p>
            </div>

            {/* NFT Display Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Painting Card */}
              <div className="bg-black/60 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <div className="relative">
                  {/* Golden frame effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl opacity-75" />
                  <div className="relative bg-black rounded-xl p-2">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                      <Image
                        src={IMAGE_URL}
                        alt="The Resilient Bloom by Sara Mansour"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-white font-medium text-lg"
                     style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>
                    Painted by Sara Mansour, age 10
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    Norrköping, Sweden
                  </p>
                </div>
              </div>

              {/* Info Panel */}
              <div className="space-y-6">
                {/* Aura Card */}
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white"
                        style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>
                      Current Aura
                    </h3>
                    <span className="text-gray-300 text-sm bg-black/40 px-3 py-1 rounded-full">
                      Cairo: {cairoTime.hour.toString().padStart(2, "0")}:{cairoTime.minute.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className={`text-3xl font-bold ${aura.accent} mb-2`}
                       style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}>
                    {aura.name}
                  </div>
                  <p className="text-gray-200">{aura.description}</p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-gray-300 text-sm italic">
                      &ldquo;The painting looks different every time I gaze at it.&rdquo;
                    </p>
                    <p className="text-gray-400 text-sm mt-1">— Grandmother</p>
                  </div>
                </div>

                {/* Journey Card */}
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4"
                      style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>
                    The Journey
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                      <span className="text-gray-100">Born in Norrköping, Sweden</span>
                    </div>
                    <div className="w-0.5 h-6 bg-white/30 ml-2" />
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                      <span className="text-gray-100">Gifted to Grandmother in Cairo</span>
                    </div>
                    <div className="w-0.5 h-6 bg-white/30 ml-2" />
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                      <span className="text-gray-100">Survived 5 years in Gaza</span>
                    </div>
                    <div className="w-0.5 h-6 bg-white/30 ml-2" />
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
                      <span className="text-gray-100">Family returned to Stockholm</span>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4"
                      style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>
                    Physical Status
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                    <span className="text-green-400 font-bold text-lg">Forever Enshrined</span>
                  </div>
                  <p className="text-gray-200">
                    The original canvas remains in grandmother&apos;s room in Cairo.
                  </p>
                  <p className="text-gray-300 mt-2 font-medium">
                    We choose NOT to move it.
                  </p>
                </div>

                {/* Dedication Card */}
                <div className="bg-black/70 backdrop-blur-md rounded-2xl p-6 border-2 border-amber-500/30 shadow-2xl">
                  <p className="text-white text-center text-lg italic leading-relaxed"
                     style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>
                    &ldquo;In memory of our beloved Grandmother in Cairo.
                    <br />
                    You held this light when the world was dark.
                    <br />
                    The canvas stays with you; its soul travels the world.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* On-Chain Details */}
            <div className="mt-12 bg-black/60 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center"
                  style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>
                On-Chain Details
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/50 rounded-xl p-5 border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">NFT Mint</p>
                  <p className="text-white font-mono text-xs break-all">
                    GdSW2Drudy2VxYb1ZtHm9AmjsvJ9artaeSRmYqTxUX8m
                  </p>
                </div>
                <div className="bg-black/50 rounded-xl p-5 border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Program ID</p>
                  <p className="text-white font-mono text-xs break-all">
                    DuusvRtdzX2epK2F2WGdDwCktWoCWHaLg6zWXjTmVPqA
                  </p>
                </div>
                <div className="bg-black/50 rounded-xl p-5 border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Network</p>
                  <p className="text-white font-medium">Solana Devnet</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <a
                  href="https://explorer.solana.com/address/GdSW2Drudy2VxYb1ZtHm9AmjsvJ9artaeSRmYqTxUX8m?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all border border-white/20"
                >
                  View on Explorer
                </a>
                <a
                  href="https://gateway.pinata.cloud/ipfs/QmY3p5oZV7ffAu4u9cFRHD44qnfykMzP5ZH5MNPJN3NHTF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all border border-white/20"
                >
                  View Metadata
                </a>
                <a
                  href="https://gateway.pinata.cloud/ipfs/QmbmreB8fSVruYEGZZqdnxxyvdEyibiBp21nG84qtKca3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 rounded-full text-amber-300 font-medium transition-all border border-amber-500/30"
                >
                  View Full Image
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 bg-black/60 border-t border-white/10">
          <div className="text-center">
            <p className="text-gray-300 font-medium">
              Created by Abdulwahed Mansour
            </p>
            <a
              href="https://github.com/abdulwahed-sweden/mansour-portal-legacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
