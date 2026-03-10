"use client";

import { useEffect, useState } from "react";
import { fetchSavingsGoals } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function StatsStrip() {
  const [goalProgress, setGoalProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // In a real app this would come from user data; we simulate a quick fetch.
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchSavingsGoals({ income: 5000, expenses: 3200 });
        // Assume the first scenario contains a suggested saving amount.
        const suggested = res.scenarios?.[0]?.suggestedSaving ?? 500;
        const progress = Math.min(100, (suggested / 2000) * 100);
        setGoalProgress(progress);
      } catch (_) {
        setGoalProgress(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card rounded-lg p-4 shadow-md">
      <div className="text-center md:text-left">
        <p className="text-muted">Total Spend (This Month)</p>
        <p className="text-2xl font-semibold text-foreground">$2,350</p>
      </div>
      <div className="w-full md:w-1/3">
        <p className="text-muted mb-1">Savings Goal Progress</p>
        {loading ? (
          <Loader2 className="animate-spin text-primary" />
        ) : goalProgress !== null ? (
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-success h-3 rounded-full transition-default"
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
        ) : (
          <p className="text-warning text-sm">Unable to load goal</p>
        )}
      </div>
    </div>
  );
}
