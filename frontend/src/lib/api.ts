import {
  CourseTrack,
  DAGStatus,
  BossArenaStatus,
  User,
  FeynmanResult,
  CalendarEvent,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function fetchCourseTrack(): Promise<CourseTrack> {
  const res = await fetch(`${API_BASE_URL}/courses/track`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load course track");
  return res.json();
}

export async function fetchDAGStatus(): Promise<DAGStatus> {
  const res = await fetch(`${API_BASE_URL}/graph/status`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load graph status");
  return res.json();
}

export async function fetchBossStatus(): Promise<BossArenaStatus> {
  const res = await fetch(`${API_BASE_URL}/boss/status`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load boss status");
  return res.json();
}

export async function fetchUserProfile(): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/feynman/user`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load user profile");
  return res.json();
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(`${API_BASE_URL}/calendar/events`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load calendar events");
  return res.json();
}

export async function submitFeynmanExplanation(
  nodeId: string,
  studentExplanation: string,
  hintCount: number = 0
): Promise<FeynmanResult> {
  const res = await fetch(`${API_BASE_URL}/feynman/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      node_id: nodeId,
      student_explanation: studentExplanation,
      hint_count: hintCount,
    }),
  });
  if (!res.ok) throw new Error("Failed to evaluate Feynman explanation");
  return res.json();
}

export async function triggerDriftCascade(taskId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/calendar/drift/cascade/${taskId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to cascade drift");
  return res.json();
}
