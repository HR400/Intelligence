"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { CalendarEvent } from "../../lib/types";
import { triggerDriftCascade } from "../../lib/api";

interface CascadeResult {
  updated_task?: {
    scheduled_start: string;
  };
  [key: string]: unknown;
}

interface CalendarScheduleViewProps {
  events: CalendarEvent[];
  onRefresh: () => void;
}

export const CalendarScheduleView: React.FC<CalendarScheduleViewProps> = ({
  events,
  onRefresh,
}) => {
  const [driftProcessing, setDriftProcessing] = useState<boolean>(false);
  const [lastCascadeResult, setLastCascadeResult] = useState<CascadeResult | null>(null);

  const handleSimulateDrift = async (taskId: string) => {
    setDriftProcessing(true);
    try {
      const res = (await triggerDriftCascade(taskId)) as unknown as CascadeResult;
      setLastCascadeResult(res);
      onRefresh();
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setDriftProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-soft-stone/40 p-6 rounded-md border border-hairline">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted mb-1">
            <CalendarIcon className="h-3.5 w-3.5 text-deep-green" />
            <span>Google Calendar API v3 Integration</span>
          </div>
          <h2 className="text-2xl font-display font-medium text-ink">
            Autonomous Study Schedule
          </h2>
          <p className="text-xs text-body-muted font-sans font-light mt-1">
            Synchronized calendar events formatted with [QUEST] titles. Zero-token deterministic drift cascades.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 rounded-pill text-xs font-medium transition-all self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Sync Calendar</span>
        </button>
      </div>

      {/* Drift Feedback Alert */}
      {lastCascadeResult && (
        <div className="p-4 bg-pale-green border border-card-border rounded-md text-xs space-y-1">
          <div className="flex items-center gap-2 font-medium text-deep-green">
            <CheckCircle className="h-4 w-4" />
            <span>Schedule drift cascaded with zero LLM tokens consumed.</span>
          </div>
          <p className="text-ink font-light">
            Missed block was deterministically shifted to next open freeBusy window:{" "}
            <span className="font-mono text-deep-green font-medium">
              {lastCascadeResult.updated_task?.scheduled_start
                ? new Date(lastCascadeResult.updated_task.scheduled_start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Upcoming slot"}
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
              className={`p-5 rounded-sm border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isBoss
                  ? "bg-soft-stone/30 border-hairline"
                  : "bg-canvas border-hairline hover:border-slate"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-pill border ${
                      isBoss
                        ? "bg-soft-stone text-coral border-card-border"
                        : "bg-pale-green text-deep-green border-card-border"
                    }`}
                  >
                    {isBoss ? "Boss Battle" : "Quest Block"}
                  </span>
                  {event.drift_count && event.drift_count > 0 && (
                    <span className="text-[10px] font-mono text-coral bg-soft-stone px-2 py-0.5 rounded-pill border border-card-border">
                      Drifted {event.drift_count}x
                    </span>
                  )}
                </div>
                <h3 className="text-base font-display font-medium text-ink">
                  {event.summary}
                </h3>
                <p className="text-xs text-body-muted font-sans font-light">
                  {event.description}
                </p>
              </div>

              {/* Timing & Action */}
              <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-hairline">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-ink">
                    <Clock className="h-3.5 w-3.5 text-muted" />
                    <span>
                      {startDate.toLocaleDateString([], { month: "short", day: "numeric" })},{" "}
                      {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted font-mono">
                    to {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <button
                  onClick={() => handleSimulateDrift("task_1")}
                  disabled={driftProcessing}
                  title="Simulate student missing this block to test zero-token calendar cascade"
                  className="px-3.5 py-1.5 border border-hairline hover:border-ink rounded-pill text-xs font-mono text-ink flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <AlertTriangle className="h-3 w-3 text-coral" />
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

