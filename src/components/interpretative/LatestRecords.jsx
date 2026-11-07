import React from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";

export default function LatestRecords({ analysis }) {
  const { topRecords, dimLabel, measureLabel, secondary, unit } = analysis;

  return (
    <Panel title="5 Nilai Tertinggi" sub={`${measureLabel} terbesar`} bodyClassName="!p-0">
      {topRecords.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="bg-[#F5F4FF] text-[10px] font-bold uppercase tracking-[0.06em] text-[#4C4585]">
                <th className="px-3.5 py-2.5">#</th>
                <th className="px-3 py-2.5">{dimLabel}</th>
                <th className="px-3 py-2.5 text-right">{measureLabel}</th>
                {secondary ? <th className="px-3.5 py-2.5 text-right">{secondary.label}</th> : null}
              </tr>
            </thead>
            <tbody>
              {topRecords.map((row, i) => (
                <tr key={`${row.label}-${i}`} className={i % 2 ? "bg-[#FBFAFF]" : "bg-white"}>
                  <td className="px-3.5 py-2.5 font-bold text-[#A9B2C3]">{i + 1}</td>
                  <td className="truncate px-3 py-2.5 font-semibold text-[#1E1B4B]">{row.label}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-[#1E1B4B]">
                    {fmtNum(row.value)}
                    {unit}
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
      ) : (
        <p className="px-5 py-12 text-center text-sm text-[#7B8794]">Belum ada nilai numerik.</p>
      )}
    </Panel>
  );
}