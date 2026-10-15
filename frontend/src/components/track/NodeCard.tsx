"use client";

import React from "react";
import { Lock, Zap, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { OntologyNode, NodeTier } from "../../lib/types";

interface NodeCardProps {
  node: OntologyNode;
  isUnlocked: boolean;
  priorityScore?: number;
  isSelected?: boolean;
  onSelect: (node: OntologyNode) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  isUnlocked,
  priorityScore,
  isSelected,
  onSelect,
}) => {
  const isMastered = node.mastery >= 0.70;
  const masteryPct = Math.round(node.mastery * 100);

  const getTierStyles = (tier: NodeTier) => {
    switch (tier) {
      case "SL":
        return {
          badge: "bg-emerald-950/70 text-emerald-400 border-emerald-600/40",
          accent: "text-emerald-400",
          bar: "bg-emerald-500",
        };
      case "HL":
        return {
          badge: "bg-purple-950/70 text-purple-400 border-purple-600/40",
          accent: "text-purple-400",
          bar: "bg-purple-500",
        };
      case "EX":
        return {
          badge: "bg-rose-950/70 text-rose-400 border-rose-600/40",
          accent: "text-rose-400",
          bar: "bg-rose-500",
        };
    }
  };

  const tierStyle = getTierStyles(node.tier);

  return (
    <div
      onClick={() => isUnlocked && onSelect(node)}
      className={`group relative p-4 rounded-xl border transition-all duration-300 text-left ${
        !isUnlocked
          ? "bg-gray-950/60 border-gray-800/80 opacity-60 cursor-not-allowed"
          : isSelected
          ? "bg-gray-900 border-blue-500 shadow-xl shadow-blue-500/20 ring-1 ring-blue-500 cursor-pointer"
          : "bg-surface-card hover:bg-gray-850 border-surface-border hover:border-gray-600 cursor-pointer shadow-md"
      }`}
    >
      {/* Top Row: Tier badge & Status Icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border ${tierStyle.badge}`}
          >
            {node.tier}
          </span>
          {priorityScore !== undefined && isUnlocked && !isMastered && (
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
              P(v): {priorityScore.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center">
          {!isUnlocked ? (
            <span className="flex items-center gap-1 text-[11px] text-gray-500">
              <Lock className="h-3.5 w-3.5 text-gray-500" />
              <span>Locked</span>
            </span>
          ) : isMastered ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Mastered</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>Ready</span>
            </span>
          )}
        </div>
      </div>

      {/* Node Title */}
      <h3 className="text-sm font-bold text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-1 mb-1">
        {node.title}
      </h3>

      {/* Summary excerpt */}
      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
        {node.summary || "Core syllabus objective for academic mastery."}
      </p>

      {/* Bottom Row: Mastery progress & estimated time */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>Mastery</span>
          <span className="font-mono text-gray-200">{masteryPct}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${tierStyle.bar} transition-all duration-500`}
            style={{ width: `${masteryPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {node.estimated_minutes} min
          </span>
          {node.prerequisites.length > 0 && (
            <span>{node.prerequisites.length} prereq(s)</span>
          )}
        </div>
      </div>
    </div>
  );
};
