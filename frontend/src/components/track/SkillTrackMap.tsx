"use client";

import React, { useState } from "react";
import { Sparkles, Network, ArrowDown, Filter } from "lucide-react";
import { OntologyNode, DAGStatus } from "../../lib/types";
import { NodeCard } from "./NodeCard";
import { playClick } from "../../lib/soundFx";

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
  const [filterTier, setFilterTier] = useState<string>("ALL");

  const unlockStates = dagStatus?.unlock_states || {};
  const priorities = dagStatus?.priorities || {};

  // Best next recommended topic based on highest P(v) among unlocked and pending
  const topCandidate = dagStatus?.ranked_schedule?.find(
    (item) => item.is_unlocked && item.mastery < 0.70
  );

  const filteredNodes = nodes.filter((n) => {
    if (filterTier === "SL") return n.tier === "SL";
    if (filterTier === "HL") return n.tier === "HL";
    if (filterTier === "EX") return n.tier === "EX";
    if (filterTier === "ACTIVE") return (unlockStates[n.id] ?? true) && n.mastery < 0.70;
    return true;
  });

  const slNodes = filteredNodes.filter((n) => n.tier === "SL");
  const hlNodes = filteredNodes.filter((n) => n.tier === "HL");
  const exNodes = filteredNodes.filter((n) => n.tier === "EX");

  const filterBtn = (key: string, label: string) => (
    <button
      onClick={() => {
        playClick();
        setFilterTier(key);
      }}
      className={`px-3 py-1 text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
        filterTier === key
          ? "bg-[#222733] border-[#c5a880] text-[#d4af37]"
          : "bg-[#161920] border-[#2d3545] text-[#94a3b8] hover:border-[#c5a880] hover:text-[#e2e8f0]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* RPG Hero Band */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-7 md:p-8"
        style={{
          backgroundColor: "#161920",
          border: "1px solid #2d3545",
          borderLeft: "3px solid #991b1b",
        }}
      >
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest mb-2 text-[#d4af37]">
            <Network className="h-4 w-4" />
            <span>Deterministic DAG Skill Tree</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-display uppercase tracking-wider text-[#e2e8f0]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Curriculum Dependency Map
          </h2>
          <p className="text-xs mt-1.5 font-sans font-light leading-relaxed text-[#94a3b8]">
            Nodes unlock automatically when all prerequisite concepts reach 70%+ mastery. Sequenced by Topological Priority weightings $P(v)$.
          </p>
        </div>

        {topCandidate && (
          <button
            onClick={() => {
              playClick();
              const matched = nodes.find((n) => n.id === topCandidate.node_id);
              if (matched) {
                onSelectNode(matched);
                onEnterLab(matched);
              }
            }}
            className="flex items-center gap-3 px-5 py-3 cursor-pointer text-left transition-all self-start md:self-auto bg-[#222733] border border-[#c5a880] hover:bg-[#2d3545]"
            style={{
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
            }}
          >
            <Sparkles className="h-5 w-5 flex-shrink-0 text-[#d4af37]" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest block text-[#d4af37]">
                Top Priority Quest P(v) = {topCandidate.priority.toFixed(2)}
              </span>
              <span className="text-sm font-medium block text-[#e2e8f0]">
                {topCandidate.title}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Tier Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#2d3545]">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-[#94a3b8]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#94a3b8]">
            Filter View:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filterBtn("ALL", "All Topics")}
            {filterBtn("ACTIVE", "Active Quests")}
            {filterBtn("SL", "SL Foundations")}
            {filterBtn("HL", "HL Rigor")}
            {filterBtn("EX", "EX Boss Proofs")}
          </div>
        </div>

        <div className="text-xs font-mono text-[#94a3b8]">
          Showing {filteredNodes.length} of {nodes.length} Nodes
        </div>
      </div>

      {/* Tier 1: SL Foundations */}
      {slNodes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#2d3545]">
            <span className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest bg-[#1a1f2e] text-[#94a3b8] border border-[#2d3545]">
              Tier 1 · SL
            </span>
            <h3
              className="text-base font-display uppercase tracking-wider text-[#e2e8f0]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Surface Level Foundations
            </h3>
            <span className="text-xs ml-auto font-mono text-[#94a3b8]">Prerequisites: None</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {slNodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                isUnlocked={unlockStates[node.id] ?? true}
                priorityScore={priorities[node.id]}
                isSelected={selectedNode?.id === node.id}
                onSelect={(n) => {
                  onSelectNode(n);
                  onEnterLab(n);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Animated Connector Beam SL -> HL */}
      {slNodes.length > 0 && hlNodes.length > 0 && (
        <div className="flex justify-center py-1">
          <div className="flex flex-col items-center gap-1 text-[#c5a880]">
            <div className="h-5 w-px bg-gradient-to-b from-[#94a3b8] to-[#2563eb] animate-pulse" />
            <ArrowDown className="h-4 w-4 animate-bounce text-[#d4af37]" />
          </div>
        </div>
      )}

      {/* Tier 2: HL Rigor */}
      {hlNodes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#2d3545]">
            <span className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest bg-[#1a1f2e] text-[#2563eb] border border-[#2563eb]">
              Tier 2 · HL
            </span>
            <h3
              className="text-base font-display uppercase tracking-wider text-[#e2e8f0]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              High Level Rigor &amp; State Transitions
            </h3>
            <span className="text-xs ml-auto font-mono text-[#94a3b8]">Prerequisites: Tier 1 Complete</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hlNodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                isUnlocked={unlockStates[node.id] ?? true}
                priorityScore={priorities[node.id]}
                isSelected={selectedNode?.id === node.id}
                onSelect={(n) => {
                  onSelectNode(n);
                  onEnterLab(n);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Animated Connector Beam HL -> EX */}
      {hlNodes.length > 0 && exNodes.length > 0 && (
        <div className="flex justify-center py-1">
          <div className="flex flex-col items-center gap-1 text-[#c5a880]">
            <div className="h-5 w-px bg-gradient-to-b from-[#2563eb] to-[#f59e0b] animate-pulse" />
            <ArrowDown className="h-4 w-4 animate-bounce text-[#d4af37]" />
          </div>
        </div>
      )}

      {/* Tier 3: EX Advanced */}
      {exNodes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#2d3545]">
            <span className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest bg-[#1a1f2e] text-[#f59e0b] border border-[#f59e0b]">
              Tier 3 · EX
            </span>
            <h3
              className="text-base font-display uppercase tracking-wider text-[#e2e8f0]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Advanced Extension &amp; Boss Tier
            </h3>
            <span className="text-xs ml-auto font-mono text-[#94a3b8]">Unlocks Final Overlord</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {exNodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                isUnlocked={unlockStates[node.id] ?? true}
                priorityScore={priorities[node.id]}
                isSelected={selectedNode?.id === node.id}
                onSelect={(n) => {
                  onSelectNode(n);
                  onEnterLab(n);
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
