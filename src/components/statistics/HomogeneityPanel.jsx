import React, { useState } from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";
import { bartlettTest, distributionStats, fmtP, groupSeries, leveneTest, variance } from "@/lib/statistics";
import TestSelect from "./TestSelect";
import SigBadge from "./SigBadge";
import MiniStat from "./MiniStat";
import InterpretationBox from "./InterpretationBox";
import BoxPlotChart from "./BoxPlotChart";

export default function HomogeneityPanel({ analysis }) {
  const dims = analysis.profiles.filter((p) => !p.numeric && p.unique > 1 && p.unique <= 40);
  const numeric = analysis.numeric;
  const [dimKey, setDimKey] = useState(analysis.dim?.key || dims[0]?.key || "");
  const [measureKey, setMeasureKey] = useState(analysis.measure?.key || numeric[0]?.key || "");

  const series = dimKey && measureKey ? groupSeries(analysis.dataset, dimKey, measureKey, 10) : [];

  if (series.length < 2) {
    return (
      <Panel title="Uji Homogenitas" sub="Levene & Bartlett">
        <p className="py-12 text-center text-sm text-[#7B8794]">
          Dibutuhkan minimal dua grup berisi nilai numerik untuk menguji homogenitas varians.
        </p>
      </Panel>
    );
  }

  const measureCol = numeric.find((p) => p.key === measureKey);
  const dimCol = analysis.profiles.find((p) => p.key === dimKey);
  const unit = measureCol?.unit ? ` ${measureCol.unit}` : "";

  const levene = leveneTest(series);
  const bartlett = bartlettTest(series);
  const homogeneous = levene ? levene.p > 0.05 : null;
  const boxes = series
    .map((g) => ({ name: g.name, stats: distributionStats(g.values) }))
    .filter((b) => b.stats);

  return (
    <Panel
      title="Uji Homogenitas"
      sub={`${measureCol.label} per ${dimCol?.label}`}
      bodyClassName="pt-4"
      right={
        <SigBadge tone={homogeneous ? "ok" : homogeneous === false ? "warn" : "info"}>
          {homogeneous ? "Varians homogen" : homogeneous === false ? "Tidak homogen" : "Belum diuji"}
        </SigBadge>
      }
    >
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

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat label="Grup" value={series.length} />
        <MiniStat label="Levene W" value={levene ? fmtNum(levene.W, 3) : "–"} hint={levene ? `p = ${fmtP(levene.p)}` : ""} />
        <MiniStat label="Bartlett χ²" value={bartlett ? fmtNum(bartlett.chi2, 3) : "–"} hint={bartlett ? `p = ${fmtP(bartlett.p)}` : ""} />
        <MiniStat label="Varians terbesar" value={fmtNum(Math.max(...series.map((g) => variance(g.values))))} hint="nilai varians" />
      </div>

      <div className="mt-2">
        <BoxPlotChart items={boxes} unit={unit} />
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[380px] text-[11px]">
          <thead>
            <tr className="border-b border-[#E9E6FB] text-left text-[9.5px] uppercase tracking-[0.06em] text-[#8B87A8]">
              <th className="py-1.5 pr-2 font-bold">Grup</th>
              <th className="py-1.5 pr-2 text-right font-bold">n</th>
              <th className="py-1.5 pr-2 text-right font-bold">Rata-rata</th>
              <th className="py-1.5 text-right font-bold">Varians</th>
            </tr>
          </thead>
          <tbody>
            {series.map((g) => (
              <tr key={g.name} className="border-b border-[#F2F0FC] text-[#3F3D56]">
                <td className="py-1.5 pr-2 font-semibold text-[#1E1B4B]">{g.name}</td>
                <td className="py-1.5 pr-2 text-right">{g.values.length}</td>
                <td className="py-1.5 pr-2 text-right">{fmtNum(distributionStats(g.values)?.mean)}</td>
                <td className="py-1.5 text-right">{fmtNum(variance(g.values))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InterpretationBox title="Interpretasi homogenitas">
        <p>
          Uji Levene menghasilkan W = {levene ? fmtNum(levene.W, 3) : "–"} dengan p = {levene ? fmtP(levene.p) : "–"} pada{" "}
          {levene ? `${levene.k} grup dan N = ${levene.N}` : "data ini"}. Pada α = 5%,{" "}
          {homogeneous
            ? "asumsi homogenitas varians tidak ditolak — varians antar grup dianggap sama."
            : "asumsi homogenitas varians ditolak — keragaman data berbeda nyata antar grup."}
        </p>
        <p>
          Uji Bartlett (χ² = {bartlett ? fmtNum(bartlett.chi2, 3) : "–"}; p = {bartlett ? fmtP(bartlett.p) : "–"}){" "}
          {bartlett && bartlett.p > 0.05
            ? "memberi kesimpulan sejalan, yaitu varians homogen."
            : "lebih sensitif terhadap penyimpangan normalitas, sehingga hasilnya dapat berbeda dari Levene."}{" "}
          Levene dipilih sebagai acuan utama karena lebih tahan terhadap data yang tidak normal.
        </p>
        <p className="font-semibold text-[#4C1D95]">
          Implikasi:{" "}
          {homogeneous
            ? "uji-t pooled/ANOVA klasik dapat digunakan dengan aman."
            : "gunakan uji-t Welch, ANOVA Welch, atau uji non-parametrik Mann-Whitney/Kruskal-Wallis."}
        </p>
      </InterpretationBox>
    </Panel>
  );
}