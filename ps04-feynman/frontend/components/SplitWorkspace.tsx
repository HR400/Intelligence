"use client";

import React, { useState } from "react";
import { CheckSquare, Square, BookOpen, Clock, FileText, ExternalLink, ShieldCheck } from "lucide-react";
import { SocraticTerminal } from "./SocraticTerminal";
import { NodeData } from "./SkillTree";

interface SplitWorkspaceProps {
  node: NodeData;
  onEvaluationSuccess: (newMastery: number, xpAwarded: number) => void;
}

export const SplitWorkspace: React.FC<SplitWorkspaceProps> = ({
  node,
  onEvaluationSuccess,
}) => {
  const [completedObjectives, setCompletedObjectives] = useState<Record<string, boolean>>({
    mechanics: node.mastery_score >= 0.5,
    socratic: node.mastery_score >= 0.8,
    invariant: node.mastery_score >= 0.9,
  });

  const toggleObjective = (key: string) => {
    setCompletedObjectives((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentTier = node.depth_tiers?.[node.tier_unlocked];
  const outcomes = currentTier?.outcomes || [
    "Define core algorithmic invariant",
    "Analyze asymptotic recurrence boundary conditions",
    "Prove optimal substructure without circular definitions",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left Column: Markdown Notes & Syllabus Checklist */}
      <div className="lg:col-span-5 flex flex-col bg-[#161920] border border-[#2d3545] overflow-y-auto">
        {/* Note Header */}
        <div className="p-5 border-b border-[#2d3545] bg-[#0d0e12]">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#94a3b8] mb-1">
            <span>Obsidian Note: {node.node_id}.md</span>
            <span className="text-[#d4af37]">Tier: {node.tier_unlocked}</span>
          </div>
          <h2 className="text-lg font-serif uppercase tracking-wider text-[#e2e8f0]">
            {node.title}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-xs font-mono text-[#94a3b8]">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {currentTier?.estimated_minutes || 45} mins
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#d4af37]">
              <ShieldCheck className="h-3.5 w-3.5" />
              {Math.round(node.mastery_score * 100)}% Mastery
            </span>
          </div>
        </div>

        {/* Note Content */}
        <div className="p-6 space-y-6 text-sm text-[#e2e8f0]">
          {/* Target Conceptual Milestone */}
          <div className="p-4 bg-[#0d0e12] border-l-2 border-[#d4af37]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] mb-1">
              Depth Target Milestone
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {currentTier?.target || "Derive core algorithmic invariants and asymptotic bounds."}
            </p>
          </div>

          {/* Interactive Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-[#d4af37]" />
              Quest Objectives
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => toggleObjective("mechanics")}
                className="w-full text-left p-3 bg-[#0d0e12] border border-[#2d3545] hover:border-[#c5a880] flex items-start gap-2.5 transition-colors"
              >
                {completedObjectives.mechanics ? (
                  <CheckSquare className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-[#94a3b8] mt-0.5 shrink-0" />
                )}
                <div className="text-xs">
                  <span className={completedObjectives.mechanics ? "line-through text-[#94a3b8]" : "text-[#e2e8f0]"}>
                    Understand fundamental mechanics and mathematical recurrence.
                  </span>
                </div>
              </button>

              <button
                onClick={() => toggleObjective("socratic")}
                className="w-full text-left p-3 bg-[#0d0e12] border border-[#2d3545] hover:border-[#c5a880] flex items-start gap-2.5 transition-colors"
              >
                {completedObjectives.socratic ? (
                  <CheckSquare className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-[#94a3b8] mt-0.5 shrink-0" />
                )}
                <div className="text-xs">
                  <span className={completedObjectives.socratic ? "line-through text-[#94a3b8]" : "text-[#e2e8f0]"}>
                    Complete unassisted Socratic check in terminal (≥ 80% accuracy).
                  </span>
                </div>
              </button>

              <button
                onClick={() => toggleObjective("invariant")}
                className="w-full text-left p-3 bg-[#0d0e12] border border-[#2d3545] hover:border-[#c5a880] flex items-start gap-2.5 transition-colors"
              >
                {completedObjectives.invariant ? (
                  <CheckSquare className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-[#94a3b8] mt-0.5 shrink-0" />
                )}
                <div className="text-xs">
                  <span className={completedObjectives.invariant ? "line-through text-[#94a3b8]" : "text-[#e2e8f0]"}>
                    Derive N-1 prerequisite invariants and edge cases.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Syllabus Outcomes */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#94a3b8]">
              Verified Syllabus Outcomes
            </h3>
            <ul className="space-y-1.5 text-xs text-[#94a3b8] list-disc list-inside">
              {outcomes.map((out, idx) => (
                <li key={idx} className="leading-relaxed">
                  {out}
                </li>
              ))}
            </ul>
          </div>

          {/* Obsidian Vault Sync Notice */}
          <div className="p-3 bg-[#0d0e12] border border-[#2d3545] text-[11px] font-mono text-[#94a3b8] flex items-center justify-between">
            <span>Obsidian Path: ~/learning-vault/Subjects/{node.subject}/{node.node_id}.md</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#d4af37]" />
          </div>
        </div>
      </div>

      {/* Right Column: Socratic Terminal & Monaco Editor */}
      <div className="lg:col-span-7 h-full">
        <SocraticTerminal
          nodeId={node.node_id}
          nodeTitle={node.title}
          currentMastery={node.mastery_score}
          onEvaluationSuccess={onEvaluationSuccess}
        />
      </div>
    </div>
  );
};
