import React from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, ListChecks } from "lucide-react";

function ListCard({ title, icon: Icon, items, tone, ordered }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-[#E6E4F5] bg-white/90 p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone.icon}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-[12.5px] font-extrabold text-[#1E1B4B]">{title}</h3>
      </div>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={item} className="flex gap-2 text-[11px] leading-relaxed text-[#3F3D56]">
            <span className={`mt-0.5 shrink-0 text-[10px] font-extrabold ${tone.mark}`}>
              {ordered ? `${i + 1}.` : "✓"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ReportSummary({ analysis }) {
  const { findings, limitations, recommendations, summaryRows, unit } = analysis;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <ListCard
          title="Temuan Kunci"
          icon={CheckCircle2}
          items={findings}
          tone={{ icon: "bg-[#DCFCE7] text-[#16A34A]", mark: "text-[#16A34A]" }}
        />
        <ListCard
          title="Keterbatasan"
          icon={AlertTriangle}
          items={limitations}
          tone={{ icon: "bg-[#FEF3C7] text-[#D97706]", mark: "text-[#D97706]" }}
          ordered
        />
        <ListCard
          title="Rekomendasi"
          icon={Lightbulb}
          items={recommendations}
          tone={{ icon: "bg-[#EDE9FE] text-[#7C3AED]", mark: "text-[#7C3AED]" }}
          ordered
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#E6E4F5] bg-white/90">
        <div className="flex items-center gap-2 border-b border-[#EDEBFA] px-4 py-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E0E7FF] text-[#3B82F6]">
            <ListChecks className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-[12.5px] font-extrabold text-[#1E1B4B]">Tabel Ringkasan Hasil</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="bg-[#F5F4FF] text-[10px] font-bold uppercase tracking-[0.06em] text-[#4C4585]">
                <th className="px-4 py-2.5">Ukuran</th>
                <th className="px-4 py-2.5 text-right">Hasil</th>
                <th className="px-4 py-2.5">Interpretasi</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row, i) => (
                <tr key={row.measure} className={i % 2 ? "bg-[#FBFAFF]" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-[#1E1B4B]">{row.measure}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-[#1E1B4B]">{row.result}</td>
                  <td className="px-4 py-2.5 text-[#3F3D56]">{row.note}</td>
                </tr>
              ))}
              {!summaryRows.length ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-[#7B8794]">
                    Belum ada nilai yang dapat diringkas{unit ? ` (${unit.trim()})` : ""}.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}