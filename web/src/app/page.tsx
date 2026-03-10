"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import InsightPanel from "@/components/InsightPanel";
import StatePanel from "@/components/StatePanel";
import CollectionPanel from "@/components/CollectionPanel";
import { fetchTransactions } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

type Insight = {
  summary: string;
  recommendations: string[];
};

export default function HomePage() {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async (sampleData: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions(sampleData);
      setInsight({
        summary: data.insights,
        recommendations: data.recommendations
      });
      setUploaded(true);
    } catch (e: any) {
      setError(e.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-12 lg:px-24">
      <Hero onUpload={handleUpload} />
      <StatsStrip />
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StatePanel status="loading" />
          </motion.div>
        )}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StatePanel status="error" message={error} />
          </motion.div>
        )}
        {(!loading && !error && !uploaded) && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StatePanel status="empty" message="Upload a bank statement to see insights." />
          </motion.div>
        )}
        {insight && (
          <motion.div
            key="insight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <InsightPanel insight={insight} />
            <CollectionPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
