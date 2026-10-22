"use client";

import React, { useState } from "react";
import { Send, Lightbulb, AlertCircle, CheckCircle2, Terminal as TerminalIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { OntologyNode, FeynmanResult } from "../../lib/types";
import { submitFeynmanExplanation } from "../../lib/api";

// Dynamic import for Monaco Editor to avoid SSR hydration issues
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
  const [explanation, setExplanation] = useState<string>(
    `# Intuition for ${node.title}\n\nThe core invariant of this concept is...`
  );
  const [hintCount, setHintCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageHistory[]>([
    {
      role: "proctor",
      content: `Welcome to the Socratic Proctor for "${node.title}". Explain the underlying mechanism clearly using the Feynman Technique. What is the fundamental intuition behind this concept?`,
      tokensUsed: 32,
    },
  ]);

  const handleSubmit = async () => {
    if (!explanation.trim() || loading) return;

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
    const newCount = hintCount + 1;
    setHintCount(newCount);
    setMessages((prev) => [
      ...prev,
      {
        role: "proctor",
        content: `💡 Tactical Hint #${newCount}: Consider breaking down the problem into base cases and recurrence state transitions. What invariants must remain true before and after each execution step?`,
        tokensUsed: 28,
      },
    ]);
  };

  return (
    <div
      className="h-full flex flex-col p-6 space-y-4 overflow-hidden"
      style={{ backgroundColor: "#161920", color: "#e2e8f0" }}
    >
      {/* Terminal Title Bar */}
      <div
        className="flex items-center justify-between pb-3.5"
        style={{ borderBottom: "1px solid #2d3545" }}
      >
        <div className="flex items-center gap-2.5">
          <TerminalIcon className="h-4 w-4" style={{ color: "#d4af37" }} />
          <span
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "#e2e8f0" }}
          >
            Socratic Feynman Terminal <span style={{ color: "#94a3b8" }}>[&le; 150 TOKENS]</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="text-[11px] font-mono px-2.5 py-1"
            style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545", color: "#94a3b8" }}
          >
            HINTS: {hintCount}
          </span>
          <button
            onClick={handleRequestHint}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
            style={{
              backgroundColor: "#d4af3715",
              border: "1px solid #d4af37",
              color: "#d4af37",
            }}
          >
            <Lightbulb className="h-3 w-3" />
            <span>Request Hint</span>
          </button>
        </div>
      </div>

      {/* Socratic Conversation Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-sans">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="p-4 leading-relaxed"
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
                {msg.role === "student" ? "Operator Transmission" : "Oracle Evaluation"}
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

            {msg.needsScaffolding && (
              <div
                className="mt-2.5 p-2.5 text-[11px] font-mono flex items-center gap-2"
                style={{ backgroundColor: "#991b1b15", border: "1px solid #991b1b", color: "#f87171" }}
              >
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>N-1 Scaffolding engaged: Foundational prerequisite reinforcement required.</span>
              </div>
            )}

            {msg.isMastered && (
              <div
                className="mt-2.5 p-2.5 text-[11px] font-mono flex items-center gap-2"
                style={{ backgroundColor: "#d4af3715", border: "1px solid #d4af37", color: "#d4af37" }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Topic Mastered! (+150 XP Mastery Bonus Granted)</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Monaco Editor / Markdown Input */}
      <div
        className="h-56 overflow-hidden flex flex-col"
        style={{ backgroundColor: "#0d0e12", border: "1px solid #2d3545" }}
      >
        <div
          className="px-3.5 py-1.5 text-[11px] font-mono flex items-center justify-between"
          style={{ backgroundColor: "#161920", borderBottom: "1px solid #2d3545", color: "#94a3b8" }}
        >
          <span style={{ color: "#d4af37" }}>feynman_scratchpad.md</span>
          <span style={{ color: "#94a3b8" }}>Ctrl + Enter to transmit</span>
        </div>
        <div className="flex-1">
          <MonacoEditor
            height="100%"
            defaultLanguage="markdown"
            theme="vs-dark"
            value={explanation}
            onChange={(val) => setExplanation(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-mono" style={{ color: "#94a3b8" }}>
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
              <Send className="h-3.5 w-3.5" style={{ color: "#0d0e12" }} />
              <span>Submit Explanation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
