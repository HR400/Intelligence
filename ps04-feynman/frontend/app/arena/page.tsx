"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HUDNav } from "../../components/HUDNav";
import { Swords, ShieldAlert, Skull, HeartPulse, Target, CheckCircle2 } from "lucide-react";

export default function ArenaPage() {
  const router = useRouter();
  const [bossHp, setBossHp] = useState<number>(285);
  const maxHp = 500;
  const hpPercent = Math.round((bossHp / maxHp) * 100);
  const [combatLog, setCombatLog] = useState<string[]>([
    "Encounter initiated. Boss HP is synchronized directly with your syllabus knowledge deficits.",
  ]);

  const handleStrike = () => {
    if (bossHp <= 0) return;
    const damage = Math.min(bossHp, 50);
    const newHp = Math.max(0, bossHp - damage);
    setBossHp(newHp);
    setCombatLog((prev) => [
      `⚔️ Conceptual Strike landed for ${damage} HP! First-principles invariant shattered a boss defense.`,
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#e2e8f0]">
      <HUDNav
        activeTab="arena"
        readinessPercentage={Math.round(((maxHp - bossHp) / maxHp) * 100)}
        onTabChange={(tab) => {
          if (tab === "workspace") router.push("/");
          if (tab === "track") router.push("/track");
        }}
      />

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        {/* Boss Encounter Header */}
        <div className="p-8 bg-[#161920] border border-[#2d3545] border-t-4 border-t-[#991b1b] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ef4444] mb-2">
                <Skull className="h-4 w-4" />
                <span>Mini Boss Encounter · Midterm Exam Readiness</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif uppercase tracking-wider text-[#e2e8f0]">
                Midterm Algorithmic Colossus
              </h1>
              <p className="text-xs text-[#94a3b8] mt-1 max-w-xl">
                Boss HP reflects your aggregate knowledge gaps in Asymptotic Recurrences, Dynamic Programming, and Graph Traversals.
              </p>
            </div>

            {/* Boss HP Bar */}
            <div className="w-full md:w-64 space-y-2 p-4 bg-[#0d0e12] border border-[#2d3545]">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1 text-[#ef4444]">
                  <HeartPulse className="h-3.5 w-3.5" /> HP
                </span>
                <span className="text-[#e2e8f0] font-bold">
                  {bossHp} / {maxHp} ({hpPercent}%)
                </span>
              </div>
              <div className="h-3 w-full bg-[#161920] border border-[#2d3545]">
                <div
                  className="h-full bg-[#991b1b] transition-all duration-500"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weakness Points Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
            <Target className="h-4 w-4" />
            Vulnerable Syllabus Weaknesses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#161920] border border-[#2d3545]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#ef4444] mb-1">
                Deficit · 65% Gap
              </div>
              <h3 className="text-sm font-semibold text-[#e2e8f0]">Dynamic Programming</h3>
              <p className="text-xs text-[#94a3b8] mt-1">Optimal substructure &amp; memoization tabulation.</p>
              <button
                onClick={() => router.push("/")}
                className="mt-3 w-full py-1 text-xs font-mono uppercase bg-[#222733] border border-[#c5a880] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0e12] transition-colors"
              >
                Attack in Lab →
              </button>
            </div>

            <div className="p-4 bg-[#161920] border border-[#2d3545]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#ef4444] mb-1">
                Deficit · 80% Gap
              </div>
              <h3 className="text-sm font-semibold text-[#e2e8f0]">Graph Traversals</h3>
              <p className="text-xs text-[#94a3b8] mt-1">Kahn in-degree &amp; cycle detection invariants.</p>
              <button
                onClick={() => router.push("/")}
                className="mt-3 w-full py-1 text-xs font-mono uppercase bg-[#222733] border border-[#c5a880] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0e12] transition-colors"
              >
                Attack in Lab →
              </button>
            </div>

            <div className="p-4 bg-[#161920] border border-[#2d3545]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#10b981] mb-1">
                Vanquished
              </div>
              <h3 className="text-sm font-semibold text-[#e2e8f0]">Divide &amp; Conquer</h3>
              <p className="text-xs text-[#94a3b8] mt-1">Recurrence trees &amp; Master Theorem mastered.</p>
              <div className="mt-3 py-1 text-center text-xs font-mono text-[#10b981] flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Weakness Neutralized
              </div>
            </div>
          </div>
        </div>

        {/* Combat Log & Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 p-5 bg-[#161920] border border-[#2d3545]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#94a3b8] mb-3">
              Combat Telemetry Log
            </h3>
            <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
              {combatLog.map((log, idx) => (
                <div key={idx} className="p-2 bg-[#0d0e12] border border-[#2d3545] text-[#e2e8f0]">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 p-5 bg-[#161920] border border-[#2d3545] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-2">
                Simulate Direct Strike
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Execute a conceptual strike to simulate the effect of proving an invariant in the Socratic Terminal.
              </p>
            </div>

            <button
              onClick={handleStrike}
              disabled={bossHp <= 0}
              className="w-full mt-4 py-2.5 bg-[#991b1b] hover:bg-[#b91c1c] text-[#e2e8f0] font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Swords className="h-4 w-4" />
              <span>{bossHp <= 0 ? "Boss Vanquished!" : "Conceptual Strike (50 HP)"}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
