import React from "react";
import { FileSpreadsheet, Image as ImageIcon, Printer } from "lucide-react";
import { feasibility } from "@/lib/modeling";

function MiniCard({ title, bg, children }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#DFE4F7] bg-white">
      <div className="flex h-9 shrink-0 items-center px-4 text-[10.5px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: bg }}>
        {title}
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-4">{children}</div>
    </div>
  );
}

export default function InfoCards({ date, tolPct, n, r2, onExcel, onPdf, onPng, busy }) {
  const f = feasibility(r2);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MiniCard title="Tanggal Analisis" bg="#6240C8">
        <div className="rounded-xl bg-[#ECE7FE] py-3 text-center text-xl font-extrabold text-[#17254B]">{date}</div>
      </MiniCard>

      <MiniCard title="Residual Within ε" bg="#177C58">
        <div className="rounded-xl bg-[#E7F5EE] py-3 text-center text-xl font-extrabold text-[#17254B]">
          {n ? `${tolPct.toFixed(0)}%` : "–"}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#DBE9F6]">
          <div className="h-full rounded-full bg-[#178D65]" style={{ width: `${n ? tolPct : 0}%` }} />
        </div>
      </MiniCard>

      <MiniCard title="Kelayakan Model" bg="#B76B11">
        <div className="rounded-xl bg-[#FFF2DE] py-3 text-center text-xl font-extrabold text-[#17254B]">
          <span className={f.tone}>{f.text}</span>
        </div>
      </MiniCard>

      <MiniCard title="Ekspor" bg="#17254B">
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "excel", label: "Excel", icon: FileSpreadsheet, action: onExcel },
            { id: "pdf", label: "PDF", icon: Printer, action: onPdf },
            { id: "png", label: "Gambar", icon: ImageIcon, action: onPng },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <button
                key={b.id}
                onClick={b.action}
                disabled={busy}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-[#DFE4F7] bg-white px-1 py-2.5 text-[10.5px] font-bold text-[#7B8794] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] disabled:opacity-60"
              >
                <Icon className="h-4 w-4" />
                {b.label}
              </button>
            );
          })}
        </div>
      </MiniCard>
    </div>
  );
}