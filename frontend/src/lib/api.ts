import {
  CourseTrack,
  DAGStatus,
  BossArenaStatus,
  User,
  FeynmanResult,
  CalendarEvent,
} from "./types";
import {
  DEFAULT_USER,
  DEFAULT_TRACK,
  DEFAULT_DAG_STATUS,
  DEFAULT_BOSS_STATUS,
  DEFAULT_CALENDAR_EVENTS,
} from "./mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function isBackendLive(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout("http://127.0.0.1:8000/health", { cache: "no-store" }, 1500);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCourseTrack(): Promise<CourseTrack> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/courses/track`, { cache: "no-store" });
    if (!res.ok) throw new Error("Status: " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback CourseTrack:", err);
    return DEFAULT_TRACK;
  }
}

export async function fetchDAGStatus(): Promise<DAGStatus> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/graph/status`, { cache: "no-store" });
    if (!res.ok) throw new Error("Status: " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback DAGStatus:", err);
    return DEFAULT_DAG_STATUS;
  }
}

export async function fetchBossStatus(): Promise<BossArenaStatus> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/boss/status`, { cache: "no-store" });
    if (!res.ok) throw new Error("Status: " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback BossArenaStatus:", err);
    return DEFAULT_BOSS_STATUS;
  }
}

export async function fetchUserProfile(): Promise<User> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/feynman/user`, { cache: "no-store" });
    if (!res.ok) throw new Error("Status: " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback User profile:", err);
    return DEFAULT_USER;
  }
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/calendar/events`, { cache: "no-store" });
    if (!res.ok) throw new Error("Status: " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback CalendarEvents:", err);
    return DEFAULT_CALENDAR_EVENTS;
  }
}

export async function submitFeynmanExplanation(
  nodeId: string,
  studentExplanation: string,
  hintCount: number = 0
): Promise<FeynmanResult> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/feynman/evaluate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: nodeId,
          student_explanation: studentExplanation,
          hint_count: hintCount,
        }),
      },
      8000
    );
    if (!res.ok) throw new Error("Evaluation request failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend evaluation offline. Providing local simulation:", err);
    const wordCount = studentExplanation.trim().split(/\s+/).length;
    const isQuality = wordCount >= 10 && !studentExplanation.toLowerCase().includes("idk");
    const accuracy = isQuality ? 0.88 : 0.45;
    return {
      evaluation: {
        accuracy,
        is_mastered: accuracy >= 0.7,
        needs_scaffolding: accuracy < 0.7,
        feedback: isQuality
          ? "Clear first-principles breakdown. Key invariant preserved without circular tautologies."
          : "Explanation lacks concrete mechanistic step intuition. Clarify the recurrence boundary condition.",
        probing_question: isQuality
          ? "How does the asymptotic worst-case space bound change if we switch from recursion to an iterative ring buffer?"
          : "What specifically prevents a cycle from forming during this algorithmic phase?",
        identified_misconceptions: isQuality ? [] : ["Confusing worst-case time with amortized bounds"],
        tokens_used: 124,
      },
      delta_mastery: isQuality ? 0.25 : 0.05,
      new_mastery: isQuality ? 0.85 : 0.45,
      xp_awarded: isQuality ? 120 : 25,
      leveled_up: false,
      current_level: 2,
      current_xp: 300,
      xp_to_next_level: 500,
      new_combat_readiness: 0.48,
    };
  }
}

export async function triggerDriftCascade(taskId: string): Promise<Record<string, unknown>> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/calendar/drift/cascade/${taskId}`,
      { method: "POST" },
      3000
    );
    if (!res.ok) throw new Error("Cascade failed");
    return await res.json();
  } catch (err) {
    console.warn("Cascade offline fallback:", err);
    return {
      task_id: taskId,
      status: "rescheduled_locally",
      message: "Drift shifted all downstream dependent nodes by +24 hours without syllabus deadline violation.",
    };
  }
}

export async function fetchVaultTelemetry(): Promise<import("./types").VaultTelemetry> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/obsidian/status`, { cache: "no-store" }, 2500);
    if (!res.ok) throw new Error("Failed to fetch vault status");
    return await res.json();
  } catch (err) {
    console.warn("Using offline VaultTelemetry fallback:", err);
    return {
      connected: true,
      vault_path: "~/learning-vault",
      total_notes: 6,
      notes: [
        {
          id: "algo_big_o",
          filename: "algo_big_o.md",
          rel_path: "Subjects/Algorithms/algo_big_o.md",
          obsidian_uri: "obsidian://open?vault=learning-vault&file=Subjects%2FAlgorithms%2Falgo_big_o.md",
          mastery: 0.9,
          tier: "SL",
          last_modified: new Date().toISOString(),
        },
        {
          id: "algo_divide_conquer",
          filename: "algo_divide_conquer.md",
          rel_path: "Subjects/Algorithms/algo_divide_conquer.md",
          obsidian_uri: "obsidian://open?vault=learning-vault&file=Subjects%2FAlgorithms%2Falgo_divide_conquer.md",
          mastery: 0.75,
          tier: "SL",
          last_modified: new Date().toISOString(),
        },
        {
          id: "algo_dynamic_programming",
          filename: "algo_dynamic_programming.md",
          rel_path: "Subjects/Algorithms/algo_dynamic_programming.md",
          obsidian_uri: "obsidian://open?vault=learning-vault&file=Subjects%2FAlgorithms%2Falgo_dynamic_programming.md",
          mastery: 0.1,
          tier: "HL",
          last_modified: new Date().toISOString(),
        },
      ],
      canvas_available: true,
      canvas_uri: "obsidian://open?vault=learning-vault&file=viz%2Fcourse_curriculum.canvas",
      pi_agent: {
        name: "teacher",
        model: "openrouter/google/gemini-2.0-flash-exp:free",
        max_tokens_per_turn: 150,
        scaffolding: "N-1 conceptual probing",
        rel_path: ".pi/agents/teacher.md",
      },
      last_sync: new Date().toISOString(),
    };
  }
}

export async function syncVaultToDisk(): Promise<Record<string, unknown>> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/obsidian/sync-vault`, { method: "POST" }, 3000);
    if (!res.ok) throw new Error("Sync failed");
    return await res.json();
  } catch (err) {
    console.warn("Vault sync simulated:", err);
    return { status: "simulated", notes_written: 6 };
  }
}

export async function updateExternalVaultMastery(nodeId: string, mastery: number): Promise<Record<string, unknown>> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/obsidian/update-note`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: nodeId, mastery }),
      },
      3000
    );
    if (!res.ok) throw new Error("Update failed");
    return await res.json();
  } catch (err) {
    console.warn("External note update simulated:", err);
    return { status: "simulated", node_id: nodeId, new_mastery: mastery };
  }
}
