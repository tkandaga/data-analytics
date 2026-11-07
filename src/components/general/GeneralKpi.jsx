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
      mix: 0,
    },
    {
      label: `Total ${measureLabel || "Data"}`,
      value: stats ? fmtNum(stats.sum) : "–",
      sub: unit || "akumulasi nilai",
      icon: Sigma,
      mix: 16,
    },
    {
      label: "Rata-rata",
      value: stats ? fmtNum(stats.mean) : "–",
      sub: stats ? `median ${fmtNum(stats.median)}` : "tanpa kolom numerik",
      icon: Activity,
      mix: 32,
    },
    {
      label: "Maksimum",
      value: stats ? fmtNum(stats.max) : "–",
      sub: unit || "nilai tertinggi",
      icon: ArrowUpRight,
      mix: 50,
    },
    {
      label: "Minimum",
      value: stats ? fmtNum(stats.min) : "–",
      sub: unit || "nilai terendah",
      icon: ArrowDownRight,
      solid: "var(--accent)",
    },
    {
      label: "Kategori Unik",
      value: uniqueGroups === null || uniqueGroups === undefined ? "–" : fmtNum(uniqueGroups),
      sub: dimLabel || "kolom dimensi",
      icon: Layers,
      solid: "var(--accent-ink)",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const dark = Boolean(card.solid);
        const bg = card.solid || `color-mix(in srgb, var(--accent) ${card.mix}%, #ffffff)`;
        const strongInk = card.solid === "var(--accent-ink)";
        const main = dark ? (strongInk ? "var(--accent-soft)" : "#ffffff") : "var(--accent-ink)";
        const softText = dark ? (strongInk ? "var(--accent-soft)" : "#ffffff") : "var(--accent-ink)";

        return (
          <div
            key={card.label}
            className="rounded-2xl border p-3.5 shadow-[0_2px_10px_rgba(29,28,101,0.06)]"
            style={{
              background: bg,
              borderColor: dark ? "transparent" : "color-mix(in srgb, var(--accent) 22%, #ffffff)",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.08em]"
                style={{ color: softText, opacity: dark ? 0.82 : 0.62 }}
              >
                {card.label}
              </span>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: dark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.72)",
                  color: main,
                }}
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 break-words text-xl font-extrabold leading-tight" style={{ color: main }}>
              {card.value}
            </div>
            <div
              className="mt-0.5 truncate text-[10.5px]"
              style={{ color: softText, opacity: dark ? 0.72 : 0.58 }}
            >
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}