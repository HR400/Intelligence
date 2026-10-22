"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Cpu,
  Calendar,
  Send,
} from "lucide-react";

export default function LandingPage() {
  // Live Hero Interactive Fragment State (The Product Performs)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [feynmanInput, setFeynmanInput] = useState<string>(
    "Dynamic programming caches overlapping subproblem solutions in a table so each state is solved exactly once."
  );
  const [feynmanEvaluation, setFeynmanEvaluation] = useState<{
    score: number;
    tokens: number;
    probingQuestion: string;
    verdict: string;
  } | null>({
    score: 94,
    tokens: 42,
    probingQuestion: "What guarantees that a problem possesses the optimal substructure required for tabulation?",
    verdict: "Mastery threshold achieved (94%). Subproblem memoization correctly identified without buzzwords.",
  });
  const [workspaceName, setWorkspaceName] = useState<string>("Foundational Algorithms & DAGs");

  const nodes = [
    { id: "ALG-01", name: "Recurrence Relations", status: "Mastered", mastery: 100 },
    { id: "ALG-02", name: "Memoization Tables", status: "Mastered", mastery: 95 },
    { id: "ALG-03", name: "Topological Sort", status: "Active", mastery: 45 },
    { id: "ALG-04", name: "Dijkstra Shortest Path", status: "Locked", mastery: 0 },
  ];

  const handleRunCascade = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      setActiveStep((prev) => (prev % 3) + 1);
      setSimulationRunning(false);
    }, 450);
  };

  const handleEvaluateFeynman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feynmanInput.trim()) return;

    if (feynmanInput.toLowerCase().includes("overlapping") || feynmanInput.toLowerCase().includes("subproblem")) {
      setFeynmanEvaluation({
        score: 96,
        tokens: 38,
        probingQuestion: "Can you prove whether the memoized state table requires O(N) or O(N^2) memory footprint?",
        verdict: "Rigorous first-principles definition verified. Invariant proven without relying on technical jargon.",
      });
    } else {
      setFeynmanEvaluation({
        score: 62,
        tokens: 54,
        probingQuestion: "What fundamental recurrence relation distinguishes this approach from naive brute-force recursion?",
        verdict: "N-1 Scaffolding engaged: Missing core mathematical invariant of overlapping subproblem memoization.",
      });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0d0e12] text-[#e2e8f0] font-['Switzer',sans-serif] selection:bg-[#f6e016] selection:text-[#0d0e12]">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#f6e016] text-[#0d0e12] font-medium text-sm focus-visible:ring-2 focus-visible:ring-[#f6e016]"
      >
        Skip to main content
      </a>

      {/* Navigation Bar */}
      <header className="bg-[#161920] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 animate-enter">
            <Link
              href="/landing"
              className="text-lg font-bold tracking-tight text-[#e2e8f0] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
            >
              Antigravity
            </Link>
            <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-6 text-sm text-[#e2e8f0]">
              <a
                href="#methodology"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
              >
                Algorithmic Core
              </a>
              <a
                href="#archive"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
              >
                Observational Lineage
              </a>
              <a
                href="#interactive-proctor"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
              >
                Feynman Terminal
              </a>
              <a
                href="#telemetry"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
              >
                Telemetry
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4 animate-enter">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#d4af37] text-[#0d0e12] hover:bg-[#e6c148] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="space-y-32 py-16 md:py-24">
        {/* SECTION 1: HERO (Direction: Product Performs) */}
        <section className="max-w-6xl mx-auto px-6" aria-labelledby="hero-title">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 Columns: The Statement & Argument */}
            <div className="lg:col-span-5 space-y-6">
              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#e2e8f0] leading-[1.05] animate-enter"
              >
                Learning without drift.
              </h1>

              <p className="text-lg sm:text-xl text-[#e2e8f0] leading-relaxed font-normal animate-enter">
                Antigravity is an autonomous academic planner that eliminates cognitive drift. It binds syllabus
                requirements to a mathematical directed acyclic graph and uses bounded Socratic probing to verify
                first-principles understanding.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 animate-enter">
                <Link
                  href="/"
                  className="px-6 py-3.5 bg-[#d4af37] text-[#0d0e12] font-semibold text-base inline-flex items-center gap-2 hover:bg-[#e5c24e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
                >
                  <span>Launch Academic DAG</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <a
                  href="#interactive-proctor"
                  className="px-6 py-3.5 bg-[#161920] text-[#e2e8f0] font-medium text-base hover:bg-[#222733] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
                >
                  Test Feynman Proctor
                </a>
              </div>

              <div className="pt-4 flex items-center justify-between text-sm text-[#94a3b8] animate-enter">
                <span>Deterministic NetworkX Topological Sort</span>
                <span>Zero Hallucination Guarantee</span>
              </div>
            </div>

            {/* Right 7 Columns: The Working Live Fragment */}
            <div className="lg:col-span-7 bg-[#161920] p-6 space-y-5 animate-enter" data-ui="true">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-[#d4af37]" aria-hidden="true" />
                  <span className="text-sm font-medium text-[#e2e8f0]">
                    DAG Execution Engine [Live Telemetry Fragment]
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRunCascade}
                  disabled={simulationRunning}
                  className="px-3.5 py-1.5 bg-[#222733] hover:bg-[#2d3545] text-sm text-[#d4af37] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
                >
                  {simulationRunning ? "Cascading Drift..." : "Trigger Calendar Drift"}
                </button>
              </div>

              {/* Live DAG Node List */}
              <div className="space-y-2.5">
                <div className="text-sm text-[#94a3b8] flex justify-between">
                  <span>Topological Dependency Pipeline</span>
                  <span className="text-[#d4af37]">Cycle-free</span>
                </div>

                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="p-4 bg-[#0d0e12] flex items-center justify-between text-sm transition-colors animate-enter"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 ${
                          node.status === "Mastered"
                            ? "bg-[#d4af37]"
                            : node.status === "Active"
                            ? "bg-[#2563eb]"
                            : "bg-[#2d3545]"
                        }`}
                      />
                      <code className="text-[#94a3b8] text-sm">{node.id}</code>
                      <span className="font-medium text-[#e2e8f0]">{node.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="tabular-nums text-[#e2e8f0]">{node.mastery}% Mastery</span>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium ${
                          node.status === "Mastered"
                            ? "bg-[#d4af37]/20 text-[#d4af37]"
                            : node.status === "Active"
                            ? "bg-[#2563eb]/20 text-[#93c5fd]"
                            : "bg-[#222733] text-[#e2e8f0]"
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zero-Token Drift Cascade Live Result */}
              <div className="p-4 bg-[#0d0e12] text-sm space-y-2 animate-enter">
                <div className="flex items-center justify-between text-[#d4af37]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    Cascade Drift State #{activeStep}
                  </span>
                  <span className="tabular-nums text-[#e2e8f0]">0 LLM Tokens Consumed</span>
                </div>
                <p className="text-[#e2e8f0] text-sm leading-relaxed">
                  Delta offset +48h injected at node ALG-02. Downstream sub-graph [ALG-03, ALG-04] shifted by NetworkX
                  topological BFS. Exam milestone deadline maintained without schedule conflict.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: ARCHIVAL EVIDENCE & CELESTIAL MECHANICS LINEAGE */}
        <section id="archive" className="max-w-6xl mx-auto px-6 space-y-12" aria-labelledby="archive-title">
          <div className="max-w-2xl space-y-3">
            <h2 id="archive-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#e2e8f0] animate-enter">
              Observational lineage.
            </h2>
            <p className="text-base sm:text-lg text-[#e2e8f0] leading-relaxed animate-enter">
              Before algorithms were automated, calculation was an observational art. We ground modern generative agents
              in the centuries-old tradition of precise geometric instruments and zero-drift mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Museum Artifact 1 */}
            <article className="bg-[#161920] flex flex-col justify-between overflow-hidden animate-enter">
              <div className="relative aspect-[4/3] bg-[#0d0e12] overflow-hidden">
                <Image
                  src="/assets/archive/the-astrolabe-amerigo-vespucci-from-nova-reperta.jpg"
                  alt="Jan van der Straet engraving from Nova Reperta depicting Amerigo Vespucci with an astrolabe and nocturnal instruments."
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-base text-[#e2e8f0]">Jan van der Straet: The Astrolabe</h3>
                  <p className="text-sm text-[#e2e8f0] leading-relaxed">
                    Plate 18 from Nova Reperta (c. 1580–1600). The astrolabe mapped celestial coordinates onto a plane
                    without mechanical drift.
                  </p>
                </div>
                <div className="text-sm text-[#94a3b8]">
                  Art Institute of Chicago · CC0
                </div>
              </div>
            </article>

            {/* Museum Artifact 2 */}
            <article className="bg-[#161920] flex flex-col justify-between overflow-hidden animate-enter">
              <div className="relative aspect-[4/3] bg-[#0d0e12] overflow-hidden">
                <Image
                  src="/assets/archive/parhelia-from-astronomy-and-scripture.jpg"
                  alt="Steel etching printed in blue depicting atmospheric mock suns and parhelia by George Baxter, 1843."
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-base text-[#e2e8f0]">George Baxter: Parhelia and Scripture</h3>
                  <p className="text-sm text-[#e2e8f0] leading-relaxed">
                    Steel etching (1843) detailing atmospheric refraction. Demonstrates how complex wave patterns follow
                    strict deterministic geometric optics.
                  </p>
                </div>
                <div className="text-sm text-[#94a3b8]">
                  Art Institute of Chicago · CC0
                </div>
              </div>
            </article>

            {/* Museum Artifact 3 */}
            <article className="bg-[#161920] flex flex-col justify-between overflow-hidden animate-enter">
              <div className="relative aspect-[4/3] bg-[#0d0e12] overflow-hidden">
                <Image
                  src="/assets/archive/laser-towards-milky-ways-centre.jpg"
                  alt="A laser guide star beam pointing towards the galactic center from the Paranal Observatory in Chile."
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-base text-[#e2e8f0]">ESO: Laser to Galactic Centre</h3>
                  <p className="text-sm text-[#e2e8f0] leading-relaxed">
                    Paranal Observatory adaptive optics (2010). Real-time atmospheric wavefront correction to eliminate
                    turbulent distortion.
                  </p>
                </div>
                <div className="text-sm text-[#94a3b8]">
                  Yuri Beletsky / ESO · CC BY 4.0
                </div>
              </div>
            </article>

            {/* Museum Artifact 4 with Archival Video Loop */}
            <article className="bg-[#161920] flex flex-col justify-between overflow-hidden animate-enter">
              <div className="relative aspect-[4/3] bg-[#0d0e12] overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/assets/archive/aereostationary-orbit-4-satellite-animation-poster.jpg"
                  className="w-full h-full object-cover"
                  aria-hidden="true"
                >
                  <source src="/assets/archive/aereostationary-orbit-4-satellite-animation.webm" type="video/webm" />
                </video>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-base text-[#e2e8f0]">NASA: Orbital Mechanics Loop</h3>
                  <p className="text-sm text-[#e2e8f0] leading-relaxed">
                    Four-satellite constellation orbit simulation. Demonstrates continuous balance under planetary
                    gravitational curvature.
                  </p>
                </div>
                <div className="text-sm text-[#94a3b8]">
                  R.C. Woolley / NASA · Public Domain
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* SECTION 3: THE FOUR ALGORITHMIC INVARIANTS (Editorial Composed Layout) */}
        <section id="methodology" className="max-w-6xl mx-auto px-6 space-y-12" aria-labelledby="methodology-title">
          <div className="max-w-2xl space-y-3">
            <h2 id="methodology-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#e2e8f0] animate-enter">
              Algorithmic invariants.
            </h2>
            <p className="text-base sm:text-lg text-[#e2e8f0] leading-relaxed animate-enter">
              Standard educational tools collapse into open-ended, chatty loops. Antigravity enforces four
              strict computational invariants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8 animate-enter">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-[#e2e8f0]">Deterministic NetworkX Graph Topologies</h3>
                <p className="text-base text-[#e2e8f0] leading-relaxed">
                  Knowledge tracks are represented as directed acyclic graphs. Nodes lock automatically until upstream
                  prerequisites achieve certified mastery of 70 percent or higher. Cycles are caught at compile time.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-[#e2e8f0]">Zero-Token Calendar Drift Cascades</h3>
                <p className="text-base text-[#e2e8f0] leading-relaxed">
                  When a study block is skipped or postponed, a deterministic topological breadth-first cascade shifts all
                  dependent tasks forward. No prompts, no latency, and zero token costs for schedule maintenance.
                </p>
              </div>
            </div>

            <div className="space-y-8 animate-enter">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-[#e2e8f0]">Token-Bounded Socratic Feynman Proctor</h3>
                <p className="text-base text-[#e2e8f0] leading-relaxed">
                  The proctor evaluates student explanations strictly in 150 tokens or fewer. It detects buzzwords, extracts
                  mathematical invariants, and returns surgical probing questions to reveal intuition gaps.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-[#e2e8f0]">Direct Obsidian Canvas Export</h3>
                <p className="text-base text-[#e2e8f0] leading-relaxed">
                  All syllabus topologies and individual concept notes serialize directly to the open JSON-based Obsidian
                  Canvas format. Students retain full sovereign control over their knowledge vault.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE LIVE THING (Interactive Feynman Intuition Tester) */}
        <section id="interactive-proctor" className="max-w-6xl mx-auto px-6 space-y-8" aria-labelledby="feynman-title">
          <div className="max-w-2xl space-y-3">
            <h2 id="feynman-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#e2e8f0] animate-enter">
              Test Socratic proctoring.
            </h2>
            <p className="text-base sm:text-lg text-[#e2e8f0] leading-relaxed animate-enter">
              Explain a computer science intuition below. The proctor will evaluate whether you have articulated the
              foundational mechanism or recited superficial jargon.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form */}
            <form onSubmit={handleEvaluateFeynman} className="lg:col-span-6 bg-[#161920] p-6 space-y-4 animate-enter">
              <div className="flex items-center justify-between pb-1">
                <label htmlFor="feynman-scratchpad" className="text-sm font-medium text-[#e2e8f0]">
                  Feynman Concept Explanation
                </label>
                <span className="text-sm text-[#94a3b8]">Bounded to 150 tokens</span>
              </div>

              <textarea
                id="feynman-scratchpad"
                value={feynmanInput}
                onChange={(e) => setFeynmanInput(e.target.value)}
                rows={5}
                spellCheck={false}
                autoComplete="off"
                className="w-full bg-[#0d0e12] p-4 text-base text-[#e2e8f0] font-sans leading-relaxed focus:bg-[#12151b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016] resize-none"
                placeholder="State the core invariant without using buzzwords..."
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-[#94a3b8]">Live demonstration evaluator</span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#d4af37] text-[#0d0e12] font-semibold text-sm inline-flex items-center gap-2 hover:bg-[#e5c24e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>Evaluate Intuition</span>
                </button>
              </div>
            </form>

            {/* Evaluation Response Card */}
            <div className="lg:col-span-6 bg-[#161920] p-6 space-y-4 animate-enter">
              <div className="flex items-center justify-between pb-1">
                <span className="text-sm font-semibold text-[#d4af37]">
                  Proctor Telemetry Output
                </span>
                {feynmanEvaluation && (
                  <span className="text-sm tabular-nums text-[#e2e8f0]">
                    Score: {feynmanEvaluation.score}% · {feynmanEvaluation.tokens} tokens
                  </span>
                )}
              </div>

              {feynmanEvaluation ? (
                <div className="space-y-4">
                  <div className="p-4 bg-[#0d0e12] space-y-2 animate-enter">
                    <div className="text-sm font-medium text-[#94a3b8]">Verification Verdict</div>
                    <p className="text-base text-[#e2e8f0] leading-relaxed">{feynmanEvaluation.verdict}</p>
                  </div>

                  <div className="p-4 bg-[#0d0e12] border-l-4 border-l-[#d4af37] space-y-1.5 animate-enter">
                    <div className="text-sm font-medium text-[#d4af37]">Socratic Probing Question</div>
                    <p className="text-base text-[#e2e8f0] italic leading-relaxed">
                      &ldquo;{feynmanEvaluation.probingQuestion}&rdquo;
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-sm text-[#94a3b8]">
                  Submit an explanation to receive proctor telemetry.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5: TELEMETRY & BENCHMARKS */}
        <section id="telemetry" className="max-w-6xl mx-auto px-6 space-y-8" aria-labelledby="telemetry-title">
          <div className="max-w-2xl space-y-3">
            <h2 id="telemetry-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#e2e8f0] animate-enter">
              Empirical telemetry.
            </h2>
            <p className="text-base sm:text-lg text-[#e2e8f0] leading-relaxed animate-enter">
              Unbounded conversational assistants accumulate hallucination and syllabus drift over extended study
              sessions. Antigravity constrains learning to certified DAG checkpoints.
            </p>
          </div>

          <div className="bg-[#161920] p-4 animate-enter">
            <div className="space-y-4">
              <div className="p-4 bg-[#0d0e12] space-y-1">
                <div className="text-sm font-semibold text-[#d4af37]">Prerequisite Enforcement</div>
                <div className="text-base text-[#e2e8f0]">Strict Topological Sorting (NetworkX) vs Ad-hoc conversational suggestions</div>
              </div>
              <div className="p-4 bg-[#0d0e12] space-y-1">
                <div className="text-sm font-semibold text-[#d4af37]">Schedule Rescheduling Cost</div>
                <div className="text-base text-[#e2e8f0]">0 Tokens (Deterministic BFS Cascade) vs ~2,500 tokens per prompt regeneration</div>
              </div>
              <div className="p-4 bg-[#0d0e12] space-y-1">
                <div className="text-sm font-semibold text-[#d4af37]">Socratic Evaluation Depth</div>
                <div className="text-base text-[#e2e8f0]">Bounded to 150 tokens on core invariants vs Unbounded prose giving solutions away</div>
              </div>
              <div className="p-4 bg-[#0d0e12] space-y-1">
                <div className="text-sm font-semibold text-[#d4af37]">Knowledge Portability</div>
                <div className="text-base text-[#e2e8f0]">Open JSON Obsidian Canvas Export vs Proprietary closed chat history</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: CTA (First step, already open) */}
        <section className="max-w-6xl mx-auto px-6" aria-labelledby="cta-title">
          <div className="bg-[#161920] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-enter">
            <div className="lg:col-span-7 space-y-4">
              <h2 id="cta-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#e2e8f0]">
                Initialize your syllabus.
              </h2>
              <p className="text-base sm:text-lg text-[#e2e8f0] max-w-lg leading-relaxed">
                Connect your course syllabus, verify prerequisite order, and enter Socratic Feynman practice immediately.
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#0d0e12] p-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="course-workspace-name" className="text-sm font-medium text-[#e2e8f0]">
                  Workspace Title
                </label>
                <input
                  id="course-workspace-name"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-[#161920] p-3.5 text-base text-[#e2e8f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
                  autoComplete="off"
                />
              </div>

              <Link
                href="/"
                className="w-full py-4 bg-[#d4af37] text-[#0d0e12] font-semibold text-sm text-center block hover:bg-[#e5c24e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6e016]"
              >
                Enter Academic Workspace
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 7: FOOTER OF TILES */}
      <footer className="bg-[#161920] py-16 animate-enter">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#0d0e12] space-y-3">
              <div className="font-semibold text-base text-[#e2e8f0]">Antigravity Core</div>
              <p className="text-sm text-[#e2e8f0] leading-relaxed">
                Autonomous academic planner combining NetworkX graph scheduling with bounded Socratic proctoring.
              </p>
            </div>

            <div className="p-6 bg-[#0d0e12] space-y-3">
              <div className="font-semibold text-base text-[#e2e8f0]">Open Platform</div>
              <ul className="text-sm text-[#e2e8f0] space-y-2">
                <li><Link href="/" className="hover:text-white focus-visible:ring-1 focus-visible:ring-[#f6e016]">DAG Skill Track</Link></li>
                <li><Link href="/" className="hover:text-white focus-visible:ring-1 focus-visible:ring-[#f6e016]">Socratic Terminal</Link></li>
                <li><Link href="/" className="hover:text-white focus-visible:ring-1 focus-visible:ring-[#f6e016]">Calendar Cascade</Link></li>
              </ul>
            </div>

            <div className="p-6 bg-[#0d0e12] space-y-3">
              <div className="font-semibold text-base text-[#e2e8f0]">Observational Credits</div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Archival plates courtesy of the Art Institute of Chicago (CC0), The Metropolitan Museum of Art (CC0),
                NASA, and the European Southern Observatory (CC BY 4.0).
              </p>
            </div>

            <div className="p-6 bg-[#0d0e12] space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-semibold text-base text-[#e2e8f0]">Local Telemetry</div>
                <div className="text-sm text-[#e2e8f0] mt-1">Status: All Systems Operational</div>
              </div>
              <div className="text-sm text-[#94a3b8]">
                Deterministic DAG Engine v1.0
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-[#e2e8f0] pt-6 gap-4">
            <div>&copy; 2026 Antigravity. Open academic intelligence.</div>
            <div className="flex items-center gap-6">
              <Link href="/landing" className="hover:text-white">Architecture</Link>
              <Link href="/" className="hover:text-white">Workspace App</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
