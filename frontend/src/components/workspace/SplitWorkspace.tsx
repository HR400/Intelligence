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
    <div
      className="h-[calc(100vh-100px)] w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
      style={{
        backgroundColor: "#161920",
        border: "1px solid #2d3545",
      }}
    >
      {/* Left Pane: Concept notes & Feynman Checklist (5 cols) */}
      <div className="lg:col-span-5 h-full overflow-hidden border-b lg:border-b-0 lg:border-r" style={{ borderColor: "#2d3545" }}>
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

