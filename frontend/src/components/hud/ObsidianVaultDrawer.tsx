"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  RefreshCw,
  Layers,
  FolderSync,
  Bot,
} from "lucide-react";
import { VaultTelemetry } from "../../lib/types";
import { syncVaultToDisk, updateExternalVaultMastery } from "../../lib/api";
import { playMasteryChime, playClick } from "../../lib/soundFx";

interface ObsidianVaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: VaultTelemetry | null;
  onRefresh: () => void;
}

export const ObsidianVaultDrawer: React.FC<ObsidianVaultDrawerProps> = ({
  isOpen,
  onClose,
  telemetry,
  onRefresh,
}) => {
  const [isSyncingDisk, setIsSyncingDisk] = useState(false);
  const [simulatingNode, setSimulatingNode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncToDisk = async () => {
    playClick();
    setIsSyncingDisk(true);
    try {
      await syncVaultToDisk();
      onRefresh();
    } finally {
      setIsSyncingDisk(false);
    }
  };

  const handleSimulateExternalProof = async (nodeId: string, currentMastery: number) => {
    playClick();
    setSimulatingNode(nodeId);
    try {
      const newMastery = Math.min(1.0, currentMastery + 0.25);
      await updateExternalVaultMastery(nodeId, newMastery);
      playMasteryChime();
      onRefresh();
    } finally {
      setSimulatingNode(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className="relative w-full max-w-lg bg-[#161920] border-l border-[#2d3545] text-[#e2e8f0] flex flex-col h-full shadow-2xl z-10 font-sans"
        style={{ backgroundColor: "#161920" }}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2d3545] bg-[#0d0e12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center bg-[#222733] border border-[#c5a880] text-[#d4af37]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#94a3b8]">
                Local Storage Hub
              </div>
              <h2 className="text-base font-serif uppercase tracking-wider text-[#e2e8f0]">
                Obsidian Vault &amp; Pi Agent Bridge
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#222733] border border-transparent hover:border-[#2d3545] text-[#94a3b8] hover:text-[#e2e8f0] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Status banner */}
          <div className="p-4 bg-[#0d0e12] border border-[#2d3545] space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[#10b981] font-semibold">Vault Bridge Online</span>
              </span>
              <span className="text-[10px] font-mono text-[#94a3b8]">
                {telemetry?.total_notes || 6} Syllabus Notes
              </span>
            </div>
            <div className="text-xs font-mono text-[#94a3b8] break-all">
              Path: <span className="text-[#e2e8f0]">{telemetry?.vault_path || "~/learning-vault"}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37] flex items-center justify-between">
              <span>Obsidian Integration Actions</span>
              <button
                onClick={handleSyncToDisk}
                disabled={isSyncingDisk}
                className="flex items-center gap-1 px-2 py-0.5 bg-[#222733] border border-[#2d3545] hover:border-[#c5a880] text-[10px] text-[#e2e8f0] transition-colors"
              >
                <RefreshCw className={`h-2.5 w-2.5 ${isSyncingDisk ? "animate-spin" : ""}`} />
                <span>{isSyncingDisk ? "Writing..." : "Write All to Disk"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a
                href="obsidian://open?vault=learning-vault"
                className="flex items-center justify-center gap-2 p-3 bg-[#0d0e12] border border-[#2d3545] hover:border-[#c5a880] text-[#e2e8f0] hover:text-[#d4af37] transition-colors"
              >
                <FolderSync className="h-4 w-4" />
                <span>Open Vault</span>
              </a>

              <a
                href={telemetry?.canvas_uri || "obsidian://open?vault=learning-vault&file=viz%2Fcourse_curriculum.canvas"}
                className="flex items-center justify-center gap-2 p-3 bg-[#0d0e12] border border-[#2d3545] hover:border-[#c5a880] text-[#e2e8f0] hover:text-[#d4af37] transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Canvas</span>
              </a>
            </div>
          </div>

          {/* Pi Socratic Agent Status Card */}
          <div className="p-4 bg-[#0d0e12] border border-[#2d3545] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37]">
                <Bot className="h-4 w-4" />
                <span className="uppercase tracking-wider font-semibold">Pi Socratic Teacher Agent</span>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono bg-[#222733] border border-[#c5a880] text-[#d4af37]">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Configured in <code className="text-[#e2e8f0] bg-[#161920] px-1">.pi/agents/teacher.md</code>. Automatically evaluates first-principles derivations and modifies note YAML frontmatter.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono text-[#94a3b8]">
              <div className="p-2 bg-[#161920] border border-[#2d3545]">
                <span className="text-[#94a3b8]">Model:</span>
                <div className="text-[#e2e8f0] truncate">Gemini 2.0 Flash (Free)</div>
              </div>
              <div className="p-2 bg-[#161920] border border-[#2d3545]">
                <span className="text-[#94a3b8]">Limit:</span>
                <div className="text-[#e2e8f0]">≤ 150 Tokens / Turn</div>
              </div>
            </div>
          </div>

          {/* Real-time Notes in Vault */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] flex items-center justify-between">
              <span>Syllabus Notes in Vault (~/learning-vault/Subjects)</span>
              <span className="text-[#d4af37]">Live Sync</span>
            </div>

            <div className="space-y-2">
              {(telemetry?.notes || []).map((note) => {
                const masteryPct = Math.round(note.mastery * 100);
                const isMastered = note.mastery >= 0.7;

                return (
                  <div
                    key={note.id}
                    className="p-3 bg-[#0d0e12] border border-[#2d3545] hover:border-[#c5a880] transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#222733] border border-[#2d3545] text-[#94a3b8]">
                          {note.tier}
                        </span>
                        <a
                          href={note.obsidian_uri}
                          className="font-medium text-[#e2e8f0] hover:text-[#d4af37] truncate block"
                          title="Open in Obsidian Desktop"
                        >
                          {note.filename}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#94a3b8]">
                        <span>Mastery: {masteryPct}%</span>
                        <span>•</span>
                        <span className={isMastered ? "text-[#10b981]" : "text-[#f59e0b]"}>
                          {isMastered ? "Mastered" : "In Progress"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Simulate External Vault Edit Button */}
                      {!isMastered && (
                        <button
                          onClick={() => handleSimulateExternalProof(note.id, note.mastery)}
                          disabled={simulatingNode === note.id}
                          title="Simulate Pi Agent proving invariant in external note"
                          className="px-2 py-1 text-[10px] font-mono bg-[#222733] border border-[#c5a880] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0e12] transition-colors whitespace-nowrap"
                        >
                          {simulatingNode === note.id ? "Syncing..." : "+25% Pi Proof"}
                        </button>
                      )}

                      <a
                        href={note.obsidian_uri}
                        title="Open file directly in Obsidian"
                        className="p-1 text-[#94a3b8] hover:text-[#d4af37]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2d3545] bg-[#0d0e12] flex items-center justify-between text-xs font-mono text-[#94a3b8]">
          <span>Obsidian Protocol Handler Active</span>
          <a
            href="http://127.0.0.1:8000/api/v1/obsidian/canvas"
            target="_blank"
            rel="noreferrer"
            className="text-[#d4af37] hover:underline"
          >
            Download .canvas JSON
          </a>
        </div>
      </div>
    </div>
  );
};
