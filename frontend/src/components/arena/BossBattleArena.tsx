"use client";

import React, { useState } from "react";
import { ShieldAlert, Skull, Trophy, HeartPulse, Target, CheckCircle2, RefreshCw } from "lucide-react";
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
      <div className="h-64 flex items-center justify-center text-muted font-mono text-xs">
        Loading Boss Arena telemetry...
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
      `⚔️ Conceptual Strike landed for ${damage} HP. Explaining core intuition dealt critical conceptual damage.`,
      ...prev,
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Cohere Pill Selector Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setSelectedBossType("MINI_BOSS")}
          className={`flex items-center gap-2 px-5 py-2 rounded-pill text-xs font-medium transition-all ${
            selectedBossType === "MINI_BOSS"
              ? "bg-primary text-white shadow-sm"
              : "bg-soft-stone text-body-muted hover:text-ink"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Mini-Boss: Midterm Colossus</span>
        </button>

        <button
          onClick={() => setSelectedBossType("MAIN_BOSS")}
          className={`flex items-center gap-2 px-5 py-2 rounded-pill text-xs font-medium transition-all ${
            selectedBossType === "MAIN_BOSS"
              ? "bg-primary text-white shadow-sm"
              : "bg-soft-stone text-body-muted hover:text-ink"
          }`}
        >
          <Skull className="h-3.5 w-3.5" />
          <span>Main Boss: Grand Turing Overlord</span>
        </button>

        <button
          onClick={onRefresh}
          title="Refresh Boss Telemetry"
          className="p-2 bg-soft-stone hover:bg-hairline text-ink rounded-pill transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Arena Stage: Cohere Dark Navy Feature Band */}
      <div className="relative rounded-lg bg-dark-navy text-white p-8 md:p-10 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Boss Portrait & Aura */}
          <div className="relative">
            <div
              className={`w-28 h-28 md:w-32 md:h-32 rounded-lg flex items-center justify-center border transition-all duration-700 ${
                activeBoss.is_defeated
                  ? "bg-white/10 border-pale-green text-pale-green"
                  : selectedBossType === "MAIN_BOSS"
                  ? "bg-white/5 border-coral/60 text-coral"
                  : "bg-white/5 border-white/20 text-white"
              }`}
            >
              {activeBoss.is_defeated ? (
                <Trophy className="h-14 w-14 text-pale-green animate-bounce" />
              ) : selectedBossType === "MAIN_BOSS" ? (
                <Skull className="h-14 w-14 text-coral" />
              ) : (
                <ShieldAlert className="h-14 w-14 text-white" />
              )}
            </div>

            {activeBoss.is_defeated && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-pale-green text-deep-green font-mono text-[10px] tracking-wider uppercase rounded-pill">
                Vanquished
              </span>
            )}
          </div>

          {/* Boss Titles */}
          <div>
            <div className="text-xs font-mono uppercase tracking-mono-label text-coral mb-1">
              {activeBoss.boss_type === "MAIN_BOSS" ? "Final Examination Trial" : "Midterm Milestone"}
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-normal text-white">
              {activeBoss.boss_name}
            </h2>
            <p className="text-xs text-white/70 mt-1 max-w-md mx-auto font-sans font-light">
              Boss HP is bound directly to your knowledge deficits across the required syllabus scope.
            </p>
          </div>

          {/* Dynamic Boss HP Bar */}
          <div className="w-full max-w-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-coral">
                <HeartPulse className="h-3.5 w-3.5" />
                <span>BOSS HP</span>
              </span>
              <span className="text-white">
                {activeBoss.current_hp} / {activeBoss.max_hp} ({activeBoss.hp_percentage}%)
              </span>
            </div>

            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  activeBoss.is_defeated
                    ? "bg-pale-green"
                    : activeBoss.hp_percentage > 50
                    ? "bg-coral"
                    : "bg-deep-green"
                }`}
                style={{ width: `${Math.max(activeBoss.is_defeated ? 0 : 4, activeBoss.hp_percentage)}%` }}
              />
            </div>

            {/* Formula callout */}
            <div className="p-2 bg-white/5 rounded-sm border border-white/10 text-[11px] text-white/60 font-mono">
              Formula: Boss HP = Max HP × (1 - Σ M_v / |Scope|)
            </div>
          </div>

          {/* Weakness Targeting List */}
          <div className="w-full max-w-xl text-left bg-white/[0.04] p-5 rounded-md border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/80">
              <Target className="h-3.5 w-3.5 text-coral" />
              <span>Targetable Concept Deficits (Mastery &lt; 70%)</span>
            </div>

            {activeBoss.unmastered_weaknesses.length === 0 ? (
              <div className="p-3 bg-white/10 border border-white/15 rounded-sm text-xs text-pale-green flex items-center gap-2 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>All scope concepts mastered. The boss defenses have collapsed.</span>
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
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-sm border border-white/10 hover:border-coral cursor-pointer transition-all flex items-center justify-between text-xs group"
                  >
                    <span className="text-white/90 group-hover:text-white truncate font-sans">
                      {weakness}
                    </span>
                    <span className="text-[10px] text-coral font-mono flex-shrink-0 ml-2">
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
              className="w-full py-3 bg-coral hover:bg-coral-soft text-primary font-sans font-medium text-xs rounded-pill transition-all disabled:opacity-40 cursor-pointer"
            >
              {activeBoss.is_defeated ? "Boss Slain • Victory Achieved" : "Execute Conceptual Strike"}
            </button>

            {/* Combat Feed Log */}
            <div className="bg-[#040e18] p-3.5 rounded-sm border border-white/10 text-left font-mono text-[11px] text-white/60 h-24 overflow-y-auto space-y-1">
              {combatLog.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  <span className="text-white/30">[{idx + 1}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

