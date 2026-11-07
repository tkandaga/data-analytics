import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ErrorBar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";
import { fmtP, groupSeries, leveneTest, mean, stdDev } from "@/lib/statistics";
import TestSelect from "./TestSelect";
import SigBadge from "./SigBadge";
import MiniStat from "./MiniStat";
import InterpretationBox from "./InterpretationBox";

export default function GroupComparisonPanel({ analysis }) {
  const dims = analysis.profiles.filter((p) => !p.numeric && p.unique > 1 && p.unique <= 40);
  const numeric = analysis.numeric;
  const [dimKey, setDimKey] = useState(analysis.dim?.key || dims[0]?.key || "");
  const [measureKey, setMeasureKey] = useState(analysis.measure?.key || numeric[0]?.key || "");

  const series = dimKey && measureKey ? groupSeries(analysis.dataset, dimKey, measureKey, 10) : [];

  if (!numeric.length || series.length < 2) {
    return (
      <Panel title="Perbandingan Kelompok" sub="rata-rata dan sebaran antar grup">
        <p className="py-12 text-center text-sm text-[#7B8794]">
          Dibutuhkan minimal satu kolom numerik dan satu kolom kategori dengan dua grup atau lebih.
        </p>
      </Panel>
    );
  }

  const measureCol = numeric.find((p) => p.key === measureKey);
  const dimCol = analysis.profiles.find((p) => p.key === dimKey);
  const unit = measureCol?.unit ? ` ${measureCol.unit}` : "";

  const rows = series
    .map((g) => ({
      name: g.name,
      n: g.values.length,
      mean: mean(g.values),
      sd: Number.isFinite(stdDev(g.values)) ? stdDev(g.values) : 0,
      min: Math.min(...g.values),
      max: Math.max(...g.values),
    }))
    .sort((a, b) => b.mean - a.mean);

  const top = rows[0];
  const bottom = rows[rows.length - 1];
  const levene = leveneTest(series);
  const sds = rows.map((r) => r.sd).filter((s) => Number.isFinite(s));

  return (
    <Panel title="Perbandingan Kelompok" sub={`rata-rata ${measureCol.label} per ${dimCol?.label}`} bodyClassName="pt-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <TestSelect
          label="Kolom ukuran"
          value={measureCol.key}
          onChange={setMeasureKey}
          options={numeric.map((p) => ({ value: p.key, label: p.label }))}
        />
        <TestSelect
          label="Kolom grup"
          value={dimCol?.key || ""}
          onChange={setDimKey}
          options={(dims.length ? dims : analysis.profiles).map((p) => ({ value: p.key, label: p.label }))}
        />
      </div>

      <div className="mt-3 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 10, bottom: 28, left: 0 }}>
            <CartesianGrid stroke="#EEF0FB" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9.5, fill: "#6B7280" }}
              interval={0}
              angle={-26}
              textAnchor="end"
              height={56}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} width={38} tickLine={false} />
            <Tooltip
              formatter={(value, name) => [`${fmtNum(value)}${unit}`, name === "mean" ? "Rata-rata" : "Simpangan baku"]}
              contentStyle={{ borderRadius: 10, border: "1px solid #E4E1F7", fontSize: 11.5 }}
            />
            <Bar dataKey="mean" name="Rata-rata" fill="#8B5CF6" radius={[5, 5, 0, 0]} maxBarSize={46} isAnimationActive={false}>
              <ErrorBar dataKey="sd" name="SD" width={4} strokeWidth={1.3} stroke="#1E1B4B" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[10px] text-[#8B87A8]">
        Batang = rata-rata grup, garis galat = ±1 simpangan baku (sebaran di dalam grup).
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat label="Grup" value={rows.length} />
        <MiniStat label="Rata-rata tertinggi" value={`${fmtNum(top.mean)}${unit}`} hint={top.name} />
        <MiniStat label="Selisih" value={`${fmtNum(top.mean - bottom.mean)}${unit}`} hint={`${top.name} vs ${bottom.name}`} />
        <MiniStat label="Levene p" value={levene ? fmtP(levene.p) : "–"} hint={levene && levene.p > 0.05 ? "varians homogen" : "varians berbeda"} />
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[430px] text-[11px]">
          <thead>
            <tr className="border-b border-[#E9E6FB] text-left text-[9.5px] uppercase tracking-[0.06em] text-[#8B87A8]">
              <th className="py-1.5 pr-2 font-bold">Grup</th>
              <th className="py-1.5 pr-2 text-right font-bold">n</th>
              <th className="py-1.5 pr-2 text-right font-bold">Rata-rata</th>
              <th className="py-1.5 pr-2 text-right font-bold">SD</th>
              <th className="py-1.5 text-right font-bold">Rentang</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-[#F2F0FC] text-[#3F3D56]">
                <td className="py-1.5 pr-2 font-semibold text-[#1E1B4B]">{r.name}</td>
                <td className="py-1.5 pr-2 text-right">{r.n}</td>
                <td className="py-1.5 pr-2 text-right font-bold">{fmtNum(r.mean)}</td>
                <td className="py-1.5 pr-2 text-right">{fmtNum(r.sd)}</td>
                <td className="py-1.5 text-right">
                  {fmtNum(r.min)} – {fmtNum(r.max)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InterpretationBox title="Interpretasi perbandingan grup">
        <p>
          Rata-rata {measureCol.label} tertinggi pada grup{" "}
          <strong className="font-bold text-[#1E1B4B]">{top.name}</strong> ({fmtNum(top.mean)}
          {unit}; n = {top.n}) dan terendah pada <strong className="font-bold text-[#1E1B4B]">{bottom.name}</strong> (
          {fmtNum(bottom.mean)}
          {unit}; n = {bottom.n}), dengan selisih {fmtNum(top.mean - bottom.mean)}
          {unit}.
        </p>
        <p>
          Simpangan baku antar grup berkisar {fmtNum(Math.min(...sds))}–{fmtNum(Math.max(...sds))}
          {unit}.{" "}
          {Math.min(...sds) > Math.abs(top.mean - bottom.mean)
            ? "Karena sebaran di dalam grup lebih besar daripada selisih antar grup, garis galat saling tumpang tindih dan perbedaan rata-rata kemungkinan tidak signifikan."
            : "Sebaran di dalam grup lebih kecil daripada selisih antar grup, sehingga perbedaan rata-rata berpotensi signifikan."}
        </p>
        <p>
          Uji Levene atas {rows.length} grup memberi W = {levene ? fmtNum(levene.W, 3) : "–"} dan p ={" "}
          {levene ? fmtP(levene.p) : "–"}:{" "}
          {levene && levene.p > 0.05
            ? "varians antar grup homogen, sehingga asumsi kesamaan varians terpenuhi."
            : "varians antar grup tidak homogen, sehingga gunakan koreksi Welch atau uji non-parametrik."}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <SigBadge tone={levene && levene.p > 0.05 ? "ok" : "warn"}>
            {levene && levene.p > 0.05 ? "Varians homogen" : "Varians tidak homogen"}
          </SigBadge>
          <span className="text-[10.5px] text-[#6B7280]">
            Signifikansi selisih rata-rata diuji pada panel Uji Beda Rata-rata.
          </span>
        </div>
      </InterpretationBox>
    </Panel>
  );
}