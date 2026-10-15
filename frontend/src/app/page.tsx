"use client";

import React, { useEffect, useState } from "react";
import { TopNavHUD } from "../components/hud/TopNavHUD";
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
} from "../lib/api";
import {
  CourseTrack,
  DAGStatus,
  BossArenaStatus,
  User,
  OntologyNode,
  CalendarEvent,
  FeynmanResult,
} from "../lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"track" | "workspace" | "arena" | "calendar">("track");
  const [user, setUser] = useState<User | null>(null);
  const [track, setTrack] = useState<CourseTrack | null>(null);
  const [dagStatus, setDagStatus] = useState<DAGStatus | null>(null);
  const [bossStatus, setBossStatus] = useState<BossArenaStatus | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedNode, setSelectedNode] = useState<OntologyNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [levelUpAlert, setLevelUpAlert] = useState<string | null>(null);

  const loadAllData = React.useCallback(async () => {
    try {
      const [u, t, d, b, c] = await Promise.all([
        fetchUserProfile(),
        fetchCourseTrack(),
        fetchDAGStatus(),
        fetchBossStatus(),
        fetchCalendarEvents(),
      ]);
      setUser(u);
      setTrack(t);
      setDagStatus(d);
      setBossStatus(b);
      setCalendarEvents(c);

      // Default select the first unlocked pending node if none selected
      setSelectedNode((prev) => {
        if (!prev && t.nodes.length > 0) {
          const topPending = t.nodes.find(
            (n) => (d.unlock_states[n.id] ?? true) && n.mastery < 0.70
          );
          return topPending || t.nodes[0];
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to load platform data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleEvaluationSuccess = (result: FeynmanResult) => {
    // Update active node mastery locally
    if (selectedNode) {
      setSelectedNode({
        ...selectedNode,
        mastery: result.new_mastery,
      });
    }

    if (result.leveled_up) {
      setLevelUpAlert(`🎉 LEVEL UP! You reached Level ${result.current_level}!`);
      setTimeout(() => setLevelUpAlert(null), 5000);
    }

    // Refresh all states
    loadAllData();
  };

  const handleExportCanvas = () => {
    window.open("http://127.0.0.1:8000/api/v1/obsidian/canvas", "_blank");
  };

  const handleSelectTopicFromArena = (topicId: string) => {
    if (!track) return;
    const found = track.nodes.find((n) => n.id === topicId);
    if (found) {
      setSelectedNode(found);
      setActiveTab("workspace");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-sm text-gray-400">
          Initializing Socratic Feynman & Deterministic DAG Engine...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation HUD */}
      <TopNavHUD
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportCanvas={handleExportCanvas}
      />

      {/* Level Up Banner */}
      {levelUpAlert && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white font-extrabold text-center py-2 px-4 shadow-lg text-sm animate-pulse">
          {levelUpAlert}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {activeTab === "track" && track && (
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

        {activeTab === "workspace" && selectedNode && (
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
