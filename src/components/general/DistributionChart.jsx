import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Panel from "@/components/dashboard/Panel";
import { PALETTE, fmtCompact, fmtNum } from "@/lib/general";

export default function DistributionChart({ groups, topN = 6 }) {
  const sorted = [...groups.rows].sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const restValue = rest.reduce((acc, r) => acc + r.value, 0);
  const data = restValue > 0 ? [...head, { name: "Lainnya", value: restValue }] : head;
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const unit = groups.unit ? ` ${groups.unit}` : "";

  return (
    <Panel title="Distribusi" sub={`per ${groups.dimLabel}`} bodyClassName="pt-3">
      {data.length ? (
        <>
          <div className="relative mx-auto h-[210px] w-full max-w-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {data.map((d, i) => (
                    <Cell key={d.name} fill={d.name === "Lainnya" ? "#C7CEDD" : PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${fmtNum(value)}${unit}`}
                  contentStyle={{ borderRadius: 10, border: "1px solid #E4E8F6", fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold text-[#17254B]">{fmtCompact(total)}</span>
              <span className="mt-0.5 max-w-[120px] text-center text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#8B95B5]">
                {groups.measureLabel}
              </span>
            </div>
          </div>

          <ul className="mt-1 space-y-1.5">
            {data.map((d, i) => (
              <li key={d.name} className="flex items-center gap-2 text-[11.5px]">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: d.name === "Lainnya" ? "#C7CEDD" : PALETTE[i % PALETTE.length] }}
                />
                <span className="min-w-0 flex-1 truncate text-[#495266]" title={d.name}>
                  {d.name}
                </span>
                <span className="shrink-0 font-bold text-[#17254B]">
                  {total ? Math.round((d.value / total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Tidak ada data untuk ditampilkan.</p>
      )}
    </Panel>
  );
}