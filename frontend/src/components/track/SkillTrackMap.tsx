"use client";

import React from "react";
import { Sparkles, Network, ArrowDown } from "lucide-react";
import { OntologyNode, DAGStatus, NodeTier } from "../../lib/types";
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
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header and Priority Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-surface-card to-indigo-950/30 p-5 rounded-2xl border border-blue-900/40 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Network className="h-4 w-4" />
            <span>Deterministic DAG Skill Tree</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Curriculum Dependency Map
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Nodes unlock automatically when all prerequisite concepts reach 70%+ mastery.
          </p>
        </div>

        {topCandidate && (
          <div className="flex items-center gap-3 bg-blue-900/30 border border-blue-500/40 px-4 py-2.5 rounded-xl">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse flex-shrink-0" />
            <div className="text-left">
              <span className="text-[10px] text-blue-300 uppercase font-bold block">
                Top Priority Quest P(v) = {topCandidate.priority.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-white block">
                {topCandidate.title}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tier 1: SL Foundations */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-800">
          <span className="px-2 py-0.5 text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 rounded">
            TIER 1 • SL
          </span>
          <h3 className="text-sm font-bold text-gray-200">
            Standard Level Foundations
          </h3>
          <span className="text-xs text-gray-500 ml-auto">
            Base building blocks
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="flex justify-center text-gray-600">
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </div>

      {/* Tier 2: HL Core */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-800">
          <span className="px-2 py-0.5 text-xs font-bold bg-purple-950/80 text-purple-400 border border-purple-700/50 rounded">
            TIER 2 • HL
          </span>
          <h3 className="text-sm font-bold text-gray-200">
            Higher Level Core Concepts
          </h3>
          <span className="text-xs text-gray-500 ml-auto">
            Requires SL mastery ≥ 70%
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="flex justify-center text-gray-600">
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </div>

      {/* Tier 3: EX Advanced / Boss */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-800">
          <span className="px-2 py-0.5 text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-700/50 rounded">
            TIER 3 • EX
          </span>
          <h3 className="text-sm font-bold text-gray-200">
            Advanced Extension & Boss Tier
          </h3>
          <span className="text-xs text-gray-500 ml-auto">
            Unlocks final Grand Turing Overlord
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4">
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
