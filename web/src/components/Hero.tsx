"use client";

import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

type HeroProps = {
  onUpload: (sampleData: any[]) => Promise<void>;
};

export default function Hero({ onUpload }: HeroProps) {
  const [uploading, setUploading] = useState(false);

  const handleClick = async () => {
    setUploading(true);
    // Sample transaction payload – in a real demo this would come from a CSV parser.
    const sample = [
      { date: "2024-01-05", description: "Spotify", amount: -9.99 },
      { date: "2024-01-12", description: "Starbucks", amount: -4.5 },
      { date: "2024-01-15", description: "Salary", amount: 3000 }
    ];
    await onUpload(sample);
    setUploading(false);
  };

  return (
    <section className="text-center py-12 md:py-20">
      <h1 className={`${inter.className} text-4xl md:text-5xl font-bold text-foreground mb-4`}>SmartMoney</h1>
      <p className="text-lg md:text-xl text-muted mb-8">Transform your finances with AI‑powered insights.</p>
      <button
        onClick={handleClick}
        disabled={uploading}
        className="bg-primary text-white px-6 py-3 rounded-md hover:bg-accent transition-default flex items-center mx-auto"
      >
        {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
        {uploading ? "Analyzing…" : "Upload Sample Statement"}
      </button>
    </section>
  );
}
