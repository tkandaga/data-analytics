import React from "react";
import {
  CartesianGrid,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "./Panel";
import { EPS } from "@/lib/modeling";

export default function ResidualChart({ used, xLabel }) {
  if (!used.length) {
    return (
      <Panel title="Residual dan Batas Toleransi">
        <p className="py-16 text-center text-sm text-[#7B8794]">Tidak ada titik dalam rentang fitting.</p>
      </Panel>
    );
  }

  const xs = used.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxAbs = Math.max(EPS * 1.25, ...used.map((p) => Math.abs(p.res))) * 1.15;

  const inside = used.filter((p) => Math.abs(p.res) <= EPS).map((p) => ({ x: p.x, y: p.res }));
  const outside = used.filter((p) => Math.abs(p.res) > EPS).map((p) => ({ x: p.x, y: p.res }));

  return (
    <Panel
      title="Residual dan Batas Toleransi"
      className="flex flex-1 flex-col"
      bodyClassName="flex flex-1 flex-col"
    >
      <div className="min-h-[240px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={used.map((p) => ({ x: p.x, y: p.res }))}
            margin={{ top: 8, right: 16, bottom: 4, left: 0 }}
          >
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
              domain={[-maxAbs, maxAbs]}
              width={52}
              tick={{ fontSize: 11, fill: "#7B8794" }}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <ReferenceArea y1={-EPS} y2={EPS} fill="#178D65" fillOpacity={0.12} />
            <ReferenceLine y={EPS} stroke="#178D65" strokeDasharray="4 4" />
            <ReferenceLine y={-EPS} stroke="#178D65" strokeDasharray="4 4" />
            <ReferenceLine y={0} stroke="var(--accent)" strokeWidth={1.5} />
            <Scatter data={inside} dataKey="y" fill="var(--accent)" isAnimationActive={false} />
            <Scatter data={outside} dataKey="y" fill="#C0392B" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-5 text-xs text-[#7B8794]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" /> Residu (y − ŷ)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-[2px] w-4 rounded-full bg-[#178D65]" /> ±ε
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C0392B]" /> Di luar toleransi
        </span>
      </div>
    </Panel>
  );
}