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
          badge: "bg-pale-green text-deep-green border-hairline",
          bar: "bg-deep-green",
        };
      case "HL":
        return {
          badge: "bg-pale-blue text-action-blue border-hairline",
          bar: "bg-action-blue",
        };
      case "EX":
        return {
          badge: "bg-soft-stone text-coral border-hairline",
          bar: "bg-coral",
        };
    }
  };

  const tierStyle = getTierStyles(node.tier);

  return (
    <div
      onClick={() => isUnlocked && onSelect(node)}
      className={`group relative p-5 rounded-sm border transition-all text-left ${
        !isUnlocked
          ? "bg-soft-stone/30 border-hairline/60 opacity-60 cursor-not-allowed"
          : isSelected
          ? "bg-canvas border-primary shadow-sm ring-1 ring-primary cursor-pointer"
          : "bg-canvas hover:bg-soft-stone/30 border-hairline hover:border-slate cursor-pointer"
      }`}
    >
      {/* Top Row: Tier badge & Status Icon */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-pill border ${tierStyle.badge}`}
          >
            {node.tier}
          </span>
          {priorityScore !== undefined && isUnlocked && !isMastered && (
            <span className="text-[10px] font-mono text-body-muted bg-soft-stone px-2 py-0.5 rounded-pill border border-card-border">
              P(v): {priorityScore.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center">
          {!isUnlocked ? (
            <span className="flex items-center gap-1 text-[11px] font-mono text-muted">
              <Lock className="h-3 w-3" />
              <span>Locked</span>
            </span>
          ) : isMastered ? (
            <span className="flex items-center gap-1 text-[11px] font-mono text-deep-green font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mastered</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-mono text-coral font-medium">
              <Zap className="h-3.5 w-3.5 fill-coral" />
              <span>Ready</span>
            </span>
          )}
        </div>
      </div>

      {/* Node Title */}
      <h3 className="text-sm font-display font-medium text-ink group-hover:text-primary transition-colors line-clamp-1 mb-1">
        {node.title}
      </h3>

      {/* Summary excerpt */}
      <p className="text-xs text-body-muted font-sans font-light line-clamp-2 mb-4 leading-relaxed">
        {node.summary || "Core syllabus objective for academic mastery."}
      </p>

      {/* Bottom Row: Mastery progress & estimated time */}
      <div className="space-y-1.5 pt-2 border-t border-card-border">
        <div className="flex items-center justify-between text-[11px] text-body-muted font-sans">
          <span>Mastery</span>
          <span className="font-mono text-ink text-[10px]">{masteryPct}%</span>
        </div>
        <div className="h-1 w-full bg-soft-stone rounded-full overflow-hidden">
          <div
            className={`h-full ${tierStyle.bar} transition-all duration-500`}
            style={{ width: `${masteryPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between pt-1 text-[10px] text-muted font-mono">
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

