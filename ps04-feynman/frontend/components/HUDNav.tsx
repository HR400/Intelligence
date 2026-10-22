"use client";

import React from "react";
import Link from "next/link";
import { Flame, Download, Swords, Network, Terminal, ShieldCheck } from "lucide-react";

interface HUDNavProps {
  level?: number;
  xp?: number;
  xpToNext?: number;
  streak?: number;
  readinessPercentage?: number;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const HUDNav: React.FC<HUDNavProps> = ({
  level = 2,
  xp = 180,
  xpToNext = 500,
  streak = 3,
  readinessPercentage = 42,
  activeTab = "track",
  onTabChange,
}) => {
  const xpPercentage = Math.min(100, Math.round((xp / xpToNext) * 100));

  const tabClass = (tab: string) =>
    `flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium uppercase tracking-widest transition-all duration-100 border cursor-pointer ${
      activeTab === tab
        ? "border-[#c5a880] bg-[#222733] text-[#d4af37]"
        : "border-[#2d3545] bg-[#161920] text-[#94a3b8] hover:border-[#c5a880] hover:bg-[#222733] hover:text-[#d4af37]"
    }`;

  // SVG Circular Combat Readiness Gauge
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessPercentage / 100) * circumference;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b px-6 py-3"
      style={{ backgroundColor: "#161920", borderColor: "#2d3545" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & User Level & XP Bar */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Hexagonal RPG crest */}
            <div
              className="h-9 w-9 flex items-center justify-center font-serif font-bold text-lg"
              style={{
                backgroundColor: "#222733",
                border: "1px solid #c5a880",
                color: "#d4af37",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              Ω
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#94a3b8]">
                PS04 Socratic Quest
              </div>
              <div className="text-sm font-medium flex items-center gap-2 text-[#e2e8f0]">
                <span>CyberScholar</span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#222733] border border-[#c5a880] text-[#d4af37]">
                  Lvl {level}
                </span>
              </div>
            </div>
          </div>

          {/* XP Flat Bar */}
          <div className="flex flex-col gap-1 w-32 sm:w-44">
            <div className="flex justify-between text-[10px] text-[#94a3b8]">
              <span className="font-mono uppercase tracking-wider">XP</span>
              <span className="font-mono text-[#d4af37]">
                {xp}/{xpToNext}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden bg-[#0d0e12] border border-[#2d3545]">
              <div
                className="h-full transition-all duration-500 bg-[#d4af37]"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Tactical Tab Navigation */}
        <nav className="flex items-center gap-0 border border-[#2d3545]">
          <button
            onClick={() => onTabChange?.("track")}
            className={tabClass("track")}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Skill Tree</span>
          </button>

          <button
            onClick={() => onTabChange?.("workspace")}
            className={`${tabClass("workspace")} border-l-0`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Socratic Lab</span>
          </button>

          <button
            onClick={() => onTabChange?.("arena")}
            className={`${tabClass("arena")} border-l-0`}
          >
            <Swords className="h-3.5 w-3.5" />
            <span>Boss Arena</span>
          </button>
        </nav>

        {/* Right: Streak & Combat Readiness & Obsidian */}
        <div className="flex items-center gap-4">
          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222733] border border-[#2d3545]">
            <Flame className="h-3.5 w-3.5 text-[#d4af37] fill-[#d4af37]" />
            <span className="text-xs font-mono font-medium text-[#e2e8f0]">{streak}d</span>
          </div>

          {/* Combat Readiness Circular Meter */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#2d3545]">
            <div className="relative flex items-center justify-center">
              <svg width={38} height={38} className="transform -rotate-90">
                <circle
                  cx={19}
                  cy={19}
                  r={radius}
                  stroke="#2d3545"
                  strokeWidth={3}
                  fill="transparent"
                />
                <circle
                  cx={19}
                  cy={19}
                  r={radius}
                  stroke="#d4af37"
                  strokeWidth={3}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-[9px] font-mono font-bold text-[#e2e8f0]">
                {readinessPercentage}%
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#94a3b8] leading-none">
                Exam Readiness
              </span>
              <span className="text-xs font-mono font-medium text-[#d4af37] mt-0.5">
                R_exam
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
