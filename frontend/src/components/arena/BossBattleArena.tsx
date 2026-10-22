"use client";

import React, { useState } from "react";
import { ShieldAlert, Skull, Trophy, HeartPulse, Target, CheckCircle2, RefreshCw, Zap } from "lucide-react";
import { BossArenaStatus, BossInfo } from "../../lib/types";
import { playConceptualStrike, playMasteryChime, playClick } from "../../lib/soundFx";

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
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; text: string }[]>([]);
  const [combatLog, setCombatLog] = useState<string[]>([
    "Encounter initiated. Boss HP is synchronized directly with your syllabus knowledge deficits.",
  ]);

  if (!bossStatus) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs" style={{ color: "#94a3b8" }}>
        Loading Boss Arena telemetry...
      </div>
    );
  }

  const activeBoss: BossInfo =
    selectedBossType === "MINI_BOSS" ? bossStatus.mini_boss : bossStatus.main_boss;

  const handleSimulateStrike = () => {
    if (activeBoss.is_defeated) {
      playClick();
      setCombatLog((prev) => [
        `Boss is already vanquished! Claim your victory rewards in the Skill Tree.`,
        ...prev,
      ]);
      return;
    }
    const damage = Math.min(activeBoss.current_hp, 50);
    if (activeBoss.current_hp - damage <= 0) {
      playMasteryChime();
    } else {
      playConceptualStrike();
    }

    // Trigger floating damage text
    const damageId = Date.now();
    setFloatingDamage((prev) => [...prev, { id: damageId, text: `-${damage} HP CRITICAL!` }]);
    setTimeout(() => {
      setFloatingDamage((prev) => prev.filter((d) => d.id !== damageId));
    }, 1200);

    setCombatLog((prev) => [
      `⚔️ Conceptual Strike landed for ${damage} HP. Explaining core intuition dealt critical conceptual damage.`,
      ...prev,
    ]);
  };

  const tabBtn = (type: "MINI_BOSS" | "MAIN_BOSS", label: string, Icon: React.ElementType) => (
    <button
      onClick={() => setSelectedBossType(type)}
      className="flex items-center gap-2 px-5 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-100 cursor-pointer"
      style={{
        border: "1px solid",
        borderColor: selectedBossType === type ? "#c5a880" : "#2d3545",
        backgroundColor: selectedBossType === type ? "#222733" : "#161920",
        color: selectedBossType === type ? "#d4af37" : "#94a3b8",
        borderRadius: "0px",
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Boss Selector Tabs + Refresh */}
      <div className="flex items-center justify-center gap-2">
        {tabBtn("MINI_BOSS", "Mini-Boss: Midterm Colossus", ShieldAlert)}
        {tabBtn("MAIN_BOSS", "Main Boss: Grand Turing Overlord", Skull)}
        <button
          onClick={onRefresh}
          title="Refresh Boss Telemetry"
          className="p-2 transition-all cursor-pointer"
          style={{ border: "1px solid #2d3545", backgroundColor: "#161920", color: "#94a3b8" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#c5a880"; (e.currentTarget as HTMLButtonElement).style.color = "#d4af37"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2d3545"; (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Arena Stage — Deep dark with crimson accent */}
      <div
        className="relative overflow-hidden p-8 md:p-10"
        style={{
          backgroundColor: "#0d0e12",
          border: "1px solid #2d3545",
          borderTop: "3px solid #991b1b",
        }}
      >
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Boss Portrait */}
          <div className="relative">
            {/* Floating Damage Text */}
            {floatingDamage.map((d) => (
              <div
                key={d.id}
                className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-sm font-bold text-red-500 animate-bounce pointer-events-none z-20 whitespace-nowrap drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              >
                <Zap className="inline h-3.5 w-3.5 text-yellow-400 mr-1" />
                {d.text}
              </div>
            ))}

            <div
              className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center transition-all duration-700"
              style={{
                border: `2px solid ${activeBoss.is_defeated ? "#d4af37" : selectedBossType === "MAIN_BOSS" ? "#991b1b" : "#2d3545"}`,
                backgroundColor: "#161920",
                clipPath: "polygon(15px 0%, calc(100% - 15px) 0%, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0% calc(100% - 15px), 0% 15px)",
              }}
            >
              {activeBoss.is_defeated ? (
                <Trophy className="h-14 w-14 animate-bounce" style={{ color: "#d4af37" }} />
              ) : selectedBossType === "MAIN_BOSS" ? (
                <Skull className="h-14 w-14" style={{ color: "#991b1b" }} />
              ) : (
                <ShieldAlert className="h-14 w-14" style={{ color: "#94a3b8" }} />
              )}
            </div>

            {activeBoss.is_defeated && (
              <span
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 font-mono text-[10px] tracking-widest uppercase"
                style={{ backgroundColor: "#d4af37", color: "#0d0e12" }}
              >
                Vanquished
              </span>
            )}
          </div>

          {/* Boss Titles */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "#991b1b" }}>
              {activeBoss.boss_type === "MAIN_BOSS" ? "Final Examination Trial" : "Midterm Milestone"}
            </div>
            <h2
              className="text-2xl md:text-3xl font-display uppercase"
              style={{ fontFamily: "'Cinzel', serif", color: "#e2e8f0", letterSpacing: "0.15em" }}
            >
              {activeBoss.boss_name}
            </h2>
            <p className="text-xs mt-1 max-w-md mx-auto font-sans font-light" style={{ color: "#94a3b8" }}>
              Boss HP is bound directly to your knowledge deficits across the required syllabus scope.
            </p>
          </div>

          {/* Boss HP Bar — Flat crimson fill */}
          <div className="w-full max-w-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5" style={{ color: "#991b1b" }}>
                <HeartPulse className="h-3.5 w-3.5" />
                <span>BOSS HP</span>
              </span>
              <span style={{ color: "#e2e8f0" }}>
                {activeBoss.current_hp} / {activeBoss.max_hp} ({activeBoss.hp_percentage}%)
              </span>
            </div>

            {/* Flat bar — no border-radius */}
            <div
              className="h-4 w-full overflow-hidden"
              style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
            >
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${Math.max(activeBoss.is_defeated ? 0 : 4, activeBoss.hp_percentage)}%`,
                  backgroundColor: activeBoss.is_defeated ? "#d4af37" : activeBoss.hp_percentage > 50 ? "#991b1b" : "#c5a880",
                }}
              />
            </div>

            {/* Formula callout */}
            <div
              className="p-2 text-[11px] font-mono"
              style={{ backgroundColor: "#161920", border: "1px solid #2d3545", color: "#94a3b8" }}
            >
              Formula: Boss HP = Max HP × (1 - Σ M_v / |Scope|)
            </div>
          </div>

          {/* Weakness Targeting List */}
          <div
            className="w-full max-w-xl text-left p-5 space-y-3"
            style={{ backgroundColor: "#161920", border: "1px solid #2d3545" }}
          >
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: "#e2e8f0" }}>
              <Target className="h-3.5 w-3.5" style={{ color: "#991b1b" }} />
              <span>Targetable Concept Deficits (Mastery &lt; 70%)</span>
            </div>

            {activeBoss.unmastered_weaknesses.length === 0 ? (
              <div
                className="p-3 text-xs flex items-center gap-2 font-mono"
                style={{ backgroundColor: "#1a2d1a", border: "1px solid #2d3545", color: "#d4af37" }}
              >
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
                    className="p-3 cursor-pointer transition-all flex items-center justify-between text-xs group"
                    style={{ backgroundColor: "#222733", border: "1px solid #2d3545" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#991b1b"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2d3545"; }}
                  >
                    <span className="truncate font-sans" style={{ color: "#e2e8f0" }}>{weakness}</span>
                    <span className="text-[10px] font-mono flex-shrink-0 ml-2" style={{ color: "#991b1b" }}>
                      Train ➔
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Combat Actions */}
          <div className="w-full max-w-xl flex flex-col gap-3">
            <button
              onClick={handleSimulateStrike}
              disabled={activeBoss.is_defeated}
              className="w-full py-3 font-sans font-medium text-xs uppercase tracking-widest transition-all disabled:opacity-40 cursor-pointer"
              style={{
                backgroundColor: activeBoss.is_defeated ? "#222733" : "#991b1b",
                border: "1px solid",
                borderColor: activeBoss.is_defeated ? "#2d3545" : "#991b1b",
                color: "#e2e8f0",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              }}
            >
              {activeBoss.is_defeated ? "Boss Slain • Victory Achieved" : "Execute Conceptual Strike"}
            </button>

            {/* Combat Feed Log */}
            <div
              className="p-3.5 text-left font-mono text-[11px] h-24 overflow-y-auto space-y-1"
              style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545", color: "#94a3b8" }}
            >
              {combatLog.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  <span style={{ color: "#2d3545" }}>[{idx + 1}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
