import React, { useState } from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";
import {
  distributionStats,
  effectLabel,
  fmtP,
  groupSeries,
  ksTest,
  mannWhitneyTest,
  welchTTest,
} from "@/lib/statistics";
import TestSelect from "./TestSelect";
import SigBadge from "./SigBadge";
import MiniStat from "./MiniStat";
import InterpretationBox from "./InterpretationBox";
import BoxPlotChart from "./BoxPlotChart";

export default function MeanTestPanel({ analysis }) {
  const dims = analysis.profiles.filter((p) => !p.numeric && p.unique > 1 && p.unique <= 40);
  const numeric = analysis.numeric;
  const [measureKey, setMeasureKey] = useState(analysis.measure?.key || numeric[0]?.key || "");
  const [dimKey, setDimKey] = useState(analysis.dim?.key || dims[0]?.key || "");
  const [aName, setAName] = useState("");
  const [bName, setBName] = useState("");

  const series = dimKey && measureKey ? groupSeries(analysis.dataset, dimKey, measureKey, 30) : [];

  if (!numeric.length || series.length < 2) {
    return (
      <Panel title="Uji Beda Rata-rata" sub="uji-t Welch & Mann-Whitney">
        <p className="py-12 text-center text-sm text-[#7B8794]">
          Dibutuhkan minimal dua grup berisi nilai numerik untuk menguji perbedaan rata-rata.
        </p>
      </Panel>
    );
  }

  const measureCol = numeric.find((p) => p.key === measureKey);
  const dimCol = analysis.profiles.find((p) => p.key === dimKey);
  const unit = measureCol?.unit ? ` ${measureCol.unit}` : "";

  const a = series.find((g) => g.name === aName) || series[0];
  const b = series.find((g) => g.name === bName && g.name !== a.name) || series.find((g) => g.name !== a.name);

  const t = welchTTest(a.values, b.values);
  const mw = mannWhitneyTest(a.values, b.values);
  const ksA = ksTest(a.values);
  const ksB = ksTest(b.values);
  const bothNormal = ksA && ksB ? ksA.p > 0.05 && ksB.p > 0.05 : null;

  const boxes = [a, b]
    .map((g) => ({ name: g.name, stats: distributionStats(g.values) }))
    .filter((x) => x.stats);

  const tSig = t ? t.p <= 0.05 : null;
  const mwSig = mw ? mw.p <= 0.05 : null;
  const agreed = tSig !== null && mwSig !== null && tSig === mwSig;

  return (
    <Panel
      title="Uji Beda Rata-rata"
      sub={`${measureCol.label} · ${a.name} vs ${b.name}`}
      bodyClassName="pt-4"
      right={
        <SigBadge tone={tSig ? "ok" : tSig === false ? "warn" : "info"}>
          {tSig ? "Selisih signifikan" : tSig === false ? "Tidak signifikan" : "Belum diuji"}
        </SigBadge>
      }
    >
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
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
        <TestSelect
          label="Grup 1"
          value={a.name}
          onChange={setAName}
          options={series.map((g) => ({ value: g.name, label: `${g.name} (n=${g.values.length})` }))}
        />
        <TestSelect
          label="Grup 2"
          value={b.name}
          onChange={setBName}
          options={series
            .filter((g) => g.name !== a.name)
            .map((g) => ({ value: g.name, label: `${g.name} (n=${g.values.length})` }))}
        />
      </div>

      <div className="mt-2">
        <BoxPlotChart items={boxes} unit={unit} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat label={`Rata-rata ${a.name}`} value={`${fmtNum(t ? t.meanA : NaN)}${unit}`} hint={`SD ${fmtNum(t ? t.sdA : NaN)}`} />
        <MiniStat label={`Rata-rata ${b.name}`} value={`${fmtNum(t ? t.meanB : NaN)}${unit}`} hint={`SD ${fmtNum(t ? t.sdB : NaN)}`} />
        <MiniStat label="Selisih" value={`${fmtNum(t ? t.diff : NaN)}${unit}`} />
        <MiniStat label="Cohen's d" value={t ? fmtNum(t.d) : "–"} hint={t ? `efek ${effectLabel(t.d)}` : ""} />
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[500px] text-[11px]">
          <thead>
            <tr className="border-b border-[#E9E6FB] text-left text-[9px] uppercase tracking-[0.05em] text-[#8B87A8]">
              <th className="py-1.5 pr-2 font-bold">Uji</th>
              <th className="py-1.5 pr-2 text-right font-bold">Statistik</th>
              <th className="py-1.5 pr-2 text-right font-bold">p-value</th>
              <th className="py-1.5 font-bold">Keputusan (α = 5%)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#F2F0FC] text-[#3F3D56]">
              <td className="py-1.5 pr-2 font-semibold text-[#1E1B4B]">Uji-t Welch</td>
              <td className="py-1.5 pr-2 text-right">
                t = {t ? fmtNum(t.t, 3) : "–"} (df {t ? fmtNum(t.df, 1) : "–"})
              </td>
              <td className="py-1.5 pr-2 text-right">{t ? fmtP(t.p) : "–"}</td>
              <td className="py-1.5 font-semibold">
                <span className={tSig ? "text-[#15803D]" : "text-[#B45309]"}>
                  {tSig ? "Berbeda signifikan" : "Tidak berbeda signifikan"}
                </span>
              </td>
            </tr>
            <tr className="border-b border-[#F2F0FC] text-[#3F3D56]">
              <td className="py-1.5 pr-2 font-semibold text-[#1E1B4B]">Mann-Whitney U</td>
              <td className="py-1.5 pr-2 text-right">
                U = {mw ? fmtNum(mw.u, 1) : "–"} (z {mw ? fmtNum(mw.z, 2) : "–"})
              </td>
              <td className="py-1.5 pr-2 text-right">{mw ? fmtP(mw.p) : "–"}</td>
              <td className="py-1.5 font-semibold">
                <span className={mwSig ? "text-[#15803D]" : "text-[#B45309]"}>
                  {mwSig ? "Berbeda signifikan" : "Tidak berbeda signifikan"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <InterpretationBox title="Interpretasi uji beda">
        <p>
          Rata-rata {measureCol.label} {a.name} {fmtNum(t ? t.meanA : NaN)}
          {unit} dibanding {b.name} {fmtNum(t ? t.meanB : NaN)}
          {unit}, selisih {fmtNum(t ? t.diff : NaN)}
          {unit}. Uji-t Welch memberi t = {t ? fmtNum(t.t, 3) : "–"} dengan p = {t ? fmtP(t.p) : "–"}, sehingga pada α =
          5% kedua rata-rata{" "}
          {tSig ? "berbeda signifikan secara statistik." : "tidak berbeda signifikan secara statistik."}
        </p>
        <p>
          Pemeriksaan normalitas: {a.name} p = {ksA ? fmtP(ksA.p) : "–"} dan {b.name} p = {ksB ? fmtP(ksB.p) : "–"}.{" "}
          {bothNormal === null
            ? "Jumlah data salah satu grup terlalu kecil untuk dinilai normalitasnya, sehingga Mann-Whitney sebaiknya dijadikan pembanding utama."
            : bothNormal
              ? "Kedua grup memenuhi asumsi normal, jadi uji-t menjadi acuan utama."
              : "Minimal satu grup menyimpang dari normal, sehingga Mann-Whitney lebih tepat menjadi acuan."}{" "}
          Mann-Whitney memberi U = {mw ? fmtNum(mw.u, 1) : "–"} dengan p = {mw ? fmtP(mw.p) : "–"} dan rata-rata
          peringkat {mw ? `${fmtNum(mw.meanRankA, 1)} vs ${fmtNum(mw.meanRankB, 1)}` : "–"}.
        </p>
        <p>
          Ukuran efek Cohen&apos;s d = {t ? fmtNum(t.d) : "–"} ({t ? effectLabel(t.d) : "–"});{" "}
          {t && Math.abs(t.d) >= 0.5
            ? "perbedaan ini juga bermakna secara praktis, bukan hanya signifikan."
            : "meski signifikan, besar perbedaannya relatif kecil secara praktis."}{" "}
          {agreed
            ? "Kedua uji memberi kesimpulan yang sejalan sehingga hasilnya relatif kokoh."
            : "Kedua uji tidak sepenuhnya sejalan, jadi kesimpulan perlu dibaca dengan mempertimbangkan asumsi normalitas."}
        </p>
      </InterpretationBox>
    </Panel>
  );
}