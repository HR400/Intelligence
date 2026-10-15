"use client";

import React, { useState } from "react";
import { Swords, ShieldAlert, Skull, Trophy, Sparkles, HeartPulse, Target, CheckCircle2 } from "lucide-react";
import { BossArenaStatus, BossInfo } from "../../lib/types";

interface BossBattleArenaProps {
  bossStatus: BossArenaStatus | null;
  onRefresh: () => void;
  onSelectTopicForCombat: (topicId: string) => void;
}

export const BossBattleArena: React.FC<BossBattleArenaProps> = ({
  bossStatus,
  onRefresh,
  onSelectTopicForCombat,
}) => {
  const [selectedBossType, setSelectedBossType] = useState<"MINI_BOSS" | "MAIN_BOSS">("MINI_BOSS");
  const [combatLog, setCombatLog] = useState<string[]>([
    "Encounter initiated. Boss HP is synchronized directly with your syllabus knowledge deficits.",
  ]);

  if (!bossStatus) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 font-mono text-xs">
        Loading Boss Arena combat telemetry...
      </div>
    );
  }

  const activeBoss: BossInfo =
    selectedBossType === "MINI_BOSS" ? bossStatus.mini_boss : bossStatus.main_boss;

  const handleSimulateStrike = () => {
    if (activeBoss.is_defeated) {
      setCombatLog((prev) => [
        `Boss is already vanquished! Claim your victory rewards in the Skill Tree.`,
        ...prev,
      ]);
      return;
    }
    const damage = Math.min(activeBoss.current_hp, 50);
    setCombatLog((prev) => [
      `⚔️ Feynman Strike landed! Explaining core intuition dealt critical conceptual damage.`,
      ...prev,
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Boss Selector Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setSelectedBossType("MINI_BOSS")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            selectedBossType === "MINI_BOSS"
              ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-500"
              : "bg-surface-card text-gray-400 hover:text-gray-200 border border-surface-border"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Mini-Boss: Midterm Colossus</span>
        </button>

        <button
          onClick={() => setSelectedBossType("MAIN_BOSS")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            selectedBossType === "MAIN_BOSS"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-rose-500"
              : "bg-surface-card text-gray-400 hover:text-gray-200 border border-surface-border"
          }`}
        >
          <Skull className="h-4 w-4" />
          <span>Main Boss: Grand Turing Overlord</span>
        </button>
      </div>

      {/* Arena Stage */}
      <div className="relative rounded-3xl border border-rose-950/60 bg-gradient-to-b from-gray-950 via-surface to-gray-950 p-6 md:p-8 overflow-hidden shadow-2xl">
        {/* Ambient glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-rose-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Boss Portrait & Aura */}
          <div className="relative">
            <div
              className={`w-28 h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all duration-700 ${
                activeBoss.is_defeated
                  ? "bg-emerald-950/40 border-emerald-500 shadow-emerald-500/20"
                  : selectedBossType === "MAIN_BOSS"
                  ? "bg-gradient-to-b from-rose-950 to-gray-950 border-rose-500/80 shadow-rose-600/30 animate-pulse"
                  : "bg-gradient-to-b from-amber-950 to-gray-950 border-amber-500/80 shadow-amber-600/30"
              }`}
            >
              {activeBoss.is_defeated ? (
                <Trophy className="h-16 w-16 text-emerald-400 animate-bounce" />
              ) : selectedBossType === "MAIN_BOSS" ? (
                <Skull className="h-16 w-16 text-rose-500 animate-pulse" />
              ) : (
                <ShieldAlert className="h-16 w-16 text-amber-500" />
              )}
            </div>

            {activeBoss.is_defeated && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 text-black font-black text-[10px] tracking-wider uppercase rounded-full shadow-lg">
                Vanquished
              </span>
            )}
          </div>

          {/* Boss Titles */}
          <div>
            <div className="text-xs font-mono font-bold text-rose-400 tracking-widest uppercase mb-1">
              {activeBoss.boss_type === "MAIN_BOSS" ? "Final Examination Trial" : "Midterm Milestone"}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {activeBoss.boss_name}
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Boss HP is bound directly to your knowledge deficits across the required syllabus scope.
            </p>
          </div>

          {/* Dynamic Boss HP Bar */}
          <div className="w-full max-w-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-rose-400">
                <HeartPulse className="h-4 w-4" />
                <span>BOSS HP</span>
              </span>
              <span className="text-white">
                {activeBoss.current_hp} / {activeBoss.max_hp} ({activeBoss.hp_percentage}%)
              </span>
            </div>

            <div className="h-5 w-full bg-gray-900 rounded-xl overflow-hidden p-0.5 border border-gray-800">
              <div
                className={`h-full rounded-lg transition-all duration-700 ${
                  activeBoss.is_defeated
                    ? "bg-emerald-500"
                    : activeBoss.hp_percentage > 50
                    ? "bg-gradient-to-r from-rose-600 to-amber-500 shadow-md shadow-rose-600/50"
                    : "bg-gradient-to-r from-emerald-500 to-teal-400"
                }`}
                style={{ width: `${Math.max(activeBoss.is_defeated ? 0 : 4, activeBoss.hp_percentage)}%` }}
              />
            </div>

            {/* Formula callout */}
            <div className="p-2.5 bg-gray-900/60 rounded-xl border border-gray-800 text-[11px] text-gray-400 font-mono">
              Formula: Boss HP = Max HP × (1 - Σ M_v / |Scope|)
            </div>
          </div>

          {/* Weakness Targeting List */}
          <div className="w-full max-w-xl text-left bg-surface-card p-4 rounded-2xl border border-surface-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
              <Target className="h-4 w-4 text-amber-400" />
              <span>Targetable Concept Weaknesses (Mastery &lt; 70%)</span>
            </div>

            {activeBoss.unmastered_weaknesses.length === 0 ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>All scope concepts mastered! The boss defenses have collapsed.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeBoss.unmastered_weaknesses.map((weakness, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const matchedId = activeBoss.scope_node_ids[i];
                      if (matchedId) onSelectTopicForCombat(matchedId);
                    }}
                    className="p-2.5 bg-gray-900/80 hover:bg-gray-800 rounded-xl border border-gray-800 hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between text-xs group"
                  >
                    <span className="text-gray-300 group-hover:text-white truncate font-medium">
                      {weakness}
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono flex-shrink-0 ml-2">
                      Train ➔
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions & Combat Feed */}
          <div className="w-full max-w-xl flex flex-col gap-3">
            <button
              onClick={handleSimulateStrike}
              disabled={activeBoss.is_defeated}
              className="w-full py-3 bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 hover:from-rose-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              {activeBoss.is_defeated ? "Boss Slain • Victory Achieved" : "Execute Conceptual Strike"}
            </button>

            {/* Combat Feed Log */}
            <div className="bg-gray-950 p-3 rounded-xl border border-gray-900 text-left font-mono text-[11px] text-gray-400 h-24 overflow-y-auto space-y-1">
              {combatLog.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  <span className="text-gray-600">[{idx + 1}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
