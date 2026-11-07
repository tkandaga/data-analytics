import React from "react";
import Panel from "@/components/dashboard/Panel";
import { describeValues, fmtNum } from "@/lib/general";

export default function StatsTable({ profiles }) {
  const numeric = profiles.filter((p) => p.numeric && p.values.length);

  return (
    <Panel title="Statistik Deskriptif" sub="seluruh kolom numerik" bodyClassName="pt-3">
      {numeric.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-[12px]">
            <thead>
              <tr className="text-left text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#8B95B5]">
                <th className="pb-2 pr-3">Kolom</th>
                <th className="pb-2 px-2 text-right">N</th>
                <th className="pb-2 px-2 text-right">Kosong</th>
                <th className="pb-2 px-2 text-right">Rata-rata</th>
                <th className="pb-2 px-2 text-right">Median</th>
                <th className="pb-2 px-2 text-right">Min</th>
                <th className="pb-2 px-2 text-right">Maks</th>
                <th className="pb-2 pl-2 text-right">Std. dev</th>
              </tr>
            </thead>
            <tbody>
              {numeric.map((p) => {
                const s = describeValues(p.values);
                return (
                  <tr key={p.key} className="border-t border-[#F0F3FB]">
                    <td className="py-2.5 pr-3 font-semibold text-[#17254B]">
                      {p.label}
                      {p.unit ? <span className="text-[10.5px] font-normal text-[#8B95B5]"> ({p.unit})</span> : null}
                    </td>
                    <td className="py-2.5 px-2 text-right text-[#495266]">{s.n}</td>
                    <td className="py-2.5 px-2 text-right text-[#495266]">{p.missing}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-[#17254B]">{fmtNum(s.mean)}</td>
                    <td className="py-2.5 px-2 text-right text-[#495266]">{fmtNum(s.median)}</td>
                    <td className="py-2.5 px-2 text-right text-[#495266]">{fmtNum(s.min)}</td>
                    <td className="py-2.5 px-2 text-right text-[#495266]">{fmtNum(s.max)}</td>
                    <td className="py-2.5 pl-2 text-right text-[#495266]">{fmtNum(s.stdev)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Dataset tidak memiliki kolom numerik.</p>
      )}
    </Panel>
  );
}