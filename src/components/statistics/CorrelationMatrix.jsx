import React from "react";
import { fmtNum } from "@/lib/general";
import { fmtP } from "@/lib/statistics";

function cellStyle(r) {
  if (!Number.isFinite(r)) return { background: "#F7F5FF", color: "#9CA3AF" };
  const a = Math.min(1, Math.abs(r));
  return r >= 0
    ? { background: `rgba(139, 92, 246, ${0.08 + a * 0.6})`, color: a > 0.5 ? "#FFFFFF" : "#3F2A7A" }
    : { background: `rgba(245, 158, 11, ${0.08 + a * 0.52})`, color: a > 0.55 ? "#FFFFFF" : "#7C4A03" };
}

export default function CorrelationMatrix({ cols, cells, onPick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[430px] border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="text-left text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#8B87A8]">Variabel</th>
            {cols.map((c) => (
              <th key={c.key} className="px-1 text-center text-[9.5px] font-bold text-[#4C4585]">
                {c.label.length > 10 ? `${c.label.slice(0, 9)}…` : c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cols.map((row, i) => (
            <tr key={row.key}>
              <td className="whitespace-nowrap pr-2 text-[10.5px] font-semibold text-[#4C4585]">
                {row.label.length > 20 ? `${row.label.slice(0, 19)}…` : row.label}
              </td>
              {cells[i].map((cell, j) => (
                <td key={`${row.key}-${cols[j].key}`} className="p-0">
                  <button
                    type="button"
                    onClick={() => i !== j && onPick(row.key, cols[j].key)}
                    title={
                      i === j
                        ? row.label
                        : `${row.label} × ${cols[j].label} · r = ${fmtNum(cell.r, 3)} · p = ${fmtP(cell.p)}`
                    }
                    className="h-9 w-full rounded-md text-[10.5px] font-bold transition hover:ring-1 hover:ring-[#8B5CF6]"
                    style={cellStyle(cell.r)}
                  >
                    {i === j ? "1" : Number.isFinite(cell.r) ? fmtNum(cell.r, 2) : "–"}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}