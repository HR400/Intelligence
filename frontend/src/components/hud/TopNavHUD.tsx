"use client";

import React from "react";
import Link from "next/link";
import { Flame, Download, Calendar, Swords, Network, Terminal, Compass } from "lucide-react";
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

  const tabStyle = (tab: string) =>
    `flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium uppercase tracking-widest transition-all duration-100 border cursor-pointer ${
      activeTab === tab
        ? "border-[#c5a880] bg-[#222733] text-[#d4af37]"
        : "border-[#2d3545] bg-[#161920] text-[#94a3b8] hover:border-[#c5a880] hover:bg-[#222733] hover:text-[#d4af37]"
    }`;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b px-6 py-3"
      style={{ backgroundColor: "#161920", borderColor: "#2d3545" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left: Brand & User Level */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Logo — Clipped hexagonal badge */}
            <div
              className="h-9 w-9 flex items-center justify-center font-display font-bold text-lg"
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
              <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                Socratic Engine
              </div>
              <div className="text-sm font-medium flex items-center gap-2" style={{ color: "#e2e8f0" }}>
                <span>{user?.username || "Scholar"}</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                  style={{ backgroundColor: "#222733", border: "1px solid #c5a880", color: "#d4af37" }}
                >
                  Lvl {level}
                </span>
              </div>
            </div>
          </div>

          {/* XP Flat Bar */}
          <div className="flex flex-col gap-1 w-32 sm:w-44">
            <div className="flex justify-between text-[10px]" style={{ color: "#94a3b8" }}>
              <span className="font-mono uppercase tracking-wider">XP</span>
              <span className="font-mono" style={{ color: "#d4af37" }}>
                {xp}/{xpToNext}
              </span>
            </div>
            {/* RPG flat bar — no border-radius, solid fill */}
            <div
              className="h-2 w-full overflow-hidden"
              style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${xpPercentage}%`, backgroundColor: "#d4af37" }}
              />
            </div>
          </div>
        </div>

        {/* Center: Tactical Tab Navigation */}
        <nav className="flex items-center gap-0 border" style={{ borderColor: "#2d3545" }}>
          <button onClick={() => onTabChange("track")} className={tabStyle("track")}>
            <Network className="h-3.5 w-3.5" />
            <span>Skill Tree</span>
          </button>

          <button
            onClick={() => onTabChange("workspace")}
            className={tabStyle("workspace")}
            style={{ borderLeft: "0px" }}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Socratic Lab</span>
          </button>

          <button
            onClick={() => onTabChange("arena")}
            className={tabStyle("arena")}
            style={{ borderLeft: "0px" }}
          >
            <Swords className="h-3.5 w-3.5" />
            <span>Boss Arena</span>
          </button>

          <button
            onClick={() => onTabChange("calendar")}
            className={tabStyle("calendar")}
            style={{ borderLeft: "0px" }}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </button>
        </nav>

        {/* Right: Streak & Combat Readiness & Export */}
        <div className="flex items-center gap-4">
          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5"
            style={{ backgroundColor: "#222733", border: "1px solid #2d3545" }}
          >
            <Flame className="h-3.5 w-3.5" style={{ color: "#d4af37", fill: "#d4af37" }} />
            <span className="text-xs font-mono font-medium" style={{ color: "#e2e8f0" }}>{streak}d</span>
          </div>

          {/* Combat Readiness Gauge */}
          <div className="flex items-center gap-2 pl-2" style={{ borderLeft: "1px solid #2d3545" }}>
            <CombatReadinessGauge percentage={readiness} size={38} />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest leading-none" style={{ color: "#94a3b8" }}>
                Exam Readiness
              </span>
              <span className="text-xs font-mono font-medium leading-tight mt-0.5" style={{ color: "#d4af37" }}>
                R_exam
              </span>
            </div>
          </div>

          {/* Overview Landing Link */}
          <Link
            href="/landing"
            title="View Antigravity System Overview"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all"
            style={{
              border: "1px solid #2d3545",
              color: "#94a3b8",
              backgroundColor: "#161920",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c5a880";
              (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2d3545";
              (e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8";
            }}
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Overview</span>
          </Link>

          {/* Export to Obsidian */}
          <button
            onClick={onExportCanvas}
            title="Download Obsidian .canvas visual graph"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
            style={{
              border: "1px solid #2d3545",
              color: "#94a3b8",
              backgroundColor: "#161920",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#c5a880";
              (e.currentTarget as HTMLButtonElement).style.color = "#d4af37";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2d3545";
              (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
            }}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Obsidian</span>
          </button>
        </div>
      </div>
    </header>
  );
};

