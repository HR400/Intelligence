export type NodeTier = "SL" | "HL" | "EX";

export interface OntologyNode {
  id: string;
  course_id: string;
  title: string;
  summary: string;
  prerequisites: string[];
  tier: NodeTier;
  mastery: number; // 0.0 - 1.0
  weight: number;
  estimated_minutes: number;
  deadline?: string;
  tags?: string[];
}

export interface UserStats {
  total_nodes_completed: number;
  total_quizzes_passed: number;
  total_bosses_defeated: number;
  combat_readiness: number;
}

export interface User {
  id?: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  streak: number;
  stats: UserStats;
}

export interface CourseTrack {
  id: string;
  title: string;
  description: string;
  exam_date?: string;
  nodes: OntologyNode[];
}

export interface RankedScheduleItem {
  node_id: string;
  title: string;
  tier: NodeTier;
  mastery: number;
  is_unlocked: boolean;
  priority: number;
}

export interface DAGStatus {
  course_id: string;
  is_acyclic: boolean;
  unlock_states: Record<string, boolean>;
  priorities: Record<string, number>;
  descendants: Record<string, string[]>;
  ranked_schedule: RankedScheduleItem[];
  edges: { source: string; target: string }[];
}

export interface BossInfo {
  boss_id: string;
  boss_name: string;
  boss_type: "MINI_BOSS" | "MAIN_BOSS";
  max_hp: number;
  current_hp: number;
  hp_percentage: number;
  scope_node_ids: string[];
  is_defeated: boolean;
  unmastered_weaknesses: string[];
}

export interface BossArenaStatus {
  course_title: string;
  mini_boss: BossInfo;
  main_boss: BossInfo;
}

export interface SocraticEvaluationResponse {
  accuracy: number;
  is_mastered: boolean;
  needs_scaffolding: boolean;
  feedback: string;
  probing_question: string;
  identified_misconceptions: string[];
  tokens_used: number;
}

export interface FeynmanResult {
  evaluation: SocraticEvaluationResponse;
  delta_mastery: number;
  new_mastery: number;
  xp_awarded: number;
  leveled_up: boolean;
  current_level: number;
  current_xp: number;
  xp_to_next_level: number;
  new_combat_readiness: number;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
  status: string;
  is_completed?: boolean;
  drift_count?: number;
}
