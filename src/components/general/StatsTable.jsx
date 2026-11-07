import React from "react";
import Panel from "@/components/dashboard/Panel";
import { PALETTE, describeValues, fmtNum } from "@/lib/general";

export default function StatsTable({ profiles }) {
  const numeric = profiles.filter((p) => p.numeric && p.values.length);
  const rows = numeric.map((p, i) => ({
    ...p,
    color: PALETTE[i % PALETTE.length],
    stats: describeValues(p.values),
  }));
  const maxStdev = Math.max(...rows.map((r) => r.stats.stdev || 0), 0);

  return (
    <Panel title="Statistik Deskriptif" sub="seluruh kolom numerik" bodyClassName="pt-3">
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[660px] border-separate border-spacing-0 text-[12px]">
            <thead>
              <tr className="text-left text-[9.5px] font-bold uppercase tracking-[0.08em]">
                <th className="rounded-l-lg bg-[var(--accent-soft)] px-3 py-2.5 text-[var(--accent-ink)]">Kolom</th>
                <th className="bg-[var(--accent-soft)] px-2 py-2.5 text-right text-[#3B6EAF]">N</th>
                <th className="bg-[var(--accent-soft)] px-2 py-2.5 text-right text-[#A85320]">Kosong</th>
                <th className="bg-[var(--accent-soft)] px-2 py-2.5 text-right text-[var(--accent-ink)]">Rata-rata</th>
                <th className="bg-[var(--accent-soft)] px-2 py-2.5 text-right text-[#5B4A9E]">Median</th>
                <th className="bg-[var(--accent-soft)] px-2 py-2.5 text-right text-[#C2255C]">Min</th>
                <th className="bg-[var(--accent-soft)] px-2 py-2.5 text-right text-[#178D65]">Maks</th>
                <th className="rounded-r-lg bg-[var(--accent-soft)] pl-2 pr-3 py-2.5 text-right text-[#0B7268]">
                  Std. dev
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.key} className={i % 2 ? "bg-[#FAFBFF]" : "bg-white"}>
                  <td className="rounded-l-lg border-b border-[#F0F3FB] py-2.5 pl-3 pr-3">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                      <span className="font-semibold text-[#17254B]">{p.label}</span>
                      {p.unit ? <span className="text-[10.5px] text-[#8B95B5]">({p.unit})</span> : null}
                    </span>
                  </td>
                  <td className="border-b border-[#F0F3FB] px-2 py-2.5 text-right">
                    <span className="rounded-full bg-[#E9F3FF] px-2 py-0.5 text-[10.5px] font-bold text-[#1C69C6]">
                      {p.stats.n}
                    </span>
                  </td>
                  <td className="border-b border-[#F0F3FB] px-2 py-2.5 text-right">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
                        p.missing > 0 ? "bg-[#FFF3EB] text-[#A85320]" : "bg-[#F1F3FB] text-[#8B95B5]"
                      }`}
                    >
                      {p.missing}
                    </span>
                  </td>
                  <td className="border-b border-[#F0F3FB] px-2 py-2.5 text-right">
                    <span className="rounded-md bg-[var(--accent-soft)] px-2 py-1 font-extrabold text-[var(--accent-ink)]">
                      {fmtNum(p.stats.mean)}
                    </span>
                  </td>
                  <td className="border-b border-[#F0F3FB] px-2 py-2.5 text-right font-semibold text-[#5B4A9E]">
                    {fmtNum(p.stats.median)}
                  </td>
                  <td className="border-b border-[#F0F3FB] px-2 py-2.5 text-right font-semibold text-[#C2255C]">
                    {fmtNum(p.stats.min)}
                  </td>
                  <td className="border-b border-[#F0F3FB] px-2 py-2.5 text-right font-semibold text-[#178D65]">
                    {fmtNum(p.stats.max)}
                  </td>
                  <td className="rounded-r-lg border-b border-[#F0F3FB] py-2.5 pl-2 pr-3">
                    <div className="flex items-center justify-end gap-2">
                      <span className="h-1.5 w-12 overflow-hidden rounded-full bg-[#EAF4F1]">
                        <span
                          className="block h-full rounded-full bg-[#0E9488]"
                          style={{ width: `${maxStdev ? Math.max(4, (p.stats.stdev / maxStdev) * 100) : 0}%` }}
                        />
                      </span>
                      <span className="w-12 text-right text-[#0B7268]">{fmtNum(p.stats.stdev)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Dataset tidak memiliki kolom numerik.</p>
      )}
    </Panel>
  );
}