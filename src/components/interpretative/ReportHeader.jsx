import React from "react";
import { BadgeCheck, Sparkles } from "lucide-react";
import { fmtNum } from "@/lib/general";
import { effectLabel } from "@/lib/interpretative";

export default function ReportHeader({ analysis }) {
  const { stats, totalRows, effectSize, difference, completeness, measureLabel, unit } = analysis;

  const cards = [
    { label: "Ukuran Sampel", value: fmtNum(totalRows), sub: "pengamatan" },
    { label: "Rata-rata", value: `${fmtNum(stats?.mean)}${unit}`, sub: measureLabel },
    {
      label: "Ukuran Efek (d)",
      value: effectSize === null ? "–" : fmtNum(effectSize),
      sub: effectSize === null ? "belum tersedia" : `efek ${effectLabel(effectSize)}`,
    },
    { label: "Selisih Kelompok", value: `${fmtNum(difference)}${unit}`, sub: "tertinggi − terendah" },
    { label: "Kelengkapan", value: `${fmtNum(completeness, 1)}%`, sub: "sel terisi" },
  ];

  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_16px_40px_-34px_rgba(30,27,75,0.8)] backdrop-blur sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-extrabold uppercase tracking-tight text-[#1E1B4B] sm:text-base">
            Research Insights
          </h2>
          <p className="mt-0.5 text-[11.5px] text-[#6B7280]">
            Narasi interpretasi terperinci dan laporan riset siap pakai
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EDE9FE] px-2.5 py-1 text-[10px] font-bold text-[#6D28D9]">
            <Sparkles className="h-3 w-3" /> Report-Ready Narrative
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10px] font-bold text-[#15803D]">
            <BadgeCheck className="h-3 w-3" /> Evidence-Based Interpretation
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#EDEBFA] bg-[#FBFAFF] px-3 py-2.5">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#8A88A8]">{card.label}</div>
            <div className="mt-0.5 break-words text-[17px] font-extrabold leading-tight text-[#1E1B4B]">
              {card.value}
            </div>
            <div className="truncate text-[10px] text-[#6B7280]">{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}