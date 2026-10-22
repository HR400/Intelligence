"use client";

import React from "react";
import { BookOpen, CheckSquare, Target, Clock, ShieldCheck } from "lucide-react";
import { OntologyNode } from "../../lib/types";

interface ObjectivePanelProps {
  node: OntologyNode;
}

export const ObjectivePanel: React.FC<ObjectivePanelProps> = ({ node }) => {
  const masteryPct = Math.round(node.mastery * 100);

  const getTierColor = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "EX":
        return { border: "#f59e0b", color: "#f59e0b", bg: "#f59e0b15" }; // Legendary
      case "HL":
        return { border: "#2563eb", color: "#2563eb", bg: "#2563eb15" }; // Rare
      case "SL":
      default:
        return { border: "#94a3b8", color: "#94a3b8", bg: "#94a3b815" }; // Common
    }
  };

  const tierStyle = getTierColor(node.tier);

  return (
    <div
      className="h-full flex flex-col p-6 overflow-y-auto space-y-6"
      style={{ backgroundColor: "#161920", color: "#e2e8f0" }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="px-2.5 py-0.5 text-[10px] font-mono tracking-widest uppercase"
            style={{
              backgroundColor: tierStyle.bg,
              border: `1px solid ${tierStyle.border}`,
              color: tierStyle.color,
            }}
          >
            {node.tier} Tier
          </span>
          <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>
            {node.id}
          </span>
        </div>
        <h2
          className="text-2xl font-display uppercase tracking-wide leading-tight"
          style={{ fontFamily: "'Cinzel', serif", color: "#e2e8f0" }}
        >
          {node.title}
        </h2>
        <div className="flex items-center gap-5 mt-3 text-xs" style={{ color: "#94a3b8" }}>
          <span className="flex items-center gap-1.5 font-mono">
            <Clock className="h-3.5 w-3.5" style={{ color: "#94a3b8" }} />
            {node.estimated_minutes}m block
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <ShieldCheck
              className="h-3.5 w-3.5"
              style={{ color: masteryPct >= 70 ? "#d4af37" : "#2563eb" }}
            />
            Mastery: <span style={{ color: "#e2e8f0" }}>{masteryPct}%</span>
          </span>
        </div>
      </div>

      {/* Progress meter — Continuous flat RPG status bar */}
      <div
        className="p-4 space-y-2"
        style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
      >
        <div className="flex justify-between items-center text-xs font-mono">
          <span style={{ color: "#94a3b8" }}>Topic Mastery Target</span>
          <span style={{ color: masteryPct >= 70 ? "#d4af37" : "#2563eb" }}>
            {masteryPct}% / 70% Required
          </span>
        </div>
        <div
          className="h-3 w-full overflow-hidden"
          style={{ backgroundColor: "#161920", border: "1px solid #2d3545" }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(3, masteryPct))}%`,
              backgroundColor: masteryPct >= 70 ? "#d4af37" : "#2563eb",
            }}
          />
        </div>
      </div>

      {/* Theory & Overview */}
      <div className="space-y-2">
        <div
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
          style={{ color: "#94a3b8" }}
        >
          <BookOpen className="h-3.5 w-3.5" style={{ color: "#d4af37" }} />
          <span>Core Conceptual Breakdown</span>
        </div>
        <div
          className="p-4 text-xs font-light leading-relaxed space-y-2.5 font-sans"
          style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545", color: "#e2e8f0" }}
        >
          <p>{node.summary}</p>
          <p className="text-[11px] font-mono leading-normal" style={{ color: "#94a3b8" }}>
            Feynman Protocol: Explain the foundational mechanism clearly. Emphasize why the algorithm
            or structure exists, its asymptotic trade-offs, and critical failure modes it prevents.
          </p>
        </div>
      </div>

      {/* Prerequisites Checklist */}
      <div className="space-y-2">
        <div
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
          style={{ color: "#94a3b8" }}
        >
          <Target className="h-3.5 w-3.5" style={{ color: "#d4af37" }} />
          <span>Prerequisites &amp; Foundations</span>
        </div>
        <div
          className="p-3.5 space-y-2"
          style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
        >
          {node.prerequisites.length === 0 ? (
            <p className="text-xs font-mono" style={{ color: "#d4af37" }}>
              ✓ Foundational topic (No upstream blockers)
            </p>
          ) : (
            node.prerequisites.map((prereq) => (
              <div
                key={prereq}
                className="flex items-center justify-between p-2 text-xs"
                style={{ backgroundColor: "#161920", border: "1px solid #2d3545" }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
                  <span className="font-mono" style={{ color: "#2563eb" }}>[[{prereq}]]</span>
                </div>
                <span className="text-[10px] font-mono uppercase" style={{ color: "#94a3b8" }}>
                  Verified
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Socratic Objectives */}
      <div className="space-y-2">
        <div
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
          style={{ color: "#94a3b8" }}
        >
          <CheckSquare className="h-3.5 w-3.5" style={{ color: "#991b1b" }} />
          <span>Socratic Feynman Protocol</span>
        </div>
        <ul className="text-xs space-y-2 list-none">
          <li
            className="flex items-start gap-3 p-3 font-sans"
            style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
          >
            <span className="font-mono font-medium" style={{ color: "#d4af37" }}>01.</span>
            <span style={{ color: "#94a3b8" }}>
              Articulate the core invariant and intuition without relying on technical buzzwords.
            </span>
          </li>
          <li
            className="flex items-start gap-3 p-3 font-sans"
            style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
          >
            <span className="font-mono font-medium" style={{ color: "#d4af37" }}>02.</span>
            <span style={{ color: "#94a3b8" }}>
              Derive runtime complexity and spatial footprint from first principles.
            </span>
          </li>
          <li
            className="flex items-start gap-3 p-3 font-sans"
            style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
          >
            <span className="font-mono font-medium" style={{ color: "#d4af37" }}>03.</span>
            <span style={{ color: "#94a3b8" }}>
              Respond directly to the proctor&apos;s probing questions in the terminal.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
