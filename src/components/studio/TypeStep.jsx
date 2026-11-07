import React from "react";
import { BarChart3, CheckCircle2, LineChart, Sigma } from "lucide-react";
import { DASHBOARD_TYPES } from "@/lib/studio";

const ICONS = { modeling: Sigma, general: BarChart3, interpretative: LineChart };

export default function TypeStep({ type, onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[#17254B]">Pilih jenis dashboard</h2>
      <p className="mt-1 text-sm text-[#697695]">Dashboard akan dibuat otomatis dengan tata letak default yang sesuai.</p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {DASHBOARD_TYPES.map((t) => {
          const Icon = ICONS[t.id];
          const active = t.id === type && t.ready;
          return (
            <button
              key={t.id}
              disabled={!t.ready}
              onClick={() => t.ready && onSelect(t.id)}
              className={`relative flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition ${
                active
                  ? "border-[#6430DA] bg-[#F6F2FF]"
                  : t.ready
                  ? "border-[#E4E8F6] bg-white hover:border-[#C9BFF0]"
                  : "cursor-not-allowed border-[#EDF0FA] bg-[#FAFBFF] opacity-70"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  active ? "bg-[#6430DA] text-white" : "bg-[#E9E2FD] text-[#6430DA]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold text-[#17254B]">{t.name}</span>
              <span className="text-xs leading-relaxed text-[#697695]">{t.desc}</span>
              {active ? (
                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-[#6430DA]" />
              ) : !t.ready ? (
                <span className="absolute right-3 top-3 rounded-full bg-[#EDF0FA] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[#7B8794]">
                  Segera hadir
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}