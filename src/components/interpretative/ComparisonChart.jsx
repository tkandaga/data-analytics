import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";

export default function ComparisonChart({ analysis }) {
  const { comparison, dimLabel, measureLabel, unit } = analysis;

  return (
    <Panel
      title="Perbandingan Kelompok"
      sub={`rata-rata ${measureLabel} per ${dimLabel}`}
      bodyClassName="pt-3"
    >
      {comparison.length ? (
        <>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison} margin={{ top: 10, right: 10, bottom: 26, left: 0 }}>
                <CartesianGrid stroke="#EEF0FB" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9.5, fill: "#6B7280" }}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={54}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} width={38} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${fmtNum(value)}${unit}`, "Rata-rata"]}
                  contentStyle={{ borderRadius: 10, border: "1px solid #E4E1F7", fontSize: 12 }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[5, 5, 0, 0]} maxBarSize={38} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 rounded-xl border border-[#E9E6FB] bg-[#F7F5FF] px-3 py-2.5 text-[11px] leading-relaxed text-[#4C4585]">
            {analysis.top.name} memiliki rata-rata tertinggi ({fmtNum(analysis.top.value)}
            {unit}), sedangkan {analysis.bottom.name} terendah ({fmtNum(analysis.bottom.value)}
            {unit}). Selisih keduanya {fmtNum(analysis.difference)}
            {unit}.
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Tidak ada kategori untuk dibandingkan.</p>
      )}
    </Panel>
  );
}