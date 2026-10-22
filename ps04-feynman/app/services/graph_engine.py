import networkx as nx
from typing import List, Dict, Any, Union
import math


class GraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()

    def build_graph(self, nodes: List[Union[Dict[str, Any], Any]]):
        self.graph.clear()
        for node in nodes:
            # Support both dict and Pydantic NodeOntology objects
            if isinstance(node, dict):
                node_id = node.get("_id") or node.get("node_id")
                title = node.get("title", "")
                weight = node.get("xp_yield", 100)
                mastery = node.get("mastery_score", 0.0)
                status = node.get("status", "LOCKED")
                prereqs = node.get("prerequisites", [])
            else:
                node_id = getattr(node, "node_id", getattr(node, "id", None))
                title = getattr(node, "title", "")
                weight = getattr(node, "xp_yield", 100)
                mastery = getattr(node, "mastery_score", 0.0)
                status = getattr(node, "status", "LOCKED")
                prereqs = getattr(node, "prerequisites", [])

            self.graph.add_node(
                node_id,
                title=title,
                weight=weight,
                mastery=mastery,
                status=status,
            )
            for prereq in prereqs:
                self.graph.add_edge(prereq, node_id)

    def calculate_priority_score(
        self, node_id: str, time_remaining_hours: float, weight: float, urgency: float
    ) -> float:
        children = list(self.graph.successors(node_id)) if self.graph.has_node(node_id) else []
        blocked_count = sum(
            1 for child in children if self.graph.nodes[child].get("status") == "LOCKED"
        )
        epsilon = 0.01

        priority = ((weight * urgency) / (time_remaining_hours + epsilon)) * (1 + blocked_count)
        return round(priority, 4)

    def compute_exam_readiness(self, exam_node_ids: List[str]) -> float:
        if not exam_node_ids:
            return 0.0
        total_weight = 0.0
        weighted_mastery = 0.0
        unaddressed_errors = 0

        for nid in exam_node_ids:
            if self.graph.has_node(nid):
                data = self.graph.nodes[nid]
                w = data.get("weight", 100)
                m = data.get("mastery", 0.0)
                total_weight += w
                weighted_mastery += (m * w)
                if m < 0.5:
                    unaddressed_errors += 1

        if total_weight == 0:
            return 0.0

        base_score = weighted_mastery / total_weight
        error_penalty = 1.0 - (unaddressed_errors / max(len(exam_node_ids), 1))
        return round(max(0.0, base_score * error_penalty) * 100, 2)

    def get_unlocked_nodes(self) -> List[str]:
        unlocked = []
        for node in self.graph.nodes:
            prereqs = list(self.graph.predecessors(node))
            if all(self.graph.nodes[p].get("mastery", 0.0) >= 0.8 for p in prereqs):
                unlocked.append(node)
        return unlocked

    def is_acyclic(self) -> bool:
        return nx.is_directed_acyclic_graph(self.graph)

    def topological_sort(self) -> List[str]:
        if not self.is_acyclic():
            raise ValueError("Graph contains cycles; cannot produce topological order.")
        return list(nx.topological_sort(self.graph))

    def get_descendants(self, node_id: str) -> List[str]:
        if not self.graph.has_node(node_id):
            return []
        return list(nx.descendants(self.graph, node_id))
