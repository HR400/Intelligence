"use client";

import React, { useState } from "react";
import { Send, Lightbulb, Sparkles, AlertCircle, CheckCircle2, MessageSquare, Terminal as TerminalIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { OntologyNode, FeynmanResult } from "../../lib/types";
import { submitFeynmanExplanation } from "../../lib/api";

// Dynamic import for Monaco Editor to avoid SSR hydration issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-gray-950 text-gray-500 font-mono text-xs">
      Loading Monaco Editor environment...
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
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "proctor",
          content: `Evaluation error: ${err.message}. Please verify backend connection.`,
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
    <div className="h-full flex flex-col bg-gray-950 p-4 space-y-4 overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-gray-200">
            Socratic Feynman Terminal [Bounded &le; 150 Tokens]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
            Hints: {hintCount}
          </span>
          <button
            onClick={handleRequestHint}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded-lg transition-colors"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Hint</span>
          </button>
        </div>
      </div>

      {/* Socratic Conversation Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border leading-relaxed ${
              msg.role === "student"
                ? "bg-blue-950/40 border-blue-800/40 text-blue-100 ml-6"
                : "bg-surface-card border-surface-border text-gray-200 mr-6"
            }`}
          >
            <div className="flex items-center justify-between mb-1 pb-1 border-b border-gray-800/60 font-mono text-[10px]">
              <span className={msg.role === "student" ? "text-blue-400" : "text-emerald-400 font-bold"}>
                {msg.role === "student" ? "YOU (STUDENT)" : "SOCRATIC PROCTOR"}
              </span>
              {msg.accuracy !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">
                    Accuracy: {Math.round(msg.accuracy * 100)}%
                  </span>
                  <span className="text-gray-500">
                    {msg.tokensUsed} tokens
                  </span>
                </div>
              )}
            </div>
            <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

            {msg.needsScaffolding && (
              <div className="mt-2 p-2 bg-purple-950/40 border border-purple-800/40 rounded text-purple-300 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                <span>N-1 Scaffolding engaged: Foundational prerequisite reinforcement required.</span>
              </div>
            )}

            {msg.isMastered && (
              <div className="mt-2 p-2 bg-emerald-950/40 border border-emerald-800/40 rounded text-emerald-300 text-[11px] flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Topic Mastered! (+150 XP Mastery Bonus Granted)</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Monaco Editor / Markdown Input */}
      <div className="h-56 rounded-xl overflow-hidden border border-gray-800 bg-gray-900 flex flex-col">
        <div className="bg-gray-900 px-3 py-1.5 border-b border-gray-800 text-[11px] text-gray-400 font-mono flex items-center justify-between">
          <span>feynman_scratchpad.md</span>
          <span className="text-gray-500">Ctrl + Enter to submit</span>
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
        <span className="text-[11px] text-gray-500 font-mono">
          Token-bounded: Answers restricted to probing questions.
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || !explanation.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              <span>Submit Feynman Explanation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
