import React from "react";
import { Image } from "@/components/ui/image";
import { fmtNum } from "@/lib/general";

const ICONS = {
  data: "https://base44.app/api/apps/6ab290c11265ad626905aac0/files/mp/public/6ab290c11265ad626905aac0/ee0af65d0_kpi-data.png",
  avg: "https://base44.app/api/apps/6ab290c11265ad626905aac0/files/mp/public/6ab290c11265ad626905aac0/4067c50af_kpi-avg.png",
  sum: "https://base44.app/api/apps/6ab290c11265ad626905aac0/files/mp/public/6ab290c11265ad626905aac0/b42283a83_kpi-sum.png",
  max: "https://base44.app/api/apps/6ab290c11265ad626905aac0/files/mp/public/6ab290c11265ad626905aac0/f3fdf6c32_kpi-max.png",
  min: "https://base44.app/api/apps/6ab290c11265ad626905aac0/files/mp/public/6ab290c11265ad626905aac0/ff949b662_kpi-min.png",
  uniq: "https://base44.app/api/apps/6ab290c11265ad626905aac0/files/mp/public/6ab290c11265ad626905aac0/fe72d32a1_kpi-uniq.png",
};

export default function GeneralKpi({ rows, stats, uniqueGroups, measureLabel, dimLabel, unit }) {
  const cards = [
    {
      label: "Total Data",
      value: fmtNum(rows),
      sub: "baris dalam dataset",
      img: ICONS.data,
      mix: 0,
    },
    {
      label: `Total ${measureLabel || "Data"}`,
      value: stats ? fmtNum(stats.sum) : "–",
      sub: unit || "akumulasi nilai",
      img: ICONS.sum,
      mix: 16,
    },
    {
      label: "Rata-rata",
      value: stats ? fmtNum(stats.mean) : "–",
      sub: stats ? `median ${fmtNum(stats.median)}` : "tanpa kolom numerik",
      img: ICONS.avg,
      mix: 32,
    },
    {
      label: "Maksimum",
      value: stats ? fmtNum(stats.max) : "–",
      sub: unit || "nilai tertinggi",
      img: ICONS.max,
      mix: 50,
    },
    {
      label: "Minimum",
      value: stats ? fmtNum(stats.min) : "–",
      sub: unit || "nilai terendah",
      img: ICONS.min,
      solid: "var(--accent)",
    },
    {
      label: "Kategori Unik",
      value: uniqueGroups === null || uniqueGroups === undefined ? "–" : fmtNum(uniqueGroups),
      sub: dimLabel || "kolom dimensi",
      img: ICONS.uniq,
      solid: "var(--accent-ink)",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const dark = Boolean(card.solid);
        const bg = card.solid || `color-mix(in srgb, var(--accent) ${card.mix}%, #ffffff)`;
        const strongInk = card.solid === "var(--accent-ink)";
        const main = dark ? (strongInk ? "var(--accent-soft)" : "#ffffff") : "var(--accent-ink)";
        const softText = main;

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
              <Image
                src={card.img}
                alt={card.label}
                fittingType="fit"
                className="h-8 w-8 shrink-0 rounded-md"
              />
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