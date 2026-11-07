import React from "react";
import { Boxes, CheckCircle2, Sigma, Sparkles, TrendingUp, Users } from "lucide-react";
import { effectLabel } from "@/lib/interpretative";
import { fmtNum as fmt } from "@/lib/general";

const TONES = {
  blue: "bg-[#E0E7FF] text-[#3B82F6]",
  purple: "bg-[#EDE9FE] text-[#7C3AED]",
  green: "bg-[#DCFCE7] text-[#16A34A]",
  amber: "bg-[#FEF3C7] text-[#D97706]",
  teal: "bg-[#CCFBF1] text-[#0D9488]",
  rose: "bg-[#FFE4E6] text-[#E11D48]",
};

export default function MetricRow({ analysis }) {
  const { stats, totalRows, profiles, findings, completeness, effectSize } = analysis;

  const cards = [
    { label: "Ukuran Sampel", value: fmt(totalRows), sub: "baris teramati", icon: Users, tone: "blue" },
    { label: "Variabel", value: fmt(profiles.length), sub: `${analysis.numeric.length} numerik`, icon: Boxes, tone: "purple" },
    { label: "Temuan Kunci", value: fmt(findings.length), sub: "poin interpretasi", icon: Sparkles, tone: "green" },
    {
      label: "Rata-rata",
      value: stats ? fmt(stats.mean) : "–",
      sub: analysis.measure?.label || "tanpa kolom numerik",
      icon: Sigma,
      tone: "amber",
    },
    { label: "Kelengkapan", value: `${fmt(completeness, 1)}%`, sub: "sel terisi", icon: CheckCircle2, tone: "teal" },
    {
      label: "Ukuran Efek",
      value: effectSize === null ? "–" : fmt(effectSize),
      sub: effectSize === null ? "perlu dua kategori" : `efek ${effectLabel(effectSize)}`,
      icon: TrendingUp,
      tone: "rose",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-white/70 bg-white/90 p-3.5 shadow-[0_12px_32px_-26px_rgba(30,27,75,0.75)] backdrop-blur"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.07em] text-[#6B7280]">
                {card.label}
              </span>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${TONES[card.tone]}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 break-words text-[22px] font-extrabold leading-tight text-[#1E1B4B]">
              {card.value}
            </div>
            <div className="mt-0.5 truncate text-[10.5px] text-[#6B7280]">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}