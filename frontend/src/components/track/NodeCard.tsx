"use client";

import React from "react";
import { Lock, CheckCircle2, Clock, ExternalLink, Sparkles } from "lucide-react";
import { OntologyNode, NodeTier } from "../../lib/types";
import { playClick } from "../../lib/soundFx";

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
          badge: { backgroundColor: "#1a1f2e", color: "#94a3b8", border: "1px solid #2d3545" },
          bar: "#94a3b8",
        };
      case "HL":
        return {
          badge: { backgroundColor: "#1a1f2e", color: "#2563eb", border: "1px solid #2563eb" },
          bar: "#2563eb",
        };
      case "EX":
        return {
          badge: { backgroundColor: "#1a1f2e", color: "#f59e0b", border: "1px solid #f59e0b" },
          bar: "#f59e0b",
        };
    }
  };

  const tierStyle = getTierStyles(node.tier);

  const cardBg = !isUnlocked
    ? { backgroundColor: "#0d0e12", border: "1px solid #1e2535", opacity: 0.55 }
    : isSelected
    ? { backgroundColor: "#1a1f2e", border: "1px solid #c5a880", boxShadow: "0 0 20px rgba(212,175,55,0.15)" }
    : { backgroundColor: "#161920", border: "1px solid #2d3545" };

  const obsidianUri = `obsidian://open?vault=learning-vault&file=Subjects%2FAlgorithms%2F${node.id}.md`;

  return (
    <div
      onClick={() => {
        if (isUnlocked) {
          playClick();
          onSelect(node);
        }
      }}
      className={`group relative p-5 transition-all text-left ${!isUnlocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        ...cardBg,
        borderRadius: "0px",
        clipPath: isSelected
          ? "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)"
          : undefined,
      }}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span
            className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest"
            style={tierStyle.badge}
          >
            {node.tier}
          </span>
          {priorityScore !== undefined && isUnlocked && !isMastered && (
            <span
              className="px-2 py-0.5 text-[10px] font-mono"
              style={{ backgroundColor: "#222733", color: "#d4af37", border: "1px solid #c5a880" }}
            >
              P(v) {priorityScore.toFixed(2)}
            </span>
          )}
        </div>

        {/* Status Tag & Obsidian Deep Link */}
        <div className="flex items-center gap-2">
          {isMastered ? (
            <span className="flex items-center gap-1 text-[11px] font-mono text-[#10b981]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mastered</span>
            </span>
          ) : !isUnlocked ? (
            <span className="flex items-center gap-1 text-[11px] font-mono text-[#94a3b8]">
              <Lock className="h-3 w-3" />
              <span>Locked</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-mono text-[#d4af37]">
              <Sparkles className="h-3 w-3" />
              <span>Available</span>
            </span>
          )}

          <a
            href={obsidianUri}
            onClick={(e) => e.stopPropagation()}
            title="Open in local Obsidian Vault"
            className="p-1 hover:text-[#d4af37] text-[#94a3b8] transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Node Title */}
      <h3
        className="text-sm font-display uppercase tracking-wider line-clamp-1 mb-1 transition-colors"
        style={{
          color: isSelected ? "#d4af37" : isUnlocked ? "#e2e8f0" : "#4a5568",
          letterSpacing: "0.1em",
          fontFamily: "'Cinzel', serif",
        }}
      >
        {node.title}
      </h3>

      {/* Summary */}
      <p className="text-xs line-clamp-2 mb-4 leading-relaxed font-sans font-light text-[#94a3b8]">
        {node.summary}
      </p>

      {/* Bottom Progress Metrics */}
      <div className="space-y-1.5 pt-2" style={{ borderTop: "1px solid #2d3545" }}>
        <div className="flex items-center justify-between text-[11px] font-sans text-[#94a3b8]">
          <span>Mastery</span>
          <span className="font-mono text-[#e2e8f0]">{masteryPct}%</span>
        </div>

        <div className="h-1.5 w-full overflow-hidden bg-[#0d0e12] border border-[#2d3545]">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${masteryPct}%`,
              backgroundColor: tierStyle.bar,
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#94a3b8]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {node.estimated_minutes} min
          </span>
          <span>
            {node.prerequisites.length === 0
              ? "Prereq: None"
              : `${node.prerequisites.length} prerequisite(s)`}
          </span>
        </div>
      </div>
    </div>
  );
};
