import React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtNum } from "@/lib/general";
import { mean, normalPdf, stdDev } from "@/lib/statistics";

export default function NormalityChart({ values, bins = 10 }) {
  const v = values.filter((n) => Number.isFinite(n));
  if (v.length < 3) return null;

  const min = Math.min(...v);
  const max = Math.max(...v);
  const span = max - min || 1;
  const step = span / bins;
  const counts = Array.from({ length: bins }, () => 0);
  v.forEach((x) => {
    const i = Math.min(bins - 1, Math.max(0, Math.floor((x - min) / step)));
    counts[i] += 1;
  });

  const m = mean(v);
  const s = stdDev(v);
  const data = counts.map((count, i) => {
    const mid = min + i * step + step / 2;
    return {
      name: fmtNum(min + i * step, 1),
      count,
      normal: s ? v.length * step * normalPdf((mid - m) / s) : 0,
    };
  });

  return (
    <div className="h-[268px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 10, bottom: 30, left: 0 }}>
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
          <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} width={34} tickLine={false} />
          <Tooltip
            formatter={(value, name) => [fmtNum(value), name === "count" ? "Frekuensi" : "Harapan normal"]}
            contentStyle={{ borderRadius: 10, border: "1px solid #E4E1F7", fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 10.5, paddingTop: 4 }} />
          <Bar
            dataKey="count"
            name="Frekuensi"
            fill="#8B5CF6"
            fillOpacity={0.32}
            stroke="#8B5CF6"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="normal"
            name="Kurva normal"
            stroke="#1E1B4B"
            strokeWidth={2.2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}