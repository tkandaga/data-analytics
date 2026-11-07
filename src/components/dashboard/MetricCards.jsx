import React from "react";
import { Activity, BarChart3, SlidersHorizontal, Target, TrendingUp } from "lucide-react";
import { EPS } from "@/lib/modeling";

export default function MetricCards({ n, r2, rmse, modelName }) {
  const cards = [
    { label: "Observasi", value: String(n), icon: Activity, soft: "var(--accent-soft)", color: "var(--accent)" },
    { label: "R²", value: n ? r2.toFixed(3) : "–", icon: Target, soft: "#E9F3FF", color: "#1C69C6" },
    { label: "RMSE", value: n ? rmse.toFixed(3) : "–", icon: BarChart3, soft: "#E9F7F1", color: "#178D65" },
    {
      label: "Model Terbaik",
      value: modelName,
      icon: TrendingUp,
      soft: "#FFF3EB",
      color: "#D36A2B",
      small: true,
    },
    { label: "Toleransi ε", value: `±${EPS.toFixed(1)}`, icon: SlidersHorizontal, soft: "#F1EFFF", color: "#6240C8" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="flex min-w-0 items-center gap-3.5 rounded-2xl border border-[#DFE4F7] px-4 py-4"
            style={{ background: c.soft }}
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: c.color }}
            >
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold uppercase tracking-wide text-[#17254B]">{c.label}</div>
              <div
                className={`mt-1 break-words font-extrabold leading-tight text-[#17254B] ${
                  c.small ? "text-base" : "text-2xl"
                }`}
              >
                {c.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}