import pytest
from backend.app.models.ontology import OntologyNode, NodeTier
from backend.app.agents.socratic_engine import (
    SocraticEvaluator,
    SocraticEvaluationResponse,
)


def test_socratic_evaluator_token_guardrail():
    evaluator = SocraticEvaluator()
    # Prompt string or mock response must be <= 150 tokens
    long_text = "This is a word. " * 300
    bounded_text = evaluator.enforce_token_bounding(long_text, max_tokens=150)
    # Roughly 150 tokens is ~600-750 characters or ~120-150 words
    words = bounded_text.split()
    assert len(words) <= 150


def test_socratic_n_minus_one_scaffolding():
    evaluator = SocraticEvaluator()
    current_node = OntologyNode(
        id="calc_chain_rule",
        course_id="math201",
        title="Chain Rule",
        prerequisites=["calc_derivatives"],
        tier=NodeTier.HL,
    )
    prereq_node = OntologyNode(
        id="calc_derivatives",
        course_id="math201",
        title="Basic Derivative Rules",
        prerequisites=[],
        tier=NodeTier.SL,
    )
    
    # If student demonstrates fundamental misconception regarding derivatives in chain rule explanation
    scaffold_question = evaluator.generate_scaffolding_fallback(
        current_node=current_node,
        prerequisite_node=prereq_node,
        misconception="Failed to compute standard power rule",
    )
    
    assert prereq_node.title in scaffold_question or "prerequisite" in scaffold_question.lower()
    assert "?" in scaffold_question
    assert len(scaffold_question.split()) <= 150
