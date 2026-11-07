import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, FlaskConical, GitBranch, Sliders } from "lucide-react";
import { MODELS } from "@/lib/modeling";
import PreferencesPanel from "./PreferencesPanel";

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

export default function DashboardSidebar({
  dataset,
  xKey,
  yKey,
  onVarChange,
  bounds,
  onBoundsChange,
  modelId,
  onModelChange,
  mode,
  onModeChange,
  onUpload,
  order,
  visible,
  onToggle,
  onReorder,
}) {
  const xUnit = dataset.columns.find((c) => c.key === xKey)?.unit || "";

  return (
    <aside className="flex flex-col bg-gradient-to-b from-[#1B2657] to-[#141C3D] text-[#E7EBFF] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <div className="flex items-center gap-2.5 bg-[var(--accent)] px-4 py-3.5">
        <img
          src="https://media.base44.com/images/public/6ab290c11265ad626905aac0/b38dd8bff_Logo_UT-transparan.png"
          alt="Universitas Terbuka"
          className="h-7 w-auto rounded-md bg-white p-1"
        />
        <span className="text-[13px] font-extrabold uppercase tracking-[0.12em]">Dashboard</span>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4">
        <Field icon={GitBranch} label="Variabel X">
          <select value={xKey} onChange={(e) => onVarChange("x", e.target.value)} className={inputClass}>
            {dataset.columns.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field icon={FlaskConical} label="Variabel Y">
          <select value={yKey} onChange={(e) => onVarChange("y", e.target.value)} className={inputClass}>
            {dataset.columns.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field icon={Clock} label="Rentang Data">
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="any"
              value={bounds.min}
              onChange={(e) => onBoundsChange({ ...bounds, min: Number(e.target.value) })}
              className={inputClass}
            />
            <span className="text-xs text-[#A9B8E4]">–</span>
            <input
              type="number"
              step="any"
              value={bounds.max}
              onChange={(e) => onBoundsChange({ ...bounds, max: Number(e.target.value) })}
              className={inputClass}
            />
            <span className="text-[11px] text-[#A9B8E4]">{xUnit}</span>
          </div>
        </Field>

        <Field icon={Sliders} label="Fungsi Matematika">
          <select value={modelId} onChange={(e) => onModelChange(e.target.value)} className={inputClass}>
            {Object.entries(MODELS).map(([key, m]) => (
              <option key={key} value={key}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>

        <Field icon={Sliders} label="Mode Parameter">
          <div className="flex gap-1 rounded-[9px] border border-white/10 bg-white/5 p-1">
            {[
              { id: "best", label: "Best Fit" },
              { id: "manual", label: "Manual" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={`flex-1 rounded-md py-1.5 text-[11.5px] font-bold transition ${
                  mode === m.id ? "bg-[var(--accent)] text-white" : "text-[#C7D2F5] hover:text-white"
                }`}
              >
                {m.label}
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

      <PreferencesPanel order={order} visible={visible} onToggle={onToggle} onReorder={onReorder} />

      <div className="mt-auto px-4 pb-5 pt-3">
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