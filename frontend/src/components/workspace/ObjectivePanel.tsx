"use client";

import React from "react";
import { BookOpen, CheckSquare, Target, Clock, ShieldCheck } from "lucide-react";
import { OntologyNode } from "../../lib/types";

interface ObjectivePanelProps {
  node: OntologyNode;
}

export const ObjectivePanel: React.FC<ObjectivePanelProps> = ({ node }) => {
  const masteryPct = Math.round(node.mastery * 100);

  return (
    <div className="h-full flex flex-col bg-canvas border-r border-hairline p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium bg-soft-stone text-deep-green rounded-pill border border-card-border">
            {node.tier} Track
          </span>
          <span className="text-xs font-mono text-muted">
            {node.id}
          </span>
        </div>
        <h2 className="text-2xl font-display font-medium text-ink leading-tight">
          {node.title}
        </h2>
        <div className="flex items-center gap-4 mt-3 text-xs text-body-muted">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="h-3.5 w-3.5 text-muted" />
            {node.estimated_minutes} min study block
          </span>
          <span className="flex items-center gap-1 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-deep-green" />
            Mastery: {masteryPct}%
          </span>
        </div>
      </div>

      {/* Progress meter */}
      <div className="bg-soft-stone/50 p-4 rounded-sm border border-card-border">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-body-muted font-sans">Topic Mastery Target</span>
          <span className="text-deep-green font-mono font-medium">
            {masteryPct}% / 70% to Unlock Next
          </span>
        </div>
        <div className="h-1.5 w-full bg-soft-stone rounded-full overflow-hidden">
          <div
            className="h-full bg-deep-green transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, masteryPct)}%` }}
          />
        </div>
      </div>

      {/* Theory & Overview */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted">
          <BookOpen className="h-3.5 w-3.5 text-ink" />
          <span>Core Conceptual Breakdown</span>
        </div>
        <div className="bg-soft-stone/40 p-4 rounded-sm border border-card-border text-sm text-ink font-light leading-relaxed space-y-2">
          <p>{node.summary}</p>
          <p className="text-body-muted text-xs">
            In this phase, explain the foundational mechanism as if teaching a beginner. 
            Do not merely recite definitions; emphasize why the algorithm or structure exists, 
            its asymptotic trade-offs, and what failure modes it prevents.
          </p>
        </div>
      </div>

      {/* Prerequisites Checklist */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted">
          <Target className="h-3.5 w-3.5 text-ink" />
          <span>Prerequisites & Foundations</span>
        </div>
        <div className="bg-soft-stone/40 p-3.5 rounded-sm border border-card-border space-y-2">
          {node.prerequisites.length === 0 ? (
            <p className="text-xs text-deep-green font-mono font-medium">
              ✓ Foundational topic (No upstream blockers)
            </p>
          ) : (
            node.prerequisites.map((prereq) => (
              <div key={prereq} className="flex items-center gap-2 text-xs text-ink">
                <ShieldCheck className="h-3.5 w-3.5 text-deep-green" />
                <span className="font-mono text-action-blue">[[{prereq}]]</span>
                <span className="text-muted text-[11px] font-mono ml-auto">Verified</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Socratic Objectives */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted">
          <CheckSquare className="h-3.5 w-3.5 text-coral" />
          <span>Socratic Feynman Protocol</span>
        </div>
        <ul className="text-xs text-ink space-y-2 list-none">
          <li className="flex items-start gap-2.5 bg-canvas p-3 rounded-sm border border-card-border">
            <span className="text-coral font-mono font-medium">1.</span>
            <span className="text-body-muted font-light">Articulate the core invariant without using technical jargon.</span>
          </li>
          <li className="flex items-start gap-2.5 bg-canvas p-3 rounded-sm border border-card-border">
            <span className="text-coral font-mono font-medium">2.</span>
            <span className="text-body-muted font-light">Derive runtime complexity or spatial footprint from first principles.</span>
          </li>
          <li className="flex items-start gap-2.5 bg-canvas p-3 rounded-sm border border-card-border">
            <span className="text-coral font-mono font-medium">3.</span>
            <span className="text-body-muted font-light">Respond directly to the proctor&apos;s probing questions in the terminal.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

