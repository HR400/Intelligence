"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HUDNav } from "../components/HUDNav";
import { SkillTree, NodeData } from "../components/SkillTree";
import { SplitWorkspace } from "../components/SplitWorkspace";
import { RefreshCw, Compass } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("workspace");
  const [nodes, setNodes] = useState<NodeData[]>([
    {
      node_id: "algo_big_o",
      title: "Asymptotic Notation & Time Complexity",
      subject: "cs202",
      tier_unlocked: "SL",
      mastery_score: 0.9,
      xp_yield: 150,
      status: "COMPLETED",
      prerequisites: [],
      depth_tiers: {
        SL: {
          target: "Surface Level Intuition",
          outcomes: ["Define Big-O, Big-Omega, Big-Theta", "Order standard complexity classes"],
          estimated_minutes: 30,
        },
        HL: {
          target: "High Level Rigor",
          outcomes: ["Formal limit definitions", "Solve non-trivial recurrence relations"],
          estimated_minutes: 45,
        },
        EX: {
          target: "Expert Level Proofs",
          outcomes: ["Construct adversarial lower-bound adversary arguments"],
          estimated_minutes: 60,
        },
      },
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
      depth_tiers: {
        SL: {
          target: "Surface Level Intuition",
          outcomes: ["Trace MergeSort partition steps", "State Master Theorem cases"],
          estimated_minutes: 35,
        },
        HL: {
          target: "High Level Rigor",
          outcomes: ["Prove recursion tree summation bounds", "Analyze QuickSort randomized pivot expectation"],
          estimated_minutes: 50,
        },
        EX: {
          target: "Expert Level Proofs",
          outcomes: ["Derive Akra-Bazzi method for unequal partition splits"],
          estimated_minutes: 70,
        },
      },
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
      depth_tiers: {
        SL: {
          target: "Surface Level Intuition",
          outcomes: ["Identify overlapping subproblems", "Memoization vs Tabulation"],
          estimated_minutes: 45,
        },
        HL: {
          target: "High Level Rigor",
          outcomes: ["Formalize Bellman recurrence equations", "Reconstruct solutions in 0/1 Knapsack & LCS"],
          estimated_minutes: 60,
        },
        EX: {
          target: "Expert Level Proofs",
          outcomes: ["Convex Hull Optimization and Knuth-Yao DP speedups"],
          estimated_minutes: 90,
        },
      },
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
      depth_tiers: {
        SL: {
          target: "Surface Level Intuition",
          outcomes: ["BFS vs DFS mechanics", "Adjacency matrix vs list representations"],
          estimated_minutes: 40,
        },
        HL: {
          target: "High Level Rigor",
          outcomes: ["Tarjan's strongly connected components", "Kahn's in-degree topological sort"],
          estimated_minutes: 55,
        },
        EX: {
          target: "Expert Level Proofs",
          outcomes: ["Prove correctness of 2-SAT linear time resolution via SCC condensation"],
          estimated_minutes: 85,
        },
      },
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
      depth_tiers: {
        SL: {
          target: "Surface Level Intuition",
          outcomes: ["Explain P vs NP distinction", "Understand certificate verification"],
          estimated_minutes: 50,
        },
        HL: {
          target: "High Level Rigor",
          outcomes: ["Construct polynomial-time reduction from 3-SAT to Vertex Cover"],
          estimated_minutes: 75,
        },
        EX: {
          target: "Expert Level Proofs",
          outcomes: ["Cook-Levin theorem circuit-SAT completeness derivation"],
          estimated_minutes: 110,
        },
      },
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<NodeData>(nodes[2]); // Dynamic Programming
  const [level, setLevel] = useState<number>(2);
  const [xp, setXp] = useState<number>(180);
  const [readiness, setReadiness] = useState<number>(42);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchLiveState = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [ontoRes, readyRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/ontology/subject/cs202"),
        fetch("http://127.0.0.1:8000/api/ontology/readiness/cs202"),
      ]);

      if (ontoRes.ok && readyRes.ok) {
        const ontoData = await ontoRes.json();
        const readyData = await readyRes.json();
        setNodes(ontoData.nodes);
        setReadiness(Math.round(readyData.combat_readiness));
        setIsBackendConnected(true);

        // Update selected node if still present
        const currentId = selectedNode?.node_id;
        const matched = ontoData.nodes.find((n: NodeData) => n.node_id === currentId);
        if (matched) setSelectedNode(matched);
      }
    } catch {
      setIsBackendConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, [selectedNode?.node_id]);

  useEffect(() => {
    fetchLiveState();
  }, [fetchLiveState]);

  const handleEvaluationSuccess = (newMastery: number, xpAwarded: number) => {
    setXp((prev) => {
      const total = prev + xpAwarded;
      if (total >= 500) {
        setLevel((l) => l + 1);
        return total - 500;
      }
      return total;
    });

    setSelectedNode((prev) => ({
      ...prev,
      mastery_score: newMastery,
      status: newMastery >= 0.8 ? "COMPLETED" : prev.status,
    }));

    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.node_id === selectedNode.node_id
          ? {
              ...n,
              mastery_score: newMastery,
              status: newMastery >= 0.8 ? "COMPLETED" : n.status,
            }
          : n
      )
    );

    fetchLiveState();
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#e2e8f0] flex flex-col font-sans">
      {/* Top HUD Nav */}
      <HUDNav
        level={level}
        xp={xp}
        xpToNext={500}
        streak={3}
        readinessPercentage={readiness}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "arena") {
            window.location.href = "/arena";
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Telemetry Status Bar */}
      <div className="w-full px-6 py-1.5 flex items-center justify-between text-[11px] font-mono border-b bg-[#161920] border-[#2d3545] text-[#94a3b8]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full inline-block animate-pulse"
              style={{ backgroundColor: isBackendConnected ? "#10b981" : "#f59e0b" }}
            />
            <span style={{ color: isBackendConnected ? "#10b981" : "#d4af37" }}>
              {isBackendConnected
                ? "PS04 Engine Connected (Port 8000)"
                : "Standalone Demo Mode (Auto-Reconnecting)"}
            </span>
          </span>
          <span className="hidden sm:inline text-[#2d3545]">|</span>
          <span className="hidden sm:inline">Active Track: CS 202 Algorithms</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLiveState()}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2 py-0.5 border text-[10px] uppercase tracking-wider bg-[#222733] border-[#2d3545] text-[#e2e8f0] hover:border-[#c5a880] transition-colors"
          >
            <RefreshCw className={`h-2.5 w-2.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Vault"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {activeTab === "track" && (
          <SkillTree
            nodes={nodes}
            selectedNodeId={selectedNode?.node_id}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab("workspace");
            }}
            onEnterLab={(node) => {
              setSelectedNode(node);
              setActiveTab("workspace");
            }}
          />
        )}

        {activeTab === "workspace" && selectedNode && (
          <SplitWorkspace
            node={selectedNode}
            onEvaluationSuccess={handleEvaluationSuccess}
          />
        )}
      </main>
    </div>
  );
}
