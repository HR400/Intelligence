"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HUDNav } from "../../components/HUDNav";
import { SkillTree, NodeData } from "../../components/SkillTree";

export default function TrackPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [readiness, setReadiness] = useState<number>(42);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ontology/subject/cs202");
        if (res.ok) {
          const data = await res.json();
          setNodes(data.nodes);
        }
      } catch {
        // Fallback demo data
        setNodes([
          {
            node_id: "algo_big_o",
            title: "Asymptotic Notation & Time Complexity",
            subject: "cs202",
            tier_unlocked: "SL",
            mastery_score: 0.9,
            xp_yield: 150,
            status: "COMPLETED",
            prerequisites: [],
          },
          {
            node_id: "algo_divide_conquer",
            title: "Divide & Conquer Recurrences",
            subject: "cs202",
            tier_unlocked: "SL",
            mastery_score: 0.8,
            xp_yield: 200,
            status: "COMPLETED",
            prerequisites: ["algo_big_o"],
          },
          {
            node_id: "algo_dynamic_programming",
            title: "Dynamic Programming & Optimal Substructure",
            subject: "cs202",
            tier_unlocked: "HL",
            mastery_score: 0.35,
            xp_yield: 250,
            status: "UNLOCKED",
            prerequisites: ["algo_divide_conquer"],
          },
          {
            node_id: "algo_graph_traversals",
            title: "Graph Traversals & Topological Ordering",
            subject: "cs202",
            tier_unlocked: "HL",
            mastery_score: 0.2,
            xp_yield: 200,
            status: "LOCKED",
            prerequisites: ["algo_divide_conquer"],
          },
          {
            node_id: "algo_np_completeness",
            title: "NP-Completeness & Polynomial Reductions",
            subject: "cs202",
            tier_unlocked: "EX",
            mastery_score: 0.0,
            xp_yield: 300,
            status: "LOCKED",
            prerequisites: ["algo_dynamic_programming", "algo_graph_traversals"],
          },
        ]);
      }
    }
    fetchTrack();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#e2e8f0]">
      <HUDNav
        activeTab="track"
        readinessPercentage={readiness}
        onTabChange={(tab) => {
          if (tab === "workspace") router.push("/");
          if (tab === "arena") router.push("/arena");
        }}
      />
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <SkillTree
          nodes={nodes}
          onSelectNode={() => {}}
          onEnterLab={() => router.push("/")}
        />
      </main>
    </div>
  );
}
