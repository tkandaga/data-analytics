import React from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";

export default function TopRows({ rows, dimLabel, measureLabel, unit }) {
  return (
    <Panel title="Data Teratas" sub={`5 baris dengan ${measureLabel || "nilai"} tertinggi`} bodyClassName="pt-3">
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#8B95B5]">
                <th className="w-8 pb-2">#</th>
                <th className="pb-2">{dimLabel}</th>
                <th className="pb-2 text-right">{measureLabel}</th>
                <th className="w-16 pb-2 text-right">Porsi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.label}-${i}`} className="border-t border-[#F0F3FB]">
                  <td className="py-2.5 text-[11px] font-bold text-[#A6AFC4]">{i + 1}</td>
                  <td className="max-w-[160px] truncate py-2.5 font-semibold text-[#17254B]" title={r.label}>
                    {r.label}
                  </td>
                  <td className="py-2.5 text-right font-bold text-[#17254B]">
                    {fmtNum(r.value)}
                    {unit ? ` ${unit}` : ""}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="rounded-full bg-[#F1EFFF] px-2 py-0.5 text-[10.5px] font-bold text-[#6240C8]">
                      {Math.round(r.share * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Belum ada baris dengan nilai numerik.</p>
      )}
    </Panel>
  );
}