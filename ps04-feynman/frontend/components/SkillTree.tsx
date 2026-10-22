"use client";

import React from "react";
import { Lock, CheckCircle2, Sparkles, ArrowDown, BookOpen, Clock, Zap } from "lucide-react";

export interface NodeData {
  node_id: string;
  title: string;
  subject: string;
  tier_unlocked: "SL" | "HL" | "EX";
  mastery_score: number;
  xp_yield: number;
  status: "LOCKED" | "UNLOCKED" | "COMPLETED";
  prerequisites: string[];
  depth_tiers?: {
    SL: { target: string; outcomes: string[]; estimated_minutes: number };
    HL: { target: string; outcomes: string[]; estimated_minutes: number };
    EX: { target: string; outcomes: string[]; estimated_minutes: number };
  };
}

interface SkillTreeProps {
  nodes: NodeData[];
  selectedNodeId?: string;
  onSelectNode: (node: NodeData) => void;
  onEnterLab: (node: NodeData) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onEnterLab,
}) => {
  const slNodes = nodes.filter((n) => n.tier_unlocked === "SL");
  const hlNodes = nodes.filter((n) => n.tier_unlocked === "HL");
  const exNodes = nodes.filter((n) => n.tier_unlocked === "EX");

  const tierBadge = (tier: string) => {
    switch (tier) {
      case "SL":
        return "bg-[#1e293b] text-[#38bdf8] border-[#0284c7]";
      case "HL":
        return "bg-[#2e1065] text-[#c084fc] border-[#9333ea]";
      case "EX":
        return "bg-[#451a03] text-[#fbbf24] border-[#d97706]";
      default:
        return "bg-[#1f2937] text-[#9ca3af] border-[#4b5563]";
    }
  };

  const renderTierGroup = (tierLabel: string, tierSub: string, tierList: NodeData[], isLast: boolean) => (
    <div className="space-y-4">
      {/* Tier Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#2d3545]">
        <span className={`px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest border ${tierBadge(tierLabel)}`}>
          Tier: {tierLabel}
        </span>
        <h3 className="text-sm font-serif uppercase tracking-widest text-[#e2e8f0]">
          {tierSub}
        </h3>
        <span className="text-xs ml-auto font-mono text-[#94a3b8]">
          {tierList.filter((n) => n.status === "COMPLETED").length}/{tierList.length} Complete
        </span>
      </div>

      {/* Vertical Node Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tierList.map((node) => {
          const isSelected = selectedNodeId === node.node_id;
          const isLocked = node.status === "LOCKED";
          const isCompleted = node.status === "COMPLETED" || node.mastery_score >= 0.8;
          const masteryPct = Math.round(node.mastery_score * 100);

          return (
            <div
              key={node.node_id}
              onClick={() => onSelectNode(node)}
              className={`relative p-5 transition-all text-left border cursor-pointer ${
                isSelected
                  ? "bg-[#222733] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  : isLocked
                  ? "bg-[#0d0e12] border-[#1e2535] opacity-60 cursor-not-allowed"
                  : "bg-[#161920] border-[#2d3545] hover:border-[#c5a880] hover:bg-[#1a1f2c]"
              }`}
            >
              {/* Top Row: Tier + Status Indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${tierBadge(node.tier_unlocked)}`}>
                  {node.tier_unlocked} · {node.depth_tiers?.[node.tier_unlocked]?.estimated_minutes || 45}m
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#d4af37] flex items-center gap-1">
                    <Zap className="h-3 w-3" />+{node.xp_yield} XP
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[#10b981]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mastered
                    </span>
                  ) : isLocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[#94a3b8]">
                      <Lock className="h-3.5 w-3.5" /> Locked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[#d4af37]">
                      <Sparkles className="h-3.5 w-3.5" /> Ready
                    </span>
                  )}
                </div>
              </div>

              {/* Node Title */}
              <h4 className="text-sm font-semibold text-[#e2e8f0] mb-1">
                {node.title}
              </h4>

              {/* Target Concept */}
              <p className="text-xs text-[#94a3b8] mb-3 line-clamp-2">
                {node.depth_tiers?.[node.tier_unlocked]?.target || "Fundamental conceptual mechanics."}
              </p>

              {/* Mastery Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-[#2d3545]">
                <div className="flex justify-between text-[10px] font-mono text-[#94a3b8]">
                  <span>Socratic Mastery</span>
                  <span className="text-[#e2e8f0] font-bold">{masteryPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0d0e12] border border-[#2d3545]">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${masteryPct}%`,
                      backgroundColor: isCompleted ? "#10b981" : isLocked ? "#4b5563" : "#d4af37",
                    }}
                  />
                </div>
              </div>

              {/* Enter Lab Action */}
              {!isLocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterLab(node);
                  }}
                  className="mt-3 w-full py-1.5 px-3 text-xs font-mono uppercase tracking-wider bg-[#222733] border border-[#c5a880] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0e12] transition-colors"
                >
                  Enter Socratic Lab →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Downward Progression Connector */}
      {!isLast && (
        <div className="flex justify-center py-2">
          <div className="flex flex-col items-center gap-1 text-[#c5a880]">
            <div className="h-4 w-px bg-[#2d3545]" />
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header Banner */}
      <div className="p-6 bg-[#161920] border border-[#2d3545] border-l-4 border-l-[#d4af37]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37] mb-1">
          Deterministic DAG Skill Track
        </div>
        <h2 className="text-xl md:text-2xl font-serif uppercase tracking-wider text-[#e2e8f0]">
          CS 202: Algorithms &amp; Complexity Quest Path
        </h2>
        <p className="text-xs text-[#94a3b8] mt-1">
          Topologically sequenced. Nodes unlock automatically when prerequisite concepts achieve 80%+ mastery.
        </p>
      </div>

      {/* Vertical Tiers */}
      {renderTierGroup("SL", "Surface Level Foundations", slNodes, false)}
      {renderTierGroup("HL", "High Level Rigor & State Optimization", hlNodes, false)}
      {renderTierGroup("EX", "Expert Level Proofs & Exam Boss Material", exNodes, true)}
    </div>
  );
};
