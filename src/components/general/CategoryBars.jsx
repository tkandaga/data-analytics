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
            <li key={r.name}>
              <div className="flex items-baseline justify-between gap-3 text-[12px]">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="w-4 shrink-0 text-[10.5px] font-bold text-[#A6AFC4]">{i + 1}</span>
                  <span className="truncate font-semibold text-[#17254B]" title={r.name}>
                    {r.name}
                  </span>
                </span>
                <span className="shrink-0 font-bold text-[#17254B]">
                  {fmtNum(r.value)}
                  {unit}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#F1F3FB]">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${Math.max(3, (Math.abs(r.value) / max) * 100)}%`, background: "var(--accent)" }}
                />
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