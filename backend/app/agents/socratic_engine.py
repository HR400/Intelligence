import json
import logging
from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.models.ontology import OntologyNode
from backend.app.core.config import settings

logger = logging.getLogger(__name__)


class SocraticEvaluationResponse(BaseModel):
    accuracy: float = Field(ge=0.0, le=1.0)
    is_mastered: bool
    needs_scaffolding: bool
    feedback: str
    probing_question: str
    identified_misconceptions: List[str] = Field(default_factory=list)
    tokens_used: int = 0


class SocraticEvaluator:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = settings.LITELLM_MODEL
        self.max_tokens = settings.MAX_SOCRATIC_TOKENS

    def enforce_token_bounding(self, text: str, max_tokens: int = 150) -> str:
        """Enforces hard token/word limit to ensure interactive, Boot.dev-like feedback."""
        words = text.split()
        if len(words) <= max_tokens:
            return text
        return " ".join(words[:max_tokens]) + "..."

    def generate_scaffolding_fallback(
        self,
        current_node: OntologyNode,
        prerequisite_node: Optional[OntologyNode],
        misconception: str,
    ) -> str:
        """
        N-1 Scaffolding Fallback:
        When deep misconceptions in current topic stem from prerequisite gap,
        pivot question directly to the foundational prerequisite concept.
        """
        prereq_name = prerequisite_node.title if prerequisite_node else "the prerequisite concept"
        question = (
            f"Before tackling {current_node.title}, let's revisit {prereq_name}: "
            f"Regarding {misconception}, how would you describe its core principle?"
        )
        return self.enforce_token_bounding(question, max_tokens=self.max_tokens)

    async def evaluate_explanation(
        self,
        student_explanation: str,
        current_node: OntologyNode,
        prerequisite_nodes: List[OntologyNode],
        hint_count: int = 0,
    ) -> SocraticEvaluationResponse:
        """
        Evaluates student explanation with strict JSON schema and <=150 token guardrail.
        Falls back gracefully to intelligent deterministic rule heuristics if LLM client is offline.
        """
        explanation_clean = student_explanation.strip().lower()
        
        # In case API key is set, attempt LiteLLM / Gemini API call
        if self.api_key:
            try:
                import litellm
                from backend.app.agents.prompts import SOCRATIC_FEYNMAN_SYSTEM_PROMPT

                user_prompt = f"""Topic: {current_node.title} (Tier: {current_node.tier.value})
Summary: {current_node.summary}
Prerequisites: {[p.title for p in prerequisite_nodes]}
Student Explanation:
{student_explanation}
Hints Used: {hint_count}
"""
                response = await litellm.acompletion(
                    model=self.model_name,
                    messages=[
                        {"role": "system", "content": SOCRATIC_FEYNMAN_SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt},
                    ],
                    max_tokens=self.max_tokens,
                    temperature=0.3,
                    response_format={"type": "json_object"},
                    api_key=self.api_key,
                )
                raw_text = response.choices[0].message.content
                data = json.loads(raw_text)
                return SocraticEvaluationResponse(
                    accuracy=float(data.get("accuracy", 0.7)),
                    is_mastered=bool(data.get("is_mastered", False)),
                    needs_scaffolding=bool(data.get("needs_scaffolding", False)),
                    feedback=self.enforce_token_bounding(data.get("feedback", "Good explanation.")),
                    probing_question=self.enforce_token_bounding(data.get("probing_question", "What is the next step?")),
                    identified_misconceptions=data.get("identified_misconceptions", []),
                    tokens_used=response.usage.total_tokens if hasattr(response, "usage") else 100,
                )
            except Exception as e:
                logger.warning(f"LLM evaluation encountered exception: {e}. Using deterministic heuristic fallback.")

        # Deterministic / offline intelligent heuristic
        words = explanation_clean.split()
        word_count = len(words)
        
        # Check depth and conceptual keywords
        keywords = set(current_node.title.lower().split() + current_node.summary.lower().split())
        matched_keywords = [kw for kw in keywords if len(kw) > 3 and kw in explanation_clean]
        
        if word_count < 10:
            return SocraticEvaluationResponse(
                accuracy=0.2,
                is_mastered=False,
                needs_scaffolding=True,
                feedback="Your explanation is too brief. The Feynman technique requires explaining the intuition to a novice.",
                probing_question=f"Can you explain the main purpose of {current_node.title} without using technical jargon?",
                identified_misconceptions=["Incomplete intuition"],
                tokens_used=35,
            )
        
        accuracy = min(1.0, 0.4 + (len(matched_keywords) * 0.15) + (min(word_count, 80) / 200.0))
        accuracy = round(accuracy, 2)
        is_mastered = accuracy >= 0.85
        needs_scaffolding = accuracy < 0.60 and len(prerequisite_nodes) > 0

        if needs_scaffolding:
            prereq = prerequisite_nodes[0]
            question = self.generate_scaffolding_fallback(current_node, prereq, "foundational mechanics")
            feedback = f"It seems the foundational ideas behind {prereq.title} need reinforcing before mastering {current_node.title}."
        elif is_mastered:
            question = f"Excellent! How would this concept behave at the edge limits or under adverse conditions?"
            feedback = "Solid explanation! You captured the fundamental mechanism clearly."
        else:
            question = f"You covered the basics, but what is the exact physical or logical intuition that drives this step?"
            feedback = "Good start. A bit more precision is required on the underlying mechanism."

        return SocraticEvaluationResponse(
            accuracy=accuracy,
            is_mastered=is_mastered,
            needs_scaffolding=needs_scaffolding,
            feedback=self.enforce_token_bounding(feedback),
            probing_question=self.enforce_token_bounding(question),
            identified_misconceptions=[] if is_mastered else ["Incomplete edge condition handling"],
            tokens_used=45,
        )
