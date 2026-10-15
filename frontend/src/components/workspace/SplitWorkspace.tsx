"use client";

import React from "react";
import { OntologyNode, FeynmanResult } from "../../lib/types";
import { ObjectivePanel } from "./ObjectivePanel";
import { SocraticTerminal } from "./SocraticTerminal";

interface SplitWorkspaceProps {
  node: OntologyNode;
  onEvaluationSuccess: (result: FeynmanResult) => void;
}

export const SplitWorkspace: React.FC<SplitWorkspaceProps> = ({
  node,
  onEvaluationSuccess,
}) => {
  return (
    <div className="h-[calc(100vh-80px)] w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden border border-surface-border rounded-2xl bg-surface shadow-2xl">
      {/* Left Pane: Concept notes & Feynman Checklist (5 cols) */}
      <div className="lg:col-span-5 h-full overflow-hidden">
        <ObjectivePanel node={node} />
      </div>

      {/* Right Pane: Monaco Terminal & Interactive Proctor (7 cols) */}
      <div className="lg:col-span-7 h-full overflow-hidden">
        <SocraticTerminal
          node={node}
          onEvaluationSuccess={onEvaluationSuccess}
        />
      </div>
    </div>
  );
};
