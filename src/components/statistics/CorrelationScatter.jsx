import React from "react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { fmtNum } from "@/lib/general";

export default function CorrelationScatter({ points, fit, labels, unitX = "", unitY = "" }) {
  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 14, bottom: 16, left: 0 }}>
          <CartesianGrid stroke="#EEF0FB" />
          <XAxis
            type="number"
            dataKey="x"
            name={labels.x}
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 9.5, fill: "#6B7280" }}
            tickFormatter={(v) => fmtNum(v, 1)}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={labels.y}
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 9.5, fill: "#6B7280" }}
            tickFormatter={(v) => fmtNum(v, 1)}
            width={42}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name) => [`${fmtNum(value)}${name === labels.x ? unitX : unitY}`, name]}
            contentStyle={{ borderRadius: 10, border: "1px solid #E4E1F7", fontSize: 11.5 }}
          />
          <Scatter data={points} fill="#8B5CF6" fillOpacity={0.7} isAnimationActive={false} />
          {fit && fit.length > 1 ? (
            <Scatter
              data={fit}
              line={{ stroke: "#1E1B4B", strokeWidth: 2 }}
              fill="#1E1B4B"
              shape={() => <g />}
              isAnimationActive={false}
            />
          ) : null}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}