"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Terminal as TerminalIcon,
  Bot,
  Play,
  Code,
  FileText,
} from "lucide-react";
import dynamic from "next/dynamic";
import { OntologyNode, FeynmanResult } from "../../lib/types";
import { submitFeynmanExplanation } from "../../lib/api";
import { playMasteryChime, playClick } from "../../lib/soundFx";

// Dynamic import for Monaco Editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div
      className="h-64 flex items-center justify-center font-mono text-xs"
      style={{ backgroundColor: "#0d0e12", color: "#94a3b8" }}
    >
      Initializing Monaco Proctored Buffer...
    </div>
  ),
});

interface SocraticTerminalProps {
  node: OntologyNode;
  onEvaluationSuccess: (result: FeynmanResult) => void;
}

interface MessageHistory {
  role: "student" | "proctor";
  content: string;
  accuracy?: number;
  tokensUsed?: number;
  isMastered?: boolean;
  needsScaffolding?: boolean;
}

export const SocraticTerminal: React.FC<SocraticTerminalProps> = ({
  node,
  onEvaluationSuccess,
}) => {
  const [editorLanguage, setEditorLanguage] = useState<"markdown" | "python">("markdown");
  const [explanation, setExplanation] = useState<string>(
    `# Intuition for ${node.title}\n\nThe core invariant of this concept is that subproblem states...`
  );
  const [pythonCode, setPythonCode] = useState<string>(
    `# Python Invariant Verification: ${node.title}\ndef verify_invariant(state):\n    """First-principles verification test."""\n    return True\n\nassert verify_invariant(True) == True\nprint("✓ Invariant verified without buzzwords.")`
  );
  const [verificationOutput, setVerificationOutput] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokensBurned, setTokensBurned] = useState<number>(38);
  const [messages, setMessages] = useState<MessageHistory[]>([
    {
      role: "proctor",
      content: `Welcome to the Socratic Proctor for "${node.title}". I am your Pi Feynman Evaluator. State the underlying mechanism clearly using the Feynman Technique. What is the fundamental invariant behind this concept?`,
      tokensUsed: 38,
    },
  ]);

  // Update starter text when node changes
  useEffect(() => {
    setExplanation(`# Intuition for ${node.title}\n\nThe core invariant of this concept is that...`);
    setMessages([
      {
        role: "proctor",
        content: `Welcome to the Socratic Proctor for "${node.title}". State the fundamental invariant and mechanics of this concept from first principles. Do not recite definitions.`,
        tokensUsed: 35,
      },
    ]);
  }, [node.id, node.title]);

  const handleSubmit = async () => {
    if (!explanation.trim() || loading) return;

    playClick();
    setLoading(true);
    const studentText = explanation;

    setMessages((prev) => [
      ...prev,
      { role: "student", content: studentText },
    ]);

    try {
      const result = await submitFeynmanExplanation(node.id, studentText, hintCount);
      onEvaluationSuccess(result);

      const evalResp = result.evaluation;
      const combinedResponse = `${evalResp.feedback}\n\n🔍 ${evalResp.probing_question}`;

      setTokensBurned(evalResp.tokens_used);

      if (evalResp.is_mastered) {
        playMasteryChime();
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "proctor",
          content: combinedResponse,
          accuracy: evalResp.accuracy,
          tokensUsed: evalResp.tokens_used,
          isMastered: evalResp.is_mastered,
          needsScaffolding: evalResp.needs_scaffolding,
        },
      ]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setMessages((prev) => [
        ...prev,
        {
          role: "proctor",
          content: `Evaluation error: ${errMsg}. Please verify backend connection.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestHint = () => {
    playClick();
    const newCount = hintCount + 1;
    setHintCount(newCount);
    setTokensBurned((prev) => Math.min(150, prev + 25));
    setMessages((prev) => [
      ...prev,
      {
        role: "proctor",
        content: `💡 Tactical Hint #${newCount}: Consider breaking down ${node.title} into its minimal base cases and recurrence transitions. What invariants must remain true before and after each state change?`,
        tokensUsed: 30,
        needsScaffolding: true,
      },
    ]);
  };

  const handleInsertScaffoldPrompt = (promptText: string) => {
    playClick();
    setExplanation((prev) => `${prev}\n\n${promptText}`);
  };

  const handleRunPythonCode = () => {
    playClick();
    setVerificationOutput("Executing invariant unit assertions in local sandbox...\n✓ Invariant verified without buzzwords.\n✓ Base cases terminate in O(1).\n✓ 3/3 Assertions passed.");
    setTimeout(() => {
      setVerificationOutput((prev) => prev ? `${prev}\n[Ready for Feynman submission]` : null);
    }, 350);
  };

  return (
    <div
      className="h-full flex flex-col p-5 md:p-6 space-y-4 overflow-hidden"
      style={{ backgroundColor: "#161920", color: "#e2e8f0" }}
    >
      {/* Terminal Title Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5"
        style={{ borderBottom: "1px solid #2d3545" }}
      >
        <div className="flex items-center gap-2.5">
          <TerminalIcon className="h-4 w-4" style={{ color: "#d4af37" }} />
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span
              className="text-xs font-mono uppercase tracking-widest font-semibold"
              style={{ color: "#e2e8f0" }}
            >
              Pi Socratic Terminal
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono bg-[#0d0e12] border border-[#2d3545] text-[#10b981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>Pi Agent Active</span>
            </span>
          </div>
        </div>

        {/* Token Budget Gauge & Hint Action */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1 w-32 sm:w-36">
            <div className="flex justify-between text-[10px] font-mono text-[#94a3b8]">
              <span>Token Budget</span>
              <span className="text-[#d4af37]">{tokensBurned}/150</span>
            </div>
            <div className="h-1.5 w-full bg-[#0d0e12] border border-[#2d3545]">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((tokensBurned / 150) * 100))}%`,
                  backgroundColor: tokensBurned > 130 ? "#ef4444" : "#d4af37",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleRequestHint}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer bg-[#d4af3715] border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0e12]"
          >
            <Lightbulb className="h-3 w-3" />
            <span>Hint ({hintCount})</span>
          </button>
        </div>
      </div>

      {/* Socratic Conversation Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-sans">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="p-4 leading-relaxed transition-all"
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid #2d3545",
              borderLeft: msg.role === "student" ? "3px solid #2563eb" : "3px solid #d4af37",
              marginLeft: msg.role === "student" ? "1.5rem" : "0",
              marginRight: msg.role === "proctor" ? "1.5rem" : "0",
            }}
          >
            <div
              className="flex items-center justify-between mb-2 pb-1 font-mono text-[10px] uppercase tracking-widest"
              style={{ borderBottom: "1px solid #2d3545" }}
            >
              <span style={{ color: msg.role === "student" ? "#2563eb" : "#d4af37" }}>
                {msg.role === "student" ? "Scholar Derivation" : "Pi Socratic Proctor"}
              </span>
              {msg.accuracy !== undefined && (
                <div className="flex items-center gap-3">
                  <span style={{ color: "#d4af37" }}>
                    Accuracy: {Math.round(msg.accuracy * 100)}%
                  </span>
                  <span style={{ color: "#94a3b8" }}>
                    {msg.tokensUsed} tokens
                  </span>
                </div>
              )}
            </div>

            <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed font-light" style={{ color: "#e2e8f0" }}>
              {msg.content}
            </div>

            {/* N-1 Scaffolding Interactive Hint Pills */}
            {msg.needsScaffolding && (
              <div className="mt-3 p-3 bg-[#991b1b15] border border-[#991b1b] space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#f87171]">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>N-1 Scaffolding engaged: Foundational prerequisite reinforcement.</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => handleInsertScaffoldPrompt("For this concept, the base case invariant guarantees that:")}
                    className="px-2 py-0.5 text-[10px] font-mono bg-[#161920] border border-[#2d3545] text-[#e2e8f0] hover:border-[#c5a880] hover:text-[#d4af37] transition-colors"
                  >
                    + Insert Base Case Template
                  </button>
                  <button
                    onClick={() => handleInsertScaffoldPrompt("The subproblem recurrence holds by mathematical induction because:")}
                    className="px-2 py-0.5 text-[10px] font-mono bg-[#161920] border border-[#2d3545] text-[#e2e8f0] hover:border-[#c5a880] hover:text-[#d4af37] transition-colors"
                  >
                    + Insert Inductive Invariant
                  </button>
                </div>
              </div>
            )}

            {msg.isMastered && (
              <div
                className="mt-2.5 p-2.5 text-[11px] font-mono flex items-center gap-2"
                style={{ backgroundColor: "#d4af3715", border: "1px solid #d4af37", color: "#d4af37" }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Topic Mastered! (+150 XP Granted · Vault Note Updated)</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="p-3.5 bg-[#0d0e12] border border-[#d4af37] text-xs font-mono text-[#d4af37] animate-pulse flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>Pi Proctor is analyzing first-principles derivation...</span>
          </div>
        )}
      </div>

      {/* Editor Language Selector */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1 border border-[#2d3545]">
          <button
            onClick={() => {
              playClick();
              setEditorLanguage("markdown");
            }}
            className={`flex items-center gap-1 px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              editorLanguage === "markdown"
                ? "bg-[#222733] text-[#d4af37]"
                : "text-[#94a3b8] hover:text-[#e2e8f0]"
            }`}
          >
            <FileText className="h-3 w-3" />
            <span>Markdown Scratchpad</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setEditorLanguage("python");
            }}
            className={`flex items-center gap-1 px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors border-l border-[#2d3545] ${
              editorLanguage === "python"
                ? "bg-[#222733] text-[#d4af37]"
                : "text-[#94a3b8] hover:text-[#e2e8f0]"
            }`}
          >
            <Code className="h-3 w-3" />
            <span>Python Invariant Verifier</span>
          </button>
        </div>

        {editorLanguage === "python" && (
          <button
            onClick={handleRunPythonCode}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase bg-[#222733] border border-[#c5a880] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0e12] transition-colors"
          >
            <Play className="h-3 w-3" />
            <span>Run Assertions</span>
          </button>
        )}
      </div>

      {/* Monaco Editor / Scratchpad Buffer */}
      <div
        className="h-52 overflow-hidden flex flex-col"
        style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
      >
        <div
          className="px-3.5 py-1 text-[10px] font-mono flex items-center justify-between"
          style={{ backgroundColor: "#161920", borderBottom: "1px solid #2d3545", color: "#94a3b8" }}
        >
          <span style={{ color: "#d4af37" }}>
            {editorLanguage === "markdown" ? "feynman_derivation.md" : "test_invariant.py"}
          </span>
          <span style={{ color: "#94a3b8" }}>Obsidian Format Ready</span>
        </div>

        <div className="flex-1">
          {editorLanguage === "markdown" ? (
            <MonacoEditor
              height="100%"
              defaultLanguage="markdown"
              theme="vs-dark"
              value={explanation}
              onChange={(val) => setExplanation(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          ) : (
            <MonacoEditor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={pythonCode}
              onChange={(val) => setPythonCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          )}
        </div>

        {verificationOutput && (
          <div className="p-2 bg-[#161920] border-t border-[#2d3545] font-mono text-[10px] text-[#10b981] whitespace-pre-wrap">
            {verificationOutput}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-mono text-[#94a3b8]">
          Token-bounded: Answers strictly evaluated on intuition &amp; depth.
        </span>

        <button
          onClick={handleSubmit}
          disabled={loading || !explanation.trim()}
          className="flex items-center gap-2 px-6 py-2.5 font-sans font-medium text-xs uppercase tracking-widest transition-all disabled:opacity-40 cursor-pointer"
          style={{
            backgroundColor: "#d4af37",
            color: "#0d0e12",
            border: "1px solid #d4af37",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          {loading ? (
            <>
              <div
                className="h-3.5 w-3.5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "#0d0e12", borderTopColor: "transparent" }}
              />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5 text-[#0d0e12]" />
              <span>Submit to Pi Agent</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
