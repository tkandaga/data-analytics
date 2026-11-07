import React from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "./Panel";
import { curvePoints } from "@/lib/modeling";

export default function ModelChart({ points, modelId, params, bounds, xLabel, yLabel }) {
  const valid = points.filter((p) => p.valid);

  if (!valid.length) {
    return (
      <Panel title="Grafik Data dan Model Matematis">
        <p className="py-16 text-center text-sm text-[#7B8794]">
          Belum ada data — unggah CSV atau tambahkan baris pada tabel.
        </p>
      </Panel>
    );
  }

  const xs = valid.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs) || minX + 1;
  const curve = curvePoints(modelId, params, minX, maxX === minX ? minX + 1 : maxX, 160);
  const ys = [...valid.map((p) => p.y), ...curve.map((c) => c.y), 0];
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const pad = (hi - lo) * 0.1 || 1;

  return (
    <Panel title="Grafik Data dan Model Matematis">
      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={curve} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="#EDF1FB" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[minX, maxX === minX ? minX + 1 : maxX]}
              tick={{ fontSize: 11, fill: "#7B8794" }}
              tickFormatter={(v) => String(Math.round(v * 10) / 10)}
              label={{ value: xLabel, position: "insideBottom", offset: -2, fontSize: 11, fill: "#7B8794" }}
            />
            <YAxis
              type="number"
              domain={[lo - pad, hi + pad]}
              width={52}
              tick={{ fontSize: 11, fill: "#7B8794" }}
              tickFormatter={(v) => (Math.abs(v) < 10 ? v.toFixed(1) : v.toFixed(0))}
              label={{ value: yLabel, angle: -90, position: "insideLeft", fontSize: 11, fill: "#7B8794" }}
            />
            <ReferenceArea x1={bounds.min} x2={bounds.max} fill="var(--accent)" fillOpacity={0.07} />
            <Scatter
              data={valid.map((p) => ({ x: p.x, y: p.y }))}
              dataKey="y"
              fill="#ffffff"
              stroke="#22304a"
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Line
              data={curve}
              dataKey="y"
              type="monotone"
              stroke="var(--accent)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-5 text-xs text-[#7B8794]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-[#22304a] bg-white" /> Data pengamatan
        </span>
        <span className="flex items-center gap-2">
          <span className="h-[3px] w-4 rounded-full bg-[var(--accent)]" /> Kurva model
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-4 rounded-[2px] border border-dashed border-[var(--accent)] bg-[var(--accent-soft)]" />
          Rentang fitting
        </span>
      </div>
    </Panel>
  );
}