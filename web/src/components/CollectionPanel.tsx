"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type SavedItem = {
  id: string;
  recommendation: string;
  createdAt: string;
};

export default function CollectionPanel() {
  const [items, setItems] = useState<SavedItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-recommendations`);
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        setItems(data.recommendations);
      } catch (_) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <section className="card">
        <h3 className="text-lg font-medium mb-2">Saved Recommendations</h3>
        <p className="text-muted">You haven’t saved any insights yet.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3 className="text-lg font-medium mb-4">Saved Recommendations</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="border-b pb-2 last:border-b-0 text-foreground">
            <p className="font-medium">{item.recommendation}</p>
            <p className="text-sm text-muted">Saved on {new Date(item.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
