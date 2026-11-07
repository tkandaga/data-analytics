import React from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";

export default function CategoryBars({ groups, topN = 8 }) {
  const rows = [...groups.rows].sort((a, b) => b.value - a.value).slice(0, topN);
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 1);
  const unit = groups.unit ? ` ${groups.unit}` : "";

  return (
    <Panel
      title="Peringkat Kategori"
      sub={`${groups.measureLabel || "Jumlah data"} per ${groups.dimLabel}`}
      bodyClassName="pt-4"
    >
      {rows.length ? (
        <ul className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <li key={r.name} className="flex items-center gap-2.5">
              <span className="w-4 shrink-0 text-center text-[11px] font-extrabold text-[#A6AFC4]">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-[#17254B]" title={r.name}>
                  {r.name}
                </span>
                <div className="mt-1.5 h-8 w-full rounded-lg bg-[#F1F3FB] p-[3px]">
                  <span
                    className="flex h-full items-center justify-end overflow-hidden whitespace-nowrap rounded-md px-2.5 text-[11.5px] font-bold text-white"
                    style={{
                      width: `${Math.max(6, (Math.abs(r.value) / max) * 100)}%`,
                      background: "var(--accent)",
                    }}
                  >
                    {fmtNum(r.value)}
                    {unit}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Tidak ada data untuk ditampilkan.</p>
      )}
    </Panel>
  );
}