import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, GitBranch, Layers, ListOrdered, Sigma } from "lucide-react";

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#B8C5E8]">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
          <Icon className="h-3 w-3" />
        </span>
        {label}
      </div>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-[9px] border border-[#3A4880] bg-[#26325F] px-2.5 py-2 text-xs font-semibold text-white outline-none focus:border-[var(--accent)]";

const CHART_TYPES = [
  { id: "line", label: "Garis" },
  { id: "bar", label: "Batang" },
  { id: "area", label: "Area" },
];

export default function GeneralSidebar({
  dataset,
  profiles,
  dimKey,
  onDimChange,
  measureKey,
  onMeasureChange,
  sort,
  onSortChange,
  topN,
  onTopNChange,
  chartType,
  onChartTypeChange,
  onUpload,
}) {
  const numeric = profiles.filter((p) => p.numeric);

  return (
    <aside className="flex flex-col bg-gradient-to-b from-[#1B2657] to-[#141C3D] text-[#E7EBFF] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <div className="flex items-center gap-2.5 bg-[var(--accent)] px-4 py-3.5">
        <img
          src="https://media.base44.com/images/public/6ab290c11265ad626905aac0/b38dd8bff_Logo_UT-transparan.png"
          alt="Universitas Terbuka"
          className="h-7 w-auto rounded-md bg-white p-1"
        />
        <div>
          <div className="text-[12.5px] font-extrabold uppercase leading-tight tracking-[0.1em]">Data Analytics</div>
          <div className="text-[10px] font-semibold text-white/70">General Dashboard</div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="truncate text-[11.5px] font-bold text-white">{dataset.name}</div>
          <div className="mt-1 text-[10.5px] text-[#A9B8E4]">
            {dataset.rows.length} baris · {dataset.columns.length} kolom
          </div>
        </div>

        <Field icon={GitBranch} label="Dimensi (X)">
          <select value={dimKey} onChange={(e) => onDimChange(e.target.value)} className={inputClass}>
            {profiles.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
                {p.numeric ? "" : " · kategori"}
              </option>
            ))}
          </select>
        </Field>

        <Field icon={Sigma} label="Ukuran (Y)">
          <select
            value={measureKey}
            onChange={(e) => onMeasureChange(e.target.value)}
            className={inputClass}
            disabled={!numeric.length}
          >
            {numeric.length ? (
              numeric.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))
            ) : (
              <option value="">Tidak ada kolom numerik</option>
            )}
          </select>
        </Field>

        <Field icon={ListOrdered} label="Urutan Kategori">
          <select value={sort} onChange={(e) => onSortChange(e.target.value)} className={inputClass}>
            <option value="desc">Nilai terbesar</option>
            <option value="asc">Nilai terkecil</option>
            <option value="alpha">A–Z</option>
          </select>
        </Field>

        <Field icon={Layers} label="Jumlah Kategori">
          <select
            value={String(topN)}
            onChange={(e) => onTopNChange(Number(e.target.value))}
            className={inputClass}
          >
            {[5, 8, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} teratas
              </option>
            ))}
          </select>
        </Field>

        <Field icon={BarChart3} label="Jenis Grafik">
          <div className="flex gap-1 rounded-[9px] border border-white/10 bg-white/5 p-1">
            {CHART_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => onChartTypeChange(t.id)}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-bold transition ${
                  chartType === t.id ? "bg-[var(--accent)] text-white" : "text-[#C7D2F5] hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Field>

        <label className="mt-1 block cursor-pointer rounded-xl border-[1.5px] border-dashed border-white/25 bg-white/5 py-3 text-center text-xs font-bold text-[#C7D2F5] transition hover:border-[var(--accent)] hover:bg-white/10">
          Unggah CSV
          <input
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="mt-auto px-4 pb-5 pt-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 py-2 text-[11.5px] font-bold text-[#C7D2F5] transition hover:border-white/40 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Pengaturan awal
        </Link>
      </div>
    </aside>
  );
}