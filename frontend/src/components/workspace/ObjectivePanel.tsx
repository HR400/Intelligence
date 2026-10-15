"use client";

import React from "react";
import { BookOpen, CheckSquare, Target, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { OntologyNode } from "../../lib/types";

interface ObjectivePanelProps {
  node: OntologyNode;
}

export const ObjectivePanel: React.FC<ObjectivePanelProps> = ({ node }) => {
  const masteryPct = Math.round(node.mastery * 100);

  return (
    <div className="h-full flex flex-col bg-surface border-r border-surface-border p-5 overflow-y-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-xs font-bold bg-blue-950/80 text-blue-400 border border-blue-700/50 rounded">
            {node.tier} Track
          </span>
          <span className="text-xs font-mono text-gray-400">
            {node.id}
          </span>
        </div>
        <h2 className="text-xl font-black text-gray-100 leading-snug">
          {node.title}
        </h2>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            {node.estimated_minutes} min study block
          </span>
          <span className="flex items-center gap-1 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Mastery: {masteryPct}%
          </span>
        </div>
      </div>

      {/* Progress meter */}
      <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400 font-medium">Topic Mastery Target</span>
          <span className="text-emerald-400 font-mono font-bold">
            {masteryPct}% / 70% to Unlock Next
          </span>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.min(100, masteryPct)}%` }}
          />
        </div>
      </div>

      {/* Theory & Overview */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <BookOpen className="h-4 w-4 text-blue-400" />
          <span>Core Conceptual Breakdown</span>
        </div>
        <div className="bg-surface-card p-4 rounded-xl border border-surface-border text-xs text-gray-300 leading-relaxed space-y-2">
          <p>{node.summary}</p>
          <p className="text-gray-400">
            In this phase, explain the foundational mechanism as if teaching a beginner. 
            Do not merely recite definitions; emphasize why the algorithm or structure exists, 
            its asymptotic trade-offs, and what failure modes it prevents.
          </p>
        </div>
      </div>

      {/* Prerequisites Checklist */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <Target className="h-4 w-4 text-purple-400" />
          <span>Prerequisites & Foundations</span>
        </div>
        <div className="bg-surface-card p-3 rounded-xl border border-surface-border space-y-1.5">
          {node.prerequisites.length === 0 ? (
            <p className="text-xs text-emerald-400 font-medium">
              ✓ Foundational topic (No upstream blockers)
            </p>
          ) : (
            node.prerequisites.map((prereq) => (
              <div key={prereq} className="flex items-center gap-2 text-xs text-gray-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-mono text-blue-300">[[{prereq}]]</span>
                <span className="text-gray-500 text-[11px] ml-auto">Verified</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Socratic Objectives */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <CheckSquare className="h-4 w-4 text-amber-400" />
          <span>Socratic Feynman Protocol</span>
        </div>
        <ul className="text-xs text-gray-400 space-y-2 list-none">
          <li className="flex items-start gap-2 bg-gray-900/50 p-2 rounded-lg border border-gray-800">
            <span className="text-blue-400 font-bold">1.</span>
            <span>Articulate the core invariant without using jargon.</span>
          </li>
          <li className="flex items-start gap-2 bg-gray-900/50 p-2 rounded-lg border border-gray-800">
            <span className="text-blue-400 font-bold">2.</span>
            <span>Derive runtime complexity or spatial footprint from first principles.</span>
          </li>
          <li className="flex items-start gap-2 bg-gray-900/50 p-2 rounded-lg border border-gray-800">
            <span className="text-blue-400 font-bold">3.</span>
            <span>Respond directly to the proctor's probing questions in the terminal.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
