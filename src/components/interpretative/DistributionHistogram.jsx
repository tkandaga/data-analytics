import React from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";

export default function DistributionHistogram({ analysis, compact = false }) {
  const { hist, stats, measureLabel, unit } = analysis;
  const meanBin = stats ? hist.reduce((best, b) => (Math.abs(b.mid - stats.mean) < Math.abs(best.mid - stats.mean) ? b : best), hist[0]) : null;

  return (
    <Panel
      title={`Sebaran ${measureLabel}`}
      sub={`histogram frekuensi${unit ? ` (${unit.trim()})` : ""}`}
      bodyClassName="pt-3"
    >
      {hist.length ? (
        <>
          <div className={compact ? "h-[210px] w-full" : "h-[250px] w-full"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hist} margin={{ top: 12, right: 10, bottom: 26, left: 0 }}>
                <CartesianGrid stroke="#EEF0FB" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9.5, fill: "#6B7280" }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={52}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#6B7280" }} width={30} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${value} baris`, "Frekuensi"]}
                  contentStyle={{ borderRadius: 10, border: "1px solid #E4E1F7", fontSize: 12 }}
                />
                {meanBin ? (
                  <ReferenceLine
                    x={meanBin.name}
                    stroke="#22C55E"
                    strokeDasharray="4 3"
                    label={{ value: `rata-rata ${fmtNum(stats.mean)}`, position: "top", fontSize: 9.5, fill: "#15803D" }}
                  />
                ) : null}
                <Bar dataKey="count" fill="var(--accent)" radius={[5, 5, 0, 0]} maxBarSize={34} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 rounded-xl border border-[#E9E6FB] bg-[#F7F5FF] px-3 py-2.5 text-[11px] leading-relaxed text-[#4C4585]">
            Sebaran {measureLabel} berkisar {fmtNum(stats.min)}–{fmtNum(stats.max)}
            {unit}, dengan simpangan baku {fmtNum(stats.stdev)}
            {unit}. Puncak frekuensi berada pada rentang {hist.reduce((a, b) => (b.count > a.count ? b : a)).name}.
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Tidak ada data numerik untuk ditampilkan.</p>
      )}
    </Panel>
  );
}