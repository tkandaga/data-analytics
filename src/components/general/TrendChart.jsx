import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "@/components/dashboard/Panel";
import { AGGREGATIONS, fmtCompact, fmtNum } from "@/lib/general";

export default function TrendChart({ groups, chartType, agg, onAggChange }) {
  const data = groups.rows.slice(0, 24);
  const angled = data.length > 8;
  const Chart = chartType === "bar" ? BarChart : chartType === "area" ? AreaChart : LineChart;
  const unit = groups.unit ? ` ${groups.unit}` : "";

  return (
    <Panel
      title={`Tren ${groups.measureLabel || "Data"}`}
      sub={`per ${groups.dimLabel}`}
      right={
        <div className="flex flex-wrap gap-1 rounded-lg border border-white/20 bg-white/10 p-1">
          {AGGREGATIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => onAggChange(a.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                groups.agg === a.id
                  ? "bg-[var(--accent-soft)] text-[var(--accent-ink)] shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      }
      bodyClassName="pt-3"
    >
      {data.length ? (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={data} margin={{ top: 8, right: 12, bottom: angled ? 16 : 4, left: 0 }}>
              <CartesianGrid stroke="#EDF1FB" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#7B8794" }}
                interval={0}
                angle={angled ? -25 : 0}
                textAnchor={angled ? "end" : "middle"}
                height={angled ? 62 : 30}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmtCompact}
                tick={{ fontSize: 11, fill: "#7B8794" }}
                width={58}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => `${fmtNum(value)}${unit}`}
                contentStyle={{ borderRadius: 10, border: "1px solid #E4E8F6", fontSize: 12 }}
              />
              {chartType === "bar" ? (
                <Bar dataKey="value" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive={false} />
              ) : chartType === "area" ? (
                <Area
                  dataKey="value"
                  type="monotone"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  fill="var(--accent)"
                  fillOpacity={0.18}
                  isAnimationActive={false}
                />
              ) : (
                <Line
                  dataKey="value"
                  type="monotone"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: "var(--accent)", strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Tidak ada data untuk ditampilkan.</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[#7B8794]">
        <span>{groups.groupCount} kategori</span>
        <span>·</span>
        <span>
          Total {fmtNum(groups.total)}
          {unit}
        </span>
        {groups.binned ? (
          <>
            <span>·</span>
            <span>kolom numerik dikelompokkan per rentang</span>
          </>
        ) : null}
      </div>
    </Panel>
  );
}