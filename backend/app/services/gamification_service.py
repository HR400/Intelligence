from typing import List
from backend.app.models.ontology import OntologyNode, CourseTrack


def calculate_exam_readiness(track: CourseTrack) -> float:
    """
    Combat Readiness R_exam = sum_{i=1}^N (W_i * M_i)
    Normalized by total weight of syllabus nodes.
    """
    return track.compute_combat_readiness()


def calculate_boss_hp(nodes_in_scope: List[OntologyNode], max_hp: int = 1000) -> int:
    """
    Boss HP = Max HP * (1 - (sum_{v in Exam Scope} M_v) / |Exam Scope|)
    Directly reflects unmastered scope remaining.
    """
    if not nodes_in_scope:
        return 0
    total_mastery = sum(node.mastery for node in nodes_in_scope)
    avg_mastery = total_mastery / len(nodes_in_scope)
    remaining_ratio = max(0.0, 1.0 - avg_mastery)
    return int(round(max_hp * remaining_ratio))


def evaluate_mastery_delta(accuracy: float, hint_count: int) -> float:
    """
    Computes delta mastery ΔM(v) based on independent Feynman explanation quality
    and the number of Socratic hints requested.
    """
    if accuracy < 0.5:
        return 0.0

    # Base gain from accuracy (0.5 -> 1.0 maps to 0.10 -> 0.30)
    base_gain = 0.10 + (accuracy - 0.5) * 0.40

    # Penalty for hints used (each hint reduces gain by 15%, min floor 0.05)
    penalty_factor = max(0.3, 1.0 - (hint_count * 0.15))
    delta = base_gain * penalty_factor
    return round(min(0.35, max(0.05, delta)), 3)
