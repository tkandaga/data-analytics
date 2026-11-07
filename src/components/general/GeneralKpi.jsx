import React from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Database, Layers, Sigma } from "lucide-react";
import { fmtNum } from "@/lib/general";

export default function GeneralKpi({ rows, stats, uniqueGroups, measureLabel, dimLabel, unit }) {
  const cards = [
    {
      label: "Total Data",
      value: fmtNum(rows),
      sub: "baris dalam dataset",
      icon: Database,
      color: "#1C69C6",
      soft: "#E9F3FF",
    },
    {
      label: `Total ${measureLabel || "Data"}`,
      value: stats ? fmtNum(stats.sum) : "–",
      sub: unit || "akumulasi nilai",
      icon: Sigma,
      color: "#6430DA",
      soft: "#F1EFFF",
    },
    {
      label: "Rata-rata",
      value: stats ? fmtNum(stats.mean) : "–",
      sub: stats ? `median ${fmtNum(stats.median)}` : "tanpa kolom numerik",
      icon: Activity,
      color: "#0E9488",
      soft: "#E6F7F4",
    },
    {
      label: "Maksimum",
      value: stats ? fmtNum(stats.max) : "–",
      sub: unit || "nilai tertinggi",
      icon: ArrowUpRight,
      color: "#D36A2B",
      soft: "#FFF3EB",
    },
    {
      label: "Minimum",
      value: stats ? fmtNum(stats.min) : "–",
      sub: unit || "nilai terendah",
      icon: ArrowDownRight,
      color: "#C2255C",
      soft: "#FDECF2",
    },
    {
      label: "Kategori Unik",
      value: uniqueGroups === null || uniqueGroups === undefined ? "–" : fmtNum(uniqueGroups),
      sub: dimLabel || "kolom dimensi",
      icon: Layers,
      color: "#6240C8",
      soft: "#F1EFFF",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-[#E9ECF8] bg-white p-3.5 shadow-[0_1px_2px_rgba(23,37,75,0.04)]"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8B95B5]">{card.label}</span>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: card.soft, color: card.color }}
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 break-words text-xl font-extrabold leading-tight text-[#17254B]">{card.value}</div>
            <div className="mt-0.5 truncate text-[10.5px] text-[#8B95B5]">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}