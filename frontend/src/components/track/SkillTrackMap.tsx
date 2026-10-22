"use client";

import React from "react";
import { Sparkles, Network, ArrowDown } from "lucide-react";
import { OntologyNode, DAGStatus } from "../../lib/types";
import { NodeCard } from "./NodeCard";

interface SkillTrackMapProps {
  nodes: OntologyNode[];
  dagStatus: DAGStatus | null;
  selectedNode: OntologyNode | null;
  onSelectNode: (node: OntologyNode) => void;
  onEnterLab: (node: OntologyNode) => void;
}

export const SkillTrackMap: React.FC<SkillTrackMapProps> = ({
  nodes,
  dagStatus,
  selectedNode,
  onSelectNode,
  onEnterLab,
}) => {
  // Group nodes by tier
  const slNodes = nodes.filter((n) => n.tier === "SL");
  const hlNodes = nodes.filter((n) => n.tier === "HL");
  const exNodes = nodes.filter((n) => n.tier === "EX");

  const unlockStates = dagStatus?.unlock_states || {};
  const priorities = dagStatus?.priorities || {};

  // Best next recommended topic based on highest P(v) among unlocked and pending
  const topCandidate = dagStatus?.ranked_schedule?.find(
    (item) => item.is_unlocked && item.mastery < 0.70
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* RPG Hero Band — Dark canvas with crimson/gold accent */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-7 md:p-9"
        style={{
          backgroundColor: "#161920",
          border: "1px solid #2d3545",
          borderLeft: "3px solid #991b1b",
        }}
      >
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest mb-3" style={{ color: "#d4af37" }}>
            <Network className="h-4 w-4" />
            <span>Deterministic DAG Skill Tree</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-display uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#e2e8f0", letterSpacing: "0.15em" }}
          >
            Curriculum Dependency Map
          </h2>
          <p className="text-sm mt-2 font-sans font-light leading-relaxed" style={{ color: "#94a3b8" }}>
            Nodes unlock automatically when all prerequisite concepts reach 70%+ mastery.
            Sequenced by Topological Sort and Topological Priority weightings.
          </p>
        </div>

        {topCandidate && (
          <button
            onClick={() => {
              const matched = nodes.find((n) => n.id === topCandidate.node_id);
              if (matched) {
                onSelectNode(matched);
                onEnterLab(matched);
              }
            }}
            className="flex items-center gap-3 px-5 py-3 cursor-pointer text-left transition-all self-start md:self-auto"
            style={{
              backgroundColor: "#222733",
              border: "1px solid #c5a880",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2d3545";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#222733";
            }}
          >
            <Sparkles className="h-5 w-5 flex-shrink-0" style={{ color: "#d4af37" }} />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest block" style={{ color: "#d4af37" }}>
                Top Priority Quest P(v) = {topCandidate.priority.toFixed(2)}
              </span>
              <span className="text-sm font-medium block" style={{ color: "#e2e8f0" }}>
                {topCandidate.title}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Tier 1: SL Foundations */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #2d3545" }}>
          <span
            className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest"
            style={{ backgroundColor: "#1a1f2e", color: "#94a3b8", border: "1px solid #2d3545" }}
          >
            Tier 1 · SL
          </span>
          <h3
            className="text-base font-display uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#e2e8f0", letterSpacing: "0.12em" }}
          >
            Standard Level Foundations
          </h3>
          <span className="text-xs ml-auto font-mono" style={{ color: "#94a3b8" }}>
            Base building blocks
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {slNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              isUnlocked={unlockStates[node.id] ?? true}
              priorityScore={priorities[node.id]}
              isSelected={selectedNode?.id === node.id}
              onSelect={onSelectNode}
            />
          ))}
        </div>
      </section>

      {/* Tier Connector */}
      <div className="flex justify-center" style={{ color: "#2d3545" }}>
        <ArrowDown className="h-5 w-5" />
      </div>

      {/* Tier 2: HL Core */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #2d3545" }}>
          <span
            className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest"
            style={{ backgroundColor: "#1a1f2e", color: "#2563eb", border: "1px solid #2563eb" }}
          >
            Tier 2 · HL
          </span>
          <h3
            className="text-base font-display uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#e2e8f0", letterSpacing: "0.12em" }}
          >
            Higher Level Core Concepts
          </h3>
          <span className="text-xs ml-auto font-mono" style={{ color: "#94a3b8" }}>
            Requires SL mastery ≥ 70%
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hlNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              isUnlocked={unlockStates[node.id] ?? false}
              priorityScore={priorities[node.id]}
              isSelected={selectedNode?.id === node.id}
              onSelect={onSelectNode}
            />
          ))}
        </div>
      </section>

      {/* Tier Connector */}
      <div className="flex justify-center" style={{ color: "#2d3545" }}>
        <ArrowDown className="h-5 w-5" />
      </div>

      {/* Tier 3: EX Advanced / Boss */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #2d3545" }}>
          <span
            className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest"
            style={{ backgroundColor: "#1a1f2e", color: "#f59e0b", border: "1px solid #f59e0b" }}
          >
            Tier 3 · EX
          </span>
          <h3
            className="text-base font-display uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#e2e8f0", letterSpacing: "0.12em" }}
          >
            Advanced Extension &amp; Boss Tier
          </h3>
          <span className="text-xs ml-auto font-mono" style={{ color: "#94a3b8" }}>
            Unlocks Final Overlord
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {exNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              isUnlocked={unlockStates[node.id] ?? false}
              priorityScore={priorities[node.id]}
              isSelected={selectedNode?.id === node.id}
              onSelect={onSelectNode}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
