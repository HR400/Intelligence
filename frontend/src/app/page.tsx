"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { TopNavHUD } from "../components/hud/TopNavHUD";
import { ObsidianVaultDrawer } from "../components/hud/ObsidianVaultDrawer";
import { SkillTrackMap } from "../components/track/SkillTrackMap";
import { SplitWorkspace } from "../components/workspace/SplitWorkspace";
import { BossBattleArena } from "../components/arena/BossBattleArena";
import { CalendarScheduleView } from "../components/calendar/CalendarScheduleView";
import {
  fetchCourseTrack,
  fetchDAGStatus,
  fetchBossStatus,
  fetchUserProfile,
  fetchCalendarEvents,
  fetchVaultTelemetry,
  isBackendLive,
} from "../lib/api";
import {
  DEFAULT_USER,
  DEFAULT_TRACK,
  DEFAULT_DAG_STATUS,
  DEFAULT_BOSS_STATUS,
  DEFAULT_CALENDAR_EVENTS,
} from "../lib/mockData";
import {
  CourseTrack,
  DAGStatus,
  BossArenaStatus,
  User,
  OntologyNode,
  CalendarEvent,
  FeynmanResult,
  VaultTelemetry,
} from "../lib/types";
import { playLevelUp } from "../lib/soundFx";
import { RefreshCw, Compass, Layers } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"track" | "workspace" | "arena" | "calendar">("track");
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [track, setTrack] = useState<CourseTrack>(DEFAULT_TRACK);
  const [dagStatus, setDagStatus] = useState<DAGStatus>(DEFAULT_DAG_STATUS);
  const [bossStatus, setBossStatus] = useState<BossArenaStatus>(DEFAULT_BOSS_STATUS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(DEFAULT_CALENDAR_EVENTS);
  const [selectedNode, setSelectedNode] = useState<OntologyNode>(DEFAULT_TRACK.nodes[0]);
  const [vaultTelemetry, setVaultTelemetry] = useState<VaultTelemetry | null>(null);
  const [isVaultDrawerOpen, setIsVaultDrawerOpen] = useState<boolean>(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [levelUpAlert, setLevelUpAlert] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const live = await isBackendLive();
      setIsLiveConnected(live);

      const [u, t, d, b, c, v] = await Promise.all([
        fetchUserProfile(),
        fetchCourseTrack(),
        fetchDAGStatus(),
        fetchBossStatus(),
        fetchCalendarEvents(),
        fetchVaultTelemetry(),
      ]);

      setUser(u || DEFAULT_USER);
      setTrack(t || DEFAULT_TRACK);
      setDagStatus(d || DEFAULT_DAG_STATUS);
      setBossStatus(b || DEFAULT_BOSS_STATUS);
      setCalendarEvents(c || DEFAULT_CALENDAR_EVENTS);
      setVaultTelemetry(v);

      // Default select the first unlocked pending node if available
      const nodes = t?.nodes || DEFAULT_TRACK.nodes;
      const unlocks = d?.unlock_states || DEFAULT_DAG_STATUS.unlock_states;
      const topPending = nodes.find(
        (n) => (unlocks[n.id] ?? true) && n.mastery < 0.70
      );
      if (topPending) {
        setSelectedNode(topPending);
      }
    } catch (err) {
      console.warn("Using offline fallback data:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleEvaluationSuccess = (result: FeynmanResult) => {
    if (selectedNode) {
      setSelectedNode({
        ...selectedNode,
        mastery: result.new_mastery,
      });
    }

    if (result.leveled_up) {
      playLevelUp();
      setLevelUpAlert(`🎉 Level Up! You reached Level ${result.current_level}!`);
      setTimeout(() => setLevelUpAlert(null), 5000);
    }

    loadAllData();
  };

  const handleExportCanvas = () => {
    window.open("http://127.0.0.1:8000/api/v1/obsidian/canvas", "_blank");
  };

  const handleSelectTopicFromArena = (topicId: string) => {
    const found = track.nodes.find((n) => n.id === topicId);
    if (found) {
      setSelectedNode(found);
      setActiveTab("workspace");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: "#0d0e12", color: "#e2e8f0" }}>
      {/* Top Navigation HUD */}
      <TopNavHUD
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportCanvas={handleExportCanvas}
        onOpenVaultDrawer={() => setIsVaultDrawerOpen(true)}
      />

      {/* Obsidian Vault Slide-over Drawer */}
      <ObsidianVaultDrawer
        isOpen={isVaultDrawerOpen}
        onClose={() => setIsVaultDrawerOpen(false)}
        telemetry={vaultTelemetry}
        onRefresh={loadAllData}
      />

      {/* Telemetry Status Bar */}
      <div
        className="w-full px-6 py-1.5 flex items-center justify-between text-[11px] font-mono border-b"
        style={{
          backgroundColor: "#161920",
          borderColor: "#2d3545",
          color: "#94a3b8",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full inline-block animate-pulse"
              style={{ backgroundColor: isLiveConnected ? "#10b981" : "#f59e0b" }}
            />
            <span style={{ color: isLiveConnected ? "#10b981" : "#d4af37" }}>
              {isLiveConnected
                ? "Backend Connected (Port 8000)"
                : "Offline Demo Mode (FastAPI Auto-Syncing)"}
            </span>
          </span>
          <span className="hidden sm:inline" style={{ color: "#2d3545" }}>|</span>
          <span className="hidden sm:inline">Active Syllabus: {track.title}</span>
          <span className="hidden md:inline" style={{ color: "#2d3545" }}>|</span>
          <button
            onClick={() => setIsVaultDrawerOpen(true)}
            className="hidden md:flex items-center gap-1 hover:text-[#d4af37] transition-colors"
          >
            <Layers className="h-3 w-3 text-[#d4af37]" />
            <span>Vault: ~/learning-vault ({vaultTelemetry?.total_notes || 6} notes)</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/landing"
            className="flex items-center gap-1 hover:text-[#d4af37] transition-colors"
            title="Read system architecture and design overview"
          >
            <Compass className="h-3 w-3" />
            <span className="hidden md:inline">Landing Page</span>
          </Link>

          <button
            onClick={() => loadAllData()}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2 py-0.5 border text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
            style={{
              backgroundColor: "#222733",
              borderColor: "#2d3545",
              color: "#e2e8f0",
            }}
          >
            <RefreshCw className={`h-2.5 w-2.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync"}</span>
          </button>
        </div>
      </div>

      {/* Level Up Banner */}
      {levelUpAlert && (
        <div
          className="font-medium text-center py-2 px-4 text-xs font-mono tracking-widest uppercase"
          style={{ backgroundColor: "#d4af37", color: "#0d0e12" }}
        >
          {levelUpAlert}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {activeTab === "track" && (
          <SkillTrackMap
            nodes={track.nodes}
            dagStatus={dagStatus}
            selectedNode={selectedNode}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab("workspace");
            }}
            onEnterLab={(node) => {
              setSelectedNode(node);
              setActiveTab("workspace");
            }}
          />
        )}

        {activeTab === "workspace" && (
          <SplitWorkspace
            node={selectedNode}
            onEvaluationSuccess={handleEvaluationSuccess}
          />
        )}

        {activeTab === "arena" && (
          <BossBattleArena
            bossStatus={bossStatus}
            onRefresh={loadAllData}
            onSelectTopicForCombat={handleSelectTopicFromArena}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarScheduleView
            events={calendarEvents}
            onRefresh={loadAllData}
          />
        )}
      </main>
    </div>
  );
}
