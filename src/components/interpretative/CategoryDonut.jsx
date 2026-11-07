import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Panel from "@/components/dashboard/Panel";
import { PALETTE, fmtNum } from "@/lib/general";

export default function CategoryDonut({ analysis }) {
  const { distribution, otherCount, totalRows, dimLabel } = analysis;
  const data = distribution.map((r) => ({ name: r.name, value: r.count }));
  if (otherCount > 0) data.push({ name: "Lainnya", value: otherCount });
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <Panel title="Distribusi Kategori" sub={`jumlah baris per ${dimLabel}`} bodyClassName="pt-2">
      {data.length ? (
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="h-[170px] w-[170px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={46} outerRadius={74} paddingAngle={2} stroke="none">
                  {data.map((entry, i) => (
                    <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${fmtNum(value)} baris`, name]}
                  contentStyle={{ borderRadius: 10, border: "1px solid #E4E1F7", fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-full space-y-1.5">
            {data.map((item, i) => (
              <li key={item.name} className="flex items-center gap-2 text-[11px] text-[#3F3D56]">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: PALETTE[i % PALETTE.length] }}
                />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                <span className="font-bold text-[#1E1B4B]">
                  {total ? fmtNum((item.value / total) * 100, 1) : 0}%
                </span>
              </li>
            ))}
            <li className="pt-1 text-[10.5px] text-[#8A88A8]">Total {fmtNum(totalRows)} baris data</li>
          </ul>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-[#7B8794]">Tidak ada kategori untuk ditampilkan.</p>
      )}
    </Panel>
  );
}