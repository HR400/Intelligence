"use client";

import React from "react";
import { Flame, ShieldAlert, Award, Download, Calendar, Swords, Network, Terminal } from "lucide-react";
import { CombatReadinessGauge } from "./CombatReadinessGauge";
import { User } from "../../lib/types";

interface TopNavHUDProps {
  user: User | null;
  activeTab: "track" | "workspace" | "arena" | "calendar";
  onTabChange: (tab: "track" | "workspace" | "arena" | "calendar") => void;
  onExportCanvas: () => void;
}

export const TopNavHUD: React.FC<TopNavHUDProps> = ({
  user,
  activeTab,
  onTabChange,
  onExportCanvas,
}) => {
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const xpToNext = user?.xp_to_next_level || 500;
  const streak = user?.streak || 0;
  const readiness = Math.round((user?.stats.combat_readiness || 0) * 100);
  const xpPercentage = Math.min(100, Math.round((xp / xpToNext) * 100));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-surface/90 backdrop-blur-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & User Level */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/20">
              Ω
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                Socratic Engine
              </div>
              <div className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <span>{user?.username || "CyberScholar"}</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/60 rounded">
                  LVL {level}
                </span>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex flex-col gap-1 w-36 md:w-48">
            <div className="flex justify-between text-[11px] font-medium text-gray-400">
              <span>XP Progress</span>
              <span className="text-gray-300 font-mono">
                {xp} / {xpToNext}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Gamified Navigation Tabs */}
        <nav className="flex items-center bg-gray-900/90 border border-gray-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => onTabChange("track")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "track"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Skill Tree</span>
          </button>

          <button
            onClick={() => onTabChange("workspace")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "workspace"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Socratic Lab</span>
          </button>

          <button
            onClick={() => onTabChange("arena")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "arena"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 font-semibold"
                : "text-gray-400 hover:text-rose-400 hover:bg-gray-800/60"
            }`}
          >
            <Swords className="h-3.5 w-3.5" />
            <span>Boss Arena</span>
          </button>

          <button
            onClick={() => onTabChange("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "calendar"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold"
                : "text-gray-400 hover:text-emerald-400 hover:bg-gray-800/60"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </button>
        </nav>

        {/* Right: Streak & Combat Readiness Gauge & Obsidian Export */}
        <div className="flex items-center gap-4">
          {/* Streak Flame */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-950/40 border border-amber-600/30 rounded-lg text-amber-400">
            <Flame className="h-4 w-4 animate-bounce text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold font-mono">{streak}d</span>
          </div>

          {/* Combat Readiness Gauge */}
          <div className="flex items-center gap-2 pl-1 border-l border-gray-800">
            <CombatReadinessGauge percentage={readiness} size={42} />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                Exam Readiness
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-400 leading-tight">
                R_exam
              </span>
            </div>
          </div>

          {/* Export to Obsidian */}
          <button
            onClick={onExportCanvas}
            title="Download Obsidian .canvas visual graph"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-700/50 rounded-lg text-xs font-medium transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Obsidian</span>
          </button>
        </div>
      </div>
    </header>
  );
};
