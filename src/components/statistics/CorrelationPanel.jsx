import React, { useState } from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum, toNumber } from "@/lib/general";
import { linearFit } from "@/lib/interpretative";
import {
  correlationMatrix,
  fmtP,
  pearsonTest,
  spearmanTest,
  strengthLabel,
} from "@/lib/statistics";
import TestSelect from "./TestSelect";
import MiniStat from "./MiniStat";
import InterpretationBox from "./InterpretationBox";
import CorrelationMatrix from "./CorrelationMatrix";
import CorrelationScatter from "./CorrelationScatter";

const METHODS = [
  { id: "pearson", label: "Pearson" },
  { id: "spearman", label: "Spearman" },
];

export default function CorrelationPanel({ analysis }) {
  const numeric = analysis.numeric.slice(0, 8);
  const [method, setMethod] = useState("pearson");
  const [xKey, setXKey] = useState(analysis.measure?.key || numeric[0]?.key || "");
  const [yKey, setYKey] = useState(numeric.find((p) => p.key !== analysis.measure?.key)?.key || "");

  if (numeric.length < 2) {
    return (
      <Panel title="Korelasi" sub="nilai koefisien dan hubungan antar variabel">
        <p className="py-12 text-center text-sm text-[#7B8794]">
          Dibutuhkan minimal dua kolom numerik untuk menghitung korelasi.
        </p>
      </Panel>
    );
  }

  const xCol = numeric.find((p) => p.key === xKey) || numeric[0];
  const yCol = numeric.find((p) => p.key === yKey && p.key !== xCol.key) || numeric.find((p) => p.key !== xCol.key);

  const { cols, cells } = correlationMatrix(analysis.dataset, numeric, method);

  const pairs = analysis.dataset.rows
    .map((row) => ({ x: toNumber(row[xCol.key]), y: toNumber(row[yCol.key]) }))
    .filter((p) => p.x !== null && p.y !== null);
  const xs = pairs.map((p) => p.x);
  const ys = pairs.map((p) => p.y);

  const pearson = pearsonTest(xs, ys);
  const spearman = spearmanTest(xs, ys);
  const active = method === "spearman" ? spearman : pearson;
  const r = active ? (method === "spearman" ? active.rho : active.r) : NaN;

  const fit = linearFit(xs, ys);
  const points = pairs.length ? pairs.slice(0, 300).sort((a, b) => a.x - b.x) : [];
  const fitLine =
    fit && xs.length
      ? [
          { x: Math.min(...xs), y: fit.intercept + fit.slope * Math.min(...xs) },
          { x: Math.max(...xs), y: fit.intercept + fit.slope * Math.max(...xs) },
        ]
      : [];

  const unitX = xCol.unit ? ` ${xCol.unit}` : "";
  const unitY = yCol.unit ? ` ${yCol.unit}` : "";

  return (
    <Panel
      title="Korelasi"
      sub={`${xCol.label} × ${yCol.label}`}
      bodyClassName="pt-4"
      right={
        <div className="flex gap-1 rounded-lg border border-white/20 bg-white/10 p-1">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`rounded-md px-2.5 py-1 text-[10.5px] font-bold transition ${
                method === m.id
                  ? "bg-[var(--accent-soft)] text-[var(--accent-ink)]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid items-start gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8B87A8]">
            Matriks korelasi {method === "spearman" ? "Spearman (ρ)" : "Pearson (r)"}
          </div>
          <div className="mt-1.5">
            <CorrelationMatrix cols={cols} cells={cells} onPick={(a, b) => { setXKey(a); setYKey(b); }} />
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-[#8B87A8]">
            Ungu = hubungan positif, kuning = hubungan negatif; makin pekat makin kuat. Klik sel untuk melihat sebaran
            pasangan variabel tersebut.
          </p>
        </div>

        <div className="min-w-0 xl:col-span-6">
          <div className="grid gap-2 sm:grid-cols-2">
            <TestSelect
              label="Variabel X"
              value={xCol.key}
              onChange={setXKey}
              options={numeric.map((p) => ({ value: p.key, label: p.label }))}
            />
            <TestSelect
              label="Variabel Y"
              value={yCol.key}
              onChange={setYKey}
              options={numeric.filter((p) => p.key !== xCol.key).map((p) => ({ value: p.key, label: p.label }))}
            />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat label={method === "spearman" ? "ρ" : "r"} value={fmtNum(r, 3)} />
            <MiniStat label="p-value" value={active ? fmtP(active.p) : "–"} />
            <MiniStat label="n" value={active ? active.n : pairs.length} />
            <MiniStat label="R²" value={Number.isFinite(r) ? fmtNum(r * r, 3) : "–"} />
          </div>
          <div className="mt-2">
            <CorrelationScatter
              points={points}
              fit={fitLine}
              labels={{ x: xCol.label, y: yCol.label }}
              unitX={unitX}
              unitY={unitY}
            />
          </div>
        </div>
      </div>

      <InterpretationBox title="Interpretasi korelasi">
        <p>
          Koefisien korelasi {method === "spearman" ? "Spearman" : "Pearson"} antara{" "}
          <strong className="font-bold text-[#1E1B4B]">{xCol.label}</strong> dan{" "}
          <strong className="font-bold text-[#1E1B4B]">{yCol.label}</strong> sebesar {fmtNum(r, 3)} (
          {strengthLabel(r)}, {r >= 0 ? "searah" : "berlawanan arah"}) dengan p = {active ? fmtP(active.p) : "–"} pada{" "}
          {active ? active.n : pairs.length} pasangan data.
        </p>
        <p>
          {active && active.p <= 0.05
            ? "Karena p ≤ 0,05, hubungan ini signifikan secara statistik: perubahan pada satu variabel diikuti perubahan sistematis pada variabel lain."
            : "Karena p > 0,05, hubungan ini belum signifikan secara statistik dan dapat muncul karena kebetulan sampel."}{" "}
          Nilai R² = {Number.isFinite(r) ? fmtNum(r * r, 3) : "–"} berarti sekitar{" "}
          {Number.isFinite(r) ? fmtNum(r * r * 100, 1) : "–"}% variasi {yCol.label} berbagi variasi dengan{" "}
          {xCol.label}.
        </p>
        <p>
          Korelasi Pearson {pearson ? fmtNum(pearson.r, 3) : "–"} dan Spearman {spearman ? fmtNum(spearman.rho, 3) : "–"}
          {pearson && spearman && Math.abs(pearson.r - spearman.rho) > 0.2
            ? " berbeda cukup jauh, menandakan ada pengaruh pencilan atau hubungan yang tidak linear."
            : " saling mendukung, sehingga arah hubungan relatif konsisten."}
        </p>
        <p className="font-semibold text-[#4C1D95]">
          Implikasi: korelasi menunjukkan keeratan hubungan, bukan sebab-akibat. Gunakan hasil ini sebagai dasar pemodelan
          lanjutan, bukan klaim kausalitas.
        </p>
      </InterpretationBox>
    </Panel>
  );
}