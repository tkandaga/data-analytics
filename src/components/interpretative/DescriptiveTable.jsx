import React from "react";
import Panel from "@/components/dashboard/Panel";
import { describeValues, fmtNum } from "@/lib/general";

export default function DescriptiveTable({ analysis }) {
  const rows = analysis.numeric.map((p) => ({ profile: p, stats: describeValues(p.values) }));

  return (
    <Panel title="Statistik Deskriptif" sub="ringkasan tiap variabel numerik" bodyClassName="!p-0">
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="bg-[#F5F4FF] text-[10px] font-bold uppercase tracking-[0.06em] text-[#4C4585]">
                <th className="px-4 py-2.5">Variabel</th>
                <th className="px-3 py-2.5 text-right">Rata-rata</th>
                <th className="px-3 py-2.5 text-right">Median</th>
                <th className="px-3 py-2.5 text-right">SD</th>
                <th className="px-3 py-2.5 text-right">Min</th>
                <th className="px-4 py-2.5 text-right">Maks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ profile, stats }, i) => (
                <tr key={profile.key} className={i % 2 ? "bg-[#FBFAFF]" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-[#1E1B4B]">
                    {profile.label}
                    {profile.unit ? <span className="ml-1 text-[10px] text-[#8A88A8]">({profile.unit})</span> : null}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-[#1E1B4B]">{stats ? fmtNum(stats.mean) : "–"}</td>
                  <td className="px-3 py-2.5 text-right text-[#3F3D56]">{stats ? fmtNum(stats.median) : "–"}</td>
                  <td className="px-3 py-2.5 text-right text-[#3F3D56]">{stats ? fmtNum(stats.stdev) : "–"}</td>
                  <td className="px-3 py-2.5 text-right text-[#3F3D56]">{stats ? fmtNum(stats.min) : "–"}</td>
                  <td className="px-4 py-2.5 text-right text-[#3F3D56]">{stats ? fmtNum(stats.max) : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-5 py-12 text-center text-sm text-[#7B8794]">Tidak ada kolom numerik pada dataset ini.</p>
      )}
    </Panel>
  );
}