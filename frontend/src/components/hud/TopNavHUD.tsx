"use client";

import React from "react";
import { Flame, Download, Calendar, Swords, Network, Terminal } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/95 backdrop-blur-md px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & User Level */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-sm bg-primary text-white flex items-center justify-center font-display font-semibold text-lg tracking-tight">
              Ω
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted">
                Socratic Engine
              </div>
              <div className="text-sm font-medium text-ink flex items-center gap-2">
                <span>{user?.username || "Scholar"}</span>
                <span className="px-2 py-0.5 text-[11px] font-mono bg-soft-stone text-ink rounded-pill">
                  Level {level}
                </span>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex flex-col gap-1 w-32 sm:w-44">
            <div className="flex justify-between text-[11px] text-body-muted font-sans">
              <span>XP Progress</span>
              <span className="font-mono text-ink text-[10px]">
                {xp}/{xpToNext}
              </span>
            </div>
            <div className="h-1.5 w-full bg-soft-stone rounded-full overflow-hidden">
              <div
                className="h-full bg-deep-green transition-all duration-500 rounded-full"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Cohere Pill Navigation Tabs */}
        <nav className="flex items-center bg-soft-stone/70 p-1 rounded-pill gap-1 border border-card-border">
          <button
            onClick={() => onTabChange("track")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-pill transition-all ${
              activeTab === "track"
                ? "bg-primary text-white shadow-sm"
                : "text-body-muted hover:text-ink hover:bg-soft-stone"
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Skill Tree</span>
          </button>

          <button
            onClick={() => onTabChange("workspace")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-pill transition-all ${
              activeTab === "workspace"
                ? "bg-primary text-white shadow-sm"
                : "text-body-muted hover:text-ink hover:bg-soft-stone"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Socratic Lab</span>
          </button>

          <button
            onClick={() => onTabChange("arena")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-pill transition-all ${
              activeTab === "arena"
                ? "bg-primary text-white shadow-sm"
                : "text-body-muted hover:text-ink hover:bg-soft-stone"
            }`}
          >
            <Swords className="h-3.5 w-3.5" />
            <span>Boss Arena</span>
          </button>

          <button
            onClick={() => onTabChange("calendar")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-pill transition-all ${
              activeTab === "calendar"
                ? "bg-primary text-white shadow-sm"
                : "text-body-muted hover:text-ink hover:bg-soft-stone"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </button>
        </nav>

        {/* Right: Streak & Combat Readiness Gauge & Obsidian Export */}
        <div className="flex items-center gap-4">
          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-soft-stone rounded-pill text-ink">
            <Flame className="h-3.5 w-3.5 text-coral fill-coral" />
            <span className="text-xs font-mono font-medium">{streak}d</span>
          </div>

          {/* Combat Readiness Gauge */}
          <div className="flex items-center gap-2 pl-2 border-l border-hairline">
            <CombatReadinessGauge percentage={readiness} size={38} />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] uppercase font-mono text-muted leading-none">
                Exam Readiness
              </span>
              <span className="text-xs font-mono font-medium text-ink leading-tight mt-0.5">
                R_exam
              </span>
            </div>
          </div>

          {/* Export to Obsidian */}
          <button
            onClick={onExportCanvas}
            title="Download Obsidian .canvas visual graph"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-hairline hover:border-ink rounded-pill text-xs font-medium text-ink transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Obsidian</span>
          </button>
        </div>
      </div>
    </header>
  );
};

