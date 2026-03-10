import os
import json
import re
from typing import Any, List, Dict
import httpx

INFERENCE_URL = "https://inference.do-ai.run/v1/chat/completions"
DEFAULT_MODEL = os.getenv("DO_INFERENCE_MODEL", "openai-gpt-oss-120b")
API_KEY = os.getenv("DIGITALOCEAN_INFERENCE_KEY")


def _extract_json(text: str) -> str:
    """Extract a JSON string from LLM output, handling markdown wrappers."""
    m = re.search(r"```(?:json)?\s*\n?([\s\S]*?)\n?\s*```", text, re.DOTALL)
    if m:
        return m.group(1).strip()
    m = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)
    if m:
        return m.group(1).strip()
    return text.strip()


def _coerce_unstructured_payload(raw_text: str) -> Dict[str, Any]:
    compact = raw_text.strip()
    tags = [part.strip(" -•\t") for part in re.split(r",|\\n", compact) if part.strip(" -•\t")]
    return {
        "note": "Model returned plain text instead of JSON",
        "raw": compact,
        "text": compact,
        "summary": compact,
        "tags": tags[:6],
    }


async def _call_inference(messages: List[Dict[str, str]], max_tokens: int = 512) -> Dict[str, Any]:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": DEFAULT_MODEL,
        "messages": messages,
        "max_completion_tokens": max_tokens,
    }
    async with httpx.AsyncClient(timeout=90.0) as client:
        try:
            response = await client.post(INFERENCE_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            # The response format from DO Inference follows OpenAI chat schema
            # We assume the assistant's content contains the JSON we need
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            json_str = _extract_json(content)
            return json.loads(json_str)
        except Exception as exc:
            # Fallback payload – keep it simple and informative
            return {"note": f"AI service unavailable: {str(exc)}"}


# ---------------------------------------------------------------------------
# Public helpers used by route handlers
# ---------------------------------------------------------------------------

async def analyze_transactions(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Send transaction list to the LLM and retrieve insights & recommendations."""
    system_msg = {
        "role": "system",
        "content": "You are a personal‑finance assistant. Analyze the provided transactions and return a JSON object with two keys: 'insights' (summary of spending patterns, anomalies, recurring subscriptions) and 'recommendations' (actionable savings tips). Do not include any extra text.",
    }
    user_msg = {
        "role": "user",
        "content": json.dumps({"transactions": transactions}),
    }
    return await _call_inference([system_msg, user_msg])


async def generate_recommendations(income: float, expenses: float) -> Dict[str, Any]:
    """Ask the LLM to simulate savings scenarios based on income & expenses.
    The expected JSON contains 'scenarios' (different saving plans) and 'suggestions' (tips).
    """
    system_msg = {
        "role": "system",
        "content": "You are a budgeting expert. Given a user's monthly income and expenses, generate a JSON object with two keys: 'scenarios' (different possible savings allocations with projected balances) and 'suggestions' (personalized tips to reach a savings goal). No additional prose.",
    }
    user_msg = {
        "role": "user",
        "content": json.dumps({"income": income, "expenses": expenses}),
    }
    return await _call_inference([system_msg, user_msg])
