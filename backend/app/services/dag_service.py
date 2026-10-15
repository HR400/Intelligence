import networkx as nx
from typing import List, Dict, Set, Tuple, Optional
from datetime import datetime, timezone
from backend.app.models.ontology import OntologyNode


class CycleDetectedException(Exception):
    """Raised when a cycle is detected in the course topic prerequisites."""
    pass


class DAGService:
    def __init__(self, nodes: List[OntologyNode]):
        self.nodes_map: Dict[str, OntologyNode] = {node.id: node for node in nodes}
        self.graph = nx.DiGraph()
        self._build_graph(nodes)

    def _build_graph(self, nodes: List[OntologyNode]):
        # Add all nodes
        for node in nodes:
            self.graph.add_node(node.id, data=node)

        # Add directed edges from prerequisite -> dependent node
        for node in nodes:
            for prereq_id in node.prerequisites:
                if prereq_id in self.nodes_map:
                    self.graph.add_edge(prereq_id, node.id)

        # Validate acyclicity
        if not nx.is_directed_acyclic_graph(self.graph):
            cycles = list(nx.simple_cycles(self.graph))
            raise CycleDetectedException(f"Prerequisite cycle detected in ontology: {cycles}")

    def is_valid_dag(self) -> bool:
        return nx.is_directed_acyclic_graph(self.graph)

    def get_descendants(self, node_id: str) -> Set[str]:
        """Returns the set of all downstream nodes blocked if node_id is incomplete."""
        if node_id not in self.graph:
            return set()
        return nx.descendants(self.graph, node_id)

    def get_ancestors(self, node_id: str) -> Set[str]:
        """Returns all prerequisite nodes required before node_id."""
        if node_id not in self.graph:
            return set()
        return nx.ancestors(self.graph, node_id)

    def is_node_unlocked(self, node_id: str, mastery_threshold: float = 0.70) -> bool:
        """A node is unlocked if and only if all direct parents have mastery >= mastery_threshold."""
        if node_id not in self.graph:
            return False
        predecessors = list(self.graph.predecessors(node_id))
        if not predecessors:
            return True
        for pred_id in predecessors:
            pred_node = self.nodes_map.get(pred_id)
            if not pred_node or pred_node.mastery < mastery_threshold:
                return False
        return True

    def calculate_priority(
        self,
        node_id: str,
        w1: float = 0.35,  # Deadline urgency
        w2: float = 0.25,  # Syllabus credit weight
        w3: float = 0.20,  # Downstream dependency impact
        w4: float = 0.20,  # Knowledge deficit (1 - M_v)
        current_time: Optional[datetime] = None,
    ) -> float:
        """
        Deterministic Priority Scoring Function:
        P(v) = w1 * (1 / max(1, D_v - T_now)) + w2 * W_v + w3 * |Descendants(v)| + w4 * (1 - M_v)
        """
        node = self.nodes_map.get(node_id)
        if not node:
            return 0.0

        now = current_time or datetime.now(timezone.utc)
        
        # 1. Deadline urgency component: D_v - T_now in days
        if node.deadline:
            delta = (node.deadline - now).total_seconds() / 86400.0  # in days
            days_to_deadline = max(1.0, delta)
            urgency_term = 1.0 / days_to_deadline
        else:
            urgency_term = 1.0 / 30.0  # Default 30-day baseline

        # 2. Syllabus credit weight
        weight_term = node.weight

        # 3. Downstream descendants impact
        descendants_count = len(self.get_descendants(node_id))

        # 4. Mastery deficit
        mastery_deficit = 1.0 - node.mastery

        priority = (
            w1 * urgency_term +
            w2 * weight_term +
            w3 * descendants_count +
            w4 * mastery_deficit
        )
        return float(priority)

    def get_ranked_schedule(
        self,
        unlocked_only: bool = True,
        current_time: Optional[datetime] = None,
    ) -> List[Tuple[OntologyNode, float]]:
        """Returns nodes sorted in descending order of priority score P(v)."""
        candidates: List[OntologyNode] = []
        for node in self.nodes_map.values():
            if unlocked_only:
                if self.is_node_unlocked(node.id) and node.mastery < 0.70:
                    candidates.append(node)
            else:
                candidates.append(node)

        scored = [
            (node, self.calculate_priority(node.id, current_time=current_time))
            for node in candidates
        ]
        # Sort descending by priority
        scored.sort(key=lambda item: item[1], reverse=True)
        return scored
