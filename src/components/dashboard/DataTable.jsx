import React from "react";
import { Plus, Trash2 } from "lucide-react";
import Panel from "./Panel";
import { EPS } from "@/lib/modeling";

export default function DataTable({ xKey, yKey, cells, xLabel, yLabel, onCellChange, onAddRow, onDeleteRow, onClear }) {
  return (
    <Panel
      title="Data"
      sub="X, Y, prediksi, dan residual"
      right={
        <span className="text-xs text-[#7B8794]">Ubah nilai X atau Y langsung di tabel</span>
      }
    >
      <div className="overflow-auto rounded-xl border border-[#DFE4F7]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#E9E2FD] text-[10.5px] font-extrabold uppercase tracking-wider text-[#17254B]">
              <th className="w-12 px-3 py-2.5 text-left">No</th>
              <th className="px-3 py-2.5 text-left">{xLabel}</th>
              <th className="px-3 py-2.5 text-left">{yLabel}</th>
              <th className="px-3 py-2.5 text-left">Prediksi</th>
              <th className="px-3 py-2.5 text-left">Residual</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {cells.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-[#7B8794]">
                  Belum ada baris data.
                </td>
              </tr>
            )}
            {cells.map((c, i) => (
              <tr key={i} className={i % 2 ? "bg-[#F4F7FF]" : "bg-white"}>
                <td className="px-3 py-1.5 text-xs text-[#7B8794]">{i + 1}</td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    step="any"
                    value={c.x === null ? "" : c.x}
                    onChange={(e) => onCellChange(i, xKey, e.target.value)}
                    className="w-24 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[#17254B] outline-none focus:border-[var(--accent)] focus:bg-white"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    step="any"
                    value={c.y === null ? "" : c.y}
                    onChange={(e) => onCellChange(i, yKey, e.target.value)}
                    className="w-24 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[#17254B] outline-none focus:border-[var(--accent)] focus:bg-white"
                  />
                </td>
                <td className="px-3 py-1.5 tabular-nums text-[#17254B]">
                  {c.yh === null ? "–" : c.yh.toFixed(3)}
                </td>
                <td
                  className={`px-3 py-1.5 font-semibold tabular-nums ${
                    c.res === null ? "text-[#7B8794]" : Math.abs(c.res) <= EPS ? "text-[#178D65]" : "text-[#C0392B]"
                  }`}
                >
                  {c.res === null ? "–" : `${c.res >= 0 ? "+" : ""}${c.res.toFixed(3)}`}
                </td>
                <td className="px-2 py-1.5">
                  <button
                    onClick={() => onDeleteRow(i)}
                    className="rounded-md p-1 text-[#C0392B] hover:bg-[#FDECEA]"
                    title="Hapus baris"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onAddRow}
          className="flex items-center gap-1.5 rounded-lg border border-[#DFE4F7] bg-white px-3 py-2 text-xs font-bold text-[#17254B] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <Plus className="h-3.5 w-3.5" /> Baris
        </button>
        <button
          onClick={onClear}
          className="rounded-lg border border-[#DFE4F7] bg-white px-3 py-2 text-xs font-bold text-[#7B8794] transition hover:border-[#C0392B] hover:text-[#C0392B]"
        >
          Kosongkan
        </button>
      </div>
    </Panel>
  );
}