import re
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
from backend.app.models.ontology import CourseTrack, OntologyNode, NodeTier


class SyllabusParserService:
    @staticmethod
    def parse_raw_syllabus(
        course_id: str,
        course_title: str,
        text_content: str,
        exam_date: Optional[datetime] = None,
    ) -> CourseTrack:
        """
        Parses structured syllabus text into an Ontology CourseTrack.
        Extracts topic titles, tier annotations (SL, HL, EX), and prerequisite declarations.
        """
        nodes: List[OntologyNode] = []
        lines = text_content.strip().split("\n")
        
        current_node: Optional[Dict[str, Any]] = None
        now = datetime.now(timezone.utc)
        default_deadline = exam_date or (now + timedelta(days=14))

        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            # Heading match: e.g. "### [SL] Arrays & Memory Layout" or "1. [HL] Binary Trees (Prereq: Arrays)"
            tier_match = re.search(r"\[(SL|HL|EX)\]", line_str, re.IGNORECASE)
            tier = NodeTier.SL
            if tier_match:
                matched_tier = tier_match.group(1).upper()
                if matched_tier == "HL":
                    tier = NodeTier.HL
                elif matched_tier == "EX":
                    tier = NodeTier.EX

            # Title extraction
            clean_title = re.sub(r"^(\d+\.|\#+|\-|\*)\s*", "", line_str)
            clean_title = re.sub(r"\[(SL|HL|EX)\]", "", clean_title, flags=re.IGNORECASE).strip()

            # Prerequisite extraction: e.g. "(Prereq: topic_a, topic_b)"
            prereqs: List[str] = []
            prereq_match = re.search(r"\((?:prereq|prerequisites?):\s*([^)]+)\)", clean_title, re.IGNORECASE)
            if prereq_match:
                raw_prereqs = prereq_match.group(1).split(",")
                prereqs = [p.strip().lower().replace(" ", "_") for p in raw_prereqs if p.strip()]
                clean_title = re.sub(r"\((?:prereq|prerequisites?):\s*([^)]+)\)", "", clean_title, flags=re.IGNORECASE).strip()

            node_id = f"{course_id}_{re.sub(r'[^a-z0-9_]', '', clean_title.lower().replace(' ', '_'))}"

            node = OntologyNode(
                id=node_id,
                course_id=course_id,
                title=clean_title or "Untitled Node",
                prerequisites=prereqs,
                tier=tier,
                mastery=0.0,
                weight=1.0,
                estimated_minutes=45,
                deadline=default_deadline,
                summary=f"Core conceptual study of {clean_title}.",
            )
            nodes.append(node)

        return CourseTrack(
            id=course_id,
            title=course_title,
            description=f"Curriculum track for {course_title}.",
            exam_date=exam_date,
            nodes=nodes,
        )

    @staticmethod
    def get_seed_course_track() -> CourseTrack:
        """
        Provides a rich default academic track:
        'CS 202: Algorithms & Complexity Theory'
        with tiered SL, HL, EX nodes and realistic prerequisite DAG.
        """
        now = datetime.now(timezone.utc)
        exam_date = now + timedelta(days=14)

        nodes = [
            # Tier 1 (SL - Foundations)
            OntologyNode(
                id="algo_big_o",
                course_id="cs202",
                title="Asymptotic Notation & Time Complexity",
                summary="Understanding Big-O, Big-Omega, Big-Theta, and worst-case vs average-case recurrence analysis.",
                prerequisites=[],
                tier=NodeTier.SL,
                mastery=0.90,  # Mastered
                weight=0.15,
                estimated_minutes=40,
                deadline=now + timedelta(days=2),
                tags=["sl", "analysis", "theory"],
            ),
            OntologyNode(
                id="algo_divide_conquer",
                course_id="cs202",
                title="Divide & Conquer Recurrences",
                summary="Master theorem, recursion trees, and analyzing MergeSort and QuickSort partition steps.",
                prerequisites=["algo_big_o"],
                tier=NodeTier.SL,
                mastery=0.75,  # Mastered
                weight=0.20,
                estimated_minutes=50,
                deadline=now + timedelta(days=4),
                tags=["sl", "divide-conquer", "recursion"],
            ),
            OntologyNode(
                id="algo_binary_heaps",
                course_id="cs202",
                title="Binary Heaps & Priority Queues",
                summary="Complete binary tree array representations, bubble-up, bubble-down (sift-down), and heapify complexity in O(n).",
                prerequisites=["algo_big_o"],
                tier=NodeTier.SL,
                mastery=0.40,  # In progress
                weight=0.15,
                estimated_minutes=45,
                deadline=now + timedelta(days=6),
                tags=["sl", "heaps", "priority-queues"],
            ),
            # Tier 2 (HL - Core Intermediate)
            OntologyNode(
                id="algo_dynamic_programming",
                course_id="cs202",
                title="Dynamic Programming & Optimal Substructure",
                summary="Memoization vs tabulation, overlapping subproblems, and bellman state transitions (Knapsack, LCS, Edit Distance).",
                prerequisites=["algo_divide_conquer"],
                tier=NodeTier.HL,
                mastery=0.10,  # In progress
                weight=0.25,
                estimated_minutes=60,
                deadline=now + timedelta(days=8),
                tags=["hl", "dp", "optimization"],
            ),
            OntologyNode(
                id="algo_graph_traversal",
                course_id="cs202",
                title="Graph Traversals & Topological Sort",
                summary="Adjacency representations, DFS timestamps, cycle detection in DAGs, and Kahn's in-degree algorithm.",
                prerequisites=["algo_divide_conquer"],
                tier=NodeTier.HL,
                mastery=0.0,  # Locked / Unstarted
                weight=0.15,
                estimated_minutes=55,
                deadline=now + timedelta(days=10),
                tags=["hl", "graphs", "topological-sort"],
            ),
            # Tier 3 (EX - Advanced Extension & Boss Material)
            OntologyNode(
                id="algo_np_completeness",
                course_id="cs202",
                title="NP-Completeness & Polynomial Reductions",
                summary="P vs NP landscape, verifiers vs deciders, Cook-Levin theorem, and 3-SAT to Vertex Cover reductions.",
                prerequisites=["algo_dynamic_programming", "algo_graph_traversal"],
                tier=NodeTier.EX,
                mastery=0.0,  # Locked
                weight=0.10,
                estimated_minutes=75,
                deadline=exam_date,
                tags=["ex", "complexity", "np-complete"],
            ),
        ]

        return CourseTrack(
            id="cs202",
            title="CS 202: Algorithms & Complexity Theory",
            description="Deep exploration of algorithmic paradigms, asymptotic analysis, dynamic programming, and complexity classes.",
            exam_date=exam_date,
            nodes=nodes,
        )
