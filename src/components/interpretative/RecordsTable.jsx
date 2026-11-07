import React from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";

export default function RecordsTable({ analysis }) {
  const { previewRows, dimLabel, measureLabel, secondary, unit } = analysis;

  return (
    <Panel title="Cuplikan Data" sub="5 baris pertama" bodyClassName="!p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11.5px]">
          <thead>
            <tr className="bg-[#F5F4FF] text-[10px] font-bold uppercase tracking-[0.06em] text-[#4C4585]">
              <th className="px-3.5 py-2.5">ID</th>
              <th className="px-3 py-2.5">{dimLabel}</th>
              <th className="px-3 py-2.5 text-right">{measureLabel}</th>
              {secondary ? <th className="px-3.5 py-2.5 text-right">{secondary.label}</th> : null}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, i) => (
              <tr key={row.id} className={i % 2 ? "bg-[#FBFAFF]" : "bg-white"}>
                <td className="px-3.5 py-2.5 font-mono text-[10.5px] text-[#8A88A8]">{row.id}</td>
                <td className="truncate px-3 py-2.5 font-semibold text-[#1E1B4B]">{row.label}</td>
                <td className="px-3 py-2.5 text-right font-bold text-[#1E1B4B]">
                  {row.value === null ? "–" : `${fmtNum(row.value)}${unit}`}
                </td>
                {secondary ? (
                  <td className="px-3.5 py-2.5 text-right text-[#3F3D56]">
                    {row.secondary === null ? "–" : fmtNum(row.secondary)}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}