import { env } from "process";

export type AnalyzeResponse = {
  insights: string;
  recommendations: string[];
};

export type GoalsResponse = {
  scenarios: any[];
  suggestions: string[];
};

/**
 * Send raw transaction data to the AI backend and receive insights.
 */
export async function fetchTransactions(transactions: any[]): Promise<AnalyzeResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze-transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ transactions })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch insights");
  }
  return res.json();
}

/**
 * Submit income/expense data to generate savings‑goal scenarios.
 */
export async function fetchSavingsGoals(payload: { income: number; expenses: number }): Promise<GoalsResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to generate goals");
  }
  return res.json();
}
