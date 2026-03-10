"use client";

import { Loader2, XCircle, CheckCircle } from "lucide-react";

type Props = {
  status: "loading" | "error" | "empty" | "success";
  message?: string;
};

export default function StatePanel({ status, message }: Props) {
  let icon;
  let colorClass = "text-foreground";
  switch (status) {
    case "loading":
      icon = <Loader2 className="animate-spin w-8 h-8" />;
      colorClass = "text-primary";
      break;
    case "error":
      icon = <XCircle className="w-8 h-8" />;
      colorClass = "text-warning";
      break;
    case "empty":
      icon = <CheckCircle className="w-8 h-8" />;
      colorClass = "text-muted";
      break;
    case "success":
      icon = <CheckCircle className="w-8 h-8" />;
      colorClass = "text-success";
      break;
  }

  return (
    <div className="flex flex-col items-center py-12">
      <div className={`${colorClass} mb-4`}>{icon}</div>
      <p className="text-lg text-center text-foreground">
        {message ?? (status === "loading" ? "Analyzing your data…" : status === "error" ? "Something went wrong. Please try again." : status === "empty" ? "No data yet. Upload a statement to begin." : "All set!")}
      </p>
    </div>
  );
}
