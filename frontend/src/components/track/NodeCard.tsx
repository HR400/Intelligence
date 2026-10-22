"use client";

import React from "react";
import { Lock, Zap, CheckCircle2, Clock } from "lucide-react";
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
          badge: { backgroundColor: "#1a1f2e", color: "#94a3b8", border: "1px solid #2d3545" },
          bar: "#94a3b8", // Common
        };
      case "HL":
        return {
          badge: { backgroundColor: "#1a1f2e", color: "#2563eb", border: "1px solid #2563eb" },
          bar: "#2563eb", // Rare blue
        };
      case "EX":
        return {
          badge: { backgroundColor: "#1a1f2e", color: "#f59e0b", border: "1px solid #f59e0b" },
          bar: "#f59e0b", // Legendary gold
        };
    }
  };

  const tierStyle = getTierStyles(node.tier);

  const cardBg = !isUnlocked
    ? { backgroundColor: "#0d0e12", border: "1px solid #1e2535", opacity: 0.5 }
    : isSelected
    ? { backgroundColor: "#1a1f2e", border: "1px solid #c5a880" }
    : { backgroundColor: "#161920", border: "1px solid #2d3545" };

  return (
    <div
      onClick={() => isUnlocked && onSelect(node)}
      className={`group relative p-5 transition-all text-left ${!isUnlocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        ...cardBg,
        borderRadius: "0px",
        // Clip top-right corner on selected/hovered
      }}
      onMouseEnter={(e) => {
        if (isUnlocked && !isSelected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#c5a880";
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#1a1f2e";
        }
      }}
      onMouseLeave={(e) => {
        if (isUnlocked && !isSelected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#2d3545";
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#161920";
        }
      }}
    >
      {/* Top Row: Tier badge & Status Icon */}
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
              className="text-[10px] font-mono px-2 py-0.5"
              style={{ backgroundColor: "#222733", color: "#94a3b8", border: "1px solid #2d3545" }}
            >
              P(v): {priorityScore.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center">
          {!isUnlocked ? (
            <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: "#94a3b8" }}>
              <Lock className="h-3 w-3" />
              <span>Locked</span>
            </span>
          ) : isMastered ? (
            <span className="flex items-center gap-1 text-[11px] font-mono font-medium" style={{ color: "#d4af37" }}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mastered</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-mono font-medium" style={{ color: "#c5a880" }}>
              <Zap className="h-3.5 w-3.5" style={{ fill: "#c5a880" }} />
              <span>Ready</span>
            </span>
          )}
        </div>
      </div>

      {/* Node Title — Cinzel display font */}
      <h3
        className="text-sm font-display uppercase tracking-wider line-clamp-1 mb-1 transition-colors"
        style={{ color: isUnlocked ? "#e2e8f0" : "#4a5568", letterSpacing: "0.1em", fontFamily: "'Cinzel', serif" }}
      >
        {node.title}
      </h3>

      {/* Summary excerpt */}
      <p className="text-xs line-clamp-2 mb-4 leading-relaxed font-sans font-light" style={{ color: "#94a3b8" }}>
        {node.summary || "Core syllabus objective for academic mastery."}
      </p>

      {/* Bottom Row: Mastery flat bar & time */}
      <div className="space-y-1.5 pt-2" style={{ borderTop: "1px solid #2d3545" }}>
        <div className="flex items-center justify-between text-[11px] font-sans" style={{ color: "#94a3b8" }}>
          <span>Mastery</span>
          <span className="font-mono" style={{ color: "#e2e8f0" }}>{masteryPct}%</span>
        </div>
        {/* Flat RPG bar — no rounded corners */}
        <div
          className="h-1.5 w-full overflow-hidden"
          style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${masteryPct}%`, backgroundColor: tierStyle.bar }}
          />
        </div>
        <div className="flex items-center justify-between pt-1 text-[10px] font-mono" style={{ color: "#94a3b8" }}>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {node.estimated_minutes} min
          </span>
          {node.prerequisites.length > 0 && (
            <span>{node.prerequisites.length} prerequisite(s)</span>
          )}
        </div>
      </div>
    </div>
  );
};

