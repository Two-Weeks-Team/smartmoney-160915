"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Insight = {
  summary: string;
  recommendations: string[];
};

type Props = {
  insight: Insight;
};

export default function InsightPanel({ insight }: Props) {
  const handleSave = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendation: insight.recommendations[0] })
      });
      alert("Recommendation saved!");
    } catch (e) {
      alert("Failed to save recommendation.");
    }
  };

  return (
    <section className="card">
      <h2 className="text-xl font-bold mb-3 text-foreground">AI Insights</h2>
      <p className="mb-4 text-muted">{insight.summary}</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        {insight.recommendations.map((rec, i) => (
          <li key={i} className="flex items-start">
            <CheckCircle2 className="text-success w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-foreground">{rec}</span>
          </li>
        ))}
      </ul>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-accent transition-default"
      >
        Save Recommendation
      </motion.button>
    </section>
  );
}
