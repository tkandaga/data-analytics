import React from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";
import { strengthOf } from "@/lib/interpretative";

export default function RelationshipScatter({ analysis }) {
  const { points, correlation, measure, secondary } = analysis;

  return (
    <Panel
      title="Analisis Hubungan"
      sub={secondary ? `${measure?.label} vs ${secondary.label}` : "butuh dua kolom numerik"}
      bodyClassName="pt-3"
    >
      {points.length ? (
        <>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={points} margin={{ top: 10, right: 14, bottom: 22, left: 0 }}>
                <CartesianGrid stroke="#EEF0FB" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={["dataMin", "dataMax"]}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  tickLine={false}
                  height={38}
                  label={{
                    value: measure?.label || "",
                    position: "insideBottom",
                    offset: -6,
                    fontSize: 9.5,
                    fill: "#6B7280",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={["dataMin", "dataMax"]}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  width={42}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === "fit"
                      ? [fmtNum(value), "Garis tren"]
                      : [fmtNum(value), name === "y" ? secondary?.label || "Nilai" : name]
                  }
                  contentStyle={{ borderRadius: 10, border: "1px solid #E4E1F7", fontSize: 12 }}
                />
                <Scatter dataKey="y" fill="#8B5CF6" fillOpacity={0.72} shape="circle" isAnimationActive={false} />
                <Line dataKey="fit" type="linear" stroke="#22C55E" strokeWidth={2.4} dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 rounded-xl border border-[#E9E6FB] bg-[#F7F5FF] px-3 py-2.5 text-[11px] leading-relaxed text-[#4C4585]">
            {correlation === null
              ? "Korelasi tidak dapat dihitung karena variasi data tidak mencukupi."
              : `Koefisien korelasi r = ${fmtNum(correlation)} menunjukkan hubungan ${strengthOf(correlation)} dan ${
                  correlation >= 0 ? "searah" : "berlawanan arah"
                } antara ${measure?.label} dan ${secondary?.label}.`}
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">
          Tambahkan kolom numerik kedua untuk melihat hubungan antar variabel.
        </p>
      )}
    </Panel>
  );
}