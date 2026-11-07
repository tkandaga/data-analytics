import React from "react";
import Panel from "./Panel";
import { EPS, MODELS, feasibility } from "@/lib/modeling";

export default function Interpretation({ modelId, params, stats, xLabel, yLabel }) {
  const model = MODELS[modelId];
  const f = feasibility(stats.r2);

  return (
    <Panel title="Interpretasi" tone="accent">
      <div className="space-y-3 text-sm leading-relaxed text-[#17254B]">
        <p>
          Model <span className="font-semibold text-[var(--accent)]">{model.name}</span> diterapkan pada hubungan
          antara <span className="font-semibold text-[var(--accent)]">{xLabel}</span> (x) dan{" "}
          <span className="font-semibold text-[var(--accent)]">{yLabel}</span> (y). Sebanyak {stats.n} pengamatan
          berada di dalam rentang fitting.
        </p>

        <p
          className="inline-block rounded-lg border border-[#F5E2B5] bg-[#FFF8E9] px-3.5 py-2.5 font-serif text-[15px] text-[#17254B]"
          dangerouslySetInnerHTML={{ __html: model.eq(params) }}
        />

        <p>
          Kesesuaian model ditunjukkan oleh R² ={" "}
          <span className="font-semibold text-[var(--accent)]">{stats.n ? stats.r2.toFixed(3) : "–"}</span> dengan
          RMSE = <span className="font-semibold text-[var(--accent)]">{stats.n ? stats.rmse.toFixed(3) : "–"}</span>{" "}
          satuan. Sebanyak <span className="font-semibold text-[var(--accent)]">{stats.tolPct.toFixed(0)}%</span>{" "}
          residual berada dalam toleransi ±{EPS.toFixed(1)}, sehingga kelayakan model tergolong{" "}
          <span className="font-semibold text-[var(--accent)]">{f.text}</span>.
        </p>

        <p className="text-xs text-[#7B8794]">
          Nilai prediksi dihitung dari parameter model aktif. Pada mode Manual, parameter diatur melalui slider; pada
          mode Best Fit, parameter diestimasi dengan meminimalkan jumlah kuadrat residual pada rentang data yang dipilih.
        </p>
      </div>
    </Panel>
  );
}