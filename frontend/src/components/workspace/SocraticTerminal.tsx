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
    <div className="h-64 flex items-center justify-center bg-primary text-muted font-mono text-xs">
      Loading Monaco editor environment...
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
    `# Explain ${node.title} in your own words\n\nA practical real-world intuition for this concept is...`
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

    // Add student message to dialog
    setMessages((prev) => [
      ...prev,
      { role: "student", content: studentText },
    ]);

    try {
      const result = await submitFeynmanExplanation(node.id, studentText, hintCount);
      onEvaluationSuccess(result);

      // Add proctor evaluation message
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
        content: `💡 Hint #${newCount}: Consider breaking down the problem into base cases and recurrence state transitions. What invariants must remain true before and after each execution step?`,
        tokensUsed: 28,
      },
    ]);
  };

  return (
    <div className="h-full flex flex-col bg-primary p-6 space-y-4 overflow-hidden text-white">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <TerminalIcon className="h-4 w-4 text-coral" />
          <span className="text-xs font-mono tracking-mono-label text-white/90">
            Socratic Feynman Terminal [Bounded &le; 150 Tokens]
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-white/60 bg-white/5 px-2.5 py-0.5 rounded-pill border border-white/10">
            Hints: {hintCount}
          </span>
          <button
            onClick={handleRequestHint}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-coral bg-coral/10 hover:bg-coral/20 border border-coral/30 rounded-pill transition-all"
          >
            <Lightbulb className="h-3 w-3" />
            <span>Hint</span>
          </button>
        </div>
      </div>

      {/* Socratic Conversation Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-sm border leading-relaxed ${
              msg.role === "student"
                ? "bg-white/5 border-white/10 text-white/90 ml-6"
                : "bg-white/[0.08] border-white/15 text-white mr-6"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/10 font-mono text-[10px]">
              <span className={msg.role === "student" ? "text-action-blue" : "text-coral font-medium"}>
                {msg.role === "student" ? "STUDENT (YOU)" : "SOCRATIC PROCTOR"}
              </span>
              {msg.accuracy !== undefined && (
                <div className="flex items-center gap-3">
                  <span className="text-coral font-mono">
                    Accuracy: {Math.round(msg.accuracy * 100)}%
                  </span>
                  <span className="text-white/40 font-mono">
                    {msg.tokensUsed} tokens
                  </span>
                </div>
              )}
            </div>
            <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed font-light">{msg.content}</div>

            {msg.needsScaffolding && (
              <div className="mt-2.5 p-2.5 bg-coral/10 border border-coral/30 rounded-sm text-coral text-[11px] flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>N-1 Scaffolding engaged: Foundational prerequisite reinforcement required.</span>
              </div>
            )}

            {msg.isMastered && (
              <div className="mt-2.5 p-2.5 bg-deep-green/60 border border-deep-green rounded-sm text-white text-[11px] flex items-center gap-2 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-coral flex-shrink-0" />
                <span>Topic Mastered! (+150 XP Mastery Bonus Granted)</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Monaco Editor / Markdown Input */}
      <div className="h-56 rounded-sm overflow-hidden border border-white/10 bg-[#121216] flex flex-col">
        <div className="bg-[#1c1c22] px-3.5 py-1.5 border-b border-white/10 text-[11px] text-white/60 font-mono flex items-center justify-between">
          <span>feynman_scratchpad.md</span>
          <span className="text-white/40">Ctrl + Enter to submit</span>
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
        <span className="text-[11px] text-white/50 font-mono">
          Token-bounded: Answers restricted to probing questions.
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || !explanation.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-soft-stone text-primary font-sans font-medium text-xs rounded-pill transition-all disabled:opacity-40 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5 text-primary" />
              <span>Submit Explanation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

