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
      {/* Cohere Deep Green Product Band */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-deep-green text-white p-7 md:p-9 rounded-lg">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-mono-label text-coral mb-2">
            <Network className="h-4 w-4" />
            <span>Deterministic DAG Skill Tree</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display tracking-heading-tight text-white font-normal">
            Curriculum Dependency Map
          </h2>
          <p className="text-sm text-white/80 mt-2 font-sans font-light leading-relaxed">
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
            className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-3 rounded-md cursor-pointer text-left transition-all backdrop-blur-sm self-start md:self-auto"
          >
            <Sparkles className="h-5 w-5 text-coral flex-shrink-0" />
            <div>
              <span className="text-[10px] font-mono text-coral uppercase tracking-wider block">
                Top Priority Quest P(v) = {topCandidate.priority.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-white block">
                {topCandidate.title}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Tier 1: SL Foundations */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-hairline">
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium bg-soft-stone text-deep-green rounded-pill border border-card-border">
            Tier 1 • SL
          </span>
          <h3 className="text-base font-display font-medium text-ink">
            Standard Level Foundations
          </h3>
          <span className="text-xs text-body-muted ml-auto font-mono">
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
      <div className="flex justify-center text-slate">
        <ArrowDown className="h-5 w-5" />
      </div>

      {/* Tier 2: HL Core */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-hairline">
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium bg-pale-blue text-action-blue rounded-pill border border-card-border">
            Tier 2 • HL
          </span>
          <h3 className="text-base font-display font-medium text-ink">
            Higher Level Core Concepts
          </h3>
          <span className="text-xs text-body-muted ml-auto font-mono">
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
      <div className="flex justify-center text-slate">
        <ArrowDown className="h-5 w-5" />
      </div>

      {/* Tier 3: EX Advanced / Boss */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-hairline">
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium bg-soft-stone text-coral rounded-pill border border-card-border">
            Tier 3 • EX
          </span>
          <h3 className="text-base font-display font-medium text-ink">
            Advanced Extension & Boss Tier
          </h3>
          <span className="text-xs text-body-muted ml-auto font-mono">
            Unlocks Final Overlord
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

