import React, { useState } from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";
import { distributionStats, fmtP, groupSeries, jarqueBera, ksTest } from "@/lib/statistics";
import TestSelect from "./TestSelect";
import SigBadge from "./SigBadge";
import MiniStat from "./MiniStat";
import InterpretationBox from "./InterpretationBox";
import NormalityChart from "./NormalityChart";
import BoxPlotChart from "./BoxPlotChart";

const VIEWS = [
  { id: "hist", label: "Histogram" },
  { id: "box", label: "Boxplot" },
];

export default function NormalityPanel({ analysis }) {
  const numeric = analysis.numeric;
  const [key, setKey] = useState(analysis.measure?.key || numeric[0]?.key || "");
  const [view, setView] = useState("hist");

  if (!numeric.length) {
    return (
      <Panel title="Uji Normalitas" sub="Kolmogorov-Smirnov & Jarque-Bera">
        <p className="py-12 text-center text-sm text-[#7B8794]">
          Dataset belum memiliki kolom numerik yang dapat diuji.
        </p>
      </Panel>
    );
  }

  const column = numeric.find((p) => p.key === key) || numeric[0];
  const values = column.values;
  const dist = distributionStats(values);
  const ks = ksTest(values);
  const jb = jarqueBera(values);
  const normal = ks ? ks.p > 0.05 : null;
  const unit = column.unit ? ` ${column.unit}` : "";

  const boxes = !analysis.dim
    ? dist
      ? [{ name: column.label, stats: dist }]
      : []
    : groupSeries(analysis.dataset, analysis.dim.key, column.key, 6)
        .map((g) => ({ name: g.name, stats: distributionStats(g.values) }))
        .filter((b) => b.stats);

  return (
    <Panel
      title="Uji Normalitas"
      sub={`${column.label} · Kolmogorov-Smirnov`}
      bodyClassName="pt-4"
      right={
        <div className="flex gap-1 rounded-lg border border-white/20 bg-white/10 p-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`rounded-md px-2.5 py-1 text-[10.5px] font-bold transition ${
                view === v.id
                  ? "bg-[var(--accent-soft)] text-[var(--accent-ink)]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[190px] flex-1">
          <TestSelect
            label="Kolom yang diuji"
            value={column.key}
            onChange={setKey}
            options={numeric.map((p) => ({ value: p.key, label: p.unit ? `${p.label} (${p.unit})` : p.label }))}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 pb-0.5">
          <SigBadge tone={normal ? "ok" : normal === false ? "warn" : "info"}>
            {normal ? "Berdistribusi normal" : normal === false ? "Tidak normal" : "Data belum cukup"}
          </SigBadge>
          <span className="text-[10.5px] text-[#6B7280]">
            α = 5% · D kritis ≈ {ks ? fmtNum(ks.critical, 3) : "–"}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat label="n" value={ks ? ks.n : values.length} />
        <MiniStat label="Statistik D" value={ks ? fmtNum(ks.d, 3) : "–"} />
        <MiniStat label="p-value" value={ks ? fmtP(ks.p) : "–"} />
        <MiniStat label="Jarque-Bera p" value={jb ? fmtP(jb.p) : "–"} />
      </div>

      <div className="mt-3">
        {view === "hist" ? <NormalityChart values={values} /> : <BoxPlotChart items={boxes} unit={unit} />}
      </div>

      <p className="mt-1 text-[10px] text-[#8B87A8]">
        {view === "hist"
          ? "Batang ungu = frekuensi pengamatan; garis navy = kurva normal dengan rata-rata dan simpangan baku data."
          : `Setiap kotak memuat Q1–Q3 dan median; garis putus sumbu menunjukkan sebaran wajar, titik kuning adalah pencilan.${analysis.dim ? ` Dikelompokkan menurut ${analysis.dim.label}.` : ""}`}
      </p>

      <InterpretationBox title="Interpretasi uji normalitas">
        <p>
          Uji Kolmogorov-Smirnov atas <strong className="font-bold text-[#1E1B4B]">{column.label}</strong> (
          {ks ? ks.n : values.length} data) menghasilkan D = {ks ? fmtNum(ks.d, 3) : "–"} dengan p ={" "}
          {ks ? fmtP(ks.p) : "–"}. Pada α = 5%,{" "}
          {normal
            ? "nilai p lebih besar dari 0,05 sehingga tidak ada bukti cukup untuk menolak asumsi normal — sebaran data dianggap normal."
            : normal === false
              ? "nilai p lebih kecil dari 0,05 sehingga asumsi normalitas ditolak — sebaran data menyimpang dari kurva normal."
              : "jumlah data terlalu sedikit untuk menyimpulkan bentuk sebaran."}
        </p>
        <p>
          Kemiringan {dist ? fmtNum(dist.skew) : "–"} dan keruncingan {dist ? fmtNum(dist.kurt) : "–"} menunjukkan bentuk
          sebaran {dist && Math.abs(dist.skew) < 0.5 ? "relatif simetris" : "cenderung menceng"}. Uji Jarque-Bera
          sebagai pembanding memberi p = {jb ? fmtP(jb.p) : "–"},{" "}
          {jb ? (jb.p > 0.05 ? "yang sejalan dengan kesimpulan normal." : "yang juga menandakan penyimpangan dari normal.") : "belum dapat dihitung karena data terlalu sedikit."}
        </p>
        <p>
          Rata-rata {dist ? fmtNum(dist.mean) : "–"}
          {unit} dengan median {dist ? fmtNum(dist.median) : "–"}
          {unit}; {dist && dist.outliers.length ? `${dist.outliers.length} pencilan terdeteksi dan perlu diperiksa` : "tidak ada pencilan mencolok"}.
        </p>
        <p className="font-semibold text-[#4C1D95]">
          Implikasi: analisis lanjutan sebaiknya memakai{" "}
          {normal
            ? "statistik parametrik (uji-t, ANOVA, korelasi Pearson)."
            : "statistik non-parametrik (Mann-Whitney, Kruskal-Wallis, korelasi Spearman) atau transformasi data."}
        </p>
      </InterpretationBox>
    </Panel>
  );
}