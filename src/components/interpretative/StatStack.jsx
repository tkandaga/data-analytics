import React from "react";
import { TrendingUp } from "lucide-react";
import { fmtNum } from "@/lib/general";
import { effectLabel, strengthOf } from "@/lib/interpretative";

export default function StatStack({ analysis }) {
  const { difference, effectSize, correlation, completeness, unit } = analysis;
  const items = [
    { label: "Selisih rata-rata", value: `Δ ${fmtNum(difference)}${unit}` },
    {
      label: "Ukuran efek",
      value: effectSize === null ? "–" : `${fmtNum(effectSize)} (${effectLabel(effectSize)})`,
    },
    {
      label: "Korelasi",
      value: correlation === null ? "–" : `r = ${fmtNum(correlation)} · ${strengthOf(correlation)}`,
    },
    { label: "Kelengkapan", value: `${fmtNum(completeness, 1)}%` },
  ];

  return (
    <div className="flex h-full flex-col gap-2.5 rounded-2xl bg-gradient-to-b from-[#312E81] to-[#1E1B4B] p-4 text-white">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.09em] text-white/70">
        <TrendingUp className="h-3.5 w-3.5" /> Ringkasan Angka
      </div>
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-white/10 px-3 py-2">
          <div className="text-[9.5px] font-semibold uppercase tracking-[0.05em] text-white/60">{item.label}</div>
          <div className="mt-0.5 text-[12.5px] font-extrabold leading-tight">{item.value}</div>
        </div>
      ))}
    </div>
  );
}