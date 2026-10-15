"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, ArrowRight, Zap, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { CalendarEvent } from "../../lib/types";
import { triggerDriftCascade } from "../../lib/api";

interface CalendarScheduleViewProps {
  events: CalendarEvent[];
  onRefresh: () => void;
}

export const CalendarScheduleView: React.FC<CalendarScheduleViewProps> = ({
  events,
  onRefresh,
}) => {
  const [driftProcessing, setDriftProcessing] = useState<boolean>(false);
  const [lastCascadeResult, setLastCascadeResult] = useState<any>(null);

  const handleSimulateDrift = async (taskId: string) => {
    setDriftProcessing(true);
    try {
      const res = await triggerDriftCascade(taskId);
      setLastCascadeResult(res);
      onRefresh();
    } catch (err: any) {
      console.error(err);
    } finally {
      setDriftProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-card p-5 rounded-2xl border border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Google Calendar API v3 Integration</span>
          </div>
          <h2 className="text-xl font-black text-white">
            Autonomous Quest Schedule
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Synchronized calendar events formatted with [QUEST] titles. Zero-token deterministic drift cascades.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold border border-gray-700 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Sync Calendar</span>
        </button>
      </div>

      {/* Drift Feedback Alert */}
      {lastCascadeResult && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-600/40 rounded-2xl text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <CheckCircle className="h-4 w-4" />
            <span>Schedule Drift Cascaded With Zero Tokens Consumed!</span>
          </div>
          <p className="text-gray-300">
            Missed block was deterministically shifted to next open freeBusy window:{" "}
            <span className="font-mono text-emerald-400">
              {new Date(lastCascadeResult.updated_task.scheduled_start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event) => {
          const startDate = new Date(event.start.dateTime);
          const endDate = new Date(event.end.dateTime);
          const isBoss = event.summary.includes("[BOSS BATTLE]");

          return (
            <div
              key={event.id}
              className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isBoss
                  ? "bg-rose-950/20 border-rose-900/50 hover:border-rose-700/60"
                  : "bg-surface-card border-surface-border hover:border-gray-700"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      isBoss
                        ? "bg-rose-900/60 text-rose-300 border border-rose-700/50"
                        : "bg-blue-900/60 text-blue-300 border border-blue-700/50"
                    }`}
                  >
                    {isBoss ? "BOSS BATTLE" : "QUEST BLOCK"}
                  </span>
                  {event.drift_count && event.drift_count > 0 && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                      Drifted {event.drift_count}x
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white">
                  {event.summary}
                </h3>
                <p className="text-xs text-gray-400">
                  {event.description}
                </p>
              </div>

              {/* Timing & Action */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-gray-800">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-200">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    <span>
                      {startDate.toLocaleDateString([], { month: "short", day: "numeric" })},{" "}
                      {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    to {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <button
                  onClick={() => handleSimulateDrift("task_1")}
                  disabled={driftProcessing}
                  title="Simulate student missing this block to test zero-token calendar cascade"
                  className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Simulate Drift</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
